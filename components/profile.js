import { Store } from '../store.js';
import { esc, toast, confirmSheet, applyTheme, money, sheet, $ } from './ui.js';
import { openCustomizeSheet } from './home.js';
import { PRODUCT_COUNT } from '../catalog.js';
import { enableNotifications, notificationsSupported, checkReminders, registerBackgroundSync } from './notifications.js';
import { runOnboarding } from './onboarding.js';
import { encryptJson, decryptJson, cryptoSupported } from './crypto.js';

const APP_VERSION = '28';

export function renderProfile(root, ctx) {
  const s = Store.get();
  const settings = s.settings || {};
  const dataSize = Math.round(JSON.stringify(s).length / 1024);
  const trials = Store.activeTrials().length;

  root.innerHTML = `
    <header class="page-title">
      <button type="button" class="icon-btn back-fab" data-back aria-label="Back">←</button>
      <h1>You</h1>
      <p>Account & data</p>
    </header>

    <section class="profile-card">
      <img src="./icons/logo.png" width="96" height="96" alt="" class="profile-logo bank-logo" />
      <h2>${settings.displayName ? esc(settings.displayName) : 'Financer'}</h2>
      <p>${s.subscriptions.length} subs · ${s.transactions.length} transactions${trials ? ` · ${trials} on trial` : ''}</p>
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
        <button type="button" class="link-card" data-onboard>
          <strong>Replay setup</strong>
          <span>Walk through onboarding again</span>
        </button>
      </div>
    </section>

    <section class="panel">
      <h2>Reminders</h2>
      <p class="panel-sub">Bills, trials, cancel windows, and budget alerts at 80% / 100%.</p>
      ${notificationsSupported() ? `
        <label class="toggle-row">
          <div>
            <strong>Push reminders</strong>
            <span>${settings.notifications && Notification.permission === 'granted' ? 'On' : 'Off'}</span>
          </div>
          <input type="checkbox" id="notif-toggle" ${settings.notifications && Notification.permission === 'granted' ? 'checked' : ''} />
        </label>
      ` : `<p class="panel-sub">Notifications not supported in this browser.</p>`}
    </section>

    <section class="panel">
      <h2>Backup</h2>
      <p class="panel-sub">Export everything on this device, or restore from a file.</p>
      <div class="link-row">
        <button type="button" class="btn outline" data-export>Export</button>
        ${cryptoSupported() ? `<button type="button" class="btn outline" data-export-enc>Encrypted</button>` : ''}
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

  root.querySelector('[data-onboard]')?.addEventListener('click', async () => {
    await runOnboarding(ctx);
    ctx.refresh();
  });

  root.querySelector('#notif-toggle')?.addEventListener('change', async (e) => {
    if (e.target.checked) {
      const ok = await enableNotifications();
      if (!ok) {
        e.target.checked = false;
        toast('Permission denied');
        Store.updateSettings({ notifications: false });
        return;
      }
      await registerBackgroundSync();
      toast('Reminders enabled');
      checkReminders();
    } else {
      Store.updateSettings({ notifications: false });
      toast('Reminders off');
    }
    ctx.refresh();
  });

  root.querySelector('[data-export]')?.addEventListener('click', () => {
    downloadJson(Store.exportData(), `financer-backup-${iso()}.json`);
    toast('Exported');
  });

  root.querySelector('[data-export-enc]')?.addEventListener('click', () => openEncryptedExport());

  root.querySelector('#import-file')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      await importBackup(text, ctx);
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

function iso() {
  return new Date().toISOString().slice(0, 10);
}

function downloadJson(text, name) {
  const blob = new Blob([text], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

async function openEncryptedExport() {
  const result = await sheet({
    title: 'Encrypted backup',
    body: `
      <p class="sheet-hint">Your data is encrypted with AES-256 before download. Keep your password safe — we can't recover it.</p>
      <label class="field"><span>Password</span><input id="enc-pass" type="password" minlength="4" autocomplete="new-password" required /></label>
      <label class="field"><span>Confirm</span><input id="enc-pass2" type="password" minlength="4" autocomplete="new-password" required /></label>
    `,
    actions: [{ id: 'save', label: 'Export encrypted', primary: true }],
  });
  if (result?.action !== 'save') return;
  const p1 = $('#enc-pass', result.overlay)?.value;
  const p2 = $('#enc-pass2', result.overlay)?.value;
  if (p1 !== p2) return toast('Passwords do not match');
  try {
    const enc = await encryptJson(Store.exportData(), p1);
    downloadJson(enc, `financer-encrypted-${iso()}.json`);
    toast('Encrypted export saved');
  } catch (err) {
    toast(err.message || 'Export failed');
  }
}

async function importBackup(text, ctx) {
  let json = text;
  try {
    const parsed = JSON.parse(text);
    if (parsed?.financerEncrypted) {
      const pwResult = await sheet({
        title: 'Decrypt backup',
        body: `<label class="field"><span>Password</span><input id="dec-pass" type="password" autocomplete="current-password" required /></label>`,
        actions: [{ id: 'save', label: 'Decrypt', primary: true }],
      });
      if (pwResult?.action !== 'save') return;
      json = await decryptJson(parsed, $('#dec-pass', pwResult.overlay)?.value);
    }
  } catch {
    toast('Wrong password or corrupt file');
    return;
  }

  const ok = await confirmSheet({
    title: 'Import backup',
    body: 'Replace all data on this device with the backup file?',
    confirmLabel: 'Import',
    danger: true,
  });
  if (!ok) return;
  Store.importData(json);
  applyTheme(Store.get().settings?.theme || 'light');
  toast('Restored');
  ctx.navigate('home');
}
