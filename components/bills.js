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
import { projectNextBill, projectCancelBy, monthlyEquivalent } from '../billing.js';
import { checkReminders } from './notifications.js';
import {
  trialApplies,
  trialResearchHtml,
  computeTrialSchedule,
  getSubLifecycle,
  isoToday,
} from '../trials.js';

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
    wireBrandBadges(featured);
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
      wireBrandBadges(root);
      return;
    }
    results.innerHTML = rows.length
      ? rows.map((p) => productRow(p)).join('')
      : `<p class="empty-sm">Try a different name or category.</p>`;
    wireProductClicks(results);
    wireBrandBadges(root);
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
}

function dateHeroHtml(sub, life) {
  const cells = [];
  if (life.onTrial) {
    cells.push({ label: 'Trial ends', date: sub.trialEnds, days: life.trialDaysLeft, urgent: life.urgentTrial });
  }
  cells.push({
    label: life.onTrial ? 'First charge' : 'Renews',
    date: sub.nextBill,
    days: life.daysUntilCharge,
    urgent: !life.onTrial && life.urgentCharge,
  });
  cells.push({
    label: 'Cancel by',
    date: sub.cancelBy,
    days: life.daysUntilCancel,
    urgent: life.urgentCancel,
  });

  const urgent = life.urgentTrial || life.urgentCharge || life.urgentCancel;
  return `
    <section class="date-hero ${life.onTrial ? 'on-trial' : ''} ${urgent ? 'urgent' : ''}">
      ${cells.map((c) => `
        <div class="date-hero-cell ${c.urgent ? 'urgent' : ''}">
          <span>${c.label}</span>
          <strong>${niceDate(c.date)}</strong>
          <em>${c.days} days</em>
        </div>
      `).join('')}
    </section>
  `;
}

function statusBannerHtml(life, sub, currency) {
  if (life.onTrial && life.urgentTrial) {
    return `<p class="detail-banner urgent">Trial ends in ${life.trialDaysLeft} days — cancel before you're charged ${money(sub.price, currency)}</p>`;
  }
  if (life.urgentCancel) {
    return `<p class="detail-banner urgent">Cancel within ${life.daysUntilCancel} days to avoid the next charge</p>`;
  }
  if (life.urgentCharge && !life.onTrial) {
    return `<p class="detail-banner warn">Renews in ${life.daysUntilCharge} days · ${money(sub.price, currency)}</p>`;
  }
  if (life.onTrial) {
    return '';
  }
  return '';
}

function trialProgress(sub) {
  if (!sub.trialEnds || !sub.startedAt) return null;
  const start = new Date(`${sub.startedAt}T12:00:00`);
  const end = new Date(`${sub.trialEnds}T12:00:00`);
  const today = new Date(`${isoToday()}T12:00:00`);
  const total = Math.max(1, Math.round((end - start) / 86400000));
  const elapsed = Math.max(0, Math.round((today - start) / 86400000));
  const pct = Math.min(100, Math.round((elapsed / total) * 100));
  return { pct, day: Math.min(elapsed + 1, total), total };
}

function subDetailBodyHtml(sub, life, entry, brand, currency) {
  const monthly = monthlyEquivalent(sub.price, sub.cycle);
  const yearly = monthly * 12;
  const stackTotal = Store.subsMonthly();
  const stackShare = stackTotal > 0 ? Math.round((monthly / stackTotal) * 100) : 0;
  const allSubs = Store.get().subscriptions;
  const stackRank = allSubs.length;
  const progress = life.onTrial ? trialProgress(sub) : null;
  const accent = brand.color || '#1e40af';

  const timelineSteps = [];
  if (life.onTrial && sub.trialEnds) {
    timelineSteps.push({ label: 'Trial ends', date: sub.trialEnds, days: life.trialDaysLeft, tone: life.urgentTrial ? 'urgent' : 'trial' });
  }
  timelineSteps.push({
    label: 'Cancel by',
    date: sub.cancelBy,
    days: life.daysUntilCancel,
    tone: life.urgentCancel ? 'urgent' : 'neutral',
  });
  timelineSteps.push({
    label: life.onTrial ? 'First charge' : 'Renews',
    date: sub.nextBill,
    days: life.daysUntilCharge,
    tone: life.urgentCharge ? 'urgent' : 'charge',
  });

  return `
    <div class="sub-detail-body">
      <div class="spotlight-card" style="--spot:${esc(accent)}">
        <div class="spotlight-main">
          <span class="spotlight-label">${life.onTrial ? 'After trial' : 'Per cycle'}</span>
          <strong class="spotlight-price">${money(sub.price, currency)}</strong>
          <span class="spotlight-cycle">${esc(sub.cycle)}</span>
        </div>
        <div class="spotlight-side">
          <div class="spotlight-stat">
            <span>Yearly est.</span>
            <b>${money(yearly, currency)}</b>
          </div>
          <div class="spotlight-stat">
            <span>Of your stack</span>
            <b>${stackShare}%</b>
          </div>
        </div>
      </div>

      ${progress ? `
        <div class="trial-meter ${life.urgentTrial ? 'urgent' : ''}">
          <div class="trial-meter-head">
            <span>Trial progress</span>
            <b>Day ${progress.day} of ${progress.total}</b>
          </div>
          <div class="trial-meter-track"><div class="trial-meter-fill" style="width:${progress.pct}%"></div></div>
          <p>${life.trialDaysLeft} days left · then ${money(sub.price, currency)}/${esc(sub.cycle)}</p>
        </div>
      ` : ''}

      <div class="sub-timeline" style="--steps:${timelineSteps.length}">
        <div class="sub-timeline-rail"></div>
        ${timelineSteps.map((step) => `
          <div class="sub-timeline-step ${step.tone}">
            <div class="sub-timeline-dot"></div>
            <span class="sub-timeline-label">${step.label}</span>
            <strong>${niceDate(step.date)}</strong>
            <em>${step.days}d</em>
          </div>
        `).join('')}
      </div>

      <div class="fact-grid">
        <div class="fact-cell">
          <span>Category</span>
          <b>${esc(sub.category || entry?.category || '—')}</b>
        </div>
        <div class="fact-cell">
          <span>Monthly eq.</span>
          <b>${money(monthly, currency)}</b>
        </div>
        <div class="fact-cell">
          <span>In your stack</span>
          <b>${stackRank} tracked</b>
        </div>
        <div class="fact-cell">
          <span>Status</span>
          <b class="fact-status ${life.onTrial ? 'trial' : life.urgentCancel || life.urgentCharge ? 'urgent' : 'ok'}">${life.onTrial ? 'On trial' : life.urgentCancel ? 'Cancel soon' : life.urgentCharge ? 'Due soon' : 'Active'}</b>
        </div>
      </div>

      ${entry?.valueTip ? `
        <div class="detail-insight">
          <span class="detail-insight-icon">💡</span>
          <p>${esc(entry.valueTip)}</p>
        </div>
      ` : ''}

      ${sub.trialSource ? `
        <a class="detail-link-row" href="${esc(sub.trialSource)}" target="_blank" rel="noopener">Trial policy · official source ↗</a>
      ` : ''}
    </div>
  `;
}

async function openSubEditSheet(sub, ctx, label) {
  const history = sub.priceHistory || [];
  await sheet({
    title: `Edit ${label}`,
    body: `
      <form id="sub-edit-form" class="form-stack">
        <label class="field"><span>Price</span><input name="price" type="number" min="0" step="0.01" value="${sub.price}" required /></label>
        <div class="field-row">
          <label class="field"><span>Next bill</span><input name="nextBill" type="date" value="${sub.nextBill}" required /></label>
          <label class="field"><span>Cancel by</span><input name="cancelBy" type="date" value="${sub.cancelBy}" required /></label>
        </div>
        <label class="field"><span>Trial ends</span><input name="trialEnds" type="date" value="${sub.trialEnds || ''}" /></label>
        ${history.length ? `
          <div class="mini-history block">
            <span class="current">${money(sub.price, sub.currency)} now</span>
            ${history.map((h) => `<span>${niceDate(h.date)} ${money(h.price, sub.currency)}</span>`).join('')}
          </div>
        ` : ''}
        <button class="btn primary block" type="submit">Save changes</button>
      </form>
    `,
    actions: [{ id: 'cancel', label: 'Close' }],
    onOpen(overlay) {
      overlay.querySelector('#sub-edit-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        Store.updateSubscription(sub.id, {
          price: Number(fd.get('price')),
          nextBill: String(fd.get('nextBill')),
          cancelBy: String(fd.get('cancelBy')),
          trialEnds: String(fd.get('trialEnds') || '') || null,
        });
        toast('Saved');
        checkReminders();
        ctx.refresh();
        overlay.querySelector('[data-x]')?.click();
      });
    },
  });
}

function card(sub, currency) {
  const life = getSubLifecycle(sub);
  const entry = getCatalogEntry(sub.catalogId);
  const label = entry?.displayName || sub.name;
  const brand = getSubBranding(sub);
  const critClass = life.urgentTrial || life.urgentCharge ? 'urgent' : life.urgentCancel ? 'warn' : life.onTrial ? 'trial' : '';

  return `
    <button type="button" class="sub-card ${critClass}" data-sub="${sub.id}" style="--sub-accent:${esc(brand.color)}">
      <div class="sub-card-top">
        ${brandBadgeHtml(brand)}
        <div class="sub-card-title">
          <strong>${esc(label)}</strong>
          <span>${esc(sub.category)} · ${esc(sub.cycle)}</span>
        </div>
      </div>
      <div class="sub-critical">
        ${life.onTrial ? `
          <div class="crit-row trial ${life.urgentTrial ? 'urgent' : ''}">
            <span>Trial ends</span>
            <b>${niceDate(sub.trialEnds)} · ${life.trialDaysLeft}d</b>
          </div>
          <div class="crit-row charge">
            <span>First charge</span>
            <b>${niceDate(sub.nextBill)} · ${life.daysUntilCharge}d</b>
          </div>
        ` : `
          <div class="crit-row charge ${life.urgentCharge ? 'urgent' : ''}">
            <span>Renews</span>
            <b>${niceDate(sub.nextBill)} · ${life.daysUntilCharge}d</b>
          </div>
        `}
        <div class="crit-row cancel ${life.urgentCancel ? 'urgent' : ''}">
          <span>Cancel by</span>
          <b>${niceDate(sub.cancelBy)} · ${life.daysUntilCancel}d</b>
        </div>
      </div>
      <div class="sub-card-bottom">
        <span class="tiny">${life.onTrial ? 'After trial' : 'Per cycle'}</span>
        <div class="price">${money(sub.price, currency)}</div>
      </div>
    </button>
  `;
}

function wireTrialAddForm(root, entry) {
  const trial = trialApplies(entry);
  const useTrialEl = $('#useTrial', root);
  const startedEl = $('#startedAt', root);
  const trialEndsEl = $('#trialEnds', root);
  const nextBillEl = $('#nextBill', root);
  const cancelByEl = $('#cancelBy', root);
  const billingDayEl = $('#billingDay', root);
  const preview = $('#trialPreview', root);

  const recalc = () => {
    const use = useTrialEl?.checked && trial;
    if (!use || !trial) {
      preview?.classList.add('hidden');
      return;
    }
    const started = startedEl?.value || isoToday();
    const sched = computeTrialSchedule({ startedAt: started, trialDays: trial.days });
    if (trialEndsEl) trialEndsEl.value = sched.trialEnds;
    if (nextBillEl) nextBillEl.value = sched.firstCharge;
    if (cancelByEl) cancelByEl.value = sched.cancelBy;
    if (billingDayEl) {
      billingDayEl.value = new Date(`${sched.firstCharge}T12:00:00`).getDate();
    }
    if (preview) {
      preview.classList.remove('hidden');
      preview.innerHTML = `
        <div class="trial-preview-grid">
          <div><span>Trial ends</span><b>${niceDate(sched.trialEnds)}</b></div>
          <div><span>First charge</span><b>${niceDate(sched.firstCharge)}</b></div>
          <div><span>Cancel by</span><b>${niceDate(sched.cancelBy)}</b></div>
        </div>`;
    }
  };

  useTrialEl?.addEventListener('change', recalc);
  startedEl?.addEventListener('input', recalc);
  if (trial && useTrialEl) {
    useTrialEl.checked = true;
    recalc();
  }
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
      <label class="field"><span>Trial ends (optional)</span><input id="c-trial" type="date" /></label>
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
    trialEnds: String($('#c-trial', o)?.value || '') || null,
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
      <div class="detail-view detail-view--scroll">
        <header class="detail-top">
          <button type="button" class="icon-btn" data-back aria-label="Back">←</button>
          ${brandBadgeHtml({ icon: product.icon, color: product.color, url: product.url }, { lg: true })}
          <div>
            <h1>${esc(product.name)}</h1>
            <p>${esc(catLabel)} · ${esc(planRangeLabel(product, s.currency))}</p>
          </div>
        </header>

        ${product.valueTip ? `<p class="detail-hint">${esc(product.valueTip)}</p>` : ''}
        ${product.trialPolicy ? trialResearchHtml({ trialPolicy: product.trialPolicy }, 'monthly') : ''}

        <div class="detail-scroll-body">
          <div class="plan-picker">
          ${[...product.plans].sort((a, b) => a.price - b.price).map((plan) => {
            const key = catalogKey(product.id, plan.id);
            const owned = s.subscriptions.some((x) => x.catalogId === key);
            const meta = [plan.blurb, plan.trial ? `${plan.trial.days}d trial` : ''].filter(Boolean).join(' · ');
            return `
              <button type="button" class="plan-card ${owned ? 'owned' : ''}" data-plan="${plan.id}">
                <div class="plan-card-top">
                  <strong>${esc(plan.name)}</strong>
                  <span class="plan-price">${esc(priceLabel(plan.price, plan.cycle, s.currency))}</span>
                </div>
                ${meta ? `<span class="plan-meta">${esc(meta)}</span>` : ''}
                ${owned ? '<span class="tag owned">Tracking</span>' : ''}
              </button>
            `;
          }).join('')}
          </div>
        </div>

        ${product.pricingUrl || product.url ? `
          <div class="link-row compact">
            ${product.url ? `<a class="text-link" href="${esc(product.url)}" target="_blank" rel="noopener">Website ↗</a>` : ''}
            ${product.pricingUrl ? `<a class="text-link" href="${esc(product.pricingUrl)}" target="_blank" rel="noopener">Pricing ↗</a>` : ''}
          </div>
        ` : ''}
      </div>
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

  const entry = getCatalogEntry(catalogId);
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
    <div class="detail-view detail-view--scroll">
      <header class="detail-top">
        <button type="button" class="icon-btn" data-back aria-label="Back">←</button>
        ${brandBadgeHtml({ icon: product.icon, color: product.color, url: product.url }, { lg: true })}
        <div>
          <h1>${esc(entry.displayName)}</h1>
          <p>${esc(catLabel)} · ${esc(priceLabel(entry.price, entry.cycle, s.currency))}</p>
        </div>
      </header>

      ${entry.valueTip ? `<p class="detail-hint">${esc(entry.valueTip)}</p>` : ''}
      ${trialResearchHtml(entry, entry.cycle)}

      <div class="detail-scroll-body">
        <div class="link-row compact">
          ${entry.url ? `<a class="text-link" href="${esc(entry.url)}" target="_blank" rel="noopener">Website ↗</a>` : ''}
          ${entry.pricingUrl ? `<a class="text-link" href="${esc(entry.pricingUrl)}" target="_blank" rel="noopener">Pricing ↗</a>` : ''}
        </div>

        ${owned ? `
          <button type="button" class="btn primary block" data-owned>Open tracked sub</button>
        ` : `
          <form id="add" class="form-stack compact-form">
          ${trialApplies(entry) ? `
            <label class="field checkbox-row trial-confirm">
              <input type="checkbox" id="useTrial" name="useTrial" checked />
              <span>Apply trial (verify at signup)</span>
            </label>
            <label class="field"><span>Started</span>
              <input name="startedAt" id="startedAt" type="date" value="${isoToday()}" required />
            </label>
            <div id="trialPreview" class="trial-preview hidden"></div>
            <input type="hidden" name="trialEnds" id="trialEnds" />
          ` : ''}
          <label class="field"><span>Price</span><input name="price" type="number" min="0" step="0.01" value="${entry.price || 0}" required /></label>
          ${needsBillingDay ? `
            <label class="field"><span>Billing day</span><input name="billingDay" id="billingDay" type="number" min="1" max="31" value="${defaultDay}" required /></label>
          ` : ''}
          <div class="field-row">
            <label class="field"><span>${trialApplies(entry) ? 'First charge' : 'Next bill'}</span><input name="nextBill" id="nextBill" type="date" value="${defaultNext || addDaysISO(14)}" required /></label>
            <label class="field"><span>Cancel by</span><input name="cancelBy" id="cancelBy" type="date" value="${defaultCancel || addDaysISO(13)}" required /></label>
          </div>
          <button class="btn primary block" type="submit">Add to stack</button>
        </form>
      `}
      </div>
    </div>
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => ctx.back());
  root.querySelector('[data-owned]')?.addEventListener('click', () => ctx.openSub(owned.id));

  wireTrialAddForm(root, entry);

  const billingDayEl = $('#billingDay', root);
  const nextBillEl = $('#nextBill', root);
  const cancelByEl = $('#cancelBy', root);
  const recalcDates = () => {
    if ($('#useTrial', root)?.checked) return;
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
    const trial = trialApplies(entry);
    const useTrial = trial && $('#useTrial', root)?.checked;
    const startedAt = String(fd.get('startedAt') || isoToday());
    let trialEnds = null;
    let trialVerified = null;
    let trialSource = '';
    let trialDays = null;

    if (useTrial && trial) {
      const sched = computeTrialSchedule({ startedAt, trialDays: trial.days });
      trialEnds = sched.trialEnds;
      trialVerified = true;
      trialSource = trial.source || '';
      trialDays = trial.days;
    }

    Store.addSubscription({
      catalogId: entry.catalogId,
      name: entry.displayName,
      category: catLabel,
      price: Number(fd.get('price')),
      currency: s.currency,
      cycle: entry.cycle,
      nextBill: useTrial ? computeTrialSchedule({ startedAt, trialDays: trial.days }).firstCharge : String(fd.get('nextBill')),
      cancelBy: useTrial ? computeTrialSchedule({ startedAt, trialDays: trial.days }).cancelBy : String(fd.get('cancelBy')),
      trialEnds,
      trialVerified,
      trialSource,
      trialDays,
      startedAt,
      url: entry.url || '',
      why: entry.why || '',
      when: entry.when || '',
      how: entry.how || '',
      billingAnchor: entry.billingAnchor || '',
      billingDay: fd.get('billingDay') ? Number(fd.get('billingDay')) : null,
    });
    toast('Added');
    checkReminders();
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
  const life = getSubLifecycle(sub);
  const accent = brand.color || '#1e40af';

  root.innerHTML = `
    <div class="sub-detail detail-view detail-view--screen" style="--accent:${esc(accent)}">
      <div class="sub-detail-band" aria-hidden="true"></div>

      <div class="sub-detail-top">
        <header class="detail-top detail-top--brand">
          <button type="button" class="icon-btn icon-btn--glass" data-back aria-label="Back">←</button>
          ${brandBadgeHtml(brand, { lg: true })}
          <div>
            <h1>${esc(label)}</h1>
            <p>${money(sub.price, sub.currency)} / ${esc(sub.cycle)}</p>
          </div>
        </header>

        ${dateHeroHtml(sub, life)}
        ${statusBannerHtml(life, sub, sub.currency)}
      </div>

      ${subDetailBodyHtml(sub, life, entry, brand, sub.currency)}

      <div class="detail-screen-actions">
        <button type="button" class="btn outline" data-edit>Edit</button>
        ${sub.url ? `<a class="btn outline" href="${esc(sub.url)}" target="_blank" rel="noopener">Open site</a>` : ''}
        <button type="button" class="btn danger" data-rm>Remove</button>
      </div>
    </div>
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => ctx.back());
  root.querySelector('[data-edit]')?.addEventListener('click', () => openSubEditSheet(sub, ctx, label));

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
