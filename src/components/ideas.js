import { Storage } from '../storage.js';
import { escapeHtml, openModal } from './modal.js';
import { platformById } from '../frameworks.js';

export function renderIdeas(root, ctx) {
  const { strategy, ideas, refresh, openPiece, toast } = ctx;
  const pillars = strategy.pillars || [];

  root.innerHTML = `
    <section class="view ideas-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Capture</p>
          <h1>Idea bank</h1>
          <p class="sub">Park raw angles here. Promote winners into full briefs — don’t schedule half-baked thoughts.</p>
        </div>
        <button type="button" class="btn primary" data-add>Add idea</button>
      </header>

      <div class="toolbar">
        <input type="search" placeholder="Filter ideas…" data-filter />
        <select data-pillar-filter>
          <option value="">All pillars</option>
          ${pillars.map((p) => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('')}
        </select>
      </div>

      <div class="idea-grid" id="idea-grid">
        ${ideas.map((idea) => ideaCard(idea, pillars)).join('') || `
          <div class="empty-state">
            <h3>No ideas yet</h3>
            <p>Start messy. Capture hooks, questions, and customer language. Score them later.</p>
          </div>
        `}
      </div>
    </section>
  `;

  const grid = root.querySelector('#idea-grid');

  function applyFilter() {
    const q = (root.querySelector('[data-filter]')?.value || '').toLowerCase();
    const pillar = root.querySelector('[data-pillar-filter]')?.value || '';
    const filtered = ideas.filter((idea) => {
      const hay = `${idea.title} ${idea.notes}`.toLowerCase();
      const okQ = !q || hay.includes(q);
      const okP = !pillar || idea.pillarId === pillar;
      return okQ && okP;
    });
    grid.innerHTML = filtered.map((idea) => ideaCard(idea, pillars)).join('') || `
      <div class="empty-state"><h3>No matches</h3><p>Try another filter.</p></div>
    `;
    bindCards();
  }

  root.querySelector('[data-filter]')?.addEventListener('input', applyFilter);
  root.querySelector('[data-pillar-filter]')?.addEventListener('change', applyFilter);

  root.querySelector('[data-add]')?.addEventListener('click', () => {
    editIdeaModal(null, ctx);
  });

  function bindCards() {
    grid.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idea = ideas.find((i) => i.id === btn.dataset.edit);
        editIdeaModal(idea, ctx);
      });
    });
    grid.querySelectorAll('[data-promote]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idea = ideas.find((i) => i.id === btn.dataset.promote);
        if (!idea) return;
        const piece = Storage.addPiece({
          title: idea.title,
          notes: idea.notes,
          pillarId: idea.pillarId,
          platform: idea.platform || strategy.platforms?.[0] || 'blog',
          status: 'planned',
          funnel: 'tofu'
        });
        Storage.deleteIdea(idea.id);
        toast('Promoted to brief');
        refresh();
        openPiece(piece.id);
      });
    });
    grid.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!confirm('Delete this idea?')) return;
        Storage.deleteIdea(btn.dataset.del);
        toast('Idea deleted');
        refresh();
      });
    });
  }
  bindCards();
}

function ideaCard(idea, pillars) {
  const pillar = pillars.find((p) => p.id === idea.pillarId);
  return `
    <article class="idea-card">
      <div class="idea-top">
        <div class="stars" aria-label="Score ${idea.score || 0} of 5">${'●'.repeat(idea.score || 0)}${'○'.repeat(5 - (idea.score || 0))}</div>
        <div class="idea-actions">
          <button type="button" class="text-btn" data-edit="${idea.id}">Edit</button>
          <button type="button" class="text-btn" data-del="${idea.id}">Delete</button>
        </div>
      </div>
      <h3>${escapeHtml(idea.title || 'Untitled idea')}</h3>
      <p>${escapeHtml(idea.notes || 'No notes yet.')}</p>
      <div class="idea-meta">
        ${pillar ? `<span>${escapeHtml(pillar.name)}</span>` : '<span>No pillar</span>'}
        ${idea.platform ? `<span>${escapeHtml(platformById(idea.platform)?.label || idea.platform)}</span>` : ''}
      </div>
      <button type="button" class="btn ghost full" data-promote="${idea.id}">Promote to brief →</button>
    </article>
  `;
}

function editIdeaModal(idea, ctx) {
  const isNew = !idea;
  const pillars = ctx.strategy.pillars || [];
  openModal({
    title: isNew ? 'New idea' : 'Edit idea',
    bodyHtml: `
      <form id="idea-form" class="form-stack">
        <label class="field">
          <span>Title / angle</span>
          <input name="title" required value="${escapeHtml(idea?.title || '')}" placeholder="The hook or working title" />
        </label>
        <label class="field">
          <span>Notes</span>
          <textarea name="notes" rows="4" placeholder="Why this might work, source, customer quote…">${escapeHtml(idea?.notes || '')}</textarea>
        </label>
        <div class="form-row">
          <label class="field">
            <span>Pillar</span>
            <select name="pillarId">
              <option value="">Unassigned</option>
              ${pillars.map((p) => `<option value="${p.id}" ${idea?.pillarId === p.id ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
            </select>
          </label>
          <label class="field">
            <span>Score (1–5)</span>
            <input type="number" min="0" max="5" name="score" value="${idea?.score ?? 3}" />
          </label>
        </div>
      </form>
    `,
    footerHtml: `
      <button type="button" class="btn ghost" data-cancel>Cancel</button>
      <button type="button" class="btn primary" data-save>${isNew ? 'Add idea' : 'Save'}</button>
    `,
    onMount(modal, close) {
      modal.querySelector('[data-cancel]')?.addEventListener('click', close);
      modal.querySelector('[data-save]')?.addEventListener('click', () => {
        const form = modal.querySelector('#idea-form');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        const payload = {
          title: String(fd.get('title') || '').trim(),
          notes: String(fd.get('notes') || '').trim(),
          pillarId: String(fd.get('pillarId') || '') || null,
          score: Number(fd.get('score') || 0)
        };
        if (isNew) Storage.addIdea(payload);
        else Storage.updateIdea(idea.id, payload);
        ctx.toast(isNew ? 'Idea added' : 'Idea updated');
        close();
        ctx.refresh();
      });
    }
  });
}
