/** Shared reminder state in IndexedDB — readable by the service worker offline. */

const DB_NAME = 'financer-reminders';
const DB_VERSION = 1;
const STATE_KEY = 'state';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains('kv')) {
        req.result.createObjectStore('kv');
      }
    };
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

async function idbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readonly');
    const req = tx.objectStore('kv').get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

const emptyState = () => ({ sent: {}, snapshot: null });

export async function getReminderState() {
  try {
    const state = await idbGet(STATE_KEY);
    return state ? { ...emptyState(), ...state } : emptyState();
  } catch {
    return emptyState();
  }
}

export async function saveReminderState(state) {
  await idbSet(STATE_KEY, state);
}

export async function syncReminderSnapshot(snapshot) {
  const state = await getReminderState();
  state.snapshot = snapshot;
  await saveReminderState(state);
}

export async function wasReminderSent(key, today) {
  const state = await getReminderState();
  return state.sent[key] === today;
}

export async function markReminderSent(key, today) {
  const state = await getReminderState();
  state.sent[key] = today;
  await saveReminderState(state);
}

/** One-time migrate from legacy localStorage sent keys. */
export async function migrateLegacyReminders() {
  try {
    const raw = localStorage.getItem('financer.reminders');
    if (!raw) return;
    const legacy = JSON.parse(raw);
    const state = await getReminderState();
    state.sent = { ...legacy, ...state.sent };
    await saveReminderState(state);
    localStorage.removeItem('financer.reminders');
  } catch {
    /* ignore */
  }
}
