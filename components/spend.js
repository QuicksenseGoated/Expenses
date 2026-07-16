import { Store } from '../store.js';
import { brandHead, esc, money, toast, $ } from './ui.js';

export function renderSpend(root, ctx) {
  const s = Store.get();
  const txs = s.transactions;

  root.innerHTML = `
    ${brandHead('Track spending')}

    <section class="hero-card compact">
      <p class="label">Current balance</p>
      <p class="amount sm">${s.balance == null ? '—' : money(s.balance, s.currency)}</p>
      <p class="meta">Logging a spend subtracts from this number.</p>
    </section>

    ${s.balance == null ? `
      <section class="block">
        <div class="empty">
          <p>Set your bank balance on Home first.</p>
          <button type="button" class="btn primary" data-home>Go to Home</button>
        </div>
      </section>
    ` : `
      <section class="block">
        <h2>Log spend</h2>
        <form id="spend-form" class="stack">
          <label class="field"><span>Amount</span>
            <input name="amount" type="number" min="0.01" step="0.01" inputmode="decimal" placeholder="12.50" required />
          </label>
          <label class="field"><span>What for</span>
            <input name="note" maxlength="80" placeholder="Lunch, Uber, game…" required />
          </label>
          <label class="field"><span>Category</span>
            <select name="category">
              <option>Food</option>
              <option>Transport</option>
              <option>Fun</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>General</option>
            </select>
          </label>
          <button class="btn primary block" type="submit">Subtract from balance</button>
        </form>
      </section>

      <section class="block">
        <h2>Add money</h2>
        <form id="income-form" class="inline-form">
          <input name="amount" type="number" min="0.01" step="0.01" inputmode="decimal" placeholder="Payday 500" required />
          <button class="btn" type="submit">Add</button>
        </form>
      </section>
    `}

    <section class="block">
      <div class="block-head"><h2>History</h2></div>
      ${txs.length ? `
        <div class="list">
          ${txs.map((t) => `
            <div class="row static">
              <div>
                <strong>${esc(t.note)}</strong>
                <span>${esc(t.date)} · ${esc(t.category)}</span>
              </div>
              <div class="row-actions">
                <b class="${t.type === 'spend' ? 'neg' : 'pos'}">${t.type === 'spend' ? '−' : '+'}${money(t.amount, s.currency)}</b>
                <button type="button" class="link" data-del="${t.id}">Undo</button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `<p class="empty-inline">Nothing logged yet.</p>`}
    </section>
  `;

  root.querySelector('[data-home]')?.addEventListener('click', () => ctx.navigate('home'));

  $('#spend-form', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    Store.addSpend({
      amount: fd.get('amount'),
      note: String(fd.get('note') || '').trim(),
      category: String(fd.get('category') || 'General')
    });
    toast('Spent');
    ctx.refresh();
  });

  $('#income-form', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    Store.addIncome({ amount: fd.get('amount'), note: 'Deposit' });
    toast('Added');
    ctx.refresh();
  });

  root.querySelectorAll('[data-del]').forEach((b) => {
    b.addEventListener('click', () => {
      Store.deleteTx(b.dataset.del);
      toast('Undone');
      ctx.refresh();
    });
  });
}
