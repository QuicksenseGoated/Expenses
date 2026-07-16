import { Store } from '../store.js';
import {
  searchProducts,
  CATEGORIES,
  PRODUCT_COUNT,
  CATALOG_SIZE,
  getProduct,
  getCatalogEntry,
  catalogKey,
  priceLabel,
  planRangeLabel,
  parseCatalogKey,
} from '../catalog.js';
import { esc, money, niceDate, daysUntil, toast, initials, addDaysISO, $ } from './ui.js';

export function renderBills(root, ctx) {
  const s = Store.get();
  const mine = s.subscriptions;
  const total = Store.subsMonthly();

  root.innerHTML = `
    <header class="page-title">
      <h1>Subscriptions</h1>
      <p>${mine.length ? `${money(total, s.currency)} / month · ${mine.length} tracked` : 'Track only what you actually pay.'}</p>
    </header>

    ${mine.length ? `
      <section class="panel flush-top">
        <div class="sub-grid">
          ${mine.map((sub) => card(sub)).join('')}
        </div>
      </section>
    ` : `
      <section class="hero-empty compact">
        <div class="hero-empty-icon">◎</div>
        <h2>Nothing tracked yet</h2>
        <p>Slide up the library — pick a product, then choose your plan.</p>
      </section>
    `}

    <section class="search-drawer" id="drawer" data-open="false">
      <button type="button" class="drawer-handle" id="drawer-handle" aria-expanded="false">
        <span class="drawer-pill" aria-hidden="true"></span>
        <span class="drawer-label">Slide up · subscription library</span>
        <span class="drawer-count">${PRODUCT_COUNT}</span>
      </button>
      <div class="drawer-body" id="drawer-body">
        <label class="search">
          <span aria-hidden="true">⌕</span>
          <input id="q" type="search" placeholder="Streamladder, Claude, Netflix…" autocomplete="off" enterkeyhint="search" />
        </label>
        <div class="chip-scroll" id="cats">
          <button type="button" class="chip on" data-cat="all">All</button>
          ${CATEGORIES.map((c) => `<button type="button" class="chip" data-cat="${esc(c.id)}">${c.icon} ${esc(c.label)}</button>`).join('')}
        </div>
        <p class="search-hint" id="hint">Swipe the row below — ${PRODUCT_COUNT} products, ${CATALOG_SIZE}+ plans inside.</p>
        <div class="product-rail-wrap">
          <div class="product-rail" id="rail"></div>
        </div>
        <div class="discover-list" id="results"></div>
      </div>
    </section>
  `;

  let category = 'all';
  let open = false;
  const drawer = $('#drawer', root);
  const handle = $('#drawer-handle', root);
  const q = $('#q', root);
  const rail = $('#rail', root);
  const results = $('#results', root);
  const hint = $('#hint', root);

  const ownedForProduct = (productId) => mine.filter((m) => {
    const { productId: pid } = parseCatalogKey(m.catalogId);
    return pid === productId;
  });

  const filterProducts = () => {
    const query = q.value.trim();
    let rows = searchProducts(query, { minChars: 0 });
    if (category !== 'all') rows = rows.filter((p) => p.category === category);
    return rows;
  };

  const paintRail = () => {
    const rows = filterProducts();
    const query = q.value.trim();

    if (query.length >= 2) {
      rail.innerHTML = '';
      rail.parentElement.style.display = 'none';
      results.innerHTML = rows.length ? rows.map((p) => productRow(p)).join('') : `<p class="empty-sm">No match for “${esc(query)}”.</p>`;
      hint.textContent = rows.length ? `${rows.length} product${rows.length === 1 ? '' : 's'} found` : 'Try another name.';
      wireProductClicks(results);
      return;
    }

    rail.parentElement.style.display = '';
    hint.textContent = `Swipe → ${rows.length} products · tap one to pick your plan`;
    results.innerHTML = '';
    rail.innerHTML = rows.map((p) => productTile(p)).join('');
    wireProductClicks(rail);
  };

  const productTile = (p) => {
    const owned = ownedForProduct(p.id);
    return `
      <button type="button" class="product-tile" data-pid="${p.id}" style="--tile-accent:${esc(p.color || '#1e40af')}">
        <span class="product-tile-icon">${p.icon}</span>
        <strong>${esc(p.name)}</strong>
        <span class="product-tile-price">${esc(planRangeLabel(p))}</span>
        <span class="product-tile-meta">${p.plans.length} plan${p.plans.length === 1 ? '' : 's'}${owned.length ? ` · ${owned.length} added` : ''}</span>
      </button>
    `;
  };

  const productRow = (p) => {
    const owned = ownedForProduct(p.id);
    return `
      <button type="button" class="discover-row" data-pid="${p.id}">
        <div class="brand-badge" style="background:${esc(p.color || '#1e40af')}">${p.icon}</div>
        <div class="discover-main">
          <strong>${esc(p.name)}</strong>
          <span>${esc(CATEGORIES.find((c) => c.id === p.category)?.label || p.category)} · ${esc(planRangeLabel(p))}</span>
        </div>
        <span class="tag ${owned.length ? 'owned' : ''}">${owned.length ? `${owned.length} added` : 'Pick plan'}</span>
      </button>
    `;
  };

  const wireProductClicks = (container) => {
    container.querySelectorAll('[data-pid]').forEach((btn) => {
      btn.addEventListener('click', () => ctx.openCatalog(btn.dataset.pid));
    });
  };

  const setOpen = (next) => {
    open = next;
    drawer.dataset.open = open ? 'true' : 'false';
    handle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      paintRail();
      setTimeout(() => q.focus(), 280);
    }
  };

  handle.addEventListener('click', () => setOpen(!open));

  let startY = 0;
  handle.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; }, { passive: true });
  handle.addEventListener('touchend', (e) => {
    const dy = startY - e.changedTouches[0].clientY;
    if (dy > 24) setOpen(true);
    if (dy < -24) setOpen(false);
  }, { passive: true });

  q.addEventListener('input', paintRail);
  root.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('[data-cat]').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      category = btn.dataset.cat;
      paintRail();
    });
  });

  root.querySelectorAll('[data-sub]').forEach((btn) => {
    btn.addEventListener('click', () => ctx.openSub(btn.dataset.sub));
  });
}

function card(sub) {
  const d = daysUntil(sub.nextBill);
  const urgent = d <= 3;
  const entry = getCatalogEntry(sub.catalogId);
  const label = entry?.displayName || sub.name;
  return `
    <button type="button" class="sub-card ${urgent ? 'urgent' : ''}" data-sub="${sub.id}">
      <div class="sub-card-top">
        <div class="brand-badge">${initials(label)}</div>
        <div>
          <strong>${esc(label)}</strong>
          <span>${esc(sub.category)}</span>
        </div>
      </div>
      <div class="sub-card-bottom">
        <div>
          <span class="tiny">Next bill</span>
          <b>${niceDate(sub.nextBill)}</b>
        </div>
        <div class="price">${money(sub.price, sub.currency)}</div>
      </div>
    </button>
  `;
}

export function renderCatalog(root, ctx, catalogId) {
  const { productId, planId } = parseCatalogKey(catalogId);
  const product = getProduct(productId);
  if (!product) return root.innerHTML = '<p class="empty-sm">Not found.</p>';

  const s = Store.get();
  const catLabel = CATEGORIES.find((c) => c.id === product.category)?.label || product.category;

  if (!planId) {
    root.innerHTML = `
      <header class="detail-top">
        <button type="button" class="icon-btn" data-back aria-label="Back">←</button>
        <div class="brand-badge lg" style="background:${esc(product.color || '#1e40af')}">${product.icon}</div>
        <div>
          <h1>${esc(product.name)}</h1>
          <p>${esc(catLabel)} · ${esc(planRangeLabel(product))}</p>
        </div>
      </header>

      <section class="info-cards compact">
        ${product.why ? `<article><h3>Why</h3><p>${esc(product.why)}</p></article>` : ''}
        ${product.when ? `<article><h3>When billed</h3><p>${esc(product.when)}</p></article>` : ''}
      </section>

      <section class="panel">
        <h2>Choose your plan</h2>
        <p class="panel-sub">One product — pick the tier you actually pay for.</p>
        <div class="plan-picker">
          ${product.plans.map((plan) => {
            const key = catalogKey(product.id, plan.id);
            const owned = s.subscriptions.some((x) => x.catalogId === key);
            return `
              <button type="button" class="plan-card ${owned ? 'owned' : ''}" data-plan="${plan.id}">
                <div class="plan-card-top">
                  <strong>${esc(plan.name)}</strong>
                  <span class="plan-price">${esc(priceLabel(plan.price, plan.cycle))}</span>
                </div>
                ${plan.blurb ? `<p>${esc(plan.blurb)}</p>` : ''}
                <span class="tag ${owned ? 'owned' : ''}">${owned ? 'Tracking' : 'Select'}</span>
              </button>
            `;
          }).join('')}
        </div>
      </section>

      ${product.url ? `<a class="btn outline block" href="${esc(product.url)}" target="_blank" rel="noopener">Visit ${esc(product.name)}</a>` : ''}
    `;

    root.querySelector('[data-back]')?.addEventListener('click', () => ctx.back());
    root.querySelectorAll('[data-plan]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = catalogKey(product.id, btn.dataset.plan);
        const owned = s.subscriptions.find((x) => x.catalogId === key);
        if (owned) ctx.openSub(owned.id);
        else ctx.openCatalog(key);
      });
    });
    return;
  }

  const entry = getCatalogEntry(catalogId);
  if (!entry) return root.innerHTML = '<p class="empty-sm">Plan not found.</p>';
  const owned = s.subscriptions.find((x) => x.catalogId === entry.catalogId);

  root.innerHTML = `
    <header class="detail-top">
      <button type="button" class="icon-btn" data-back aria-label="Back">←</button>
      <div class="brand-badge lg" style="background:${esc(product.color || '#1e40af')}">${product.icon}</div>
      <div>
        <h1>${esc(entry.displayName)}</h1>
        <p>${esc(catLabel)} · ${esc(priceLabel(entry.price, entry.cycle))}</p>
      </div>
    </header>

    <section class="info-cards">
      ${entry.why ? `<article><h3>Why</h3><p>${esc(entry.why)}</p></article>` : ''}
      ${entry.when ? `<article><h3>When to use</h3><p>${esc(entry.when)}</p></article>` : ''}
      ${entry.how ? `<article><h3>How to manage</h3><p>${esc(entry.how)}</p></article>` : ''}
    </section>

    <div class="link-row">
      ${entry.url ? `<a class="btn outline" href="${esc(entry.url)}" target="_blank" rel="noopener">Website</a>` : ''}
    </div>

    ${owned ? `
      <button type="button" class="btn primary block" data-owned>Open in your stack</button>
    ` : `
      <section class="panel">
        <h2>Track in Financer</h2>
        <form id="add" class="form-stack">
          <label class="field"><span>Your price</span><input name="price" type="number" min="0" step="0.01" value="${entry.price || 0}" required /></label>
          <label class="field"><span>Next bill</span><input name="nextBill" type="date" value="${addDaysISO(14)}" required /></label>
          <label class="field"><span>Cancel by</span><input name="cancelBy" type="date" value="${addDaysISO(13)}" required /></label>
          <button class="btn primary block" type="submit">Add subscription</button>
        </form>
      </section>
    `}
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => ctx.back());
  root.querySelector('[data-owned]')?.addEventListener('click', () => ctx.openSub(owned.id));

  $('#add', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    Store.addSubscription({
      catalogId: entry.catalogId,
      name: entry.displayName,
      category: catLabel,
      price: Number(fd.get('price')),
      currency: s.currency,
      cycle: entry.cycle,
      nextBill: String(fd.get('nextBill')),
      cancelBy: String(fd.get('cancelBy')),
      url: entry.url || '',
      why: entry.why || '',
      when: entry.when || '',
      how: entry.how || '',
    });
    toast('Added');
    ctx.navigate('bills');
  });
}

export function renderSubDetail(root, ctx, id) {
  const sub = Store.get().subscriptions.find((x) => x.id === id);
  if (!sub) return root.innerHTML = '<p class="empty-sm">Removed.</p>';
  const entry = getCatalogEntry(sub.catalogId);
  const label = entry?.displayName || sub.name;
  const dBill = daysUntil(sub.nextBill);
  const dCancel = daysUntil(sub.cancelBy);

  root.innerHTML = `
    <header class="detail-top">
      <button type="button" class="icon-btn" data-back aria-label="Back">←</button>
      <div class="brand-badge lg">${initials(label)}</div>
      <div>
        <h1>${esc(label)}</h1>
        <p>${money(sub.price, sub.currency)} / ${esc(sub.cycle)}</p>
      </div>
    </header>

    <section class="timeline">
      <div class="tl-item ${dBill <= 7 ? 'warn' : ''}">
        <span class="tl-dot"></span>
        <div>
          <strong>Next charge</strong>
          <p>${niceDate(sub.nextBill)} · in ${dBill} days</p>
        </div>
      </div>
      <div class="tl-item ${dCancel <= 5 ? 'danger' : ''}">
        <span class="tl-dot"></span>
        <div>
          <strong>Cancel window</strong>
          <p>Cancel by ${niceDate(sub.cancelBy)} · ${dCancel} days left</p>
        </div>
      </div>
    </section>

    <section class="info-cards">
      ${sub.why ? `<article><h3>Why</h3><p>${esc(sub.why)}</p></article>` : ''}
      ${sub.when ? `<article><h3>When</h3><p>${esc(sub.when)}</p></article>` : ''}
      ${sub.how ? `<article><h3>How</h3><p>${esc(sub.how)}</p></article>` : ''}
    </section>

    <div class="link-row">
      ${sub.url ? `<a class="btn outline" href="${esc(sub.url)}" target="_blank" rel="noopener">Website</a>` : ''}
    </div>

    <section class="panel">
      <h2>Edit</h2>
      <form id="edit" class="form-stack">
        <label class="field"><span>Price</span><input name="price" type="number" min="0" step="0.01" value="${sub.price}" required /></label>
        <label class="field"><span>Next bill</span><input name="nextBill" type="date" value="${sub.nextBill}" required /></label>
        <label class="field"><span>Cancel by</span><input name="cancelBy" type="date" value="${sub.cancelBy}" required /></label>
        <button class="btn primary block" type="submit">Save</button>
      </form>
      <button type="button" class="btn danger block" data-rm>Remove</button>
    </section>
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => ctx.back());

  $('#edit', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    Store.updateSubscription(sub.id, {
      price: Number(fd.get('price')),
      nextBill: String(fd.get('nextBill')),
      cancelBy: String(fd.get('cancelBy'))
    });
    toast('Saved');
    ctx.refresh();
  });

  root.querySelector('[data-rm]')?.addEventListener('click', () => {
    if (!confirm(`Stop tracking ${label}?`)) return;
    Store.removeSubscription(sub.id);
    toast('Removed');
    ctx.navigate('bills');
  });
}
