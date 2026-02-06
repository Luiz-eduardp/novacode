
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SSHSession, SSHStatus, RemoteFileNode } from '../../types';
import { MOCK_REMOTE_FILES } from '../../constants';

declare global {
  interface Window {
    __electron__?: any;
  }
}

interface SSHManagerProps {
  sessions: SSHSession[];
  onConnect: (id: string) => void;
  onAdd: (session: SSHSession) => void;
  onUpdate: (session: SSHSession) => void;
  onOpenRemoteFile: (name: string, content: string, language?: string) => void;
}

export const SSHManager: React.FC<SSHManagerProps> = ({ sessions, onConnect, onAdd, onUpdate, onOpenRemoteFile }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [remotePath, setRemotePath] = useState<string[]>(['/']);
  const [remoteFiles, setRemoteFiles] = useState<RemoteFileNode[]>(MOCK_REMOTE_FILES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', host: '', user: '', port: '22', password: '', auth: 'password' });
  const [privateKeyFile, setPrivateKeyFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleSessionClick = (id: string) => {
    onConnect(id);
    setActiveSessionId(id);
    const session = sessions.find(s => s.id === id);
    if (session && window.__electron__?.sftp?.list) {
      const conn = { host: session.host, username: session.user, port: session['port'] || 22 };
      setRemotePath(['/'])
      setRemoteFiles([])
      window.__electron__.sftp.list(conn, '/').then((res: any) => {
        if (res?.ok && Array.isArray(res.list)) {
          const files = res.list.map((f: any) => ({
            name: f.name,
            type: f.type === 'd' ? 'folder' : 'file',
            size: f.size?.toString?.() || '--',
            permissions: f.permissions || ''
          }))
          setRemoteFiles(files)
        } else {
          console.warn('SFTP list failed', res?.error)
        }
      }).catch((e: any) => console.warn('SFTP list error', e))
    }
  };

  const listPath = async (session: SSHSession, pathToList: string) => {
    if (!window.__electron__?.sftp?.list) return
    const conn = { host: session.host, username: session.user, port: session['port'] || 22 }
    try {
      const res = await window.__electron__.sftp.list(conn, pathToList)
      if (res?.ok && Array.isArray(res.list)) {
        setRemoteFiles(res.list.map((f: any) => ({ name: f.name, type: f.type === 'd' ? 'folder' : 'file', size: f.size?.toString?.() || '--', permissions: f.permissions || '' })))
        setRemotePath(prev => {
          const parts = pathToList.split('/').filter(Boolean)
          return ['/', ...parts.map(p => p)]
        })
      }
    } catch (e) { console.warn('listPath error', e) }
  }

  const handleEntryClick = async (entry: RemoteFileNode) => {
    if (!activeSession) return
    const session = activeSession
    const current = remotePath.join('/') === '/' ? '/' : remotePath.slice(1).join('/')
    const base = current === '' ? '/' : `/${current}`
    const target = base === '/' ? `${base}${entry.name}` : `${base}/${entry.name}`
    if (entry.type === 'folder') {
      await listPath(session, target)
    } else {
      try {
        const conn = { host: session.host, username: session.user, port: session['port'] || 22 }
        const res = await window.__electron__.sftp.get(conn, target)
        if (res?.ok && typeof res.content === 'string') {
          const name = entry.name
          const ext = name.split('.').pop() || 'txt'
          onOpenRemoteFile && onOpenRemoteFile(name, res.content, ext)
        } else {
          console.warn('sftp get failed', res?.error)
        }
      } catch (e) { console.warn('sftp get error', e) }
    }
  }

  const openAdd = () => {
    setForm({ name: '', host: '', user: '', port: '22', password: '', auth: 'password' });
    setPrivateKeyFile(null);
    setShowAddModal(true);
  };

  const openEdit = (session: SSHSession) => {
    setEditingId(session.id);
    setForm({ name: session.name || '', host: session.host || '', user: session.user || '', port: String(session.port || 22), password: '', auth: 'password' });
    setPrivateKeyFile(null);
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingId || Date.now().toString();
    const session: SSHSession = {
      id,
      name: form.name || `${form.user}@${form.host}`,
      host: form.host,
      user: form.user,
      port: Number(form.port) || 22,
      status: 'disconnected'
    };

    const account = `${form.user}@${form.host}:${session.port}`;
    try {
      if (form.auth === 'password' && form.password) {
        await window.__electron__?.credentials?.store('novacode-ssh', account, form.password);
      }
      if (form.auth === 'key' && privateKeyFile) {
        const text = await privateKeyFile.text();
        await window.__electron__?.credentials?.store('novacode-ssh-key', account, text);
      }
    } catch (err) {
      console.warn('credential store error', err);
    }

    if (editingId) {
      onUpdate(session);
    } else {
      onAdd(session);
    }
    setShowAddModal(false);
    setEditingId(null);
  };

  const handleKeyFileChange = (f?: File | null) => {
    setPrivateKeyFile(f || null);
  };

  const parseSSHConfig = async (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    const data: any = {}
    for (const l of lines) {
      const m = l.match(/^(Host)\s+(.*)$/i)
      const m2 = l.match(/^(HostName)\s+(.*)$/i)
      const m3 = l.match(/^(User)\s+(.*)$/i)
      const m4 = l.match(/^(Port)\s+(.*)$/i)
      const m5 = l.match(/^(IdentityFile)\s+(.*)$/i)
      if (m) data.name = m[2]
      if (m2) data.host = m2[2]
      if (m3) data.user = m3[2]
      if (m4) data.port = m4[2]
      if (m5) data.identity = m5[2].replace(/"/g, '')
    }
    if (data) {
      setForm(prev => ({ ...prev, name: data.name || prev.name, host: data.host || prev.host, user: data.user || prev.user, port: data.port || prev.port }))
      if (data.identity) {
        try {
          const res = await window.__electron__?.file?.read(data.identity)
          if (res?.ok && res.content) {
            setForm(prev => ({ ...prev, auth: 'key' }))
            const account = `${data.user}@${data.host}:${data.port || '22'}`
            await window.__electron__?.credentials?.store('novacode-ssh-key', account, res.content)
          } else {
            console.warn('read key failed', res?.error)
          }
        } catch (e) { console.warn('read key error', e) }
      }
    }
  }

  const handlePasteConfig = async () => {
    try {
      const txt = await navigator.clipboard.readText()
      if (txt) await parseSSHConfig(txt)
    } catch (e) { console.warn('paste config error', e) }
  }

  const SSHAddModal: React.FC<any> = ({ onClose, onSubmit, form, setForm, privateKeyFile, onKeyFileChange }) => {
    const [el] = useState(() => document.createElement('div'));

    useEffect(() => {
      el.className = 'nova-modal-root';
      document.body.appendChild(el);
      return () => { try { document.body.removeChild(el) } catch (e) { } };
    }, [el]);

    const content = (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
        <form onSubmit={onSubmit} className="relative bg-slate-900 p-4 rounded-lg w-[420px] z-10">
          <h3 className="text-sm font-bold mb-2">Nova Conexão SSH</h3>
          <div className="grid gap-2">
            <input required placeholder="Nome (opcional)" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="p-2 bg-slate-800 rounded" />
            <input required placeholder="Host" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} className="p-2 bg-slate-800 rounded" />
            <div className="flex gap-2">
              <input required placeholder="Usuário" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} className="p-2 bg-slate-800 rounded flex-1" />
              <input placeholder="Porta" value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} className="p-2 bg-slate-800 rounded w-24" />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2"><input type="radio" name="auth" checked={form.auth === 'password'} onChange={() => setForm({ ...form, auth: 'password' })} /> Senha</label>
              <label className="flex items-center gap-2"><input type="radio" name="auth" checked={form.auth === 'key'} onChange={() => setForm({ ...form, auth: 'key' })} /> Chave SSH</label>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handlePasteConfig} className="text-xs px-2 py-1 rounded bg-white/5">Colar config SSH</button>
              <span className="text-xs text-slate-500 self-center">ou faça upload da chave</span>
            </div>
            {form.auth === 'password' ? (
              <input type="password" placeholder="Senha" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="p-2 bg-slate-800 rounded" />
            ) : (
              <div className="flex items-center gap-2">
                <input type="file" accept="*" onChange={ev => onKeyFileChange(ev.target.files ? ev.target.files[0] : undefined)} className="text-xs" />
                {privateKeyFile && <span className="text-xs text-slate-400 truncate">{privateKeyFile.name}</span>}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={onClose} className="px-3 py-1 rounded bg-transparent border">Cancelar</button>
              <button type="submit" className="px-3 py-1 rounded bg-sky-600 text-white">Adicionar</button>
            </div>
          </div>
        </form>
      </div>
    );

    return ReactDOM.createPortal(content, el);
  };

  const getStatusColor = (status: SSHStatus) => {
    switch (status) {
      case 'connected': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'connecting': return 'bg-amber-500 animate-pulse';
      case 'error': return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
      default: return 'bg-slate-500';
    }
  };

  const getStatusLabel = (status: SSHStatus) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'connecting': return 'Conectando...';
      case 'error': return 'Falhou';
      default: return 'Desconectado';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-slate-900/40 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Acesso Remoto (SSH)</h2>
          <button
            onClick={openAdd}
            className="p-1 hover:bg-white/10 rounded text-sky-500 transition-colors"
            title="Adicionar Nova Conexão"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => handleSessionClick(session.id)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all group ${activeSessionId === session.id
                ? 'bg-sky-500/10 border-sky-500/40'
                : 'bg-slate-800/40 border-transparent hover:border-slate-700'
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold ${activeSessionId === session.id ? 'text-sky-400' : 'text-slate-300'}`}>
                  {session.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-medium">{getStatusLabel(session.status)}</span>
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`}></span>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(session); }} title="Editar" className="p-1 rounded hover:bg-white/5">
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M15.232 5.232l3.536 3.536M4 13.5V20h6.5L20.07 10.43a1.5 1.5 0 000-2.12L17.65 5.89" /></svg>
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">{session.user}@{session.host}</div>

              {session.status === 'error' && session.error && (
                <div className="mt-2 text-[9px] text-rose-400 bg-rose-950/30 p-1.5 rounded border border-rose-900/30 flex items-start gap-1.5 animate-in fade-in slide-in-from-top-1">
                  <svg className="w-3 h-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {session.error}
                </div>
              )}
            </div>
          ))}
        </div>
        {showAddModal && (
          <SSHAddModal onClose={() => setShowAddModal(false)} onSubmit={handleAddSubmit} form={form} setForm={setForm} privateKeyFile={privateKeyFile} onKeyFileChange={handleKeyFileChange} />
        )}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {activeSession?.status === 'connected' ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-2 bg-slate-900/60 border-b border-white/5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <svg className="w-3 h-3 text-sky-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                <div className="flex items-center text-[10px] font-mono text-slate-400 truncate">
                  {remotePath.map((p, i) => (
                    <React.Fragment key={i}>
                      <span onClick={() => {
                        const session = activeSession
                        if (!session) return
                        if (i === 0) listPath(session, '/')
                        else {
                          const parts = remotePath.slice(1, i + 1)
                          listPath(session, '/' + parts.join('/'))
                        }
                      }} className="hover:text-sky-400 cursor-pointer">{p}</span>
                      {i < remotePath.length - 1 && <span className="mx-0.5 opacity-30">/</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <button className="p-1 hover:bg-white/10 rounded transition-colors" title="Atualizar SFTP">
                <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 ssh-files-scroll">
              <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-3 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-tighter sticky top-0 bg-slate-900/60 z-10">
                <span>Nome</span>
                <span>Tam.</span>
                <span className="text-right">Perms</span>
              </div>
              {(remoteFiles || MOCK_REMOTE_FILES).map((file, i) => (
                <div
                  key={i}
                  onClick={() => handleEntryClick(file)}
                  className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-3 py-1.5 rounded hover:bg-white/5 cursor-pointer text-slate-400 group transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {file.type === 'folder' ? (
                      <svg className="w-4 h-4 text-sky-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    )}
                    <span className="text-xs truncate group-hover:text-slate-200">{file.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 w-12">{file.size || '--'}</span>
                  <span className="text-[10px] font-mono text-slate-600 w-16 text-right">{file.permissions}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
            <svg className="w-12 h-12 mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-sm font-medium text-slate-500 mb-1">Sem Sessão SFTP Ativa</p>
            <p className="text-xs text-slate-600">Conecte-se a um servidor para navegar pelos arquivos remotos e gerenciar sua infraestrutura.</p>
          </div>
        )}
      </div>

    </div>
  );
};
