import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { LedIndicator } from '../ui/LedIndicator.tsx';

interface SkylineSimulatorStageProps {
  onTriggerSos: (phoneNumber: string) => void;
}

export const SkylineSimulatorStage: React.FC<SkylineSimulatorStageProps> = ({ onTriggerSos }) => {
  const [simState, setSimState] = useState<'idle' | 'countdown' | 'dispatched' | 'cancelled'>('idle');
  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (simState === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
      } else {
        setSimState('dispatched');
      }
    }
    return () => clearTimeout(timer);
  }, [simState, countdown]);

  const handleStartSim = () => {
    setSimState('countdown');
    setCountdown(3);
  };

  const handleCancelSim = () => {
    setSimState('cancelled');
  };

  const handleResetSim = () => {
    setSimState('idle');
    setCountdown(3);
  };

  const handleImmediateOverride = () => {
    setCountdown(0);
    setSimState('dispatched');
    onTriggerSos('112');
  };

  return (
    <section className="py-20 sm:py-28 bg-[#e0e5ec] text-[#2d3436] border-b border-[#babecc] relative overflow-hidden">
      {/* Precision Blueprint Grid & Skyline Wireframe */}
      <div className="absolute top-0 left-0 right-0 h-44 pointer-events-none opacity-15 overflow-hidden">
        <svg
          viewBox="0 0 1200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#ff4757]"
        >
          <motion.path
            d="M0 180 L80 180 L80 120 L120 120 L120 180 L160 180 L160 90 L180 90 L180 60 L200 60 L200 90 L230 90 L230 180 L280 180 L280 140 L320 140 L320 180 L390 180 L390 80 L440 80 L440 180 L490 180 L490 40 L530 40 L530 180 L580 180 L580 110 L620 110 L620 180 L700 180 L700 70 L730 70 L730 30 L750 30 L750 70 L780 70 L780 180 L840 180 L840 130 L880 130 L880 180 L940 180 L940 60 L990 60 L990 180 L1050 180 L1050 100 L1100 100 L1100 180 L1200 180"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] text-[10px] font-mono font-bold tracking-widest text-[#4a5568] uppercase mb-3">
            <LedIndicator status="alert" size="sm" />
            <span>BENCHMARK TEST // HARDWARE SAFETY DRILL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#2d3436] tracking-tight uppercase drop-shadow-[0_1px_1px_#ffffff]">
            SIMULATE 3-SEC ABORT GUARD
          </h2>
          <p className="text-[#4a5568] text-sm sm:text-base mt-3 max-w-lg mx-auto leading-relaxed">
            Test the physical fail-safe architecture: abort accidental panic taps or push through zero-latency dispatch without delay.
          </p>
        </div>

        {/* Industrial Test Bench Console */}
        <div className="relative bg-[#e0e5ec] border-4 border-[#d1d9e6] rounded-[38px] p-6 sm:p-10 shadow-[14px_14px_28px_#babecc,-14px_-14px_28px_#ffffff] space-y-6">
          {/* Corner Screws */}
          <span className="absolute top-4 left-4 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-45" />
          </span>
          <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-45" />
          </span>

          {/* Top Status HUD */}
          <div className="flex items-center justify-between pb-4 border-b border-[#babecc] text-xs font-mono">
            <div className="flex items-center gap-2">
              <LedIndicator
                status={simState === 'countdown' ? 'alert' : simState === 'dispatched' ? 'active' : 'standby'}
                size="sm"
              />
              <span className="uppercase font-bold text-[#2d3436]">
                TEST RIG STATE: {simState.toUpperCase()}
              </span>
            </div>
            <span className="text-[#4a5568] text-[11px] hidden sm:inline">
              SIMULATED GPS: 28.6139°N, 77.2090°E
            </span>
          </div>

          {/* Central Interactive Controller */}
          <div className="py-6 text-center flex flex-col items-center justify-center space-y-4">
            {simState === 'idle' && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleStartSim}
                  className="w-36 h-36 rounded-full bg-gradient-to-b from-[#ff4757] to-[#d63031] text-white flex flex-col items-center justify-center shadow-[8px_8px_20px_rgba(255,71,87,0.4),-4px_-4px_12px_rgba(255,255,255,0.7),inset_2px_2px_3px_rgba(255,255,255,0.5)] active:shadow-[inset_4px_4px_12px_rgba(100,10,20,0.9)] active:translate-y-[2px] transition-all cursor-pointer select-none group border-2 border-[#ff6b7b]/60"
                >
                  <ShieldAlert className="w-10 h-10 mb-1 group-hover:scale-110 transition-transform drop-shadow" />
                  <span className="font-mono font-black text-lg tracking-wider">START TEST</span>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-rose-100">
                    3-SEC TIMER
                  </span>
                </button>
                <p className="text-xs font-mono text-[#4a5568] max-w-xs">
                  Press switch to start simulated countdown. Zero actual emergency numbers are dialed in drill mode.
                </p>
              </div>
            )}

            {simState === 'countdown' && (
              <div className="space-y-6">
                <div className="relative w-36 h-36 mx-auto rounded-full bg-[#1a1e24] border-4 border-[#ff4757] flex flex-col items-center justify-center shadow-[inset_4px_4px_10px_rgba(0,0,0,0.8),0_0_25px_rgba(255,71,87,0.5)] crt-scanlines">
                  <span className="text-5xl font-black font-mono text-white leading-none">
                    {countdown}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#ff6b81] font-mono font-bold mt-1">
                    SECONDS REMAINING
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3.5">
                  <button
                    type="button"
                    onClick={handleCancelSim}
                    className="px-6 py-3 rounded-xl bg-[#e0e5ec] text-[#2d3436] font-mono font-bold text-xs uppercase tracking-wider shadow-[4px_4px_8px_#babecc,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#babecc] active:translate-y-[1px] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-emerald-600" />
                    <span>ABORT DRILL (SAFE)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleImmediateOverride}
                    className="px-6 py-3 rounded-xl bg-[#ff4757] text-white font-mono font-black text-xs uppercase tracking-wider shadow-[4px_4px_12px_rgba(255,71,87,0.5)] active:translate-y-[1px] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>OVERRIDE // TRIGGER 112</span>
                  </button>
                </div>
              </div>
            )}

            {simState === 'dispatched' && (
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-mono font-black uppercase text-[#2d3436]">
                    DRILL DISPATCH EXECUTED
                  </h4>
                  <p className="text-xs text-[#4a5568] max-w-sm font-mono">
                    Telemetry transmitted to guardians and dial link dispatched to 112 / 1090.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetSim}
                  className="px-5 py-2.5 rounded-xl bg-[#2d3436] hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[4px_4px_8px_#babecc] active:translate-y-[1px] transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET DRILL BENCH</span>
                </button>
              </div>
            )}

            {simState === 'cancelled' && (
              <div className="space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-[#e0e5ec] shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff] border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-mono font-black uppercase text-[#2d3436]">
                    ALARM ABORTED SAFELY
                  </h4>
                  <p className="text-xs text-[#4a5568] max-w-sm font-mono">
                    Zero false alarms triggered. Zero panicked guardian alerts. Mechanical fail-safe intact.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetSim}
                  className="px-5 py-2.5 rounded-xl bg-[#2d3436] hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider shadow-[4px_4px_8px_#babecc] active:translate-y-[1px] transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RUN DRILL AGAIN</span>
                </button>
              </div>
            )}
          </div>

          {/* Bottom Screws */}
          <span className="absolute bottom-4 left-4 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-12" />
          </span>
          <span className="absolute bottom-4 right-4 w-2.5 h-2.5 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-30" />
          </span>
        </div>
      </div>
    </section>
  );
};
