import React from 'react';
import { FileNode } from '../../types';

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
  activeFileId: string | null;
  openFiles: string[];
  primaryColor: string;
  onSelectFile: (id: string) => void;
  onDeleteFile: (id: string, e: React.MouseEvent) => void;
  renderTree: (nodes: FileNode[], depth: number) => React.ReactNode;
}

export const FileTreeItem: React.FC<FileTreeItemProps> = ({
  node,
  depth,
  activeFileId,
  openFiles,
  primaryColor,
  onSelectFile,
  onDeleteFile,
  renderTree,
}) => (
  <div key={node.id}>
    <div
      onClick={() =>
        node.type === 'file'
          ? (onSelectFile(node.id),
            !openFiles.includes(node.id) &&
              openFiles.push(node.id))
          : null
      }
      className={`flex items-center px-4 py-2 cursor-pointer group transition-all rounded-xl mx-2 my-0.5 ${
        activeFileId === node.id
          ? 'text-white'
          : 'text-slate-400 hover:bg-white/5'
      }`}
      style={{
        paddingLeft: `${depth * 12 + 12}px`,
        backgroundColor:
          activeFileId === node.id ? `${primaryColor}20` : undefined,
        color: activeFileId === node.id ? primaryColor : undefined,
      }}
    >
      {node.type === 'folder' ? (
        <svg
          className="w-4 h-4 mr-2 opacity-70"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 mr-2 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      )}
      <span className="text-xs truncate flex-1 font-medium">{node.name}</span>
      <button
        onClick={(e) => onDeleteFile(node.id, e)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
    {node.children && node.isOpen && renderTree(node.children, depth + 1)}
  </div>
);
