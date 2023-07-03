const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const { parse } = require('csv-parse');
const fs = require('fs')

async function handleFileRead() {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (canceled) {
        return
    }
    const [filePath] = filePaths
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
