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
  return `${currency}${Number(n).toFixed(2)}`;
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

export function actionTone(action) {
  if (action === 'cancel') return 'danger';
  if (action === 'watch') return 'warn';
  return 'ok';
}
