import { Store } from '../store.js';
import { money, niceDate, esc, toast } from './ui.js';
import { openSpendSheet } from './home.js';

export function renderActivity(root, ctx) {
  const s = Store.get();
  const txs = s.transactions;
  const monthSpend = Store.monthSpend();
  const grouped = groupByDate(txs);
  const byCategory = categorySpend(s);

  root.innerHTML = `
    <header class="page-title">
      <h1>Activity</h1>
      <p>${money(monthSpend, s.currency)} spent this month · ${txs.length} entries</p>
    </header>

    <div class="action-bar">
      <button type="button" class="btn primary" data-spend>Log spend</button>
      <button type="button" class="btn outline" data-income>Add money</button>
    </div>

    ${s.balance == null ? `
      <section class="banner">Set your balance on Home before logging spends.</section>
    ` : ''}

    ${byCategory.length ? `
      <section class="panel flush-top">
        <h2>By category</h2>
        <div class="cat-bars">
          ${byCategory.map((c) => `
            <div class="cat-bar-row">
              <div class="cat-bar-head">
                <span>${esc(c.name)}</span>
                <b>${money(c.total, s.currency)}</b>
              </div>
              <div class="env-bar"><i style="width:${c.pct}%"></i></div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    ${txs.length ? Object.entries(grouped).map(([date, rows]) => `
      <section class="panel flush-top">
        <div class="panel-head"><h2>${niceDate(date)}</h2></div>
        <div class="feed">
          ${rows.map((t) => `
            <div class="feed-row wide">
              <div class="feed-dot ${t.type}"></div>
              <div class="feed-main">
                <strong>${esc(t.note)}</strong>
                <span>${esc(t.category)}</span>
              </div>
              <div class="feed-end">
                <b class="${t.type === 'spend' ? 'out' : 'in'}">${t.type === 'spend' ? '−' : '+'}${money(t.amount, s.currency)}</b>
                <button type="button" class="link-btn" data-del="${t.id}">Undo</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `).join('') : `
      <section class="hero-empty">
        <div class="hero-empty-icon">↗</div>
        <h2>No transactions</h2>
        <p>Every purchase you log updates your live balance.</p>
        <button type="button" class="btn primary" data-spend-empty>Log first spend</button>
      </section>
    `}
  `;

  root.querySelector('[data-spend]')?.addEventListener('click', () => openSpendSheet(ctx));
  root.querySelector('[data-spend-empty]')?.addEventListener('click', () => openSpendSheet(ctx));
  root.querySelector('[data-income]')?.addEventListener('click', () => ctx.openIncome());

  root.querySelectorAll('[data-del]').forEach((b) => {
    b.addEventListener('click', () => {
      Store.deleteTx(b.dataset.del);
      toast('Undone');
      ctx.refresh();
    });
  });
}

function groupByDate(txs) {
  return txs.reduce((acc, t) => {
    (acc[t.date] ||= []).push(t);
    return acc;
  }, {});
}

function categorySpend(s) {
  const m = new Date().toISOString().slice(0, 7);
  const map = new Map();
  for (const t of s.transactions) {
    if (t.type !== 'spend' || !t.date.startsWith(m)) continue;
    map.set(t.category, (map.get(t.category) || 0) + t.amount);
  }
  const rows = [...map.entries()].map(([name, total]) => ({ name, total }));
  const max = Math.max(...rows.map((r) => r.total), 1);
  return rows
    .sort((a, b) => b.total - a.total)
    .map((r) => ({ ...r, pct: Math.round((r.total / max) * 100) }));
}
