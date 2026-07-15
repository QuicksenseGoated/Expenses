import { Storage } from '../storage.js';

export function renderSettings(root, ctx) {
  const settings = Storage.getSettings();

  root.innerHTML = `
    <section class="view settings-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Preferences</p>
          <h1>Settings</h1>
          <p class="sub">Data stays in this browser / app via localStorage. Export backups if this machine matters.</p>
        </div>
      </header>

      <div class="settings-grid">
        <section class="panel form-stack">
          <h2>Calendar</h2>
          <label class="field">
            <span>Week starts on</span>
            <select id="week-start">
              <option value="1" ${settings.weekStartsOn === 1 ? 'selected' : ''}>Monday</option>
              <option value="0" ${settings.weekStartsOn === 0 ? 'selected' : ''}>Sunday</option>
            </select>
          </label>
          <button type="button" class="btn primary" data-save-settings>Save preferences</button>
        </section>

        <section class="panel form-stack">
          <h2>Data</h2>
          <p class="panel-note">Export a JSON backup, or import one to restore strategy, ideas, and briefs.</p>
          <div class="header-actions">
            <button type="button" class="btn ghost" data-export>Export JSON</button>
            <label class="btn ghost file-btn">
              Import JSON
              <input type="file" accept="application/json,.json" data-import hidden />
            </label>
          </div>
          <button type="button" class="btn danger ghost" data-reset-onboarding>Replay setup wizard</button>
          <button type="button" class="btn danger" data-clear>Erase all data</button>
        </section>

        <section class="panel">
          <h2>About Cadence</h2>
          <p class="panel-note">Cadence is a results-first content planner: strategy → ideas → briefs → calendar → pipeline → measured outcomes. It won’t write posts for you — it keeps you from publishing noise.</p>
          <p class="panel-note muted">Local app · no account required · v1.0.0</p>
        </section>
      </div>
    </section>
  `;

  root.querySelector('[data-save-settings]')?.addEventListener('click', () => {
    const weekStartsOn = Number(root.querySelector('#week-start').value);
    Storage.saveSettings({ ...settings, weekStartsOn });
    ctx.settings = Storage.getSettings();
    ctx.toast('Preferences saved');
  });

  root.querySelector('[data-export]')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(Storage.exportAll(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cadence-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    ctx.toast('Exported');
  });

  root.querySelector('[data-import]')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      Storage.importAll(data);
      ctx.toast('Import complete');
      ctx.refresh(true);
    } catch {
      alert('Could not import that file. Need a Cadence JSON export.');
    }
  });

  root.querySelector('[data-reset-onboarding]')?.addEventListener('click', () => {
    if (!confirm('Replay the setup wizard? Your data stays — you’ll just see onboarding again.')) return;
    Storage.resetOnboarding();
    ctx.refresh(true);
  });

  root.querySelector('[data-clear]')?.addEventListener('click', () => {
    if (!confirm('Erase ALL Cadence data on this device? This cannot be undone.')) return;
    if (!confirm('Really sure? Export a backup first if you need it.')) return;
    Storage.clearAll();
    ctx.toast('All data cleared');
    ctx.refresh(true);
  });
}
