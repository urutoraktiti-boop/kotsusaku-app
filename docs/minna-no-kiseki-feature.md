# みんなの軌跡（設定画面の全体統計）

設定画面の一番下に出る「🌸 みんなの軌跡 🌸」の仕組みと、数字が正しいかを確かめる手順。

## 何を表示しているか

| カード | 表示 | 出どころ |
|---|---|---|
| ⏱ 総学習時間 | `analytics_summary/summary` の `totalStudyMin` ÷ 60（時間） | 全ユーザーの累計学習時間の合計（端末ごとの過去最高値で守ってあり、減らない） |
| ✅ コツ習得 | `analytics_summary/summary` の `completedTasks` | 全ユーザーの完了コツ数の合計 |
| 24h推移 | `analytics_task_trend` の直近24時間分 | 1時間ごとのスナップショット |
| 最終更新 | `summary.updatedAt`（なければ `aggregatedAtIso`） | サーバーが集計した時刻 |

**注意**：`summary.aggregatedAt` と `summary.trigger` は昔の仕組みが書いた項目で、
現在のコードは誰も更新していない。**「最終更新」に使ってはいけない**。

## データの流れ（3段階）

```
各ユーザーの端末              サーバー（Cloud Functions）        設定画面
─────────────────            ──────────────────────────        ─────────
localStorage
 kskotsu_tasks     ──①──▶  analytics/{userId}
 study-data                      │
                                 └──②──▶ analytics_summary/summary ──③──▶ みんなの軌跡
                                          analytics_task_trend
```

- ① 端末 → 自分の `analytics/{userId}` … **最大1時間に1回**（`ANALYTICS_UPLOAD_INTERVAL_MS`）
- ② 全ユーザー分を集計 → `analytics_summary/summary` … **1時間ごと**（`snapshotTaskTrend`）
- ③ 設定画面が読む … 数字は**毎回**読み直し、24h推移グラフのみ最大1時間キャッシュ

自分が完了したコツが全体の数字に出るまで、**最大2時間**かかる（①＋②）。これは仕様。

## 読み取り回数（Firestoreの料金に直結）

設定画面を1回開くごとの読み取り件数：

| 状況 | 読み取り |
|---|---|
| サーバーの集計が前回と同じ | **1件**（集計ドキュメントのみ） |
| サーバーが新しく集計した直後 | **25件**（集計1 + 推移24） |

24h推移グラフは「集計の時刻（`updatedAt`）が前回と変わったときだけ」読み直す。
サーバー集計は1時間ごとなので、**推移グラフの読み直しは1時間に1回が上限**。
何度開いても増えるのは1件ずつだけ。

無料枠は1日50,000読み取り。この設計なら、利用者150人が1日10回ずつ設定画面を開いても
おおよそ5,000読み取り程度で収まる。

## 「数字が更新されていない」と思ったときの確認手順

**コツ習得はゆっくりしか動かない**（コツ習慣の利用者が約80人なので、1時間に0〜2件）。
数時間まったく同じ数字のままでも正常。総学習時間は全員が対象なので毎時間動く。
「片方だけ止まって見える」のは、壊れているのではなく**動く速さが違うだけ**のことが多い。

実データで確かめるコマンド（ブラウザ不要・読み取り課金なしのREST）：

```bash
cd /該当フォルダのパス
KEY=$(grep -o 'apiKey: "[^"]*"' index.html | head -1 | cut -d'"' -f2)
BASE="https://firestore.googleapis.com/v1/projects/kotsusaku-app/databases/(default)/documents"

# 1) 集計値が最新か（updatedAt を見る）
curl -s "$BASE/analytics_summary/summary?key=$KEY" | python3 -c "
import json,sys; f=json.load(sys.stdin)['fields']
for k in ('totalStudyMin','completedTasks','totalTasks','taskUsers','updatedAt'):
    print(k,'=',list(f[k].values())[0])"

# 2) 24時間の推移（本当に動いていないのか）
curl -s "$BASE/analytics_task_trend?key=$KEY&pageSize=300" | python3 -c "
import json,sys
rows=[]
for d in json.load(sys.stdin)['documents']:
    f=d['fields']; g=lambda k: list(f[k].values())[0]
    rows.append((g('timestamp'),g('totalStudyMin'),g('completedTasks')))
for r in sorted(rows)[-24:]: print(r[0][:16],'study=',r[1],'done=',r[2])"
```

## 総学習時間が「減る」問題（2026-08-22 に対策ずみ）

### どういう問題だったか

総学習時間は積み上がる値なので本来は減らないが、実測で**1時間に700〜800時間規模の増減**が出ていた。

例（2026-08-21, UTC）:

```
20:26  3,587,270 分   (+47,360)
21:26  3,570,910 分   (-16,360)  ← 減っている
22:26  3,600,910 分   (+42,660)
23:26  3,554,970 分   (-45,940)  ← 減っている
```

### なぜ減るのか

合計は「前回の合計＋増えた分」ではなく、**1時間ごとに全端末の申告値をゼロから足し直している**。
だから**1台の申告値が下がると、合計もその分だけ下がる**。1台で4〜6万分（700〜1,000時間）
持っている端末があるので、そこが抜けると合計が数万分ふらつく。

端末の申告値が下がる道すじ：

| 道すじ | 中身 |
|---|---|
| 全データのクリア | 「すべてのデータをクリア」で0を送る。同期コードは残るので、あとでクラウドから戻ってまた増える |
| 古いバックアップの復元 | 一時的に少ない数字を送る |
| まとめ入力の取り消し | まとめボタンで入れた記録をまとめて消した |
| **保留分の送り直し** | 送れなかったとき用の「ひかえ」（`flushPending`）は**作った時点の古い数字**。これで新しい数字を上書きしてしまう |
| ドキュメントごと消える | 機種変更・入れ直しなどで `analytics/{userId}` が無くなる |

「ひかえの送り直し」で最後に書かれた端末は、Firestore上で見分けられる。
`updatedAt` が本物の時刻ではなく `{_methodName:"FieldValue.serverTimestamp"}` という形で残っている
（`JSON.stringify` を通したせい）。2026-08-21時点で862台中282台がこの状態だった。

なお、端末を買い替えて同期コードで復元すると**古い端末の記録も残ったまま**なので、
その人のぶんが二重に数えられて跳ね上がる（8/20 09:05 に「いきなり49,060分」の端末が登場した例あり）。
こちらは合計が増える方向なので、いまは対策していない。

### どう直したか（端末ごとの過去最高値）

`aggregateAnalyticsSummaryCore()` が、**端末ごとの「これまでの最高値」**（`deviceStudyMax`）を
覚えておき、申告値がそれより低い回は**最高値の方を合計に使う**ようにした。

- 申告値が増えたときは**そのまま反映**（増加が遅れることはない）
- 申告値が下がった回は**最高値で埋め戻す**ので、合計は減らない
- ドキュメントごと消えた端末も、過去の記録は合計に残す（消えた瞬間に数万分落ちるのを防ぐ）
- 覚えておく上限は20,000台（`STUDY_MAX_DEVICE_ENTRIES`）。超えたら時間の多い順に残す

最高値の置き場所は `analytics_diagnostics/studyTotal` の `deviceStudyMax`。
集計の**冒頭で1回読む**だけなので、Firestoreの読み書き回数は今までと同じ（1時間に読み取り1回・書き込み1〜2回）。

`analytics_summary/summary` に増えた項目：

| 項目 | 意味 |
|---|---|
| `totalStudyMin` | 画面に出る合計（過去最高値で守ったあと）。**減らない** |
| `totalStudyMinRaw` | 端末の申告値をそのまま足しただけの合計。**調査用**（こちらは減る） |
| `studyTotalRaisedDevices` / `studyTotalRaisedMin` | その回、最高値で埋め戻した端末数と分数 |
| `studyTotalGhostDevices` / `studyTotalGhostMin` | 記録が消えた端末の台数と分数 |

「本当はどれだけ減ったのか」を知りたいときは `totalStudyMinRaw` を見る。

### 反映のしかたと、見えかたの注意

- サーバー側は自動では反映されない。**Actionsの「サーバー側（Functions）をデプロイ」を実行する**（下記）
- 24h推移のグラフは**過去24回ぶんの記録を並べたもの**。反映前のギザギザは、消えるまで最大24時間かかる
- スパークライン（小さな折れ線）は**その24点の最小〜最大を高さいっぱいに引き伸ばして**描いている
  （`renderKisekiSparkline`）。わずかな増減でも大きな上下に見えるのはこのため

### 減った端末を調べたいとき（診断記録）

対策後も「どの端末の申告値が下がったか」の記録は残している（`recordStudyTotalDiagnostics`）。

- `analytics_diagnostics/studyTotal` … 毎回上書き。直近の状態と `topDrops`（下がった端末の上位20件）
- `analytics_diagnostics_log/*` … **下がった回だけ**追記。14日で自動削除

`analytics_diagnostics` は端末の識別番号を含むため、外部からは読めない設定になっている。
確認は [Firebase Console](https://console.firebase.google.com/project/kotsusaku-app/firestore) から行う。

`topDrops` の各項目の意味：

| 項目 | 意味 |
|---|---|
| `before` / `after` | その端末の申告値（分）。前回 → 今回 |
| `after` が `null` | `analytics/{userId}` のドキュメント**ごと消えた** |
| `lostMin` | 減った分数 |

**ここに記録が出ても、画面の合計は減っていない**（最高値で守っているため）。原因調査用の記録。

### 確かめかた（動かして試す）

偽のFirestoreを差し込んで集計を6回まわし、「0を送ってきた」「記録ごと消えた」「古い数字を再送した」
のどれでも合計が減らないことを確認できる。**Firestoreにはつながないので、本番のデータは触らない。**

```bash
cd /該当フォルダのパス
node tools/verify-study-total.js
```

最後に「総学習時間は減らない ✓」と出れば合格。集計の中身を触ったら必ず実行すること。

## サーバー側（Functions）のデプロイ方法

アプリ本体（`index.html` など）は main にマージすると自動で反映されるが、
**サーバー側は自動では反映されない**。意図せず本番のプログラムが入れ替わるのを防ぐため。

### 方法A：GitHubの画面から（ターミナル不要・おすすめ）

1. リポジトリの **Actions** タブを開く
2. 左の一覧から **「サーバー側（Functions）をデプロイ」** を選ぶ
3. 右の **Run workflow** → 緑の **Run workflow** を押す
4. 2〜5分待つ。緑のチェックが付けば成功

設定ファイルは `.github/workflows/firebase-functions-deploy.yml`。

### 方法B：ターミナルから

```bash
cd /該当フォルダのパス
git pull origin main
npm install --prefix functions           # 部品を入れる。取得直後は必須
npx firebase-tools@latest login          # 初回だけ
npx firebase-tools@latest deploy --only functions --project kotsusaku-app
```

`✔  Deploy complete!` と出れば成功。

**`npm install --prefix functions` を省くと失敗する。** `functions/node_modules` は
GitHubに置かない決まりなので、クローン直後や `git pull` 直後は空になっている。
部品が無いと firebase-tools がプログラムを解析できず、こう出て止まる。

```
⚠ functions: Couldn't find firebase-functions package in your source code. Have you run 'npm install'?
Error: An unexpected error has occurred.
```

一度入れれば、そのフォルダでは次回以降は不要（`package.json` を変えたときだけ再実行）。

### 権限が足りずに失敗する場合

方法Aで `HTTP Error: 403, Permission ... denied` が出たら、`FIREBASE_SERVICE_ACCOUNT` に
登録したサービスアカウントの権限不足。Functionsのデプロイはホスティングより強い権限が要る。
必要な役割はワークフローファイルの先頭のコメントに列挙してある。

## 変更するときの注意

- 画面の数字は `applyKisekiStats()` が唯一の出どころ。固定HTMLの `…` は初期値でしかない（教訓#005）
- 読み取り回数を増やす変更をするときは、**必ず1回開くごとの件数を数える**。
  偽のFirestoreで `db` を差し替えて `loadTaskTrend()` を複数回呼べば数えられる
- 表示を変えたら **320×568** から確認する（教訓#007）
- 集計（`aggregateAnalyticsSummaryCore`）を触ったら `node tools/verify-study-total.js` を実行する。
  総学習時間が減らない仕掛け（端末ごとの過去最高値）を壊していないか確認できる
