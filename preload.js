const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
    quitApp: () => ipcRenderer.send('app:quit'),
    openHelp: () => ipcRenderer.send('app:openHelp'),
    openHelpData: () => ipcRenderer.send('app:openHelpData')
})
