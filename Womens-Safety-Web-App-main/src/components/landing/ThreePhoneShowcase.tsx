import React from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  ShieldAlert,
  Bot,
  Pill,
  Radio,
  Zap,
} from 'lucide-react';
import { LedIndicator } from '../ui/LedIndicator.tsx';

interface ThreePhoneShowcaseProps {
  onTriggerSos: (phoneNumber?: string) => void;
}

export const ThreePhoneShowcase: React.FC<ThreePhoneShowcaseProps> = ({ onTriggerSos }) => {
  return (
    <section className="py-20 bg-[#e0e5ec] text-[#2d3436] border-b border-[#babecc] relative overflow-hidden">
      {/* Precision Micro-texture background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 blueprint-grid" />

      {/* Horizontal Physical Connector Pipe (connecting modules on desktop) */}
      <div className="hidden md:block absolute top-[280px] left-12 right-12 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_0_1px_3px_rgba(0,0,0,0.25),0_1px_1px_#ffffff] z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] text-[10px] font-mono font-bold tracking-widest text-[#4a5568] uppercase mb-3">
            <LedIndicator status="active" size="sm" />
            <span>ARCHITECTURE SPECIFICATION</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#2d3436] tracking-tight uppercase drop-shadow-[0_1px_1px_#ffffff]">
            3 LAYERS OF DEFENSE
          </h2>
          <p className="text-[#4a5568] text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Engineered hardware modules providing spatial triangulation, zero-latency emergency intervention, and physically verified AI intelligence.
          </p>
        </div>

        {/* 3 Physical Modules Aligned Horizontally */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start">
          {/* MODULE 1: SPATIAL RADAR TERMINAL */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            {/* Machined Chassis Module */}
            <div className="relative w-full max-w-[300px] sm:max-w-[320px] bg-[#e0e5ec] p-4 rounded-[36px] shadow-[10px_10px_20px_#babecc,-10px_-10px_20px_#ffffff] border border-white/60">
              {/* Corner Screws */}
              <span className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-45" />
              </span>
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-45" />
              </span>

              {/* Recessed Screen */}
              <div className="bg-[#1a1e24] rounded-[28px] overflow-hidden p-4 space-y-3 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8)] border border-slate-700 text-left min-h-[410px] flex flex-col justify-between crt-scanlines text-slate-100">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold mb-2 pb-1.5 border-b border-slate-800">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                      RADAR_SCAN
                    </span>
                    <span className="text-[#ff6b81] bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900 font-mono">
                      ±12M GPS
                    </span>
                  </div>

                  {/* Stylized Vector Radar Map */}
                  <div className="relative w-full h-44 rounded-xl bg-[#242933] overflow-hidden border border-slate-700 flex items-center justify-center shadow-inner">
                    {/* Concentric Radar Rings */}
                    <div className="absolute w-36 h-36 rounded-full border border-slate-700 animate-ping opacity-30" />
                    <div className="absolute w-24 h-24 rounded-full border border-slate-600" />
                    <div className="absolute w-12 h-12 rounded-full border border-[#ff4757]/40 bg-[#ff4757]/10" />

                    {/* User Center Pulse */}
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ff4757] shadow-[0_0_10px_#ff4757] relative z-10 animate-pulse" />

                    {/* Spatial Pin 1 */}
                    <div className="absolute top-3 left-4 bg-[#1a1e24] px-2 py-1 rounded border border-slate-700 flex items-center gap-1 text-[9px] font-mono font-bold text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff4757]" />
                      <span>PINK_POST (350M)</span>
                    </div>

                    {/* Spatial Pin 2 */}
                    <div className="absolute bottom-4 right-3 bg-[#1a1e24] px-2 py-1 rounded border border-slate-700 flex items-center gap-1 text-[9px] font-mono font-bold text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>APOLLO (120M)</span>
                    </div>
                  </div>
                </div>

                {/* Amenity Card inside Device */}
                <div className="p-3 bg-[#242933] rounded-xl border border-slate-700 space-y-1.5 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                      VERIFIED 24/7
                    </span>
                    <span className="text-[9px] text-slate-400">DIST: 0.12 KM</span>
                  </div>
                  <p className="font-bold text-xs text-slate-200 leading-tight">
                    APOLLO SAFE HAVEN &bull; SECTOR 18
                  </p>
                  <p className="text-[10px] text-slate-400">CCTV MONITORED // STAFFED KIOSK</p>
                </div>
              </div>

              {/* Bottom Screws */}
              <span className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-12" />
              </span>
              <span className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-30" />
              </span>
            </div>

            {/* Column Label */}
            <div className="space-y-1.5 max-w-xs">
              <span className="text-[10px] font-mono font-bold text-[#ff4757] uppercase tracking-widest block">
                LAYER 01 // TRIANGULATION
              </span>
              <h3 className="font-mono font-bold text-xl text-[#2d3436] uppercase">
                SPATIAL RADAR
              </h3>
              <p className="text-xs text-[#4a5568] leading-relaxed">
                Nearest verified safe havens, pink booths, and 24/7 pharmacies mapped with optical certainty and direct walking distance telemetry.
              </p>
            </div>
          </motion.div>

          {/* MODULE 2: EMERGENCY BEACON HARDWARE TRIGGER */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            {/* Machined Chassis Module */}
            <div className="relative w-full max-w-[300px] sm:max-w-[320px] bg-[#e0e5ec] p-4 rounded-[36px] shadow-[10px_10px_20px_#babecc,-10px_-10px_20px_#ffffff] border border-white/60">
              {/* Corner Screws */}
              <span className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-45" />
              </span>
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-45" />
              </span>

              {/* Recessed Screen with Tactile Switch */}
              <div className="bg-[#1a1e24] rounded-[28px] overflow-hidden p-5 space-y-4 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8)] border border-slate-700 text-left min-h-[410px] flex flex-col justify-between crt-scanlines text-white">
                <div className="space-y-3 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-950/60 border border-rose-800 text-[#ff6b81] text-[10px] font-mono font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4757] animate-ping" />
                    <span>EMERGENCY BEACON ARMED</span>
                  </div>

                  {/* Pulsing Central SOS Button in Screen */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onTriggerSos('112')}
                      className="w-28 h-28 mx-auto rounded-full bg-linear-to-b from-[#ff4757] to-[#d63031] text-white flex flex-col items-center justify-center shadow-[6px_6px_18px_rgba(0,0,0,0.6),inset_2px_2px_3px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_10px_rgba(80,10,20,0.9)] active:translate-y-[2px] border-2 border-[#ff6b7b]/60 cursor-pointer select-none transition-all"
                    >
                      <ShieldAlert className="w-9 h-9 mb-1" />
                      <span className="font-mono font-black text-base tracking-wider">SOS</span>
                      <span className="text-[8px] uppercase tracking-widest font-mono text-rose-200">
                        3S ABORT
                      </span>
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-rose-200">
                    ONE-TAP AUTO-DIAL &bull; DISPATCH 112
                  </p>
                </div>

                {/* Dispatch Status Console */}
                <div className="p-3 bg-[#242933] rounded-xl border border-slate-700 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-[#ff6b81]">
                    <span>TEL: 112 / 1090</span>
                    <span className="text-emerald-400">READY</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    Broadcasting live GPS coordinates link to 5 registered guardians.
                  </p>
                </div>
              </div>

              {/* Bottom Screws */}
              <span className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-12" />
              </span>
              <span className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-30" />
              </span>
            </div>

            {/* Column Label */}
            <div className="space-y-1.5 max-w-xs">
              <span className="text-[10px] font-mono font-bold text-[#ff4757] uppercase tracking-widest block">
                LAYER 02 // INTERVENTION
              </span>
              <h3 className="font-mono font-bold text-xl text-[#2d3436] uppercase">
                BEACON TRIGGER
              </h3>
              <p className="text-xs text-[#4a5568] leading-relaxed">
                3-second abort guard to prevent accidental activation, paired with instant hardware override to launch the phone dial pad directly.
              </p>
            </div>
          </motion.div>

          {/* MODULE 3: GROUNDED AI INTELLIGENCE */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            {/* Machined Chassis Module */}
            <div className="relative w-full max-w-[300px] sm:max-w-[320px] bg-[#e0e5ec] p-4 rounded-[36px] shadow-[10px_10px_20px_#babecc,-10px_-10px_20px_#ffffff] border border-white/60">
              {/* Corner Screws */}
              <span className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-45" />
              </span>
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-45" />
              </span>

              {/* Recessed Screen */}
              <div className="bg-[#1a1e24] rounded-[28px] overflow-hidden p-4 space-y-3 shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8)] border border-slate-700 text-left min-h-[410px] flex flex-col justify-between crt-scanlines text-white font-mono">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <Bot className="w-3.5 h-3.5" /> SAKHI_AI // v2.6
                  </span>
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                    GROUNDED
                  </span>
                </div>

                {/* Simulated Conversational Chat */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#242933] border border-slate-700 text-slate-300">
                    <p className="text-[10px] leading-relaxed">
                      "Exiting metro gate 4 after 10 PM. Need safest transit route."
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-950/70 border border-purple-800/60 text-purple-200 space-y-1.5">
                    <p className="text-[10px] leading-relaxed">
                      Pink Police Booth is <strong>350m away</strong> with active female staff. E-rickshaws stationed at well-lit bay.
                    </p>
                    <div className="bg-[#1a1e24] p-1.5 rounded text-[9px] text-slate-200 flex items-center justify-between border border-slate-700">
                      <span>KIOSK PIN // 0.35 KM</span>
                      <span className="text-purple-400 font-bold">1090 &rarr;</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-[#242933] rounded-lg border border-slate-700 text-[9px] text-slate-400 flex items-center justify-between">
                  <span>HALLUCINATIONS: 0%</span>
                  <span className="text-emerald-400 font-bold">STRICT PHYSICAL DB</span>
                </div>
              </div>

              {/* Bottom Screws */}
              <span className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-12" />
              </span>
              <span className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
                <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-30" />
              </span>
            </div>

            {/* Column Label */}
            <div className="space-y-1.5 max-w-xs">
              <span className="text-[10px] font-mono font-bold text-[#ff4757] uppercase tracking-widest block">
                LAYER 03 // INTELLIGENCE
              </span>
              <h3 className="font-mono font-bold text-xl text-[#2d3436] uppercase">
                GROUNDED AI
              </h3>
              <p className="text-xs text-[#4a5568] leading-relaxed">
                Context-aware guidance strictly cross-referenced against our physically vetted safe-haven database to prevent dangerous false instructions.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
