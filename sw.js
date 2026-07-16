const VERSION = 'financer-v14';
const LEGACY_CACHES = [
  'sense-desk-v3.3',
  'sense-desk-v3',
  'ledger-ui-v1',
  'qs-ops-v1.0',
  'qs-ops-v1.1',
  'qs-ops-v1.2',
  'financer-v1',
  'financer-v2',
  'financer-v8',
  'financer-v9',
  'financer-v10',
  'financer-v11',
  'financer-v12',
  'financer-v13'
];

const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './store.js',
  './billing.js',
  './catalog.js',
  './catalog-data.js',
  './manifest.webmanifest',
  './icons/logo.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './components/ui.js',
  './components/home.js',
  './components/bills.js',
  './components/activity.js',
  './components/calendar.js',
  './components/brand.js',
  './components/onboarding.js',
  './components/install.js',
  './components/tab-icons.js'
];

const NETWORK_FIRST = [
  '/index.html',
  '/manifest.webmanifest',
  '/sw.js',
  '/icons/',
  'index.html',
  'manifest.webmanifest',
  'sw.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

function isNetworkFirst(url) {
  return NETWORK_FIRST.some((part) => url.includes(part));
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = e.request.url;

  if (isNetworkFirst(url)) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res && res.ok && new URL(url).origin === self.location.origin) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
