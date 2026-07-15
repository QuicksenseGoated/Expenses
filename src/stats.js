import { readinessScore, funnelMixAdvice, pillarBalance, STATUSES } from './frameworks.js';

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function isoDate(d) {
  const x = new Date(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function computeDashboard({ strategy, pieces, ideas }) {
  const today = startOfDay(new Date());
  const nextWeek = addDays(today, 7);

  const byStatus = Object.fromEntries(STATUSES.map((s) => [s.id, 0]));
  pieces.forEach((p) => {
    if (byStatus[p.status] != null) byStatus[p.status] += 1;
  });

  const upcoming = pieces
    .filter((p) => p.publishDate)
    .filter((p) => {
      const d = startOfDay(p.publishDate);
      return d >= today && d <= nextWeek && !['published', 'measured'].includes(p.status);
    })
    .sort((a, b) => a.publishDate.localeCompare(b.publishDate));

  const overdue = pieces
    .filter((p) => p.publishDate)
    .filter((p) => {
      const d = startOfDay(p.publishDate);
      return d < today && !['published', 'measured'].includes(p.status);
    })
    .sort((a, b) => a.publishDate.localeCompare(b.publishDate));

  const needsBriefWork = pieces
    .filter((p) => ['planned', 'drafting', 'ready'].includes(p.status))
    .map((p) => ({ ...p, score: readinessScore(p) }))
    .filter((p) => p.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  const measured = pieces.filter((p) => p.status === 'measured' || p.results?.loggedAt);
  const totals = measured.reduce(
    (acc, p) => {
      acc.views += Number(p.results?.views) || 0;
      acc.clicks += Number(p.results?.clicks) || 0;
      acc.leads += Number(p.results?.leads) || 0;
      acc.conversions += Number(p.results?.conversions) || 0;
      return acc;
    },
    { views: 0, clicks: 0, leads: 0, conversions: 0 }
  );

  const publishedThisMonth = pieces.filter((p) => {
    if (!['published', 'measured'].includes(p.status) || !p.publishDate) return false;
    const d = new Date(p.publishDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const targetPerWeek = strategy.cadencePerWeek || 0;
  const weeksInMonth = 4;
  const monthlyTarget = targetPerWeek * weeksInMonth;

  const funnel = funnelMixAdvice(pieces, strategy.primaryGoal);
  const pillars = pillarBalance(pieces, strategy.pillars || []);

  const setupHealth = scoreSetup(strategy);

  return {
    byStatus,
    upcoming,
    overdue,
    needsBriefWork,
    totals,
    publishedThisMonth,
    monthlyTarget,
    funnel,
    pillars,
    setupHealth,
    ideaCount: ideas.length,
    pieceCount: pieces.length
  };
}

export function scoreSetup(strategy) {
  const checks = [
    { ok: !!strategy.brandName?.trim(), label: 'Brand / project name' },
    { ok: !!strategy.niche?.trim(), label: 'Niche defined' },
    { ok: !!strategy.audience?.trim(), label: 'Audience written' },
    { ok: !!strategy.primaryGoal, label: 'Primary goal' },
    { ok: (strategy.pillars || []).length >= 3, label: 'At least 3 pillars' },
    { ok: (strategy.platforms || []).length >= 1, label: 'Platforms selected' },
    { ok: (strategy.cadencePerWeek || 0) >= 1, label: 'Weekly cadence set' },
    { ok: !!strategy.successMetric?.trim(), label: 'Success metric named' }
  ];
  const done = checks.filter((c) => c.ok).length;
  return {
    score: Math.round((done / checks.length) * 100),
    checks,
    ready: done === checks.length
  };
}

export function piecesForMonth(pieces, year, month) {
  // month: 0-indexed
  return pieces.filter((p) => {
    if (!p.publishDate) return false;
    const d = new Date(p.publishDate + 'T12:00:00');
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function buildMonthGrid(year, month, weekStartsOn = 1) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startPad = (first.getDay() - weekStartsOn + 7) % 7;
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({
      day,
      date: isoDate(date),
      isToday: isoDate(date) === isoDate(new Date())
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export { isoDate, addDays, startOfDay };
