import { Store } from '../store.js';
import {
  searchProducts,
  CATEGORIES,
  PRODUCT_COUNT,
  CATALOG_SIZE,
  getProduct,
  getCatalogEntry,
  getSubBranding,
  catalogKey,
  priceLabel,
  planRangeLabel,
  parseCatalogKey,
} from '../catalog.js';
import { esc, money, niceDate, daysUntil, toast, addDaysISO, $, sheet, confirmSheet } from './ui.js';
import { brandBadgeHtml, wireBrandBadges } from './brand.js';
import { anchorLabel, anchorHint, projectNextBill, projectCancelBy } from '../billing.js';

const FEATURED = ['streamladder', 'netflix', 'spotify', 'claude', 'youtube_premium', 'disney'];

export function renderBills(root, ctx) {
  const s = Store.get();
  const mine = s.subscriptions;
  const total = Store.subsMonthly();
  const nextDue = Store.upcomingBills(30)[0];

  root.innerHTML = `
    <header class="page-title">
      <h1>Subscriptions</h1>
      <p>${mine.length ? `${money(total, s.currency)} / month · ${mine.length} tracked` : 'Track only what you actually pay.'}</p>
    </header>

    ${mine.length ? `
      <div class="stack-summary">
        <span><strong>${money(total, s.currency)}</strong>/mo</span>
        <span>·</span>
        <span>${mine.length} subs</span>
        ${nextDue ? `<span>·</span><span>Next in ${nextDue.daysUntil}d</span>` : ''}
      </div>
      <section class="panel flush-top">
        <div class="sub-grid">
          ${mine.map((sub) => card(sub, s.currency)).join('')}
        </div>
      </section>
    ` : `
      <section class="hero-empty compact">
        <div class="hero-empty-icon">◎</div>
        <h2>Nothing tracked yet</h2>
        <p>Search the library below — pick a product, then your plan.</p>
      </section>
    `}

    <section class="library-panel">
      <div class="library-head">
        <label class="library-search">
          <span class="library-search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </span>
          <input id="q" type="search" placeholder="Search ${PRODUCT_COUNT} services…" autocomplete="off" enterkeyhint="search" spellcheck="false" />
          <button type="button" class="library-clear" id="clear" hidden aria-label="Clear search">×</button>
        </label>
        <p class="library-meta" id="meta"></p>
        <button type="button" class="btn outline library-custom" data-custom>Add custom subscription</button>
      </div>

      <div class="chip-scroll" id="cats">
        <button type="button" class="chip on" data-cat="all">All</button>
        ${CATEGORIES.map((c) => `<button type="button" class="chip" data-cat="${esc(c.id)}">${c.icon} ${esc(c.label)}</button>`).join('')}
      </div>

      <div id="featured" class="library-featured"></div>
      <div class="discover-list" id="results"></div>
    </section>
  `;

  let category = 'all';
  const q = $('#q', root);
  const results = $('#results', root);
  const meta = $('#meta', root);
  const featured = $('#featured', root);
  const clearBtn = $('#clear', root);

  const ownedForProduct = (productId) => mine.filter((m) => {
    const { productId: pid } = parseCatalogKey(m.catalogId);
    return pid === productId;
  });

  const productRow = (p) => {
    const owned = ownedForProduct(p.id);
    const catLabel = CATEGORIES.find((c) => c.id === p.category)?.label || p.category;
    const brand = { icon: p.icon, color: p.color, url: p.url };
    return `
      <button type="button" class="discover-row" data-pid="${p.id}">
        ${brandBadgeHtml(brand)}
        <div class="discover-main">
          <strong>${esc(p.name)}</strong>
          <span>${esc(catLabel)} · ${esc(planRangeLabel(p, s.currency))}</span>
        </div>
        <span class="tag ${owned.length ? 'owned' : ''}">${owned.length ? `${owned.length} added` : 'Add'}</span>
      </button>
    `;
  };

  const wireProductClicks = (container) => {
    container.querySelectorAll('[data-pid]').forEach((btn) => {
      btn.addEventListener('click', () => ctx.openCatalog(btn.dataset.pid));
    });
  };

  const updateMeta = (query, rows) => {
    const catLabel = category === 'all'
      ? null
      : CATEGORIES.find((c) => c.id === category)?.label;

    if (query) {
      meta.textContent = rows.length
        ? `${rows.length} result${rows.length === 1 ? '' : 's'} for “${query}”`
        : `No matches for “${query}”`;
      return;
    }

    if (catLabel) {
      meta.textContent = rows.length
        ? `${rows.length} in ${catLabel}`
        : `Nothing in ${catLabel}`;
      return;
    }

    meta.textContent = `${PRODUCT_COUNT} services · ${CATALOG_SIZE}+ plans`;
  };

  const paintFeatured = () => {
    const query = q.value.trim();
    if (query || category !== 'all') {
      featured.innerHTML = '';
      featured.hidden = true;
      return;
    }

    const picks = FEATURED
      .map((id) => getProduct(id))
      .filter(Boolean);

    featured.hidden = false;
    featured.innerHTML = `
      <p class="library-section-label">Popular</p>
      <div class="discover-list compact">
        ${picks.map((p) => productRow(p)).join('')}
      </div>
    `;
    wireProductClicks(featured);
  };

  const paint = () => {
    const query = q.value.trim();
    clearBtn.hidden = !query;

    const rows = searchProducts(query, { category });
    updateMeta(query, rows);
    paintFeatured();

    const showAll = !query && category === 'all';
    results.hidden = false;

    if (showAll) {
      results.innerHTML = `
        <p class="library-hint-block">Pick a category chip or start typing to search all ${PRODUCT_COUNT} services.</p>
      `;
      return;
    }
    results.innerHTML = rows.length
      ? rows.map((p) => productRow(p)).join('')
      : `<p class="empty-sm">Try a different name or category.</p>`;
    wireProductClicks(results);
  };

  root.querySelector('[data-custom]')?.addEventListener('click', () => openCustomSubSheet(ctx, s));

  clearBtn.addEventListener('click', () => {
    q.value = '';
    q.focus();
    paint();
  });

  q.addEventListener('input', paint);
  root.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('[data-cat]').forEach((b) => b.classList.remove('on'));
      btn.classList.add('on');
      category = btn.dataset.cat;
      paint();
    });
  });

  root.querySelectorAll('[data-sub]').forEach((btn) => {
    btn.addEventListener('click', () => ctx.openSub(btn.dataset.sub));
  });

  paint();
  wireBrandBadges(root);
}

function card(sub, currency) {
  const d = daysUntil(sub.nextBill);
  const urgent = d <= 3;
  const entry = getCatalogEntry(sub.catalogId);
  const label = entry?.displayName || sub.name;
  const brand = getSubBranding(sub);
  return `
    <button type="button" class="sub-card ${urgent ? 'urgent' : ''}" data-sub="${sub.id}" style="--sub-accent:${esc(brand.color)}">
      <div class="sub-card-top">
        ${brandBadgeHtml(brand)}
        <div>
          <strong>${esc(label)}</strong>
          <span>${esc(sub.category)}${sub.cycle === 'yearly' ? ' · yearly' : ''}</span>
        </div>
        ${urgent ? '<span class="sub-urgent-pill">Due soon</span>' : ''}
      </div>
      <div class="sub-card-bottom">
        <div>
          <span class="tiny">Next bill</span>
          <b>${niceDate(sub.nextBill)}</b>
        </div>
        <div class="price">${money(sub.price, currency)}</div>
      </div>
    </button>
  `;
}

async function openCustomSubSheet(ctx, s) {
  const result = await sheet({
    title: 'Custom subscription',
    body: `
      <p class="sheet-hint">For services not in the catalog — gym, rent, anything recurring.</p>
      <label class="field"><span>Name</span><input id="c-name" maxlength="60" placeholder="e.g. Gym membership" required /></label>
      <label class="field"><span>Category</span>
        <select id="c-cat">
          ${CATEGORIES.map((c) => `<option value="${esc(c.label)}">${c.icon} ${esc(c.label)}</option>`).join('')}
          <option value="Other">Other</option>
        </select>
      </label>
      <label class="field"><span>Price</span><input id="c-price" type="number" min="0" step="0.01" required /></label>
      <label class="field"><span>Billing cycle</span>
        <select id="c-cycle">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </label>
      <label class="field"><span>Billing day (1–31)</span><input id="c-day" type="number" min="1" max="31" value="${new Date().getDate()}" /></label>
      <label class="field"><span>Next bill</span><input id="c-next" type="date" value="${addDaysISO(14)}" required /></label>
      <label class="field"><span>Cancel by</span><input id="c-cancel" type="date" value="${addDaysISO(13)}" required /></label>
    `,
    actions: [{ id: 'save', label: 'Add subscription', primary: true }],
  });
  if (result?.action !== 'save') return;
  const o = result.overlay;
  const name = String($('#c-name', o)?.value || '').trim();
  const price = Number($('#c-price', o)?.value);
  if (!name || !Number.isFinite(price)) return toast('Fill in name and price');
  const day = Number($('#c-day', o)?.value) || new Date().getDate();
  Store.addSubscription({
    catalogId: `custom:${Date.now()}`,
    name,
    category: $('#c-cat', o)?.value || 'Other',
    price,
    currency: s.currency,
    cycle: $('#c-cycle', o)?.value || 'monthly',
    nextBill: String($('#c-next', o)?.value),
    cancelBy: String($('#c-cancel', o)?.value),
    billingAnchor: 'signup_anniversary',
    billingDay: day,
  });
  toast('Added');
  ctx.refresh();
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
          <p>${esc(catLabel)} · ${esc(planRangeLabel(product, s.currency))}</p>
        </div>
      </header>

      <section class="info-cards compact">
        ${product.why ? `<article><h3>Why</h3><p>${esc(product.why)}</p></article>` : ''}
        ${product.when ? `<article><h3>When billed</h3><p>${esc(product.when)}</p></article>` : ''}
        ${product.billingAnchor ? `<article class="gold"><h3>Billing timing</h3><p><strong>${esc(anchorLabel(product.billingAnchor))}</strong>${product.billingSource ? ` — ${esc(product.billingSource)}` : ''}</p></article>` : ''}
      </section>

      <section class="panel">
        <h2>Choose your plan</h2>
        <p class="panel-sub">One product — pick the tier you actually pay for.</p>
        <div class="plan-picker">
          ${[...product.plans].sort((a, b) => a.price - b.price).map((plan) => {
            const key = catalogKey(product.id, plan.id);
            const owned = s.subscriptions.some((x) => x.catalogId === key);
            return `
              <button type="button" class="plan-card ${owned ? 'owned' : ''}" data-plan="${plan.id}">
                <div class="plan-card-top">
                  <strong>${esc(plan.name)}</strong>
                  <span class="plan-price">${esc(priceLabel(plan.price, plan.cycle, s.currency))}</span>
                </div>
                ${plan.blurb ? `<p>${esc(plan.blurb)}</p>` : ''}
                <span class="tag ${owned ? 'owned' : ''}">${owned ? 'Tracking' : 'Select'}</span>
              </button>
            `;
          }).join('')}
        </div>
      </section>

      ${product.pricingUrl || product.url ? `
        <div class="link-row">
          ${product.url ? `<a class="btn outline" href="${esc(product.url)}" target="_blank" rel="noopener">Website</a>` : ''}
          ${product.pricingUrl ? `<a class="btn outline" href="${esc(product.pricingUrl)}" target="_blank" rel="noopener">Official pricing</a>` : ''}
        </div>
      ` : ''}
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
    wireBrandBadges(root);
    return;
  }
  if (!entry) return root.innerHTML = '<p class="empty-sm">Plan not found.</p>';
  const owned = s.subscriptions.find((x) => x.catalogId === entry.catalogId);
  const needsBillingDay = entry.billingAnchor === 'signup_anniversary' || entry.billingAnchor === 'app_store';
  const defaultDay = new Date().getDate();
  const defaultNext = needsBillingDay
    ? projectNextBill({ billingAnchor: entry.billingAnchor, billingDay: defaultDay })
    : addDaysISO(14);
  const defaultCancel = needsBillingDay && defaultNext
    ? projectCancelBy(defaultNext)
    : addDaysISO(13);

  root.innerHTML = `
    <header class="detail-top">
      <button type="button" class="icon-btn" data-back aria-label="Back">←</button>
      ${brandBadgeHtml({ icon: product.icon, color: product.color, url: product.url }, { lg: true })}
      <div>
        <h1>${esc(entry.displayName)}</h1>
        <p>${esc(catLabel)} · ${esc(priceLabel(entry.price, entry.cycle, s.currency))}</p>
      </div>
    </header>

    <section class="info-cards">
      ${entry.why ? `<article><h3>Why</h3><p>${esc(entry.why)}</p></article>` : ''}
      ${entry.when ? `<article><h3>When to use</h3><p>${esc(entry.when)}</p></article>` : ''}
      ${entry.how ? `<article><h3>How to manage</h3><p>${esc(entry.how)}</p></article>` : ''}
      ${entry.billingAnchor ? `<article class="gold"><h3>Billing timing</h3><p><strong>${esc(anchorLabel(entry.billingAnchor))}</strong></p><p>${esc(anchorHint(entry.billingAnchor) || '')}</p>${entry.billingSource ? `<p class="tiny">Source: ${esc(entry.billingSource)}</p>` : ''}</article>` : ''}
    </section>

    <div class="link-row">
      ${entry.url ? `<a class="btn outline" href="${esc(entry.url)}" target="_blank" rel="noopener">Website</a>` : ''}
      ${entry.pricingUrl ? `<a class="btn outline" href="${esc(entry.pricingUrl)}" target="_blank" rel="noopener">Official pricing</a>` : ''}
    </div>

    ${owned ? `
      <button type="button" class="btn primary block" data-owned>Open in your stack</button>
    ` : `
      <section class="panel">
        <h2>Track in Financer</h2>
        <form id="add" class="form-stack">
          <label class="field"><span>Your price</span><input name="price" type="number" min="0" step="0.01" value="${entry.price || 0}" required /></label>
          ${needsBillingDay ? `
            <label class="field"><span>Your billing day (1–31)</span><input name="billingDay" id="billingDay" type="number" min="1" max="31" value="${defaultDay}" required /></label>
          ` : ''}
          <label class="field"><span>Next bill</span><input name="nextBill" id="nextBill" type="date" value="${defaultNext || addDaysISO(14)}" required /></label>
          <label class="field"><span>Cancel by</span><input name="cancelBy" id="cancelBy" type="date" value="${defaultCancel || addDaysISO(13)}" required /></label>
          <button class="btn primary block" type="submit">Add subscription</button>
        </form>
      </section>
    `}
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => ctx.back());
  root.querySelector('[data-owned]')?.addEventListener('click', () => ctx.openSub(owned.id));

  const billingDayEl = $('#billingDay', root);
  const nextBillEl = $('#nextBill', root);
  const cancelByEl = $('#cancelBy', root);
  const recalcDates = () => {
    if (!needsBillingDay || !billingDayEl) return;
    const day = Number(billingDayEl.value);
    if (!day) return;
    const next = projectNextBill({ billingAnchor: entry.billingAnchor, billingDay: day });
    if (next && nextBillEl) nextBillEl.value = next;
    if (next && cancelByEl) cancelByEl.value = projectCancelBy(next) || cancelByEl.value;
  };
  billingDayEl?.addEventListener('input', recalcDates);

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
      billingAnchor: entry.billingAnchor || '',
      billingDay: fd.get('billingDay') ? Number(fd.get('billingDay')) : null,
    });
    toast('Added');
    ctx.navigate('bills');
  });
  wireBrandBadges(root);
}

export function renderSubDetail(root, ctx, id) {
  const sub = Store.get().subscriptions.find((x) => x.id === id);
  if (!sub) return root.innerHTML = '<p class="empty-sm">Removed.</p>';
  const entry = getCatalogEntry(sub.catalogId);
  const label = entry?.displayName || sub.name;
  const brand = getSubBranding(sub);
  const dBill = daysUntil(sub.nextBill);
  const dCancel = daysUntil(sub.cancelBy);

  root.innerHTML = `
    <header class="detail-top">
      <button type="button" class="icon-btn" data-back aria-label="Back">←</button>
      ${brandBadgeHtml(brand, { lg: true })}
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
      cancelBy: String(fd.get('cancelBy')),
    });
    toast('Saved');
    ctx.refresh();
  });

  root.querySelector('[data-rm]')?.addEventListener('click', async () => {
    const ok = await confirmSheet({
      title: 'Remove subscription',
      body: `Stop tracking <strong>${esc(label)}</strong>? This won’t cancel the real service.`,
      confirmLabel: 'Remove',
      danger: true,
    });
    if (!ok) return;
    Store.removeSubscription(sub.id);
    toast('Removed');
    ctx.navigate('bills');
  });
  wireBrandBadges(root);
}
