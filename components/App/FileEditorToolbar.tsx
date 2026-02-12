import React, { useState } from 'react';
import { ThemeConfig, SidebarView } from '../../types';

interface FileEditorToolbarProps {
  activeFile: any;
  isFormatting: boolean;
  theme: ThemeConfig;
  activeView: SidebarView;
  onFormatCode: () => void;
  onOpenAI: () => void;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
  onSaveFile?: () => void;
  hasUnsavedChanges?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const FileEditorToolbar: React.FC<FileEditorToolbarProps> = ({
  activeFile,
  isFormatting,
  theme,
  activeView,
  onFormatCode,
  onOpenAI,
  onCreateFile,
  onCreateFolder,
  onSaveFile,
  hasUnsavedChanges = false,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  return (
    <>
      {activeFile && (
        <>
          {/* Fixed toolbar at top */}
          <div 
            className={`fixed top-0 right-0 left-0 md:left-0 transition-all duration-300 ease-in-out z-40 pointer-events-none ${
              isToolbarVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundColor: isToolbarVisible ? `${theme.bg}80` : 'transparent' }}
          >
            <div className="h-16 flex items-center justify-between px-4 md:px-6 pointer-events-auto border-b border-white/5">
              <div className="flex items-center gap-2 flex-1 overflow-x-auto">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                  Editor
                </span>
              </div>

              <div
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-2xl flex items-center gap-2 md:gap-3 shadow-xl border border-white/5 transition-colors duration-500 backdrop-blur-xl"
                style={{ backgroundColor: `${theme.sidebar}E6` }}
              >
                <div className="relative">
                  <button
                    onClick={() => setShowCreateMenu(!showCreateMenu)}
                    title="Criar arquivo ou pasta"
                    className="p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>

                  {showCreateMenu && (
                    <div
                      className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg border border-white/10 overflow-hidden z-50"
                      style={{ backgroundColor: `${theme.sidebar}F0` }}
                      onMouseLeave={() => setShowCreateMenu(false)}
                    >
                      <button
                        onClick={() => {
                          onCreateFile?.();
                          setShowCreateMenu(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-slate-300 hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Novo arquivo
                      </button>
                      <button
                        onClick={() => {
                          onCreateFolder?.();
                          setShowCreateMenu(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-slate-300 hover:bg-white/10 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        Nova pasta
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-px h-4 bg-white/10"></div>

                <button
                  onClick={onUndo}
                  disabled={!canUndo}
                  title="Desfazer (Ctrl+Z)"
                  className="p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      d="M3 7v6h6M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"
                    />
                  </svg>
                </button>

                <button
                  onClick={onRedo}
                  disabled={!canRedo}
                  title="Refazer (Ctrl+Y)"
                  className="p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      d="M21 7v6h-6m0 0a9 9 0 01-9 9 9 9 0 016-2.3l3-2.7"
                    />
                  </svg>
                </button>

                <div className="w-px h-4 bg-white/10"></div>
                <button
                  onClick={onFormatCode}
                  disabled={isFormatting}
                  title="Formatar com IA"
                  className={`p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all ${isFormatting ? 'animate-spin' : ''
                    }`}
                  style={{
                    color: isFormatting ? theme.primary : '#94a3b8',
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </button>

                <div className="w-px h-4 bg-white/10"></div>

                <button
                  onClick={onOpenAI}
                  title="Análise de Qualidade"
                  className="p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white"
                  style={{
                    color:
                      activeView === SidebarView.AI
                        ? theme.primary
                        : undefined,
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04"
                    />
                  </svg>
                </button>

                <div className="w-px h-4 bg-white/10"></div>

                <button
                  onClick={onSaveFile}
                  title="Salvar arquivo (Ctrl+S)"
                  className={`p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all ${hasUnsavedChanges ? 'animate-pulse' : ''
                    }`}
                  style={{
                    color: hasUnsavedChanges ? '#fbbf24' : '#94a3b8',
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                </button>

                <div className="w-px h-4 bg-white/10"></div>

                <button
                  onClick={() => setIsToolbarVisible(!isToolbarVisible)}
                  title={isToolbarVisible ? 'Ocultar toolbar' : 'Mostrar toolbar'}
                  className="p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth="2"
                      d={isToolbarVisible ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"}
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Toggle button when toolbar is hidden */}
          {!isToolbarVisible && (
            <button
              onClick={() => setIsToolbarVisible(true)}
              title="Mostrar toolbar"
              className="fixed top-2 right-2 md:top-4 md:right-4 z-40 p-2 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-white border border-white/10 hover:border-white/20 bg-slate-900/80 backdrop-blur"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
          )}
        </>
      )}
    </>
  );
};

