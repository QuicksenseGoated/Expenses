/** Local Financer state — balance, spends, subscriptions. */

import { migrateCatalogId } from './catalog.js';

const KEY = 'financer.v2';
const LEGACY = 'financer.v1';

const empty = () => ({
  balance: null,
  currency: '€',
  transactions: [],
  subscriptions: [],
  budgets: [
    { id: 'essentials', name: 'Essentials', limit: 200, color: '#0B1F3A' },
    { id: 'lifestyle', name: 'Lifestyle', limit: 120, color: '#1E40AF' },
    { id: 'savings', name: 'Savings', limit: 100, color: '#D4A853' }
  ]
});

function normalize(state) {
  let changed = false;
  const next = { ...state };
  next.subscriptions = (next.subscriptions || []).map((sub) => {
    const catalogId = migrateCatalogId(sub.catalogId);
    if (catalogId !== sub.catalogId) changed = true;
    return catalogId === sub.catalogId ? sub : { ...sub, catalogId };
  });
  if (changed) write(next);
  return next;
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize({ ...empty(), ...JSON.parse(raw) });
    const legacy = localStorage.getItem(LEGACY);
    if (legacy) {
      const migrated = normalize({ ...empty(), ...JSON.parse(legacy) });
      write(migrated);
      return migrated;
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
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY);
    return write(empty());
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
    if (s.subscriptions.some((x) => x.catalogId === entry.catalogId)) return s;
    s.subscriptions.unshift({
      id: uid(),
      catalogId: entry.catalogId,
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
      tip: entry.tip || '',
      addedAt: isoToday()
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
    return read().subscriptions.reduce((sum, x) => sum + Number(x.price || 0), 0);
  },

  upcomingBills(days = 30) {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return read().subscriptions
      .map((sub) => {
        const due = new Date(`${sub.nextBill}T12:00:00`);
        const diff = Math.round((due - now) / 86400000);
        return { ...sub, daysUntil: diff };
      })
      .filter((x) => x.daysUntil >= 0 && x.daysUntil <= days)
      .sort((a, b) => a.daysUntil - b.daysUntil);
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
    const burn = this.monthSpend();
    if (burn <= 0) return null;
    const daily = burn / Math.max(1, new Date().getDate());
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
