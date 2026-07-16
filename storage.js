import { FOCUS_PLAYS } from './facts.js';

const KEYS = {
  seeded: 'sense.v3',
  score: 'sense.score',
  posts: 'sense.posts',
  checks: 'sense.checks',
  savedIdeas: 'sense.savedIdeas',
  focus: 'sense.focusPlay',
  raids: 'sense.raids',
  customIdeas: 'sense.customIdeas',
  customFormats: 'sense.customFormats',
  formatRuns: 'sense.formatRuns',
  tonightFormat: 'sense.tonightFormat',
  todayRaid: 'sense.todayRaid'
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(p) {
  return `${p}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export const Storage = {
  ensureSeeded() {
    if (!read(KEYS.seeded, false)) {
      write(KEYS.score, {
        twitchAcv: null,
        twitchFollowers: null,
        tiktokViewsWeek: null,
        tiktokFollowers: null,
        history: [],
        updatedAt: null
      });
      write(KEYS.posts, []);
      write(KEYS.checks, {});
      write(KEYS.savedIdeas, []);
      write(KEYS.focus, FOCUS_PLAYS[0].id);
      write(KEYS.raids, []);
      write(KEYS.customIdeas, []);
      write(KEYS.customFormats, []);
      write(KEYS.formatRuns, []);
      write(KEYS.tonightFormat, null);
      write(KEYS.todayRaid, null);
      write(KEYS.seeded, true);
      return;
    }
    if (read(KEYS.raids, null) == null) write(KEYS.raids, []);
    if (read(KEYS.customIdeas, null) == null) write(KEYS.customIdeas, []);
    if (read(KEYS.customFormats, null) == null) write(KEYS.customFormats, []);
    if (read(KEYS.formatRuns, null) == null) write(KEYS.formatRuns, []);
  },

  reset() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem('sense.route');
    this.ensureSeeded();
  },

  getScore() {
    return read(KEYS.score, {});
  },

  saveScore(patch) {
    const next = { ...this.getScore(), ...patch, updatedAt: new Date().toISOString() };
    write(KEYS.score, next);
    return next;
  },

  snapshot(note = '') {
    const s = this.getScore();
    const entry = {
      id: uid('h'),
      date: new Date().toISOString().slice(0, 10),
      twitchAcv: s.twitchAcv,
      tiktokViewsWeek: s.tiktokViewsWeek,
      twitchFollowers: s.twitchFollowers,
      tiktokFollowers: s.tiktokFollowers,
      note
    };
    const history = [entry, ...(s.history || [])].slice(0, 52);
    return this.saveScore({ history });
  },

  getPosts() {
    return read(KEYS.posts, []);
  },

  addPost(post) {
    const item = {
      id: uid('p'),
      title: '',
      platform: 'tiktok',
      views: null,
      date: new Date().toISOString().slice(0, 10),
      note: '',
      tag: null,
      ideaId: null,
      verdict: null, // repeat | kill | null
      ...post
    };
    write(KEYS.posts, [item, ...this.getPosts()].slice(0, 200));
    return item;
  },

  updatePost(id, patch) {
    const posts = this.getPosts();
    const i = posts.findIndex((p) => p.id === id);
    if (i < 0) return null;
    posts[i] = { ...posts[i], ...patch };
    write(KEYS.posts, posts);
    return posts[i];
  },

  deletePost(id) {
    write(KEYS.posts, this.getPosts().filter((p) => p.id !== id));
  },

  topPosts(n = 5) {
    return [...this.getPosts()]
      .filter((p) => p.views != null)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, n);
  },

  getChecks() {
    return read(KEYS.checks, {});
  },

  toggleCheck(dayIso, index) {
    const all = this.getChecks();
    const day = { ...(all[dayIso] || {}) };
    day[index] = !day[index];
    all[dayIso] = day;
    write(KEYS.checks, all);
    return day;
  },

  getSavedIdeas() {
    return new Set(read(KEYS.savedIdeas, []));
  },

  toggleSavedIdea(id) {
    const set = this.getSavedIdeas();
    if (set.has(id)) set.delete(id);
    else set.add(id);
    write(KEYS.savedIdeas, [...set]);
    return set;
  },

  getFocusPlayId() {
    return read(KEYS.focus, FOCUS_PLAYS[0].id);
  },

  setFocusPlayId(id) {
    write(KEYS.focus, id);
  },

  getRaids() {
    return read(KEYS.raids, []);
  },

  saveRaids(list) {
    write(KEYS.raids, list.slice(0, 12));
  },

  addRaid(name) {
    const n = String(name || '').trim().replace(/^@/, '');
    if (!n) return this.getRaids();
    const list = [n, ...this.getRaids().filter((x) => x.toLowerCase() !== n.toLowerCase())];
    this.saveRaids(list);
    return list;
  },

  removeRaid(name) {
    this.saveRaids(this.getRaids().filter((x) => x !== name));
  },

  getTodayRaid() {
    return read(KEYS.todayRaid, null);
  },

  setTodayRaid(name) {
    write(KEYS.todayRaid, name || null);
  },

  getCustomFormats() {
    return read(KEYS.customFormats, []);
  },

  addCustomFormat(format) {
    const item = {
      id: uid('cf'),
      tag: 'custom',
      title: '',
      pitch: '',
      run: [],
      length: 'custom',
      titleExample: '',
      chat: '',
      why: 'Your format',
      custom: true,
      ...format
    };
    write(KEYS.customFormats, [item, ...this.getCustomFormats()].slice(0, 50));
    return item;
  },

  deleteCustomFormat(id) {
    write(KEYS.customFormats, this.getCustomFormats().filter((i) => i.id !== id));
  },

  getFormatRuns() {
    return read(KEYS.formatRuns, []);
  },

  addFormatRun(run) {
    const item = {
      id: uid('fr'),
      formatId: null,
      title: '',
      tag: null,
      date: new Date().toISOString().slice(0, 10),
      acv: null,
      note: '',
      ...run
    };
    write(KEYS.formatRuns, [item, ...this.getFormatRuns()].slice(0, 200));
    return item;
  },

  deleteFormatRun(id) {
    write(KEYS.formatRuns, this.getFormatRuns().filter((r) => r.id !== id));
  },

  getTonightFormat() {
    return read(KEYS.tonightFormat, null);
  },

  setTonightFormat(id) {
    write(KEYS.tonightFormat, id || null);
  },

  exportAll() {
    return {
      v: 3,
      at: new Date().toISOString(),
      score: this.getScore(),
      posts: this.getPosts(),
      checks: this.getChecks(),
      savedIdeas: [...this.getSavedIdeas()],
      focus: this.getFocusPlayId(),
      raids: this.getRaids(),
      customFormats: this.getCustomFormats(),
      formatRuns: this.getFormatRuns(),
      tonightFormat: this.getTonightFormat(),
      todayRaid: this.getTodayRaid()
    };
  },

  importAll(data) {
    if (!data || data.v !== 3) throw new Error('Need Sense Desk v3 export');
    if (data.score) write(KEYS.score, data.score);
    if (data.posts) write(KEYS.posts, data.posts);
    if (data.checks) write(KEYS.checks, data.checks);
    if (data.savedIdeas) write(KEYS.savedIdeas, data.savedIdeas);
    if (data.focus) write(KEYS.focus, data.focus);
    if (data.raids) write(KEYS.raids, data.raids);
    if (data.customFormats) write(KEYS.customFormats, data.customFormats);
    if (data.formatRuns) write(KEYS.formatRuns, data.formatRuns);
    if (data.tonightFormat !== undefined) write(KEYS.tonightFormat, data.tonightFormat);
    if (data.todayRaid !== undefined) write(KEYS.todayRaid, data.todayRaid);
    write(KEYS.seeded, true);
  }
};
