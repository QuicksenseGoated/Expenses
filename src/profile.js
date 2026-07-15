/** Quicksense brand + growth constraints — the manager's client brief. */

export const PROFILE = {
  displayName: 'Quicksense',
  brandMark: 'QS',
  handles: {
    twitch: 'QuicksenseGoated',
    youtube: 'quicksens',
    tiktok: 'quicksenseclips3'
  },
  urls: {
    twitch: 'https://www.twitch.tv/quicksensegoated',
    youtube: 'https://www.youtube.com/@quicksens',
    tiktok: 'https://www.tiktok.com/@quicksenseclips3'
  },
  niche: 'Rainbow Six Siege streamer — chaotic funny energy, open to variety + future Minecraft SMP',
  primaryPlatform: 'twitch',
  goals: {
    primary: 'twitch_avg_viewers',
    secondary: 'tiktok_views',
    northStar:
      'Grow TikTok reach that converts into Twitch live viewers — clips are the funnel, Twitch is the product.'
  },
  stream: {
    siegeDaysPerWeek: 5,
    varietyDaysPerWeek: 1,
    notes: 'Siege-first. One weekly variety. Minecraft SMP may join later — treat as community expansion, not a rebrand.'
  },
  vibe: 'chaotic funny',
  constraints: {
    noFacecam: true,
    noIrl: true,
    noEmptyTrendChasing: true,
    openToCreative: true
  },
  tools: {
    clipping: 'Streamladder',
    clippingPlan: 'After every Siege stream, pull 5–15 moments → ship best 2–4 same day to TikTok + Shorts'
  },
  cta: {
    short: 'LIVE on Twitch → QuicksenseGoated',
    long: 'Catch the full chaos live: twitch.tv/quicksensegoated'
  },
  audience:
    'Siege players + clip consumers who like personality, fails, clutches, and chat chaos — not sweat-only educational creators.'
};

export const PILLARS = [
  {
    id: 'siege_chaos',
    name: 'Siege Chaos',
    promise: 'Clutches, throws, toxic rounds, and “how did that work” moments',
    platforms: ['tiktok', 'youtube', 'twitch'],
    weight: 40
  },
  {
    id: 'rank_ruin',
    name: 'Rank or Ruin',
    promise: 'Emotional ranked swings — the story of the session',
    platforms: ['tiktok', 'youtube', 'twitch'],
    weight: 20
  },
  {
    id: 'chat_bits',
    name: 'Chat Personality',
    promise: 'Bits, bans, funny replies — you are the entertainment, not just the aim',
    platforms: ['tiktok', 'youtube', 'twitch'],
    weight: 20
  },
  {
    id: 'variety_smp',
    name: 'Variety / SMP',
    promise: 'Weekly off-Siege + future Minecraft SMP for community expansion',
    platforms: ['tiktok', 'youtube', 'twitch'],
    weight: 20
  }
];

export const SERIES = [
  {
    id: 'rank_or_ruin',
    title: 'Rank or Ruin',
    pillarId: 'rank_ruin',
    format: 'Clip pack from one ranked block',
    hookFormula: 'I was one round from [rank] — then THIS happened',
    why: 'Story arcs keep people watching multiple clips and checking if you’re live.'
  },
  {
    id: 'operator_lock',
    title: 'Operator Lock Week',
    pillarId: 'siege_chaos',
    format: 'Only X operators for a week',
    hookFormula: 'Only allowed to play [op] for 7 days…',
    why: 'Built-in novelty + easy clip titles without dancing on trends.'
  },
  {
    id: 'chat_decides',
    title: 'Chat Decides the Strat',
    pillarId: 'chat_bits',
    format: 'Chat picks site/strat/op live',
    hookFormula: 'Chat made me do the worst strat in Siege',
    why: 'Interaction = retention on Twitch and clip bait for TikTok.'
  },
  {
    id: 'siege_brain',
    title: 'Siege Brain',
    pillarId: 'variety_smp',
    format: 'Variety / future SMP with Siege commentary energy',
    hookFormula: 'Siege brain in [game] is illegal',
    why: 'Bridges variety nights so you don’t lose the Siege audience.'
  }
];
