import { SUBS } from '../data.js';
import { esc, money, niceDate, daysUntil, actionTone } from './ui.js';

export function renderSubs(root, ctx) {
  const total = SUBS.reduce((sum, s) => sum + s.price, 0);

  root.innerHTML = `
    <header class="page-head">
      <div>
        <p class="eyebrow">Subscriptions</p>
        <h1>All plans</h1>
        <p class="lede">${SUBS.length} active · ${money(total)} / month</p>
      </div>
      <button type="button" class="btn ghost" disabled title="Coming later">Add</button>
    </header>

    <div class="filter-row" role="tablist" aria-label="Filter">
      <button type="button" class="filter active" data-filter="all">All</button>
      <button type="button" class="filter" data-filter="cancel">Cancel</button>
      <button type="button" class="filter" data-filter="watch">Watch</button>
      <button type="button" class="filter" data-filter="keep">Keep</button>
    </div>

    <div class="sub-list" id="sub-list">
      ${SUBS.map(card).join('')}
    </div>
  `;

  const list = root.querySelector('#sub-list');
  root.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      const rows = f === 'all' ? SUBS : SUBS.filter((s) => s.action === f);
      list.innerHTML = rows.map(card).join('') || `<p class="empty">Nothing in this filter.</p>`;
      bind(list, ctx);
    });
  });

  bind(list, ctx);
}

function card(s) {
  return `
    <button type="button" class="sub-row tall" data-sub="${s.id}">
      <div class="sub-mark" aria-hidden="true">${esc(s.name.slice(0, 1))}</div>
      <div class="sub-main">
        <strong>${esc(s.name)}</strong>
        <span>${esc(s.category)} · next ${niceDate(s.nextBill)} (${daysUntil(s.nextBill)}d)</span>
      </div>
      <div class="sub-side">
        <b>${money(s.price, s.currency)}</b>
        <span class="chip ${actionTone(s.action)}">${esc(s.action)}</span>
      </div>
    </button>
  `;
}

function bind(list, ctx) {
  list.querySelectorAll('[data-sub]').forEach((btn) => {
    btn.addEventListener('click', () => ctx.openSub(btn.dataset.sub));
  });
}
