export function openModal({ title, bodyHtml, footerHtml = '', onMount, wide = false }) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'app-modal';
  overlay.innerHTML = `
    <div class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true" aria-label="${escapeAttr(title)}">
      <header class="modal-header">
        <h2>${escapeHtml(title)}</h2>
        <button type="button" class="icon-btn" data-close aria-label="Close">✕</button>
      </header>
      <div class="modal-body">${bodyHtml}</div>
      ${footerHtml ? `<footer class="modal-footer">${footerHtml}</footer>` : ''}
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => closeModal();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  overlay.querySelector('[data-close]')?.addEventListener('click', close);
  document.addEventListener('keydown', escHandler);

  function escHandler(e) {
    if (e.key === 'Escape') close();
  }
  overlay._escHandler = escHandler;

  if (onMount) onMount(overlay.querySelector('.modal'), close);
  requestAnimationFrame(() => overlay.classList.add('open'));
  return overlay;
}

export function closeModal() {
  const el = document.getElementById('app-modal');
  if (!el) return;
  if (el._escHandler) document.removeEventListener('keydown', el._escHandler);
  el.classList.remove('open');
  setTimeout(() => el.remove(), 160);
}

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function escapeAttr(str = '') {
  return escapeHtml(str).replace(/'/g, '&#39;');
}
