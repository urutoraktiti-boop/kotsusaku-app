# お知らせ機能（notice）実装ドキュメント

他のエージェント／開発者向けの仕様メモ。ユーザー（非エンジニア）に全員へ確実に
「お知らせ（更新情報など）」を表示するための仕組み。

---

## なぜ作ったか（背景）

従来の更新案内ポップアップ（`update-banner` / `UPDATE_COPY`）は、
**「今その端末で動いている＝古い版」自身がバナーを描画し、文面もその古い版の
`UPDATE_COPY` を表示する**設計だった。さらに本体HTMLはネット優先取得のため、
多くの利用者はバナーなしで静かに最新版へ入れ替わる。
→ 結果として「新しいお知らせを全員に確実に見せる」用途には向かない。
（経緯と失敗の詳細は `CLAUDE-lessons.md` #005 を参照）

そこで、**ネットから毎回取得する `notice.json` を唯一の出どころ**とする
独立したお知らせ機能を追加した。

---

## 関係ファイル

| ファイル | 役割 |
|---|---|
| `notice.json`（リポジトリ直下） | **お知らせの中身（唯一の出どころ）**。id / title / body / notes を持つ |
| `index.html` | 空のお知らせモーダル（`#notice-overlay` 一式）＋ `notice.json` を取得して表示するスクリプト |
| `sw.js` | `notice.json` を `version.json` と同様に**ネットワーク優先**で取得（古いお知らせが残らないように） |

### notice.json の形

```json
{
  "id": "v110-datafix",
  "title": "タイトル（端末に出る見出し）",
  "body": "ひとこと説明",
  "notes": ["✅ 変更点1", "✅ 変更点2", "🦍 自由文"]
}
```

- `id`：このお知らせの識別子。**新しいお知らせを出すときは必ず別の値に変える**。
  一度「OK」した利用者には、同じidのお知らせは二度と出ない（localStorageで管理）。
- `notes`：配列。各要素が箇条書き1行になる（`<li>` に `textContent` で挿入）。

---

## 仕組み（index.html 側）

- モーダルHTMLは `#notice-overlay`（`#notice-title` / `#notice-body` /
  `#notice-notes` / `#notice-close-btn`）。**中身は空**で、文章は実行時に
  `notice.json` からのみ差し込む（＝同じ文字列を複数箇所に置かない。教訓#005対策）。
- 起動後 `setTimeout(checkNotice, 1500)` → `fetch('./notice.json?_=' + Date.now(),
  { cache:'no-store' })` で**毎回ネットから最新を取得**。
- 既読管理：`localStorage` キー `kotsusaku-notice-seen-id` に最後に閉じた `id` を保存。
  取得した `id` がそれと同じなら表示しない。
- 閉じる：`#notice-close-btn`、または背景クリックで閉じ、その時点の `id` を既読保存。
- 重なり順：`#notice-overlay` は `z-index:24000`。`install-banner`(23000) など他の
  オーバーレイより前面にして、OKボタンが必ず押せるようにしてある（下げないこと）。
- 文章は `textContent` で挿入（HTMLインジェクション回避）。`notes` も `<li>` の
  `textContent`。

## 仕組み（sw.js 側）

`fetch` ハンドラで `version.json` と `notice.json` を**ネットワーク優先（no-store、
失敗時のみキャッシュ）**に分岐させている。これで古いお知らせがキャッシュに居座らない。

---

## 全員に届く理由

本体HTML（index.html）はネット優先で取得されるため、古い版の利用者も
**次回オンライン起動時に本機能入りのHTMLを受け取り**、`notice.json` の
最新お知らせが表示される。
（注：本機能を含まない版しか持っていない利用者には、その版を取得するまでは出ない。
本体HTMLがネット優先なので、通常は次回オンライン起動で取得される。）

---

## 新しいお知らせの出し方（運用手順）

1. `notice.json` を編集する。
   - `id` を**前と違う値**にする（例：`2026-07-summer`）。← これを忘れると、
     すでに見た人には表示されない。
   - `title` / `body` / `notes` を書き換える。
2. main にマージする → GitHub Actions（`.github/workflows/firebase-hosting-deploy.yml`）
   が自動で Firebase Hosting にデプロイ。
3. 利用者が次にオンラインで開くと、新しいお知らせが1回だけ表示される。

「一時的にお知らせを止めたい」場合は、`id` を既読済みの値に戻すか、
`title`/`body`/`notes` を空にする運用でよい（空配列なら notes は非表示になる）。

---

## 文章の長さの決まり（必ず守る）

長い文章は、画面の縦が短い携帯で**OKボタンに届かなくなる**（実際に起きた。`CLAUDE-lessons.md` #007）。
箱の側はスクロールできるよう直してあるが、**スクロールせずに読み切れる長さで書くこと**が原則。

| 項目 | 上限 |
|---|---|
| `title` | 25文字（1行で言い切る） |
| `body` | 90文字（2〜3文） |
| `notes` | 4項目・1項目30文字 |
| 合計 | 250文字 |

書くときは「読まないと困ることだけ書く」。設定画面の場所の案内を毎回入れない、
1項目に2つのことを詰めない、キャラの味付けは `body` に1文だけ。

### 文字数の数え方

```bash
cd /該当フォルダのパス
python3 -c "
import json; d=json.load(open('notice.json'))
print('title',len(d['title']),'/ body',len(d['body']),'/ notes',len(d['notes']),'項目')
for n in d['notes']: print(' ',len(n),n)
print('合計',len(d['title'])+len(d['body'])+sum(len(n) for n in d['notes']))"
```

### 実際の長さの目安

2026-08-13のCrazy10告知は、はじめ合計546文字（notes 7項目）で書いてしまい、
360×640の画面で箱の高さが850pxになり**OKボタンが画面外**に出た。
205文字（notes 4項目）に削って、最小級の320×568でも収まるようにした。

---

## 変更時の注意（落とし穴）

- **文章は `notice.json` だけが出どころ**。`index.html` のモーダルHTMLに文章を
  直書きしないこと（直書きしても実行時に上書きされ、二重管理＝バグの元）。
- **`id` を必ず更新する**。同じidは「既読の人には出ない」。
- **`z-index:24000` を下げない**。下げると他のバナーに隠れてOABが押せなくなる。
- `notice.json` は hosting で配信される（firebase.json の ignore 対象外）。
  ファイル名・場所を変えるなら index.html / sw.js の参照も合わせる。

---

## 検証方法

- 構文・起動：`npm install --no-save jsdom` →
  `NODE_PATH=./node_modules node tools/verify-runtime.js`（「アプリ由来エラーなし ✓」）。
- 実ブラウザ確認（推奨）：ローカルに静的サーバーを立て、Chromium で index.html を開き、
  `#notice-overlay` が表示され、`#notice-title` が `notice.json` の値と一致し、
  「OK」で閉じて再読込で再表示されないこと、を確認する。
  （本リポジトリでは playwright-core + `/opt/pw-browsers` の Chromium で実施した実績あり）
- 表示系の修正は必ず**実際に表示させて目視確認**してから完了とする（教訓#005）。
