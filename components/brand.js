import { esc } from './ui.js';

export function brandDomain(url) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/** Primary — reliable for all catalog domains. */
export function logoUrl(url) {
  const domain = brandDomain(url);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function clearbitUrl(url) {
  const domain = brandDomain(url);
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
}

export function duckUrl(url) {
  const domain = brandDomain(url);
  if (!domain) return null;
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

export function brandBadgeHtml(brand, { lg = false, className = '' } = {}) {
  const cls = `brand-badge${lg ? ' lg' : ''}${className ? ` ${className}` : ''}`;
  const bg = brand.color || '#1e40af';
  const icon = brand.icon || '📦';
  const domain = brandDomain(brand.url);
  const logo = domain ? logoUrl(brand.url) : null;

  if (logo) {
    return `<div class="${cls}" style="background:${esc(bg)}" data-brand-domain="${esc(domain)}">
      <img class="brand-logo" src="${esc(logo)}" alt="" decoding="async" referrerpolicy="no-referrer" />
      <span class="brand-fallback" hidden aria-hidden="true">${icon}</span>
    </div>`;
  }

  return `<div class="${cls} brand-badge--emoji" style="background:${esc(bg)}">${icon}</div>`;
}

/** Fallback: Google favicon → Clearbit → DuckDuckGo → emoji. */
export function wireBrandBadges(root = document) {
  root.querySelectorAll('.brand-badge img.brand-logo').forEach((img) => {
    if (img.dataset.wired) return;
    img.dataset.wired = '1';

    img.addEventListener('error', () => {
      const badge = img.closest('.brand-badge');
      const domain = badge?.dataset.brandDomain;
      if (!domain) return showEmojiFallback(badge, img);

      const step = img.dataset.fallback || '0';
      if (step === '0') {
        img.dataset.fallback = 'clearbit';
        img.src = clearbitUrl(`https://${domain}`);
        return;
      }
      if (step === 'clearbit') {
        img.dataset.fallback = 'duck';
        img.src = duckUrl(`https://${domain}`);
        return;
      }
      showEmojiFallback(badge, img);
    });
  });
}

function showEmojiFallback(badge, img) {
  img.remove();
  const fb = badge?.querySelector('.brand-fallback');
  if (fb) {
    fb.hidden = false;
    badge?.classList.add('brand-badge--emoji');
  }
}
