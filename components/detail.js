import { SUBS } from '../data.js';
import { esc, money, niceDate, daysUntil, actionTone } from './ui.js';

export function renderDetail(root, ctx, id) {
  const s = SUBS.find((x) => x.id === id) || SUBS[0];
  const days = daysUntil(s.nextBill);
  const cancelDays = daysUntil(s.cancelBy);

  root.innerHTML = `
    <header class="detail-head">
      <button type="button" class="back" data-back aria-label="Back">←</button>
      <div>
        <p class="eyebrow">${esc(s.category)}</p>
        <h1>${esc(s.name)}</h1>
      </div>
    </header>

    <section class="hero-spend compact">
      <p class="label">${esc(s.cycle)} bill</p>
      <p class="amount">${money(s.price, s.currency)}</p>
      <p class="meta">Next charge ${niceDate(s.nextBill)} · in ${days} day${days === 1 ? '' : 's'}</p>
    </section>

    <section class="stat-row">
      <article>
        <b class="chip ${actionTone(s.action)}">${esc(s.action)}</b>
        <span>Action</span>
      </article>
      <article>
        <b>${esc(s.usage)}</b>
        <span>Usage</span>
      </article>
      <article>
        <b>${s.rating}/5</b>
        <span>Value</span>
      </article>
    </section>

    <section class="block">
      <div class="block-head"><h2>Billing</h2></div>
      <dl class="facts">
        <div><dt>Next bill</dt><dd>${niceDate(s.nextBill)}</dd></div>
        <div><dt>Cancel by</dt><dd>${niceDate(s.cancelBy)} · ${cancelDays}d left</dd></div>
        <div><dt>Cycle</dt><dd>${esc(s.cycle)}</dd></div>
      </dl>
    </section>

    <section class="block">
      <div class="block-head"><h2>Research</h2></div>
      <p class="body">${esc(s.research)}</p>
    </section>

    <section class="block tone-${actionTone(s.action)}">
      <div class="block-head"><h2>What Ledger thinks</h2></div>
      <p class="body">${esc(s.advice)}</p>
      <button type="button" class="btn primary block" disabled>Remind me (soon)</button>
    </section>
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => ctx.back());
}
