/** Documented free-trial logic — only uses catalog-sourced trial data. */

import { projectCancelBy } from './billing.js';

export function addDaysFromIso(iso, days) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().slice(0, 10);
}

export function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

/** Trial block on a catalog plan (must be explicitly set in catalog-data). */
export function getPlanTrial(plan, cycle = 'monthly') {
  if (!plan?.trial) return null;
  const cycles = plan.trial.cycles || ['monthly'];
  if (!cycles.includes(cycle)) return null;
  return plan.trial;
}

export function trialApplies(entry) {
  if (!entry) return null;
  if (entry.trialPolicy?.status === 'none') return null;
  return entry.trial || null;
}

export function computeTrialSchedule({ startedAt, trialDays }) {
  const trialEnds = addDaysFromIso(startedAt, trialDays);
  const firstCharge = trialEnds;
  const cancelBy = projectCancelBy(firstCharge);
  return { trialEnds, firstCharge, cancelBy };
}

export function isOnTrial(sub, today = isoToday()) {
  if (!sub?.trialEnds || sub.trialVerified === false) return false;
  return sub.trialEnds >= today;
}

export function firstChargeDate(sub) {
  if (isOnTrial(sub)) return sub.nextBill || sub.trialEnds;
  return sub.nextBill;
}

export function getSubLifecycle(sub, today = isoToday()) {
  const onTrial = isOnTrial(sub, today);
  const chargeIso = sub.nextBill;
  const cancelIso = sub.cancelBy;
  const trialEnds = sub.trialEnds;

  const daysUntil = (iso) => {
    if (!iso) return null;
    const t = new Date(`${iso}T12:00:00`);
    const n = new Date(`${today}T12:00:00`);
    return Math.round((t - n) / 86400000);
  };

  return {
    onTrial,
    trialVerified: sub.trialVerified !== false && !!trialEnds,
    trialEnds,
    trialDaysLeft: onTrial ? daysUntil(trialEnds) : null,
    firstCharge: chargeIso,
    daysUntilCharge: daysUntil(chargeIso),
    cancelBy: cancelIso,
    daysUntilCancel: daysUntil(cancelIso),
    phase: onTrial ? 'trial' : 'active',
    urgentCharge: !onTrial && daysUntil(chargeIso) != null && daysUntil(chargeIso) <= 7,
    urgentCancel: daysUntil(cancelIso) != null && daysUntil(cancelIso) <= 5,
    urgentTrial: onTrial && daysUntil(trialEnds) != null && daysUntil(trialEnds) <= 3,
  };
}

export function trialResearchHtml(entry, cycle) {
  const trial = entry?.trial;
  const policy = entry?.trialPolicy;

  if (trial && (trial.cycles || ['monthly']).includes(cycle)) {
    const cycleLabel = (trial.cycles || ['monthly']).join(', ');
    return `
      <div class="trial-research verified">
        <div class="trial-research-head">
          <strong>Researched free trial</strong>
          <span class="pill gold">${trial.days}-day · ${cycleLabel}</span>
        </div>
        <p>${trial.note || `${trial.days}-day trial on ${cycleLabel} billing.`}</p>
        ${trial.source ? `<a class="trial-source" href="${escAttr(trial.source)}" target="_blank" rel="noopener">Verify on official site ↗</a>` : ''}
      </div>`;
  }

  if (policy?.status === 'none') {
    return `
      <div class="trial-research none">
        <strong>No documented free trial</strong>
        <p>${policy.note || 'This product has no verified free trial in our catalog.'}</p>
        ${policy.source ? `<a class="trial-source" href="${escAttr(policy.source)}" target="_blank" rel="noopener">Official policy ↗</a>` : ''}
      </div>`;
  }

  return `
    <div class="trial-research unknown">
      <strong>No trial data researched</strong>
      <p>We have not verified a free trial for this plan. Set your dates manually below.</p>
    </div>`;
}

function escAttr(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
