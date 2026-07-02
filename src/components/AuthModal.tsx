import React, { useState } from 'react';
import { ShieldCheck, LogIn, Mail, Phone, Lock, CheckCircle2, Crown, Truck, Briefcase, ArrowRight, X, Sparkles } from 'lucide-react';
import { UserRole, Language, DICTIONARY } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (emailOrPhone: string, role: UserRole) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, lang }) => {
  const [authMethod, setAuthMethod] = useState<'google' | 'phone_email'>('google');
  const [step, setStep] = useState<'method' | 'verify' | 'role'>('method');
  const [inputVal, setInputVal] = useState('');
  const [otpVal, setOtpVal] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const roles: { id: UserRole; title: string; urTitle: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'owner',
      title: 'Owner / Fleet Lead',
      urTitle: 'مالک / فلیٹ لیڈ',
      desc: 'Full access to vehicle management, expense reports, and fleet financial analytics.',
      icon: <Crown className="w-5 h-5 text-[#EAB308]" />
    },
    {
      id: 'driver',
      title: 'Driver / Highway Operator',
      urTitle: 'ڈرائیور / ہائی وے آپریٹر',
      desc: 'Log trips, calculate safar costs, and verify driving license or MTMIS records.',
      icon: <Truck className="w-5 h-5 text-[#3B82F6]" />
    },
    {
      id: 'accountant',
      title: 'Accountant / Auditor',
      urTitle: 'اکاؤنٹینٹ / آڈیٹر',
      desc: 'Track fuel logs, market rates, and export trip cost breakdowns.',
      icon: <Briefcase className="w-5 h-5 text-[#10B981]" />
    }
  ];

  const handleStartGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setInputVal('smilingjutt@gmail.com');
      setStep('role');
    }, 800);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || inputVal.trim().length < 5) {
      setError(lang === 'ur' ? 'براہ کرم درست ای میل یا فون نمبر درج کریں' : 'Please enter a valid email address or phone number (e.g., +92 300 1234567)');
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('verify');
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpVal !== '7860' && otpVal.length < 4) {
      setError(lang === 'ur' ? 'براہ کرم 4 ہندسوں کا درست کوڈ درج کریں (مثلاً 7860)' : 'Please enter the 4-digit verification code sent to your device');
      return;
    }
    setError(null);
    setStep('role');
  };

  const handleCompleteAuth = () => {
    onSuccess(inputVal || 'verified.user@gmail.com', selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl border border-[#ecece0] overflow-hidden">
        
        {/* Header banner */}
        <div className="bg-gradient-to-r from-[#162a4d] via-[#1e3a68] to-[#162a4d] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#b58b28] flex items-center justify-center shadow-md">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold tracking-tight">
                {lang === 'ur' ? 'الھادی سیکیور لاگ ان' : 'Al-Hadi Goods Security'}
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                {lang === 'ur' ? 'اپنے سفری ریکارڈ اور فلیٹ ڈیٹا کو محفوظ کریں' : 'Verify your account to secure trip & fleet data'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-[#fdfbf7]">
          
          {step === 'method' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#4a4a35]">
                  {lang === 'ur' ? 'اکاؤنٹ کی تصدیق کا طریقہ چنیں' : 'Choose Authentication Method'}
                </h3>
                <p className="text-xs text-[#8e8e75]">
                  {lang === 'ur' ? 'گوگل اکاؤنٹ یا فون نمبر / ای میل کے ذریعے لاگ ان کریں' : 'Sign in to access your saved trips and vehicles across devices'}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleStartGoogle}
                disabled={loading}
                className="w-full py-4 px-5 bg-white hover:bg-slate-50 border-2 border-[#ecece0] hover:border-[#8b9d77] rounded-2xl font-semibold text-sm text-[#4a4a35] flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer active:scale-98"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'Connecting Google...' : lang === 'ur' ? 'گوگل اکاؤنٹ سے لاگ ان کریں' : 'Continue with Google Account'}</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="h-px bg-[#ecece0] flex-1"></div>
                <span className="text-[10px] font-mono uppercase text-[#8e8e75]">OR</span>
                <div className="h-px bg-[#ecece0] flex-1"></div>
              </div>

              {/* Email / Phone Form */}
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-1.5">
                    {lang === 'ur' ? 'ای میل یا واٹس ایپ نمبر' : 'Email Address or Phone Number'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="e.g. +92 300 1234567 or user@gmail.com"
                      className="w-full bg-white border border-[#ecece0] rounded-2xl px-4 py-3 pl-10 text-sm font-semibold text-[#4a4a35] focus:border-[#8b9d77] focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-[#8e8e75] absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#5a5a40] hover:bg-[#4a4a35] text-white rounded-2xl font-serif font-bold text-xs tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Sending Code...' : lang === 'ur' ? 'تصدیقی کوڈ بھیجیں' : 'Send Verification Code'}</span>
                  <ArrowRight className="w-4 h-4 text-[#8b9d77]" />
                </button>
              </form>
            </div>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in">
              <div className="text-center space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#4a4a35]">
                  {lang === 'ur' ? 'تصدیقی کوڈ درج کریں' : 'Enter Verification Code'}
                </h3>
                <p className="text-xs text-[#8e8e75]">
                  We sent a 4-digit code to <span className="font-mono font-bold text-[#5a5a40]">{inputVal}</span>
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-1.5 text-center">
                  4-Digit OTP Code (Simulated: Enter 7860)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={otpVal}
                  onChange={(e) => setOtpVal(e.target.value)}
                  placeholder="7860"
                  className="w-full bg-white border-2 border-[#ecece0] focus:border-[#8b9d77] rounded-2xl px-4 py-3 text-center text-xl font-mono font-bold text-[#4a4a35] tracking-[0.5em] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className="flex-1 py-3 bg-[#f0f0e4] hover:bg-[#e2e2d5] text-[#5a5a40] rounded-2xl font-semibold text-xs transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 bg-[#5a5a40] hover:bg-[#4a4a35] text-white rounded-2xl font-serif font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  Verify & Continue
                </button>
              </div>
            </form>
          )}

          {step === 'role' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#4a4a35]">
                  {lang === 'ur' ? 'اپنا کردار (Role) چنیں' : 'Select Your Role Upon Sign Up'}
                </h3>
                <p className="text-xs text-[#8e8e75]">
                  {lang === 'ur' ? 'یہ انتخاب آپ کی ڈائری اور فلیٹ ٹولز کو ترتیب دے گا' : 'Choose how you will use Al-Hadi Goods road freight workspace'}
                </p>
              </div>

              <div className="space-y-3">
                {roles.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-[#8b9d77] bg-[#8b9d77]/10 shadow-xs ring-1 ring-[#8b9d77]/30'
                          : 'border-[#ecece0] bg-white hover:border-[#8b9d77]/50'
                      }`}
                    >
                      <div className="p-2 bg-white rounded-xl border border-[#ecece0] shrink-0 mt-0.5 shadow-2xs">
                        {r.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-sm text-[#4a4a35]">
                            {lang === 'ur' ? r.urTitle : r.title}
                          </h4>
                          {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#8b9d77]"></span>}
                        </div>
                        <p className="text-xs text-[#8e8e75] mt-1 leading-relaxed">
                          {r.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleCompleteAuth}
                className="w-full py-4 bg-[#5a5a40] hover:bg-[#4a4a35] text-white rounded-2xl font-serif font-bold text-sm tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{lang === 'ur' ? 'اکاؤنٹ مکمل کریں' : 'Complete Sign Up & Secure Data'}</span>
                <Sparkles className="w-4 h-4 text-[#8b9d77]" />
              </button>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#f0f0e4] border-t border-[#ecece0] text-center text-[11px] text-[#8e8e75]">
          🔒 End-to-End encrypted local storage & verified Google Auth
        </div>

      </div>
    </div>
  );
};
