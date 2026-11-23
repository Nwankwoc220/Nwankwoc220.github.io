importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyB3e9pejY7EkDO8i5cZ7HX5KUmLGpBWdz8',
  authDomain: 'lasu-navigator.firebaseapp.com',
  projectId: 'lasu-navigator',
  storageBucket: 'lasu-navigator.firebasestorage.app',
  messagingSenderId: '128402428847',
  appId: '1:128402428847:web:eeee2966c791121829155a',
  measurementId: 'G-J0R6H1LBK4'
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  const title = payload?.notification?.title || 'LASU Navigator';
  const body = payload?.notification?.body || 'You have a new campus update.';
  return self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: payload?.data || {}
  });
});

const CACHE = 'lasu-nav-v5';
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
        return networkRes;
      }).catch(() => {
        const accept = event.request.headers.get('accept') || '';
        if (accept.includes('text/html')) return caches.match('/index.html');
        return caches.match('/index.html');
      });
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = new URL(
    event.notification.data?.url || '/index.html',
    self.location.origin
  );
  if (targetUrl.origin !== self.location.origin) {
    targetUrl.href = new URL('/index.html', self.location.origin).href;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          return client.navigate(targetUrl.href).then(() => client.focus());
        }
      }
      return clients.openWindow(targetUrl.href);
    })
  );
});
