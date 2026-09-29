// Electron shell for Bop & Bloom.
//
// The whole game is a self-contained static web app under ../app that already
// runs from a file:// URL, so this just opens a window on app/index.html. There
// is no build step and no server. Chromium is bundled by Electron, so the same
// engine runs on Windows, Mac, and Linux — unlike the GTK/WebKitGTK launcher.py
// path (kept in parallel for now), we don't have to worry about per-platform
// webview differences here.
//
// Saved data (player profiles, settings) lives in localStorage, which Electron
// persists per-app under the OS user-data directory — see app/js/05-state.js,
// whose save() falls back to localStorage when the GTK `window.webkit` bridge
// is absent (it always is here).

const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

const APP_INDEX = path.join(__dirname, '..', 'app', 'index.html');

function createWindow() {
  const win = new BrowserWindow({
    width: 1120,
    height: 850,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#faf7ef',
    title: 'Bop & Bloom',
    autoHideMenuBar: true,
    webPreferences: {
      // The app needs no Node access; keep the renderer locked down.
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  win.loadFile(APP_INDEX);

  // Open any external links (should be none) in the real browser, never in-app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}

// No application menu — this is a kiosk-style kids' app. (autoHideMenuBar also
// hides it on Windows/Linux; this removes it entirely.)
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
