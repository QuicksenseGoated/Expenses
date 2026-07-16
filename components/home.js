import { Store } from '../store.js';
import { greeting, money, niceDate, esc, toast, sheet, $ } from './ui.js';
import { anchorLabel, anchorHint } from '../billing.js';

const WIDGET_META = {
  paycheck: { title: 'Paycheck radar', render: renderPaycheck },
  safe: { title: 'Safe to spend', render: renderSafe },
  metrics: { title: 'Month snapshot', render: renderMetrics },
  bills: { title: 'Upcoming bills', render: renderBills },
  budgets: { title: 'Budget envelopes', render: renderBudgets },
  recent: { title: 'Recent activity', render: renderRecent },
  subs_audit: { title: 'Subscription load', render: renderSubsAudit },
};

export function renderHome(root, ctx) {
  const s = Store.get();
  const settings = s.settings || {};
  const widgets = (settings.homeWidgets || []).filter((id) => WIDGET_META[id]);
  const hasBal = s.balance != null;
  const displayName = settings.displayName?.trim();
  const hideBal = settings.hideBalance;

  root.innerHTML = `
    <header class="topbar">
      <div class="topbar-brand">
        <img src="./icons/logo.png" width="80" height="80" alt="Financer" class="bank-logo bank-logo-hero" />
        <div>
          <p class="greet">${displayName ? `Hey, ${esc(displayName)}` : greeting()}</p>
          <h1 class="logo-word">Financer</h1>
        </div>
      </div>
      <button type="button" class="icon-btn soft" data-customize aria-label="Customize home">⚙</button>
    </header>

    <section class="balance-card">
      <div class="balance-inner">
        <p class="balance-label">Available balance</p>
        ${hasBal && !hideBal ? `
          <p class="balance-amount">${money(s.balance, s.currency)}</p>
          <div class="balance-meta">
            <span>Safe ${money(Store.safeToSpend(), s.currency)}</span>
            <span>·</span>
            <span>${money(Store.reservedForBills(), s.currency)} reserved for bills</span>
          </div>
        ` : hasBal && hideBal ? `
          <p class="balance-amount dim">Hidden</p>
          <p class="balance-hint">Balance hidden in You → Privacy.</p>
        ` : `
          <p class="balance-amount dim">Set your balance</p>
          <p class="balance-hint">Enter what's in your account — we track it as you spend.</p>
        `}
      </div>
      <div class="quick-actions">
        ${hasBal ? `
          <button type="button" class="qa" data-spend><span class="qa-ico">−</span>Spend</button>
          <button type="button" class="qa" data-income><span class="qa-ico">+</span>Add</button>
          <button type="button" class="qa" data-edit><span class="qa-ico">✎</span>Edit</button>
        ` : `
          <button type="button" class="qa primary-wide" data-setup>Set balance</button>
        `}
      </div>
    </section>

    <div class="home-widgets" id="widgets">
      ${widgets.length ? widgets.map((id) => `<div class="home-widget" data-wid="${id}"></div>`).join('') : `
        <section class="hero-empty compact">
          <p>No widgets enabled. Tap ⚙ to customize your home.</p>
        </section>
      `}
    </div>
  `;

  widgets.forEach((id) => {
    const slot = root.querySelector(`[data-wid="${id}"]`);
    if (slot) WIDGET_META[id].render(slot, ctx, s);
  });

  root.querySelector('[data-customize]')?.addEventListener('click', () => ctx.navigate('profile'));
  root.querySelector('[data-setup]')?.addEventListener('click', () => openBalanceSheet(ctx));
  root.querySelector('[data-edit]')?.addEventListener('click', () => openBalanceSheet(ctx, s.balance));
  root.querySelector('[data-spend]')?.addEventListener('click', () => ctx.openSpend());
  root.querySelector('[data-income]')?.addEventListener('click', () => openIncomeSheet(ctx));
}

function renderPaycheck(slot, ctx, s) {
  const days = Store.paydayIn();
  const before = Store.billsBeforePayday();
  const total = Store.billsBeforePaydayTotal();
  if (!s.settings?.paydayDay) {
    slot.innerHTML = `
      <section class="panel insight">
        <h2>Paycheck radar</h2>
        <p class="empty-sm">Set your payday in <button type="button" class="link-btn" data-go="profile">You</button> to see bills due before income hits.</p>
      </section>`;
    slot.querySelector('[data-go]')?.addEventListener('click', () => ctx.navigate('profile'));
    return;
  }
  slot.innerHTML = `
    <section class="panel insight ${before.length ? 'warn' : 'ok'}">
      <div class="panel-head"><h2>Paycheck radar</h2><span class="pill">${days}d to payday</span></div>
      <p class="insight-body">${before.length
    ? `${before.length} bill${before.length === 1 ? '' : 's'} (${money(total, s.currency)}) due before you get paid.`
    : `No tracked bills before your next payday in ${days} days.`}</p>
    </section>`;
}

function renderSafe(slot, ctx, s) {
  const safe = Store.safeToSpend();
  const subs = Store.subsMonthly();
  slot.innerHTML = `
    <section class="panel safe-strip">
      <div>
        <span class="metric-label">Safe to spend today</span>
        <strong class="safe-big">${safe == null ? '—' : money(safe, s.currency)}</strong>
      </div>
      <div class="safe-side">
        <span>After ${money(subs, s.currency)}/mo subs reserved</span>
      </div>
    </section>`;
}

function renderMetrics(slot, ctx, s) {
  const monthSpend = Store.monthSpend();
  const subs = Store.subsMonthly();
  const runway = Store.runwayDays();
  slot.innerHTML = `
    <section class="metrics flush">
      <article>
        <span class="metric-label">This month</span>
        <strong>${money(monthSpend, s.currency)}</strong>
        <span class="metric-sub">spent</span>
      </article>
      <article>
        <span class="metric-label">Subscriptions</span>
        <strong>${money(subs, s.currency)}</strong>
        <span class="metric-sub">/ month</span>
      </article>
      <article>
        <span class="metric-label">Runway</span>
        <strong>${runway == null ? '—' : `${runway}d`}</strong>
        <span class="metric-sub">at pace</span>
      </article>
    </section>`;
}

function renderBills(slot, ctx, s) {
  const upcoming = Store.upcomingBills(14).slice(0, 5);
  slot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <h2>Upcoming bills</h2>
        <button type="button" class="link-btn" data-go="bills">All</button>
      </div>
      ${upcoming.length ? `
        <div class="bill-strip">
          ${upcoming.map((b) => `
            <button type="button" class="bill-chip" data-sub="${b.id}">
              <span class="bill-day">${b.daysUntil}d</span>
              <strong>${esc(b.name)}</strong>
              <span>${money(b.price, b.currency)}</span>
            </button>
          `).join('')}
        </div>
      ` : `<p class="empty-sm">No bills tracked. <button type="button" class="link-btn" data-go="bills">Add one</button></p>`}
    </section>`;
  slot.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => ctx.navigate(b.dataset.go)));
  slot.querySelectorAll('[data-sub]').forEach((b) => b.addEventListener('click', () => ctx.openSub(b.dataset.sub)));
}

function renderBudgets(slot, ctx, s) {
  const budgets = Store.budgetBurn();
  slot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <h2>Budget envelopes</h2>
        <button type="button" class="link-btn" data-go="plan">Plan</button>
      </div>
      <div class="mini-envelopes">
        ${budgets.map((b) => `
          <div class="mini-env">
            <div class="mini-env-head"><strong>${esc(b.name)}</strong><span>${b.pct}%</span></div>
            <div class="env-bar"><i style="width:${b.pct}%;background:${b.color}"></i></div>
          </div>
        `).join('')}
      </div>
    </section>`;
  slot.querySelector('[data-go]')?.addEventListener('click', () => ctx.navigate('plan'));
}

function renderRecent(slot, ctx, s) {
  const recent = s.transactions.slice(0, 5);
  slot.innerHTML = `
    <section class="panel">
      <div class="panel-head">
        <h2>Recent</h2>
        <button type="button" class="link-btn" data-go="activity">Activity</button>
      </div>
      ${recent.length ? `
        <div class="feed">
          ${recent.map((t) => `
            <div class="feed-row">
              <div class="feed-dot ${t.type}"></div>
              <div class="feed-main">
                <strong>${esc(t.note)}</strong>
                <span>${niceDate(t.date)} · ${esc(t.category)}</span>
              </div>
              <b class="${t.type === 'spend' ? 'out' : 'in'}">${t.type === 'spend' ? '−' : '+'}${money(t.amount, s.currency)}</b>
            </div>
          `).join('')}
        </div>
      ` : `<p class="empty-sm">No activity yet.</p>`}
    </section>`;
  slot.querySelector('[data-go]')?.addEventListener('click', () => ctx.navigate('activity'));
}

function renderSubsAudit(slot, ctx, s) {
  const subs = Store.subsMonthly();
  const bal = s.balance;
  const pct = bal > 0 ? Math.round((subs / bal) * 100) : null;
  slot.innerHTML = `
    <section class="panel insight ${pct != null && pct > 40 ? 'warn' : ''}">
      <h2>Subscription load</h2>
      <p class="insight-body">${money(subs, s.currency)}/month across ${s.subscriptions.length} tracked subs${pct != null ? ` — ${pct}% of current balance` : ''}.</p>
      <button type="button" class="link-btn" data-go="bills">Audit stack →</button>
    </section>`;
  slot.querySelector('[data-go]')?.addEventListener('click', () => ctx.navigate('bills'));
}

async function openBalanceSheet(ctx, current = '') {
  const result = await sheet({
    title: 'Account balance',
    body: `
      <label class="field">
        <span>How much is in your account?</span>
        <input id="bal" type="number" min="0" step="0.01" inputmode="decimal" value="${current}" placeholder="390.00" required />
      </label>
    `,
    actions: [{ id: 'save', label: 'Save balance', primary: true }]
  });
  if (result?.action !== 'save') return;
  const v = Number($('#bal', result.overlay)?.value);
  if (!Number.isFinite(v)) return toast('Invalid amount');
  Store.setBalance(v);
  toast('Balance updated');
  ctx.refresh();
}

export async function openIncomeSheet(ctx) {
  const result = await sheet({
    title: 'Add money',
    body: `
      <label class="field"><span>Amount</span><input id="amt" type="number" min="0.01" step="0.01" inputmode="decimal" required /></label>
      <label class="field"><span>Note</span><input id="note" placeholder="Payday, refund…" /></label>
    `,
    actions: [{ id: 'save', label: 'Add to balance', primary: true }]
  });
  if (result?.action !== 'save') return;
  Store.addIncome({
    amount: $('#amt', result.overlay)?.value,
    note: $('#note', result.overlay)?.value || 'Deposit'
  });
  toast('Added');
  ctx.refresh();
}

export async function openSpendSheet(ctx) {
  const result = await sheet({
    title: 'Log spend',
    body: `
      <label class="field"><span>Amount</span><input id="amt" type="number" min="0.01" step="0.01" inputmode="decimal" required /></label>
      <label class="field"><span>Merchant / note</span><input id="note" maxlength="80" placeholder="Coffee, Uber…" required /></label>
      <label class="field"><span>Category</span>
        <select id="cat">
          <option>Essentials</option>
          <option>Lifestyle</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>General</option>
        </select>
      </label>
    `,
    actions: [{ id: 'save', label: 'Subtract from balance', primary: true }]
  });
  if (result?.action !== 'save') return;
  const s = Store.get();
  if (s.balance == null) return toast('Set balance first');
  Store.addSpend({
    amount: $('#amt', result.overlay)?.value,
    note: $('#note', result.overlay)?.value,
    category: $('#cat', result.overlay)?.value
  });
  toast('Logged');
  ctx.refresh();
}
