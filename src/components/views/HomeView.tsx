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
  FileText
} from 'lucide-react';
import { AlHadiLogo } from '../AlHadiLogo';

interface HomeViewProps {
  lang: Language;
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onNavigate: (tab: ActiveTab) => void;
}

interface CalendarEvent {
  id: string;
  dateStr: string; // YYYY-MM-DD
  title: string;
  type: 'load' | 'maintenance' | 'dispatch' | 'other';
  status: 'pending' | 'active' | 'completed';
}

export const HomeView: React.FC<HomeViewProps> = ({ lang, trips, vehicles, drivers, onNavigate }) => {
  const t = DICTIONARY[lang];
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

  const quickItems: { id: ActiveTab; title: string; desc: string; icon: React.ReactNode }[] = [
    { 
      id: 'calculator', 
      title: t.nav.calculator, 
      desc: lang === 'ur' ? "ایندھن کی کھپت اور ٹول ٹیکس کا حساب لگائیں" : "Estimate fuel consumption & toll expenses", 
      icon: <Calculator className="w-5 h-5 text-[#8b9d77]" /> 
    },
    { 
      id: 'verify', 
      title: t.nav.verify, 
      desc: lang === 'ur' ? "ایم ٹی ایم آئی ایس، ڈی ایل آئی ایم ایس اور ای چالان تصدیق" : "Official MTMIS, DLIMS & E-Challan portals", 
      icon: <ShieldCheck className="w-5 h-5 text-[#8b9d77]" /> 
    },
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
  ];

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">
      
      {/* Left Column (3 cols): Fleet & Operator Summary Card */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-[#ecece0] flex-1 flex flex-col items-center text-center">
          <div className="w-24 h-24 mb-4 flex items-center justify-center overflow-hidden">
            <AlHadiLogo className="w-24 h-24" />
          </div>
          
          <h2 className="text-xl font-serif font-bold text-[#4a4a35]">
            Al-Hadi Goods Samundri
          </h2>
          <h3 className="text-2xl font-serif font-bold text-[#8b9d77] mt-1">
            الھادی گڈز سمندری
          </h3>

          {/* 4 Quick Access Buttons under the Name */}
          <div className="w-full grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => onNavigate('calculator')}
              className="p-3 bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-[#8b9d77]/5 rounded-2xl text-center transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs"
            >
              <Calculator className="w-5 h-5 text-[#8b9d77]" />
              <div className="font-serif font-bold text-[11px] text-[#4a4a35]">{lang === 'ur' ? 'کیلکولیٹر' : 'Calculator'}</div>
            </button>

            <button
              onClick={() => onNavigate('verify')}
              className="p-3 bg-[#fdfbf7] border border-[#ecece0] hover:border-[#3B82F6] hover:bg-[#3B82F6]/5 rounded-2xl text-center transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs"
            >
              <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
              <div className="font-serif font-bold text-[11px] text-[#4a4a35]">{lang === 'ur' ? 'ایم ٹی ایم آئی ایس' : 'MTMIS'}</div>
            </button>

            <button
              onClick={() => onNavigate('verify')}
              className="p-3 bg-[#fdfbf7] border border-[#ecece0] hover:border-[#10B981] hover:bg-[#10B981]/5 rounded-2xl text-center transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs"
            >
              <CreditCard className="w-5 h-5 text-[#10B981]" />
              <div className="font-serif font-bold text-[11px] text-[#4a4a35]">{lang === 'ur' ? 'ڈی ایل آئی ایم ایس' : 'DLIMS'}</div>
            </button>

            <button
              onClick={() => onNavigate('verify')}
              className="p-3 bg-[#fdfbf7] border border-[#ecece0] hover:border-[#EF4444] hover:bg-[#EF4444]/5 rounded-2xl text-center transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs"
            >
              <FileText className="w-5 h-5 text-[#EF4444]" />
              <div className="font-serif font-bold text-[11px] text-[#4a4a35]">{lang === 'ur' ? 'ای چالان' : 'E-Challan'}</div>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Column (6 cols): Quick Operations & Recent Safar Logs */}
      <div className="lg:col-span-6 flex flex-col gap-8">
        
        {/* Hero Title Header Inside Card */}
        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm border border-[#ecece0]">
          <header className="flex justify-between items-end mb-8 border-b border-[#ecece0] pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4a4a35]">
                {lang === 'ur' ? 'آج کا سفر' : 'Safar Diary'}
              </h1>
              <p className="text-[#8b9d77] italic text-sm mt-1">{currentDate}</p>
            </div>
            <div className="p-3 bg-[#f0f0e4] rounded-full text-[#5a5a40]">
              <Truck className="w-5 h-5" />
            </div>
          </header>

          {/* Moved Stats Bars Section */}
          <div className="grid grid-cols-3 gap-3 mb-8">
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

          <div className="mb-6">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#8e8e75] mb-4">
              {t.quickAccess}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="p-5 rounded-3xl bg-[#fdfbf7] border border-[#ecece0] hover:border-[#8b9d77] hover:bg-white transition-all cursor-pointer group flex items-start gap-3.5 shadow-2xs active:scale-98"
                >
                  <div className="p-2.5 bg-white rounded-2xl border border-[#ecece0] group-hover:border-[#8b9d77] shrink-0 shadow-2xs">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-[#4a4a35] group-hover:text-[#8b9d77] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#8e8e75] mt-1 leading-relaxed font-sans line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#ecece0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#8e8e75]">
                {t.recentTrips}
              </h3>
              <button
                onClick={() => onNavigate('calculator')}
                className="text-xs font-serif italic text-[#8b9d77] hover:underline cursor-pointer"
              >
                {lang === 'ur' ? 'مکمل ریکارڈ دیکھیں ←' : 'View full history →'}
              </button>
            </div>

            <div className="space-y-4">
              {trips.length === 0 ? (
                <div className="p-8 text-center bg-[#fdfbf7] rounded-3xl border border-[#ecece0]">
                  <p className="text-sm italic text-[#8e8e75]">{t.noTrips}</p>
                </div>
              ) : (
                trips.slice(0, 3).map((trip, idx) => (
                  <div
                    key={trip.id}
                    onClick={() => onNavigate('calculator')}
                    className={`flex items-start justify-between gap-4 p-5 rounded-3xl transition-all cursor-pointer ${
                      idx === 0
                        ? 'bg-[#fdfbf7] border-l-4 border-[#8b9d77] border-y border-r border-[#ecece0] shadow-2xs'
                        : 'bg-white border border-[#ecece0] hover:border-[#8b9d77]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-6 h-6 rounded-full mt-0.5 flex items-center justify-center shrink-0 ${
                        idx === 0 ? 'border-2 border-[#8b9d77] bg-[#8b9d77]/10' : 'border-2 border-[#d8d8c0]'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-[#8b9d77]' : 'bg-[#d8d8c0]'}`}></div>
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-[#4a4a35]">{trip.name}</h4>
                        <p className="text-xs text-[#8e8e75] mt-0.5 font-sans">
                          {trip.fuelType} · {trip.dist} km · {trip.consumed} L
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-base md:text-lg text-[#5a5a40]">
                        PKR {trip.total.toLocaleString()}
                      </span>
                      <div className="text-[10px] text-[#8e8e75] mt-0.5">{trip.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (3 cols): Motivation Wisdom & Calendar */}
      <div className="lg:col-span-3 flex flex-col gap-8">
        
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

    </div>
  );
};
