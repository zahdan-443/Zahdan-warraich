export type Language = 'en' | 'ur';
export type FuelType = 'diesel' | 'petrol' | 'cng';
export type ActiveTab = 'home' | 'calculator' | 'vehicle' | 'drivers' | 'routes' | 'fuel' | 'verify';
export type CalcSubTab = 'calc' | 'history' | 'summary';

export interface Trip {
  id: number;
  name: string;
  fuelType: string;
  fuelTypeRaw: FuelType;
  dist: number;
  consumed: string;
  fuelCost: number;
  toll: number;
  loading: number;
  driver: number;
  other: number;
  total: number;
  isReturn: boolean;
  date: string;
  time: string;
  month: string;
}

export interface Vehicle {
  id: number;
  reg: string;
  model: string;
  mileage: number;
  owner: string;
  capacity: number;
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  license: string;
  lictype: string;
  cnic: string;
}

export interface RoutePreset {
  id: number;
  from: string;
  to: string;
  dist: number;
  toll: number;
}

export interface FuelLogItem {
  id: number;
  date: string;
  diesel?: number;
  petrol?: number;
  cng?: number;
}

export type UserRole = 'owner' | 'driver' | 'accountant';

export interface OfflineAction {
  id: number;
  type: 'trip' | 'vehicle' | 'driver' | 'fuel';
  data: any;
  timestamp: string;
}

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'fuel' | 'fleet' | 'tax';
}

export const DICTIONARY = {
  en: {
    appTitle: "Al-Hadi",
    appTitleHighlight: "Goods",
    appSub: "Road Freight Toolkit",
    nav: {
      home: "Dashboard",
      calculator: "Trip Cost",
      vehicle: "Vehicles",
      drivers: "Drivers",
      routes: "Routes",
      fuel: "Fuel Log",
      verify: "Gov Verify"
    },
    heroTitle: "Built for Punjab Road Freight",
    heroHighlight: "Safar",
    heroDesc: "Trip calculations, driver directories, fleet profiles, preset routes & Punjab Government verification portals — beautifully orchestrated.",
    stats: {
      trips: "Trips Logged",
      vehicles: "Active Fleet",
      drivers: "Registered Drivers"
    },
    quickAccess: "Quick Operations",
    recentTrips: "Recent Safar Logs",
    noTrips: "No trip records saved yet. Launch the Trip Cost calculator to estimate freight expenses.",
    calc: {
      title: "Trip Cost Estimator",
      calculateTab: "Estimate",
      historyTab: "Safar History",
      summaryTab: "Analytics",
      fuelDetails: "Fuel Parameters",
      fuelPrice: "Fuel Price (PKR / L)",
      mileage: "Expected Mileage (km / L)",
      distance: "Route Distance (km)",
      routeExtras: "Freight Add-ons",
      toll: "Toll & Motorway (PKR)",
      loading: "Loading / Unloading Labor",
      driverAllowance: "Driver Kharcha / Allowance",
      otherCosts: "Miscellaneous Challan / Repair",
      returnTrip: "Round Trip (Return)",
      returnTripSub: "Automatically doubles route distance",
      calcBtn: "Calculate Total Freight Cost",
      resetBtn: "Reset Fields",
      breakdown: "Expense Breakdown",
      fuelUsed: "Est. Consumption",
      totalCost: "Total Freight Cost",
      saveTrip: "Record to Diary",
      whatsappShare: "Share via WhatsApp",
      emptyHistory: "No saved trip logs found in your diary.",
      clearAll: "Erase All Records",
      monthlySummary: "Monthly Overview",
      totalKM: "Total Distance",
      totalSpent: "Total Expenditure",
      avgPerTrip: "Average Freight Cost",
      last6Months: "Recent Expenditure Trend"
    },
    fleet: {
      title: "Fleet Directory",
      addBtn: "Add New Vehicle",
      empty: "No trucks or trailers registered in your active fleet.",
      regNo: "Registration No. (e.g. LHR-7860)",
      model: "Make / Model (e.g. Hino 500 Master)",
      mileage: "Avg Mileage (km / L)",
      owner: "Owner Name",
      capacity: "Payload Capacity (Tons)",
      useMileage: "Apply Mileage"
    },
    drivers: {
      title: "Driver Directory",
      addBtn: "Register Driver",
      empty: "No driver profiles added to directory.",
      fullName: "Full Name",
      phone: "WhatsApp / Phone",
      licenseNo: "DLIMS License No.",
      licenseType: "License Category",
      cnic: "CNIC No.",
      callBtn: "WhatsApp"
    },
    routes: {
      title: "Preset Freight Routes",
      addBtn: "New Preset Route",
      subtitle: "Tap any saved corridor to instantly populate calculator metrics",
      empty: "No preset freight corridors saved.",
      from: "Origin City",
      to: "Destination City",
      distance: "Corridor Length (km)",
      toll: "Average Toll (PKR)",
      applyBtn: "Load Route"
    },
    fuel: {
      title: "Fuel Price Tracker",
      logTitle: "Log Today's Market Rate",
      saveBtn: "Update Market Rates",
      trendTitle: "Historic Price Diary",
      empty: "No market rates logged yet."
    },
    verify: {
      title: "Government Verification Portals",
      subtitle: "Direct access to official Excise, DLIMS, and Safe City portals",
      officialBadge: "Official Gov Portal",
      openBtn: "Launch Portal",
      mtmis: {
        title: "Vehicle Tax & Ownership",
        sub: "Excise & Taxation Punjab (MTMIS)",
        s1: "Launch the official MTMIS Punjab web portal",
        s2: "Input complete vehicle registration alphanumeric plate",
        s3: "Verify token tax clearance, owner identity, and chassis status"
      },
      dlims: {
        title: "Driving License Status",
        sub: "DLIMS Punjab Police",
        s1: "Open the DLIMS Punjab license verification page",
        s2: "Provide driver CNIC or driving license serial number",
        s3: "Check license expiry date and authorized vehicle categories (HTV/LTV)"
      },
      challan: {
        title: "E-Challan & Camera Violations",
        sub: "Punjab Safe Cities Authority (PSCA)",
        s1: "Access PSCA E-Challan official portal",
        s2: "Enter vehicle number plate or owner CNIC",
        s3: "Review pending traffic citations and generate payment PSID"
      }
    },
    modals: {
      saveTripTitle: "Record Safar to Diary",
      tripNameLbl: "Safar Identifier",
      tripNamePlace: "e.g. Faisalabad to Rawalpindi Wheat",
      cancel: "Discard",
      confirm: "Save Record"
    }
  },
  ur: {
    appTitle: "الھادی",
    appTitleHighlight: "گڈز",
    appSub: "روڈ فریٹ ٹول کٹ",
    nav: {
      home: "ڈیش بورڈ",
      calculator: "سفر خرچ",
      vehicle: "گاڑیاں",
      drivers: "ڈرائیور",
      routes: "راستے",
      fuel: "ایندھن لاگ",
      verify: "تصدیق"
    },
    heroTitle: "پنجاب کے ٹرانسپورٹرز کے لیے",
    heroHighlight: "سفر",
    heroDesc: "سفر کے اخراجات کا حساب، ڈرائیور ڈائریکٹری، فلیٹ پروفائلز، راستے اور پنجاب حکومت کے تصدیقی پورٹلز — ایک خوبصورت انداز میں۔",
    stats: {
      trips: "محفوظ سفر",
      vehicles: "فعال گاڑیاں",
      drivers: "رجسٹرڈ ڈرائیور"
    },
    quickAccess: "فوری رسائی",
    recentTrips: "حالیہ سفر کا ریکارڈ",
    noTrips: "ابھی کوئی سفر محفوظ نہیں۔ سفر خرچ کیلکولیٹر استعمال کریں۔",
    calc: {
      title: "سفر خرچ کیلکولیٹر",
      calculateTab: "حساب کریں",
      historyTab: "ریکارڈ",
      summaryTab: "تجزیہ",
      fuelDetails: "ایندھن کی تفصیل",
      fuelPrice: "ایندھن قیمت (روپے / لیٹر)",
      mileage: "مائلیج (کلومیٹر / لیٹر)",
      distance: "سفر کا فاصلہ (کلومیٹر)",
      routeExtras: "اضافی اخراجات",
      toll: "ٹول اور موٹروے ٹیکس (روپے)",
      loading: "لوڈنگ / ان لوڈنگ مزدوری",
      driverAllowance: "ڈرائیور الاؤنس / خرچہ",
      otherCosts: "دیگر اخراجات / مرمت",
      returnTrip: "واپسی کا سفر (دوگنا)",
      returnTripSub: "فاصلہ خودکار طور پر دوگنا ہو جائے گا",
      calcBtn: "کل اخراجات کا حساب کریں",
      resetBtn: "دوبارہ شروع کریں",
      breakdown: "خرچ کی تفصیل",
      fuelUsed: "ایندھن کا استعمال",
      totalCost: "کل سفر خرچ",
      saveTrip: "ڈائری میں محفوظ کریں",
      whatsappShare: "واٹس ایپ پر بھیجیں",
      emptyHistory: "آپ کی ڈائری میں کوئی محفوظ سفر نہیں ملا۔",
      clearAll: "تمام ریکارڈ حذف کریں",
      monthlySummary: "ماہانہ جائزہ",
      totalKM: "کل فاصلہ",
      totalSpent: "کل خرچ",
      avgPerTrip: "فی سفر اوسط خرچ",
      last6Months: "گزشتہ 6 ماہ کا رجحان"
    },
    fleet: {
      title: "گاڑیوں کا ریکارڈ",
      addBtn: "نئی گاڑی شامل کریں",
      empty: "آپ کے فلیٹ میں کوئی گاڑی درج نہیں۔",
      regNo: "رجسٹریشن نمبر (مثلاً LHR-7860)",
      model: "گاڑی کی قسم / ماڈل (مثلاً Hino 500)",
      mileage: "اوسط مائلیج (کلومیٹر / لیٹر)",
      owner: "مالک کا نام",
      capacity: "وزن اٹھانے کی گنجائش (ٹن)",
      useMileage: "مائلیج لگائیں"
    },
    drivers: {
      title: "ڈرائیور ڈائریکٹری",
      addBtn: "ڈرائیور درج کریں",
      empty: "ڈائریکٹری میں کوئی ڈرائیور شامل نہیں۔",
      fullName: "پورا نام",
      phone: "واٹس ایپ / فون نمبر",
      licenseNo: "لائسنس نمبر",
      licenseType: "لائسنس کی قسم",
      cnic: "شناختی کارڈ نمبر",
      callBtn: "واٹس ایپ"
    },
    routes: {
      title: "محفوظ راستے",
      addBtn: "نیا راستہ شامل کریں",
      subtitle: "کسی بھی راستے پر کلک کریں تو فاصلہ اور ٹول خودکار بھر جائے گا",
      empty: "کوئی محفوظ راستہ موجود نہیں۔",
      from: "روانگی کا شہر",
      to: "منزل کا شہر",
      distance: "فاصلہ (کلومیٹر)",
      toll: "اوسط ٹول ٹیکس (روپے)",
      applyBtn: "راستہ لوڈ کریں"
    },
    fuel: {
      title: "ایندھن قیمت ٹریکر",
      logTitle: "آج کا مارکیٹ ریٹ درج کریں",
      saveBtn: "ریٹ محفوظ کریں",
      trendTitle: "قیمتوں کی تاریخ",
      empty: "کوئی ریٹ محفوظ نہیں کیا گیا۔"
    },
    verify: {
      title: "سرکاری تصدیقی پورٹلز",
      subtitle: "ایکسائز، ڈرائیونگ لائسنس اور سیف سٹی پورٹلز تک براہ راست رسائی",
      officialBadge: "سرکاری پورٹل",
      openBtn: "پورٹل کھولیں",
      mtmis: {
        title: "گاڑی کی ملکیت اور ٹیکس تصدیق",
        sub: "محکمہ ایکسائز اینڈ ٹیکسیشن پنجاب (MTMIS)",
        s1: "MTMIS پنجاب کا سرکاری ویب پورٹل کھولیں",
        s2: "گاڑی کا مکمل رجسٹریشن نمبر درج کریں",
        s3: "ٹوکن ٹیکس، مالک کا نام اور چیسس نمبر تصدیق کریں"
      },
      dlims: {
        title: "ڈرائیونگ لائسنس کی تصدیق",
        sub: "DLIMS پنجاب پولیس",
        s1: "DLIMS پنجاب کی ویب سائٹ کھولیں",
        s2: "ڈرائیور کا شناختی کارڈ یا لائسنس نمبر درج کریں",
        s3: "لائسنس کی میعاد اور مجاز کیٹگری (HTV/LTV) چیک کریں"
      },
      challan: {
        title: "ای چالان اور کیمرہ خلاف ورزی",
        sub: "پنجاب سیف سٹیز اتھارٹی (PSCA)",
        s1: "PSCA ای چالان پورٹل پر جائیں",
        s2: "گاڑی کا نمبر یا مالک کا شناختی کارڈ لکھیں",
        s3: "باقی چالان دیکھیں اور ادائیگی کے لیے PSID حاصل کریں"
      }
    },
    modals: {
      saveTripTitle: "سفر ڈائری میں محفوظ کریں",
      tripNameLbl: "سفر کا نام / پہچان",
      tripNamePlace: "مثلاً لاہور سے کراچی (چاول)",
      cancel: "منسوخ",
      confirm: "محفوظ کریں"
    }
  }
};
