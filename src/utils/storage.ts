import { Driver, FuelLogItem, RoutePreset, Trip, Vehicle } from '../types';

const INITIAL_TRIPS: Trip[] = [
  {
    id: 101,
    name: "Lahore to Karachi (Sugar Load)",
    fuelType: "Diesel 🛢️",
    fuelTypeRaw: "diesel",
    dist: 1250,
    consumed: "138.89",
    fuelCost: 40278,
    toll: 4500,
    loading: 3500,
    driver: 5000,
    other: 1200,
    total: 54478,
    isReturn: false,
    date: "26 Oct, 2024",
    time: "08:30 AM",
    month: "Oct 24"
  },
  {
    id: 102,
    name: "Multan to Faisalabad (Cotton)",
    fuelType: "Diesel 🛢️",
    fuelTypeRaw: "diesel",
    dist: 240,
    consumed: "26.67",
    fuelCost: 7734,
    toll: 800,
    loading: 2000,
    driver: 2500,
    other: 0,
    total: 13034,
    isReturn: false,
    date: "25 Oct, 2024",
    time: "02:15 PM",
    month: "Oct 24"
  },
  {
    id: 103,
    name: "Rawalpindi to Gujranwala (Cement)",
    fuelType: "Diesel 🛢️",
    fuelTypeRaw: "diesel",
    dist: 210,
    consumed: "23.33",
    fuelCost: 6766,
    toll: 650,
    loading: 1500,
    driver: 2000,
    other: 500,
    total: 11416,
    isReturn: false,
    date: "23 Oct, 2024",
    time: "11:00 AM",
    month: "Oct 24"
  }
];

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 1, reg: "LHR-7860", model: "Hino 500 Master", mileage: 9, owner: "Chaudhry Asad", capacity: 15 },
  { id: 2, reg: "MN-4321", model: "Isuzu FVR 34", mileage: 8.5, owner: "Haji Liaquat", capacity: 20 },
  { id: 3, reg: "FD-9988", model: "Master Forland", mileage: 11, owner: "Malik Usman", capacity: 7 }
];

const INITIAL_DRIVERS: Driver[] = [
  { id: 1, name: "Ustad Mukhtar Ahmed", phone: "3001234567", license: "PB-99214", lictype: "HTV", cnic: "35201-1234567-1" },
  { id: 2, name: "Shakir Ali Jutt", phone: "3219876543", license: "MN-44102", lictype: "HTV", cnic: "36302-9876543-3" },
  { id: 3, name: "Bilal Hussain", phone: "3334567890", license: "LHR-11029", lictype: "LTV", cnic: "35202-4567890-5" }
];

const INITIAL_ROUTES: RoutePreset[] = [
  { id: 1, from: "Lahore", to: "Karachi Port", dist: 1250, toll: 4800 },
  { id: 2, from: "Faisalabad", to: "Rawalpindi", dist: 285, toll: 950 },
  { id: 3, from: "Multan", to: "Lahore", dist: 340, toll: 1100 },
  { id: 4, from: "Sialkot", to: "Islamabad Dryport", dist: 230, toll: 750 }
];

const INITIAL_FUEL: FuelLogItem[] = [
  { id: 1, date: "26 Oct, 2024", diesel: 289.5, petrol: 279.0, cng: 220.0 },
  { id: 2, date: "15 Oct, 2024", diesel: 294.0, petrol: 281.5, cng: 220.0 },
  { id: 3, date: "01 Oct, 2024", diesel: 298.0, petrol: 285.0, cng: 215.0 }
];

export function getStoredTrips(): Trip[] {
  try {
    const data = localStorage.getItem('ah-trips');
    return data ? JSON.parse(data) : INITIAL_TRIPS;
  } catch {
    return INITIAL_TRIPS;
  }
}
export function saveStoredTrips(trips: Trip[]) {
  localStorage.setItem('ah-trips', JSON.stringify(trips));
}

export function getStoredVehicles(): Vehicle[] {
  try {
    const data = localStorage.getItem('ah-vehicles');
    return data ? JSON.parse(data) : INITIAL_VEHICLES;
  } catch {
    return INITIAL_VEHICLES;
  }
}
export function saveStoredVehicles(vehicles: Vehicle[]) {
  localStorage.setItem('ah-vehicles', JSON.stringify(vehicles));
}

export function getStoredDrivers(): Driver[] {
  try {
    const data = localStorage.getItem('ah-drivers');
    return data ? JSON.parse(data) : INITIAL_DRIVERS;
  } catch {
    return INITIAL_DRIVERS;
  }
}
export function saveStoredDrivers(drivers: Driver[]) {
  localStorage.setItem('ah-drivers', JSON.stringify(drivers));
}

export function getStoredRoutes(): RoutePreset[] {
  try {
    const data = localStorage.getItem('ah-routes');
    return data ? JSON.parse(data) : INITIAL_ROUTES;
  } catch {
    return INITIAL_ROUTES;
  }
}
export function saveStoredRoutes(routes: RoutePreset[]) {
  localStorage.setItem('ah-routes', JSON.stringify(routes));
}

export function getStoredFuelLog(): FuelLogItem[] {
  try {
    const data = localStorage.getItem('ah-fuel');
    return data ? JSON.parse(data) : INITIAL_FUEL;
  } catch {
    return INITIAL_FUEL;
  }
}
export function saveStoredFuelLog(items: FuelLogItem[]) {
  localStorage.setItem('ah-fuel', JSON.stringify(items));
}

import { AppNotification, OfflineAction, UserRole } from '../types';

export function getStoredRole(): UserRole {
  return (localStorage.getItem('ah-user-role') as UserRole) || 'owner';
}
export function saveStoredRole(role: UserRole) {
  localStorage.setItem('ah-user-role', role);
}

export function getStoredOfflineQueue(): OfflineAction[] {
  try {
    const data = localStorage.getItem('ah-offline-queue');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
export function saveStoredOfflineQueue(queue: OfflineAction[]) {
  localStorage.setItem('ah-offline-queue', JSON.stringify(queue));
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    title: "⛽ Fuel Alert: OGRA Revision",
    message: "Diesel price revised to PKR 290/L effective midnight.",
    time: "10 mins ago",
    unread: true,
    type: "fuel"
  },
  {
    id: 2,
    title: "🚛 Fleet Maintenance",
    message: "LHR-7860 oil change due in 450 km.",
    time: "2 hours ago",
    unread: true,
    type: "fleet"
  },
  {
    id: 3,
    title: "🏛️ Excise Challan Check",
    message: "No pending E-Challans found on registered fleet.",
    time: "Yesterday",
    unread: false,
    type: "tax"
  }
];

export function getStoredNotifications(): AppNotification[] {
  try {
    const data = localStorage.getItem('ah-notifs');
    return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}
export function saveStoredNotifications(notifs: AppNotification[]) {
  localStorage.setItem('ah-notifs', JSON.stringify(notifs));
}
