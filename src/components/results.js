import { Storage } from '../storage.js';
import { GOALS, platformById } from '../frameworks.js';
import { escapeHtml, openModal } from './modal.js';

export function renderResults(root, ctx) {
  const { pieces, strategy, toast, refresh, openPiece } = ctx;
  const goal = GOALS.find((g) => g.id === strategy.primaryGoal);
  const published = pieces
    .filter((p) => ['published', 'measured'].includes(p.status) || p.publishDate)
    .sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || ''));

  const logged = pieces.filter((p) => p.results?.loggedAt);
  const totals = logged.reduce(
    (acc, p) => {
      acc.views += Number(p.results.views) || 0;
      acc.clicks += Number(p.results.clicks) || 0;
      acc.leads += Number(p.results.leads) || 0;
      acc.conversions += Number(p.results.conversions) || 0;
      return acc;
    },
    { views: 0, clicks: 0, leads: 0, conversions: 0 }
  );

  const ranked = [...logged].sort((a, b) => scorePiece(b, strategy.primaryGoal) - scorePiece(a, strategy.primaryGoal));

  root.innerHTML = `
    <section class="view results-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Feedback loop</p>
          <h1>Results</h1>
          <p class="sub">Log outcomes against <strong>${escapeHtml(goal?.label || 'your goal')}</strong>
            ${strategy.successMetric ? `· <em>${escapeHtml(strategy.successMetric)}</em>` : ''}.
            Winners get repeated; losers get retired.</p>
        </div>
      </header>

      <div class="dash-metrics">
        <article class="metric"><span>Views</span><strong>${fmt(totals.views)}</strong><p>Logged pieces</p></article>
        <article class="metric"><span>Clicks</span><strong>${fmt(totals.clicks)}</strong><p>Site / profile</p></article>
        <article class="metric"><span>Leads</span><strong>${fmt(totals.leads)}</strong><p>Signups / replies</p></article>
        <article class="metric"><span>Conversions</span><strong>${fmt(totals.conversions)}</strong><p>Sales / demos</p></article>
      </div>

      <div class="results-layout">
        <section class="panel">
          <div class="panel-head">
            <h2>Log performance</h2>
          </div>
          <ul class="piece-list">
            ${published.slice(0, 20).map((p) => `
              <li>
                <div class="piece-row static">
                  <div>
                    <strong>${escapeHtml(p.title || 'Untitled')}</strong>
                    <span>${escapeHtml(p.publishDate || 'No date')} · ${escapeHtml(platformById(p.platform)?.label || '')}
                      ${p.results?.loggedAt ? ` · logged` : ' · <b class="warn-text">needs data</b>'}</span>
                  </div>
                  <div class="row-actions">
                    <button type="button" class="text-btn" data-open="${p.id}">Brief</button>
                    <button type="button" class="btn ghost" data-log="${p.id}">${p.results?.loggedAt ? 'Update' : 'Log results'}</button>
                  </div>
                </div>
              </li>
            `).join('') || `<li class="empty-inline">Publish something first, then come back within 7–14 days to log what happened.</li>`}
          </ul>
        </section>

        <section class="panel">
          <div class="panel-head"><h2>What’s working</h2></div>
          <ol class="ranked-list">
            ${ranked.slice(0, 8).map((p, i) => `
              <li>
                <span class="rank">${i + 1}</span>
                <div>
                  <strong>${escapeHtml(p.title || 'Untitled')}</strong>
                  <span>Score ${scorePiece(p, strategy.primaryGoal)} · ${escapeHtml(platformById(p.platform)?.label || '')}
                    ${p.results?.notes ? ` — ${escapeHtml(p.results.notes)}` : ''}</span>
                </div>
              </li>
            `).join('') || `<li class="empty-inline">No results logged yet. Measurement turns opinions into a playbook.</li>`}
          </ol>
          <div class="insight-box">
            <h3>How to use this</h3>
            <ul>
              <li>Double down on formats/pillars in your top 3.</li>
              <li>Rewrite losers with a sharper hook — or kill the angle.</li>
              <li>Every BOFU win should spawn 2 TOFU pieces that feed the same offer.</li>
            </ul>
          </div>
        </section>
      </div>
    </section>
  `;

  root.querySelectorAll('[data-open]').forEach((btn) => {
    btn.addEventListener('click', () => openPiece(btn.dataset.open));
  });
  root.querySelectorAll('[data-log]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const piece = pieces.find((p) => p.id === btn.dataset.log);
      logModal(piece, { toast, refresh });
    });
  });
}

function scorePiece(p, goalId) {
  const r = p.results || {};
  const views = Number(r.views) || 0;
  const clicks = Number(r.clicks) || 0;
  const leads = Number(r.leads) || 0;
  const conversions = Number(r.conversions) || 0;
  if (goalId === 'traffic') return views + clicks * 3;
  if (goalId === 'authority') return views * 0.5 + clicks * 2 + leads * 5;
  if (goalId === 'sales') return conversions * 50 + leads * 10 + clicks;
  return leads * 20 + conversions * 40 + clicks * 2 + views * 0.1;
}

function logModal(piece, { toast, refresh }) {
  if (!piece) return;
  openModal({
    title: `Results · ${piece.title || 'Untitled'}`,
    bodyHtml: `
      <form id="results-form" class="form-stack">
        <div class="form-row">
          <label class="field"><span>Views / impressions</span><input type="number" min="0" name="views" value="${piece.results?.views ?? ''}" /></label>
          <label class="field"><span>Clicks</span><input type="number" min="0" name="clicks" value="${piece.results?.clicks ?? ''}" /></label>
        </div>
        <div class="form-row">
          <label class="field"><span>Leads</span><input type="number" min="0" name="leads" value="${piece.results?.leads ?? ''}" /></label>
          <label class="field"><span>Conversions</span><input type="number" min="0" name="conversions" value="${piece.results?.conversions ?? ''}" /></label>
        </div>
        <label class="field">
          <span>What did you learn?</span>
          <textarea name="notes" rows="4" placeholder="Hook worked / CTA ignored / topic resonated with ___">${escapeHtml(piece.results?.notes || '')}</textarea>
        </label>
      </form>
    `,
    footerHtml: `
      <button type="button" class="btn ghost" data-cancel>Cancel</button>
      <button type="button" class="btn primary" data-save>Save results</button>
    `,
    onMount(modal, close) {
      modal.querySelector('[data-cancel]')?.addEventListener('click', close);
      modal.querySelector('[data-save]')?.addEventListener('click', () => {
        const fd = new FormData(modal.querySelector('#results-form'));
        const num = (k) => {
          const v = fd.get(k);
          return v === '' || v == null ? null : Number(v);
        };
        Storage.updatePiece(piece.id, {
          status: 'measured',
          results: {
            views: num('views'),
            clicks: num('clicks'),
            leads: num('leads'),
            conversions: num('conversions'),
            notes: String(fd.get('notes') || '').trim(),
            loggedAt: new Date().toISOString()
          }
        });
        toast('Results saved');
        close();
        refresh();
      });
    }
  });
}

function fmt(n) {
  if (!n) return '0';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
