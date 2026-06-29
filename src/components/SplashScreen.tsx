import React, { useState, useEffect } from 'react';
import { Truck, Shield, Image as ImageIcon, Sparkles, X, Info } from 'lucide-react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [showSpecs, setShowSpecs] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [splashLoaded, setSplashLoaded] = useState(false);

  useEffect(() => {
    // Check if user uploaded a custom splash screen photo in /public/splash.png
    const img = new Image();
    img.src = '/splash.png';
    img.onload = () => setSplashLoaded(true);

    const logo = new Image();
    logo.src = '/logo.png';
    logo.onload = () => setLogoLoaded(true);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#363626] text-[#fdfbf7] flex flex-col items-center justify-between p-8 select-none overflow-y-auto">
      
      {/* Optional Custom Uploaded Splash Image Background */}
      {splashLoaded && (
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img src="/splash.png" alt="Splash Background" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="w-full flex justify-end z-10">
        <button
          onClick={() => setShowSpecs(!showSpecs)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4a4a35] hover:bg-[#5a5a40] text-xs font-mono tracking-wider transition-colors cursor-pointer border border-[#6b7c5b]/40 shadow-xs"
        >
          <Info className="w-3.5 h-3.5 text-[#8b9d77]" />
          <span>Photo Size Specs</span>
        </button>
      </div>

      <div className="my-auto flex flex-col items-center text-center max-w-md space-y-6 z-10 py-8">
        <div className="relative">
          <div className="w-28 h-28 bg-[#8b9d77] rounded-[32px] flex items-center justify-center shadow-2xl border-2 border-[#a3b68f] mx-auto overflow-hidden">
            {logoLoaded ? (
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Truck className="w-14 h-14 text-white animate-pulse" />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#5a5a40] text-[#f0f0e4] px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest border border-[#8b9d77] shadow-md">
            v1.0.4
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-white">
            Al-Hadi <span className="text-[#8b9d77] italic">Goods</span>
          </h1>
          <p className="text-sm font-sans tracking-widest uppercase text-[#c2c2a3]">
            Road Freight Toolkit
          </p>
        </div>

        <p className="text-xs text-[#a0a084] max-w-xs leading-relaxed font-sans">
          Streamlining logistics, trip calculations, fleet records, and driver verification.
        </p>

        {showSpecs && (
          <div className="p-5 rounded-2xl bg-[#28281c] border border-[#8b9d77]/40 text-left space-y-3 text-xs w-full animate-in fade-in shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-[#8b9d77] font-bold">📐 RECOMMENDED PHOTO SIZES</span>
              <button onClick={() => setShowSpecs(false)} className="text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-[#d1d1b8] font-sans">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                <span><b>App Logo</b> (logo.png)</span>
                <span className="font-mono bg-[#8b9d77]/20 text-[#a3b68f] px-2 py-0.5 rounded text-[11px]">512 x 512 px</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                <span><b>Splash Screen</b> (splash.png)</span>
                <span className="font-mono bg-[#8b9d77]/20 text-[#a3b68f] px-2 py-0.5 rounded text-[11px]">1080 x 1920 px</span>
              </div>
              <p className="text-[11px] text-[#8e8e75] pt-1">
                💡 Upload photos directly to the <code>/public</code> directory in the code editor to automatically replace default placeholders.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs space-y-4 z-10 mb-4">
        <button
          onClick={onDismiss}
          className="w-full py-4 bg-[#8b9d77] hover:bg-[#7a8c66] text-white rounded-full font-medium text-xs uppercase tracking-[0.2em] shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 group"
        >
          <span>Enter Toolkit</span>
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        </button>

        <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-mono tracking-widest text-[#8e8e75]">
          <Shield className="w-3 h-3 text-[#8b9d77]" />
          <span>Secure Punjab Freight Network</span>
        </div>
      </div>
    </div>
  );
};
