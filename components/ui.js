export function $(sel, root = document) {
  return root.querySelector(sel);
}

export function $all(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

export function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function money(n, currency = '€') {
  if (n == null || Number.isNaN(Number(n))) return '—';
  const v = Number(n);
  const sign = v < 0 ? '−' : '';
  return `${sign}${currency}${Math.abs(v).toFixed(2)}`;
}

export function niceDate(iso) {
  if (!iso) return '—';
  return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function daysUntil(iso) {
  const t = new Date(`${iso}T12:00:00`);
  const now = new Date();
  now.setHours(12, 0, 0, 0);
  return Math.round((t - now) / 86400000);
}

export function addDaysISO(days) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function initials(name = '') {
  return name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';
}

export function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 1800);
}

export function sheet({ title, body, actions = [] }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'sheet-overlay';
    overlay.innerHTML = `
      <div class="sheet" role="dialog">
        <div class="sheet-grab" aria-hidden="true"></div>
        <header class="sheet-head"><h2>${esc(title)}</h2><button type="button" class="icon-btn" data-x aria-label="Close">✕</button></header>
        <div class="sheet-body">${body}</div>
        ${actions.length ? `<footer class="sheet-foot">${actions.map((a) => `<button type="button" class="btn ${a.primary ? 'primary' : ''}" data-act="${esc(a.id)}">${esc(a.label)}</button>`).join('')}</footer>` : ''}
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));
    const close = (payload) => {
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 200);
      resolve(payload);
    };
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(null); });
    overlay.querySelector('[data-x]')?.addEventListener('click', () => close(null));
    overlay.querySelectorAll('[data-act]').forEach((btn) => {
      btn.addEventListener('click', () => close({ action: btn.dataset.act, overlay }));
    });
  });
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
