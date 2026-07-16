import { CLIENT, FOCUS_PLAYS, dayPlan, IDEAS } from '../facts.js';
import { Storage } from '../storage.js';
import { quotaLine, recommendTag, postingStreak, delta, needsViews, weekReview } from '../analytics.js';
import { escapeHtml } from './modal.js';
import { quickLog, updateViews } from './log.js';

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
  const todayRaid = Storage.getTodayRaid();
  const pending = needsViews(posts, 5);
  const review = plan.mode === 'review' ? weekReview(posts) : null;
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
        <div class="kpi"><span>Streak</span><strong>${streak}d</strong><em>days logged</em></div>
      </div>
      <div class="quota-bar"><i style="width:${quota.pct}%"></i></div>

      ${review ? reviewBlock(review) : ''}

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

      ${plan.mode !== 'review' ? `
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
              <button type="button" class="text-btn" data-go="ideas">More</button>
            </div>
          ` : ''}
        </section>
      ` : ''}

      <section class="panel" style="margin-top:0.85rem">
        <div class="panel-head">
          <h2>Focus play</h2>
          <select id="focus-sel" class="inline-select">
            ${FOCUS_PLAYS.map((p) => `<option value="${p.id}" ${p.id === focus.id ? 'selected' : ''}>${escapeHtml(p.title)}</option>`).join('')}
          </select>
        </div>
        <ol class="steps">${focus.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
      </section>

      <section class="panel" style="margin-top:0.85rem">
        <div class="panel-head">
          <h2>Raid today</h2>
          <button type="button" class="text-btn" data-go="more">Edit list</button>
        </div>
        ${raids.length ? `
          <select id="raid-sel" class="inline-select full-select">
            <option value="">Pick channel</option>
            ${raids.map((r) => `<option value="${escapeHtml(r)}" ${todayRaid === r ? 'selected' : ''}>${escapeHtml(r)}</option>`).join('')}
          </select>
          ${todayRaid ? `<p class="why" style="margin-top:0.55rem">Raid → <a href="https://www.twitch.tv/${encodeURIComponent(todayRaid)}" target="_blank" rel="noopener">${escapeHtml(todayRaid)}</a></p>` : ''}
        ` : `<p class="why">Add raid targets in More.</p>`}
      </section>

      ${pending.length ? `
        <section class="panel" style="margin-top:0.85rem">
          <div class="panel-head"><h2>Needs views</h2><span class="faint">${pending.length}</span></div>
          <ul class="post-list compact">
            ${pending.map((p) => `
              <li>
                <div>
                  <strong>${escapeHtml(p.title)}</strong>
                  <span>${escapeHtml(p.date)} · ${escapeHtml(p.tag || p.platform)}</span>
                </div>
                <button type="button" class="btn ghost" data-views="${p.id}">Add views</button>
              </li>
            `).join('')}
          </ul>
        </section>
      ` : ''}

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

  root.querySelector('#raid-sel')?.addEventListener('change', (e) => {
    Storage.setTodayRaid(e.target.value || null);
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

  root.querySelectorAll('[data-views]').forEach((b) => {
    b.addEventListener('click', () => {
      updateViews(ctx, posts.find((p) => p.id === b.dataset.views));
    });
  });
}

function reviewBlock(r) {
  if (r.empty) {
    return `<section class="panel review-panel"><h2>Week review</h2><p class="why">No posts logged this week. Start logging or the desk can’t steer.</p></section>`;
  }
  return `
    <section class="panel review-panel">
      <h2>Week review</h2>
      <p class="fact"><strong>Next week:</strong> ${escapeHtml(r.nextWeek)}</p>
      <ul class="kv">
        <li><span>Posts</span><strong>${r.weekCount}</strong></li>
        <li><span>Missing views</span><strong>${r.missingViews}</strong></li>
        <li><span>Best tag</span><strong>${r.best ? escapeHtml(r.best.tag) : '—'}</strong></li>
        <li><span>Weak tag</span><strong>${r.worst ? escapeHtml(r.worst.tag) : '—'}</strong></li>
      </ul>
      ${r.top.length ? `
        <h3 class="mini-h">Top</h3>
        <ol class="steps">${r.top.map((p) => `<li>${escapeHtml(p.title)} — ${fmt(p.views)}</li>`).join('')}</ol>
      ` : ''}
      ${r.bottom.length && r.bottom[0]?.id !== r.top[0]?.id ? `
        <h3 class="mini-h">Bottom</h3>
        <ol class="steps">${r.bottom.map((p) => `<li>${escapeHtml(p.title)} — ${fmt(p.views)}</li>`).join('')}</ol>
      ` : ''}
    </section>
  `;
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
