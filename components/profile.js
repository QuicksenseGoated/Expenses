import { Store } from '../store.js';
import { PRODUCT_COUNT, CATALOG_SIZE } from '../catalog.js';
import { esc, toast, sheet, $ } from './ui.js';

const WIDGET_OPTIONS = [
  { id: 'paycheck', label: 'Paycheck radar', desc: 'Bills due before payday' },
  { id: 'safe', label: 'Safe to spend', desc: 'Copilot-style buffer' },
  { id: 'metrics', label: 'Month snapshot', desc: 'Spend, subs, runway' },
  { id: 'bills', label: 'Upcoming bills', desc: 'Next charges' },
  { id: 'budgets', label: 'Budget envelopes', desc: 'YNAB-style limits' },
  { id: 'recent', label: 'Recent activity', desc: 'Latest transactions' },
  { id: 'subs_audit', label: 'Subscription load', desc: 'Sub cost vs balance' },
];

const CURRENCIES = ['€', '$', '£'];

export function renderProfile(root, ctx) {
  const s = Store.get();
  const settings = s.settings || {};
  const widgets = new Set(settings.homeWidgets || []);

  root.innerHTML = `
    <header class="page-title">
      <h1>You</h1>
      <p>Settings, privacy, and your data</p>
    </header>

    <section class="profile-card">
      <img src="./icons/logo.png" width="96" height="96" alt="Financer" class="profile-logo bank-logo" />
      <h2>Financer</h2>
      <p>${PRODUCT_COUNT} products · ${CATALOG_SIZE} plans in library</p>
    </section>

    <section class="panel">
      <h2>Profile</h2>
      <form id="profile-form" class="form-stack">
        <label class="field">
          <span>Display name</span>
          <input name="displayName" maxlength="24" value="${esc(settings.displayName || '')}" placeholder="Your name on home" />
        </label>
        <label class="field">
          <span>Currency symbol</span>
          <select name="currency">
            ${CURRENCIES.map((c) => `<option value="${c}" ${s.currency === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </label>
        <label class="field">
          <span>Payday (day of month)</span>
          <input name="paydayDay" type="number" min="1" max="31" inputmode="numeric" value="${settings.paydayDay ?? ''}" placeholder="e.g. 25" />
        </label>
        <label class="field checkbox-row">
          <input type="checkbox" name="hideBalance" ${settings.hideBalance ? 'checked' : ''} />
          <span>Hide balance amount on home</span>
        </label>
        <button class="btn primary block" type="submit">Save profile</button>
      </form>
    </section>

    <section class="panel">
      <h2>Home widgets</h2>
      <p class="panel-sub">Choose what shows on your home screen (⚙ on home).</p>
      <ul class="widget-toggles">
        ${WIDGET_OPTIONS.map((w) => `
          <li>
            <label class="widget-toggle">
              <input type="checkbox" data-widget="${w.id}" ${widgets.has(w.id) ? 'checked' : ''} />
              <div>
                <strong>${esc(w.label)}</strong>
                <span>${esc(w.desc)}</span>
              </div>
            </label>
          </li>
        `).join('')}
      </ul>
      <button type="button" class="btn outline block" data-save-widgets>Save widget layout</button>
    </section>

    <section class="panel">
      <h2>Budget limits</h2>
      <form id="budget-form" class="form-stack">
        ${s.budgets.map((b) => `
          <label class="field">
            <span>${esc(b.name)} limit</span>
            <input name="budget_${b.id}" type="number" min="0" step="1" value="${b.limit}" />
          </label>
        `).join('')}
        <button class="btn outline block" type="submit">Update limits</button>
      </form>
    </section>

    <section class="panel">
      <h2>Your data</h2>
      <dl class="stats-dl">
        <div><dt>Balance set</dt><dd>${s.balance == null ? 'No' : 'Yes'}</dd></div>
        <div><dt>Subscriptions</dt><dd>${s.subscriptions.length}</dd></div>
        <div><dt>Transactions</dt><dd>${s.transactions.length}</dd></div>
        <div><dt>Payday</dt><dd>${settings.paydayDay ? `Day ${settings.paydayDay}` : 'Not set'}</dd></div>
      </dl>
      <div class="link-row">
        <button type="button" class="btn outline" data-export>Export JSON</button>
        <label class="btn outline import-label">
          Import JSON
          <input type="file" id="import-file" accept="application/json,.json" hidden />
        </label>
      </div>
    </section>

    <section class="panel highlight">
      <h2>Reinstall Financer PWA</h2>
      <p class="body">If your home-screen icon still shows an old name:</p>
      <ol class="plain-list numbered">
        <li>Delete the app from your home screen</li>
        <li>Open <strong>quicksensegoated.github.io/Expenses/</strong></li>
        <li>Share → <strong>Add to Home Screen</strong></li>
      </ol>
    </section>

    <button type="button" class="btn danger block" data-reset>Reset all data on this device</button>
  `;

  $('#profile-form', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payday = fd.get('paydayDay');
    Store.updateSettings({
      displayName: String(fd.get('displayName') || '').trim(),
      paydayDay: payday ? Number(payday) : null,
      hideBalance: fd.get('hideBalance') === 'on',
    });
    Store.setCurrency(String(fd.get('currency')));
    toast('Profile saved');
    ctx.refresh();
  });

  root.querySelector('[data-save-widgets]')?.addEventListener('click', () => {
    const selected = [...root.querySelectorAll('[data-widget]:checked')].map((el) => el.dataset.widget);
    Store.updateSettings({ homeWidgets: selected.length ? selected : ['metrics'] });
    toast('Home layout saved');
  });

  $('#budget-form', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    s.budgets.forEach((b) => {
      const v = Number(fd.get(`budget_${b.id}`));
      if (Number.isFinite(v)) Store.updateBudget(b.id, { limit: v });
    });
    toast('Budgets updated');
    ctx.refresh();
  });

  root.querySelector('[data-export]')?.addEventListener('click', () => {
    const blob = new Blob([Store.exportData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `financer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Exported');
  });

  $('#import-file', root)?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      if (!confirm('Replace all data on this device with the backup?')) return;
      Store.importData(text);
      toast('Imported');
      ctx.navigate('home');
    } catch {
      toast('Invalid backup file');
    }
    e.target.value = '';
  });

  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (!confirm('Delete balance, spends, and subscriptions on this phone?')) return;
    Store.reset();
    toast('Reset complete');
    ctx.navigate('home');
  });
}
