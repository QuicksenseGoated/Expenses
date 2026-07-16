import { Store } from '../store.js';
import { brandHead, esc, money, niceDate, daysUntil } from './ui.js';

export function renderInsights(root, ctx) {
  const s = Store.get();
  const monthSpend = Store.monthSpend();
  const subsTotal = s.subscriptions.reduce((sum, x) => sum + Number(x.price), 0);
  const upcoming = Store.upcomingBills(14);
  const cancelSoon = s.subscriptions
    .map((x) => ({ ...x, d: daysUntil(x.cancelBy) }))
    .filter((x) => x.d >= 0 && x.d <= 7)
    .sort((a, b) => a.d - b.d);
  const safe = Store.safeToSpend();

  const tips = [];
  if (s.balance == null) {
    tips.push({
      title: 'Start with your real balance',
      body: 'Type what’s in your bank on Home. Everything else builds from that number.',
      tone: 'accent'
    });
  } else if (safe != null && safe < 0) {
    tips.push({
      title: 'Bills exceed cash',
      body: `Upcoming subs need ${money(Store.reservedForBills(), s.currency)} but safe-to-spend is ${money(safe, s.currency)}. Cut or move money.`,
      tone: 'danger'
    });
  } else if (s.balance != null) {
    tips.push({
      title: 'Safe-to-spend buffer',
      body: `After reserved bills you have about ${money(safe, s.currency)} left for freestyle spending.`,
      tone: 'ok'
    });
  }

  if (!s.subscriptions.length) {
    tips.push({
      title: 'Add the subs you actually pay',
      body: 'Search Netflix, gym, Adobe… Financer shows why/when/how and the cancel link.',
      tone: 'accent'
    });
  } else if (subsTotal > 0 && s.balance != null && subsTotal > s.balance * 0.35) {
    tips.push({
      title: 'Subs are eating cash',
      body: `${money(subsTotal, s.currency)}/mo in subscriptions is heavy vs your balance. Audit keep vs cancel.`,
      tone: 'warn'
    });
  }

  if (cancelSoon.length) {
    tips.push({
      title: 'Cancel window this week',
      body: cancelSoon.map((x) => `${x.name} by ${niceDate(x.cancelBy)}`).join(' · '),
      tone: 'danger'
    });
  }

  if (monthSpend > 0) {
    tips.push({
      title: 'This month’s burn',
      body: `You’ve logged ${money(monthSpend, s.currency)} in spends. Compare that to payday rhythm.`,
      tone: 'ok'
    });
  }

  // Budget burn (simple, like YNAB/Emma envelopes)
  const month = new Date().toISOString().slice(0, 7);
  const budgets = s.budgets.map((b) => {
    const used = s.transactions
      .filter((t) => t.type === 'spend' && t.date.startsWith(month) && t.category === b.name)
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...b, used, pct: Math.min(100, Math.round((used / b.limit) * 100)) };
  });

  root.innerHTML = `
    ${brandHead('Insights')}

    <section class="stat-row">
      <article>
        <b>${money(subsTotal, s.currency)}</b>
        <span>Subs / mo</span>
      </article>
      <article>
        <b>${money(monthSpend, s.currency)}</b>
        <span>Spend MTD</span>
      </article>
      <article>
        <b>${safe == null ? '—' : money(safe, s.currency)}</b>
        <span>Safe</span>
      </article>
    </section>

    <section class="block">
      <div class="block-head"><h2>Coach</h2></div>
      <div class="insight-list">
        ${tips.map((t) => `
          <article class="insight tone-${t.tone}">
            <h3>${esc(t.title)}</h3>
            <p>${esc(t.body)}</p>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="block">
      <div class="block-head"><h2>Budget envelopes</h2></div>
      <p class="meta-inline">Inspired by YNAB-style buckets. Limits are starter defaults — edit later.</p>
      <div class="plan-list">
        ${budgets.map((b) => `
          <article class="plan-row">
            <div class="plan-bar"><i style="width:${b.pct}%"></i></div>
            <div class="plan-meta">
              <strong>${esc(b.name)}</strong>
              <span>${money(b.used, s.currency)} / ${money(b.limit, s.currency)}</span>
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="block">
      <div class="block-head">
        <h2>Due in 14 days</h2>
        <button type="button" class="text-btn" data-go="subs">Subs</button>
      </div>
      ${upcoming.length ? `
        <div class="list">
          ${upcoming.map((b) => `
            <div class="row static">
              <div>
                <strong>${esc(b.name)}</strong>
                <span>${niceDate(b.nextBill)} · ${b.daysUntil}d</span>
              </div>
              <b>${money(b.price, b.currency)}</b>
            </div>
          `).join('')}
        </div>
      ` : `<p class="empty-inline">No bills in the next two weeks.</p>`}
    </section>
  `;

  root.querySelector('[data-go="subs"]')?.addEventListener('click', () => ctx.navigate('subs'));
}
