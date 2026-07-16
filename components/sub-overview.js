import { Store } from '../store.js';
import { getCatalogEntry } from '../catalog.js';
import { esc, money, niceDate, sheet } from './ui.js';
import { getSubLifecycle } from '../trials.js';

let fabEl = null;

export function buildOverviewRows(subs = Store.get().subscriptions) {
  return subs.map((sub) => {
    const life = getSubLifecycle(sub);
    const entry = getCatalogEntry(sub.catalogId);
    const label = entry?.displayName || sub.name;
    const soonest = Math.min(
      life.daysUntilCharge ?? 9999,
      life.daysUntilCancel ?? 9999,
      life.onTrial ? (life.trialDaysLeft ?? 9999) : 9999,
    );
    let status = `Renews in ${life.daysUntilCharge}d`;
    let level = 'ok';
    if (life.onTrial) {
      status = `Trial · ${life.trialDaysLeft}d left`;
      level = life.urgentTrial ? 'urgent' : 'trial';
    } else if (life.urgentCancel || life.daysUntilCancel <= 5) {
      status = `Cancel in ${life.daysUntilCancel}d`;
      level = 'urgent';
    } else if (life.urgentCharge || life.daysUntilCharge <= 7) {
      status = `Due in ${life.daysUntilCharge}d`;
      level = 'warn';
    }
    return { sub, label, life, status, level, soonest };
  }).sort((a, b) => a.soonest - b.soonest || a.label.localeCompare(b.label));
}

function escapeCsv(value) {
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function exportSubsCsv(rows, currency = Store.get().currency) {
  const header = ['Service', 'Price', 'Currency', 'Cycle', 'Next bill', 'Cancel by', 'Trial ends', 'Status'];
  const lines = rows.map(({ sub, label, status }) => [
    label,
    sub.price,
    currency,
    sub.cycle,
    sub.nextBill,
    sub.cancelBy,
    sub.trialEnds || '',
    status,
  ]);
  const csv = [header, ...lines].map((row) => row.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `financer-subscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function overviewTableHtml(rows, currency) {
  if (!rows.length) return '<p class="empty-sm">No subscriptions tracked.</p>';
  return `
    <div class="overview-table-wrap">
      <table class="overview-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Price</th>
            <th>Renews</th>
            <th>Cancel</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(({ sub, label, life, status, level }) => `
            <tr class="overview-row ${level}" data-sub="${esc(sub.id)}">
              <td class="overview-name">${esc(label)}</td>
              <td>${money(sub.price, currency)}</td>
              <td>${niceDate(sub.nextBill)}<span class="overview-d">${life.daysUntilCharge}d</span></td>
              <td>${niceDate(sub.cancelBy)}<span class="overview-d">${life.daysUntilCancel}d</span></td>
              <td><span class="overview-pill ${level}">${esc(status)}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

export async function openSubOverview(ctx) {
  const s = Store.get();
  const rows = buildOverviewRows(s.subscriptions);
  const urgent = rows.filter((r) => r.level === 'urgent').length;
  const total = Store.subsMonthly();

  await sheet({
    title: 'Subscription overview',
    body: `
      <div class="overview-toolbar">
        <p class="overview-summary">${rows.length} subs · ${money(total, s.currency)}/mo${urgent ? ` · <strong class="urgent-text">${urgent} urgent</strong>` : ''}</p>
        <button type="button" class="btn outline" data-overview-export>Export Excel</button>
      </div>
      <p class="overview-hint">Tap a row to open details. Red = action needed within a few days.</p>
      ${overviewTableHtml(rows, s.currency)}
    `,
    onOpen(overlay) {
      overlay.querySelector('[data-overview-export]')?.addEventListener('click', () => {
        exportSubsCsv(rows, s.currency);
      });
      overlay.querySelectorAll('[data-sub]').forEach((row) => {
        row.addEventListener('click', () => {
          overlay.classList.remove('open');
          setTimeout(() => overlay.remove(), 200);
          ctx.openSub(row.dataset.sub);
        });
      });
    },
  });
}

export function syncOverviewFab(ctx, route, overlay) {
  const subs = Store.get().subscriptions;
  const show = route === 'bills' && !overlay && subs.length > 0;
  const phone = document.querySelector('.phone');

  if (!show) {
    fabEl?.remove();
    fabEl = null;
    return;
  }

  if (!fabEl && phone) {
    fabEl = document.createElement('button');
    fabEl.type = 'button';
    fabEl.className = 'overview-fab';
    fabEl.setAttribute('aria-label', 'Subscription overview');
    fabEl.innerHTML = '<span class="overview-fab-icon" aria-hidden="true">⊞</span><span class="overview-fab-label">Overview</span>';
    fabEl.addEventListener('click', () => openSubOverview(ctx));
    phone.appendChild(fabEl);
  }
}
