import { computeDashboard } from '../stats.js';
import { GOALS, FUNNEL, platformById, statusById } from '../frameworks.js';
import { escapeHtml } from './modal.js';

export function renderDashboard(root, ctx) {
  const { strategy, pieces, ideas, navigate, openPiece } = ctx;
  const d = computeDashboard({ strategy, pieces, ideas });
  const goal = GOALS.find((g) => g.id === strategy.primaryGoal);

  root.innerHTML = `
    <section class="view dashboard-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Command center</p>
          <h1>${escapeHtml(strategy.brandName || 'Your')} content engine</h1>
          <p class="sub">Primary goal: <strong>${escapeHtml(goal?.label || '—')}</strong>
            ${strategy.successMetric ? `· Track <em>${escapeHtml(strategy.successMetric)}</em>` : ''}</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn ghost" data-go="ideas">Capture idea</button>
          <button type="button" class="btn primary" data-go="briefs">New brief</button>
        </div>
      </header>

      <div class="dash-metrics">
        <article class="metric">
          <span>This month</span>
          <strong>${d.publishedThisMonth}<small> / ${d.monthlyTarget || '—'}</small></strong>
          <p>Published vs cadence target</p>
        </article>
        <article class="metric">
          <span>Pipeline</span>
          <strong>${d.byStatus.drafting + d.byStatus.ready}</strong>
          <p>In drafting or ready</p>
        </article>
        <article class="metric">
          <span>Due in 7 days</span>
          <strong class="${d.overdue.length ? 'warn' : ''}">${d.upcoming.length}</strong>
          <p>${d.overdue.length ? `${d.overdue.length} overdue` : 'On schedule'}</p>
        </article>
        <article class="metric">
          <span>Setup health</span>
          <strong>${d.setupHealth.score}%</strong>
          <p>${d.setupHealth.ready ? 'Strategy complete' : 'Finish Strategy setup'}</p>
        </article>
      </div>

      <div class="dash-grid">
        <section class="panel">
          <div class="panel-head">
            <h2>Next up</h2>
            <button type="button" class="text-btn" data-go="calendar">Calendar →</button>
          </div>
          ${d.overdue.length ? `
            <div class="alert">
              <strong>${d.overdue.length} overdue</strong>
              <span>Reschedule or ship — missed dates kill compounding.</span>
            </div>
          ` : ''}
          <ul class="piece-list">
            ${[...d.overdue, ...d.upcoming].slice(0, 6).map((p) => listItem(p, strategy)).join('') || empty('Nothing scheduled this week. Plan from Ideas or Briefs.')}
          </ul>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Funnel mix</h2>
            <button type="button" class="text-btn" data-go="pipeline">Pipeline →</button>
          </div>
          <div class="funnel-bars">
            ${FUNNEL.map((f) => `
              <div class="funnel-bar">
                <div class="funnel-meta">
                  <span>${f.label}</span>
                  <span>${d.funnel.percents[f.id]}% <small>target ${d.funnel.target[f.id]}%</small></span>
                </div>
                <div class="track"><i style="width:${d.funnel.percents[f.id]}%; background:${f.color}"></i></div>
              </div>
            `).join('')}
          </div>
          <ul class="tip-list">
            ${d.funnel.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
          </ul>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Briefs needing work</h2>
            <button type="button" class="text-btn" data-go="briefs">All briefs →</button>
          </div>
          <ul class="piece-list">
            ${d.needsBriefWork.map((p) => `
              <li>
                <button type="button" class="piece-row" data-piece="${p.id}">
                  <div>
                    <strong>${escapeHtml(p.title || 'Untitled')}</strong>
                    <span>${escapeHtml(statusById(p.status)?.label || '')} · readiness ${p.score}%</span>
                  </div>
                  <div class="mini-meter"><i style="width:${p.score}%"></i></div>
                </button>
              </li>
            `).join('') || empty('All active briefs look solid. Nice.')}
          </ul>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Results logged</h2>
            <button type="button" class="text-btn" data-go="results">Results →</button>
          </div>
          <div class="result-tiles">
            <div><span>Views</span><strong>${fmt(d.totals.views)}</strong></div>
            <div><span>Clicks</span><strong>${fmt(d.totals.clicks)}</strong></div>
            <div><span>Leads</span><strong>${fmt(d.totals.leads)}</strong></div>
            <div><span>Conv.</span><strong>${fmt(d.totals.conversions)}</strong></div>
          </div>
          <p class="panel-note">${escapeHtml(d.pillars.tip)}</p>
          ${!d.setupHealth.ready ? `
            <div class="alert soft">
              <strong>Finish setup for better guidance</strong>
              <span>${d.setupHealth.checks.filter((c) => !c.ok).map((c) => c.label).join(' · ')}</span>
              <button type="button" class="text-btn" data-go="strategy">Open Strategy →</button>
            </div>
          ` : ''}
        </section>
      </div>
    </section>
  `;

  root.querySelectorAll('[data-go]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.go));
  });
  root.querySelectorAll('[data-piece]').forEach((btn) => {
    btn.addEventListener('click', () => openPiece(btn.dataset.piece));
  });
}

function listItem(p, strategy) {
  const pillar = (strategy.pillars || []).find((x) => x.id === p.pillarId);
  const overdue = p.publishDate && new Date(p.publishDate) < new Date(new Date().toDateString());
  return `
    <li>
      <button type="button" class="piece-row" data-piece="${p.id}">
        <div>
          <strong>${escapeHtml(p.title || 'Untitled')}</strong>
          <span>${escapeHtml(p.publishDate || 'No date')} · ${escapeHtml(platformById(p.platform)?.label || p.platform)}
            ${pillar ? ` · ${escapeHtml(pillar.name)}` : ''}
            ${overdue ? ' · <b class="warn-text">Overdue</b>' : ''}
          </span>
        </div>
        <span class="status-pill status-${p.status}">${escapeHtml(statusById(p.status)?.label || p.status)}</span>
      </button>
    </li>
  `;
}

function empty(msg) {
  return `<li class="empty-inline">${escapeHtml(msg)}</li>`;
}

function fmt(n) {
  if (!n) return '0';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
