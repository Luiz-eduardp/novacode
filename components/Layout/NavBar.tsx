import React from 'react';
import { ThemeConfig } from '../../types';

interface NavBarProps {
  isMobileMenuOpen: boolean;
  theme: ThemeConfig;
  children: React.ReactNode;
}

export const NavBar: React.FC<NavBarProps> = ({
  isMobileMenuOpen,
  theme,
  children,
}) => (
  <div
    className={`glass-dock w-16 rounded-none md:rounded-3xl flex flex-col items-center py-6 gap-5 shadow-2xl z-[90] transition-all duration-500 shrink-0 fixed md:relative h-full md:h-auto ${
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}
    style={{ backgroundColor: `${theme.sidebar}F2` }}
  >
    <div
      className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-float shrink-0"
      style={{
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
      }}
    >
      <span className="font-bold text-white text-lg">N</span>
    </div>

    <div className="flex-1 flex flex-col items-center gap-5 overflow-y-auto no-scrollbar pb-10">
      {children}
    </div>
  </div>
);
