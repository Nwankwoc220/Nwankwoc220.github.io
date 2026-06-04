const CACHE = 'lasu-nav-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/lasu-navigator-1.html',
  '/lasu-navigator-1.css',
  '/lasu-navigator-1.js',
  '/qrcode.min.js',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then(networkResponse => {
        return networkResponse;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
