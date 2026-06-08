// tools/verify-runtime.js
// ブラウザ相当の環境(jsdom)で index.html を実際に実行し、起動時に
// ReferenceError などのエラーが出ないかを確認する簡易検査。
//
// 目的: 構文チェック(node --check)では見つからない「変数の見える範囲
//       (スコープ)の誤り」や「未定義関数の呼び出し」を、実行して検出する。
//
// 使い方:
//   1) jsdom を一時導入:  npm install --no-save jsdom
//   2) 実行:              NODE_PATH=./node_modules node tools/verify-runtime.js
//   （別ファイルを検査する場合）  ... node tools/verify-runtime.js path/to/file.html
//
// 注意: fetch / matchMedia / canvas は jsdom に無いためスタブ(代用品)で
//       補っている。これらに関するエラーは「環境制約」として除外し、
//       アプリ本体由来のエラーだけを判定対象にする。

const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

const target = process.argv[2] || 'index.html';
const html = fs.readFileSync(target, 'utf8');
const errors = [];

const vc = new VirtualConsole();
vc.on('jsdomError', e => { errors.push(String((e && e.message) || e)); });

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  virtualConsole: vc,
  beforeParse(window) {
    window.fetch = () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ version: 'test' }),
      text: () => Promise.resolve('{}'),
    });
    window.matchMedia = () => ({
      matches: false, addListener() {}, removeListener() {},
      addEventListener() {}, removeEventListener() {},
    });
    const proto = window.HTMLCanvasElement && window.HTMLCanvasElement.prototype;
    if (proto) proto.getContext = () => ({
      fillRect() {}, clearRect() {}, beginPath() {}, arc() {}, fill() {},
      save() {}, restore() {}, translate() {}, rotate() {}, moveTo() {},
      lineTo() {}, stroke() {}, createLinearGradient() { return { addColorStop() {} }; },
      measureText() { return { width: 0 }; }, fillText() {}, setTransform() {}, drawImage() {},
    });
  },
});

const w = dom.window;
w.addEventListener('error', ev => { errors.push((ev.error && ev.error.stack) || ev.message); });

try { w.document.dispatchEvent(new w.Event('DOMContentLoaded', { bubbles: true })); }
catch (e) { errors.push('DOMContentLoaded: ' + e.message); }
try { w.dispatchEvent(new w.Event('load')); }
catch (e) { errors.push('load: ' + e.message); }

setTimeout(() => {
  // 環境制約(fetch/matchMedia/canvas)を除いた、アプリ由来のReferenceError
  const appRef = errors
    .filter(e => /is not defined|ReferenceError/.test(e))
    .filter(e => !/\bfetch\b|matchMedia|getContext|canvas/.test(e));
  console.log('対象: ' + target);
  console.log('総エラー件数: ' + errors.length);
  console.log('アプリ由来のReferenceError（環境制約を除く）: ' + appRef.length + ' 件');
  appRef.slice(0, 10).forEach(e => console.log('  ★ ' + e.split('\n').slice(0, 2).join(' | ')));
  console.log(appRef.length === 0 ? '判定: アプリ由来エラーなし ✓' : '判定: アプリ由来エラーあり ✗');
  process.exit(appRef.length === 0 ? 0 : 1);
}, 1000);
