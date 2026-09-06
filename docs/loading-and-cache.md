# 読み込みと保管の仕組み（起動を軽くするための決まりごと）

アプリが「起動のたびに何をどこから取ってくるか」をまとめたもの。
起動が重い・古い画面が残る・オフラインで動かない、といった相談の前にここを読むこと。
（2026-09-06 に整理。それまでの経緯は下の「以前の状態」参照）

---

## 全体像

| もの | 取り方 | 理由 |
|---|---|---|
| 画面本体 `index.html` | **必ずサーバーに「変わった？」と聞く**（`cache:'no-cache'`）。変わっていなければ中身は再送されない（304） | 更新を次回起動で必ず反映しつつ、毎回700KB（圧縮後190KB）を取り直さない |
| `version.json` / `notice.json` | 毎回ネットから取る（`no-store`） | 小さいファイル。お知らせと版の判定は常に最新であること |
| `kotsusaku.css`（本体の見た目）/ `kotsu-tasks.css` / `kotsu-tasks.js` / `bloom-countdown.js` | 配達係（Service Worker）が**インストール時に先読み**。URLの `?v=` が変わると取り直す | 起動直後に必要 |
| アイコン・manifest | 同上 | ホーム画面追加に必要 |
| 画像（スピリット・ストーリー・ポスター） | **表示したときに保管**（`RUNTIME_CACHE_RE`）。2回目からは通信なし | 初回起動で1MB超をまとめて取りに行かないため |
| 動画（`bloom-day.mp4/webm`） | 保管しない | 大きい。開花日の当日だけ使う |
| Firebase（同期・アナリティクス） | **画面ができたあとに非同期で読み込む**（`loadFirebase()`） | 読み込み中に画面の組み立てを止めないため |

---

## 配達係（`sw.js`）の決まり

- 版を上げるときは **4か所**をそろえる：`sw.js` の `CACHE_VERSION`、`index.html` の `CURRENT_VERSION`、
  `version.json`、そして `index.html` の `?v=`（`kotsusaku.css` / `kotsu-tasks.css` / `kotsu-tasks.js` の3行）と `sw.js` の `CACHE_FILES` の同じ3行。
  `?v=` がずれると、先読みした分が使われず毎回ネットから取りに行く（v120で実際にずれていた）。
- `CACHE_FILES` に入れるのは「開いた瞬間に必要なもの」だけ。**画像は入れない**（表示時に保管される）。
  1つでも404になるとインストール自体が失敗するので、増やすときは必ず存在確認する。
- 「何が新しいか」の案内は `notice.json` だけの仕事（`CLAUDE-lessons.md` #008）。
- 画面本体の取得を `no-store` に戻さないこと。`no-cache` でも鮮度は同じで、通信量だけが減る。

---

## Firebase の非同期読み込み（`index.html` の「Firebase 初期化」）

- 読み込み順：`firebase-app-compat` →（`firestore-compat` と `analytics-compat` を並行）→ `_initFirebase()`。
- CDN が読めない（オフライン）ときも `_initFirebase()` は必ず呼ばれ、`db` は `null` のまま。
  Firebase を使う処理は全部 `if(!db)return` で守られているので、今まで通りオフラインで動く。
- 準備前に呼ばれた `trackEvent()` は `_pendingEvents` に貯めて、準備後にまとめて送る（起動直後の `app_open` など）。
- 起動時のクラウド同期は `_fbReady` を最長8秒待つ。待ちきれず先に進んだ場合は `_fbLateStartup` が立ち、
  準備できた時点で `_initFirebase()` が `syncFromCloudIfNeeded()` を呼んで追いつく。
- **Firebase を同期の `<script src>` に戻さないこと。** 戻すと画面の組み立てが数百KBの読み込み待ちになる。

---

## 本体CSSの置き場所（`kotsusaku.css`）

`index.html` の `<head>` にあった 1行52KB の `<style>` 3ブロックを、2026-09-06 に `kotsusaku.css` へ出した
（1ルール1行に整えただけで中身は同じ。前後のスクリーンショット比較で画面が一致することを確認済み）。
- 読み込み位置は元と同じ `<title>` の直後。`<style id="subject-colors">` と `kotsu-tasks.css` より**前**に置くこと
  （順番を変えるとスタイルの優先順位が変わる）。
- `index.html` 末尾の `<style>`（ニヤニヤ演出・休憩タイマーのアニメ）は `kotsu-tasks.css` より後ろで効かせる必要があるので、
  そのまま本体に残してある。
- 見た目を直すときは `kotsusaku.css` を直す。`grep` で探すときも本体HTMLではなくこのファイルを見る。

## 集計関数は1か所（アナリティクスも本体の関数を使う）

累計時間・学習日数・連続日数の計算は `index.html` 本体の `allTimeTotal()` / `allTimeDays()` / `currentStreak()` / `dayTotal()` が唯一の出どころ。
アナリティクス送信用の IIFE（`getTotalStudyMin` など）は 2026-09-06 からこれらを呼ぶだけになった（以前は同じ計算をもう一度書いていた）。
ただし画面上部の**保険用 IIFE**（`window.__kotsusakuEnsureGrid` / `__kotsusakuEnsureAllTimeCard` など。本体の描画が失敗したときだけ動く）は、
本体が壊れていても動く必要があるため**わざと独立させてある**。こちらは統一しないこと。

---

## 30秒ごとの確認（`window._every30s`）

日付が変わったか・朝塾やCrazyの表示時間帯に入ったか、の確認は**1本のタイマー**で回している。
- 登録：`window._every30s.push(関数)`（`index.html` の `checkStudyDateChanged` の近くで作っている）
- 画面が隠れている間（`document.hidden`）は動かない。復帰したときは `focus` / `visibilitychange` 側がすぐ確認する。
- 新しく「30秒ごとに確認したいこと」ができたら、`setInterval` を増やさずここに登録する。

---

## 以前の状態（なぜ直したか）

| 以前 | 問題 |
|---|---|
| 画面本体を `no-store` で取得 | 起動のたびに圧縮後190KBを丸ごと再取得 |
| Firebase 3本を本体の途中で同期読み込み | 読み終わるまで画面が組み立てられない |
| 画像17枚（PNG 1.9MB）をインストール時に全部先読み | 初回起動が重い。WebP化（0.3MB）＋表示時保管に変更 |
| `?v=` と `CACHE_FILES` の不一致 | 先読みした JS/CSS が使われていなかった |
| 30秒タイマーが3本、称号テキストの非表示要素を毎回描画 | 無駄な処理（小） |
| 本体CSSが1行52KBで `index.html` の中 | 探しにくい・差分が見づらい（`kotsusaku.css` に外部化） |
| アナリティクス用の集計が本体と二重 | 片方だけ直すと数字が食い違う（本体の関数を呼ぶ形に統一） |

---

## 動作確認の手順

```bash
cd /該当フォルダのパス
npm install --no-save jsdom
NODE_PATH=./node_modules node tools/verify-runtime.js   # 「アプリ由来エラーなし ✓」
```

ブラウザ再現で見るもの（playwright-core ＋ `/opt/pw-browsers/chromium-1194`）：
1. Firebase の CDN を**止めた状態**で開いてもエラーが出ず、`db` が `null` で動く
2. CDN を遅らせても `DOMContentLoaded` が待たされない。`app_open` イベントが準備後に送られる
3. 配達係の保管が「先読み9件」で始まり、画像を表示すると1件ずつ増える
4. `CACHE_FILES` の全URLが404にならない
