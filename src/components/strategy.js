import { Storage } from '../storage.js';
import { GOALS, PLATFORMS, PILLAR_SUGGESTIONS, SETUP_STEPS, goalById } from '../frameworks.js';
import { scoreSetup } from '../stats.js';
import { escapeHtml } from './modal.js';

function uid() {
  return `pillar_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function renderStrategy(root, ctx) {
  const strategy = { ...ctx.strategy };
  strategy.pillars = (strategy.pillars || []).map((p) => ({ ...p }));
  strategy.platforms = [...(strategy.platforms || [])];
  const health = scoreSetup(strategy);
  const goal = goalById(strategy.primaryGoal);

  root.innerHTML = `
    <section class="view strategy-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Foundation</p>
          <h1>Strategy</h1>
          <p class="sub">Lock the system before you fill the calendar. Setup health: <strong>${health.score}%</strong></p>
        </div>
        <button type="button" class="btn primary" data-save>Save strategy</button>
      </header>

      <div class="strategy-layout">
        <form class="panel form-stack" id="strategy-form">
          <div class="form-row">
            <label class="field">
              <span>Brand / project</span>
              <input name="brandName" value="${escapeHtml(strategy.brandName)}" />
            </label>
            <label class="field">
              <span>Niche</span>
              <input name="niche" value="${escapeHtml(strategy.niche)}" />
            </label>
          </div>

          <label class="field">
            <span>Audience</span>
            <textarea name="audience" rows="3">${escapeHtml(strategy.audience)}</textarea>
          </label>

          <fieldset class="field">
            <legend>Primary goal</legend>
            <div class="goal-grid compact">
              ${GOALS.map((g) => `
                <label class="goal-card ${strategy.primaryGoal === g.id ? 'selected' : ''}">
                  <input type="radio" name="primaryGoal" value="${g.id}" ${strategy.primaryGoal === g.id ? 'checked' : ''} hidden />
                  <strong>${g.label}</strong>
                  <span>${g.blurb}</span>
                </label>
              `).join('')}
            </div>
          </fieldset>

          <label class="field">
            <span>Success metric</span>
            <input name="successMetric" value="${escapeHtml(strategy.successMetric)}" placeholder="The number that decides if content is working" />
          </label>

          <fieldset class="field">
            <legend>Platforms</legend>
            <div class="platform-grid">
              ${PLATFORMS.map((p) => `
                <label class="platform-chip ${strategy.platforms.includes(p.id) ? 'selected' : ''}">
                  <input type="checkbox" name="platforms" value="${p.id}" ${strategy.platforms.includes(p.id) ? 'checked' : ''} hidden />
                  ${p.label}
                </label>
              `).join('')}
            </div>
          </fieldset>

          <label class="field narrow">
            <span>Pieces per week</span>
            <input type="number" min="1" max="14" name="cadencePerWeek" value="${strategy.cadencePerWeek || 3}" />
          </label>

          <label class="field">
            <span>Voice notes</span>
            <textarea name="voiceNotes" rows="3">${escapeHtml(strategy.voiceNotes)}</textarea>
          </label>

          <div class="pillars-block">
            <div class="panel-head">
              <h2>Content pillars</h2>
              <div class="chip-row">
                <button type="button" class="chip" data-suggest="saas">SaaS</button>
                <button type="button" class="chip" data-suggest="b2b">B2B</button>
                <button type="button" class="chip" data-suggest="creator">Creator</button>
                <button type="button" class="chip" data-suggest="local">Local</button>
              </div>
            </div>
            <div id="pillar-list">
              ${strategy.pillars.map((p, i) => pillarRow(p, i)).join('') || '<p class="empty-inline">Add at least 3 pillars.</p>'}
            </div>
            <button type="button" class="btn ghost" data-add-pillar>+ Add pillar</button>
          </div>
        </form>

        <aside class="strategy-aside">
          <section class="panel">
            <h2>Target funnel mix</h2>
            <p class="panel-note">For a <strong>${escapeHtml(goal.label)}</strong> goal, aim roughly:</p>
            <ul class="mix-list">
              <li>TOFU ${goal.mix.tofu}%</li>
              <li>MOFU ${goal.mix.mofu}%</li>
              <li>BOFU ${goal.mix.bofu}%</li>
            </ul>
          </section>
          <section class="panel">
            <h2>Setup checklist</h2>
            <ul class="check-list">
              ${health.checks.map((c) => `
                <li class="${c.ok ? 'ok' : ''}">
                  <span>${c.ok ? '✓' : '○'}</span>${escapeHtml(c.label)}
                </li>
              `).join('')}
            </ul>
          </section>
          <section class="panel">
            <h2>Operating rules</h2>
            <ol class="rules">
              ${SETUP_STEPS.map((s) => `<li><strong>${escapeHtml(s.title)}</strong> ${escapeHtml(s.body)}</li>`).join('')}
            </ol>
          </section>
        </aside>
      </div>
    </section>
  `;

  const form = root.querySelector('#strategy-form');

  form.querySelectorAll('input[name="primaryGoal"]').forEach((input) => {
    input.addEventListener('change', () => {
      strategy.primaryGoal = input.value;
      ctx.refresh();
    });
  });

  form.querySelectorAll('.goal-card').forEach((card) => {
    card.addEventListener('click', () => {
      form.querySelectorAll('.goal-card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  form.querySelectorAll('.platform-chip').forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      chip.classList.toggle('selected');
      const input = chip.querySelector('input');
      input.checked = chip.classList.contains('selected');
    });
  });

  root.querySelectorAll('[data-suggest]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pack = PILLAR_SUGGESTIONS[btn.dataset.suggest] || [];
      strategy.pillars = pack.map((p) => ({ id: uid(), ...p }));
      root.querySelector('#pillar-list').innerHTML = strategy.pillars.map((p, i) => pillarRow(p, i)).join('');
      bindPillarDeletes();
    });
  });

  root.querySelector('[data-add-pillar]')?.addEventListener('click', () => {
    strategy.pillars.push({ id: uid(), name: '', promise: '' });
    root.querySelector('#pillar-list').innerHTML = strategy.pillars.map((p, i) => pillarRow(p, i)).join('');
    bindPillarDeletes();
  });

  function bindPillarDeletes() {
    root.querySelectorAll('[data-del-pillar]').forEach((btn) => {
      btn.addEventListener('click', () => {
        strategy.pillars = strategy.pillars.filter((p) => p.id !== btn.dataset.delPillar);
        root.querySelector('#pillar-list').innerHTML = strategy.pillars.map((p, i) => pillarRow(p, i)).join('') || '<p class="empty-inline">Add at least 3 pillars.</p>';
        bindPillarDeletes();
      });
    });
  }
  bindPillarDeletes();

  root.querySelector('[data-save]')?.addEventListener('click', () => {
    const fd = new FormData(form);
    const platforms = [...form.querySelectorAll('input[name="platforms"]:checked')].map((el) => el.value);
    const pillarNodes = [...root.querySelectorAll('[data-pillar-id]')];
    const pillars = pillarNodes.map((row) => ({
      id: row.dataset.pillarId,
      name: row.querySelector('[name="pillarName"]').value.trim(),
      promise: row.querySelector('[name="pillarPromise"]').value.trim()
    })).filter((p) => p.name);

    const next = Storage.saveStrategy({
      brandName: String(fd.get('brandName') || '').trim(),
      niche: String(fd.get('niche') || '').trim(),
      audience: String(fd.get('audience') || '').trim(),
      primaryGoal: String(fd.get('primaryGoal') || 'leads'),
      successMetric: String(fd.get('successMetric') || '').trim(),
      platforms,
      cadencePerWeek: Number(fd.get('cadencePerWeek') || 3),
      voiceNotes: String(fd.get('voiceNotes') || '').trim(),
      pillars
    });
    ctx.strategy = next;
    ctx.toast('Strategy saved');
    ctx.refresh();
  });
}

function pillarRow(p, i) {
  return `
    <div class="pillar-row" data-pillar-id="${p.id}">
      <label class="field">
        <span>Pillar ${i + 1}</span>
        <input name="pillarName" value="${escapeHtml(p.name)}" placeholder="Theme" />
      </label>
      <label class="field">
        <span>Promise</span>
        <input name="pillarPromise" value="${escapeHtml(p.promise || '')}" placeholder="What readers get" />
      </label>
      <button type="button" class="icon-btn" data-del-pillar="${p.id}" aria-label="Remove pillar">✕</button>
    </div>
  `;
}
