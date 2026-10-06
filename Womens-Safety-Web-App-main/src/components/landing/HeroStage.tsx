import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Pill,
  Radio,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { LedIndicator } from '../ui/LedIndicator.tsx';

interface HeroStageProps {
  onTriggerSos: (phoneNumber?: string) => void;
  gpsActive?: boolean;
}

export const HeroStage: React.FC<HeroStageProps> = ({
  onTriggerSos,
  gpsActive = true,
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-[#e0e5ec] text-[#2d3436]">
      {/* Background Micro-Noise & Blueprint Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 blueprint-grid" />

      {/* Top-left lighting hotspot */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Hardware Stamped Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] border border-[#babecc]/50 text-xs font-mono font-bold tracking-widest text-[#4a5568] uppercase">
            <LedIndicator status={gpsActive ? 'active' : 'standby'} size="sm" />
            <span>TERMINAL MODULE // RAPID DISPATCH READY</span>
          </div>
        </div>

        {/* Industrial Display Headline with Embossed Highlight */}
        <div className="text-center max-w-5xl mx-auto mb-12">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-[#2d3436] tracking-tight uppercase leading-[0.95] drop-shadow-[0_1px_1px_#ffffff]">
            FEARLESS <span className="text-[#ff4757]">STEPS</span>
          </h1>
          <p className="text-[#4a5568] text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Physical-grade defense architecture. Combining zero-latency <strong className="text-[#2d3436] font-semibold">One-Tap SOS Hardware Triggers</strong>, physically verified safe havens, and grounded telemetry for absolute urban peace of mind.
          </p>
        </div>

        {/* PRIMARY INDUSTRIAL EMERGENCY SPEED SWITCHBOARD */}
        <div
          id="hero-emergency-console"
          className="max-w-4xl mx-auto p-6 sm:p-7 rounded-3xl bg-[#e0e5ec] shadow-[10px_10px_22px_#babecc,-10px_-10px_22px_#ffffff] border border-white/60 space-y-4 my-8"
        >
          {/* Header Strip with LED */}
          <div className="flex items-center justify-between border-b border-[#babecc] pb-3">
            <div className="flex items-center gap-2">
              <LedIndicator status="alert" label="CRITICAL EMERGENCY SWITCHBOARD" size="md" />
            </div>
            <span className="text-[11px] font-mono text-[#4a5568] font-bold tracking-wider hidden sm:inline uppercase">
              ZERO-LATENCY DIAL PROTOCOL
            </span>
          </div>

          {/* Primary High-Visibility Safety Keys */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3.5">
            {/* Primary Safety Orange SOS Trigger */}
            <button
              id="hero-primary-sos-button"
              type="button"
              onClick={() => onTriggerSos('112')}
              className="flex-1 group relative px-6 py-4 rounded-2xl bg-[#ff4757] text-white shadow-[6px_6px_16px_rgba(166,50,60,0.5),-4px_-4px_12px_rgba(255,120,130,0.4),inset_1px_1px_0_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_10px_rgba(120,15,25,0.8),inset_-4px_-4px_8px_rgba(255,120,130,0.3)] active:translate-y-[2px] transition-all flex items-center justify-between gap-4 cursor-pointer select-none"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-base sm:text-lg tracking-wider uppercase">
                      TRIGGER SOS // DIAL 112
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-rose-100 flex items-center gap-2 mt-0.5">
                    <span>ERSS DISPATCH</span>
                    <span>&bull;</span>
                    <span>GPS TELEMETRY BROADCAST</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 text-white text-xs font-mono font-bold tracking-wider uppercase">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>EXECUTE</span>
              </div>
            </button>

            {/* Dedicated 1090 Women Helpline Switch */}
            <button
              id="hero-women-helpline-button"
              type="button"
              onClick={() => onTriggerSos('1090')}
              className="px-6 py-4 rounded-2xl bg-[#2d3436] text-white shadow-[6px_6px_14px_#babecc,-4px_-4px_10px_#ffffff,inset_1px_1px_0_rgba(255,255,255,0.2)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.8)] active:translate-y-[2px] transition-all flex items-center justify-center gap-3 cursor-pointer select-none"
              title="Direct call to Women Power Line (1090)"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ff4757] flex items-center justify-center shadow-[0_0_10px_rgba(255,71,87,0.6)]">
                <PhoneCall className="w-4 h-4 text-white animate-bounce" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-mono uppercase text-[#ff6b81] tracking-wider font-bold">
                  WOMEN POWER LINE
                </div>
                <div className="text-sm font-mono font-black tracking-wider leading-none mt-0.5">
                  CALL 1090
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Central Stage: Precision 3D Physical Device Terminal */}
        <div className="relative max-w-4xl mx-auto my-12 flex items-center justify-center">
          {/* Floating Mechanical Module 1: Top Left */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden lg:flex absolute -left-6 top-10 z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] border border-white/60"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-[#ff4757]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#2d3436] block tracking-wider uppercase">
                &lt; 3s ABORT GUARD
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">
                0 FALSE DISPATCHES
              </span>
            </div>
          </motion.div>

          {/* Floating Mechanical Module 2: Top Right */}
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="hidden lg:flex absolute -right-6 top-12 z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] border border-white/60"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-blue-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#2d3436] block tracking-wider uppercase">
                PINK POLICE KIOSK
              </span>
              <span className="text-[10px] font-mono text-[#4a5568]">
                350M // 24/7 ESCORT
              </span>
            </div>
          </motion.div>

          {/* Floating Mechanical Module 3: Bottom Left */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="hidden lg:flex absolute -left-10 bottom-12 z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] border border-white/60"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-emerald-600">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#2d3436] block tracking-wider uppercase">
                APOLLO 24/7 PHARMACY
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">
                120M // CCTV SHELTER
              </span>
            </div>
          </motion.div>

          {/* Floating Mechanical Module 4: Bottom Right */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="hidden lg:flex absolute -right-10 bottom-10 z-20 items-center gap-3 px-4 py-3 rounded-2xl bg-[#e0e5ec] shadow-[8px_8px_16px_#babecc,-8px_-8px_16px_#ffffff] border border-white/60"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e0e5ec] shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center text-[#ff4757]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-[#2d3436] block tracking-wider uppercase">
                HELPLINE 1090
              </span>
              <span className="text-[10px] font-mono text-[#ff4757] font-bold">
                INSTANT DIAL PAD
              </span>
            </div>
          </motion.div>

          {/* HARDWARE DEVICE BEZEL (Braun / Teenage Engineering Style Console) */}
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] bg-[#e0e5ec] p-4 sm:p-5 rounded-[44px] shadow-[16px_16px_32px_#babecc,-16px_-16px_32px_#ffffff] border-4 border-[#d1d9e6]">
            {/* Top Screws & Air Vent Slots */}
            <div className="flex items-center justify-between px-2 mb-3">
              {/* Corner Screw */}
              <div className="w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#a3b1c6,inset_-1px_-1px_2px_#ffffff] flex items-center justify-center">
                <div className="w-1.5 h-[1px] bg-[#8a99ad] rotate-45" />
              </div>

              {/* Recessed Pill Vent Slots */}
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#a3b1c6,inset_-1px_-1px_2px_#ffffff]" />
                <div className="h-4 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#a3b1c6,inset_-1px_-1px_2px_#ffffff]" />
                <div className="h-4 w-1 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#a3b1c6,inset_-1px_-1px_2px_#ffffff]" />
              </div>

              {/* Power LED */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold text-[#4a5568]">PWR</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.9)] animate-pulse" />
              </div>
            </div>

            {/* Recessed CRT Screen Display */}
            <div className="relative bg-[#1a1e24] rounded-[32px] overflow-hidden p-4 sm:p-5 space-y-4 shadow-[inset_6px_6px_14px_rgba(0,0,0,0.8),inset_-3px_-3px_8px_rgba(255,255,255,0.1)] border-2 border-[#2d3436] text-left crt-scanlines text-slate-100">
              {/* Screen Top HUD */}
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 border-b border-slate-700/60 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE // 4G/GPS
                </span>
                <span className="text-slate-500">SYS_ID: SK-902</span>
              </div>

              {/* Central Physical Push Switch inside Screen */}
              <div className="bg-[#242933] rounded-2xl p-4 sm:p-5 border border-slate-700/80 text-center flex flex-col items-center shadow-[inset_3px_3px_8px_rgba(0,0,0,0.6)]">
                <button
                  type="button"
                  onClick={() => onTriggerSos('112')}
                  className="w-24 h-24 rounded-full bg-linear-to-b from-[#ff4757] to-[#d63031] active:translate-y-[2px] text-white flex flex-col items-center justify-center shadow-[6px_6px_18px_rgba(0,0,0,0.6),inset_2px_2px_3px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_10px_rgba(80,10,20,0.9)] cursor-pointer border-2 border-[#ff6b7b]/60 transition-all select-none group"
                  title="Press to trigger emergency SOS and auto-dial 112"
                >
                  <ShieldAlert className="w-8 h-8 mb-0.5 group-hover:scale-110 transition-transform drop-shadow" />
                  <span className="font-mono font-black text-sm tracking-wider leading-none">SOS</span>
                  <span className="text-[8px] uppercase tracking-widest font-mono opacity-90 mt-0.5">AUTO-DIAL</span>
                </button>

                <div className="flex items-center gap-2 mt-3 text-xs font-mono font-bold text-[#ff6b81]">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>DIRECT DISPATCH // 112 &bull; 1090</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  GPS TELEMETRY BROADCAST ARMED
                </span>

                {/* Direct Dial Physical Keys inside screen */}
                <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-slate-700/60 w-full">
                  {[
                    { num: '112', label: '112' },
                    { num: '1090', label: '1090' },
                    { num: '181', label: '181' },
                    { num: '100', label: '100' },
                  ].map((item) => (
                    <button
                      key={item.num}
                      type="button"
                      onClick={() => onTriggerSos(item.num)}
                      className="py-1.5 px-1 rounded-lg bg-[#1a1e24] hover:bg-[#ff4757] text-slate-300 hover:text-white text-[10px] font-mono font-bold border border-slate-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] active:translate-y-[1px] transition-all cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hardware Telemetry Feed */}
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-[#242933] border border-slate-700/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#ff4757]" />
                    <div>
                      <p className="font-bold text-slate-200">PINK POLICE POST</p>
                      <p className="text-[10px] text-slate-400">0.35 KM // CCTV ACTIVE</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-950/70 text-[#ff6b81] border border-rose-800 text-[10px] font-bold">
                    1090
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#242933] border border-slate-700/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <p className="font-bold text-slate-200">24/7 APOLLO HAVEN</p>
                      <p className="text-[10px] text-slate-400">0.12 KM // STAFFED</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    OPEN
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Hardware Bezel Screws */}
            <div className="flex items-center justify-between px-2 mt-3">
              <div className="w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#a3b1c6,inset_-1px_-1px_2px_#ffffff] flex items-center justify-center">
                <div className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-45" />
              </div>
              <span className="text-[9px] font-mono text-[#4a5568] tracking-widest uppercase">
                MECHANICAL SAFETY TERMINAL
              </span>
              <div className="w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#a3b1c6,inset_-1px_-1px_2px_#ffffff] flex items-center justify-center">
                <div className="w-1.5 h-[1px] bg-[#8a99ad] rotate-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
