import { Storage } from '../storage.js';
import { escapeHtml, openModal } from './modal.js';

export function renderNumbers(root, ctx) {
  const s = Storage.getScore();
  const posts = Storage.getPosts();
  const top = Storage.topPosts(5);

  root.innerHTML = `
    <section class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Numbers</p>
          <h1>Scoreboard</h1>
          <p class="sub">Primary: Twitch ACV. Secondary: TikTok views/week. Log posts as text — no files.</p>
        </div>
      </header>

      <form class="panel form-stack" id="score-form">
        <div class="form-row">
          <label class="field"><span>Twitch ACV</span><input type="number" min="0" name="twitchAcv" value="${s.twitchAcv ?? ''}" /></label>
          <label class="field"><span>Twitch followers</span><input type="number" min="0" name="twitchFollowers" value="${s.twitchFollowers ?? ''}" /></label>
        </div>
        <div class="form-row">
          <label class="field"><span>TikTok views (week)</span><input type="number" min="0" name="tiktokViewsWeek" value="${s.tiktokViewsWeek ?? ''}" /></label>
          <label class="field"><span>TikTok followers</span><input type="number" min="0" name="tiktokFollowers" value="${s.tiktokFollowers ?? ''}" /></label>
        </div>
        <label class="field"><span>Snapshot note</span><input name="note" placeholder="e.g. Rank or Ruin week / dead clips" /></label>
        <button type="submit" class="btn primary">Save snapshot</button>
      </form>

      <div class="panel-head" style="margin:1.1rem 0 0.6rem">
        <h2>Post log</h2>
        <button type="button" class="btn ghost" data-add>Add post</button>
      </div>
      <p class="panel-note" style="margin-top:0">Title + platform + views. Used to see what to repeat.</p>

      ${top.length ? `
        <div class="panel" style="margin:0.75rem 0">
          <h2 style="margin:0 0 0.5rem;font-family:var(--font-display);font-size:1rem">Top by views</h2>
          <ol class="steps">
            ${top.map((p) => `<li><strong>${escapeHtml(p.title)}</strong> — ${fmt(p.views)} · ${escapeHtml(p.platform)}</li>`).join('')}
          </ol>
        </div>
      ` : ''}

      <ul class="post-list">
        ${posts.map((p) => `
          <li>
            <div>
              <strong>${escapeHtml(p.title)}</strong>
              <span>${escapeHtml(p.date)} · ${escapeHtml(p.platform)} · ${fmt(p.views)} views${p.note ? ` · ${escapeHtml(p.note)}` : ''}</span>
            </div>
            <div class="row-actions">
              <button type="button" class="text-btn" data-edit="${p.id}">Edit</button>
              <button type="button" class="text-btn" data-del="${p.id}">Del</button>
            </div>
          </li>
        `).join('') || `<li class="empty-inline">No posts logged. After you upload on TikTok, log views here.</li>`}
      </ul>
    </section>
  `;

  root.querySelector('#score-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const num = (k) => (fd.get(k) === '' || fd.get(k) == null ? null : Number(fd.get(k)));
    Storage.saveScore({
      twitchAcv: num('twitchAcv'),
      twitchFollowers: num('twitchFollowers'),
      tiktokViewsWeek: num('tiktokViewsWeek'),
      tiktokFollowers: num('tiktokFollowers')
    });
    Storage.snapshot(String(fd.get('note') || '').trim());
    ctx.toast('Saved');
    ctx.refresh();
  });

  root.querySelector('[data-add]')?.addEventListener('click', () => editPost(null, ctx));
  root.querySelectorAll('[data-edit]').forEach((b) => {
    b.addEventListener('click', () => {
      editPost(posts.find((p) => p.id === b.dataset.edit), ctx);
    });
  });
  root.querySelectorAll('[data-del]').forEach((b) => {
    b.addEventListener('click', () => {
      Storage.deletePost(b.dataset.del);
      ctx.refresh();
    });
  });
}

function editPost(post, ctx) {
  const isNew = !post;
  openModal({
    title: isNew ? 'Log post' : 'Edit post',
    bodyHtml: `
      <form id="pf" class="form-stack">
        <label class="field"><span>Title / hook used</span><input name="title" required value="${escapeHtml(post?.title || '')}" /></label>
        <div class="form-row">
          <label class="field"><span>Platform</span>
            <select name="platform">
              ${['tiktok', 'youtube', 'other'].map((p) => `<option value="${p}" ${post?.platform === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </label>
          <label class="field"><span>Views</span><input type="number" min="0" name="views" value="${post?.views ?? ''}" /></label>
        </div>
        <div class="form-row">
          <label class="field"><span>Date</span><input type="date" name="date" value="${escapeHtml(post?.date || new Date().toISOString().slice(0, 10))}" /></label>
          <label class="field"><span>Note</span><input name="note" value="${escapeHtml(post?.note || '')}" placeholder="repeat / kill" /></label>
        </div>
      </form>
    `,
    footerHtml: `<button type="button" class="btn ghost" data-x>Cancel</button><button type="button" class="btn primary" data-s>Save</button>`,
    onMount(modal, close) {
      modal.querySelector('[data-x]')?.addEventListener('click', close);
      modal.querySelector('[data-s]')?.addEventListener('click', () => {
        const form = modal.querySelector('#pf');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        const payload = {
          title: String(fd.get('title')).trim(),
          platform: String(fd.get('platform')),
          views: fd.get('views') === '' ? null : Number(fd.get('views')),
          date: String(fd.get('date')),
          note: String(fd.get('note') || '').trim()
        };
        if (isNew) Storage.addPost(payload);
        else Storage.updatePost(post.id, payload);
        ctx.toast('Logged');
        close();
        ctx.refresh();
      });
    }
  });
}

function fmt(n) {
  if (n == null || n === '') return '—';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
