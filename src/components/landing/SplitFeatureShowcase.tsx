import React from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Pill,
  Building2,
  ArrowRight,
  Star,
  Radio,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LedIndicator } from '../ui/LedIndicator.tsx';

export const SplitFeatureShowcase: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#e0e5ec] text-[#2d3436] border-b border-[#babecc] relative overflow-hidden">
      {/* Background blueprint grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 blueprint-grid" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] text-[10px] font-mono font-bold tracking-widest text-[#4a5568] uppercase mb-3">
            <LedIndicator status="active" size="sm" />
            <span>SECTOR GROUND RECON // SAFE HAVENS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#2d3436] tracking-tight uppercase drop-shadow-[0_1px_1px_#ffffff]">
            GROUND-VERIFIED HAVENS
          </h2>
          <p className="text-[#4a5568] text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Physical safety nodes validated with on-duty wardens, emergency telephone landlines, and active illuminated perimeters.
          </p>
        </div>

        {/* Split Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Overlaid Industrial Monitor */}
          <div className="lg:col-span-6 flex justify-center items-center py-4">
            {/* Machined Console Housing */}
            <div className="w-[320px] sm:w-[360px] bg-[#e0e5ec] p-4 sm:p-5 rounded-[38px] shadow-[12px_12px_24px_#babecc,-12px_-12px_24px_#ffffff] border-4 border-[#d1d9e6]">
              {/* Bezel Screws & Status Diode */}
              <div className="flex items-center justify-between px-1 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center">
                  <div className="w-1.5 h-[1px] bg-[#8a99ad] rotate-45" />
                </div>
                <span className="text-[9px] font-mono text-[#4a5568] font-bold tracking-wider uppercase">
                  MONITOR // REFUGE_04
                </span>
                <div className="w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center">
                  <div className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-45" />
                </div>
              </div>

              {/* Internal Screen */}
              <div className="bg-[#1a1e24] rounded-[26px] p-4 space-y-3 text-left border border-slate-700 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8)] crt-scanlines text-slate-100 font-mono">
                {/* Visual Header Inside Screen */}
                <div className="rounded-xl bg-[#242933] border border-slate-700 overflow-hidden p-3.5 flex flex-col justify-between text-white relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#ff4757] text-white px-2 py-0.5 rounded shadow-sm">
                      VERIFIED REFUGE
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE
                    </span>
                  </div>
                  <div>
                    <p className="font-mono font-bold text-sm text-slate-100">PINK POLICE KIOSK // POST 04</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-[#ff4757] text-[#ff4757]" />
                      5.0 RATING &bull; FEMALE GUARDS PRESENT
                    </p>
                  </div>
                </div>

                {/* Telemetry Matrix */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[10px] p-1.5 bg-[#242933] rounded border border-slate-800">
                    <span className="text-slate-400">DISTANCE</span>
                    <span className="font-bold text-slate-200">0.35 KM // ~4 MIN WALK</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] p-1.5 bg-[#242933] rounded border border-slate-800">
                    <span className="text-slate-400">SECURITY RATING</span>
                    <span className="font-bold text-emerald-400">24/7 CCTV &bull; ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] p-1.5 bg-[#242933] rounded border border-slate-800">
                    <span className="text-slate-400">DIRECT LINE</span>
                    <span className="font-bold text-[#ff6b81]">DIAL 1090 ARMED</span>
                  </div>
                </div>

                {/* Screen Bottom Action Key */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 block leading-tight">SANCTUARY PROTOCOL</span>
                    <span className="text-xs font-bold text-slate-200">OPEN ACCESS</span>
                  </div>
                  <Link
                    to="/amenities"
                    className="px-3.5 py-1.5 bg-[#ff4757] hover:bg-[#d63031] text-white rounded-lg text-xs font-mono font-bold tracking-wider shadow-[0_0_10px_rgba(255,71,87,0.5)] active:translate-y-[1px] transition-all"
                  >
                    DEPLOY RADAR &rarr;
                  </Link>
                </div>
              </div>

              {/* Bottom Bezel screws */}
              <div className="flex items-center justify-between px-1 mt-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center">
                  <div className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-12" />
                </div>
                <span className="text-[9px] font-mono text-[#4a5568]">STATION ID: ND-330</span>
                <div className="w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center">
                  <div className="w-1.5 h-[1px] bg-[#8a99ad] rotate-30" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Industrial Card List */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ff4757] bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] px-3 py-1 rounded-md inline-block">
                SECTOR GROUND NETWORK
              </span>

              <h3 className="text-3xl sm:text-4xl font-mono font-black text-[#2d3436] leading-tight uppercase mt-3">
                VETTED SANCTUARIES IN EVERY ZONE
              </h3>

              <p className="text-sm sm:text-base text-[#4a5568] leading-relaxed mt-2">
                No probabilistic estimation or untested storefronts. Every location in our hardware-synchronized directory has undergone physical verification.
              </p>
            </div>

            {/* Industrial Bolted Modules */}
            <div className="space-y-3 pt-1">
              <div className="relative flex items-start gap-3.5 p-4 rounded-2xl bg-[#e0e5ec] shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] border border-white/60">
                <div className="w-9 h-9 rounded-xl bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center shrink-0 font-mono font-black text-xs text-[#ff4757]">
                  01
                </div>
                <div>
                  <h5 className="font-mono font-bold text-sm uppercase text-[#2d3436]">
                    PINK POLICE BOOTHS
                  </h5>
                  <p className="text-xs text-[#4a5568] mt-0.5 leading-relaxed">
                    Dedicated women safety kiosks equipped with direct landline dispatch, CCTV monitoring, and stationed female officers.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3.5 p-4 rounded-2xl bg-[#e0e5ec] shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] border border-white/60">
                <div className="w-9 h-9 rounded-xl bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center shrink-0 font-mono font-black text-xs text-emerald-700">
                  02
                </div>
                <div>
                  <h5 className="font-mono font-bold text-sm uppercase text-[#2d3436]">
                    24/7 ACCREDITED PHARMACIES
                  </h5>
                  <p className="text-xs text-[#4a5568] mt-0.5 leading-relaxed">
                    Well-lit commercial havens providing basic first-aid, safe waiting areas, and immediate public visibility.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-3.5 p-4 rounded-2xl bg-[#e0e5ec] shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] border border-white/60">
                <div className="w-9 h-9 rounded-xl bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center shrink-0 font-mono font-black text-xs text-blue-700">
                  03
                </div>
                <div>
                  <h5 className="font-mono font-bold text-sm uppercase text-[#2d3436]">
                    EMERGENCY CARE &amp; TRAUMA ER
                  </h5>
                  <p className="text-xs text-[#4a5568] mt-0.5 leading-relaxed">
                    Continuous guarded hospital reception desks with licensed security personnel and instant shelter.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/amenities"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2d3436] hover:bg-black text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-[4px_4px_10px_#babecc,-2px_-2px_6px_#ffffff] active:translate-y-[1px] transition-all"
              >
                <span>OPEN HAVEN DIRECTORY</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#ff4757]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
