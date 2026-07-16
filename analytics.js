import { CLIENT } from './facts.js';

/** Week starts Monday */
export function weekStartISO(d = new Date()) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return iso(x);
}

export function weekEndISO(d = new Date()) {
  const start = new Date(weekStartISO(d) + 'T12:00:00');
  start.setDate(start.getDate() + 6);
  return iso(start);
}

export function iso(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}

/** Target: 2 clips × 5 Siege days + 1 variety = 11 floor; operate at 14. */
export const WEEKLY_CLIP_TARGET = 14;

export function postsInWeek(posts, d = new Date()) {
  const a = weekStartISO(d);
  const b = weekEndISO(d);
  return posts.filter((p) => p.date >= a && p.date <= b);
}

export function postsToday(posts, d = new Date()) {
  const t = iso(d);
  return posts.filter((p) => p.date === t);
}

export function postingStreak(posts, d = new Date()) {
  const dates = new Set(posts.map((p) => p.date));
  let streak = 0;
  const cur = new Date(d);
  cur.setHours(12, 0, 0, 0);
  // if nothing today, start from yesterday
  if (!dates.has(iso(cur))) {
    cur.setDate(cur.getDate() - 1);
  }
  while (dates.has(iso(cur))) {
    streak += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export function tagStats(posts) {
  const map = {};
  posts.forEach((p) => {
    const tag = p.tag || 'untagged';
    if (!map[tag]) map[tag] = { tag, count: 0, views: 0, withViews: 0 };
    map[tag].count += 1;
    if (p.views != null) {
      map[tag].views += Number(p.views) || 0;
      map[tag].withViews += 1;
    }
  });
  return Object.values(map)
    .map((t) => ({
      ...t,
      avg: t.withViews ? Math.round(t.views / t.withViews) : null
    }))
    .sort((a, b) => (b.avg || 0) - (a.avg || 0));
}

export function bestTag(posts) {
  const stats = tagStats(posts).filter((t) => t.withViews >= 2 && t.tag !== 'untagged');
  return stats[0] || null;
}

export function worstTag(posts) {
  const stats = tagStats(posts).filter((t) => t.withViews >= 2 && t.tag !== 'untagged');
  if (stats.length < 2) return null;
  return stats[stats.length - 1];
}

export function delta(history, field) {
  if (!history || history.length < 2) return null;
  const [a, b] = history;
  if (a[field] == null || b[field] == null) return null;
  return Number(a[field]) - Number(b[field]);
}

export function recommendTag(posts) {
  const best = bestTag(posts);
  if (best) return best.tag;
  // default mix for cold start — clutch/fail dominate R6 short-form
  const hour = new Date().getHours();
  if (hour < 12) return 'teaser';
  return hour % 2 === 0 ? 'clutch' : 'fail';
}

export function quotaLine(posts, d = new Date()) {
  const week = postsInWeek(posts, d);
  const today = postsToday(posts, d);
  const n = week.length;
  const target = WEEKLY_CLIP_TARGET;
  const pct = Math.min(100, Math.round((n / target) * 100));
  let status = 'behind';
  if (n >= target) status = 'hit';
  else if (n >= Math.ceil(target * 0.7)) status = 'on_pace';
  return {
    weekCount: n,
    todayCount: today.length,
    target,
    pct,
    status,
    label: `${n}/${target} posts this week`
  };
}

export { CLIENT };
