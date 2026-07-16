import { INSIGHTS, MONEY_PLAN, SUMMARY } from '../data.js';
import { esc, money } from './ui.js';

export function renderInsights(root) {
  root.innerHTML = `
    <header class="page-head">
      <div>
        <p class="eyebrow">Insights</p>
        <h1>What to do</h1>
        <p class="lede">Cancel timing, savings, and where the money should go.</p>
      </div>
    </header>

    <section class="hero-spend compact">
      <p class="label">You could free</p>
      <p class="amount">${money(SUMMARY.potentialSave)}</p>
      <p class="meta">this month if you act on the cancel list</p>
    </section>

    <section class="block">
      <div class="block-head"><h2>Recommendations</h2></div>
      <div class="insight-list">
        ${INSIGHTS.map((i) => `
          <article class="insight tone-${i.tone}">
            <div class="insight-top">
              <h3>${esc(i.title)}</h3>
              <span class="chip">${esc(i.impact)}</span>
            </div>
            <p>${esc(i.body)}</p>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="block">
      <div class="block-head"><h2>If you free that cash</h2></div>
      <div class="plan-list">
        ${MONEY_PLAN.map((p) => `
          <article class="plan-row">
            <div class="plan-bar"><i style="width:${p.pct}%"></i></div>
            <div class="plan-meta">
              <strong>${esc(p.label)}</strong>
              <span>${p.pct}% · ${esc(p.note)}</span>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}
