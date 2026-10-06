import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, MessageSquareHeart, Users, ShieldAlert } from 'lucide-react';
import { triggerEmergencyDialPad } from '../utils/emergencyDialer.ts';

interface BottomNavProps {
  onOpenSosModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenSosModal }) => {
  const location = useLocation();

  const items = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Amenities', path: '/amenities', icon: MapPin },
    { name: 'SOS', isSos: true },
    { name: 'Companion', path: '/companion', icon: MessageSquareHeart },
    { name: 'Dashboard', path: '/dashboard', icon: ShieldAlert },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item, idx) => {
          if (item.isSos) {
            return (
              <button
                key="sos-button"
                id="bottom-nav-sos"
                onClick={() => {
                  triggerEmergencyDialPad('112');
                  onOpenSosModal();
                }}
                className="relative -top-5 flex flex-col items-center group"
                aria-label="Trigger Emergency SOS Alert"
              >
                <div className="w-14 h-14 rounded-full bg-linear-to-tr from-rose-700 via-rose-600 to-red-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 border-4 border-white transition-transform active:scale-95 animate-pulse">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold text-rose-700 -mt-0.5 tracking-tight uppercase">
                  SOS
                </span>
              </button>
            );
          }

          const Icon = item.icon!;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={idx}
              to={item.path!}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
                isActive ? 'text-rose-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
