import { Storage } from './storage.js';
import { CLIENT } from './facts.js';
import { renderToday } from './components/today.js';
import { renderIdeas } from './components/ideas.js';
import { renderNumbers } from './components/numbers.js';
import { renderMore } from './components/more.js';

const NAV = [
  { id: 'today', label: 'Today' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'more', label: 'More' }
];

const appRoot = document.getElementById('app');
let route = localStorage.getItem('sense.route') || 'today';
if (!NAV.some((n) => n.id === route)) route = 'today';

const ctx = {
  navigate(id) {
    route = id;
    localStorage.setItem('sense.route', id);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  refresh() {
    render();
  },
  toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    el.classList.add('show');
    clearTimeout(ctx._t);
    ctx._t = setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => { el.hidden = true; }, 180);
    }, 1800);
  }
};

function boot() {
  // migrate off legacy seed keys
  if (localStorage.getItem('sense.seeded.v2') && !localStorage.getItem('sense.v3')) {
    localStorage.removeItem('sense.seeded.v2');
  }
  Storage.ensureSeeded();
  shell();
  render();
}

function shell() {
  appRoot.innerHTML = `
    <div class="shell slim">
      <div class="atmosphere" aria-hidden="true"></div>
      <aside class="sidebar desktop-nav">
        <div class="brand">
          <div class="brand-mark">${CLIENT.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <strong>Sense Desk</strong>
            <span>${CLIENT.twitch}</span>
          </div>
        </div>
        <nav class="nav">
          ${NAV.map((n) => `
            <button type="button" class="nav-item" data-nav="${n.id}">
              <i class="nav-dot"></i>${n.label}
            </button>
          `).join('')}
        </nav>
        <div class="sidebar-foot">
          <a class="btn primary full" href="${CLIENT.twitchUrl}" target="_blank" rel="noopener">Twitch</a>
        </div>
      </aside>

      <div class="mobile-top">
        <div class="brand compact">
          <div class="brand-mark">QS</div>
          <div><strong>Sense Desk</strong><span>ACV + clips</span></div>
        </div>
      </div>

      <main class="main" id="main"></main>

      <nav class="mobile-nav four">
        ${NAV.map((n) => `
          <button type="button" class="mobile-nav-item" data-nav="${n.id}">
            <span class="mobile-nav-dot"></span>${n.label}
          </button>
        `).join('')}
      </nav>
    </div>
    <div id="toast" class="toast" hidden></div>
  `;

  appRoot.querySelectorAll('[data-nav]').forEach((b) => {
    b.addEventListener('click', () => ctx.navigate(b.dataset.nav));
  });
}

function render() {
  if (!document.getElementById('main')) shell();
  appRoot.querySelectorAll('[data-nav]').forEach((b) => {
    b.classList.toggle('active', b.dataset.nav === route);
  });
  const main = document.getElementById('main');
  const views = { today: renderToday, ideas: renderIdeas, numbers: renderNumbers, more: renderMore };
  main.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'view-root view-enter';
  main.appendChild(el);
  (views[route] || renderToday)(el, ctx);
}

boot();
