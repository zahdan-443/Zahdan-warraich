import React, { useState } from 'react';
import { Globe, LogIn, LogOut, Bell, Wifi, WifiOff, RefreshCw, Shield, Users, CheckCheck, X, Crown, Truck, Briefcase } from 'lucide-react';
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
  onSyncOffline
}) => {
  const t = DICTIONARY[lang];
  const [logoErr, setLogoErr] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const rolesList: { id: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'owner', label: 'Owner / Fleet Lead', icon: <Crown className="w-3.5 h-3.5 text-[#EAB308]" />, color: 'bg-amber-500/10 text-amber-700 border-amber-300' },
    { id: 'driver', label: 'Driver / Highway Op', icon: <Truck className="w-3.5 h-3.5 text-[#3B82F6]" />, color: 'bg-blue-500/10 text-blue-700 border-blue-300' },
    { id: 'accountant', label: 'Accountant / Auditor', icon: <Briefcase className="w-3.5 h-3.5 text-[#10B981]" />, color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' },
  ];

  const currentRoleObj = rolesList.find(r => r.id === role) || rolesList[0];

  return (
    <>
      <header className="h-20 px-4 sm:px-8 md:px-12 flex items-center justify-between border-b border-[#e2e2d5] bg-[#fdfbf7] sticky top-0 z-50 transition-all shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm select-none shrink-0">
            {!logoErr ? (
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" onError={() => setLogoErr(true)} />
            ) : (
              <AlHadiLogo className="w-10 h-10" />
            )}
          </div>
          <div className="hidden xs:block">
            <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold tracking-tight text-[#4a4a35] leading-none flex items-center gap-1.5">
              <span>{t.appTitle}</span>
              <span className="text-[#8b9d77] italic font-normal">{t.appTitleHighlight}</span>
            </h1>
            <p className="text-[9px] md:text-xs text-[#8e8e75] uppercase tracking-wider font-sans mt-0.5">
              {t.appSub}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          
          {/* Offline Mode Sync Queue Indicator */}
          <div className="flex items-center gap-1 bg-[#f0f0e4] p-1 rounded-full border border-[#ecece0] text-xs font-mono">
            <button
              onClick={onToggleOffline}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer ${isOffline ? 'bg-[#EF4444] text-white shadow-xs' : 'text-[#5a5a40] hover:bg-white'}`}
              title={isOffline ? "Simulated Offline Mode Active. Click to reconnect." : "Simulate Offline Mode (Network disconnection)"}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-[#10B981]" />}
              <span className="hidden lg:inline text-[10px] uppercase font-bold">{isOffline ? 'Offline' : 'Online'}</span>
            </button>
            {offlineCount > 0 && (
              <button
                onClick={onSyncOffline}
                className="px-2 py-1 rounded-full bg-[#EAB308] hover:bg-[#CA8A04] text-white flex items-center gap-1 animate-pulse cursor-pointer shadow-2xs"
                title="Sync queued offline records to server"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span className="text-[10px] font-bold">{offlineCount}</span>
              </button>
            )}
          </div>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer shadow-2xs transition-all ${currentRoleObj.color} bg-white`}
              title="Switch User Role Persona"
            >
              {currentRoleObj.icon}
              <span className="hidden md:inline font-bold uppercase tracking-wider text-[10px]">{role}</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#ecece0] py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#8e8e75] font-mono font-bold border-b border-[#ecece0]">
                  👤 Select User Role
                </div>
                {rolesList.map(r => (
                  <button
                    key={r.id}
                    onClick={() => { onSelectRole(r.id); setShowRoleMenu(false); }}
                    className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2.5 hover:bg-[#f9f9f2] transition-colors cursor-pointer ${role === r.id ? 'font-bold text-[#8b9d77]' : 'text-[#4a4a35]'}`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Firebase Push Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-full border border-[#ecece0] bg-white hover:border-[#8b9d77] text-[#5a5a40] transition-colors cursor-pointer relative shadow-2xs"
              title="Firebase Push Notifications"
            >
              <Bell className="w-4 h-4 text-[#4a4a35]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center animate-bounce shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ecece0] bg-white text-[#5a5a40] text-xs font-medium uppercase tracking-widest hover:border-[#8b9d77] hover:text-[#8b9d77] shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
            title="Toggle Language / Zubaan"
          >
            <Globe className="w-3.5 h-3.5 text-[#8b9d77]" />
            <span className="font-bold text-[11px]">{lang === 'en' ? 'UR' : 'EN'}</span>
          </button>

          {/* Gmail Auth */}
          {userEmail ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#e2e2d5]">
              <div className="hidden xl:flex flex-col text-right text-xs">
                <span className="font-medium text-[#4a4a35] truncate max-w-[100px]">{userEmail.split('@')[0]}</span>
                <span className="text-[8px] font-mono text-[#8b9d77] font-bold">GMAIL VERIFIED</span>
              </div>
              <button
                onClick={onSignOut}
                className="p-2 rounded-full bg-[#f0f0e4] hover:bg-[#e2e2d5] text-[#5a5a40] transition-colors cursor-pointer"
                title="Sign Out Gmail"
              >
                <LogOut className="w-4 h-4 text-[#dc2626]" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ea4335] hover:bg-[#d33426] text-white text-xs font-medium uppercase tracking-wider shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
              title="Sign up / Sign in with Gmail"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Gmail Sign In</span>
            </button>
          )}
        </div>
      </header>

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

