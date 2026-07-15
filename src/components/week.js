import { Storage } from '../storage.js';
import { PROFILE } from '../profile.js';
import { escapeHtml } from './modal.js';

export function renderWeek(root, ctx) {
  const plan = Storage.getWeekPlan();
  const checklist = Storage.getChecklist();
  const today = new Date().toISOString().slice(0, 10);

  root.innerHTML = `
    <section class="view week-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Weekly ops</p>
          <h1>This week’s strategy</h1>
          <p class="sub">${escapeHtml(plan.headline)}. Week of <strong>${escapeHtml(plan.weekOf)}</strong>
            · ${plan.siegeStreams} Siege · ${plan.varietyStreams} variety · ~${plan.clipTargetTotal} clips targeted</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn ghost" data-go="briefing">Today’s briefing</button>
        </div>
      </header>

      <div class="week-summary">
        <article><span>North star</span><strong>${escapeHtml(PROFILE.goals.northStar)}</strong></article>
        <article><span>Handles</span><strong>TT @${escapeHtml(PROFILE.handles.tiktok)} · YT @${escapeHtml(PROFILE.handles.youtube)} · Twitch ${escapeHtml(PROFILE.handles.twitch)}</strong></article>
      </div>

      <div class="week-rail">
        ${plan.days.map((d) => {
          const checks = checklist[d.date] || {};
          const done = d.actions.filter((_, i) => checks[i]).length;
          const pct = Math.round((done / d.actions.length) * 100);
          return `
            <article class="day-card mode-${d.mode} ${d.date === today ? 'is-today' : ''}">
              <header>
                <div>
                  <span class="mode-pill mode-${d.mode}">${escapeHtml(d.mode)}</span>
                  <h2>${escapeHtml(d.dayName)}</h2>
                  <p class="date-line">${escapeHtml(d.date)}</p>
                </div>
                <div class="day-meter">
                  <strong>${pct}%</strong>
                  <span>${done}/${d.actions.length}</span>
                </div>
              </header>
              <h3>${escapeHtml(d.title)}</h3>
              <p class="focus">${escapeHtml(d.focus)}</p>
              ${d.stream ? `<p class="stream-line"><strong>Live:</strong> ${escapeHtml(d.stream.game)}</p>` : ''}
              <ul class="mini-actions">
                ${d.actions.map((a) => `<li>${escapeHtml(a)}</li>`).join('')}
              </ul>
              <p class="clip-target">Clip target: <strong>${d.clipTarget}</strong></p>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;

  root.querySelector('[data-go]')?.addEventListener('click', (e) => {
    ctx.navigate(e.currentTarget.dataset.go);
  });
}
