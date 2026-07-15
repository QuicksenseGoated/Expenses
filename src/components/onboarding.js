import { Storage } from '../storage.js';
import { GOALS, PLATFORMS, PILLAR_SUGGESTIONS, SETUP_STEPS } from '../frameworks.js';

function uid() {
  return `pillar_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function renderOnboarding(root, { onComplete }) {
  let step = 0;
  const draft = {
    brandName: '',
    niche: '',
    audience: '',
    primaryGoal: 'leads',
    platforms: ['blog', 'linkedin'],
    cadencePerWeek: 3,
    pillars: [
      { id: uid(), name: '', promise: '' },
      { id: uid(), name: '', promise: '' },
      { id: uid(), name: '', promise: '' }
    ],
    successMetric: '',
    voiceNotes: ''
  };

  const steps = [
    { id: 'welcome', title: 'Build a content system that compounds' },
    { id: 'goal', title: 'What result should content produce?' },
    { id: 'audience', title: 'Who are you talking to?' },
    { id: 'pillars', title: 'What themes can you own?' },
    { id: 'cadence', title: 'What pace can you keep?' },
    { id: 'ready', title: 'Your operating system is ready' }
  ];

  function paint() {
    const s = steps[step];
    root.innerHTML = `
      <div class="onboard">
        <div class="onboard-atmosphere" aria-hidden="true"></div>
        <div class="onboard-panel">
          <div class="onboard-brand">Cadence</div>
          <div class="onboard-progress" aria-hidden="true">
            ${steps.map((_, i) => `<span class="${i <= step ? 'on' : ''}"></span>`).join('')}
          </div>
          <p class="onboard-kicker">Step ${step + 1} of ${steps.length}</p>
          <h1>${s.title}</h1>
          <div class="onboard-body">${bodyFor(s.id)}</div>
          <div class="onboard-actions">
            ${step > 0 ? `<button type="button" class="btn ghost" data-back>Back</button>` : '<span></span>'}
            <button type="button" class="btn primary" data-next>
              ${step === steps.length - 1 ? 'Open my planner' : 'Continue'}
            </button>
          </div>
        </div>
        <aside class="onboard-rail">
          <h3>How real results happen</h3>
          <ol>
            ${SETUP_STEPS.map((x) => `<li><strong>${x.title}</strong><span>${x.body}</span></li>`).join('')}
          </ol>
        </aside>
      </div>
    `;

    root.querySelector('[data-back]')?.addEventListener('click', () => {
      collect();
      step -= 1;
      paint();
    });
    root.querySelector('[data-next]')?.addEventListener('click', () => {
      if (!collect(true)) return;
      if (step === steps.length - 1) {
        finish();
        return;
      }
      step += 1;
      paint();
    });

    root.querySelectorAll('[data-goal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        draft.primaryGoal = btn.dataset.goal;
        paint();
      });
    });

    root.querySelectorAll('[data-platform]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.platform;
        if (draft.platforms.includes(id)) {
          draft.platforms = draft.platforms.filter((p) => p !== id);
        } else {
          draft.platforms = [...draft.platforms, id];
        }
        paint();
      });
    });

    root.querySelectorAll('[data-suggest]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pack = PILLAR_SUGGESTIONS[btn.dataset.suggest] || [];
        draft.pillars = pack.slice(0, 4).map((p) => ({ id: uid(), ...p }));
        paint();
      });
    });

    root.querySelector('[data-add-pillar]')?.addEventListener('click', () => {
      collect();
      draft.pillars.push({ id: uid(), name: '', promise: '' });
      paint();
    });
  }

  function bodyFor(id) {
    if (id === 'welcome') {
      return `
        <p class="lede">Most calendars fail because they start with “what should we post?” Cadence starts with the outcome, then forces pillars, briefs, and measurement so publishing isn’t random.</p>
        <div class="welcome-points">
          <div><span>01</span><p>Strategy first — goal, audience, pillars</p></div>
          <div><span>02</span><p>Briefs before drafts — hook, promise, proof, CTA</p></div>
          <div><span>03</span><p>Pipeline + calendar that match a real weekly cadence</p></div>
          <div><span>04</span><p>Results logged so winners get repeated</p></div>
        </div>
      `;
    }
    if (id === 'goal') {
      return `
        <p class="lede">Pick the metric that owns the calendar. Everything you publish should push this number.</p>
        <div class="goal-grid">
          ${GOALS.map((g) => `
            <button type="button" class="goal-card ${draft.primaryGoal === g.id ? 'selected' : ''}" data-goal="${g.id}">
              <strong>${g.label}</strong>
              <span>${g.blurb}</span>
              <em>Track: ${g.metricHint}</em>
            </button>
          `).join('')}
        </div>
        <label class="field">
          <span>Success metric (plain English)</span>
          <input type="text" data-field="successMetric" value="${esc(draft.successMetric)}" placeholder="e.g. 40 demo requests / month from content" />
        </label>
      `;
    }
    if (id === 'audience') {
      return `
        <label class="field">
          <span>Brand or project name</span>
          <input type="text" data-field="brandName" value="${esc(draft.brandName)}" placeholder="Acme Analytics" />
        </label>
        <label class="field">
          <span>Niche / category</span>
          <input type="text" data-field="niche" value="${esc(draft.niche)}" placeholder="B2B ops software for mid-market teams" />
        </label>
        <label class="field">
          <span>Who is this for? (be specific)</span>
          <textarea data-field="audience" rows="4" placeholder="Ops managers at 50–200 person companies who are drowning in spreadsheet workflows and need a system their team will actually adopt.">${esc(draft.audience)}</textarea>
        </label>
      `;
    }
    if (id === 'pillars') {
      return `
        <p class="lede">Pillars are the only themes you publish under. Start with 3–5. Use a starter pack if you want a head start.</p>
        <div class="chip-row">
          <button type="button" class="chip" data-suggest="saas">SaaS pack</button>
          <button type="button" class="chip" data-suggest="b2b">B2B pack</button>
          <button type="button" class="chip" data-suggest="creator">Creator pack</button>
          <button type="button" class="chip" data-suggest="local">Local biz pack</button>
        </div>
        <div class="pillar-editor">
          ${draft.pillars.map((p, i) => `
            <div class="pillar-row">
              <label class="field">
                <span>Pillar ${i + 1}</span>
                <input type="text" data-pillar-name="${p.id}" value="${esc(p.name)}" placeholder="Theme name" />
              </label>
              <label class="field">
                <span>Reader promise</span>
                <input type="text" data-pillar-promise="${p.id}" value="${esc(p.promise)}" placeholder="What they get from this theme" />
              </label>
            </div>
          `).join('')}
        </div>
        <button type="button" class="btn ghost" data-add-pillar>+ Add pillar</button>
      `;
    }
    if (id === 'cadence') {
      return `
        <p class="lede">Choose channels you can redistribute across — not every network on earth.</p>
        <div class="platform-grid">
          ${PLATFORMS.map((p) => `
            <button type="button" class="platform-chip ${draft.platforms.includes(p.id) ? 'selected' : ''}" data-platform="${p.id}">
              ${p.label}
            </button>
          `).join('')}
        </div>
        <label class="field">
          <span>Pieces per week you can finish</span>
          <input type="number" min="1" max="14" data-field="cadencePerWeek" value="${draft.cadencePerWeek}" />
        </label>
        <label class="field">
          <span>Voice notes (optional)</span>
          <textarea data-field="voiceNotes" rows="3" placeholder="Direct, practical, no hype. Short sentences. Always end with a clear next step.">${esc(draft.voiceNotes)}</textarea>
        </label>
      `;
    }
    // ready
    const goal = GOALS.find((g) => g.id === draft.primaryGoal);
    const namedPillars = draft.pillars.filter((p) => p.name.trim());
    return `
      <p class="lede">Here’s the system you’ll run. Open the planner, turn ideas into briefs, then schedule only what serves your ${goal?.label || 'goal'} goal.</p>
      <div class="ready-summary">
        <div><span>Brand</span><strong>${esc(draft.brandName) || 'Untitled'}</strong></div>
        <div><span>Goal</span><strong>${esc(goal?.label || '')}</strong></div>
        <div><span>Metric</span><strong>${esc(draft.successMetric) || 'Define on Strategy page'}</strong></div>
        <div><span>Cadence</span><strong>${draft.cadencePerWeek}/week</strong></div>
        <div class="full"><span>Pillars</span><strong>${namedPillars.map((p) => esc(p.name)).join(' · ') || 'Add more in Strategy'}</strong></div>
      </div>
    `;
  }

  function collect(validate = false) {
    root.querySelectorAll('[data-field]').forEach((el) => {
      draft[el.dataset.field] = el.type === 'number' ? Number(el.value) : el.value;
    });
    root.querySelectorAll('[data-pillar-name]').forEach((el) => {
      const p = draft.pillars.find((x) => x.id === el.dataset.pillarName);
      if (p) p.name = el.value;
    });
    root.querySelectorAll('[data-pillar-promise]').forEach((el) => {
      const p = draft.pillars.find((x) => x.id === el.dataset.pillarPromise);
      if (p) p.promise = el.value;
    });

    if (!validate) return true;
    const s = steps[step].id;
    if (s === 'goal' && !draft.primaryGoal) {
      alert('Pick a primary goal.');
      return false;
    }
    if (s === 'audience') {
      if (!draft.brandName.trim() || !draft.audience.trim()) {
        alert('Add a brand name and a specific audience.');
        return false;
      }
    }
    if (s === 'pillars') {
      const named = draft.pillars.filter((p) => p.name.trim());
      if (named.length < 3) {
        alert('Name at least 3 pillars. Themes you can publish on for months.');
        return false;
      }
    }
    if (s === 'cadence') {
      if (!draft.platforms.length || !draft.cadencePerWeek) {
        alert('Pick at least one platform and a weekly cadence.');
        return false;
      }
    }
    return true;
  }

  function finish() {
    collect();
    const pillars = draft.pillars
      .filter((p) => p.name.trim())
      .map((p) => ({ id: p.id, name: p.name.trim(), promise: (p.promise || '').trim() }));

    Storage.saveStrategy({
      brandName: draft.brandName.trim(),
      niche: draft.niche.trim(),
      audience: draft.audience.trim(),
      primaryGoal: draft.primaryGoal,
      platforms: draft.platforms,
      cadencePerWeek: draft.cadencePerWeek,
      pillars,
      successMetric: draft.successMetric.trim(),
      voiceNotes: draft.voiceNotes.trim()
    });
    Storage.completeOnboarding();

    // Seed a few starter ideas so the board isn’t empty
    if (Storage.getIdeas().length === 0 && pillars[0]) {
      Storage.addIdea({
        title: `What ${draft.audience.split(' ').slice(0, 6).join(' ') || 'your audience'} gets wrong about ${pillars[0].name}`,
        pillarId: pillars[0].id,
        notes: 'Contrarian TOFU angle — name the misconception, then teach the better frame.',
        score: 4
      });
      if (pillars[1]) {
        Storage.addIdea({
          title: `A simple ${pillars[1].name} checklist they can steal`,
          pillarId: pillars[1].id,
          notes: 'MOFU utility piece — high save/share potential.',
          score: 5
        });
      }
      if (pillars[2]) {
        Storage.addIdea({
          title: `How we use ${pillars[2].name} to drive ${GOALS.find((g) => g.id === draft.primaryGoal)?.label || 'results'}`,
          pillarId: pillars[2].id,
          notes: 'BOFU / proof-leaning — pair with a clear CTA.',
          score: 4
        });
      }
    }

    onComplete();
  }

  paint();
}

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
