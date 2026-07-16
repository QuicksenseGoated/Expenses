import { Store } from '../store.js';

const REMINDER_KEY = 'financer.reminders';

function readSent() {
  try {
    return JSON.parse(localStorage.getItem(REMINDER_KEY) || '{}');
  } catch {
    return {};
  }
}

function markSent(key) {
  const sent = readSent();
  sent[key] = new Date().toISOString().slice(0, 10);
  localStorage.setItem(REMINDER_KEY, JSON.stringify(sent));
}

function wasSentToday(key) {
  return readSent()[key] === new Date().toISOString().slice(0, 10);
}

function notify(title, body, tag) {
  new Notification(title, {
    body,
    icon: './icons/icon-192.png',
    tag,
  });
  markSent(tag);
}

export function notificationsSupported() {
  return 'Notification' in window;
}

export async function enableNotifications() {
  if (!notificationsSupported()) return false;
  const result = await Notification.requestPermission();
  const ok = result === 'granted';
  if (ok) Store.updateSettings({ notifications: true });
  return ok;
}

export async function registerBackgroundSync() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    if ('sync' in reg) await reg.sync.register('financer-reminders');
  } catch {
    /* Background Sync not available */
  }
}

export function checkReminders() {
  const s = Store.get();
  if (!s.settings?.notifications) return;
  if (!notificationsSupported() || Notification.permission !== 'granted') return;

  for (const b of Store.upcomingBills(3)) {
    if (b.daysUntil > 1) continue;
    const key = `bill-${b.id}-${b.nextBill}`;
    if (wasSentToday(key)) continue;
    const when = b.daysUntil === 0 ? 'today' : 'tomorrow';
    notify('Bill due ' + when, `${b.name} — ${b.price} ${b.currency}`, key);
  }

  for (const b of Store.cancelAlerts(3)) {
    const key = `cancel-${b.id}-${b.cancelBy}`;
    if (wasSentToday(key)) continue;
    notify('Cancel window closing', `${b.name} — cancel by ${b.cancelBy}`, key);
  }

  for (const t of Store.trialsEnding(3)) {
    const key = `trial-${t.id}-${t.trialEnds}`;
    if (wasSentToday(key)) continue;
    const when = t.daysLeft === 0 ? 'today' : `in ${t.daysLeft} day${t.daysLeft === 1 ? '' : 's'}`;
    notify('Trial ending ' + when, `${t.name} — first charge after trial`, key);
  }

  const month = new Date().toISOString().slice(0, 7);
  for (const b of Store.budgetAlerts()) {
    const level = b.rawPct >= 100 ? 'over' : 'warn';
    const key = `budget-${level}-${b.id}-${month}`;
    if (wasSentToday(key)) continue;
    if (b.rawPct >= 100) {
      notify('Budget exceeded', `${b.name}: ${b.pct}% of ${b.limit} limit`, key);
    } else if (b.rawPct >= 80) {
      notify('Budget at 80%', `${b.name}: ${money(b.used, Store.get().currency)} of ${money(b.limit, Store.get().currency)}`, key);
    }
  }
}

function money(n, currency) {
  return `${currency}${Number(n).toFixed(2)}`;
}
