import { defaultWeekPlan, weekKey, QUOTAS } from './strategy.js';

const K = {
  boot: 'qs.biz.v1',
  plan: 'qs.plan',
  done: 'qs.done',
  metrics: 'qs.metrics',
  train: 'qs.train',
  decisions: 'qs.decisions',
  raids: 'qs.raids'
};

const read = (k, fb) => {
  try {
    const v = localStorage.getItem(k);
    return v == null ? fb : JSON.parse(v);
  } catch {
    return fb;
  }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const uid = () => Math.random().toString(36).slice(2, 9);

export const DB = {
  boot() {
    if (read(K.boot, false)) return;
    write(K.plan, { week: weekKey(), days: defaultWeekPlan() });
    write(K.done, {});
    write(K.metrics, { acv: null, ttWeek: null, followers: null, history: [] });
    write(K.train, { week: null, scores: {}, note: '' });
    write(K.decisions, []);
    write(K.raids, []);
    write(K.boot, true);
  },

  reset() {
    Object.values(K).forEach((k) => localStorage.removeItem(k));
    localStorage.removeItem('qs.route');
    this.boot();
  },

  getPlan() {
    let p = read(K.plan, null);
    const wk = weekKey();
    if (!p || p.week !== wk) {
      p = { week: wk, days: defaultWeekPlan() };
      write(K.plan, p);
      write(K.done, {});
    }
    return p;
  },

  setDayFormat(dayIndex, formatId) {
    const p = this.getPlan();
    p.days[dayIndex] = { ...p.days[dayIndex], formatId };
    write(K.plan, p);
  },

  getDone() {
    return read(K.done, {});
  },

  toggleDone(dayIndex, key) {
    const d = this.getDone();
    const id = `${dayIndex}:${key}`;
    d[id] = !d[id];
    write(K.done, d);
    return d;
  },

  isDone(dayIndex, key) {
    return !!this.getDone()[`${dayIndex}:${key}`];
  },

  getMetrics() {
    return read(K.metrics, { acv: null, ttWeek: null, followers: null, history: [] });
  },

  saveMetrics({ acv, ttWeek, followers, note }) {
    const m = this.getMetrics();
    const next = {
      acv: acv ?? m.acv,
      ttWeek: ttWeek ?? m.ttWeek,
      followers: followers ?? m.followers,
      history: [
        {
          id: uid(),
          date: new Date().toISOString().slice(0, 10),
          acv: acv ?? m.acv,
          ttWeek: ttWeek ?? m.ttWeek,
          followers: followers ?? m.followers,
          note: note || ''
        },
        ...(m.history || [])
      ].slice(0, 40)
    };
    write(K.metrics, next);
    return next;
  },

  getTrain() {
    return read(K.train, { week: null, scores: {}, note: '' });
  },

  saveTrain(scores, note) {
    const row = { week: weekKey(), scores, note: note || '' };
    write(K.train, row);
    return row;
  },

  getDecisions() {
    return read(K.decisions, []);
  },

  addDecision(text, kind) {
    const list = [
      { id: uid(), date: new Date().toISOString().slice(0, 10), text, kind },
      ...this.getDecisions()
    ].slice(0, 30);
    write(K.decisions, list);
    return list;
  },

  deleteDecision(id) {
    write(K.decisions, this.getDecisions().filter((d) => d.id !== id));
  },

  getRaids() {
    return read(K.raids, []);
  },

  addRaid(name) {
    const n = String(name || '').trim().replace(/^@/, '');
    if (!n) return;
    write(K.raids, [n, ...this.getRaids().filter((x) => x.toLowerCase() !== n.toLowerCase())].slice(0, 8));
  },

  removeRaid(name) {
    write(K.raids, this.getRaids().filter((x) => x !== name));
  },

  weekProgress() {
    const plan = this.getPlan();
    const keys = ['live', 'ladder', 'raid'];
    let hit = 0;
    let need = 0;
    plan.days.forEach((day, i) => {
      if (day.type === 'ops') return;
      keys.forEach((k) => {
        need += 1;
        if (this.isDone(i, k)) hit += 1;
      });
    });
    return { hit, need, pct: need ? Math.round((hit / need) * 100) : 0 };
  },

  quotas() {
    return QUOTAS;
  }
};
