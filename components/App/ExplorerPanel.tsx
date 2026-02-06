import React from 'react';
import { FileNode } from '../../types';

interface ExplorerPanelProps {
  files: FileNode[];
  primaryColor: string;
  onCreateFile: () => void;
  renderFileTree: (nodes: FileNode[], depth?: number) => React.ReactNode;
}

export const ExplorerPanel: React.FC<ExplorerPanelProps> = ({
  files,
  primaryColor,
  onCreateFile,
  renderFileTree,
}) => (
  <div className="py-4">
    <div className="flex items-center justify-between px-5 mb-4">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
        Explorador
      </span>
      <button
        onClick={onCreateFile}
        className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-sky-500/20 hover:text-sky-400 transition-all text-slate-400"
      >
        +
      </button>
    </div>
    {renderFileTree(files)}
  </div>
);
