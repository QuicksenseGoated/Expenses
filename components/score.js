import { BIZ } from '../strategy.js';
import { DB } from '../storage.js';
import { esc, toast, $, $all, modal, brandHead } from './ui.js';

export function renderScore(root, ctx) {
  const m = DB.getMetrics();
  const decisions = DB.getDecisions();
  const hist = m.history || [];
  const dAcv = hist.length > 1 && hist[0].acv != null && hist[1].acv != null
    ? hist[0].acv - hist[1].acv
    : null;
  const dTt = hist.length > 1 && hist[0].ttWeek != null && hist[1].ttWeek != null
    ? hist[0].ttWeek - hist[1].ttWeek
    : null;

  root.innerHTML = `
    ${brandHead('Numbers that matter')}

    <section class="scorestrip big" aria-label="Current KPIs">
      <div>
        <b>${m.acv ?? '—'}</b>
        <span>ACV ${delta(dAcv)}</span>
      </div>
      <div>
        <b>${fmt(m.ttWeek)}</b>
        <span>TT/wk ${delta(dTt)}</span>
      </div>
      <div>
        <b>${fmt(m.followers)}</b>
        <span>Followers</span>
      </div>
    </section>

    <form id="kpi-form" class="card stack" style="margin-top:10px">
      <h2>Update numbers</h2>
      <label class="field"><span>Twitch ACV</span><input type="number" min="0" name="acv" value="${m.acv ?? ''}" inputmode="decimal" /></label>
      <label class="field"><span>TikTok views this week</span><input type="number" min="0" name="ttWeek" value="${m.ttWeek ?? ''}" inputmode="numeric" /></label>
      <label class="field"><span>Twitch followers</span><input type="number" min="0" name="followers" value="${m.followers ?? ''}" inputmode="numeric" /></label>
      <label class="field"><span>Note</span><input name="note" placeholder="good KOTH week / dead week" autocomplete="off" /></label>
      <button class="btn primary block" type="submit">Save</button>
    </form>

    <section class="card">
      <div class="rowbetween">
        <h2>Calls</h2>
        <button type="button" class="btn sm" data-dec>+ Add</button>
      </div>
      <p class="muted">Keep it, kill it, or test it. Write it down so you don’t argue with yourself next month.</p>
      <ul class="list">
        ${decisions.map((d) => `
          <li>
            <div>
              <strong class="pill ${esc(d.kind)}">${esc(d.kind)}</strong>
              <span>${esc(d.text)}</span>
              <span class="muted">${esc(d.date)}</span>
            </div>
            <button type="button" class="link" data-del="${d.id}">Del</button>
          </li>
        `).join('') || '<li class="muted">e.g. kill the wheel · double KOTH Fridays</li>'}
      </ul>
    </section>

    ${hist.length ? `
      <section class="card">
        <h2>History</h2>
        <ul class="list">
          ${hist.slice(0, 10).map((h) => `
            <li>
              <div>
                <strong>${esc(h.date)}</strong>
                <span class="muted">ACV ${h.acv ?? '—'} · TT ${fmt(h.ttWeek)}${h.note ? ` · ${esc(h.note)}` : ''}</span>
              </div>
            </li>
          `).join('')}
        </ul>
      </section>
    ` : ''}

    <p class="hint center">North star stays ${esc(BIZ.primaryMetric)}.</p>
  `;

  $('#kpi-form', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const num = (k) => (fd.get(k) === '' ? null : Number(fd.get(k)));
    DB.saveMetrics({
      acv: num('acv'),
      ttWeek: num('ttWeek'),
      followers: num('followers'),
      note: String(fd.get('note') || '').trim()
    });
    toast('Saved');
    ctx.refresh();
  });

  $('[data-dec]', root)?.addEventListener('click', () => {
    modal({
      title: 'Log a call',
      okLabel: 'Add',
      body: `
        <label class="field"><span>Kind</span>
          <select id="d-kind">
            <option value="keep">keep</option>
            <option value="kill">kill</option>
            <option value="test">test</option>
          </select>
        </label>
        <label class="field"><span>What</span>
          <input id="d-text" required placeholder="Double KOTH on Fridays" />
        </label>
      `,
      onOk: (overlay) => {
        const text = $('#d-text', overlay).value.trim();
        if (!text) return false;
        DB.addDecision(text, $('#d-kind', overlay).value);
        toast('Logged');
        ctx.refresh();
      }
    });
  });

  $all('[data-del]', root).forEach((b) => {
    b.addEventListener('click', () => {
      DB.deleteDecision(b.dataset.del);
      ctx.refresh();
    });
  });
}

function fmt(n) {
  if (n == null || n === '') return '—';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function delta(n) {
  if (n == null) return '';
  if (n === 0) return '· flat';
  return n > 0 ? `· +${fmt(n)}` : `· ${fmt(n)}`;
}
