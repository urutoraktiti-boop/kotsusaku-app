// 「みんなの軌跡」の総学習時間が減らないことを、実際に集計を動かして確かめる。
//
//   node tools/verify-study-total.js
//
// Firestoreにはつながない。偽のFirestoreを差し込んで functions/index.js の集計を6回まわし、
// 「端末が0を送ってきた」「記録ごと消えた」「古い数字を再送した」のどれでも
// 画面に出る合計が減らないことを確認する。（部品のインストールは不要）
const path = require('path');
const Module = require('module');

// ── 偽のFirestore ──────────────────────────────────
const store = { analytics: {}, docs: {}, added: {} };

function snapOf(map) {
  const docs = Object.entries(map).map(([id, data]) => ({ id, data: () => data }));
  return { size: docs.length, docs, empty: docs.length === 0, forEach: (f) => docs.forEach(f) };
}
function docRef(p) {
  return {
    get: async () => ({
      exists: Object.prototype.hasOwnProperty.call(store.docs, p),
      data: () => store.docs[p],
    }),
    set: async (value, opt) => {
      store.docs[p] = (opt && opt.merge) ? Object.assign({}, store.docs[p], value) : value;
    },
  };
}
const fakeDb = {
  collection: (name) => ({
    get: async () => snapOf(name === 'analytics' ? store.analytics : {}),
    doc: (id) => docRef(name + '/' + id),
    add: async (value) => { (store.added[name] = store.added[name] || []).push(value); },
    where: () => ({ get: async () => snapOf({}) }),
  }),
  doc: (p) => docRef(p),
  batch: () => ({ delete: () => {}, commit: async () => {} }),
};

// ── firebase の部品を偽物に差し替える ────────────────────
const stubs = {
  'firebase-functions/v2/scheduler': { onSchedule: (opts, fn) => fn },
  'firebase-functions/v2/https': { onRequest: (opts, fn) => fn },
  'firebase-admin/app': { initializeApp: () => ({}) },
  'firebase-admin/firestore': {
    getFirestore: () => fakeDb,
    FieldValue: { serverTimestamp: () => '__serverTimestamp__' },
  },
};
const origLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (Object.prototype.hasOwnProperty.call(stubs, request)) return stubs[request];
  return origLoad.apply(this, arguments);
};

const functions = require(path.join(__dirname, '..', 'functions', 'index.js'));
const runHourlyAggregate = functions.snapshotTaskTrend; // 1時間ごとの集計（中で集計本体を呼ぶ）

// ── 確認 ────────────────────────────────────────
const shown = () => store.docs['analytics_summary/summary'].totalStudyMin;
const raw = () => store.docs['analytics_summary/summary'].totalStudyMinRaw;
const dropLogs = () => store.added['analytics_diagnostics_log'] || [];

let ng = 0;
function check(label, ok, extra) {
  console.log(`  ${ok ? 'OK  ' : 'NG  '} ${label}${extra ? '  ' + extra : ''}`);
  if (!ok) ng += 1;
}

// 集計そのものが出すログは邪魔なので、その間だけ黙らせる（確認結果だけを見せる）
async function runQuietly() {
  const saved = ['log', 'warn', 'error'].map((k) => [k, console[k]]);
  saved.forEach(([k]) => { console[k] = () => {}; });
  try {
    await runHourlyAggregate();
  } finally {
    saved.forEach(([k, fn]) => { console[k] = fn; });
  }
}

async function main() {
  const step = async (label, devices) => {
    store.analytics = devices;
    await runQuietly();
    console.log(`${label}: 画面に出る合計=${shown()} / 生の合計=${raw()}`);
  };

  await step('1回目 ふつうに申告', { A: { totalStudyMin: 1000 }, B: { totalStudyMin: 50000 } });
  check('合計は 51000', shown() === 51000);

  await step('2回目 Bが0を送ってきた（全データのクリア）', { A: { totalStudyMin: 1000 }, B: { totalStudyMin: 0 } });
  check('画面の合計は減らない（51000）', shown() === 51000);
  check('生の合計は下がっている（1000）', raw() === 1000);
  check('減った端末として記録が残る', dropLogs().length === 1);

  await step('3回目 Bの記録ごと消えた', { A: { totalStudyMin: 1000 } });
  check('画面の合計は減らない（51000）', shown() === 51000);
  check('消えた端末として数えている', store.docs['analytics_diagnostics/studyTotal'].ghostDeviceCount === 1);

  await step('4回目 Bが戻ってきて、AもBも増えた', { A: { totalStudyMin: 1200 }, B: { totalStudyMin: 50300 } });
  check('増えた分はすぐ反映される（51500）', shown() === 51500);

  await step('5回目 Bが古い数字を再送（保留分の送り直し）', { A: { totalStudyMin: 1200 }, B: { totalStudyMin: 49000 } });
  check('画面の合計は最高値のまま（51500）', shown() === 51500);

  await step('6回目 新しい端末Cが登場', { A: { totalStudyMin: 1200 }, B: { totalStudyMin: 50300 }, C: { totalStudyMin: 700 } });
  check('新しい端末ぶんは足される（52200）', shown() === 52200);

  console.log(ng === 0 ? '\n総学習時間は減らない ✓' : `\n問題あり ✗ ${ng}件`);
  process.exit(ng === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
