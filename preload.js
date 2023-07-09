const { contextBridge, ipcRenderer } = require('electron')
var { Chart } = require('chart.js/auto');
contextBridge.exposeInMainWorld('electronAPI', {
    readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
    createChart: (params, elementID) => {
        ctx = document.getElementById(elementID).getContext('2d');
        console.log(ctx)
        let newchart = new Chart(ctx, params);
    }
})
