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
import { isOnTrial, isoToday, getSubLifecycle } from './trials.js';

const KEY = 'financer.v3';
const UNDO_KEY = 'financer.undo';
const SCHEMA_VERSION = 3;
const LEGACY_KEYS = ['financer.v2', 'financer.v1'];
const MAX_UNDO = 8;

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
    notifications: false,
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
    const withDefaults = {
      ...merged,
      trialEnds: merged.trialEnds || null,
      trialVerified: merged.trialVerified ?? (merged.trialEnds ? true : null),
      trialSource: merged.trialSource || '',
      trialDays: merged.trialDays || null,
      startedAt: merged.startedAt || merged.addedAt || null,
      priceHistory: merged.priceHistory || [],
    };
    return rollSubscriptionDates(withDefaults);
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

function readUndo() {
  try {
    return JSON.parse(localStorage.getItem(UNDO_KEY) || '[]');
  } catch {
    return [];
  }
}

function pushUndo(entry) {
  const stack = readUndo();
  stack.unshift({ ...entry, at: Date.now() });
  localStorage.setItem(UNDO_KEY, JSON.stringify(stack.slice(0, MAX_UNDO)));
}

function writeUndo(stack) {
  localStorage.setItem(UNDO_KEY, JSON.stringify(stack.slice(0, MAX_UNDO)));
}

const uid = () => Math.random().toString(36).slice(2, 9);
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
    pushUndo({ kind: 'tx', tx: { ...tx }, balance: s.balance });
    if (s.balance == null) s.balance = 0;
    s.balance = Number(
      (tx.type === 'spend' ? s.balance + tx.amount : s.balance - tx.amount).toFixed(2)
    );
    s.transactions = s.transactions.filter((t) => t.id !== id);
    return write(s);
  },

  canUndo() {
    return readUndo().length > 0;
  },

  peekUndo() {
    return readUndo()[0] || null;
  },

  undo() {
    const stack = readUndo();
    const action = stack.shift();
    if (!action) return false;
    writeUndo(stack);

    if (action.kind === 'tx') {
      const s = read();
      if (s.transactions.some((t) => t.id === action.tx.id)) return false;
      s.balance = action.balance;
      s.transactions.unshift(action.tx);
      s.transactions = s.transactions.slice(0, 120);
      write(s);
      return true;
    }
    return false;
  },

  updateTx(id, patch) {
    const s = read();
    const i = s.transactions.findIndex((t) => t.id === id);
    if (i < 0) return s;
    const prev = s.transactions[i];
    const next = { ...prev, ...patch };
    if (s.balance != null && patch.amount != null && Number(patch.amount) !== prev.amount) {
      const oldEffect = prev.type === 'spend' ? -prev.amount : prev.amount;
      const newAmt = Math.abs(Number(patch.amount));
      const newEffect = prev.type === 'spend' ? -newAmt : newAmt;
      s.balance = Number((s.balance - oldEffect + newEffect).toFixed(2));
      next.amount = newAmt;
    }
    s.transactions[i] = next;
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
      trialEnds: entry.trialEnds || null,
      trialVerified: entry.trialVerified ?? null,
      trialSource: entry.trialSource || '',
      trialDays: entry.trialDays || null,
      startedAt: entry.startedAt || isoToday(),
      priceHistory: entry.priceHistory || [],
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
    s.subscriptions = s.subscriptions.map((x) => {
      if (x.id !== id) return x;
      const next = { ...x, ...patch };
      if (patch.price != null && Number(patch.price) !== Number(x.price)) {
        const history = [...(x.priceHistory || [])];
        history.unshift({ price: Number(x.price), date: isoToday() });
        next.priceHistory = history.slice(0, 20);
      }
      return next;
    });
    return write(s);
  },

  searchTransactions(query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) return read().transactions;
    return read().transactions.filter((t) =>
      t.note.toLowerCase().includes(q)
      || t.category.toLowerCase().includes(q)
      || String(t.amount).includes(q)
      || t.date.includes(q)
    );
  },

  filterTransactions({ query = '', range = 'all' } = {}) {
    let txs = query ? this.searchTransactions(query) : [...read().transactions];
    const now = new Date();
    now.setHours(12, 0, 0, 0);

    if (range === 'week') {
      const start = new Date(now);
      start.setDate(start.getDate() - 6);
      const from = start.toISOString().slice(0, 10);
      txs = txs.filter((t) => t.date >= from);
    } else if (range === 'month') {
      const m = now.toISOString().slice(0, 7);
      txs = txs.filter((t) => t.date.startsWith(m));
    } else if (range === 'last-month') {
      const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const m = d.toISOString().slice(0, 7);
      txs = txs.filter((t) => t.date.startsWith(m));
    }

    return txs;
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
    const today = isoToday();
    return read().subscriptions.reduce((sum, x) => {
      if (isOnTrial(x, today)) return sum;
      return sum + monthlyEquivalent(x.price, x.cycle);
    }, 0);
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
      const pct = Math.round((used / b.limit) * 100);
      const status = pct >= 100 ? 'over' : pct >= 80 ? 'warn' : 'ok';
      return { ...b, used, pct: Math.min(100, pct), rawPct: pct, status };
    });
  },

  budgetAlerts() {
    return this.budgetBurn().filter((b) => b.rawPct >= 80);
  },

  activeTrials() {
    const today = isoToday();
    return read().subscriptions.filter((s) => s.trialEnds && s.trialEnds >= today);
  },

  trialsEnding(withinDays = 7) {
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return this.activeTrials()
      .map((sub) => {
        const end = new Date(`${sub.trialEnds}T12:00:00`);
        const daysLeft = Math.round((end - now) / 86400000);
        return { ...sub, daysLeft };
      })
      .filter((x) => x.daysLeft >= 0 && x.daysLeft <= withinDays)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  },

  /** Next 7 days with projected charges per day. */
  weekStrip() {
    const s = read();
    const payday = s.settings?.paydayDay;
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      const dayNum = d.getDate();
      days.push({
        iso,
        dayNum,
        weekday: d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2),
        isToday: i === 0,
        isPayday: payday != null && dayNum === Number(payday),
        items: [],
        total: 0,
      });
    }

    const byIso = new Map(days.map((d) => [d.iso, d]));
    for (const sub of s.subscriptions) {
      for (const hit of chargesWithinDays(sub, 7, today)) {
        const bucket = byIso.get(hit.date);
        if (!bucket) continue;
        bucket.items.push({ ...sub, price: hit.amount });
        bucket.total += hit.amount;
      }
    }
    return days;
  },

  /** Full picture for a single calendar day (charges, trials, cancel deadlines). */
  dayDetails(iso) {
    const s = read();
    const d = new Date(`${iso}T12:00:00`);
    const year = d.getFullYear();
    const month = d.getMonth();
    const payday = s.settings?.paydayDay;
    const isPayday = payday != null && d.getDate() === Number(payday);
    const charges = [];
    const milestones = [];

    for (const sub of s.subscriptions) {
      const life = getSubLifecycle(sub, iso);
      if (sub.trialEnds === iso && life.trialVerified) {
        milestones.push({ type: 'trial_end', sub, life });
      }
      if (sub.cancelBy === iso) {
        milestones.push({ type: 'cancel_by', sub, life });
      }
      for (const hit of billDatesInMonth(sub, year, month)) {
        if (hit !== iso) continue;
        charges.push({
          ...sub,
          price: chargeAmount(sub),
          onTrial: life.onTrial,
          kind: life.onTrial ? 'first_charge' : 'renewal',
        });
      }
    }

    return {
      iso,
      isPayday,
      charges,
      milestones,
      dayTotal: charges.reduce((sum, c) => sum + Number(c.price || 0), 0),
    };
  },

  /** 30-day balance projection using known bills + average daily spend. */
  balanceForecast(days = 30) {
    const s = read();
    if (s.balance == null) return null;

    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const dailySpend = (this.monthSpend() + this.subsMonthly()) / 30;

    const chargesByDate = new Map();
    for (const sub of s.subscriptions) {
      for (const hit of chargesWithinDays(sub, days, today)) {
        chargesByDate.set(hit.date, (chargesByDate.get(hit.date) || 0) + hit.amount);
      }
    }

    let balance = s.balance;
    const points = [];
    for (let i = 0; i <= days; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      if (i > 0) balance -= dailySpend;
      balance -= chargesByDate.get(iso) || 0;
      points.push({ iso, balance: Number(balance.toFixed(2)) });
    }

    const lows = points.map((p) => p.balance);
    return {
      points,
      lowest: Math.min(...lows),
      end: points[points.length - 1]?.balance,
      dailySpend,
    };
  },
};
