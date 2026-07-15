import { buildMonthGrid, piecesForMonth } from '../stats.js';
import { Storage } from '../storage.js';
import { platformById } from '../frameworks.js';
import { escapeHtml, openModal } from './modal.js';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function renderCalendar(root, ctx) {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  function paint() {
    const { pieces, strategy, openPiece, settings } = ctx;
    const weekStartsOn = settings?.weekStartsOn ?? 1;
    const cells = buildMonthGrid(year, month, weekStartsOn);
    const monthPieces = piecesForMonth(pieces, year, month);
    const byDate = {};
    monthPieces.forEach((p) => {
      if (!byDate[p.publishDate]) byDate[p.publishDate] = [];
      byDate[p.publishDate].push(p);
    });

    const labels = [...DOW];
    if (weekStartsOn === 0) {
      labels.unshift(labels.pop());
    }

    root.innerHTML = `
      <section class="view calendar-view">
        <header class="view-header">
          <div>
            <p class="eyebrow">Schedule</p>
            <h1>${MONTHS[month]} ${year}</h1>
            <p class="sub">Target cadence: <strong>${strategy.cadencePerWeek || 0}/week</strong>. This month has <strong>${monthPieces.length}</strong> dated pieces.</p>
          </div>
          <div class="header-actions">
            <button type="button" class="btn ghost" data-prev>← Prev</button>
            <button type="button" class="btn ghost" data-today>Today</button>
            <button type="button" class="btn ghost" data-next>Next →</button>
          </div>
        </header>

        <div class="cal-grid">
          ${labels.map((d) => `<div class="cal-dow">${d}</div>`).join('')}
          ${cells.map((cell) => {
            if (!cell) return '<div class="cal-cell empty"></div>';
            const items = byDate[cell.date] || [];
            return `
              <div class="cal-cell ${cell.isToday ? 'today' : ''}" data-date="${cell.date}">
                <div class="cal-daynum">${cell.day}</div>
                <div class="cal-items">
                  ${items.slice(0, 3).map((p) => `
                    <button type="button" class="cal-item funnel-${p.funnel}" data-piece="${p.id}" title="${escapeHtml(p.title)}">
                      ${escapeHtml(p.title || 'Untitled')}
                    </button>
                  `).join('')}
                  ${items.length > 3 ? `<span class="cal-more">+${items.length - 3} more</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;

    root.querySelector('[data-prev]')?.addEventListener('click', () => {
      month -= 1;
      if (month < 0) { month = 11; year -= 1; }
      paint();
    });
    root.querySelector('[data-next]')?.addEventListener('click', () => {
      month += 1;
      if (month > 11) { month = 0; year += 1; }
      paint();
    });
    root.querySelector('[data-today]')?.addEventListener('click', () => {
      year = now.getFullYear();
      month = now.getMonth();
      paint();
    });

    root.querySelectorAll('[data-piece]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openPiece(btn.dataset.piece);
      });
    });

    root.querySelectorAll('.cal-cell[data-date]').forEach((cell) => {
      cell.addEventListener('dblclick', () => {
        quickSchedule(cell.dataset.date, ctx);
      });
    });
  }

  paint();
}

function quickSchedule(date, ctx) {
  const undated = ctx.pieces.filter((p) => !p.publishDate && !['published', 'measured'].includes(p.status));
  openModal({
    title: `Schedule for ${date}`,
    bodyHtml: `
      <p class="panel-note">Double-click a day anytime to assign a brief. Or create a new one dated here.</p>
      <label class="field">
        <span>Existing undated brief</span>
        <select id="pick-piece">
          <option value="">— Create new instead —</option>
          ${undated.map((p) => `<option value="${p.id}">${escapeHtml(p.title || 'Untitled')} · ${escapeHtml(platformById(p.platform)?.label || '')}</option>`).join('')}
        </select>
      </label>
      <label class="field">
        <span>Or new title</span>
        <input id="new-title" placeholder="Working title" />
      </label>
    `,
    footerHtml: `
      <button type="button" class="btn ghost" data-cancel>Cancel</button>
      <button type="button" class="btn primary" data-ok>Schedule</button>
    `,
    onMount(modal, close) {
      modal.querySelector('[data-cancel]')?.addEventListener('click', close);
      modal.querySelector('[data-ok]')?.addEventListener('click', () => {
        const pick = modal.querySelector('#pick-piece').value;
        if (pick) {
          Storage.updatePiece(pick, { publishDate: date, status: 'planned' });
        } else {
          const title = modal.querySelector('#new-title').value.trim() || 'Untitled brief';
          Storage.addPiece({
            title,
            publishDate: date,
            status: 'planned',
            platform: ctx.strategy.platforms?.[0] || 'blog',
            pillarId: ctx.strategy.pillars?.[0]?.id || null,
            funnel: 'tofu'
          });
        }
        ctx.toast('Scheduled');
        close();
        ctx.refresh();
      });
    }
  });
}
