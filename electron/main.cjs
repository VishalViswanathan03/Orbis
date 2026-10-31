const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const { createStreamServer, probeMediaFile } = require('./streamServer.cjs');

let mainWindow;
let streamServerPort = null;
let streamServerBinary = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 780,
    minWidth: 920,
    minHeight: 600,
    backgroundColor: '#090B0F',
    title: 'Orbis — Universal Media Player',
    roundedCorners: true,
    autoHideMenuBar: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  Menu.setApplicationMenu(null);

  // Load Vite dev server if running, fallback to dist/index.html
  mainWindow.loadURL('http://localhost:5173').catch(() => {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Universal Stream & Probe IPC Handlers
ipcMain.handle('media:getUrl', async (_event, filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  if (!streamServerPort) {
    return `file://${filePath}`;
  }
  return `http://127.0.0.1:${streamServerPort}/stream?file=${encodeURIComponent(filePath)}`;
});

ipcMain.handle('media:probe', async (_event, filePath) => {
  if (!filePath) return null;
  return await probeMediaFile(filePath, streamServerBinary);
});

// IPC Handlers for Native Dialogs
ipcMain.handle('dialog:openFile', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'All Media Files',
        extensions: [
          'mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'vob', 'mpg', 'mpeg', 'ts', 'm2ts', 'rmvb', '3gp', 'ogv',
          'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'ac3', 'dts', 'opus', 'ape'
        ]
      },
      {
        name: 'Video Files',
        extensions: ['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv', 'vob', 'mpg', 'mpeg', 'ts', 'm2ts', 'rmvb', '3gp', 'ogv']
      },
      {
        name: 'Audio Files',
        extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'ac3', 'dts', 'opus', 'ape']
      },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled || !result.filePaths.length) return null;

  const probedItems = [];
  for (const filePath of result.filePaths) {
    const meta = await probeMediaFile(filePath, streamServerBinary);
    const streamUrl = streamServerPort
      ? `http://127.0.0.1:${streamServerPort}/stream?file=${encodeURIComponent(filePath)}`
      : `file://${filePath}`;

    probedItems.push({
      filePath,
      streamUrl,
      meta
    });
  }

  return probedItems;
});

ipcMain.handle('dialog:openFolder', async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result;
});

ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('window:close', () => {
  mainWindow?.close();
});

app.whenReady().then(async () => {
  try {
    const { port, binary } = await createStreamServer(app.isPackaged, process.resourcesPath);
    streamServerPort = port;
    streamServerBinary = binary;
    console.log(`Orbis Universal Media Engine running on port ${port}`);
  } catch (err) {
    console.warn('Universal Media Engine failed to bind port:', err);
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
