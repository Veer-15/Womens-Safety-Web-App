import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Search,
  SlidersHorizontal,
  Map,
  Shield,
  Pill,
  Building2,
  Home,
  Bus,
  RefreshCw,
} from 'lucide-react';
import { GeolocationState } from '../hooks/useGeolocation.ts';
import { amenityService } from '../services/api.ts';
import { Amenity, AmenityType } from '../types.ts';
import { GroundedPlacesCard } from '../components/GroundedPlacesCard.tsx';
import { InteractiveMapModal } from '../components/InteractiveMapModal.tsx';
import { Footer } from '../components/Footer.tsx';

interface AmenitiesPageProps {
  geoState: GeolocationState;
}

export const AmenitiesPage: React.FC<AmenitiesPageProps> = ({ geoState }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('type') || 'all';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapModalOpen, setMapModalOpen] = useState<boolean>(false);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const data = await amenityService.getNearby(
        geoState.latitude,
        geoState.longitude,
        activeCategory
      );
      setAmenities(data);
    } catch (err) {
      console.error('Failed to fetch amenities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, [activeCategory, geoState.latitude, geoState.longitude]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearchParams(cat === 'all' ? {} : { type: cat });
  };

  const filteredAmenities = amenities.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      (item.subType && item.subType.toLowerCase().includes(q))
    );
  });

  const categoryTabs = [
    { id: 'all', label: 'All Amenities', icon: MapPin },
    { id: 'police', label: 'Police Stations & Booths', icon: Shield },
    { id: 'hospital', label: 'Hospitals & ER', icon: Building2 },
    { id: 'pharmacy', label: '24/7 Pharmacies', icon: Pill },
    { id: 'hostel', label: "Women's Hostels & PGs", icon: Home },
    { id: 'transport', label: 'Safe Transport Hubs', icon: Bus },
  ];

  return (
    <>
      <div className="min-h-screen pb-20 sm:pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-slate-900">
              Verified Safe Amenities & Safe Havens
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {filteredAmenities.length} Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Grounded places calculated relative to your coordinates ({geoState.latitude.toFixed(4)},{' '}
            {geoState.longitude.toFixed(4)})
          </p>
        </div>

        {/* Map View Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedAmenity(null);
              setMapModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Map className="w-4 h-4 text-rose-300" />
            <span>Interactive Map View</span>
          </button>
          <button
            onClick={fetchAmenities}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh nearby places"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleCategoryChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs shadow-rose-600/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by facility name, landmark, or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-rose-500 focus:ring-1 focus:ring-rose-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Amenities Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5 h-56 animate-pulse"
            >
              <div className="h-4 bg-slate-200 rounded-md w-1/3 mb-3"></div>
              <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-100 rounded-md w-full mb-1"></div>
              <div className="h-3 bg-slate-100 rounded-md w-2/3 mb-4"></div>
              <div className="h-10 bg-slate-100 rounded-xl mt-8"></div>
            </div>
          ))}
        </div>
      ) : filteredAmenities.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-slate-800">No Places Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or switching to another category.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAmenities.map((amenity) => (
            <GroundedPlacesCard
              key={amenity.id}
              amenity={amenity}
              onSelect={(place) => {
                setSelectedAmenity(place);
                setMapModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

        {/* Interactive Map Modal */}
        <InteractiveMapModal
          isOpen={mapModalOpen}
          onClose={() => setMapModalOpen(false)}
          geoState={geoState}
          amenities={amenities}
          selectedAmenity={selectedAmenity}
        />
      </div>
      <Footer />
    </>
  );
};
