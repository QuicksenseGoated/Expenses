import { Store } from '../store.js';
import { money, esc, toast, sheet, $ } from './ui.js';

export async function maybeOnboarding(ctx) {
  const s = Store.get();
  if (s.settings?.onboarded) return;
  if (s.balance != null && s.subscriptions.length > 0) {
    Store.updateSettings({ onboarded: true });
    return;
  }
  await runOnboarding(ctx);
}

export async function runOnboarding(ctx) {
  const s = Store.get();

  await sheet({
    title: 'Welcome to Financer',
    body: `
      <p class="sheet-hint">Track your balance, subscriptions, and spending — all on your device. Nothing leaves your phone.</p>
      <ol class="onboard-steps">
        <li>Set your account balance</li>
        <li>Add the subs you actually pay</li>
        <li>Log spends with the gold + button</li>
      </ol>
    `,
    actions: [{ id: 'start', label: "Let's go", primary: true }],
  });

  const balResult = await sheet({
    title: 'Step 1 — Your balance',
    body: `
      <p class="sheet-hint">What's in your account right now?</p>
      <label class="field">
        <span>Balance</span>
        <input id="ob-bal" type="number" min="0" step="0.01" inputmode="decimal" placeholder="390.00" required />
      </label>
      <label class="field"><span>Currency</span>
        <select id="ob-currency">
          ${['€', '$', '£'].map((c) => `<option value="${c}" ${s.currency === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </label>
    `,
    actions: [
      { id: 'skip', label: 'Skip' },
      { id: 'save', label: 'Continue', primary: true },
    ],
  });

  if (balResult?.action === 'save') {
    const v = Number($('#ob-bal', balResult.overlay)?.value);
    if (Number.isFinite(v)) Store.setBalance(v);
    Store.setCurrency($('#ob-currency', balResult.overlay)?.value || s.currency);
  }

  const payResult = await sheet({
    title: 'Step 2 — Payday (optional)',
    body: `
      <p class="sheet-hint">We'll show bills due before payday on Home.</p>
      <label class="field"><span>Payday day (1–31)</span>
        <input id="ob-payday" type="number" min="1" max="31" placeholder="e.g. 25" />
      </label>
    `,
    actions: [
      { id: 'skip', label: 'Skip' },
      { id: 'save', label: 'Continue', primary: true },
    ],
  });

  if (payResult?.action === 'save') {
    const day = $('#ob-payday', payResult.overlay)?.value;
    if (day) Store.updateSettings({ paydayDay: Number(day) });
  }

  Store.updateSettings({ onboarded: true });
  toast('All set');
  ctx.navigate('bills');
}
