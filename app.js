import { DB } from './storage.js';
import { BIZ } from './strategy.js';
import { renderWeek } from './components/week.js';
import { renderTrain } from './components/train.js';
import { renderStrategy } from './components/strategyView.js';
import { renderScore } from './components/score.js';

const TABS = [
  { id: 'week', label: 'Week' },
  { id: 'train', label: 'Train' },
  { id: 'strategy', label: 'Strategy' },
  { id: 'score', label: 'Score' }
];

const root = document.getElementById('app');
let route = localStorage.getItem('qs.route') || 'week';
if (!TABS.some((t) => t.id === route)) route = 'week';

const ctx = {
  navigate(id) {
    route = id;
    localStorage.setItem('qs.route', id);
    paint();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  },
  refresh() {
    paint();
  }
};

function boot() {
  DB.boot();
  shell();
  paint();
}

function shell() {
  root.innerHTML = `
    <div class="app">
      <main id="main" class="main"></main>
      <nav class="tabbar" aria-label="Primary">
        ${TABS.map((t) => `
          <button type="button" class="tab" data-nav="${t.id}">
            <span class="tab-dot" aria-hidden="true"></span>
            <span>${t.label}</span>
          </button>
        `).join('')}
      </nav>
    </div>
  `;
  root.querySelectorAll('[data-nav]').forEach((b) => {
    b.addEventListener('click', () => ctx.navigate(b.dataset.nav));
  });
}

function paint() {
  if (!document.getElementById('main')) shell();
  root.querySelectorAll('[data-nav]').forEach((b) => {
    b.classList.toggle('active', b.dataset.nav === route);
  });
  document.title = `${TABS.find((t) => t.id === route)?.label || 'Ops'} · ${BIZ.name}`;
  const main = document.getElementById('main');
  main.innerHTML = '';
  const view = document.createElement('div');
  view.className = 'view';
  main.appendChild(view);
  const map = {
    week: renderWeek,
    train: renderTrain,
    strategy: renderStrategy,
    score: renderScore
  };
  (map[route] || renderWeek)(view, ctx);
}

boot();
