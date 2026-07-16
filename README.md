# Financer

Premium mobile personal finance — balance, subscriptions, spending.

**Live:** https://quicksensegoated.github.io/Expenses/

## Tabs

| Tab | Purpose |
|-----|---------|
| **Home** | Balance hero, safe-to-spend, metrics, upcoming bills, recent activity |
| **Bills** | Your subscription stack + intelligent catalog search |
| **+** | Log a spend from anywhere |
| **Calendar** | Monthly bill timeline, cancel alerts, payday markers |
| **Activity** | Transaction feed with undo |

**You** (profile, backup, theme) — tap the account icon on Home.

## Features

- Manual balance tracking with live spend/income
- 174-product subscription catalog with plan picker
- Custom subscriptions for anything not in the catalog
- Billing anchor projection (signup anniversary, app store, etc.)
- Dark mode (system / light / dark)
- Local-only data with export/import

## Data

Stored on-device (`localStorage` key `financer.v3`). Migrates from older Financer saves automatically.

## Develop

```bash
npm run serve
```

Push to `main` deploys to GitHub Pages.
