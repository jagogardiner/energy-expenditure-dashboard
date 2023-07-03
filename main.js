const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const { parse } = require('csv-parse');
const fs = require('fs')

async function handleFileRead() {
    // Load dialog to select CSV file
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            name: 'CSV data files', extensions: ['csv']
        }]
    })
    // If user canceled file selection, return
    if (canceled) {
        return
    }

    const [filePath] = filePaths
    // Read file sync with CSV as parameter
    const data = fs.readFileSync(filePath, 'utf-8')
    // Parse CSV file to JS object
    const parsedData = await new Promise((resolve, reject) => {
        parse(data, { columns: true }, (err, records) => {
            if (err) {
                reject(err)
            } else {
                resolve(records)
            }
        })
    }
    )
    return parsedData
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
