const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
    quitApp: () => ipcRenderer.send('app:quit')
})
