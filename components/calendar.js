import { Store } from '../store.js';
import { getSubBranding, getCatalogEntry } from '../catalog.js';
import { brandBadgeHtml, wireBrandBadges } from './brand.js';
import { money, niceDate, esc, sheet } from './ui.js';

let viewMonth = new Date().getMonth();
let viewYear = new Date().getFullYear();
let calView = localStorage.getItem('financer.calView') || 'grid';

function subShortLabel(sub) {
  const entry = getCatalogEntry(sub.catalogId);
  return entry?.name || sub.name;
}

function monthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function buildMonthGrid(year, month, scheduleDays) {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayIso = new Date().toISOString().slice(0, 10);
  const payday = Store.get().settings?.paydayDay;

  const byIso = new Map(scheduleDays.map((d) => [d.iso, d]));
  const cells = [];

  for (let i = 0; i < startPad; i++) cells.push({ empty: true });
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hit = byIso.get(iso);
    const details = Store.dayDetails(iso);
    const hasEvents = hit?.items?.length || details.milestones.length || details.isPayday;
    cells.push({
      day,
      iso,
      isToday: iso === todayIso,
      isPayday: payday != null && day === Number(payday),
      isPast: iso < todayIso,
      items: hit?.items || [],
      milestones: details.milestones,
      total: hit?.dayTotal || details.dayTotal,
      hasEvents,
      hasTrial: details.milestones.some((m) => m.type === 'trial_end'),
      hasCancel: details.milestones.some((m) => m.type === 'cancel_by'),
    });
  }
  return cells;
}

function renderWeekStrip() {
  const s = Store.get();
  const days = Store.weekStrip();
  return `
    <section class="week-strip-panel">
      <div class="panel-head"><h2>This week</h2></div>
      <div class="week-strip">
        ${days.map((d) => `
          <button type="button" class="week-day ${d.isToday ? 'today' : ''} ${d.isPayday ? 'payday' : ''} ${d.total > 0 ? 'has-charges' : ''}" data-week-day="${d.iso}">
            <span class="week-wd">${esc(d.weekday)}</span>
            <b class="week-num">${d.dayNum}</b>
            ${d.total > 0 ? `<span class="week-amt">${money(d.total, s.currency)}</span>` : '<span class="week-dot"></span>'}
          </button>
        `).join('')}
      </div>
    </section>`;
}

function renderGrid(year, month, scheduleDays) {
  const cells = buildMonthGrid(year, month, scheduleDays);
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return `
    <div class="cal-grid-wrap">
      <div class="cal-grid-legend">
        <span><i class="leg bill"></i> Charge</span>
        <span><i class="leg trial"></i> Trial ends</span>
        <span><i class="leg cancel"></i> Cancel by</span>
        <span><i class="leg payday"></i> Payday</span>
      </div>
      <div class="cal-grid-head">
        ${weekdays.map((w) => `<span>${w}</span>`).join('')}
      </div>
      <div class="cal-grid">
        ${cells.map((c) => c.empty ? '<span class="cal-cell empty"></span>' : `
          <button type="button" class="cal-cell ${c.isToday ? 'today' : ''} ${c.isPayday ? 'payday' : ''} ${c.isPast ? 'past' : ''} ${c.hasEvents ? 'has-bills' : ''}" data-day="${c.iso}" aria-label="${c.day}${c.hasEvents ? ', has events' : ''}">
            <b>${c.day}</b>
            <span class="cal-cell-markers">
              ${c.isPayday ? '<i class="mk payday" title="Payday"></i>' : ''}
              ${c.hasTrial ? '<i class="mk trial"></i>' : ''}
              ${c.hasCancel ? '<i class="mk cancel"></i>' : ''}
              ${c.items.length ? `<i class="mk bill"></i>` : ''}
            </span>
          </button>
        `).join('')}
      </div>
    </div>`;
}

function renderTimeline(data, s) {
  return `
    <div class="cal-timeline">
      ${data.days.map((day) => `
        <article class="cal-day ${day.isPayday ? 'payday' : ''} ${day.isPast ? 'past' : ''}" id="cal-${day.iso}">
          <div class="cal-day-head">
            <b>${day.dayNum}</b>
            <span>${day.weekday}</span>
            ${day.isPayday ? '<em class="payday-tag">Payday</em>' : ''}
          </div>
          <div class="cal-day-charges">
            ${day.items.map((b) => {
              const brand = getSubBranding(b);
              return `
                <button type="button" class="cal-charge" data-sub="${b.id}">
                  ${brandBadgeHtml(brand)}
                  <span>${esc(subShortLabel(b))}</span>
                  <b>${money(b.price, b.currency)}</b>
                </button>`;
            }).join('')}
          </div>
          ${day.dayTotal > 0 ? `<div class="cal-day-total">${money(day.dayTotal, s.currency)}</div>` : ''}
        </article>
      `).join('')}
    </div>`;
}

async function openDaySheet(ctx, iso) {
  const s = Store.get();
  const details = Store.dayDetails(iso);
  const label = niceDate(iso);
  const d = new Date(`${iso}T12:00:00`);

  const milestoneRows = details.milestones.map((m) => {
    const brand = getSubBranding(m.sub);
    const typeLabel = m.type === 'trial_end' ? 'Trial ends' : 'Cancel by today';
    return `
      <button type="button" class="day-event ${m.type}" data-sub="${m.sub.id}">
        ${brandBadgeHtml(brand)}
        <div>
          <strong>${esc(subShortLabel(m.sub))}</strong>
          <span>${typeLabel}</span>
        </div>
      </button>`;
  }).join('');

  const chargeRows = details.charges.map((b) => {
    const brand = getSubBranding(b);
    return `
      <button type="button" class="day-event charge" data-sub="${b.id}">
        ${brandBadgeHtml(brand)}
        <div>
          <strong>${esc(subShortLabel(b))}</strong>
          <span>${b.onTrial ? 'First charge after trial' : 'Renewal'}</span>
        </div>
        <b>${money(b.price, b.currency)}</b>
      </button>`;
  }).join('');

  const result = await sheet({
    title: label,
    body: `
      <p class="sheet-hint">${d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      ${details.isPayday ? `<div class="day-payday-banner">Payday</div>` : ''}
      ${details.milestones.length ? `
        <h3 class="day-section-title">Deadlines</h3>
        <div class="day-events">${milestoneRows}</div>
      ` : ''}
      ${details.charges.length ? `
        <h3 class="day-section-title">Charges</h3>
        <div class="day-events">${chargeRows}</div>
        <p class="day-total-line">Total due <strong>${money(details.dayTotal, s.currency)}</strong></p>
      ` : ''}
      ${!details.isPayday && !details.milestones.length && !details.charges.length ? `
        <p class="empty-sm">Nothing scheduled this day.</p>
      ` : ''}
    `,
    actions: [{ id: 'close', label: 'Done', primary: true }],
  });

  result?.overlay?.querySelectorAll('[data-sub]').forEach((btn) => {
    btn.addEventListener('click', () => {
      result.overlay.classList.remove('open');
      result.overlay.remove();
      ctx.openSub(btn.dataset.sub);
    });
  });
}

export function renderCalendar(root, ctx) {
  const s = Store.get();
  const data = Store.monthSchedule(viewYear, viewMonth);
  const label = monthLabel(viewYear, viewMonth);
  const payday = s.settings?.paydayDay;
  const cancelSoon = Store.cancelAlerts(7);

  root.innerHTML = `
    <header class="page-title">
      <h1>Calendar</h1>
      <p>Trials, cancel windows, and charges — tap any day</p>
    </header>

    ${renderWeekStrip()}

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
      <div class="cal-view-toggle">
        <button type="button" class="seg ${calView === 'grid' ? 'on' : ''}" data-view="grid">Grid</button>
        <button type="button" class="seg ${calView === 'list' ? 'on' : ''}" data-view="list">List</button>
      </div>
    </section>

    ${cancelSoon.length ? `
      <section class="panel alert-panel">
        <h2>Cancel this week</h2>
        <div class="alert-list">
          ${cancelSoon.map((b) => `
            <button type="button" class="alert-row" data-sub="${b.id}">
              <div>
                <strong>${esc(subShortLabel(b))}</strong>
                <span>Cancel by ${niceDate(b.cancelBy)} · ${b.daysUntilCancel}d left</span>
              </div>
              <b>${money(b.price, b.currency)}</b>
            </button>
          `).join('')}
        </div>
      </section>
    ` : ''}

    ${data.days.length || calView === 'grid' ? `
      <section class="panel flush-top">
        <div class="panel-head"><h2>${calView === 'grid' ? 'Month' : 'By date'}</h2></div>
        ${calView === 'grid' ? renderGrid(viewYear, viewMonth, data.days) : renderTimeline(data, s)}
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
        <p class="insight-body">${money(Store.subsMonthly(), s.currency)}/mo after trials · ${money(data.monthTotal, s.currency)} due in ${label.split(' ')[0]}.</p>
      </section>
    ` : ''}
  `;

  wireBrandBadges(root);

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
  root.querySelectorAll('[data-view]').forEach((b) => {
    b.addEventListener('click', () => {
      calView = b.dataset.view;
      localStorage.setItem('financer.calView', calView);
      ctx.refresh();
    });
  });
  root.querySelectorAll('[data-day]').forEach((b) => {
    b.addEventListener('click', () => openDaySheet(ctx, b.dataset.day));
  });
  root.querySelectorAll('[data-week-day]').forEach((b) => {
    b.addEventListener('click', () => openDaySheet(ctx, b.dataset.weekDay));
  });
  root.querySelector('[data-go="bills"]')?.addEventListener('click', () => ctx.navigate('bills'));
  root.querySelectorAll('[data-sub]').forEach((b) => {
    b.addEventListener('click', () => ctx.openSub(b.dataset.sub));
  });
}
