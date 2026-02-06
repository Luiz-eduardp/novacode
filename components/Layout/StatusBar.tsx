import React from 'react';
import { ThemeConfig } from '../../types';

interface StatusBarProps {
  theme: ThemeConfig;
  isTerminalExpanded: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  theme,
  isTerminalExpanded,
}) => (
  <div
    className={`hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full items-center gap-8 text-[10px] font-bold text-slate-400 shadow-xl border border-white/5 pointer-events-none transition-all duration-500 z-30 ${
      isTerminalExpanded ? 'opacity-0' : 'opacity-100'
    }`}
    style={{ backgroundColor: `${theme.sidebar}E6` }}
  >
    <div className="flex items-center gap-2">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: theme.primary }}
      ></span>
      <span>UTF-8</span>
    </div>
    <div className="flex items-center gap-2">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: theme.accent }}
      ></span>
      <span>TSX</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
      <span>AI READY</span>
    </div>
  </div>
);
