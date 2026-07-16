/** Quicksense — creator business strategy (locked facts + ops). */

export const BIZ = {
  name: 'Quicksense',
  legalNote: 'Creator business · single operator',
  product: 'Live Twitch shows (Siege-first entertainment)',
  distribution: 'Streamladder auto-clips → TikTok + YouTube Shorts',
  primaryMetric: 'Twitch average concurrent viewers (ACV)',
  leadingMetric: 'TikTok views per week',
  laggingMetric: 'Twitch followers',
  handles: {
    twitch: 'QuicksenseGoated',
    tiktok: 'quicksenseclips3',
    youtube: 'quicksens'
  },
  urls: {
    twitch: 'https://www.twitch.tv/quicksensegoated',
    tiktok: 'https://www.tiktok.com/@quicksenseclips3',
    youtube: 'https://www.youtube.com/@quicksens'
  }
};

export const POSITIONING = {
  who: 'Siege players + clip consumers who want personality, not coach-core.',
  what: 'Chaotic-funny ranked & event streams people return to.',
  whyUs: 'Named formats (KOTH, locks, chat rules) + consistent schedule.',
  not: 'Facecam, IRL, dance trends, random silent ranked.'
};

/** Funnel as a business system */
export const FUNNEL = [
  {
    stage: 'Acquire',
    channel: 'TikTok / Shorts',
    job: 'Get strangers to know the name',
    owner: 'Streamladder (auto) + same-day approve',
    kpi: 'TT views / week'
  },
  {
    stage: 'Convert',
    channel: 'Twitch live',
    job: 'Turn clip traffic into concurrent viewers',
    owner: 'Title + first 10 min + format stakes',
    kpi: 'ACV'
  },
  {
    stage: 'Retain',
    channel: 'Formats + raids + schedule',
    job: 'Same people come back next stream',
    owner: 'Weekly format plan',
    kpi: 'Returning chat / streak of streams hit'
  }
];

export const PILLARS = [
  { id: 'events', name: 'Event nights', weight: 35, examples: 'KOTH, brackets, house-rules customs' },
  { id: 'arcs', name: 'Ranked arcs', weight: 30, examples: 'Rank or Ruin, goal pushes' },
  { id: 'constraints', name: 'Constraint shows', weight: 20, examples: 'Op lock, punishment wheel, map pool' },
  { id: 'expand', name: 'Expansion', weight: 15, examples: 'Weekly variety, future SMP' }
];

/** Weekly capacity — treat like production quotas */
export const QUOTAS = {
  siegeStreams: 5,
  varietyStreams: 1,
  minHoursLive: 10,
  ladderApprovalsPerSiegeDay: 2,
  raidsPerStream: 1
};

export const FORMATS = [
  {
    id: 'koth',
    pillar: 'events',
    name: 'King of the Hill',
    title: 'KOTH — winner stays',
    when: 'High-energy night / Fri',
    setup: [
      'Write rules in title + panel',
      'Throne vs challenger; chat orders queue',
      'Hard cap match length so it rotates',
      'Crown winner at end'
    ],
    success: 'Chat calling next fight; people stay for crown'
  },
  {
    id: 'rank_ruin',
    pillar: 'arcs',
    name: 'Rank or Ruin',
    title: 'Rank or Ruin — stop at goal/loss limit',
    when: 'Default Siege block',
    setup: [
      'State start rank + stop rules before queue',
      'Call the arc every few games',
      'Hard stop — no endless grind',
      'Continue arc next stream'
    ],
    success: 'Viewers ask where the arc ended'
  },
  {
    id: 'op_lock',
    pillar: 'constraints',
    name: 'Operator Lock',
    title: 'ONLY [OP] tonight',
    when: 'Mid-week',
    setup: [
      'Chat votes the lock',
      'No swaps after throws',
      'Call the rule every death',
      'Optional: lock for a full week'
    ],
    success: 'Bit is clear in first minute'
  },
  {
    id: 'chat_strat',
    pillar: 'constraints',
    name: 'Chat Strat',
    title: 'Chat picks strat — I commit',
    when: 'Community night',
    setup: [
      'Poll locks site/ops',
      'One redo max',
      'Track chat W-L on screen',
      'Roast the plan, don’t quit it'
    ],
    success: 'Chat spam / predictions every round'
  },
  {
    id: 'wheel',
    pillar: 'constraints',
    name: 'Punishment Wheel',
    title: 'Lose = wheel',
    when: 'Tilt recovery / fun block',
    setup: [
      '6–8 playable punishments',
      'Spin on loss for N rounds',
      'Win streak clears it'
    ],
    success: 'People wait for the spin'
  },
  {
    id: 'bracket',
    pillar: 'events',
    name: 'Viewer bracket',
    title: 'Viewer 1v1s — 8 entrants',
    when: 'Weekend event',
    setup: [
      'Cap 8–16',
      'BO1 → finals BO3',
      'Prize: shoutout / raid pick',
      'You play winner'
    ],
    success: 'Entrants bring lurkers'
  },
  {
    id: 'variety',
    pillar: 'expand',
    name: 'Siege Brain Variety',
    title: 'Siege brain in [game]',
    when: '1× / week (Sat)',
    setup: [
      'Keep Siege personality',
      'Don’t flood the week with variety',
      'SMP later = same framing'
    ],
    success: 'Siege regulars still show up'
  }
];

export const WEEKDAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Default production calendar */
export function defaultWeekPlan() {
  return [
    { day: 0, type: 'siege', formatId: 'rank_ruin', hours: 2.5 },
    { day: 1, type: 'siege', formatId: 'op_lock', hours: 2.5 },
    { day: 2, type: 'siege', formatId: 'chat_strat', hours: 2.5 },
    { day: 3, type: 'siege', formatId: 'rank_ruin', hours: 2.5 },
    { day: 4, type: 'siege', formatId: 'koth', hours: 3 },
    { day: 5, type: 'variety', formatId: 'variety', hours: 2.5 },
    { day: 6, type: 'ops', formatId: null, hours: 0 }
  ];
}

/** Trainer dimensions — grade 1–5 */
export const TRAIN_AXES = [
  {
    id: 'schedule',
    name: 'Schedule hit rate',
    ask: 'Did you hit planned streams this week?',
    drill: 'Lock start times in calendar. Miss = same makeup slot within 48h.'
  },
  {
    id: 'format',
    name: 'Named format clarity',
    ask: 'Was the format obvious in title + first 2 minutes?',
    drill: 'Read rules out loud at start. Put format name first in title.'
  },
  {
    id: 'chat',
    name: 'Chat employment',
    ask: 'Did chat have a job (vote, queue, predict)?',
    drill: 'One chat verb per stream. Repeat it every round.'
  },
  {
    id: 'convert',
    name: 'Clip → live convert',
    ask: 'Did Ladder posts go out same day with Twitch CTA?',
    drill: 'Stream end → Ladder approve in 30 min. Non-negotiable SOP.'
  },
  {
    id: 'network',
    name: 'Network (raids)',
    ask: 'Raid every stream to similar size?',
    drill: 'Keep 5 raid targets. Raid before you close.'
  }
];

export function formatById(id) {
  return FORMATS.find((f) => f.id === id) || null;
}

export function weekKey(d = new Date()) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return iso(x);
}

export function iso(d = new Date()) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}

export function todayIndex(d = new Date()) {
  const day = d.getDay();
  return day === 0 ? 6 : day - 1; // Mon=0
}
