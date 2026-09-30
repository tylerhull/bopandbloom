// Preload: exposes a tiny, safe pack-management API to the renderer.
//
// The renderer stays sandboxed (no Node). Everything here goes through
// ipcRenderer.invoke to the main process, which does the actual filesystem
// work. Only these three functions are reachable from page code.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bopPacks', {
  available: true,
  list: () => ipcRenderer.invoke('packs:list'),
  importPack: () => ipcRenderer.invoke('packs:import'),
  removePack: (id) => ipcRenderer.invoke('packs:remove', id)
});
