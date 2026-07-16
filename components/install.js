/** One-time desktop PWA install prompt. */

const DISMISS_KEY = 'financer.install.dismissed';

let deferredPrompt = null;

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}

function isDesktop() {
  return window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
}

function dismiss() {
  localStorage.setItem(DISMISS_KEY, '1');
  document.getElementById('install-popup')?.remove();
}

function showPopup() {
  if (document.getElementById('install-popup')) return;
  if (localStorage.getItem(DISMISS_KEY)) return;
  if (isStandalone() || !isDesktop() || !deferredPrompt) return;

  const el = document.createElement('aside');
  el.id = 'install-popup';
  el.className = 'install-popup';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Install Financer');
  el.innerHTML = `
    <button type="button" class="install-close" aria-label="Dismiss">×</button>
    <img src="./icons/logo.png" width="72" height="72" alt="" class="install-logo" />
    <h2>Install Financer</h2>
    <p>Add Financer to your desktop for quick balance checks and bill tracking — works offline.</p>
    <div class="install-actions">
      <button type="button" class="btn primary" id="install-go">Install app</button>
      <button type="button" class="btn ghost" id="install-later">Not now</button>
    </div>
  `;
  document.body.appendChild(el);

  el.querySelector('.install-close')?.addEventListener('click', dismiss);
  el.querySelector('#install-later')?.addEventListener('click', dismiss);
  el.querySelector('#install-go')?.addEventListener('click', async () => {
    if (!deferredPrompt) return dismiss();
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    dismiss();
  });
}

export function initInstallPrompt() {
  if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(showPopup, 1200);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    dismiss();
  });
}
