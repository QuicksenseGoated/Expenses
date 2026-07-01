# Ledger

A personal expense & subscription tracker — obsidian dark theme, auto-assigned
gradient accents, billing countdown rings, and a smart product search that
autofills pricing for common subscriptions (Cursor, Netflix, Spotify, etc.).

This is a real desktop app (Electron), not a single HTML file — the UI code
lives in `src/` as plain ES modules and Electron just wraps it in a native
window so you get a proper installable app on Mac/Windows/Linux.

## Project structure

```
main.js              Electron main process (creates the app window)
preload.js            Secure bridge between Electron and the UI (reserved for future native features)
src/
  index.html           App shell
  styles.css           Design system (obsidian theme, gradients, glass, animations)
  app.js               App controller / view router
  storage.js           Data layer (currently localStorage — swap this file for a real DB/auth API later)
  catalog.js           Built-in subscription product catalog + search
  gradients.js         Auto-assigned, persisted gradient color system
  billing.js           Renewal date math + countdown urgency
  stats.js             Dashboard aggregation (totals, category breakdown, upcoming renewals)
  components/
    dashboard.js        Dashboard view
    table.js             All Expenses view
    subscriptions.js    Subscriptions view
    settings.js          Settings view (custom categories, dashboard layout, theme mood)
    modal.js             "+ Add Expense" flow (search, plan picker, form)
    ring.js               Countdown ring SVG
```

## Run it in development

You need [Node.js](https://nodejs.org) installed (v18+).

```bash
cd ledger
npm install
npm start
```

This opens the app in a native window via Electron.

## Package it as a real installable desktop app

```bash
npm run dist:mac      # produces a .dmg / .app in /release
npm run dist:win      # produces a .exe installer in /release
npm run dist:linux    # produces an AppImage in /release
```

(`npm run dist` auto-detects your current OS.) The first run of `electron-builder`
downloads some platform tooling — make sure you're online.

## Notes on the data layer

Everything currently persists to `localStorage` via `src/storage.js`. That file
is intentionally the *only* place that touches storage directly — the rest of
the UI just calls `Storage.getExpenses()`, `Storage.addExpense()`, etc. When
you're ready to add real accounts, replace the internals of `storage.js` with
API calls (keeping the same function names) and nothing else in the app needs
to change.

## Editing the subscription catalog

`src/catalog.js` has the built-in product list. Prices are best-effort and
meant to be corrected — either edit the file directly, or use the app itself:
when you pick a plan and change its price in the Add Expense form, that
correction is saved automatically (`Storage.setCatalogOverride`) and will be
remembered next time.
