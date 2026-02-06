
import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Terminal } from './components/Terminal';
import FileEditor from './components/FileEditor';
import { AIChat } from './components/Sidebar/AIChat';
import { SQLValidator } from './components/Sidebar/SQLValidator';
import { SnippetManager } from './components/Sidebar/SnippetManager';
import { PluginManager } from './components/Sidebar/PluginManager';
import { Settings } from './components/Sidebar/Settings';
import { SSHManager } from './components/Sidebar/SSHManager';
import { CommandManager } from './components/Sidebar/CommandManager';
import { SidebarView, FileNode, Snippet, Plugin, ThemeConfig, SSHSession, TerminalSession, CustomCommand } from './types';
import { INITIAL_FILES, INITIAL_SSH_SESSIONS, INITIAL_SNIPPETS, INITIAL_PLUGINS, THEMES, INITIAL_CUSTOM_COMMANDS } from './constants';
import { formatCodeAI, simulateRemoteSSHCommand } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<SidebarView>(SidebarView.Explorer);
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('nova_theme');
    return saved ? JSON.parse(saved) : THEMES[0];
  });

  const [files, setFiles] = useState<FileNode[]>(() => {
    const saved = localStorage.getItem('nova_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [snippets, setSnippets] = useState<Snippet[]>(() => {
    const saved = localStorage.getItem('nova_snippets');
    return saved ? JSON.parse(saved) : INITIAL_SNIPPETS;
  });

  const [customCommands, setCustomCommands] = useState<CustomCommand[]>(() => {
    const saved = localStorage.getItem('nova_commands');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOM_COMMANDS;
  });

  const [terminals, setTerminals] = useState<TerminalSession[]>([
    { id: 't1', name: 'Terminal 1', lines: ['Bem-vindo ao NovaCode!', 'Digite "help" para ajuda.'], currentInput: '' }
  ]);
  const [activeTerminalId, setActiveTerminalId] = useState<string>('t1');

  const [plugins, setPlugins] = useState<Plugin[]>(INITIAL_PLUGINS);
  const [sshSessions, setSshSessions] = useState<SSHSession[]>(INITIAL_SSH_SESSIONS);

  const [activeFileId, setActiveFileId] = useState<string | null>('1-1');
  const [openFiles, setOpenFiles] = useState<string[]>(['1-1', '2']);
  const [isFormatting, setIsFormatting] = useState(false);

  useEffect(() => { localStorage.setItem('nova_files', JSON.stringify(files)); }, [files]);
  useEffect(() => { localStorage.setItem('nova_snippets', JSON.stringify(snippets)); }, [snippets]);
  useEffect(() => { localStorage.setItem('nova_commands', JSON.stringify(customCommands)); }, [customCommands]);
  useEffect(() => { localStorage.setItem('nova_theme', JSON.stringify(theme)); }, [theme]);

  const findFileById = (nodes: FileNode[], id: string): FileNode | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFileById(node.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const activeFile = useMemo(() => activeFileId ? findFileById(files, activeFileId) : null, [files, activeFileId]);
  const activeTerminal = useMemo(() => terminals.find(t => t.id === activeTerminalId) || terminals[0], [terminals, activeTerminalId]);

  const handleCreateFile = () => {
    const name = prompt("Digite o nome do arquivo:");
    if (!name) return;
    const newFile: FileNode = {
      id: Date.now().toString(),
      name,
      type: 'file',
      language: name.split('.').pop() || 'text',
      content: ''
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setOpenFiles(prev => [...prev, newFile.id]);
  };

  const handleDeleteFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Tem certeza que deseja excluir?")) return;
    setFiles(prev => prev.filter(f => f.id !== id));
    setOpenFiles(prev => prev.filter(fid => fid !== id));
    if (activeFileId === id) setActiveFileId(null);
  };

  const handleFormatCode = async () => {
    if (!activeFile || isFormatting) return;
    setIsFormatting(true);
    const formatted = await formatCodeAI(activeFile.content || '', activeFile.language || 'javascript');
    updateFileContent(activeFile.id, formatted);
    setIsFormatting(false);
  };

  const updateFileContent = (id: string, content: string) => {
    setFiles(prev => {
      const update = (nodes: FileNode[]): FileNode[] => nodes.map(node => {
        if (node.id === id) return { ...node, content };
        if (node.children) return { ...node, children: update(node.children) };
        return node;
      });
      return update(prev);
    });
  };

  const handleCreateTerminal = () => {
    const id = Date.now().toString();
    const newTerminal: TerminalSession = {
      id,
      name: `Terminal ${terminals.length + 1}`,
      lines: [`Sessão iniciada em ${new Date().toLocaleTimeString()}`],
      currentInput: ''
    };
    setTerminals([...terminals, newTerminal]);
    setActiveTerminalId(id);
  };

  const handleCloseTerminal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (terminals.length <= 1) return;
    const newTerminals = terminals.filter(t => t.id !== id);
    setTerminals(newTerminals);
    if (activeTerminalId === id) setActiveTerminalId(newTerminals[0].id);
    if (id.startsWith('ssh-')) {
      try {
        window.__electron__?.stop(id)
      } catch (e) { console.warn(e) }
    }
  };

  const handleExecuteTerminalCommand = async (command: string) => {
    if (!command.trim()) return;

    const output = await simulateRemoteSSHCommand(command, "Terminal Local NovaCode");

    setTerminals(prev => prev.map(t => {
      if (t.id === activeTerminalId) {
        return {
          ...t,
          lines: [...t.lines, `nova@usuario:~$ ${command}`, output],
          currentInput: ''
        };
      }
      return t;
    }));
  };

  const updateTerminalSession = (updates: Partial<TerminalSession>) => {
    setTerminals(prev => prev.map(t => t.id === activeTerminalId ? { ...t, ...updates } : t));
  };

  const handleInsertSnippet = (code: string) => {
    if (!activeFileId) return;
    const processedCode = code.replace(/\$\{1:(.*?)\}/g, (match, p1) => {
      const val = prompt(`Valor para o campo [${p1}]:`, p1);
      return val || p1;
    });
    updateFileContent(activeFileId, (activeFile?.content || '') + '\n' + processedCode);
  };

  const handleConnectSSH = async (id: string) => {
    setSshSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'connecting', error: undefined } : s));
    const session = sshSessions.find(s => s.id === id);
    if (!session) return;
    const conn = { host: session.host, username: session.user, port: session.port || 22 };
    try {
      const res = await window.__electron__?.sftp?.list(conn, '/');
      if (res?.ok) {
        setSshSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'connected' } : s));
        const termId = `ssh-${id}`
        const newTerminal: TerminalSession = {
          id: termId,
          name: `${session.user}@${session.host}`,
          lines: [`Conectado a ${session.user}@${session.host}`],
          currentInput: ''
        }
        setTerminals(prev => {
          if (prev.some(t => t.id === termId)) return prev
          return [...prev, newTerminal]
        })
        setActiveTerminalId(termId)
        try {
          // @ts-ignore
          const startRes = await window.__electron_ssh__?.start(termId, conn)
          if (!startRes || !startRes.ok) {
            setSshSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'error', error: startRes?.error || 'Falha ao iniciar shell SSH' } : s));
          }
        } catch (e) {
          setSshSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'error', error: e?.message || String(e) } : s));
        }
      } else {
        setSshSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'error', error: res?.error || 'Falha na conexão' } : s));
      }
    } catch (err) {
      setSshSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'error', error: err?.message || String(err) } : s));
    }
  };

  const handleUpdateSSH = (session: SSHSession) => {
    setSshSessions(prev => prev.map(s => s.id === session.id ? { ...s, ...session } : s));
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.id}>
        <div
          onClick={() => node.type === 'file' ? (setActiveFileId(node.id), !openFiles.includes(node.id) && setOpenFiles([...openFiles, node.id])) : null}
          className={`flex items-center px-4 py-2 cursor-pointer group transition-all rounded-xl mx-2 my-0.5 ${activeFileId === node.id ? 'text-white' : 'text-slate-400 hover:bg-white/5'
            }`}
          style={{
            paddingLeft: `${depth * 12 + 12}px`,
            backgroundColor: activeFileId === node.id ? `${theme.primary}20` : undefined,
            color: activeFileId === node.id ? theme.primary : undefined
          }}
        >
          {node.type === 'folder' ? (
            <svg className="w-4 h-4 mr-2 opacity-70" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
          ) : (
            <svg className="w-4 h-4 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          )}
          <span className="text-xs truncate flex-1 font-medium">{node.name}</span>
          <button onClick={(e) => handleDeleteFile(node.id, e)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        {node.children && node.isOpen && renderFileTree(node.children, depth + 1)}
      </div>
    ));
  };

  const sidebarContent = useMemo(() => {
    switch (activeView) {
      case SidebarView.Explorer:
        return (
          <div className="py-4">
            <div className="flex items-center justify-between px-5 mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Explorador</span>
              <button onClick={handleCreateFile} className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-sky-500/20 hover:text-sky-400 transition-all text-slate-400">+</button>
            </div>
            {renderFileTree(files)}
          </div>
        );
      case SidebarView.Commands:
        return (
          <CommandManager
            commands={customCommands}
            onExecute={handleExecuteTerminalCommand}
            onAdd={(cmd) => setCustomCommands([...customCommands, cmd])}
            onDelete={(id) => setCustomCommands(customCommands.filter(c => c.id !== id))}
          />
        );
      case SidebarView.SSH:
        return (
          <SSHManager
            sessions={sshSessions}
            onConnect={handleConnectSSH}
            onAdd={(session) => {
              setSshSessions(prev => [...prev, session]);
              setActiveView(SidebarView.SSH);
              handleConnectSSH(session.id);
            }}
            onUpdate={(session) => setSshSessions(prev => prev.map(s => s.id === session.id ? session : s))}
            onOpenRemoteFile={(name, content, language) => {
              const newFile: FileNode = {
                id: Date.now().toString(),
                name,
                type: 'file',
                language: language || (name.split('.').pop() || 'text'),
                content
              }
              setFiles(prev => [...prev, newFile])
              setOpenFiles(prev => [...prev, newFile.id])
              setActiveFileId(newFile.id)
            }}
          />
        );
      case SidebarView.Snippets:
        return <SnippetManager snippets={snippets} onInsert={handleInsertSnippet} onAdd={(s) => setSnippets([...snippets, s])} />;
      case SidebarView.Plugins:
        return <PluginManager plugins={plugins} onToggle={(id) => setPlugins(plugins.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))} />;
      case SidebarView.Settings:
        return <Settings currentTheme={theme.name} onThemeChange={setTheme} />;
      case SidebarView.AI:
        return <AIChat activeCode={activeFile?.content || ''} language={activeFile?.language || 'typescript'} />;
      default:
        return <div className="p-6 text-slate-500 italic text-xs">Selecione uma ferramenta.</div>;
    }
  }, [activeView, files, activeFile, snippets, plugins, theme, sshSessions, customCommands, activeTerminalId]);

  return (
    <Layout
      activeView={activeView}
      setActiveView={setActiveView}
      sidebarContent={sidebarContent}
      theme={theme}
      bottomPanelHeader={
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar ml-4" onClick={(e) => e.stopPropagation()}>
          {terminals.map(t => (
            <div
              key={t.id}
              onClick={(e) => { e.stopPropagation(); setActiveTerminalId(t.id); }}
              className={`h-6 px-3 rounded-lg flex items-center gap-2 cursor-pointer transition-all border ${activeTerminalId === t.id
                ? 'bg-white/10 border-white/10 text-white'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                }`}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">{t.name}</span>
              <button onClick={(e) => handleCloseTerminal(t.id, e)} className="hover:text-rose-400 opacity-60">
                <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCreateTerminal();
            }}
            className="p-1 hover:text-sky-400 text-slate-500 transition-colors ml-2"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      }
      bottomPanel={
        <Terminal
          session={activeTerminal}
          virtualFiles={files}
          onUpdateSession={updateTerminalSession}
          onExecuteCommand={handleExecuteTerminalCommand}
        />
      }
    >
      <div className="h-12 md:h-14 flex items-center px-2 md:px-4 gap-2 overflow-x-auto bg-white/2 backdrop-blur-md transition-colors duration-500 no-scrollbar">

        {openFiles.map(id => {
          const file = findFileById(files, id);
          const isActive = activeFileId === id;
          return (
            <div
              key={id}
              onClick={() => setActiveFileId(id)}
              className={`h-8 md:h-9 min-w-[120px] md:min-w-[140px] px-3 md:px-4 rounded-xl md:rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 group shadow-lg shrink-0 ${isActive ? 'text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              style={{
                background: isActive ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` : undefined,
                boxShadow: isActive ? `0 4px 12px ${theme.primary}40` : undefined
              }}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-slate-600'}`}></div>
                <span className="text-[10px] md:text-[11px] font-bold truncate tracking-wide">{file?.name}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setOpenFiles(openFiles.filter(fid => fid !== id)); if (isActive) setActiveFileId(null); }}
                className={`ml-2 p-1 rounded-full hover:bg-black/10 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col relative transition-colors duration-500">
        {activeFile ? (
          <FileEditor file={activeFile} updateFileContent={updateFileContent} theme={theme} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 animate-float">
              <svg className="w-8 h-8 md:w-10 md:h-10 opacity-50" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter mb-2">NovaCode</h1>
            <p className="text-[9px] md:text-xs text-slate-500 tracking-widest uppercase">Pronto para o próximo nível</p>
          </div>
        )}

        {activeFile && (
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
            <div
              className="px-3 md:px-4 py-1.5 md:py-2 rounded-2xl flex items-center gap-2 md:gap-4 shadow-xl border border-white/5 transition-colors duration-500 backdrop-blur-xl"
              style={{ backgroundColor: `${theme.sidebar}E6` }}
            >
              <button
                onClick={handleFormatCode}
                disabled={isFormatting}
                title="Formatar com IA"
                className={`p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all ${isFormatting ? 'animate-spin' : ''}`}
                style={{ color: isFormatting ? theme.primary : '#94a3b8' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              </button>
              <div className="w-px h-4 bg-white/10"></div>
              <button
                onClick={() => setActiveView(SidebarView.AI)}
                title="Análise de Qualidade"
                className="p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white"
                style={{ color: activeView === SidebarView.AI ? theme.primary : undefined }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
