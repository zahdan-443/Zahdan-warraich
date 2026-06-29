import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-14 px-6 md:px-12 bg-[#f0f0e4] flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#4a4a35] opacity-60 font-sans border-t border-[#e2e2d5] select-none mt-auto">
      <span>Basic Version 1.0.4</span>
      <span className="hidden sm:inline">Design by Al-Hadi Goods Team</span>
      <span>© 2024 Zahdan Warraich</span>
    </footer>
  );
};
