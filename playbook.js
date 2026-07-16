/**
 * Active social media management playbook for Quicksense.
 * This is strategy — not a blank calendar.
 */

import { PROFILE, PILLARS, SERIES } from './profile.js';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Clip formulas that fit chaotic-funny, no-facecam, no-IRL. */
export const CLIP_FORMULAS = [
  {
    id: 'clutch',
    label: 'Clutch / near-clutch',
    hook: '1vX and I somehow…',
    captionTip: 'Open on the tension, end on the yell or silence. CTA in caption not mid-clip.',
    bestFor: ['tiktok', 'youtube']
  },
  {
    id: 'throw',
    label: 'Throw / grief',
    hook: 'I threw the round in the funniest way possible',
    captionTip: 'Self-roast wins. Don’t explain the joke — show it.',
    bestFor: ['tiktok', 'youtube']
  },
  {
    id: 'chat_bit',
    label: 'Chat bit',
    hook: 'Chat said do it. I did it. Regret.',
    captionTip: 'Overlay chat message as text on screen if no facecam.',
    bestFor: ['tiktok', 'youtube']
  },
  {
    id: 'tilt',
    label: 'Tilt spiral',
    hook: 'This is the moment the session died',
    captionTip: 'Use as part 2/3 of a Rank or Ruin pack.',
    bestFor: ['tiktok', 'youtube']
  },
  {
    id: 'outplay',
    label: 'Outplay / cheeky peak',
    hook: 'They never checked here',
    captionTip: 'Slow-mo or zoom optional — keep under 20s.',
    bestFor: ['tiktok', 'youtube']
  },
  {
    id: 'variety',
    label: 'Variety hook',
    hook: 'Siege brain in [game] is a disease',
    captionTip: 'Still CTA to Twitch — variety clips recruit different followers.',
    bestFor: ['tiktok', 'youtube']
  }
];

export const GROWTH_PLAYS = [
  {
    id: 'same_day_clips',
    title: 'Same-day clip drops',
    status: 'core',
    why: 'TikTok rewards freshness. Stream → clip → post within hours while title still matches “live energy.”',
    doThis: [
      'End stream → open Streamladder within 30 min',
      'Mark 8–12 candidates, ship best 2–4',
      'Identical post to TikTok + YT Shorts',
      'Caption ends with: LIVE on Twitch → QuicksenseGoated'
    ],
    metric: 'TikTok views + Twitch spike same night / next day'
  },
  {
    id: 'hook_first_1s',
    title: 'Hook in the first second',
    status: 'core',
    why: 'No facecam means gameplay must punch immediately. Text on screen before the play.',
    doThis: [
      'Start every clip on motion or a bold text hook',
      'Never start on a quiet prep phase',
      'Test 2 hook texts on the same raw moment when unsure'
    ],
    metric: 'Avg watch % / 3-sec holds on TikTok'
  },
  {
    id: 'series_stacking',
    title: 'Series stacking (Rank or Ruin)',
    status: 'active',
    why: 'One session → multi-part story. People follow for part 2 and check if you’re live for the ending.',
    doThis: [
      'Pick one ranked block per week as the “story”',
      'Post part 1–3 across 24–48 hours',
      'End part 1/2 with “part 2 tonight / live for the finish”'
    ],
    metric: 'Profile visits + returning TikTok viewers'
  },
  {
    id: 'raid_and_network',
    title: 'Raid + Siege network',
    status: 'active',
    why: 'Avg viewers grow from live social proof and overlapping audiences — not only from TikTok.',
    doThis: [
      'Raid a similar-size Siege streamer after every stream',
      'Keep a short raid message that sounds like you (chaotic, not corporate)',
      'Return raids — reciprocity compounds'
    ],
    metric: 'Follower follow-backs + raid viewer carry'
  },
  {
    id: 'operator_lock',
    title: 'Operator Lock Week',
    status: 'experiment',
    why: 'Creates a content theme for 7 days without chasing dances/sounds.',
    doThis: [
      'Announce op(s) on stream + one teaser clip',
      'Clip every funny failure with that constraint',
      'End-of-week montage'
    ],
    metric: 'Clip output volume + comments mentioning the challenge'
  },
  {
    id: 'variety_bridge',
    title: 'Variety bridge (Siege Brain)',
    status: 'experiment',
    why: 'Keeps weekly variety from feeling like a different channel.',
    doThis: [
      'Title/tease variety with Siege personality language',
      '1–2 variety clips max that day — don’t flood',
      'When SMP starts: “Siege stack in Minecraft” framing'
    ],
    metric: 'Variety-night avg viewers vs Siege baseline'
  }
];

export const MANAGER_RULES = [
  'Twitch is the product. TikTok/Shorts are ads for the live show.',
  'Every short needs a Twitch CTA — no orphan clips.',
  'Chaotic funny > educational. Teach only if it’s also entertainment.',
  'No facecam / no IRL — win with gameplay pacing, text hooks, and chat overlays.',
  'Skip empty trend-chasing. Steal structures (series, hooks), not dances.',
  'Consistency beats perfection: 2–4 clips per Siege day beats 12 once a week.',
  'If a clip format wins twice, turn it into a series — don’t get bored of winners.'
];

/**
 * Build a concrete Mon–Sun management plan.
 * Siege-heavy week + one variety day (default Saturday).
 */
export function buildWeeklyPlan(anchorDate = new Date()) {
  const monday = startOfWeekMonday(anchorDate);
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(monday, i);
    const dow = date.getDay(); // 0 Sun … 6 Sat
    const isVariety = dow === 6; // Saturday variety default
    const isOff = dow === 0; // Sunday reset / content catch-up

    if (isOff) {
      days.push({
        date: iso(date),
        dayName: DAY_NAMES[dow],
        mode: 'reset',
        title: 'Reset + scoreboard',
        stream: null,
        actions: [
          'Review TikTok analytics: top 3 clips, worst 3 clips',
          'Mark winning formulas to repeat next week',
          'Queue 1 teaser for Monday’s first Siege stream',
          'Update scoreboard (avg viewers + TikTok views)'
        ],
        clipTarget: 1,
        focus: 'Double down on what worked. Kill what flopped.'
      });
      continue;
    }

    if (isVariety) {
      days.push({
        date: iso(date),
        dayName: DAY_NAMES[dow],
        mode: 'variety',
        title: 'Variety night — Siege Brain',
        stream: {
          game: 'Variety (non-Siege)',
          goal: 'Keep energy high; recruit non-Siege curiosity without losing brand',
          onStream: [
            'Open with why you picked the game (10 sec, funny)',
            'Drop Twitch panel / title that mentions Quicksense chaos',
            'Raid out to a Siege or variety friend'
          ]
        },
        actions: [
          'Go live — variety',
          'Clip 1–2 “Siege brain in X” moments via Streamladder',
          'Post to TikTok + Shorts with Twitch CTA',
          'Optional: schedule Sunday teaser for next Siege block'
        ],
        clipTarget: 2,
        focus: 'Bridge content. Don’t over-post variety.'
      });
      continue;
    }

    // Siege day
    const seriesHint = i % 2 === 0 ? SERIES[0] : SERIES[2];
    days.push({
      date: iso(date),
      dayName: DAY_NAMES[dow],
      mode: 'siege',
      title: 'Siege stream day',
      stream: {
        game: 'Rainbow Six Siege',
        goal: 'Generate clip moments + hold live chat energy',
        onStream: [
          `Lean into: ${seriesHint.title}`,
          'Call out clip-worthy moments live (“that’s a TikTok”) so chat hunts with you',
          'Mid-stream reminder: follow + turn on notifications',
          'End screen: raid + “clips dropping after stream”'
        ]
      },
      actions: [
        'Go live on Twitch (Siege)',
        'After stream: Streamladder pass — mark 8–12 moments',
        'Ship best 2–4 clips to TikTok + YT Shorts same day',
        `Use a ${CLIP_FORMULAS[i % CLIP_FORMULAS.length].label} hook on at least one clip`,
        'Raid a similar-size Siege streamer'
      ],
      clipTarget: 3,
      focus: seriesHint.why,
      seriesId: seriesHint.id
    });
  }

  return {
    weekOf: iso(monday),
    headline: 'Manager plan — grow TikTok → feed Twitch avg viewers',
    northStar: PROFILE.goals.northStar,
    clipTargetTotal: days.reduce((n, d) => n + d.clipTarget, 0),
    siegeStreams: days.filter((d) => d.mode === 'siege').length,
    varietyStreams: days.filter((d) => d.mode === 'variety').length,
    days,
    pillars: PILLARS,
    rules: MANAGER_RULES
  };
}

export function todayPlan(plan, now = new Date()) {
  const key = iso(now);
  return plan.days.find((d) => d.date === key) || plan.days[0];
}

export function briefingMemo(plan, scoreboard = {}) {
  const today = todayPlan(plan);
  const tiktok = scoreboard.tiktokViewsWeek ?? null;
  const avg = scoreboard.twitchAvgViewers ?? null;

  return {
    greeting: `Quicksense — here’s your move`,
    today,
    priorities: [
      {
        rank: 1,
        title: today.mode === 'reset' ? 'Study the tape' : 'Hit today’s stream plan',
        detail: today.title
      },
      {
        rank: 2,
        title: `Ship ~${today.clipTarget} clip(s)`,
        detail: 'Same-day posts to TikTok + Shorts with Twitch CTA'
      },
      {
        rank: 3,
        title: 'Protect the funnel',
        detail: PROFILE.cta.short
      }
    ],
    health: [
      avg == null
        ? 'Log Twitch avg viewers so we can track live growth.'
        : `Twitch avg viewers logged: ${avg}`,
      tiktok == null
        ? 'Log weekly TikTok views — this is your top-of-funnel.'
        : `TikTok views this week: ${tiktok}`
    ],
    watchouts: [
      PROFILE.constraints.noFacecam ? 'No facecam — hook with text + gameplay motion.' : null,
      PROFILE.constraints.noIrl ? 'No IRL pivots this season.' : null,
      'If you feel like posting a random trend: don’t. Run a series play instead.'
    ].filter(Boolean)
  };
}

export function suggestClipsFromFormulas(count = 4) {
  const picks = [];
  for (let i = 0; i < count; i++) {
    const f = CLIP_FORMULAS[i % CLIP_FORMULAS.length];
    picks.push({
      id: `suggest_${f.id}_${i}`,
      formulaId: f.id,
      title: f.hook,
      caption: `${f.hook}\n\n${PROFILE.cta.short}\n#RainbowSixSiege #R6 #SiegeClips`,
      platform: 'tiktok',
      alsoPost: 'youtube',
      tip: f.captionTip,
      status: 'todo'
    });
  }
  return picks;
}

function startOfWeekMonday(d) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function iso(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export { PROFILE, PILLARS, SERIES };
