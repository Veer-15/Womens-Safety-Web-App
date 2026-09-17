import React from 'react';
import { motion } from 'motion/react';
import {
  Lock,
  ShieldCheck,
  Radio,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LedIndicator } from '../ui/LedIndicator.tsx';

export const SafeGridCards: React.FC = () => {
  return (
    <section className="py-20 bg-[#e0e5ec] text-[#2d3436] border-b border-[#babecc] relative overflow-hidden">
      {/* Blueprint grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 blueprint-grid" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* LEFT CARD: ENCRYPTED GUARDIANS NETWORK (Skeuomorphic Bolted Metal Chassis) */}
          <div className="relative rounded-[32px] bg-[#e0e5ec] p-8 sm:p-10 text-[#2d3436] flex flex-col justify-between shadow-[12px_12px_24px_#babecc,-12px_-12px_24px_#ffffff] border border-white/60">
            {/* Corner Screws */}
            <span className="absolute top-4 left-4 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
              <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-45" />
            </span>
            <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
              <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-45" />
            </span>

            {/* Recessed Pill Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="px-3 py-1.5 rounded-lg bg-[#e0e5ec] text-[#2d3436] text-[10px] font-mono font-bold shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#ff4757]" />
                  ZERO TELEMETRY RESALE
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[#e0e5ec] text-[#2d3436] text-[10px] font-mono font-bold shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  CLIENT-SIDE ENCRYPTION
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[#e0e5ec] text-[#2d3436] text-[10px] font-mono font-bold shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-blue-600" />
                  5-GUARDIAN RELAY
                </span>
              </div>

              <div className="space-y-3 my-2">
                <h3 className="text-3xl sm:text-4xl font-mono font-black uppercase tracking-tight text-[#2d3436] leading-tight drop-shadow-[0_1px_1px_#ffffff]">
                  ENCRYPTED GUARDIANS SHIELD
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5568] leading-relaxed max-w-lg">
                  Real-time GPS telemetry is retained purely client-side on your device. Spatial data is released only during active manual distance checks or upon emergency SOS execution.
                </p>
              </div>
            </div>

            {/* Bottom Hardware Status & Action */}
            <div className="pt-6 border-t border-[#babecc] flex flex-wrap items-center justify-between gap-4 mt-6">
              <div className="text-[11px] font-mono text-[#4a5568] flex items-center gap-2">
                <LedIndicator status="active" size="sm" />
                <span>HARDWARE-SANDBOXED PRIVACY</span>
              </div>
              <Link
                to="/contacts"
                className="px-5 py-2.5 rounded-xl bg-[#2d3436] hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[4px_4px_10px_#babecc,-2px_-2px_6px_#ffffff] active:translate-y-[1px] transition-all inline-flex items-center gap-1.5"
              >
                <span>CONFIG GUARDIANS</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#ff4757]" />
              </Link>
            </div>

            {/* Bottom Screws */}
            <span className="absolute bottom-4 left-4 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
              <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-12" />
            </span>
            <span className="absolute bottom-4 right-4 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
              <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-30" />
            </span>
          </div>

          {/* RIGHT CARD: DARK INDUSTRIAL HAZARD MESH TERMINAL */}
          <div className="relative rounded-[32px] bg-[#1a1e24] p-8 sm:p-10 text-white flex flex-col justify-between shadow-[12px_12px_24px_rgba(0,0,0,0.5),-6px_-6px_14px_rgba(255,255,255,0.05)] border-2 border-slate-700 crt-scanlines">
            {/* Top Action Row */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1.5 rounded-lg bg-[#242933] border border-amber-500/40 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-inner">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  CROWDSOURCED VIGILANCE
                </span>
                <Link
                  to="/incidents"
                  className="px-4 py-1.5 rounded-lg bg-[#ff4757] text-white hover:bg-[#d63031] text-[10px] font-mono font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(255,71,87,0.6)] active:translate-y-[1px] transition-all"
                >
                  LOG HAZARD +
                </Link>
              </div>

              <div className="space-y-3 my-2 font-mono">
                <h3 className="text-3xl sm:text-4xl font-mono font-black uppercase tracking-tight leading-tight text-slate-100">
                  HAZARD &amp; SAFETY MESH
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
                  Real-time crowdsourced telemetry where commuters flag dark underpasses, defunct lighting, and aggressive transit zones to alert women immediately.
                </p>
              </div>

              {/* Hardware Terminal Feed Log */}
              <div className="p-3.5 rounded-xl bg-[#242933] border border-slate-700 text-xs font-mono space-y-1.5 mt-4 shadow-inner">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    ALERT // LIGHTING OUT &bull; SECTOR 18
                  </span>
                  <span className="text-slate-500">12M AGO</span>
                </div>
                <p className="text-slate-300 text-[10px] leading-relaxed">
                  "Use illuminated commercial avenue near Gate 2 rather than darkened pedestrian subway past 21:00."
                </p>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 mt-6">
              <span>1,200+ VERIFIED HAZARDS INDEXED</span>
              <Link to="/incidents" className="text-white hover:text-[#ff4757] font-bold flex items-center gap-1 transition-colors">
                <span>VIEW TELEMETRY</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#ff4757]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
