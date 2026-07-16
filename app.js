import { Store } from './store.js';
import { renderHome, openSpendSheet, openIncomeSheet } from './components/home.js';
import { renderBills, renderCatalog, renderSubDetail } from './components/bills.js';
import { renderActivity } from './components/activity.js';
import { renderPlan } from './components/plan.js';
import { renderProfile } from './components/profile.js';

const TABS = [
  { id: 'home', label: 'Home', icon: '◉' },
  { id: 'bills', label: 'Bills', icon: '▣' },
  { id: 'activity', label: 'Activity', icon: '↕' },
  { id: 'plan', label: 'Plan', icon: '◎' },
  { id: 'profile', label: 'You', icon: '◌' }
];

const root = document.getElementById('app');
let route = localStorage.getItem('financer.route') || 'home';
if (!TABS.some((t) => t.id === route)) route = 'home';

let overlay = null;
let stack = [];

const ctx = {
  navigate(id) {
    route = id;
    localStorage.setItem('financer.route', id);
    overlay = null;
    stack = [];
    paint();
    window.scrollTo(0, 0);
  },
  openCatalog(id) {
    stack.push({ route, overlay });
    overlay = { type: 'catalog', id };
    paint();
    window.scrollTo(0, 0);
  },
  openSub(id) {
    stack.push({ route, overlay });
    overlay = { type: 'sub', id };
    paint();
    window.scrollTo(0, 0);
  },
  openSpend() {
    openSpendSheet(ctx);
  },
  openIncome() {
    openIncomeSheet(ctx);
  },
  back() {
    const prev = stack.pop();
    if (prev) {
      route = prev.route;
      overlay = prev.overlay;
    } else {
      overlay = null;
    }
    paint();
    window.scrollTo(0, 0);
  },
  refresh() {
    paint();
  }
};

function boot() {
  Store.get();
  shell();
  paint();
}

function shell() {
  root.innerHTML = `
    <div class="phone">
      <main id="main" class="main"></main>
      <button type="button" class="fab" id="fab" aria-label="Log spend">+</button>
      <nav class="tabbar" aria-label="Primary">
        ${TABS.map((t) => `
          <button type="button" class="tab" data-nav="${t.id}">
            <span class="tab-glyph" aria-hidden="true">${t.icon}</span>
            <span>${t.label}</span>
          </button>
        `).join('')}
      </nav>
    </div>
  `;
  root.querySelectorAll('[data-nav]').forEach((b) => {
    b.addEventListener('click', () => ctx.navigate(b.dataset.nav));
  });
  document.getElementById('fab')?.addEventListener('click', () => ctx.openSpend());
}

function paint() {
  if (!document.getElementById('main')) shell();
  const onOverlay = !!overlay;
  root.querySelectorAll('[data-nav]').forEach((b) => {
    b.classList.toggle('active', !onOverlay && b.dataset.nav === route);
  });
  root.querySelector('.tabbar')?.classList.toggle('hidden', onOverlay);
  root.querySelector('.fab')?.classList.toggle('hidden', onOverlay);

  document.title = `${TABS.find((t) => t.id === route)?.label || 'Financer'} · Financer`;

  const main = document.getElementById('main');
  main.innerHTML = '';
  const view = document.createElement('div');
  view.className = 'view';
  main.appendChild(view);

  if (overlay?.type === 'catalog') {
    renderCatalog(view, ctx, overlay.id);
    return;
  }
  if (overlay?.type === 'sub') {
    renderSubDetail(view, ctx, overlay.id);
    return;
  }

  const map = {
    home: renderHome,
    bills: renderBills,
    activity: renderActivity,
    plan: renderPlan,
    profile: renderProfile
  };
  (map[route] || renderHome)(view, ctx);
}

boot();
