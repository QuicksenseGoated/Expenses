import { Store } from '../store.js';
import {
  syncReminderSnapshot,
  wasReminderSent,
  markReminderSent,
  migrateLegacyReminders,
} from './reminder-db.js';

let migrated = false;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function money(n, currency) {
  return `${currency}${Number(n).toFixed(2)}`;
}

async function ensureMigrated() {
  if (migrated) return;
  await migrateLegacyReminders();
  migrated = true;
}

export function buildReminderSnapshot() {
  const s = Store.get();
  const day = today();
  const month = day.slice(0, 7);

  return {
    notifications: !!s.settings?.notifications,
    currency: s.currency,
    today: day,
    month,
    bills: Store.upcomingBills(3)
      .filter((b) => b.daysUntil <= 1)
      .map((b) => ({
        id: b.id,
        name: b.name,
        price: b.price,
        currency: b.currency,
        nextBill: b.nextBill,
        daysUntil: b.daysUntil,
      })),
    cancels: Store.cancelAlerts(3).map((b) => ({
      id: b.id,
      name: b.name,
      cancelBy: b.cancelBy,
    })),
    trials: Store.trialsEnding(3).map((t) => ({
      id: t.id,
      name: t.name,
      trialEnds: t.trialEnds,
      daysLeft: t.daysLeft,
    })),
    budgets: Store.budgetAlerts().map((b) => ({
      id: b.id,
      name: b.name,
      used: b.used,
      limit: b.limit,
      rawPct: b.rawPct,
    })),
    priceChanges: s.subscriptions
      .filter((sub) => sub.priceHistory?.[0]?.date === day)
      .map((sub) => ({
        id: sub.id,
        name: sub.name,
        oldPrice: sub.priceHistory[0].price,
        newPrice: sub.price,
        currency: sub.currency,
      })),
  };
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

function showNotification(title, body, tag) {
  new Notification(title, {
    body,
    icon: './icons/icon-192.png',
    tag,
  });
}

export async function runReminderChecks({ useWindowNotification = true } = {}) {
  await ensureMigrated();
  const snapshot = buildReminderSnapshot();
  await syncReminderSnapshot(snapshot);

  if (!snapshot.notifications) return snapshot;

  const day = snapshot.today;
  const cur = snapshot.currency;
  const fired = [];

  const maybeNotify = async (key, title, body) => {
    if (await wasReminderSent(key, day)) return;
    if (useWindowNotification && notificationsSupported() && Notification.permission === 'granted') {
      showNotification(title, body, key);
    }
    await markReminderSent(key, day);
    fired.push(key);
  };

  for (const b of snapshot.bills) {
    const when = b.daysUntil === 0 ? 'today' : 'tomorrow';
    await maybeNotify(
      `bill-${b.id}-${b.nextBill}`,
      'Bill due ' + when,
      `${b.name} — ${b.price} ${b.currency}`
    );
  }

  for (const b of snapshot.cancels) {
    await maybeNotify(
      `cancel-${b.id}-${b.cancelBy}`,
      'Cancel window closing',
      `${b.name} — cancel by ${b.cancelBy}`
    );
  }

  for (const t of snapshot.trials) {
    const when = t.daysLeft === 0 ? 'today' : `in ${t.daysLeft} day${t.daysLeft === 1 ? '' : 's'}`;
    await maybeNotify(
      `trial-${t.id}-${t.trialEnds}`,
      'Trial ending ' + when,
      `${t.name} — first charge after trial`
    );
  }

  for (const b of snapshot.budgets) {
    const level = b.rawPct >= 100 ? 'over' : 'warn';
    const key = `budget-${level}-${b.id}-${snapshot.month}`;
    if (b.rawPct >= 100) {
      await maybeNotify(key, 'Budget exceeded', `${b.name}: over ${money(b.limit, cur)} limit`);
    } else if (b.rawPct >= 80) {
      await maybeNotify(key, 'Budget at 80%', `${b.name}: ${money(b.used, cur)} of ${money(b.limit, cur)}`);
    }
  }

  for (const p of snapshot.priceChanges) {
    await maybeNotify(
      `price-${p.id}-${day}`,
      'Subscription price changed',
      `${p.name}: ${money(p.oldPrice, p.currency)} → ${money(p.newPrice, p.currency)}`
    );
  }

  return { snapshot, fired };
}

export function checkReminders() {
  runReminderChecks().catch(() => {});
}
