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

  return (
    <>
      {activeFile && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
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
                  className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg border border-white/10 overflow-hidden"
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
          </div>
        </div>
      )}
    </>
  );
};
