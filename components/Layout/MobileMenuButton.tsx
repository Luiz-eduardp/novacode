import React from 'react';
import { ThemeConfig } from '../../types';

interface MobileMenuButtonProps {
  isMobileMenuOpen: boolean;
  theme: ThemeConfig;
  onToggle: () => void;
}

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isMobileMenuOpen,
  theme,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className="md:hidden fixed top-4 right-4 z-[100] p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
    style={{ color: theme.primary }}
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d={
          isMobileMenuOpen
            ? 'M6 18L18 6M6 6l12 12'
            : 'M4 6h16M4 12h16m-7 6h7'
        }
      />
    </svg>
  </button>
);
