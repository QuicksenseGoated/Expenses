export function $(sel, root = document) {
  return root.querySelector(sel);
}

export function $all(sel, root = document) {
  return [...root.querySelectorAll(sel)];
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

export function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function modal({ title, body, onOk, okLabel = 'Save' }) {
  const overlay = document.createElement('div');
  overlay.className = 'sheet-overlay';
  overlay.innerHTML = `
    <div class="sheet" role="dialog">
      <header><h2>${esc(title)}</h2><button type="button" class="icon" data-x aria-label="Close">✕</button></header>
      <div class="sheet-body">${body}</div>
      <footer>
        <button type="button" class="btn" data-x>Cancel</button>
        <button type="button" class="btn primary" data-ok>${esc(okLabel)}</button>
      </footer>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));
  const close = () => {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 180);
  };
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  $all('[data-x]', overlay).forEach((b) => b.addEventListener('click', close));
  $('[data-ok]', overlay)?.addEventListener('click', () => {
    const ok = onOk?.(overlay);
    if (ok !== false) close();
  });
  return overlay;
}
