import { PROFILE, PILLARS, SERIES } from '../profile.js';
import { MANAGER_RULES, CLIP_FORMULAS } from '../playbook.js';
import { escapeHtml } from './modal.js';

export function renderPlaybook(root) {
  root.innerHTML = `
    <section class="view playbook-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Client playbook</p>
          <h1>${escapeHtml(PROFILE.displayName)} growth bible</h1>
          <p class="sub">${escapeHtml(PROFILE.niche)}</p>
        </div>
      </header>

      <div class="playbook-grid">
        <section class="panel">
          <h2>Brand</h2>
          <ul class="mix-list">
            <li><strong>Twitch</strong> ${escapeHtml(PROFILE.handles.twitch)}</li>
            <li><strong>YouTube</strong> @${escapeHtml(PROFILE.handles.youtube)}</li>
            <li><strong>TikTok</strong> @${escapeHtml(PROFILE.handles.tiktok)}</li>
            <li><strong>Vibe</strong> ${escapeHtml(PROFILE.vibe)}</li>
            <li><strong>Clipping</strong> ${escapeHtml(PROFILE.tools.clipping)} — ${escapeHtml(PROFILE.tools.clippingPlan)}</li>
            <li><strong>CTA</strong> ${escapeHtml(PROFILE.cta.short)}</li>
          </ul>
        </section>

        <section class="panel">
          <h2>Constraints</h2>
          <ul class="tip-list">
            <li>No facecam content</li>
            <li>No IRL pivots</li>
            <li>No empty trend-chasing / dances</li>
            <li>Open to creative series & challenges</li>
            <li>Siege ${PROFILE.stream.siegeDaysPerWeek}× / week · variety ${PROFILE.stream.varietyDaysPerWeek}×</li>
          </ul>
        </section>

        <section class="panel">
          <h2>Pillars</h2>
          ${PILLARS.map((p) => `
            <div class="pillar-block">
              <strong>${escapeHtml(p.name)}</strong> <span class="faint">${p.weight}%</span>
              <p>${escapeHtml(p.promise)}</p>
            </div>
          `).join('')}
        </section>

        <section class="panel">
          <h2>Series to run</h2>
          ${SERIES.map((s) => `
            <div class="pillar-block">
              <strong>${escapeHtml(s.title)}</strong>
              <p>${escapeHtml(s.hookFormula)}</p>
              <p class="faint">${escapeHtml(s.why)}</p>
            </div>
          `).join('')}
        </section>

        <section class="panel">
          <h2>Manager rules</h2>
          <ol class="rules">
            ${MANAGER_RULES.map((r) => `<li><strong>${escapeHtml(r)}</strong></li>`).join('')}
          </ol>
        </section>

        <section class="panel">
          <h2>Clip formulas</h2>
          ${CLIP_FORMULAS.map((f) => `
            <div class="pillar-block">
              <strong>${escapeHtml(f.label)}</strong>
              <p>“${escapeHtml(f.hook)}”</p>
              <p class="faint">${escapeHtml(f.captionTip)}</p>
            </div>
          `).join('')}
        </section>
      </div>
    </section>
  `;
}
