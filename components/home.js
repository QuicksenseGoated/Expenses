import { APP, SUMMARY, ALERTS, SUBS } from '../data.js';
import { esc, money, niceDate, daysUntil, actionTone } from './ui.js';

export function renderHome(root, ctx) {
  const upcoming = [...SUBS]
    .sort((a, b) => a.nextBill.localeCompare(b.nextBill))
    .slice(0, 3);

  root.innerHTML = `
    <header class="page-head">
      <div>
        <p class="eyebrow">${esc(APP.name)}</p>
        <h1>This month</h1>
        <p class="lede">${esc(SUMMARY.monthLabel)} · ${SUMMARY.activeSubs} subscriptions</p>
      </div>
    </header>

    <section class="hero-spend">
      <p class="label">Tracked spend</p>
      <p class="amount">${money(SUMMARY.monthSpend)}</p>
      <p class="meta">~${money(SUMMARY.yearlyPace)} / year pace · save up to ${money(SUMMARY.potentialSave)}</p>
    </section>

    <section class="stat-row">
      <article>
        <b>${SUMMARY.nextBillDays}d</b>
        <span>Next bill</span>
      </article>
      <article>
        <b>${SUMMARY.atRisk}</b>
        <span>At risk</span>
      </article>
      <article>
        <b>${SUMMARY.activeSubs}</b>
        <span>Active</span>
      </article>
    </section>

    <section class="block">
      <div class="block-head">
        <h2>Needs attention</h2>
      </div>
      <div class="alert-list">
        ${ALERTS.map((a) => `
          <article class="alert tone-${a.tone}">
            <p class="alert-title">${esc(a.title)}</p>
            <p class="alert-body">${esc(a.body)}</p>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="block">
      <div class="block-head">
        <h2>Coming up</h2>
        <button type="button" class="text-btn" data-go="subs">See all</button>
      </div>
      <div class="sub-list">
        ${upcoming.map((s) => `
          <button type="button" class="sub-row" data-sub="${s.id}">
            <div class="sub-mark" aria-hidden="true">${esc(s.name.slice(0, 1))}</div>
            <div class="sub-main">
              <strong>${esc(s.name)}</strong>
              <span>${niceDate(s.nextBill)} · in ${daysUntil(s.nextBill)}d</span>
            </div>
            <div class="sub-side">
              <b>${money(s.price, s.currency)}</b>
              <span class="chip ${actionTone(s.action)}">${esc(s.action)}</span>
            </div>
          </button>
        `).join('')}
      </div>
    </section>
  `;

  root.querySelector('[data-go="subs"]')?.addEventListener('click', () => ctx.navigate('subs'));
  root.querySelectorAll('[data-sub]').forEach((btn) => {
    btn.addEventListener('click', () => ctx.openSub(btn.dataset.sub));
  });
}
