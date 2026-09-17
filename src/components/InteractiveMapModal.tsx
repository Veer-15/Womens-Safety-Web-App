import React from 'react';
import { X, Navigation, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { Amenity } from '../types.ts';
import { GeolocationState } from '../hooks/useGeolocation.ts';

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  geoState: GeolocationState;
  amenities: Amenity[];
  selectedAmenity?: Amenity | null;
}

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  isOpen,
  onClose,
  geoState,
  amenities,
  selectedAmenity,
}) => {
  if (!isOpen) return null;

  const targetLat = selectedAmenity ? selectedAmenity.lat : geoState.latitude;
  const targetLng = selectedAmenity ? selectedAmenity.lng : geoState.longitude;

  // OpenStreetMap embed URL
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${targetLng - 0.02}%2C${targetLat - 0.015}%2C${targetLng + 0.02}%2C${targetLat + 0.015}&layer=mapnik&marker=${targetLat}%2C${targetLng}`;
  const gmapsDir = `https://www.google.com/maps?q=${targetLat},${targetLng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] max-h-[700px] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {selectedAmenity ? selectedAmenity.name : 'Surrounding Safe Zone Map'}
              </h3>
              <p className="text-xs text-slate-500">
                Live location: {geoState.latitude.toFixed(4)}, {geoState.longitude.toFixed(4)} (±{geoState.accuracy}m)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={gmapsDir}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Canvas Frame */}
        <div className="relative flex-1 bg-slate-100 w-full overflow-hidden">
          <iframe
            title="Safe Zones Map"
            src={osmUrl}
            className="w-full h-full border-0"
            loading="lazy"
          />

          {/* Quick HUD Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {amenities.length} Verified Facilities in Immediate Radius
                </p>
                <p className="text-[11px] text-slate-500">
                  Police desks, 24/7 chemists, emergency trauma care
                </p>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
