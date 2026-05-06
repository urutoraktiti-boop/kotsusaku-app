// sw.js - コツコツサクサク Service Worker
// ============================================================
// ★ バージョンアップ時は以下の3か所だけ変更する
//   1. ここの CACHE_VERSION
//   2. index.html の CURRENT_VERSION（フォールバック値）
//   3. version.json の version
// ============================================================
const CACHE_VERSION = 'kotsusaku-v55';
const CACHE_FILES = [
  './',
  './index.html',
  './manifest.json',
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

// フェッチ時：キャッシュ優先、なければネットワーク
self.addEventListener('fetch', e => {
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
