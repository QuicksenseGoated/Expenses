import { PROFILE, PILLARS } from './profile.js';
import { GROWTH_PLAYS, suggestClipsFromFormulas, buildWeeklyPlan } from './playbook.js';

const KEYS = {
  meta: 'sense.meta',
  scoreboard: 'sense.scoreboard',
  clips: 'sense.clips',
  plays: 'sense.plays',
  checklist: 'sense.dayChecklist',
  notes: 'sense.notes',
  settings: 'sense.settings',
  seeded: 'sense.seeded.v2'
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const DEFAULT_SCOREBOARD = {
  twitchFollowers: null,
  twitchAvgViewers: null,
  tiktokViewsWeek: null,
  tiktokFollowers: null,
  youtubeSubs: null,
  history: [], // { date, twitchAvgViewers, tiktokViewsWeek, note }
  updatedAt: null
};

const DEFAULT_SETTINGS = {
  varietyDay: 6, // Saturday
  clipsPerSiegeDay: 3,
  showManagerTone: true
};

export const Storage = {
  ensureSeeded() {
    if (read(KEYS.seeded, false)) return false;
    this.seed();
    write(KEYS.seeded, true);
    return true;
  },

  seed() {
    write(KEYS.meta, {
      client: PROFILE.displayName,
      seededAt: new Date().toISOString(),
      version: 2
    });
    write(KEYS.scoreboard, { ...DEFAULT_SCOREBOARD });
    write(KEYS.plays, GROWTH_PLAYS.map((p) => ({
      ...p,
      progress: p.status === 'core' ? 'running' : 'queued',
      logs: []
    })));
    write(KEYS.clips, suggestClipsFromFormulas(6).map((c) => ({
      ...c,
      id: uid('clip'),
      createdAt: new Date().toISOString(),
      pillarId: PILLARS[0].id
    })));
    write(KEYS.checklist, {});
    write(KEYS.notes, []);
    write(KEYS.settings, { ...DEFAULT_SETTINGS });
  },

  resetAll() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    this.ensureSeeded();
  },

  getProfile() {
    return PROFILE;
  },

  getSettings() {
    return { ...DEFAULT_SETTINGS, ...read(KEYS.settings, {}) };
  },

  saveSettings(patch) {
    const next = { ...this.getSettings(), ...patch };
    write(KEYS.settings, next);
    return next;
  },

  getScoreboard() {
    return { ...DEFAULT_SCOREBOARD, ...read(KEYS.scoreboard, {}) };
  },

  saveScoreboard(patch) {
    const prev = this.getScoreboard();
    const next = {
      ...prev,
      ...patch,
      updatedAt: new Date().toISOString()
    };
    write(KEYS.scoreboard, next);
    return next;
  },

  logScoreboardSnapshot(note = '') {
    const s = this.getScoreboard();
    const entry = {
      id: uid('snap'),
      date: new Date().toISOString().slice(0, 10),
      twitchAvgViewers: s.twitchAvgViewers,
      tiktokViewsWeek: s.tiktokViewsWeek,
      twitchFollowers: s.twitchFollowers,
      note
    };
    const history = [entry, ...(s.history || [])].slice(0, 60);
    return this.saveScoreboard({ history });
  },

  getClips() {
    return read(KEYS.clips, []);
  },

  saveClips(clips) {
    write(KEYS.clips, clips);
    return clips;
  },

  addClip(clip) {
    const clips = this.getClips();
    const item = {
      id: uid('clip'),
      title: '',
      caption: '',
      platform: 'tiktok',
      alsoPost: 'youtube',
      formulaId: null,
      pillarId: PILLARS[0].id,
      status: 'todo', // todo | editing | posted | winner | killed
      views: null,
      tip: '',
      streamDate: null,
      createdAt: new Date().toISOString(),
      ...clip
    };
    clips.unshift(item);
    this.saveClips(clips);
    return item;
  },

  updateClip(id, patch) {
    const clips = this.getClips();
    const idx = clips.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    clips[idx] = { ...clips[idx], ...patch, updatedAt: new Date().toISOString() };
    this.saveClips(clips);
    return clips[idx];
  },

  deleteClip(id) {
    this.saveClips(this.getClips().filter((c) => c.id !== id));
  },

  getPlays() {
    return read(KEYS.plays, []);
  },

  savePlays(plays) {
    write(KEYS.plays, plays);
    return plays;
  },

  updatePlay(id, patch) {
    const plays = this.getPlays();
    const idx = plays.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    plays[idx] = { ...plays[idx], ...patch };
    this.savePlays(plays);
    return plays[idx];
  },

  logPlay(id, note) {
    const play = this.getPlays().find((p) => p.id === id);
    if (!play) return null;
    const logs = [{ at: new Date().toISOString(), note }, ...(play.logs || [])].slice(0, 20);
    return this.updatePlay(id, { logs, progress: 'running' });
  },

  getChecklist() {
    return read(KEYS.checklist, {});
  },

  toggleChecklist(dateKey, actionIndex) {
    const all = this.getChecklist();
    const day = { ...(all[dateKey] || {}) };
    day[actionIndex] = !day[actionIndex];
    all[dateKey] = day;
    write(KEYS.checklist, all);
    return all;
  },

  getNotes() {
    return read(KEYS.notes, []);
  },

  addNote(text) {
    const notes = this.getNotes();
    notes.unshift({ id: uid('note'), text, at: new Date().toISOString() });
    write(KEYS.notes, notes.slice(0, 100));
    return notes;
  },

  getWeekPlan() {
    return buildWeeklyPlan(new Date());
  },

  exportAll() {
    return {
      version: 2,
      exportedAt: new Date().toISOString(),
      scoreboard: this.getScoreboard(),
      clips: this.getClips(),
      plays: this.getPlays(),
      checklist: this.getChecklist(),
      notes: this.getNotes(),
      settings: this.getSettings()
    };
  },

  importAll(data) {
    if (!data || typeof data !== 'object') throw new Error('Invalid import');
    if (data.scoreboard) write(KEYS.scoreboard, data.scoreboard);
    if (data.clips) write(KEYS.clips, data.clips);
    if (data.plays) write(KEYS.plays, data.plays);
    if (data.checklist) write(KEYS.checklist, data.checklist);
    if (data.notes) write(KEYS.notes, data.notes);
    if (data.settings) write(KEYS.settings, data.settings);
    write(KEYS.seeded, true);
  }
};
