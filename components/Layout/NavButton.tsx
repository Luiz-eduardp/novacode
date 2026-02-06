import React from 'react';
import { SidebarView, ThemeConfig } from '../../types';

interface NavItem {
  id: SidebarView;
  label: string;
  icon: string;
}

interface NavButtonProps {
  item: NavItem;
  isActive: boolean;
  isSidebarOpen: boolean;
  theme: ThemeConfig;
  onSelectView: (view: SidebarView) => void;
}

export const NavButton: React.FC<NavButtonProps> = ({
  item,
  isActive,
  isSidebarOpen,
  theme,
  onSelectView,
}) => (
  <button
    onClick={() => onSelectView(item.id)}
    className={`p-3 rounded-2xl transition-all group relative shrink-0 ${
      isActive && isSidebarOpen
        ? 'shadow-inner'
        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
    }`}
    style={{
      color: isActive && isSidebarOpen ? theme.primary : undefined,
      backgroundColor: isActive && isSidebarOpen ? `${theme.primary}20` : undefined,
    }}
    title={item.label}
  >
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d={item.icon}
      />
    </svg>
    <div className="hidden md:block absolute left-16 px-2 py-1 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 pointer-events-none whitespace-nowrap font-bold tracking-wider z-50">
      {item.label}
    </div>
  </button>
);
