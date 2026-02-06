const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

const Keytar = require('keytar')
const SftpClient = require('ssh2-sftp-client')
const fs = require('fs').promises
const { Client: SSHClient } = require('ssh2')

const sshSessions = new Map()

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


ipcMain.handle('credentials-store', async (event, { service, account, password }) => {
    try {
        await Keytar.setPassword(service, account, password)
        return { ok: true }
    } catch (err) {
        return { ok: false, error: err?.message || String(err) }
    }
})

ipcMain.handle('credentials-get', async (event, { service, account }) => {
    try {
        const pw = await Keytar.getPassword(service, account)
        return { ok: true, password: pw }
    } catch (err) {
        return { ok: false, error: err?.message || String(err) }
    }
})

ipcMain.handle('credentials-delete', async (event, { service, account }) => {
    try {
        const res = await Keytar.deletePassword(service, account)
        return { ok: true, deleted: res }
    } catch (err) {
        return { ok: false, error: err?.message || String(err) }
    }
})

ipcMain.handle('sftp-list', async (event, { connection, path: remotePath = '/' }) => {
    const sftp = new SftpClient()
    const { host, port = 22, username, password, privateKey } = connection || {}

    try {
        let auth = {}
        if (password) auth.password = password
        else {
            try {
                const stored = await Keytar.getPassword('novacode-ssh', `${username}@${host}:${port}`)
                if (stored) auth.password = stored
            } catch (e) {
            }
        }

        if (privateKey) auth.privateKey = privateKey
        else {
            try {
                const storedKey = await Keytar.getPassword('novacode-ssh-key', `${username}@${host}:${port}`)
                if (storedKey) auth.privateKey = storedKey
            } catch (e) {
            }
        }

        await sftp.connect({ host, port, username, ...auth })
        const list = await sftp.list(remotePath)
        await sftp.end()
        return { ok: true, list }
    } catch (err) {
        try { await sftp.end() } catch (e) { }
        return { ok: false, error: err?.message || String(err) }
    }
})

ipcMain.handle('read-file', async (event, { path: filePath }) => {
    try {
        const content = await fs.readFile(filePath, { encoding: 'utf8' })
        return { ok: true, content }
    } catch (err) {
        return { ok: false, error: err?.message || String(err) }
    }
})

ipcMain.handle('sftp-get', async (event, { connection, path: remotePath }) => {
    const sftp = new SftpClient()
    const { host, port = 22, username, password, privateKey } = connection || {}
    try {
        let auth = {}
        if (password) auth.password = password
        else {
            try {
                const stored = await Keytar.getPassword('novacode-ssh', `${username}@${host}:${port}`)
                if (stored) auth.password = stored
            } catch (e) { }
        }
        if (privateKey) auth.privateKey = privateKey
        else {
            try {
                const storedKey = await Keytar.getPassword('novacode-ssh-key', `${username}@${host}:${port}`)
                if (storedKey) auth.privateKey = storedKey
            } catch (e) { }
        }

        await sftp.connect({ host, port, username, ...auth })
        const data = await sftp.get(remotePath)
        await sftp.end()
        let content = null
        if (Buffer.isBuffer(data)) content = data.toString('utf8')
        else if (typeof data === 'string') content = data
        else content = null
        return { ok: true, content }
    } catch (err) {
        try { await sftp.end() } catch (e) { }
        return { ok: false, error: err?.message || String(err) }
    }
})

ipcMain.handle('ssh-start', async (event, { terminalId, connection }) => {
    const webContents = event.sender
    const { host, port = 22, username, password, privateKey } = connection || {}
    const connOpts = { host, port, username }
    if (password) connOpts.password = password
    else {
        try {
            const stored = await Keytar.getPassword('novacode-ssh', `${username}@${host}:${port}`)
            if (stored) connOpts.password = stored
        } catch (e) { }
    }
    if (privateKey) connOpts.privateKey = privateKey
    else {
        try {
            const storedKey = await Keytar.getPassword('novacode-ssh-key', `${username}@${host}:${port}`)
            if (storedKey) connOpts.privateKey = storedKey
        } catch (e) { }
    }

    const conn = new SSHClient()
    try {
        conn.on('ready', () => {
            conn.shell((err, stream) => {
                if (err) {
                    webContents.send('ssh-data', { terminalId, data: `Shell error: ${err.message}\n` })
                    return
                }
                stream.on('data', (chunk) => {
                    webContents.send('ssh-data', { terminalId, data: chunk.toString('utf8') })
                })
                stream.on('close', () => {
                    webContents.send('ssh-exit', { terminalId })
                    try { conn.end() } catch (e) { }
                })

                sshSessions.set(terminalId, { client: conn, stream })
                webContents.send('ssh-data', { terminalId, data: `Shell ready\n` })
            })
        })

        conn.on('error', (err) => {
            webContents.send('ssh-data', { terminalId, data: `Connection error: ${err.message}\n` })
        })

        conn.connect(connOpts)
        return { ok: true }
    } catch (err) {
        try { conn.end() } catch (e) { }
        return { ok: false, error: err?.message || String(err) }
    }
})

ipcMain.handle('ssh-send', async (event, { terminalId, data }) => {
    const sess = sshSessions.get(terminalId)
    if (!sess || !sess.stream) return { ok: false, error: 'No session' }
    try {
        sess.stream.write(data)
        return { ok: true }
    } catch (err) {
        return { ok: false, error: err?.message || String(err) }
    }
})

ipcMain.handle('ssh-stop', async (event, { terminalId }) => {
    const sess = sshSessions.get(terminalId)
    if (sess) {
        try { sess.stream.end(); sess.client.end(); } catch (e) { }
        sshSessions.delete(terminalId)
    }
    return { ok: true }
})
