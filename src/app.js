import { Storage } from './storage.js';
import { renderOnboarding } from './components/onboarding.js';
import { renderDashboard } from './components/dashboard.js';
import { renderStrategy } from './components/strategy.js';
import { renderIdeas } from './components/ideas.js';
import { renderBriefs, openBriefEditor } from './components/briefs.js';
import { renderCalendar } from './components/calendar.js';
import { renderPipeline } from './components/pipeline.js';
import { renderResults } from './components/results.js';
import { renderSettings } from './components/settings.js';

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'briefs', label: 'Briefs' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'results', label: 'Results' },
  { id: 'settings', label: 'Settings' }
];

const appRoot = document.getElementById('app');
let route = 'dashboard';

const ctx = {
  strategy: Storage.getStrategy(),
  pieces: Storage.getPieces(),
  ideas: Storage.getIdeas(),
  settings: Storage.getSettings(),
  navigate(id) {
    route = id;
    render();
  },
  refresh(full = false) {
    ctx.strategy = Storage.getStrategy();
    ctx.pieces = Storage.getPieces();
    ctx.ideas = Storage.getIdeas();
    ctx.settings = Storage.getSettings();
    if (full && !Storage.isOnboardingDone()) {
      boot();
      return;
    }
    render();
  },
  openPiece(id) {
    openBriefEditor(id, ctx);
  },
  toast(message) {
    showToast(message);
  }
};

function boot() {
  if (!Storage.isOnboardingDone()) {
    appRoot.innerHTML = '';
    renderOnboarding(appRoot, {
      onComplete: () => {
        ctx.refresh();
        route = 'dashboard';
        renderShell();
        render();
      }
    });
    return;
  }
  renderShell();
  render();
}

function renderShell() {
  const strategy = Storage.getStrategy();
  appRoot.innerHTML = `
    <div class="shell">
      <div class="atmosphere" aria-hidden="true"></div>
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true"></div>
          <div>
            <strong>Cadence</strong>
            <span>${escape(strategy.brandName || 'Content system')}</span>
          </div>
        </div>
        <nav class="nav">
          ${NAV.map((item) => `
            <button type="button" class="nav-item" data-nav="${item.id}">
              <i class="nav-dot" aria-hidden="true"></i>
              ${item.label}
            </button>
          `).join('')}
        </nav>
        <div class="sidebar-foot">
          <p>Goal-led planning</p>
          <button type="button" class="btn primary full" data-quick-brief>+ New brief</button>
        </div>
      </aside>
      <main class="main" id="main"></main>
    </div>
    <div id="toast" class="toast" hidden></div>
  `;

  appRoot.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => ctx.navigate(btn.dataset.nav));
  });
  appRoot.querySelector('[data-quick-brief]')?.addEventListener('click', () => {
    const piece = Storage.addPiece({
      title: 'Untitled brief',
      status: 'planned',
      platform: ctx.strategy.platforms?.[0] || 'blog',
      pillarId: ctx.strategy.pillars?.[0]?.id || null
    });
    ctx.refresh();
    ctx.navigate('briefs');
    ctx.openPiece(piece.id);
  });
}

function render() {
  if (!document.getElementById('main')) {
    renderShell();
  }
  const main = document.getElementById('main');
  appRoot.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.nav === route);
  });

  const brandSub = appRoot.querySelector('.brand span');
  if (brandSub) brandSub.textContent = ctx.strategy.brandName || 'Content system';

  const views = {
    dashboard: renderDashboard,
    strategy: renderStrategy,
    ideas: renderIdeas,
    briefs: renderBriefs,
    calendar: renderCalendar,
    pipeline: renderPipeline,
    results: renderResults,
    settings: renderSettings
  };

  main.innerHTML = '';
  const view = document.createElement('div');
  view.className = 'view-root';
  main.appendChild(view);
  (views[route] || renderDashboard)(view, ctx);

  // Entrance motion
  view.classList.add('view-enter');
}

function showToast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => { el.hidden = true; }, 200);
  }, 2200);
}

function escape(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

boot();
