const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('cadenceNative', {
  platform: process.platform,
  version: process.versions.electron
});
