// sw.js - コツコツサクサク Service Worker
// ============================================================
// ★ バージョンアップ時は以下の3か所だけ変更する
//   1. ここの CACHE_VERSION
//   2. index.html の CURRENT_VERSION（フォールバック値）
//   3. version.json の version
// ============================================================
const CACHE_VERSION = 'kotsusaku-v110-datafix';
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './kotsu-tasks.css',
  './kotsu-tasks.js',
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
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
];

// インストール時：必要なファイルをキャッシュ
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(CACHE_FILES))
  );
  // skipWaiting はメッセージ経由でのみ実行（自動発火しない）
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

  if (url.pathname.endsWith('version.json')) {
    // version.json は常にネットワークから取得（キャッシュしない）
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).catch(() => caches.match(e.request))
    );
    return;
  }

  if (e.request.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).then(response => {
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
