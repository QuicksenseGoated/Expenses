import { CLIENT, FOCUS_PLAYS, dayPlan, FORMATS, formatById } from '../facts.js';
import { Storage } from '../storage.js';
import {
  quotaLine, postingStreak, delta, needsViews, weekReview, recommendFormatTag
} from '../analytics.js';
import { escapeHtml, openModal } from './modal.js';
import { quickLog, updateViews } from './log.js';

export function renderToday(root, ctx) {
  const plan = dayPlan();
  const checks = Storage.getChecks()[plan.iso] || {};
  const done = plan.actions.filter((_, i) => checks[i]).length;
  const focusId = Storage.getFocusPlayId();
  const focus = FOCUS_PLAYS.find((p) => p.id === focusId) || FOCUS_PLAYS[0];
  const score = Storage.getScore();
  const posts = Storage.getPosts();
  const runs = Storage.getFormatRuns();
  const quota = quotaLine(posts);
  const streak = postingStreak(posts);
  const raids = Storage.getRaids();
  const todayRaid = Storage.getTodayRaid();
  const pending = needsViews(posts, 5);
  const review = plan.mode === 'review' ? weekReview(posts) : null;
  const acvDelta = delta(score.history, 'twitchAcv');
  const ttDelta = delta(score.history, 'tiktokViewsWeek');

  const tonightId = Storage.getTonightFormat();
  const tag = recommendFormatTag(runs, plan.mode);
  const custom = Storage.getCustomFormats();
  const pool = [...custom, ...FORMATS];
  let format = (tonightId && (formatById(tonightId) || custom.find((f) => f.id === tonightId))) || null;
  if (!format) format = pool.find((f) => f.tag === tag) || pool[0];

  root.innerHTML = `
    <section class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">${escapeHtml(CLIENT.name)}</p>
          <h1>${escapeHtml(plan.title)}</h1>
          <p class="sub">${escapeHtml(plan.iso)} · ${escapeHtml(plan.mode)} · shorts via Streamladder</p>
        </div>
        <button type="button" class="btn ghost" data-quick-log>Log TT post</button>
      </header>

      <div class="kpi-row four">
        <div class="kpi"><span>ACV</span><strong>${fmt(score.twitchAcv)}</strong><em>${deltaTxt(acvDelta)}</em></div>
        <div class="kpi"><span>TT / wk</span><strong>${fmt(score.tiktokViewsWeek)}</strong><em>${deltaTxt(ttDelta)}</em></div>
        <div class="kpi"><span>Ladder posts</span><strong class="q-${quota.status}">${quota.weekCount}/${quota.target}</strong><em>logged</em></div>
        <div class="kpi"><span>Formats ran</span><strong>${runs.filter((r) => r.date >= weekStart()).length}</strong><em>this week</em></div>
      </div>
      <div class="quota-bar"><i style="width:${quota.pct}%"></i></div>

      ${review ? reviewBlock(review) : ''}

      ${plan.mode !== 'review' && format ? `
        <section class="panel format-tonight">
          <div class="panel-head">
            <h2>Tonight’s format</h2>
            <span class="tag">${escapeHtml(format.tag)}</span>
          </div>
          <h3 class="ship-hook">${escapeHtml(format.title)}</h3>
          <p class="why">${escapeHtml(format.pitch)}</p>
          <p class="use"><strong>Title:</strong> ${escapeHtml(format.titleExample || format.title)}</p>
          <ol class="steps tight">${(format.run || []).slice(0, 4).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
          <div class="row-actions" style="margin-top:0.65rem">
            <button type="button" class="btn primary" data-ran>Ran it</button>
            <button type="button" class="btn ghost" data-copy-title>Copy title</button>
            <button type="button" class="text-btn" data-go="ideas">All formats</button>
          </div>
        </section>
      ` : ''}

      <section class="panel" style="margin-top:0.85rem">
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
          <div class="panel-head"><h2>Ladder posts need views</h2></div>
          <ul class="post-list compact">
            ${pending.map((p) => `
              <li>
                <div><strong>${escapeHtml(p.title)}</strong><span>${escapeHtml(p.date)}</span></div>
                <button type="button" class="btn ghost" data-views="${p.id}">Add</button>
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

  root.querySelector('[data-copy-title]')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(format.titleExample || format.title);
      ctx.toast('Title copied');
    } catch {
      ctx.toast('Copy failed');
    }
  });

  root.querySelector('[data-ran]')?.addEventListener('click', () => {
    openModal({
      title: `Ran: ${format.title}`,
      bodyHtml: `
        <form id="fr" class="form-stack">
          <label class="field"><span>ACV</span><input type="number" min="0" name="acv" value="${score.twitchAcv ?? ''}" /></label>
          <label class="field"><span>Note</span><input name="note" placeholder="repeat / meh / banger" /></label>
        </form>
      `,
      footerHtml: `<button type="button" class="btn ghost" data-x>Cancel</button><button type="button" class="btn primary" data-s>Save</button>`,
      onMount(modal, close) {
        modal.querySelector('[data-x]')?.addEventListener('click', close);
        modal.querySelector('[data-s]')?.addEventListener('click', () => {
          const fd = new FormData(modal.querySelector('#fr'));
          Storage.addFormatRun({
            formatId: format.id,
            title: format.title,
            tag: format.tag,
            acv: fd.get('acv') === '' ? null : Number(fd.get('acv')),
            note: String(fd.get('note') || '').trim()
          });
          ctx.toast('Format logged');
          close();
          ctx.refresh();
        });
      }
    });
  });

  root.querySelector('[data-quick-log]')?.addEventListener('click', () => quickLog(ctx, {}));

  root.querySelectorAll('[data-views]').forEach((b) => {
    b.addEventListener('click', () => updateViews(ctx, posts.find((p) => p.id === b.dataset.views)));
  });
}

function weekStart() {
  const x = new Date();
  x.setHours(12, 0, 0, 0);
  const day = x.getDay();
  x.setDate(x.getDate() + (day === 0 ? -6 : 1 - day));
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}

function reviewBlock(r) {
  if (r.empty) {
    return `<section class="panel review-panel"><h2>Week review</h2><p class="why">No Ladder posts logged. Still mark formats you ran.</p></section>`;
  }
  return `
    <section class="panel review-panel">
      <h2>Week review</h2>
      <p class="fact"><strong>Next:</strong> ${escapeHtml(r.nextWeek)}</p>
      <ul class="kv">
        <li><span>Ladder posts</span><strong>${r.weekCount}</strong></li>
        <li><span>Missing views</span><strong>${r.missingViews}</strong></li>
      </ul>
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
