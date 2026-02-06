import React from 'react';
import { ThemeConfig } from '../../types';

interface MainContentProps {
  children: React.ReactNode;
  theme: ThemeConfig;
}

export const MainContent: React.FC<MainContentProps> = ({ children, theme }) => (
  <div
    className="flex-1 md:glass-panel md:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative transition-colors duration-500 h-full"
    style={{
      backgroundColor:
        window.innerWidth > 768 ? `${theme.sidebar}4D` : 'transparent',
    }}
  >
    <div className="flex-1 overflow-hidden relative">{children}</div>
  </div>
);
