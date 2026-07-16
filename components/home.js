import { Store } from '../store.js';
import { greeting, money, niceDate, esc, toast, sheet, $ } from './ui.js';

export function renderHome(root, ctx) {
  const s = Store.get();
  const safe = Store.safeToSpend();
  const reserved = Store.reservedForBills();
  const monthSpend = Store.monthSpend();
  const subs = Store.subsMonthly();
  const runway = Store.runwayDays();
  const week = Store.weekSpend();
  const maxBar = Math.max(1, ...week.map((d) => d.spent));
  const upcoming = Store.upcomingBills(14).slice(0, 4);
  const recent = s.transactions.slice(0, 4);
  const hasBal = s.balance != null;

  root.innerHTML = `
    <header class="topbar">
      <div>
        <p class="greet">${greeting()}</p>
        <h1 class="logo-word">Financer</h1>
      </div>
      <button type="button" class="avatar" data-go="profile" aria-label="Profile">
        <img src="./icons/logo.png" width="36" height="36" alt="" />
      </button>
    </header>

    <section class="balance-card">
      <div class="balance-inner">
        <p class="balance-label">Available balance</p>
        ${hasBal ? `
          <p class="balance-amount">${money(s.balance, s.currency)}</p>
          <div class="balance-meta">
            <span>Safe ${money(safe, s.currency)}</span>
            <span>·</span>
            <span>${money(reserved, s.currency)} reserved</span>
          </div>
        ` : `
          <p class="balance-amount dim">Set your balance</p>
          <p class="balance-hint">Enter what’s in your account — we track it as you spend.</p>
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

    <section class="metrics">
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
    </section>

    <section class="panel">
      <div class="panel-head"><h2>7-day spend</h2></div>
      <div class="chart" aria-hidden="true">
        ${week.map((d) => `
          <div class="bar-col">
            <div class="bar-fill" style="height:${Math.max(4, (d.spent / maxBar) * 100)}%"></div>
            <span>${d.label}</span>
          </div>
        `).join('')}
      </div>
    </section>

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
      ` : `
        <div class="empty-sm">
          <p>No bills yet.</p>
          <button type="button" class="link-btn" data-go="bills">Add a subscription</button>
        </div>
      `}
    </section>

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
      ` : `<p class="empty-sm">No activity — log your first spend.</p>`}
    </section>
  `;

  root.querySelectorAll('[data-go]').forEach((b) => {
    b.addEventListener('click', () => ctx.navigate(b.dataset.go));
  });
  root.querySelectorAll('[data-sub]').forEach((b) => {
    b.addEventListener('click', () => ctx.openSub(b.dataset.sub));
  });

  root.querySelector('[data-setup]')?.addEventListener('click', () => openBalanceSheet(ctx));
  root.querySelector('[data-edit]')?.addEventListener('click', () => openBalanceSheet(ctx, s.balance));
  root.querySelector('[data-spend]')?.addEventListener('click', () => ctx.openSpend());
  root.querySelector('[data-income]')?.addEventListener('click', () => openIncomeSheet(ctx));
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
