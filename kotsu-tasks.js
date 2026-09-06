(function () {
  'use strict';

  const STORE = {
    tasks: 'kskotsu_tasks',
    templates: 'kskotsu_templates',
    templateDeleted: 'kskotsu_template_deleted',
    deleted: 'kskotsu_deleted',
    kp: 'kskotsu_kp',
    storyProgress: 'task-story-progress',
    equipmentUnlocked: 'task-equipment-unlocked',
    spirits: 'kskotsu_spirits',
    spiritIntroSeen: 'kskotsu_spirit_intro_seen',
    taskDataAlias: 'task-data',
    taskSettings: 'task-settings',
    subjectPrefix: 'kskotsu_subject_',
    typePrefix: 'kskotsu_type_',
    typeCategoryPrefix: 'kskotsu_type_category_'
  };

  const STORY_EVOLUTION_STAGES = [
    { count: 0, icon: '🐣', name: 'はじまりの姿', desc: 'ここからストーリーが育っていきます。', image: 'assets/stories/common/story_common_000.png' },
    { count: 5, icon: '🌿', name: '小さな一歩', desc: '最初の積み上げが形になりました。', image: 'assets/stories/mystery/story_mystery_005.png' },
    { count: 10, icon: '✨', name: '見習いの光', desc: 'コツコツの流れが見えてきました。', image: 'assets/stories/mystery/story_mystery_010.png' },
    { count: 20, icon: '🌱', name: '芽生えの段階', desc: '小さな変化が育ち始めています。', image: 'assets/stories/mystery/story_mystery_020.png' },
    { count: 30, icon: '🍃', name: '旅立ちの装い', desc: '続ける力が姿に出てきました。', image: 'assets/stories/mystery/story_mystery_030.png' },
    { count: 40, icon: '🌱', name: 'つぼみの段階', desc: '次の変化が、もうそこまで来ています。', image: 'assets/stories/mystery/story_mystery_040.png' },
    { count: 50, icon: '🔔', name: '節目の合図', desc: '半分まで来ました。しっかり積み上がっています。', image: 'assets/stories/mystery/story_mystery_050.png' },
    { count: 65, icon: '💫', name: '成長の証', desc: '努力の輪郭がはっきりしてきました。', image: 'assets/stories/mystery/story_mystery_065.png' },
    { count: 80, icon: '🗡️', name: '突破の力', desc: 'あと少し。ここまで来た自分を信じて進めます。', image: 'assets/stories/mystery/story_mystery_080.png' },
    { count: 88, icon: '👑', name: '王冠の段階', desc: '大きな達成が近づいています。', image: 'assets/stories/mystery/story_mystery_088.png' },
    { count: 100, icon: '🌟', name: '完成の姿', desc: '100コツ到達！第二部「スピリット編」が始まります。', image: 'assets/stories/mystery/story_mystery_100.png' }
  ];

  const STORY_EVOLUTION_OVERRIDES = {
    itachacha: [
      { name: 'ただのニヤピヨ', desc: 'ここから、ニヤリと始まります。', icon: '🐣' },
      { name: '朝の小枝ピヨ', desc: '小さな枝を持って、今日も再出発。', icon: '🌿' },
      { name: 'ニヤリメガネピヨ', desc: '見える。コツコツの勝ち筋が見える。', icon: '😏' },
      { name: 'ブロの芽ピヨ', desc: '頭にブロッコリーの気配が芽生えました。', icon: '🥦' },
      { name: '葉っぱマントピヨ', desc: 'やさしく、しぶとく、積み上げる姿。', icon: '🍃' },
      { name: 'つぼみピヨ', desc: '次の変化が、もうそこまで来ています。', icon: '🌱' },
      { name: 'イタチャチャ鐘ピヨ', desc: '節目の鐘が鳴りました。ニヤリ。', icon: '🔔' },
      { name: '半ブロピヨ', desc: '半分以上ブロ。かなりいい感じです。', icon: '🥦' },
      { name: 'ブロッ剣ピヨ', desc: 'ブロッコリーの剣で、迷いをサクッと。', icon: '🗡️' },
      { name: 'イタチャチャ王冠ピヨ', desc: 'ここまで来た人だけの、ちょっと変な王冠。', icon: '👑' },
      { name: '完全体ブロピヨ', desc: '100コツ到達！第二部「スピリット編」が始まります。', icon: '🌟' }
    ]
  };

  const DEFAULT_SUBJECTS = ['資格勉強', 'テキスト確認', '問題演習', '復習', '暗記', 'その他'];
  const DEFAULT_TYPES = ['問題演習', 'テキスト確認', '暗記', '復習', '過去問', '講義視聴', '模試'];

  const STORY_SUBJECTS = {
    gorilla: ['バナナ収集学', '仲間を増やす術', 'ジャングル制覇道', 'ボスゴリラへの道', 'ゴリラ筋肉学'],
    samurai: ['剣術基礎', '精神統一学', '敵の弱点研究', '道場の礼儀', '決戦準備'],
    space: ['星図読解学', 'ロケット工学', '異星語講座', '銀河地理学', '宇宙生存学'],
    itachacha: ['コツコツ学', 'ニヤニヤ研究', '大人の楽しみ方', 'イタチャチャハウス論', 'クレイジー自己啓発'],
    spartan: ['根性論基礎', '限界突破術', '鉄の意志学', '弱点克服道', '地獄の特訓'],
    zeirishi: ['簿記論', '財務諸表論', '法人税法', '所得税法', '消費税法', '相続税法', '国税徴収法'],
    kaikeishi: ['財務会計論', '管理会計論', '監査論', '企業法', '租税法', '経営学', '経済学'],
    boki2: ['商業簿記', '工業簿記'],
    boki3: ['仕訳・勘定科目', '現金・預金', '商品売買', '固定資産', '試算表', '精算表', '財務諸表'],
    takken: ['権利関係（民法）', '宅建業法', '法令上の制限', '税・その他'],
    sharoshi: ['労働基準法', '労働安全衛生法', '労災保険法', '雇用保険法', '健康保険法', '厚生年金保険法', '国民年金法'],
    fp2: ['ライフプランニング', 'リスク管理', '金融資産運用', 'タックスプランニング', '不動産', '相続・事業承継'],
    koumuin: ['数的推理', '判断推理', '文章理解', '資料解釈', '社会科学', '憲法', '行政法', '民法', '時事問題'],
    shindanshi: ['経済学・経済政策', '財務・会計', '企業経営理論', '運営管理', '経営法務', '経営情報システム', '2次事例']
  };

  const STORY_TYPES = {
    gorilla: ['問題演習', 'テキスト確認', '暗記', '復習', '過去問', '講義視聴', '模試'],
    samurai: ['素振り（反復演習）', '型の習得（テキスト確認）', '実戦稽古（問題演習）', '座禅（暗記）', '道場で復習', '試合（模試）'],
    space: ['ミッション遂行（問題演習）', 'ナビ確認（テキスト）', '通信訓練（暗記）', 'ブースター充填（復習）', '模擬ミッション'],
    itachacha: ['コツコツやる', '配信を見ながら学ぶ', 'ニヤニヤ暗記', 'クレイジーに頑張る', 'チャチャって復習', '大人の本気（模試）'],
    spartan: ['鬼の問題演習', '血の暗記', '炎の復習', '地獄の過去問', '鋼の意志でテキスト確認', '修羅の模試'],
    zeirishi: ['計算問題', '理論暗記', '過去問演習', '答練', '模試', 'テキスト確認', '講義視聴', '横断整理'],
    kaikeishi: ['計算問題', '理論問題', '短答式演習', '論文式演習', '過去問演習', '模試', '講義視聴'],
    boki2: ['仕訳練習', 'テキスト確認', '問題演習', '過去問演習', '模試', '復習', '答練'],
    boki3: ['仕訳練習', 'テキスト確認', '問題演習', '過去問演習', '試算表練習', '精算表練習'],
    takken: ['テキスト確認', '問題演習', '過去問演習', '暗記', '模試', '復習', '法改正確認'],
    sharoshi: ['テキスト確認', '選択式演習', '択一式演習', '過去問演習', '暗記', '横断整理', '模試'],
    fp2: ['テキスト確認', '計算問題', '過去問演習', '学科対策', '実技対策', '暗記', '模試', '復習'],
    koumuin: ['テキスト確認', '問題演習', '過去問演習', '数的推理演習', '判断推理演習', '論文対策', '面接対策'],
    shindanshi: ['テキスト確認', '計算問題', '過去問演習', '事例演習', '暗記', '模試', '復習', '答練']
  };

  const STORY_META = {
    gorilla: { icon: '🦍', name: 'ゴリラ成長記', msg: '今日も強くなるゴリ。' },
    samurai: { icon: '⚔️', name: '受験剣士の道', msg: '一つずつ、刃を研ぐ。' },
    space: { icon: '🚀', name: '宇宙探検家の旅', msg: '次のミッションへ進もう。' },
    itachacha: { icon: '🥦', name: '正体不明育成記', msg: 'コツコツやれば大丈夫。' },
    spartan: { icon: '🐉', name: '鬼教官の特訓', msg: 'よくやった。次だ。' },
    zeirishi: { icon: '🧮', name: '税理士試験', msg: '計算も理論も積み上げよう。' },
    kaikeishi: { icon: '🔍', name: '公認会計士', msg: '一問ずつ合格に近づく。' },
    boki2: { icon: '📒', name: '日商簿記2級', msg: '仕訳から着実に固めよう。' },
    boki3: { icon: '📗', name: '日商簿記3級', msg: '基礎の積み重ねが力になる。' },
    takken: { icon: '🏠', name: '宅建', msg: '業法も民法も一歩ずつ。' },
    sharoshi: { icon: '⚖️', name: '社労士', msg: '条文と過去問を積もう。' },
    fp2: { icon: '💰', name: 'FP2級', msg: '暮らしのお金を味方にする。' },
    koumuin: { icon: '🏛️', name: '公務員試験', msg: '判断と継続が道を開く。' },
    shindanshi: { icon: '💼', name: '中小企業診断士', msg: '知識を事例へつなげよう。' }
  };

  const TOP_STORY_CHARACTERS = {
    gorilla: {
      kind: 'gorilla',
      bounce: ['ゴリー', 'コツゴリ', 'うほっ', '強くなる', 'バナナ後で', 'ナイスゴリ', '一歩ゴリ'],
      runIdle: ['待機ゴリ', '準備ゴリ', '肩ならし', 'まだ本気前', 'バナナ充電', '呼吸ゴリ'],
      runActive: ['走るゴリ', 'うほ走り', 'いけるゴリ', '筋肉点火', 'ドスドス', '今日も勝つ']
    },
    itachacha: {
      kind: 'broccoli',
      bounce: ['ニヤリ', 'コツブロ', '芽が出た', '緑の勝ち', 'ブロっと', 'いい食感', '育ってる'],
      runIdle: ['待つブロ', '光合成中', '根を張る', 'まだ蒸し前', 'ニヤ待ち', '葉っぱ休憩'],
      runActive: ['サクサク', 'ブロ走り', '伸びてる', '緑加速', '房で勝つ', 'ニヤ加速']
    },
    spartan: {
      kind: 'oni',
      bounce: ['やれ！', 'まだいける', 'よし次だ', '甘えるな', 'でも休め', '鬼ナイス', '一歩前へ'],
      runIdle: ['構えろ', '待機だ', '深呼吸しろ', '目をそらすな', '準備完了', '面は熱い'],
      runActive: ['走れ！', '止まるな', '鬼ダッシュ', 'よくやった', 'その調子', '気合いだ']
    },
    space: {
      kind: 'rocket',
      bounce: ['発射', 'コツ軌道', '燃料OK', '星へ一歩', '浮いてる', '通信良好', '推進中'],
      runIdle: ['待機中', '充填中', '秒読み前', '管制待ち', '宇宙服OK', '軌道計算'],
      runActive: ['加速', '発進！', '推力全開', '星まで行こ', 'ワープ気分', '軌道に乗る']
    },
    samurai: {
      kind: 'swordsman',
      bounce: ['一閃', 'コツ斬り', 'よき一太刀', '刃が冴える', '修行中', '斬れてる', '静かに強い'],
      runIdle: ['納刀', '間合い待ち', '息を整え', 'まだ抜かぬ', '集中', '足元よし'],
      runActive: ['参る', '駆ける', '一歩抜刀', '迷いなし', '道は前', '今日も斬る']
    },
    default: {
      kind: 'chick',
      bounce: ['ピヨ', 'コツピヨ', 'ぴょん', 'えらいピヨ', '羽ばたく前', '小さく勝つ', 'ナイスピヨ'],
      runIdle: ['待つピヨ', '準備ピヨ', '羽休め', 'まだ卵気分', 'ひと休み', 'あたため中'],
      runActive: ['ぴょん', '走るピヨ', 'いけるピヨ', '羽ばたけ', '小走り中', 'ピヨ加速']
    }
  };

  const KP_RANKS = [
    { min: 0, icon: '🌱', name: 'コツ見習い' },
    { min: 100, icon: '📝', name: 'コツ学習者' },
    { min: 300, icon: '💪', name: 'コツ努力家' },
    { min: 700, icon: '🔥', name: 'コツ猛者' },
    { min: 1500, icon: '⚡', name: 'コツ達人' },
    { min: 3000, icon: '👑', name: 'コツの申し子' },
    { min: 6000, icon: '🏆', name: '伝説のコツ' }
  ];

  // ============================================================
  // スピリット編（100コツ到達後）
  //   ・能力表(A〜E)は「コツ習得」データだけで算出（学習時間は不使用）
  //   ・能力表は最新データで変動するが、解放済みスピリット・称号は永久保持
  //   ・名前/絵文字/画像/セリフは下のデータ1か所に集約（後で差し替え可能）
  // ============================================================
  const SPIRIT_RANK_ORDER = ['E', 'D', 'C', 'B', 'A'];

  // 6能力の定義（表示名・補足・A〜E境界）。bands=[Dの下限, Cの下限, Bの下限, Aの下限]
  const SPIRIT_ABILITIES = [
    { key: 'power', name: '破壊力', note: '演習', bands: [1, 10, 30, 60] },
    { key: 'speed', name: 'スピード', note: '直近7日', bands: [0.01, 0.5, 1, 3] },
    { key: 'range', name: '射程距離', note: '学びの広さ', bands: [1, 2, 4, 6] },
    { key: 'stamina', name: '持続力', note: '連続日数', bands: [1, 3, 7, 14] },
    { key: 'precision', name: '精密動作性', note: '完了率', bands: [1, 50, 70, 90] },
    { key: 'growth', name: '成長性', note: 'KP', bands: [100, 300, 1500, 3000] }
  ];

  // 第1弾 8体（仮名・絵文字アイコン。image は画像完成後に設定）
  const KOTSU_SPIRITS = [
    { id: 'first_light', name: 'ヨアケ・ピヨーン', desc: 'ここからが本番ピヨ！', icon: '🌅', image: 'assets/spirits/spirit_first_light.webp', unlock: { type: 'reach100' } },
    { id: 'crash', name: 'トッパ・ガリベン', desc: '一問入魂、いくピヨ', icon: '⚔️', image: 'assets/spirits/spirit_crash.webp', unlock: { type: 'abilityB', ability: 'power' } },
    { id: 'rapid', name: 'ソッコー・ダッシュ', desc: 'もう終わったピヨ？', icon: '💨', image: 'assets/spirits/spirit_rapid.webp', unlock: { type: 'abilityB', ability: 'speed' } },
    { id: 'horizon', name: 'ミハラ・シーカー', desc: '世界は広いピヨ', icon: '🔭', image: 'assets/spirits/spirit_horizon.webp', unlock: { type: 'abilityB', ability: 'range' } },
    { id: 'everlasting', name: 'ズット・モエテル', desc: 'きょうもコツコツ燃えるピヨ', icon: '🔥', image: 'assets/spirits/spirit_everlasting.webp', unlock: { type: 'abilityB', ability: 'stamina' } },
    { id: 'surehand', name: 'ドンピシャ・アロー', desc: 'ハズさないピヨ', icon: '🎯', image: 'assets/spirits/spirit_surehand.webp', unlock: { type: 'abilityB', ability: 'precision' } },
    { id: 'rising_core', name: 'ノビシロ・モリモリ', desc: 'まだ育つピヨ！', icon: '💎', image: 'assets/spirits/spirit_rising_core.webp', unlock: { type: 'abilityB', ability: 'growth' } },
    { id: 'complete_soul', name: 'カンペキ・タマシイ', desc: 'コンプ、いただきピヨ👑', icon: '👑', image: 'assets/spirits/spirit_complete_soul.webp', unlock: { type: 'allA' } }
  ];

  const SPIRIT_LOCKED_IMAGE = 'assets/spirits/spirit_locked.webp';
  const SPIRIT_BANNER_IMAGE = 'assets/spirits/spirit_unlock_banner.webp';
  const SPIRIT_EGG_FRAMES = {
    closed: 'assets/spirits/spirit_egg_closed.webp',
    crack1: 'assets/spirits/spirit_egg_crack_1.webp',
    crack2: 'assets/spirits/spirit_egg_crack_2.webp',
    open: 'assets/spirits/spirit_egg_open.webp'
  };

  // 累計コツ数で付与される記念称号（仮名）
  const SPIRIT_TITLES = [
    { min: 500, icon: '🎖️', name: 'コツの探究者', image: 'assets/spirits/title_500.webp' },
    { min: 1000, icon: '🏅', name: 'コツの匠', image: 'assets/spirits/title_1000.webp' },
    { min: 2000, icon: '🏆', name: 'コツの伝説', image: 'assets/spirits/title_2000.webp' }
  ];

  const CATEGORY_META = {
    practice: { icon: '⚔️', name: '知識の剣', color: '#f5c842' },
    text: { icon: '🛡️', name: '理解の盾', color: '#4af0c0' },
    memory: { icon: '✨', name: '記憶の書', color: '#8b8bff' },
    review: { icon: '💎', name: '錬成の石', color: '#3adf8a' },
    past: { icon: '🗺️', name: '試練の地図', color: '#ff7c3a' },
    lecture: { icon: '👁️', name: '洞察の目', color: '#60a5fa' },
    mock: { icon: '👑', name: '試練の証', color: '#f472b6' },
    other: { icon: '📦', name: '積み上げの箱', color: '#9ca3af' }
  };

  const CATEGORY_LABELS = {
    practice: { icon: '✏️', name: '演習' },
    text: { icon: '📚', name: '理解' },
    memory: { icon: '🧠', name: '暗記' },
    review: { icon: '🔁', name: '復習' },
    past: { icon: '📄', name: '過去問' },
    lecture: { icon: '🎧', name: '講義' },
    mock: { icon: '🏆', name: '模試' },
    other: { icon: '📦', name: 'その他' }
  };

  const STORY_EQUIPMENT = {
    samurai: {
      practice: { icon: '⚔️', name: '稽古の刀' },
      text: { icon: '🛡️', name: '型の盾' },
      memory: { icon: '📜', name: '奥義の巻物' },
      review: { icon: '💎', name: '研磨石' },
      past: { icon: '🗺️', name: '決戦の地図' },
      lecture: { icon: '👁️', name: '見切りの眼' },
      mock: { icon: '🏯', name: '本番の旗印' },
      other: { icon: '🎒', name: '旅支度' }
    },
    space: {
      practice: { icon: '🚀', name: '推進エンジン' },
      text: { icon: '🛰️', name: '航路ナビ' },
      memory: { icon: '💫', name: '星雲メモリ' },
      review: { icon: '🔧', name: '整備キット' },
      past: { icon: '🪐', name: '探査ログ' },
      lecture: { icon: '📡', name: '通信アンテナ' },
      mock: { icon: '🌌', name: '最終ミッション証' },
      other: { icon: '📦', name: '補給コンテナ' }
    },
    gorilla: {
      practice: { icon: '🍌', name: '集中バナナ' },
      text: { icon: '🌿', name: '知恵の葉' },
      memory: { icon: '🥁', name: '記憶のリズム' },
      review: { icon: '💪', name: '復習パワー' },
      past: { icon: '🗺️', name: 'ジャングル地図' },
      lecture: { icon: '👂', name: '聞き取り耳' },
      mock: { icon: '👑', name: '王者の証' },
      other: { icon: '🧺', name: '収集かご' }
    },
    itachacha: {
      practice: { icon: '🥦', name: 'コツコツブースター' },
      text: { icon: '📘', name: 'ニヤニヤ理解ノート' },
      memory: { icon: '✨', name: 'ひらめきメモリ' },
      review: { icon: '☕', name: '休憩後の復習石' },
      past: { icon: '🧭', name: '過去問コンパス' },
      lecture: { icon: '🎧', name: '配信インプット' },
      mock: { icon: '🏆', name: '本気チャレンジ証' },
      other: { icon: '📦', name: '謎の積み上げ箱' }
    },
    spartan: {
      practice: { icon: '🔥', name: '鬼演習の炎' },
      text: { icon: '🛡️', name: '鋼の理解盾' },
      memory: { icon: '⚡', name: '暗記の雷' },
      review: { icon: '🪨', name: '鍛錬石' },
      past: { icon: '🗺️', name: '試練の地図' },
      lecture: { icon: '👁️', name: '教官の眼' },
      mock: { icon: '🏅', name: '突破の勲章' },
      other: { icon: '🎒', name: '訓練バッグ' }
    },
    shikaku: {
      practice: { icon: '✏️', name: '演習ペン' },
      text: { icon: '📚', name: '理解テキスト' },
      memory: { icon: '🧠', name: '暗記カード' },
      review: { icon: '🔁', name: '復習ループ' },
      past: { icon: '📄', name: '過去問ファイル' },
      lecture: { icon: '🎧', name: '講義ノート' },
      mock: { icon: '🏆', name: '合格模試証' },
      other: { icon: '📦', name: '学習セット' }
    }
  };

  const state = {
    mounted: false,
    open: false,
    page: 'today',
    selectedSubject: '',
    selectedType: '',
    selectedCategory: 'other',
    priority: 3,
    addDetailsOpen: false,
    pickerMode: null,
    renamingChoice: '',
    editingTaskId: null,
    addConfirmOpen: false,
    floatTimer: null,
    topStoryBounceTimer: null,
    topStoryWatchTimer: null,
    topStoryComment: null,
    topStorySpeedLine: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function studyDate(offsetDays) {
    const d = new Date();
    d.setHours(d.getHours() - 4);
    if (offsetDays) d.setDate(d.getDate() + offsetDays);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function addDays(dateStr, offset) {
    const d = new Date(dateStr + 'T12:00:00');
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function tasksByDate() {
    return readJson(STORE.tasks, {});
  }

  function saveTasks(data) {
    writeJson(STORE.tasks, data);
    writeJson(STORE.taskDataAlias, data);
    afterDataChange();
  }

  function templateSignature(tmpl) {
    if (!tmpl || typeof tmpl !== 'object') return '';
    return [
      tmpl.storyId || '',
      tmpl.subject || '',
      tmpl.type || '',
      tmpl.category || categoryFor(tmpl.type || ''),
      tmpl.plannedAmt ?? '',
      tmpl.unit || '',
      tmpl.plannedMins ?? '',
      tmpl.priority ?? ''
    ].map((value) => String(value).trim()).join('|');
  }

  function templateDeletedIds() {
    const list = readJson(STORE.templateDeleted, []);
    return Array.isArray(list) ? list.map(String) : [];
  }

  function saveTemplateDeletedIds(list) {
    writeJson(STORE.templateDeleted, Array.from(new Set((Array.isArray(list) ? list : []).map(String))).slice(-500));
  }

  function normalizeTemplates(list) {
    const deleted = new Set(templateDeletedIds());
    const bySignature = new Map();
    (Array.isArray(list) ? list : []).forEach((tmpl) => {
      if (!tmpl || deleted.has(String(tmpl.id))) return;
      const signature = templateSignature(tmpl);
      if (!signature || bySignature.has(signature)) return;
      bySignature.set(signature, tmpl);
    });
    return Array.from(bySignature.values());
  }

  function templates() {
    return normalizeTemplates(readJson(STORE.templates, []));
  }

  function deletedIds() {
    const list = readJson(STORE.deleted, []);
    return Array.isArray(list) ? list : [];
  }

  function saveDeletedIds(list) {
    writeJson(STORE.deleted, Array.from(new Set(list)).slice(-1000));
  }

  function rememberDeleted(id) {
    if (!id) return;
    const list = deletedIds();
    list.push(String(id));
    saveDeletedIds(list);
  }

  function saveTemplates(list) {
    writeJson(STORE.templates, normalizeTemplates(list));
    afterDataChange();
  }

  function moveTemplateToFront(id) {
    const list = templates();
    const index = list.findIndex((tmpl) => String(tmpl.id) === String(id));
    if (index <= 0) return;
    const [used] = list.splice(index, 1);
    saveTemplates([used].concat(list));
  }

  function getKP() {
    return parseInt(localStorage.getItem(STORE.kp) || '0', 10) || 0;
  }

  function queueAnalyticsUpdate() {
    if (typeof window.queueKotsuAnalyticsUpdate === 'function') {
      window.queueKotsuAnalyticsUpdate();
    }
  }

  function setKP(value) {
    localStorage.setItem(STORE.kp, String(Math.max(0, value)));
    queueAnalyticsUpdate();
  }

  function addKP(amount) {
    setKP(getKP() + amount);
  }

  function evolutionStagesFor(storyId) {
    const overrides = STORY_EVOLUTION_OVERRIDES[storyId] || [];
    return STORY_EVOLUTION_STAGES.map((stage, idx) => ({ ...stage, ...(overrides[idx] || {}) }));
  }

  function evolutionStageFor(count, storyId) {
    const stages = evolutionStagesFor(storyId);
    return stages.filter((stage) => count >= stage.count).pop() || stages[0];
  }

  function nextEvolutionStage(count, storyId) {
    return evolutionStagesFor(storyId).find((stage) => stage.count > count) || null;
  }

  function completedCountForStory(storyId) {
    const data = tasksByDate();
    let count = 0;
    Object.values(data).forEach((list) => {
      if (!Array.isArray(list)) return;
      list.forEach((task) => {
        if (!task || task.status !== 'done') return;
        if (task.storyId ? task.storyId === storyId : storyId === getCurrentStory()) count += 1;
      });
    });
    return count;
  }

  function storyProgressSnapshot(storyId) {
    const id = storyId || getCurrentStory();
    const count = completedCountForStory(id);
    const stage = evolutionStageFor(count, id);
    const next = nextEvolutionStage(count, id);
    return {
      storyId: id,
      count,
      stage,
      next,
      nextRemaining: next ? Math.max(0, next.count - count) : 0,
      percent: Math.min(100, Math.round(count / 100 * 100))
    };
  }

  function syncStoryProgress(storyId) {
    const snapshot = storyProgressSnapshot(storyId);
    const key = snapshot.storyId || 'default';
    const progress = readJson(STORE.storyProgress, {});
    progress[key] = {
      count: snapshot.count,
      stage: snapshot.stage.count,
      stageName: snapshot.stage.name,
      nextStage: snapshot.next ? snapshot.next.count : null,
      nextRemaining: snapshot.nextRemaining,
      completed100: snapshot.count >= 100,
      updatedAt: new Date().toISOString()
    };
    if (key === 'itachacha') progress.mystery = progress[key];
    writeJson(STORE.storyProgress, progress);

    const unlocked = readJson(STORE.equipmentUnlocked, {});
    const storyUnlocked = unlocked[key] && typeof unlocked[key] === 'object' ? unlocked[key] : {};
    evolutionStagesFor(key).forEach((stage) => {
      if (snapshot.count >= stage.count && !storyUnlocked[stage.count]) {
        storyUnlocked[stage.count] = {
          name: stage.name,
          icon: stage.icon,
          condition: stage.count + 'コツ',
          unlockedAt: new Date().toISOString()
        };
      }
    });
    unlocked[key] = storyUnlocked;
    if (key === 'itachacha') unlocked.mystery = storyUnlocked;
    writeJson(STORE.equipmentUnlocked, unlocked);
    return snapshot;
  }

  function todayTasks() {
    const data = tasksByDate();
    const today = studyDate(0);
    if (!Array.isArray(data[today])) data[today] = [];
    return { data, today, list: data[today] };
  }

  function getCurrentStory() {
    if (window.CUST && window.CUST.storyId) return window.CUST.storyId;
    try {
      const cust = JSON.parse(localStorage.getItem('study-cust') || '{}');
      return cust.storyId || 'samurai';
    } catch (e) {
      return 'samurai';
    }
  }

  function getStoryMeta() {
    const id = getCurrentStory();
    return STORY_META[id] || STORY_META.samurai;
  }

  function topStoryCharacterFor(storyId) {
    return TOP_STORY_CHARACTERS[storyId] || TOP_STORY_CHARACTERS.default;
  }

  function sampleTopStoryLine(lines, previous) {
    if (!Array.isArray(lines) || !lines.length) return '';
    if (lines.length === 1) return lines[0];
    let next = lines[Math.floor(Math.random() * lines.length)];
    if (next === previous) next = lines[(lines.indexOf(next) + 1) % lines.length];
    return next;
  }

  function isStopwatchRunning() {
    const disp = document.getElementById('sw-display');
    const stopBtn = document.getElementById('sw-stop-btn');
    return !!((disp && disp.classList.contains('running')) || (stopBtn && !stopBtn.disabled));
  }

  const RUNNER_SPEED_LINE_CLASSES = [
    'ks-speed-calm',
    'ks-speed-standard',
    'ks-speed-fast',
    'ks-speed-horizontal',
    'ks-speed-horizontal-fast'
  ];

  function nextRunnerSpeedLine(previous) {
    let next = RUNNER_SPEED_LINE_CLASSES[Math.floor(Math.random() * RUNNER_SPEED_LINE_CLASSES.length)];
    if (next === previous) {
      const currentIndex = RUNNER_SPEED_LINE_CLASSES.indexOf(next);
      next = RUNNER_SPEED_LINE_CLASSES[(currentIndex + 1) % RUNNER_SPEED_LINE_CLASSES.length];
    }
    return next;
  }

  function updateRunnerSpeedLine(runner, running) {
    if (!runner) return;
    const now = Date.now();
    if (!running) {
      runner.classList.remove(...RUNNER_SPEED_LINE_CLASSES);
      state.topStorySpeedLine = null;
      return;
    }
    if (!state.topStorySpeedLine || now >= state.topStorySpeedLine.nextAt) {
      const className = nextRunnerSpeedLine(state.topStorySpeedLine && state.topStorySpeedLine.className);
      state.topStorySpeedLine = {
        className,
        nextAt: now + 1800 + Math.floor(Math.random() * 2400)
      };
    }
    runner.classList.remove(...RUNNER_SPEED_LINE_CLASSES);
    runner.classList.add(state.topStorySpeedLine.className);
  }

  function updateTopStoryCharacters() {
    const conf = topStoryCharacterFor(getCurrentStory());
    const running = isStopwatchRunning();
    const storyId = getCurrentStory();
    const commentKey = storyId + ':' + (running ? 'run' : 'idle');
    const now = Date.now();
    if (!state.topStoryComment || state.topStoryComment.key !== commentKey || now >= state.topStoryComment.nextAt) {
      state.topStoryComment = {
        key: commentKey,
        runner: sampleTopStoryLine(running ? conf.runActive : conf.runIdle, state.topStoryComment && state.topStoryComment.runner),
        bouncer: sampleTopStoryLine(conf.bounce, state.topStoryComment && state.topStoryComment.bouncer),
        nextAt: now + (running ? 4200 : 7600)
      };
    }
    const runner = document.querySelector('[data-ks-runner]');
    const runnerChar = document.querySelector('[data-ks-runner-char]');
    const runnerBubble = document.querySelector('[data-ks-runner-bubble]');
    const bouncerChar = document.querySelector('[data-ks-bouncer-char]');
    const bouncerBubble = document.querySelector('[data-ks-bouncer-bubble]');
    if (runner) runner.classList.toggle('is-running', running);
    updateRunnerSpeedLine(runner, running);
    if (runnerChar) runnerChar.dataset.ksKind = conf.kind;
    if (bouncerChar) bouncerChar.dataset.ksKind = conf.kind;
    if (runnerBubble) runnerBubble.textContent = state.topStoryComment.runner;
    if (bouncerBubble) bouncerBubble.textContent = state.topStoryComment.bouncer;
  }

  function scheduleTopStoryBouncer() {
    const bouncer = document.querySelector('[data-ks-bouncer]');
    if (!bouncer) return;
    clearTimeout(state.topStoryBounceTimer);
    const delay = 1800 + Math.floor(Math.random() * 3600);
    state.topStoryBounceTimer = setTimeout(() => {
      const mode = Math.random() < .35 ? 'hop-fast' : 'hop-calm';
      bouncer.classList.remove('hop-calm', 'hop-fast');
      void bouncer.offsetWidth;
      bouncer.classList.add(mode);
      setTimeout(() => bouncer.classList.remove(mode), mode === 'hop-fast' ? 1300 : 1700);
      scheduleTopStoryBouncer();
    }, delay);
  }

  function startTopStoryWatcher() {
    updateTopStoryCharacters();
    scheduleTopStoryBouncer();
    clearInterval(state.topStoryWatchTimer);
    state.topStoryWatchTimer = setInterval(updateTopStoryCharacters, 700);
  }

  function equipmentGroup() {
    const id = getCurrentStory();
    if (STORY_EQUIPMENT[id]) return id;
    if (STORY_SUBJECTS[id]) return 'shikaku';
    return 'samurai';
  }

  function equipmentMetaForStory() {
    const storyEquip = STORY_EQUIPMENT[equipmentGroup()] || {};
    const merged = {};
    Object.keys(CATEGORY_META).forEach((category) => {
      merged[category] = { ...CATEGORY_META[category], ...(storyEquip[category] || {}) };
    });
    return merged;
  }

  function defaultsFor(kind) {
    const id = getCurrentStory();
    if (kind === 'subject') return STORY_SUBJECTS[id] || DEFAULT_SUBJECTS;
    return STORY_TYPES[id] || DEFAULT_TYPES;
  }

  function listKey(kind) {
    const prefix = kind === 'subject' ? STORE.subjectPrefix : STORE.typePrefix;
    return prefix + (getCurrentStory() || 'default');
  }

  function typeCategoryKey() {
    return STORE.typeCategoryPrefix + (getCurrentStory() || 'default');
  }

  function typeCategoryMap() {
    const map = readJson(typeCategoryKey(), {});
    return map && typeof map === 'object' && !Array.isArray(map) ? map : {};
  }

  function saveTypeCategoryMap(map) {
    writeJson(typeCategoryKey(), map || {});
  }

  function getList(kind) {
    const key = listKey(kind);
    const defaults = defaultsFor(kind);
    const saved = readJson(key, null);
    if (!Array.isArray(saved)) return defaults.slice();
    return saved.slice(0, 60);
  }

  function saveList(kind, list) {
    writeJson(listKey(kind), list.slice(0, 60));
  }

  function mru(kind, value) {
    if (!value) return;
    const list = getList(kind).filter((item) => item !== value);
    list.unshift(value);
    saveList(kind, list);
  }

  function categoryFor(type) {
    const t = String(type || '');
    const custom = typeCategoryMap()[t];
    if (custom && CATEGORY_LABELS[custom]) return custom;
    if (/模試|答練|試合/.test(t)) return 'mock';
    if (/講義|視聴|配信|教え|指導/.test(t)) return 'lecture';
    if (/過去問/.test(t)) return 'past';
    if (/復習|整理|充填/.test(t)) return 'review';
    if (/暗記|記憶|座禅|通信/.test(t)) return 'memory';
    if (/テキスト|確認|読|型|ナビ/.test(t)) return 'text';
    if (/問題|演習|計算|仕訳|短答|論文|事例|対策|素振り|稽古|ミッション|鬼/.test(t)) return 'practice';
    return 'other';
  }

  function unitFor(type) {
    const cat = categoryFor(type);
    if (cat === 'text') return 'ページ';
    if (cat === 'lecture' || cat === 'mock' || cat === 'review') return '回';
    if (cat === 'memory') return '個';
    return '問';
  }

  function categoryLabel(category) {
    return CATEGORY_LABELS[category] || CATEGORY_LABELS.other;
  }

  function rankFor(kp) {
    return KP_RANKS.filter((rank) => kp >= rank.min).pop() || KP_RANKS[0];
  }

  function nextRank(rank) {
    const idx = KP_RANKS.indexOf(rank);
    return KP_RANKS[idx + 1] || null;
  }

  // --- スピリット編：能力表の算出（コツ習得データのみ・学習時間は不使用） ---
  function spiritRank(value, bands) {
    const v = Number(value) || 0;
    if (v >= bands[3]) return 'A';
    if (v >= bands[2]) return 'B';
    if (v >= bands[1]) return 'C';
    if (v >= bands[0]) return 'D';
    return 'E';
  }

  function spiritRankAtLeast(rank, min) {
    return SPIRIT_RANK_ORDER.indexOf(rank) >= SPIRIT_RANK_ORDER.indexOf(min);
  }

  // 連続コツ完了日数。今日まだでも前日からの連続は途切らせない。
  function spiritStreak(doneDates) {
    let streak = 0;
    let offset = doneDates.has(studyDate(0)) ? 0 : -1;
    while (doneDates.has(studyDate(offset))) {
      streak += 1;
      offset -= 1;
    }
    return streak;
  }

  // 全ストーリー横断（アカウント全体）で6能力の生値とA〜Eを返す。
  function kotsuSpiritStats() {
    const data = tasksByDate();
    let totalDone = 0;    // 累計コツ（done・全ストーリー）
    let totalActive = 0;  // todo+done（carried は除外）
    let powerDone = 0;    // 演習(practice)系の完了数
    const subjects = new Set();
    const doneDates = new Set();
    Object.keys(data).forEach((date) => {
      const list = Array.isArray(data[date]) ? data[date] : [];
      list.forEach((task) => {
        if (!task || task.status === 'carried') return;
        totalActive += 1;
        if (task.status !== 'done') return;
        totalDone += 1;
        if (task.subject) subjects.add(task.subject);
        if ((task.category || categoryFor(task.type)) === 'practice') powerDone += 1;
        doneDates.add(date);
      });
    });
    const last7 = completedCountBetween(dateObject(studyDate(-6)), dateObject(studyDate(0)));
    const raw = {
      power: powerDone,
      speed: last7 / 7,
      range: subjects.size,
      stamina: spiritStreak(doneDates),
      precision: totalActive ? (totalDone / totalActive * 100) : 0,
      growth: getKP()
    };
    const ranks = {};
    SPIRIT_ABILITIES.forEach((ability) => {
      ranks[ability.key] = spiritRank(raw[ability.key], ability.bands);
    });
    return { raw, ranks, totalDone, level: Math.floor(totalDone / 100) };
  }

  function spiritUnlockMet(sp, stats) {
    if (sp.unlock.type === 'reach100') return stats.totalDone >= 100;
    if (sp.unlock.type === 'abilityB') return spiritRankAtLeast(stats.ranks[sp.unlock.ability], 'B');
    if (sp.unlock.type === 'allA') return SPIRIT_ABILITIES.every((a) => stats.ranks[a.key] === 'A');
    return false;
  }

  function readSpiritStore() {
    const store = readJson(STORE.spirits, {});
    if (!store || typeof store !== 'object') return { unlocked: {}, level: 0, titles: [] };
    if (!store.unlocked || typeof store.unlocked !== 'object') store.unlocked = {};
    if (!Array.isArray(store.titles)) store.titles = [];
    if (typeof store.level !== 'number') store.level = 0;
    return store;
  }

  // 解放・進行を記録（永久保持）。スピリット編は累計100コツで解放。
  // 新規に解放したスピリット配列・最新statsを返す。
  function syncSpirits() {
    const stats = kotsuSpiritStats();
    const store = readSpiritStore();
    const newlyUnlocked = [];
    // 100未到達・未解放なら何も保存しない（キーを汚さない）
    if (stats.totalDone < 100 && !Object.keys(store.unlocked).length) {
      return { stats, store, newlyUnlocked };
    }
    if (stats.totalDone >= 100) {
      KOTSU_SPIRITS.forEach((sp) => {
        if (store.unlocked[sp.id]) return;
        if (spiritUnlockMet(sp, stats)) {
          store.unlocked[sp.id] = { unlockedAt: new Date().toISOString() };
          newlyUnlocked.push(sp);
        }
      });
    }
    store.level = stats.level;
    store.titles = SPIRIT_TITLES.filter((t) => stats.totalDone >= t.min).map((t) => t.min);
    store.updatedAt = new Date().toISOString();
    writeJson(STORE.spirits, store);
    return { stats, store, newlyUnlocked };
  }

  // 既存の100到達済みユーザー向け：初回だけ「スピリット編 解放」を案内（1回限り）
  function maybeShowSpiritIntro() {
    const result = syncSpirits();
    if (result.stats.totalDone < 100) return;
    const store = result.store;
    const pending = KOTSU_SPIRITS.filter((sp) => store.unlocked[sp.id] && !store.unlocked[sp.id].announcedAt);
    if (!pending.length) return;
    if (!readJson(STORE.spiritIntroSeen, false)) writeJson(STORE.spiritIntroSeen, true);
    playSpiritTheater(pending, { record: true });
  }

  function calcTaskKP(task) {
    let kp = 10;
    if (Number(task.actualAmt) > 0) kp += Math.floor(Number(task.actualAmt));
    if (Number(task.actualMins) > 0) kp += Math.floor(Number(task.actualMins) * .5);
    return kp;
  }

  function taskTimestamp(task) {
    return Date.parse(task?.updatedAt || task?.completedAt || task?.createdAt || '') || 0;
  }

  function touchTask(task) {
    task.updatedAt = new Date().toISOString();
    return task;
  }

  function afterDataChange() {
    syncStoryProgress();
    syncSpirits();
    updateButtonSummary();
    if (typeof window.saveToCloud === 'function') window.saveToCloud();
    queueAnalyticsUpdate();
  }

  function notify(message, isError) {
    if (typeof window.showToast === 'function') {
      window.showToast(message, !!isError);
      return;
    }
    console.log(message);
  }

  function mount() {
    if (state.mounted) return;
    const root = document.createElement('div');
    root.id = 'ks-task-root';
    root.innerHTML = `
      <div class="ks-task-sheet" id="ks-task-sheet" aria-hidden="true">
        <div class="ks-task-panel" role="dialog" aria-modal="true" aria-label="コツ習慣">
          <div class="ks-task-header">
            <div class="ks-task-title-row">
              <div class="ks-task-title">📋 コツ習慣</div>
              <button class="ks-task-save-close" type="button" data-ks-action="save-close">💾 保存して閉じる</button>
              <div class="ks-task-title-actions">
                <span class="ks-task-version">v108</span>
                <button class="ks-task-close" type="button" data-ks-action="close">×</button>
              </div>
            </div>
            <div class="ks-task-kp">
              <div class="ks-task-kp-top">
                <div class="ks-task-kp-rank"><span id="ks-task-kp-icon">🌱</span><span id="ks-task-kp-rank">コツ見習い</span></div>
                <div id="ks-task-kp-text">0 KP</div>
              </div>
              <div class="ks-task-track"><div class="ks-task-fill" id="ks-task-kp-fill"></div></div>
            </div>
          </div>
          <div class="ks-task-tabs">
            <button class="ks-task-tab is-active" type="button" data-ks-tab="today">今日のコツ</button>
            <button class="ks-task-tab" type="button" data-ks-tab="equip">装備</button>
            <button class="ks-task-tab" type="button" data-ks-tab="stats">記録</button>
          </div>
          <div class="ks-task-body">
            <section class="ks-task-page is-active" id="ks-task-page-today"></section>
            <section class="ks-task-page" id="ks-task-page-equip"></section>
            <section class="ks-task-page" id="ks-task-page-stats"></section>
          </div>
        </div>
      </div>
      <div class="ks-task-picker-overlay" id="ks-task-picker-overlay">
        <div class="ks-task-modal">
          <div class="ks-task-modal-head">
            <div class="ks-task-modal-title" id="ks-task-picker-title">選択</div>
            <button class="ks-task-close" type="button" data-ks-action="picker-close">×</button>
          </div>
          <div class="ks-task-modal-body">
            <div class="ks-task-choice-list" id="ks-task-choice-list"></div>
          </div>
          <div class="ks-task-new-row">
            <input class="ks-task-input" id="ks-task-new-choice" maxlength="32" placeholder="新しく追加">
            <button class="ks-task-small-btn" type="button" data-ks-action="picker-add">追加</button>
          </div>
        </div>
      </div>
      <div class="ks-task-detail-overlay" id="ks-task-detail-overlay">
        <div class="ks-task-modal">
          <div class="ks-task-modal-head">
            <div>
              <div class="ks-task-card-subj" id="ks-task-detail-subj"></div>
              <div class="ks-task-modal-title" id="ks-task-detail-title"></div>
            </div>
            <button class="ks-task-close" type="button" data-ks-action="detail-close">×</button>
          </div>
          <div class="ks-task-modal-body">
            <div class="ks-task-detail-grid">
              <div class="ks-task-field"><div class="ks-task-label">予定量</div><input class="ks-task-input" id="ks-task-detail-plan-amt" type="number" min="0"></div>
              <div class="ks-task-field"><div class="ks-task-label">単位</div><input class="ks-task-input" id="ks-task-detail-unit" maxlength="12"></div>
              <div class="ks-task-field"><div class="ks-task-label">実績量</div><input class="ks-task-input" id="ks-task-detail-actual-amt" type="number" min="0"></div>
              <div class="ks-task-field"><div class="ks-task-label">予定分</div><input class="ks-task-input" id="ks-task-detail-plan-mins" type="number" min="0"></div>
              <div class="ks-task-field"><div class="ks-task-label">実績分</div><input class="ks-task-input" id="ks-task-detail-actual-mins" type="number" min="0"></div>
            </div>
          </div>
          <div class="ks-task-detail-actions">
            <button class="ks-task-add-btn" type="button" data-ks-action="detail-save">保存</button>
            <button class="ks-task-small-btn" type="button" data-ks-action="detail-close">キャンセル</button>
          </div>
        </div>
      </div>
      <div class="ks-task-add-confirm-overlay" id="ks-task-add-confirm-overlay">
        <div class="ks-task-modal ks-task-add-confirm-modal">
          <div class="ks-task-modal-head">
            <div>
              <div class="ks-task-card-subj" id="ks-task-add-confirm-subj"></div>
              <div class="ks-task-modal-title" id="ks-task-add-confirm-title"></div>
            </div>
            <button class="ks-task-close" type="button" data-ks-action="add-confirm-close">×</button>
          </div>
          <div class="ks-task-modal-body" id="ks-task-add-confirm-body"></div>
        </div>
      </div>
      <div class="ks-task-rename-overlay" id="ks-task-rename-overlay">
        <div class="ks-task-modal">
          <div class="ks-task-modal-head">
            <div>
              <div class="ks-task-card-subj" id="ks-task-rename-sub">選択肢を変更</div>
              <div class="ks-task-modal-title" id="ks-task-rename-title">名前を変更</div>
            </div>
            <button class="ks-task-close" type="button" data-ks-action="rename-close">×</button>
          </div>
          <div class="ks-task-modal-body">
            <div class="ks-task-field">
              <div class="ks-task-label">新しい名前</div>
              <input class="ks-task-input" id="ks-task-rename-input" maxlength="32">
            </div>
          </div>
          <div class="ks-task-detail-actions">
            <button class="ks-task-add-btn" type="button" data-ks-action="rename-save">変更する</button>
            <button class="ks-task-small-btn" type="button" data-ks-action="rename-close">キャンセル</button>
          </div>
        </div>
      </div>
      <div class="ks-task-float" id="ks-task-float">
        <div class="ks-task-float-char" id="ks-task-float-char">🌸</div>
        <div>
          <div class="ks-task-float-msg" id="ks-task-float-msg">コツを積みました</div>
          <div class="ks-task-float-kp" id="ks-task-float-kp">+10 KP</div>
        </div>
      </div>
      <div class="ks-spirit-theater" id="ks-spirit-theater" aria-hidden="true">
        <div class="ks-spirit-theater-flash" id="ks-spirit-theater-flash"></div>
        <div class="ks-spirit-theater-sparks" id="ks-spirit-theater-sparks"></div>
        <div class="ks-spirit-theater-stage">
          <img class="ks-spirit-theater-egg" id="ks-spirit-theater-egg" src="" alt="" onerror="this.style.visibility='hidden';">
          <div class="ks-spirit-theater-lineup" id="ks-spirit-theater-lineup"></div>
          <div class="ks-spirit-theater-title" id="ks-spirit-theater-title"></div>
          <div class="ks-spirit-theater-sub" id="ks-spirit-theater-sub"></div>
        </div>
        <button class="ks-spirit-theater-skip" type="button">スキップ ▶</button>
      </div>
    `;
    document.body.appendChild(root);
    bindEvents(root);
    const theater = $('ks-spirit-theater');
    if (theater) theater.addEventListener('click', closeSpiritTheater);
    state.mounted = true;
    syncStoryProgress();
    updateButtonSummary();
  }

  function bindEvents(root) {
    root.addEventListener('click', function (event) {
      const actionEl = event.target.closest('[data-ks-action]');
      const tabEl = event.target.closest('[data-ks-tab]');
      const choiceMain = event.target.closest('[data-ks-choice]');
      const choiceDel = event.target.closest('[data-ks-delete-choice]');
      const choiceRename = event.target.closest('[data-ks-rename-choice]');
      const taskEl = event.target.closest('[data-ks-task]');
      const templateEl = event.target.closest('[data-ks-template]');

      if (event.target.id === 'ks-task-sheet') close();
      if (event.target.id === 'ks-task-picker-overlay') closePicker();
      if (event.target.id === 'ks-task-detail-overlay') closeDetail();
      if (event.target.id === 'ks-task-add-confirm-overlay') closeAddConfirm();
      if (event.target.id === 'ks-task-rename-overlay') closeRename();

      if (tabEl) {
        setPage(tabEl.dataset.ksTab);
        return;
      }

      if (choiceDel) {
        deleteChoice(choiceDel.dataset.ksDeleteChoice);
        return;
      }

      if (choiceRename) {
        renameChoice(choiceRename.dataset.ksRenameChoice);
        return;
      }

      if (choiceMain) {
        selectChoice(choiceMain.dataset.ksChoice);
        return;
      }

      if (templateEl) {
        const template = templates().find((item) => String(item.id) === String(templateEl.dataset.ksTemplate));
        if (template) {
          moveTemplateToFront(template.id);
          addTask(template);
        }
        return;
      }

      if (taskEl) {
        const id = taskEl.dataset.ksTask;
        if (event.target.closest('[data-ks-task-toggle]')) toggleDone(id);
        if (event.target.closest('[data-ks-task-detail]')) openDetail(id);
        if (event.target.closest('[data-ks-task-delete]')) deleteTask(id);
        if (event.target.closest('[data-ks-task-move]')) moveTask(id, event.target.closest('[data-ks-task-move]').dataset.ksTaskMove);
        return;
      }

      if (!actionEl) return;
      const action = actionEl.dataset.ksAction;
      if (action === 'close') close();
      if (action === 'save-close') saveAndClose();
      if (action === 'picker-close') closePicker();
      if (action === 'picker-add') addChoice();
      if (action === 'detail-close') closeDetail();
      if (action === 'detail-save') saveDetail();
      if (action === 'add-confirm-close') closeAddConfirm();
      if (action === 'add-confirm-add') addTask();
      if (action === 'add-confirm-save-add') saveTemplateAndAddTask();
      if (action === 'rename-close') closeRename();
      if (action === 'rename-save') saveRenameChoice();
      if (action === 'pick-subject') openPicker('subject');
      if (action === 'pick-type') openPicker('type');
      if (action === 'add-task') openAddConfirm();
      if (action === 'toggle-add-details') toggleAddDetails();
      if (action === 'save-template') saveTemplate();
      if (action === 'carry-all') carryAll();
      if (action === 'accept-carry') acceptCarry();
      if (action === 'toggle-done-list') toggleDoneList();
      if (action === 'delete-template') deleteTemplate(actionEl.dataset.id);
      if (action === 'priority') setPriority(Number(actionEl.dataset.priority));
      if (action === 'open-story-settings') openStorySettings();
      if (action === 'open-spirit-codex') setPage('equip');
      if (action === 'spirit-replay') {
        const sp = spiritById(actionEl.dataset.id);
        if (sp) playSpiritTheater([sp], { record: false });
      }
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if ($('ks-task-add-confirm-overlay').classList.contains('is-open')) closeAddConfirm();
        else if ($('ks-task-detail-overlay').classList.contains('is-open')) closeDetail();
        else if ($('ks-task-picker-overlay').classList.contains('is-open')) closePicker();
        else close();
      }
      if (event.key === 'Enter' && $('ks-task-picker-overlay').classList.contains('is-open')) {
        addChoice();
      }
    });
  }

  function open() {
    mount();
    state.open = true;
    $('ks-task-sheet').classList.add('is-open');
    $('ks-task-sheet').setAttribute('aria-hidden', 'false');
    render();
    maybeShowSpiritIntro();
  }

  function close() {
    if (!$('ks-task-sheet')) return;
    state.open = false;
    $('ks-task-sheet').classList.remove('is-open');
    $('ks-task-sheet').setAttribute('aria-hidden', 'true');
    closePicker();
    closeDetail();
    closeAddConfirm();
  }

  function openStorySettings() {
    close();
    if (typeof window.openCustPanel === 'function') {
      window.openCustPanel();
      setTimeout(() => {
        const target = document.querySelector('[data-story-card="' + getCurrentStory() + '"]') || document.querySelector('[data-story-card]');
        if (target && typeof target.scrollIntoView === 'function') target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
      return;
    }
    notify('メイン設定からストーリーを変更できます');
  }

  function saveAndClose() {
    afterDataChange();
    notify('保存しました');
    close();
  }

  function setPage(page) {
    state.page = page;
    document.querySelectorAll('.ks-task-tab').forEach((btn) => btn.classList.toggle('is-active', btn.dataset.ksTab === page));
    document.querySelectorAll('.ks-task-page').forEach((el) => el.classList.toggle('is-active', el.id === 'ks-task-page-' + page));
    render();
  }

  function render() {
    if (!state.mounted) return;
    renderKP();
    if (state.page === 'today') renderToday();
    if (state.page === 'equip') renderEquip();
    if (state.page === 'stats') renderStats();
    syncStoryProgress();
    updateButtonSummary();
  }

  function renderKP() {
    const kp = getKP();
    const rank = rankFor(kp);
    const next = nextRank(rank);
    $('ks-task-kp-icon').textContent = rank.icon;
    $('ks-task-kp-rank').textContent = rank.name;
    $('ks-task-kp-text').textContent = kp.toLocaleString() + ' KP';
    if (next) {
      const pct = Math.max(0, Math.min(100, Math.round((kp - rank.min) / (next.min - rank.min) * 100)));
      $('ks-task-kp-fill').style.width = pct + '%';
    } else {
      $('ks-task-kp-fill').style.width = '100%';
    }
  }

  function taskFallbackOrder(task) {
    const created = Date.parse(task.createdAt || task.updatedAt || '') || 0;
    return (Number(task.priority) || 3) * 10000000000000 + created;
  }

  function taskOrderValue(task) {
    return Number.isFinite(Number(task.sortOrder)) ? Number(task.sortOrder) : taskFallbackOrder(task);
  }

  function compareTaskOrder(a, b) {
    const order = taskOrderValue(a) - taskOrderValue(b);
    if (order) return order;
    return taskFallbackOrder(a) - taskFallbackOrder(b);
  }

  function normalizeTodoOrder(list) {
    const todo = list.filter((task) => task.status === 'todo').sort(compareTaskOrder);
    todo.forEach((task, idx) => {
      task.sortOrder = (idx + 1) * 1000;
    });
  }

  function assignTaskOrder(list, task) {
    const todo = list.filter((item) => item !== task && item.status === 'todo').sort(compareTaskOrder);
    if (!todo.length) {
      task.sortOrder = 1000;
      return;
    }
    const insertAt = todo.findIndex((item) => (Number(item.priority) || 3) > (Number(task.priority) || 3));
    const before = insertAt === -1 ? todo[todo.length - 1] : todo[insertAt - 1];
    const after = insertAt === -1 ? null : todo[insertAt];
    const beforeOrder = before ? taskOrderValue(before) : 0;
    const afterOrder = after ? taskOrderValue(after) : beforeOrder + 2000;
    task.sortOrder = (beforeOrder + afterOrder) / 2;
  }

  function renderToday() {
    const { list } = todayTasks();
    const active = list.filter((task) => task.status !== 'carried');
    const todo = active.filter((task) => task.status !== 'done').sort(compareTaskOrder);
    const done = active.filter((task) => task.status === 'done').sort((a, b) => String(b.completedAt || '').localeCompare(String(a.completedAt || '')));
    const doneMins = done.reduce((sum, task) => sum + (Number(task.actualMins) || 0), 0);
	    const pct = active.length ? Math.round(done.length / active.length * 100) : 0;
	    const carryCount = carryCandidates().length;
    const story = getStoryMeta();
      const evolution = syncStoryProgress();
	    const selectedCategory = categoryFor(state.selectedType);

	    $('ks-task-page-today').innerHTML = `
      ${renderStoryEvolutionCompact(story, evolution)}
      ${carryCount ? `<div class="ks-task-story"><div class="ks-task-story-char">🔄</div><div style="flex:1"><div class="ks-task-story-name">昨日の未完了が ${carryCount} 件あります</div><div class="ks-task-story-msg">今日に取り込めます</div></div><button class="ks-task-small-btn" type="button" data-ks-action="accept-carry">今日へ</button></div>` : ''}
      <div class="ks-task-summary">
        <div class="ks-task-summary-item"><div class="ks-task-summary-num">${active.length}</div><div class="ks-task-summary-label">合計</div></div>
        <div class="ks-task-summary-item"><div class="ks-task-summary-num" style="color:var(--checked)">${done.length}</div><div class="ks-task-summary-label">完了</div></div>
        <div class="ks-task-summary-item"><div class="ks-task-summary-num">${todo.length}</div><div class="ks-task-summary-label">残り</div></div>
        <div class="ks-task-summary-item"><div class="ks-task-summary-num" style="color:var(--accent)">${pct}%</div><div class="ks-task-summary-label">達成率</div></div>
      </div>
      <div class="ks-task-track" style="margin:-4px 0 10px"><div class="ks-task-fill" style="width:${pct}%"></div></div>
      <div class="ks-task-add cat-${escapeHtml(selectedCategory)}">
        <div class="ks-task-add-title">今日のコツを追加</div>
        <div class="ks-task-template-head">
          <div>
            <div class="ks-task-template-title">保存済みコツ</div>
            <div class="ks-task-template-sub">よく使うコツはワンタップで追加できます</div>
          </div>
        </div>
        <div class="ks-task-template-strip">${renderTemplates()}</div>
        <div class="ks-task-manual-flow">
          <div class="ks-task-add-sub">科目と種類を選んで、最後に内容を確認します</div>
          <div class="ks-task-add-row">
            <button class="ks-task-picker ${state.selectedSubject ? 'has-value' : ''}" type="button" data-ks-action="pick-subject"><span class="ks-task-step-num">①</span>${escapeHtml(state.selectedSubject || '科目')}</button>
            <button class="ks-task-picker ${state.selectedType ? 'has-value' : ''}" type="button" data-ks-action="pick-type"><span class="ks-task-step-num">②</span>${escapeHtml(state.selectedType || '種類')}</button>
            <button class="ks-task-add-btn" type="button" data-ks-action="add-task"><span class="ks-task-step-num">③</span>確認</button>
          </div>
        </div>
      </div>
      <div class="ks-task-section-head"><span>未完了 <span style="color:var(--accent)">${todo.length}</span> 件</span><button class="ks-task-small-btn" type="button" data-ks-action="carry-all">全部→明日</button></div>
      <div class="ks-task-list">${todo.length ? todo.map(renderTaskCard).join('') : '<div class="ks-task-empty">今日のコツを積んでみましょう</div>'}</div>
      <button class="ks-task-small-btn" type="button" data-ks-action="toggle-done-list" style="width:100%;margin-top:10px">完了したコツ（${done.length}件）</button>
      <div class="ks-task-list" id="ks-task-done-list" style="display:none;margin-top:7px">${done.map(renderTaskCard).join('') || '<div class="ks-task-empty">完了コツはまだありません</div>'}</div>
      ${doneMins ? `<div class="ks-task-story" style="margin-top:10px"><div class="ks-task-story-char">⏱</div><div><div class="ks-task-story-name">今日のタスク実績 ${doneMins}分</div><div class="ks-task-story-msg">学習時間本体とは別集計です</div></div></div>` : ''}
    `;
  }

  function renderStoryEvolutionCompact(story, snapshot) {
    // 100コツ到達後は、ストーリー進化帯を「スピリット・コレクション」に差し替える
    if (snapshot.count >= 100) {
      return renderSpiritCollectionStrip();
    }
    const stage = snapshot.stage;
    const nextText = snapshot.next
      ? `次の進化まであと ${snapshot.nextRemaining} コツ`
      : '100コツに到達しました';
    return `
      <div class="ks-task-evolution-row">
        <div class="ks-task-story-mini">
          <div class="ks-task-evo-label">ストーリー</div>
          <button class="ks-task-story-pill" type="button" data-ks-action="open-story-settings">
            <span class="ks-task-story-pill-icon">${escapeHtml(story.icon)}</span>
            <span class="ks-task-story-pill-name">${escapeHtml(shortStoryName(story.name))}</span>
          </button>
          <button class="ks-task-story-change" type="button" data-ks-action="open-story-settings">変更</button>
        </div>
        <div class="ks-task-evolution-strip">
          <div class="ks-task-evo-visual">
            <img src="${escapeHtml(stage.image)}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <div class="ks-task-evo-fallback">${escapeHtml(stage.icon)}</div>
          </div>
          <div class="ks-task-evo-main">
            <div class="ks-task-evo-label">ストーリー進化</div>
            <div class="ks-task-evo-top">
              <div class="ks-task-evo-name">${escapeHtml(stage.name)}</div>
              <div class="ks-task-evo-count">${Math.min(snapshot.count, 100)}/100</div>
            </div>
            <div class="ks-task-track"><div class="ks-task-fill" style="width:${snapshot.percent}%"></div></div>
            <div class="ks-task-evo-msg">${escapeHtml(nextText)}</div>
          </div>
          <div class="ks-task-evo-next">
            <div class="ks-task-evo-next-num">${snapshot.next ? snapshot.nextRemaining : 'OK'}</div>
            <div class="ks-task-evo-next-label">${snapshot.next ? '次まで' : '到達'}<br>コツ</div>
          </div>
        </div>
      </div>
    `;
  }

  // 100コツ到達後の進化帯。集めたスピリット8体を全幅で一覧表示する。
  // 帯全体がタップ可能で、装備タブのスピリット名鑑へ移動する。
  function renderSpiritCollectionStrip() {
    const store = readSpiritStore();
    const unlocked = store.unlocked || {};
    const total = KOTSU_SPIRITS.length;
    const gotCount = KOTSU_SPIRITS.filter((sp) => unlocked[sp.id]).length;
    const isComplete = gotCount >= total;
    const chips = KOTSU_SPIRITS.map((sp) => {
      const got = !!unlocked[sp.id];
      // 未解放はプレビューに合わせて実画像をグレー表示（CSS側で .is-locked を処理）
      return `
        <div class="ks-task-spirit-chip ${got ? 'is-open' : 'is-locked'}">
          <img src="${escapeHtml(sp.image)}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
          <div class="ks-task-spirit-chip-fallback">${got ? escapeHtml(sp.icon) : ''}</div>
        </div>`;
    }).join('');
    return `
      <div class="ks-task-spirit-collection" role="button" tabindex="0" data-ks-action="open-spirit-codex">
        <div class="ks-task-spirit-collection-head">
          <span class="ks-task-spirit-collection-title">スピリット <span class="ks-task-spirit-collection-count ${isComplete ? 'is-complete' : ''}">${gotCount} / ${total} 体${isComplete ? ' ✓' : ''}</span></span>
        </div>
        <div class="ks-task-spirit-collection-grid">${chips}</div>
      </div>
      <div class="ks-task-evolution-complete">100コツ到達。コツを積むほどスピリットが集まります。詳しくは装備タブの名鑑へ。</div>
    `;
  }

  function shortStoryName(name) {
    return String(name || 'ストーリー').replace(/成長記|の道|の旅|の特訓|試験|合格への道|への挑戦/g, '').slice(0, 6) || 'ストーリー';
  }

  function renderTemplates() {
    const list = templates();
    if (!list.length) return '<span class="ks-task-template">テンプレなし</span>';
    return list.map((tmpl) => {
      const cat = tmpl.category || categoryFor(tmpl.type || '');
      const label = categoryLabel(cat);
      return `
      <span class="ks-task-template cat-${escapeHtml(cat)}">
        <button type="button" data-ks-template="${escapeHtml(tmpl.id)}"><span class="ks-task-template-icon">${escapeHtml(label.icon)}</span>${escapeHtml(tmpl.subject)} / ${escapeHtml(tmpl.type)}</button>
        <button type="button" data-ks-action="delete-template" data-id="${escapeHtml(tmpl.id)}">×</button>
      </span>
    `;
    }).join('');
  }

	  function renderTaskCard(task) {
	    const meta = [];
	    const category = task.category || categoryFor(task.type);
	    const label = categoryLabel(category);
	    if (task.plannedAmt && task.unit) meta.push(`予定 ${escapeHtml(task.plannedAmt)}${escapeHtml(task.unit)}`);
    if (task.actualAmt != null && task.unit) meta.push(`実績 ${escapeHtml(task.actualAmt)}${escapeHtml(task.unit)}`);
    if (task.plannedMins) meta.push(`予定 ${escapeHtml(task.plannedMins)}分`);
    if (task.actualMins != null) meta.push(`実績 ${escapeHtml(task.actualMins)}分`);
    if (task.carried) meta.push('繰越');
	    if (task.earnedKP) meta.push(`+${escapeHtml(task.earnedKP)} KP`);
	    return `
	      <div class="ks-task-card cat-${escapeHtml(category)} pri-${escapeHtml(task.priority || 3)} ${task.status === 'done' ? 'is-done' : ''}" data-ks-task="${escapeHtml(task.id)}">
	        <div class="ks-task-card-top">
	          <button class="ks-task-check" type="button" data-ks-task-toggle>${task.status === 'done' ? '習得済' : '習得'}</button>
	          <div class="ks-task-card-main">
	            <div class="ks-task-card-subj"><span class="ks-task-category-dot">${escapeHtml(label.icon)}</span>${escapeHtml(task.subject || '未分類')}</div>
            <div class="ks-task-card-type">${escapeHtml(task.type)}</div>
            ${meta.length ? `<div class="ks-task-card-meta">${meta.map((item) => `<span class="ks-task-chip ${/KP/.test(item) ? 'kp' : ''}">${item}</span>`).join('')}</div>` : ''}
          </div>
          <div class="ks-task-card-actions">
            ${task.status === 'todo' ? '<button class="ks-task-icon-btn" type="button" data-ks-task-move="up" title="上へ">↑</button><button class="ks-task-icon-btn" type="button" data-ks-task-move="down" title="下へ">↓</button>' : ''}
            <button class="ks-task-icon-btn" type="button" data-ks-task-detail title="詳細">✏️</button>
            <button class="ks-task-icon-btn" type="button" data-ks-task-delete title="削除">×</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderEquip() {
    const story = getStoryMeta();
    const equipment = equipmentMetaForStory();
    const counts = categoryCounts();
    const evolution = syncStoryProgress();
    const spiritStats = kotsuSpiritStats();
    const spiritStore = readSpiritStore();
    const rows = Object.entries(equipment).map(([category, meta]) => {
      const count = counts[category] || 0;
      const level = equipLevel(count);
      return `
        <div class="ks-task-equip-card cat-${escapeHtml(category)}">
          <div class="ks-task-equip-top">
            <div class="ks-task-equip-icon">${escapeHtml(meta.icon)}</div>
            <div style="flex:1;min-width:0">
              <div class="ks-task-equip-name">${escapeHtml(meta.name)} <span style="color:${meta.color}">${level.stars}</span></div>
              <div class="ks-task-equip-sub">完了 ${count}件 / ${level.next ? '次まであと ' + (level.next - count) + '件' : '最大強化'}</div>
              <div class="ks-task-track"><div class="ks-task-fill" style="width:${level.progress}%;background:${meta.color}"></div></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
    $('ks-task-page-equip').innerHTML = `
      <div class="ks-task-equip-story">
        <div class="ks-task-story-char">${escapeHtml(story.icon)}</div>
        <div>
          <div class="ks-task-story-name">${escapeHtml(story.name)}の装備</div>
          <div class="ks-task-story-msg">現在のストーリーに合わせて育ちます</div>
        </div>
      </div>
      ${renderStoryEvolutionCodex(evolution)}
      ${renderSpiritCodex(spiritStats, spiritStore)}
      <div class="ks-task-equip-grid">${rows}</div>
    `;
  }

  function renderStoryEvolutionCodex(snapshot) {
    const unlocked = (readJson(STORE.equipmentUnlocked, {})[snapshot.storyId]) || {};
    return `
      <div class="ks-task-codex">
        <div class="ks-task-section-head" style="margin-top:0">
          <span>ストーリー進化図鑑</span>
          <span style="color:var(--accent)">${snapshot.count}コツ</span>
        </div>
        <div class="ks-task-codex-list">
          ${evolutionStagesFor(snapshot.storyId).map((stage) => {
            const isOpen = snapshot.count >= stage.count;
            const isCurrent = snapshot.stage.count === stage.count;
            const item = unlocked[stage.count] || null;
            const date = item && item.unlockedAt ? item.unlockedAt.slice(0, 10) : '';
            return `
              <div class="ks-task-codex-row ${isOpen ? 'is-open' : 'is-locked'} ${isCurrent ? 'is-current' : ''}">
                <div class="ks-task-codex-icon">${isOpen ? escapeHtml(stage.icon) : '？'}</div>
                <div class="ks-task-codex-main">
                  <div class="ks-task-codex-name">${escapeHtml(stage.name)}${isCurrent ? '<span>装備中</span>' : ''}</div>
                  <div class="ks-task-codex-desc">${escapeHtml(stage.desc)}</div>
                  <div class="ks-task-codex-meta">解放条件 ${stage.count}コツ${date ? ' / 解放日 ' + escapeHtml(date) : ''}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // --- スピリット名鑑（100到達後の第二部） ---
  function spiritAbilityFill(rank) {
    return (SPIRIT_RANK_ORDER.indexOf(rank) + 1) / SPIRIT_RANK_ORDER.length * 100;
  }

  function spiritUnlockLabel(sp) {
    if (sp.unlock.type === 'reach100') return '100コツ到達';
    if (sp.unlock.type === 'allA') return '全能力 A';
    if (sp.unlock.type === 'abilityB') {
      const ab = SPIRIT_ABILITIES.find((a) => a.key === sp.unlock.ability);
      return (ab ? ab.name : '') + ' B以上';
    }
    return '';
  }

  function renderSpiritCodex(stats, store) {
    const unlocked = store.unlocked || {};
    const edition = stats.totalDone >= 100;
    const remaining = Math.max(0, 100 - stats.totalDone);
    const titleList = SPIRIT_TITLES.filter((t) => (store.titles || []).indexOf(t.min) >= 0);
    const abilityRows = SPIRIT_ABILITIES.map((a) => {
      const rank = stats.ranks[a.key];
      return `
        <div class="ks-spirit-ability">
          <div class="ks-spirit-ability-name">${escapeHtml(a.name)}<span>${escapeHtml(a.note)}</span></div>
          <div class="ks-task-track"><div class="ks-task-fill" style="width:${spiritAbilityFill(rank)}%"></div></div>
          <div class="ks-spirit-ability-rank rank-${escapeHtml(rank)}">${escapeHtml(rank)}</div>
        </div>`;
    }).join('');
    const cards = KOTSU_SPIRITS.map((sp) => {
      const got = unlocked[sp.id];
      const date = got && got.unlockedAt ? got.unlockedAt.slice(0, 10) : '';
      const img = got ? sp.image : SPIRIT_LOCKED_IMAGE;
      return `
        <div class="ks-spirit-card ${got ? 'is-open' : 'is-locked'}">
          <div class="ks-spirit-icon">
            <img src="${escapeHtml(img)}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
            <div class="ks-spirit-icon-fallback">${got ? escapeHtml(sp.icon) : '？'}</div>
          </div>
          <div class="ks-spirit-main">
            <div class="ks-spirit-name">${got ? escapeHtml(sp.name) : '？？？'}</div>
            <div class="ks-spirit-desc">${got ? escapeHtml(sp.desc) : '未解放'}</div>
            <div class="ks-spirit-meta">解放条件 ${escapeHtml(spiritUnlockLabel(sp))}${date ? ' / 解放日 ' + escapeHtml(date) : ''}</div>
            ${got ? `<button class="ks-spirit-replay" type="button" data-ks-action="spirit-replay" data-id="${escapeHtml(sp.id)}">▶ もう一度見る</button>` : ''}
          </div>
        </div>`;
    }).join('');
    return `
      <div class="ks-task-codex ks-spirit-codex">
        <div class="ks-task-section-head" style="margin-top:0">
          <span>🌌 スピリット名鑑</span>
          <span style="color:var(--accent)">${edition ? '覚醒Lv ' + store.level : 'あと' + remaining + 'コツ'}</span>
        </div>
        ${edition ? `<img class="ks-spirit-banner" src="${escapeHtml(SPIRIT_BANNER_IMAGE)}" alt="スピリット編" onerror="this.style.display='none';">` : `<div class="ks-spirit-teaser">あと ${remaining} コツで第二部「スピリット編」が解放されます。</div>`}
        <div class="ks-spirit-abilities">${abilityRows}</div>
        <div class="ks-spirit-note">能力は現在の調子で変動します。一度解放したスピリット・称号は消えません。</div>
        ${titleList.length ? `<div class="ks-spirit-titles">${titleList.map((t) => `<span class="ks-spirit-title"><span class="ks-spirit-title-badge"><img src="${escapeHtml(t.image)}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';"><span class="ks-spirit-title-fallback">${escapeHtml(t.icon)}</span></span>${escapeHtml(t.name)}</span>`).join('')}</div>` : ''}
        <div class="ks-spirit-cards">${cards}</div>
      </div>
    `;
  }

  function renderStats() {
    const data = tasksByDate();
    const dates = [];
    for (let i = 6; i >= 0; i--) dates.push(studyDate(-i));
    const all = dates.flatMap((date) => (data[date] || []).filter((task) => task.status !== 'carried'));
    const done = all.filter((task) => task.status === 'done');
    const minutes = done.reduce((sum, task) => sum + (Number(task.actualMins) || 0), 0);
    const kp = done.reduce((sum, task) => sum + (Number(task.earnedKP) || 0), 0);
    const subjectCounts = {};
    done.forEach((task) => {
      subjectCounts[task.subject || '未分類'] = (subjectCounts[task.subject || '未分類'] || 0) + 1;
    });
    const maxSubject = Math.max(1, ...Object.values(subjectCounts));
    $('ks-task-page-stats').innerHTML = `
      <div class="ks-task-summary">
        <div class="ks-task-summary-item"><div class="ks-task-summary-num">${done.length}</div><div class="ks-task-summary-label">7日完了</div></div>
        <div class="ks-task-summary-item"><div class="ks-task-summary-num">${minutes}</div><div class="ks-task-summary-label">実績分</div></div>
        <div class="ks-task-summary-item"><div class="ks-task-summary-num">${kp}</div><div class="ks-task-summary-label">獲得KP</div></div>
        <div class="ks-task-summary-item"><div class="ks-task-summary-num">${all.length}</div><div class="ks-task-summary-label">登録数</div></div>
      </div>
      <div class="ks-task-stat-card">
        <div class="ks-task-section-head" style="margin-top:0">直近7日</div>
        <div class="ks-task-bar-list">
          ${dates.map((date) => {
            const count = (data[date] || []).filter((task) => task.status === 'done').length;
            const max = Math.max(1, ...dates.map((dt) => (data[dt] || []).filter((task) => task.status === 'done').length));
            return `<div class="ks-task-bar-row"><span>${date.slice(5)}</span><div class="ks-task-mini-track"><div class="ks-task-fill" style="width:${Math.round(count / max * 100)}%"></div></div><span>${count}件</span></div>`;
          }).join('')}
        </div>
      </div>
      <div class="ks-task-stat-card" style="margin-top:8px">
        <div class="ks-task-section-head" style="margin-top:0">科目別</div>
        <div class="ks-task-bar-list">
          ${Object.keys(subjectCounts).length ? Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]).map(([name, count]) => `<div class="ks-task-bar-row"><span>${escapeHtml(name)}</span><div class="ks-task-mini-track"><div class="ks-task-fill" style="width:${Math.round(count / maxSubject * 100)}%"></div></div><span>${count}件</span></div>`).join('') : '<div class="ks-task-empty">まだ記録がありません</div>'}
        </div>
      </div>
    `;
  }

  function priorityLabel(n) {
    return n === 1 ? '!!' : n === 2 ? '!' : n === 3 ? '−' : '↓';
  }

  function setPriority(n) {
    state.priority = n || 3;
    if (state.addConfirmOpen) {
      renderAddConfirm();
      return;
    }
    renderToday();
  }

  function toggleAddDetails() {
    state.addDetailsOpen = !state.addDetailsOpen;
    const details = $('ks-task-add-details');
    const toggle = document.querySelector('[data-ks-action="toggle-add-details"]');
    if (details) details.classList.toggle('is-open', state.addDetailsOpen);
    if (toggle) {
      toggle.setAttribute('aria-expanded', state.addDetailsOpen ? 'true' : 'false');
      const arrow = toggle.querySelector('.ks-task-detail-arrow');
      if (arrow) arrow.textContent = state.addDetailsOpen ? '▲' : '▼';
    }
  }

  function addTask(template, options) {
    const opts = options || {};
    const subject = template ? template.subject : (state.selectedSubject || '未分類');
    const type = template ? template.type : state.selectedType;
    if (!type) {
      notify('種類を選んでください', true);
      return;
    }
    const plannedAmt = template ? template.plannedAmt : numberValue('ks-task-plan-amt');
    const plannedMins = template ? template.plannedMins : numberValue('ks-task-plan-mins');
    const unit = template ? template.unit : (($('ks-task-unit') && $('ks-task-unit').value.trim()) || unitFor(type));
    const priority = template ? template.priority : state.priority;
    const { data, today, list } = todayTasks();
    const task = {
      id: Date.now() + '-' + Math.floor(Math.random() * 100000),
      date: today,
	      subject,
	      type,
	      storyId: getCurrentStory(),
	      category: categoryFor(type),
      priority: priority || 3,
      plannedAmt,
      unit,
      plannedMins,
      actualAmt: null,
      actualMins: null,
      status: 'todo',
      carried: !!template?.carried,
      earnedKP: 0,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    assignTaskOrder(list, task);
    list.push(task);
    data[today] = list;
    saveTasks(data);
    if (window.taskAnalytics) window.taskAnalytics.onTaskAdded();
    mru('subject', subject);
    mru('type', type);
    state.selectedType = '';
    closeAddConfirm();
    if ($('ks-task-plan-amt')) $('ks-task-plan-amt').value = '';
    if ($('ks-task-plan-mins')) $('ks-task-plan-mins').value = '';
    if ($('ks-task-unit')) $('ks-task-unit').value = '';
    render();
    if (!opts.silent) notify('コツを積みました');
  }

  function numberValue(id) {
    const el = $(id);
    if (!el) return null;
    const num = parseFloat(el.value);
    return Number.isFinite(num) ? num : null;
  }

  function saveTemplate(options) {
    const opts = options || {};
    if (!state.selectedType) {
      notify('種類を選んでください', true);
      return false;
    }
    const list = templates();
    const template = {
      id: Date.now() + '-' + Math.floor(Math.random() * 100000),
	      subject: state.selectedSubject || '未分類',
	      type: state.selectedType,
	      storyId: getCurrentStory(),
	      category: categoryFor(state.selectedType),
      plannedAmt: numberValue('ks-task-plan-amt'),
      unit: (($('ks-task-unit') && $('ks-task-unit').value.trim()) || unitFor(state.selectedType)),
      plannedMins: numberValue('ks-task-plan-mins'),
      priority: state.priority
    };
    if (list.some((tmpl) => templateSignature(tmpl) === templateSignature(template))) {
      if (!opts.silentDuplicate) notify('同じテンプレートは保存済みです');
      if (!opts.skipRender) renderToday();
      return false;
    }
    list.unshift(template);
    saveTemplates(list.slice(0, 20));
    if (!opts.skipRender) renderToday();
    if (!opts.silent) notify('テンプレートに保存しました');
    return true;
  }

  function saveTemplateAndAddTask() {
    saveTemplate({ silent: true, silentDuplicate: true, skipRender: true });
    addTask(null, { silent: true });
    notify('保存してコツを追加しました');
  }

  function deleteTemplate(id) {
    const list = templates();
    const target = list.find((tmpl) => String(tmpl.id) === String(id));
    const signature = target ? templateSignature(target) : '';
    const removeIds = list
      .filter((tmpl) => String(tmpl.id) === String(id) || (signature && templateSignature(tmpl) === signature))
      .map((tmpl) => String(tmpl.id));
    saveTemplateDeletedIds(templateDeletedIds().concat(removeIds.length ? removeIds : [String(id)]));
    saveTemplates(list.filter((tmpl) => !removeIds.includes(String(tmpl.id))));
    renderToday();
  }

  function toggleDone(id) {
    const { data, today, list } = todayTasks();
    const task = list.find((item) => String(item.id) === String(id));
    if (!task) return;
    const storyId = task.storyId || getCurrentStory();
    const beforeEvolutionStage = storyProgressSnapshot(storyId).stage.count;
    const beforeSpiritIds = Object.keys(readSpiritStore().unlocked || {});
    if (task.status === 'done') {
      task.status = 'todo';
      task.completedAt = null;
      if (task.earnedKP) addKP(-task.earnedKP);
      task.earnedKP = 0;
      touchTask(task);
      saveTasks(data);
      if (window.taskAnalytics) window.taskAnalytics.onTaskUncompleted();
      render();
      notify('未完了に戻しました');
      return;
    }
    task.status = 'done';
    task.completedAt = new Date().toISOString();
    task.earnedKP = calcTaskKP(task);
    touchTask(task);
    addKP(task.earnedKP);
    data[today] = list;
    saveTasks(data);
    if (window.taskAnalytics) window.taskAnalytics.onTaskCompleted();
    playChime();
    showStampEffect(task.id);
    setTimeout(() => {
      render();
      const afterEvolution = syncStoryProgress(storyId);
      const unlockedStage = afterEvolution && afterEvolution.stage.count > beforeEvolutionStage ? afterEvolution : null;
      const afterSpiritIds = readSpiritStore().unlocked || {};
      const newSpirits = KOTSU_SPIRITS.filter((sp) => afterSpiritIds[sp.id] && beforeSpiritIds.indexOf(sp.id) < 0);
      if (newSpirits.length) {
        playSpiritTheater(newSpirits, { record: true });
      } else {
        showFloat(task, unlockedStage);
      }
    }, 650);
  }

  function deleteTask(id) {
    const { data, today, list } = todayTasks();
    const task = list.find((item) => String(item.id) === String(id));
    if (!task) return;
    if (task.status === 'done' && task.earnedKP) addKP(-task.earnedKP);
    rememberDeleted(task.id);
    data[today] = list.filter((item) => String(item.id) !== String(id));
    saveTasks(data);
    if (window.taskAnalytics) window.taskAnalytics.onTaskDeleted(task.status === 'done');
    render();
    notify('削除しました');
  }

  function moveTask(id, direction) {
    const { data, today, list } = todayTasks();
    const todo = list.filter((task) => task.status === 'todo').sort(compareTaskOrder);
    const index = todo.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return;
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= todo.length) return;
    const moved = todo[index];
    todo[index] = todo[nextIndex];
    todo[nextIndex] = moved;
    todo.forEach((task, idx) => {
      task.sortOrder = (idx + 1) * 1000;
      touchTask(task);
    });
    data[today] = list;
    saveTasks(data);
    render();
  }

  function openDetail(id) {
    const { list } = todayTasks();
    const task = list.find((item) => String(item.id) === String(id));
    if (!task) return;
    state.editingTaskId = id;
    $('ks-task-detail-subj').textContent = task.subject || '未分類';
    $('ks-task-detail-title').textContent = task.type || '';
    $('ks-task-detail-plan-amt').value = task.plannedAmt ?? '';
    $('ks-task-detail-unit').value = task.unit ?? unitFor(task.type);
    $('ks-task-detail-actual-amt').value = task.actualAmt ?? '';
    $('ks-task-detail-plan-mins').value = task.plannedMins ?? '';
    $('ks-task-detail-actual-mins').value = task.actualMins ?? '';
    $('ks-task-detail-overlay').classList.add('is-open');
  }

  function closeDetail() {
    if ($('ks-task-detail-overlay')) $('ks-task-detail-overlay').classList.remove('is-open');
    state.editingTaskId = null;
  }

  function openRename(value) {
    state.renamingChoice = value;
    $('ks-task-rename-sub').textContent = state.pickerMode === 'subject' ? '科目を変更' : '種類を変更';
    $('ks-task-rename-title').textContent = value;
    $('ks-task-rename-input').value = value;
    $('ks-task-rename-overlay').classList.add('is-open');
    setTimeout(() => {
      const input = $('ks-task-rename-input');
      if (input) {
        input.focus();
        input.select();
      }
    }, 50);
  }

  function closeRename() {
    if ($('ks-task-rename-overlay')) $('ks-task-rename-overlay').classList.remove('is-open');
    state.renamingChoice = '';
  }

  function saveDetail() {
    if (!state.editingTaskId) return;
    const { data, today, list } = todayTasks();
    const task = list.find((item) => String(item.id) === String(state.editingTaskId));
    if (!task) return;
    task.plannedAmt = numberValue('ks-task-detail-plan-amt');
    task.unit = ($('ks-task-detail-unit').value.trim() || unitFor(task.type));
    task.actualAmt = numberValue('ks-task-detail-actual-amt');
    task.plannedMins = numberValue('ks-task-detail-plan-mins');
    task.actualMins = numberValue('ks-task-detail-actual-mins');
    if (task.status === 'done') {
      if (task.earnedKP) addKP(-task.earnedKP);
      task.earnedKP = calcTaskKP(task);
      addKP(task.earnedKP);
    }
    touchTask(task);
    data[today] = list;
    saveTasks(data);
    closeDetail();
    render();
    notify('詳細を保存しました');
  }

  function openAddConfirm() {
    if (!state.selectedSubject) {
      notify('科目を選んでください', true);
      openPicker('subject');
      return;
    }
    if (!state.selectedType) {
      notify('種類を選んでください', true);
      openPicker('type');
      return;
    }
    state.addConfirmOpen = true;
    renderAddConfirm();
    $('ks-task-add-confirm-overlay').classList.add('is-open');
  }

  function closeAddConfirm() {
    if ($('ks-task-add-confirm-overlay')) $('ks-task-add-confirm-overlay').classList.remove('is-open');
    state.addConfirmOpen = false;
  }

  function renderAddConfirm() {
    if (!$('ks-task-add-confirm-body')) return;
    const category = categoryFor(state.selectedType);
    const label = categoryLabel(category);
    $('ks-task-add-confirm-subj').textContent = state.selectedSubject || '未分類';
    $('ks-task-add-confirm-title').textContent = state.selectedType || 'コツを追加';
    $('ks-task-add-confirm-body').innerHTML = `
      <div class="ks-task-confirm-card cat-${escapeHtml(category)}">
        <div class="ks-task-confirm-icon">${escapeHtml(label.icon)}</div>
        <div class="ks-task-confirm-main">
          <div class="ks-task-confirm-name">${escapeHtml(state.selectedSubject || '未分類')} / ${escapeHtml(state.selectedType || '')}</div>
          <div class="ks-task-confirm-note">必要なところだけ軽く調整できます</div>
        </div>
      </div>
      <div class="ks-task-confirm-fields">
        <div class="ks-task-field"><div class="ks-task-label">予定量</div><input class="ks-task-input" id="ks-task-plan-amt" type="number" min="0" placeholder="20"></div>
        <div class="ks-task-field"><div class="ks-task-label">単位</div><input class="ks-task-input" id="ks-task-unit" maxlength="12" placeholder="${escapeHtml(unitFor(state.selectedType))}"></div>
        <div class="ks-task-field"><div class="ks-task-label">予定分</div><input class="ks-task-input" id="ks-task-plan-mins" type="number" min="0" placeholder="30"></div>
      </div>
      <div class="ks-task-priority-box">
        <div class="ks-task-priority-label">優先度</div>
        <div class="ks-task-priority-grid">
          ${[1, 2, 3, 4].map((n) => `<button class="ks-task-pri ${state.priority === n ? 'is-active' : ''}" type="button" data-ks-action="priority" data-priority="${n}">${priorityLabel(n)}</button>`).join('')}
        </div>
      </div>
      <div class="ks-task-confirm-actions">
        <button class="ks-task-small-btn" type="button" data-ks-action="add-confirm-save-add">⭐ 保存</button>
        <button class="ks-task-add-btn" type="button" data-ks-action="add-confirm-add">＋ コツ追加</button>
      </div>
    `;
  }

  function openPicker(kind) {
    state.pickerMode = kind;
    $('ks-task-picker-title').textContent = kind === 'subject' ? '科目を選択' : '種類を選択';
    $('ks-task-new-choice').value = '';
    $('ks-task-new-choice').placeholder = kind === 'subject' ? '新しい科目を追加' : '新しい種類を追加';
    renderPicker();
    $('ks-task-picker-overlay').classList.add('is-open');
    setTimeout(() => $('ks-task-new-choice').focus(), 50);
  }

  function closePicker() {
    if ($('ks-task-picker-overlay')) $('ks-task-picker-overlay').classList.remove('is-open');
    state.pickerMode = null;
  }

  function renderPicker() {
    const kind = state.pickerMode;
    const current = kind === 'subject' ? state.selectedSubject : state.selectedType;
    $('ks-task-choice-list').innerHTML = getList(kind).map((value) => `
      <div class="ks-task-choice">
        <button class="ks-task-choice-main" type="button" data-ks-choice="${escapeHtml(value)}">
          <span style="color:var(--text-muted)">${value === current ? '✓' : '・'}</span>
          <span style="min-width:0;overflow:hidden;text-overflow:ellipsis">${escapeHtml(value)}</span>
        </button>
        <button class="ks-task-choice-edit" type="button" data-ks-rename-choice="${escapeHtml(value)}">変更</button>
        <button class="ks-task-choice-del" type="button" data-ks-delete-choice="${escapeHtml(value)}">×</button>
      </div>
    `).join('');
  }

  function selectChoice(value) {
    if (state.pickerMode === 'subject') {
      state.selectedSubject = value;
      mru('subject', value);
      closePicker();
      renderToday();
      setTimeout(() => openPicker('type'), 80);
      return;
    } else {
      state.selectedType = value;
      state.selectedCategory = categoryFor(value);
      mru('type', value);
      closePicker();
      renderToday();
      setTimeout(openAddConfirm, 80);
      return;
    }
  }

  function addChoice() {
    const value = $('ks-task-new-choice').value.trim();
    if (!value || !state.pickerMode) return;
    mru(state.pickerMode, value);
    selectChoice(value);
  }

  function deleteChoice(value) {
    if (!state.pickerMode) return;
    const next = getList(state.pickerMode).filter((item) => item !== value);
    saveList(state.pickerMode, next);
    if (state.pickerMode === 'subject' && state.selectedSubject === value) state.selectedSubject = '';
    if (state.pickerMode === 'type' && state.selectedType === value) state.selectedType = '';
    renderPicker();
    renderToday();
  }

  function renameChoice(value) {
    if (!state.pickerMode) return;
    openRename(value);
  }

  function saveRenameChoice() {
    if (!state.pickerMode || !state.renamingChoice) return;
    const value = state.renamingChoice;
    const renamed = String(($('ks-task-rename-input') && $('ks-task-rename-input').value) || '').trim();
    if (!renamed || renamed === value) return;
    const list = getList(state.pickerMode);
    if (list.includes(renamed)) {
      notify('同じ名前がすでにあります', true);
      return;
    }
    saveList(state.pickerMode, list.map((item) => item === value ? renamed : item));
    if (state.pickerMode === 'subject') {
      if (state.selectedSubject === value) state.selectedSubject = renamed;
    } else {
      const category = categoryFor(value);
      const map = typeCategoryMap();
      delete map[value];
      map[renamed] = category;
      saveTypeCategoryMap(map);
      if (state.selectedType === value) {
        state.selectedType = renamed;
        state.selectedCategory = category;
      }
      saveTemplates(templates().map((tmpl) => {
        if (!tmpl || tmpl.type !== value) return tmpl;
        if (tmpl.storyId && tmpl.storyId !== getCurrentStory()) return tmpl;
        return { ...tmpl, type: renamed, category };
      }));
    }
    renderPicker();
    renderToday();
    closeRename();
    notify('変更しました');
  }

  function carryCandidates() {
    const data = tasksByDate();
    const yesterday = addDays(studyDate(0), -1);
    return (data[yesterday] || []).filter((task) => task.status === 'todo');
  }

  function acceptCarry() {
    const data = tasksByDate();
    const today = studyDate(0);
    const yesterday = addDays(today, -1);
    const carry = (data[yesterday] || []).filter((task) => task.status === 'todo');
    if (!carry.length) return;
    if (!Array.isArray(data[today])) data[today] = [];
    carry.forEach((task) => {
      data[today].push({
        ...task,
        id: Date.now() + '-' + Math.floor(Math.random() * 100000),
        date: today,
        status: 'todo',
        carried: true,
        completedAt: null,
        earnedKP: 0
      });
      touchTask(task).status = 'carried';
    });
    saveTasks(data);
    if (window.taskAnalytics && carry.length > 0) window.taskAnalytics.onTasksCarried(carry.length);
    render();
    notify(carry.length + '件を今日に追加しました');
  }

  function carryAll() {
    const { data, today, list } = todayTasks();
    const tomorrow = addDays(today, 1);
    const todo = list.filter((task) => task.status === 'todo');
    if (!todo.length) {
      notify('未完了コツはありません');
      return;
    }
    if (!Array.isArray(data[tomorrow])) data[tomorrow] = [];
    todo.forEach((task) => {
      data[tomorrow].push({
        ...task,
        id: Date.now() + '-' + Math.floor(Math.random() * 100000),
        date: tomorrow,
        status: 'todo',
        carried: true,
        completedAt: null,
        earnedKP: 0
      });
      touchTask(task).status = 'carried';
    });
    saveTasks(data);
    render();
    notify(todo.length + '件を明日へ送りました');
  }

  function toggleDoneList() {
    const el = $('ks-task-done-list');
    if (el) el.style.display = el.style.display === 'none' ? 'flex' : 'none';
  }

  function playChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const play = () => {
        [[1046, 0, 0.12, 0.9], [1318, 0.15, 0.10, 0.8], [1568, 0.30, 0.08, 0.7]].forEach(([freq, delay, vol, dur]) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0, ctx.currentTime + delay);
          g.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + dur + 0.05);
        });
      };
      if (ctx.state === 'suspended') { ctx.resume().then(play); } else { play(); }
    } catch (e) {}
  }

  function showStampEffect(id) {
    const cardEl = document.querySelector('[data-ks-task="' + id + '"]');
    if (!cardEl) return;
    const ripple = document.createElement('div');
    ripple.className = 'ks-stamp-ripple';
    cardEl.appendChild(ripple);
    const overlay = document.createElement('div');
    overlay.className = 'ks-stamp-overlay';
    const stamp = document.createElement('div');
    stamp.className = 'ks-stamp-text';
    stamp.textContent = '習得済✓';
    overlay.appendChild(stamp);
    cardEl.appendChild(overlay);
    setTimeout(() => { ripple.remove(); overlay.remove(); }, 1800);
  }

  function showFloat(task, unlockedEvolution, unlockedSpirits) {
    const story = getStoryMeta();
    const messages = {
      gorilla: '完了ゴリ。強くなったゴリ。',
      samurai: '一つ斬った。次へ進もう。',
      space: 'ミッション完了。航路は順調。',
      itachacha: 'ニヤニヤ……コツを積みましたね。',
      spartan: 'よくやった。次だ。'
    };
    let floatChar;
    let floatMsg;
    if (unlockedSpirits && unlockedSpirits.length) {
      const first = unlockedSpirits[0];
      floatChar = first.icon;
      if (unlockedSpirits.length > 1) floatMsg = 'スピリットが' + unlockedSpirits.length + '体 目覚めた！';
      else if (first.id === 'first_light') floatMsg = '第二部「スピリット編」解放！';
      else floatMsg = '「' + first.name + '」が目覚めた！';
    } else if (unlockedEvolution) {
      floatChar = unlockedEvolution.stage.icon;
      floatMsg = unlockedEvolution.count >= 100 ? 'ストーリー進化が100コツに到達しました。' : unlockedEvolution.stage.name + 'を解放しました。';
    } else {
      floatChar = story.icon;
      floatMsg = messages[getCurrentStory()] || 'コツを積みました。';
    }
    $('ks-task-float-char').textContent = floatChar;
    $('ks-task-float-msg').textContent = floatMsg;
    $('ks-task-float-kp').textContent = '+' + task.earnedKP + ' KP';
    $('ks-task-float').classList.add('is-show');
    clearTimeout(state.floatTimer);
    state.floatTimer = setTimeout(() => $('ks-task-float').classList.remove('is-show'), 2600);
  }

  // --- 覚醒演出（タマゴ割れ覚醒シアター・3段階） ---
  function prefersReducedMotion() {
    try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
    catch (e) { return false; }
  }

  function vibrateSafe(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
  }

  function playFanfare() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const notes = [[523, 0, 0.14], [659, 0.12, 0.14], [784, 0.24, 0.16], [1047, 0.4, 0.5]];
      const play = () => notes.forEach(([freq, delay, dur]) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, ctx.currentTime + delay);
        g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + delay + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + dur + 0.05);
      });
      if (ctx.state === 'suspended') { ctx.resume().then(play); } else { play(); }
    } catch (e) {}
  }

  // 種別: complete_soul=特別 > first_light=フル > その他=ミニ
  function spiritTheaterKind(spirits) {
    if (spirits.some((s) => s.id === 'complete_soul')) return 'special';
    if (spirits.some((s) => s.id === 'first_light')) return 'full';
    return 'mini';
  }

  function spiritById(id) {
    return KOTSU_SPIRITS.find((s) => s.id === id) || null;
  }

  function markSpiritAnnounced(ids) {
    const store = readSpiritStore();
    let changed = false;
    ids.forEach((id) => {
      if (store.unlocked[id] && !store.unlocked[id].announcedAt) {
        store.unlocked[id].announcedAt = new Date().toISOString();
        changed = true;
      }
    });
    if (changed) writeJson(STORE.spirits, store);
  }

  function closeSpiritTheater() {
    const el = $('ks-spirit-theater');
    if (!el) return;
    (state.spiritTheaterTimers || []).forEach((t) => clearTimeout(t));
    state.spiritTheaterTimers = [];
    el.classList.remove('is-show', 'is-open', 'is-shake', 'is-mini', 'kind-full', 'kind-special', 'kind-mini');
    el.setAttribute('aria-hidden', 'true');
  }

  // spirits: KOTSU_SPIRITS要素の配列。opts.kind省略時は自動。opts.record=false で announcedAt 記録しない（もう一度見る用）
  function playSpiritTheater(spirits, opts) {
    if (!state.mounted || !spirits || !spirits.length) return;
    opts = opts || {};
    const el = $('ks-spirit-theater');
    if (!el) return;
    const kind = opts.kind || spiritTheaterKind(spirits);
    const record = opts.record !== false;
    if (record) markSpiritAnnounced(spirits.map((s) => s.id));
    closeSpiritTheater();
    const reduced = prefersReducedMotion();
    const egg = $('ks-spirit-theater-egg');
    const lineup = $('ks-spirit-theater-lineup');
    const titleEl = $('ks-spirit-theater-title');
    const subEl = $('ks-spirit-theater-sub');
    const timers = state.spiritTheaterTimers = [];
    const after = (ms, fn) => timers.push(setTimeout(fn, ms));

    lineup.innerHTML = spirits.map((sp) => `
      <div class="ks-spirit-theater-card">
        <div class="ks-spirit-theater-portrait">
          <img src="${escapeHtml(sp.image)}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
          <div class="ks-spirit-theater-fallback">${escapeHtml(sp.icon)}</div>
        </div>
        <div class="ks-spirit-theater-name">${escapeHtml(sp.name)}</div>
        <div class="ks-spirit-theater-line">${escapeHtml(sp.desc)}</div>
      </div>`).join('');

    const headline = kind === 'special' ? '⭐ 完全覚醒！' : (kind === 'full' ? '🌌 スピリット覚醒！' : '✨ スピリット解放！');
    titleEl.textContent = '';
    subEl.textContent = spirits.length > 1 ? spirits.length + '体が目覚めた' : '';

    el.setAttribute('aria-hidden', 'false');
    el.classList.add('is-show', 'kind-' + kind);
    if (kind === 'mini') el.classList.add('is-mini');
    vibrateSafe(kind === 'mini' ? 30 : [0, 40, 60, 120]);

    if (kind === 'mini') {
      egg.style.display = 'none';
      after(reduced ? 0 : 60, () => { el.classList.add('is-open'); titleEl.textContent = headline; });
      return;
    }

    egg.style.display = '';
    egg.style.visibility = 'visible';
    egg.src = SPIRIT_EGG_FRAMES.closed;
    if (reduced) {
      egg.src = SPIRIT_EGG_FRAMES.open;
      after(150, () => { el.classList.add('is-open'); titleEl.textContent = headline; playFanfare(); });
      return;
    }
    after(420, () => { egg.src = SPIRIT_EGG_FRAMES.crack1; });
    after(820, () => { egg.src = SPIRIT_EGG_FRAMES.crack2; el.classList.add('is-shake'); });
    after(1180, () => {
      el.classList.remove('is-shake');
      egg.src = SPIRIT_EGG_FRAMES.open;
      el.classList.add('is-open');
      titleEl.textContent = headline;
      playFanfare();
      vibrateSafe([0, 60, 40, 80]);
    });
  }

  function categoryCounts() {
    const data = tasksByDate();
    const counts = {};
    const storyId = getCurrentStory();
    Object.values(data).forEach((list) => {
      if (!Array.isArray(list)) return;
      list.forEach((task) => {
        if (task.status !== 'done') return;
        if (task.storyId && task.storyId !== storyId) return;
        const category = task.category || categoryFor(task.type);
        counts[category] = (counts[category] || 0) + 1;
      });
    });
    return counts;
  }

  function equipLevel(count) {
    if (count >= 50) return { stars: '★★★★★', next: null, progress: 100 };
    if (count >= 30) return { stars: '★★★★☆', next: 50, progress: Math.round((count - 30) / 20 * 100) };
    if (count >= 15) return { stars: '★★★☆☆', next: 30, progress: Math.round((count - 15) / 15 * 100) };
    if (count >= 5) return { stars: '★★☆☆☆', next: 15, progress: Math.round((count - 5) / 10 * 100) };
    return { stars: '★☆☆☆☆', next: 5, progress: Math.round(count / 5 * 100) };
  }

  function dateObject(dateStr) {
    return new Date(dateStr + 'T12:00:00');
  }

  function completedCountBetween(startDate, endDate) {
    const data = tasksByDate();
    let count = 0;
    Object.keys(data).forEach((date) => {
      const current = dateObject(date);
      if (current < startDate || current > endDate) return;
      (data[date] || []).forEach((task) => {
        if (task.status === 'done') count += 1;
      });
    });
    return count;
  }

  function periodCompletedCounts(todayKey) {
    const today = dateObject(todayKey);
    const weekStart = dateObject(todayKey);
    weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const weekEnd = dateObject(todayKey);
    weekEnd.setTime(weekStart.getTime());
    weekEnd.setDate(weekStart.getDate() + 6);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1, 12);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 12);
    return {
      week: completedCountBetween(weekStart, weekEnd),
      month: completedCountBetween(monthStart, monthEnd)
    };
  }

  function updateButtonSummary() {
    const button = $('ks-task-open-btn');
    if (!button) return;
    const todayKey = studyDate(0);
    const list = (tasksByDate()[todayKey] || []).filter((task) => task.status !== 'carried');
    const done = list.filter((task) => task.status === 'done');
    const todo = list.length - done.length;
    const pct = list.length ? Math.round(done.length / list.length * 100) : 0;
    const sub = button.querySelector('[data-ks-open-sub]');
    const weekEl = button.querySelector('[data-ks-open-week]');
    const monthEl = button.querySelector('[data-ks-open-month]');
    const periods = periodCompletedCounts(todayKey);
    if (sub) sub.textContent = list.length ? `今日 ${done.length}/${list.length} 残${todo} ${pct}%` : '今日のコツを追加';
    if (weekEl) weekEl.textContent = `週${periods.week}`;
    if (monthEl) monthEl.textContent = `月${periods.month}`;
    updateTopStoryCharacters();
  }

  function exportData() {
    const data = {
      version: 1,
      tasks: tasksByDate(),
      templates: templates(),
      templateDeleted: templateDeletedIds(),
      deleted: deletedIds(),
      kp: getKP(),
      storyProgress: readJson(STORE.storyProgress, {}),
      equipmentUnlocked: readJson(STORE.equipmentUnlocked, {}),
      spirits: readJson(STORE.spirits, {}),
      spiritIntroSeen: readJson(STORE.spiritIntroSeen, false),
      taskSettings: readJson(STORE.taskSettings, {}),
      lists: {}
    };
    Object.keys(localStorage).forEach((key) => {
      if (key.indexOf(STORE.subjectPrefix) === 0 || key.indexOf(STORE.typePrefix) === 0 || key.indexOf(STORE.typeCategoryPrefix) === 0) {
        data.lists[key] = localStorage.getItem(key);
      }
    });
    return data;
  }

  function importData(payload) {
    if (!payload || typeof payload !== 'object') return;
    writeJson(STORE.tasks, payload.tasks || {});
    writeJson(STORE.taskDataAlias, payload.tasks || {});
    saveTemplateDeletedIds(Array.isArray(payload.templateDeleted) ? payload.templateDeleted : []);
    writeJson(STORE.templates, normalizeTemplates(Array.isArray(payload.templates) ? payload.templates : []));
    saveDeletedIds(Array.isArray(payload.deleted) ? payload.deleted : []);
    setKP(Number(payload.kp) || 0);
    writeJson(STORE.storyProgress, payload.storyProgress || {});
    writeJson(STORE.equipmentUnlocked, payload.equipmentUnlocked || {});
    writeJson(STORE.spirits, payload.spirits || {});
    if (payload.spiritIntroSeen) writeJson(STORE.spiritIntroSeen, true);
    writeJson(STORE.taskSettings, payload.taskSettings || {});
    if (payload.lists && typeof payload.lists === 'object') {
      Object.keys(payload.lists).forEach((key) => {
        if (key.indexOf(STORE.subjectPrefix) === 0 || key.indexOf(STORE.typePrefix) === 0 || key.indexOf(STORE.typeCategoryPrefix) === 0) {
          localStorage.setItem(key, payload.lists[key]);
        }
      });
    }
    syncStoryProgress();
    syncSpirits();
    updateButtonSummary();
    if (state.open) render();
  }

  function mergeData(payload) {
    if (!payload || typeof payload !== 'object') return exportData();
    const deleted = new Set(deletedIds().concat(Array.isArray(payload.deleted) ? payload.deleted.map(String) : []));
    const deletedTemplates = new Set(templateDeletedIds().concat(Array.isArray(payload.templateDeleted) ? payload.templateDeleted.map(String) : []));
    const mergedTasks = tasksByDate();
    const incomingTasks = payload.tasks && typeof payload.tasks === 'object' ? payload.tasks : {};
    Object.keys(incomingTasks).forEach((date) => {
      const byId = new Map();
      (Array.isArray(mergedTasks[date]) ? mergedTasks[date] : []).forEach((task) => {
        if (!deleted.has(String(task.id))) byId.set(String(task.id), task);
      });
      (Array.isArray(incomingTasks[date]) ? incomingTasks[date] : []).forEach((task) => {
        if (!task || deleted.has(String(task.id))) return;
        const current = byId.get(String(task.id));
        if (!current || taskTimestamp(task) >= taskTimestamp(current)) byId.set(String(task.id), task);
      });
      mergedTasks[date] = Array.from(byId.values());
    });
    Object.keys(mergedTasks).forEach((date) => {
      mergedTasks[date] = (Array.isArray(mergedTasks[date]) ? mergedTasks[date] : []).filter((task) => task && !deleted.has(String(task.id)));
      if (!mergedTasks[date].length) delete mergedTasks[date];
    });

    saveTemplateDeletedIds(Array.from(deletedTemplates));
    const mergedTemplates = normalizeTemplates(templates().concat(Array.isArray(payload.templates) ? payload.templates : []));

    writeJson(STORE.tasks, mergedTasks);
    writeJson(STORE.taskDataAlias, mergedTasks);
    writeJson(STORE.templates, mergedTemplates.slice(0, 40));
    saveDeletedIds(Array.from(deleted));
    writeJson(STORE.storyProgress, { ...(payload.storyProgress || {}), ...readJson(STORE.storyProgress, {}) });
    writeJson(STORE.equipmentUnlocked, { ...(payload.equipmentUnlocked || {}), ...readJson(STORE.equipmentUnlocked, {}) });
    const localSpirits = readSpiritStore();
    const incomingSpirits = (payload.spirits && typeof payload.spirits === 'object') ? payload.spirits : {};
    const incomingUnlocked = (incomingSpirits.unlocked && typeof incomingSpirits.unlocked === 'object') ? incomingSpirits.unlocked : {};
    writeJson(STORE.spirits, {
      unlocked: { ...incomingUnlocked, ...localSpirits.unlocked },
      level: Math.max(localSpirits.level || 0, Number(incomingSpirits.level) || 0),
      titles: Array.from(new Set([].concat(localSpirits.titles || [], Array.isArray(incomingSpirits.titles) ? incomingSpirits.titles : [])))
    });
    if (payload.spiritIntroSeen) writeJson(STORE.spiritIntroSeen, true);
    if (payload.lists && typeof payload.lists === 'object') {
      Object.keys(payload.lists).forEach((key) => {
        if (key.indexOf(STORE.typeCategoryPrefix) === 0) {
          const localMap = readJson(key, {});
          let incomingMap = {};
          try { incomingMap = JSON.parse(payload.lists[key] || '{}'); } catch (e) { incomingMap = {}; }
          localStorage.setItem(key, JSON.stringify({ ...(localMap || {}), ...(incomingMap || {}) }));
          return;
        }
        if (key.indexOf(STORE.subjectPrefix) !== 0 && key.indexOf(STORE.typePrefix) !== 0) return;
        const local = readJson(key, []);
        let incoming = [];
        try { incoming = JSON.parse(payload.lists[key] || '[]'); } catch (e) { incoming = []; }
        if (!Array.isArray(incoming)) incoming = [];
        localStorage.setItem(key, JSON.stringify(Array.from(new Set((Array.isArray(local) ? local : []).concat(incoming))).slice(0, 60)));
      });
    }
    const earned = Object.values(mergedTasks).flat().reduce((sum, task) => sum + (task.status === 'done' ? Number(task.earnedKP || calcTaskKP(task)) : 0), 0);
    setKP(Math.max(getKP(), Number(payload.kp) || 0, earned));
    syncStoryProgress();
    syncSpirits();
    updateButtonSummary();
    if (state.open) render();
    return exportData();
  }

  function clearAll() {
    Object.keys(localStorage).forEach((key) => {
      if (key === STORE.tasks || key === STORE.templates || key === STORE.templateDeleted || key === STORE.deleted || key === STORE.kp || key === STORE.storyProgress || key === STORE.equipmentUnlocked || key === STORE.spirits || key === STORE.spiritIntroSeen || key === STORE.taskDataAlias || key === STORE.taskSettings || key.indexOf(STORE.subjectPrefix) === 0 || key.indexOf(STORE.typePrefix) === 0 || key.indexOf(STORE.typeCategoryPrefix) === 0) {
        localStorage.removeItem(key);
      }
    });
    state.selectedSubject = '';
    state.selectedType = '';
    updateButtonSummary();
    if (state.open) render();
  }

  function init() {
    mount();
    const button = $('ks-task-open-btn');
    if (button && !button.dataset.ksBound) {
      button.dataset.ksBound = '1';
      button.addEventListener('click', open);
      button.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        open();
      });
    }
    syncSpirits();
    updateButtonSummary();
    startTopStoryWatcher();
  }

  window.KotsuTasks = {
    init,
    open,
    close,
    render,
    exportData,
    importData,
    mergeData,
    clearAll,
    updateButtonSummary
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
