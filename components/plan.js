import { Store } from '../store.js';
import { CATALOG } from '../catalog.js';
import { money, niceDate, esc } from './ui.js';

export function renderPlan(root, ctx) {
  const s = Store.get();
  const safe = Store.safeToSpend();
  const subs = Store.subsMonthly();
  const monthSpend = Store.monthSpend();
  const budgets = Store.budgetBurn();
  const upcoming = Store.upcomingBills(21);
  const cancelSoon = s.subscriptions
    .map((x) => ({ ...x, d: daysUntil(x.cancelBy) }))
    .filter((x) => x.d >= 0 && x.d <= 7);

  const tips = buildTips({ s, safe, subs, monthSpend, cancelSoon });

  root.innerHTML = `
    <header class="page-title">
      <h1>Plan</h1>
      <p>Insights inspired by Copilot, Rocket Money, and YNAB-style envelopes.</p>
    </header>

    <section class="plan-hero">
      <div>
        <span class="metric-label">Safe to spend</span>
        <strong class="plan-big">${safe == null ? '—' : money(safe, s.currency)}</strong>
      </div>
      <div class="plan-side">
        <div><span>Subs</span><b>${money(subs, s.currency)}</b></div>
        <div><span>MTD</span><b>${money(monthSpend, s.currency)}</b></div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Coach</h2></div>
      <div class="coach-list">
        ${tips.map((t) => `
          <article class="coach ${t.tone}">
            <h3>${esc(t.title)}</h3>
            <p>${esc(t.body)}</p>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>Budget envelopes</h2></div>
      <div class="envelope-list">
        ${budgets.map((b) => `
          <article class="envelope">
            <div class="env-head">
              <strong>${esc(b.name)}</strong>
              <span>${money(b.used, s.currency)} / ${money(b.limit, s.currency)}</span>
            </div>
            <div class="env-bar"><i style="width:${b.pct}%; background:${b.color}"></i></div>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head">
        <h2>Bill calendar</h2>
        <button type="button" class="link-btn" data-go="bills">Manage</button>
      </div>
      ${upcoming.length ? `
        <div class="calendar-list">
          ${upcoming.map((b) => `
            <button type="button" class="cal-row" data-sub="${b.id}">
              <div class="cal-date"><b>${b.daysUntil}</b><span>days</span></div>
              <div class="cal-main">
                <strong>${esc(b.name)}</strong>
                <span>${niceDate(b.nextBill)}</span>
              </div>
              <b>${money(b.price, b.currency)}</b>
            </button>
          `).join('')}
        </div>
      ` : `<p class="empty-sm">No upcoming bills in the next 3 weeks.</p>`}
    </section>
  `;

  root.querySelector('[data-go="bills"]')?.addEventListener('click', () => ctx.navigate('bills'));
  root.querySelectorAll('[data-sub]').forEach((b) => {
    b.addEventListener('click', () => ctx.openSub(b.dataset.sub));
  });
}

function daysUntil(iso) {
  const t = new Date(`${iso}T12:00:00`);
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  return Math.round((t - now) / 86400000);
}

function buildTips({ s, safe, subs, monthSpend, cancelSoon }) {
  const tips = [];
  if (s.balance == null) {
    tips.push({ tone: 'accent', title: 'Start with your real balance', body: 'Premium apps like Monzo show cash first. Set yours on Home.' });
    return tips;
  }
  if (safe != null && safe < 0) {
    tips.push({ tone: 'danger', title: 'Bills exceed cash', body: `Reserved subscriptions need more than your safe buffer. Cut or move money.` });
  } else {
    tips.push({ tone: 'ok', title: 'Spending buffer', body: `After upcoming bills, about ${money(safe, s.currency)} is free to use.` });
  }
  if (!s.subscriptions.length) {
    tips.push({ tone: 'accent', title: 'Audit your stack', body: `Search ${CATALOG.length}+ services in Bills — only add what you pay.` });
  } else if (subs > s.balance * 0.4) {
    tips.push({ tone: 'warn', title: 'Heavy subscription load', body: `${money(subs, s.currency)}/mo is a large share of your balance. Review cancel windows.` });
  }
  if (cancelSoon.length) {
    tips.push({ tone: 'danger', title: 'Cancel this week', body: cancelSoon.map((x) => `${x.name} by ${niceDate(x.cancelBy)}`).join(' · ') });
  }
  if (monthSpend > 0) {
    tips.push({ tone: 'ok', title: 'Monthly burn', body: `You've logged ${money(monthSpend, s.currency)} so far. Compare to your payday rhythm.` });
  }
  return tips;
}
