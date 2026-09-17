import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  PhoneCall,
  UserCheck,
  AlertTriangle,
  Radio,
  Pill,
  Building2,
  Bus,
  Home,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { GeolocationState } from '../hooks/useGeolocation.ts';
import { HelplineGrid } from '../components/HelplineGrid.tsx';
import { SOSButtonModal } from '../components/SOSButtonModal.tsx';
import { Footer } from '../components/Footer.tsx';
import { contactService, sosService, amenityService } from '../services/api.ts';
import { EmergencyContact, SOSHistory, Amenity } from '../types.ts';
import { triggerEmergencyDialPad } from '../utils/emergencyDialer.ts';

interface DashboardProps {
  geoState: GeolocationState;
}

export const Dashboard: React.FC<DashboardProps> = ({ geoState }) => {
  const { user, isAuthenticated } = useAuth();
  const [sosModalOpen, setSosModalOpen] = useState<boolean>(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [recentSos, setRecentSos] = useState<SOSHistory | null>(null);
  const [nearbyCount, setNearbyCount] = useState<number>(0);
  const [closestSafePlace, setClosestSafePlace] = useState<Amenity | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  const loadData = async () => {
    setLoadingStats(true);
    try {
      if (isAuthenticated) {
        const [contactRes, sosRes] = await Promise.all([
          contactService.getContacts().catch(() => ({ contacts: [], count: 0 })),
          sosService.getHistory().catch(() => []),
        ]);
        setContacts(contactRes.contacts || []);
        if (sosRes && sosRes.length > 0) {
          setRecentSos(sosRes[0]);
        }
      }

      // Fetch nearby amenities around current coords
      const places = await amenityService.getNearby(geoState.latitude, geoState.longitude);
      setNearbyCount(places.length);
      if (places.length > 0) {
        setClosestSafePlace(places[0]);
      }
    } catch (err) {
      console.warn('Dashboard data load warning:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated, geoState.latitude, geoState.longitude]);

  return (
    <>
      <div className="min-h-screen pb-20 sm:pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* 1. Status Bar & Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                {user ? `Namaste, ${user.name.split(' ')[0]}` : 'Welcome to Sakhi'}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Active Shield
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Your comprehensive personal safety companion. Help is always one tap away.
            </p>
          </div>
        </div>

        {/* GPS Live Telemetry Indicator */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 self-start md:self-auto">
          <div className="flex items-center gap-2">
            <Radio
              className={`w-4 h-4 ${
                geoState.status === 'active'
                  ? 'text-emerald-500 animate-pulse'
                  : 'text-amber-500'
              }`}
            />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                GPS Position Status
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {geoState.status === 'active'
                  ? `Locked (±${geoState.accuracy}m)`
                  : 'Metropolitan Benchmark'}
              </span>
            </div>
          </div>
          <button
            onClick={() => geoState.refreshLocation()}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 transition-colors"
          >
            Recalibrate
          </button>
        </div>
      </div>

      {/* Warning banner if user has fewer than 2 emergency contacts configured */}
      {isAuthenticated && contacts.length < 2 && !loadingStats && (
        <div
          id="contacts-warning-banner"
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-900"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold">
                Safety Warning: You have only {contacts.length} emergency contact configured
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                We strongly recommend registering at least 2 trusted contacts (parents, guardians, or friends) for instant SOS broadcasts.
              </p>
            </div>
          </div>
          <Link
            to="/contacts"
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors"
          >
            Add Contact
          </Link>
        </div>
      )}

      {/* 2. MASSIVE CENTRAL SOS BUTTON SECTION */}
      <section
        id="sos-main-section"
        className="relative bg-linear-to-b from-white to-rose-50/40 rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-sm flex flex-col items-center text-center overflow-hidden"
      >
        {/* Ambient background glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200 mb-4 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> One-Tap Rapid Emergency Dispatch
          </span>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            Need Immediate Help?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 mb-8 leading-relaxed">
            Press and hold or tap the emergency SOS button. It transmits your live Google Maps location coordinates and SMS distress beacon to your registered contacts.
          </p>

          {/* THE MASSIVE CENTRAL SOS BUTTON */}
          <div className="relative flex items-center justify-center my-2">
            {/* Outer pulsating ring */}
            <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-rose-600/15 animate-ping-slow pointer-events-none" />
            <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-rose-600/25 animate-pulse pointer-events-none" />

            <button
              id="main-sos-button"
              type="button"
              onClick={() => {
                triggerEmergencyDialPad('112');
                setSosModalOpen(true);
              }}
              className="relative z-20 w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-linear-to-tr from-red-700 via-rose-600 to-rose-500 text-white flex flex-col items-center justify-center shadow-2xl shadow-rose-600/50 border-4 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-hidden"
              aria-label="Trigger Emergency SOS"
            >
              <ShieldAlert className="w-14 h-14 sm:w-16 sm:h-16 mb-1 text-white animate-pulse" />
              <span className="font-display text-2xl sm:text-3xl font-black tracking-wider">
                SOS
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-rose-100 mt-0.5">
                Auto-Dials 112
              </span>
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> 3-Sec Safety Abort Window
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Auto-SMS Dispatched
            </span>
          </div>
        </div>
      </section>

      {/* 3. Quick Safe Amenity Categories & Closest Safe Point */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Category Chips */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                Verified Nearby Amenities
              </h3>
              <p className="text-xs text-slate-500">
                Grounded safe points within quick reach of your current coordinates
              </p>
            </div>
            <Link
              to="/amenities"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              View All ({nearbyCount}) <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                title: 'Police Desks',
                type: 'police',
                count: '3 Nearby',
                icon: Shield,
                color: 'bg-rose-50 text-rose-700 border-rose-200',
              },
              {
                title: '24/7 Pharmacies',
                type: 'pharmacy',
                count: 'Open Now',
                icon: Pill,
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              },
              {
                title: 'Emergency ER',
                type: 'hospital',
                count: 'Trauma Care',
                icon: Building2,
                color: 'bg-red-50 text-red-700 border-red-200',
              },
              {
                title: 'Safe Transit Hubs',
                type: 'transport',
                count: 'Metro & Cabs',
                icon: Bus,
                color: 'bg-blue-50 text-blue-700 border-blue-200',
              },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.type}
                  to={`/amenities?type=${cat.type}`}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-rose-300 hover:shadow-xs transition-all flex flex-col justify-between group bg-white"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cat.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="mt-3">
                    <span className="font-bold text-sm text-slate-900 block group-hover:text-rose-600 transition-colors">
                      {cat.title}
                    </span>
                    <span className="text-[11px] text-slate-500">{cat.count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Closest Safe Refuge Card */}
        <div className="bg-linear-to-br from-rose-900 to-slate-900 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-400/30">
                Closest Safe Point
              </span>
              <span className="text-xs font-semibold text-emerald-400">
                {closestSafePlace?.isOpen ? '● Open 24/7' : 'Verified'}
              </span>
            </div>

            <h4 className="font-bold text-lg text-white mt-2">
              {closestSafePlace?.name || "Women's Special Police Desk"}
            </h4>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
              {closestSafePlace?.address || 'Civil Lines Main Road, Station Circle'}
            </p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-300">
                {closestSafePlace?.distanceKm ?? 0.3} km
              </span>
              <span className="text-xs text-slate-400">approx. walking distance</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex gap-2">
            <a
              href={`tel:${closestSafePlace?.phone || '1090'}`}
              className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call ({closestSafePlace?.phone || '1090'})</span>
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${closestSafePlace?.lat ?? 28.6139},${closestSafePlace?.lng ?? 77.2090}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Get directions"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 4. Recent SOS Alert Summary Card (if triggered) */}
      {recentSos && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  recentSos.status === 'TRIGGERED' ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'
                }`}
              />
              <h3 className="font-display text-base font-bold text-slate-900">
                Latest SOS Alert Dispatch Record
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                recentSos.status === 'TRIGGERED'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              Status: {recentSos.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 block font-medium">Timestamp:</span>
              <span className="font-semibold text-slate-800">
                {new Date(recentSos.timestamp).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Recipients Dispatched:</span>
              <span className="font-semibold text-slate-800">
                {recentSos.recipientCount} Contacts (SMS Logged)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Location Telemetry:</span>
              <a
                href={recentSos.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-600 hover:underline font-semibold flex items-center gap-1"
              >
                View Broadcasted Google Map <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 5. Indian National & State Emergency Helplines Grid */}
      <HelplineGrid limit={6} />

        {/* SOS Modal dialog */}
        <SOSButtonModal
          isOpen={sosModalOpen}
          onClose={() => setSosModalOpen(false)}
          geoState={geoState}
          onSosTriggered={loadData}
        />
      </div>
      <Footer />
    </>
  );
};
