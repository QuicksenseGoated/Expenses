import { Storage } from '../storage.js';
import { PROFILE } from '../profile.js';
import { escapeHtml } from './modal.js';

export function renderScoreboard(root, ctx) {
  const s = Storage.getScoreboard();

  root.innerHTML = `
    <section class="view scoreboard-view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Scoreboard</p>
          <h1>Are we growing?</h1>
          <p class="sub">Primary: <strong>Twitch avg viewers</strong>. Secondary: <strong>TikTok views</strong>. Everything else is vanity unless it feeds those.</p>
        </div>
      </header>

      <form class="panel form-stack" id="score-form">
        <div class="form-row">
          <label class="field"><span>Twitch avg viewers</span><input type="number" min="0" name="twitchAvgViewers" value="${s.twitchAvgViewers ?? ''}" placeholder="e.g. 12" /></label>
          <label class="field"><span>Twitch followers</span><input type="number" min="0" name="twitchFollowers" value="${s.twitchFollowers ?? ''}" /></label>
        </div>
        <div class="form-row">
          <label class="field"><span>TikTok views (this week)</span><input type="number" min="0" name="tiktokViewsWeek" value="${s.tiktokViewsWeek ?? ''}" /></label>
          <label class="field"><span>TikTok followers</span><input type="number" min="0" name="tiktokFollowers" value="${s.tiktokFollowers ?? ''}" /></label>
        </div>
        <div class="form-row">
          <label class="field"><span>YouTube subs</span><input type="number" min="0" name="youtubeSubs" value="${s.youtubeSubs ?? ''}" /></label>
          <label class="field"><span>Snapshot note</span><input name="note" placeholder="Good raid week / clips hit / dead week" /></label>
        </div>
        <div class="header-actions">
          <button type="submit" class="btn primary">Save + snapshot</button>
        </div>
      </form>

      <div class="dash-metrics" style="margin-top:1rem">
        <article class="metric"><span>Twitch avg</span><strong>${fmt(s.twitchAvgViewers)}</strong><p>Live product</p></article>
        <article class="metric"><span>TikTok week</span><strong>${fmt(s.tiktokViewsWeek)}</strong><p>Top of funnel</p></article>
        <article class="metric"><span>Twitch fol.</span><strong>${fmt(s.twitchFollowers)}</strong><p>${escapeHtml(PROFILE.handles.twitch)}</p></article>
        <article class="metric"><span>TikTok fol.</span><strong>${fmt(s.tiktokFollowers)}</strong><p>@${escapeHtml(PROFILE.handles.tiktok)}</p></article>
      </div>

      <section class="panel" style="margin-top:1rem">
        <div class="panel-head"><h2>History</h2></div>
        <ul class="piece-list">
          ${(s.history || []).map((h) => `
            <li class="piece-row static">
              <div>
                <strong>${escapeHtml(h.date)}</strong>
                <span>Avg ${fmt(h.twitchAvgViewers)} · TT views ${fmt(h.tiktokViewsWeek)} · Fol ${fmt(h.twitchFollowers)}
                  ${h.note ? ` — ${escapeHtml(h.note)}` : ''}</span>
              </div>
            </li>
          `).join('') || `<li class="empty-inline">No snapshots yet. Log weekly so we can see what’s working.</li>`}
        </ul>
      </section>
    </section>
  `;

  root.querySelector('#score-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const num = (k) => {
      const v = fd.get(k);
      return v === '' || v == null ? null : Number(v);
    };
    Storage.saveScoreboard({
      twitchAvgViewers: num('twitchAvgViewers'),
      twitchFollowers: num('twitchFollowers'),
      tiktokViewsWeek: num('tiktokViewsWeek'),
      tiktokFollowers: num('tiktokFollowers'),
      youtubeSubs: num('youtubeSubs')
    });
    Storage.logScoreboardSnapshot(String(fd.get('note') || '').trim());
    ctx.toast('Scoreboard updated');
    ctx.refresh();
  });
}

function fmt(n) {
  if (n == null || n === '') return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
