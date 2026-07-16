import { briefingMemo, MANAGER_RULES } from '../playbook.js';
import { PROFILE } from '../profile.js';
import { Storage } from '../storage.js';
import { escapeHtml } from './modal.js';

export function renderBriefing(root, ctx) {
  const plan = Storage.getWeekPlan();
  const score = Storage.getScoreboard();
  const memo = briefingMemo(plan, score);
  const today = memo.today;
  const checks = Storage.getChecklist()[today.date] || {};
  const doneCount = today.actions.filter((_, i) => checks[i]).length;

  root.innerHTML = `
    <section class="view briefing-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Social manager briefing</p>
          <h1>${escapeHtml(memo.greeting)}</h1>
          <p class="sub">${escapeHtml(PROFILE.goals.northStar)}</p>
        </div>
        <div class="header-actions">
          <a class="btn ghost" href="${PROFILE.urls.twitch}" target="_blank" rel="noopener">Open Twitch</a>
          <button type="button" class="btn primary" data-go="week">Full week plan</button>
        </div>
      </header>

      <div class="manager-banner">
        <div>
          <span class="mode-pill mode-${today.mode}">${escapeHtml(today.mode)}</span>
          <h2>${escapeHtml(today.dayName)} — ${escapeHtml(today.title)}</h2>
          <p>${escapeHtml(today.focus)}</p>
        </div>
        <div class="banner-stat">
          <strong>${doneCount}/${today.actions.length}</strong>
          <span>today’s actions</span>
        </div>
      </div>

      <div class="dash-grid">
        <section class="panel">
          <div class="panel-head">
            <h2>Do this today</h2>
            <span class="faint">Tap to check off</span>
          </div>
          <ul class="action-check">
            ${today.actions.map((a, i) => `
              <li>
                <label class="${checks[i] ? 'done' : ''}">
                  <input type="checkbox" data-check="${i}" ${checks[i] ? 'checked' : ''} />
                  <span>${escapeHtml(a)}</span>
                </label>
              </li>
            `).join('')}
          </ul>
          ${today.stream ? `
            <div class="stream-block">
              <h3>On stream</h3>
              <p><strong>${escapeHtml(today.stream.game)}</strong> — ${escapeHtml(today.stream.goal)}</p>
              <ul class="tip-list">
                ${today.stream.onStream.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </section>

        <section class="panel">
          <div class="panel-head"><h2>Priorities</h2></div>
          <ol class="priority-list">
            ${memo.priorities.map((p) => `
              <li>
                <span class="rank">${p.rank}</span>
                <div>
                  <strong>${escapeHtml(p.title)}</strong>
                  <span>${escapeHtml(p.detail)}</span>
                </div>
              </li>
            `).join('')}
          </ol>

          <div class="insight-box">
            <h3>Funnel check</h3>
            <ul>
              ${memo.health.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}
            </ul>
            <button type="button" class="text-btn" data-go="scoreboard">Update scoreboard →</button>
          </div>

          <div class="watchouts">
            <h3>Manager watchouts</h3>
            <ul class="tip-list">
              ${memo.watchouts.map((w) => `<li>${escapeHtml(w)}</li>`).join('')}
            </ul>
          </div>
        </section>
      </div>

      <section class="panel rules-panel">
        <div class="panel-head">
          <h2>Non‑negotiables</h2>
          <button type="button" class="text-btn" data-go="playbook">Full playbook →</button>
        </div>
        <div class="rules-strip">
          ${MANAGER_RULES.map((r) => `<p>${escapeHtml(r)}</p>`).join('')}
        </div>
      </section>

      <div class="quick-row">
        <button type="button" class="btn ghost" data-go="clips">Clip factory</button>
        <button type="button" class="btn ghost" data-go="plays">Growth plays</button>
        <button type="button" class="btn ghost" data-generate>Generate post-stream clip list</button>
      </div>
    </section>
  `;

  root.querySelectorAll('[data-go]').forEach((btn) => {
    btn.addEventListener('click', () => ctx.navigate(btn.dataset.go));
  });

  root.querySelectorAll('[data-check]').forEach((el) => {
    el.addEventListener('change', () => {
      Storage.toggleChecklist(today.date, Number(el.dataset.check));
      ctx.refresh();
    });
  });

  root.querySelector('[data-generate]')?.addEventListener('click', () => {
    const formulas = ['clutch', 'throw', 'chat_bit', 'tilt'];
    formulas.forEach((fid, i) => {
      Storage.addClip({
        title: [
          '1vX and it got stupid',
          'I threw this in the funniest way',
          'Chat said do it. Regret.',
          'This is when the session died'
        ][i],
        caption: `${['1vX and it got stupid', 'I threw this in the funniest way', 'Chat said do it. Regret.', 'This is when the session died'][i]}\n\n${PROFILE.cta.short}`,
        formulaId: fid,
        streamDate: today.date,
        status: 'todo'
      });
    });
    ctx.toast('4 clip assignments added');
    ctx.navigate('clips');
  });
}
