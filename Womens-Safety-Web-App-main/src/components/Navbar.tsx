import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  MessageSquareHeart,
  Users,
  AlertTriangle,
  Bus,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { SakhiLogo } from './SakhiLogo.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { GeolocationState } from '../hooks/useGeolocation.ts';

interface NavbarProps {
  geoState?: GeolocationState;
  geoStatus?: string;
  accuracy?: number | null;
  onOpenSosModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ geoState, accuracy, onOpenSosModal }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary streamlined navigation links
  const primaryNavLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: ShieldAlert },
    { name: 'Havens', path: '/amenities', icon: MapPin },
    { name: 'Companion', path: '/companion', icon: MessageSquareHeart },
    { name: 'Transit', path: '/transport', icon: Bus },
  ];

  // Secondary items tucked neatly inside "More"
  const secondaryNavLinks = [
    { name: 'Hazard Feed', path: '/incidents', icon: AlertTriangle },
    { name: 'Guardians', path: '/contacts', icon: Users },
  ];

  const allNavLinks = [
    ...primaryNavLinks,
    ...secondaryNavLinks,
  ];

  const getCompactGpsBadge = () => {
    const isGpsActive = geoState?.status === 'active' || (accuracy !== undefined && accuracy !== null);
    const accValue = geoState?.accuracy || accuracy;
    return (
      <div
        id="nav-gps-badge"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e0e5ec] shadow-[inset_1.5px_1.5px_3px_#babecc,inset_-1.5px_-1.5px_3px_#ffffff]"
        title={isGpsActive ? `GPS Active: ±${accValue ? Math.round(accValue) : 10}m` : 'GPS Standby'}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isGpsActive ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-amber-400'
          }`}
        />
        <span className="text-[10px] font-mono font-bold text-[#4a5568]">GPS</span>
      </div>
    );
  };

  const isSecondaryActive = secondaryNavLinks.some((l) => location.pathname === l.path);

  return (
    <header className="sticky top-0 z-40 bg-[#e0e5ec] border-b border-[#babecc] shadow-[0_2px_8px_rgba(186,190,204,0.5)]">
      {/* Top subtle highlight seam */}
      <div className="h-[1px] w-full bg-white/80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Increased Icon Size & Reduced Brand Name Size */}
          <Link
            to="/"
            className="flex items-center group cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="p-1.5 sm:p-2 rounded-2xl bg-[#e0e5ec] shadow-[3px_3px_7px_#babecc,-3px_-3px_7px_#ffffff] group-hover:brightness-105 transition-all flex items-center justify-center">
              <SakhiLogo
                size="md"
                iconSize="w-11 h-11"
                titleSize="text-base sm:text-lg font-bold"
                showTagline={false}
              />
            </div>
          </Link>

          {/* Minimized Desktop Navigation (Reduced Number of Components) */}
          <nav className="hidden md:flex items-center gap-1.5">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all select-none ${
                    isActive
                      ? 'bg-[#e0e5ec] text-[#ff4757] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] translate-y-[0.5px]'
                      : 'bg-[#e0e5ec] text-[#4a5568] hover:text-[#ff4757] shadow-[2px_2px_5px_#babecc,-2px_-2px_5px_#ffffff] active:translate-y-[1px]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ff4757]' : 'text-[#4a5568]'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Compact "More" Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all select-none cursor-pointer ${
                  isSecondaryActive || moreDropdownOpen
                    ? 'bg-[#e0e5ec] text-[#ff4757] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]'
                    : 'bg-[#e0e5ec] text-[#4a5568] hover:text-[#ff4757] shadow-[2px_2px_5px_#babecc,-2px_-2px_5px_#ffffff]'
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${moreDropdownOpen ? 'rotate-180 text-[#ff4757]' : ''}`}
                />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#e0e5ec] p-2 shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] border border-white/60 z-50 space-y-1">
                  {secondaryNavLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                          isActive
                            ? 'bg-[#e0e5ec] text-[#ff4757] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]'
                            : 'text-[#4a5568] hover:text-[#ff4757] hover:bg-[#d6dee8]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-[#ff4757]" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Compact Telemetry & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {getCompactGpsBadge()}

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#babecc]">
                <span className="text-xs font-mono font-bold text-[#2d3436] uppercase leading-tight">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  id="btn-logout"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-1.5 rounded-xl bg-[#e0e5ec] text-[#4a5568] hover:text-[#ff4757] shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] active:translate-y-[0.5px] cursor-pointer transition-all"
                  title="Disconnect session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider uppercase bg-[#ff4757] hover:bg-[#d63031] text-white rounded-xl shadow-[3px_3px_6px_rgba(180,30,45,0.35)] active:translate-y-[0.5px] transition-all cursor-pointer"
              >
                Auth
              </Link>
            )}

            {/* Compact SOS trigger button — desktop */}
            {onOpenSosModal && (
              <button
                id="btn-nav-sos"
                onClick={onOpenSosModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase bg-[#ff4757] hover:bg-[#d63031] text-white shadow-[3px_3px_6px_rgba(180,30,45,0.4)] active:translate-y-[0.5px] transition-all cursor-pointer"
                aria-label="Open Emergency SOS"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>SOS</span>
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {getCompactGpsBadge()}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#e0e5ec] text-[#2d3436] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-[#ff4757]" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu - Machined Tray */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#babecc] bg-[#e0e5ec] px-4 pt-3 pb-5 space-y-1.5 shadow-[inset_0_3px_6px_#babecc]">
          {allNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                  isActive
                    ? 'bg-[#e0e5ec] text-[#ff4757] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]'
                    : 'bg-[#e0e5ec] text-[#2d3436] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff4757]' : 'text-[#4a5568]'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-[#babecc] flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-bold tracking-wider text-[#ff4757] bg-[#e0e5ec] shadow-[3px_3px_6px_#babecc,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#babecc] rounded-xl uppercase"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect ({user?.name})</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs font-mono font-bold tracking-wider uppercase bg-[#ff4757] text-white rounded-xl shadow-[3px_3px_6px_rgba(180,30,45,0.4)]"
              >
                Sign In / Register
              </Link>
            )}

            {/* SOS button — mobile menu */}
            {onOpenSosModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSosModal();
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-bold tracking-wider text-white bg-[#ff4757] shadow-[3px_3px_6px_rgba(180,30,45,0.4)] rounded-xl uppercase"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Emergency SOS</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

