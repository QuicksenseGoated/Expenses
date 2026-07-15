import { Storage } from '../storage.js';
import { CLIP_FORMULAS } from '../playbook.js';
import { PILLARS, PROFILE } from '../profile.js';
import { escapeHtml, openModal } from './modal.js';

export function renderClips(root, ctx) {
  const clips = Storage.getClips();
  const todo = clips.filter((c) => c.status === 'todo' || c.status === 'editing');
  const posted = clips.filter((c) => c.status === 'posted' || c.status === 'winner');

  root.innerHTML = `
    <section class="view clips-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Clip factory</p>
          <h1>Turn streams into Twitch ads</h1>
          <p class="sub">Streamladder → TikTok + Shorts → CTA to <strong>${escapeHtml(PROFILE.handles.twitch)}</strong>. No orphan clips.</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn ghost" data-formulas>Hook formulas</button>
          <button type="button" class="btn primary" data-add>Assign clip</button>
        </div>
      </header>

      <div class="formula-strip" id="formula-strip" hidden>
        ${CLIP_FORMULAS.map((f) => `
          <button type="button" class="formula-chip" data-use-formula="${f.id}">
            <strong>${escapeHtml(f.label)}</strong>
            <span>${escapeHtml(f.hook)}</span>
          </button>
        `).join('')}
      </div>

      <div class="clips-layout">
        <section class="panel">
          <div class="panel-head"><h2>To shoot / edit (${todo.length})</h2></div>
          <ul class="clip-list">
            ${todo.map((c) => clipRow(c)).join('') || `<li class="empty-inline">No clip assignments. Generate from briefing or add one.</li>`}
          </ul>
        </section>
        <section class="panel">
          <div class="panel-head"><h2>Posted / winners (${posted.length})</h2></div>
          <ul class="clip-list">
            ${posted.map((c) => clipRow(c)).join('') || `<li class="empty-inline">Post something, then mark it — winners get repeated.</li>`}
          </ul>
        </section>
      </div>
    </section>
  `;

  const strip = root.querySelector('#formula-strip');
  root.querySelector('[data-formulas]')?.addEventListener('click', () => {
    strip.hidden = !strip.hidden;
  });

  root.querySelectorAll('[data-use-formula]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = CLIP_FORMULAS.find((x) => x.id === btn.dataset.useFormula);
      if (!f) return;
      Storage.addClip({
        title: f.hook,
        caption: `${f.hook}\n\n${PROFILE.cta.short}\n#RainbowSixSiege #R6Siege #SiegeClips`,
        formulaId: f.id,
        tip: f.captionTip,
        status: 'todo'
      });
      ctx.toast('Clip assigned from formula');
      ctx.refresh();
    });
  });

  root.querySelector('[data-add]')?.addEventListener('click', () => editClip(null, ctx));

  root.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const clip = clips.find((c) => c.id === btn.dataset.edit);
      editClip(clip, ctx);
    });
  });

  root.querySelectorAll('[data-status]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [id, status] = btn.dataset.status.split(':');
      Storage.updateClip(id, { status });
      ctx.toast(`Marked ${status}`);
      ctx.refresh();
    });
  });

  root.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!confirm('Delete clip assignment?')) return;
      Storage.deleteClip(btn.dataset.del);
      ctx.refresh();
    });
  });
}

function clipRow(c) {
  const pillar = PILLARS.find((p) => p.id === c.pillarId);
  return `
    <li class="clip-row">
      <div>
        <strong>${escapeHtml(c.title || 'Untitled clip')}</strong>
        <span>${escapeHtml(pillar?.name || 'Siege')} · ${escapeHtml(c.platform)}→${escapeHtml(c.alsoPost || '—')}
          ${c.views != null ? ` · ${c.views} views` : ''}</span>
        <p>${escapeHtml(c.caption || '').slice(0, 120)}</p>
      </div>
      <div class="row-actions">
        <button type="button" class="text-btn" data-edit="${c.id}">Edit</button>
        ${c.status !== 'posted' && c.status !== 'winner' ? `<button type="button" class="btn ghost" data-status="${c.id}:posted">Posted</button>` : ''}
        ${c.status === 'posted' ? `<button type="button" class="btn ghost" data-status="${c.id}:winner">Winner</button>` : ''}
        <button type="button" class="text-btn" data-del="${c.id}">Del</button>
      </div>
    </li>
  `;
}

function editClip(clip, ctx) {
  const isNew = !clip;
  openModal({
    title: isNew ? 'Assign clip' : 'Edit clip',
    bodyHtml: `
      <form id="clip-form" class="form-stack">
        <label class="field"><span>Hook / title</span><input name="title" required value="${escapeHtml(clip?.title || '')}" /></label>
        <label class="field"><span>Caption (include Twitch CTA)</span><textarea name="caption" rows="4">${escapeHtml(clip?.caption || PROFILE.cta.short)}</textarea></label>
        <div class="form-row">
          <label class="field"><span>Pillar</span>
            <select name="pillarId">
              ${PILLARS.map((p) => `<option value="${p.id}" ${clip?.pillarId === p.id ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('')}
            </select>
          </label>
          <label class="field"><span>Status</span>
            <select name="status">
              ${['todo', 'editing', 'posted', 'winner', 'killed'].map((s) => `<option value="${s}" ${clip?.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </label>
        </div>
        <div class="form-row">
          <label class="field"><span>TikTok views (if posted)</span><input type="number" min="0" name="views" value="${clip?.views ?? ''}" /></label>
          <label class="field"><span>Stream date</span><input type="date" name="streamDate" value="${escapeHtml(clip?.streamDate || '')}" /></label>
        </div>
        <label class="field"><span>Editor tip</span><input name="tip" value="${escapeHtml(clip?.tip || '')}" /></label>
      </form>
    `,
    footerHtml: `
      <button type="button" class="btn ghost" data-cancel>Cancel</button>
      <button type="button" class="btn primary" data-save>Save</button>
    `,
    onMount(modal, close) {
      modal.querySelector('[data-cancel]')?.addEventListener('click', close);
      modal.querySelector('[data-save]')?.addEventListener('click', () => {
        const form = modal.querySelector('#clip-form');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        const payload = {
          title: String(fd.get('title') || '').trim(),
          caption: String(fd.get('caption') || '').trim(),
          pillarId: String(fd.get('pillarId')),
          status: String(fd.get('status')),
          views: fd.get('views') === '' ? null : Number(fd.get('views')),
          streamDate: String(fd.get('streamDate') || '') || null,
          tip: String(fd.get('tip') || ''),
          platform: 'tiktok',
          alsoPost: 'youtube'
        };
        if (isNew) Storage.addClip(payload);
        else Storage.updateClip(clip.id, payload);
        ctx.toast('Clip saved');
        close();
        ctx.refresh();
      });
    }
  });
}
