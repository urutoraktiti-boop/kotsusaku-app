# コツ習慣アナリティクス集計方針

## 目的

コツ習慣の利用状況をダッシュボードへ反映しつつ、全体数字の二重加算を防ぐ。

## 役割分担

- アプリ本体: 各ユーザーの現在値だけを `analytics/{userId}` に保存する。学習時間やコツ習慣に変更があっても、送信は最大1時間に1回へまとめる。
- 集計側: `analytics` の全ユーザー分を読み、`analytics_summary/summary` と `analytics_task_trend` を作る。
- ダッシュボード/ホームページ/アプリ設定画面: 集計済みの `analytics_summary/summary` を表示する。アプリ設定画面の「みんなの軌跡」は1時間キャッシュを使う。

## アプリ本体が送る主な項目

- `totalStudyMin`: そのユーザーの累計学習時間
- `hasKotsuHabit`: コツ習慣を使っているか
- `kotsuTaskCount`: 作成済みコツ数
- `kotsuDoneCount`: 完了済みコツ数
- `kotsuTodoCount`: 未完了コツ数
- `kotsuCarriedCount`: 繰越元になったコツ数
- `kotsuTodayTaskCount`: 今日のコツ数
- `kotsuTodayDoneCount`: 今日の完了コツ数
- `kotsuWeekTaskCount`: 今週のコツ数
- `kotsuWeekDoneCount`: 今週の完了コツ数
- `kotsuMonthTaskCount`: 今月のコツ数
- `kotsuMonthDoneCount`: 今月の完了コツ数
- `kotsuTotalActualMin`: コツ習慣に記録された実績分数
- `kotsuKP`: コツポイント
- `kotsuTemplateCount`: 保存済みテンプレート数
- `kotsuCategoryCounts`: カテゴリ別コツ数

## 集計側で作る数字

- `totalStudyMin`: `analytics` の `totalStudyMin` を合計
- `taskUsers`: `hasKotsuHabit === true` のユーザー数
- `totalTasks`: `kotsuTaskCount` を合計
- `completedTasks`: `kotsuDoneCount` を合計
- `todayTasks`: `kotsuTodayTaskCount` を合計
- `todayCompletedTasks`: `kotsuTodayDoneCount` を合計
- `weekTasks`: `kotsuWeekTaskCount` を合計
- `monthTasks`: `kotsuMonthTaskCount` を合計
- `kotsuTotalActualMin`: `kotsuTotalActualMin` を合計

## 禁止すること

- ユーザー端末から `analytics_summary/summary` に increment しない。
- ユーザー端末から `analytics_task_trend` にスナップショットを書かない。
- 1台の端末データで全体集計を上書きしない。
- 学習ブロックやコツ習慣の操作ごとに、分析用Firestoreへ即時送信しない。

これらを守ると、手動再集計やサーバー集計とユーザー端末の送信が重なっても、全体数字が急に倍増しにくくなる。
