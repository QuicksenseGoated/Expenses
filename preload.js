const { contextBridge } = require('electron');

// Reserved bridge for future native features (real auth, file export, etc).
// The renderer currently uses window.localStorage directly via src/storage.js,
// which is intentionally structured so it can be swapped for a real
// database/auth-backed API later without touching the UI code.
contextBridge.exposeInMainWorld('ledgerNative', {
  platform: process.platform,
  version: process.versions.electron
});
