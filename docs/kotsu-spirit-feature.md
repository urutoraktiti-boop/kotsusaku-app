# コツ習慣「スピリット編」機能ドキュメント

> 「コツ習慣」タブの 100コツ到達後の第二部「スピリット編」の仕組み。実装は `kotsu-tasks.js`（IIFE）＋ `kotsu-tasks.css`、画像は `assets/spirits/`。**本番反映済み（v111 / PR #26）**。行番号は目安。

## 1. これは何か
コツを100個習得（完了）した後に解放される第二部。コツを積むほど自分だけの「スピリット（能力体）」が育ち・集まる収集＆育成要素。100到達後の“やることがない”状態を解消する。

## 2. 最重要の前提
- **能力表は「コツ習慣」のデータだけで算出**。学習時間トラッカー本体（`totalStudyMin` 等）には一切依存しない。
- スピリット状態は**ローカル保存のみ**（分析用Firestoreへ即時書き込みしない）。

## 3. データ保存（localStorage / `STORE`）
- `kskotsu_spirits`（`STORE.spirits`）… 解放・進行状態。形:
  ```
  { unlocked: { <spiritId>: { unlockedAt, announcedAt? } }, level: <number>, titles: [達成した称号のmin], updatedAt }
  ```
- `kskotsu_spirit_intro_seen`（`STORE.spiritIntroSeen`）… 第二部解放の初回案内フラグ。
- 既存タスクは `kskotsu_tasks`、KPは `kskotsu_kp`。
- 新キーは `exportData`/`importData`/`mergeData`/`clearAll` 全てに登録済み（同期・初期化対象）。

## 4. 能力表（6指標・A〜E）
定義: `SPIRIT_ABILITIES`（163行付近）。各 `bands:[Dの下限,Cの下限,Bの下限,Aの下限]`。算出: `kotsuSpiritStats()`（766行・全タスク横断＝アカウント全体）。判定: `spiritRank(value,bands)`。

| 能力(key) | 出どころ | 集計範囲 | bands |
|---|---|---|---|
| 破壊力(power) | practice系の完了数 | 全期間 | [1,10,30,60] |
| スピード(speed) | 直近7日の平均完了数/日 | 直近7日(変動) | [0.01,0.5,1,3] |
| 射程距離(range) | 完了タスクの科目ユニーク数 | 全期間 | [1,2,4,6] |
| 持続力(stamina) | コツ完了の連続日数(`spiritStreak`) | ライブ(途切れ減) | [1,3,7,14] |
| 精密動作性(precision) | 完了率 done/active(carried除外) | 全期間 | [1,50,70,90] |
| 成長性(growth) | KP値 | 全期間 | [100,300,1500,3000] |

**変動仕様**: 能力表は最新データで変動する（全期間指標も取消・削除・未完了コツ大量追加で下がりうる）。ただし**解放済みスピリット・称号は永久保持**（没収しない）。

## 5. スピリット8体（`KOTSU_SPIRITS` 173行）
各 `{ id, name, desc(セリフ), icon(絵文字), image, unlock }`。解放判定 `spiritUnlockMet`、記録 `syncSpirits()`（819行）。**解放は累計100到達後のみ**（gate）。

| id | name | 解放条件(unlock) |
|---|---|---|
| first_light | ヨアケ・ピヨーン | reach100（累計100コツ） |
| crash | トッパ・ガリベン | abilityB:power（破壊力B以上） |
| rapid | ソッコー・ダッシュ | abilityB:speed |
| horizon | ミハラ・シーカー | abilityB:range |
| everlasting | ズット・モエテル | abilityB:stamina |
| surehand | ドンピシャ・アロー | abilityB:precision |
| rising_core | ノビシロ・モリモリ | abilityB:growth |
| complete_soul | カンペキ・タマシイ | allA（6能力すべてA） |

## 6. 天井対策（青天井）
- **覚醒Lv** = `floor(累計コツ/100)`（上限なし）。
- **記念称号** `SPIRIT_TITLES`（194行）= 累計 500「コツの探究者」/1000「コツの匠」/2000「コツの伝説」。
- 能力はAで打ち止めだが Lv・称号で継続。Sランク/第2弾スピリットを後付けできる構造。

## 7. UI（スピリット名鑑）
`renderSpiritCodex(stats,store)`（1442行）→ `renderEquip`（装備タブ `#ks-task-page-equip`）に表示。能力バー(A〜E)・8体カード（解放=立ち絵/未解放=`spirit_locked.png`、画像失敗時は絵文字フォールバック）・覚醒Lv・称号バッジ・「もう一度見る」ボタン。100未到達はティザー表示。

## 8. 覚醒演出「タマゴ割れ覚醒シアター」
`playSpiritTheater(spirits, opts)`（2152行）。オーバーレイ `#ks-spirit-theater`（`mount()` 内）。3段階 = ミニ(通常解放)/フル(first_light=100到達)/特別(complete_soul=全A)。タマゴ4コマ `SPIRIT_EGG_FRAMES`（186行）を差し替え→立ち絵バウンド登場。
- **1回だけ**: `markSpiritAnnounced` で `announcedAt` を記録。replay(もう一度見る)は `record:false`。
- 音=`playFanfare`(控えめ)／バイブ=`vibrateSafe`(best-effort・iPhoneは期待しない)／`prefersReducedMotion()` で過度な動き抑制／タップ・スキップで閉じる(`closeSpiritTheater`)。
- トリガ: `toggleDone`（新規解放の前後差分）／既存ユーザー初回 `maybeShowSpiritIntro()`（844行、未演出の解放分をまとめて1回）。

## 9. 既存ユーザー移行
`init()`→`syncSpirits()` で100到達済みは即解放記録（announcedAt無し）。次の `open()`→`maybeShowSpiritIntro()` で未演出分をまとめて1回演出→announcedAt記録。

## 10. 画像アセット（`assets/spirits/`）
- 立ち絵8体 `spirit_<id>.png` ／ 未解放 `spirit_locked.png` ／ 解放バナー `spirit_unlock_banner.png`
- タマゴ4コマ `spirit_egg_closed/crack_1/crack_2/open.png`
- 称号バッジ `title_500/1000/2000.png`
- いずれも読込失敗時は絵文字へフォールバック（`onerror`）。

## 11. リリース/PWA
- バージョン `kotsusaku-v111-spirits`（`sw.js` `CACHE_VERSION` / `index.html` `CURRENT_VERSION` 7032行 / `version.json` の3点統一）。
- 全画像を `sw.js` の `CACHE_FILES` に登録済み（登録漏れ＝オフライン/古表示の原因）。**画像追加時は CACHE_FILES追加＋CACHE_VERSIONバンプ必須**。
- 更新ポップアップ `UPDATE_COPY`（index.html 7038行）＝「タマゴ、割れる。🐣✨」。

## 12. 既存不具合の是正（ついで）
- 進化図鑑の「120/100」→ `Math.min(count,100)/100`。
- `STORY_EVOLUTION_STAGES` の「続きは101コツ目から」→「第二部スピリット編が始まります」。

## 13. テスト/検証
- jsdom専用ハーネス（`index.html` 経由ではなく `kotsu-tasks.js` を直接スクリプト実行する形）で検証：能力境界 / 解放・永久保持 / 名鑑描画 / 覚醒演出。
- ⚠ `tools/verify-runtime.js` は `index.html` のインラインscriptのみ検査する（外部 `kotsu-tasks.js` は実行しない）。`kotsu-tasks.js` の動作確認には別ハーネスが必須。
- ⚠ 実機ブラウザの目視は環境上できていない。表示系の変更後は実機確認推奨（`CLAUDE-lessons.md` #004/#005）。

## 14. 注意点（次に触る人へ）
- 名前/セリフ/画像は `KOTSU_SPIRITS`・`SPIRIT_TITLES` の1か所集約。差し替えはそこだけ。
- 閾値(`bands`)は“ゆるめ”の仮値。実データで調整可。
- 共有関数・定数はIIFE最外スコープに置く（#004）。表示文言はJS定数の出どころも直す（#005）。
- 関連コミット: cf33b0a(本体)/f7d50c5(画像)/7dcfac2(文言・名前)/383fbf3(演出)/c1a4917(称号)。PR #26 → main → v111デプロイ済み。
