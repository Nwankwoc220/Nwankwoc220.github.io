const CACHE = 'lasu-nav-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/lasu-navigator-1.css',
  '/lasu-navigator-1.js',
  '/qrcode.min.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
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
  // Remove old caches during activation so clients pick up the new cache name
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Serve cached assets first, then network; for navigation requests, fallback to the manifest start_url (SPA routing)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(networkRes => {
        // Optionally cache new requests here if you want a runtime cache
        return networkRes;
      }).catch(() => {
        // If request expects HTML (navigation) return the cached index.html for SPA
        const accept = event.request.headers.get('accept') || '';
        // Use the app's start URL as the offline fallback (now index.html).
        if (accept.includes('text/html')) return caches.match('/index.html');
        return caches.match('/index.html');
      });
    })
  );
});
