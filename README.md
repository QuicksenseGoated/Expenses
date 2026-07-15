# Cadence

A results-driven content planner — strategy first, then ideas, briefs, calendar, pipeline, and measured outcomes.

Most content calendars fail because they start with “what should we post?” Cadence starts with the outcome (traffic, leads, authority, or sales), locks 3–5 pillars, forces a real brief (hook → promise → proof → CTA), and makes you log results so winners get repeated.

This is a desktop app (Electron). The UI lives in `src/` as plain ES modules; Electron wraps it in a native window. You can also open it in a browser for quick use.

## How to get real results with it

1. **Finish the setup wizard** — one primary goal, a specific audience, 3–5 pillars, and a weekly cadence you can keep for 8 weeks.
2. **Capture ideas freely**, then only promote the strong ones into briefs.
3. **Write the brief before the draft** — use the readiness checklist; aim for ~80% before marking Ready.
4. **Balance the funnel** — the dashboard warns when you’re all TOFU fluff or all hard-sell BOFU.
5. **Schedule to your cadence**, not your ambition.
6. **Log results 7–14 days after publish** — Cadence ranks what worked against your goal so you know what to double down on.

## Project structure

```
main.js                 Electron main process
preload.js              Secure bridge (reserved for future native features)
src/
  index.html            App shell
  styles.css            Design system
  app.js                Router / app controller
  storage.js            localStorage data layer
  frameworks.js         Goals, funnel mix, checklist, pillar packs
  stats.js              Dashboard + calendar helpers
  components/
    onboarding.js       Guided setup for real results
    dashboard.js        Command center
    strategy.js         Goal, audience, pillars, cadence
    ideas.js            Idea bank → promote to brief
    briefs.js           Detailed briefs + readiness score
    calendar.js         Month calendar (double-click to schedule)
    pipeline.js         Kanban status board
    results.js          Performance logging + rankings
    settings.js         Export / import / reset
    modal.js            Shared modal helpers
```

## Run it

You need [Node.js](https://nodejs.org) (v18+).

```bash
npm install
npm start          # Electron desktop window
```

Or in the browser:

```bash
npm run serve      # http://localhost:5173
```

## Package as an installable app

```bash
npm run dist:mac
npm run dist:win
npm run dist:linux
```

Outputs land in `/release`. Add icons under `assets/` (`icon.icns`, `icon.ico`, `icon.png`) before shipping a branded build.

## Data

Everything persists to `localStorage` via `src/storage.js`. Export a JSON backup from **Settings** if the data matters. Swap `storage.js` later for a real API without rewriting the UI.
