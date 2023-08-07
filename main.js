/*
 * Created Date: Saturday, June 17th 2023, 1:19:36 am
 * Author: Jago Gardiner
 */

// Requirements for the app.
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const papa = require("papaparse");
var win;

function handleHelpData() {
    // get current window
    if (win) {
        win.close();
    }
    // Open help data file
    const helpPath = path.join(__dirname, 'src/help-data.html')
    const helpWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
        },
        icon: path.join(__dirname, 'img/nhs-sq.png')
    })
    helpWindow.loadFile(helpPath)
    return
}
async function handleFileRead() {
    // Load dialog to select CSV file
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{
            name: 'CSV data files', extensions: ['csv']
        }],
        title: 'Select CSV file to import',
        message: 'Select the CSV file to import'
    })
    // If user canceled file selection, return and quit window, then display file help browser.
    if (canceled) {
        app.quit();
        return;
    }
    // Read file
    const [filePath] = filePaths
    const data = fs.readFileSync(filePath, 'utf-8')
    // Parse CSV data
    return new Promise((resolve, reject) => {
        papa.parse(data, {
            header: true,
            worker: true,
            // step: function (results, parser) {
            complete: function (results) {
                console.log('Completed', results.data.length, 'records.');
                resolve(results.data);
            },
            // err
            error: function (err, file, inputElem, reason) {
                console.log(err);
                reject(err);
            }
        });
    });
}

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
        },
        icon: path.join(__dirname, 'img/nhs-sq.png')
    })
    // Load index.html, main page
    win.loadFile('src/index.html')
}
app.whenReady().then(() => {
    // Register handler for file read
    ipcMain.handle('fs:readFile', handleFileRead)
    // Register handler for app quit
    ipcMain.on('app:quit', () => {
        app.quit()
    })
    // Register handler for app help
    ipcMain.on('app:openHelp', () => {
        // Open help file
        const helpPath = path.join(__dirname, 'src/help.html')
        const helpWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: true,
                contextIsolation: true,
                enableRemoteModule: true,
            },
            icon: path.join(__dirname, 'img/nhs-sq.png')
        })
        helpWindow.loadFile(helpPath)
    })
    // Register handler for app data help
    ipcMain.on('app:openHelpData', () => {
        handleHelpData();
    })

    // Create window
    createWindow()
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    // On macOS it's common for applications and their menu bar to stay active
    // until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
