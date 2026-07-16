import { APP } from './data.js';
import { renderHome } from './components/home.js';
import { renderSubs } from './components/subs.js';
import { renderInsights } from './components/insights.js';
import { renderMore } from './components/more.js';
import { renderDetail } from './components/detail.js';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'subs', label: 'Subs' },
  { id: 'insights', label: 'Insights' },
  { id: 'more', label: 'More' }
];

const root = document.getElementById('app');
let route = 'home';
let detailId = null;
let stack = [];

const ctx = {
  navigate(id) {
    route = id;
    detailId = null;
    stack = [];
    paint();
    window.scrollTo(0, 0);
  },
  openSub(id) {
    stack.push(route);
    detailId = id;
    paint();
    window.scrollTo(0, 0);
  },
  back() {
    detailId = null;
    route = stack.pop() || 'subs';
    paint();
    window.scrollTo(0, 0);
  }
};

function boot() {
  shell();
  paint();
}

function shell() {
  root.innerHTML = `
    <div class="phone">
      <main id="main" class="main"></main>
      <nav class="tabbar" aria-label="Primary">
        ${TABS.map((t) => `
          <button type="button" class="tab" data-nav="${t.id}">
            <span class="tab-ico" aria-hidden="true"></span>
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

  const onDetail = !!detailId;
  root.querySelectorAll('[data-nav]').forEach((b) => {
    b.classList.toggle('active', !onDetail && b.dataset.nav === route);
  });
  root.querySelector('.tabbar')?.classList.toggle('hidden', onDetail);

  document.title = onDetail
    ? `Subscription · ${APP.name}`
    : `${TABS.find((t) => t.id === route)?.label || APP.name} · ${APP.name}`;

  const main = document.getElementById('main');
  main.innerHTML = '';
  const view = document.createElement('div');
  view.className = 'view';
  main.appendChild(view);

  if (onDetail) {
    renderDetail(view, ctx, detailId);
    return;
  }

  const map = {
    home: renderHome,
    subs: renderSubs,
    insights: renderInsights,
    more: renderMore
  };
  (map[route] || renderHome)(view, ctx);
}

boot();
