# Crazy10（ITACHACHA House Crazy10）イベント機能

公式のクレイジー（自習時間を事前に決めて、みんなで一斉に取り組む特別自習室）の仕組みと、
**次回イベントの追加手順**をまとめたメモ。

---

## いちばん大事なこと

**開催日は `index.html` の `CRAZY10_EVENTS` にベタ書きされている。ここに1行足して
デプロイ（本番反映）しない限り、アプリには何も出ない。**
参加確認ポップアップ・10分マスの発光・星カウント・フィナーレ（おつかれさま画面）は、
すべてこの定義があって初めて動く。

---

## イベントの追加手順

### 1. `index.html` の `CRAZY10_EVENTS`（6318行付近）に1行足す

```js
const CRAZY10_EVENTS=[
  {dateStr:'2026-05-16',start:5,end:16,breakStart:11.5,breakEnd:12.5,finaleAt:15+55/60,isOfficial:true,series:'2026-05-crazy10'},
  {dateStr:'2026-05-17',start:5,end:16,breakStart:11.5,breakEnd:12.5,finaleAt:15+55/60,isOfficial:true,series:'2026-05-crazy10'},
  {dateStr:'2026-08-08',start:5,end:16,breakStart:11.5,breakEnd:12.5,finaleAt:15+55/60,isOfficial:true,label:'SPECIAL'},
];
```

| 項目 | 意味 |
|---|---|
| `dateStr` | 開催日。`'YYYY-MM-DD'` |
| `start` / `end` | 開始・終了時刻。**小数の時間**（`11.5` = 11時30分、`15+55/60` = 15時55分） |
| `breakStart` / `breakEnd` | 休憩の開始・終了時刻。休憩中のマスは星の対象から外れる |
| `finaleAt` | フィナーレが解禁される時刻（通常は終了5分前） |
| `isOfficial` | 公式イベントは必ず `true`（`false` は利用者ごとの My Crazy 用） |
| `label` | **任意**。付けると「DAY n」ではなくこの名前で表示される（例：`'SPECIAL'`） |
| `series` | **任意**。連続開催を1つの回としてまとめたいときだけ、各日に同じ文字列を書く |

休憩が2回以上あるときは `breaks:[{s:11.5,e:12.5},{s:14,e:14.5}]` の形も使える。

### 2. 前夜告知を出すなら `CRAZY10_PREVIEW_DATES` に前日を足す

当日決定など前夜告知が不要なら触らなくてよい。

### 3. お知らせを出す

`notice.json` を書き換える。手順と注意点は `docs/notice-feature.md` を参照。
**`id` を必ず前と違う値にすること**（同じ id だと既読の人に出ない）。

### 4. バージョンを上げる（3か所セット）

`sw.js` の `CACHE_VERSION` / `index.html` の `CURRENT_VERSION` / `version.json` の `version`。

### 5. main にマージすると自動でデプロイされる

GitHub Actions（`.github/workflows/firebase-hosting-deploy.yml`）が Firebase Hosting に反映する。

---

## 「回（series）」という考え方 ← フィナーレの要

**フィナーレ（おつかれさま画面）は「同じ `series` の日」だけを合計して表示する。**

- `series` を書かない → **その日1日だけで1つの回**。フィナーレはその日の結果だけを出す
- 連続開催（例：土日2日間）→ 両方に**同じ `series`** を書く。フィナーleは
  「DAY1・DAY2・2日間合計」をまとめて出す

### なぜこの仕組みが要るのか（2026-08-08の不具合）

もともとフィナーレは、5/16・5/17の連続2日開催を「2日間合計」で見せるために
**公式イベントを全部なめて、参加済み＆終了済みの日をぜんぶ足す**作りだった。
そこに8/8の単発イベントが加わった結果、**8/8のフィナーレに5/16・5/17まで混ざって表示**された。
これを直すために「回（series）」を導入し、集計を `_collectFinaleDayRows()` の1か所に
まとめた（同じ集計ロジックが2か所に重複していたのも解消した）。

**今後イベントを足すときは `series` の付け方だけ気をつければ、フィナーレは自動的に正しく出る。**

---

## 主な関数（`index.html`）

| 関数 | 役割 |
|---|---|
| `_getEventSeriesId(ev)` | その日が属する回のID。`series` が無ければ日付そのもの |
| `_getSeriesEvents(id)` | 同じ回の日を日付順で返す |
| `_getSeriesIndex(ev)` | 回の中での並び順（DAY番号のもと） |
| `_collectFinaleDayRows(dateStr)` | **フィナーレに出す行の唯一の出どころ**。その回のぶんだけ集める |
| `_getCrazy10SetCount(dateStr)` | その日の完了SET数（30分＝3マスで1SET） |
| `_getCrazy10MaxSetCount(ev)` | その日の最大SET数（実質学習時間 × 2） |
| `_isCrazy10Joined(dateStr)` | その日に参加していか（端末ごとの設定） |
| `_isCrazy10FinaleAvailable(ds)` | フィナーレが解禁済みか（過去日は常に解禁） |
| `showCrazy10Finale(dateStr)` | フィナーレを表示する |
| `_renderOfficialEventList()` | 設定パネルの公式イベント一覧を描画 |

---

## 変更時の落とし穴

- **参加確認ポップアップの時間の文言はベタ書き**（`_showCrazy10PopupIfNeeded()` 内、
  「朝5時〜16時、10時間の特別自習室」）。**5:00〜16:00以外の回を追加するときは
  この文言も必ず直すこと**（コード内にもコメントを入れてある）。
- 集計を新しく書き足したくなったら、まず `_collectFinaleDayRows()` を使えないか考える。
  同じ集計を2か所に書くと、今回のような「片方だけ直して直ったつもり」になる（教訓#005）。
- 早朝自習室（asajuku）のタブは、Crazy10開催日には自動で隠れる（`index.html` 3419行付近）。

---

## 検証方法

- 起動時エラー：`npm install --no-save jsdom` →
  `NODE_PATH=./node_modules node tools/verify-runtime.js`（「アプリ由来エラーなし ✓」）
- 実画面：ローカルに静的サーバーを立て、`/opt/pw-browsers` の Chromium で開く。
  `Date` を差し替えて開催日の時刻に固定すると、当日の挙動（参加ポップアップ・マスの発光・
  フィナーレ）を実際に目視確認できる。**表示系は必ず表示させて確認すること**（教訓#005）。
