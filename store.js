/** Local-only Financer state (balance, spend, user subscriptions). */

const KEY = 'financer.v1';

const empty = () => ({
  balance: null,
  currency: '€',
  transactions: [],
  subscriptions: [],
  budgets: [
    { id: 'food', name: 'Food', limit: 150 },
    { id: 'fun', name: 'Fun', limit: 80 },
    { id: 'transport', name: 'Transport', limit: 60 }
  ]
});

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

function write(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  return state;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

export const Store = {
  get() {
    return read();
  },

  reset() {
    localStorage.removeItem(KEY);
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
      note: note || 'Spend',
      category: category || 'General',
      date: isoToday()
    });
    s.transactions = s.transactions.slice(0, 100);
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
    s.transactions = s.transactions.slice(0, 100);
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
    const s = read();
    const month = new Date().toISOString().slice(0, 7);
    return s.transactions
      .filter((t) => t.type === 'spend' && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0);
  },

  upcomingBills(days = 35) {
    const s = read();
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    return s.subscriptions
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
  }
};
