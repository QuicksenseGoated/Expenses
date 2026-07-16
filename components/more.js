import { CLIENT, MODEL, OPERATING_RULES } from '../facts.js';
import { Storage } from '../storage.js';
import { escapeHtml } from './modal.js';

export function renderMore(root, ctx) {
  root.innerHTML = `
    <section class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Ops</p>
          <h1>Model & rules</h1>
        </div>
      </header>

      <section class="panel">
        <h2>Channel</h2>
        <ul class="kv">
          <li><span>Twitch</span><a href="${CLIENT.twitchUrl}" target="_blank" rel="noopener">${escapeHtml(CLIENT.twitch)}</a></li>
          <li><span>TikTok</span><a href="${CLIENT.tiktokUrl}" target="_blank" rel="noopener">@${escapeHtml(CLIENT.tiktok)}</a></li>
          <li><span>YouTube</span><a href="${CLIENT.youtubeUrl}" target="_blank" rel="noopener">@${escapeHtml(CLIENT.youtube)}</a></li>
          <li><span>Game</span><strong>${escapeHtml(CLIENT.game)}</strong></li>
          <li><span>Schedule</span><strong>${CLIENT.streamDays.siege}× Siege / ${CLIENT.streamDays.variety}× variety</strong></li>
          <li><span>Vibe</span><strong>${escapeHtml(CLIENT.vibe)}</strong></li>
          <li><span>Tool</span><strong>${escapeHtml(CLIENT.tools)}</strong></li>
          <li><span>Off-limits</span><strong>${CLIENT.bans.join(' · ')}</strong></li>
        </ul>
      </section>

      <section class="panel" style="margin-top:0.85rem">
        <h2>Business model</h2>
        <ul class="kv">
          <li><span>Product</span><strong>${escapeHtml(MODEL.product)}</strong></li>
          <li><span>Acquisition</span><strong>${escapeHtml(MODEL.acquisition)}</strong></li>
          <li><span>Retention</span><strong>${escapeHtml(MODEL.retention)}</strong></li>
        </ul>
        <p class="fact">${escapeHtml(MODEL.proof)}</p>
      </section>

      <section class="panel" style="margin-top:0.85rem">
        <h2>Operating rules</h2>
        <ul class="rule-list">
          ${OPERATING_RULES.map((r) => `
            <li>
              <strong>${escapeHtml(r.rule)}</strong>
              <span>${escapeHtml(r.why)}</span>
            </li>
          `).join('')}
        </ul>
      </section>

      <section class="panel form-stack" style="margin-top:0.85rem">
        <h2>Data</h2>
        <div class="header-actions">
          <button type="button" class="btn ghost" data-export>Export</button>
          <label class="btn ghost file-btn">Import<input type="file" accept="application/json" data-import hidden /></label>
        </div>
        <button type="button" class="btn danger" data-reset>Reset desk data</button>
        <p class="panel-note">PWA: Android ⋮ Install · iPhone Share → Add to Home Screen</p>
      </section>
    </section>
  `;

  root.querySelector('[data-export]')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(Storage.exportAll(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sense-desk-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    ctx.toast('Exported');
  });

  root.querySelector('[data-import]')?.addEventListener('change', async (e) => {
    try {
      Storage.importAll(JSON.parse(await e.target.files[0].text()));
      ctx.toast('Imported');
      ctx.refresh();
    } catch {
      alert('Invalid v3 export');
    }
  });

  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (!confirm('Reset all logged numbers/posts?')) return;
    Storage.reset();
    ctx.toast('Reset');
    ctx.navigate('today');
  });
}
