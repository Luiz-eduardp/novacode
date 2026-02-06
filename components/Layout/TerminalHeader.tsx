import React from 'react';
import { ThemeConfig } from '../../types';

interface TerminalHeaderProps {
  isTerminalExpanded: boolean;
  theme: ThemeConfig;
  onToggle: () => void;
  headerContent?: React.ReactNode;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  isTerminalExpanded,
  theme,
  onToggle,
  headerContent,
}) => (
  <div
    className="h-10 flex items-center px-4 justify-between cursor-pointer hover:bg-white/5 shrink-0 select-none"
    onClick={onToggle}
  >
    <div className="flex items-center gap-4 flex-1 overflow-hidden">
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full transition-all duration-500 ${
            isTerminalExpanded
              ? 'bg-amber-500'
              : 'bg-emerald-500 animate-pulse'
          }`}
          style={{
            backgroundColor: !isTerminalExpanded ? theme.primary : '#f59e0b',
          }}
        ></span>
        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
          Console
        </span>
      </div>

      {isTerminalExpanded && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center overflow-hidden"
        >
          {headerContent}
        </div>
      )}
    </div>
    <svg
      className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
        isTerminalExpanded ? 'rotate-180' : ''
      }`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 15l7-7 7 7"
      />
    </svg>
  </div>
);
