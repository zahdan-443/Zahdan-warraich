import React, { useState } from 'react';
import { CalcSubTab, DICTIONARY, FuelType, Language, Trip } from '../../types';
import { Calculator, History, BarChart3, RotateCcw, Share2, Trash2, CheckCircle2, BookmarkPlus, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LiveFuelPriceWidget } from '../LiveFuelPriceWidget';

interface TripCostViewProps {
  lang: Language;
  trips: Trip[];
  onSaveTrip: (tripData: Omit<Trip, 'id' | 'name'>, tripName: string) => void;
  onDeleteTrip: (id: number) => void;
  onClearAllTrips: () => void;
  initialMileage?: number;
  onNavigate?: (tab: any) => void;
}

export const TripCostView: React.FC<TripCostViewProps> = ({
  lang,
  trips,
  onSaveTrip,
  onDeleteTrip,
  onClearAllTrips,
  initialMileage,
  onNavigate
}) => {
  const t = DICTIONARY[lang].calc;
  const [activeSubTab, setActiveSubTab] = useState<CalcSubTab>('calc');

  // Calculator State
  const [fuelType, setFuelType] = useState<FuelType>('diesel');
  const [fuelPrice, setFuelPrice] = useState<string>('311.47');

  const handleSelectFuelType = (type: FuelType) => {
    setFuelType(type);
    if (type === 'diesel') {
      setFuelPrice('311.47');
    } else if (type === 'petrol') {
      setFuelPrice('298.50');
    } else if (type === 'cng') {
      setFuelPrice('235.00');
    }
  };
  const [mileage, setMileage] = useState<string>(initialMileage ? initialMileage.toString() : '9');
  const [distance, setDistance] = useState<string>('350');
  const [toll, setToll] = useState<string>('1200');
  const [loading, setLoading] = useState<string>('0');
  const [driverAllow, setDriverAllow] = useState<string>('2000');
  const [other, setOther] = useState<string>('0');
  const [isReturn, setIsReturn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Result state
  const [lastCalc, setLastCalc] = useState<Omit<Trip, 'id' | 'name'> | null>(null);

  // Save Modal state
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [saveTripName, setSaveTripName] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Handle calculation
  const handleCalculate = () => {
    const p = parseFloat(fuelPrice);
    const m = parseFloat(mileage);
    const d = parseFloat(distance);
    const tVal = parseFloat(toll) || 0;
    const lVal = parseFloat(loading) || 0;
    const drVal = parseFloat(driverAllow) || 0;
    const othVal = parseFloat(other) || 0;

    if (isNaN(p) || isNaN(m) || isNaN(d) || p <= 0 || m <= 0 || d <= 0) {
      setError(lang === 'ur' ? 'براہ کرم قیمت، مائلیج اور فاصلہ درست درج کریں۔' : 'Please input valid positive numbers for Fuel Price, Mileage, and Distance.');
      return;
    }
    setError(null);

    const effDist = isReturn ? d * 2 : d;
    const consumedL = effDist / m;
    const fuelCostVal = consumedL * p;
    const totalCostVal = fuelCostVal + tVal + lVal + drVal + othVal;

    const fuelTypeLabels: Record<FuelType, string> = {
      diesel: 'Diesel 🛢️',
      petrol: 'Petrol ⛽',
      cng: 'CNG 🔵'
    };

    const calcObj: Omit<Trip, 'id' | 'name'> = {
      fuelType: fuelTypeLabels[fuelType],
      fuelTypeRaw: fuelType,
      dist: effDist,
      consumed: consumedL.toFixed(2),
      fuelCost: Math.round(fuelCostVal),
      toll: Math.round(tVal),
      loading: Math.round(lVal),
      driver: Math.round(drVal),
      other: Math.round(othVal),
      total: Math.round(totalCostVal),
      isReturn,
      date: new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' }),
      month: new Date().toLocaleString('default', { month: 'short', year: '2-digit' })
    };

    setLastCalc(calcObj);
    setSaveSuccess(false);
  };

  const handleReset = () => {
    setFuelPrice('');
    setMileage('');
    setDistance('');
    setToll('');
    setLoading('');
    setDriverAllow('');
    setOther('');
    setIsReturn(false);
    setError(null);
    setLastCalc(null);
  };

  const handleOpenSaveModal = () => {
    if (!lastCalc) return;
    setSaveTripName(lang === 'ur' ? 'لاہور ٹرپ' : 'Punjab Freight Trip');
    setShowSaveModal(true);
  };

  const handleConfirmSave = () => {
    if (!lastCalc || !saveTripName.trim()) return;
    onSaveTrip(lastCalc, saveTripName.trim());
    setShowSaveModal(false);
    setSaveSuccess(true);
  };

  const handleWhatsAppShare = (trip: Omit<Trip, 'id'> | Trip, customTitle?: string) => {
    const fmt = (n: number) => 'PKR ' + n.toLocaleString();
    const titleText = customTitle || ('name' in trip ? trip.name : 'Estimated Trip');
    const msg = `🚛 *Al-Hadi Goods — ${titleText}*\n\n` +
      `⛽ Fuel: ${trip.fuelType}\n` +
      `📍 Distance: ${trip.dist} km\n` +
      `🛢️ Est. Fuel Used: ${trip.consumed} L\n` +
      `💰 Fuel Cost: ${fmt(trip.fuelCost)}\n` +
      `🛣️ Motorway Toll: ${fmt(trip.toll)}\n` +
      (trip.loading > 0 ? `📦 Labor: ${fmt(trip.loading)}\n` : '') +
      `👤 Driver Allowance: ${fmt(trip.driver)}\n` +
      `➕ Other: ${fmt(trip.other)}\n\n` +
      `✅ *Total Expense: ${fmt(trip.total)}*\n` +
      `📅 Date: ${trip.date}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleExportPDF = async () => {
    const el = document.getElementById('waybill-print-area');
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#fdfbf7' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 15, pdfWidth, pdfHeight);
      pdf.save(`Waybill_Estimate_${lastCalc?.dist || 0}km.pdf`);
    } catch (err) {
      window.alert("Could not generate PDF waybill.");
    }
  };

  return (
    <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
      
      {/* Header Container */}
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-[#ecece0] mb-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#ecece0]">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4a4a35]">
              {DICTIONARY[lang].calc.title}
            </h1>
            <p className="text-sm text-[#8e8e75] font-sans mt-1">
              Accurate freight logistics cost forecasting for Punjab routes
            </p>
          </div>

          {/* Subtab Switcher */}
          <div className="flex items-center gap-1 sm:gap-2 p-1 bg-[#fdfbf7] rounded-full border border-[#ecece0] w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setActiveSubTab('calc')}
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex-1 sm:flex-none ${
                activeSubTab === 'calc'
                  ? 'bg-[#8b9d77] text-white shadow-xs'
                  : 'text-[#8e8e75] hover:text-[#4a4a35]'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>{t.calculateTab}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('history')}
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex-1 sm:flex-none ${
                activeSubTab === 'history'
                  ? 'bg-[#8b9d77] text-white shadow-xs'
                  : 'text-[#8e8e75] hover:text-[#4a4a35]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{t.historyTab} ({trips.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('summary')}
              className={`flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex-1 sm:flex-none ${
                activeSubTab === 'summary'
                  ? 'bg-[#8b9d77] text-white shadow-xs'
                  : 'text-[#8e8e75] hover:text-[#4a4a35]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.summaryTab}</span>
            </button>
          </div>
        </header>

        {/* ══════════════ SUBTAB 1: CALCULATE ══════════════ */}
        {activeSubTab === 'calc' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <LiveFuelPriceWidget
                compact
                lang={lang}
                onApplyRates={(d, p, c) => {
                  if (fuelType === 'diesel') setFuelPrice(d);
                  else if (fuelType === 'petrol') setFuelPrice(p);
                  else if (c && fuelType === 'cng') setFuelPrice(c);
                }}
              />
              
              <div className="p-6 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] space-y-5">
                <h3 className="font-serif font-bold text-lg text-[#4a4a35] flex items-center gap-2 border-b border-[#ecece0] pb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8b9d77]"></span>
                  {t.fuelDetails}
                </h3>

                {/* Fuel Selector */}
                <div className="grid grid-cols-2 gap-3">
                  {(['diesel', 'petrol'] as FuelType[]).map((f) => {
                    const isSelected = fuelType === f;
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => handleSelectFuelType(f)}
                        className={`py-3 px-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? 'border-[#8b9d77] bg-[#8b9d77]/10 text-[#5a5a40] shadow-2xs'
                            : 'border-[#ecece0] bg-white text-[#8e8e75] hover:border-[#8b9d77]/50'
                        }`}
                      >
                        <span className="text-base">{f === 'diesel' ? '🛢️' : '⛽'}</span>
                        <span>{f}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-2">
                      {t.fuelPrice}
                    </label>
                    <input
                      type="number"
                      value={fuelPrice}
                      onChange={(e) => setFuelPrice(e.target.value)}
                      placeholder="290"
                      className="w-full bg-white border border-[#ecece0] rounded-2xl px-4 py-3 text-sm font-semibold text-[#4a4a35] focus:border-[#8b9d77] focus:outline-none shadow-2xs transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-2">
                      {t.mileage}
                    </label>
                    <input
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="9"
                      className="w-full bg-white border border-[#ecece0] rounded-2xl px-4 py-3 text-sm font-semibold text-[#4a4a35] focus:border-[#8b9d77] focus:outline-none shadow-2xs transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-2">
                    {t.distance}
                  </label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="350"
                    className="w-full bg-white border border-[#ecece0] rounded-2xl px-4 py-3 text-sm font-semibold text-[#4a4a35] focus:border-[#8b9d77] focus:outline-none shadow-2xs transition-all font-mono"
                  />
                </div>

                {/* Update Market Rates Button */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate('fuel');
                    }}
                    className="w-full py-3 bg-[#f0f0e4] hover:bg-[#8b9d77]/20 border border-[#d8d8c0] hover:border-[#8b9d77] text-[#5a5a40] rounded-2xl font-serif font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <span>⚡ {lang === 'ur' ? 'مارکیٹ ریٹ اپ ڈیٹ کریں' : 'Update Market Rates'}</span>
                  </button>
                  <div className="text-[10px] text-center text-[#8e8e75]">
                    Benchmark rates verified via <a href="https://psopk.com/fuel-prices/pol/archives" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#5a5a40] hover:text-[#8b9d77]">PSO POL Archives</a>
                  </div>
                </div>
              </div>

              {/* Route Extras Card */}
              <div className="p-6 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#4a4a35] flex items-center gap-2 border-b border-[#ecece0] pb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d8d8c0]"></span>
                  {t.routeExtras}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-1.5">
                      {t.toll}
                    </label>
                    <input
                      type="number"
                      value={toll}
                      onChange={(e) => setToll(e.target.value)}
                      placeholder="1200"
                      className="w-full bg-white border border-[#ecece0] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#4a4a35] focus:border-[#8b9d77] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-1.5">
                      {t.driverAllowance}
                    </label>
                    <input
                      type="number"
                      value={driverAllow}
                      onChange={(e) => setDriverAllow(e.target.value)}
                      placeholder="2000"
                      className="w-full bg-white border border-[#ecece0] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#4a4a35] focus:border-[#8b9d77] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8e8e75] mb-1.5">
                      {t.otherCosts}
                    </label>
                    <input
                      type="number"
                      value={other}
                      onChange={(e) => setOther(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-[#ecece0] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#4a4a35] focus:border-[#8b9d77] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Return Trip Toggle */}
                <div className="pt-3 flex items-center justify-between p-4 bg-white rounded-2xl border border-[#ecece0]">
                  <div>
                    <div className="text-sm font-serif font-bold text-[#4a4a35]">{t.returnTrip}</div>
                    <div className="text-[11px] text-[#8e8e75]">{t.returnTripSub}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReturn(!isReturn)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      isReturn ? 'bg-[#8b9d77]' : 'bg-[#e2e2d5]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${
                      isReturn ? 'left-6.5' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700">
                  ⚠️ {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="w-full sm:flex-1 py-4 bg-[#5a5a40] text-white rounded-full font-medium text-sm hover:bg-[#4a4a35] shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-[#8b9d77]" />
                  <span>{t.calcBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-4 rounded-full border border-[#ecece0] bg-white text-[#8e8e75] hover:text-[#4a4a35] hover:border-[#8b9d77] text-xs uppercase tracking-widest font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetBtn}</span>
                </button>
              </div>

            </div>

            {/* Results Output Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              {lastCalc ? (
                <div id="waybill-print-area" className="p-8 rounded-[36px] bg-[#fdfbf7] border-2 border-[#8b9d77] shadow-sm flex-1 flex flex-col justify-between animate-fadeIn">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#ecece0] pb-4 mb-6">
                      <span className="text-xs uppercase tracking-widest font-bold text-[#8b9d77]">
                        {t.breakdown}
                      </span>
                      <span className="text-xs font-mono font-bold bg-[#8b9d77]/15 text-[#5a5a40] px-3 py-1 rounded-full">
                        {lastCalc.dist} km
                      </span>
                    </div>

                    <div className="space-y-3.5 text-sm font-sans">
                      <div className="flex justify-between items-center text-[#8e8e75]">
                        <span>Fuel Type:</span>
                        <span className="font-semibold text-[#4a4a35]">{lastCalc.fuelType}</span>
                      </div>

                      <div className="flex justify-between items-center text-[#8e8e75]">
                        <span>{t.fuelUsed}:</span>
                        <span className="font-mono font-bold text-[#4a4a35]">{lastCalc.consumed} L</span>
                      </div>

                      <div className="flex justify-between items-center text-[#8e8e75]">
                        <span>Est. Fuel Expense:</span>
                        <span className="font-mono font-semibold text-[#4a4a35]">PKR {lastCalc.fuelCost.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center text-[#8e8e75]">
                        <span>Toll & Motorway:</span>
                        <span className="font-mono font-semibold text-[#4a4a35]">PKR {lastCalc.toll.toLocaleString()}</span>
                      </div>

                      {lastCalc.loading > 0 && (
                        <div className="flex justify-between items-center text-[#8e8e75]">
                          <span>Loading Labor:</span>
                          <span className="font-mono font-semibold text-[#4a4a35]">PKR {lastCalc.loading.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[#8e8e75]">
                        <span>Driver Allowance:</span>
                        <span className="font-mono font-semibold text-[#4a4a35]">PKR {lastCalc.driver.toLocaleString()}</span>
                      </div>

                      {lastCalc.other > 0 && (
                        <div className="flex justify-between items-center text-[#8e8e75]">
                          <span>Miscellaneous:</span>
                          <span className="font-mono font-semibold text-[#4a4a35]">PKR {lastCalc.other.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Total Box */}
                    <div className="mt-8 p-6 rounded-3xl bg-[#8b9d77] text-white shadow-sm flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest opacity-80 font-bold">
                          {t.totalCost}
                        </div>
                        <div className="text-2xl sm:text-3xl font-serif font-bold mt-1 font-mono">
                          PKR {lastCalc.total.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-xs">
                        💰
                      </div>
                    </div>
                  </div>

                  {/* Actions below result */}
                  <div className="pt-8 space-y-3">
                    {saveSuccess ? (
                      <div className="p-3.5 bg-[#f9f9f2] border border-[#8b9d77] rounded-full text-center text-xs font-bold text-[#5a5a40] flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#8b9d77]" />
                        <span>Recorded to Safar Diary!</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenSaveModal}
                        className="w-full py-3.5 bg-[#f0f0e4] hover:bg-[#8b9d77] hover:text-white text-[#5a5a40] border border-[#d8d8c0] rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <BookmarkPlus className="w-4 h-4" />
                        <span>{t.saveTrip}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleWhatsAppShare(lastCalc)}
                      className="w-full py-3.5 bg-white border border-[#ecece0] hover:border-[#25D366] hover:text-[#25D366] text-[#8e8e75] rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4 text-[#25D366]" />
                      <span>{t.whatsappShare}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportPDF}
                      className="w-full py-3.5 bg-[#8b9d77]/15 hover:bg-[#8b9d77] hover:text-white text-[#5a5a40] border border-[#8b9d77]/40 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs group"
                    >
                      <FileDown className="w-4 h-4 text-[#8b9d77] group-hover:text-white" />
                      <span>Export Official PDF Waybill</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-[36px] bg-[#fdfbf7]/50 border border-dashed border-[#ecece0] flex-1 flex flex-col items-center justify-center text-center text-[#8e8e75]">
                  <Calculator className="w-12 h-12 mb-4 opacity-30 text-[#8b9d77]" />
                  <p className="font-serif italic text-base text-[#5a5a40]">Awaiting Parameters</p>
                  <p className="text-xs max-w-xs mt-1">
                    Input fuel price, expected mileage, and route distance on the left to compute full expenses.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ══════════════ SUBTAB 2: HISTORY ══════════════ */}
        {activeSubTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#ecece0] pb-4">
              <h3 className="font-serif font-bold text-xl text-[#4a4a35]">
                Saved Safar Records
              </h3>
              {trips.length > 0 && (
                <button
                  onClick={onClearAllTrips}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.clearAll}</span>
                </button>
              )}
            </div>

            {trips.length === 0 ? (
              <div className="p-16 text-center bg-[#fdfbf7] rounded-3xl border border-[#ecece0]">
                <History className="w-12 h-12 mx-auto mb-4 opacity-30 text-[#8b9d77]" />
                <p className="font-serif italic text-lg text-[#5a5a40]">{t.emptyHistory}</p>
                <p className="text-xs text-[#8e8e75] mt-1">Calculate a trip and hit "Record to Diary" to save it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-6 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] transition-all flex flex-col justify-between gap-4 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-lg text-[#4a4a35] group-hover:text-[#8b9d77] transition-colors">
                          {trip.name}
                        </h4>
                        <span className="text-[11px] font-mono font-bold bg-white px-2.5 py-1 rounded-full border border-[#ecece0] text-[#8e8e75]">
                          {trip.date}
                        </span>
                      </div>

                      <div className="text-xs text-[#8e8e75] mt-2 font-sans flex items-center gap-3">
                        <span>{trip.fuelType}</span>
                        <span>·</span>
                        <span>{trip.dist} km</span>
                        <span>·</span>
                        <span>{trip.consumed} L used</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#ecece0]/80 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[#8e8e75] font-bold">Total Est.</div>
                        <div className="font-serif font-bold text-xl text-[#5a5a40]">
                          PKR {trip.total.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleWhatsAppShare(trip)}
                          className="p-2.5 bg-white hover:bg-[#25D366] hover:text-white text-[#25D366] border border-[#ecece0] rounded-full transition-all cursor-pointer shadow-2xs"
                          title="Share via WhatsApp"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTrip(trip.id)}
                          className="p-2.5 bg-white hover:bg-red-500 hover:text-white text-red-500 border border-[#ecece0] rounded-full transition-all cursor-pointer shadow-2xs"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ SUBTAB 3: MONTHLY SUMMARY ══════════════ */}
        {activeSubTab === 'summary' && (
          <div className="space-y-8">
            <h3 className="font-serif font-bold text-xl text-[#4a4a35] border-b border-[#ecece0] pb-4">
              {t.monthlySummary}
            </h3>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] text-center">
                <div className="text-xs uppercase tracking-widest text-[#8e8e75] font-bold mb-1">Total Trips</div>
                <div className="text-3xl font-serif font-bold text-[#8b9d77]">{trips.length}</div>
              </div>

              <div className="p-6 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] text-center">
                <div className="text-xs uppercase tracking-widest text-[#8e8e75] font-bold mb-1">{t.totalKM}</div>
                <div className="text-3xl font-serif font-bold text-[#8b9d77]">
                  {trips.reduce((s, x) => s + x.dist, 0).toLocaleString()} <span className="text-xs font-normal font-sans">km</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] text-center">
                <div className="text-xs uppercase tracking-widest text-[#8e8e75] font-bold mb-1">{t.totalSpent}</div>
                <div className="text-2xl font-serif font-bold text-[#5a5a40]">
                  <span className="text-xs font-normal">PKR</span> {trips.reduce((s, x) => s + x.total, 0).toLocaleString()}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] text-center">
                <div className="text-xs uppercase tracking-widest text-[#8e8e75] font-bold mb-1">{t.avgPerTrip}</div>
                <div className="text-2xl font-serif font-bold text-[#5a5a40]">
                  <span className="text-xs font-normal">PKR</span> {trips.length > 0 ? Math.round(trips.reduce((s, x) => s + x.total, 0) / trips.length).toLocaleString() : '0'}
                </div>
              </div>
            </div>

            {/* Bar Chart Illustration */}
            <div className="p-8 rounded-3xl bg-white border border-[#ecece0]">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#8e8e75] mb-8 text-center">
                {t.last6Months} (PKR)
              </h4>

              <div className="flex items-end justify-between gap-4 h-48 pt-6 px-4">
                {[
                  { m: 'May', val: 124000 },
                  { m: 'Jun', val: 180000 },
                  { m: 'Jul', val: 95000 },
                  { m: 'Aug', val: 210000 },
                  { m: 'Sep', val: 165000 },
                  { m: 'Oct', val: trips.reduce((s, x) => s + x.total, 0) || 145000 }
                ].map((item, i) => {
                  const maxVal = 220000;
                  const heightPct = Math.min(Math.round((item.val / maxVal) * 100), 100);
                  const isCurrent = i === 5;

                  return (
                    <div key={item.m} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-[#5a5a40] opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                        {Math.round(item.val / 1000)}k
                      </span>
                      <div
                        className={`w-full max-w-[40px] rounded-t-2xl transition-all duration-500 relative ${
                          isCurrent ? 'bg-[#8b9d77] shadow-sm' : 'bg-[#f0f0e4] group-hover:bg-[#c2c2a3]'
                        }`}
                        style={{ height: `${Math.max(heightPct, 8)}%` }}
                      ></div>
                      <span className={`text-xs mt-3 font-semibold ${isCurrent ? 'text-[#8b9d77] font-bold' : 'text-[#8e8e75]'}`}>
                        {item.m}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ══════════════ SAVE TRIP DIALOG MODAL ══════════════ */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-[32px] border border-[#ecece0] p-8 max-w-md w-full shadow-xl space-y-6 animate-scaleIn">
            <div className="flex items-center gap-3 border-b border-[#ecece0] pb-4">
              <div className="w-10 h-10 rounded-full bg-[#8b9d77] text-white flex items-center justify-center font-serif italic text-xl">
                YM
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#4a4a35]">
                  {DICTIONARY[lang].modals.saveTripTitle}
                </h3>
                <p className="text-xs text-[#8e8e75]">Store this calculation in your personal Safar Diary</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8e8e75] mb-2">
                {DICTIONARY[lang].modals.tripNameLbl}
              </label>
              <input
                type="text"
                value={saveTripName}
                onChange={(e) => setSaveTripName(e.target.value)}
                placeholder={DICTIONARY[lang].modals.tripNamePlace}
                className="w-full bg-[#fdfbf7] border border-[#ecece0] rounded-2xl px-4 py-3 text-sm font-semibold text-[#4a4a35] focus:border-[#8b9d77] focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-3.5 rounded-full border border-[#ecece0] bg-white text-[#8e8e75] hover:text-[#4a4a35] text-xs uppercase tracking-widest font-bold transition-all cursor-pointer"
              >
                {DICTIONARY[lang].modals.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                disabled={!saveTripName.trim()}
                className="flex-1 py-3.5 rounded-full bg-[#5a5a40] hover:bg-[#4a4a35] disabled:opacity-50 text-white text-xs uppercase tracking-widest font-bold transition-all cursor-pointer shadow-xs"
              >
                {DICTIONARY[lang].modals.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
