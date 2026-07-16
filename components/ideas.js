import { FORMATS, FORMAT_TAGS, CLIENT } from '../facts.js';
import { Storage } from '../storage.js';
import { formatStats, bestFormatTag } from '../analytics.js';
import { escapeHtml, openModal } from './modal.js';

const TAGS = ['all', ...FORMAT_TAGS, 'custom'];

export function renderIdeas(root, ctx) {
  let tag = 'all';

  function allFormats() {
    return [...Storage.getCustomFormats(), ...FORMATS];
  }

  function paint() {
    const saved = Storage.getSavedIdeas();
    const stats = formatStats(Storage.getFormatRuns());
    const avgByTag = Object.fromEntries(stats.map((s) => [s.tag, s.avgAcv]));
    const winner = bestFormatTag(Storage.getFormatRuns());
    let list = allFormats().filter((i) => tag === 'all' || i.tag === tag);
    list = [...list].sort((a, b) => {
      const sa = saved.has(a.id) ? 1 : 0;
      const sb = saved.has(b.id) ? 1 : 0;
      if (sa !== sb) return sb - sa;
      return (avgByTag[b.tag] || 0) - (avgByTag[a.tag] || 0);
    });

    root.innerHTML = `
      <section class="view">
        <header class="view-header">
          <div>
            <p class="eyebrow">Formats</p>
            <h1>What to run on stream</h1>
            <p class="sub">${winner ? `Your runs favor <strong>${escapeHtml(winner.tag)}</strong> (avg ACV ${fmt(winner.avgAcv)}).` : 'Streamladder owns shorts. These are live formats — KOTH, locks, brackets.'}</p>
          </div>
          <button type="button" class="btn ghost" data-add>Add format</button>
        </header>

        <div class="chip-row wrap">
          ${TAGS.map((t) => `
            <button type="button" class="chip ${tag === t ? 'selected' : ''}" data-tag="${t}">${t}</button>
          `).join('')}
        </div>

        <div class="idea-list">
          ${list.map((f) => `
            <article class="idea-item ${saved.has(f.id) ? 'pinned' : ''}">
              <div class="idea-item-top">
                <span class="tag">${escapeHtml(f.tag)}${avgByTag[f.tag] != null ? ` · ACV ${fmt(avgByTag[f.tag])}` : ''}</span>
                <div class="row-actions">
                  <button type="button" class="text-btn" data-pin="${f.id}">${saved.has(f.id) ? 'Unpin' : 'Pin'}</button>
                  ${f.custom ? `<button type="button" class="text-btn" data-del="${f.id}">Del</button>` : ''}
                </div>
              </div>
              <h2>${escapeHtml(f.title)}</h2>
              <p class="why">${escapeHtml(f.pitch)}</p>
              <p class="use"><strong>Length:</strong> ${escapeHtml(f.length || '—')} · <strong>Title:</strong> ${escapeHtml(f.titleExample || f.title)}</p>
              <p class="use"><strong>Chat:</strong> ${escapeHtml(f.chat || '—')}</p>
              <ol class="steps tight">${(f.run || []).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
              <p class="why">${escapeHtml(f.why)}</p>
              <div class="row-actions">
                <button type="button" class="btn primary" data-ran="${f.id}">Ran it</button>
                <button type="button" class="btn ghost" data-tonight="${f.id}">Set tonight</button>
                <button type="button" class="text-btn" data-copy-title="${f.id}">Copy title</button>
              </div>
            </article>
          `).join('') || `<p class="empty-inline">No formats in this filter.</p>`}
        </div>
      </section>
    `;

    root.querySelectorAll('[data-tag]').forEach((b) => {
      b.addEventListener('click', () => { tag = b.dataset.tag; paint(); });
    });

    root.querySelectorAll('[data-pin]').forEach((b) => {
      b.addEventListener('click', () => { Storage.toggleSavedIdea(b.dataset.pin); paint(); });
    });

    root.querySelectorAll('[data-del]').forEach((b) => {
      b.addEventListener('click', () => { Storage.deleteCustomFormat(b.dataset.del); paint(); });
    });

    root.querySelectorAll('[data-copy-title]').forEach((b) => {
      b.addEventListener('click', async () => {
        const f = allFormats().find((x) => x.id === b.dataset.copyTitle);
        try {
          await navigator.clipboard.writeText(f.titleExample || f.title);
          ctx.toast('Title copied');
        } catch {
          ctx.toast('Copy failed');
        }
      });
    });

    root.querySelectorAll('[data-tonight]').forEach((b) => {
      b.addEventListener('click', () => {
        Storage.setTonightFormat(b.dataset.tonight);
        ctx.toast('Set for tonight');
        ctx.navigate('today');
      });
    });

    root.querySelectorAll('[data-ran]').forEach((b) => {
      b.addEventListener('click', () => markRan(allFormats().find((x) => x.id === b.dataset.ran), ctx, paint));
    });

    root.querySelector('[data-add]')?.addEventListener('click', () => {
      openModal({
        title: 'Custom format',
        bodyHtml: `
          <form id="cf" class="form-stack">
            <label class="field"><span>Name</span><input name="title" required placeholder="e.g. Knife only customs" /></label>
            <label class="field"><span>Tag</span>
              <select name="tag">${FORMAT_TAGS.map((t) => `<option value="${t}">${t}</option>`).join('')}</select>
            </label>
            <label class="field"><span>Pitch</span><textarea name="pitch" rows="2" required></textarea></label>
            <label class="field"><span>Run steps (one per line)</span><textarea name="run" rows="4" placeholder="Step 1&#10;Step 2"></textarea></label>
            <label class="field"><span>Title example</span><input name="titleExample" /></label>
          </form>
        `,
        footerHtml: `<button type="button" class="btn ghost" data-x>Cancel</button><button type="button" class="btn primary" data-s>Save</button>`,
        onMount(modal, close) {
          modal.querySelector('[data-x]')?.addEventListener('click', close);
          modal.querySelector('[data-s]')?.addEventListener('click', () => {
            const form = modal.querySelector('#cf');
            if (!form.reportValidity()) return;
            const fd = new FormData(form);
            const run = String(fd.get('run') || '').split('\n').map((s) => s.trim()).filter(Boolean);
            Storage.addCustomFormat({
              title: String(fd.get('title')).trim(),
              tag: String(fd.get('tag')),
              pitch: String(fd.get('pitch')).trim(),
              run,
              titleExample: String(fd.get('titleExample') || '').trim(),
              length: 'custom',
              chat: '—',
              why: 'Your format'
            });
            ctx.toast('Added');
            close();
            paint();
          });
        }
      });
    });
  }

  paint();
}

function markRan(format, ctx, paint) {
  if (!format) return;
  openModal({
    title: `Ran: ${format.title}`,
    bodyHtml: `
      <form id="fr" class="form-stack">
        <label class="field"><span>ACV (optional)</span><input type="number" min="0" name="acv" /></label>
        <label class="field"><span>Note</span><input name="note" placeholder="kept chat / dead / repeat" /></label>
      </form>
    `,
    footerHtml: `<button type="button" class="btn ghost" data-x>Cancel</button><button type="button" class="btn primary" data-s>Save run</button>`,
    onMount(modal, close) {
      modal.querySelector('[data-x]')?.addEventListener('click', close);
      modal.querySelector('[data-s]')?.addEventListener('click', () => {
        const fd = new FormData(modal.querySelector('#fr'));
        Storage.addFormatRun({
          formatId: format.id,
          title: format.title,
          tag: format.tag,
          acv: fd.get('acv') === '' ? null : Number(fd.get('acv')),
          note: String(fd.get('note') || '').trim()
        });
        ctx.toast('Logged run');
        close();
        if (paint) paint();
        else ctx.refresh();
      });
    }
  });
}

function fmt(n) {
  if (n == null || n === '') return '—';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
