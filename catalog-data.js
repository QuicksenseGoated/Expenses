/** Financer catalog — 174 products. Prices from official/public sources (Jul 2026). billingAnchor only when documented — never guessed. */
export const PRODUCTS = [
  {
    "id": "1password",
    "name": "1Password",
    "category": "security",
    "icon": "🔐",
    "color": "#0572ec",
    "url": "https://1password.com",
    "pricingUrl": "https://1password.com/pricing",
    "why": "Password manager.",
    "when": "Monthly or annual.",
    "how": "1password.com → Account → Billing.",
    "plans": [
      {
        "id": "individual",
        "name": "Individual",
        "price": 2.99,
        "cycle": "monthly"
      },
      {
        "id": "family",
        "name": "Families",
        "price": 4.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "adobe_cc",
    "name": "Adobe Creative Cloud",
    "category": "creative",
    "icon": "🎨",
    "color": "#ff0000",
    "url": "https://www.adobe.com/creativecloud.html",
    "pricingUrl": "https://www.adobe.com/creativecloud/plans.html",
    "why": "Photoshop, Premiere, and more.",
    "when": "Monthly or annual.",
    "how": "adobe.com → Manage plan.",
    "plans": [
      {
        "id": "photography",
        "name": "Photography (1TB)",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "single_app",
        "name": "Single App",
        "price": 22.99,
        "cycle": "monthly"
      },
      {
        "id": "all_apps",
        "name": "All Apps",
        "price": 59.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "affinity",
    "name": "Affinity",
    "category": "creative",
    "icon": "🅰️",
    "color": "#000",
    "url": "https://affinity.serif.com",
    "pricingUrl": "https://affinity.serif.com",
    "why": "Design suite.",
    "when": "Annual Universal plan.",
    "how": "affinity.serif.com.",
    "plans": [
      {
        "id": "universal",
        "name": "Universal (all apps)",
        "price": 17.99,
        "cycle": "monthly",
        "blurb": "$215.88/yr"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "airtable",
    "name": "Airtable",
    "category": "productivity",
    "icon": "🗃️",
    "color": "#18bfff",
    "url": "https://www.airtable.com",
    "pricingUrl": "https://www.airtable.com/pricing",
    "why": "Spreadsheet DB.",
    "when": "Monthly per seat.",
    "how": "airtable.com.",
    "plans": [
      {
        "id": "team",
        "name": "Team",
        "price": 20,
        "cycle": "monthly",
        "blurb": "Per seat"
      },
      {
        "id": "business",
        "name": "Business",
        "price": 45,
        "cycle": "monthly",
        "blurb": "Per seat"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "amazon_music",
    "name": "Amazon Music Unlimited",
    "category": "music",
    "icon": "🎵",
    "color": "#25d1da",
    "url": "https://music.amazon.com",
    "pricingUrl": "https://www.amazon.com/music/unlimited",
    "why": "Amazon music.",
    "when": "Monthly on signup.",
    "how": "Amazon Music settings.",
    "plans": [
      {
        "id": "ind",
        "name": "Individual",
        "price": 10.99,
        "cycle": "monthly"
      },
      {
        "id": "family",
        "name": "Family",
        "price": 16.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "prime",
    "name": "Amazon Prime",
    "category": "streaming",
    "icon": "📦",
    "color": "#00a8e1",
    "url": "https://www.amazon.com/prime",
    "pricingUrl": "https://www.amazon.com/gp/prime",
    "why": "Prime shipping, video, and perks.",
    "when": "Monthly or annual.",
    "how": "Amazon → Your Prime → Manage membership.",
    "plans": [
      {
        "id": "video_only",
        "name": "Prime Video only",
        "price": 8.99,
        "cycle": "monthly"
      },
      {
        "id": "monthly",
        "name": "Prime Monthly",
        "price": 14.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Prime Annual",
        "price": 139,
        "cycle": "yearly",
        "blurb": "~$11.58/mo"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "aws",
    "name": "Amazon Web Services",
    "category": "developer",
    "icon": "☁️",
    "color": "#ff9900",
    "url": "https://aws.amazon.com",
    "pricingUrl": "https://aws.amazon.com/pricing",
    "why": "Cloud infrastructure.",
    "when": "Monthly account billing cycle.",
    "how": "AWS Billing.",
    "plans": [
      {
        "id": "usage",
        "name": "Typical hobby usage",
        "price": 10,
        "cycle": "monthly",
        "blurb": "Varies widely"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "amc",
    "name": "AMC+",
    "category": "streaming",
    "icon": "🎞️",
    "color": "#00a3e0",
    "url": "https://www.amcplus.com",
    "pricingUrl": "https://www.amcplus.com",
    "why": "AMC & Shudder bundle.",
    "when": "Monthly.",
    "how": "amcplus.com.",
    "plans": [
      {
        "id": "std",
        "name": "AMC+",
        "price": 9.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "anydo",
    "name": "Any.do Premium",
    "category": "productivity",
    "icon": "📌",
    "color": "#00a8ff",
    "url": "https://www.any.do",
    "pricingUrl": "https://www.any.do/pricing",
    "why": "Tasks, lists, and calendar.",
    "when": "Monthly or annual.",
    "how": "any.do → Premium.",
    "plans": [
      {
        "id": "monthly",
        "name": "Premium",
        "price": 5,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 36,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "apple_arcade",
    "name": "Apple Arcade",
    "category": "gaming",
    "icon": "🕹️",
    "color": "#000000",
    "url": "https://www.apple.com/apple-arcade",
    "pricingUrl": "https://www.apple.com/apple-arcade",
    "why": "100+ games, no ads.",
    "when": "Monthly.",
    "how": "Settings → Subscriptions.",
    "plans": [
      {
        "id": "standard",
        "name": "Apple Arcade",
        "price": 6.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Apple — renews on Apple ID purchase date"
  },
  {
    "id": "apple_fitness",
    "name": "Apple Fitness+",
    "category": "fitness",
    "icon": "🍎",
    "color": "#fa243c",
    "url": "https://www.apple.com/apple-fitness-plus",
    "pricingUrl": "https://www.apple.com/apple-fitness-plus",
    "why": "Apple workout classes.",
    "when": "Monthly.",
    "how": "Settings → Subscriptions.",
    "plans": [
      {
        "id": "standard",
        "name": "Fitness+",
        "price": 9.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Apple — renews on Apple ID purchase date"
  },
  {
    "id": "apple_music",
    "name": "Apple Music",
    "category": "music",
    "icon": "🎵",
    "color": "#fa243c",
    "url": "https://music.apple.com",
    "pricingUrl": "https://www.apple.com/apple-music",
    "why": "Apple's music library.",
    "when": "Monthly via Apple ID.",
    "how": "Settings → Subscriptions.",
    "valueTip": "Student ($5.99) includes Apple TV+. Family ($16.99) for up to 6 people. New device buyers may get 3 months free instead of 1.",
    "plans": [
      {
        "id": "student",
        "name": "Student",
        "price": 5.99,
        "cycle": "monthly",
        "trial": {
          "days": 30,
          "cycles": ["monthly"],
          "source": "https://www.apple.com/apple-music/",
          "note": "1-month free trial for eligible new Student subscribers (apple.com)."
        }
      },
      {
        "id": "individual",
        "name": "Individual",
        "price": 10.99,
        "cycle": "monthly",
        "trial": {
          "days": 30,
          "cycles": ["monthly"],
          "source": "https://www.apple.com/apple-music/",
          "note": "1-month free trial for eligible new Individual subscribers (apple.com)."
        }
      },
      {
        "id": "family",
        "name": "Family",
        "price": 16.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Apple — renews on Apple ID purchase date"
  },
  {
    "id": "apple_tv",
    "name": "Apple TV+",
    "category": "streaming",
    "icon": "🍎",
    "color": "#000000",
    "url": "https://tv.apple.com",
    "pricingUrl": "https://www.apple.com/apple-tv-plus",
    "why": "Apple originals.",
    "when": "Monthly or annual.",
    "how": "Settings → Apple ID → Subscriptions.",
    "plans": [
      {
        "id": "standard",
        "name": "Apple TV+",
        "price": 9.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Apple — renews on Apple ID purchase date"
  },
  {
    "id": "artlist",
    "name": "Artlist",
    "category": "creative",
    "icon": "🎬",
    "color": "#ff3366",
    "url": "https://artlist.io",
    "pricingUrl": "https://artlist.io/page/pricing/max",
    "why": "Music & footage.",
    "when": "Annual.",
    "how": "artlist.io.",
    "plans": [
      {
        "id": "max",
        "name": "Max Social",
        "price": 14.99,
        "cycle": "monthly",
        "blurb": "~$179.88/yr billed annually"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "asana",
    "name": "Asana",
    "category": "productivity",
    "icon": "🔺",
    "color": "#f06a6a",
    "url": "https://asana.com",
    "pricingUrl": "https://asana.com/pricing",
    "why": "Work management.",
    "when": "Monthly per user.",
    "how": "asana.com.",
    "plans": [
      {
        "id": "starter",
        "name": "Starter",
        "price": 10.99,
        "cycle": "monthly",
        "blurb": "Per user"
      },
      {
        "id": "advanced",
        "name": "Advanced",
        "price": 24.99,
        "cycle": "monthly",
        "blurb": "Per user"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "atoms",
    "name": "Atoms",
    "category": "habits",
    "icon": "⚛️",
    "color": "#1abc9c",
    "url": "https://atoms.app",
    "pricingUrl": "https://atoms.app",
    "why": "Tiny habits with reminders.",
    "when": "Monthly.",
    "how": "Atoms app → Pro.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 4.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "audible",
    "name": "Audible",
    "category": "music",
    "icon": "📚",
    "color": "#f7991c",
    "url": "https://www.audible.com",
    "pricingUrl": "https://www.audible.com/ep/membership",
    "why": "Audiobooks and podcasts.",
    "when": "Monthly credits.",
    "how": "audible.com → Account → Membership.",
    "plans": [
      {
        "id": "plus",
        "name": "Audible Plus",
        "price": 7.95,
        "cycle": "monthly"
      },
      {
        "id": "premium_plus",
        "name": "Premium Plus (1 credit)",
        "price": 14.95,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "babbel",
    "name": "Babbel",
    "category": "education",
    "icon": "🗣️",
    "color": "#ff6b00",
    "url": "https://www.babbel.com",
    "pricingUrl": "https://www.babbel.com/prices",
    "why": "Structured language courses.",
    "when": "Monthly or annual.",
    "how": "babbel.com → Account.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 6.95,
        "cycle": "monthly",
        "blurb": "Billed yearly"
      },
      {
        "id": "1mo",
        "name": "1 month",
        "price": 17.95,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "backblaze",
    "name": "Backblaze",
    "category": "cloud",
    "icon": "💾",
    "color": "#e21e29",
    "url": "https://www.backblaze.com",
    "pricingUrl": "https://www.backblaze.com/cloud-backup/pricing",
    "why": "Unlimited computer backup.",
    "when": "Monthly or annual.",
    "how": "backblaze.com → My Account.",
    "plans": [
      {
        "id": "personal",
        "name": "Personal Backup",
        "price": 9,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "beeminder",
    "name": "Beeminder",
    "category": "habits",
    "icon": "📌",
    "color": "#f39c12",
    "url": "https://www.beeminder.com",
    "pricingUrl": "https://www.beeminder.com/pricing",
    "why": "Commitment contracts with real money stakes.",
    "when": "Monthly + optional pledges.",
    "how": "beeminder.com → Plans.",
    "plans": [
      {
        "id": "standard",
        "name": "Beeminder",
        "price": 8,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "bitwarden",
    "name": "Bitwarden",
    "category": "security",
    "icon": "🛡️",
    "color": "#175ddc",
    "url": "https://bitwarden.com",
    "pricingUrl": "https://bitwarden.com/pricing",
    "why": "Open-source password manager.",
    "when": "Monthly or annual.",
    "how": "bitwarden.com → Premium.",
    "plans": [
      {
        "id": "premium",
        "name": "Premium",
        "price": 0.83,
        "cycle": "monthly",
        "blurb": "$10 billed yearly"
      },
      {
        "id": "family",
        "name": "Families",
        "price": 3.33,
        "cycle": "monthly",
        "blurb": "$40 billed yearly"
      }
    ]
  },
  {
    "id": "brilliant",
    "name": "Brilliant",
    "category": "education",
    "icon": "💡",
    "color": "#000",
    "url": "https://brilliant.org",
    "pricingUrl": "https://brilliant.org/premium",
    "why": "STEM learning.",
    "when": "Monthly or annual.",
    "how": "brilliant.org.",
    "plans": [
      {
        "id": "yr",
        "name": "Annual",
        "price": 12.49,
        "cycle": "monthly",
        "blurb": "$149/yr"
      },
      {
        "id": "mo",
        "name": "Monthly",
        "price": 24.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "britbox",
    "name": "BritBox",
    "category": "streaming",
    "icon": "🇬🇧",
    "color": "#00b5e2",
    "url": "https://www.britbox.com",
    "pricingUrl": "https://www.britbox.com/us/plans",
    "why": "British TV.",
    "when": "Monthly or annual.",
    "how": "britbox.com.",
    "plans": [
      {
        "id": "yr",
        "name": "Annual",
        "price": 6.99,
        "cycle": "monthly",
        "blurb": "$83.88/yr"
      },
      {
        "id": "mo",
        "name": "Monthly",
        "price": 8.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "bumble",
    "name": "Bumble",
    "category": "dating",
    "icon": "🐝",
    "color": "#ffc629",
    "url": "https://bumble.com",
    "pricingUrl": "https://bumble.com/en-us/premium",
    "why": "Dating premium.",
    "when": "Monthly.",
    "how": "bumble.com.",
    "plans": [
      {
        "id": "boost",
        "name": "Boost",
        "price": 11.99,
        "cycle": "monthly"
      },
      {
        "id": "premium",
        "name": "Premium",
        "price": 17.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": null
  },
  {
    "id": "calm",
    "name": "Calm",
    "category": "fitness",
    "icon": "🌙",
    "color": "#4a90d9",
    "url": "https://www.calm.com",
    "pricingUrl": "https://www.calm.com/freetrial/plans",
    "why": "Sleep stories and meditation.",
    "when": "Monthly or annual.",
    "how": "calm.com → Account.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 5,
        "cycle": "monthly",
        "blurb": "$59.99 billed yearly"
      },
      {
        "id": "monthly",
        "name": "Monthly",
        "price": 14.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "canva",
    "name": "Canva",
    "category": "creative",
    "icon": "✏️",
    "color": "#00c4cc",
    "url": "https://www.canva.com",
    "pricingUrl": "https://www.canva.com/pricing",
    "why": "Design templates and tools.",
    "when": "Monthly.",
    "how": "canva.com → Account → Billing.",
    "plans": [
      {
        "id": "teams",
        "name": "Teams",
        "price": 10,
        "cycle": "monthly",
        "blurb": "Per user, annual"
      },
      {
        "id": "pro",
        "name": "Pro",
        "price": 15,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "chatgpt",
    "name": "ChatGPT",
    "category": "ai",
    "icon": "💬",
    "color": "#10a37f",
    "url": "https://chat.openai.com",
    "pricingUrl": "https://openai.com/chatgpt/pricing",
    "why": "OpenAI assistant — Plus, Pro, and team tiers.",
    "when": "Monthly only — no annual Plus plan.",
    "how": "chat.openai.com → Settings → Subscription.",
    "trialPolicy": {
      "status": "none",
      "source": "https://help.openai.com/en/articles/8381046",
      "note": "No standing on-demand free trial. Referral invites and limited partner promos only (duration varies by campaign)."
    },
    "valueTip": "Use Free for basics. Plus is $20/mo flat — no annual discount. Watch for referral invites or student/veteran promos before paying.",
    "plans": [
      {
        "id": "plus",
        "name": "Plus",
        "price": 20,
        "cycle": "monthly"
      },
      {
        "id": "team",
        "name": "Team (per seat)",
        "price": 25,
        "cycle": "monthly"
      },
      {
        "id": "pro",
        "name": "Pro",
        "price": 200,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "claude",
    "name": "Claude",
    "category": "ai",
    "icon": "🧠",
    "color": "#d97757",
    "url": "https://claude.ai",
    "pricingUrl": "https://claude.com/pricing",
    "why": "Anthropic AI — Pro and Max usage tiers.",
    "when": "Monthly or annual (Pro).",
    "how": "claude.ai → Settings → Subscription.",
    "trialPolicy": {
      "status": "none",
      "source": "https://support.claude.com/en/articles/8325606-what-is-the-pro-plan",
      "note": "No standing free trial for Pro. Free tier available separately at claude.ai."
    },
    "valueTip": "Pro annual ($200/yr ≈ $17/mo) saves ~17% vs $20/mo. Max tiers are monthly-only — only upgrade if you hit Pro limits.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 20,
        "cycle": "monthly"
      },
      {
        "id": "pro_annual",
        "name": "Pro (annual)",
        "price": 200,
        "cycle": "yearly",
        "blurb": "~$17/mo · save ~17%"
      },
      {
        "id": "max_5x",
        "name": "Max 5×",
        "price": 100,
        "cycle": "monthly",
        "blurb": "5× Pro usage"
      },
      {
        "id": "max_20x",
        "name": "Max 20×",
        "price": 200,
        "cycle": "monthly",
        "blurb": "20× Pro usage"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "clickup",
    "name": "ClickUp",
    "category": "productivity",
    "icon": "✅",
    "color": "#7b68ee",
    "url": "https://clickup.com",
    "pricingUrl": "https://clickup.com/pricing",
    "why": "Productivity suite.",
    "when": "Monthly per user.",
    "how": "clickup.com.",
    "plans": [
      {
        "id": "unlimited",
        "name": "Unlimited",
        "price": 7,
        "cycle": "monthly",
        "blurb": "Per user"
      },
      {
        "id": "business",
        "name": "Business",
        "price": 12,
        "cycle": "monthly",
        "blurb": "Per user"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "cloudflare",
    "name": "Cloudflare Pro",
    "category": "developer",
    "icon": "🟠",
    "color": "#f38020",
    "url": "https://www.cloudflare.com",
    "pricingUrl": "https://www.cloudflare.com/plans",
    "why": "CDN & security.",
    "when": "Monthly per zone.",
    "how": "cloudflare.com.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 20,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "copilot_money",
    "name": "Copilot Money",
    "category": "finance",
    "icon": "✈️",
    "color": "#4a90e2",
    "url": "https://copilot.money",
    "pricingUrl": "https://copilot.money/pricing",
    "why": "iOS finance tracker with insights.",
    "when": "Monthly or annual.",
    "how": "copilot.money → Subscribe.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 7.42,
        "cycle": "monthly",
        "blurb": "$89 billed yearly"
      },
      {
        "id": "monthly",
        "name": "Monthly",
        "price": 13,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Commonly subscribed via App Store / Play"
  },
  {
    "id": "costco",
    "name": "Costco Membership",
    "category": "shopping",
    "icon": "🏪",
    "color": "#e31837",
    "url": "https://www.costco.com",
    "pricingUrl": "https://www.costco.com/membership-information.html",
    "why": "Warehouse membership.",
    "when": "Annual on join date.",
    "how": "costco.com.",
    "plans": [
      {
        "id": "gold",
        "name": "Gold Star",
        "price": 65,
        "cycle": "yearly"
      },
      {
        "id": "exec",
        "name": "Executive",
        "price": 130,
        "cycle": "yearly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "coursera",
    "name": "Coursera Plus",
    "category": "education",
    "icon": "🎓",
    "color": "#0056d2",
    "url": "https://www.coursera.org",
    "pricingUrl": "https://www.coursera.org/courseraplus",
    "why": "Online courses.",
    "when": "Monthly or annual.",
    "how": "coursera.org.",
    "plans": [
      {
        "id": "yr",
        "name": "Annual",
        "price": 33.25,
        "cycle": "monthly",
        "blurb": "$399/yr"
      },
      {
        "id": "mo",
        "name": "Monthly",
        "price": 59,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "craft",
    "name": "Craft",
    "category": "productivity",
    "icon": "📄",
    "color": "#000000",
    "url": "https://www.craft.do",
    "pricingUrl": "https://www.craft.do/pricing",
    "why": "Beautiful docs and notes.",
    "when": "Monthly per person.",
    "how": "craft.do → Upgrade.",
    "plans": [
      {
        "id": "plus",
        "name": "Plus",
        "price": 8,
        "cycle": "monthly"
      },
      {
        "id": "family",
        "name": "Family",
        "price": 15,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "criterion",
    "name": "Criterion Channel",
    "category": "streaming",
    "icon": "🎬",
    "color": "#gold",
    "url": "https://www.criterionchannel.com",
    "pricingUrl": "https://www.criterionchannel.com",
    "why": "Classic films.",
    "when": "Monthly.",
    "how": "criterionchannel.com.",
    "plans": [
      {
        "id": "std",
        "name": "Criterion Channel",
        "price": 10.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "crunchyroll",
    "name": "Crunchyroll",
    "category": "streaming",
    "icon": "🍥",
    "color": "#f47521",
    "url": "https://www.crunchyroll.com",
    "pricingUrl": "https://www.crunchyroll.com/premium",
    "why": "Anime streaming.",
    "when": "Monthly.",
    "how": "crunchyroll.com → Upgrade to Premium.",
    "plans": [
      {
        "id": "fan",
        "name": "Fan",
        "price": 7.99,
        "cycle": "monthly"
      },
      {
        "id": "mega",
        "name": "Mega Fan",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "ultimate",
        "name": "Ultimate Fan",
        "price": 14.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "cursor",
    "name": "Cursor",
    "category": "ai",
    "icon": "⌨️",
    "color": "#000000",
    "url": "https://cursor.com",
    "pricingUrl": "https://cursor.com/pricing",
    "why": "AI code editor for developers.",
    "when": "Monthly.",
    "how": "cursor.com → Settings → Subscription.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 20,
        "cycle": "monthly"
      },
      {
        "id": "pro_plus",
        "name": "Pro+",
        "price": 60,
        "cycle": "monthly"
      },
      {
        "id": "ultra",
        "name": "Ultra",
        "price": 200,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "dailyy",
    "name": "Dailyy",
    "category": "habits",
    "icon": "☀️",
    "color": "#ffc107",
    "url": "https://dailyy.app",
    "pricingUrl": "https://dailyy.app",
    "why": "Daily routine and habit builder.",
    "when": "Monthly.",
    "how": "Dailyy app → Plus.",
    "plans": [
      {
        "id": "plus",
        "name": "Plus",
        "price": 3.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "dashlane",
    "name": "Dashlane",
    "category": "security",
    "icon": "🔒",
    "color": "#0e6bff",
    "url": "https://www.dashlane.com",
    "pricingUrl": "https://www.dashlane.com/plans",
    "why": "Passwords.",
    "when": "Annual.",
    "how": "dashlane.com.",
    "plans": [
      {
        "id": "adv",
        "name": "Advanced",
        "price": 4.99,
        "cycle": "monthly"
      },
      {
        "id": "prem",
        "name": "Premium",
        "price": 6.49,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "doordash",
    "name": "DashPass",
    "category": "food",
    "icon": "🍕",
    "color": "#ff3008",
    "url": "https://www.doordash.com/dashpass",
    "pricingUrl": "https://www.doordash.com/dashpass",
    "why": "Free delivery on DoorDash.",
    "when": "Monthly.",
    "how": "DoorDash app → Account → DashPass.",
    "plans": [
      {
        "id": "standard",
        "name": "DashPass",
        "price": 9.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "deezer",
    "name": "Deezer",
    "category": "music",
    "icon": "🎼",
    "color": "#a238ff",
    "url": "https://www.deezer.com",
    "pricingUrl": "https://www.deezer.com/us/offers",
    "why": "Music streaming with Flow mixes.",
    "when": "Monthly.",
    "how": "deezer.com → My account.",
    "plans": [
      {
        "id": "premium",
        "name": "Premium",
        "price": 11.99,
        "cycle": "monthly"
      },
      {
        "id": "family",
        "name": "Family",
        "price": 19.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "digitalocean",
    "name": "DigitalOcean",
    "category": "developer",
    "icon": "🌊",
    "color": "#0080ff",
    "url": "https://www.digitalocean.com",
    "pricingUrl": "https://www.digitalocean.com/pricing",
    "why": "Cloud VPS.",
    "when": "Monthly usage billing.",
    "how": "digitalocean.com.",
    "plans": [
      {
        "id": "starter",
        "name": "Droplet from",
        "price": 4,
        "cycle": "monthly",
        "blurb": "Usage-based"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "discord",
    "name": "Discord Nitro",
    "category": "social",
    "icon": "💜",
    "color": "#5865f2",
    "url": "https://discord.com/nitro",
    "pricingUrl": "https://discord.com/nitro",
    "why": "Server boosts and perks.",
    "when": "Monthly.",
    "how": "discord.com → User Settings → Nitro.",
    "plans": [
      {
        "id": "basic",
        "name": "Nitro Basic",
        "price": 2.99,
        "cycle": "monthly"
      },
      {
        "id": "full",
        "name": "Nitro",
        "price": 9.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "discovery",
    "name": "Discovery+",
    "category": "streaming",
    "icon": "🔍",
    "color": "#0045be",
    "url": "https://www.discoveryplus.com",
    "pricingUrl": "https://www.discoveryplus.com",
    "why": "Discovery networks.",
    "when": "Monthly.",
    "how": "discoveryplus.com.",
    "plans": [
      {
        "id": "ads",
        "name": "With ads",
        "price": 4.99,
        "cycle": "monthly"
      },
      {
        "id": "ad_free",
        "name": "Ad-free",
        "price": 8.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "disney",
    "name": "Disney+",
    "category": "streaming",
    "icon": "✨",
    "color": "#113ccf",
    "url": "https://www.disneyplus.com",
    "pricingUrl": "https://help.disneyplus.com/article/disneyplus-price",
    "why": "Disney, Marvel, Star Wars, Hulu & ESPN bundles.",
    "when": "Monthly or annual (Premium).",
    "how": "disneyplus.com → Account → Subscription.",
    "trialPolicy": {
      "status": "none",
      "source": "https://help.disneyplus.com/article/disneyplus-price",
      "note": "Disney+ does not offer a free trial (official Help Center)."
    },
    "valueTip": "No trial — binge a month then cancel, or go annual Premium ($189.99/yr) to save ~16% vs monthly. Disney+Hulu bundle ($12.99/mo) beats two standalones.",
    "plans": [
      {
        "id": "ads",
        "name": "Disney+ (with ads)",
        "price": 11.99,
        "cycle": "monthly"
      },
      {
        "id": "no_ads",
        "name": "Disney+ Premium (no ads)",
        "price": 18.99,
        "cycle": "monthly"
      },
      {
        "id": "premium_annual",
        "name": "Disney+ Premium (annual)",
        "price": 189.99,
        "cycle": "yearly",
        "blurb": "~$15.83/mo · save ~16%"
      },
      {
        "id": "bundle",
        "name": "Disney+, Hulu, ESPN Select",
        "price": 19.99,
        "cycle": "monthly",
        "blurb": "3-service bundle"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "done",
    "name": "Done",
    "category": "habits",
    "icon": "✔️",
    "color": "#e74c3c",
    "url": "https://doneapp.app",
    "pricingUrl": "https://doneapp.app",
    "why": "Simple streak-based habit tracking.",
    "when": "Annual billing.",
    "how": "Done app → Premium.",
    "plans": [
      {
        "id": "annual",
        "name": "Premium",
        "price": 1.67,
        "cycle": "monthly",
        "blurb": "$19.99 billed yearly"
      }
    ]
  },
  {
    "id": "dropbox",
    "name": "Dropbox",
    "category": "cloud",
    "icon": "📁",
    "color": "#0061ff",
    "url": "https://www.dropbox.com",
    "pricingUrl": "https://www.dropbox.com/plans",
    "why": "Cloud file sync.",
    "when": "Monthly or annual.",
    "how": "dropbox.com → Account → Plan.",
    "plans": [
      {
        "id": "plus",
        "name": "Plus",
        "price": 11.99,
        "cycle": "monthly"
      },
      {
        "id": "professional",
        "name": "Professional",
        "price": 19.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "duolingo",
    "name": "Duolingo",
    "category": "education",
    "icon": "🦉",
    "color": "#58cc02",
    "url": "https://www.duolingo.com",
    "pricingUrl": "https://www.duolingo.com/super",
    "why": "Language learning — Super and Max tiers.",
    "when": "Monthly or annual.",
    "how": "Duolingo app → Shop.",
    "plans": [
      {
        "id": "super",
        "name": "Super",
        "price": 12.99,
        "cycle": "monthly"
      },
      {
        "id": "max",
        "name": "Max",
        "price": 30,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Commonly subscribed via App Store / Play"
  },
  {
    "id": "ea_play",
    "name": "EA Play",
    "category": "gaming",
    "icon": "🎯",
    "color": "#000",
    "url": "https://www.ea.com/ea-play",
    "pricingUrl": "https://www.ea.com/ea-play",
    "why": "EA games vault.",
    "when": "Monthly.",
    "how": "EA account.",
    "plans": [
      {
        "id": "std",
        "name": "EA Play",
        "price": 5.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "elevenlabs",
    "name": "ElevenLabs",
    "category": "ai",
    "icon": "🎙️",
    "color": "#000000",
    "url": "https://elevenlabs.io",
    "pricingUrl": "https://elevenlabs.io/pricing",
    "why": "AI voice generation.",
    "when": "Monthly character credits.",
    "how": "elevenlabs.io → Subscription.",
    "plans": [
      {
        "id": "starter",
        "name": "Starter",
        "price": 5,
        "cycle": "monthly"
      },
      {
        "id": "creator",
        "name": "Creator",
        "price": 22,
        "cycle": "monthly"
      },
      {
        "id": "pro",
        "name": "Pro",
        "price": 99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "epidemic",
    "name": "Epidemic Sound",
    "category": "creative",
    "icon": "🎵",
    "color": "#00e676",
    "url": "https://www.epidemicsound.com",
    "pricingUrl": "https://www.epidemicsound.com/pricing",
    "why": "Royalty-free music for streams and videos.",
    "when": "Monthly or annual.",
    "how": "epidemicsound.com → Pricing.",
    "plans": [
      {
        "id": "personal",
        "name": "Personal",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "commercial",
        "name": "Commercial",
        "price": 16.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "espn",
    "name": "ESPN+",
    "category": "streaming",
    "icon": "🏈",
    "color": "#ff0033",
    "url": "https://plus.espn.com",
    "pricingUrl": "https://plus.espn.com",
    "why": "Live sports and originals.",
    "when": "Monthly.",
    "how": "ESPN+ account settings.",
    "plans": [
      {
        "id": "standard",
        "name": "ESPN+",
        "price": 11.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "evernote",
    "name": "Evernote",
    "category": "productivity",
    "icon": "🐘",
    "color": "#00a82d",
    "url": "https://evernote.com",
    "pricingUrl": "https://evernote.com/compare-plans",
    "why": "Notes and document capture.",
    "when": "Monthly or annual.",
    "how": "evernote.com → Account → Billing.",
    "plans": [
      {
        "id": "personal",
        "name": "Personal",
        "price": 14.99,
        "cycle": "monthly"
      },
      {
        "id": "professional",
        "name": "Professional",
        "price": 17.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "exist",
    "name": "Exist",
    "category": "habits",
    "icon": "📉",
    "color": "#34495e",
    "url": "https://exist.io",
    "pricingUrl": "https://exist.io",
    "why": "Personal analytics across apps.",
    "when": "Monthly.",
    "how": "exist.io → Subscribe.",
    "plans": [
      {
        "id": "standard",
        "name": "Exist",
        "price": 6,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "expressvpn",
    "name": "ExpressVPN",
    "category": "security",
    "icon": "🟢",
    "color": "#da3940",
    "url": "https://www.expressvpn.com",
    "pricingUrl": "https://www.expressvpn.com/order",
    "why": "VPN.",
    "when": "Monthly or annual.",
    "how": "expressvpn.com.",
    "plans": [
      {
        "id": "mo",
        "name": "Monthly",
        "price": 12.95,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "fabulous",
    "name": "Fabulous",
    "category": "habits",
    "icon": "🌅",
    "color": "#5260ff",
    "url": "https://www.thefabulous.co",
    "pricingUrl": "https://www.thefabulous.co",
    "why": "Guided morning routines and coaching.",
    "when": "Annual billing typical.",
    "how": "Fabulous app → Subscription.",
    "plans": [
      {
        "id": "annual",
        "name": "Premium",
        "price": 3.33,
        "cycle": "monthly",
        "blurb": "~$39.99 billed yearly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Commonly subscribed via App Store / Play"
  },
  {
    "id": "fantastical",
    "name": "Fantastical",
    "category": "productivity",
    "icon": "📆",
    "color": "#ff3b30",
    "url": "https://flexibits.com/fantastical",
    "pricingUrl": "https://flexibits.com/fantastical",
    "why": "Calendar and tasks for Apple platforms.",
    "when": "Monthly or annual.",
    "how": "flexibits.com → Fantastical Premium.",
    "plans": [
      {
        "id": "monthly",
        "name": "Premium",
        "price": 4.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 39.99,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "figma",
    "name": "Figma",
    "category": "creative",
    "icon": "🎨",
    "color": "#a259ff",
    "url": "https://www.figma.com",
    "pricingUrl": "https://www.figma.com/pricing",
    "why": "Collaborative design tool.",
    "when": "Monthly per editor.",
    "how": "figma.com → Admin → Billing.",
    "plans": [
      {
        "id": "professional",
        "name": "Professional",
        "price": 15,
        "cycle": "monthly",
        "blurb": "Per editor"
      },
      {
        "id": "organization",
        "name": "Organization",
        "price": 45,
        "cycle": "monthly",
        "blurb": "Per editor"
      }
    ]
  },
  {
    "id": "finch",
    "name": "Finch",
    "category": "habits",
    "icon": "🐦",
    "color": "#7ed957",
    "url": "https://finchcare.com",
    "pricingUrl": "https://finchcare.com",
    "why": "Self-care pet that grows with your habits.",
    "when": "Monthly or annual.",
    "how": "Finch app → Plus.",
    "plans": [
      {
        "id": "monthly",
        "name": "Finch Plus",
        "price": 6.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 34.99,
        "cycle": "yearly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Commonly subscribed via App Store / Play"
  },
  {
    "id": "fitbod",
    "name": "Fitbod",
    "category": "fitness",
    "icon": "🏋️",
    "color": "#e85d04",
    "url": "https://www.fitbod.me",
    "pricingUrl": "https://www.fitbod.me",
    "why": "Workout planner.",
    "when": "Monthly.",
    "how": "fitbod.me.",
    "plans": [
      {
        "id": "mo",
        "name": "Fitbod",
        "price": 12.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": null
  },
  {
    "id": "forest",
    "name": "Forest",
    "category": "habits",
    "icon": "🌳",
    "color": "#43a047",
    "url": "https://www.forestapp.cc",
    "pricingUrl": "https://www.forestapp.cc",
    "why": "Focus timer that grows virtual trees.",
    "when": "One-time Pro unlock.",
    "how": "Forest app → Pro version.",
    "plans": [
      {
        "id": "pro",
        "name": "Forest Pro",
        "price": 3.99,
        "cycle": "yearly",
        "blurb": "One-time purchase"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Commonly subscribed via App Store / Play"
  },
  {
    "id": "fubo",
    "name": "FuboTV",
    "category": "streaming",
    "icon": "📡",
    "color": "#f93",
    "url": "https://www.fubo.tv",
    "pricingUrl": "https://www.fubo.tv/welcome",
    "why": "Live TV sports.",
    "when": "Monthly on signup.",
    "how": "fubo.tv.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 84.99,
        "cycle": "monthly"
      },
      {
        "id": "elite",
        "name": "Elite",
        "price": 94.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "geforce_now",
    "name": "GeForce NOW",
    "category": "gaming",
    "icon": "🖥️",
    "color": "#76b900",
    "url": "https://www.nvidia.com/geforce-now",
    "pricingUrl": "https://www.nvidia.com/en-us/geforce-now/memberships",
    "why": "Cloud gaming with your library.",
    "when": "Monthly.",
    "how": "NVIDIA account → Membership.",
    "plans": [
      {
        "id": "priority",
        "name": "Priority",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "ultimate",
        "name": "Ultimate",
        "price": 19.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "github",
    "name": "GitHub",
    "category": "productivity",
    "icon": "🐙",
    "color": "#24292f",
    "url": "https://github.com",
    "pricingUrl": "https://github.com/pricing",
    "why": "Code hosting and collaboration.",
    "when": "Monthly per user.",
    "how": "github.com → Settings → Billing.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 4,
        "cycle": "monthly"
      },
      {
        "id": "team",
        "name": "Team",
        "price": 4,
        "cycle": "monthly",
        "blurb": "Per user"
      },
      {
        "id": "enterprise",
        "name": "Enterprise",
        "price": 21,
        "cycle": "monthly",
        "blurb": "Per user"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "github_copilot",
    "name": "GitHub Copilot",
    "category": "ai",
    "icon": "🐙",
    "color": "#24292f",
    "url": "https://github.com/features/copilot",
    "pricingUrl": "https://github.com/features/copilot/plans",
    "why": "AI pair programmer in your IDE.",
    "when": "Monthly per user.",
    "how": "github.com → Settings → Billing.",
    "valueTip": "Try Copilot Free for light use. Pro has a one-time 30-day trial — cancel before day 30. Students/OSS maintainers may get Pro free.",
    "plans": [
      {
        "id": "pro",
        "name": "Copilot Pro",
        "price": 10,
        "cycle": "monthly",
        "trial": {
          "days": 30,
          "cycles": ["monthly"],
          "source": "https://docs.github.com/en/copilot/concepts/billing/billing-for-individuals",
          "note": "One-time 30-day trial for Copilot Pro (payment method required). Pro+ has no trial."
        }
      },
      {
        "id": "business",
        "name": "Business",
        "price": 19,
        "cycle": "monthly",
        "blurb": "Per user"
      },
      {
        "id": "pro_plus",
        "name": "Copilot Pro+",
        "price": 39,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "goalmap",
    "name": "Goalmap",
    "category": "habits",
    "icon": "🗺️",
    "color": "#8e44ad",
    "url": "https://goalmap.com",
    "pricingUrl": "https://goalmap.com",
    "why": "Goal and habit coaching.",
    "when": "Monthly.",
    "how": "Goalmap → Premium.",
    "plans": [
      {
        "id": "premium",
        "name": "Premium",
        "price": 6.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "gemini",
    "name": "Google Gemini",
    "category": "ai",
    "icon": "✨",
    "color": "#4285f4",
    "url": "https://gemini.google.com",
    "pricingUrl": "https://one.google.com/about/plans",
    "why": "Google AI assistant with Advanced tier.",
    "when": "Monthly via Google One AI Premium.",
    "how": "one.google.com → Plans.",
    "plans": [
      {
        "id": "advanced",
        "name": "Google AI Pro",
        "price": 19.99,
        "cycle": "monthly"
      },
      {
        "id": "ultra",
        "name": "Google AI Ultra",
        "price": 249.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "google_one",
    "name": "Google One",
    "category": "cloud",
    "icon": "🔵",
    "color": "#4285f4",
    "url": "https://one.google.com",
    "pricingUrl": "https://one.google.com/about/plans",
    "why": "Extra Google storage.",
    "when": "Monthly.",
    "how": "one.google.com → Settings.",
    "plans": [
      {
        "id": "100gb",
        "name": "100 GB",
        "price": 1.99,
        "cycle": "monthly"
      },
      {
        "id": "200gb",
        "name": "200 GB",
        "price": 2.99,
        "cycle": "monthly"
      },
      {
        "id": "2tb",
        "name": "2 TB",
        "price": 9.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "grow",
    "name": "Grow",
    "category": "habits",
    "icon": "🌱",
    "color": "#27ae60",
    "url": "https://growapp.app",
    "pricingUrl": "https://growapp.app",
    "why": "Plant-growing habit motivation.",
    "when": "Monthly.",
    "how": "Grow app → Premium.",
    "plans": [
      {
        "id": "premium",
        "name": "Premium",
        "price": 3.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "habit",
    "name": "Habit",
    "category": "habits",
    "icon": "🔄",
    "color": "#607d8b",
    "url": "https://habit.app",
    "pricingUrl": "https://habit.app",
    "why": "Minimal habit tracker.",
    "when": "Annual.",
    "how": "Habit app → Premium.",
    "plans": [
      {
        "id": "annual",
        "name": "Premium",
        "price": 14.99,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "habitica",
    "name": "Habitica",
    "category": "habits",
    "icon": "⚔️",
    "color": "#4f2a93",
    "url": "https://habitica.com",
    "pricingUrl": "https://habitica.com",
    "why": "Gamified habit RPG — optional subscriber perks.",
    "when": "Monthly or annual.",
    "how": "habitica.com → Settings → Subscription.",
    "plans": [
      {
        "id": "monthly",
        "name": "Monthly",
        "price": 4.99,
        "cycle": "monthly"
      },
      {
        "id": "quarterly",
        "name": "3 months",
        "price": 14.99,
        "cycle": "monthly",
        "blurb": "$14.99 every 3 months"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 47.99,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "habitify",
    "name": "Habitify",
    "category": "habits",
    "icon": "📊",
    "color": "#3f51b5",
    "url": "https://www.habitify.me",
    "pricingUrl": "https://www.habitify.me/new-pricing",
    "why": "Clean habit tracking with analytics.",
    "when": "Monthly or annual.",
    "how": "habitify.me → Premium.",
    "plans": [
      {
        "id": "annual",
        "name": "Premium Annual",
        "price": 2.49,
        "cycle": "monthly",
        "blurb": "$29.99 billed yearly"
      },
      {
        "id": "lifetime",
        "name": "Lifetime",
        "price": 59.99,
        "cycle": "yearly",
        "blurb": "One-time purchase"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Commonly subscribed via App Store / Play"
  },
  {
    "id": "habitnow",
    "name": "HabitNow",
    "category": "habits",
    "icon": "📋",
    "color": "#9b59b6",
    "url": "https://habitnow.app",
    "pricingUrl": "https://habitnow.app",
    "why": "Flexible habit & task tracker.",
    "when": "Monthly or annual.",
    "how": "HabitNow → Premium.",
    "plans": [
      {
        "id": "monthly",
        "name": "Premium",
        "price": 4.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 29.99,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "headspace",
    "name": "Headspace",
    "category": "fitness",
    "icon": "🧘",
    "color": "#f47d31",
    "url": "https://www.headspace.com",
    "pricingUrl": "https://www.headspace.com/subscriptions",
    "why": "Meditation and mindfulness.",
    "when": "Monthly or annual.",
    "how": "headspace.com → Account.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 5.83,
        "cycle": "monthly",
        "blurb": "$69.99 billed yearly"
      },
      {
        "id": "monthly",
        "name": "Monthly",
        "price": 12.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "hellofresh",
    "name": "HelloFresh",
    "category": "food",
    "icon": "🥗",
    "color": "#99c221",
    "url": "https://www.hellofresh.com",
    "pricingUrl": "https://www.hellofresh.com/plans",
    "why": "Meal kits.",
    "when": "Weekly box billing.",
    "how": "hellofresh.com.",
    "plans": [
      {
        "id": "std",
        "name": "2p×3 meals/week",
        "price": 59.94,
        "cycle": "monthly",
        "blurb": "~$9.99/serving weekly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "hinge",
    "name": "Hinge+",
    "category": "dating",
    "icon": "💜",
    "color": "#5c3d99",
    "url": "https://hinge.co",
    "pricingUrl": "https://hinge.co",
    "why": "Dating app.",
    "when": "Monthly.",
    "how": "hinge.co.",
    "plans": [
      {
        "id": "plus",
        "name": "Hinge+",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "x",
        "name": "HingeX",
        "price": 19.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": null
  },
  {
    "id": "hulu",
    "name": "Hulu",
    "category": "streaming",
    "icon": "📺",
    "color": "#1ce783",
    "url": "https://www.hulu.com",
    "pricingUrl": "https://www.hulu.com/welcome",
    "why": "Current TV and originals.",
    "when": "Monthly.",
    "how": "hulu.com → Account → Manage plan.",
    "trialPolicy": {
      "status": "none",
      "source": "https://thestreamable.com/hulu-ends-free-trial-disney-plus-app",
      "note": "No free trial on standalone on-demand plans (Hulu confirmed to press). Live TV has a separate trial — see Live TV plan."
    },
    "valueTip": "Student plan ($1.99/mo) if eligible. Disney+Hulu bundle ($12.99/mo) often beats Hulu alone + Disney+.",
    "plans": [
      {
        "id": "ads",
        "name": "With ads",
        "price": 7.99,
        "cycle": "monthly"
      },
      {
        "id": "no_ads",
        "name": "No ads",
        "price": 17.99,
        "cycle": "monthly"
      },
      {
        "id": "live",
        "name": "Live TV",
        "price": 76.99,
        "cycle": "monthly",
        "trial": {
          "days": 3,
          "cycles": ["monthly"],
          "source": "https://decider.com/2026/06/25/hulu-30-day-free-trial-hulu-plans-prices-subscription-cost-disney-bundle-free-trial/",
          "note": "3-day free trial for Hulu + Live TV bundle (eligible new subscribers)."
        }
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "icloud",
    "name": "iCloud+",
    "category": "cloud",
    "icon": "☁️",
    "color": "#007aff",
    "url": "https://www.icloud.com",
    "pricingUrl": "https://www.apple.com/icloud",
    "why": "Apple cloud storage.",
    "when": "Monthly.",
    "how": "Settings → Apple ID → iCloud → Manage.",
    "plans": [
      {
        "id": "50gb",
        "name": "50 GB",
        "price": 0.99,
        "cycle": "monthly"
      },
      {
        "id": "200gb",
        "name": "200 GB",
        "price": 2.99,
        "cycle": "monthly"
      },
      {
        "id": "2tb",
        "name": "2 TB",
        "price": 9.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Apple — renews on Apple ID purchase date"
  },
  {
    "id": "instacart",
    "name": "Instacart+",
    "category": "food",
    "icon": "🛒",
    "color": "#43b02a",
    "url": "https://www.instacart.com/plus",
    "pricingUrl": "https://www.instacart.com/plus",
    "why": "Grocery delivery perks.",
    "when": "Monthly or annual.",
    "how": "instacart.com → Instacart+.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 7.99,
        "cycle": "monthly",
        "blurb": "Billed yearly"
      },
      {
        "id": "monthly",
        "name": "Monthly",
        "price": 9.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "jasper",
    "name": "Jasper",
    "category": "ai",
    "icon": "✍️",
    "color": "#ff6b35",
    "url": "https://www.jasper.ai",
    "pricingUrl": "https://www.jasper.ai/pricing",
    "why": "AI marketing.",
    "when": "Monthly.",
    "how": "jasper.ai.",
    "plans": [
      {
        "id": "creator",
        "name": "Creator",
        "price": 49,
        "cycle": "monthly"
      },
      {
        "id": "pro",
        "name": "Pro",
        "price": 69,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "jetbrains",
    "name": "JetBrains",
    "category": "developer",
    "icon": "🧠",
    "color": "#000",
    "url": "https://www.jetbrains.com",
    "pricingUrl": "https://www.jetbrains.com/store",
    "why": "IDE tools.",
    "when": "Annual.",
    "how": "jetbrains.com.",
    "plans": [
      {
        "id": "dot",
        "name": "dotUltimate",
        "price": 17.9,
        "cycle": "monthly",
        "blurb": "Billed annually"
      },
      {
        "id": "all",
        "name": "All Products Pack",
        "price": 28.9,
        "cycle": "monthly",
        "blurb": "First year, billed annually"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "lastpass",
    "name": "LastPass",
    "category": "security",
    "icon": "🔑",
    "color": "#d32d27",
    "url": "https://www.lastpass.com",
    "pricingUrl": "https://www.lastpass.com/pricing",
    "why": "Password manager.",
    "when": "Annual.",
    "how": "lastpass.com.",
    "plans": [
      {
        "id": "prem",
        "name": "Premium",
        "price": 3,
        "cycle": "monthly",
        "blurb": "$36/yr"
      },
      {
        "id": "family",
        "name": "Families",
        "price": 4,
        "cycle": "monthly",
        "blurb": "$48/yr"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "lightstream",
    "name": "Lightstream Studio",
    "category": "streaming",
    "icon": "💡",
    "color": "#00d4aa",
    "url": "https://golightstream.com",
    "pricingUrl": "https://golightstream.com/pricing",
    "why": "Cloud-based live production for console & PC streams.",
    "when": "Monthly.",
    "how": "Lightstream → Account → Subscription.",
    "plans": [
      {
        "id": "gamer",
        "name": "Gamer",
        "price": 8,
        "cycle": "monthly"
      },
      {
        "id": "creator",
        "name": "Creator",
        "price": 25,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "linear",
    "name": "Linear",
    "category": "productivity",
    "icon": "📐",
    "color": "#5e6ad2",
    "url": "https://linear.app",
    "pricingUrl": "https://linear.app/pricing",
    "why": "Issue tracking.",
    "when": "Monthly per user.",
    "how": "linear.app.",
    "plans": [
      {
        "id": "standard",
        "name": "Standard",
        "price": 8,
        "cycle": "monthly",
        "blurb": "Per user"
      },
      {
        "id": "plus",
        "name": "Plus",
        "price": 14,
        "cycle": "monthly",
        "blurb": "Per user"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "linkedin_learning",
    "name": "LinkedIn Learning",
    "category": "education",
    "icon": "💼",
    "color": "#0a66c2",
    "url": "https://www.linkedin.com/learning",
    "pricingUrl": "https://www.linkedin.com/learning/subscription",
    "why": "Pro courses.",
    "when": "Monthly.",
    "how": "linkedin.com/learning.",
    "plans": [
      {
        "id": "std",
        "name": "Learning",
        "price": 29.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "linkedin",
    "name": "LinkedIn Premium",
    "category": "social",
    "icon": "💼",
    "color": "#0a66c2",
    "url": "https://www.linkedin.com/premium",
    "pricingUrl": "https://www.linkedin.com/premium",
    "why": "Job insights and InMail.",
    "when": "Monthly.",
    "how": "linkedin.com → Premium.",
    "plans": [
      {
        "id": "career",
        "name": "Career",
        "price": 29.99,
        "cycle": "monthly"
      },
      {
        "id": "business",
        "name": "Business",
        "price": 59.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "loop",
    "name": "Loop Habit Tracker",
    "category": "habits",
    "icon": "🔁",
    "color": "#4caf50",
    "url": "https://loophabits.org",
    "pricingUrl": "https://loophabits.org",
    "why": "Open-source habit tracker (donation/premium).",
    "when": "Optional contribution.",
    "how": "Play Store → Loop.",
    "plans": [
      {
        "id": "contrib",
        "name": "Contributor",
        "price": 1.99,
        "cycle": "monthly",
        "blurb": "Optional support tier"
      }
    ]
  },
  {
    "id": "malwarebytes",
    "name": "Malwarebytes Premium",
    "category": "security",
    "icon": "🛡️",
    "color": "#0d3ecc",
    "url": "https://www.malwarebytes.com",
    "pricingUrl": "https://www.malwarebytes.com/pricing",
    "why": "Malware protection.",
    "when": "Annual.",
    "how": "malwarebytes.com.",
    "plans": [
      {
        "id": "std",
        "name": "Premium",
        "price": 3.33,
        "cycle": "monthly",
        "blurb": "$39.99/yr"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "masterclass",
    "name": "MasterClass",
    "category": "education",
    "icon": "🎬",
    "color": "#000000",
    "url": "https://www.masterclass.com",
    "pricingUrl": "https://www.masterclass.com/pricing",
    "why": "Celebrity-led video courses.",
    "when": "Annual billing.",
    "how": "masterclass.com → Plans.",
    "plans": [
      {
        "id": "individual",
        "name": "Individual",
        "price": 10,
        "cycle": "monthly",
        "blurb": "$120 billed yearly"
      },
      {
        "id": "duo",
        "name": "Duo",
        "price": 15,
        "cycle": "monthly",
        "blurb": "$180 billed yearly"
      }
    ]
  },
  {
    "id": "hbo",
    "name": "Max",
    "category": "streaming",
    "icon": "🎭",
    "color": "#002be7",
    "url": "https://www.max.com",
    "pricingUrl": "https://www.max.com/plans",
    "why": "HBO, Warner Bros, and discovery content.",
    "when": "Monthly billing.",
    "how": "max.com → Settings → Subscription.",
    "trialPolicy": {
      "status": "none",
      "source": "https://help.max.com/US-en/answer/detail/000002501",
      "note": "No standing free trial at Max.com. Occasional 7-day promos via Prime Video Channels or other partners only."
    },
    "valueTip": "Disney+Hulu+HBO Max bundle ($19.99/mo with ads) saves vs three separate subs. Ad-supported solo plan is cheapest if you only want Max.",
    "plans": [
      {
        "id": "ads",
        "name": "With ads",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "ad_free",
        "name": "Ad-free",
        "price": 16.99,
        "cycle": "monthly"
      },
      {
        "id": "ultimate",
        "name": "Ultimate",
        "price": 20.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "mega",
    "name": "MEGA",
    "category": "cloud",
    "icon": "🔴",
    "color": "#d9272e",
    "url": "https://mega.io",
    "pricingUrl": "https://mega.io/pricing",
    "why": "Encrypted cloud.",
    "when": "Monthly.",
    "how": "mega.io.",
    "plans": [
      {
        "id": "pro1",
        "name": "Pro I",
        "price": 10.78,
        "cycle": "monthly"
      },
      {
        "id": "pro2",
        "name": "Pro II",
        "price": 21.56,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "microsoft365",
    "name": "Microsoft 365",
    "category": "productivity",
    "icon": "🪟",
    "color": "#0078d4",
    "url": "https://www.microsoft.com/microsoft-365",
    "pricingUrl": "https://www.microsoft.com/microsoft-365/buy/compare-all-microsoft-365-products",
    "why": "Office & cloud.",
    "when": "Monthly or annual.",
    "how": "Microsoft account.",
    "plans": [
      {
        "id": "personal",
        "name": "Personal",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "family",
        "name": "Family",
        "price": 12.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "copilot",
    "name": "Microsoft Copilot Pro",
    "category": "ai",
    "icon": "🪟",
    "color": "#0078d4",
    "url": "https://copilot.microsoft.com",
    "pricingUrl": "https://www.microsoft.com/store/b/copilotpro",
    "why": "Copilot in Office apps and priority GPT.",
    "when": "Monthly.",
    "how": "Microsoft account → Subscriptions.",
    "plans": [
      {
        "id": "pro",
        "name": "Copilot Pro",
        "price": 20,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "onedrive",
    "name": "Microsoft OneDrive",
    "category": "cloud",
    "icon": "🟦",
    "color": "#0078d4",
    "url": "https://www.microsoft.com/onedrive",
    "pricingUrl": "https://www.microsoft.com/microsoft-365/onedrive-compare-online-cloud-storage-plans",
    "why": "Microsoft cloud storage.",
    "when": "Monthly.",
    "how": "Microsoft account → Subscriptions.",
    "plans": [
      {
        "id": "100gb",
        "name": "100 GB",
        "price": 1.99,
        "cycle": "monthly"
      },
      {
        "id": "family",
        "name": "Microsoft 365 Family",
        "price": 9.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "midjourney",
    "name": "Midjourney",
    "category": "ai",
    "icon": "🖼️",
    "color": "#000000",
    "url": "https://www.midjourney.com",
    "pricingUrl": "https://docs.midjourney.com/docs/plans",
    "why": "AI image generation.",
    "when": "Monthly.",
    "how": "midjourney.com → Manage subscription.",
    "plans": [
      {
        "id": "basic",
        "name": "Basic",
        "price": 10,
        "cycle": "monthly"
      },
      {
        "id": "standard",
        "name": "Standard",
        "price": 30,
        "cycle": "monthly"
      },
      {
        "id": "pro",
        "name": "Pro",
        "price": 60,
        "cycle": "monthly"
      },
      {
        "id": "mega",
        "name": "Mega",
        "price": 120,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "monarch",
    "name": "Monarch Money",
    "category": "finance",
    "icon": "👑",
    "color": "#ff6b35",
    "url": "https://www.monarchmoney.com",
    "pricingUrl": "https://www.monarchmoney.com/pricing",
    "why": "Modern budgeting and net worth.",
    "when": "Monthly or annual.",
    "how": "monarchmoney.com → Settings.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 8.33,
        "cycle": "monthly",
        "blurb": "$99.99 billed yearly"
      },
      {
        "id": "monthly",
        "name": "Monthly",
        "price": 14.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "monday",
    "name": "monday.com",
    "category": "productivity",
    "icon": "📊",
    "color": "#ff3d57",
    "url": "https://monday.com",
    "pricingUrl": "https://monday.com/pricing",
    "why": "Work OS.",
    "when": "Monthly per seat.",
    "how": "monday.com.",
    "plans": [
      {
        "id": "basic",
        "name": "Basic",
        "price": 9,
        "cycle": "monthly",
        "blurb": "Per seat"
      },
      {
        "id": "standard",
        "name": "Standard",
        "price": 12,
        "cycle": "monthly",
        "blurb": "Per seat"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "motion",
    "name": "Motion",
    "category": "productivity",
    "icon": "🏃",
    "color": "#6366f1",
    "url": "https://www.usemotion.com",
    "pricingUrl": "https://www.usemotion.com/pricing",
    "why": "AI calendar and auto-scheduling.",
    "when": "Monthly per seat.",
    "how": "usemotion.com → Billing.",
    "plans": [
      {
        "id": "team",
        "name": "Team AI",
        "price": 12,
        "cycle": "monthly",
        "blurb": "Per seat, annual"
      },
      {
        "id": "individual",
        "name": "Individual AI",
        "price": 19,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "mubi",
    "name": "Mubi",
    "category": "streaming",
    "icon": "🎥",
    "color": "#001489",
    "url": "https://mubi.com",
    "pricingUrl": "https://mubi.com/en/us/plans",
    "why": "Arthouse cinema.",
    "when": "Monthly.",
    "how": "mubi.com.",
    "plans": [
      {
        "id": "std",
        "name": "Mubi",
        "price": 12.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "myfitnesspal",
    "name": "MyFitnessPal Premium",
    "category": "fitness",
    "icon": "🥗",
    "color": "#0066ee",
    "url": "https://www.myfitnesspal.com",
    "pricingUrl": "https://www.myfitnesspal.com/premium",
    "why": "Calorie and macro tracking.",
    "when": "Monthly or annual.",
    "how": "myfitnesspal.com → Premium.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 9.99,
        "cycle": "monthly",
        "blurb": "$79.99 billed yearly"
      },
      {
        "id": "monthly",
        "name": "Premium",
        "price": 19.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "netflix",
    "name": "Netflix",
    "category": "streaming",
    "icon": "🎬",
    "color": "#e50914",
    "url": "https://www.netflix.com",
    "pricingUrl": "https://www.netflix.com/signup/planform",
    "why": "Movies and TV on demand.",
    "when": "Charged monthly on your signup date.",
    "how": "netflix.com → Account → Plan.",
    "plans": [
      {
        "id": "ads",
        "name": "Standard with ads",
        "price": 8.99,
        "cycle": "monthly"
      },
      {
        "id": "standard",
        "name": "Standard",
        "price": 19.99,
        "cycle": "monthly"
      },
      {
        "id": "premium",
        "name": "Premium",
        "price": 26.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary",
    "trialPolicy": {
      "status": "none",
      "source": "https://help.netflix.com/en/node/16282",
      "note": "Netflix does not offer free trials (official Help Center)."
    },
    "valueTip": "Standard with ads ($8.99) is cheapest. No trial — subscribe monthly and cancel after a binge. Premium only if you need 4K or extra screens."
  },
  {
    "id": "netlify",
    "name": "Netlify Pro",
    "category": "developer",
    "icon": "🌐",
    "color": "#00ad9f",
    "url": "https://www.netlify.com",
    "pricingUrl": "https://www.netlify.com/pricing",
    "why": "Web hosting.",
    "when": "Monthly per seat.",
    "how": "netlify.com.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 19,
        "cycle": "monthly",
        "blurb": "Per seat"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "nyt",
    "name": "New York Times",
    "category": "news",
    "icon": "📰",
    "color": "#000000",
    "url": "https://www.nytimes.com",
    "pricingUrl": "https://www.nytimes.com/subscription",
    "why": "News and games bundle.",
    "when": "Monthly or annual.",
    "how": "nytimes.com → Account → Subscriptions.",
    "plans": [
      {
        "id": "digital",
        "name": "Digital",
        "price": 17,
        "cycle": "monthly"
      },
      {
        "id": "all_access",
        "name": "All Access",
        "price": 25,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "nintendo",
    "name": "Nintendo Switch Online",
    "category": "gaming",
    "icon": "🔴",
    "color": "#e60012",
    "url": "https://www.nintendo.com/switch/online-service",
    "pricingUrl": "https://www.nintendo.com/switch/online-service",
    "why": "Online play and classic games.",
    "when": "Monthly or annual.",
    "how": "Nintendo eShop → Nintendo Switch Online.",
    "plans": [
      {
        "id": "individual",
        "name": "Individual",
        "price": 3.99,
        "cycle": "monthly"
      },
      {
        "id": "family",
        "name": "Family",
        "price": 7.99,
        "cycle": "monthly"
      },
      {
        "id": "expansion",
        "name": "+ Expansion Pack",
        "price": 49.99,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "noom",
    "name": "Noom",
    "category": "fitness",
    "icon": "🥑",
    "color": "#f5a623",
    "url": "https://www.noom.com",
    "pricingUrl": "https://www.noom.com",
    "why": "Weight coaching.",
    "when": "Multi-month plans.",
    "how": "noom.com.",
    "plans": [
      {
        "id": "mo",
        "name": "Monthly plan",
        "price": 59,
        "cycle": "monthly",
        "blurb": "Typical 4-mo commitment"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "nordvpn",
    "name": "NordVPN",
    "category": "security",
    "icon": "🔒",
    "color": "#4687ff",
    "url": "https://nordvpn.com",
    "pricingUrl": "https://nordvpn.com/pricing",
    "why": "VPN for privacy and streaming.",
    "when": "Monthly or multi-year.",
    "how": "nordvpn.com → Account.",
    "plans": [
      {
        "id": "annual",
        "name": "Standard (annual)",
        "price": 4.99,
        "cycle": "monthly",
        "blurb": "Billed yearly"
      },
      {
        "id": "basic",
        "name": "Basic (monthly)",
        "price": 12.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "notion",
    "name": "Notion",
    "category": "productivity",
    "icon": "📝",
    "color": "#000000",
    "url": "https://www.notion.so",
    "pricingUrl": "https://www.notion.so/pricing",
    "why": "Notes, docs, and wikis.",
    "when": "Monthly or annual per seat.",
    "how": "notion.so → Settings → Billing.",
    "trialPolicy": {
      "status": "none",
      "source": "https://www.notion.com/pricing",
      "note": "No standard Plus free trial. Plus includes a limited AI trial only. Students get free Plus with .edu email."
    },
    "valueTip": "Annual Plus ($10/seat/mo) saves 17% vs $12 monthly. Students/educators: free Plus via notion.com/help/notion-for-education.",
    "plans": [
      {
        "id": "plus",
        "name": "Plus",
        "price": 12,
        "cycle": "monthly"
      },
      {
        "id": "plus_annual",
        "name": "Plus (annual)",
        "price": 120,
        "cycle": "yearly",
        "blurb": "$10/seat/mo · save 17%"
      },
      {
        "id": "business",
        "name": "Business",
        "price": 20,
        "cycle": "monthly"
      },
      {
        "id": "enterprise",
        "name": "Enterprise",
        "price": 25,
        "cycle": "monthly",
        "blurb": "Per seat, custom"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "obsidian",
    "name": "Obsidian Sync",
    "category": "productivity",
    "icon": "💎",
    "color": "#7c3aed",
    "url": "https://obsidian.md",
    "pricingUrl": "https://obsidian.md/pricing",
    "why": "Encrypted sync for Obsidian vaults.",
    "when": "Monthly or annual.",
    "how": "obsidian.md → Account → Sync.",
    "plans": [
      {
        "id": "monthly",
        "name": "Sync",
        "price": 10,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Sync Annual",
        "price": 96,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "omnifocus",
    "name": "OmniFocus",
    "category": "productivity",
    "icon": "🎯",
    "color": "#94734a",
    "url": "https://www.omnigroup.com/omnifocus",
    "pricingUrl": "https://www.omnigroup.com/omnifocus",
    "why": "Power-user GTD task manager.",
    "when": "Monthly or annual.",
    "how": "omnigroup.com → OmniFocus.",
    "plans": [
      {
        "id": "monthly",
        "name": "Pro",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 99.99,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "opalar",
    "name": "Opal",
    "category": "habits",
    "icon": "💎",
    "color": "#5c6bc0",
    "url": "https://www.opal.so",
    "pricingUrl": "https://www.opal.so/pricing",
    "why": "Screen time and focus blocks.",
    "when": "Monthly.",
    "how": "opal.so → Premium.",
    "plans": [
      {
        "id": "monthly",
        "name": "Premium",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 59.99,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "grammarly",
    "name": "other",
    "category": "✍️",
    "icon": "#15c39a",
    "color": "https://www.grammarly.com",
    "url": "https://www.grammarly.com/plans",
    "pricingUrl": "Writing assistant.",
    "why": "Monthly or annual.",
    "when": "grammarly.com.",
    "how": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 12,
        "cycle": "monthly"
      },
      {
        "id": "biz",
        "name": "Business",
        "price": 15,
        "cycle": "monthly",
        "blurb": "Per member"
      }
    ],
    "plans": "signup_anniversary"
  },
  {
    "id": "own3d",
    "name": "OWN3D Pro",
    "category": "streaming",
    "icon": "🎨",
    "color": "#ff5722",
    "url": "https://www.own3d.tv",
    "pricingUrl": "https://www.own3d.tv/pages/pro",
    "why": "Stream overlays.",
    "when": "Monthly.",
    "how": "own3d.tv.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 7.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "paramount",
    "name": "Paramount+",
    "category": "streaming",
    "icon": "⛰️",
    "color": "#0064ff",
    "url": "https://www.paramountplus.com",
    "pricingUrl": "https://www.paramountplus.com/account/signup",
    "why": "CBS, Paramount films, and sports.",
    "when": "Monthly.",
    "how": "paramountplus.com → Account.",
    "plans": [
      {
        "id": "essential",
        "name": "Essential",
        "price": 5.99,
        "cycle": "monthly"
      },
      {
        "id": "premium",
        "name": "Premium",
        "price": 11.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "patreon",
    "name": "Patreon",
    "category": "social",
    "icon": "🎨",
    "color": "#ff424d",
    "url": "https://www.patreon.com",
    "pricingUrl": "https://www.patreon.com/pricing",
    "why": "Creator memberships.",
    "when": "Per creator join date.",
    "how": "patreon.com.",
    "plans": [
      {
        "id": "creator",
        "name": "Creator membership",
        "price": 5,
        "cycle": "monthly",
        "blurb": "Varies by creator"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "pcloud",
    "name": "pCloud",
    "category": "cloud",
    "icon": "☁️",
    "color": "#20b0e7",
    "url": "https://www.pcloud.com",
    "pricingUrl": "https://www.pcloud.com/cloud-storage-pricing-plans.html",
    "why": "Cloud storage.",
    "when": "Annual.",
    "how": "pcloud.com.",
    "plans": [
      {
        "id": "premium",
        "name": "Premium 500GB",
        "price": 4.17,
        "cycle": "monthly",
        "blurb": "$49.99/yr"
      },
      {
        "id": "plus",
        "name": "Premium Plus 2TB",
        "price": 8.33,
        "cycle": "monthly",
        "blurb": "$99.99/yr"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "peacock",
    "name": "Peacock",
    "category": "streaming",
    "icon": "🦚",
    "color": "#000000",
    "url": "https://www.peacocktv.com",
    "pricingUrl": "https://www.peacocktv.com/premium",
    "why": "NBCUniversal shows and sports.",
    "when": "Monthly.",
    "how": "peacocktv.com → Account.",
    "plans": [
      {
        "id": "premium",
        "name": "Premium",
        "price": 7.99,
        "cycle": "monthly"
      },
      {
        "id": "plus",
        "name": "Premium Plus",
        "price": 13.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "peloton",
    "name": "Peloton",
    "category": "fitness",
    "icon": "🚴",
    "color": "#df1c2f",
    "url": "https://www.onepeloton.com",
    "pricingUrl": "https://www.onepeloton.com/membership",
    "why": "Fitness classes and equipment.",
    "when": "Monthly.",
    "how": "onepeloton.com → Membership.",
    "plans": [
      {
        "id": "app",
        "name": "App",
        "price": 12.99,
        "cycle": "monthly"
      },
      {
        "id": "all_access",
        "name": "All-Access",
        "price": 44,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "perplexity",
    "name": "Perplexity Pro",
    "category": "ai",
    "icon": "🔍",
    "color": "#20b8cd",
    "url": "https://www.perplexity.ai",
    "pricingUrl": "https://www.perplexity.ai/pro",
    "why": "AI search with Pro models.",
    "when": "Monthly or annual.",
    "how": "perplexity.ai → Upgrade.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 20,
        "cycle": "monthly"
      },
      {
        "id": "max",
        "name": "Max",
        "price": 200,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "philo",
    "name": "Philo",
    "category": "streaming",
    "icon": "📺",
    "color": "#00a86b",
    "url": "https://www.philo.com",
    "pricingUrl": "https://www.philo.com",
    "why": "Affordable live TV.",
    "when": "Monthly.",
    "how": "philo.com.",
    "plans": [
      {
        "id": "std",
        "name": "Philo",
        "price": 28,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "ps_plus",
    "name": "PlayStation Plus",
    "category": "gaming",
    "icon": "🕹️",
    "color": "#003791",
    "url": "https://www.playstation.com/ps-plus",
    "pricingUrl": "https://www.playstation.com/ps-plus",
    "why": "Online play and monthly games.",
    "when": "Monthly or annual.",
    "how": "PlayStation → Settings → Subscriptions.",
    "plans": [
      {
        "id": "essential",
        "name": "Essential",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "extra",
        "name": "Extra",
        "price": 14.99,
        "cycle": "monthly"
      },
      {
        "id": "premium",
        "name": "Premium",
        "price": 17.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "plex",
    "name": "Plex Pass",
    "category": "streaming",
    "icon": "▶️",
    "color": "#e5a00d",
    "url": "https://www.plex.tv",
    "pricingUrl": "https://www.plex.tv/plex-pass",
    "why": "DVR & downloads.",
    "when": "Monthly or annual.",
    "how": "plex.tv.",
    "plans": [
      {
        "id": "yr",
        "name": "Annual",
        "price": 3.33,
        "cycle": "monthly",
        "blurb": "$39.99/yr"
      },
      {
        "id": "mo",
        "name": "Monthly",
        "price": 4.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "poe",
    "name": "Poe",
    "category": "ai",
    "icon": "🤖",
    "color": "#5c46f5",
    "url": "https://poe.com",
    "pricingUrl": "https://poe.com/login",
    "why": "Multi-model AI.",
    "when": "Monthly.",
    "how": "poe.com.",
    "plans": [
      {
        "id": "sub",
        "name": "Poe Subscription",
        "price": 19.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "proddy",
    "name": "Proddy",
    "category": "habits",
    "icon": "🔥",
    "color": "#ff5722",
    "url": "https://proddy.app",
    "pricingUrl": "https://proddy.app",
    "why": "ADHD-friendly habit tracker.",
    "when": "Monthly or annual.",
    "how": "Proddy app → Premium.",
    "plans": [
      {
        "id": "monthly",
        "name": "Premium",
        "price": 5.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 39.99,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "productive",
    "name": "Productive",
    "category": "habits",
    "icon": "📅",
    "color": "#5c6bc0",
    "url": "https://productiveapp.io",
    "pricingUrl": "https://productiveapp.io",
    "why": "Habit planner with routines.",
    "when": "Monthly or annual.",
    "how": "productiveapp.io → Premium.",
    "plans": [
      {
        "id": "monthly",
        "name": "Premium",
        "price": 3.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 23.99,
        "cycle": "yearly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Commonly subscribed via App Store / Play"
  },
  {
    "id": "proton_vpn",
    "name": "Proton VPN",
    "category": "security",
    "icon": "🧅",
    "color": "#6d4aff",
    "url": "https://protonvpn.com",
    "pricingUrl": "https://protonvpn.com/pricing",
    "why": "Privacy-focused VPN from Proton.",
    "when": "Monthly or annual.",
    "how": "protonvpn.com → Dashboard.",
    "plans": [
      {
        "id": "plus",
        "name": "VPN Plus",
        "price": 4.99,
        "cycle": "monthly"
      },
      {
        "id": "unlimited",
        "name": "Proton Unlimited",
        "price": 12.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "quicken",
    "name": "Quicken Simplifi",
    "category": "finance",
    "icon": "📊",
    "color": "#1d8a5f",
    "url": "https://www.quicken.com/simplifi",
    "pricingUrl": "https://www.quicken.com/simplifi",
    "why": "Budgeting.",
    "when": "Annual.",
    "how": "quicken.com.",
    "plans": [
      {
        "id": "yr",
        "name": "Simplifi",
        "price": 3.99,
        "cycle": "monthly",
        "blurb": "$47.88/yr"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "raycast",
    "name": "Raycast Pro",
    "category": "productivity",
    "icon": "🚀",
    "color": "#ff6363",
    "url": "https://www.raycast.com",
    "pricingUrl": "https://www.raycast.com/pricing",
    "why": "Mac launcher.",
    "when": "Monthly.",
    "how": "raycast.com.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 8,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "reclaim",
    "name": "Reclaim.ai",
    "category": "productivity",
    "icon": "🔄",
    "color": "#4f46e5",
    "url": "https://reclaim.ai",
    "pricingUrl": "https://reclaim.ai/pricing",
    "why": "Smart calendar habits and focus time.",
    "when": "Monthly per user.",
    "how": "reclaim.ai → Billing.",
    "plans": [
      {
        "id": "starter",
        "name": "Starter",
        "price": 10,
        "cycle": "monthly"
      },
      {
        "id": "business",
        "name": "Business",
        "price": 15,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "reddit",
    "name": "Reddit Premium",
    "category": "social",
    "icon": "🔴",
    "color": "#ff4500",
    "url": "https://www.reddit.com/premium",
    "pricingUrl": "https://www.reddit.com/premium",
    "why": "Ad-free Reddit and coins.",
    "when": "Monthly.",
    "how": "reddit.com → Premium.",
    "plans": [
      {
        "id": "premium",
        "name": "Reddit Premium",
        "price": 5.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "rocket_money",
    "name": "Rocket Money",
    "category": "finance",
    "icon": "🚀",
    "color": "#00d09c",
    "url": "https://www.rocketmoney.com",
    "pricingUrl": "https://www.rocketmoney.com",
    "why": "Subscription canceling and budgeting.",
    "when": "Monthly premium.",
    "how": "Rocket Money app → Premium.",
    "plans": [
      {
        "id": "premium",
        "name": "Premium",
        "price": 6,
        "cycle": "monthly",
        "blurb": "$3–$12 sliding scale"
      }
    ]
  },
  {
    "id": "routinery",
    "name": "Routinery",
    "category": "habits",
    "icon": "⏰",
    "color": "#6c5ce7",
    "url": "https://www.routinery.app",
    "pricingUrl": "https://www.routinery.app",
    "why": "Routine timer with habit stacking.",
    "when": "Monthly or annual.",
    "how": "Routinery app → Premium.",
    "plans": [
      {
        "id": "monthly",
        "name": "Premium",
        "price": 4.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 29.99,
        "cycle": "yearly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Commonly subscribed via App Store / Play"
  },
  {
    "id": "runway",
    "name": "Runway",
    "category": "ai",
    "icon": "🎬",
    "color": "#000000",
    "url": "https://runwayml.com",
    "pricingUrl": "https://runwayml.com/pricing",
    "why": "AI video generation and editing.",
    "when": "Monthly credits.",
    "how": "runwayml.com → Plans.",
    "plans": [
      {
        "id": "standard",
        "name": "Standard",
        "price": 15,
        "cycle": "monthly"
      },
      {
        "id": "pro",
        "name": "Pro",
        "price": 35,
        "cycle": "monthly"
      },
      {
        "id": "unlimited",
        "name": "Unlimited",
        "price": 95,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "sam_club",
    "name": "Sam's Club",
    "category": "shopping",
    "icon": "🏬",
    "color": "#0060a9",
    "url": "https://www.samsclub.com",
    "pricingUrl": "https://www.samsclub.com/content/membership",
    "why": "Warehouse membership.",
    "when": "Annual on join date.",
    "how": "samsclub.com.",
    "plans": [
      {
        "id": "club",
        "name": "Club",
        "price": 50,
        "cycle": "yearly"
      },
      {
        "id": "plus",
        "name": "Plus",
        "price": 110,
        "cycle": "yearly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "shudder",
    "name": "Shudder",
    "category": "streaming",
    "icon": "👻",
    "color": "#cf2028",
    "url": "https://www.shudder.com",
    "pricingUrl": "https://www.shudder.com",
    "why": "Horror.",
    "when": "Monthly.",
    "how": "shudder.com.",
    "plans": [
      {
        "id": "std",
        "name": "Shudder",
        "price": 6.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "siriusxm",
    "name": "SiriusXM",
    "category": "music",
    "icon": "📻",
    "color": "#0033a0",
    "url": "https://www.siriusxm.com",
    "pricingUrl": "https://www.siriusxm.com/plans",
    "why": "Satellite radio.",
    "when": "Monthly.",
    "how": "siriusxm.com.",
    "plans": [
      {
        "id": "music",
        "name": "Music & Entertainment",
        "price": 10.99,
        "cycle": "monthly"
      },
      {
        "id": "all",
        "name": "All Access",
        "price": 19.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "sketch",
    "name": "Sketch",
    "category": "creative",
    "icon": "💎",
    "color": "#fdad00",
    "url": "https://www.sketch.com",
    "pricingUrl": "https://www.sketch.com/pricing",
    "why": "Mac design.",
    "when": "Annual per editor.",
    "how": "sketch.com.",
    "plans": [
      {
        "id": "std",
        "name": "Standard",
        "price": 10,
        "cycle": "monthly",
        "blurb": "Per editor, yearly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "skillshare",
    "name": "Skillshare",
    "category": "education",
    "icon": "🎓",
    "color": "#00ff84",
    "url": "https://www.skillshare.com",
    "pricingUrl": "https://www.skillshare.com/en/pricing",
    "why": "Creative classes and workshops.",
    "when": "Monthly or annual.",
    "how": "skillshare.com → Pricing.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 13.99,
        "cycle": "monthly",
        "blurb": "$168 billed yearly"
      },
      {
        "id": "monthly",
        "name": "Monthly",
        "price": 32,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "slack",
    "name": "Slack",
    "category": "productivity",
    "icon": "💬",
    "color": "#4a154b",
    "url": "https://slack.com",
    "pricingUrl": "https://slack.com/pricing",
    "why": "Team chat.",
    "when": "Monthly per user.",
    "how": "slack.com.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 8.75,
        "cycle": "monthly",
        "blurb": "Per user"
      },
      {
        "id": "business",
        "name": "Business+",
        "price": 15,
        "cycle": "monthly",
        "blurb": "Per user"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "sling",
    "name": "Sling TV",
    "category": "streaming",
    "icon": "📺",
    "color": "#0033a0",
    "url": "https://www.sling.com",
    "pricingUrl": "https://www.sling.com/deals",
    "why": "Live TV.",
    "when": "Monthly.",
    "how": "sling.com.",
    "plans": [
      {
        "id": "orange",
        "name": "Orange",
        "price": 45.99,
        "cycle": "monthly"
      },
      {
        "id": "blue",
        "name": "Blue",
        "price": 50.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "soundcloud",
    "name": "SoundCloud Go+",
    "category": "music",
    "icon": "☁️",
    "color": "#f50",
    "url": "https://soundcloud.com",
    "pricingUrl": "https://soundcloud.com/go",
    "why": "Indie & DJ music.",
    "when": "Monthly.",
    "how": "soundcloud.com.",
    "plans": [
      {
        "id": "go",
        "name": "Go+",
        "price": 9.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "spotify",
    "name": "Spotify",
    "category": "music",
    "icon": "🎧",
    "color": "#1db954",
    "url": "https://www.spotify.com",
    "pricingUrl": "https://www.spotify.com/us/premium",
    "why": "Music and podcasts.",
    "when": "Monthly on billing date.",
    "how": "spotify.com → Account → Manage plan.",
    "valueTip": "Student ($5.99) if eligible. Family ($19.99) covers 6 accounts — best per-person value. Use 30-day trial on monthly Individual/Student only.",
    "plans": [
      {
        "id": "student",
        "name": "Student",
        "price": 5.99,
        "cycle": "monthly",
        "trial": {
          "days": 30,
          "cycles": ["monthly"],
          "source": "https://community.spotify.com/t5/FAQs/1-Month-Free-Premium-offer/ta-p/4941247",
          "note": "1-month free trial for eligible new Student subscribers (monthly)."
        }
      },
      {
        "id": "individual",
        "name": "Individual",
        "price": 11.99,
        "cycle": "monthly",
        "trial": {
          "days": 30,
          "cycles": ["monthly"],
          "source": "https://community.spotify.com/t5/FAQs/1-Month-Free-Premium-offer/ta-p/4941247",
          "note": "1-month free trial for eligible new Individual subscribers (monthly). Duo/Family excluded."
        }
      },
      {
        "id": "duo",
        "name": "Duo",
        "price": 16.99,
        "cycle": "monthly"
      },
      {
        "id": "family",
        "name": "Family",
        "price": 19.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "starz",
    "name": "Starz",
    "category": "streaming",
    "icon": "⭐",
    "color": "#000",
    "url": "https://www.starz.com",
    "pricingUrl": "https://www.starz.com/us/en/signup",
    "why": "Movies & originals.",
    "when": "Monthly on signup.",
    "how": "starz.com.",
    "plans": [
      {
        "id": "std",
        "name": "Starz",
        "price": 10.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "strava",
    "name": "Strava",
    "category": "fitness",
    "icon": "🏃",
    "color": "#fc4c02",
    "url": "https://www.strava.com",
    "pricingUrl": "https://www.strava.com/subscribe",
    "why": "Running and cycling social fitness.",
    "when": "Monthly or annual.",
    "how": "strava.com → Subscribe.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 6.67,
        "cycle": "monthly",
        "blurb": "$79.99 billed yearly"
      },
      {
        "id": "monthly",
        "name": "Subscription",
        "price": 11.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "streaks",
    "name": "Streaks",
    "category": "habits",
    "icon": "🔗",
    "color": "#ff9500",
    "url": "https://streaks.app",
    "pricingUrl": "https://streaks.app",
    "why": "Apple Design Award habit tracker.",
    "when": "One-time or bundle.",
    "how": "App Store → Streaks.",
    "plans": [
      {
        "id": "app",
        "name": "Streaks App",
        "price": 4.99,
        "cycle": "yearly",
        "blurb": "One-time purchase"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Commonly subscribed via App Store / Play"
  },
  {
    "id": "streamlabs",
    "name": "Streamlabs Ultra",
    "category": "streaming",
    "icon": "📡",
    "color": "#80f5d2",
    "url": "https://streamlabs.com",
    "pricingUrl": "https://streamlabs.com/ultra",
    "why": "Streaming overlays, alerts, and multistream tools.",
    "when": "Monthly or annual.",
    "how": "Streamlabs dashboard → Ultra subscription.",
    "plans": [
      {
        "id": "ultra",
        "name": "Ultra",
        "price": 19,
        "cycle": "monthly"
      },
      {
        "id": "ultra_annual",
        "name": "Ultra (annual)",
        "price": 149,
        "cycle": "yearly",
        "blurb": "~$12.42/mo billed yearly"
      }
    ]
  },
  {
    "id": "streamladder",
    "name": "Streamladder",
    "category": "streaming",
    "icon": "🪜",
    "color": "#9146ff",
    "url": "https://streamladder.com",
    "pricingUrl": "https://www.streamladder.com/pricing",
    "why": "Twitch clip editor — vertical exports, captions, and ClipGPT AI highlights.",
    "when": "Monthly or annual billing.",
    "how": "streamladder.com → Pricing → pick Silver, Gold, or Gold + ClipGPT.",
    "valueTip": "Start monthly with 7-day trial to test. Annual saves ~20% if you clip weekly. ClipGPT credits are extra — Gold tier only if you need AI highlights.",
    "plans": [
      {
        "id": "silver",
        "name": "Silver",
        "price": 9.15,
        "cycle": "monthly",
        "blurb": "1080p/60fps, AI captions, direct posting",
        "trial": {
          "days": 7,
          "cycles": ["monthly"],
          "source": "https://www.streamladder.com/",
          "note": "7-day free trial for new users on paid monthly plans (official FAQ)."
        }
      },
      {
        "id": "silver_annual",
        "name": "Silver (annual)",
        "price": 79.99,
        "cycle": "yearly",
        "blurb": "~$6.67/mo · save ~20%"
      },
      {
        "id": "gold",
        "name": "Gold",
        "price": 14.99,
        "cycle": "monthly",
        "blurb": "Scheduler, bulk export, zoom effects",
        "trial": {
          "days": 7,
          "cycles": ["monthly"],
          "source": "https://www.streamladder.com/",
          "note": "7-day free trial for new users on paid monthly plans (official FAQ)."
        }
      },
      {
        "id": "gold_annual",
        "name": "Gold (annual)",
        "price": 149.99,
        "cycle": "yearly",
        "blurb": "~$12.50/mo · save ~20%"
      },
      {
        "id": "gold_clipgpt",
        "name": "Gold + ClipGPT",
        "price": 26.99,
        "cycle": "monthly",
        "blurb": "Gold + AI VOD highlight detection",
        "trial": {
          "days": 7,
          "cycles": ["monthly"],
          "source": "https://www.streamladder.com/",
          "note": "7-day free trial for new users on paid monthly plans (official FAQ)."
        }
      },
      {
        "id": "gold_clipgpt_annual",
        "name": "Gold + ClipGPT (annual)",
        "price": 269.99,
        "cycle": "yearly",
        "blurb": "~$22.50/mo · save ~20%"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "strides",
    "name": "Strides",
    "category": "habits",
    "icon": "🎯",
    "color": "#3498db",
    "url": "https://www.stridesapp.com",
    "pricingUrl": "https://www.stridesapp.com",
    "why": "Goal and habit tracker with trends.",
    "when": "Monthly.",
    "how": "Strides app → Plus.",
    "plans": [
      {
        "id": "plus",
        "name": "Strides Plus",
        "price": 4.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "structured",
    "name": "Structured",
    "category": "habits",
    "icon": "🗓️",
    "color": "#ff6b6b",
    "url": "https://structured.app",
    "pricingUrl": "https://structured.app",
    "why": "Visual day planner timeline.",
    "when": "Monthly or annual.",
    "how": "Structured app → Pro.",
    "plans": [
      {
        "id": "monthly",
        "name": "Pro",
        "price": 2.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 14.99,
        "cycle": "yearly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": "Commonly subscribed via App Store / Play"
  },
  {
    "id": "suno",
    "name": "Suno",
    "category": "ai",
    "icon": "🎵",
    "color": "#000",
    "url": "https://suno.com",
    "pricingUrl": "https://suno.com/pricing",
    "why": "AI music.",
    "when": "Monthly.",
    "how": "suno.com.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 10,
        "cycle": "monthly"
      },
      {
        "id": "premier",
        "name": "Premier",
        "price": 30,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "sunsama",
    "name": "Sunsama",
    "category": "productivity",
    "icon": "🌞",
    "color": "#f5a623",
    "url": "https://www.sunsama.com",
    "pricingUrl": "https://www.sunsama.com/pricing",
    "why": "Daily planner across tools.",
    "when": "Monthly or annual.",
    "how": "sunsama.com → Subscribe.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 16,
        "cycle": "monthly",
        "blurb": "$192 billed yearly"
      },
      {
        "id": "monthly",
        "name": "Monthly",
        "price": 20,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "superhuman",
    "name": "Superhuman",
    "category": "productivity",
    "icon": "⚡",
    "color": "#000",
    "url": "https://superhuman.com",
    "pricingUrl": "https://superhuman.com/pricing",
    "why": "Fast email.",
    "when": "Monthly.",
    "how": "superhuman.com.",
    "plans": [
      {
        "id": "std",
        "name": "Superhuman",
        "price": 30,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "tangerine",
    "name": "Tangerine",
    "category": "habits",
    "icon": "🍊",
    "color": "#ff8c42",
    "url": "https://tangerine.app",
    "pricingUrl": "https://tangerine.app",
    "why": "Mood + habit journal.",
    "when": "Monthly or annual.",
    "how": "Tangerine app → Premium.",
    "plans": [
      {
        "id": "monthly",
        "name": "Premium",
        "price": 4.99,
        "cycle": "monthly"
      },
      {
        "id": "annual",
        "name": "Annual",
        "price": 29.99,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "the_athletic",
    "name": "The Athletic",
    "category": "news",
    "icon": "🏟️",
    "color": "#000000",
    "url": "https://www.nytimes.com/athletic",
    "pricingUrl": "https://www.nytimes.com/athletic",
    "why": "Sports journalism.",
    "when": "Monthly or annual.",
    "how": "theathletic.com → Subscribe.",
    "plans": [
      {
        "id": "monthly",
        "name": "Monthly",
        "price": 9.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "economist",
    "name": "The Economist",
    "category": "news",
    "icon": "🌍",
    "color": "#e3120b",
    "url": "https://www.economist.com",
    "pricingUrl": "https://subscriptions.economist.com",
    "why": "Global news.",
    "when": "Annual typical.",
    "how": "economist.com.",
    "plans": [
      {
        "id": "digital",
        "name": "Digital",
        "price": 12.5,
        "cycle": "monthly",
        "blurb": "~$150/yr"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "things",
    "name": "Things 3",
    "category": "productivity",
    "icon": "✦",
    "color": "#4a90d9",
    "url": "https://culturedcode.com/things",
    "pricingUrl": "https://culturedcode.com/things",
    "why": "Apple-native task manager.",
    "when": "One-time per platform.",
    "how": "culturedcode.com → Things.",
    "plans": [
      {
        "id": "mac",
        "name": "Things (platform)",
        "price": 49.99,
        "cycle": "yearly",
        "blurb": "One-time per device"
      }
    ]
  },
  {
    "id": "ticktick",
    "name": "TickTick Premium",
    "category": "habits",
    "icon": "✅",
    "color": "#4772fa",
    "url": "https://ticktick.com",
    "pricingUrl": "https://ticktick.com/about/upgrade",
    "why": "Tasks, habits, calendar, and Pomodoro.",
    "when": "Annual billing.",
    "how": "ticktick.com → Upgrade to Premium.",
    "plans": [
      {
        "id": "annual",
        "name": "Premium",
        "price": 2.99,
        "cycle": "monthly",
        "blurb": "$35.99 billed yearly"
      }
    ]
  },
  {
    "id": "tidal",
    "name": "Tidal",
    "category": "music",
    "icon": "🌊",
    "color": "#000000",
    "url": "https://tidal.com",
    "pricingUrl": "https://tidal.com/pricing",
    "why": "Hi-fi streaming.",
    "when": "Monthly.",
    "how": "tidal.com → Account.",
    "plans": [
      {
        "id": "individual",
        "name": "Individual",
        "price": 10.99,
        "cycle": "monthly"
      },
      {
        "id": "family",
        "name": "Family",
        "price": 16.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "tinder",
    "name": "Tinder",
    "category": "dating",
    "icon": "🔥",
    "color": "#fe3c72",
    "url": "https://tinder.com",
    "pricingUrl": "https://tinder.com/feature",
    "why": "Dating tiers.",
    "when": "Monthly on signup.",
    "how": "tinder.com.",
    "plans": [
      {
        "id": "plus",
        "name": "Tinder Plus",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "gold",
        "name": "Tinder Gold",
        "price": 14.99,
        "cycle": "monthly"
      },
      {
        "id": "platinum",
        "name": "Platinum",
        "price": 19.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "app_store",
    "billingSource": null
  },
  {
    "id": "todoist",
    "name": "Todoist",
    "category": "productivity",
    "icon": "☑️",
    "color": "#e44332",
    "url": "https://todoist.com",
    "pricingUrl": "https://todoist.com/pricing",
    "why": "Task manager with projects and filters.",
    "when": "Monthly or annual.",
    "how": "todoist.com → Settings → Billing.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 5,
        "cycle": "monthly"
      },
      {
        "id": "business",
        "name": "Business",
        "price": 8,
        "cycle": "monthly",
        "blurb": "Per user"
      }
    ]
  },
  {
    "id": "twitch",
    "name": "Twitch",
    "category": "streaming",
    "icon": "💜",
    "color": "#9146ff",
    "url": "https://www.twitch.tv",
    "pricingUrl": "https://www.twitch.tv/turbo",
    "why": "Turbo ad-free viewing and channel subscriptions.",
    "when": "Monthly per sub or Turbo.",
    "how": "twitch.tv → Subscriptions / Turbo.",
    "plans": [
      {
        "id": "sub_t1",
        "name": "Sub Tier 1",
        "price": 4.99,
        "cycle": "monthly",
        "blurb": "Per channel"
      },
      {
        "id": "sub_t2",
        "name": "Sub Tier 2",
        "price": 9.99,
        "cycle": "monthly",
        "blurb": "Per channel"
      },
      {
        "id": "turbo",
        "name": "Turbo",
        "price": 11.99,
        "cycle": "monthly"
      },
      {
        "id": "sub_t3",
        "name": "Sub Tier 3",
        "price": 24.99,
        "cycle": "monthly",
        "blurb": "Per channel"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "uber_one",
    "name": "Uber One",
    "category": "food",
    "icon": "🚗",
    "color": "#000000",
    "url": "https://www.uber.com/uber-one",
    "pricingUrl": "https://www.uber.com/us/uber-one",
    "why": "Delivery and ride discounts.",
    "when": "Monthly.",
    "how": "Uber app → Uber One.",
    "plans": [
      {
        "id": "standard",
        "name": "Uber One",
        "price": 9.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "ubisoft",
    "name": "Ubisoft+",
    "category": "gaming",
    "icon": "🛡️",
    "color": "#0080ff",
    "url": "https://www.ubisoft.com/ubisoftplus",
    "pricingUrl": "https://www.ubisoft.com/ubisoftplus",
    "why": "Ubisoft library.",
    "when": "Monthly.",
    "how": "ubisoft.com.",
    "plans": [
      {
        "id": "classics",
        "name": "Classics",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "premium",
        "name": "Premium",
        "price": 17.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "vercel",
    "name": "Vercel Pro",
    "category": "developer",
    "icon": "▲",
    "color": "#000",
    "url": "https://vercel.com",
    "pricingUrl": "https://vercel.com/pricing",
    "why": "Frontend hosting.",
    "when": "Monthly per seat.",
    "how": "vercel.com.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 20,
        "cycle": "monthly",
        "blurb": "Per seat"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "wsj",
    "name": "Wall Street Journal",
    "category": "news",
    "icon": "📈",
    "color": "#0274b6",
    "url": "https://www.wsj.com",
    "pricingUrl": "https://subscribe.wsj.com",
    "why": "Business and financial news.",
    "when": "Monthly.",
    "how": "wsj.com → Account.",
    "plans": [
      {
        "id": "digital",
        "name": "Digital",
        "price": 38.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "walmart",
    "name": "Walmart+",
    "category": "shopping",
    "icon": "🛒",
    "color": "#0071ce",
    "url": "https://www.walmart.com/plus",
    "pricingUrl": "https://www.walmart.com/plus",
    "why": "Delivery perks.",
    "when": "Monthly on signup.",
    "how": "walmart.com.",
    "plans": [
      {
        "id": "yr",
        "name": "Annual",
        "price": 8.17,
        "cycle": "monthly",
        "blurb": "$98/yr"
      },
      {
        "id": "mo",
        "name": "Monthly",
        "price": 12.95,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "washington_post",
    "name": "Washington Post",
    "category": "news",
    "icon": "📰",
    "color": "#000",
    "url": "https://www.washingtonpost.com",
    "pricingUrl": "https://subscribe.washingtonpost.com",
    "why": "News.",
    "when": "Monthly.",
    "how": "washingtonpost.com.",
    "plans": [
      {
        "id": "digital",
        "name": "Digital",
        "price": 12,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  },
  {
    "id": "way_of_life",
    "name": "Way of Life",
    "category": "habits",
    "icon": "📈",
    "color": "#2ecc71",
    "url": "https://wayoflifeapp.com",
    "pricingUrl": "https://wayoflifeapp.com",
    "why": "Color-coded habit journal.",
    "when": "One-time premium unlock.",
    "how": "App Store → Way of Life.",
    "plans": [
      {
        "id": "premium",
        "name": "Premium",
        "price": 4.99,
        "cycle": "yearly",
        "blurb": "One-time unlock"
      }
    ]
  },
  {
    "id": "whoop",
    "name": "WHOOP",
    "category": "fitness",
    "icon": "💪",
    "color": "#000000",
    "url": "https://www.whoop.com",
    "pricingUrl": "https://www.whoop.com/membership",
    "why": "Recovery and strain wearable.",
    "when": "Monthly membership.",
    "how": "whoop.com → Membership.",
    "plans": [
      {
        "id": "one",
        "name": "WHOOP One",
        "price": 199,
        "cycle": "yearly",
        "blurb": "Hardware + membership"
      },
      {
        "id": "peak",
        "name": "WHOOP Peak",
        "price": 239,
        "cycle": "yearly"
      },
      {
        "id": "life",
        "name": "WHOOP Life",
        "price": 359,
        "cycle": "yearly"
      }
    ]
  },
  {
    "id": "x_premium",
    "name": "X Premium",
    "category": "social",
    "icon": "𝕏",
    "color": "#000000",
    "url": "https://x.com",
    "pricingUrl": "https://x.com/i/premium_sign_up",
    "why": "Blue check and premium features.",
    "when": "Monthly.",
    "how": "x.com → Premium.",
    "plans": [
      {
        "id": "basic",
        "name": "Basic",
        "price": 3,
        "cycle": "monthly"
      },
      {
        "id": "premium",
        "name": "Premium",
        "price": 8,
        "cycle": "monthly"
      },
      {
        "id": "premium_plus",
        "name": "Premium+",
        "price": 16,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "xbox",
    "name": "Xbox Game Pass",
    "category": "gaming",
    "icon": "🎮",
    "color": "#107c10",
    "url": "https://www.xbox.com/game-pass",
    "pricingUrl": "https://www.xbox.com/game-pass",
    "why": "Hundreds of games on console and PC.",
    "when": "Monthly.",
    "how": "Microsoft account → Subscriptions.",
    "plans": [
      {
        "id": "core",
        "name": "Core",
        "price": 9.99,
        "cycle": "monthly"
      },
      {
        "id": "pc",
        "name": "PC Game Pass",
        "price": 11.99,
        "cycle": "monthly"
      },
      {
        "id": "ultimate",
        "name": "Ultimate",
        "price": 19.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "ynab",
    "name": "YNAB",
    "category": "finance",
    "icon": "💰",
    "color": "#8855ff",
    "url": "https://www.ynab.com",
    "pricingUrl": "https://www.ynab.com/pricing",
    "why": "Zero-based budgeting.",
    "when": "Monthly or annual.",
    "how": "ynab.com → Account → Subscription.",
    "plans": [
      {
        "id": "annual",
        "name": "Annual",
        "price": 8.25,
        "cycle": "monthly",
        "blurb": "$99 billed yearly"
      },
      {
        "id": "monthly",
        "name": "Monthly",
        "price": 14.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "youtube_music",
    "name": "YouTube Music",
    "category": "music",
    "icon": "🎶",
    "color": "#ff0000",
    "url": "https://music.youtube.com",
    "pricingUrl": "https://music.youtube.com/premium",
    "why": "Music with YouTube library.",
    "when": "Monthly.",
    "how": "youtube.com/paid_memberships.",
    "plans": [
      {
        "id": "individual",
        "name": "Individual",
        "price": 10.99,
        "cycle": "monthly"
      },
      {
        "id": "family",
        "name": "Family",
        "price": 16.99,
        "cycle": "monthly"
      }
    ]
  },
  {
    "id": "youtube_premium",
    "name": "YouTube Premium",
    "category": "streaming",
    "icon": "▶️",
    "color": "#ff0000",
    "url": "https://www.youtube.com/premium",
    "pricingUrl": "https://www.youtube.com/premium",
    "why": "Ad-free YouTube and YouTube Music.",
    "when": "Monthly or annual.",
    "how": "youtube.com/paid_memberships.",
    "valueTip": "Family ($22.99) if 3+ users. Check youtube.com/paid_memberships for your exact trial offer before subscribing.",
    "plans": [
      {
        "id": "individual",
        "name": "Individual",
        "price": 13.99,
        "cycle": "monthly",
        "trial": {
          "days": 30,
          "cycles": ["monthly"],
          "source": "https://support.google.com/youtube/answer/10324204",
          "note": "Introductory trial for eligible first-time members (length shown at signup; typically ~1 month). One trial per payment method per 12 months."
        }
      },
      {
        "id": "family",
        "name": "Family",
        "price": 22.99,
        "cycle": "monthly"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": "Industry standard — charged on signup anniversary"
  },
  {
    "id": "zoom",
    "name": "Zoom",
    "category": "productivity",
    "icon": "📹",
    "color": "#2d8cff",
    "url": "https://zoom.us",
    "pricingUrl": "https://zoom.us/pricing",
    "why": "Video meetings.",
    "when": "Monthly.",
    "how": "zoom.us.",
    "plans": [
      {
        "id": "pro",
        "name": "Pro",
        "price": 13.33,
        "cycle": "monthly"
      },
      {
        "id": "business",
        "name": "Business",
        "price": 18.33,
        "cycle": "monthly",
        "blurb": "Per license"
      }
    ],
    "billingAnchor": "signup_anniversary",
    "billingSource": null
  }
];
