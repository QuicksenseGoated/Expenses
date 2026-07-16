/** Static mock data — UI only, no logic yet. */

export const APP = {
  name: 'Ledger',
  tagline: 'Know what you pay for',
  user: 'You'
};

export const SUMMARY = {
  monthSpend: 87.94,
  monthLabel: 'July 2026',
  yearlyPace: 1055,
  activeSubs: 8,
  atRisk: 2,
  nextBillDays: 2,
  potentialSave: 34.97
};

export const ALERTS = [
  {
    id: 'a1',
    kind: 'bill',
    title: 'Adobe Creative Cloud bills in 2 days',
    body: '€59.99 on Jul 18 · unused 21 days',
    tone: 'warn'
  },
  {
    id: 'a2',
    kind: 'cancel',
    title: 'Cancel Disney+ before Jul 22',
    body: 'Renewal locks another month. You watched 0 hrs this cycle.',
    tone: 'danger'
  },
  {
    id: 'a3',
    kind: 'tip',
    title: 'Move €35/mo freed cash to savings',
    body: 'If you cut Adobe + Disney+, park it in an emergency buffer.',
    tone: 'ok'
  }
];

export const SUBS = [
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Streaming',
    price: 15.99,
    currency: '€',
    cycle: 'monthly',
    nextBill: '2026-07-21',
    status: 'active',
    usage: 'High',
    rating: 4,
    cancelBy: '2026-07-20',
    research: 'Standard with ads tier is cheaper if you only watch casually. Price rose 2025; family plan only worth it with 2+ users.',
    advice: 'Keep — you use it 4+ nights/week.',
    action: 'keep'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Music',
    price: 10.99,
    currency: '€',
    cycle: 'monthly',
    nextBill: '2026-07-28',
    status: 'active',
    usage: 'High',
    rating: 5,
    cancelBy: '2026-07-27',
    research: 'Student/duo plans cut cost if eligible. YouTube Music often cheaper bundled with Premium.',
    advice: 'Keep — daily use.',
    action: 'keep'
  },
  {
    id: 'adobe',
    name: 'Adobe Creative Cloud',
    category: 'Software',
    price: 59.99,
    currency: '€',
    cycle: 'monthly',
    nextBill: '2026-07-18',
    status: 'active',
    usage: 'Low',
    rating: 2,
    cancelBy: '2026-07-16',
    research: 'Photography plan (€12) covers Lightroom + Photoshop if you don’t need full suite. Annual prepaid saves ~30% vs monthly.',
    advice: 'Cancel or downgrade — 21 days unused.',
    action: 'cancel'
  },
  {
    id: 'disney',
    name: 'Disney+',
    category: 'Streaming',
    price: 8.99,
    currency: '€',
    cycle: 'monthly',
    nextBill: '2026-07-23',
    status: 'active',
    usage: 'None',
    rating: 1,
    cancelBy: '2026-07-22',
    research: 'Best as a rotate-in: subscribe for a month when a show drops, then cancel. Bundle with Hulu/ESPN+ only if in US.',
    advice: 'Cancel before Jul 22 — no watch time this cycle.',
    action: 'cancel'
  },
  {
    id: 'icloud',
    name: 'iCloud+',
    category: 'Storage',
    price: 2.99,
    currency: '€',
    cycle: 'monthly',
    nextBill: '2026-08-02',
    status: 'active',
    usage: 'Medium',
    rating: 4,
    cancelBy: '2026-08-01',
    research: '200GB is usually enough for photos + backups. 2TB only if you shoot video heavily.',
    advice: 'Keep — cheap insurance for backups.',
    action: 'keep'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    category: 'AI',
    price: 20.0,
    currency: '€',
    cycle: 'monthly',
    nextBill: '2026-07-30',
    status: 'active',
    usage: 'Medium',
    rating: 3,
    cancelBy: '2026-07-29',
    research: 'Worth it if you hit free-tier limits weekly. Pause months you travel or go offline-heavy.',
    advice: 'Watch — decide after this billing cycle.',
    action: 'watch'
  },
  {
    id: 'gym',
    name: 'FitLife Gym',
    category: 'Health',
    price: 39.0,
    currency: '€',
    cycle: 'monthly',
    nextBill: '2026-08-01',
    status: 'active',
    usage: 'Low',
    rating: 2,
    cancelBy: '2026-07-25',
    research: 'Contracts often need 30-day notice. Day-passes can beat membership under 6 visits/month.',
    advice: 'Review — you checked in twice last month.',
    action: 'watch'
  },
  {
    id: 'notion',
    name: 'Notion Plus',
    category: 'Productivity',
    price: 10.0,
    currency: '€',
    cycle: 'monthly',
    nextBill: '2026-08-05',
    status: 'active',
    usage: 'Medium',
    rating: 3,
    cancelBy: '2026-08-04',
    research: 'Free plan is enough for solo notes. Plus matters for uploads + history.',
    advice: 'Keep if you rely on AI / file uploads.',
    action: 'keep'
  }
];

export const INSIGHTS = [
  {
    id: 'i1',
    title: 'Cut €68.98 / month',
    body: 'Adobe + Disney+ look like dead weight. Cancel both before their cancel-by dates.',
    impact: '€828 / year',
    tone: 'danger'
  },
  {
    id: 'i2',
    title: 'Rotate streaming',
    body: 'Run one streamer at a time. Netflix now, park Disney+ until a show you care about drops.',
    impact: 'Stack less',
    tone: 'ok'
  },
  {
    id: 'i3',
    title: 'What to do with the cash',
    body: 'If you cancel Adobe + Disney+: €35 → emergency buffer, €20 → groceries float, rest → fun money.',
    impact: 'Clear plan',
    tone: 'accent'
  }
];

export const RESEARCH = [
  {
    id: 'r1',
    product: 'Adobe Creative Cloud',
    verdict: 'Overkill for light use',
    points: [
      'Full suite is for pros shipping weekly',
      'Photo plan covers most creators',
      'Cancel 24h before renewal to avoid lock-in'
    ]
  },
  {
    id: 'r2',
    product: 'Disney+',
    verdict: 'Subscribe in bursts',
    points: [
      'Catalog spikes around big releases',
      'Idle months = pure waste',
      'Set a calendar reminder on cancel-by date'
    ]
  },
  {
    id: 'r3',
    product: 'ChatGPT Plus',
    verdict: 'Situational',
    points: [
      'Value tracks how often you hit limits',
      'Easy to pause for a month',
      'Compare with free + Claude free before renewing'
    ]
  }
];

export const MONEY_PLAN = [
  { label: 'Essentials buffer', pct: 40, note: 'Food, transport, phone' },
  { label: 'Emergency stash', pct: 35, note: 'From cancelled subs' },
  { label: 'Fun / guilt-free', pct: 25, note: 'Games, nights out' }
];
