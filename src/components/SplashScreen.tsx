import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { AlHadiLogo } from './AlHadiLogo';
import { Car, Calculator, ShieldCheck, FileText, UserCheck, X } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
  onSelectTab?: (tab: ActiveTab) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss, onSelectTab }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth loading animation
    const startTime = Date.now();
    const duration = 3500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        onDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onDismiss]);

  const handleActionClick = (tab: ActiveTab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else {
      onDismiss();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8f9fc] text-[#162a4d] flex flex-col items-center justify-between p-6 sm:p-8 select-none overflow-y-auto font-sans">
      
      {/* Top Right Dismiss Button */}
      <div className="w-full max-w-md flex justify-end shrink-0 pt-2">
        <button
          onClick={onDismiss}
          className="p-2 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 transition-colors cursor-pointer flex items-center gap-1 text-xs px-3 font-mono uppercase"
          title="Skip to Dashboard"
        >
          <span>Skip</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content Area Matching input_file_1.png */}
      <div className="my-auto flex flex-col items-center text-center w-full max-w-md py-4 space-y-4">
        
        {/* Emblem Logo */}
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <AlHadiLogo className="w-48 h-48 sm:w-56 sm:h-56 mx-auto" />
        </div>

        {/* Horizontal Decorative Separator Pill */}
        <div className="w-56 sm:w-64 h-3 sm:h-3.5 bg-gradient-to-r from-[#c59b27] via-[#162a4d] to-[#0b162a] rounded-full shadow-md my-2 animate-pulse" />

        {/* Title Typography */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#b58b28] tracking-tight">
            Al-Hadi Goods
          </h1>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#162a4d]">
            الحادی گڈز
          </h2>
        </div>

        {/* 4 Prominent Menu Action Cards */}
        <div className="w-full space-y-3 pt-4">
          
          {/* Card 1: Vehicle Trip Calculator */}
          <div
            onClick={() => handleActionClick('calculator')}
            className="bg-gradient-to-r from-[#c59b27] via-[#162a4d] to-[#c59b27] p-[2px] rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-98"
          >
            <div className="bg-white px-4 py-3 rounded-[14px] flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#f8f6f0] border border-[#e5dfd0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform relative">
                <Car className="w-6 h-6 text-[#162a4d]" />
                <Calculator className="w-3.5 h-3.5 text-[#c59b27] absolute bottom-1 right-1 bg-white rounded-full" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-bold text-[#162a4d] font-sans tracking-tight">
                  Vehicle Trip Calculator
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-[#162a4d] mt-0.5">
                  گاڑی کے سفر کا کیلکولیٹر
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Government Vehicle Verification */}
          <div
            onClick={() => handleActionClick('verify')}
            className="bg-gradient-to-r from-[#10b981] via-[#162a4d] to-[#c59b27] p-[2px] rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-98"
          >
            <div className="bg-white px-4 py-3 rounded-[14px] flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-[#10b981]" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-bold text-[#162a4d] font-sans tracking-tight">
                  Government Vehicle Verification
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-[#162a4d] mt-0.5">
                  گورنمنٹ گاڑی کی تصدیق
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: E-CHALLAN Checking */}
          <div
            onClick={() => handleActionClick('verify')}
            className="bg-gradient-to-r from-[#3b82f6] via-[#162a4d] to-[#c59b27] p-[2px] rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-98"
          >
            <div className="bg-white px-4 py-3 rounded-[14px] flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-bold text-[#162a4d] font-sans tracking-tight">
                  E-CHALLAN Checking
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-[#162a4d] mt-0.5">
                  ای-چالان چیکنگ
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: License Verification */}
          <div
            onClick={() => handleActionClick('verify')}
            className="bg-gradient-to-r from-[#f59e0b] via-[#162a4d] to-[#c59b27] p-[2px] rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-98"
          >
            <div className="bg-white px-4 py-3 rounded-[14px] flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-bold text-[#162a4d] font-sans tracking-tight">
                  License Verification
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-[#162a4d] mt-0.5">
                  لائسنس کی تصدیق
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Powered By Footer */}
      <div className="w-full max-w-md text-center space-y-2 shrink-0 pt-4 pb-2">
        <div className="flex items-center justify-center gap-3 text-[11px] uppercase font-mono tracking-[0.2em] text-slate-400">
          <span className="w-10 h-[1px] bg-slate-300"></span>
          <span>powered by</span>
          <span className="w-10 h-[1px] bg-slate-300"></span>
        </div>
        <div className="text-2xl font-bold font-sans tracking-wide text-[#162a4d]">
          loading<span className="text-[#c59b27] animate-pulse">...</span>
        </div>
        
        {/* Subtle Progress Bar */}
        <div className="w-36 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-[#c59b27] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

    </div>
  );
};
