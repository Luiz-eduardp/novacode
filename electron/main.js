const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const { execSync, exec } = require('child_process')

const isDev = process.env.NODE_ENV !== 'production'

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(process.cwd(), 'electron/preload.js'),
            contextIsolation: true
        }
    })

    if (isDev) {
        win.loadURL('http://localhost:3000')
        win.webContents.openDevTools()
    } else {
        const indexPath = path.join(process.cwd(), 'dist', 'index.html')
        win.loadURL(url.pathToFileURL(indexPath).toString())
    }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

ipcMain.handle('terminal-execute', async (event, { command, cwd }) => {
    return new Promise((resolve) => {
        try {
            const output = execSync(command, {
                cwd: cwd || process.cwd(),
                encoding: 'utf-8'
            }).toString();
            resolve({ success: true, output });
        } catch (error) {
            resolve({ success: false, output: error.message || String(error) });
        }
    });
});

ipcMain.handle('terminal-execute-stream', async (event, { command, cwd }) => {
    return new Promise((resolve) => {
        exec(command, { cwd: cwd || process.cwd() }, (error, stdout, stderr) => {
            if (error) {
                resolve({ success: false, output: stderr || error.message });
            } else {
                resolve({ success: true, output: stdout });
            }
        });
    });
});
