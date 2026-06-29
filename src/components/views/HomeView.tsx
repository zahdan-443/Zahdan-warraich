import React from 'react';
import { ActiveTab, DICTIONARY, Driver, Language, Trip, Vehicle } from '../../types';
import { Calculator, Truck, Users, MapPin, Fuel, ShieldCheck, ArrowRight, Quote } from 'lucide-react';

interface HomeViewProps {
  lang: Language;
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  onNavigate: (tab: ActiveTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ lang, trips, vehicles, drivers, onNavigate }) => {
  const t = DICTIONARY[lang];
  const currentDate = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ur-PK', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const quickItems: { id: ActiveTab; title: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'calculator', title: t.nav.calculator, desc: "Estimate fuel consumption & toll expenses", icon: <Calculator className="w-5 h-5 text-[#8b9d77]" /> },
    { id: 'verify', title: t.nav.verify, desc: "Official MTMIS, DLIMS & E-Challan portals", icon: <ShieldCheck className="w-5 h-5 text-[#8b9d77]" /> },
    { id: 'vehicle', title: t.nav.vehicle, desc: "Manage fleet trucks, trailers & mileage", icon: <Truck className="w-5 h-5 text-[#8b9d77]" /> },
    { id: 'drivers', title: t.nav.drivers, desc: "Access WhatsApp contacts & license status", icon: <Users className="w-5 h-5 text-[#8b9d77]" /> },
    { id: 'routes', title: t.nav.routes, desc: "Saved motorway corridors & toll tariffs", icon: <MapPin className="w-5 h-5 text-[#8b9d77]" /> },
    { id: 'fuel', title: t.nav.fuel, desc: "Log daily diesel & petrol market prices", icon: <Fuel className="w-5 h-5 text-[#8b9d77]" /> },
  ];

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10 max-w-7xl mx-auto w-full">
      
      {/* Left Column (3 cols): Fleet & Operator Summary Card */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-[#ecece0] flex-1 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-[#f0f0e4] rounded-full mb-4 flex items-center justify-center overflow-hidden relative shadow-inner">
            <div className="w-full h-full bg-[#c2c2a3] opacity-30 absolute inset-0"></div>
            <Truck className="w-10 h-10 text-[#5a5a40] relative z-10" />
          </div>
          
          <h2 className="text-xl font-serif font-bold text-[#4a4a35]">Road Freight Hub</h2>
          <p className="text-sm italic text-[#8e8e75] mb-8">Lahore · Multan · Karachi</p>
          
          <div className="w-full space-y-4">
            <div className="p-4 bg-[#f9f9f2] rounded-2xl border border-[#ecece0]/50 transition-hover hover:border-[#8b9d77]">
              <div className="text-[10px] uppercase tracking-tighter text-[#8e8e75] mb-1 font-sans">{t.stats.trips}</div>
              <div className="text-2xl font-serif font-bold text-[#5a5a40]">{trips.length}</div>
            </div>
            
            <div className="p-4 bg-[#f9f9f2] rounded-2xl border border-[#ecece0]/50 transition-hover hover:border-[#8b9d77]">
              <div className="text-[10px] uppercase tracking-tighter text-[#8e8e75] mb-1 font-sans">{t.stats.vehicles}</div>
              <div className="text-2xl font-serif font-bold text-[#5a5a40]">{vehicles.length}</div>
            </div>

            <div className="p-4 bg-[#f9f9f2] rounded-2xl border border-[#ecece0]/50 transition-hover hover:border-[#8b9d77]">
              <div className="text-[10px] uppercase tracking-tighter text-[#8e8e75] mb-1 font-sans">{t.stats.drivers}</div>
              <div className="text-2xl font-serif font-bold text-[#5a5a40]">{drivers.length}</div>
            </div>
          </div>
          
          <button
            onClick={() => onNavigate('calculator')}
            className="mt-8 w-full py-4 bg-[#5a5a40] text-white rounded-full font-medium text-sm hover:bg-[#4a4a35] shadow-xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Launch Estimator</span>
            <ArrowRight className="w-4 h-4 text-[#8b9d77]" />
          </button>
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
                View full history →
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
            - Al-Hadi Freight Wisdom
          </p>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full pointer-events-none group-hover:scale-110 transition-transform"></div>
        </div>

        {/* Minimalist Calendar Preview Card */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-[#ecece0] flex-1 flex flex-col">
          <h3 className="text-center font-bold text-xs uppercase tracking-widest text-[#8e8e75] mb-6">
            {lang === 'ur' ? 'اکتوبر 2024' : 'Freight Schedule'}
          </h3>
          
          <div className="grid grid-cols-7 gap-2 text-[10px] font-bold text-center mb-4 text-[#8b9d77]">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-[#4a4a35] flex-1 items-center">
            <div className="text-[#8e8e75]/40">29</div><div className="text-[#8e8e75]/40">30</div>
            <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>
            <div>6</div><div>7</div>
            <div className="bg-[#8b9d77] text-white w-6 h-6 rounded-full flex items-center justify-center mx-auto shadow-2xs font-bold">8</div>
            <div>9</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div><div>15</div>
            <div>16</div><div>17</div><div>18</div><div>19</div><div>20</div><div>21</div><div>22</div>
            <div>23</div><div>24</div><div>25</div><div>26</div><div>27</div><div>28</div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#ecece0] flex items-center justify-between text-xs text-[#8e8e75]">
            <span className="flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-[#8b9d77]"></span> Active Load
            </span>
            <span className="font-serif italic">3 Pending</span>
          </div>
        </div>

      </div>

    </div>
  );
};
