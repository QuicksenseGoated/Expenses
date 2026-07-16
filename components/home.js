import { Store } from '../store.js';
import { brandHead, esc, money, niceDate, toast, $ } from './ui.js';

export function renderHome(root, ctx) {
  const s = Store.get();
  const monthSpend = Store.monthSpend();
  const upcoming = Store.upcomingBills(21);
  const safe = Store.safeToSpend();
  const reserved = Store.reservedForBills();
  const recent = s.transactions.slice(0, 5);
  const hasBalance = s.balance != null;

  root.innerHTML = `
    ${brandHead('Your money, clear')}

    <section class="hero-card">
      <p class="label">Bank balance</p>
      ${hasBalance ? `
        <p class="amount">${money(s.balance, s.currency)}</p>
        <p class="meta">Safe to spend ${money(safe, s.currency)} · bills reserved ${money(reserved, s.currency)}</p>
        <div class="btn-row">
          <button type="button" class="btn sm" data-edit-bal>Edit</button>
          <button type="button" class="btn sm primary" data-go="spend">Log spend</button>
        </div>
      ` : `
        <p class="amount soft">Set your cash</p>
        <p class="meta">Type what’s in your account (e.g. 390). Financer tracks it as you spend.</p>
        <form id="bal-form" class="inline-form">
          <input name="balance" type="number" min="0" step="0.01" inputmode="decimal" placeholder="390.00" required />
          <button class="btn primary" type="submit">Save</button>
        </form>
      `}
    </section>

    <section class="stat-row">
      <article>
        <b>${money(monthSpend, s.currency)}</b>
        <span>Spent MTD</span>
      </article>
      <article>
        <b>${s.subscriptions.length}</b>
        <span>Subs</span>
      </article>
      <article>
        <b>${upcoming.length}</b>
        <span>Due soon</span>
      </article>
    </section>

    <section class="block">
      <div class="block-head">
        <h2>Upcoming bills</h2>
        <button type="button" class="text-btn" data-go="subs">Manage</button>
      </div>
      ${upcoming.length ? `
        <div class="list">
          ${upcoming.map((b) => `
            <button type="button" class="row" data-mysub="${b.id}">
              <div>
                <strong>${esc(b.name)}</strong>
                <span>${niceDate(b.nextBill)} · in ${b.daysUntil}d</span>
              </div>
              <b>${money(b.price, b.currency)}</b>
            </button>
          `).join('')}
        </div>
      ` : `
        <div class="empty">
          <p>No subscriptions yet.</p>
          <button type="button" class="btn primary" data-go="subs">Find & add a sub</button>
        </div>
      `}
    </section>

    <section class="block">
      <div class="block-head">
        <h2>Recent activity</h2>
        <button type="button" class="text-btn" data-go="spend">All</button>
      </div>
      ${recent.length ? `
        <div class="list">
          ${recent.map((t) => `
            <div class="row static">
              <div>
                <strong>${esc(t.note)}</strong>
                <span>${esc(t.date)} · ${esc(t.category)}</span>
              </div>
              <b class="${t.type === 'spend' ? 'neg' : 'pos'}">${t.type === 'spend' ? '−' : '+'}${money(t.amount, s.currency)}</b>
            </div>
          `).join('')}
        </div>
      ` : `<p class="empty-inline">No spends yet — log one when you buy something.</p>`}
    </section>
  `;

  $('#bal-form', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = Number(new FormData(e.currentTarget).get('balance'));
    Store.setBalance(v);
    toast('Balance saved');
    ctx.refresh();
  });

  root.querySelector('[data-edit-bal]')?.addEventListener('click', () => {
    const next = prompt('Bank balance', String(s.balance ?? ''));
    if (next == null || next === '') return;
    const v = Number(next);
    if (!Number.isFinite(v)) return toast('Invalid number');
    Store.setBalance(v);
    toast('Updated');
    ctx.refresh();
  });

  root.querySelectorAll('[data-go]').forEach((b) => {
    b.addEventListener('click', () => ctx.navigate(b.dataset.go));
  });

  root.querySelectorAll('[data-mysub]').forEach((b) => {
    b.addEventListener('click', () => ctx.openMySub(b.dataset.mysub));
  });
}
