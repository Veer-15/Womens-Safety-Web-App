import React from 'react';
import {
  Phone,
  Navigation,
  Star,
  CheckCircle2,
  Clock,
  Shield,
  Building2,
  Cross,
  Pill,
  Home,
  Bus,
} from 'lucide-react';
import { Amenity, AmenityType } from '../types.ts';

interface GroundedPlacesCardProps {
  amenity: Amenity;
  onSelect?: (amenity: Amenity) => void;
}

export const GroundedPlacesCard: React.FC<GroundedPlacesCardProps> = ({ amenity, onSelect }) => {
  const getCategoryIcon = (type: AmenityType) => {
    switch (type) {
      case 'police':
        return <Shield className="w-4 h-4 text-rose-600" />;
      case 'hospital':
        return <Cross className="w-4 h-4 text-red-600" />;
      case 'pharmacy':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'hostel':
        return <Home className="w-4 h-4 text-purple-600" />;
      case 'transport':
        return <Bus className="w-4 h-4 text-blue-600" />;
      default:
        return <Building2 className="w-4 h-4 text-slate-600" />;
    }
  };

  const getCategoryBadge = (type: AmenityType) => {
    switch (type) {
      case 'police':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'hospital':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pharmacy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'hostel':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'transport':
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${amenity.lat},${amenity.lng}`;

  return (
    <div
      id={`amenity-card-${amenity.id}`}
      onClick={() => onSelect && onSelect(amenity)}
      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all hover:border-rose-300 flex flex-col justify-between group"
    >
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryBadge(
                amenity.type
              )}`}
            >
              {getCategoryIcon(amenity.type)}
              {amenity.type}
            </span>

            {amenity.verified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified Safe
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
            {amenity.distanceKm} km away
          </span>
        </div>

        {/* Title & SubType */}
        <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-700 transition-colors">
          {amenity.name}
        </h3>
        {amenity.subType && (
          <p className="text-xs font-medium text-slate-500 mt-0.5">{amenity.subType}</p>
        )}

        {/* Address */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {amenity.address}
        </p>

        {/* Notes / Special Safety info */}
        {amenity.notes && (
          <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-start gap-1.5">
            <Shield className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <span className="leading-snug">{amenity.notes}</span>
          </div>
        )}

        {/* Metrics: Rating & Open Status */}
        <div className="flex items-center gap-3 mt-3 pt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {amenity.rating.toFixed(1)}
          </span>

          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span
              className={`font-semibold ${
                amenity.isOpen ? 'text-emerald-600' : 'text-slate-500'
              }`}
            >
              {amenity.isOpen ? 'Open Now (24/7)' : 'Closed'}
            </span>
          </span>

          {amenity.safetyScore && (
            <span className="text-[11px] font-bold text-slate-600 ml-auto bg-slate-100 px-2 py-0.5 rounded-md">
              Score: {amenity.safetyScore}/100
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: Direct Call & Google Maps Directions */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
        <a
          href={`tel:${amenity.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-700 text-xs font-bold transition-all min-h-[44px]"
        >
          <Phone className="w-3.5 h-3.5 text-rose-600" />
          <span>Call Desk</span>
        </a>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all min-h-[44px]"
        >
          <Navigation className="w-3.5 h-3.5 text-rose-300" />
          <span>Directions</span>
        </a>
      </div>
    </div>
  );
};
