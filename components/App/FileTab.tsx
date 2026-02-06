import React from 'react';
import { FileNode } from '../../types';

interface FileTabProps {
  id: string;
  file: FileNode | undefined;
  isActive: boolean;
  theme: { primary: string; accent: string };
  onSelect: (id: string) => void;
  onClose: (id: string, e: React.MouseEvent) => void;
}

export const FileTab: React.FC<FileTabProps> = ({
  id,
  file,
  isActive,
  theme,
  onSelect,
  onClose,
}) => (
  <div
    onClick={() => onSelect(id)}
    className={`h-8 md:h-9 min-w-[120px] md:min-w-[140px] px-3 md:px-4 rounded-xl md:rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-300 group shadow-lg shrink-0 ${
      isActive
        ? 'text-white'
        : 'bg-white/5 text-slate-400 hover:bg-white/10'
    }`}
    style={{
      background: isActive
        ? `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`
        : undefined,
      boxShadow: isActive ? `0 4px 12px ${theme.primary}40` : undefined,
    }}
  >
    <div className="flex items-center gap-2 overflow-hidden">
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? 'bg-white' : 'bg-slate-600'
        }`}
      ></div>
      <span className="text-[10px] md:text-[11px] font-bold truncate tracking-wide">
        {file?.name}
      </span>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose(id, e);
      }}
      className={`ml-2 p-1 rounded-full hover:bg-black/10 transition-opacity ${
        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}
    >
      <svg
        className="w-2.5 h-2.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);
