import { Store } from '../store.js';
import { CATALOG } from '../catalog.js';
import { brandHead, esc, toast } from './ui.js';

export function renderMore(root, ctx) {
  root.innerHTML = `
    ${brandHead('More')}

    <section class="block">
      <h2>What Financer does</h2>
      <ul class="feature-list">
        <li><b>Balance tracking</b> — enter your bank cash; spends subtract live</li>
        <li><b>Safe to spend</b> — balance minus upcoming subscription bills</li>
        <li><b>Sub search</b> — ${CATALOG.length}+ services with why / when / how + links</li>
        <li><b>Cancel windows</b> — next bill + cancel-by dates you set</li>
        <li><b>Activity log</b> — spends & deposits with undo</li>
        <li><b>Budget envelopes</b> — Food / Fun / Transport burn bars</li>
        <li><b>Coach tips</b> — warnings when subs or bills get heavy</li>
      </ul>
    </section>

    <section class="block">
      <h2>Compared to big apps</h2>
      <ul class="feature-list quiet">
        <li>Rocket Money → cancel coaching & sub audit</li>
        <li>Emma / PocketGuard → safe-to-spend</li>
        <li>YNAB → envelope-style budgets</li>
        <li>Mint-style → bills + cash overview (local only)</li>
      </ul>
    </section>

    <section class="block">
      <h2>Coming later</h2>
      <ul class="feature-list quiet">
        <li>Bank sync / receipt import</li>
        <li>Push reminders for cancel-by dates</li>
        <li>Custom budget limits editor</li>
        <li>Shared household view</li>
      </ul>
    </section>

    <section class="block">
      <h2>Data</h2>
      <p class="body">Everything stays on this phone (localStorage). No account yet.</p>
      <button type="button" class="btn danger block" data-reset>Reset all Financer data</button>
    </section>
  `;

  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (!confirm('Wipe balance, spends, and subscriptions on this device?')) return;
    Store.reset();
    toast('Reset');
    ctx.navigate('home');
  });
}
