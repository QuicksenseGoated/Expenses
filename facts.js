/**
 * Hard operating facts for Quicksense growth desk.
 * Sources: 2026 Twitch/TikTok growth research + client constraints.
 * No public scrape of Quicksense analytics was available — numbers are user-logged.
 */

export const CLIENT = {
  name: 'Quicksense',
  twitch: 'QuicksenseGoated',
  youtube: 'quicksens',
  tiktok: 'quicksenseclips3',
  twitchUrl: 'https://www.twitch.tv/quicksensegoated',
  youtubeUrl: 'https://www.youtube.com/@quicksens',
  tiktokUrl: 'https://www.tiktok.com/@quicksenseclips3',
  game: 'Rainbow Six Siege',
  vibe: 'chaotic funny',
  streamDays: { siege: 5, variety: 1 },
  tools: 'Streamladder',
  bans: ['facecam', 'IRL', 'empty trend dances'],
  kpis: ['twitch_acv', 'tiktok_views_week'],
  cta: 'LIVE on Twitch → QuicksenseGoated'
};

/** Business model of the channel */
export const MODEL = {
  product: 'Twitch live (ACV / average concurrent viewers)',
  acquisition: 'TikTok + YouTube Shorts clips',
  retention: 'Chat energy + fixed schedule + raids',
  proof:
    'R6 breakouts (e.g. Jynxzi path) were clip→Twitch funnels, not directory luck. In 2026 Twitch sorts live by viewer count — cold ACV stays buried without off-platform traffic.'
};

export const OPERATING_RULES = [
  {
    id: 'acv',
    rule: 'Optimize for Twitch ACV, not follower vanity.',
    why: 'Directory ranks by live viewers. Followers who never show up do not move rank.'
  },
  {
    id: 'funnel',
    rule: 'Every short is an ad for the live show.',
    why: 'TikTok/Shorts are discovery. Twitch is conversion. Orphan clips waste inventory.'
  },
  {
    id: 'hook1s',
    rule: 'Hook in the first 1 second. Cut to the moment.',
    why: '2026 short-form abandon spikes before 2s. Lobby/menu openers die in Stage 1 tests.'
  },
  {
    id: 'length',
    rule: 'Ship 15–30s vertical clips. Prefer loopable endings.',
    why: 'Completion + loops drive watch time — the heaviest distribution signal.'
  },
  {
    id: 'volume',
    rule: 'Target 2–4 clips per Siege day (≈10–20/week). Floor: 1/day.',
    why: 'Each post is a distribution test. More qualified tests → higher hit rate.'
  },
  {
    id: 'sameday',
    rule: 'Post same day via Streamladder when possible.',
    why: 'Freshness compounds with “just streamed” energy and title relevance.'
  },
  {
    id: 'nocam',
    rule: 'No facecam: lead with motion + on-screen text.',
    why: 'Without face, the first frame must be the payoff or a bold hook line.'
  },
  {
    id: 'raid',
    rule: 'Raid a similar-size Siege channel every stream.',
    why: 'Live social proof and reciprocal traffic beat hoping the directory finds you.'
  }
];

/**
 * Idea bank — ready-to-use. Each tied to a mechanism that works in R6 short-form.
 * Tags: clutch | fail | chat | series | variety | teaser
 */
export const IDEAS = [
  {
    id: 'i1',
    tag: 'clutch',
    hook: '1vX and it should not have worked',
    caption: `1vX and it should not have worked\n\n${CLIENT.cta}\n#R6Siege #RainbowSixSiege #SiegeClips`,
    use: 'Start on the last enemy peek, not the setup. End on killcam or silence.',
    why: 'High-stakes 1vX is a proven R6 seed category on TikTok.'
  },
  {
    id: 'i2',
    tag: 'fail',
    hook: 'I threw the round for science',
    caption: `I threw the round for science\n\n${CLIENT.cta}\n#R6Siege #SiegeFails #RainbowSix`,
    use: 'Self-roast > explaining. Cut dead air before the throw.',
    why: 'Fail/humor clips share harder than clean frags for chaotic brands.'
  },
  {
    id: 'i3',
    tag: 'chat',
    hook: 'Chat picked the strat. Instant regret.',
    caption: `Chat picked the strat. Instant regret.\n\n${CLIENT.cta}\n#R6Siege #Twitch #SiegeClips`,
    use: 'Burn chat message as text overlay (no facecam).',
    why: 'Chat-driven bits signal personality; converts clip viewers into live chatters.'
  },
  {
    id: 'i4',
    tag: 'series',
    hook: 'Part 1 — one round from rank up',
    caption: `Part 1 — one round from rank up\nPart 2 after stream.\n\n${CLIENT.cta}\n#R6Siege #Ranked`,
    use: 'Rank or Ruin pack: 2–3 parts in 24–48h. End part 1 mid-tension.',
    why: 'Series create return visits + profile taps; better than one-off spikes.'
  },
  {
    id: 'i5',
    tag: 'series',
    hook: 'Only [Operator] for the whole session',
    caption: `Only [Operator] for the whole session\n\n${CLIENT.cta}\n#R6Siege #Operator`,
    use: 'Operator Lock week. Tease day 1, montage day 7.',
    why: 'Constraint content = novelty without dancing on trends.'
  },
  {
    id: 'i6',
    tag: 'clutch',
    hook: 'They never checked here',
    caption: `They never checked here\n\n${CLIENT.cta}\n#R6Siege #SiegeClips`,
    use: 'Cheeky hold / off-angle. Keep under 20s.',
    why: '“IQ play” hooks perform in game-interest buckets.'
  },
  {
    id: 'i7',
    tag: 'fail',
    hook: 'This is the exact moment the session died',
    caption: `This is the exact moment the session died\n\n${CLIENT.cta}\n#R6Siege #Tilt`,
    use: 'Tilt spiral as Rank or Ruin B-roll.',
    why: 'Emotional swing = saves/shares; algorithm weights those over likes.'
  },
  {
    id: 'i8',
    tag: 'teaser',
    hook: 'Live in 20 — ranked until we hit [goal]',
    caption: `Live in 20 — ranked until we hit [goal]\n\nTwitch: ${CLIENT.twitch}\n#R6Siege #TwitchStreamer`,
    use: 'Pre-stream teaser. Post 20–60 min before go-live.',
    why: 'Warm ACV at minute 0 matters; cold starts stay buried in directory.'
  },
  {
    id: 'i9',
    tag: 'variety',
    hook: 'Siege brain in [game] is illegal',
    caption: `Siege brain in [game] is illegal\n\n${CLIENT.cta}\n#VarietyStreamer #Twitch`,
    use: 'Variety night only. Cap at 1–2 clips that day.',
    why: 'Bridges weekly variety without rebranding away from Siege.'
  },
  {
    id: 'i10',
    tag: 'series',
    hook: 'Chat decides site. I cope.',
    caption: `Chat decides site. I cope.\n\n${CLIENT.cta}\n#R6Siege #TwitchChat`,
    use: 'Run live once/week. Clip the worst call.',
    why: 'Interaction segments raise live chat velocity — a Twitch ranking input.'
  },
  {
    id: 'i11',
    tag: 'clutch',
    hook: 'Ace or kick — chat’s rules',
    caption: `Ace or kick — chat’s rules\n\n${CLIENT.cta}\n#R6Siege #SiegeClips`,
    use: 'Stakes announced in first frame text.',
    why: 'Challenge framing raises completion vs raw gameplay dump.'
  },
  {
    id: 'i12',
    tag: 'teaser',
    hook: 'Clips from tonight’s ranked drop after stream',
    caption: `Clips from tonight’s ranked drop after stream\n\n${CLIENT.cta}\n#R6Siege`,
    use: 'End-screen / last clip of night. Train audience to expect same-day posts.',
    why: 'Consistency trains the game-interest cluster to expect your account daily.'
  },
  {
    id: 'i13',
    tag: 'fail',
    hook: 'Trusted the teammate. Mistake.',
    caption: `Trusted the teammate. Mistake.\n\n${CLIENT.cta}\n#R6Siege #SiegeFails`,
    use: 'Betrayal/teamfail beats. Fast cut.',
    why: 'Relatable R6 pain = comments (distribution signal).'
  },
  {
    id: 'i14',
    tag: 'variety',
    hook: 'When the Minecraft SMP starts: Siege stack tactics',
    caption: `Siege stack tactics in Minecraft (SMP soon)\n\n${CLIENT.cta}\n#Minecraft #Twitch`,
    use: 'Park for SMP launch. Don’t post until real.',
    why: 'Future bridge content — only activate when SMP is live.'
  },
  {
    id: 'i15',
    tag: 'clutch',
    hook: 'Defuser down. No time. Watch.',
    caption: `Defuser down. No time. Watch.\n\n${CLIENT.cta}\n#R6Siege #Clutch`,
    use: 'Plant/defuse clock tension. Loop last 1s into first frame if possible.',
    why: 'Timer tension + loops inflate watch time.'
  }
];

export const FOCUS_PLAYS = [
  {
    id: 'same_day',
    title: 'Same-day clip ship',
    steps: [
      'Stream Siege',
      'Streamladder within 30 min',
      'Post best 2–4 to TikTok + Shorts',
      'CTA on every caption',
      'Raid out'
    ]
  },
  {
    id: 'rank_ruin',
    title: 'Rank or Ruin (series week)',
    steps: [
      'Pick one ranked block as the story',
      'Clip 3 beats: hope → collapse → ending',
      'Post as Part 1–3 across 24–48h',
      'Point Parts 1–2 at live for the finish'
    ]
  },
  {
    id: 'op_lock',
    title: 'Operator Lock',
    steps: [
      'Announce 1–2 ops only',
      'Tease clip day 1',
      'Clip constraint fails all week',
      'End-week montage'
    ]
  }
];

export function dayPlan(date = new Date()) {
  const dow = date.getDay(); // 0 Sun … 6 Sat
  const iso = toISO(date);
  if (dow === 0) {
    return {
      iso,
      mode: 'review',
      title: 'Review + queue',
      focusPlayId: 'same_day',
      actions: [
        'Log TikTok weekly views + Twitch ACV in Numbers',
        'Mark top 3 / bottom 3 posts in the log',
        'Queue Monday teaser hook from Ideas',
        'Raid list: 3 similar-size Siege channels for the week'
      ]
    };
  }
  if (dow === 6) {
    return {
      iso,
      mode: 'variety',
      title: 'Variety night',
      focusPlayId: 'same_day',
      actions: [
        'Go live (non-Siege) — keep chaotic energy',
        'Clip 1–2 “Siege brain in X” max',
        'Post TT + Shorts with Twitch CTA',
        'Raid out'
      ]
    };
  }
  const focusPlayId = dow % 2 === 0 ? 'rank_ruin' : 'same_day';
  return {
    iso,
    mode: 'siege',
    title: 'Siege stream day',
    focusPlayId,
    actions: [
      'Go live Siege — talk for clips, call moments out',
      'Streamladder: mark 8–12 → ship 2–4 same day',
      'Post TikTok + Shorts with CTA',
      'Log each post’s views later in Numbers',
      'Raid similar-size Siege streamer'
    ]
  };
}

function toISO(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}
