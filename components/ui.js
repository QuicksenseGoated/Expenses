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
  const sign = v < 0 ? '-' : '';
  return `${sign}${currency}${Math.abs(v).toFixed(2)}`;
}

export function niceDate(iso) {
  if (!iso) return '—';
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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
  toast._t = setTimeout(() => el.classList.remove('show'), 1600);
}

export function brandHead(sub) {
  return `
    <header class="brand-head">
      <img class="brand-logo" src="./icons/logo.png" width="48" height="48" alt="Financer" />
      <div class="brand-text">
        <p class="brand">Financer</p>
        <p class="brand-sub">${esc(sub)}</p>
      </div>
    </header>
  `;
}
