import React, { useState, useEffect } from 'react';
import {
  Bus,
  Train,
  Car,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  PhoneCall,
  Share2,
  AlertOctagon,
  Copy,
  Check,
} from 'lucide-react';
import { GeolocationState } from '../hooks/useGeolocation.ts';
import { amenityService } from '../services/api.ts';
import { Amenity } from '../types.ts';

interface TransportPageProps {
  geoState: GeolocationState;
}

export const TransportPage: React.FC<TransportPageProps> = ({ geoState }) => {
  const [transportHubs, setTransportHubs] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadTransport() {
      setLoading(true);
      try {
        const data = await amenityService.getNearby(
          geoState.latitude,
          geoState.longitude,
          'transport'
        );
        setTransportHubs(data);
      } catch (err) {
        console.error('Failed to load transport:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTransport();
  }, [geoState.latitude, geoState.longitude]);

  // Compute walking time (at approx 4.5 km/h or 75 meters per minute)
  const calculateWalkingMinutes = (distanceKm: number) => {
    const minutes = Math.round((distanceKm * 1000) / 75);
    return minutes < 1 ? 1 : minutes;
  };

  const shareLiveJourney = () => {
    const mapsLink = `https://www.google.com/maps?q=${geoState.latitude},${geoState.longitude}`;
    const shareText = `I am traveling. Here is my live GPS location for safety: ${mapsLink}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Sakhi - Live Transit Location Share',
          text: shareText,
          url: mapsLink,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen pb-24 sm:pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Safe Urban Transit & Transport Hubs
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Verified Transit
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time walking estimates, designated women coaches, and monitored taxi booths
          </p>
        </div>

        {/* Share Journey Shortcut */}
        <button
          onClick={shareLiveJourney}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors self-start md:self-auto"
        >
          {shareCopied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share My Live Journey</span>
            </>
          )}
        </button>
      </div>

      {/* Safety Checklist Banner */}
      <div className="bg-linear-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-sm border border-slate-800">
        <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Night Transit & Commute Safety Checklist</span>
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold mb-4">
          5 Essentials Before Boarding Any Vehicle
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Verify Vehicle Number Plate:</strong> Cross-check license plate and driver photo on app before stepping in.
            </span>
          </div>
          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Check Door Child-Locks:</strong> Ensure rear door child-lock is disengaged so you can open from inside freely.
            </span>
          </div>
          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Board First Metro Coach:</strong> Reserved exclusively for women with CCTV and alarm button to the train driver.
            </span>
          </div>
          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Prepaid Police Auto Booths:</strong> Always favor officially monitored prepaid kiosks over random street hails.
            </span>
          </div>
          <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Share Live Trip:</strong> Keep emergency contact in the loop with live GPS telemetry active.
            </span>
          </div>
        </div>
      </div>

      {/* Transport Hubs List */}
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900 mb-4">
          Nearby Transit Stations & Monitored Stands
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse h-48"></div>
            ))}
          </div>
        ) : transportHubs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <p className="text-slate-500 text-xs">No transit hubs recorded in immediate vicinity.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {transportHubs.map((hub) => {
              const walkingMins = calculateWalkingMinutes(hub.distanceKm);
              return (
                <div
                  key={hub.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        <Train className="w-3.5 h-3.5" />
                        {hub.subType || 'Transit Point'}
                      </span>
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                        {hub.distanceKm} km
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{hub.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{hub.address}</p>

                    {/* Walking time badge */}
                    <div className="mt-3 flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>
                        Approx. <strong>{walkingMins} mins walk</strong> from your current spot
                      </span>
                    </div>

                    {hub.notes && (
                      <p className="mt-2 text-[11px] text-slate-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                        {hub.notes}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                    <a
                      href={`tel:${hub.phone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                      <span>Contact Desk</span>
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hub.lat},${hub.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Walk Route</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
