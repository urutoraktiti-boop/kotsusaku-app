(function () {
  'use strict';

  const STORE = {
    tasks: 'kskotsu_tasks',
    templates: 'kskotsu_templates',
    deleted: 'kskotsu_deleted',
    kp: 'kskotsu_kp',
    storyProgress: 'task-story-progress',
    equipmentUnlocked: 'task-equipment-unlocked',
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
    { count: 100, icon: '🌟', name: '完成の姿', desc: '100コツ到達。続きは101コツ目から始まります。', image: 'assets/stories/mystery/story_mystery_100.png' }
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
      { name: '完全体ブロピヨ', desc: '100コツ到達。続きは101コツ目から始まります。', icon: '🌟' }
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

  const KP_RANKS = [
    { min: 0, icon: '🌱', name: 'コツ見習い' },
    { min: 100, icon: '📝', name: 'コツ学習者' },
    { min: 300, icon: '💪', name: 'コツ努力家' },
    { min: 700, icon: '🔥', name: 'コツ猛者' },
    { min: 1500, icon: '⚡', name: 'コツ達人' },
    { min: 3000, icon: '👑', name: 'コツの申し子' },
    { min: 6000, icon: '🏆', name: '伝説のコツ' }
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
    floatTimer: null
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

  function templates() {
    return readJson(STORE.templates, []);
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
    writeJson(STORE.templates, list);
    afterDataChange();
  }

  function getKP() {
    return parseInt(localStorage.getItem(STORE.kp) || '0', 10) || 0;
  }

  function setKP(value) {
    localStorage.setItem(STORE.kp, String(Math.max(0, value)));
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
    updateButtonSummary();
    if (typeof window.saveToCloud === 'function') window.saveToCloud();
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
        <div class="ks-task-panel" role="dialog" aria-modal="true" aria-label="コツ（タスク）習得">
          <div class="ks-task-header">
            <div class="ks-task-title-row">
              <div class="ks-task-title">📋 コツ（タスク）習得</div>
              <button class="ks-task-save-close" type="button" data-ks-action="save-close">💾 保存して閉じる</button>
              <div class="ks-task-title-actions">
                <span class="ks-task-version" title="コツ習得 v102">v102</span>
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
    `;
    document.body.appendChild(root);
    bindEvents(root);
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
        if (template) addTask(template);
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
      if (action === 'rename-close') closeRename();
      if (action === 'rename-save') saveRenameChoice();
      if (action === 'pick-subject') openPicker('subject');
      if (action === 'pick-type') openPicker('type');
      if (action === 'add-task') addTask();
      if (action === 'toggle-add-details') toggleAddDetails();
      if (action === 'save-template') saveTemplate();
      if (action === 'carry-all') carryAll();
      if (action === 'accept-carry') acceptCarry();
      if (action === 'toggle-done-list') toggleDoneList();
      if (action === 'delete-template') deleteTemplate(actionEl.dataset.id);
      if (action === 'priority') setPriority(Number(actionEl.dataset.priority));
      if (action === 'open-story-settings') openStorySettings();
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if ($('ks-task-detail-overlay').classList.contains('is-open')) closeDetail();
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
  }

  function close() {
    if (!$('ks-task-sheet')) return;
    state.open = false;
    $('ks-task-sheet').classList.remove('is-open');
    $('ks-task-sheet').setAttribute('aria-hidden', 'true');
    closePicker();
    closeDetail();
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
	    const selectedLabel = categoryLabel(selectedCategory);

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
	        <div class="ks-task-add-head">
	          <div>
	            <div class="ks-task-add-title">今日のコツを追加</div>
	            <div class="ks-task-add-sub">科目・種類・量を決めて積み上げます</div>
	          </div>
	        </div>
	        <div class="ks-task-add-row">
          <button class="ks-task-picker ${state.selectedSubject ? 'has-value' : ''}" type="button" data-ks-action="pick-subject"><span class="ks-task-step-num">①</span>${escapeHtml(state.selectedSubject || '科目')}</button>
          <button class="ks-task-picker ${state.selectedType ? 'has-value' : ''}" type="button" data-ks-action="pick-type"><span class="ks-task-step-num">②</span>${escapeHtml(state.selectedType || '種類')}</button>
          <button class="ks-task-add-btn" type="button" data-ks-action="add-task"><span class="ks-task-step-num">③</span>＋コツ</button>
        </div>
        <button class="ks-task-detail-toggle" type="button" data-ks-action="toggle-add-details" aria-expanded="${state.addDetailsOpen ? 'true' : 'false'}">
          <span>詳細設定</span>
          <span class="ks-task-category-pill cat-${escapeHtml(selectedCategory)}">${escapeHtml(selectedLabel.icon)} ${escapeHtml(selectedLabel.name)}</span>
          <span class="ks-task-detail-arrow">${state.addDetailsOpen ? '▲' : '▼'}</span>
        </button>
        <div class="ks-task-add-details ${state.addDetailsOpen ? 'is-open' : ''}" id="ks-task-add-details">
          <div class="ks-task-detail-grid">
            <div class="ks-task-field"><div class="ks-task-label">予定量</div><input class="ks-task-input" id="ks-task-plan-amt" type="number" min="0" placeholder="20"></div>
            <div class="ks-task-field"><div class="ks-task-label">単位</div><input class="ks-task-input" id="ks-task-unit" maxlength="12" placeholder="${escapeHtml(unitFor(state.selectedType))}"></div>
            <div class="ks-task-field"><div class="ks-task-label">予定分</div><input class="ks-task-input" id="ks-task-plan-mins" type="number" min="0" placeholder="30"></div>
            <button class="ks-task-small-btn" type="button" data-ks-action="save-template" title="テンプレート保存">⭐保存</button>
          </div>
          <div class="ks-task-priority-row">
            <span class="ks-task-priority-label">優先度</span>
            ${[1, 2, 3, 4].map((n) => `<button class="ks-task-pri ${state.priority === n ? 'is-active' : ''}" type="button" data-ks-action="priority" data-priority="${n}">${priorityLabel(n)}</button>`).join('')}
          </div>
        </div>
        <div class="ks-task-template-strip">${renderTemplates()}</div>
      </div>
      <div class="ks-task-section-head"><span>未完了 <span style="color:var(--accent)">${todo.length}</span> 件</span><button class="ks-task-small-btn" type="button" data-ks-action="carry-all">全部→明日</button></div>
      <div class="ks-task-list">${todo.length ? todo.map(renderTaskCard).join('') : '<div class="ks-task-empty">今日のコツを積んでみましょう</div>'}</div>
      <button class="ks-task-small-btn" type="button" data-ks-action="toggle-done-list" style="width:100%;margin-top:10px">完了したコツ（${done.length}件）</button>
      <div class="ks-task-list" id="ks-task-done-list" style="display:none;margin-top:7px">${done.map(renderTaskCard).join('') || '<div class="ks-task-empty">完了コツはまだありません</div>'}</div>
      ${doneMins ? `<div class="ks-task-story" style="margin-top:10px"><div class="ks-task-story-char">⏱</div><div><div class="ks-task-story-name">今日のタスク実績 ${doneMins}分</div><div class="ks-task-story-msg">学習時間本体とは別集計です</div></div></div>` : ''}
    `;
  }

  function renderStoryEvolutionCompact(story, snapshot) {
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
              <div class="ks-task-evo-count">${snapshot.count}/100</div>
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
      ${snapshot.count >= 100 ? '<div class="ks-task-evolution-complete">100コツ到達。ここまで積み上げたこと自体が、ちゃんとあなたの力です。</div>' : ''}
    `;
  }

  function shortStoryName(name) {
    return String(name || 'ストーリー').replace(/成長記|の道|の旅|の特訓|試験|合格への道|への挑戦/g, '').slice(0, 6) || 'ストーリー';
  }

  function renderTemplates() {
    const list = templates();
    if (!list.length) return '<span class="ks-task-template">テンプレなし</span>';
    return list.map((tmpl) => `
      <span class="ks-task-template">
        <button type="button" data-ks-template="${escapeHtml(tmpl.id)}">${escapeHtml(tmpl.subject)} / ${escapeHtml(tmpl.type)}</button>
        <button type="button" data-ks-action="delete-template" data-id="${escapeHtml(tmpl.id)}">×</button>
      </span>
    `).join('');
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

  function addTask(template) {
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
    mru('subject', subject);
    mru('type', type);
    state.selectedType = '';
    if ($('ks-task-plan-amt')) $('ks-task-plan-amt').value = '';
    if ($('ks-task-plan-mins')) $('ks-task-plan-mins').value = '';
    if ($('ks-task-unit')) $('ks-task-unit').value = '';
    render();
    notify('コツを積みました');
  }

  function numberValue(id) {
    const el = $(id);
    if (!el) return null;
    const num = parseFloat(el.value);
    return Number.isFinite(num) ? num : null;
  }

  function saveTemplate() {
    if (!state.selectedType) {
      notify('種類を選んでください', true);
      return;
    }
    const list = templates();
    list.unshift({
      id: Date.now() + '-' + Math.floor(Math.random() * 100000),
	      subject: state.selectedSubject || '未分類',
	      type: state.selectedType,
	      storyId: getCurrentStory(),
	      category: categoryFor(state.selectedType),
      plannedAmt: numberValue('ks-task-plan-amt'),
      unit: (($('ks-task-unit') && $('ks-task-unit').value.trim()) || unitFor(state.selectedType)),
      plannedMins: numberValue('ks-task-plan-mins'),
      priority: state.priority
    });
    saveTemplates(list.slice(0, 20));
    renderToday();
    notify('テンプレートに保存しました');
  }

  function deleteTemplate(id) {
    saveTemplates(templates().filter((tmpl) => String(tmpl.id) !== String(id)));
    renderToday();
  }

  function toggleDone(id) {
    const { data, today, list } = todayTasks();
    const task = list.find((item) => String(item.id) === String(id));
    if (!task) return;
    const storyId = task.storyId || getCurrentStory();
    const beforeEvolutionStage = storyProgressSnapshot(storyId).stage.count;
    if (task.status === 'done') {
      task.status = 'todo';
      task.completedAt = null;
      if (task.earnedKP) addKP(-task.earnedKP);
      task.earnedKP = 0;
      touchTask(task);
      saveTasks(data);
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
    render();
    const afterEvolution = syncStoryProgress(storyId);
    const unlockedStage = afterEvolution && afterEvolution.stage.count > beforeEvolutionStage ? afterEvolution : null;
    showFloat(task, unlockedStage);
  }

  function deleteTask(id) {
    const { data, today, list } = todayTasks();
    const task = list.find((item) => String(item.id) === String(id));
    if (!task) return;
    if (task.status === 'done' && task.earnedKP) addKP(-task.earnedKP);
    rememberDeleted(task.id);
    data[today] = list.filter((item) => String(item.id) !== String(id));
    saveTasks(data);
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
    } else {
      state.selectedType = value;
      state.selectedCategory = categoryFor(value);
      mru('type', value);
    }
    closePicker();
    renderToday();
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

  function showFloat(task, unlockedEvolution) {
    const story = getStoryMeta();
    const messages = {
      gorilla: '完了ゴリ。強くなったゴリ。',
      samurai: '一つ斬った。次へ進もう。',
      space: 'ミッション完了。航路は順調。',
      itachacha: 'ニヤニヤ……コツを積みましたね。',
      spartan: 'よくやった。次だ。'
    };
    $('ks-task-float-char').textContent = unlockedEvolution ? unlockedEvolution.stage.icon : story.icon;
    $('ks-task-float-msg').textContent = unlockedEvolution
      ? (unlockedEvolution.count >= 100 ? 'ストーリー進化が100コツに到達しました。' : unlockedEvolution.stage.name + 'を解放しました。')
      : (messages[getCurrentStory()] || 'コツを積みました。');
    $('ks-task-float-kp').textContent = '+' + task.earnedKP + ' KP';
    $('ks-task-float').classList.add('is-show');
    clearTimeout(state.floatTimer);
    state.floatTimer = setTimeout(() => $('ks-task-float').classList.remove('is-show'), 2600);
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

  function updateButtonSummary() {
    const button = $('ks-task-open-btn');
    if (!button) return;
    const list = (tasksByDate()[studyDate(0)] || []).filter((task) => task.status !== 'carried');
    const done = list.filter((task) => task.status === 'done');
    const todo = list.length - done.length;
    const pct = list.length ? Math.round(done.length / list.length * 100) : 0;
    const sub = button.querySelector('[data-ks-open-sub]');
    const pctEl = button.querySelector('[data-ks-open-pct]');
    if (sub) sub.textContent = list.length ? `残り${todo}件 / ${done.length}完了` : '今日のコツを追加';
    if (pctEl) pctEl.textContent = list.length ? `${pct}%` : '0%';
  }

  function exportData() {
    const data = {
      version: 1,
      tasks: tasksByDate(),
      templates: templates(),
      deleted: deletedIds(),
      kp: getKP(),
      storyProgress: readJson(STORE.storyProgress, {}),
      equipmentUnlocked: readJson(STORE.equipmentUnlocked, {}),
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
    writeJson(STORE.templates, Array.isArray(payload.templates) ? payload.templates : []);
    saveDeletedIds(Array.isArray(payload.deleted) ? payload.deleted : []);
    setKP(Number(payload.kp) || 0);
    writeJson(STORE.storyProgress, payload.storyProgress || {});
    writeJson(STORE.equipmentUnlocked, payload.equipmentUnlocked || {});
    writeJson(STORE.taskSettings, payload.taskSettings || {});
    if (payload.lists && typeof payload.lists === 'object') {
      Object.keys(payload.lists).forEach((key) => {
        if (key.indexOf(STORE.subjectPrefix) === 0 || key.indexOf(STORE.typePrefix) === 0 || key.indexOf(STORE.typeCategoryPrefix) === 0) {
          localStorage.setItem(key, payload.lists[key]);
        }
      });
    }
    syncStoryProgress();
    updateButtonSummary();
    if (state.open) render();
  }

  function mergeData(payload) {
    if (!payload || typeof payload !== 'object') return exportData();
    const deleted = new Set(deletedIds().concat(Array.isArray(payload.deleted) ? payload.deleted.map(String) : []));
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

    const templateMap = new Map();
    templates().forEach((tmpl) => templateMap.set(String(tmpl.id), tmpl));
    (Array.isArray(payload.templates) ? payload.templates : []).forEach((tmpl) => {
      if (tmpl && !templateMap.has(String(tmpl.id))) templateMap.set(String(tmpl.id), tmpl);
    });

    writeJson(STORE.tasks, mergedTasks);
    writeJson(STORE.taskDataAlias, mergedTasks);
    writeJson(STORE.templates, Array.from(templateMap.values()).slice(0, 40));
    saveDeletedIds(Array.from(deleted));
    writeJson(STORE.storyProgress, { ...(payload.storyProgress || {}), ...readJson(STORE.storyProgress, {}) });
    writeJson(STORE.equipmentUnlocked, { ...(payload.equipmentUnlocked || {}), ...readJson(STORE.equipmentUnlocked, {}) });
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
    updateButtonSummary();
    if (state.open) render();
    return exportData();
  }

  function clearAll() {
    Object.keys(localStorage).forEach((key) => {
      if (key === STORE.tasks || key === STORE.templates || key === STORE.deleted || key === STORE.kp || key === STORE.storyProgress || key === STORE.equipmentUnlocked || key === STORE.taskDataAlias || key === STORE.taskSettings || key.indexOf(STORE.subjectPrefix) === 0 || key.indexOf(STORE.typePrefix) === 0 || key.indexOf(STORE.typeCategoryPrefix) === 0) {
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
    }
    updateButtonSummary();
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
