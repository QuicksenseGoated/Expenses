/**
 * Subscription billing timing — only use documented anchors.
 * signup_anniversary: charged same calendar day you subscribed (Netflix, Spotify, etc.)
 * app_store: Apple/Google renew on original purchase date
 * calendar_month_start: billed 1st of each month (enterprise / some utilities)
 * calendar_month_end: billed last day of month (rare — only when documented)
 */

export const BILLING_ANCHORS = {
  signup_anniversary: {
    id: 'signup_anniversary',
    label: 'Signup anniversary',
    short: 'Same day each month',
    hint: 'Charged on the day you originally subscribed. If that day doesn’t exist (e.g. 31st), the last day of the month is used.',
  },
  app_store: {
    id: 'app_store',
    label: 'App Store / Play renewal',
    short: 'Store renewal date',
    hint: 'Renewed on the date you subscribed through Apple or Google.',
  },
  calendar_month_start: {
    id: 'calendar_month_start',
    label: 'Start of month',
    short: '1st of month',
    hint: 'Billed on the first day of each billing period.',
  },
  calendar_month_end: {
    id: 'calendar_month_end',
    label: 'End of month',
    short: 'Last day of month',
    hint: 'Billed on the last day of each billing period.',
  },
};

export function anchorLabel(id) {
  return BILLING_ANCHORS[id]?.short || null;
}

export function anchorHint(id) {
  return BILLING_ANCHORS[id]?.hint || null;
}

/** Next bill date from anchor + signup day (1–31). Returns ISO date or null if unknown. */
export function projectNextBill({ billingAnchor, billingDay, from = new Date() }) {
  if (!billingAnchor || !billingDay) return null;
  const d = new Date(from);
  d.setHours(12, 0, 0, 0);
  const day = Math.min(31, Math.max(1, Number(billingDay)));

  if (billingAnchor === 'signup_anniversary' || billingAnchor === 'app_store') {
    const y = d.getFullYear();
    const m = d.getMonth();
    let candidate = billOnDay(y, m, day);
    if (candidate <= d) {
      const nm = m + 1;
      candidate = billOnDay(nm > 11 ? y + 1 : y, nm % 12, day);
    }
    return candidate.toISOString().slice(0, 10);
  }

  if (billingAnchor === 'calendar_month_start') {
    const y = d.getFullYear();
    const m = d.getMonth();
    let candidate = new Date(y, m, 1, 12, 0, 0);
    if (candidate <= d) candidate = new Date(y, m + 1, 1, 12, 0, 0);
    return candidate.toISOString().slice(0, 10);
  }

  if (billingAnchor === 'calendar_month_end') {
    const y = d.getFullYear();
    const m = d.getMonth();
    let candidate = new Date(y, m + 1, 0, 12, 0, 0);
    if (candidate <= d) candidate = new Date(y, m + 2, 0, 12, 0, 0);
    return candidate.toISOString().slice(0, 10);
  }

  return null;
}

function billOnDay(year, month, day) {
  const last = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, last), 12, 0, 0);
}

/** Cancel-by = day before next bill (common grace window). */
export function projectCancelBy(nextBillIso) {
  if (!nextBillIso) return null;
  const d = new Date(`${nextBillIso}T12:00:00`);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function daysUntilPayday(paydayDay, from = new Date()) {
  if (!paydayDay) return null;
  const d = new Date(from);
  d.setHours(12, 0, 0, 0);
  const day = Math.min(31, Math.max(1, Number(paydayDay)));
  const y = d.getFullYear();
  const m = d.getMonth();
  let next = billOnDay(y, m, day);
  if (next <= d) next = billOnDay(m === 11 ? y + 1 : y, (m + 1) % 12, day);
  return Math.round((next - d) / 86400000);
}

export function billsBeforePayday(subs, paydayDay, daysAhead = 45) {
  if (!paydayDay) return [];
  const paydayIn = daysUntilPayday(paydayDay);
  if (paydayIn == null) return [];
  return subs.filter((s) => {
    const due = new Date(`${s.nextBill}T12:00:00`);
    const now = new Date();
    now.setHours(12, 0, 0, 0);
    const diff = Math.round((due - now) / 86400000);
    return diff >= 0 && diff < paydayIn;
  });
}
