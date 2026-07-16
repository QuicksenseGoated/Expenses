/** Subscription library — compact builder + search API */

const DEF = {
  currency: '€',
  cycle: 'monthly',
  tags: []
};

function S(id, name, category, price, o = {}) {
  return {
    id,
    name,
    category,
    typicalPrice: price,
    ...DEF,
    ...o,
    tags: o.tags || []
  };
}

export const CATALOG = [
  // —— Streaming tools (Twitch / clips) ——
  S('streamladder_free', 'Streamladder Free', 'Streaming Tools', 0, {
    url: 'https://streamladder.com',
    manageUrl: 'https://streamladder.com/dashboard',
    why: 'Auto-clips Twitch streams to TikTok/Shorts/Reels.',
    when: 'Start here if you clip manually today.',
    how: 'Connect Twitch → review auto-clips → approve posts.',
    tip: 'Pair with a posting schedule so clips don’t pile up.',
    tags: ['twitch', 'clips', 'tiktok', 'streamer', 'quicksense']
  }),
  S('streamladder_starter', 'Streamladder Starter', 'Streaming Tools', 9.99, {
    url: 'https://streamladder.com/pricing',
    manageUrl: 'https://streamladder.com/dashboard',
    why: 'More clip volume + faster turnaround for active streamers.',
    when: 'Worth it when you stream 4+ days/week and want daily shorts.',
    how: 'Upgrade in dashboard → set clip rules → cancel before renew if quiet month.',
    tags: ['twitch', 'clips', 'streamladder', 'starter']
  }),
  S('streamladder_pro', 'Streamladder Pro', 'Streaming Tools', 19.99, {
    url: 'https://streamladder.com/pricing',
    manageUrl: 'https://streamladder.com/dashboard',
    why: 'Highest clip limits + priority processing for growth-focused streamers.',
    when: 'Only if Starter caps you and clips drive real TikTok traffic.',
    how: 'Track TikTok views vs fee monthly — downgrade if ROI is weak.',
    tags: ['twitch', 'clips', 'streamladder', 'pro']
  }),
  S('streamladder_premium', 'Streamladder Premium', 'Streaming Tools', 29.99, {
    url: 'https://streamladder.com/pricing',
    manageUrl: 'https://streamladder.com/dashboard',
    why: 'Top tier for heavy clip output across multiple platforms.',
    when: 'Full-time creator with daily short-form pipeline.',
    how: 'Audit clip approval rate weekly so you’re not paying for unused capacity.',
    tags: ['streamladder', 'premium', 'clips']
  }),
  S('eklipse', 'Eklipse.gg', 'Streaming Tools', 12.99, {
    url: 'https://eklipse.gg',
    manageUrl: 'https://eklipse.gg/account',
    why: 'AI gaming highlights from Twitch/Kick.',
    when: 'Alternative to Streamladder — pick one clip engine.',
    how: 'Don’t stack Eklipse + Streamladder unless you A/B results.',
    tags: ['clips', 'gaming', 'twitch']
  }),
  S('opus_clip', 'Opus Clip', 'Streaming Tools', 15, {
    url: 'https://www.opus.pro',
    manageUrl: 'https://www.opus.pro/settings',
    why: 'Long-form → viral shorts with AI reframing.',
    when: 'YouTube-first or podcast clips, not just Twitch.',
    tags: ['clips', 'ai', 'shorts']
  }),
  S('streamlabs_ultra', 'Streamlabs Ultra', 'Streaming Tools', 19, {
    url: 'https://streamlabs.com',
    manageUrl: 'https://streamlabs.com/dashboard#/settings/subscription',
    why: 'Overlays, alerts, themes, and cloud bot in one.',
    when: 'Keep if you use Ultra-exclusive widgets; free tier may be enough.',
    tags: ['twitch', 'obs', 'stream']
  }),
  S('streamlabs_prime', 'Streamlabs Prime', 'Streaming Tools', 12, {
    url: 'https://streamlabs.com',
    manageUrl: 'https://streamlabs.com/dashboard#/settings/subscription',
    why: 'Mid-tier Streamlabs features for casual streamers.',
    when: 'Step up from free when you need specific Prime themes.',
    tags: ['streamlabs', 'twitch']
  }),
  S('twitch_turbo', 'Twitch Turbo', 'Streaming Tools', 8.99, {
    url: 'https://www.twitch.tv/turbo',
    manageUrl: 'https://www.twitch.tv/subscriptions',
    why: 'Ad-free viewing + chat perks on Twitch.',
    when: 'Only if you watch Twitch daily as a viewer, not for streaming.',
    tags: ['twitch', 'ads']
  }),
  S('twitch_sub_tier1', 'Twitch Channel Sub (Tier 1)', 'Creators', 4.99, {
    url: 'https://www.twitch.tv/subscriptions',
    manageUrl: 'https://www.twitch.tv/subscriptions',
    why: 'Support a creator + emotes.',
    when: 'Budget your gifted/subs monthly — they stack silently.',
    tags: ['twitch', 'sub']
  }),
  S('twitch_sub_tier2', 'Twitch Channel Sub (Tier 2)', 'Creators', 9.99, {
    url: 'https://www.twitch.tv/subscriptions',
    manageUrl: 'https://www.twitch.tv/subscriptions',
    why: 'Higher support tier for one channel.',
    when: 'Rarely worth it unless you’re all-in on one community.',
    tags: ['twitch', 'sub']
  }),
  S('twitch_sub_tier3', 'Twitch Channel Sub (Tier 3)', 'Creators', 24.99, {
    url: 'https://www.twitch.tv/subscriptions',
    manageUrl: 'https://www.twitch.tv/subscriptions',
    why: 'Max support for a single creator.',
    when: 'Treat as a donation, not a utility sub.',
    tags: ['twitch', 'sub']
  }),

  // —— AI (every tier) ——
  S('claude_free', 'Claude Free', 'AI', 0, {
    url: 'https://claude.ai',
    manageUrl: 'https://claude.ai/settings',
    why: 'Anthropic chat with daily limits.',
    when: 'Default — only upgrade when you hit limits weekly.',
    tags: ['claude', 'anthropic', 'ai']
  }),
  S('claude_pro', 'Claude Pro', 'AI', 20, {
    url: 'https://claude.ai/pro',
    manageUrl: 'https://claude.ai/settings/billing',
    why: 'More usage, priority, and latest models.',
    when: 'Daily Claude user for writing/code.',
    how: 'Cancel in billing before renew; usage resets monthly.',
    tags: ['claude', 'pro', 'ai']
  }),
  S('claude_max_5x', 'Claude Max (5×)', 'AI', 100, {
    url: 'https://claude.ai/max',
    manageUrl: 'https://claude.ai/settings/billing',
    why: 'Heavy usage tier for power users.',
    when: 'You burn through Pro limits every week.',
    how: 'Compare vs Pro + ChatGPT Plus before staying on Max.',
    tags: ['claude', 'max', 'ai']
  }),
  S('claude_max_20x', 'Claude Max (20×)', 'AI', 200, {
    url: 'https://claude.ai/max',
    manageUrl: 'https://claude.ai/settings/billing',
    why: 'Highest consumer Claude tier.',
    when: 'Professional daily driver replacing multiple AI tools.',
    tags: ['claude', 'max', 'ai']
  }),
  S('claude_team', 'Claude Team', 'AI', 30, {
    url: 'https://claude.ai/team',
    manageUrl: 'https://claude.ai/settings/billing',
    why: 'Per-seat workspace for small teams.',
    when: '2+ people sharing projects — not for solo use.',
    cycle: 'monthly',
    tags: ['claude', 'team', 'business']
  }),
  S('claude_enterprise', 'Claude Enterprise', 'AI', 0, {
    url: 'https://www.anthropic.com/enterprise',
    manageUrl: 'https://www.anthropic.com/contact',
    why: 'Custom contracts, SSO, compliance.',
    when: 'Company budget — track as annual contract.',
    cycle: 'yearly',
    tags: ['claude', 'enterprise']
  }),
  S('chatgpt_free', 'ChatGPT Free', 'AI', 0, {
    url: 'https://chatgpt.com',
    manageUrl: 'https://chatgpt.com/#settings',
    why: 'OpenAI chat with model limits.',
    tags: ['chatgpt', 'openai', 'ai']
  }),
  S('chatgpt_plus', 'ChatGPT Plus', 'AI', 20, {
    url: 'https://chatgpt.com',
    manageUrl: 'https://chatgpt.com/#settings',
    why: 'GPT-4 class models + faster responses.',
    tags: ['chatgpt', 'plus', 'ai']
  }),
  S('chatgpt_team', 'ChatGPT Team', 'AI', 30, {
    url: 'https://openai.com/chatgpt/team',
    manageUrl: 'https://chatgpt.com/#settings',
    why: 'Shared workspace for teams.',
    tags: ['chatgpt', 'team', 'ai']
  }),
  S('chatgpt_enterprise', 'ChatGPT Enterprise', 'AI', 0, {
    url: 'https://openai.com/enterprise',
    manageUrl: 'https://openai.com/contact',
    why: 'Enterprise security and admin controls.',
    cycle: 'yearly',
    tags: ['chatgpt', 'enterprise']
  }),
  S('chatgpt_pro', 'ChatGPT Pro', 'AI', 200, {
    url: 'https://openai.com/chatgpt/pro',
    manageUrl: 'https://chatgpt.com/#settings',
    why: 'Highest OpenAI consumer tier for heavy research users.',
    tags: ['chatgpt', 'pro', 'ai', 'o1']
  }),
  S('gemini_free', 'Google Gemini Free', 'AI', 0, {
    url: 'https://gemini.google.com',
    manageUrl: 'https://one.google.com',
    tags: ['gemini', 'google', 'ai']
  }),
  S('gemini_advanced', 'Google One AI Premium (Gemini Advanced)', 'AI', 21.99, {
    url: 'https://one.google.com',
    manageUrl: 'https://one.google.com/settings',
    why: 'Gemini Advanced + 2TB storage bundle.',
    tags: ['gemini', 'google one', 'ai']
  }),
  S('copilot_pro', 'Microsoft Copilot Pro', 'AI', 20, {
    url: 'https://www.microsoft.com/copilot',
    manageUrl: 'https://account.microsoft.com/services',
    tags: ['copilot', 'microsoft', 'ai']
  }),
  S('perplexity_free', 'Perplexity Free', 'AI', 0, {
    url: 'https://www.perplexity.ai',
    manageUrl: 'https://www.perplexity.ai/settings',
    tags: ['perplexity', 'search', 'ai']
  }),
  S('perplexity_pro', 'Perplexity Pro', 'AI', 20, {
    url: 'https://www.perplexity.ai/pro',
    manageUrl: 'https://www.perplexity.ai/settings',
    tags: ['perplexity', 'pro', 'ai']
  }),
  S('midjourney_basic', 'Midjourney Basic', 'AI', 10, {
    url: 'https://www.midjourney.com',
    manageUrl: 'https://www.midjourney.com/account',
    tags: ['midjourney', 'image', 'ai']
  }),
  S('midjourney_standard', 'Midjourney Standard', 'AI', 30, {
    url: 'https://www.midjourney.com',
    manageUrl: 'https://www.midjourney.com/account',
    tags: ['midjourney', 'image', 'ai']
  }),
  S('midjourney_pro', 'Midjourney Pro', 'AI', 60, {
    url: 'https://www.midjourney.com',
    manageUrl: 'https://www.midjourney.com/account',
    tags: ['midjourney', 'pro', 'ai']
  }),
  S('midjourney_mega', 'Midjourney Mega', 'AI', 120, {
    url: 'https://www.midjourney.com',
    manageUrl: 'https://www.midjourney.com/account',
    tags: ['midjourney', 'mega', 'ai']
  }),
  S('cursor_free', 'Cursor Free', 'Dev', 0, {
    url: 'https://cursor.com',
    manageUrl: 'https://cursor.com/settings',
    tags: ['cursor', 'code', 'ai']
  }),
  S('cursor_pro', 'Cursor Pro', 'Dev', 20, {
    url: 'https://cursor.com/pricing',
    manageUrl: 'https://cursor.com/settings',
    why: 'AI IDE for daily coding.',
    tags: ['cursor', 'pro', 'dev', 'ai']
  }),
  S('cursor_business', 'Cursor Business', 'Dev', 40, {
    url: 'https://cursor.com/pricing',
    manageUrl: 'https://cursor.com/settings',
    why: 'Team billing + admin for Cursor.',
    tags: ['cursor', 'business', 'dev']
  }),
  S('github_copilot_individual', 'GitHub Copilot Individual', 'Dev', 10, {
    url: 'https://github.com/features/copilot',
    manageUrl: 'https://github.com/settings/copilot',
    tags: ['copilot', 'github', 'dev']
  }),
  S('github_copilot_business', 'GitHub Copilot Business', 'Dev', 19, {
    url: 'https://github.com/features/copilot',
    manageUrl: 'https://github.com/settings/billing',
    tags: ['copilot', 'business', 'dev']
  }),
  S('github_copilot_enterprise', 'GitHub Copilot Enterprise', 'Dev', 39, {
    url: 'https://github.com/features/copilot',
    manageUrl: 'https://github.com/settings/billing',
    tags: ['copilot', 'enterprise', 'dev']
  }),
  S('replit_core', 'Replit Core', 'Dev', 20, {
    url: 'https://replit.com',
    manageUrl: 'https://replit.com/account',
    tags: ['replit', 'dev']
  }),
  S('replit_teams', 'Replit Teams', 'Dev', 40, {
    url: 'https://replit.com/teams',
    manageUrl: 'https://replit.com/account',
    tags: ['replit', 'teams']
  }),

  // —— Streaming video ——
  S('netflix_ads', 'Netflix Standard with ads', 'Streaming', 6.99, {
    url: 'https://www.netflix.com',
    manageUrl: 'https://www.netflix.com/account',
    tags: ['netflix', 'video']
  }),
  S('netflix_standard', 'Netflix Standard', 'Streaming', 13.99, {
    url: 'https://www.netflix.com',
    manageUrl: 'https://www.netflix.com/account',
    tags: ['netflix']
  }),
  S('netflix_premium', 'Netflix Premium', 'Streaming', 19.99, {
    url: 'https://www.netflix.com',
    manageUrl: 'https://www.netflix.com/account',
    tags: ['netflix', '4k']
  }),
  S('disney', 'Disney+', 'Streaming', 8.99, {
    url: 'https://www.disneyplus.com',
    manageUrl: 'https://www.disneyplus.com/account',
    tags: ['disney', 'marvel']
  }),
  S('hbo_max', 'Max (HBO)', 'Streaming', 9.99, {
    url: 'https://www.max.com',
    manageUrl: 'https://auth.max.com',
    tags: ['hbo', 'max']
  }),
  S('prime_video', 'Prime Video (standalone)', 'Streaming', 8.99, {
    url: 'https://www.primevideo.com',
    manageUrl: 'https://www.amazon.com/gp/video/settings',
    tags: ['amazon', 'video']
  }),
  S('apple_tv', 'Apple TV+', 'Streaming', 9.99, {
    url: 'https://www.apple.com/apple-tv-plus',
    manageUrl: 'https://support.apple.com/HT202039',
    tags: ['apple', 'tv']
  }),
  S('paramount', 'Paramount+', 'Streaming', 7.99, {
    url: 'https://www.paramountplus.com',
    manageUrl: 'https://www.paramountplus.com/account',
    tags: ['paramount']
  }),
  S('peacock', 'Peacock', 'Streaming', 7.99, {
    url: 'https://www.peacocktv.com',
    manageUrl: 'https://www.peacocktv.com/account',
    tags: ['peacock', 'nbc']
  }),
  S('hulu', 'Hulu', 'Streaming', 9.99, {
    url: 'https://www.hulu.com',
    manageUrl: 'https://secure.hulu.com/account',
    tags: ['hulu']
  }),
  S('crunchyroll_fan', 'Crunchyroll Fan', 'Streaming', 4.99, {
    url: 'https://www.crunchyroll.com',
    manageUrl: 'https://www.crunchyroll.com/account',
    tags: ['anime', 'crunchyroll']
  }),
  S('crunchyroll_mega', 'Crunchyroll Mega Fan', 'Streaming', 7.99, {
    url: 'https://www.crunchyroll.com',
    manageUrl: 'https://www.crunchyroll.com/account',
    tags: ['anime', 'crunchyroll']
  }),
  S('crunchyroll_ultimate', 'Crunchyroll Ultimate Fan', 'Streaming', 9.99, {
    url: 'https://www.crunchyroll.com',
    manageUrl: 'https://www.crunchyroll.com/account',
    tags: ['anime', 'crunchyroll']
  }),

  // —— Music ——
  S('spotify_free', 'Spotify Free', 'Music', 0, {
    url: 'https://www.spotify.com',
    manageUrl: 'https://www.spotify.com/account',
    tags: ['spotify', 'music']
  }),
  S('spotify_individual', 'Spotify Premium Individual', 'Music', 10.99, {
    url: 'https://www.spotify.com/premium',
    manageUrl: 'https://www.spotify.com/account',
    tags: ['spotify']
  }),
  S('spotify_duo', 'Spotify Premium Duo', 'Music', 14.99, {
    url: 'https://www.spotify.com/premium',
    manageUrl: 'https://www.spotify.com/account',
    tags: ['spotify', 'duo']
  }),
  S('spotify_family', 'Spotify Premium Family', 'Music', 17.99, {
    url: 'https://www.spotify.com/premium',
    manageUrl: 'https://www.spotify.com/account',
    tags: ['spotify', 'family']
  }),
  S('spotify_student', 'Spotify Premium Student', 'Music', 5.99, {
    url: 'https://www.spotify.com/student',
    manageUrl: 'https://www.spotify.com/account',
    tags: ['spotify', 'student']
  }),
  S('apple_music_individual', 'Apple Music Individual', 'Music', 10.99, {
    url: 'https://www.apple.com/apple-music',
    manageUrl: 'https://support.apple.com/HT202039',
    tags: ['apple', 'music']
  }),
  S('apple_music_family', 'Apple Music Family', 'Music', 16.99, {
    url: 'https://www.apple.com/apple-music',
    manageUrl: 'https://support.apple.com/HT202039',
    tags: ['apple', 'music', 'family']
  }),
  S('yt_music', 'YouTube Music Premium', 'Music', 10.99, {
    url: 'https://music.youtube.com',
    manageUrl: 'https://www.youtube.com/paid_memberships',
    tags: ['youtube', 'music']
  }),
  S('yt_premium', 'YouTube Premium', 'Video', 12.99, {
    url: 'https://www.youtube.com/premium',
    manageUrl: 'https://www.youtube.com/paid_memberships',
    tags: ['youtube', 'premium']
  }),
  S('tidal', 'Tidal HiFi', 'Music', 10.99, {
    url: 'https://tidal.com',
    manageUrl: 'https://listen.tidal.com/settings',
    tags: ['tidal', 'hifi']
  }),
  S('deezer', 'Deezer Premium', 'Music', 10.99, {
    url: 'https://www.deezer.com',
    manageUrl: 'https://www.deezer.com/account',
    tags: ['deezer']
  }),
  S('soundcloud_go', 'SoundCloud Go+', 'Music', 6.99, {
    url: 'https://soundcloud.com/go',
    manageUrl: 'https://soundcloud.com/settings',
    tags: ['soundcloud']
  }),

  // —— Software & productivity ——
  S('adobe_cc_all', 'Adobe Creative Cloud All Apps', 'Software', 59.99, {
    url: 'https://www.adobe.com/creativecloud.html',
    manageUrl: 'https://account.adobe.com/plans',
    tags: ['adobe', 'design']
  }),
  S('adobe_photo', 'Adobe Photography Plan', 'Software', 11.99, {
    url: 'https://www.adobe.com/creativecloud/photography.html',
    manageUrl: 'https://account.adobe.com/plans',
    tags: ['adobe', 'lightroom', 'photoshop']
  }),
  S('adobe_single', 'Adobe Single App', 'Software', 22.99, {
    url: 'https://www.adobe.com/creativecloud/plans.html',
    manageUrl: 'https://account.adobe.com/plans',
    tags: ['adobe']
  }),
  S('ms365_personal', 'Microsoft 365 Personal', 'Software', 7, {
    url: 'https://www.microsoft.com/microsoft-365',
    manageUrl: 'https://account.microsoft.com/services',
    tags: ['office', 'microsoft']
  }),
  S('ms365_family', 'Microsoft 365 Family', 'Software', 10, {
    url: 'https://www.microsoft.com/microsoft-365',
    manageUrl: 'https://account.microsoft.com/services',
    tags: ['office', 'family']
  }),
  S('notion_free', 'Notion Free', 'Productivity', 0, {
    url: 'https://www.notion.so',
    manageUrl: 'https://www.notion.so/my-account',
    tags: ['notion']
  }),
  S('notion_plus', 'Notion Plus', 'Productivity', 10, {
    url: 'https://www.notion.so/pricing',
    manageUrl: 'https://www.notion.so/my-account',
    tags: ['notion']
  }),
  S('notion_business', 'Notion Business', 'Productivity', 18, {
    url: 'https://www.notion.so/pricing',
    manageUrl: 'https://www.notion.so/my-account',
    tags: ['notion', 'business']
  }),
  S('notion_ai', 'Notion AI Add-on', 'Productivity', 10, {
    url: 'https://www.notion.so/product/ai',
    manageUrl: 'https://www.notion.so/my-account',
    tags: ['notion', 'ai']
  }),
  S('slack_pro', 'Slack Pro', 'Productivity', 7.25, {
    url: 'https://slack.com/pricing',
    manageUrl: 'https://slack.com/account/settings',
    tags: ['slack']
  }),
  S('slack_business', 'Slack Business+', 'Productivity', 12.5, {
    url: 'https://slack.com/pricing',
    manageUrl: 'https://slack.com/account/settings',
    tags: ['slack', 'business']
  }),
  S('todoist_pro', 'Todoist Pro', 'Productivity', 5, {
    url: 'https://todoist.com',
    manageUrl: 'https://todoist.com/app/settings/account',
    tags: ['todoist']
  }),
  S('evernote_personal', 'Evernote Personal', 'Productivity', 8.99, {
    url: 'https://evernote.com',
    manageUrl: 'https://www.evernote.com/Settings.action',
    tags: ['evernote']
  }),
  S('canva_free', 'Canva Free', 'Design', 0, {
    url: 'https://www.canva.com',
    manageUrl: 'https://www.canva.com/settings/billing-and-teams',
    tags: ['canva']
  }),
  S('canva_pro', 'Canva Pro', 'Design', 12.99, {
    url: 'https://www.canva.com/pro',
    manageUrl: 'https://www.canva.com/settings/billing-and-teams',
    tags: ['canva']
  }),
  S('canva_teams', 'Canva Teams', 'Design', 10, {
    url: 'https://www.canva.com/teams',
    manageUrl: 'https://www.canva.com/settings/billing-and-teams',
    tags: ['canva', 'teams']
  }),
  S('figma_starter', 'Figma Starter', 'Design', 0, {
    url: 'https://www.figma.com',
    manageUrl: 'https://www.figma.com/settings',
    tags: ['figma']
  }),
  S('figma_professional', 'Figma Professional', 'Design', 15, {
    url: 'https://www.figma.com/pricing',
    manageUrl: 'https://www.figma.com/settings',
    tags: ['figma']
  }),
  S('figma_org', 'Figma Organization', 'Design', 45, {
    url: 'https://www.figma.com/pricing',
    manageUrl: 'https://www.figma.com/settings',
    tags: ['figma', 'org']
  }),

  // —— Storage & cloud ——
  S('icloud_50', 'iCloud+ 50GB', 'Storage', 0.99, {
    url: 'https://www.apple.com/icloud',
    manageUrl: 'https://support.apple.com/HT202039',
    tags: ['icloud', 'apple']
  }),
  S('icloud_200', 'iCloud+ 200GB', 'Storage', 2.99, {
    url: 'https://www.apple.com/icloud',
    manageUrl: 'https://support.apple.com/HT202039',
    tags: ['icloud']
  }),
  S('icloud_2tb', 'iCloud+ 2TB', 'Storage', 9.99, {
    url: 'https://www.apple.com/icloud',
    manageUrl: 'https://support.apple.com/HT202039',
    tags: ['icloud']
  }),
  S('google_one_100', 'Google One 100GB', 'Storage', 1.99, {
    url: 'https://one.google.com',
    manageUrl: 'https://one.google.com/storage',
    tags: ['google']
  }),
  S('google_one_200', 'Google One 200GB', 'Storage', 2.99, {
    url: 'https://one.google.com',
    manageUrl: 'https://one.google.com/storage',
    tags: ['google']
  }),
  S('google_one_2tb', 'Google One 2TB', 'Storage', 9.99, {
    url: 'https://one.google.com',
    manageUrl: 'https://one.google.com/storage',
    tags: ['google']
  }),
  S('dropbox_plus', 'Dropbox Plus', 'Storage', 11.99, {
    url: 'https://www.dropbox.com',
    manageUrl: 'https://www.dropbox.com/account/plan',
    tags: ['dropbox']
  }),
  S('dropbox_professional', 'Dropbox Professional', 'Storage', 19.99, {
    url: 'https://www.dropbox.com',
    manageUrl: 'https://www.dropbox.com/account/plan',
    tags: ['dropbox']
  }),
  S('onedrive_100', 'Microsoft OneDrive 100GB', 'Storage', 1.99, {
    url: 'https://www.microsoft.com/microsoft-365/onedrive',
    manageUrl: 'https://account.microsoft.com/services',
    tags: ['onedrive']
  }),

  // —— Gaming ——
  S('xbox_game_pass_core', 'Xbox Game Pass Core', 'Gaming', 6.99, {
    url: 'https://www.xbox.com/game-pass',
    manageUrl: 'https://account.microsoft.com/services',
    tags: ['xbox']
  }),
  S('xbox_game_pass_standard', 'Xbox Game Pass Standard', 'Gaming', 12.99, {
    url: 'https://www.xbox.com/game-pass',
    manageUrl: 'https://account.microsoft.com/services',
    tags: ['xbox']
  }),
  S('xbox_game_pass_ultimate', 'Xbox Game Pass Ultimate', 'Gaming', 16.99, {
    url: 'https://www.xbox.com/game-pass',
    manageUrl: 'https://account.microsoft.com/services',
    tags: ['xbox', 'ultimate']
  }),
  S('ps_plus_essential', 'PlayStation Plus Essential', 'Gaming', 8.99, {
    url: 'https://www.playstation.com/ps-plus',
    manageUrl: 'https://www.playstation.com/acct/subscriptions',
    tags: ['playstation']
  }),
  S('ps_plus_extra', 'PlayStation Plus Extra', 'Gaming', 13.99, {
    url: 'https://www.playstation.com/ps-plus',
    manageUrl: 'https://www.playstation.com/acct/subscriptions',
    tags: ['playstation', 'extra']
  }),
  S('ps_plus_premium', 'PlayStation Plus Premium', 'Gaming', 16.99, {
    url: 'https://www.playstation.com/ps-plus',
    manageUrl: 'https://www.playstation.com/acct/subscriptions',
    tags: ['playstation', 'premium']
  }),
  S('nintendo_online', 'Nintendo Switch Online', 'Gaming', 3.99, {
    url: 'https://www.nintendo.com/switch/online',
    manageUrl: 'https://ec.nintendo.com',
    tags: ['nintendo']
  }),
  S('nintendo_expansion', 'Nintendo Switch Online + Expansion', 'Gaming', 49.99, {
    url: 'https://www.nintendo.com/switch/online',
    manageUrl: 'https://ec.nintendo.com',
    cycle: 'yearly',
    tags: ['nintendo']
  }),
  S('ea_play', 'EA Play', 'Gaming', 4.99, {
    url: 'https://www.ea.com/ea-play',
    manageUrl: 'https://myaccount.ea.com',
    tags: ['ea']
  }),
  S('ubisoft_plus', 'Ubisoft+ Classics', 'Gaming', 7.99, {
    url: 'https://store.ubisoft.com/ubisoftplus',
    manageUrl: 'https://account.ubisoft.com',
    tags: ['ubisoft']
  }),
  S('geforce_now_free', 'GeForce NOW Free', 'Gaming', 0, {
    url: 'https://www.nvidia.com/geforce-now',
    manageUrl: 'https://www.nvidia.com/account',
    tags: ['nvidia', 'cloud']
  }),
  S('geforce_now_priority', 'GeForce NOW Priority', 'Gaming', 9.99, {
    url: 'https://www.nvidia.com/geforce-now',
    manageUrl: 'https://www.nvidia.com/account',
    tags: ['nvidia']
  }),
  S('geforce_now_ultimate', 'GeForce NOW Ultimate', 'Gaming', 19.99, {
    url: 'https://www.nvidia.com/geforce-now',
    manageUrl: 'https://www.nvidia.com/account',
    tags: ['nvidia', 'ultimate']
  }),

  // —— Security & VPN ——
  S('nordvpn', 'NordVPN', 'Security', 12.99, {
    url: 'https://nordvpn.com',
    manageUrl: 'https://my.nordaccount.com',
    tags: ['vpn']
  }),
  S('expressvpn', 'ExpressVPN', 'Security', 12.99, {
    url: 'https://www.expressvpn.com',
    manageUrl: 'https://www.expressvpn.com/subscriptions',
    tags: ['vpn']
  }),
  S('surfshark', 'Surfshark VPN', 'Security', 12.99, {
    url: 'https://surfshark.com',
    manageUrl: 'https://my.surfshark.com',
    tags: ['vpn']
  }),
  S('1password_individual', '1Password Individual', 'Security', 2.99, {
    url: 'https://1password.com',
    manageUrl: 'https://my.1password.com',
    tags: ['password']
  }),
  S('1password_families', '1Password Families', 'Security', 4.99, {
    url: 'https://1password.com',
    manageUrl: 'https://my.1password.com',
    tags: ['password', 'family']
  }),
  S('bitwarden_premium', 'Bitwarden Premium', 'Security', 0.99, {
    url: 'https://bitwarden.com',
    manageUrl: 'https://vault.bitwarden.com/#/settings/subscription',
    tags: ['password']
  }),
  S('dashlane', 'Dashlane Premium', 'Security', 4.99, {
    url: 'https://www.dashlane.com',
    manageUrl: 'https://app.dashlane.com',
    tags: ['password']
  }),

  // —— Health, learning, lifestyle ——
  S('gym_generic', 'Gym membership', 'Health', 39, {
    url: 'https://www.google.com/search?q=gym+near+me',
    manageUrl: '',
    tags: ['fitness', 'gym']
  }),
  S('peloton_app', 'Peloton App', 'Health', 12.99, {
    url: 'https://www.onepeloton.com/app',
    manageUrl: 'https://members.onepeloton.com/preferences/subscriptions',
    tags: ['fitness']
  }),
  S('headspace', 'Headspace', 'Health', 12.99, {
    url: 'https://www.headspace.com',
    manageUrl: 'https://www.headspace.com/my-account',
    tags: ['meditation']
  }),
  S('calm', 'Calm', 'Health', 14.99, {
    url: 'https://www.calm.com',
    manageUrl: 'https://www.calm.com/account',
    tags: ['meditation', 'sleep']
  }),
  S('duolingo_super', 'Duolingo Super', 'Learning', 6.99, {
    url: 'https://www.duolingo.com',
    manageUrl: 'https://www.duolingo.com/settings/superduolingo',
    tags: ['language']
  }),
  S('duolingo_max', 'Duolingo Max', 'Learning', 14, {
    url: 'https://www.duolingo.com',
    manageUrl: 'https://www.duolingo.com/settings/superduolingo',
    tags: ['language', 'ai']
  }),
  S('skillshare', 'Skillshare', 'Learning', 13.99, {
    url: 'https://www.skillshare.com',
    manageUrl: 'https://www.skillshare.com/en/settings/billing',
    tags: ['courses']
  }),
  S('masterclass', 'MasterClass', 'Learning', 10, {
    url: 'https://www.masterclass.com',
    manageUrl: 'https://www.masterclass.com/account',
    tags: ['courses']
  }),
  S('linkedin_premium', 'LinkedIn Premium Career', 'Career', 29.99, {
    url: 'https://www.linkedin.com/premium',
    manageUrl: 'https://www.linkedin.com/mypreferences/d/premium-manage',
    tags: ['jobs', 'linkedin']
  }),
  S('linkedin_sales', 'LinkedIn Sales Navigator', 'Career', 79.99, {
    url: 'https://business.linkedin.com/sales-solutions',
    manageUrl: 'https://www.linkedin.com/sales/manage',
    tags: ['sales', 'linkedin']
  }),

  // —— Shopping & delivery ——
  S('amazon_prime', 'Amazon Prime', 'Shopping', 8.99, {
    url: 'https://www.amazon.com/prime',
    manageUrl: 'https://www.amazon.com/gp/primecentral',
    tags: ['amazon', 'shipping']
  }),
  S('walmart_plus', 'Walmart+', 'Shopping', 12.95, {
    url: 'https://www.walmart.com/plus',
    manageUrl: 'https://www.walmart.com/account/plus',
    tags: ['walmart']
  }),
  S('costco', 'Costco membership', 'Shopping', 5, {
    url: 'https://www.costco.com',
    manageUrl: 'https://www.costco.com',
    cycle: 'yearly',
    tags: ['costco']
  }),
  S('uber_one', 'Uber One', 'Shopping', 9.99, {
    url: 'https://www.uber.com/uber-one',
    manageUrl: 'https://account.uber.com',
    tags: ['uber', 'delivery']
  }),
  S('doordash_dashpass', 'DoorDash DashPass', 'Shopping', 9.99, {
    url: 'https://www.doordash.com/dashpass',
    manageUrl: 'https://www.doordash.com/consumer/account',
    tags: ['food', 'delivery']
  }),

  // —— Creators & Patreon ——
  S('patreon', 'Patreon membership', 'Creators', 5, {
    url: 'https://www.patreon.com',
    manageUrl: 'https://www.patreon.com/settings/memberships',
    tags: ['patreon', 'creator']
  }),
  S('kofi_gold', 'Ko-fi Gold', 'Creators', 6, {
    url: 'https://ko-fi.com',
    manageUrl: 'https://ko-fi.com/manage',
    tags: ['kofi']
  }),
  S('substack_paid', 'Substack paid sub', 'Creators', 5, {
    url: 'https://substack.com',
    manageUrl: 'https://substack.com/settings',
    tags: ['newsletter', 'substack']
  }),
  S('onlyfans', 'OnlyFans subscription', 'Creators', 10, {
    url: 'https://onlyfans.com',
    manageUrl: 'https://onlyfans.com/my/settings/subscription',
    tags: ['onlyfans']
  }),

  // —— News & reading ——
  S('nyt', 'New York Times', 'News', 4, {
    url: 'https://www.nytimes.com/subscription',
    manageUrl: 'https://myaccount.nytimes.com',
    tags: ['news']
  }),
  S('washington_post', 'Washington Post', 'News', 10, {
    url: 'https://www.washingtonpost.com/subscribe',
    manageUrl: 'https://www.washingtonpost.com/my-post/account',
    tags: ['news']
  }),
  S('medium', 'Medium membership', 'News', 5, {
    url: 'https://medium.com',
    manageUrl: 'https://medium.com/me/settings',
    tags: ['reading']
  }),
  S('kindle_unlimited', 'Kindle Unlimited', 'News', 9.99, {
    url: 'https://www.amazon.com/kindle-dbs/hz/subscribe/ku',
    manageUrl: 'https://www.amazon.com/hz/mycd/digital-console/alldevices',
    tags: ['books', 'amazon']
  }),

  // —— Telecom & misc ——
  S('icloud_apple_one', 'Apple One Individual', 'Shopping', 16.95, {
    url: 'https://www.apple.com/apple-one',
    manageUrl: 'https://support.apple.com/HT202039',
    tags: ['apple', 'bundle']
  }),
  S('apple_one_family', 'Apple One Family', 'Shopping', 22.95, {
    url: 'https://www.apple.com/apple-one',
    manageUrl: 'https://support.apple.com/HT202039',
    tags: ['apple', 'bundle', 'family']
  }),
  S('google_workspace', 'Google Workspace Business', 'Software', 6, {
    url: 'https://workspace.google.com',
    manageUrl: 'https://admin.google.com',
    tags: ['google', 'email']
  }),
  S('zoom_pro', 'Zoom Pro', 'Software', 13.99, {
    url: 'https://zoom.us/pricing',
    manageUrl: 'https://zoom.us/account',
    tags: ['zoom', 'meetings']
  }),
  S('discord_nitro_basic', 'Discord Nitro Basic', 'Entertainment', 2.99, {
    url: 'https://discord.com/nitro',
    manageUrl: 'https://discord.com/settings/subscriptions',
    tags: ['discord']
  }),
  S('discord_nitro', 'Discord Nitro', 'Entertainment', 9.99, {
    url: 'https://discord.com/nitro',
    manageUrl: 'https://discord.com/settings/subscriptions',
    tags: ['discord']
  }),
  S('audible', 'Audible Plus / Premium Plus', 'Entertainment', 7.95, {
    url: 'https://www.audible.com',
    manageUrl: 'https://www.audible.com/account',
    tags: ['audiobooks', 'amazon']
  }),
  S('shudder', 'Shudder', 'Streaming', 5.99, {
    url: 'https://www.shudder.com',
    manageUrl: 'https://www.shudder.com/account',
    tags: ['horror']
  }),
  S('mubi', 'MUBI', 'Streaming', 10.99, {
    url: 'https://mubi.com',
    manageUrl: 'https://mubi.com/settings',
    tags: ['film']
  })
];

export const CATEGORIES = [
  'All',
  'Streaming Tools',
  'AI',
  'Streaming',
  'Music',
  'Video',
  'Software',
  'Productivity',
  'Design',
  'Dev',
  'Storage',
  'Gaming',
  'Security',
  'Health',
  'Learning',
  'Career',
  'Shopping',
  'Creators',
  'Entertainment',
  'News'
];

export const CATALOG_SIZE = CATALOG.length;

export function catalogById(id) {
  return CATALOG.find((c) => c.id === id) || null;
}

/** Search only — no results until query is at least 2 chars */
export function searchCatalog(query, category = 'All', { minChars = 2 } = {}) {
  const q = String(query || '').trim().toLowerCase();
  if (q.length < minChars) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  return CATALOG.filter((c) => {
    if (category !== 'All' && c.category !== category) return false;
    const hay = [
      c.name,
      c.category,
      c.id,
      ...(c.tags || []),
      c.why || '',
      c.when || '',
      c.how || ''
    ].join(' ').toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}
