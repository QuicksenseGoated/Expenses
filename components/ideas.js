import { IDEAS, CLIENT } from '../facts.js';
import { Storage } from '../storage.js';
import { tagStats, bestTag } from '../analytics.js';
import { escapeHtml, openModal } from './modal.js';
import { quickLog } from './today.js';

const TAGS = ['all', 'clutch', 'fail', 'chat', 'series', 'teaser', 'variety', 'custom'];

export function renderIdeas(root, ctx) {
  let tag = 'all';

  function allIdeas() {
    return [...Storage.getCustomIdeas(), ...IDEAS];
  }

  function paint() {
    const saved = Storage.getSavedIdeas();
    const stats = tagStats(Storage.getPosts());
    const avgByTag = Object.fromEntries(stats.map((s) => [s.tag, s.avg]));
    const winner = bestTag(Storage.getPosts());
    let list = allIdeas().filter((i) => tag === 'all' || i.tag === tag);
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
            <p class="eyebrow">Ideas</p>
            <h1>${escapeHtml(CLIENT.game)} hooks</h1>
            <p class="sub">${winner ? `Your data favors <strong>${escapeHtml(winner.tag)}</strong> (avg ${fmt(winner.avg)}).` : 'Log posts with tags so ranking uses your numbers.'}</p>
          </div>
          <button type="button" class="btn ghost" data-add>Add idea</button>
        </header>

        <div class="chip-row wrap">
          ${TAGS.map((t) => `
            <button type="button" class="chip ${tag === t ? 'selected' : ''}" data-tag="${t}">
              ${t}${avgByTag[t] != null ? ` · ${fmt(avgByTag[t])}` : ''}
            </button>
          `).join('')}
        </div>

        <div class="idea-list">
          ${list.map((idea) => `
            <article class="idea-item ${saved.has(idea.id) ? 'pinned' : ''}">
              <div class="idea-item-top">
                <span class="tag">${escapeHtml(idea.tag)}${avgByTag[idea.tag] != null ? ` · avg ${fmt(avgByTag[idea.tag])}` : ''}</span>
                <div class="row-actions">
                  <button type="button" class="text-btn" data-pin="${idea.id}">${saved.has(idea.id) ? 'Unpin' : 'Pin'}</button>
                  ${idea.custom ? `<button type="button" class="text-btn" data-del="${idea.id}">Del</button>` : ''}
                </div>
              </div>
              <h2>${escapeHtml(idea.hook)}</h2>
              <p class="why">${escapeHtml(idea.why)}</p>
              ${idea.use ? `<p class="use"><strong>Cut:</strong> ${escapeHtml(idea.use)}</p>` : ''}
              <pre class="caption">${escapeHtml(idea.caption || idea.hook)}</pre>
              <div class="row-actions">
                <button type="button" class="btn ghost" data-copy="${idea.id}">Copy</button>
                <button type="button" class="btn primary" data-log="${idea.id}">Log posted</button>
              </div>
            </article>
          `).join('') || `<p class="empty-inline">No ideas in this filter.</p>`}
        </div>
      </section>
    `;

    root.querySelectorAll('[data-tag]').forEach((b) => {
      b.addEventListener('click', () => { tag = b.dataset.tag; paint(); });
    });

    root.querySelectorAll('[data-pin]').forEach((b) => {
      b.addEventListener('click', () => {
        Storage.toggleSavedIdea(b.dataset.pin);
        paint();
      });
    });

    root.querySelectorAll('[data-del]').forEach((b) => {
      b.addEventListener('click', () => {
        Storage.deleteCustomIdea(b.dataset.del);
        paint();
      });
    });

    root.querySelectorAll('[data-copy]').forEach((b) => {
      b.addEventListener('click', async () => {
        const idea = allIdeas().find((i) => i.id === b.dataset.copy);
        try {
          await navigator.clipboard.writeText(idea.caption || idea.hook);
          ctx.toast('Copied');
        } catch {
          ctx.toast('Copy failed');
        }
      });
    });

    root.querySelectorAll('[data-log]').forEach((b) => {
      b.addEventListener('click', () => {
        const idea = allIdeas().find((i) => i.id === b.dataset.log);
        quickLog(ctx, { title: idea.hook, tag: idea.tag, ideaId: idea.id });
      });
    });

    root.querySelector('[data-add]')?.addEventListener('click', () => {
      openModal({
        title: 'Your idea',
        bodyHtml: `
          <form id="ci" class="form-stack">
            <label class="field"><span>Hook</span><input name="hook" required /></label>
            <label class="field"><span>Caption</span><textarea name="caption" rows="3" placeholder="Include Twitch CTA"></textarea></label>
            <label class="field"><span>Cut note</span><input name="use" /></label>
          </form>
        `,
        footerHtml: `<button type="button" class="btn ghost" data-x>Cancel</button><button type="button" class="btn primary" data-s>Save</button>`,
        onMount(modal, close) {
          modal.querySelector('[data-x]')?.addEventListener('click', close);
          modal.querySelector('[data-s]')?.addEventListener('click', () => {
            const form = modal.querySelector('#ci');
            if (!form.reportValidity()) return;
            const fd = new FormData(form);
            const hook = String(fd.get('hook')).trim();
            Storage.addCustomIdea({
              hook,
              caption: String(fd.get('caption') || '').trim() || `${hook}\n\n${CLIENT.cta}`,
              use: String(fd.get('use') || '').trim()
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

function fmt(n) {
  if (n == null || n === '') return '—';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
