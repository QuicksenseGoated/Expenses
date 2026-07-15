/** Built-in frameworks that turn vague posting into a results system. */

export const GOALS = [
  {
    id: 'traffic',
    label: 'Traffic',
    blurb: 'Grow discoverable reach — SEO posts, search-led explainers, shareable lists.',
    metricHint: 'Organic sessions / impressions',
    mix: { tofu: 60, mofu: 30, bofu: 10 }
  },
  {
    id: 'leads',
    label: 'Leads',
    blurb: 'Capture emails & demos — problem/solution content, comparisons, lead magnets.',
    metricHint: 'Email signups / demo requests',
    mix: { tofu: 40, mofu: 40, bofu: 20 }
  },
  {
    id: 'authority',
    label: 'Authority',
    blurb: 'Become the trusted voice — frameworks, case studies, contrarian takes.',
    metricHint: 'Shares, mentions, inbound collabs',
    mix: { tofu: 30, mofu: 50, bofu: 20 }
  },
  {
    id: 'sales',
    label: 'Sales',
    blurb: 'Move buyers — objections, proof, offer breakdowns, customer stories.',
    metricHint: 'Conversions / revenue attributed',
    mix: { tofu: 20, mofu: 35, bofu: 45 }
  }
];

export const PLATFORMS = [
  { id: 'blog', label: 'Blog / SEO', defaultFormat: 'Long-form article' },
  { id: 'linkedin', label: 'LinkedIn', defaultFormat: 'Short post + carousel' },
  { id: 'youtube', label: 'YouTube', defaultFormat: 'Scripted video' },
  { id: 'newsletter', label: 'Newsletter', defaultFormat: 'Email issue' },
  { id: 'x', label: 'X / Twitter', defaultFormat: 'Thread' },
  { id: 'instagram', label: 'Instagram', defaultFormat: 'Reel / carousel' },
  { id: 'tiktok', label: 'TikTok', defaultFormat: 'Short video' },
  { id: 'podcast', label: 'Podcast', defaultFormat: 'Episode outline' }
];

export const FUNNEL = [
  {
    id: 'tofu',
    label: 'TOFU',
    full: 'Top of funnel',
    intent: 'Awareness — attract people who feel the problem',
    color: 'var(--funnel-tofu)'
  },
  {
    id: 'mofu',
    label: 'MOFU',
    full: 'Middle of funnel',
    intent: 'Consideration — educate & build trust',
    color: 'var(--funnel-mofu)'
  },
  {
    id: 'bofu',
    label: 'BOFU',
    full: 'Bottom of funnel',
    intent: 'Decision — convert with proof & offer clarity',
    color: 'var(--funnel-bofu)'
  }
];

export const STATUSES = [
  { id: 'idea', label: 'Idea', order: 0 },
  { id: 'planned', label: 'Planned', order: 1 },
  { id: 'drafting', label: 'Drafting', order: 2 },
  { id: 'ready', label: 'Ready', order: 3 },
  { id: 'published', label: 'Published', order: 4 },
  { id: 'measured', label: 'Measured', order: 5 }
];

export const PILLAR_SUGGESTIONS = {
  saas: [
    { name: 'Product education', promise: 'Help users get value faster' },
    { name: 'Industry trends', promise: 'Show you understand the market' },
    { name: 'Customer proof', promise: 'Reduce risk with real outcomes' },
    { name: 'Workflow playbooks', promise: 'Give repeatable systems people can steal' }
  ],
  creator: [
    { name: 'Behind the craft', promise: 'Show how the work actually gets made' },
    { name: 'Audience growth', promise: 'Teach tactics that compound' },
    { name: 'Monetization', promise: 'Turn attention into income' },
    { name: 'Mindset & habits', promise: 'Help people stay consistent' }
  ],
  local: [
    { name: 'Service education', promise: 'Answer the questions buyers already ask' },
    { name: 'Neighborhood trust', promise: 'Become familiar before they need you' },
    { name: 'Before / after proof', promise: 'Make results visible' },
    { name: 'Seasonal offers', promise: 'Create timely reasons to act' }
  ],
  b2b: [
    { name: 'Buyer problems', promise: 'Name the pain better than they can' },
    { name: 'Decision frameworks', promise: 'Help teams choose with confidence' },
    { name: 'Implementation guides', promise: 'Remove fear of switching' },
    { name: 'ROI & proof', promise: 'Justify budget with numbers' }
  ]
};

export const BRIEF_CHECKLIST = [
  { key: 'clearHook', label: 'Hook stops the scroll / earns the click' },
  { key: 'onePromise', label: 'One clear promise for the reader' },
  { key: 'proofIncluded', label: 'Proof, example, or data included' },
  { key: 'ctaDefined', label: 'CTA matches the funnel stage' },
  { key: 'seoBasics', label: 'Primary keyword + search intent (if SEO)' },
  { key: 'distributionPlan', label: 'Where it gets redistributed after publish' }
];

export const SETUP_STEPS = [
  {
    id: 'goal',
    title: 'Pick one primary goal',
    body: 'Everything else bends around this. Secondary goals are fine — but one metric owns the calendar.'
  },
  {
    id: 'audience',
    title: 'Define who this is for',
    body: 'Be specific: role, struggle, and what “better” looks like for them in 90 days.'
  },
  {
    id: 'pillars',
    title: 'Choose 3–5 content pillars',
    body: 'Pillars are themes you can publish on for months. If a topic doesn’t serve a pillar, it doesn’t ship.'
  },
  {
    id: 'cadence',
    title: 'Set a realistic publishing cadence',
    body: 'Consistency beats volume. Start with what you can finish weekly for 8 weeks straight.'
  },
  {
    id: 'brief',
    title: 'Write briefs before drafts',
    body: 'Hook, promise, proof, CTA. If the brief is weak, the draft will be too.'
  },
  {
    id: 'measure',
    title: 'Log results within 7–14 days',
    body: 'Publish without measurement is guessing. Capture what moved your primary metric, then double down.'
  }
];

export function goalById(id) {
  return GOALS.find((g) => g.id === id) || GOALS[1];
}

export function platformById(id) {
  return PLATFORMS.find((p) => p.id === id);
}

export function funnelById(id) {
  return FUNNEL.find((f) => f.id === id);
}

export function statusById(id) {
  return STATUSES.find((s) => s.id === id);
}

export function readinessScore(piece) {
  if (!piece?.checklist) return 0;
  const keys = BRIEF_CHECKLIST.map((c) => c.key);
  const done = keys.filter((k) => piece.checklist[k]).length;
  return Math.round((done / keys.length) * 100);
}

export function funnelMixAdvice(pieces, goalId) {
  const goal = goalById(goalId);
  const active = pieces.filter((p) => !['idea'].includes(p.status));
  if (active.length === 0) {
    return {
      counts: { tofu: 0, mofu: 0, bofu: 0 },
      percents: { tofu: 0, mofu: 0, bofu: 0 },
      target: goal.mix,
      tips: ['Plan your first pieces across TOFU / MOFU / BOFU so the calendar isn’t all awareness fluff.']
    };
  }
  const counts = { tofu: 0, mofu: 0, bofu: 0 };
  active.forEach((p) => {
    if (counts[p.funnel] != null) counts[p.funnel] += 1;
  });
  const total = active.length;
  const percents = {
    tofu: Math.round((counts.tofu / total) * 100),
    mofu: Math.round((counts.mofu / total) * 100),
    bofu: Math.round((counts.bofu / total) * 100)
  };
  const tips = [];
  (['tofu', 'mofu', 'bofu']).forEach((stage) => {
    const diff = percents[stage] - goal.mix[stage];
    if (diff < -12) {
      tips.push(`You’re light on ${stage.toUpperCase()} vs a ${goal.label} goal — aim nearer ${goal.mix[stage]}%.`);
    } else if (diff > 18) {
      tips.push(`Heavy on ${stage.toUpperCase()}. Rebalance toward ${goal.label.toLowerCase()}-driving stages.`);
    }
  });
  if (tips.length === 0) {
    tips.push(`Funnel mix looks aligned with a ${goal.label.toLowerCase()} goal. Keep shipping.`);
  }
  return { counts, percents, target: goal.mix, tips };
}

export function pillarBalance(pieces, pillars) {
  const map = Object.fromEntries(pillars.map((p) => [p.id, 0]));
  pieces.forEach((piece) => {
    if (piece.pillarId && map[piece.pillarId] != null) map[piece.pillarId] += 1;
  });
  const values = Object.values(map);
  if (!values.length) return { map, tip: 'Add pillars in Strategy so topics stay intentional.' };
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  let tip = 'Pillars look reasonably balanced.';
  if (max - min >= 4 && max > 0) {
    const heavyId = Object.keys(map).find((id) => map[id] === max);
    const lightId = Object.keys(map).find((id) => map[id] === min);
    const heavy = pillars.find((p) => p.id === heavyId)?.name || 'one pillar';
    const light = pillars.find((p) => p.id === lightId)?.name || 'another';
    tip = `"${heavy}" is crowding the calendar. Schedule more under "${light}".`;
  }
  return { map, tip };
}
