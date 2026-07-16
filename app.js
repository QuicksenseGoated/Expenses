import { Storage } from './storage.js';
import { PROFILE } from './profile.js';
import { renderBriefing } from './components/briefing.js';
import { renderWeek } from './components/week.js';
import { renderClips } from './components/clips.js';
import { renderPlays } from './components/plays.js';
import { renderScoreboard } from './components/scoreboard.js';
import { renderPlaybook } from './components/playbook.js';
import { renderSettings } from './components/settings.js';

const NAV = [
  { id: 'briefing', label: 'Brief', short: 'Brief' },
  { id: 'week', label: 'This Week', short: 'Week' },
  { id: 'clips', label: 'Clip Factory', short: 'Clips' },
  { id: 'plays', label: 'Growth Plays', short: 'Plays' },
  { id: 'scoreboard', label: 'Scoreboard', short: 'Stats' },
  { id: 'playbook', label: 'Playbook', short: 'Book' },
  { id: 'settings', label: 'Settings', short: 'More' }
];

const MOBILE_PRIMARY = ['briefing', 'week', 'clips', 'plays', 'scoreboard'];

const appRoot = document.getElementById('app');
let route = localStorage.getItem('sense.route') || 'briefing';

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
  toast(message) {
    showToast(message);
  }
};

function boot() {
  Storage.ensureSeeded();
  renderShell();
  render();
}

function renderShell() {
  appRoot.innerHTML = `
    <div class="shell">
      <div class="atmosphere" aria-hidden="true"></div>
      <aside class="sidebar desktop-nav">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true">${PROFILE.brandMark}</div>
          <div>
            <strong>Sense Desk</strong>
            <span>${PROFILE.displayName} · social manager</span>
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
          <p>Twitch is the product</p>
          <a class="btn primary full" href="${PROFILE.urls.twitch}" target="_blank" rel="noopener">Open Twitch</a>
        </div>
      </aside>

      <div class="mobile-top">
        <div class="brand compact">
          <div class="brand-mark" aria-hidden="true">${PROFILE.brandMark}</div>
          <div>
            <strong>Sense Desk</strong>
            <span>Manager</span>
          </div>
        </div>
        <button type="button" class="icon-btn mobile-more" data-nav="settings" aria-label="Settings">⋯</button>
      </div>

      <main class="main" id="main"></main>

      <nav class="mobile-nav" aria-label="Primary">
        ${NAV.filter((n) => MOBILE_PRIMARY.includes(n.id)).map((item) => `
          <button type="button" class="mobile-nav-item" data-nav="${item.id}">
            <span class="mobile-nav-dot"></span>
            ${item.short}
          </button>
        `).join('')}
      </nav>
    </div>
    <div id="toast" class="toast" hidden></div>
    <div id="install-bar" class="install-bar" hidden>
      <span>Add Sense Desk to your home screen</span>
      <button type="button" class="btn primary" id="install-btn">Install</button>
      <button type="button" class="icon-btn" id="install-dismiss" aria-label="Dismiss">✕</button>
    </div>
  `;

  appRoot.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => ctx.navigate(btn.dataset.nav));
  });

  setupInstallPrompt();
}

function render() {
  if (!document.getElementById('main')) renderShell();
  const main = document.getElementById('main');
  appRoot.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.nav === route);
  });

  const views = {
    briefing: renderBriefing,
    week: renderWeek,
    clips: renderClips,
    plays: renderPlays,
    scoreboard: renderScoreboard,
    playbook: renderPlaybook,
    settings: renderSettings
  };

  main.innerHTML = '';
  const view = document.createElement('div');
  view.className = 'view-root view-enter';
  main.appendChild(view);
  (views[route] || renderBriefing)(view, ctx);
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

let deferredPrompt = null;

function setupInstallPrompt() {
  const bar = document.getElementById('install-bar');
  const btn = document.getElementById('install-btn');
  const dismiss = document.getElementById('install-dismiss');
  if (!bar) return;

  if (localStorage.getItem('sense.installDismissed') === '1') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    bar.hidden = false;
  });

  // iOS hint (no beforeinstallprompt)
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || navigator.standalone === true;
  if (isIos && !isStandalone && !localStorage.getItem('sense.installDismissed')) {
    bar.hidden = false;
    bar.querySelector('span').textContent = 'iPhone: Share → Add to Home Screen';
    btn.hidden = true;
  }

  btn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    bar.hidden = true;
  });

  dismiss?.addEventListener('click', () => {
    localStorage.setItem('sense.installDismissed', '1');
    bar.hidden = true;
  });
}

boot();
