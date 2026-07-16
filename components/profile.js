import { Store } from '../store.js';
import { PRODUCT_COUNT, CATALOG_SIZE } from '../catalog.js';
import { toast } from './ui.js';

export function renderProfile(root, ctx) {
  const s = Store.get();

  root.innerHTML = `
    <header class="page-title">
      <h1>You</h1>
      <p>Financer · local-first money OS</p>
    </header>

    <section class="profile-card">
      <img src="./icons/logo.png" width="96" height="96" alt="Financer" class="profile-logo bank-logo" />
      <h2>Financer</h2>
      <p>Balance tracking · subscription intelligence · spend runway</p>
    </section>

    <section class="panel highlight">
      <h2>Icon still says Sense Desk?</h2>
      <p class="body">iPhone/Android lock the home-screen name & icon when you first install. The website is Financer — your shortcut may be an old install.</p>
      <ol class="plain-list numbered">
        <li>Delete the app from your home screen</li>
        <li>Open Safari → <strong>quicksensegoated.github.io/Expenses/</strong></li>
        <li>Share → <strong>Add to Home Screen</strong> (should say Financer)</li>
      </ol>
    </section>

    <section class="panel">
      <ul class="feature-grid">
        <li><b>Monzo / Revolut</b><span>Balance hero & activity feed</span></li>
        <li><b>Rocket Money</b><span>Cancel windows & sub audit</span></li>
        <li><b>Copilot</b><span>Coach insights & safe-to-spend</span></li>
        <li><b>YNAB</b><span>Envelope budgets</span></li>
        <li><b>Emma</b><span>Bill calendar & runway</span></li>
      </ul>
    </section>

    <section class="panel">
      <h2>Your data</h2>
      <dl class="stats-dl">
        <div><dt>Balance set</dt><dd>${s.balance == null ? 'No' : 'Yes'}</dd></div>
        <div><dt>Subscriptions</dt><dd>${s.subscriptions.length}</dd></div>
        <div><dt>Transactions</dt><dd>${s.transactions.length}</dd></div>
        <div><dt>Catalog</dt><dd>${PRODUCT_COUNT} products · ${CATALOG_SIZE}+ plans</dd></div>
      </dl>
    </section>

    <section class="panel">
      <h2>Coming soon</h2>
      <ul class="plain-list">
        <li>Bank sync & receipt scan</li>
        <li>Push cancel reminders</li>
        <li>Custom budget limits</li>
        <li>Price-change alerts</li>
      </ul>
    </section>

    <button type="button" class="btn danger block" data-reset>Reset all data on this device</button>
  `;

  root.querySelector('[data-reset]')?.addEventListener('click', () => {
    if (!confirm('Delete balance, spends, and subscriptions on this phone?')) return;
    Store.reset();
    toast('Reset complete');
    ctx.navigate('home');
  });
}
