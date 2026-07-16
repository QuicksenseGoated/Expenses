import { Store } from '../store.js';
import { money, niceDate, esc, toast, sheet, $ } from './ui.js';
import { openSpendSheet } from './home.js';

let searchQuery = '';
let dateRange = localStorage.getItem('financer.actRange') || 'all';

const RANGES = [
  { id: 'all', label: 'All' },
  { id: 'week', label: '7 days' },
  { id: 'month', label: 'This month' },
  { id: 'last-month', label: 'Last month' },
];

export function renderActivity(root, ctx) {
  const s = Store.get();
  const txs = Store.filterTransactions({ query: searchQuery, range: dateRange });
  const monthSpend = Store.monthSpend();
  const grouped = groupByDate(txs);
  const byCategory = categorySpend(s);
  const undo = Store.peekUndo();
  const filtering = searchQuery || dateRange !== 'all';

  root.innerHTML = `
    <header class="page-title">
      <h1>Activity</h1>
      <p>${money(monthSpend, s.currency)} spent this month · ${s.transactions.length} entries</p>
    </header>

    <label class="activity-search">
      <span aria-hidden="true">⌕</span>
      <input id="act-q" type="search" placeholder="Search note, category, amount…" value="${esc(searchQuery)}" autocomplete="off" spellcheck="false" />
      ${searchQuery ? '<button type="button" class="library-clear" id="act-clear" aria-label="Clear">×</button>' : ''}
    </label>

    <div class="filter-scroll">
      ${RANGES.map((r) => `
        <button type="button" class="chip ${dateRange === r.id ? 'on' : ''}" data-range="${r.id}">${r.label}</button>
      `).join('')}
    </div>

    <div class="action-bar">
      <button type="button" class="btn primary" data-spend>Log spend</button>
      <button type="button" class="btn outline" data-income>Add money</button>
    </div>

    ${undo ? `
      <div class="undo-bar">
        <span>Deleted <strong>${esc(undo.tx.note)}</strong></span>
        <button type="button" class="btn outline compact" data-undo>Undo</button>
      </div>
    ` : ''}

    ${s.balance == null ? `
      <section class="banner">Set your balance on Home before logging spends.</section>
    ` : ''}

    ${!filtering && byCategory.length ? `
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
                <div class="feed-actions">
                  <button type="button" class="link-btn" data-edit="${t.id}">Edit</button>
                  <button type="button" class="link-btn" data-del="${t.id}">Delete</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `).join('') : filtering ? `
      <section class="hero-empty compact">
        <h2>No matches</h2>
        <p>Try a different search or date range.</p>
      </section>
    ` : `
      <section class="hero-empty">
        <div class="hero-empty-icon">↗</div>
        <h2>No transactions</h2>
        <p>Every purchase you log updates your live balance.</p>
        <button type="button" class="btn primary" data-spend-empty>Log first spend</button>
      </section>
    `}
  `;

  root.querySelector('#act-q')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    ctx.refresh();
  });
  root.querySelector('#act-clear')?.addEventListener('click', () => {
    searchQuery = '';
    ctx.refresh();
  });

  root.querySelectorAll('[data-range]').forEach((btn) => {
    btn.addEventListener('click', () => {
      dateRange = btn.dataset.range;
      localStorage.setItem('financer.actRange', dateRange);
      ctx.refresh();
    });
  });

  root.querySelector('[data-undo]')?.addEventListener('click', () => {
    if (Store.undo()) {
      toast('Restored');
      ctx.refresh();
    }
  });

  root.querySelector('[data-spend]')?.addEventListener('click', () => openSpendSheet(ctx));
  root.querySelector('[data-spend-empty]')?.addEventListener('click', () => openSpendSheet(ctx));
  root.querySelector('[data-income]')?.addEventListener('click', () => ctx.openIncome());

  root.querySelectorAll('[data-edit]').forEach((b) => {
    b.addEventListener('click', () => openEditSheet(ctx, b.dataset.edit));
  });

  root.querySelectorAll('[data-del]').forEach((b) => {
    b.addEventListener('click', () => {
      Store.deleteTx(b.dataset.del);
      toast('Deleted');
      ctx.refresh();
    });
  });
}

async function openEditSheet(ctx, id) {
  const s = Store.get();
  const tx = s.transactions.find((t) => t.id === id);
  if (!tx) return;

  const categories = ['Essentials', 'Food', 'Lifestyle', 'Transport', 'Shopping', 'Savings', 'General', 'Income'];
  const cats = tx.type === 'income'
    ? '<option selected>Income</option>'
    : categories.filter((c) => c !== 'Income').map((c) =>
      `<option ${tx.category === c ? 'selected' : ''}>${c}</option>`
    ).join('');

  const result = await sheet({
    title: 'Edit transaction',
    body: `
      <label class="field"><span>Amount</span>
        <input id="e-amt" type="number" min="0.01" step="0.01" inputmode="decimal" value="${tx.amount}" required />
      </label>
      <label class="field"><span>Note</span>
        <input id="e-note" maxlength="80" value="${esc(tx.note)}" required />
      </label>
      ${tx.type === 'spend' ? `
        <label class="field"><span>Category</span>
          <select id="e-cat">${cats}</select>
        </label>
      ` : ''}
    `,
    actions: [{ id: 'save', label: 'Save changes', primary: true }],
  });
  if (result?.action !== 'save') return;

  const patch = {
    amount: $('#e-amt', result.overlay)?.value,
    note: $('#e-note', result.overlay)?.value || tx.note,
  };
  if (tx.type === 'spend') {
    patch.category = $('#e-cat', result.overlay)?.value || tx.category;
  }
  Store.updateTx(id, patch);
  toast('Updated');
  ctx.refresh();
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
