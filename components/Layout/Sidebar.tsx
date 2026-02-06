import React from 'react';
import { ThemeConfig } from '../../types';

interface SidebarProps {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  theme: ThemeConfig;
  content: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  isMobileMenuOpen,
  theme,
  content,
}) => (
  <>
    {isSidebarOpen && (
      <div
        className={`glass-panel w-72 md:rounded-3xl flex flex-col overflow-hidden transition-all duration-500 shadow-2xl shrink-0 fixed md:relative h-full md:h-auto z-[85] ${
          isMobileMenuOpen ? 'translate-x-16' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: `${theme.sidebar}F9` }}
      >
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {content}
        </div>
      </div>
    )}
  </>
);
