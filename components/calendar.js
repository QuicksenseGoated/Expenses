import { Store } from '../store.js';
import { money, niceDate, esc } from './ui.js';

let viewMonth = new Date().getMonth();
let viewYear = new Date().getFullYear();

export function renderCalendar(root, ctx) {
  const s = Store.get();
  const data = Store.monthSchedule(viewYear, viewMonth);
  const label = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const payday = s.settings?.paydayDay;
  const cancelSoon = Store.cancelAlerts(7);

  root.innerHTML = `
    <header class="page-title">
      <h1>Calendar</h1>
      <p>When your money actually leaves the account</p>
    </header>

    <section class="cal-hero">
      <div class="cal-nav">
        <button type="button" class="icon-btn" data-prev aria-label="Previous month">‹</button>
        <strong>${esc(label)}</strong>
        <button type="button" class="icon-btn" data-next aria-label="Next month">›</button>
      </div>
      <div class="cal-totals">
        <div>
          <span class="metric-label">Due this month</span>
          <strong class="cal-big">${money(data.monthTotal, s.currency)}</strong>
        </div>
        <div>
          <span class="metric-label">Charges</span>
          <strong>${data.chargeCount}</strong>
        </div>
        ${payday ? `
          <div>
            <span class="metric-label">Payday</span>
            <strong>Day ${payday}</strong>
          </div>
        ` : ''}
      </div>
    </section>

    ${cancelSoon.length ? `
      <section class="panel alert-panel">
        <h2>Cancel this week</h2>
        <div class="alert-list">
          ${cancelSoon.map((b) => `
            <button type="button" class="alert-row" data-sub="${b.id}">
              <div>
                <strong>${esc(b.name)}</strong>
                <span>Cancel by ${niceDate(b.cancelBy)} · ${b.daysUntilCancel}d left</span>
              </div>
              <b>${money(b.price, b.currency)}</b>
            </button>
          `).join('')}
        </div>
      </section>
    ` : ''}

    ${data.days.length ? `
      <section class="panel flush-top">
        <div class="panel-head"><h2>By date</h2></div>
        <div class="cal-timeline">
          ${data.days.map((day) => `
            <article class="cal-day ${day.isPayday ? 'payday' : ''} ${day.isPast ? 'past' : ''}">
              <div class="cal-day-head">
                <b>${day.dayNum}</b>
                <span>${day.weekday}</span>
                ${day.isPayday ? '<em class="payday-tag">Payday</em>' : ''}
              </div>
              <div class="cal-day-charges">
                ${day.items.map((b) => `
                  <button type="button" class="cal-charge" data-sub="${b.id}">
                    <span>${esc(b.name)}</span>
                    <b>${money(b.price, b.currency)}</b>
                  </button>
                `).join('')}
              </div>
              ${day.dayTotal > 0 ? `<div class="cal-day-total">${money(day.dayTotal, s.currency)}</div>` : ''}
            </article>
          `).join('')}
        </div>
      </section>
    ` : `
      <section class="hero-empty compact">
        <h2>Nothing due this month</h2>
        <p>Track subscriptions in Bills — they'll show here on their charge dates.</p>
        <button type="button" class="btn primary" data-go="bills">Add subscriptions</button>
      </section>
    `}

    ${s.subscriptions.length ? `
      <section class="panel">
        <h2>Monthly load</h2>
        <p class="insight-body">${money(Store.subsMonthly(), s.currency)}/month across ${s.subscriptions.length} subs · ${money(data.monthTotal, s.currency)} hits in ${label.split(' ')[0]}.</p>
      </section>
    ` : ''}
  `;

  root.querySelector('[data-prev]')?.addEventListener('click', () => {
    viewMonth -= 1;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    ctx.refresh();
  });
  root.querySelector('[data-next]')?.addEventListener('click', () => {
    viewMonth += 1;
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    ctx.refresh();
  });
  root.querySelector('[data-go="bills"]')?.addEventListener('click', () => ctx.navigate('bills'));
  root.querySelectorAll('[data-sub]').forEach((b) => {
    b.addEventListener('click', () => ctx.openSub(b.dataset.sub));
  });
}
