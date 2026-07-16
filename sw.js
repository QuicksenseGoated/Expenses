const VERSION = 'financer-v23';
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
  'financer-v13',
  'financer-v14',
  'financer-v15',
  'financer-v16',
  'financer-v17',
  'financer-v18',
  'financer-v19',
  'financer-v20',
  'financer-v21',
  'financer-v22'
];

const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './store.js',
  './billing.js',
  './trials.js',
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
  './components/profile.js',
  './components/brand.js',
  './components/onboarding.js',
  './components/notifications.js',
  './components/reminder-db.js',
  './components/crypto.js',
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

self.addEventListener('sync', (event) => {
  if (event.tag !== 'financer-reminders') return;
  event.waitUntil(runOfflineReminders());
});

const IDB_NAME = 'financer-reminders';
const IDB_KEY = 'state';

function openReminderDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains('kv')) {
        req.result.createObjectStore('kv');
      }
    };
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

function idbGetState(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readonly');
    const req = tx.objectStore('kv').get(IDB_KEY);
    req.onsuccess = () => resolve(req.result || { sent: {}, snapshot: null });
    req.onerror = () => reject(req.error);
  });
}

function idbSaveState(db, state) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(state, IDB_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function money(n, currency) {
  return `${currency}${Number(n).toFixed(2)}`;
}

async function runOfflineReminders() {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  if (clients.length) {
    clients.forEach((c) => c.postMessage({ type: 'CHECK_REMINDERS' }));
    return;
  }

  const db = await openReminderDb();
  const state = await idbGetState(db);
  const snap = state.snapshot;
  if (!snap?.notifications) return;

  const day = snap.today || new Date().toISOString().slice(0, 10);
  const sent = state.sent || {};
  const pending = [];

  const queue = (key, title, body) => {
    if (sent[key] === day) return;
    pending.push({ key, title, body });
  };

  for (const b of snap.bills || []) {
    const when = b.daysUntil === 0 ? 'today' : 'tomorrow';
    queue(`bill-${b.id}-${b.nextBill}`, 'Bill due ' + when, `${b.name} — ${b.price} ${b.currency}`);
  }
  for (const b of snap.cancels || []) {
    queue(`cancel-${b.id}-${b.cancelBy}`, 'Cancel window closing', `${b.name} — cancel by ${b.cancelBy}`);
  }
  for (const t of snap.trials || []) {
    const when = t.daysLeft === 0 ? 'today' : `in ${t.daysLeft} day${t.daysLeft === 1 ? '' : 's'}`;
    queue(`trial-${t.id}-${t.trialEnds}`, 'Trial ending ' + when, `${t.name} — first charge after trial`);
  }
  for (const b of snap.budgets || []) {
    const level = b.rawPct >= 100 ? 'over' : 'warn';
    const key = `budget-${level}-${b.id}-${snap.month}`;
    if (b.rawPct >= 100) {
      queue(key, 'Budget exceeded', `${b.name}: over ${money(b.limit, snap.currency)} limit`);
    } else if (b.rawPct >= 80) {
      queue(key, 'Budget at 80%', `${b.name}: ${money(b.used, snap.currency)} of ${money(b.limit, snap.currency)}`);
    }
  }
  for (const p of snap.priceChanges || []) {
    queue(`price-${p.id}-${day}`, 'Subscription price changed', `${p.name}: ${money(p.oldPrice, p.currency)} → ${money(p.newPrice, p.currency)}`);
  }

  if (!pending.length) return;

  for (const n of pending) {
    await self.registration.showNotification(n.title, {
      body: n.body,
      icon: './icons/icon-192.png',
      tag: n.key,
    });
    sent[n.key] = day;
  }
  state.sent = sent;
  await idbSaveState(db, state);
}

function isNetworkFirst(url) {
  if (NETWORK_FIRST.some((part) => url.includes(part))) return true;
  // Always fetch JS fresh — avoids stale SW serving broken modules after updates
  if (/\.js(\?|$)/.test(url)) return true;
  return false;
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
