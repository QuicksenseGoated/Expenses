import { Storage } from '../storage.js';
import { escapeHtml, openModal } from './modal.js';

export function quickLog(ctx, defaults = {}) {
  openModal({
    title: 'Log post',
    bodyHtml: `
      <form id="ql" class="form-stack">
        <label class="field"><span>Title</span><input name="title" required value="${escapeHtml(defaults.title || '')}" /></label>
        <div class="form-row">
          <label class="field"><span>Platform</span>
            <select name="platform">
              <option value="tiktok" ${defaults.platform === 'youtube' ? '' : 'selected'}>tiktok</option>
              <option value="youtube" ${defaults.platform === 'youtube' ? 'selected' : ''}>youtube</option>
            </select>
          </label>
          <label class="field"><span>Views</span><input type="number" min="0" name="views" value="${defaults.views ?? ''}" placeholder="optional" /></label>
        </div>
        <label class="field"><span>Tag</span>
          <select name="tag">
            ${['clutch', 'fail', 'chat', 'series', 'teaser', 'variety', 'custom'].map((t) => `
              <option value="${t}" ${defaults.tag === t ? 'selected' : ''}>${t}</option>
            `).join('')}
          </select>
        </label>
      </form>
    `,
    footerHtml: `<button type="button" class="btn ghost" data-x>Cancel</button><button type="button" class="btn primary" data-s>Save</button>`,
    onMount(modal, close) {
      modal.querySelector('[data-x]')?.addEventListener('click', close);
      modal.querySelector('[data-s]')?.addEventListener('click', () => {
        const form = modal.querySelector('#ql');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        Storage.addPost({
          title: String(fd.get('title')).trim(),
          platform: String(fd.get('platform')),
          views: fd.get('views') === '' ? null : Number(fd.get('views')),
          tag: String(fd.get('tag')),
          ideaId: defaults.ideaId || null
        });
        ctx.toast('Logged');
        close();
        ctx.refresh();
      });
    }
  });
}

export function updateViews(ctx, post) {
  if (!post) return;
  openModal({
    title: 'Update views',
    bodyHtml: `
      <p class="why">${escapeHtml(post.title)}</p>
      <form id="uv" class="form-stack">
        <label class="field"><span>Views</span><input type="number" min="0" name="views" required value="${post.views ?? ''}" autofocus /></label>
        <label class="field"><span>Verdict</span>
          <select name="verdict">
            <option value="" ${!post.verdict ? 'selected' : ''}>—</option>
            <option value="repeat" ${post.verdict === 'repeat' ? 'selected' : ''}>repeat</option>
            <option value="kill" ${post.verdict === 'kill' ? 'selected' : ''}>kill</option>
          </select>
        </label>
      </form>
    `,
    footerHtml: `<button type="button" class="btn ghost" data-x>Cancel</button><button type="button" class="btn primary" data-s>Save</button>`,
    onMount(modal, close) {
      modal.querySelector('[data-x]')?.addEventListener('click', close);
      modal.querySelector('[data-s]')?.addEventListener('click', () => {
        const form = modal.querySelector('#uv');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        Storage.updatePost(post.id, {
          views: Number(fd.get('views')),
          verdict: String(fd.get('verdict') || '') || null
        });
        ctx.toast('Updated');
        close();
        ctx.refresh();
      });
    }
  });
}
