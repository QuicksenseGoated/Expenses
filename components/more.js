import { APP, RESEARCH } from '../data.js';
import { esc } from './ui.js';

export function renderMore(root) {
  root.innerHTML = `
    <header class="page-head">
      <div>
        <p class="eyebrow">${esc(APP.name)}</p>
        <h1>More</h1>
        <p class="lede">Product research and app placeholders. No logic wired yet.</p>
      </div>
    </header>

    <section class="block">
      <div class="block-head"><h2>Product research</h2></div>
      <div class="research-list">
        ${RESEARCH.map((r) => `
          <article class="research-card">
            <p class="eyebrow">${esc(r.verdict)}</p>
            <h3>${esc(r.product)}</h3>
            <ul>
              ${r.points.map((p) => `<li>${esc(p)}</li>`).join('')}
            </ul>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="block">
      <div class="block-head"><h2>Coming later</h2></div>
      <ul class="todo-list">
        <li>Connect bank / App Store receipts</li>
        <li>Live price & plan research</li>
        <li>Cancel reminders & calendar sync</li>
        <li>Real savings plans</li>
      </ul>
    </section>

    <p class="footnote">Frontend preview · ${esc(APP.tagline)}</p>
  `;
}
