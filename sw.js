// sw.js - コツコツサクサク Service Worker
// ============================================================
// ★ バージョンアップ時は以下の4か所を変更する
//   1. ここの CACHE_VERSION
//   2. index.html の CURRENT_VERSION（フォールバック値）
//   3. version.json の version
//   4. index.html の kotsu-tasks.css / kotsu-tasks.js の「?v=」と、
//      下の CACHE_FILES の同じ2行（同じ文字列にそろえる。ずれると保管が使われない）
// 「何が新しいか」の案内は notice.json だけの仕事（教訓#008）。
// ============================================================
const CACHE_VERSION = 'kotsusaku-v120-journey-level-0906';
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './kotsu-tasks.css?v=kotsusaku-v120-journey-level-0906',   // index.html の読み込み先（?v=）と必ずそろえること
  './kotsu-tasks.js?v=kotsusaku-v120-journey-level-0906',    // 同上。ずれると保管した分が使われず、毎回ネットから取りに行く
  './bloom-countdown.js?v=bloomday2',   // index.html の読み込み先と必ずそろえること
  './assets/stories/mystery/story_mystery_005.png',
  './assets/stories/mystery/story_mystery_010.png',
  './assets/stories/mystery/story_mystery_020.png',
  './assets/stories/mystery/story_mystery_030.png',
  './assets/stories/mystery/story_mystery_040.png',
  './assets/stories/mystery/story_mystery_050.png',
  './assets/stories/mystery/story_mystery_065.png',
  './assets/stories/mystery/story_mystery_080.png',
  './assets/stories/mystery/story_mystery_088.png',
  './assets/stories/mystery/story_mystery_100.png',
  './assets/spirits/spirit_first_light.webp',
  './assets/spirits/spirit_crash.webp',
  './assets/spirits/spirit_rapid.webp',
  './assets/spirits/spirit_horizon.webp',
  './assets/spirits/spirit_everlasting.webp',
  './assets/spirits/spirit_surehand.webp',
  './assets/spirits/spirit_rising_core.webp',
  './assets/spirits/spirit_complete_soul.webp',
  './assets/spirits/spirit_locked.webp',
  './assets/spirits/spirit_unlock_banner.webp',
  './assets/spirits/spirit_egg_closed.webp',
  './assets/spirits/spirit_egg_crack_1.webp',
  './assets/spirits/spirit_egg_crack_2.webp',
  './assets/spirits/spirit_egg_open.webp',
  './assets/spirits/title_500.webp',
  './assets/spirits/title_1000.webp',
  './assets/spirits/title_2000.webp',
  './assets/bloom/bloom-day-poster.jpg',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
];

// インストール時：必要なファイルをキャッシュ
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(CACHE_FILES))
  );
  // skipWaiting はメッセージ経由でのみ実行（自動発火しない）。
  // index.html 側が、新しい配達係の用意ができた時点で黙って 'SKIP_WAITING' を送る
  // （更新案内ポップアップは出さない。2026-08-19変更）
});

// 有効化時：古いキャッシュを削除
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// フェッチ時：version.json と画面本体はネットワーク優先（更新検知・反映のため）
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  if (url.pathname.endsWith('version.json') || url.pathname.endsWith('notice.json')) {
    // version.json / notice.json は常にネットワークから取得（キャッシュしない）
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).catch(() => caches.match(e.request))
    );
    return;
  }

  if (e.request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    // 'no-cache'：必ずサーバーに「変わった？」と聞きに行く（鮮度は no-store と同じ）。
    // 変わっていなければサーバーは「変わっていない」とだけ返し（304）、中身の再送は無い。
    // 以前の 'no-store' はこの問い合わせを許さず、起動のたびに本体（圧縮後 約190KB）を
    // 丸ごと取り直していた（2026-09-06 変更）。
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' }).then(response => {
        const copyForRoot = response.clone();
        const copyForIndex = response.clone();
        caches.open(CACHE_VERSION).then(cache => {
          cache.put('./', copyForRoot);
          cache.put('./index.html', copyForIndex);
        });
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// メインスレッドからのメッセージ受信
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
