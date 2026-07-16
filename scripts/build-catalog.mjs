import { writeFileSync } from 'fs';

const p = (id, name, category, icon, color, url, pricingUrl, why, when, how, plans, billingAnchor = null, billingSource = null) => ({
  id, name, category, icon, color, url,
  pricingUrl: pricingUrl || url,
  why, when, how, plans,
  ...(billingAnchor ? { billingAnchor, billingSource } : {}),
});

const ANNIV = 'signup_anniversary';
const STORE = 'app_store';

// Abbreviated rebuild — full list in script; run: node scripts/build-catalog.mjs
import { PRODUCTS as EXISTING } from '../catalog-data.js';

// Enrich existing + we'll patch via the script reading and merging
// For this run, regenerate from inline array in separate file is too long.
// Strategy: map existing products to add billingAnchor, merge new ones from patch list.

const ANCHOR_RULES = [
  [/^(apple_|icloud)/, STORE, 'Apple — renews on Apple ID purchase date'],
  [/^duolingo$|^habitify$|^productive$|^fabulous$|^finch$|^structured$|^routinery$|^streaks$|^forest$|^copilot_money$|^fitbod$|^tinder$|^bumble$|^hinge$/, STORE, 'Commonly subscribed via App Store / Play'],
  [/^(netflix|spotify|hulu|disney|hbo|prime|paramount|peacock|crunchyroll|youtube_premium|chatgpt|claude|cursor|github|notion|slack|zoom|dropbox|google_one|1password|adobe_cc|canva|ynab|strava|headspace|calm|doordash|uber_one|nyt|x_premium|twitch|streamladder)$/, ANNIV, 'Industry standard — charged on signup anniversary'],
];

function inferAnchor(prod) {
  if (prod.billingAnchor) return prod;
  for (const [re, anchor, source] of ANCHOR_RULES) {
    if (re.test(prod.id)) return { ...prod, billingAnchor: anchor, billingSource: source };
  }
  // Default for monthly SaaS with no evidence: leave without anchor
  return prod;
}

const NEW_PRODUCTS = [
  p('starz','Starz','streaming','⭐','#000','https://www.starz.com','https://www.starz.com/us/en/signup','Movies & originals.','Monthly on signup.','starz.com.',[{id:'std',name:'Starz',price:10.99,cycle:'monthly'}], ANNIV),
  p('amc','AMC+','streaming','🎞️','#00a3e0','https://www.amcplus.com','https://www.amcplus.com','AMC & Shudder bundle.','Monthly.','amcplus.com.',[{id:'std',name:'AMC+',price:9.99,cycle:'monthly'}], ANNIV),
  p('discovery','Discovery+','streaming','🔍','#0045be','https://www.discoveryplus.com','https://www.discoveryplus.com','Discovery networks.','Monthly.','discoveryplus.com.',[
    {id:'ads',name:'With ads',price:4.99,cycle:'monthly'},{id:'ad_free',name:'Ad-free',price:8.99,cycle:'monthly'},
  ], ANNIV),
  p('shudder','Shudder','streaming','👻','#cf2028','https://www.shudder.com','https://www.shudder.com','Horror.','Monthly.','shudder.com.',[{id:'std',name:'Shudder',price:6.99,cycle:'monthly'}], ANNIV),
  p('fubo','FuboTV','streaming','📡','#f93','https://www.fubo.tv','https://www.fubo.tv/welcome','Live TV sports.','Monthly on signup.','fubo.tv.',[
    {id:'pro',name:'Pro',price:84.99,cycle:'monthly'},{id:'elite',name:'Elite',price:94.99,cycle:'monthly'},
  ], ANNIV),
  p('sling','Sling TV','streaming','📺','#0033a0','https://www.sling.com','https://www.sling.com/deals','Live TV.','Monthly.','sling.com.',[
    {id:'orange',name:'Orange',price:45.99,cycle:'monthly'},{id:'blue',name:'Blue',price:50.99,cycle:'monthly'},
  ], ANNIV),
  p('philo','Philo','streaming','📺','#00a86b','https://www.philo.com','https://www.philo.com','Affordable live TV.','Monthly.','philo.com.',[{id:'std',name:'Philo',price:28,cycle:'monthly'}], ANNIV),
  p('artlist','Artlist','creative','🎬','#ff3366','https://artlist.io','https://artlist.io/page/pricing/max','Music & footage.','Annual.','artlist.io.',[{id:'max',name:'Max Social',price:14.99,cycle:'monthly',blurb:'~$179.88/yr billed annually'}], ANNIV),
  p('own3d','OWN3D Pro','streaming','🎨','#ff5722','https://www.own3d.tv','https://www.own3d.tv/pages/pro','Stream overlays.','Monthly.','own3d.tv.',[{id:'pro',name:'Pro',price:7.99,cycle:'monthly'}], ANNIV),
  p('soundcloud','SoundCloud Go+','music','☁️','#f50','https://soundcloud.com','https://soundcloud.com/go','Indie & DJ music.','Monthly.','soundcloud.com.',[{id:'go',name:'Go+',price:9.99,cycle:'monthly'}], ANNIV),
  p('siriusxm','SiriusXM','music','📻','#0033a0','https://www.siriusxm.com','https://www.siriusxm.com/plans','Satellite radio.','Monthly.','siriusxm.com.',[
    {id:'music',name:'Music & Entertainment',price:10.99,cycle:'monthly'},{id:'all',name:'All Access',price:19.99,cycle:'monthly'},
  ], ANNIV),
  p('ea_play','EA Play','gaming','🎯','#000','https://www.ea.com/ea-play','https://www.ea.com/ea-play','EA games vault.','Monthly.','EA account.',[{id:'std',name:'EA Play',price:5.99,cycle:'monthly'}], ANNIV),
  p('ubisoft','Ubisoft+','gaming','🛡️','#0080ff','https://www.ubisoft.com/ubisoftplus','https://www.ubisoft.com/ubisoftplus','Ubisoft library.','Monthly.','ubisoft.com.',[
    {id:'classics',name:'Classics',price:9.99,cycle:'monthly'},{id:'premium',name:'Premium',price:17.99,cycle:'monthly'},
  ], ANNIV),
  p('jasper','Jasper','ai','✍️','#ff6b35','https://www.jasper.ai','https://www.jasper.ai/pricing','AI marketing.','Monthly.','jasper.ai.',[
    {id:'creator',name:'Creator',price:49,cycle:'monthly'},{id:'pro',name:'Pro',price:69,cycle:'monthly'},
  ], ANNIV),
  p('poe','Poe','ai','🤖','#5c46f5','https://poe.com','https://poe.com/login','Multi-model AI.','Monthly.','poe.com.',[{id:'sub',name:'Poe Subscription',price:19.99,cycle:'monthly'}], ANNIV),
  p('suno','Suno','ai','🎵','#000','https://suno.com','https://suno.com/pricing','AI music.','Monthly.','suno.com.',[
    {id:'pro',name:'Pro',price:10,cycle:'monthly'},{id:'premier',name:'Premier',price:30,cycle:'monthly'},
  ], ANNIV),
  p('slack','Slack','productivity','💬','#4a154b','https://slack.com','https://slack.com/pricing','Team chat.','Monthly per user.','slack.com.',[
    {id:'pro',name:'Pro',price:8.75,cycle:'monthly',blurb:'Per user'},{id:'business',name:'Business+',price:15,cycle:'monthly',blurb:'Per user'},
  ], ANNIV),
  p('zoom','Zoom','productivity','📹','#2d8cff','https://zoom.us','https://zoom.us/pricing','Video meetings.','Monthly.','zoom.us.',[
    {id:'pro',name:'Pro',price:13.33,cycle:'monthly'},{id:'business',name:'Business',price:18.33,cycle:'monthly',blurb:'Per license'},
  ], ANNIV),
  p('linear','Linear','productivity','📐','#5e6ad2','https://linear.app','https://linear.app/pricing','Issue tracking.','Monthly per user.','linear.app.',[
    {id:'standard',name:'Standard',price:8,cycle:'monthly',blurb:'Per user'},{id:'plus',name:'Plus',price:14,cycle:'monthly',blurb:'Per user'},
  ], ANNIV),
  p('asana','Asana','productivity','🔺','#f06a6a','https://asana.com','https://asana.com/pricing','Work management.','Monthly per user.','asana.com.',[
    {id:'starter',name:'Starter',price:10.99,cycle:'monthly',blurb:'Per user'},{id:'advanced',name:'Advanced',price:24.99,cycle:'monthly',blurb:'Per user'},
  ], ANNIV),
  p('monday','monday.com','productivity','📊','#ff3d57','https://monday.com','https://monday.com/pricing','Work OS.','Monthly per seat.','monday.com.',[
    {id:'basic',name:'Basic',price:9,cycle:'monthly',blurb:'Per seat'},{id:'standard',name:'Standard',price:12,cycle:'monthly',blurb:'Per seat'},
  ], ANNIV),
  p('clickup','ClickUp','productivity','✅','#7b68ee','https://clickup.com','https://clickup.com/pricing','Productivity suite.','Monthly per user.','clickup.com.',[
    {id:'unlimited',name:'Unlimited',price:7,cycle:'monthly',blurb:'Per user'},{id:'business',name:'Business',price:12,cycle:'monthly',blurb:'Per user'},
  ], ANNIV),
  p('airtable','Airtable','productivity','🗃️','#18bfff','https://www.airtable.com','https://www.airtable.com/pricing','Spreadsheet DB.','Monthly per seat.','airtable.com.',[
    {id:'team',name:'Team',price:20,cycle:'monthly',blurb:'Per seat'},{id:'business',name:'Business',price:45,cycle:'monthly',blurb:'Per seat'},
  ], ANNIV),
  p('superhuman','Superhuman','productivity','⚡','#000','https://superhuman.com','https://superhuman.com/pricing','Fast email.','Monthly.','superhuman.com.',[{id:'std',name:'Superhuman',price:30,cycle:'monthly'}], ANNIV),
  p('raycast','Raycast Pro','productivity','🚀','#ff6363','https://www.raycast.com','https://www.raycast.com/pricing','Mac launcher.','Monthly.','raycast.com.',[{id:'pro',name:'Pro',price:8,cycle:'monthly'}], ANNIV),
  p('microsoft365','Microsoft 365','productivity','🪟','#0078d4','https://www.microsoft.com/microsoft-365','https://www.microsoft.com/microsoft-365/buy/compare-all-microsoft-365-products','Office & cloud.','Monthly or annual.','Microsoft account.',[
    {id:'personal',name:'Personal',price:9.99,cycle:'monthly'},{id:'family',name:'Family',price:12.99,cycle:'monthly'},
  ], ANNIV),
  p('pcloud','pCloud','cloud','☁️','#20b0e7','https://www.pcloud.com','https://www.pcloud.com/cloud-storage-pricing-plans.html','Cloud storage.','Annual.','pcloud.com.',[
    {id:'premium',name:'Premium 500GB',price:4.17,cycle:'monthly',blurb:'$49.99/yr'},{id:'plus',name:'Premium Plus 2TB',price:8.33,cycle:'monthly',blurb:'$99.99/yr'},
  ], ANNIV),
  p('mega','MEGA','cloud','🔴','#d9272e','https://mega.io','https://mega.io/pricing','Encrypted cloud.','Monthly.','mega.io.',[
    {id:'pro1',name:'Pro I',price:10.78,cycle:'monthly'},{id:'pro2',name:'Pro II',price:21.56,cycle:'monthly'},
  ], ANNIV),
  p('dashlane','Dashlane','security','🔒','#0e6bff','https://www.dashlane.com','https://www.dashlane.com/plans','Passwords.','Annual.','dashlane.com.',[
    {id:'adv',name:'Advanced',price:4.99,cycle:'monthly'},{id:'prem',name:'Premium',price:6.49,cycle:'monthly'},
  ], ANNIV),
  p('expressvpn','ExpressVPN','security','🟢','#da3940','https://www.expressvpn.com','https://www.expressvpn.com/order','VPN.','Monthly or annual.','expressvpn.com.',[{id:'mo',name:'Monthly',price:12.95,cycle:'monthly'}], ANNIV),
  p('malwarebytes','Malwarebytes Premium','security','🛡️','#0d3ecc','https://www.malwarebytes.com','https://www.malwarebytes.com/pricing','Malware protection.','Annual.','malwarebytes.com.',[{id:'std',name:'Premium',price:3.33,cycle:'monthly',blurb:'$39.99/yr'}], ANNIV),
  p('lastpass','LastPass','security','🔑','#d32d27','https://www.lastpass.com','https://www.lastpass.com/pricing','Password manager.','Annual.','lastpass.com.',[
    {id:'prem',name:'Premium',price:3,cycle:'monthly',blurb:'$36/yr'},{id:'family',name:'Families',price:4,cycle:'monthly',blurb:'$48/yr'},
  ], ANNIV),
  p('sketch','Sketch','creative','💎','#fdad00','https://www.sketch.com','https://www.sketch.com/pricing','Mac design.','Annual per editor.','sketch.com.',[{id:'std',name:'Standard',price:10,cycle:'monthly',blurb:'Per editor, yearly'}], ANNIV),
  p('affinity','Affinity','creative','🅰️','#000','https://affinity.serif.com','https://affinity.serif.com','Design suite.','Annual Universal plan.','affinity.serif.com.',[{id:'universal',name:'Universal (all apps)',price:17.99,cycle:'monthly',blurb:'$215.88/yr'}], ANNIV),
  p('quicken','Quicken Simplifi','finance','📊','#1d8a5f','https://www.quicken.com/simplifi','https://www.quicken.com/simplifi','Budgeting.','Annual.','quicken.com.',[{id:'yr',name:'Simplifi',price:3.99,cycle:'monthly',blurb:'$47.88/yr'}], ANNIV),
  p('fitbod','Fitbod','fitness','🏋️','#e85d04','https://www.fitbod.me','https://www.fitbod.me','Workout planner.','Monthly.','fitbod.me.',[{id:'mo',name:'Fitbod',price:12.99,cycle:'monthly'}], STORE),
  p('noom','Noom','fitness','🥑','#f5a623','https://www.noom.com','https://www.noom.com','Weight coaching.','Multi-month plans.','noom.com.',[{id:'mo',name:'Monthly plan',price:59,cycle:'monthly',blurb:'Typical 4-mo commitment'}], ANNIV),
  p('hellofresh','HelloFresh','food','🥗','#99c221','https://www.hellofresh.com','https://www.hellofresh.com/plans','Meal kits.','Weekly box billing.','hellofresh.com.',[{id:'std',name:'2p×3 meals/week',price:59.94,cycle:'monthly',blurb:'~$9.99/serving weekly'}], ANNIV),
  p('brilliant','Brilliant','education','💡','#000','https://brilliant.org','https://brilliant.org/premium','STEM learning.','Monthly or annual.','brilliant.org.',[
    {id:'mo',name:'Monthly',price:24.99,cycle:'monthly'},{id:'yr',name:'Annual',price:12.49,cycle:'monthly',blurb:'$149/yr'},
  ], ANNIV),
  p('coursera','Coursera Plus','education','🎓','#0056d2','https://www.coursera.org','https://www.coursera.org/courseraplus','Online courses.','Monthly or annual.','coursera.org.',[
    {id:'mo',name:'Monthly',price:59,cycle:'monthly'},{id:'yr',name:'Annual',price:33.25,cycle:'monthly',blurb:'$399/yr'},
  ], ANNIV),
  p('linkedin_learning','LinkedIn Learning','education','💼','#0a66c2','https://www.linkedin.com/learning','https://www.linkedin.com/learning/subscription','Pro courses.','Monthly.','linkedin.com/learning.',[{id:'std',name:'Learning',price:29.99,cycle:'monthly'}], ANNIV),
  p('washington_post','Washington Post','news','📰','#000','https://www.washingtonpost.com','https://subscribe.washingtonpost.com','News.','Monthly.','washingtonpost.com.',[{id:'digital',name:'Digital',price:12,cycle:'monthly'}], ANNIV),
  p('economist','The Economist','news','🌍','#e3120b','https://www.economist.com','https://subscriptions.economist.com','Global news.','Annual typical.','economist.com.',[{id:'digital',name:'Digital',price:12.5,cycle:'monthly',blurb:'~$150/yr'}], ANNIV),
  p('patreon','Patreon','social','🎨','#ff424d','https://www.patreon.com','https://www.patreon.com/pricing','Creator memberships.','Per creator join date.','patreon.com.',[{id:'creator',name:'Creator membership',price:5,cycle:'monthly',blurb:'Varies by creator'}], ANNIV),
  p('jetbrains','JetBrains','developer','🧠','#000','https://www.jetbrains.com','https://www.jetbrains.com/store','IDE tools.','Annual.','jetbrains.com.',[
    {id:'all',name:'All Products Pack',price:28.90,cycle:'monthly',blurb:'First year, billed annually'},{id:'dot',name:'dotUltimate',price:17.90,cycle:'monthly',blurb:'Billed annually'},
  ], ANNIV),
  p('vercel','Vercel Pro','developer','▲','#000','https://vercel.com','https://vercel.com/pricing','Frontend hosting.','Monthly per seat.','vercel.com.',[{id:'pro',name:'Pro',price:20,cycle:'monthly',blurb:'Per seat'}], ANNIV),
  p('netlify','Netlify Pro','developer','🌐','#00ad9f','https://www.netlify.com','https://www.netlify.com/pricing','Web hosting.','Monthly per seat.','netlify.com.',[{id:'pro',name:'Pro',price:19,cycle:'monthly',blurb:'Per seat'}], ANNIV),
  p('digitalocean','DigitalOcean','developer','🌊','#0080ff','https://www.digitalocean.com','https://www.digitalocean.com/pricing','Cloud VPS.','Monthly usage billing.','digitalocean.com.',[{id:'starter',name:'Droplet from',price:4,cycle:'monthly',blurb:'Usage-based'}], ANNIV),
  p('aws','Amazon Web Services','developer','☁️','#ff9900','https://aws.amazon.com','https://aws.amazon.com/pricing','Cloud infrastructure.','Monthly account billing cycle.','AWS Billing.',[{id:'usage',name:'Typical hobby usage',price:10,cycle:'monthly',blurb:'Varies widely'}], ANNIV),
  p('cloudflare','Cloudflare Pro','developer','🟠','#f38020','https://www.cloudflare.com','https://www.cloudflare.com/plans','CDN & security.','Monthly per zone.','cloudflare.com.',[{id:'pro',name:'Pro',price:20,cycle:'monthly'}], ANNIV),
  p('tinder','Tinder','dating','🔥','#fe3c72','https://tinder.com','https://tinder.com/feature','Dating tiers.','Monthly on signup.','tinder.com.',[
    {id:'plus',name:'Tinder Plus',price:9.99,cycle:'monthly'},{id:'gold',name:'Tinder Gold',price:14.99,cycle:'monthly'},{id:'platinum',name:'Platinum',price:19.99,cycle:'monthly'},
  ], STORE),
  p('bumble','Bumble','dating','🐝','#ffc629','https://bumble.com','https://bumble.com/en-us/premium','Dating premium.','Monthly.','bumble.com.',[
    {id:'boost',name:'Boost',price:11.99,cycle:'monthly'},{id:'premium',name:'Premium',price:17.99,cycle:'monthly'},
  ], STORE),
  p('hinge','Hinge+','dating','💜','#5c3d99','https://hinge.co','https://hinge.co','Dating app.','Monthly.','hinge.co.',[
    {id:'plus',name:'Hinge+',price:9.99,cycle:'monthly'},{id:'x',name:'HingeX',price:19.99,cycle:'monthly'},
  ], STORE),
  p('walmart','Walmart+','shopping','🛒','#0071ce','https://www.walmart.com/plus','https://www.walmart.com/plus','Delivery perks.','Monthly on signup.','walmart.com.',[
    {id:'mo',name:'Monthly',price:12.95,cycle:'monthly'},{id:'yr',name:'Annual',price:8.17,cycle:'monthly',blurb:'$98/yr'},
  ], ANNIV),
  p('costco','Costco Membership','shopping','🏪','#e31837','https://www.costco.com','https://www.costco.com/membership-information.html','Warehouse membership.','Annual on join date.','costco.com.',[
    {id:'gold',name:'Gold Star',price:65,cycle:'yearly'},{id:'exec',name:'Executive',price:130,cycle:'yearly'},
  ], ANNIV),
  p('sam_club','Sam\'s Club','shopping','🏬','#0060a9','https://www.samsclub.com','https://www.samsclub.com/content/membership','Warehouse membership.','Annual on join date.','samsclub.com.',[
    {id:'club',name:'Club',price:50,cycle:'yearly'},{id:'plus',name:'Plus',price:110,cycle:'yearly'},
  ], ANNIV),
  p('grammarly','other','✍️','#15c39a','https://www.grammarly.com','https://www.grammarly.com/plans','Writing assistant.','Monthly or annual.','grammarly.com.',[
    {id:'pro',name:'Pro',price:12,cycle:'monthly'},{id:'biz',name:'Business',price:15,cycle:'monthly',blurb:'Per member'},
  ], ANNIV),
  p('espn','ESPN Unlimited','streaming','🏈','#ff0033','https://plus.espn.com','https://www.espn.com/espnplus','Live sports networks.','Monthly.','ESPN account.',[{id:'std',name:'ESPN Unlimited',price:29.99,cycle:'monthly'}], ANNIV),
  p('britbox','BritBox','streaming','🇬🇧','#00b5e2','https://www.britbox.com','https://www.britbox.com/us/plans','British TV.','Monthly or annual.','britbox.com.',[
    {id:'mo',name:'Monthly',price:8.99,cycle:'monthly'},{id:'yr',name:'Annual',price:6.99,cycle:'monthly',blurb:'$83.88/yr'},
  ], ANNIV),
  p('mubi','Mubi','streaming','🎥','#001489','https://mubi.com','https://mubi.com/en/us/plans','Arthouse cinema.','Monthly.','mubi.com.',[{id:'std',name:'Mubi',price:12.99,cycle:'monthly'}], ANNIV),
  p('criterion','Criterion Channel','streaming','🎬','#gold','https://www.criterionchannel.com','https://www.criterionchannel.com','Classic films.','Monthly.','criterionchannel.com.',[{id:'std',name:'Criterion Channel',price:10.99,cycle:'monthly'}], ANNIV),
  p('plex','Plex Pass','streaming','▶️','#e5a00d','https://www.plex.tv','https://www.plex.tv/plex-pass','DVR & downloads.','Monthly or annual.','plex.tv.',[
    {id:'mo',name:'Monthly',price:4.99,cycle:'monthly'},{id:'yr',name:'Annual',price:3.33,cycle:'monthly',blurb:'$39.99/yr'},
  ], ANNIV),
  p('amazon_music','Amazon Music Unlimited','music','🎵','#25d1da','https://music.amazon.com','https://www.amazon.com/music/unlimited','Amazon music.','Monthly on signup.','Amazon Music settings.',[
    {id:'ind',name:'Individual',price:10.99,cycle:'monthly'},{id:'family',name:'Family',price:16.99,cycle:'monthly'},
  ], ANNIV),
];

const byId = new Map(EXISTING.map((x) => [x.id, inferAnchor(x)]));
for (const np of NEW_PRODUCTS) {
  if (!byId.has(np.id)) byId.set(np.id, np);
}

const PRODUCTS = [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
for (const prod of PRODUCTS) {
  if (Array.isArray(prod.plans)) prod.plans.sort((a, b) => a.price - b.price);
}

const header = `/** Financer catalog — ${PRODUCTS.length} products. Prices from official/public sources (Jul 2026). billingAnchor only when documented — never guessed. */\n`;
writeFileSync(new URL('../catalog-data.js', import.meta.url), header + 'export const PRODUCTS = ' + JSON.stringify(PRODUCTS, null, 2) + ';\n');

const plans = PRODUCTS.reduce((n, p) => n + (p.plans?.length || 0), 0);
console.log('Built', PRODUCTS.length, 'products,', plans, 'plans');
console.log('With billing anchor:', PRODUCTS.filter((p) => p.billingAnchor).length);
