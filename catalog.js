/** Financer — products with selectable plans (not one row per tier). */
export const CATEGORIES = [
  { id: "streaming", label: "Streaming", icon: "📺" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
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
  { id: "other", label: "Other", icon: "📦" },
];

export const PRODUCTS = [
  {
    id: "streamladder",
    name: "Streamladder",
    category: "streaming",
    icon: "🪜",
    color: "#9146ff",
    url: "https://streamladder.com",
    why: "Growth tools for Twitch streamers — clips, analytics, and channel boost.",
    when: "Monthly or annual billing.",
    how: "Sign up at streamladder.com and pick a plan.",
    plans: [
      { id: "free", name: "Free", price: 0, cycle: "monthly", blurb: "Basic clip tools" },
      { id: "starter", name: "Starter", price: 9.99, cycle: "monthly", blurb: "More clips + analytics" },
      { id: "pro", name: "Pro", price: 19.99, cycle: "monthly", blurb: "Full toolkit for growing streamers" },
      { id: "elite", name: "Elite", price: 39.99, cycle: "monthly", blurb: "Priority support + advanced features" },
    ],
  },
  {
    id: "netflix",
    name: "Netflix",
    category: "streaming",
    icon: "🎬",
    color: "#e50914",
    url: "https://www.netflix.com",
    why: "Movies and TV on demand.",
    when: "Charged monthly on your signup date.",
    how: "netflix.com → Account → Plan.",
    plans: [
      { id: "ads", name: "Standard with ads", price: 6.99, cycle: "monthly" },
      { id: "standard", name: "Standard", price: 15.49, cycle: "monthly" },
      { id: "premium", name: "Premium", price: 22.99, cycle: "monthly" },
    ],
  },
  {
    id: "disney",
    name: "Disney+",
    category: "streaming",
    icon: "✨",
    color: "#113ccf",
    url: "https://www.disneyplus.com",
    why: "Disney, Marvel, Star Wars, and more.",
    when: "Monthly or annual.",
    how: "disneyplus.com → Account → Subscription.",
    plans: [
      { id: "ads", name: "With ads", price: 7.99, cycle: "monthly" },
      { id: "no_ads", name: "No ads", price: 13.99, cycle: "monthly" },
      { id: "premium", name: "Premium", price: 18.99, cycle: "monthly" },
    ],
  },
  {
    id: "hbo",
    name: "Max",
    category: "streaming",
    icon: "🎭",
    color: "#002be7",
    url: "https://www.max.com",
    why: "HBO, Warner Bros, and discovery content.",
    when: "Monthly billing.",
    how: "max.com → Settings → Subscription.",
    plans: [
      { id: "ads", name: "With ads", price: 9.99, cycle: "monthly" },
      { id: "ad_free", name: "Ad-free", price: 16.99, cycle: "monthly" },
      { id: "ultimate", name: "Ultimate", price: 20.99, cycle: "monthly" },
    ],
  },
  {
    id: "prime",
    name: "Prime Video",
    category: "streaming",
    icon: "📦",
    color: "#00a8e1",
    url: "https://www.amazon.com/primevideo",
    why: "Included with Prime or standalone video.",
    when: "Monthly with Prime or standalone.",
    how: "Amazon → Your Prime → Manage membership.",
    plans: [
      { id: "prime", name: "Amazon Prime", price: 14.99, cycle: "monthly", blurb: "Video + shipping + more" },
      { id: "video_only", name: "Prime Video only", price: 8.99, cycle: "monthly" },
    ],
  },
  {
    id: "hulu",
    name: "Hulu",
    category: "streaming",
    icon: "📺",
    color: "#1ce783",
    url: "https://www.hulu.com",
    why: "Current TV and originals.",
    when: "Monthly.",
    how: "hulu.com → Account → Manage plan.",
    plans: [
      { id: "ads", name: "With ads", price: 7.99, cycle: "monthly" },
      { id: "no_ads", name: "No ads", price: 17.99, cycle: "monthly" },
      { id: "live", name: "Live TV", price: 76.99, cycle: "monthly" },
    ],
  },
  {
    id: "apple_tv",
    name: "Apple TV+",
    category: "streaming",
    icon: "🍎",
    color: "#000000",
    url: "https://tv.apple.com",
    why: "Apple originals.",
    when: "Monthly or annual.",
    how: "Settings → Apple ID → Subscriptions.",
    plans: [{ id: "standard", name: "Apple TV+", price: 9.99, cycle: "monthly" }],
  },
  {
    id: "peacock",
    name: "Peacock",
    category: "streaming",
    icon: "🦚",
    color: "#000000",
    url: "https://www.peacocktv.com",
    why: "NBCUniversal shows and sports.",
    when: "Monthly.",
    how: "peacocktv.com → Account.",
    plans: [
      { id: "premium", name: "Premium", price: 7.99, cycle: "monthly" },
      { id: "plus", name: "Premium Plus", price: 13.99, cycle: "monthly" },
    ],
  },
  {
    id: "paramount",
    name: "Paramount+",
    category: "streaming",
    icon: "⛰️",
    color: "#0064ff",
    url: "https://www.paramountplus.com",
    why: "CBS, Paramount films, and sports.",
    when: "Monthly.",
    how: "paramountplus.com → Account.",
    plans: [
      { id: "essential", name: "Essential", price: 5.99, cycle: "monthly" },
      { id: "premium", name: "Premium", price: 11.99, cycle: "monthly" },
    ],
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "music",
    icon: "🎧",
    color: "#1db954",
    url: "https://www.spotify.com",
    why: "Music and podcasts.",
    when: "Monthly on billing date.",
    how: "spotify.com → Account → Manage plan.",
    plans: [
      { id: "individual", name: "Individual", price: 10.99, cycle: "monthly" },
      { id: "duo", name: "Duo", price: 14.99, cycle: "monthly" },
      { id: "family", name: "Family", price: 16.99, cycle: "monthly" },
      { id: "student", name: "Student", price: 5.99, cycle: "monthly" },
    ],
  },
  {
    id: "apple_music",
    name: "Apple Music",
    category: "music",
    icon: "🎵",
    color: "#fa243c",
    url: "https://music.apple.com",
    why: "Apple's music library.",
    when: "Monthly.",
    how: "Settings → Subscriptions.",
    plans: [
      { id: "individual", name: "Individual", price: 10.99, cycle: "monthly" },
      { id: "family", name: "Family", price: 16.99, cycle: "monthly" },
      { id: "student", name: "Student", price: 5.99, cycle: "monthly" },
    ],
  },
  {
    id: "youtube_music",
    name: "YouTube Music",
    category: "music",
    icon: "▶️",
    color: "#ff0000",
    url: "https://music.youtube.com",
    why: "Music with YouTube library.",
    when: "Monthly.",
    how: "youtube.com/paid_memberships.",
    plans: [
      { id: "individual", name: "Individual", price: 10.99, cycle: "monthly" },
      { id: "family", name: "Family", price: 16.99, cycle: "monthly" },
    ],
  },
  {
    id: "tidal",
    name: "Tidal",
    category: "music",
    icon: "🌊",
    color: "#000000",
    url: "https://tidal.com",
    why: "Hi-fi streaming.",
    when: "Monthly.",
    how: "tidal.com → Account.",
    plans: [
      { id: "individual", name: "Individual", price: 10.99, cycle: "monthly" },
      { id: "family", name: "Family", price: 16.99, cycle: "monthly" },
    ],
  },
  {
    id: "xbox",
    name: "Xbox Game Pass",
    category: "gaming",
    icon: "🎮",
    color: "#107c10",
    url: "https://www.xbox.com/game-pass",
    why: "Hundreds of games on console and PC.",
    when: "Monthly.",
    how: "Microsoft account → Subscriptions.",
    plans: [
      { id: "core", name: "Core", price: 9.99, cycle: "monthly" },
      { id: "pc", name: "PC", price: 11.99, cycle: "monthly" },
      { id: "ultimate", name: "Ultimate", price: 19.99, cycle: "monthly" },
    ],
  },
  {
    id: "ps_plus",
    name: "PlayStation Plus",
    category: "gaming",
    icon: "🕹️",
    color: "#003791",
    url: "https://www.playstation.com/ps-plus",
    why: "Online play and monthly games.",
    when: "Monthly or annual.",
    how: "PlayStation → Settings → Subscriptions.",
    plans: [
      { id: "essential", name: "Essential", price: 9.99, cycle: "monthly" },
      { id: "extra", name: "Extra", price: 14.99, cycle: "monthly" },
      { id: "premium", name: "Premium", price: 17.99, cycle: "monthly" },
    ],
  },
  {
    id: "nintendo",
    name: "Nintendo Switch Online",
    category: "gaming",
    icon: "🔴",
    color: "#e60012",
    url: "https://www.nintendo.com/switch/online-service",
    why: "Online play and classic games.",
    when: "Monthly or annual.",
    how: "Nintendo eShop → Nintendo Switch Online.",
    plans: [
      { id: "individual", name: "Individual", price: 3.99, cycle: "monthly" },
      { id: "family", name: "Family", price: 7.99, cycle: "monthly" },
      { id: "expansion", name: "+ Expansion Pack", price: 49.99, cycle: "yearly" },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "ai",
    icon: "💬",
    color: "#10a37f",
    url: "https://chat.openai.com",
    why: "OpenAI assistant — Plus, Pro, and team tiers.",
    when: "Monthly.",
    how: "chat.openai.com → Settings → Subscription.",
    plans: [
      { id: "plus", name: "Plus", price: 20, cycle: "monthly" },
      { id: "pro", name: "Pro", price: 200, cycle: "monthly" },
      { id: "team", name: "Team (per seat)", price: 25, cycle: "monthly" },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    category: "ai",
    icon: "🧠",
    color: "#d97757",
    url: "https://claude.ai",
    why: "Anthropic AI — Pro and Max usage tiers.",
    when: "Monthly.",
    how: "claude.ai → Settings → Subscription.",
    plans: [
      { id: "pro", name: "Pro", price: 20, cycle: "monthly" },
      { id: "max_5x", name: "Max 5×", price: 100, cycle: "monthly", blurb: "5× Pro usage" },
      { id: "max_20x", name: "Max 20×", price: 200, cycle: "monthly", blurb: "20× Pro usage" },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "ai",
    icon: "⌨️",
    color: "#000000",
    url: "https://cursor.com",
    why: "AI code editor for developers.",
    when: "Monthly.",
    how: "cursor.com → Settings → Subscription.",
    plans: [
      { id: "pro", name: "Pro", price: 20, cycle: "monthly" },
      { id: "pro_plus", name: "Pro+", price: 60, cycle: "monthly" },
      { id: "ultra", name: "Ultra", price: 200, cycle: "monthly" },
    ],
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "ai",
    icon: "🖼️",
    color: "#000000",
    url: "https://www.midjourney.com",
    why: "AI image generation.",
    when: "Monthly.",
    how: "midjourney.com → Manage subscription.",
    plans: [
      { id: "basic", name: "Basic", price: 10, cycle: "monthly" },
      { id: "standard", name: "Standard", price: 30, cycle: "monthly" },
      { id: "pro", name: "Pro", price: 60, cycle: "monthly" },
      { id: "mega", name: "Mega", price: 120, cycle: "monthly" },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    category: "productivity",
    icon: "🐙",
    color: "#24292f",
    url: "https://github.com",
    why: "Code hosting and collaboration.",
    when: "Monthly per user.",
    how: "github.com → Settings → Billing.",
    plans: [
      { id: "free", name: "Free", price: 0, cycle: "monthly" },
      { id: "pro", name: "Pro", price: 4, cycle: "monthly" },
      { id: "team", name: "Team", price: 4, cycle: "monthly", blurb: "Per user" },
      { id: "enterprise", name: "Enterprise", price: 21, cycle: "monthly", blurb: "Per user" },
    ],
  },
  {
    id: "notion",
    name: "Notion",
    category: "productivity",
    icon: "📝",
    color: "#000000",
    url: "https://www.notion.so",
    why: "Notes, docs, and wikis.",
    when: "Monthly per seat.",
    how: "notion.so → Settings → Billing.",
    plans: [
      { id: "free", name: "Free", price: 0, cycle: "monthly" },
      { id: "plus", name: "Plus", price: 10, cycle: "monthly" },
      { id: "business", name: "Business", price: 18, cycle: "monthly" },
    ],
  },
  {
    id: "dropbox",
    name: "Dropbox",
    category: "cloud",
    icon: "📁",
    color: "#0061ff",
    url: "https://www.dropbox.com",
    why: "Cloud file sync.",
    when: "Monthly or annual.",
    how: "dropbox.com → Account → Plan.",
    plans: [
      { id: "plus", name: "Plus", price: 11.99, cycle: "monthly" },
      { id: "professional", name: "Professional", price: 19.99, cycle: "monthly" },
    ],
  },
  {
    id: "icloud",
    name: "iCloud+",
    category: "cloud",
    icon: "☁️",
    color: "#007aff",
    url: "https://www.icloud.com",
    why: "Apple cloud storage.",
    when: "Monthly.",
    how: "Settings → Apple ID → iCloud → Manage.",
    plans: [
      { id: "50gb", name: "50 GB", price: 0.99, cycle: "monthly" },
      { id: "200gb", name: "200 GB", price: 2.99, cycle: "monthly" },
      { id: "2tb", name: "2 TB", price: 9.99, cycle: "monthly" },
    ],
  },
  {
    id: "google_one",
    name: "Google One",
    category: "cloud",
    icon: "🔵",
    color: "#4285f4",
    url: "https://one.google.com",
    why: "Extra Google storage.",
    when: "Monthly.",
    how: "one.google.com → Settings.",
    plans: [
      { id: "100gb", name: "100 GB", price: 1.99, cycle: "monthly" },
      { id: "200gb", name: "200 GB", price: 2.99, cycle: "monthly" },
      { id: "2tb", name: "2 TB", price: 9.99, cycle: "monthly" },
    ],
  },
  {
    id: "discord",
    name: "Discord Nitro",
    category: "social",
    icon: "💜",
    color: "#5865f2",
    url: "https://discord.com/nitro",
    why: "Server boosts and perks.",
    when: "Monthly.",
    how: "discord.com → User Settings → Nitro.",
    plans: [
      { id: "basic", name: "Basic", price: 2.99, cycle: "monthly" },
      { id: "full", name: "Nitro", price: 9.99, cycle: "monthly" },
    ],
  },
  {
    id: "twitch",
    name: "Twitch",
    category: "streaming",
    icon: "💜",
    color: "#9146ff",
    url: "https://www.twitch.tv",
    why: "Subs, Turbo, and Prime gaming.",
    when: "Monthly.",
    how: "twitch.tv → Subscriptions.",
    plans: [
      { id: "turbo", name: "Turbo", price: 11.99, cycle: "monthly" },
      { id: "sub_t1", name: "Sub Tier 1", price: 4.99, cycle: "monthly", blurb: "Per channel" },
      { id: "sub_t2", name: "Sub Tier 2", price: 9.99, cycle: "monthly", blurb: "Per channel" },
      { id: "sub_t3", name: "Sub Tier 3", price: 24.99, cycle: "monthly", blurb: "Per channel" },
    ],
  },
  {
    id: "nyt",
    name: "New York Times",
    category: "news",
    icon: "📰",
    color: "#000000",
    url: "https://www.nytimes.com",
    why: "News and games bundle.",
    when: "Monthly or annual.",
    how: "nytimes.com → Account → Subscriptions.",
    plans: [
      { id: "digital", name: "Digital", price: 17, cycle: "monthly" },
      { id: "all_access", name: "All Access", price: 25, cycle: "monthly" },
    ],
  },
  {
    id: "peloton",
    name: "Peloton",
    category: "fitness",
    icon: "🚴",
    color: "#df1c2f",
    url: "https://www.onepeloton.com",
    why: "Fitness classes and equipment.",
    when: "Monthly.",
    how: "onepeloton.com → Membership.",
    plans: [
      { id: "app", name: "App", price: 12.99, cycle: "monthly" },
      { id: "all_access", name: "All-Access", price: 44, cycle: "monthly" },
    ],
  },
  {
    id: "doordash",
    name: "DashPass",
    category: "food",
    icon: "🍕",
    color: "#ff3008",
    url: "https://www.doordash.com/dashpass",
    why: "Free delivery on DoorDash.",
    when: "Monthly.",
    how: "DoorDash app → Account → DashPass.",
    plans: [{ id: "standard", name: "DashPass", price: 9.99, cycle: "monthly" }],
  },
  {
    id: "1password",
    name: "1Password",
    category: "security",
    icon: "🔐",
    color: "#0572ec",
    url: "https://1password.com",
    why: "Password manager.",
    when: "Monthly or annual.",
    how: "1password.com → Account → Billing.",
    plans: [
      { id: "individual", name: "Individual", price: 2.99, cycle: "monthly" },
      { id: "family", name: "Families", price: 4.99, cycle: "monthly" },
    ],
  },
  {
    id: "adobe_cc",
    name: "Adobe Creative Cloud",
    category: "creative",
    icon: "🎨",
    color: "#ff0000",
    url: "https://www.adobe.com/creativecloud.html",
    why: "Photoshop, Premiere, and more.",
    when: "Monthly or annual.",
    how: "adobe.com → Manage plan.",
    plans: [
      { id: "photography", name: "Photography", price: 9.99, cycle: "monthly" },
      { id: "single_app", name: "Single App", price: 22.99, cycle: "monthly" },
      { id: "all_apps", name: "All Apps", price: 59.99, cycle: "monthly" },
    ],
  },
  {
    id: "canva",
    name: "Canva Pro",
    category: "creative",
    icon: "✏️",
    color: "#00c4cc",
    url: "https://www.canva.com",
    why: "Design templates and tools.",
    when: "Monthly.",
    how: "canva.com → Account → Billing.",
    plans: [
      { id: "pro", name: "Pro", price: 14.99, cycle: "monthly" },
      { id: "teams", name: "Teams", price: 29.99, cycle: "monthly", blurb: "Per user" },
    ],
  },
  {
    id: "duolingo",
    name: "Duolingo Super",
    category: "education",
    icon: "🦉",
    color: "#58cc02",
    url: "https://www.duolingo.com",
    why: "Ad-free language learning.",
    when: "Monthly or annual.",
    how: "Duolingo app → Shop → Super.",
    plans: [
      { id: "super", name: "Super", price: 12.99, cycle: "monthly" },
      { id: "max", name: "Max", price: 29.99, cycle: "monthly" },
    ],
  },
  {
    id: "ynab",
    name: "YNAB",
    category: "finance",
    icon: "💰",
    color: "#8855ff",
    url: "https://www.ynab.com",
    why: "Zero-based budgeting.",
    when: "Monthly or annual.",
    how: "ynab.com → Account → Subscription.",
    plans: [{ id: "standard", name: "YNAB", price: 14.99, cycle: "monthly" }],
  },
];

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
  streamladder_free: "streamladder:free",
  streamladder_starter: "streamladder:starter",
  streamladder_pro: "streamladder:pro",
  streamladder_elite: "streamladder:elite",
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
    why: product.why,
    when: product.when,
    how: product.how,
    price: plan?.price ?? product.plans[0]?.price ?? 0,
    cycle: plan?.cycle ?? product.plans[0]?.cycle ?? "monthly",
    blurb: plan?.blurb || product.plans[0]?.blurb || "",
  };
}

export function searchProducts(query, { minChars = 0 } = {}) {
  const q = String(query || "").trim().toLowerCase();
  if (minChars > 0 && q.length < minChars) return [];
  if (!q) return [...PRODUCTS];
  return PRODUCTS.filter((p) => {
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
}

export function priceLabel(price, cycle = "monthly") {
  if (!price) return "Free";
  const sym = "$";
  const amt = Number(price).toFixed(price % 1 ? 2 : 0);
  const per = cycle === "yearly" ? "/yr" : "/mo";
  return `${sym}${amt}${per}`;
}

export function planRangeLabel(product) {
  const prices = (product.plans || []).map((p) => p.price).filter((n) => n >= 0);
  if (!prices.length) return "—";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return priceLabel(min, product.plans[0]?.cycle);
  return `${priceLabel(min)} – ${priceLabel(max)}`;
}

export const PRODUCT_COUNT = PRODUCTS.length;
export const CATALOG_SIZE = PRODUCTS.reduce((n, p) => n + (p.plans?.length || 0), 0);
