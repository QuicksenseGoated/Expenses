import { esc } from './ui.js';

export function brandDomain(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/** Clearbit brand logo from product website. */
export function logoUrl(url) {
  const domain = brandDomain(url);
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
}

export function faviconUrl(url) {
  const domain = brandDomain(url);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function brandBadgeHtml(brand, { lg = false, className = '' } = {}) {
  const cls = `brand-badge${lg ? ' lg' : ''}${className ? ` ${className}` : ''}`;
  const bg = brand.color || '#1e40af';
  const icon = brand.icon || '📦';
  const domain = brandDomain(brand.url);
  const logo = domain ? logoUrl(brand.url) : null;

  if (logo) {
    return `<div class="${cls}" style="background:${esc(bg)}" data-brand-domain="${esc(domain)}">
      <img class="brand-logo" src="${esc(logo)}" alt="" loading="lazy" decoding="async" />
      <span class="brand-fallback" hidden aria-hidden="true">${icon}</span>
    </div>`;
  }

  return `<div class="${cls} brand-badge--emoji" style="background:${esc(bg)}">${icon}</div>`;
}

/** Fallback chain: Clearbit → Google favicon → emoji. */
export function wireBrandBadges(root = document) {
  root.querySelectorAll('.brand-badge img.brand-logo').forEach((img) => {
    if (img.dataset.wired) return;
    img.dataset.wired = '1';
    img.addEventListener('error', () => {
      const badge = img.closest('.brand-badge');
      const domain = badge?.dataset.brandDomain;
      if (!img.dataset.fallback && domain) {
        img.dataset.fallback = 'favicon';
        img.src = faviconUrl(`https://${domain}`);
        return;
      }
      img.remove();
      const fb = badge?.querySelector('.brand-fallback');
      if (fb) {
        fb.hidden = false;
        badge?.classList.add('brand-badge--emoji');
      }
    });
  });
}
