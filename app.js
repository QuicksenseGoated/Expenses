import { Store } from './store.js';
import { renderHome, openSpendSheet, openIncomeSheet } from './components/home.js';
import { renderBills, renderCatalog, renderSubDetail } from './components/bills.js';
import { syncOverviewFab } from './components/sub-overview.js';
import { renderActivity } from './components/activity.js';
import { renderCalendar } from './components/calendar.js';
import { renderProfile } from './components/profile.js';
import { initInstallPrompt } from './components/install.js';
import { maybeOnboarding } from './components/onboarding.js';
import { checkReminders, registerBackgroundSync } from './components/notifications.js';
import { TAB_ICONS } from './components/tab-icons.js';
import { applyTheme } from './components/ui.js';

const TABS = [
  { id: 'home', label: 'Home', icon: TAB_ICONS.home },
  { id: 'bills', label: 'Bills', icon: TAB_ICONS.bills },
  { id: 'spend', label: 'Spend', center: true },
  { id: 'calendar', label: 'Calendar', icon: TAB_ICONS.calendar },
  { id: 'activity', label: 'Activity', icon: TAB_ICONS.activity },
];

const root = document.getElementById('app');
let route = localStorage.getItem('financer.route') || 'home';
if (route === 'plan') route = 'calendar';
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
  try {
    const s = Store.get();
    applyTheme(s.settings?.theme || 'light');
    shell();
    paint();
    initInstallPrompt();
    maybeOnboarding(ctx);
    checkReminders();
    if (s.settings?.notifications) registerBackgroundSync();
    setInterval(checkReminders, 60 * 60 * 1000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkReminders();
    });
    navigator.serviceWorker?.addEventListener('message', (e) => {
      if (e.data?.type === 'CHECK_REMINDERS') checkReminders();
    });
  } catch (err) {
    showBootError(err);
  }
}

function showBootError(err) {
  console.error(err);
  const msg = err?.message || String(err);
  root.innerHTML = `
    <div class="boot-error">
      <h1>Financer couldn't start</h1>
      <p>${msg.replace(/</g, '&lt;')}</p>
      <p class="boot-error-hint">If you just updated, your phone may be using an old cached copy. Try the button below.</p>
      <button type="button" class="btn primary" id="boot-recover">Clear cache &amp; reload</button>
    </div>
  `;
  document.getElementById('boot-recover')?.addEventListener('click', async () => {
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
    } catch { /* ignore */ }
    location.reload();
  });
}

function shell() {
  root.innerHTML = `
    <div class="phone">
      <main id="main" class="main"></main>
      <nav class="tabbar" aria-label="Primary">
        ${TABS.map((t) => t.center ? `
          <button type="button" class="tab tab-spend" id="tab-spend" aria-label="Log spend">
            <span class="tab-spend-ring" aria-hidden="true">+</span>
          </button>
        ` : `
          <button type="button" class="tab" data-nav="${t.id}">
            <span class="tab-glyph">${t.icon}</span>
            <span class="tab-label">${t.label}</span>
          </button>
        `).join('')}
      </nav>
    </div>
  `;
  root.querySelectorAll('[data-nav]').forEach((b) => {
    b.addEventListener('click', () => ctx.navigate(b.dataset.nav));
  });
  document.getElementById('tab-spend')?.addEventListener('click', () => ctx.openSpend());
}

function paint() {
  if (!document.getElementById('main')) shell();
  const onOverlay = !!overlay;
  root.querySelectorAll('[data-nav]').forEach((b) => {
    b.classList.toggle('active', !onOverlay && b.dataset.nav === route);
  });
  root.querySelector('.tabbar')?.classList.toggle('hidden', onOverlay);

  document.title = `${TABS.find((t) => t.id === route)?.label || 'Financer'} · Financer`;

  const main = document.getElementById('main');
  main.classList.toggle('overlay-mode', onOverlay);
  main.innerHTML = '';
  const view = document.createElement('div');
  view.className = `view${onOverlay ? ' overlay-fill' : ''}`;
  main.appendChild(view);

  if (overlay?.type === 'catalog') {
    renderCatalog(view, ctx, overlay.id);
    syncOverviewFab(ctx, route, overlay);
    return;
  }
  if (overlay?.type === 'sub') {
    renderSubDetail(view, ctx, overlay.id);
    syncOverviewFab(ctx, route, overlay);
    return;
  }

  const map = {
    home: renderHome,
    bills: renderBills,
    activity: renderActivity,
    calendar: renderCalendar,
    profile: renderProfile
  };
  (map[route] || renderHome)(view, ctx);
  syncOverviewFab(ctx, route, overlay);
}

boot();
