import React, { useState } from 'react';
import { DICTIONARY, FuelLogItem, Language } from '../../types';
import { Fuel, TrendingUp, CalendarDays, CheckCircle2 } from 'lucide-react';

interface FuelLogViewProps {
  lang: Language;
  fuelLogs: FuelLogItem[];
  onLogFuelPrice: (diesel?: number, petrol?: number, cng?: number) => void;
}

export const FuelLogView: React.FC<FuelLogViewProps> = ({
  lang,
  fuelLogs,
  onLogFuelPrice
}) => {
  const t = DICTIONARY[lang].fuel;
  const [diesel, setDiesel] = useState('289.5');
  const [petrol, setPetrol] = useState('279.0');
  const [cng, setCng] = useState('220.0');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const dVal = parseFloat(diesel) || undefined;
    const pVal = parseFloat(petrol) || undefined;
    const cVal = parseFloat(cng) || undefined;

    if (!dVal && !pVal && !cVal) return;
    onLogFuelPrice(dVal, pVal, cVal);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full space-y-8">
      
      {/* Top Card: Log Today's Price */}
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-[#ecece0] space-y-6">
        <header className="border-b border-[#ecece0] pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4a4a35]">
              {t.title}
            </h1>
            <p className="text-sm text-[#8e8e75] font-sans mt-1">
              Keep historic diary of Pakistan petroleum prices for auditing
            </p>
          </div>
          <div className="w-12 h-12 bg-[#f0f0e4] rounded-full flex items-center justify-center text-[#5a5a40]">
            <Fuel className="w-6 h-6 text-[#8b9d77]" />
          </div>
        </header>

        <form onSubmit={handleSave} className="space-y-6 pt-2">
          <h3 className="font-serif font-bold text-lg text-[#4a4a35] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8b9d77]"></span>
            {t.logTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[#fdfbf7] rounded-2xl border border-[#ecece0] focus-within:border-[#8b9d77] transition-colors">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-2 flex items-center justify-between">
                <span>🛢️ High Speed Diesel</span>
                <span className="text-[10px] font-mono text-[#8b9d77]">PKR/L</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={diesel}
                onChange={(e) => setDiesel(e.target.value)}
                placeholder="289.5"
                className="w-full bg-white border border-[#ecece0] rounded-xl px-3.5 py-2.5 text-base font-bold font-mono text-[#4a4a35] focus:outline-none focus:border-[#8b9d77]"
              />
            </div>

            <div className="p-4 bg-[#fdfbf7] rounded-2xl border border-[#ecece0] focus-within:border-[#8b9d77] transition-colors">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-2 flex items-center justify-between">
                <span>⛽ Super Petrol</span>
                <span className="text-[10px] font-mono text-[#8b9d77]">PKR/L</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={petrol}
                onChange={(e) => setPetrol(e.target.value)}
                placeholder="279.0"
                className="w-full bg-white border border-[#ecece0] rounded-xl px-3.5 py-2.5 text-base font-bold font-mono text-[#4a4a35] focus:outline-none focus:border-[#8b9d77]"
              />
            </div>

            <div className="p-4 bg-[#fdfbf7] rounded-2xl border border-[#ecece0] focus-within:border-[#8b9d77] transition-colors">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-2 flex items-center justify-between">
                <span>🔵 Compressed CNG</span>
                <span className="text-[10px] font-mono text-[#8b9d77]">PKR/kg</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={cng}
                onChange={(e) => setCng(e.target.value)}
                placeholder="220.0"
                className="w-full bg-white border border-[#ecece0] rounded-xl px-3.5 py-2.5 text-base font-bold font-mono text-[#4a4a35] focus:outline-none focus:border-[#8b9d77]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            {savedSuccess ? (
              <div className="px-6 py-4 bg-[#f9f9f2] border border-[#8b9d77] rounded-full text-xs font-bold text-[#5a5a40] flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-[#8b9d77]" />
                <span>Market Diary Updated!</span>
              </div>
            ) : (
              <button
                type="submit"
                className="px-8 py-4 bg-[#5a5a40] hover:bg-[#4a4a35] text-white rounded-full font-medium text-xs uppercase tracking-widest shadow-xs transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Fuel className="w-4 h-4 text-[#8b9d77]" />
                <span>{t.saveBtn}</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Bottom Card: Price Trend Diary */}
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-[#ecece0] space-y-6">
        <div className="flex items-center justify-between border-b border-[#ecece0] pb-4">
          <h3 className="font-serif font-bold text-xl text-[#4a4a35] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#8b9d77]" />
            <span>{t.trendTitle}</span>
          </h3>
          <span className="text-xs text-[#8e8e75] uppercase tracking-wider font-bold">
            {fuelLogs.length} Entries
          </span>
        </div>

        {fuelLogs.length === 0 ? (
          <div className="p-16 text-center bg-[#fdfbf7] rounded-3xl border border-[#ecece0]">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30 text-[#8b9d77]" />
            <p className="font-serif italic text-lg text-[#5a5a40]">{t.empty}</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {fuelLogs.map((item, idx) => (
              <div
                key={item.id}
                className={`p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  idx === 0
                    ? 'bg-[#fdfbf7] border-l-4 border-[#8b9d77] border-y border-r border-[#ecece0] shadow-2xs'
                    : 'bg-white border border-[#ecece0] hover:border-[#8b9d77]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#f0f0e4] rounded-2xl text-[#5a5a40] shrink-0">
                    <CalendarDays className="w-4 h-4 text-[#8b9d77]" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-[#4a4a35] block">{item.date}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8e8e75]">
                      {idx === 0 ? '● Latest Market Log' : 'Historic Log'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono font-bold bg-white sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-[#ecece0] sm:border-none justify-around sm:justify-end">
                  {item.diesel && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f9f9f2] rounded-xl border border-[#ecece0]">
                      <span>🛢️</span>
                      <span className="text-[#5a5a40]">PKR {item.diesel}</span>
                    </div>
                  )}
                  {item.petrol && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f9f9f2] rounded-xl border border-[#ecece0]">
                      <span>⛽</span>
                      <span className="text-[#5a5a40]">PKR {item.petrol}</span>
                    </div>
                  )}
                  {item.cng && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#f9f9f2] rounded-xl border border-[#ecece0]">
                      <span>🔵</span>
                      <span className="text-[#5a5a40]">PKR {item.cng}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
