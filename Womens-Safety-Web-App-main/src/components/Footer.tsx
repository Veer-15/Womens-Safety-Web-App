import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  MessageSquareHeart,
  Bus,
  AlertTriangle,
  Users,
  ShieldCheck,
  ArrowUp,
} from 'lucide-react';
import { SakhiLogo } from './SakhiLogo.tsx';
import { LedIndicator } from './ui/LedIndicator.tsx';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#242933] text-slate-300 pt-16 pb-24 sm:pb-16 border-t-4 border-slate-700 relative z-20 font-mono">
      {/* Blueprint grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 blueprint-grid" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Emergency Hotlines Console Strip */}
        <div className="bg-[#1a1e24] border-2 border-slate-700 rounded-3xl p-6 mb-12 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-center lg:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#ff4757] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,71,87,0.6)]">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <LedIndicator status="alert" size="sm" />
                  <h3 className="font-mono font-black text-sm sm:text-base text-white uppercase tracking-wider">
                    DIRECT HARDWARE-LINKED HOTLINES (24/7 ACTIVE)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official Indian Government Emergency Response Lines. Direct carrier audio dial.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { number: '112', label: 'ERSS PAN-INDIA' },
                { number: '1090', label: 'WOMEN LINE' },
                { number: '181', label: 'DCW RESCUE' },
                { number: '100', label: 'POLICE PCR' },
                { number: '108', label: 'TRAUMA ER' },
                { number: '1930', label: 'CYBER CELL' },
              ].map((h) => (
                <a
                  key={h.number}
                  href={`tel:${h.number}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#242933] hover:bg-[#ff4757] hover:text-white text-slate-200 border border-slate-700 text-xs font-mono font-bold shadow-sm active:translate-y-[1px] transition-all cursor-pointer"
                >
                  <span className="text-[#ff6b81] group-hover:text-white font-black">{h.number}</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">({h.label})</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Multi-Column Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-700">
          {/* Col 1: Brand & Purpose (2 cols wide) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <SakhiLogo size="md" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Sakhi is India’s physical-grade smart safety platform. Engineered with zero-latency emergency SOS auto-dial, physically audited sanctuary havens, and grounded AI assistance.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#ff6b81] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>TERMINAL SPECS: ZERO TELEMETRY MONETIZATION</span>
            </div>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ff4757] hover:bg-[#d63031] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(255,71,87,0.5)] active:translate-y-[1px] transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>TERMINAL ACCESS</span>
              </Link>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 border-b border-slate-700 pb-1">
              CORE HARDWARE
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/#service-sos" className="hover:text-[#ff6b81] transition-colors flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>ONE-TAP SOS BEACON</span>
                </Link>
              </li>
              <li>
                <Link to="/amenities" className="hover:text-[#ff6b81] transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>AUDITED HAVENS</span>
                </Link>
              </li>
              <li>
                <Link to="/companion" className="hover:text-[#ff6b81] transition-colors flex items-center gap-1.5">
                  <MessageSquareHeart className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>GROUNDED SAKHI AI</span>
                </Link>
              </li>
              <li>
                <Link to="/transport" className="hover:text-[#ff6b81] transition-colors flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>TRANSIT PROTOCOLS</span>
                </Link>
              </li>
              <li>
                <Link to="/incidents" className="hover:text-[#ff6b81] transition-colors flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>HAZARD FEED</span>
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-[#ff6b81] transition-colors flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#ff4757]" />
                  <span>GUARDIAN RELAYS</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture Protocols */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 border-b border-slate-700 pb-1">
              PROTOCOLS
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#why-amenities" className="hover:text-[#ff6b81] transition-colors">
                  GROUND AUDIT METHOD
                </a>
              </li>
              <li>
                <a href="#goals" className="hover:text-[#ff6b81] transition-colors">
                  FAIL-SAFE RELIABILITY
                </a>
              </li>
              <li>
                <a href="#difference" className="hover:text-[#ff6b81] transition-colors">
                  ABORT GUARD SPEC
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#ff6b81] transition-colors">
                  4-STAGE DISPATCH
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-[#ff6b81] transition-colors">
                  OPERATOR DEBRIEFS
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Directory */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 border-b border-slate-700 pb-1">
              HAVEN NETWORK
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/amenities?type=police" className="hover:text-[#ff6b81] transition-colors">
                  PINK POLICE KIOSKS
                </Link>
              </li>
              <li>
                <Link to="/amenities?type=pharmacy" className="hover:text-[#ff6b81] transition-colors">
                  24/7 APPOINTED CHEMISTS
                </Link>
              </li>
              <li>
                <Link to="/amenities?type=hospital" className="hover:text-[#ff6b81] transition-colors">
                  TRAUMA RECEPTION HUBS
                </Link>
              </li>
              <li>
                <Link to="/amenities?type=hostel" className="hover:text-[#ff6b81] transition-colors">
                  VERIFIED HOSTELS &amp; PGS
                </Link>
              </li>
              <li>
                <Link to="/transport" className="hover:text-[#ff6b81] transition-colors">
                  CCTV METRO TRANSIT BAYS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Hardware Status Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              SYSTEM ENCRYPTION: CLIENT SANDBOX &bull; STRICT RECONNAISSANCE GROUNDING
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} SAKHI SAFETY MATRIX. ALL PROTOCOLS VERIFIED.</span>
            <button
              onClick={scrollToTop}
              className="p-2 bg-[#1a1e24] hover:bg-[#ff4757] hover:text-white text-slate-400 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Return to top of console"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
