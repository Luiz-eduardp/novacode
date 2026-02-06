
import React, { useState } from 'react';
import { SidebarView, ThemeConfig } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: SidebarView;
  setActiveView: (view: SidebarView) => void;
  sidebarContent: React.ReactNode;
  bottomPanel: React.ReactNode;
  bottomPanelHeader?: React.ReactNode;
  theme: ThemeConfig;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, sidebarContent, bottomPanel, bottomPanelHeader, theme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: SidebarView.Explorer, label: 'Arquivos', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { id: SidebarView.Commands, label: 'Comandos', icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: SidebarView.Git, label: 'Git', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { id: SidebarView.SSH, label: 'SSH/SFTP', icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2' },
    { id: SidebarView.AI, label: 'Análise IA', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: SidebarView.SQL, label: 'SQL', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
    { id: SidebarView.Snippets, label: 'Snippets', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
    { id: SidebarView.Plugins, label: 'Plugins', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
    { id: SidebarView.Settings, label: 'Ajustes', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  return (
    <div
      className="flex h-screen w-screen overflow-hidden p-0 md:p-3 gap-0 md:gap-3 relative transition-all duration-700 ease-in-out font-sans"
      style={{
        background: `radial-gradient(circle at top left, ${theme.bg}, ${theme.bg}CC)`,
        backgroundColor: theme.bg
      }}
    >
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 right-4 z-[100] p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
        style={{ color: theme.primary }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
        </svg>
      </button>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`glass-dock w-16 rounded-none md:rounded-3xl flex flex-col items-center py-6 gap-5 shadow-2xl z-[90] transition-all duration-500 shrink-0 fixed md:relative h-full md:h-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ backgroundColor: `${theme.sidebar}F2` }}
      >
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-float shrink-0"
          style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
        >
          <span className="font-bold text-white text-lg">N</span>
        </div>

        <div className="flex-1 flex flex-col items-center gap-5 overflow-y-auto no-scrollbar pb-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsSidebarOpen(true);
                if (window.innerWidth < 768) setIsMobileMenuOpen(false);
              }}
              className={`p-3 rounded-2xl transition-all group relative shrink-0 ${activeView === item.id && isSidebarOpen
                  ? 'shadow-inner'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              style={{
                color: activeView === item.id && isSidebarOpen ? theme.primary : undefined,
                backgroundColor: activeView === item.id && isSidebarOpen ? `${theme.primary}20` : undefined
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <div className="hidden md:block absolute left-16 px-2 py-1 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none whitespace-nowrap font-bold tracking-wider z-50">
                {item.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className={`glass-panel w-72 md:rounded-3xl flex flex-col overflow-hidden transition-all duration-500 shadow-2xl shrink-0 fixed md:relative h-full md:h-auto z-[85] ${isMobileMenuOpen ? 'translate-x-16' : '-translate-x-full md:translate-x-0'}`}
          style={{ backgroundColor: `${theme.sidebar}F9` }}
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <div
          className="flex-1 md:glass-panel md:rounded-3xl flex flex-col overflow-hidden shadow-2xl relative transition-colors duration-500 h-full"
          style={{ backgroundColor: window.innerWidth > 768 ? `${theme.sidebar}4D` : 'transparent' }}
        >
          <div className="flex-1 overflow-hidden relative">
            {children}
          </div>

          <div
            className="backdrop-blur-3xl border-t border-white/5 transition-all duration-500 ease-in-out flex flex-col shrink-0 z-40"
            style={{
              backgroundColor: `${theme.bg}F2`,
              height: isTerminalExpanded ? (window.innerWidth < 768 ? '100%' : '45%') : '40px'
            }}
          >
            <div
              className="h-10 flex items-center px-4 justify-between cursor-pointer hover:bg-white/5 shrink-0 select-none"
              onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
            >
              <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${isTerminalExpanded ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}
                    style={{ backgroundColor: !isTerminalExpanded ? theme.primary : '#f59e0b' }}
                  ></span>
                  <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Console</span>
                </div>

                {isTerminalExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center overflow-hidden"
                  >
                    {bottomPanelHeader}
                  </div>
                )}
              </div>
              <svg className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isTerminalExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
            </div>

            {isTerminalExpanded && (
              <div className="flex-1 overflow-hidden">
                {bottomPanel}
              </div>
            )}
          </div>
        </div>

        <div
          className={`hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full items-center gap-8 text-[10px] font-bold text-slate-400 shadow-xl border border-white/5 pointer-events-none transition-all duration-500 z-30 ${isTerminalExpanded ? 'opacity-0' : 'opacity-100'}`}
          style={{ backgroundColor: `${theme.sidebar}E6` }}
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.primary }}></span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }}></span>
            <span>TSX</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>AI READY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
