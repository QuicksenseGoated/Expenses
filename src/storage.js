const KEYS = {
  strategy: 'cadence.strategy',
  pieces: 'cadence.pieces',
  ideas: 'cadence.ideas',
  settings: 'cadence.settings',
  onboarding: 'cadence.onboardingDone'
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

const DEFAULT_STRATEGY = {
  brandName: '',
  niche: '',
  audience: '',
  primaryGoal: 'leads', // traffic | leads | authority | sales
  secondaryGoal: '',
  platforms: ['blog', 'linkedin'],
  cadencePerWeek: 3,
  pillars: [],
  voiceNotes: '',
  successMetric: '',
  updatedAt: null
};

const DEFAULT_SETTINGS = {
  weekStartsOn: 1, // Monday
  defaultPlatform: 'blog',
  showSetupTips: true
};

export const Storage = {
  isOnboardingDone() {
    return read(KEYS.onboarding, false) === true;
  },

  completeOnboarding() {
    write(KEYS.onboarding, true);
  },

  resetOnboarding() {
    write(KEYS.onboarding, false);
  },

  getStrategy() {
    return { ...DEFAULT_STRATEGY, ...read(KEYS.strategy, {}) };
  },

  saveStrategy(strategy) {
    const next = {
      ...DEFAULT_STRATEGY,
      ...strategy,
      updatedAt: new Date().toISOString()
    };
    write(KEYS.strategy, next);
    return next;
  },

  getSettings() {
    return { ...DEFAULT_SETTINGS, ...read(KEYS.settings, {}) };
  },

  saveSettings(settings) {
    const next = { ...DEFAULT_SETTINGS, ...settings };
    write(KEYS.settings, next);
    return next;
  },

  getIdeas() {
    return read(KEYS.ideas, []);
  },

  saveIdeas(ideas) {
    write(KEYS.ideas, ideas);
    return ideas;
  },

  addIdea(idea) {
    const ideas = this.getIdeas();
    const item = {
      id: uid('idea'),
      title: '',
      notes: '',
      pillarId: null,
      platform: null,
      score: 0,
      createdAt: new Date().toISOString(),
      ...idea
    };
    ideas.unshift(item);
    this.saveIdeas(ideas);
    return item;
  },

  updateIdea(id, patch) {
    const ideas = this.getIdeas();
    const idx = ideas.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    ideas[idx] = { ...ideas[idx], ...patch, updatedAt: new Date().toISOString() };
    this.saveIdeas(ideas);
    return ideas[idx];
  },

  deleteIdea(id) {
    this.saveIdeas(this.getIdeas().filter((i) => i.id !== id));
  },

  getPieces() {
    return read(KEYS.pieces, []);
  },

  savePieces(pieces) {
    write(KEYS.pieces, pieces);
    return pieces;
  },

  addPiece(piece) {
    const pieces = this.getPieces();
    const item = {
      id: uid('piece'),
      title: '',
      status: 'idea', // idea | planned | drafting | ready | published | measured
      platform: 'blog',
      pillarId: null,
      funnel: 'tofu', // tofu | mofu | bofu
      publishDate: null,
      keywords: [],
      hook: '',
      promise: '',
      outline: '',
      cta: '',
      proofPoints: '',
      notes: '',
      checklist: {
        clearHook: false,
        onePromise: false,
        proofIncluded: false,
        ctaDefined: false,
        seoBasics: false,
        distributionPlan: false
      },
      results: {
        views: null,
        clicks: null,
        leads: null,
        conversions: null,
        notes: '',
        loggedAt: null
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...piece
    };
    pieces.unshift(item);
    this.savePieces(pieces);
    return item;
  },

  updatePiece(id, patch) {
    const pieces = this.getPieces();
    const idx = pieces.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    pieces[idx] = {
      ...pieces[idx],
      ...patch,
      checklist: { ...pieces[idx].checklist, ...(patch.checklist || {}) },
      results: { ...pieces[idx].results, ...(patch.results || {}) },
      updatedAt: new Date().toISOString()
    };
    this.savePieces(pieces);
    return pieces[idx];
  },

  deletePiece(id) {
    this.savePieces(this.getPieces().filter((p) => p.id !== id));
  },

  exportAll() {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      strategy: this.getStrategy(),
      pieces: this.getPieces(),
      ideas: this.getIdeas(),
      settings: this.getSettings(),
      onboardingDone: this.isOnboardingDone()
    };
  },

  importAll(data) {
    if (!data || typeof data !== 'object') throw new Error('Invalid import data');
    if (data.strategy) write(KEYS.strategy, data.strategy);
    if (data.pieces) write(KEYS.pieces, data.pieces);
    if (data.ideas) write(KEYS.ideas, data.ideas);
    if (data.settings) write(KEYS.settings, data.settings);
    if (typeof data.onboardingDone === 'boolean') write(KEYS.onboarding, data.onboardingDone);
  },

  clearAll() {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }
};
