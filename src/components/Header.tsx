import React, { useState } from 'react';
import { Globe, LogIn, LogOut, Bell, Wifi, WifiOff, RefreshCw, Shield, Users, CheckCheck, X, Crown, Truck, Briefcase, Menu, Palette, Sun, Moon, Monitor } from 'lucide-react';
import { DICTIONARY, Language, AppNotification, UserRole } from '../types';
import { AlHadiLogo } from './AlHadiLogo';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  userEmail: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
  role: UserRole;
  onSelectRole: (r: UserRole) => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  offlineCount: number;
  isOffline: boolean;
  onToggleOffline: () => void;
  onSyncOffline: () => void;
  isDashboard?: boolean;
  showTopMenuExternal?: boolean;
  onOpenTopMenu?: () => void;
  onCloseTopMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  userEmail,
  onSignIn,
  onSignOut,
  role,
  onSelectRole,
  notifications,
  onMarkAllRead,
  offlineCount,
  isOffline,
  onToggleOffline,
  onSyncOffline,
  isDashboard = false,
  showTopMenuExternal,
  onOpenTopMenu,
  onCloseTopMenu
}) => {
  const t = DICTIONARY[lang];
  const [logoErr, setLogoErr] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [internalShowTopMenu, setInternalShowTopMenu] = useState(false);
  const [themePref, setThemePref] = useState<'light' | 'dark' | 'system'>('light');

  React.useEffect(() => {
    const root = document.documentElement;
    if (themePref === 'dark') {
      root.classList.add('dark');
    } else if (themePref === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [themePref]);

  const isMenuOpen = showTopMenuExternal !== undefined ? showTopMenuExternal : internalShowTopMenu;
  const handleOpenMenu = () => {
    if (onOpenTopMenu) onOpenTopMenu();
    else setInternalShowTopMenu(true);
  };
  const handleCloseMenu = () => {
    if (onCloseTopMenu) onCloseTopMenu();
    else setInternalShowTopMenu(false);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const rolesList: { id: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'owner', label: 'Owner / Fleet Lead', icon: <Crown className="w-3.5 h-3.5 text-[#EAB308]" />, color: 'bg-amber-500/10 text-amber-700 border-amber-300' },
    { id: 'driver', label: 'Driver / Highway Op', icon: <Truck className="w-3.5 h-3.5 text-[#3B82F6]" />, color: 'bg-blue-500/10 text-blue-700 border-blue-300' },
    { id: 'accountant', label: 'Accountant / Auditor', icon: <Briefcase className="w-3.5 h-3.5 text-[#10B981]" />, color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' },
  ];

  const currentRoleObj = rolesList.find(r => r.id === role) || rolesList[0];

  return (
    <>
      <header className="min-h-[72px] py-2.5 px-4 sm:px-6 md:px-10 flex items-center justify-between border-b border-[#e2e2d5] bg-[#fdfbf7] sticky top-0 z-50 transition-all shadow-2xs">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={handleOpenMenu}
            className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-2xl hover:bg-[#f0f0e4]/80 transition-all cursor-pointer group text-left w-full"
            title={lang === 'ur' ? "سیٹنگز اور کنٹرول مینیو کھولیں" : "Click to open System Menu (Language, Notifications, Login, Themes)"}
          >
            <div className="p-2 bg-white border border-[#ecece0] group-hover:border-[#8b9d77] rounded-xl shadow-2xs text-[#5a5a40] shrink-0">
              <Menu className="w-5 h-5 text-[#8b9d77]" />
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-sm select-none shrink-0 bg-white border border-[#c59b27]/60 overflow-hidden">
              {!logoErr ? (
                <img src="logo.png" alt="Logo" className="w-full h-full object-contain p-0.5" onError={() => setLogoErr(true)} />
              ) : (
                <AlHadiLogo className="w-10 h-10 sm:w-11 sm:h-11" />
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 leading-tight">
                <span className="text-sm sm:text-base md:text-lg font-serif font-bold tracking-tight text-[#4a4a35] group-hover:text-[#8b9d77] transition-colors whitespace-nowrap">
                  Al-Hadi Goods Samundri
                </span>
                <span className="hidden sm:inline text-gray-300">|</span>
                <span className="text-sm sm:text-base font-serif font-bold text-[#8b9d77] whitespace-nowrap">
                  الھادی گڈز سمندری
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#8e8e75] font-sans font-medium mt-0.5 truncate">
                Official Cargo, Transport & Nationwide Logistics Fleet
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* Top Left Menu Side Drawer (Triggered by clicking top-left icon) */}
      {isMenuOpen && (
        <div onClick={handleCloseMenu} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-start animate-in fade-in duration-200">
          <div onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-sm h-full shadow-2xl border-r border-[#ecece0] flex flex-col justify-between animate-in slide-in-from-left duration-300">
            <div>
              {/* Drawer Header */}
              <div className="p-6 bg-[#fdfbf7] border-b border-[#ecece0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
                    {!logoErr ? <img src="logo.png" className="w-full h-full object-cover rounded-full" /> : <AlHadiLogo className="w-10 h-10" />}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#4a4a35]">{t.appTitle}</h3>
                    <p className="text-[10px] text-[#8b9d77] font-sans uppercase tracking-wider">{lang === 'ur' ? 'سستم کنٹرول مینیو' : 'System Controls Menu'}</p>
                  </div>
                </div>
                <button onClick={handleCloseMenu} className="p-2 rounded-full bg-[#f0f0e4] hover:bg-[#e2e2d5] text-[#5a5a40] cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Controls Stack */}
              <div className="p-6 space-y-5">
                {/* Language Control */}
                <div className="p-4 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-white border border-[#ecece0] shadow-2xs">
                      <Globe className="w-5 h-5 text-[#8b9d77]" />
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm text-[#4a4a35]">{lang === 'ur' ? 'زبان تبدیل کریں' : 'App Language'}</div>
                      <div className="text-xs text-[#8e8e75]">{lang === 'ur' ? 'اردو / English' : 'English / Urdu'}</div>
                    </div>
                  </div>
                  <button
                    onClick={onToggleLang}
                    className="px-4 py-2 rounded-xl bg-[#8b9d77] hover:bg-[#798a67] text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95"
                  >
                    {lang === 'en' ? 'اردو (UR)' : 'ENG (EN)'}
                  </button>
                </div>

                {/* Notifications Control */}
                <div className="p-4 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-white border border-[#ecece0] shadow-2xs relative">
                      <Bell className="w-5 h-5 text-[#8b9d77]" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm text-[#4a4a35]">{lang === 'ur' ? 'نوٹیفیکیشنز' : 'Notifications'}</div>
                      <div className="text-xs text-[#8e8e75]">{unreadCount} {lang === 'ur' ? 'نئے الرٹس' : 'unread alerts'}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleCloseMenu();
                      setShowNotifs(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#f0f0e4] hover:bg-[#e2e2d5] text-[#5a5a40] font-bold text-xs cursor-pointer"
                  >
                    {lang === 'ur' ? 'دیکھیں' : 'View Alerts'}
                  </button>
                </div>

                {/* Themes & Appearance Control */}
                <div className="p-4 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-white border border-[#ecece0] shadow-2xs">
                      <Palette className="w-5 h-5 text-[#8b9d77]" />
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm text-[#4a4a35]">{lang === 'ur' ? 'ایپ تھیم اور رنگ' : 'Theme & Appearance'}</div>
                      <div className="text-xs text-[#8e8e75]">{lang === 'ur' ? 'روشنی / ڈارک موڈ' : 'Select UI display theme'}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <button
                      onClick={() => setThemePref('light')}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${themePref === 'light' ? 'bg-[#8b9d77] text-white shadow-xs' : 'bg-white border border-[#ecece0] text-[#5a5a40] hover:bg-[#f0f0e4]'}`}
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>{lang === 'ur' ? 'روشن' : 'Light'}</span>
                    </button>
                    <button
                      onClick={() => setThemePref('dark')}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${themePref === 'dark' ? 'bg-[#1e3a68] text-white shadow-xs' : 'bg-white border border-[#ecece0] text-[#5a5a40] hover:bg-[#f0f0e4]'}`}
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>{lang === 'ur' ? 'ڈارک' : 'Dark'}</span>
                    </button>
                    <button
                      onClick={() => setThemePref('system')}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${themePref === 'system' ? 'bg-[#4a4a35] text-white shadow-xs' : 'bg-white border border-[#ecece0] text-[#5a5a40] hover:bg-[#f0f0e4]'}`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>{lang === 'ur' ? 'آٹو' : 'Auto'}</span>
                    </button>
                  </div>
                </div>

                {/* Network Status / Offline Mode */}
                <div className="p-4 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl border shadow-2xs ${isOffline ? 'bg-[#EF4444]/10 border-[#EF4444]/30' : 'bg-white border-[#ecece0]'}`}>
                        {isOffline ? <WifiOff className="w-5 h-5 text-[#EF4444]" /> : <Wifi className="w-5 h-5 text-[#10B981]" />}
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm text-[#4a4a35]">{lang === 'ur' ? 'نیٹ ورک کنکشن' : 'Sync Status'}</div>
                        <div className="text-xs text-[#8e8e75]">{isOffline ? (lang === 'ur' ? 'آف لائن موڈ فعال' : 'Offline Mode Active') : (lang === 'ur' ? 'سرور سے متصل' : 'Connected Online')}</div>
                      </div>
                    </div>
                    <button
                      onClick={onToggleOffline}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs cursor-pointer ${isOffline ? 'bg-[#EF4444] text-white' : 'bg-[#10B981]/15 text-[#10B981]'}`}
                    >
                      {isOffline ? (lang === 'ur' ? 'آن لائن کریں' : 'Go Online') : (lang === 'ur' ? 'آف لائن موڈ' : 'Offline Mode')}
                    </button>
                  </div>
                  {offlineCount > 0 && (
                    <button
                      onClick={onSyncOffline}
                      className="w-full py-2 px-3 rounded-xl bg-[#EAB308] hover:bg-[#CA8A04] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{lang === 'ur' ? `${offlineCount} آف لائن ریکارڈز سنک کریں` : `Sync ${offlineCount} Queued Records`}</span>
                    </button>
                  )}
                </div>

                {/* Auth & Role Section */}
                <div className="p-4 rounded-3xl bg-[#fdfbf7] border border-[#ecece0]">
                  {userEmail ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-[#4a4a35]">{userEmail}</div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-bold mt-1 ${currentRoleObj.color}`}>
                            {currentRoleObj.icon}
                            <span>{role}</span>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleCloseMenu();
                          onSignOut();
                        }}
                        className="w-full py-2 rounded-xl bg-[#fee2e2] hover:bg-[#fecaca] text-[#dc2626] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{lang === 'ur' ? 'لاگ آؤٹ کریں' : 'Sign Out'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="text-xs text-[#8e8e75]">{lang === 'ur' ? 'محفوظ کلاؤڈ بیک اپ کے لیے لاگ ان کریں' : 'Log in for cloud data backup and role controls'}</div>
                      <button
                        onClick={() => {
                          handleCloseMenu();
                          onSignIn();
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#1e3a68] hover:bg-[#162a4d] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Shield className="w-4 h-4 text-[#8b9d77]" />
                        <span>{lang === 'ur' ? 'محفوظ لاگ ان کریں' : 'Secure Login / Sign Up'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#f0f0e4] border-t border-[#ecece0] text-center text-xs text-[#8e8e75]">
              Al-Hadi Goods Samundri · v2.4 Pro
            </div>
          </div>
        </div>
      )}

      {/* Firebase Notifications Drawer / Modal */}
      {showNotifs && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-end p-4 sm:p-6 pt-24">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl border border-[#ecece0] overflow-hidden animate-in fade-in slide-in-from-top-5">
            <div className="p-5 bg-[#363626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#8b9d77] flex items-center justify-center text-xs">🔥</div>
                <div>
                  <h3 className="font-serif font-bold text-sm">Firebase Push Feed</h3>
                  <p className="text-[10px] text-[#c2c2a3] font-mono">LIVE CLOUD MESSAGING</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3 h-3 text-[#8b9d77]" />
                    <span>Clear</span>
                  </button>
                )}
                <button onClick={() => setShowNotifs(false)} className="text-white/60 hover:text-white p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[380px] overflow-y-auto p-4 space-y-3 bg-[#fdfbf7]">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8e8e75]">No cloud alerts received.</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-2xl border transition-all text-left ${n.unread ? 'bg-white border-[#8b9d77]/40 shadow-xs ring-1 ring-[#8b9d77]/20' : 'bg-[#f0f0e4]/50 border-[#ecece0] opacity-75'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-serif font-bold text-xs text-[#4a4a35]">{n.title}</span>
                      <span className="text-[9px] font-mono text-[#8e8e75] shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#6b6b55] font-sans leading-relaxed">{n.message}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold bg-[#8b9d77]/15 text-[#5a5a40]">
                        {n.type} alert
                      </span>
                      {n.unread && <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-[#f0f0e4] border-t border-[#ecece0] text-center text-[10px] font-mono text-[#8e8e75]">
              Connected to FCM Asia-South Cluster
            </div>
          </div>
        </div>
      )}
    </>
  );
};


