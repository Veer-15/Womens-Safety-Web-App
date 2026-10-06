import React from 'react';
import { motion } from 'motion/react';
import { LedIndicator } from '../ui/LedIndicator.tsx';

export const ManifestoStage: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#e0e5ec] text-[#2d3436] border-b border-[#babecc] relative overflow-hidden">
      {/* Blueprint grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 blueprint-grid" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[36px] bg-[#e0e5ec] border-4 border-[#d1d9e6] p-8 sm:p-14 lg:p-16 shadow-[16px_16px_32px_#babecc,-16px_-16px_32px_#ffffff]">
          {/* Corner Screws */}
          <span className="absolute top-4 left-4 w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-45" />
          </span>
          <span className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-45" />
          </span>

          {/* Stamped Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] text-[10px] font-mono font-bold tracking-widest text-[#4a5568] uppercase">
              <LedIndicator status="active" size="sm" />
              <span>CORE ARCHITECTURE CONVICTION</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-6">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-[#2d3436] tracking-tight uppercase leading-tight drop-shadow-[0_1px_1px_#ffffff]">
              PHYSICAL DEFENSE FOR WOMEN'S FREEDOM
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[#4a5568] leading-relaxed font-normal">
              <p>
                Women have spent decades being told to <em className="text-[#2d3436] font-semibold">"stay indoors past 20:00"</em> or forced to rely on toy software filled with ads, fake buttons, and hallucinated coordinates.
              </p>
              <p>
                We engineered <strong className="text-[#2d3436] font-mono">Sakhi</strong> because safety is not an auxiliary afterthought. It demands mechanical certainty: zero-latency emergency triggers that directly execute phone audio calls, physically verified safe havens, and grounded AI models that never fabricate fictional safe zones.
              </p>
              <p className="text-xs font-mono text-[#4a5568] pt-3 border-t border-[#babecc]">
                SPECIFICATION: FIELD-TESTED ALONGSIDE METRO TRANSIT COMMUTERS, FEMALE LAW ENFORCEMENT DESKS, AND ROUND-THE-CLOCK FIRST AID STATIONS.
              </p>
            </div>
          </div>

          {/* Bottom Screws */}
          <span className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] -rotate-12" />
          </span>
          <span className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-[#d1d9e6] shadow-[inset_1px_1px_1.5px_#a3b1c6,inset_-1px_-1px_1.5px_#ffffff] flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-[#8a99ad] rotate-30" />
          </span>
        </div>
      </div>
    </section>
  );
};
