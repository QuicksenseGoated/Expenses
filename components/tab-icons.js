/** Tab bar SVG icons — crisp at any scale. */
const svg = (body, viewBox = '0 0 24 24') =>
  `<svg class="tab-icon" viewBox="${viewBox}" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

export const TAB_ICONS = {
  home: svg(`
    <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"/>
  `),
  bills: svg(`
    <rect x="3" y="5" width="18" height="14" rx="2"/>
    <path d="M3 10h18M7 15h4"/>
  `),
  plan: svg(`
    <path d="M12 20V10"/>
    <path d="M18 20V4"/>
    <path d="M6 20v-6"/>
  `),
  profile: svg(`
    <circle cx="12" cy="8" r="4"/>
    <path d="M5 20c0-3.87 3.13-7 7-7s7 3.13 7 7"/>
  `),
  activity: svg(`
    <path d="M7 17 10 10l4 3 3-7"/>
    <path d="M4 20h16"/>
  `),
};
