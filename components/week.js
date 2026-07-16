import {
  WEEKDAY, FORMATS, formatById, todayIndex, QUOTAS
} from '../strategy.js';
import { DB } from '../storage.js';
import { esc, toast, $all, brandHead } from './ui.js';

export function renderWeek(root, ctx) {
  const plan = DB.getPlan();
  const prog = DB.weekProgress();
  const m = DB.getMetrics();
  const today = todayIndex();

  root.innerHTML = `
    ${brandHead(`Week of ${plan.week}`)}

    <section class="scorestrip" aria-label="Week KPIs">
      <div><b>${prog.pct}%</b><span>done</span></div>
      <div><b>${m.acv ?? '—'}</b><span>ACV</span></div>
      <div><b>${fmt(m.ttWeek)}</b><span>TT/wk</span></div>
    </section>
    <div class="bar" aria-hidden="true"><i style="width:${prog.pct}%"></i></div>

    <p class="hint">${QUOTAS.siegeStreams} Siege days, 1 variety. Pick a format, go live, approve Ladder, raid out. That’s the whole loop.</p>

    <div class="daylist">
      ${plan.days.map((day, i) => dayCard(day, i, today)).join('')}
    </div>
  `;

  $all('[data-fmt]', root).forEach((sel) => {
    sel.addEventListener('change', () => {
      DB.setDayFormat(Number(sel.dataset.fmt), sel.value || null);
      toast('Saved');
      ctx.refresh();
    });
  });

  $all('[data-check]', root).forEach((el) => {
    el.addEventListener('change', () => {
      const [i, key] = el.dataset.check.split(':');
      DB.toggleDone(Number(i), key);
      ctx.refresh();
    });
  });
}

function dayCard(day, i, today) {
  const fmtObj = day.formatId ? formatById(day.formatId) : null;
  const isToday = i === today;
  const ops = day.type === 'ops';
  const options = FORMATS
    .filter((f) => (day.type === 'variety' ? f.pillar === 'expand' : f.pillar !== 'expand' || f.id === 'variety'))
    .map((f) => `<option value="${f.id}" ${day.formatId === f.id ? 'selected' : ''}>${esc(f.name)}</option>`)
    .join('');

  return `
    <article class="day ${isToday ? 'today' : ''} ${ops ? 'ops' : ''}">
      <div class="day-head">
        <div class="day-title">
          <strong>${WEEKDAY[i]}</strong>
          <span class="pill">${day.type}</span>
          ${isToday ? '<span class="pill accent">today</span>' : ''}
        </div>
        ${!ops ? `<span class="hrs">${day.hours}h</span>` : ''}
      </div>

      ${ops ? `
        <p class="muted">Off-stream day. Drop ACV + TikTok numbers in Score, skim next week’s formats, make sure the raid list isn’t empty.</p>
        <label class="check"><input type="checkbox" data-check="${i}:ops" ${DB.isDone(i, 'ops') ? 'checked' : ''}/> Numbers logged</label>
      ` : `
        <label class="field">
          <span>Format</span>
          <select data-fmt="${i}" aria-label="Format for ${WEEKDAY[i]}">${options}</select>
        </label>
        ${fmtObj ? `<p class="title-line"><span>Title</span> ${esc(fmtObj.title)}</p>` : ''}
        <div class="checks">
          <label class="check"><input type="checkbox" data-check="${i}:live" ${DB.isDone(i, 'live') ? 'checked' : ''}/> Went live</label>
          <label class="check"><input type="checkbox" data-check="${i}:ladder" ${DB.isDone(i, 'ladder') ? 'checked' : ''}/> Ladder approved</label>
          <label class="check"><input type="checkbox" data-check="${i}:raid" ${DB.isDone(i, 'raid') ? 'checked' : ''}/> Raided out</label>
        </div>
        ${fmtObj && isToday ? `
          <details class="sop" open>
            <summary>Today’s run sheet</summary>
            <ol>${fmtObj.setup.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
            <p class="muted">Looks good when: ${esc(fmtObj.success)}</p>
          </details>
        ` : ''}
      `}
    </article>
  `;
}

function fmt(n) {
  if (n == null || n === '') return '—';
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
