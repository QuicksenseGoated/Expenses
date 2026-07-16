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

export function searchProducts(query, { minChars = 0 } = {}) {
  const q = String(query || "").trim().toLowerCase();
  if (minChars > 0 && q.length < minChars) return [];
  let rows = !q ? [...PRODUCTS] : PRODUCTS.filter((p) => {
    const hay = [
      p.name,
      p.category,
      p.why,
      ...(p.plans || []).map((pl) => `${pl.name} ${pl.blurb || ""}`),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

export function priceLabel(price, cycle = "monthly") {
  if (price == null || price <= 0) return "Free";
  const sym = "$";
  const amt = Number(price).toFixed(price % 1 ? 2 : 0);
  const per = cycle === "yearly" ? "/yr" : "/mo";
  return `${sym}${amt}${per}`;
}

export function planRangeLabel(product) {
  const prices = (product.plans || []).map((p) => p.price).filter((n) => n > 0);
  if (!prices.length) return "—";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const cycle = product.plans.find((pl) => pl.price === min)?.cycle || "monthly";
  if (min === max) return priceLabel(min, cycle);
  return `${priceLabel(min, cycle)} – ${priceLabel(max)}`;
}

export const PRODUCT_COUNT = PRODUCTS.length;
export const CATALOG_SIZE = PRODUCTS.reduce((n, p) => n + (p.plans?.length || 0), 0);
