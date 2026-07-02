import React, { useState, useEffect } from 'react';
import { ActiveTab, DICTIONARY, Driver, Language, Trip, Vehicle } from '../../types';
import { 
  Calculator, 
  Truck, 
  Users, 
  MapPin, 
  Fuel, 
  ShieldCheck, 
  ArrowRight, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Calendar,
  CreditCard,
  AlertTriangle,
  FileText,
  History,
  BookOpen,
  X,
  Activity,
  CheckCircle2,
  Wrench,
  Menu
} from 'lucide-react';
import { AlHadiLogo } from '../AlHadiLogo';
import { LiveFuelPriceWidget } from '../LiveFuelPriceWidget';

interface HomeViewProps {
  lang: Language;
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenMenu?: () => void;
}

interface CalendarEvent {
  id: string;
  dateStr: string; // YYYY-MM-DD
  title: string;
  type: 'load' | 'maintenance' | 'dispatch' | 'other';
  status: 'pending' | 'active' | 'completed';
}

export const HomeView: React.FC<HomeViewProps> = ({ lang, trips, vehicles, drivers, onNavigate, onOpenMenu }) => {
  const t = DICTIONARY[lang];
  const [showRecentLogs, setShowRecentLogs] = useState(false);
  const [showSafarDiaryModal, setShowSafarDiaryModal] = useState(false);
  const [showQuickOpsModal, setShowQuickOpsModal] = useState(false);
  const currentDate = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ur-PK', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  // Calendar navigation states
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Custom interactive calendar events state
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<'load' | 'maintenance' | 'dispatch' | 'other'>('load');

  useEffect(() => {
    const stored = localStorage.getItem('ah-calendar-events');
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      const y = new Date().getFullYear();
      const m = new Date().getMonth();
      const seed: CalendarEvent[] = [
        {
          id: 'seed-1',
          dateStr: `${y}-${String(m + 1).padStart(2, '0')}-08`,
          title: lang === 'ur' ? 'لاہور سے راولپنڈی گندم کی ڈیلیوری' : 'Lahore to Rawalpindi Wheat Delivery',
          type: 'load',
          status: 'active'
        },
        {
          id: 'seed-2',
          dateStr: `${y}-${String(m + 1).padStart(2, '0')}-15`,
          title: lang === 'ur' ? 'گاڑی نمبر LHR-7860 ٹیوننگ اور آئل تبدیلی' : 'Vehicle LHR-7860 Tuning & Oil Change',
          type: 'maintenance',
          status: 'pending'
        },
        {
          id: 'seed-3',
          dateStr: `${y}-${String(m + 1).padStart(2, '0')}-22`,
          title: lang === 'ur' ? 'ملتان سے کراچی چاول لوڈ روانگی' : 'Multan to Karachi Rice Load Dispatch',
          type: 'dispatch',
          status: 'pending'
        }
      ];
      setEvents(seed);
      localStorage.setItem('ah-calendar-events', JSON.stringify(seed));
    }
  }, [lang]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    
    const yearStr = selectedDate.getFullYear();
    const monthStr = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
    
    const newEvent: CalendarEvent = {
      id: 'evt-' + Date.now(),
      dateStr,
      title: newEventTitle.trim(),
      type: newEventType,
      status: 'pending'
    };
    
    const updated = [...events, newEvent];
    setEvents(updated);
    localStorage.setItem('ah-calendar-events', JSON.stringify(updated));
    setNewEventTitle('');
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter(evt => evt.id !== id);
    setEvents(updated);
    localStorage.setItem('ah-calendar-events', JSON.stringify(updated));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: any) => {
    setSelectedDate(new Date(day.year, day.month, day.dayNum));
    if (day.month !== currentMonth) {
      setCurrentMonth(day.month);
      setCurrentYear(day.year);
    }
  };

  // Helper to generate days of the 6-week grid
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    const firstDayIndex = date.getDay();
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        dayNum: daysInPrevMonth - i,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
      });
    }
    
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({
        dayNum: i,
        month,
        year,
        isCurrentMonth: true,
      });
    }
    
    const totalSlots = 42;
    const remainingSlots = totalSlots - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        dayNum: i,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const matchTripWithDate = (trip: Trip, d: Date) => {
    try {
      const targetStr = d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
      const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const fallbackStr = `${String(d.getDate()).padStart(2, '0')} ${monthsShort[d.getMonth()]}, ${d.getFullYear()}`;
      
      const tripDateLower = trip.date.toLowerCase();
      return tripDateLower.includes(targetStr.toLowerCase()) || tripDateLower.includes(fallbackStr.toLowerCase());
    } catch(e) {
      return false;
    }
  };

  const daysInGrid = getDaysInMonth(currentYear, currentMonth);

  const getDayEventsAndTrips = (dayNum: number, monthNum: number, yearNum: number) => {
    const mStr = String(monthNum + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const targetDateStr = `${yearNum}-${mStr}-${dStr}`;
    const dObj = new Date(yearNum, monthNum, dayNum);
    
    const dayCustomEvents = events.filter(evt => evt.dateStr === targetDateStr);
    const dayTrips = trips.filter(trip => matchTripWithDate(trip, dObj));
    
    return { dayCustomEvents, dayTrips, totalCount: dayCustomEvents.length + dayTrips.length };
  };

  const selectedDateEvents = events.filter(evt => {
    const yearStr = selectedDate.getFullYear();
    const monthStr = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
    return evt.dateStr === dateStr;
  });

  const selectedDateTrips = trips.filter(trip => matchTripWithDate(trip, selectedDate));

  const monthNamesEN = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  const monthNamesUR = [
    "جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون", 
    "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"
  ];
  
  const currentMonthName = lang === 'ur' ? monthNamesUR[currentMonth] : monthNamesEN[currentMonth];
  const urduDayLetters = ['ا', 'پ', 'م', 'ب', 'ج', 'ج', 'ہ'];
  const englishDayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const quickItems: { id: string; title: string; desc: string; icon: React.ReactNode }[] = [
    { 
      id: 'vehicle', 
      title: t.nav.vehicle, 
      desc: lang === 'ur' ? "اپنے ٹرکوں، ٹریلرز اور مائلیج کا ریکارڈ رکھیں" : "Manage fleet trucks, trailers & mileage", 
      icon: <Truck className="w-5 h-5 text-[#8b9d77]" /> 
    },
    { 
      id: 'drivers', 
      title: t.nav.drivers, 
      desc: lang === 'ur' ? "ڈرائیوروں کے واٹس ایپ نمبر اور لائسنس کی معلومات" : "Access WhatsApp contacts & license status", 
      icon: <Users className="w-5 h-5 text-[#8b9d77]" /> 
    },
    { 
      id: 'routes', 
      title: t.nav.routes, 
      desc: lang === 'ur' ? "محفوظ موٹروے راستے اور ٹول ٹیکس ریٹ" : "Saved motorway corridors & toll tariffs", 
      icon: <MapPin className="w-5 h-5 text-[#8b9d77]" /> 
    },
    { 
      id: 'fuel', 
      title: t.nav.fuel, 
      desc: lang === 'ur' ? "ڈیلی ڈیزل اور پیٹرول کی مارکیٹ قیمتیں" : "Log daily diesel & petrol market prices", 
      icon: <Fuel className="w-5 h-5 text-[#8b9d77]" /> 
    },
    { 
      id: 'recentLogs', 
      title: lang === 'ur' ? 'حالیہ لاگز کھولیں' : 'Open Recent Logs', 
      desc: lang === 'ur' ? 'حالیہ سفری لاگز اور تفصیل دیکھیں' : 'View recent trip history logs', 
      icon: <History className="w-5 h-5 text-[#8b9d77]" /> 
    },
  ];

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">
      
      {/* Left Column (7 cols): Al-Hadi Goods Samundri Section & Live Fuel Prices */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        
        {/* First Section: 2 Rows of 3 Operational & Portal Buttons */}
        <div className="bg-white p-5 sm:p-7 rounded-[36px] shadow-sm border border-[#ecece0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {/* Row 1, Button 1: Safar Diary */}
            <button
              onClick={() => setShowSafarDiaryModal(true)}
              className="p-4 bg-[#fdfbf7] border-2 border-[#8b9d77]/40 hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 rounded-3xl transition-all active:scale-95 cursor-pointer flex items-center gap-3 shadow-2xs group text-left"
            >
              <div className="p-2.5 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                <BookOpen className="w-5 h-5 text-[#8b9d77]" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#4a4a35] group-hover:text-[#8b9d77]">
                  {lang === 'ur' ? 'سفر ڈائری' : 'Safar Diary'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#8e8e75] font-sans mt-0.5 leading-tight">
                  {lang === 'ur' ? 'روزانہ ٹرپ اور اخراجات کا ریکارڈ' : 'Daily trip & expense logs'}
                </div>
              </div>
            </button>

            {/* Row 1, Button 2: Quick Operations */}
            <button
              onClick={() => setShowQuickOpsModal(true)}
              className="p-4 bg-[#fdfbf7] border-2 border-[#8b9d77]/40 hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 rounded-3xl transition-all active:scale-95 cursor-pointer flex items-center gap-3 shadow-2xs group text-left"
            >
              <div className="p-2.5 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                <Wrench className="w-5 h-5 text-[#8b9d77]" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#4a4a35] group-hover:text-[#8b9d77]">
                  {lang === 'ur' ? 'کوئیک آپریشنز' : 'Quick Operations'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#8e8e75] font-sans mt-0.5 leading-tight">
                  {lang === 'ur' ? 'گاڑیاں، ڈرائیورز اور پورٹلز' : 'Fleet tools & portal shortcuts'}
                </div>
              </div>
            </button>

            {/* Row 1, Button 3: Trip Calculator */}
            <button
              onClick={() => onNavigate('calculator')}
              className="p-4 bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 rounded-3xl transition-all active:scale-95 cursor-pointer flex items-center gap-3 shadow-2xs group text-left"
            >
              <div className="p-2.5 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                <Calculator className="w-5 h-5 text-[#8b9d77]" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#4a4a35] group-hover:text-[#8b9d77]">
                  {lang === 'ur' ? 'سفر اور فیول کیلکولیٹر' : 'Trip Calculator'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#8e8e75] font-sans mt-0.5 leading-tight">
                  {lang === 'ur' ? 'کرایہ اور فیول منافع کا تخمینہ' : 'Freight cost & profit estimate'}
                </div>
              </div>
            </button>

            {/* Row 2, Button 1: Vehicles Verification */}
            <button
              onClick={() => onNavigate('verify')}
              className="p-4 bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 rounded-3xl transition-all active:scale-95 cursor-pointer flex items-center gap-3 shadow-2xs group text-left"
            >
              <div className="p-2.5 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                <Truck className="w-5 h-5 text-[#8b9d77]" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#4a4a35] group-hover:text-[#8b9d77]">
                  {lang === 'ur' ? 'گاڑیوں کی تصدیق' : 'Vehicles Verification'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#8e8e75] font-sans mt-0.5 leading-tight">
                  {lang === 'ur' ? 'MTMIS پنجاب و ایکسائز ریکارڈ' : 'MTMIS Punjab & Excise portal'}
                </div>
              </div>
            </button>

            {/* Row 2, Button 2: License Verification */}
            <button
              onClick={() => onNavigate('verify')}
              className="p-4 bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 rounded-3xl transition-all active:scale-95 cursor-pointer flex items-center gap-3 shadow-2xs group text-left"
            >
              <div className="p-2.5 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#8b9d77]" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#4a4a35] group-hover:text-[#8b9d77]">
                  {lang === 'ur' ? 'لائسنس کی تصدیق' : 'License Verification'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#8e8e75] font-sans mt-0.5 leading-tight">
                  {lang === 'ur' ? 'DLIMS پنجاب و موٹروے پولیس' : 'DLIMS Punjab Highway checks'}
                </div>
              </div>
            </button>

            {/* Row 2, Button 3: E-Challan Check */}
            <button
              onClick={() => onNavigate('verify')}
              className="p-4 bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 rounded-3xl transition-all active:scale-95 cursor-pointer flex items-center gap-3 shadow-2xs group text-left"
            >
              <div className="p-2.5 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#8b9d77]" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm sm:text-base text-[#4a4a35] group-hover:text-[#8b9d77]">
                  {lang === 'ur' ? 'ای چالان چیک کریں' : 'E-Challan Check'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#8e8e75] font-sans mt-0.5 leading-tight">
                  {lang === 'ur' ? 'PSCA سیف سٹی چالان ریکارڈ' : 'PSCA Safe City traffic records'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Live Fuel Prices Monitor Card */}
        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-[#ecece0]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif font-bold text-lg text-[#4a4a35] flex items-center gap-2">
              <Fuel className="w-5 h-5 text-[#8b9d77]" />
              <span>{lang === 'ur' ? 'پاکستان پول ریٹ مانیٹر' : 'Live POL Rates Monitor'}</span>
            </h3>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#10B981]/15 text-[#10B981] uppercase tracking-wider">
              {lang === 'ur' ? 'لائیو اپڈیٹ' : 'Live Updated'}
            </span>
          </div>
          <LiveFuelPriceWidget lang={lang} compact />
        </div>

      </div>

      {/* Right Column (5 cols): Motivation Wisdom & Calendar */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        
        {/* Wisdom Sage Green Accent Card */}
        <div className="bg-[#8b9d77] text-white p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
          <Quote className="w-10 h-10 mb-4 opacity-40 text-white" />
          <p className="text-lg font-serif italic mb-4 font-light leading-relaxed">
            "{lang === 'ur' 
              ? 'آگے بڑھنے کا راز بس پہلا قدم اٹھانا ہے۔ محنت میں عظمت ہے۔'
              : 'Agay barhnay ka raaz bas pehla qadam uthana hai. Punjab ki sarak aur mehnat ki barkat.'}"
          </p>
          <p className="text-xs uppercase tracking-widest opacity-80 font-sans font-semibold">
            {lang === 'ur' ? '- الھادی حکمت' : '- Al-Hadi Freight Wisdom'}
          </p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        </div>

        {/* Dynamic, Workable, Fully Interactive Freight Schedule Calendar */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-[#ecece0] flex-1 flex flex-col">
          <header className="flex items-center justify-between mb-6">
            <button 
              onClick={handlePrevMonth}
              className="p-1.5 rounded-full border border-[#ecece0] hover:border-[#8b9d77] text-[#8e8e75] hover:text-[#4a4a35] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-serif font-bold text-sm text-[#4a4a35] uppercase tracking-wider text-center">
              {currentMonthName} {currentYear}
            </h3>
            <button 
              onClick={handleNextMonth}
              className="p-1.5 rounded-full border border-[#ecece0] hover:border-[#8b9d77] text-[#8e8e75] hover:text-[#4a4a35] transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </header>
          
          <div className="grid grid-cols-7 gap-1.5 text-[10px] font-bold text-center mb-4 text-[#8b9d77]">
            {(lang === 'ur' ? urduDayLetters : englishDayLetters).map((day, idx) => (
              <div key={idx} className="w-full">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-[#4a4a35] items-center mb-6">
            {daysInGrid.map((day, idx) => {
              const dateObj = new Date(day.year, day.month, day.dayNum);
              const isSelected = selectedDate.getDate() === day.dayNum && 
                                 selectedDate.getMonth() === day.month && 
                                 selectedDate.getFullYear() === day.year;
                                 
              const { totalCount } = getDayEventsAndTrips(day.dayNum, day.month, day.year);
              
              const isToday = new Date().getDate() === day.dayNum && 
                              new Date().getMonth() === day.month && 
                              new Date().getFullYear() === day.year;

              return (
                <button
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  className={`relative p-1.5 w-7 h-7 mx-auto rounded-full flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[#8b9d77] text-white font-bold shadow-2xs' 
                      : isToday
                        ? 'border border-[#8b9d77] text-[#4a4a35] font-bold'
                        : day.isCurrentMonth 
                          ? 'text-[#4a4a35] hover:bg-[#f9f9f2]' 
                          : 'text-[#8e8e75]/40 hover:bg-[#f9f9f2]/50'
                  }`}
                >
                  <span>{day.dayNum}</span>
                  {totalCount > 0 && !isSelected && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#C59B27]"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Schedule Events List for Selected Day */}
          <div className="mt-4 pt-4 border-t border-[#ecece0] flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#8e8e75] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#8b9d77]" />
                <span>
                  {lang === 'ur' 
                    ? `${selectedDate.getDate()} ${monthNamesUR[selectedDate.getMonth()]} کے شیڈول`
                    : `Schedule for ${selectedDate.getDate()} ${monthNamesEN[selectedDate.getMonth()]}`}
                </span>
              </h4>
              <button 
                onClick={() => setShowAddEvent(!showAddEvent)}
                className="p-1 rounded-full bg-[#f0f0e4] text-[#8b9d77] hover:bg-[#8b9d77] hover:text-white transition-all cursor-pointer"
                title={lang === 'ur' ? "شیڈول شامل کریں" : "Add Event"}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inline Event Creation Form */}
            {showAddEvent && (
              <form onSubmit={handleAddEvent} className="bg-[#f9f9f2] p-3 rounded-2xl border border-[#ecece0] mb-4 space-y-2.5">
                <div>
                  <input 
                    type="text"
                    required
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder={lang === 'ur' ? 'مثال: لاہور گندم لوڈ روانگی' : 'e.g., Lahore Wheat Cargo'}
                    className="w-full text-xs px-2.5 py-1.5 bg-white border border-[#ecece0] rounded-lg focus:outline-none focus:border-[#8b9d77]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={newEventType}
                    onChange={(e: any) => setNewEventType(e.target.value)}
                    className="flex-1 text-[11px] px-2 py-1.5 bg-white border border-[#ecece0] rounded-lg text-[#4a4a35] focus:outline-none focus:border-[#8b9d77]"
                  >
                    <option value="load">{lang === 'ur' ? 'مال برداری (Load)' : 'Cargo Load'}</option>
                    <option value="maintenance">{lang === 'ur' ? 'مرمت (Repair)' : 'Maintenance'}</option>
                    <option value="dispatch">{lang === 'ur' ? 'روانگی (Dispatch)' : 'Dispatch'}</option>
                    <option value="other">{lang === 'ur' ? 'دیگر (Other)' : 'Other'}</option>
                  </select>
                  <button 
                    type="submit"
                    className="px-3 py-1.5 bg-[#8b9d77] text-white text-[11px] font-bold rounded-lg hover:bg-[#7a8c66] transition-all cursor-pointer"
                  >
                    {lang === 'ur' ? 'شامل کریں' : 'Save'}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
              {/* Display custom schedule events */}
              {selectedDateEvents.map(evt => (
                <div key={evt.id} className="flex items-start justify-between p-2.5 rounded-xl bg-[#fdfbf7] border border-[#ecece0] text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">
                      {evt.type === 'load' ? '📦' : evt.type === 'maintenance' ? '🔧' : evt.type === 'dispatch' ? '🚚' : '📝'}
                    </span>
                    <div>
                      <p className="font-semibold text-[#4a4a35] leading-snug">{evt.title}</p>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-[#8b9d77]">
                        {lang === 'ur' 
                          ? evt.type === 'load' ? 'کارگو لوڈ' : evt.type === 'maintenance' ? 'دیکھ بھال' : evt.type === 'dispatch' ? 'روانگی' : 'دیگر'
                          : evt.type}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="text-[#8e8e75]/60 hover:text-red-600 transition-colors p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Display actual recorded Trips matching this day */}
              {selectedDateTrips.map(trip => (
                <div key={trip.id} className="flex items-start justify-between p-2.5 rounded-xl bg-white border-l-4 border-[#8b9d77] border-y border-r border-[#ecece0] text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-sm mt-0.5">🚛</span>
                    <div>
                      <p className="font-semibold text-[#4a4a35] leading-snug">{trip.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-[#8e8e75]">
                        <span className="font-bold text-[#5a5a40]">PKR {trip.total.toLocaleString()}</span>
                        <span>·</span>
                        <span>{trip.dist} km</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[8px] bg-[#8b9d77]/10 text-[#5a5a40] px-1.5 py-0.5 rounded-full uppercase tracking-tighter font-bold">
                    {lang === 'ur' ? 'سفر لاگ' : 'Trip Log'}
                  </span>
                </div>
              ))}

              {/* Empty state for the selected day */}
              {selectedDateEvents.length === 0 && selectedDateTrips.length === 0 && (
                <div className="py-8 text-center text-xs italic text-[#8e8e75] bg-[#fdfbf7]/50 rounded-2xl border border-dashed border-[#ecece0]">
                  {lang === 'ur' ? 'اس دن کوئی لوڈ یا شیڈول نہیں ہے۔' : 'No schedules saved for this day.'}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#ecece0] flex items-center justify-between text-[10px] text-[#8e8e75]">
              <span className="flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27]"></span> 
                {lang === 'ur' ? 'فعال شیڈول' : 'Active Schedule'}
              </span>
              <span className="font-serif italic font-semibold">
                {selectedDateEvents.length + selectedDateTrips.length} {lang === 'ur' ? 'ٹوٹل' : 'Total'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Safar Diary Modal */}
      {showSafarDiaryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] max-w-4xl w-full p-6 md:p-10 shadow-2xl border border-[#ecece0] max-h-[90vh] overflow-y-auto space-y-8 text-left">
            
            {/* Modal Header */}
            <header className="flex justify-between items-start border-b border-[#ecece0] pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#8b9d77]/15 text-[#5a5a40] uppercase tracking-wider mb-2">
                  <BookOpen className="w-3 h-3 text-[#8b9d77]" />
                  {lang === 'ur' ? 'سفر ڈائری لاگز' : 'Safar Diary Logs'}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#4a4a35]">
                  {lang === 'ur' ? 'الھادی سفر ڈائری اور ریکارڈ' : 'Al-Hadi Safar Diary'}
                </h2>
                <p className="text-[#8b9d77] italic text-xs mt-1">{currentDate}</p>
              </div>
              <button
                onClick={() => setShowSafarDiaryModal(false)}
                className="p-3 bg-[#f0f0e4] hover:bg-[#5a5a40] hover:text-white rounded-full text-[#5a5a40] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Stats Bars Section */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-[#f9f9f2] rounded-2xl border border-[#ecece0]/50 text-center transition-all hover:border-[#8b9d77]">
                <div className="text-[10px] uppercase tracking-tighter text-[#8e8e75] mb-1 font-sans font-semibold">
                  {t.stats.trips}
                </div>
                <div className="text-2xl font-serif font-bold text-[#5a5a40]">{trips.length}</div>
              </div>
              
              <div className="p-4 bg-[#f9f9f2] rounded-2xl border border-[#ecece0]/50 text-center transition-all hover:border-[#8b9d77]">
                <div className="text-[10px] uppercase tracking-tighter text-[#8e8e75] mb-1 font-sans font-semibold">
                  {t.stats.vehicles}
                </div>
                <div className="text-2xl font-serif font-bold text-[#5a5a40]">{vehicles.length}</div>
              </div>

              <div className="p-4 bg-[#f9f9f2] rounded-2xl border border-[#ecece0]/50 text-center transition-all hover:border-[#8b9d77]">
                <div className="text-[10px] uppercase tracking-tighter text-[#8e8e75] mb-1 font-sans font-semibold">
                  {t.stats.drivers}
                </div>
                <div className="text-2xl font-serif font-bold text-[#5a5a40]">{drivers.length}</div>
              </div>
            </div>

            {/* Add Trip Action Banner */}
            <div className="p-5 bg-[#fdfbf7] rounded-3xl border border-[#8b9d77]/40 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-serif font-bold text-sm text-[#4a4a35]">
                  {lang === 'ur' ? 'نیا سفری اخراجات لاگ شامل کریں' : 'Log New Trip & Calculate Expenses'}
                </h4>
                <p className="text-xs text-[#8e8e75]">
                  {lang === 'ur' ? 'ڈیزل، ٹول ٹیکس اور روٹ خرچ کا حساب لگائیں' : 'Calculate fuel, toll tax, and route consumption'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowSafarDiaryModal(false);
                  onNavigate('calculator');
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#8b9d77] hover:bg-[#798a67] text-white text-xs font-bold font-serif shrink-0 transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ur' ? 'نیا ٹرپ درج کریں' : 'New Trip Log'}</span>
              </button>
            </div>

            {/* Recent Trips List Inside Modal */}
            <div id="modal-recent-logs" className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#8e8e75]">
                  {t.recentTrips} ({trips.length})
                </h3>
              </div>

              <div className="space-y-3">
                {trips.length === 0 ? (
                  <div className="p-8 text-center bg-[#fdfbf7] rounded-3xl border border-[#ecece0]">
                    <p className="text-sm italic text-[#8e8e75]">{t.noTrips}</p>
                  </div>
                ) : (
                  trips.slice(0, 8).map((trip, idx) => (
                    <div
                      key={trip.id}
                      onClick={() => {
                        setShowSafarDiaryModal(false);
                        onNavigate('calculator');
                      }}
                      className={`flex items-start justify-between gap-4 p-4 rounded-3xl transition-all cursor-pointer ${
                        idx === 0
                          ? 'bg-[#fdfbf7] border-l-4 border-[#8b9d77] border-y border-r border-[#ecece0] shadow-2xs'
                          : 'bg-white border border-[#ecece0] hover:border-[#8b9d77]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 ${
                          idx === 0 ? 'border-2 border-[#8b9d77] bg-[#8b9d77]/10' : 'border-2 border-[#d8d8c0]'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-[#8b9d77]' : 'bg-[#d8d8c0]'}`}></div>
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-sm text-[#4a4a35]">{trip.name}</h4>
                          <p className="text-[11px] text-[#8e8e75] mt-0.5 font-sans">
                            {trip.fuelType} · {trip.dist} km · {trip.consumed} L
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-serif font-bold text-base text-[#5a5a40]">
                          PKR {trip.total.toLocaleString()}
                        </span>
                        <div className="text-[9px] text-[#8e8e75]">{trip.date}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer Close Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowSafarDiaryModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#4a4a35] text-white font-serif font-bold text-xs hover:bg-[#383827] transition-all cursor-pointer shadow-sm"
              >
                {lang === 'ur' ? 'ڈائری بند کریں' : 'Close Safar Diary'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Quick Operations Modal */}
      {showQuickOpsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] max-w-4xl w-full p-6 md:p-10 shadow-2xl border border-[#ecece0] max-h-[90vh] overflow-y-auto space-y-8 text-left">
            
            {/* Modal Header */}
            <header className="flex justify-between items-start border-b border-[#ecece0] pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#8b9d77]/15 text-[#5a5a40] uppercase tracking-wider mb-2">
                  <Wrench className="w-3 h-3 text-[#8b9d77]" />
                  {lang === 'ur' ? 'کوئیک پورٹل' : 'Quick Portal'}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#4a4a35]">
                  {lang === 'ur' ? 'کوئیک آپریشنز اور مانیٹرنگ' : 'Quick Operations'}
                </h2>
                <p className="text-[#8e8e75] text-xs mt-1">
                  {lang === 'ur' ? 'تمام فلیٹ ٹولز، پورٹل اور سرکاری تصدیقی خدمات تک فوری رسائی' : 'Direct access to fleet management tools and official Punjab verification portals.'}
                </p>
              </div>
              <button
                onClick={() => setShowQuickOpsModal(false)}
                className="p-3 bg-[#f0f0e4] hover:bg-[#5a5a40] hover:text-white rounded-full text-[#5a5a40] transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Quick Operations Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              
              {/* Open Recent Logs Button inside Quick Operations as requested */}
              <button
                type="button"
                onClick={() => {
                  setShowQuickOpsModal(false);
                  setShowSafarDiaryModal(true);
                }}
                className="p-5 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs active:scale-95"
              >
                <div className="p-3 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                  <History className="w-6 h-6 text-[#8b9d77]" />
                </div>
                <span className="font-serif font-bold text-xs text-[#4a4a35] group-hover:text-[#8b9d77] transition-colors">
                  {lang === 'ur' ? 'حالیہ لاگز کھولیں' : 'Open Recent Logs'}
                </span>
              </button>

              {/* Calculator */}
              <button
                type="button"
                onClick={() => {
                  setShowQuickOpsModal(false);
                  onNavigate('calculator');
                }}
                className="p-5 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs active:scale-95"
              >
                <div className="p-3 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                  <Calculator className="w-6 h-6 text-[#8b9d77]" />
                </div>
                <span className="font-serif font-bold text-xs text-[#4a4a35] group-hover:text-[#8b9d77] transition-colors">
                  {lang === 'ur' ? 'سفر اور فیول کیلکولیٹر' : 'Trip Calculator'}
                </span>
              </button>

              {/* Vehicles */}
              <button
                type="button"
                onClick={() => {
                  setShowQuickOpsModal(false);
                  onNavigate('vehicles');
                }}
                className="p-5 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs active:scale-95"
              >
                <div className="p-3 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                  <Truck className="w-6 h-6 text-[#8b9d77]" />
                </div>
                <span className="font-serif font-bold text-xs text-[#4a4a35] group-hover:text-[#8b9d77] transition-colors">
                  {lang === 'ur' ? 'گاڑیاں اور فلیٹ' : 'Vehicles Fleet'}
                </span>
              </button>

              {/* Drivers */}
              <button
                type="button"
                onClick={() => {
                  setShowQuickOpsModal(false);
                  onNavigate('drivers');
                }}
                className="p-5 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs active:scale-95"
              >
                <div className="p-3 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                  <Users className="w-6 h-6 text-[#8b9d77]" />
                </div>
                <span className="font-serif font-bold text-xs text-[#4a4a35] group-hover:text-[#8b9d77] transition-colors">
                  {lang === 'ur' ? 'ڈرائیورز ڈائریکٹری' : 'Drivers List'}
                </span>
              </button>

              {/* Routes */}
              <button
                type="button"
                onClick={() => {
                  setShowQuickOpsModal(false);
                  onNavigate('routes');
                }}
                className="p-5 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs active:scale-95"
              >
                <div className="p-3 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                  <MapPin className="w-6 h-6 text-[#8b9d77]" />
                </div>
                <span className="font-serif font-bold text-xs text-[#4a4a35] group-hover:text-[#8b9d77] transition-colors">
                  {lang === 'ur' ? 'روٹس اور ٹول ٹیکس' : 'Routes & Tolls'}
                </span>
              </button>

              {/* Fuel Log */}
              <button
                type="button"
                onClick={() => {
                  setShowQuickOpsModal(false);
                  onNavigate('fuel');
                }}
                className="p-5 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs active:scale-95"
              >
                <div className="p-3 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shadow-2xs shrink-0">
                  <Fuel className="w-6 h-6 text-[#8b9d77]" />
                </div>
                <span className="font-serif font-bold text-xs text-[#4a4a35] group-hover:text-[#8b9d77] transition-colors">
                  {lang === 'ur' ? 'فیول لاگ ریکارڈ' : 'Fuel Consumption'}
                </span>
              </button>

              {/* Vehicle Verification */}
              <button
                type="button"
                onClick={() => window.open('https://mtmis.excise.punjab.gov.pk', '_blank', 'noopener,noreferrer')}
                className="p-5 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs active:scale-95"
              >
                <div className="p-3 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#3B82F6] shadow-2xs shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <span className="font-serif font-bold text-xs text-[#4a4a35] group-hover:text-[#3B82F6] transition-colors">
                  {lang === 'ur' ? 'گاڑیوں کی تصدیق (MTMIS)' : 'Verify Vehicle'}
                </span>
              </button>

              {/* License Verification */}
              <button
                type="button"
                onClick={() => window.open('https://dlims.punjab.gov.pk', '_blank', 'noopener,noreferrer')}
                className="p-5 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#10B981] hover:bg-[#10B981]/10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs active:scale-95"
              >
                <div className="p-3 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#10B981] shadow-2xs shrink-0">
                  <CreditCard className="w-6 h-6 text-[#10B981]" />
                </div>
                <span className="font-serif font-bold text-xs text-[#4a4a35] group-hover:text-[#10B981] transition-colors">
                  {lang === 'ur' ? 'لائسنس تصدیق (DLIMS)' : 'Verify License'}
                </span>
              </button>

              {/* Check E-Challan */}
              <button
                type="button"
                onClick={() => window.open('https://echallan.psca.gop.pk', '_blank', 'noopener,noreferrer')}
                className="p-5 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#EF4444] hover:bg-[#EF4444]/10 transition-all cursor-pointer group flex flex-col items-center justify-center text-center gap-2.5 shadow-2xs active:scale-95 sm:col-span-1 md:col-span-2"
              >
                <div className="p-3 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#EF4444] shadow-2xs shrink-0">
                  <FileText className="w-6 h-6 text-[#EF4444]" />
                </div>
                <span className="font-serif font-bold text-xs text-[#4a4a35] group-hover:text-[#EF4444] transition-colors">
                  {lang === 'ur' ? 'ای چالان چیک کریں (PSCA)' : 'Check E-Challan'}
                </span>
              </button>

            </div>

            {/* Modal Footer Close Button */}
            <div className="text-center pt-2 border-t border-[#ecece0]">
              <button
                type="button"
                onClick={() => setShowQuickOpsModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#4a4a35] text-white font-serif font-bold text-xs hover:bg-[#383827] transition-all cursor-pointer shadow-sm"
              >
                {lang === 'ur' ? 'پورٹل بند کریں' : 'Close Quick Operations'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
