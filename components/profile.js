import { Store } from '../store.js';
import { esc, toast, confirmSheet, applyTheme, money } from './ui.js';
import { openCustomizeSheet } from './home.js';
import { PRODUCT_COUNT } from '../catalog.js';

const APP_VERSION = '11';

export function renderProfile(root, ctx) {
  const s = Store.get();
  const settings = s.settings || {};
  const dataSize = Math.round(JSON.stringify(s).length / 1024);

  root.innerHTML = `
    <header class="page-title">
      <button type="button" class="icon-btn back-fab" data-back aria-label="Back">←</button>
      <h1>You</h1>
      <p>Account & data</p>
    </header>

    <section class="profile-card">
      <img src="./icons/logo.png" width="96" height="96" alt="" class="profile-logo bank-logo" />
      <h2>${settings.displayName ? esc(settings.displayName) : 'Financer'}</h2>
      <p>${s.subscriptions.length} subs · ${s.transactions.length} transactions</p>
    </section>

    <section class="panel">
      <h2>Stats</h2>
      <dl class="stats-dl">
        <div><dt>Monthly sub load</dt><dd>${money(Store.subsMonthly(), s.currency)}</dd></div>
        <div><dt>Catalog</dt><dd>${PRODUCT_COUNT} services</dd></div>
        <div><dt>Data on device</dt><dd>~${dataSize} KB</dd></div>
        <div><dt>App version</dt><dd>v${APP_VERSION}</dd></div>
      </dl>
    </section>

    <section class="panel">
      <h2>Quick links</h2>
      <div class="link-grid">
        <button type="button" class="link-card" data-customize>
          <strong>Customize home</strong>
          <span>Name, payday, theme, widgets</span>
        </button>
        <button type="button" class="link-card" data-go="calendar">
          <strong>Bill calendar</strong>
          <span>See charges by date</span>
        </button>
        <button type="button" class="link-card" data-go="bills">
          <strong>Subscriptions</strong>
          <span>Manage your stack</span>
        </button>
      </div>
    </section>

    <section class="panel">
      <h2>Backup</h2>
      <p class="panel-sub">Export everything on this device, or restore from a file.</p>
      <div class="link-row">
        <button type="button" class="btn outline" data-export>Export</button>
        <label class="btn outline import-label">
          Import
          <input type="file" id="import-file" accept="application/json,.json" hidden />
        </label>
      </div>
    </section>

    <section class="panel">
      <h2>App</h2>
      <p class="panel-sub">Wrong icon on your home screen? Delete the shortcut, reopen the site, and Add to Home Screen again.</p>
    </section>

    <button type="button" class="btn danger block" data-reset>Reset all data</button>
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => ctx.navigate('home'));

  root.querySelectorAll('[data-go]').forEach((b) => {
    b.addEventListener('click', () => ctx.navigate(b.dataset.go));
  });

  root.querySelector('[data-customize]')?.addEventListener('click', async () => {
    ctx.navigate('home');
    await openCustomizeSheet(ctx);
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

  root.querySelector('#import-file')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const ok = await confirmSheet({
        title: 'Import backup',
        body: 'Replace all data on this device with the backup file?',
        confirmLabel: 'Import',
        danger: true,
      });
      if (!ok) return;
      Store.importData(text);
      applyTheme(Store.get().settings?.theme || 'system');
      toast('Restored');
      ctx.navigate('home');
    } catch {
      toast('Invalid file');
    }
    e.target.value = '';
  });

  root.querySelector('[data-reset]')?.addEventListener('click', async () => {
    const ok = await confirmSheet({
      title: 'Reset Financer',
      body: 'Delete everything on this device? This cannot be undone.',
      confirmLabel: 'Delete all',
      danger: true,
    });
    if (!ok) return;
    Store.reset();
    applyTheme('system');
    toast('Reset');
    ctx.navigate('home');
  });
}
