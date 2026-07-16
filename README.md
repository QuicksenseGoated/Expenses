# Sense Desk

Social media **manager** for **Quicksense** — not a blank content hub.

Built around:
- Twitch: `QuicksenseGoated` (product)
- TikTok: `quicksenseclips3` (funnel)
- YouTube: `quicksens` (archive / Shorts)

**North star:** grow TikTok views that convert into Twitch average viewers.

## What it does

| View | Job |
|------|-----|
| **Briefing** | Daily manager memo — what to do today |
| **This Week** | Full Siege-heavy week plan + variety day |
| **Clip Factory** | Streamladder → TikTok/Shorts assignments + hooks |
| **Growth Plays** | Active campaigns (same-day clips, raids, series…) |
| **Scoreboard** | Track Twitch avg + TikTok views |
| **Playbook** | Brand bible, pillars, constraints, formulas |

## Strategy baked in

- Siege ~5 days / week, variety 1× (Sat), Sunday = review
- Chaotic funny vibe
- No facecam / no IRL / no empty trend-chasing
- Every clip CTAs to Twitch
- Series: Rank or Ruin, Operator Lock, Chat Decides, Siege Brain

## Run / PWA

**Phone (recommended):** open the GitHub Pages URL after deploy, then  
- Android: Chrome → Install app  
- iPhone: Safari → Share → Add to Home Screen  

```bash
npm install
npm run serve      # local: http://localhost:5173
npm start          # optional Electron wrapper
```

Static web app lives in `src/` and deploys as a PWA via GitHub Actions → Pages.

Data is local (`localStorage` on that device). Re-seed from Settings anytime.
