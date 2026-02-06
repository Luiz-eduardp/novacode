

import React, { useState, useCallback, useMemo } from 'react';
import { SidebarView, ThemeConfig } from '../types';
import { NavButton } from './Layout/NavButton';
import { MobileMenuButton } from './Layout/MobileMenuButton';
import { NavBar } from './Layout/NavBar';
import { Sidebar } from './Layout/Sidebar';
import { MainContent } from './Layout/MainContent';
import { TerminalPanel } from './Layout/TerminalPanel';
import { StatusBar } from './Layout/StatusBar';

interface LayoutProps {
  children: React.ReactNode;
  activeView: SidebarView;
  setActiveView: (view: SidebarView) => void;
  sidebarContent: React.ReactNode;
  bottomPanel: React.ReactNode;
  bottomPanelHeader?: React.ReactNode;
  theme: ThemeConfig;
}

interface NavItem {
  id: SidebarView;
  label: string;
  icon: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeView,
  setActiveView,
  sidebarContent,
  bottomPanel,
  bottomPanelHeader,
  theme,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      { id: SidebarView.Explorer, label: 'Arquivos', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
      { id: SidebarView.Commands, label: 'Comandos', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
      { id: SidebarView.Git, label: 'Git', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
      { id: SidebarView.SSH, label: 'SSH/SFTP', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2' },
      { id: SidebarView.AI, label: 'Análise IA', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
      { id: SidebarView.SQL, label: 'SQL', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
      { id: SidebarView.Snippets, label: 'Snippets', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
      { id: SidebarView.Plugins, label: 'Plugins', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
      { id: SidebarView.Settings, label: 'Ajustes', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ],
    []
  );

  const handleSelectView = useCallback(
    (view: SidebarView) => {
      setActiveView(view);
      setIsSidebarOpen(true);
      if (window.innerWidth < 768) setIsMobileMenuOpen(false);
    },
    [setActiveView]
  );

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleToggleTerminal = useCallback(() => {
    setIsTerminalExpanded(prev => !prev);
  }, []);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden p-0 md:p-3 gap-0 md:gap-3 relative transition-all duration-700 ease-in-out font-sans"
      style={{
        background: `radial-gradient(circle at top left, ${theme.bg}, ${theme.bg}CC)`,
        backgroundColor: theme.bg
      }}
    >
      <MobileMenuButton isMobileMenuOpen={isMobileMenuOpen} theme={theme} onToggle={handleToggleMobileMenu} />

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <NavBar isMobileMenuOpen={isMobileMenuOpen} theme={theme}>
        {navItems.map(item => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeView === item.id}
            isSidebarOpen={isSidebarOpen}
            theme={theme}
            onSelectView={handleSelectView}
          />
        ))}
      </NavBar>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        theme={theme}
        content={sidebarContent}
      />

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <MainContent theme={theme}>
          {children}
        </MainContent>

        <TerminalPanel
          isTerminalExpanded={isTerminalExpanded}
          theme={theme}
          onToggle={handleToggleTerminal}
          headerContent={bottomPanelHeader}
        >
          {bottomPanel}
        </TerminalPanel>

        <StatusBar theme={theme} isTerminalExpanded={isTerminalExpanded} />
      </div>
    </div>
  );
};
