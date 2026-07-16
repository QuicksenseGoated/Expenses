import { IDEAS, CLIENT } from '../facts.js';
import { Storage } from '../storage.js';
import { escapeHtml } from './modal.js';

const TAGS = ['all', 'clutch', 'fail', 'chat', 'series', 'teaser', 'variety'];

export function renderIdeas(root, ctx) {
  let tag = 'all';
  const saved = Storage.getSavedIdeas();

  function paint() {
    const list = IDEAS.filter((i) => tag === 'all' || i.tag === tag);
    const pinned = list.filter((i) => saved.has(i.id));
    const rest = list.filter((i) => !saved.has(i.id));
    const ordered = [...pinned, ...rest];

    root.innerHTML = `
      <section class="view">
        <header class="view-header">
          <div>
            <p class="eyebrow">Ideas</p>
            <h1>Hooks that fit ${escapeHtml(CLIENT.game)}</h1>
            <p class="sub">Text only. Copy → Streamladder caption. No uploads.</p>
          </div>
        </header>

        <div class="chip-row wrap">
          ${TAGS.map((t) => `
            <button type="button" class="chip ${tag === t ? 'selected' : ''}" data-tag="${t}">${t}</button>
          `).join('')}
        </div>

        <div class="idea-list">
          ${ordered.map((idea) => `
            <article class="idea-item ${saved.has(idea.id) ? 'pinned' : ''}" data-id="${idea.id}">
              <div class="idea-item-top">
                <span class="tag">${escapeHtml(idea.tag)}</span>
                <button type="button" class="text-btn" data-pin="${idea.id}">${saved.has(idea.id) ? 'Unpin' : 'Pin'}</button>
              </div>
              <h2>${escapeHtml(idea.hook)}</h2>
              <p class="why">${escapeHtml(idea.why)}</p>
              <p class="use"><strong>Cut:</strong> ${escapeHtml(idea.use)}</p>
              <pre class="caption">${escapeHtml(idea.caption)}</pre>
              <button type="button" class="btn ghost full" data-copy="${idea.id}">Copy caption</button>
            </article>
          `).join('')}
        </div>
      </section>
    `;

    root.querySelectorAll('[data-tag]').forEach((b) => {
      b.addEventListener('click', () => {
        tag = b.dataset.tag;
        paint();
      });
    });

    root.querySelectorAll('[data-pin]').forEach((b) => {
      b.addEventListener('click', () => {
        Storage.toggleSavedIdea(b.dataset.pin);
        ctx.toast('Updated');
        paint();
      });
    });

    root.querySelectorAll('[data-copy]').forEach((b) => {
      b.addEventListener('click', async () => {
        const idea = IDEAS.find((i) => i.id === b.dataset.copy);
        if (!idea) return;
        try {
          await navigator.clipboard.writeText(idea.caption);
          ctx.toast('Copied');
        } catch {
          ctx.toast('Copy failed — select caption manually');
        }
      });
    });
  }

  paint();
}
