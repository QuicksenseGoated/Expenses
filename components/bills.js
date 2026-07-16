import { Store } from '../store.js';
import { searchCatalog, CATEGORIES, catalogById } from '../catalog.js';
import { esc, money, niceDate, daysUntil, toast, initials, addDaysISO, $ } from './ui.js';

export function renderBills(root, ctx) {
  const s = Store.get();
  const mine = s.subscriptions;
  const total = Store.subsMonthly();

  root.innerHTML = `
    <header class="page-title">
      <h1>Subscriptions</h1>
      <p>${mine.length ? `${money(total, s.currency)} / month across ${mine.length} services` : 'Nothing tracked yet — search and add what you pay for.'}</p>
    </header>

    ${mine.length ? `
      <section class="panel flush-top">
        <div class="sub-grid">
          ${mine.map((sub) => card(sub)).join('')}
        </div>
      </section>
    ` : `
      <section class="hero-empty">
        <div class="hero-empty-icon">◎</div>
        <h2>Your stack is empty</h2>
        <p>No placeholder subscriptions. Search below and add only what you actually pay.</p>
      </section>
    `}

    <section class="panel">
      <div class="panel-head"><h2>Discover</h2></div>
      <label class="search">
        <span aria-hidden="true">⌕</span>
        <input id="q" type="search" placeholder="Search Netflix, gym, VPN…" autocomplete="off" />
      </label>
      <div class="chip-scroll" id="cats">
        ${CATEGORIES.map((c, i) => `<button type="button" class="chip ${i === 0 ? 'on' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}
      </div>
      <div class="discover-list" id="results"></div>
    </section>
  `;

  let category = 'All';
  const q = $('#q', root);
  const results = $('#results', root);

  const paint = () => {
    const rows = searchCatalog(q.value, category).slice(0, 50);
    results.innerHTML = rows.map((c) => {
      const owned = mine.some((m) => m.catalogId === c.id);
      return `
        <button type="button" class="discover-row" data-cid="${c.id}">
          <div class="brand-badge">${initials(c.name)}</div>
          <div class="discover-main">
            <strong>${esc(c.name)}</strong>
            <span>${esc(c.category)} · ~${money(c.typicalPrice, c.currency)}/${esc(c.cycle)}</span>
          </div>
          <span class="tag ${owned ? 'owned' : ''}">${owned ? 'Added' : 'Info'}</span>
        </button>
      `;
    }).join('') || `<p class="empty-sm">No matches.</p>`;

    results.querySelectorAll('[data-cid]').forEach((btn) => {
      btn.addEventListener('click', () => ctx.openCatalog(btn.dataset.cid));
    });
  };

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

function card(sub) {
  const d = daysUntil(sub.nextBill);
  const urgent = d <= 3;
  return `
    <button type="button" class="sub-card ${urgent ? 'urgent' : ''}" data-sub="${sub.id}">
      <div class="sub-card-top">
        <div class="brand-badge">${initials(sub.name)}</div>
        <div>
          <strong>${esc(sub.name)}</strong>
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
  const c = catalogById(catalogId);
  if (!c) return root.innerHTML = '<p class="empty-sm">Not found.</p>';
  const s = Store.get();
  const owned = s.subscriptions.find((x) => x.catalogId === c.id);

  root.innerHTML = `
    <header class="detail-top">
      <button type="button" class="icon-btn" data-back aria-label="Back">←</button>
      <div class="brand-badge lg">${initials(c.name)}</div>
      <div>
        <h1>${esc(c.name)}</h1>
        <p>${esc(c.category)} · ~${money(c.typicalPrice, c.currency)}/${esc(c.cycle)}</p>
      </div>
    </header>

    <section class="info-cards">
      <article><h3>Why</h3><p>${esc(c.why)}</p></article>
      <article><h3>When to use</h3><p>${esc(c.when)}</p></article>
      <article><h3>How to manage</h3><p>${esc(c.how)}</p></article>
      ${c.tip ? `<article class="gold"><h3>Pro tip</h3><p>${esc(c.tip)}</p></article>` : ''}
    </section>

    <div class="link-row">
      <a class="btn outline" href="${esc(c.url)}" target="_blank" rel="noopener">Website</a>
      ${c.manageUrl ? `<a class="btn outline" href="${esc(c.manageUrl)}" target="_blank" rel="noopener">Manage / cancel</a>` : ''}
    </div>

    ${owned ? `
      <button type="button" class="btn primary block" data-owned>Open in your stack</button>
    ` : `
      <section class="panel">
        <h2>Add to Financer</h2>
        <form id="add" class="form-stack">
          <label class="field"><span>Your price</span><input name="price" type="number" min="0" step="0.01" value="${c.typicalPrice}" required /></label>
          <label class="field"><span>Next bill</span><input name="nextBill" type="date" value="${addDaysISO(14)}" required /></label>
          <label class="field"><span>Cancel by</span><input name="cancelBy" type="date" value="${addDaysISO(13)}" required /></label>
          <button class="btn primary block" type="submit">Track this subscription</button>
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
      catalogId: c.id,
      name: c.name,
      category: c.category,
      price: Number(fd.get('price')),
      currency: c.currency,
      cycle: c.cycle,
      nextBill: String(fd.get('nextBill')),
      cancelBy: String(fd.get('cancelBy')),
      url: c.url,
      manageUrl: c.manageUrl,
      why: c.why,
      when: c.when,
      how: c.how,
      tip: c.tip
    });
    toast('Added to your stack');
    ctx.navigate('bills');
  });
}

export function renderSubDetail(root, ctx, id) {
  const sub = Store.get().subscriptions.find((x) => x.id === id);
  if (!sub) return root.innerHTML = '<p class="empty-sm">Removed.</p>';
  const dBill = daysUntil(sub.nextBill);
  const dCancel = daysUntil(sub.cancelBy);

  root.innerHTML = `
    <header class="detail-top">
      <button type="button" class="icon-btn" data-back aria-label="Back">←</button>
      <div class="brand-badge lg">${initials(sub.name)}</div>
      <div>
        <h1>${esc(sub.name)}</h1>
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
      <article><h3>Why</h3><p>${esc(sub.why)}</p></article>
      <article><h3>When</h3><p>${esc(sub.when)}</p></article>
      <article><h3>How</h3><p>${esc(sub.how)}</p></article>
    </section>

    <div class="link-row">
      ${sub.url ? `<a class="btn outline" href="${esc(sub.url)}" target="_blank" rel="noopener">Website</a>` : ''}
      ${sub.manageUrl ? `<a class="btn outline" href="${esc(sub.manageUrl)}" target="_blank" rel="noopener">Cancel page</a>` : ''}
    </div>

    <section class="panel">
      <h2>Edit</h2>
      <form id="edit" class="form-stack">
        <label class="field"><span>Price</span><input name="price" type="number" min="0" step="0.01" value="${sub.price}" required /></label>
        <label class="field"><span>Next bill</span><input name="nextBill" type="date" value="${sub.nextBill}" required /></label>
        <label class="field"><span>Cancel by</span><input name="cancelBy" type="date" value="${sub.cancelBy}" required /></label>
        <button class="btn primary block" type="submit">Save</button>
      </form>
      <button type="button" class="btn danger block" data-rm>Remove subscription</button>
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
    if (!confirm(`Stop tracking ${sub.name}?`)) return;
    Store.removeSubscription(sub.id);
    toast('Removed');
    ctx.navigate('bills');
  });
}
