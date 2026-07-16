import { TRAIN_AXES, weekKey, BIZ } from '../strategy.js';
import { DB } from '../storage.js';
import { esc, toast, $all, $ } from './ui.js';

export function renderTrain(root, ctx) {
  const t = DB.getTrain();
  const scores = { ...Object.fromEntries(TRAIN_AXES.map((a) => [a.id, 3])), ...(t.scores || {}) };
  const avg = average(scores);
  const weak = weakest(scores);
  const axis = TRAIN_AXES.find((a) => a.id === weak) || TRAIN_AXES[0];

  root.innerHTML = `
    <header class="brand-head">
      <p class="brand">${esc(BIZ.name)}</p>
      <p class="brand-sub">Trainer · ${esc(weekKey())}</p>
    </header>

    <header class="top tight">
      <div>
        <p class="kicker">Weekly scorecard</p>
        <h1>Grade the ops</h1>
      </div>
      <div class="grade ${gradeClass(avg)}" aria-label="Average score">${avg.toFixed(1)}</div>
    </header>

    <p class="hint">Five axes. Save every Sunday. The #1 drill is your weakest link — that is tomorrow’s job.</p>

    <section class="card drill">
      <p class="kicker">#1 drill</p>
      <h2>${esc(axis.name)}</h2>
      <p>${esc(axis.drill)}</p>
    </section>

    <form id="train-form" class="stack">
      ${TRAIN_AXES.map((a) => `
        <label class="card axis">
          <div class="axis-top">
            <strong>${esc(a.name)}</strong>
            <output data-out="${a.id}">${scores[a.id]}</output>
          </div>
          <p class="muted">${esc(a.ask)}</p>
          <input type="range" min="1" max="5" step="1" name="${a.id}" value="${scores[a.id]}" data-range="${a.id}" />
        </label>
      `).join('')}
      <label class="field">
        <span>Ops note</span>
        <textarea name="note" rows="2" placeholder="What broke? What worked?">${esc(t.note || '')}</textarea>
      </label>
      <button type="submit" class="btn primary block">Save scorecard</button>
    </form>
  `;

  $all('[data-range]', root).forEach((input) => {
    input.addEventListener('input', () => {
      const out = $(`[data-out="${input.dataset.range}"]`, root);
      if (out) out.textContent = input.value;
    });
  });

  $('#train-form', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = {};
    TRAIN_AXES.forEach((a) => { next[a.id] = Number(fd.get(a.id)); });
    DB.saveTrain(next, String(fd.get('note') || '').trim());
    toast('Scorecard saved');
    ctx.refresh();
  });
}

function average(scores) {
  const vals = Object.values(scores).map(Number);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function weakest(scores) {
  return Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
}

function gradeClass(avg) {
  if (avg >= 4) return 'good';
  if (avg >= 3) return 'ok';
  return 'bad';
}
