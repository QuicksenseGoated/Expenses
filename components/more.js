import { CLIENT, MODEL, OPERATING_RULES } from '../facts.js';
import { Storage } from '../storage.js';
import { WEEKLY_CLIP_TARGET } from '../analytics.js';
import { escapeHtml } from './modal.js';

export function renderMore(root, ctx) {
  const raids = Storage.getRaids();

  root.innerHTML = `
    <section class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Ops</p>
          <h1>Model & setup</h1>
        </div>
      </header>

      <section class="panel">
        <h2>Raid list</h2>
        <p class="why">Similar-size Siege channels. Raid one per stream.</p>
        <form id="raid-form" class="raid-form">
          <input name="name" placeholder="twitch name" required />
          <button type="submit" class="btn primary">Add</button>
        </form>
        <ul class="raid-list">
          ${raids.map((r) => `
            <li>
              <a href="https://www.twitch.tv/${encodeURIComponent(r)}" target="_blank" rel="noopener">${escapeHtml(r)}</a>
              <button type="button" class="text-btn" data-rm="${escapeHtml(r)}">Remove</button>
            </li>
          `).join('') || `<li class="empty-inline">Empty — add 3 targets.</li>`}
        </ul>
      </section>

      <section class="panel" style="margin-top:0.85rem">
        <h2>Channel</h2>
        <ul class="kv">
          <li><span>Twitch</span><a href="${CLIENT.twitchUrl}" target="_blank" rel="noopener">${escapeHtml(CLIENT.twitch)}</a></li>
          <li><span>TikTok</span><a href="${CLIENT.tiktokUrl}" target="_blank" rel="noopener">@${escapeHtml(CLIENT.tiktok)}</a></li>
          <li><span>YouTube</span><a href="${CLIENT.youtubeUrl}" target="_blank" rel="noopener">@${escapeHtml(CLIENT.youtube)}</a></li>
          <li><span>Quota</span><strong>${WEEKLY_CLIP_TARGET} posts / week</strong></li>
          <li><span>Schedule</span><strong>${CLIENT.streamDays.siege}× Siege · ${CLIENT.streamDays.variety}× variety</strong></li>
          <li><span>Off-limits</span><strong>${CLIENT.bans.join(' · ')}</strong></li>
        </ul>
      </section>

      <section class="panel" style="margin-top:0.85rem">
        <h2>Model</h2>
        <ul class="kv">
          <li><span>Product</span><strong>${escapeHtml(MODEL.product)}</strong></li>
          <li><span>Acquisition</span><strong>${escapeHtml(MODEL.acquisition)}</strong></li>
          <li><span>Retention</span><strong>${escapeHtml(MODEL.retention)}</strong></li>
        </ul>
        <p class="fact">${escapeHtml(MODEL.proof)}</p>
      </section>

      <section class="panel" style="margin-top:0.85rem">
        <h2>Rules</h2>
        <ul class="rule-list">
          ${OPERATING_RULES.map((r) => `
            <li><strong>${escapeHtml(r.rule)}</strong><span>${escapeHtml(r.why)}</span></li>
          `).join('')}
        </ul>
      </section>

      <section class="panel form-stack" style="margin-top:0.85rem">
        <h2>Data</h2>
        <div class="header-actions">
          <button type="button" class="btn ghost" data-export>Export</button>
          <label class="btn ghost file-btn">Import<input type="file" accept="application/json" data-import hidden /></label>
        </div>
        <button type="button" class="btn danger" data-reset>Reset</button>
      </section>
    </section>
  `;

  root.querySelector('#raid-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get('name');
    Storage.addRaid(String(name));
    e.currentTarget.reset();
    ctx.toast('Added');
    ctx.refresh();
  });

  root.querySelectorAll('[data-rm]').forEach((b) => {
    b.addEventListener('click', () => {
      Storage.removeRaid(b.dataset.rm);
      ctx.refresh();
    });
  });

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
      alert('Invalid export');
    }
  });

  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (!confirm('Reset all data?')) return;
    Storage.reset();
    ctx.toast('Reset');
    ctx.navigate('today');
  });
}
