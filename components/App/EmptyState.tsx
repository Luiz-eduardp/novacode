import React from 'react';
import { ThemeConfig } from '../../types';

interface EmptyStateProps {
  theme: ThemeConfig;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ theme }) => (
  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
    <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 animate-float">
      <svg
        className="w-8 h-8 md:w-10 md:h-10 opacity-50"
        style={{ color: theme.primary }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth="1"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    </div>
    <h1 className="text-xl md:text-2xl font-black text-white tracking-tighter mb-2">
      NovaCode
    </h1>
    <p className="text-[9px] md:text-xs text-slate-500 tracking-widest uppercase">
      Pronto para o próximo nível
    </p>
  </div>
);
