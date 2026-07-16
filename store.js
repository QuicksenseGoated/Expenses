/** Local Financer state — balance, spends, subscriptions, settings. */

import { migrateCatalogId } from './catalog.js';
import {
  projectNextBill,
  projectCancelBy,
  daysUntilPayday,
  billsBeforePayday,
  monthlyEquivalent,
  billDatesInMonth,
  chargesWithinDays,
  rollSubscriptionDates,
  chargeAmount,
} from './billing.js';

const KEY = 'financer.v3';
const SCHEMA_VERSION = 3;
const LEGACY_KEYS = ['financer.v2', 'financer.v1'];

const DEFAULT_WIDGETS = ['metrics', 'bills', 'recent'];

const empty = () => ({
  balance: null,
  currency: '€',
  transactions: [],
  subscriptions: [],
  budgets: [
    { id: 'essentials', name: 'Essentials', limit: 200, color: '#0B1F3A' },
    { id: 'food', name: 'Food', limit: 150, color: '#059669' },
    { id: 'lifestyle', name: 'Lifestyle', limit: 120, color: '#1E40AF' },
    { id: 'transport', name: 'Transport', limit: 80, color: '#7c3aed' },
    { id: 'savings', name: 'Savings', limit: 100, color: '#D4A853' },
  ],
  settings: {
    displayName: '',
    paydayDay: null,
    hideBalance: false,
    theme: 'light',
    onboarded: false,
    homeWidgets: [...DEFAULT_WIDGETS],
  },
});

function normalize(state) {
  let changed = false;
  const next = { ...empty(), ...state };
  if (!next.settings) {
    next.settings = empty().settings;
    changed = true;
  }
  next.settings = { ...empty().settings, ...next.settings };
  if (next.settings.theme === 'system') {
    next.settings.theme = 'light';
    changed = true;
  }
  next.subscriptions = (next.subscriptions || []).map((sub) => {
    const catalogId = migrateCatalogId(sub.catalogId);
    const patch = catalogId !== sub.catalogId ? { catalogId } : {};
    const merged = Object.keys(patch).length ? { ...sub, ...patch } : sub;
    return rollSubscriptionDates(merged);
  });
  if (changed || next.subscriptions.some((s, i) => s !== state.subscriptions?.[i])) {
    write(next);
  }
  return next;
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
    for (const legacyKey of LEGACY_KEYS) {
      const legacy = localStorage.getItem(legacyKey);
      if (legacy) {
        const migrated = normalize(JSON.parse(legacy));
        write(migrated);
        return migrated;
      }
    }
    return empty();
  } catch {
    return empty();
  }
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  return state;
}

const uid = () => Math.random().toString(36).slice(2, 9);
const isoToday = () => new Date().toISOString().slice(0, 10);
const monthKey = () => new Date().toISOString().slice(0, 7);

export const Store = {
  get: () => read(),

  reset() {
    LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem(KEY);
    return write(empty());
  },

  updateSettings(patch) {
    const s = read();
    s.settings = { ...s.settings, ...patch };
    return write(s);
  },

  setCurrency(currency) {
    const s = read();
    s.currency = currency;
    s.subscriptions = s.subscriptions.map((x) => ({ ...x, currency }));
    return write(s);
  },

  updateBudget(id, patch) {
    const s = read();
    s.budgets = s.budgets.map((b) => (b.id === id ? { ...b, ...patch } : b));
    return write(s);
  },

  exportData() {
    return JSON.stringify({ schemaVersion: SCHEMA_VERSION, ...read() }, null, 2);
  },

  importData(json) {
    const parsed = JSON.parse(json);
    const { schemaVersion, ...rest } = parsed;
    return write(normalize(rest));
  },

  setBalance(amount) {
    const s = read();
    s.balance = Number(amount);
    return write(s);
  },

  addSpend({ amount, note, category }) {
    const s = read();
    const value = Math.abs(Number(amount));
    if (!Number.isFinite(value) || value <= 0) return s;
    if (s.balance == null) s.balance = 0;
    s.balance = Number((s.balance - value).toFixed(2));
    s.transactions.unshift({
      id: uid(),
      type: 'spend',
      amount: value,
      note: note || 'Purchase',
      category: category || 'General',
      date: isoToday()
    });
    s.transactions = s.transactions.slice(0, 120);
    return write(s);
  },

  addIncome({ amount, note }) {
    const s = read();
    const value = Math.abs(Number(amount));
    if (!Number.isFinite(value) || value <= 0) return s;
    if (s.balance == null) s.balance = 0;
    s.balance = Number((s.balance + value).toFixed(2));
    s.transactions.unshift({
      id: uid(),
      type: 'income',
      amount: value,
      note: note || 'Deposit',
      category: 'Income',
      date: isoToday()
    });
    s.transactions = s.transactions.slice(0, 120);
    return write(s);
  },

  deleteTx(id) {
    const s = read();
    const tx = s.transactions.find((t) => t.id === id);
    if (!tx) return s;
    if (s.balance == null) s.balance = 0;
    s.balance = Number(
      (tx.type === 'spend' ? s.balance + tx.amount : s.balance - tx.amount).toFixed(2)
    );
    s.transactions = s.transactions.filter((t) => t.id !== id);
    return write(s);
  },

  addSubscription(entry) {
    const s = read();
    const catalogId = entry.catalogId || `custom:${uid()}`;
    const isCustom = String(catalogId).startsWith('custom:');
    if (!isCustom && s.subscriptions.some((x) => x.catalogId === catalogId)) return s;
    s.subscriptions.unshift({
      id: uid(),
      catalogId,
      name: entry.name,
      category: entry.category,
      price: Number(entry.price),
      currency: entry.currency || '€',
      cycle: entry.cycle || 'monthly',
      nextBill: entry.nextBill,
      cancelBy: entry.cancelBy,
      url: entry.url || '',
      manageUrl: entry.manageUrl || '',
      why: entry.why || '',
      when: entry.when || '',
      how: entry.how || '',
      billingAnchor: entry.billingAnchor || '',
      billingDay: entry.billingDay || null,
      tip: entry.tip || '',
      addedAt: isoToday(),
    });
    return write(s);
  },

  removeSubscription(id) {
    const s = read();
    s.subscriptions = s.subscriptions.filter((x) => x.id !== id);
    return write(s);
  },

  updateSubscription(id, patch) {
    const s = read();
    s.subscriptions = s.subscriptions.map((x) => (x.id === id ? { ...x, ...patch } : x));
    return write(s);
  },

  monthSpend() {
    const m = monthKey();
    return read().transactions
      .filter((t) => t.type === 'spend' && t.date.startsWith(m))
      .reduce((sum, t) => sum + t.amount, 0);
  },

  weekSpend() {
    const s = read();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const spent = s.transactions
        .filter((t) => t.type === 'spend' && t.date === key)
        .reduce((sum, t) => sum + t.amount, 0);
      days.push({ key, label: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1), spent });
    }
    return days;
  },

  subsMonthly() {
    return read().subscriptions.reduce(
      (sum, x) => sum + monthlyEquivalent(x.price, x.cycle),
      0
    );
  },

  paydayIn() {
    return daysUntilPayday(read().settings?.paydayDay);
  },

  billsBeforePayday() {
    const s = read();
    return billsBeforePayday(s.subscriptions, s.settings?.paydayDay);
  },

  billsBeforePaydayTotal() {
    return this.billsBeforePayday().reduce(
      (sum, x) => sum + chargeAmount(x),
      0
    );
  },

  /** Bills projected to charge in a calendar month (recurring projection). */
  monthSchedule(year, month) {
    const s = read();
    const payday = s.settings?.paydayDay;
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const byDate = new Map();
    let monthTotal = 0;
    let chargeCount = 0;

    for (const sub of s.subscriptions) {
      const dates = billDatesInMonth(sub, year, month);
      for (const iso of dates) {
        chargeCount += 1;
        const amt = chargeAmount(sub);
        monthTotal += amt;
        if (!byDate.has(iso)) byDate.set(iso, []);
        byDate.get(iso).push({ ...sub, dueIso: iso, price: amt });
      }
    }

    const days = [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([iso, rows]) => {
        const d = new Date(`${iso}T12:00:00`);
        const dayNum = d.getDate();
        return {
          iso,
          dayNum,
          weekday: d.toLocaleDateString(undefined, { weekday: 'short' }),
          isPayday: payday != null && dayNum === Number(payday),
          isPast: d < today,
          items: rows,
          dayTotal: rows.reduce((sum, r) => sum + Number(r.price || 0), 0),
        };
      });

    return { monthTotal, chargeCount, days };
  },

  cancelAlerts(withinDays = 7) {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return read().subscriptions
      .map((sub) => {
        const cancel = new Date(`${sub.cancelBy}T12:00:00`);
        const daysUntilCancel = Math.round((cancel - now) / 86400000);
        return { ...sub, daysUntilCancel };
      })
      .filter((x) => x.daysUntilCancel >= 0 && x.daysUntilCancel <= withinDays)
      .sort((a, b) => a.daysUntilCancel - b.daysUntilCancel);
  },

  upcomingBills(days = 30) {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    const rows = [];
    for (const sub of read().subscriptions) {
      for (const hit of chargesWithinDays(sub, days, now)) {
        const due = new Date(`${hit.date}T12:00:00`);
        const diff = Math.round((due - now) / 86400000);
        rows.push({ ...sub, nextBill: hit.date, price: hit.amount, daysUntil: diff });
      }
    }
    return rows
      .filter((x) => x.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil || a.name.localeCompare(b.name));
  },

  reservedForBills() {
    return this.upcomingBills(30).reduce((sum, s) => sum + Number(s.price || 0), 0);
  },

  safeToSpend() {
    const s = read();
    if (s.balance == null) return null;
    return Number((s.balance - this.reservedForBills()).toFixed(2));
  },

  runwayDays() {
    const s = read();
    if (s.balance == null) return null;
    const burn = this.monthSpend() + this.subsMonthly();
    if (burn <= 0) return null;
    const daily = burn / 30;
    return Math.max(0, Math.floor(s.balance / daily));
  },

  budgetBurn() {
    const m = monthKey();
    const s = read();
    return s.budgets.map((b) => {
      const used = s.transactions
        .filter((t) => t.type === 'spend' && t.date.startsWith(m) && t.category === b.name)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...b, used, pct: Math.min(100, Math.round((used / b.limit) * 100)) };
    });
  }
};
