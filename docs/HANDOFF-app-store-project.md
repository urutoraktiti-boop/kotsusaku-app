# 引き継ぎ書：アプリストア申請プロジェクト

**最終更新：2026-07-06 ／ 作業ブランチ：`claude/app-store-submission-prep-u0u914`**

この文書は、コツコツサクサクを App Store / Google Play に提出するプロジェクトの引き継ぎ書。
この会話を知らないエージェント（別のClaude・次のセッション）が、これ1本で経緯・決定事項・残作業を把握できるように書いてある。
**このプロジェクトに関わる作業を始める前に、必ず全文を読むこと。**

---

## 0. まず守ること（作業ルール）

1. `CLAUDE.md` と `CLAUDE-lessons.md` を必ず読む（毎セッション必須。失敗記録#001〜#005に同じミスを防ぐ対策がある）
2. ユーザーは**非エンジニア**。専門用語には必ず括弧書きで平易な説明を添える
3. リサーチ・分析・報告の「まとめ」は**必ずHTML形式の構造化ページ（Artifact）で提示**（2026-07-06ユーザー指示、CLAUDE.mdに記載済み）
4. 作業開始時は `git fetch origin` → `git log --oneline -5` → `git status` で最新確認
5. mainに直接プッシュしない。作業ブランチ→プルリクエスト→ユーザーがマージ、の流れ
6. index.htmlを変更したら `tools/verify-runtime.js` で実行チェック＋可能ならブラウザ実確認（#004・#005の教訓）

## 1. プロジェクトの目的

- PWA（ブラウザで動くWebアプリ）として運用中のコツサクを、**本物のiPhoneアプリ・Androidアプリとして両ストアに提出し、審査に通す**
- **両ストア同時進行**。初回リリースは**無料・課金なし・日本のみ公開**
- ユーザー環境：**Macを所有**（Xcodeの標準ルートでiOSビルド可能）
- アプリの現状：Firebase Hosting（プロジェクト`kotsusaku-app`）で公開中。mainへのマージで GitHub Actions が自動デプロイ

## 2. 文書の案内図（どこに何が書いてあるか）

| 文書 | 内容 |
|---|---|
| `docs/app-store-roadmap.md` | **全体工程表**。審査に通らない理由と対策・費用・Phase 0〜3・提出前チェックリスト。進捗チェックボックスもここ |
| `docs/market-research-study-apps.md` | 市場リサーチ。競合（Studyplus/Forest/みんチャレ等）比較・コツサクの強み・足りないもの |
| `docs/reminder-notification-spec.md` | **通知機能の確定仕様**（Phase 1で実装するもの。これが唯一の出どころ） |
| `docs/monetization-plan.md` | **有料化の確定方針**（応援課金のみ。実装時これが唯一の出どころ） |
| `privacy.html` | プライバシーポリシー本体（リポジトリ直下。デプロイ後 kotsusaku-app.web.app/privacy.html） |
| `docs/notice-feature.md` / `docs/kotsu-spirit-feature.md` | 既存機能（お知らせ・スピリット編）の仕組み。通知実装時に参照 |

## 3. ここまでの経緯（なぜこうなったか）

1. **現状調査（2026-07-06）**：審査に通らない理由を特定
   - プライバシーポリシー・連絡先が皆無（両ストアで必須）→ 最優先で対応（済）
   - 通知・課金・広告・ログインなし。データはlocalStorage中心＋任意の「同期コード」でFirestore同期（`users/{同期コード}`）＋匿名分析（`analytics/{匿名ID}`＋GA4）
   - Apple審査ガイドライン4.2（Webの包み直しはNG）のリスク → ネイティブ機能（通知）追加で対策
2. **市場リサーチ**：コツサクは「記録×育成×仲間」の三位一体で競合に無い立ち位置。欠けている標準機能は**リマインダー通知だけ**。「連続」でなく「累計」で励ます設計は習慣化の最新知見と一致（挫折の最大要因＝連続記録が切れた時の罪悪感）
3. **技術方針**：新リポジトリは作らず、**現リポジトリにCapacitorを導入**（中身のHTML/JSをそのまま包む）。理由：中身の二重管理を避ける（失敗記録#005と同じ構造の事故を防ぐ）

## 4. 決定事項一覧（すべて2026-07-06決定）

| # | 決定 | 詳細の出どころ |
|---|---|---|
| 1 | 現リポジトリのままCapacitorでネイティブ化。新リポジトリは作らない | 本文書§3 |
| 2 | Web版とアプリ版は同一コードで機能分岐（`window.Capacitor`の有無で判定） | roadmap |
| 3 | 初回申請は無料・課金なし | roadmap / monetization-plan |
| 4 | 通知は3種を採用：**①スピリットの呼び声・②開花日だより・④おかえり通知**（③名言は見送り）。デフォルトOFF・1日1回・時刻はユーザー設定・ローカル通知（サーバー送信なし）。Web版には出さない | **reminder-notification-spec.md** |
| 5 | 有料化は**応援サポーター課金のみ**（非消耗型の買い切り・復元可能）。お礼＝応援バッジ＋きせかえテーマ。月額サブスク・広告・機能制限は採らない。核心機能は永久無料 | **monetization-plan.md** |
| 6 | 同期データ・バックアップに`purchases`欄をPhase 1で予約（後から足すと同期不整合の危険） | monetization-plan §3-A |
| 7 | ポリシーの運営者表記は「コツコツサクサク運営」。連絡先は専用メール開設待ち（現在プレースホルダー） | privacy.html §9 |
| 8 | ウィジェットは初回申請に含めず、公開後の目玉アップデートに温存 | market-research §5 |

## 5. 実装済み（Phase 0・本ブランチ上）

| 実装 | 場所・目印 |
|---|---|
| プライバシーポリシーページ | `privacy.html`（連絡先だけ「準備中」のまま） |
| 設定画面からのポリシーリンク | index.html「データ収集について」セクションの直後（`./privacy.html`への相対リンク） |
| クラウド同期データの削除機能 | index.html：ボタン`#sync-delete-btn`、停止フラグ`_SYNC_DISABLED_KEY`（localStorage `kotsusaku-sync-disabled`）、`isSyncDisabled()`/`updateSyncPausedUI()`、配線は`initSyncUI()`内。削除→同期停止、`#sync-resume-btn`かコード取り込みで再開。ガードは`saveToCloud`/`saveToCloudNow`/`syncFromCloudIfNeeded`に入れてある |
| バージョン表記の統一 | index.html：定数`KOTSUSAKU_APP_VERSION`が唯一の出どころ（trackEvent・analytics payload・更新チェックのフォールバックが参照）。**リリース時はこの定数＋sw.js＋version.jsonの3点セットを更新** |
| 検証 | `NODE_PATH=./node_modules node tools/verify-runtime.js`で「アプリ由来エラーなし✓」確認済み＋Chromiumで起動・要素表示・エラーなし確認済み |

## 6. 残作業（優先順）

### すぐ（次のセッションで）
1. **本ブランチ→mainのプルリクエスト作成・マージ**（ユーザーの指示を得て）。マージするとWeb版本番にポリシーと削除機能が反映される
2. **Firestoreセキュリティルール**（Phase 0の残り）：`users/{同期コード}`の形式・サイズ制限、`analytics`の書き込み制限、`analytics_summary`/`analytics_task_trend`のクライアント書き込み禁止。ルールのデプロイ方法（ユーザーのMacでのコマンド）も案内が必要

### ユーザーの宿題（こちらから催促してよい）
- お問い合わせ用メールアドレスの開設 → `privacy.html`§9の「準備中」を差し替え（**未対応のままでは審査に出せない**）
- Apple Developer Program登録（年約15,800円・承認に数日）
- Google Play Console登録（初回のみ約25ドル）

### Phase 1（ネイティブ化。着手時は仕様書2本を熟読）
- Capacitor導入（`ios/`・`android/`追加、`www/`等へのコピー仕組み、firebase.jsonのignoreに追加）
- ネイティブ版でsw.js登録・更新ポップアップを動かさない分岐
- リマインダー通知の実装（→ reminder-notification-spec.md の予約制ロジック）
- 同期データ・バックアップJSONに`purchases: []`欄を予約
- 通知実装時にprivacy.htmlへ「リマインダー通知は端末内で動作し、外部にデータを送信しません」を追記
- Mac上でのXcode/Android Studioビルド・実機確認（ユーザーに貼り付けるだけのコマンドを提供）

### Phase 2〜3（ストア準備・提出）
- iOS用1024×1024px透過なしアイコン・Androidアダプティブアイコン（既存icon-512.png等が元デザイン）
- スクリーンショット・ストア説明文（訴求軸：「記録×育成×仲間」「累計主義」「登録不要・広告なし・オフライン完全動作」）
- アプリ名の絵文字なし表記（「コツコツサクサク」）を用意
- Apple審査メモに「同期コードの仕組み（ログイン不要）」を説明
- TestFlight配布 → Google Play個人アカウントは**12人以上×14日間のクローズドテスト必須**（C-teamコミュニティに協力依頼する案）
- 詳細チェックリストは app-store-roadmap.md §5

## 7. 注意点・落とし穴

- **連絡先プレースホルダーのまま提出しない**（privacy.html§9）
- sw.js/version.jsonの更新通知の仕組みはWeb専用。ネイティブ版に持ち込まない（Appleはリモートでの動作差し替えに厳しい）
- 同期コードは実質パスワード。ログや画面例に実コードを書かない
- `users/{同期コード}`は現状ルール未整備＝コードを知れば読み書きできる前提で扱う（早期にルール整備）
- Web版とアプリ版で**データ形式は必ず共通に保つ**（同期・バックアップの互換性）
- 本セッションのHTMLまとめ（Artifact）3本：市場リサーチ https://claude.ai/code/artifact/c678391b-75db-4ed5-b061-02bb6b0b70bc ／ 通知提案（採用決定版） https://claude.ai/code/artifact/11d10ff7-5cda-4dcd-a2fa-e0a0a01ea08d ／ 有料化プラン（確定版） https://claude.ai/code/artifact/9afd191a-5aa0-4ed6-9b54-62abe97fc6de

## 8. 本ブランチのコミット履歴（2026-07-06）

| コミット | 内容 |
|---|---|
| c729649 | ロードマップ文書 追加 |
| 79a9247 | プライバシーポリシー（privacy.html）追加 |
| 655dc2c | 市場リサーチ・比較レポート 追加 |
| 96e31c3 | CLAUDE.mdに「まとめはHTML形式」ルール追記 |
| 18e1261 | Phase 0実装（削除機能・ポリシーリンク・バージョン統一） |
| 26f3f85 | 通知仕様書 追加＋ロードマップ進捗更新 |
| 6fcd26c | 有料化プラン 追加 |
| 9e44dee | 有料化プランを「応援課金のみ」に改訂 |
