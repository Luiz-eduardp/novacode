import React from 'react';
import { ThemeConfig, SidebarView } from '../../types';

interface FileEditorToolbarProps {
  activeFile: any;
  isFormatting: boolean;
  theme: ThemeConfig;
  activeView: SidebarView;
  onFormatCode: () => void;
  onOpenAI: () => void;
}

export const FileEditorToolbar: React.FC<FileEditorToolbarProps> = ({
  activeFile,
  isFormatting,
  theme,
  activeView,
  onFormatCode,
  onOpenAI,
}) => (
  <>
    {activeFile && (
      <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
        <div
          className="px-3 md:px-4 py-1.5 md:py-2 rounded-2xl flex items-center gap-2 md:gap-4 shadow-xl border border-white/5 transition-colors duration-500 backdrop-blur-xl"
          style={{ backgroundColor: `${theme.sidebar}E6` }}
        >
          <button
            onClick={onFormatCode}
            disabled={isFormatting}
            title="Formatar com IA"
            className={`p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all ${
              isFormatting ? 'animate-spin' : ''
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
        </div>
      </div>
    )}
  </>
);
