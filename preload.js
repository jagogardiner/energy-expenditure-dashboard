const { contextBridge, ipcRenderer } = require('electron')
var { Chart } = require('chart.js/auto');
var chartObject;

contextBridge.exposeInMainWorld('electronAPI', {
    readFile: (filePath) => ipcRenderer.invoke('fs:readFile', filePath),
    createChart: (params, elementID) => {
        ctx = document.getElementById(elementID).getContext('2d');
        console.log(ctx)
        chartObject = new Chart(ctx, params);
    },
    destroyChart: () => {
        chartObject.destroy();
    },
    updateChart: (params) => {
        chartObject.data = params.data;
        chartObject.update();
    },
    getChartObject: () => {
        return chartObject;
    }
})
