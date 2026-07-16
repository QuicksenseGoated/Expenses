import {
  BIZ, POSITIONING, FUNNEL, PILLARS, QUOTAS, FORMATS
} from '../strategy.js';
import { DB } from '../storage.js';
import { esc, toast, $, $all, brandHead } from './ui.js';

export function renderStrategy(root, ctx) {
  const raids = DB.getRaids();

  root.innerHTML = `
    ${brandHead('The plan on one page')}

    <nav class="jump" aria-label="Sections">
      <a href="#biz">Biz</a>
      <a href="#funnel">Funnel</a>
      <a href="#formats">Formats</a>
      <a href="#raids">Raids</a>
    </nav>

    <section class="card" id="biz">
      <h2>What this is</h2>
      <dl class="dl">
        <div><dt>Product</dt><dd>${esc(BIZ.product)}</dd></div>
        <div><dt>Distro</dt><dd>${esc(BIZ.distribution)}</dd></div>
        <div><dt>Win on</dt><dd>${esc(BIZ.primaryMetric)}</dd></div>
        <div><dt>Watch</dt><dd>${esc(BIZ.leadingMetric)}</dd></div>
        <div><dt>Handles</dt><dd>TTV ${esc(BIZ.handles.twitch)} · TT ${esc(BIZ.handles.tiktok)} · YT ${esc(BIZ.handles.youtube)}</dd></div>
      </dl>
    </section>

    <section class="card">
      <h2>Who it’s for</h2>
      <dl class="dl">
        <div><dt>Who</dt><dd>${esc(POSITIONING.who)}</dd></div>
        <div><dt>Offer</dt><dd>${esc(POSITIONING.what)}</dd></div>
        <div><dt>Edge</dt><dd>${esc(POSITIONING.whyUs)}</dd></div>
        <div><dt>Skip</dt><dd>${esc(POSITIONING.not)}</dd></div>
      </dl>
    </section>

    <section class="card" id="funnel">
      <h2>How people find you</h2>
      ${FUNNEL.map((f) => `
        <div class="funnel-row">
          <strong>${esc(f.stage)}</strong>
          <span class="pill">${esc(f.channel)}</span>
          <p>${esc(f.job)}</p>
          <p class="muted">${esc(f.kpi)} · ${esc(f.owner)}</p>
        </div>
      `).join('')}
    </section>

    <section class="card">
      <h2>Content mix</h2>
      ${PILLARS.map((p) => `
        <div class="pillar">
          <div><strong>${esc(p.name)}</strong><span>${p.weight}%</span></div>
          <p class="muted">${esc(p.examples)}</p>
        </div>
      `).join('')}
    </section>

    <section class="card">
      <h2>Weekly floor</h2>
      <ul class="bullets">
        <li>${QUOTAS.siegeStreams} Siege streams</li>
        <li>${QUOTAS.varietyStreams} variety stream</li>
        <li>At least ${QUOTAS.minHoursLive} hours live</li>
        <li>${QUOTAS.ladderApprovalsPerSiegeDay}+ Ladder approvals on Siege days</li>
        <li>Raid every stream</li>
      </ul>
    </section>

    <section class="card" id="formats">
      <h2>Formats you can run</h2>
      ${FORMATS.map((f) => `
        <details class="fmt">
          <summary><span>${esc(f.name)}</span><span class="muted">${esc(f.when)}</span></summary>
          <p><b>Title:</b> ${esc(f.title)}</p>
          <ol>${f.setup.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
          <p class="muted">${esc(f.success)}</p>
        </details>
      `).join('')}
    </section>

    <section class="card" id="raids">
      <h2>Who you raid</h2>
      <p class="muted">Keep a short list of similar-size Siege people. Raid before you close — every time.</p>
      <form id="raid-form" class="rowform">
        <input name="name" placeholder="twitch name" required autocomplete="off" enterkeyhint="done" />
        <button class="btn primary" type="submit">Add</button>
      </form>
      <ul class="list">
        ${raids.map((r) => `
          <li>
            <a href="https://www.twitch.tv/${encodeURIComponent(r)}" target="_blank" rel="noopener">${esc(r)}</a>
            <button type="button" class="link" data-rm="${esc(r)}">Remove</button>
          </li>
        `).join('') || '<li class="muted">Nobody yet — add a few this week.</li>'}
      </ul>
    </section>

    <section class="card dangerzone">
      <h2>Reset</h2>
      <button type="button" class="btn danger block" data-reset>Wipe local data</button>
    </section>
  `;

  $('#raid-form', root)?.addEventListener('submit', (e) => {
    e.preventDefault();
    DB.addRaid(new FormData(e.currentTarget).get('name'));
    e.currentTarget.reset();
    toast('Added');
    ctx.refresh();
  });

  $all('[data-rm]', root).forEach((b) => {
    b.addEventListener('click', () => {
      DB.removeRaid(b.dataset.rm);
      ctx.refresh();
    });
  });

  $('[data-reset]', root)?.addEventListener('click', () => {
    if (!confirm('Wipe everything saved on this phone?')) return;
    DB.reset();
    toast('Wiped');
    ctx.navigate('week');
  });
}
