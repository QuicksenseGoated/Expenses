import { Storage } from '../storage.js';
import { quotaLine, tagStats, delta, WEEKLY_CLIP_TARGET } from '../analytics.js';
import { escapeHtml, openModal } from './modal.js';
import { quickLog } from './today.js';

export function renderNumbers(root, ctx) {
  const s = Storage.getScore();
  const posts = Storage.getPosts();
  const top = Storage.topPosts(5);
  const quota = quotaLine(posts);
  const tags = tagStats(posts).filter((t) => t.count > 0);
  const acvD = delta(s.history, 'twitchAcv');
  const ttD = delta(s.history, 'tiktokViewsWeek');
  const hist = (s.history || []).slice(0, 8);

  root.innerHTML = `
    <section class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Numbers</p>
          <h1>Scoreboard</h1>
          <p class="sub">ACV first. Week quota ${quota.weekCount}/${WEEKLY_CLIP_TARGET}.</p>
        </div>
        <button type="button" class="btn primary" data-add>Log post</button>
      </header>

      <div class="kpi-row">
        <div class="kpi"><span>ACV</span><strong>${fmt(s.twitchAcv)}</strong><em>${dTxt(acvD)}</em></div>
        <div class="kpi"><span>TT / wk</span><strong>${fmt(s.tiktokViewsWeek)}</strong><em>${dTxt(ttD)}</em></div>
        <div class="kpi"><span>Quota</span><strong class="q-${quota.status}">${quota.pct}%</strong><em>${quota.label}</em></div>
      </div>
      <div class="quota-bar"><i style="width:${quota.pct}%"></i></div>

      <form class="panel form-stack" id="score-form">
        <div class="form-row">
          <label class="field"><span>Twitch ACV</span><input type="number" min="0" name="twitchAcv" value="${s.twitchAcv ?? ''}" /></label>
          <label class="field"><span>Twitch followers</span><input type="number" min="0" name="twitchFollowers" value="${s.twitchFollowers ?? ''}" /></label>
        </div>
        <div class="form-row">
          <label class="field"><span>TikTok views (week)</span><input type="number" min="0" name="tiktokViewsWeek" value="${s.tiktokViewsWeek ?? ''}" /></label>
          <label class="field"><span>TikTok followers</span><input type="number" min="0" name="tiktokFollowers" value="${s.tiktokFollowers ?? ''}" /></label>
        </div>
        <label class="field"><span>Note</span><input name="note" placeholder="what changed" /></label>
        <button type="submit" class="btn primary">Save snapshot</button>
      </form>

      ${tags.length ? `
        <section class="panel" style="margin-top:0.85rem">
          <h2>Tag performance</h2>
          <ul class="kv">
            ${tags.map((t) => `
              <li>
                <span>${escapeHtml(t.tag)} · ${t.count} posts</span>
                <strong>${t.avg != null ? `avg ${fmt(t.avg)}` : 'no views yet'}</strong>
              </li>
            `).join('')}
          </ul>
        </section>
      ` : ''}

      ${top.length ? `
        <section class="panel" style="margin-top:0.85rem">
          <h2>Top posts</h2>
          <ol class="steps">
            ${top.map((p) => `<li><strong>${escapeHtml(p.title)}</strong> — ${fmt(p.views)} · ${escapeHtml(p.tag || p.platform)}</li>`).join('')}
          </ol>
        </section>
      ` : ''}

      <div class="panel-head" style="margin:1rem 0 0.5rem"><h2>Post log</h2></div>
      <ul class="post-list">
        ${posts.map((p) => `
          <li>
            <div>
              <strong>${escapeHtml(p.title)}</strong>
              <span>${escapeHtml(p.date)} · ${escapeHtml(p.platform)}${p.tag ? ` · ${escapeHtml(p.tag)}` : ''} · ${fmt(p.views)}${p.note ? ` · ${escapeHtml(p.note)}` : ''}</span>
            </div>
            <div class="row-actions">
              <button type="button" class="text-btn" data-edit="${p.id}">Edit</button>
              <button type="button" class="text-btn" data-del="${p.id}">Del</button>
            </div>
          </li>
        `).join('') || `<li class="empty-inline">Log after you post. Tag it so Ideas ranks from your data.</li>`}
      </ul>

      ${hist.length ? `
        <section class="panel" style="margin-top:0.85rem">
          <h2>Snapshots</h2>
          <ul class="kv">
            ${hist.map((h) => `
              <li>
                <span>${escapeHtml(h.date)}${h.note ? ` · ${escapeHtml(h.note)}` : ''}</span>
                <strong>ACV ${fmt(h.twitchAcv)} · TT ${fmt(h.tiktokViewsWeek)}</strong>
              </li>
            `).join('')}
          </ul>
        </section>
      ` : ''}
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

  root.querySelector('[data-add]')?.addEventListener('click', () => quickLog(ctx, {}));

  root.querySelectorAll('[data-edit]').forEach((b) => {
    b.addEventListener('click', () => editPost(posts.find((p) => p.id === b.dataset.edit), ctx));
  });
  root.querySelectorAll('[data-del]').forEach((b) => {
    b.addEventListener('click', () => {
      Storage.deletePost(b.dataset.del);
      ctx.refresh();
    });
  });
}

function editPost(post, ctx) {
  if (!post) return;
  openModal({
    title: 'Edit post',
    bodyHtml: `
      <form id="pf" class="form-stack">
        <label class="field"><span>Title</span><input name="title" required value="${escapeHtml(post.title || '')}" /></label>
        <div class="form-row">
          <label class="field"><span>Platform</span>
            <select name="platform">
              ${['tiktok', 'youtube', 'other'].map((p) => `<option value="${p}" ${post.platform === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </label>
          <label class="field"><span>Views</span><input type="number" min="0" name="views" value="${post.views ?? ''}" /></label>
        </div>
        <div class="form-row">
          <label class="field"><span>Date</span><input type="date" name="date" value="${escapeHtml(post.date || '')}" /></label>
          <label class="field"><span>Tag</span>
            <select name="tag">
              ${['clutch', 'fail', 'chat', 'series', 'teaser', 'variety', 'custom'].map((t) => `
                <option value="${t}" ${post.tag === t ? 'selected' : ''}>${t}</option>
              `).join('')}
            </select>
          </label>
        </div>
        <label class="field"><span>Note</span><input name="note" value="${escapeHtml(post.note || '')}" /></label>
      </form>
    `,
    footerHtml: `<button type="button" class="btn ghost" data-x>Cancel</button><button type="button" class="btn primary" data-s>Save</button>`,
    onMount(modal, close) {
      modal.querySelector('[data-x]')?.addEventListener('click', close);
      modal.querySelector('[data-s]')?.addEventListener('click', () => {
        const form = modal.querySelector('#pf');
        if (!form.reportValidity()) return;
        const fd = new FormData(form);
        Storage.updatePost(post.id, {
          title: String(fd.get('title')).trim(),
          platform: String(fd.get('platform')),
          views: fd.get('views') === '' ? null : Number(fd.get('views')),
          date: String(fd.get('date')),
          tag: String(fd.get('tag')),
          note: String(fd.get('note') || '').trim()
        });
        ctx.toast('Updated');
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

function dTxt(n) {
  if (n == null) return 'snapshot delta';
  if (n === 0) return 'flat';
  return n > 0 ? `+${fmt(n)}` : String(fmt(n));
}
