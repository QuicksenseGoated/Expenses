import { Storage } from '../storage.js';
import { PROFILE } from '../profile.js';

export function renderSettings(root, ctx) {
  root.innerHTML = `
    <section class="view settings-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Settings</p>
          <h1>Desk controls</h1>
          <p class="sub">Built for ${PROFILE.displayName}. Data stays local in this browser/app.</p>
        </div>
      </header>

      <div class="settings-grid">
        <section class="panel form-stack">
          <h2>Data</h2>
          <p class="panel-note">Export backups. Re-seed restores the Quicksense strategy pack.</p>
          <div class="header-actions">
            <button type="button" class="btn ghost" data-export>Export JSON</button>
            <label class="btn ghost file-btn">Import JSON<input type="file" accept="application/json,.json" data-import hidden /></label>
          </div>
          <button type="button" class="btn danger ghost" data-reseed>Re-seed strategy pack</button>
          <button type="button" class="btn danger" data-clear>Erase all desk data</button>
        </section>
        <section class="panel">
          <h2>About</h2>
          <p class="panel-note">This isn’t a blank planner. It’s a social media manager desk: weekly ops, clip factory, growth plays, and a scoreboard tied to Twitch avg viewers + TikTok views.</p>
        </section>
      </div>
    </section>
  `;

  root.querySelector('[data-export]')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(Storage.exportAll(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quicksense-desk-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    ctx.toast('Exported');
  });

  root.querySelector('[data-import]')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      Storage.importAll(JSON.parse(await file.text()));
      ctx.toast('Imported');
      ctx.refresh();
    } catch {
      alert('Could not import that file.');
    }
  });

  root.querySelector('[data-reseed]')?.addEventListener('click', () => {
    if (!confirm('Re-seed Quicksense strategy? Scoreboard history may be wiped.')) return;
    Storage.resetAll();
    ctx.toast('Strategy re-seeded');
    ctx.refresh();
  });

  root.querySelector('[data-clear]')?.addEventListener('click', () => {
    if (!confirm('Erase all desk data?')) return;
    Storage.resetAll();
    ctx.toast('Cleared + re-seeded');
    ctx.refresh();
  });
}
