import { CLIENT, FOCUS_PLAYS, dayPlan, IDEAS } from '../facts.js';
import { Storage } from '../storage.js';
import { quotaLine, recommendTag, postingStreak, delta } from '../analytics.js';
import { escapeHtml, openModal } from './modal.js';

export function renderToday(root, ctx) {
  const plan = dayPlan();
  const checks = Storage.getChecks()[plan.iso] || {};
  const done = plan.actions.filter((_, i) => checks[i]).length;
  const focusId = Storage.getFocusPlayId();
  const focus = FOCUS_PLAYS.find((p) => p.id === focusId) || FOCUS_PLAYS[0];
  const score = Storage.getScore();
  const posts = Storage.getPosts();
  const quota = quotaLine(posts);
  const streak = postingStreak(posts);
  const tag = recommendTag(posts);
  const pick = IDEAS.filter((i) => i.tag === tag)[0];
  const raids = Storage.getRaids();
  const acvDelta = delta(score.history, 'twitchAcv');
  const ttDelta = delta(score.history, 'tiktokViewsWeek');

  root.innerHTML = `
    <section class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">${escapeHtml(CLIENT.name)}</p>
          <h1>${escapeHtml(plan.title)}</h1>
          <p class="sub">${escapeHtml(plan.iso)} · ${escapeHtml(plan.mode)}</p>
        </div>
        <button type="button" class="btn primary" data-quick-log>Log post</button>
      </header>

      <div class="kpi-row four">
        <div class="kpi"><span>ACV</span><strong>${fmt(score.twitchAcv)}</strong><em>${deltaTxt(acvDelta)}</em></div>
        <div class="kpi"><span>TT / wk</span><strong>${fmt(score.tiktokViewsWeek)}</strong><em>${deltaTxt(ttDelta)}</em></div>
        <div class="kpi"><span>Week posts</span><strong class="q-${quota.status}">${quota.weekCount}/${quota.target}</strong><em>today ${quota.todayCount}</em></div>
        <div class="kpi"><span>Streak</span><strong>${streak}d</strong><em>days with a log</em></div>
      </div>

      <div class="quota-bar"><i style="width:${quota.pct}%"></i></div>

      <section class="panel">
        <div class="panel-head"><h2>Do today</h2><span class="faint">${done}/${plan.actions.length}</span></div>
        <ul class="action-check">
          ${plan.actions.map((a, i) => `
            <li>
              <label class="${checks[i] ? 'done' : ''}">
                <input type="checkbox" data-c="${i}" ${checks[i] ? 'checked' : ''} />
                <span>${escapeHtml(a)}</span>
              </label>
            </li>
          `).join('')}
        </ul>
      </section>

      <section class="panel" style="margin-top:0.85rem">
        <div class="panel-head">
          <h2>Ship next</h2>
          <span class="tag">${escapeHtml(tag)}</span>
        </div>
        ${pick ? `
          <h3 class="ship-hook">${escapeHtml(pick.hook)}</h3>
          <p class="why">${escapeHtml(pick.why)}</p>
          <div class="row-actions" style="margin-top:0.65rem">
            <button type="button" class="btn ghost" data-copy-ship>Copy caption</button>
            <button type="button" class="btn primary" data-log-ship>Log as posted</button>
            <button type="button" class="text-btn" data-go="ideas">More ideas</button>
          </div>
        ` : ''}
      </section>

      <section class="panel" style="margin-top:0.85rem">
        <div class="panel-head">
          <h2>Focus play</h2>
          <select id="focus-sel" class="inline-select">
            ${FOCUS_PLAYS.map((p) => `<option value="${p.id}" ${p.id === focus.id ? 'selected' : ''}>${escapeHtml(p.title)}</option>`).join('')}
          </select>
        </div>
        <ol class="steps">
          ${focus.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
        </ol>
      </section>

      <section class="panel" style="margin-top:0.85rem">
        <div class="panel-head"><h2>Raid targets</h2><button type="button" class="text-btn" data-go="more">Edit</button></div>
        <p class="why">${raids.length ? raids.map((r) => escapeHtml(r)).join(' · ') : 'Add 3 similar-size Siege channels in More.'}</p>
      </section>

      <div class="quick-row">
        <a class="btn ghost" href="${CLIENT.twitchUrl}" target="_blank" rel="noopener">Twitch</a>
        <button type="button" class="btn ghost" data-go="numbers">Numbers</button>
      </div>
    </section>
  `;

  root.querySelectorAll('[data-c]').forEach((el) => {
    el.addEventListener('change', () => {
      Storage.toggleCheck(plan.iso, Number(el.dataset.c));
      ctx.refresh();
    });
  });

  root.querySelector('#focus-sel')?.addEventListener('change', (e) => {
    Storage.setFocusPlayId(e.target.value);
    ctx.refresh();
  });

  root.querySelectorAll('[data-go]').forEach((b) => {
    b.addEventListener('click', () => ctx.navigate(b.dataset.go));
  });

  root.querySelector('[data-copy-ship]')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pick.caption);
      ctx.toast('Copied');
    } catch {
      ctx.toast('Copy failed');
    }
  });

  root.querySelector('[data-log-ship]')?.addEventListener('click', () => {
    quickLog(ctx, { title: pick.hook, tag: pick.tag, ideaId: pick.id });
  });

  root.querySelector('[data-quick-log]')?.addEventListener('click', () => quickLog(ctx, {}));
}

export function quickLog(ctx, defaults = {}) {
  openModal({
    title: 'Log post',
    bodyHtml: `
      <form id="ql" class="form-stack">
        <label class="field"><span>Title</span><input name="title" required value="${escapeHtml(defaults.title || '')}" /></label>
        <div class="form-row">
          <label class="field"><span>Platform</span>
            <select name="platform">
              <option value="tiktok">tiktok</option>
              <option value="youtube">youtube</option>
            </select>
          </label>
          <label class="field"><span>Views</span><input type="number" min="0" name="views" placeholder="optional now" /></label>
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

function fmt(n) {
  if (n == null || n === '') return '—';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function deltaTxt(n) {
  if (n == null) return 'vs last snap';
  if (n === 0) return 'flat';
  return n > 0 ? `+${fmt(n)}` : `${fmt(n)}`;
}
