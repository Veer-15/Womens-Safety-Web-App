import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  PhoneCall,
  Moon,
  Lock,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LedIndicator } from '../ui/LedIndicator.tsx';

export const NightTransitStage: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#242933] text-white relative overflow-hidden border-b border-slate-700">
      {/* Carbon fiber / blueprint overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 blueprint-grid" />

      {/* Top subtle lighting rim */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-[#1a1e24] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.8)] border border-slate-700 text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase mb-4">
            <LedIndicator status="active" size="sm" />
            <span>NIGHT PROTOCOL // 20:00 - 06:00 HRS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            NIGHT TRANSIT &amp; SHIELD
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Engineered telemetry and physical protocols ensuring peace of mind across night shifts, late-night transit corridors, and unfamiliar streets.
          </p>
        </div>

        {/* Central 3D Night Architecture & Bolted Hardware Modules */}
        <div className="relative max-w-5xl mx-auto min-h-[460px] sm:min-h-[520px] flex items-center justify-center">
          {/* STYLIZED 3D ISOMETRIC NIGHT BUILDING */}
          <div className="relative w-64 sm:w-80 h-80 sm:h-96 flex items-end justify-center">
            {/* Main Central High-Rise Tower */}
            <div className="relative w-48 sm:w-56 h-72 sm:h-84 bg-gradient-to-b from-[#1a1e24] to-[#12141a] rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col justify-between p-4">
              {/* Glowing Warm Amber Windows */}
              <div className="grid grid-cols-4 gap-2.5 pt-2">
                <div className="h-5 rounded-xs bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <div className="h-5 rounded-xs bg-slate-800" />
                <div className="h-5 rounded-xs bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <div className="h-5 rounded-xs bg-slate-800" />

                <div className="h-5 rounded-xs bg-slate-800" />
                <div className="h-5 rounded-xs bg-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <div className="h-5 rounded-xs bg-slate-800" />
                <div className="h-5 rounded-xs bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />

                <div className="h-5 rounded-xs bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <div className="h-5 rounded-xs bg-slate-800" />
                <div className="h-5 rounded-xs bg-slate-800" />
                <div className="h-5 rounded-xs bg-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />

                <div className="h-5 rounded-xs bg-slate-800" />
                <div className="h-5 rounded-xs bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <div className="h-5 rounded-xs bg-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <div className="h-5 rounded-xs bg-slate-800" />
              </div>

              {/* Building Ground Entrance */}
              <div className="w-14 h-8 bg-amber-400 rounded-t-lg mx-auto shadow-[0_0_15px_rgba(245,158,11,0.8)] border-t border-amber-200" />
            </div>

            {/* Left Lower Wing */}
            <div className="absolute -left-12 sm:-left-16 bottom-0 w-24 sm:w-32 h-44 sm:h-52 bg-gradient-to-b from-[#181b24] to-[#0e1015] rounded-l-2xl border-l-2 border-b-2 border-t-2 border-slate-700 p-3 flex flex-col justify-end">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-4 rounded-xs bg-slate-800" />
                <div className="h-4 rounded-xs bg-amber-400 shadow-xs" />
                <div className="h-4 rounded-xs bg-amber-400 shadow-xs" />
                <div className="h-4 rounded-xs bg-slate-800" />
              </div>
            </div>

            {/* Right Lower Wing */}
            <div className="absolute -right-12 sm:-right-16 bottom-0 w-24 sm:w-32 h-48 sm:h-56 bg-gradient-to-b from-[#181b24] to-[#0e1015] rounded-r-2xl border-r-2 border-b-2 border-t-2 border-slate-700 p-3 flex flex-col justify-end">
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="h-4 rounded-xs bg-amber-400 shadow-xs" />
                <div className="h-4 rounded-xs bg-slate-800" />
                <div className="h-4 rounded-xs bg-slate-800" />
                <div className="h-4 rounded-xs bg-amber-300 shadow-xs" />
              </div>
            </div>
          </div>

          {/* HARDWARE MODULE 1: VERIFIED HAVENS (Industrial Lime Stamped Tag) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute left-2 sm:left-10 top-6 sm:top-10 z-20 w-52 sm:w-60 p-4 rounded-2xl bg-[#e0e5ec] text-[#2d3436] shadow-[10px_10px_20px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.1)] border border-white/60"
          >
            {/* Top screws */}
            <div className="flex items-center justify-between mb-2">
              <span className="w-2 h-2 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1px_#a3b1c6]" />
              <span className="text-[9px] font-mono font-bold text-[#ff4757] uppercase tracking-wider">
                NODE // AUDITED
              </span>
              <span className="w-2 h-2 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1px_#a3b1c6]" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% VERIFIED
            </div>
            <h4 className="font-mono font-bold text-sm uppercase leading-tight text-[#2d3436]">
              ZERO FAKE HAVENS
            </h4>
            <p className="text-[11px] text-[#4a5568] mt-1 leading-relaxed">
              Every Pink Police Kiosk and 24/7 chemist is physically audited with active wardens.
            </p>
          </motion.div>

          {/* HARDWARE MODULE 2: COMMUTE CHECKLIST */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute right-2 sm:right-8 top-12 sm:top-16 z-20 w-52 sm:w-60 p-4 rounded-2xl bg-[#e0e5ec] text-[#2d3436] shadow-[10px_10px_20px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.1)] border border-white/60"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-2 h-2 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1px_#a3b1c6]" />
              <span className="text-[9px] font-mono font-bold text-[#4a5568] uppercase tracking-wider">
                CAB SAFETY
              </span>
              <span className="w-2 h-2 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6]" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#2d3436] mb-1">
              <Compass className="w-4 h-4 text-[#ff4757]" />
              ACTIVE CHECKLIST
            </div>
            <h4 className="font-mono font-bold text-sm uppercase leading-tight text-[#2d3436]">
              TRANSIT VERIFICATION
            </h4>
            <p className="text-[11px] text-[#4a5568] mt-1 leading-relaxed">
              5-point cab safety checklist, child-lock checks, and first coach metro guide.
            </p>
          </motion.div>

          {/* HARDWARE MODULE 3: ON DEMAND HELPLINE KEY */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute right-4 sm:right-12 bottom-4 sm:bottom-8 z-20 w-52 sm:w-60 p-4 rounded-2xl bg-[#e0e5ec] text-[#2d3436] shadow-[10px_10px_20px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.1)] border border-white/60"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-2 h-2 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1px_#a3b1c6]" />
              <span className="text-[9px] font-mono font-bold text-[#ff4757] uppercase tracking-wider">
                DIAL PAD
              </span>
              <span className="w-2 h-2 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1px_#a3b1c6]" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#ff4757] mb-1">
              <PhoneCall className="w-4 h-4 text-[#ff4757]" />
              SPEED SWITCH
            </div>
            <h4 className="font-mono font-bold text-sm uppercase leading-tight text-[#2d3436]">
              24/7 HELPLINE
            </h4>
            <p className="text-[11px] text-[#4a5568] mt-1 leading-relaxed">
              Instant speed-dial directly to Women Power Line (1090) and National ERSS (112).
            </p>
          </motion.div>

          {/* HARDWARE MODULE 4: ENCRYPTED GPS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute left-4 sm:left-12 bottom-4 sm:bottom-8 z-20 w-52 sm:w-60 p-4 rounded-2xl bg-[#e0e5ec] text-[#2d3436] shadow-[10px_10px_20px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.1)] border border-white/60"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-2 h-2 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1px_#a3b1c6]" />
              <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                PRIVACY
              </span>
              <span className="w-2 h-2 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1px_#a3b1c6]" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#2d3436] mb-1">
              <Lock className="w-4 h-4 text-emerald-600" />
              CLIENT ENCRYPTION
            </div>
            <h4 className="font-mono font-bold text-sm uppercase leading-tight text-[#2d3436]">
              PROTECTED GPS
            </h4>
            <p className="text-[11px] text-[#4a5568] mt-1 leading-relaxed">
              Coordinates remain sandboxed client-side and are transmitted solely upon SOS execution.
            </p>
          </motion.div>
        </div>

        {/* Bottom Hardware Button for Night Transit */}
        <div className="mt-14 text-center">
          <Link
            to="/transport"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#e0e5ec] text-[#2d3436] font-mono font-bold text-xs uppercase tracking-wider shadow-[6px_6px_14px_rgba(0,0,0,0.5),-4px_-4px_10px_rgba(255,255,255,0.1)] hover:text-[#ff4757] active:translate-y-[2px] transition-all cursor-pointer"
          >
            <span>COMMENCE TRANSIT PROTOCOL</span>
            <ArrowRight className="w-4 h-4 text-[#ff4757]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
