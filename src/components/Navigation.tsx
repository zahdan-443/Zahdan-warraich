import React from 'react';
import { ActiveTab, DICTIONARY, Language } from '../types';
import { LayoutDashboard, Calculator, Truck, Users, MapPin, Fuel, ShieldCheck } from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  lang: Language;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab, lang }) => {
  const t = DICTIONARY[lang].nav;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'calculator', label: t.calculator, icon: <Calculator className="w-4 h-4" /> },
    { id: 'verify', label: t.verify, icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'home', label: t.home, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'vehicle', label: t.vehicle, icon: <Truck className="w-4 h-4" /> },
    { id: 'drivers', label: t.drivers, icon: <Users className="w-4 h-4" /> },
    { id: 'routes', label: t.routes, icon: <MapPin className="w-4 h-4" /> },
    { id: 'fuel', label: t.fuel, icon: <Fuel className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Desktop & Tablet Top Navigation Bar */}
      <nav className="hidden md:flex items-center gap-8 px-12 py-4 bg-[#fdfbf7] border-b border-[#ecece0] overflow-x-auto no-scrollbar sticky top-20 z-40">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 text-xs uppercase tracking-widest font-medium whitespace-nowrap py-2 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#8b9d77] border-b-2 border-[#8b9d77] font-bold'
                  : 'text-[#8e8e75] hover:text-[#4a4a35]'
              }`}
            >
              <span className={isActive ? 'text-[#8b9d77]' : 'text-[#8e8e75]'}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Horizontal Scrolling Pills Nav */}
      <nav className="md:hidden flex items-center gap-2 px-4 py-3 bg-[#fdfbf7] border-b border-[#ecece0] overflow-x-auto no-scrollbar sticky top-20 z-40">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#5a5a40] text-white shadow-xs'
                  : 'bg-white text-[#8e8e75] border border-[#ecece0]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Fixed Navigation Bar (Main 5 items) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#fdfbf7]/95 backdrop-blur-md border-t border-[#ecece0] px-2 py-2 flex items-center justify-around z-50">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-[#8b9d77] font-bold bg-[#f0f0e4]/50' : 'text-[#8e8e75]'
              }`}
            >
              {item.icon}
              <span className="text-[9px] uppercase tracking-tighter leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
