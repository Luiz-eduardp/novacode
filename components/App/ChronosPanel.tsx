import React from 'react';
import { ChronosSnapshot, ThemeConfig } from '../../types';

interface ChronosPanelProps {
  snapshots: ChronosSnapshot[];
  currentIndex: number;
  theme: ThemeConfig;
  onNavigate: (index: number) => void;
  onDelete: (snapshotId: string) => void;
}

export const ChronosPanel: React.FC<ChronosPanelProps> = ({
  snapshots,
  currentIndex,
  theme,
  onNavigate,
  onDelete,
}) => {
  if (snapshots.length === 0) {
    return (
      <div className="h-32 border-b border-white/5 bg-slate-900/50 flex items-center justify-center">
        <div className="text-slate-500 text-xs text-center">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Nenhuma alteração registrada
        </div>
      </div>
    );
  }

  return (
    <div className="h-48 border-b border-white/5 bg-slate-900/50 overflow-y-auto">
      <div className="p-3 space-y-2">
        {snapshots.map((snapshot, index) => (
          <div
            key={snapshot.id}
            onClick={() => onNavigate(index)}
            className={`p-3 rounded cursor-pointer transition-all group ${
              index === currentIndex
                ? 'bg-blue-600/30 border border-blue-500/50 shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/50 border border-white/5 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="font-mono text-slate-400 font-semibold">#{index + 1}</span>
                  <span className="text-slate-300 font-medium">{snapshot.description}</span>
                  {index === currentIndex && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-600/50 text-blue-200">
                      Atual
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mb-1">
                  {new Date(snapshot.timestamp).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 truncate max-w-xs bg-slate-900/30 px-2 py-1 rounded">
                  {snapshot.content.substring(0, 80).replace(/\n/g, ' ')}...
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(snapshot.id);
                }}
                className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-600/30 transition-all flex-shrink-0"
                title="Deletar snapshot"
              >
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
