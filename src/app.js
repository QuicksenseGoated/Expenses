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
  { id: 'briefing', label: 'Briefing' },
  { id: 'week', label: 'This Week' },
  { id: 'clips', label: 'Clip Factory' },
  { id: 'plays', label: 'Growth Plays' },
  { id: 'scoreboard', label: 'Scoreboard' },
  { id: 'playbook', label: 'Playbook' },
  { id: 'settings', label: 'Settings' }
];

const appRoot = document.getElementById('app');
let route = 'briefing';

const ctx = {
  navigate(id) {
    route = id;
    render();
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
      <aside class="sidebar">
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
          <a class="btn primary full" href="${PROFILE.urls.twitch}" target="_blank" rel="noopener">Go live mindset →</a>
        </div>
      </aside>
      <main class="main" id="main"></main>
    </div>
    <div id="toast" class="toast" hidden></div>
  `;

  appRoot.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => ctx.navigate(btn.dataset.nav));
  });
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

boot();
