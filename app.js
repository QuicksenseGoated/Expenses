import { Store } from './store.js';
import { renderHome } from './components/home.js';
import { renderSubs, renderCatalogDetail, renderMySubDetail } from './components/subs.js';
import { renderSpend } from './components/spend.js';
import { renderInsights } from './components/insights.js';
import { renderMore } from './components/more.js';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'subs', label: 'Subs' },
  { id: 'spend', label: 'Spend' },
  { id: 'insights', label: 'Insights' },
  { id: 'more', label: 'More' }
];

const root = document.getElementById('app');
let route = localStorage.getItem('financer.route') || 'home';
if (!TABS.some((t) => t.id === route)) route = 'home';

let overlay = null; // { type: 'catalog'|'mysub', id }
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
  openMySub(id) {
    stack.push({ route, overlay });
    overlay = { type: 'mysub', id };
    paint();
    window.scrollTo(0, 0);
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
  const onOverlay = !!overlay;
  root.querySelectorAll('[data-nav]').forEach((b) => {
    b.classList.toggle('active', !onOverlay && b.dataset.nav === route);
  });
  root.querySelector('.tabbar')?.classList.toggle('hidden', onOverlay);

  document.title = onOverlay ? `Financer` : `${TABS.find((t) => t.id === route)?.label || 'Financer'} · Financer`;

  const main = document.getElementById('main');
  main.innerHTML = '';
  const view = document.createElement('div');
  view.className = 'view';
  main.appendChild(view);

  if (overlay?.type === 'catalog') {
    renderCatalogDetail(view, ctx, overlay.id);
    return;
  }
  if (overlay?.type === 'mysub') {
    renderMySubDetail(view, ctx, overlay.id);
    return;
  }

  const map = {
    home: renderHome,
    subs: renderSubs,
    spend: renderSpend,
    insights: renderInsights,
    more: renderMore
  };
  (map[route] || renderHome)(view, ctx);
}

boot();
