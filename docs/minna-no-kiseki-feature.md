# みんなの軌跡（設定画面の全体統計）

設定画面の一番下に出る「🌸 みんなの軌跡 🌸」の仕組みと、数字が正しいかを確かめる手順。

## 何を表示しているか

| カード | 表示 | 出どころ |
|---|---|---|
| ⏱ 総学習時間 | `analytics_summary/summary` の `totalStudyMin` ÷ 60（時間） | 全ユーザーの累計学習時間の合計 |
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

## 総学習時間が「減る」問題（調査中）

総学習時間は積み上がる値なので本来は減らないが、実測で**1時間に1,000時間規模の増減**が出ている。

例（2026-08-13, UTC）:

```
17:45  3,162,450 分
18:45  3,202,990 分   (+40,540)
09:45  3,179,150 分   (-64,970)  ← 減っている
```

確認済みのこと：
- 集計ロジック自体は正しい。全847件を手作業で合計した値と、集計結果は**完全に一致**した
- 直近7日以内に使った端末は**全員がコツ習慣のデータを送れている**（送信もれゼロ）
- ダッシュボードは `analytics_summary` を**読むだけ**で、書き込んでいない

原因を特定するため、`aggregateAnalyticsSummaryCore()` に診断記録を入れてある
（`recordStudyTotalDiagnostics`）。1時間ごとに、端末別の累計学習時間を前回と比べ、
**値が下がった端末**を記録する。

- `analytics_diagnostics/studyTotal` … 毎回上書き。直近の状態と `topDrops`（下がった端末の上位20件）
- `analytics_diagnostics_log/*` … **下がった回だけ**追記。14日で自動削除

追加コストは1時間あたり読み取り1回・書き込み1〜2回。

数日ためてから `analytics_diagnostics_log` を見れば、
「特定の端末の値が急に下がっている」のか「ドキュメントごと消えている」のか
（`after` が `null` なら消失）が分かる。

### 診断結果の見かた

`analytics_diagnostics` は端末の識別番号を含むため、外部からは読めない設定になっている。
確認は [Firebase Console](https://console.firebase.google.com/project/kotsusaku-app/firestore) から行う。

- `analytics_diagnostics/studyTotal` … 毎時上書き。`topDrops` が空なら、その回は減少なし
- `analytics_diagnostics_log/*` … **減った回だけ**作られる。ずっと空なら減少は起きていない

`topDrops` の各項目の意味：

| 項目 | 意味 |
|---|---|
| `before` / `after` | その端末の累計学習時間（分）。前回 → 今回 |
| `after` が `null` | `analytics/{userId}` のドキュメント**ごと消えた** |
| `lostMin` | 減った分数 |

デプロイ直後の1回目は比較相手がないため何も検出されない。**2回目（約1時間後）から判定が始まる。**

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
npx firebase-tools@latest login          # 初回だけ
npx firebase-tools@latest deploy --only functions --project kotsusaku-app
```

`✔  Deploy complete!` と出れば成功。

### 権限が足りずに失敗する場合

方法Aで `HTTP Error: 403, Permission ... denied` が出たら、`FIREBASE_SERVICE_ACCOUNT` に
登録したサービスアカウントの権限不足。Functionsのデプロイはホスティングより強い権限が要る。
必要な役割はワークフローファイルの先頭のコメントに列挙してある。

## 変更するときの注意

- 画面の数字は `applyKisekiStats()` が唯一の出どころ。固定HTMLの `…` は初期値でしかない（教訓#005）
- 読み取り回数を増やす変更をするときは、**必ず1回開くごとの件数を数える**。
  偽のFirestoreで `db` を差し替えて `loadTaskTrend()` を複数回呼べば数えられる
- 表示を変えたら **320×568** から確認する（教訓#007）
