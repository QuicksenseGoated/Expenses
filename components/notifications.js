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

export function checkReminders() {
  const s = Store.get();
  if (!s.settings?.notifications) return;
  if (!notificationsSupported() || Notification.permission !== 'granted') return;

  for (const b of Store.upcomingBills(3)) {
    if (b.daysUntil > 1) continue;
    const key = `bill-${b.id}-${b.nextBill}`;
    if (wasSentToday(key)) continue;
    const when = b.daysUntil === 0 ? 'today' : 'tomorrow';
    new Notification('Bill due ' + when, {
      body: `${b.name} — ${b.price} ${b.currency}`,
      icon: './icons/icon-192.png',
      tag: key,
    });
    markSent(key);
  }

  for (const b of Store.cancelAlerts(3)) {
    const key = `cancel-${b.id}-${b.cancelBy}`;
    if (wasSentToday(key)) continue;
    new Notification('Cancel window closing', {
      body: `${b.name} — cancel by ${b.cancelBy}`,
      icon: './icons/icon-192.png',
      tag: key,
    });
    markSent(key);
  }
}
