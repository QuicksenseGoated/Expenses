import { Storage } from '../storage.js';
import { escapeHtml, openModal } from './modal.js';

export function renderPlays(root, ctx) {
  const plays = Storage.getPlays();

  root.innerHTML = `
    <section class="view plays-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Growth plays</p>
          <h1>What we’re running on your channels</h1>
          <p class="sub">These are campaigns — not random ideas. Run them, log what happened, kill or scale.</p>
        </div>
      </header>

      <div class="plays-grid">
        ${plays.map((p) => `
          <article class="play-card progress-${escapeHtml(p.progress || 'queued')}">
            <div class="play-top">
              <span class="mode-pill">${escapeHtml(p.status)}</span>
              <span class="faint">${escapeHtml(p.progress || 'queued')}</span>
            </div>
            <h2>${escapeHtml(p.title)}</h2>
            <p>${escapeHtml(p.why)}</p>
            <h3>Do this</h3>
            <ul class="tip-list">
              ${(p.doThis || []).map((d) => `<li>${escapeHtml(d)}</li>`).join('')}
            </ul>
            <p class="metric-line"><strong>Metric:</strong> ${escapeHtml(p.metric)}</p>
            ${p.logs?.length ? `<p class="log-line">Last log: ${escapeHtml(p.logs[0].note)}</p>` : ''}
            <div class="row-actions">
              <button type="button" class="btn ghost" data-run="${p.id}">Mark running</button>
              <button type="button" class="btn ghost" data-log="${p.id}">Log result</button>
              <button type="button" class="text-btn" data-pause="${p.id}">Pause</button>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;

  root.querySelectorAll('[data-run]').forEach((btn) => {
    btn.addEventListener('click', () => {
      Storage.updatePlay(btn.dataset.run, { progress: 'running' });
      ctx.toast('Play is running');
      ctx.refresh();
    });
  });

  root.querySelectorAll('[data-pause]').forEach((btn) => {
    btn.addEventListener('click', () => {
      Storage.updatePlay(btn.dataset.pause, { progress: 'paused' });
      ctx.toast('Play paused');
      ctx.refresh();
    });
  });

  root.querySelectorAll('[data-log]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal({
        title: 'Log play result',
        bodyHtml: `
          <label class="field">
            <span>What happened?</span>
            <textarea id="play-note" rows="4" placeholder="Views, raid size, chat reaction, keep/kill…"></textarea>
          </label>
        `,
        footerHtml: `
          <button type="button" class="btn ghost" data-cancel>Cancel</button>
          <button type="button" class="btn primary" data-save>Save log</button>
        `,
        onMount(modal, close) {
          modal.querySelector('[data-cancel]')?.addEventListener('click', close);
          modal.querySelector('[data-save]')?.addEventListener('click', () => {
            const note = modal.querySelector('#play-note').value.trim();
            if (!note) return;
            Storage.logPlay(btn.dataset.log, note);
            ctx.toast('Logged');
            close();
            ctx.refresh();
          });
        }
      });
    });
  });
}
