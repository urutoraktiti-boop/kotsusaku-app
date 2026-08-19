# Crazy10 / Crazy11（ITACHACHA House Crazy）イベント機能

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
  {dateStr:'2026-08-13',start:5,end:16,breakStart:11.5,breakEnd:12.5,finaleAt:15+55/60,isOfficial:true,label:'SPECIAL'},
  // 2日連続開催（2DAYS）は、両日に同じ series を書く
  // 5:00〜17:00・休憩1時間＝実質11時間 → 呼び名は自動で「Crazy11」になる
  {dateStr:'2026-08-21',start:5,end:17,breakStart:12,breakEnd:13,finaleAt:16+55/60,isOfficial:true,series:'2026-08-crazy11-2days'},
  {dateStr:'2026-08-22',start:5,end:17,breakStart:12,breakEnd:13,finaleAt:16+55/60,isOfficial:true,series:'2026-08-crazy11-2days'},
];
```

`label:'SPECIAL'` の単発回が複数あっても問題ない。`series` を書かなければ**日付ごとに別々の回**として
扱われるので、フィナーレの集計が混ざることはない（設定パネルの一覧では日付が併記される）。

| 項目 | 意味 |
|---|---|
| `dateStr` | 開催日。`'YYYY-MM-DD'` |
| `start` / `end` | 開始・終了時刻。**小数の時間**（`11.5` = 11時30分、`15+55/60` = 15時55分） |
| `breakStart` / `breakEnd` | 休憩の開始・終了時刻。休憩中のマスは星の対象から外れる |
| `finaleAt` | フィナーレが解禁される時刻（通常は終了5分前） |
| `isOfficial` | 公式イベントは必ず `true`（`false` は利用者ごとの My Crazy 用） |
| `label` | **任意**。付けると「DAY n」ではなくこの名前で表示される（例：`'SPECIAL'`） |
| `series` | **任意**。連続開催を1つの回としてまとめたいときだけ、各日に同じ文字列を書く |
| `shortName` / `fullName` | **任意**。呼び名を自動判定に任せず、手で決めたいときだけ書く（下記） |

休憩が2回以上あるときは `breaks:[{s:11.5,e:12.5},{s:14,e:14.5}]` の形も使える。

### 2. 前夜告知を出すなら `CRAZY10_PREVIEW_DATES` に前日を足す

```js
const CRAZY10_PREVIEW_DATES=['2026-05-15','2026-05-16','2026-08-12','2026-08-20','2026-08-21'];
// '2026-08-12' は 8/13 開催の前夜／'2026-08-20'・'2026-08-21' は 8/21・8/22（2日連続）それぞれの前夜
```

**書くのは「開催日」ではなく「その前日」**。その日の18時以降にアプリを開くと、
「🥦 明日、朝5時から！…」というトースト（画面に一瞬出るミニ通知）が1回だけ出る。
※文言の中の開始時刻・呼び名・実質時間は**イベント定義から自動で組み立てる**ので、
開催時間が変わってもここを直す必要はない（`_showCrazy10PreviewToastIfNeeded()` 内）。

当日決定など前夜告知が不要なら触らなくてよい。

なお**前日の「参加予約」ポップアップは `CRAZY10_PREVIEW_DATES` とは無関係**に、
イベントを1行足しただけで自動的に出る（下記参照）。

**2日連続開催（2DAYS）のときは「初日の前日」と「初日」の両方を書く**（＝各日の前夜がそろう）。
ただし2日目の前夜は初日そのものなので、その日は前夜告知トーストだけが出て、
参加予約ポップアップは出ない（`_getCrazy10EventNow()` があると予約側は何もしない）。
**2日目の参加確認は当日の朝4時以降のポップアップで行われる**ので、これで抜けはない。

### 3. お知らせを出す

`notice.json` を書き換える。手順と注意点は `docs/notice-feature.md` を参照。
**`id` を必ず前と違う値にすること**（同じ id だと既読の人に出ない）。

### 4. バージョンを上げる（3か所セット）

`sw.js` の `CACHE_VERSION` / `index.html` の `CURRENT_VERSION` / `version.json` の `version`。

### 5. main にマージすると自動でデプロイされる

GitHub Actions（`.github/workflows/firebase-hosting-deploy.yml`）が Firebase Hosting に反映する。

---

## 呼び名（Crazy10 / Crazy11）は自動で決まる

**イベントの呼び名は「休憩を除いた実質の学習時間」から自動で作られる。**
10時間なら `Crazy10`、11時間なら `Crazy11`。名前をどこかに書き足す必要はない。

```
実質時間 = (end - start) - 休憩の合計
```

| 回 | 時間 | 実質 | 自動で付く呼び名 |
|---|---|---|---|
| 5/16・5/17・8/8・8/13 | 5:00〜16:00（休憩1h） | 10時間 | ITACHACHA House Crazy10 |
| 8/21・8/22 | 5:00〜17:00（休憩1h） | 11時間 | ITACHACHA House Crazy11 |

過去の回はそのまま `Crazy10` と表示され続けるので、**新しい回の名前が過去の回に
さかのぼって書き換わることはない**（フィナーレを見返しても当時の名前のまま）。

### 呼び名・時間の文言はここだけで作る

| 関数 | 返すもの |
|---|---|
| `_getEventStudyHours(ev)` | 実質の学習時間（数値。11 など） |
| `_getEventStudyHoursText(ev)` | `'11時間'` |
| `_getEventShortName(ev)` | `'Crazy11'` |
| `_getEventFullName(ev)` | `'ITACHACHA House Crazy11'` |
| `_getEventTimeText(ev)` | `'05:00〜17:00（休憩 12:00〜13:00）'` |
| `_hToJpTimeStr(h)` | `'5時'` / `'5時30分'` |

**画面に出す呼び名・時間は、必ずこの関数から作ること。ベタ書きしない。**
以前は当日ポップアップと前夜告知トーストに「朝5時〜16時、10時間」がベタ書きされていて、
開催時間を変えるたびに直し忘れる危険があった（2026-08-19に全部この関数に置き換え済み）。

`Crazy9.5` のような半端な名前になるのが困る回は、イベント定義に
`shortName:'Crazy10'` や `fullName:'ITACHACHA House 特別編'` を書けば、そちらが優先される。

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

## 参加を決める入り口は3つある

| いつ | どこ | 何が起きる |
|---|---|---|
| **前日** | 参加予約ポップアップ（`_showCrazy10PrejoinPopupIfNeeded`） | 「明日、参加しますか？」→「参加する」で当日を待たずに参加ON |
| **当日 4:00〜終了** | 参加確認ポップアップ（`_showCrazy10PopupIfNeeded`） | 「参加」で参加ON、マスが光りだす |
| **いつでも** | 設定（⚙）→「🎯 Crazy設定」→「📢 公式イベント」 | 日付ごとのトグルでON/OFF |

3つとも書き込み先は同じ `CUST.crazy10Joined[dateStr]` なので、どれで参加しても
他の画面に即座に反映される（ポップアップ側は `_syncCrazy10SettingsSec()` を呼んでいる）。

### なぜ前日の参加予約が要るのか（2026-08-12の取り違え）

8/13の開催を `notice.json` のお知らせで告知したところ、それを読んだ利用者が
**直後に出た早朝自習室（5〜7時・別機能）の「参加」を押してしまい**、
「参加したのに設定が不参加のまま」という混乱が起きた。
当時、当日ポップアップは開催日の朝4時以降にしか出ず、**告知を読んだその場で
参加を決める手段が設定画面の手動トグルしか無かった**ことが原因。

そこで前日に出る Crazy10 専用の参加予約ポップアップを追加した。
**単発イベントを急きょ足すときほど「告知を読んだ人がその場で参加を押せるか」を確認すること。**

### 実装メモ

- 「明日」の判定基準は暦の日付ではなく**学習日（`toStudyDateStr`）**。
  深夜0〜4時はまだ前日扱いなので、8/13の午前2時でも「明日＝8/13」として予約できる。
- 当日ポップアップと同じ `crazy10-overlay` を使い回すが、
  `_getCrazy10EventNow()` があれば予約側は何もしないので二重には出ない。
- **「あとで決める」は参加/不参加を記録しない**。記録すると `_hasCrazy10JoinChoice()` が
  true になり、当日ポップアップが出なくなってしまう。
- 時間の文言はイベント定義から組み立てている（`_hToTimeStr` 等）ので、
  5:00〜17:00以外の回を足しても**このポップアップは直さなくてよい**。
  当日ポップアップ・前夜告知トーストも2026-08-19に同じ作りへそろえた。

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
| `_getCrazy10TomorrowEvent()` | 学習日基準で「明日」の公式イベントを返す |
| `_showCrazy10PrejoinPopupIfNeeded()` | 前日の参加予約ポップアップを出す |
| `_isCrazy10FinaleAvailable(ds)` | フィナーレが解禁済みか（過去日は常に解禁） |
| `showCrazy10Finale(dateStr)` | フィナーレを表示する |
| `_renderOfficialEventList()` | 設定パネルの公式イベント一覧を描画 |
| `_getEventShortName(ev)` / `_getEventFullName(ev)` | **呼び名（Crazy10 / Crazy11）の唯一の出どころ** |
| `_getEventStudyHours(ev)` / `_getEventStudyHoursText(ev)` | 実質の学習時間（数値 / 「11時間」） |

---

## 変更時の落とし穴

- **呼び名・時間の文言を新しく書き足すときは、必ず `_getEventShortName()` /
  `_getEventStudyHoursText()` などから作る**。ベタ書きすると、開催時間を変えた回で
  古い文言が残る（実際に「朝5時〜16時、10時間」が3か所にベタ書きされていた）。
- **フィナーレの見出しは固定HTMLに書かない**。`crazy10-finale-title` /
  `crazy10-finale-badge-title` は空にしてあり、`showCrazy10Finale()` が唯一の出どころ（教訓#005）。
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
