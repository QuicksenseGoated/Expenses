/**
 * Quicksense growth desk — stream formats + operating model.
 * Short-form clips = Streamladder (auto). Ideas here = what to RUN on stream.
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

export const MODEL = {
  product: 'Twitch live (ACV)',
  acquisition: 'Streamladder → TikTok/Shorts (auto highlights)',
  retention: 'Stream formats people return for + raids + schedule',
  proof:
    'Twitch ranks by live viewers. Formats that create stakes/chat (KOTH, challenges, chat-ruled ranked) raise ACV; Streamladder turns the chaos into discovery without manual caption farming.'
};

export const OPERATING_RULES = [
  {
    id: 'acv',
    rule: 'Optimize for Twitch ACV.',
    why: 'Directory sorts by live viewers. Formats that hold chat beat random ranked with dead air.'
  },
  {
    id: 'formats',
    rule: 'Run a named format most Siege days.',
    why: 'Titles + returning viewers need a reason (“KOTH night”), not “just ranked again.”'
  },
  {
    id: 'ladder',
    rule: 'Let Streamladder handle shorts. Don’t handcraft TikTok ideas.',
    why: 'Your bottleneck is live product quality/consistency, not caption writing.'
  },
  {
    id: 'sameday',
    rule: 'Approve/ship Streamladder output same day.',
    why: 'Fresh VODs distribute better; still log TT weekly views in Numbers.'
  },
  {
    id: 'stakes',
    rule: 'Put stakes on stream (rules, lockouts, tournaments).',
    why: 'Stakes create moments Ladder can clip and give chat a job.'
  },
  {
    id: 'nocam',
    rule: 'No facecam/IRL — sell gameplay + voice + on-screen rules.',
    why: 'Overlay the format rules in title/panels so cold traffic gets it fast.'
  },
  {
    id: 'raid',
    rule: 'Raid a similar-size Siege channel every stream.',
    why: 'Live network effects beat hoping the directory finds you.'
  },
  {
    id: 'measure',
    rule: 'Log ACV + which format you ran.',
    why: 'Without format tags you can’t see what actually grows live.'
  }
];

/**
 * Stream formats — long-form / live concepts.
 * tag: ranked | tournament | challenge | community | variety | series
 */
export const FORMATS = [
  {
    id: 'f_koth',
    tag: 'tournament',
    title: 'King of the Hill (KOTH)',
    length: '2–3 hrs',
    titleExample: 'KOTH — winner stays, losers cope',
    pitch: 'One stack/player holds the “throne.” Challengers rotate. Chat crowns / dethrones.',
    run: [
      'Set rules on screen: win condition, round count, who challenges next',
      'Loser queue from chat/friends; throne gets bragging rights',
      'Reset throne every X maps if one person smurfs the lobby',
      'End with sudden-death finals if time'
    ],
    chat: 'Type !challenge / pick next opp in chat',
    why: 'Clear stakes + returning viewers (“is he still king?”). High ACV format for FPS.'
  },
  {
    id: 'f_op_lock',
    tag: 'challenge',
    title: 'Operator Lock',
    length: '1 session or full week',
    titleExample: 'ONLY [OP] — lock week day 2',
    pitch: 'Ban yourself to 1–2 operators. Failures become the show.',
    run: [
      'Announce lock in title + first 2 minutes',
      'No swaps even after throws — that’s the bit',
      'Mid-stream “almost broke the rule” moments = gold for Ladder',
      'Week version: same lock Mon–Fri, Saturday montage vibe'
    ],
    chat: 'Chat votes the locked op at start',
    why: 'Constraint = novelty without trends. Easy series branding.'
  },
  {
    id: 'f_chat_strat',
    tag: 'community',
    title: 'Chat Decides the Strat',
    length: '2 hrs',
    titleExample: 'Chat picks site + strat — I suffer',
    pitch: 'Chat picks site, ops, or execute. You commit even if it’s grief.',
    run: [
      'Poll or first-to-N messages locks the call',
      'One redo max per round or it loses teeth',
      'Roast the plan out loud — chaotic funny, not tilt-quit',
      'End block with “chat record: W-L”'
    ],
    chat: 'Spam site name / !strat',
    why: 'Chat velocity is a Twitch signal; viewers stick to see if the plan fails.'
  },
  {
    id: 'f_rank_ruin',
    tag: 'series',
    title: 'Rank or Ruin',
    length: '2–4 hrs ranked block',
    titleExample: 'Rank or Ruin — stop at +2 or -3',
    pitch: 'One ranked arc with a stop-loss / target. Story > endless grind.',
    run: [
      'Declare start rank + stop rules before queue',
      'Narrate the arc every few games (“one off ruin”)',
      'Hard stop when hit — no “one more” unless chat buys it with a dare',
      'Next stream continues the season'
    ],
    chat: 'Predict W/L in chat before each queue',
    why: 'Serialized live story. People come back for the ending.'
  },
  {
    id: 'f_wheel',
    tag: 'challenge',
    title: 'Punishment Wheel',
    length: '2 hrs',
    titleExample: 'Lose = wheel spin (ops/sensitivity/drone only)',
    pitch: 'Every loss spins a wheel: op lock, sens change, no drones, pistol only, etc.',
    run: [
      'Build 6–8 punishments (keep them playable, not soft-throw forever)',
      'Spin on loss; lasts N rounds',
      'Show wheel text on screen / read it every time',
      'Win streak clears active punishment'
    ],
    chat: 'Suggest wheel slots',
    why: 'Built-in variety inside Siege. Constant stakes for Ladder moments.'
  },
  {
    id: 'f_1v1_tourney',
    tag: 'tournament',
    title: 'Viewer 1v1 / Custom Bracket',
    length: '2–3 hrs',
    titleExample: 'Viewer 1v1 bracket — winner gets [prize]',
    pitch: 'Small bracket in customs. Prize = shoutout, sub, or next-raid pick.',
    run: [
      'Cap entrants (8–16) so it finishes',
      'BO1 until finals BO3',
      'Loser stays as caster/chaos in chat',
      'You play exhibition vs winner at end'
    ],
    chat: 'Entry: follow + type !enter',
    why: 'Community appointment viewing. Growth via participants’ friends lurking.'
  },
  {
    id: 'f_unrated_edu',
    tag: 'ranked',
    title: 'VOD Review Lite (your own throws)',
    length: '60–90 min',
    titleExample: 'Reviewing last night’s worst rounds',
    pitch: 'Watch your own VOD clips/rounds; roast yourself; fix one habit.',
    run: [
      'Pick 5 worst rounds max — don’t do a full lecture',
      'One lesson per round, then queue to apply it',
      'Keep chaotic tone — not coach-core YouTube'
    ],
    chat: 'Timestamp the next throw',
    why: 'Fills a lower-energy day without dead ranked silence.'
  },
  {
    id: 'f_duo_dare',
    tag: 'community',
    title: 'Duo Dare Queue',
    length: '2 hrs',
    titleExample: 'Duo w/ chat picks + dare after every loss',
    pitch: 'Duo with a friend/viewer; chat assigns a dare after losses.',
    run: [
      'Dares must be in-game (op lock, drone cam only 30s, etc.)',
      'Swap duo partner mid-stream if energy dies',
      'Keep mic chaos high — format dies if silent'
    ],
    chat: 'Dare suggestions in chat',
    why: 'Collab ACV bump + shared audiences.'
  },
  {
    id: 'f_new_op',
    tag: 'ranked',
    title: 'Patch / New Op Night',
    length: '2–3 hrs',
    titleExample: 'New op / patch — learning in public',
    pitch: 'First contact with patch notes or new operators. Discovery stream.',
    run: [
      'Read 3 patch changes max, then play',
      'Commit to the new thing even if it’s bad',
      'Title the night around the patch so directory searchers find you'
    ],
    chat: 'What should I try first?',
    why: 'Timely directory traffic around patches.'
  },
  {
    id: 'f_siege_brain',
    tag: 'variety',
    title: 'Siege Brain Variety',
    length: '2–4 hrs',
    titleExample: 'Siege brain in [game]',
    pitch: 'Weekly non-Siege with the same chaotic energy. Don’t rebrand.',
    run: [
      'Open with why this game (10s)',
      'Keep Siege metaphors — that’s the bit',
      'One variety night only — don’t flood the week',
      'When SMP starts: “Siege stack in Minecraft” framing'
    ],
    chat: 'Rate how Siege-coded this is /10',
    why: 'Expands audience without killing Siege identity.'
  },
  {
    id: 'f_smp_siege',
    tag: 'variety',
    title: 'SMP — Siege Stack Rules',
    length: 'when SMP live',
    titleExample: 'Minecraft SMP — clear the site (base)',
    pitch: 'Future SMP: treat bases like sites, execute like Siege.',
    run: [
      'Don’t start until SMP is real',
      'Name plays like Siege executes',
      'Invite stack energy — community servers reward regulars'
    ],
    chat: 'Call the site (base) name',
    why: 'Bridge format ready for later — park until needed.'
  },
  {
    id: 'f_affiliate_push',
    tag: 'series',
    title: 'Affiliate / Goal Push Weekend',
    length: 'extra hour',
    titleExample: 'Push to [goal] — no cope queues',
    pitch: 'Transparent goal stream with format stakes attached.',
    run: [
      'State the number (ACV, hours, follows) once — don’t beg every minute',
      'Pair with KOTH or Rank or Ruin so it’s entertainment',
      'Celebrate milestones with a wheel spin, not a speech'
    ],
    chat: 'Sub/follow goals on screen',
    why: 'Converts lurkers when paired with a real format.'
  },
  {
    id: 'f_map_pool',
    tag: 'challenge',
    title: 'Banned Map Pool',
    length: '1 session',
    titleExample: 'Only [3 maps] tonight',
    pitch: 'Shrink map pool for mastery + running jokes on the same sites.',
    run: [
      'Chat votes 3 maps in',
      'Everything else banned',
      'Track site win rates on screen if you can'
    ],
    chat: '!vote map',
    why: 'Repeat locations create bit continuity and clip familiarity.'
  },
  {
    id: 'f_scrim_rules',
    tag: 'tournament',
    title: 'House Rules Customs',
    length: '2 hrs',
    titleExample: 'Customs — pistol only / no gadgets / random ops',
    pitch: 'Friend customs with stupid competitive rules.',
    run: [
      'One rule set per hour or it gets messy',
      'Keep scoreboard public',
      'Invite 1–2 viewer slots'
    ],
    chat: 'Next rule vote',
    why: 'Low-pressure content day that still looks “event-y” in title.'
  },
  {
    id: 'f_comeback',
    tag: 'series',
    title: 'Comeback Protocol',
    length: 'rest of stream after tilt',
    titleExample: 'Comeback protocol — down bad',
    pitch: 'When tilted: forced format — 3-game reset with op lock + chat strat.',
    run: [
      'Trigger: 3 losses in a row or you say “protocol”',
      'Mandatory water/mute rage 60s then commit',
      'End protocol when you string 2 wins'
    ],
    chat: 'Force !protocol',
    why: 'Stops dead tilt streams; viewers love recovery arcs.'
  }
];

/** @deprecated alias for older imports */
export const IDEAS = FORMATS;

export const FOCUS_PLAYS = [
  {
    id: 'format_night',
    title: 'Named format night',
    steps: [
      'Pick a format from Ideas',
      'Put it in the Twitch title',
      'Run the run-sheet',
      'Streamladder after — approve highlights',
      'Raid out'
    ]
  },
  {
    id: 'koth_week',
    title: 'KOTH week',
    steps: [
      'Mon–Thu: KOTH or Rank or Ruin',
      'Keep throne / rank arc across days',
      'Fri: finals or open bracket',
      'Sat: variety',
      'Sun: log ACV + which formats won'
    ]
  },
  {
    id: 'ladder_ops',
    title: 'Streamladder ops only',
    steps: [
      'Stream first',
      'Open Streamladder within 30 min',
      'Approve best auto clips — don’t rewrite strategy',
      'Log TT weekly views Sunday'
    ]
  }
];

export const FORMAT_TAGS = ['ranked', 'tournament', 'challenge', 'community', 'variety', 'series'];

export function dayPlan(date = new Date()) {
  const dow = date.getDay();
  const iso = toISO(date);
  if (dow === 0) {
    return {
      iso,
      mode: 'review',
      title: 'Review + plan',
      focusPlayId: 'ladder_ops',
      actions: [
        'Log Twitch ACV + TikTok weekly views',
        'Mark which formats you ran (Ideas → Ran it)',
        'Pick Mon–Wed formats in advance',
        'Confirm 3 raid targets'
      ]
    };
  }
  if (dow === 6) {
    return {
      iso,
      mode: 'variety',
      title: 'Variety night',
      focusPlayId: 'format_night',
      actions: [
        'Run Siege Brain Variety (or SMP if live)',
        'Title must say the game + Siege energy',
        'Streamladder approve 1–2 highlights max',
        'Raid out'
      ]
    };
  }
  return {
    iso,
    mode: 'siege',
    title: 'Siege stream day',
    focusPlayId: dow % 2 === 0 ? 'koth_week' : 'format_night',
    actions: [
      'Pick tonight’s format + put it in the title',
      'Go live — run the sheet, keep chat busy',
      'Streamladder: approve same-day highlights',
      'Mark format as ran + note ACV feel',
      'Raid similar-size Siege channel'
    ]
  };
}

export function formatById(id) {
  return FORMATS.find((f) => f.id === id) || null;
}

function toISO(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}
