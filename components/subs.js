import { Store } from '../store.js';
import { searchCatalog, CATEGORIES, catalogById } from '../catalog.js';
import { brandHead, esc, money, niceDate, daysUntil, toast, addDaysISO, $ } from './ui.js';

export function renderSubs(root, ctx) {
  const s = Store.get();
  const mine = s.subscriptions;
  const total = mine.reduce((sum, x) => sum + Number(x.price), 0);

  root.innerHTML = `
    ${brandHead('Subscriptions')}

    <section class="hero-card compact">
      <p class="label">Your stack</p>
      <p class="amount sm">${mine.length ? money(total, s.currency) : money(0, s.currency)}<span>/mo</span></p>
      <p class="meta">${mine.length ? `${mine.length} active` : 'Empty — search and add real services below'}</p>
    </section>

    ${mine.length ? `
      <section class="block">
        <div class="block-head"><h2>Active</h2></div>
        <div class="list">
          ${mine.map((sub) => `
            <button type="button" class="row" data-mysub="${sub.id}">
              <div>
                <strong>${esc(sub.name)}</strong>
                <span>${esc(sub.category)} · next ${niceDate(sub.nextBill)} (${daysUntil(sub.nextBill)}d)</span>
              </div>
              <b>${money(sub.price, sub.currency)}</b>
            </button>
          `).join('')}
        </div>
      </section>
    ` : `
      <section class="block">
        <div class="empty">
          <p>No placeholder junk — only what you add.</p>
        </div>
      </section>
    `}

    <section class="block">
      <div class="block-head"><h2>Find a subscription</h2></div>
      <label class="field">
        <span>Search</span>
        <input id="q" type="search" placeholder="Netflix, gym, Adobe…" autocomplete="off" />
      </label>
      <div class="chips" id="cats">
        ${CATEGORIES.map((c, i) => `
          <button type="button" class="chip-btn ${i === 0 ? 'active' : ''}" data-cat="${esc(c)}">${esc(c)}</button>
        `).join('')}
      </div>
      <div class="list" id="results"></div>
    </section>
  `;

  let category = 'All';
  const q = $('#q', root);
  const results = $('#results', root);

  const paintResults = () => {
    const rows = searchCatalog(q.value, category).slice(0, 40);
    results.innerHTML = rows.map((c) => {
      const owned = mine.some((m) => m.catalogId === c.id);
      return `
        <button type="button" class="row tall" data-catid="${c.id}">
          <div>
            <strong>${esc(c.name)}</strong>
            <span>${esc(c.category)} · typically ${money(c.typicalPrice, c.currency)}/${esc(c.cycle)}</span>
          </div>
          <span class="pill">${owned ? 'Added' : 'View'}</span>
        </button>
      `;
    }).join('') || `<p class="empty-inline">No matches. Try another name.</p>`;

    results.querySelectorAll('[data-catid]').forEach((btn) => {
      btn.addEventListener('click', () => ctx.openCatalog(btn.dataset.catid));
    });
  };

  q.addEventListener('input', paintResults);
  root.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('[data-cat]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      category = btn.dataset.cat;
      paintResults();
    });
  });

  root.querySelectorAll('[data-mysub]').forEach((b) => {
    b.addEventListener('click', () => ctx.openMySub(b.dataset.mysub));
  });

  paintResults();
}

export function renderCatalogDetail(root, ctx, catalogId) {
  const c = catalogById(catalogId);
  if (!c) {
    root.innerHTML = `<p class="empty">Not found.</p>`;
    return;
  }
  const s = Store.get();
  const owned = s.subscriptions.find((x) => x.catalogId === c.id);

  root.innerHTML = `
    <header class="detail-head">
      <button type="button" class="back" data-back aria-label="Back">←</button>
      <div>
        <p class="eyebrow">${esc(c.category)}</p>
        <h1>${esc(c.name)}</h1>
      </div>
    </header>

    <section class="hero-card compact">
      <p class="label">Typical price</p>
      <p class="amount sm">${money(c.typicalPrice, c.currency)}<span>/${esc(c.cycle)}</span></p>
      <p class="meta">You can edit the real price when adding.</p>
    </section>

    <section class="block">
      <h2>Why people pay</h2>
      <p class="body">${esc(c.why)}</p>
    </section>
    <section class="block">
      <h2>When to use it</h2>
      <p class="body">${esc(c.when)}</p>
    </section>
    <section class="block">
      <h2>How to manage it</h2>
      <p class="body">${esc(c.how)}</p>
      <p class="tip">${esc(c.tip)}</p>
      <div class="btn-row wrap">
        <a class="btn" href="${esc(c.url)}" target="_blank" rel="noopener">Open site</a>
        ${c.manageUrl ? `<a class="btn" href="${esc(c.manageUrl)}" target="_blank" rel="noopener">Manage / cancel</a>` : ''}
      </div>
    </section>

    ${owned ? `
      <section class="block">
        <p class="body">Already in your stack.</p>
        <button type="button" class="btn primary block" data-open-owned>Open my subscription</button>
      </section>
    ` : `
      <section class="block">
        <h2>Add to Financer</h2>
        <form id="add-form" class="stack">
          <label class="field"><span>Your price</span>
            <input name="price" type="number" min="0" step="0.01" value="${c.typicalPrice}" required />
          </label>
          <label class="field"><span>Next bill date</span>
            <input name="nextBill" type="date" value="${addDaysISO(14)}" required />
          </label>
          <label class="field"><span>Cancel-by date</span>
            <input name="cancelBy" type="date" value="${addDaysISO(13)}" required />
          </label>
          <button class="btn primary block" type="submit">Add subscription</button>
        </form>
      </section>
    `}
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => ctx.back());
  root.querySelector('[data-open-owned]')?.addEventListener('click', () => ctx.openMySub(owned.id));

  $('#add-form', root)?.addEventListener('submit', (e) => {
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
    toast('Added');
    ctx.navigate('subs');
  });
}

export function renderMySubDetail(root, ctx, id) {
  const s = Store.get();
  const sub = s.subscriptions.find((x) => x.id === id);
  if (!sub) {
    root.innerHTML = `<p class="empty">Subscription gone.</p>`;
    return;
  }
  const dBill = daysUntil(sub.nextBill);
  const dCancel = daysUntil(sub.cancelBy);

  root.innerHTML = `
    <header class="detail-head">
      <button type="button" class="back" data-back aria-label="Back">←</button>
      <div>
        <p class="eyebrow">${esc(sub.category)}</p>
        <h1>${esc(sub.name)}</h1>
      </div>
    </header>

    <section class="hero-card compact">
      <p class="label">${esc(sub.cycle)} bill</p>
      <p class="amount sm">${money(sub.price, sub.currency)}</p>
      <p class="meta">Next ${niceDate(sub.nextBill)} · in ${dBill}d · cancel by ${niceDate(sub.cancelBy)} (${dCancel}d)</p>
    </section>

    <section class="block">
      <h2>Why / when / how</h2>
      <p class="body"><b>Why:</b> ${esc(sub.why)}</p>
      <p class="body"><b>When:</b> ${esc(sub.when)}</p>
      <p class="body"><b>How:</b> ${esc(sub.how)}</p>
      ${sub.tip ? `<p class="tip">${esc(sub.tip)}</p>` : ''}
      <div class="btn-row wrap">
        ${sub.url ? `<a class="btn" href="${esc(sub.url)}" target="_blank" rel="noopener">Open site</a>` : ''}
        ${sub.manageUrl ? `<a class="btn" href="${esc(sub.manageUrl)}" target="_blank" rel="noopener">Cancel page</a>` : ''}
      </div>
    </section>

    <section class="block">
      <h2>Actions</h2>
      <form id="edit-form" class="stack">
        <label class="field"><span>Price</span>
          <input name="price" type="number" min="0" step="0.01" value="${sub.price}" required />
        </label>
        <label class="field"><span>Next bill</span>
          <input name="nextBill" type="date" value="${sub.nextBill}" required />
        </label>
        <label class="field"><span>Cancel by</span>
          <input name="cancelBy" type="date" value="${sub.cancelBy}" required />
        </label>
        <button class="btn primary block" type="submit">Save changes</button>
      </form>
      <button type="button" class="btn danger block" data-remove style="margin-top:8px">Remove subscription</button>
    </section>
  `;

  root.querySelector('[data-back]')?.addEventListener('click', () => ctx.back());

  $('#edit-form', root)?.addEventListener('submit', (e) => {
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

  root.querySelector('[data-remove]')?.addEventListener('click', () => {
    if (!confirm(`Remove ${sub.name}?`)) return;
    Store.removeSubscription(sub.id);
    toast('Removed');
    ctx.navigate('subs');
  });
}
