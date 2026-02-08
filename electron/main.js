const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const { execSync, exec } = require('child_process')
const fs = require('fs')
const os = require('os')

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

ipcMain.handle('fs-list', async (event, { path: dirPath }) => {
    try {
        const files = fs.readdirSync(dirPath, { withFileTypes: true });
        return files.map(file => ({
            name: file.name,
            path: path.join(dirPath, file.name),
            type: file.isDirectory() ? 'folder' : 'file',
            size: !file.isDirectory() ? fs.statSync(path.join(dirPath, file.name)).size : undefined,
            modified: fs.statSync(path.join(dirPath, file.name)).mtime.getTime()
        }));
    } catch (error) {
        console.error('Erro ao listar diretório:', error);
        return [];
    }
});

ipcMain.handle('fs-read', async (event, { path: filePath }) => {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        console.error('Erro ao ler arquivo:', error);
        return '';
    }
});

ipcMain.handle('fs-write', async (event, { path: filePath, content }) => {
    try {
        fs.writeFileSync(filePath, content, 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Erro ao escrever arquivo:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('fs-create-file', async (event, { path: filePath }) => {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, '', 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Erro ao criar arquivo:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('fs-create-folder', async (event, { path: folderPath }) => {
    try {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        return { success: true };
    } catch (error) {
        console.error('Erro ao criar pasta:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('fs-delete', async (event, { path: targetPath }) => {
    try {
        const stat = fs.statSync(targetPath);
        if (stat.isDirectory()) {
            fs.rmSync(targetPath, { recursive: true, force: true });
        } else {
            fs.unlinkSync(targetPath);
        }
        return { success: true };
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('fs-get-home-dir', async (event) => {
    try {
        return os.homedir();
    } catch (error) {
        console.error('Erro ao obter diretório home:', error);
        return '';
    }
});

ipcMain.handle('fs-get-docs-dir', async (event) => {
    try {
        return path.join(os.homedir(), 'Documents');
    } catch (error) {
        console.error('Erro ao obter diretório de documentos:', error);
        return '';
    }
});
