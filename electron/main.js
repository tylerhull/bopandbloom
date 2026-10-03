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

const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const APP_INDEX = path.join(__dirname, '..', 'app', 'index.html');

// ---- Auto-update ---------------------------------------------------------
// Uses electron-updater against the GitHub Releases feed configured in
// package.json `build.publish`. Updates replace only the app bundle — user
// data (profiles, settings, imported packs) lives in app.getPath('userData'),
// which is untouched by an update, so nothing is lost. Auto-update only runs in
// a packaged, (for macOS) signed build; in dev it's a no-op.
function initAutoUpdate(win) {
  if (!app.isPackaged) return;
  let autoUpdater;
  try { autoUpdater = require('electron-updater').autoUpdater; } catch (e) { return; }
  const send = (status, info) => { if (win && !win.isDestroyed()) win.webContents.send('update:status', { status: status, info: info || null }); };
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => send('checking'));
  autoUpdater.on('update-available', (info) => send('available', { version: info && info.version }));
  autoUpdater.on('update-not-available', () => send('none'));
  autoUpdater.on('error', (err) => send('error', { message: String((err && err.message) || err) }));
  autoUpdater.on('download-progress', (p) => send('downloading', { percent: Math.round(p.percent) }));
  autoUpdater.on('update-downloaded', (info) => send('ready', { version: info && info.version }));
  ipcMain.handle('update:install', () => { try { autoUpdater.quitAndInstall(); } catch (e) { /* ignore */ } return { ok: true }; });
  ipcMain.handle('update:check', () => { try { autoUpdater.checkForUpdates(); } catch (e) { /* ignore */ } return { ok: true }; });
  try { autoUpdater.checkForUpdates(); } catch (e) { /* ignore */ }
  setInterval(() => { try { autoUpdater.checkForUpdates(); } catch (e) { /* ignore */ } }, 6 * 60 * 60 * 1000);
}

// ---- Content packs -------------------------------------------------------
// Imported packs are single JSON files kept under <userData>/packs/. Each is a
// {id,name,blurb,tag,items:[{id,label,image,pt}]} where every image is a
// data: URI (so nothing outside the file needs to travel with it, and the
// renderer can show it under the app's strict CSP, which allows data: images).
// Imported items are images only — no inline SVG — so a downloaded pack can't
// smuggle markup into the page.
function packsDir() {
  const dir = path.join(app.getPath('userData'), 'packs');
  try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { /* ignore */ }
  return dir;
}

function validatePack(p) {
  if (!p || typeof p.id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,39}$/.test(p.id)) return false;
  if (typeof p.name !== 'string' || !p.name) return false;
  if (!Array.isArray(p.items) || !p.items.length || p.items.length > 500) return false;
  for (let i = 0; i < p.items.length; i++) {
    const it = p.items[i];
    if (!it || typeof it.label !== 'string' || !it.label) return false;
    if (typeof it.image !== 'string' || it.image.slice(0, 11) !== 'data:image/') return false;
  }
  return true;
}

function readPackFile(file) {
  try {
    const p = JSON.parse(fs.readFileSync(file, 'utf8'));
    return validatePack(p) ? p : null;
  } catch (e) { return null; }
}

function listPacks() {
  const dir = packsDir();
  let out = [];
  try {
    fs.readdirSync(dir).forEach((name) => {
      if (!/\.(json|bop)$/i.test(name)) return;
      const p = readPackFile(path.join(dir, name));
      if (p) out.push(p);
    });
  } catch (e) { /* ignore */ }
  return out;
}

ipcMain.handle('packs:list', () => listPacks());

ipcMain.handle('packs:import', async () => {
  const res = await dialog.showOpenDialog({
    title: 'Add a Bop & Bloom content pack',
    filters: [{ name: 'Bop & Bloom pack', extensions: ['bop', 'json'] }],
    properties: ['openFile']
  });
  if (res.canceled || !res.filePaths.length) return { ok: false };
  const pack = readPackFile(res.filePaths[0]);
  if (!pack) return { ok: false, error: 'That file is not a valid content pack.' };
  try {
    fs.writeFileSync(path.join(packsDir(), pack.id + '.json'), JSON.stringify(pack));
  } catch (e) {
    return { ok: false, error: 'Could not save the pack.' };
  }
  return { ok: true, pack: pack };
});

ipcMain.handle('packs:remove', (_e, id) => {
  if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,39}$/.test(id)) return { ok: false };
  try { fs.unlinkSync(path.join(packsDir(), id + '.json')); } catch (e) { /* already gone */ }
  return { ok: true };
});

// ---- Records export ------------------------------------------------------
// Save a text file (CSV/HTML) wherever the parent chooses. Defaults to the
// Documents folder; they can pick a Dropbox/Drive sync folder to reach the
// cloud without any backend.
ipcMain.handle('records:save', async (_e, opts) => {
  opts = opts || {};
  if (typeof opts.content !== 'string') return { ok: false, error: 'Nothing to save.' };
  const safeName = String(opts.name || 'bopandbloom-records.csv').replace(/[\/\\]/g, '_');
  let dir = app.getPath('documents');
  try { if (!fs.existsSync(dir)) dir = app.getPath('home'); } catch (e) { /* ignore */ }
  const res = await dialog.showSaveDialog({
    title: 'Save records',
    defaultPath: path.join(dir, safeName),
    filters: [{ name: 'Records', extensions: [(safeName.split('.').pop() || 'csv')] }]
  });
  if (res.canceled || !res.filePath) return { ok: false, canceled: true };
  try {
    fs.writeFileSync(res.filePath, opts.content, 'utf8');
  } catch (e) {
    return { ok: false, error: 'Could not write the file.' };
  }
  return { ok: true, path: res.filePath };
});

// Pick a folder for automatic record saving (e.g. a Dropbox/Drive sync folder).
ipcMain.handle('records:folder', async () => {
  const res = await dialog.showOpenDialog({
    title: 'Choose a folder to auto-save records (e.g. your Dropbox or Google Drive folder)',
    properties: ['openDirectory', 'createDirectory']
  });
  if (res.canceled || !res.filePaths.length) return { ok: false, canceled: true };
  return { ok: true, folder: res.filePaths[0] };
});

// Open a backup file and return its text (for "Restore from backup").
ipcMain.handle('records:openText', async () => {
  const res = await dialog.showOpenDialog({
    title: 'Restore from a Bop & Bloom backup',
    filters: [{ name: 'Bop & Bloom backup', extensions: ['json', 'bak'] }],
    properties: ['openFile']
  });
  if (res.canceled || !res.filePaths.length) return { ok: false, canceled: true };
  try {
    const content = fs.readFileSync(res.filePaths[0], 'utf8');
    if (content.length > 50 * 1024 * 1024) return { ok: false, error: 'That file is too large.' };
    return { ok: true, content: content };
  } catch (e) {
    return { ok: false, error: 'Could not read the file.' };
  }
});

// Append new record lines to a per-child CSV in the chosen folder, writing the
// header first if the file is new. Append-only so the file keeps full history.
ipcMain.handle('records:append', (_e, opts) => {
  opts = opts || {};
  if (typeof opts.folder !== 'string' || typeof opts.file !== 'string' || typeof opts.lines !== 'string') return { ok: false };
  const safeFile = opts.file.replace(/[\/\\]/g, '_');
  if (!/\.(csv|txt)$/i.test(safeFile)) return { ok: false };
  const target = path.join(opts.folder, safeFile);
  try {
    if (!fs.existsSync(opts.folder)) return { ok: false, error: 'Folder not found.' };
    let prefix = '';
    if (!fs.existsSync(target) && typeof opts.header === 'string') prefix = opts.header + '\n';
    fs.appendFileSync(target, prefix + opts.lines + '\n', 'utf8');
  } catch (e) {
    return { ok: false, error: 'Could not write records.' };
  }
  return { ok: true, path: target };
});

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
      // The app needs no Node access; keep the renderer locked down. The preload
      // exposes only a small pack-management API via contextBridge.
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  win.loadFile(APP_INDEX);
  initAutoUpdate(win);

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
