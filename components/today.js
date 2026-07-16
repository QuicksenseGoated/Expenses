import { CLIENT, FOCUS_PLAYS, dayPlan } from '../facts.js';
import { Storage } from '../storage.js';
import { escapeHtml } from './modal.js';

export function renderToday(root, ctx) {
  const plan = dayPlan();
  const checks = Storage.getChecks()[plan.iso] || {};
  const done = plan.actions.filter((_, i) => checks[i]).length;
  const focusId = Storage.getFocusPlayId();
  const focus = FOCUS_PLAYS.find((p) => p.id === focusId) || FOCUS_PLAYS[0];
  const score = Storage.getScore();

  root.innerHTML = `
    <section class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">${escapeHtml(CLIENT.name)} desk</p>
          <h1>${escapeHtml(plan.title)}</h1>
          <p class="sub">${escapeHtml(plan.iso)} · ${escapeHtml(plan.mode)} · KPI: Twitch ACV + TikTok views</p>
        </div>
      </header>

      <div class="kpi-row">
        <div class="kpi"><span>Twitch ACV</span><strong>${fmt(score.twitchAcv)}</strong></div>
        <div class="kpi"><span>TT views/wk</span><strong>${fmt(score.tiktokViewsWeek)}</strong></div>
        <div class="kpi"><span>Today</span><strong>${done}/${plan.actions.length}</strong></div>
      </div>

      <section class="panel">
        <div class="panel-head"><h2>Do today</h2></div>
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
        <ol class="steps">
          ${focus.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
        </ol>
      </section>

      <div class="quick-row">
        <a class="btn primary" href="${CLIENT.twitchUrl}" target="_blank" rel="noopener">Twitch</a>
        <button type="button" class="btn ghost" data-go="ideas">Ideas</button>
        <button type="button" class="btn ghost" data-go="numbers">Log numbers</button>
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
}

function fmt(n) {
  if (n == null || n === '') return '—';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
