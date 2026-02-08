import React, { useState, useEffect } from 'react';
import { FileNode } from '../../types';
import { fileSystemService, FileSystemNode } from '../../services/fileSystemService';

interface ExplorerPanelProps {
  files: FileNode[];
  primaryColor: string;
  onCreateFile: () => void;
  onCreateFolder: () => void;
  renderFileTree: (nodes: FileNode[], depth?: number) => React.ReactNode;
  onLoadSystemFiles?: (files: FileSystemNode[]) => void;
}

interface CreateFileModalState {
  isOpen: boolean;
  fileName: string;
  selectedPath: string;
}

export const ExplorerPanel: React.FC<ExplorerPanelProps> = ({
  files,
  primaryColor,
  onCreateFile,
  onCreateFolder,
  renderFileTree,
  onLoadSystemFiles,
}) => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [systemFiles, setSystemFiles] = useState<FileSystemNode[]>([]);
  const [showSystemFiles, setShowSystemFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createFileModal, setCreateFileModal] = useState<CreateFileModalState>({
    isOpen: false,
    fileName: '',
    selectedPath: ''
  });
  const [workspacePath, setWorkspacePath] = useState<string>('');

  const loadDirectory = async (dirPath: string) => {
    setIsLoading(true);
    try {
      const fileList = await fileSystemService.listDirectory(dirPath);
      setSystemFiles(fileList);
      setCurrentPath(dirPath);
      onLoadSystemFiles?.(fileList);
    } catch (error) {
      console.error('Erro ao carregar diretório:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDirectory = async () => {
    try {
      const homeDir = await fileSystemService.getHomeDirectory();
      if (homeDir) {
        setWorkspacePath(homeDir);
        await loadDirectory(homeDir);
        setShowSystemFiles(true);
      }
    } catch (error) {
      console.error('Erro ao abrir diretório:', error);
    }
  };

  const handleOpenCreateFileModal = () => {
    setCreateFileModal({
      isOpen: true,
      fileName: '',
      selectedPath: showSystemFiles ? currentPath : ''
    });
  };

  const handleCreateFile = async () => {
    const { fileName, selectedPath } = createFileModal;

    if (!fileName.trim()) {
      alert('Digite um nome para o arquivo');
      return;
    }

    if (showSystemFiles && !selectedPath) {
      alert('Selecione uma pasta');
      return;
    }

    try {
      const filePath = selectedPath
        ? `${selectedPath}/${fileName}`
        : fileName;

      const success = await fileSystemService.createFile(filePath);

      if (success) {
        if (showSystemFiles) {
          await loadDirectory(selectedPath || currentPath);
        }

        const content = await fileSystemService.readFile(filePath);
        const event = new CustomEvent('openSystemFile', {
          detail: { path: filePath, content }
        });
        window.dispatchEvent(event);

        setCreateFileModal({ isOpen: false, fileName: '', selectedPath: '' });
      } else {
        alert('Erro ao criar arquivo');
      }
    } catch (error) {
      console.error('Erro ao criar arquivo:', error);
      alert('Erro ao criar arquivo: ' + (error instanceof Error ? error.message : 'Desconhecido'));
    }
  };

  const handleCreateNewFolder = async () => {
    const folderName = prompt('Nome da pasta:');
    if (!folderName) return;

    const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    const success = await fileSystemService.createFolder(folderPath);

    if (success) {
      await loadDirectory(currentPath);
    }
  };

  const handleNavigateToFolder = async (folderPath: string) => {
    await loadDirectory(folderPath);
  };

  const handleOpenFile = async (filePath: string) => {
    try {
      const content = await fileSystemService.readFile(filePath);
      const event = new CustomEvent('openSystemFile', {
        detail: { path: filePath, content }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Erro ao abrir arquivo:', error);
    }
  };

  return (
    <div className="py-4">
      <div className="flex items-center justify-between px-5 mb-4 gap-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex-1">
          {showSystemFiles ? 'Sistema de Arquivos' : 'Explorador'}
        </span>
        <button
          onClick={handleOpenDirectory}
          title="Abrir pasta do sistema"
          className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition-all text-slate-400"
        >
          📁
        </button>
        <button
          onClick={handleOpenCreateFileModal}
          title="Criar novo arquivo"
          className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-sky-500/20 hover:text-sky-400 transition-all text-slate-400"
        >
          +
        </button>
        {showSystemFiles && (
          <button
            onClick={handleCreateNewFolder}
            title="Criar nova pasta"
            className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-400 transition-all text-slate-400"
          >
            📂
          </button>
        )}
      </div>

      {createFileModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-white/5 flex-shrink-0">
              <h3 className="text-sm font-bold text-white">Criar Novo Arquivo</h3>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {showSystemFiles && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    Pasta de Destino
                  </label>
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5 text-xs text-slate-300 truncate mb-2">
                    {createFileModal.selectedPath || currentPath || 'Nenhuma pasta selecionada'}
                  </div>

                  {systemFiles.filter(f => f.type === 'folder').length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] text-slate-500 mb-2 font-semibold">Pastas disponíveis:</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {systemFiles.filter(f => f.type === 'folder').map(folder => (
                          <button
                            key={folder.path}
                            onClick={() => setCreateFileModal(prev => ({ ...prev, selectedPath: folder.path }))}
                            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors ${createFileModal.selectedPath === folder.path
                                ? 'bg-sky-600/30 border border-sky-500/50 text-sky-300'
                                : 'bg-slate-800/30 border border-white/5 text-slate-300 hover:bg-slate-800/50'
                              }`}
                          >
                            📁 {folder.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentPath && (
                    <button
                      onClick={() => setCreateFileModal(prev => ({ ...prev, selectedPath: currentPath }))}
                      className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-slate-300 transition-colors border border-white/5 font-medium"
                    >
                      📂 Usar Pasta Atual: {currentPath.split(/[/\\]/).pop() || 'Raiz'}
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Nome do Arquivo
                </label>
                <input
                  type="text"
                  value={createFileModal.fileName}
                  onChange={(e) => setCreateFileModal(prev => ({ ...prev, fileName: e.target.value }))}
                  placeholder="exemplo.txt"
                  className="w-full p-3 bg-slate-800/50 rounded-xl border border-white/5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateFile();
                  }}
                  autoFocus
                />
                <p className="text-[10px] text-slate-500 mt-1.5">
                  Inclua a extensão (.js, .txt, .md, .tsx, etc)
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-white/5 flex items-center gap-2 justify-end flex-shrink-0">
              <button
                onClick={() => setCreateFileModal({ isOpen: false, fileName: '', selectedPath: '' })}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateFile}
                disabled={!createFileModal.fileName.trim()}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium transition-all active:scale-95"
              >
                Criar Arquivo
              </button>
            </div>
          </div>
        </div>
      )}

      {showSystemFiles && (
        <>
          <div className="px-5 mb-4 pb-3 border-b border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] uppercase tracking-wide text-slate-500 font-semibold">Workspace</div>
              <button
                onClick={() => setShowSystemFiles(false)}
                title="Voltar ao explorador"
                className="text-[10px] px-2 py-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-300 transition-colors"
              >
                ← Voltar
              </button>
            </div>
            <div className="text-xs text-slate-400 truncate bg-slate-800/30 px-2.5 py-1.5 rounded-lg border border-white/5">
              {workspacePath}
            </div>
          </div>

          {currentPath && (
            <div className="px-5 mb-3 pb-2 border-b border-white/5">
              <div className="text-[9px] uppercase tracking-wide mb-2 text-slate-500">Caminho Atual:</div>
              <div className="flex items-center gap-1 text-xs text-slate-300 flex-wrap">
                {currentPath.split(/[/\\]/).filter(p => p).map((part, idx, arr) => (
                  <React.Fragment key={idx}>
                    <button
                      onClick={() => {
                        const pathParts = currentPath.split(/[/\\]/).filter(p => p);
                        const newPath = pathParts.slice(0, idx + 1).join('/');
                        handleNavigateToFolder(newPath);
                      }}
                      className="hover:text-sky-400 transition-colors truncate max-w-[120px] px-1 py-0.5 hover:bg-white/5 rounded"
                    >
                      {part}
                    </button>
                    {idx < arr.length - 1 && <span className="text-slate-600">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="px-5 py-4 text-center text-slate-400 text-xs">
              <div className="w-4 h-4 border-2 border-slate-600 border-t-sky-500 rounded-full animate-spin mx-auto mb-2"></div>
              Carregando...
            </div>
          ) : systemFiles.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-slate-500 text-xs">Pasta vazia</p>
            </div>
          ) : (
            <div className="space-y-0.5 px-2">
              {systemFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5 transition-colors group cursor-pointer"
                  onClick={() =>
                    file.type === 'folder' ? handleNavigateToFolder(file.path) : handleOpenFile(file.path)
                  }
                >
                  <span className="text-sm flex-shrink-0">
                    {file.type === 'folder' ? '📁' : '📄'}
                  </span>
                  <span className="text-xs text-slate-300 flex-1 truncate">
                    {file.name}
                  </span>
                  {file.type === 'file' && file.size && (
                    <span className="text-[10px] text-slate-500">
                      {file.size > 1024 ? (file.size / 1024).toFixed(1) + 'KB' : file.size + 'B'}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Deletar ${file.name}?`)) {
                        fileSystemService.delete(file.path).then(() => {
                          loadDirectory(currentPath);
                        });
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all text-slate-600"
                    title="Deletar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!showSystemFiles && renderFileTree(files)}
    </div>
  );
};
