const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
var csv = require('jquery-csv');
const fs = require('fs')
const papa = require("papaparse");

async function handleFileRead() {
    // Load dialog to select CSV/XLSX file
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            name: 'CSV data files', extensions: ['csv']
        }],
        title: 'Select CSV file to import',
        message: 'Select the CSV file to import'
    })
    // If user canceled file selection, return
    if (canceled) {
        return
    }
    const [filePath] = filePaths
    const data = fs.readFileSync(filePath, 'utf-8')
    return new Promise((resolve, reject) => {
        papa.parse(data, {
            header: true,
            worker: true,
            complete: function (results) {
                console.log('Complete', results.data.length, 'records.');
                resolve(results.data);
            }
        });
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
        }
    })

    win.loadFile('src/index.html')
}
app.whenReady().then(() => {
    ipcMain.handle('fs:readFile', handleFileRead)
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
