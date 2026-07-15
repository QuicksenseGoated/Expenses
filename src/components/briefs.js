import { Storage } from '../storage.js';
import {
  PLATFORMS, FUNNEL, STATUSES, BRIEF_CHECKLIST, readinessScore, platformById, statusById, funnelById
} from '../frameworks.js';
import { escapeHtml, openModal } from './modal.js';

export function renderBriefs(root, ctx) {
  const { pieces, strategy, openPiece } = ctx;
  const sorted = [...pieces].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

  root.innerHTML = `
    <section class="view briefs-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Quality gate</p>
          <h1>Content briefs</h1>
          <p class="sub">Hook · promise · proof · CTA. If the brief is soft, don’t draft yet.</p>
        </div>
        <button type="button" class="btn primary" data-new>New brief</button>
      </header>

      <div class="toolbar">
        <input type="search" data-filter placeholder="Search briefs…" />
        <select data-status>
          <option value="">All statuses</option>
          ${STATUSES.map((s) => `<option value="${s.id}">${s.label}</option>`).join('')}
        </select>
        <select data-funnel>
          <option value="">All funnel stages</option>
          ${FUNNEL.map((f) => `<option value="${f.id}">${f.label}</option>`).join('')}
        </select>
      </div>

      <div class="brief-table-wrap">
        <table class="brief-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Pillar</th>
              <th>Platform</th>
              <th>Funnel</th>
              <th>Status</th>
              <th>Date</th>
              <th>Ready</th>
            </tr>
          </thead>
          <tbody id="brief-body">
            ${sorted.map((p) => row(p, strategy)).join('') || `<tr><td colspan="7" class="empty-inline">No briefs yet. Create one from scratch or promote an idea.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;

  const body = root.querySelector('#brief-body');

  function apply() {
    const q = (root.querySelector('[data-filter]')?.value || '').toLowerCase();
    const status = root.querySelector('[data-status]')?.value || '';
    const funnel = root.querySelector('[data-funnel]')?.value || '';
    const filtered = sorted.filter((p) => {
      const hay = `${p.title} ${p.hook} ${p.keywords?.join(' ')}`.toLowerCase();
      return (!q || hay.includes(q))
        && (!status || p.status === status)
        && (!funnel || p.funnel === funnel);
    });
    body.innerHTML = filtered.map((p) => row(p, strategy)).join('') || `<tr><td colspan="7" class="empty-inline">No matches.</td></tr>`;
    bindRows();
  }

  root.querySelector('[data-filter]')?.addEventListener('input', apply);
  root.querySelector('[data-status]')?.addEventListener('change', apply);
  root.querySelector('[data-funnel]')?.addEventListener('change', apply);
  root.querySelector('[data-new]')?.addEventListener('click', () => {
    const piece = Storage.addPiece({
      title: 'Untitled brief',
      status: 'planned',
      platform: strategy.platforms?.[0] || 'blog',
      pillarId: strategy.pillars?.[0]?.id || null
    });
    ctx.refresh();
    openPiece(piece.id);
  });

  function bindRows() {
    body.querySelectorAll('[data-piece]').forEach((btn) => {
      btn.addEventListener('click', () => openPiece(btn.dataset.piece));
    });
  }
  bindRows();
}

function row(p, strategy) {
  const pillar = (strategy.pillars || []).find((x) => x.id === p.pillarId);
  const score = readinessScore(p);
  return `
    <tr>
      <td><button type="button" class="linkish" data-piece="${p.id}">${escapeHtml(p.title || 'Untitled')}</button></td>
      <td>${escapeHtml(pillar?.name || '—')}</td>
      <td>${escapeHtml(platformById(p.platform)?.label || p.platform)}</td>
      <td><span class="funnel-tag funnel-${p.funnel}">${escapeHtml(funnelById(p.funnel)?.label || p.funnel)}</span></td>
      <td><span class="status-pill status-${p.status}">${escapeHtml(statusById(p.status)?.label || p.status)}</span></td>
      <td>${escapeHtml(p.publishDate || '—')}</td>
      <td><div class="mini-meter"><i style="width:${score}%"></i></div> ${score}%</td>
    </tr>
  `;
}

export function openBriefEditor(pieceId, ctx) {
  const piece = ctx.pieces.find((p) => p.id === pieceId) || Storage.getPieces().find((p) => p.id === pieceId);
  if (!piece) return;
  const strategy = ctx.strategy;
  const pillars = strategy.pillars || [];
  let draft = structuredClone(piece);

  openModal({
    title: 'Content brief',
    wide: true,
    bodyHtml: `
      <form id="brief-form" class="brief-form">
        <div class="brief-main">
          <label class="field">
            <span>Title</span>
            <input name="title" value="${escapeHtml(draft.title)}" required />
          </label>
          <div class="form-row">
            <label class="field">
              <span>Status</span>
              <select name="status">
                ${STATUSES.map((s) => `<option value="${s.id}" ${draft.status === s.id ? 'selected' : ''}>${s.label}</option>`).join('')}
              </select>
            </label>
            <label class="field">
              <span>Platform</span>
              <select name="platform">
                ${PLATFORMS.map((p) => `<option value="${p.id}" ${draft.platform === p.id ? 'selected' : ''}>${p.label}</option>`).join('')}
              </select>
            </label>
            <label class="field">
              <span>Funnel</span>
              <select name="funnel">
                ${FUNNEL.map((f) => `<option value="${f.id}" ${draft.funnel === f.id ? 'selected' : ''}>${f.label} — ${f.intent}</option>`).join('')}
              </select>
            </label>
          </div>
          <div class="form-row">
            <label class="field">
              <span>Pillar</span>
              <select name="pillarId">
                <option value="">Unassigned</option>
                ${pillars.map((p) => `<option value="${p.id}" ${draft.pillarId === p.id ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
              </select>
            </label>
            <label class="field">
              <span>Publish date</span>
              <input type="date" name="publishDate" value="${escapeHtml(draft.publishDate || '')}" />
            </label>
            <label class="field">
              <span>Keywords (comma-separated)</span>
              <input name="keywords" value="${escapeHtml((draft.keywords || []).join(', '))}" placeholder="primary keyword, secondary" />
            </label>
          </div>

          <div class="brief-core">
            <label class="field">
              <span>Hook</span>
              <textarea name="hook" rows="2" placeholder="The first line that earns attention">${escapeHtml(draft.hook || '')}</textarea>
            </label>
            <label class="field">
              <span>Promise</span>
              <textarea name="promise" rows="2" placeholder="What the reader will walk away with">${escapeHtml(draft.promise || '')}</textarea>
            </label>
            <label class="field">
              <span>Proof points</span>
              <textarea name="proofPoints" rows="3" placeholder="Examples, data, customer stories, screenshots to include">${escapeHtml(draft.proofPoints || '')}</textarea>
            </label>
            <label class="field">
              <span>Outline</span>
              <textarea name="outline" rows="6" placeholder="1.&#10;2.&#10;3.">${escapeHtml(draft.outline || '')}</textarea>
            </label>
            <label class="field">
              <span>CTA</span>
              <input name="cta" value="${escapeHtml(draft.cta || '')}" placeholder="What should they do next?" />
            </label>
            <label class="field">
              <span>Notes / distribution</span>
              <textarea name="notes" rows="3" placeholder="Repurpose plan, assets needed, owner…">${escapeHtml(draft.notes || '')}</textarea>
            </label>
          </div>
        </div>

        <aside class="brief-side">
          <div class="ready-ring" data-ready>
            <strong>${readinessScore(draft)}%</strong>
            <span>brief readiness</span>
          </div>
          <h3>Ship checklist</h3>
          <ul class="check-list interactive">
            ${BRIEF_CHECKLIST.map((c) => `
              <li>
                <label>
                  <input type="checkbox" data-check="${c.key}" ${draft.checklist?.[c.key] ? 'checked' : ''} />
                  ${escapeHtml(c.label)}
                </label>
              </li>
            `).join('')}
          </ul>
          <p class="panel-note">Aim for 80%+ before moving to Ready. Soft briefs create soft content.</p>
          <button type="button" class="btn danger ghost full" data-delete>Delete brief</button>
        </aside>
      </form>
    `,
    footerHtml: `
      <button type="button" class="btn ghost" data-cancel>Cancel</button>
      <button type="button" class="btn primary" data-save>Save brief</button>
    `,
    onMount(modal, close) {
      const form = modal.querySelector('#brief-form');
      const readyEl = modal.querySelector('[data-ready] strong');

      function syncChecklist() {
        const checklist = { ...draft.checklist };
        modal.querySelectorAll('[data-check]').forEach((el) => {
          checklist[el.dataset.check] = el.checked;
        });
        draft.checklist = checklist;
        readyEl.textContent = `${readinessScore(draft)}%`;
      }
      modal.querySelectorAll('[data-check]').forEach((el) => {
        el.addEventListener('change', syncChecklist);
      });

      modal.querySelector('[data-cancel]')?.addEventListener('click', close);
      modal.querySelector('[data-delete]')?.addEventListener('click', () => {
        if (!confirm('Delete this brief permanently?')) return;
        Storage.deletePiece(piece.id);
        ctx.toast('Brief deleted');
        close();
        ctx.refresh();
      });
      modal.querySelector('[data-save]')?.addEventListener('click', () => {
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        syncChecklist();
        const keywords = String(fd.get('keywords') || '')
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean);
        Storage.updatePiece(piece.id, {
          title: String(fd.get('title') || '').trim(),
          status: String(fd.get('status') || 'planned'),
          platform: String(fd.get('platform') || 'blog'),
          funnel: String(fd.get('funnel') || 'tofu'),
          pillarId: String(fd.get('pillarId') || '') || null,
          publishDate: String(fd.get('publishDate') || '') || null,
          keywords,
          hook: String(fd.get('hook') || ''),
          promise: String(fd.get('promise') || ''),
          proofPoints: String(fd.get('proofPoints') || ''),
          outline: String(fd.get('outline') || ''),
          cta: String(fd.get('cta') || ''),
          notes: String(fd.get('notes') || ''),
          checklist: draft.checklist
        });
        ctx.toast('Brief saved');
        close();
        ctx.refresh();
      });
    }
  });
}
