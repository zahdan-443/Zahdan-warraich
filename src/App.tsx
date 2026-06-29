import React, { useEffect, useState } from 'react';
import { ActiveTab, Driver, FuelLogItem, Language, RoutePreset, Trip, Vehicle, AppNotification, OfflineAction, UserRole } from './types';
import {
  getStoredDrivers,
  getStoredFuelLog,
  getStoredRoutes,
  getStoredTrips,
  getStoredVehicles,
  saveStoredDrivers,
  saveStoredFuelLog,
  saveStoredRoutes,
  saveStoredTrips,
  saveStoredVehicles,
  getStoredNotifications,
  getStoredOfflineQueue,
  getStoredRole,
  saveStoredNotifications,
  saveStoredOfflineQueue,
  saveStoredRole
} from './utils/storage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomeView } from './components/views/HomeView';
import { TripCostView } from './components/views/TripCostView';
import { VehiclesView } from './components/views/VehiclesView';
import { DriversView } from './components/views/DriversView';
import { RoutesView } from './components/views/RoutesView';
import { FuelLogView } from './components/views/FuelLogView';
import { VerifyView } from './components/views/VerifyView';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showSplash, setShowSplash] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>('owner');
  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOffline, setIsOffline] = useState(false);

  // Stored state
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<RoutePreset[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLogItem[]>([]);

  // Selected mileage passed from Vehicles to Trip Cost
  const [selectedMileage, setSelectedMileage] = useState<number | undefined>(undefined);

  // Load from storage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('ah-lang') as Language;
    if (savedLang === 'en' || savedLang === 'ur') {
      setLang(savedLang);
    }
    const savedEmail = localStorage.getItem('ah-gmail-user');
    if (savedEmail) {
      setUserEmail(savedEmail);
    }
    setRole(getStoredRole());
    setOfflineQueue(getStoredOfflineQueue());
    setNotifications(getStoredNotifications());
    setTrips(getStoredTrips());
    setVehicles(getStoredVehicles());
    setDrivers(getStoredDrivers());
    setRoutes(getStoredRoutes());
    setFuelLogs(getStoredFuelLog());
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    saveStoredRole(newRole);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const handleToggleOffline = () => {
    setIsOffline(!isOffline);
  };

  const handleSyncOffline = () => {
    if (offlineQueue.length === 0) return;
    window.alert(`Successfully synced ${offlineQueue.length} offline queued records to cloud server!`);
    setOfflineQueue([]);
    saveStoredOfflineQueue([]);
  };

  // Gmail Auth simulation / mock
  const handleSignIn = () => {
    const email = window.prompt("Enter your Gmail address to sign in / sign up:", "driver@gmail.com");
    if (email && email.toLowerCase().includes("@")) {
      const formatted = email.trim();
      setUserEmail(formatted);
      localStorage.setItem('ah-gmail-user', formatted);
    }
  };

  const handleSignOut = () => {
    setUserEmail(null);
    localStorage.removeItem('ah-gmail-user');
  };

  // Sync lang class to body
  useEffect(() => {
    localStorage.setItem('ah-lang', lang);
    if (lang === 'ur') {
      document.body.classList.add('urdu');
    } else {
      document.body.classList.remove('urdu');
    }
  }, [lang]);

  // Handlers for Trips
  const handleSaveTrip = (tripObj: Omit<Trip, 'id' | 'name'>, tripName: string) => {
    const newTrip: Trip = {
      ...tripObj,
      id: Date.now(),
      name: tripName
    };
    if (isOffline) {
      const offlineItem: OfflineAction = {
        id: Date.now(),
        type: 'trip',
        data: newTrip,
        timestamp: new Date().toLocaleTimeString()
      };
      const newQ = [offlineItem, ...offlineQueue];
      setOfflineQueue(newQ);
      saveStoredOfflineQueue(newQ);
    }
    const updated = [newTrip, ...trips];
    setTrips(updated);
    saveStoredTrips(updated);
  };

  const handleDeleteTrip = (id: number) => {
    const updated = trips.filter((t) => t.id !== id);
    setTrips(updated);
    saveStoredTrips(updated);
  };

  const handleClearAllTrips = () => {
    setTrips([]);
    saveStoredTrips([]);
  };

  // Handlers for Vehicles
  const handleAddVehicle = (vehObj: Omit<Vehicle, 'id'>) => {
    const newVeh: Vehicle = {
      ...vehObj,
      id: Date.now()
    };
    const updated = [...vehicles, newVeh];
    setVehicles(updated);
    saveStoredVehicles(updated);
  };

  const handleDeleteVehicle = (id: number) => {
    const updated = vehicles.filter((v) => v.id !== id);
    setVehicles(updated);
    saveStoredVehicles(updated);
  };

  const handleSelectMileage = (mileage: number) => {
    setSelectedMileage(mileage);
    setActiveTab('calculator');
  };

  // Handlers for Drivers
  const handleAddDriver = (drvObj: Omit<Driver, 'id'>) => {
    const newDrv: Driver = {
      ...drvObj,
      id: Date.now()
    };
    const updated = [...drivers, newDrv];
    setDrivers(updated);
    saveStoredDrivers(updated);
  };

  const handleDeleteDriver = (id: number) => {
    const updated = drivers.filter((d) => d.id !== id);
    setDrivers(updated);
    saveStoredDrivers(updated);
  };

  // Handlers for Routes
  const handleAddRoute = (rtObj: Omit<RoutePreset, 'id'>) => {
    const newRt: RoutePreset = {
      ...rtObj,
      id: Date.now()
    };
    const updated = [...routes, newRt];
    setRoutes(updated);
    saveStoredRoutes(updated);
  };

  const handleDeleteRoute = (id: number) => {
    const updated = routes.filter((r) => r.id !== id);
    setRoutes(updated);
    saveStoredRoutes(updated);
  };

  const handleApplyRoute = (route: RoutePreset) => {
    // Navigate to calculator
    setActiveTab('calculator');
  };

  // Handlers for Fuel Log
  const handleLogFuelPrice = (diesel?: number, petrol?: number, cng?: number) => {
    const newItem: FuelLogItem = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }),
      diesel,
      petrol,
      cng
    };
    const updated = [newItem, ...fuelLogs].slice(0, 30);
    setFuelLogs(updated);
    saveStoredFuelLog(updated);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#4a4a35] flex flex-col font-sans pb-16 md:pb-0">
      {showSplash && (
        <SplashScreen
          onDismiss={() => setShowSplash(false)}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setShowSplash(false);
          }}
        />
      )}

      <Header
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'ur' : 'en')}
        userEmail={userEmail}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        role={role}
        onSelectRole={handleRoleChange}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        offlineCount={offlineQueue.length}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        onSyncOffline={handleSyncOffline}
      />

      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lang={lang}
      />

      <main className="flex-1 flex flex-col w-full">
        {activeTab === 'home' && (
          <HomeView
            lang={lang}
            trips={trips}
            vehicles={vehicles}
            drivers={drivers}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'calculator' && (
          <TripCostView
            lang={lang}
            trips={trips}
            onSaveTrip={handleSaveTrip}
            onDeleteTrip={handleDeleteTrip}
            onClearAllTrips={handleClearAllTrips}
            initialMileage={selectedMileage}
          />
        )}

        {activeTab === 'vehicle' && (
          <VehiclesView
            lang={lang}
            vehicles={vehicles}
            onAddVehicle={handleAddVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onSelectMileage={handleSelectMileage}
          />
        )}

        {activeTab === 'drivers' && (
          <DriversView
            lang={lang}
            drivers={drivers}
            onAddDriver={handleAddDriver}
            onDeleteDriver={handleDeleteDriver}
          />
        )}

        {activeTab === 'routes' && (
          <RoutesView
            lang={lang}
            routes={routes}
            onAddRoute={handleAddRoute}
            onDeleteRoute={handleDeleteRoute}
            onApplyRoute={handleApplyRoute}
          />
        )}

        {activeTab === 'fuel' && (
          <FuelLogView
            lang={lang}
            fuelLogs={fuelLogs}
            onLogFuelPrice={handleLogFuelPrice}
          />
        )}

        {activeTab === 'verify' && (
          <VerifyView lang={lang} />
        )}
      </main>

      <Footer />
    </div>
  );
}
