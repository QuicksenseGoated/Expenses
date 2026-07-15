import { Storage } from '../storage.js';
import { STATUSES, readinessScore, platformById, funnelById } from '../frameworks.js';
import { escapeHtml } from './modal.js';

const BOARD = STATUSES.filter((s) => s.id !== 'measured');

export function renderPipeline(root, ctx) {
  const { pieces, strategy, openPiece, toast, refresh } = ctx;

  root.innerHTML = `
    <section class="view pipeline-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Flow</p>
          <h1>Pipeline</h1>
          <p class="sub">Move work left → right. Don’t let pieces rot in Drafting without a date.</p>
        </div>
      </header>

      <div class="kanban" id="kanban">
        ${BOARD.map((col) => {
          const items = pieces
            .filter((p) => p.status === col.id)
            .sort((a, b) => (a.publishDate || '9999').localeCompare(b.publishDate || '9999'));
          return `
            <section class="kanban-col" data-status="${col.id}">
              <header>
                <h2>${col.label}</h2>
                <span>${items.length}</span>
              </header>
              <div class="kanban-list" data-drop="${col.id}">
                ${items.map((p) => card(p, strategy)).join('') || `<p class="empty-inline">Empty</p>`}
              </div>
            </section>
          `;
        }).join('')}
      </div>
    </section>
  `;

  root.querySelectorAll('[data-piece]').forEach((btn) => {
    btn.addEventListener('click', () => openPiece(btn.dataset.piece));
  });

  root.querySelectorAll('[data-advance]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const piece = pieces.find((p) => p.id === btn.dataset.advance);
      if (!piece) return;
      const idx = BOARD.findIndex((s) => s.id === piece.status);
      if (idx === -1 || idx >= BOARD.length - 1) return;
      const next = BOARD[idx + 1].id;
      if (next === 'ready' && readinessScore(piece) < 70) {
        if (!confirm(`Brief readiness is ${readinessScore(piece)}%. Move to Ready anyway?`)) return;
      }
      Storage.updatePiece(piece.id, { status: next });
      toast(`Moved to ${BOARD[idx + 1].label}`);
      refresh();
    });
  });

  // Drag and drop
  root.querySelectorAll('.kanban-card').forEach((el) => {
    el.draggable = true;
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', el.dataset.piece);
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
  });

  root.querySelectorAll('[data-drop]').forEach((zone) => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain');
      const status = zone.dataset.drop;
      if (!id || !status) return;
      Storage.updatePiece(id, { status });
      toast('Status updated');
      refresh();
    });
  });
}

function card(p, strategy) {
  const pillar = (strategy.pillars || []).find((x) => x.id === p.pillarId);
  const score = readinessScore(p);
  return `
    <article class="kanban-card" data-piece="${p.id}" data-piece-id="${p.id}">
      <div class="kanban-tags">
        <span class="funnel-tag funnel-${p.funnel}">${escapeHtml(funnelById(p.funnel)?.label || '')}</span>
        <span>${score}%</span>
      </div>
      <h3>${escapeHtml(p.title || 'Untitled')}</h3>
      <p>${escapeHtml(platformById(p.platform)?.label || p.platform)}${pillar ? ` · ${escapeHtml(pillar.name)}` : ''}</p>
      <div class="kanban-foot">
        <span>${escapeHtml(p.publishDate || 'No date')}</span>
        <button type="button" class="text-btn" data-advance="${p.id}">Advance →</button>
      </div>
    </article>
  `;
}
