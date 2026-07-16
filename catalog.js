/** Financer — products with selectable plans (not one row per tier). */
import { PRODUCTS as PRODUCT_DATA } from './catalog-data.js';

export const CATEGORIES = [
  { id: "streaming", label: "Streaming", icon: "📺" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
  { id: "habits", label: "Habits", icon: "🎯" },
  { id: "productivity", label: "Productivity", icon: "⚡" },
  { id: "ai", label: "AI", icon: "🤖" },
  { id: "cloud", label: "Cloud", icon: "☁️" },
  { id: "social", label: "Social", icon: "💬" },
  { id: "news", label: "News", icon: "📰" },
  { id: "fitness", label: "Fitness", icon: "💪" },
  { id: "food", label: "Food", icon: "🍔" },
  { id: "finance", label: "Finance", icon: "💳" },
  { id: "education", label: "Education", icon: "📚" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "creative", label: "Creative", icon: "🎨" },
  { id: "developer", label: "Developer", icon: "👨‍💻" },
  { id: "dating", label: "Dating", icon: "💕" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "other", label: "Other", icon: "📦" },
];

export const PRODUCTS = PRODUCT_DATA;

/** Stable key: productId:planId */
export function catalogKey(productId, planId) {
  return `${productId}:${planId}`;
}

export function parseCatalogKey(key) {
  const i = String(key).indexOf(":");
  if (i < 0) return { productId: key, planId: null };
  return { productId: key.slice(0, i), planId: key.slice(i + 1) };
}

/** Legacy flat ids → product:plan */
const LEGACY_MAP = {
  streamladder_free: "streamladder:silver",
  streamladder_starter: "streamladder:silver",
  streamladder_pro: "streamladder:gold",
  streamladder_elite: "streamladder:gold_clipgpt",
  claude_pro: "claude:pro",
  claude_max_5x: "claude:max_5x",
  claude_max_20x: "claude:max_20x",
  chatgpt_plus: "chatgpt:plus",
  chatgpt_pro: "chatgpt:pro",
  netflix_standard: "netflix:standard",
  spotify_individual: "spotify:individual",
};

export function migrateCatalogId(oldId) {
  if (!oldId) return oldId;
  if (oldId.includes(":")) return oldId;
  return LEGACY_MAP[oldId] || oldId;
}

export function getProduct(productId) {
  return PRODUCTS.find((p) => p.id === productId) || null;
}

export function getPlan(productId, planId) {
  const p = getProduct(productId);
  if (!p) return null;
  return p.plans.find((pl) => pl.id === planId) || null;
}

export function getCatalogEntry(catalogId) {
  const { productId, planId } = parseCatalogKey(migrateCatalogId(catalogId));
  const product = getProduct(productId);
  const plan = planId ? getPlan(productId, planId) : null;
  if (!product) return null;
  const sorted = [...(product.plans || [])].sort((a, b) => a.price - b.price);
  return {
    catalogId: plan ? catalogKey(productId, plan.id) : productId,
    productId: product.id,
    planId: plan?.id || null,
    name: product.name,
    planName: plan?.name || null,
    displayName: plan ? `${product.name} — ${plan.name}` : product.name,
    category: product.category,
    icon: product.icon,
    color: product.color,
    url: product.url,
    pricingUrl: product.pricingUrl || product.url,
    why: product.why,
    when: product.when,
    how: product.how,
    billingAnchor: product.billingAnchor || null,
    billingSource: product.billingSource || null,
    price: plan?.price ?? sorted[0]?.price ?? 0,
    cycle: plan?.cycle ?? sorted[0]?.cycle ?? "monthly",
    blurb: plan?.blurb || sorted[0]?.blurb || "",
  };
}

export function searchProducts(query, { minChars = 0, category = null, limit = null } = {}) {
  const raw = String(query || "").trim().toLowerCase();
  if (minChars > 0 && raw.length < minChars) return [];

  const tokens = expandQuery(raw);
  let rows = PRODUCTS.filter((p) => {
    if (category && category !== 'all' && p.category !== category) return false;
    if (!tokens.length) return true;
    const hay = productHaystack(p);
    return tokens.every((t) => hay.includes(t));
  });

  if (tokens.length) {
    rows.sort((a, b) => scoreProduct(b, tokens) - scoreProduct(a, tokens) || a.name.localeCompare(b.name));
  } else {
    rows.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (limit != null && limit > 0) return rows.slice(0, limit);
  return rows;
}

const SEARCH_ALIASES = {
  hbo: 'max',
  yt: 'youtube',
  chatgpt: 'openai',
  gpt: 'openai',
  prime: 'amazon',
  disney: 'disney',
  ps: 'playstation',
  xbox: 'xbox',
  apple: 'apple',
  icloud: 'icloud',
};

function expandQuery(raw) {
  if (!raw) return [];
  return raw.split(/\s+/).filter(Boolean).flatMap((t) => {
    const alias = SEARCH_ALIASES[t];
    return alias ? [t, alias] : [t];
  });
}

function productHaystack(product) {
  const catLabel = CATEGORIES.find((c) => c.id === product.category)?.label || '';
  return [
    product.id,
    product.name,
    product.category,
    catLabel,
    product.why,
    ...(product.plans || []).flatMap((pl) => [pl.name, pl.id, pl.blurb || '']),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function scoreProduct(product, tokens) {
  const name = product.name.toLowerCase();
  const id = product.id.toLowerCase();
  const cat = (CATEGORIES.find((c) => c.id === product.category)?.label || product.category).toLowerCase();
  let score = 0;

  for (const token of tokens) {
    if (name === token) score += 120;
    else if (id === token) score += 110;
    else if (name.startsWith(token)) score += 90;
    else if (id.startsWith(token)) score += 85;
    else if (name.split(/\s+/).some((w) => w.startsWith(token))) score += 75;
    else if (name.includes(token)) score += 55;
    else if (id.includes(token)) score += 50;
    else if (cat.includes(token)) score += 35;

    for (const plan of product.plans || []) {
      const pn = plan.name.toLowerCase();
      if (pn === token) score += 65;
      else if (pn.startsWith(token)) score += 45;
      else if (pn.includes(token)) score += 30;
    }

    if (product.why?.toLowerCase().includes(token)) score += 12;
  }

  return score;
}

export function priceLabel(price, cycle = 'monthly', currency = '$') {
  if (price == null || price <= 0) return 'Free';
  const amt = Number(price).toFixed(Number(price) % 1 ? 2 : 0);
  const per = cycle === 'yearly' ? '/yr' : '/mo';
  return `${currency}${amt}${per}`;
}

export function planRangeLabel(product, currency = '$') {
  const prices = (product.plans || []).map((p) => p.price).filter((n) => n > 0);
  if (!prices.length) return '—';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const cycle = product.plans.find((pl) => pl.price === min)?.cycle || 'monthly';
  if (min === max) return priceLabel(min, cycle, currency);
  const maxCycle = product.plans.find((pl) => pl.price === max)?.cycle || cycle;
  return `${priceLabel(min, cycle, currency)} – ${priceLabel(max, maxCycle, currency)}`;
}

/** Brand icon/color for a tracked subscription. */
export function getSubBranding(sub) {
  const entry = getCatalogEntry(sub.catalogId);
  if (entry?.icon) {
    return { icon: entry.icon, color: entry.color || '#1e40af' };
  }
  if (String(sub.catalogId || '').startsWith('custom:')) {
    return { icon: '📌', color: '#64748b' };
  }
  const { productId } = parseCatalogKey(sub.catalogId);
  const product = getProduct(productId);
  if (product) return { icon: product.icon, color: product.color || '#1e40af' };
  return { icon: '📦', color: '#1e40af' };
}

export const PRODUCT_COUNT = PRODUCTS.length;
export const CATALOG_SIZE = PRODUCTS.reduce((n, p) => n + (p.plans?.length || 0), 0);
