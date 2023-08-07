/*
 * Created Date: Sunday, June 18th 2023, 6:48:51 pm
 * Author: Jago Gardiner
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
    quitApp: () => ipcRenderer.send('app:quit'),
    openHelp: () => ipcRenderer.send('app:openHelp'),
    openHelpData: () => ipcRenderer.send('app:openHelpData')
})
