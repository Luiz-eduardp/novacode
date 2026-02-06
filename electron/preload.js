

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('__electron__', {
    env: process.env.NODE_ENV || 'production',
    credentials: {
        store: (service, account, password) => ipcRenderer.invoke('credentials-store', { service, account, password }),
        get: (service, account) => ipcRenderer.invoke('credentials-get', { service, account }),
        delete: (service, account) => ipcRenderer.invoke('credentials-delete', { service, account })
    },
    sftp: {
        list: (connection, remotePath) => ipcRenderer.invoke('sftp-list', { connection, path: remotePath })
        ,
        get: (connection, remotePath) => ipcRenderer.invoke('sftp-get', { connection, path: remotePath })
    }
    ,
    file: {
        read: (filePath) => ipcRenderer.invoke('read-file', { path: filePath })
    }
})

contextBridge.exposeInMainWorld('__electron_ssh__', {
    start: (terminalId, connection) => ipcRenderer.invoke('ssh-start', { terminalId, connection }),
    send: (terminalId, data) => ipcRenderer.invoke('ssh-send', { terminalId, data }),
    stop: (terminalId) => ipcRenderer.invoke('ssh-stop', { terminalId }),
    onData: (cb) => ipcRenderer.on('ssh-data', (e, payload) => cb(payload)),
    onExit: (cb) => ipcRenderer.on('ssh-exit', (e, payload) => cb(payload))
})

contextBridge.exposeInMainWorld('__electron_terminal__', {
    execute: (command, cwd) => ipcRenderer.invoke('terminal-execute', { command, cwd }),
    executeStream: (command, cwd) => ipcRenderer.invoke('terminal-execute-stream', { command, cwd })
})
