const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  openFolderDialog: () => ipcRenderer.invoke('dialog:openFolder'),
  getMediaUrl: (filePath) => ipcRenderer.invoke('media:getUrl', filePath),
  probeMedia: (filePath) => ipcRenderer.invoke('media:probe', filePath),
  toggleFullscreen: () => ipcRenderer.invoke('window:toggleFullscreen'),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  maximize: () => ipcRenderer.invoke('window:maximize'),
  close: () => ipcRenderer.invoke('window:close'),
  onFileOpened: (callback) => ipcRenderer.on('file:opened', (_, file) => callback(file)),
  isDesktop: true
});
