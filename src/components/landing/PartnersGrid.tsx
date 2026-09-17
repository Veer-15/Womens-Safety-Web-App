import React from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Pill,
  Building2,
  Lock,
  HeartPulse,
  Radio,
} from 'lucide-react';
import { LedIndicator } from '../ui/LedIndicator.tsx';

interface PartnersGridProps {
  onTriggerSos: (phoneNumber: string) => void;
}

export const PartnersGrid: React.FC<PartnersGridProps> = ({ onTriggerSos }) => {
  const partners = [
    {
      name: '112 NATIONAL ERSS',
      desc: 'Single Emergency Pan-India',
      number: '112',
      category: 'POLICE & DISASTER',
      icon: ShieldAlert,
    },
    {
      name: '1090 WOMEN POWER LINE',
      desc: 'Dedicated Anti-Harassment',
      number: '1090',
      category: 'WOMEN SAFETY',
      icon: PhoneCall,
    },
    {
      name: '181 DCW HELPLINE',
      desc: 'Commission for Women 24/7',
      number: '181',
      category: 'COUNSEL & RESCUE',
      icon: Radio,
    },
    {
      name: '100 POLICE PCR',
      desc: 'PCR Rapid Squad Intercept',
      number: '100',
      category: 'FAST DISPATCH',
      icon: ShieldAlert,
    },
    {
      name: 'APOLLO 24/7 PHARMACY',
      desc: 'Accredited Night First Aid',
      number: '1860-500-0101',
      category: 'CHEMIST HAVEN',
      icon: Pill,
    },
    {
      name: '108 AMBULANCE',
      desc: 'Trauma & Emergency Care',
      number: '108',
      category: 'TRAUMA ER',
      icon: HeartPulse,
    },
    {
      name: '1930 CYBER CELL',
      desc: 'Stalking & Cyber Extortion',
      number: '1930',
      category: 'CYBER CRIME',
      icon: Lock,
    },
    {
      name: 'NCW 7827170170',
      desc: 'National Commission Desk',
      number: '7827170170',
      category: 'LEGAL INTERCEPT',
      icon: Building2,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#e0e5ec] text-[#2d3436] border-b border-[#babecc] relative overflow-hidden">
      {/* Blueprint grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 blueprint-grid" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] text-[10px] font-mono font-bold tracking-widest text-[#4a5568] uppercase">
              <LedIndicator status="active" size="sm" />
              <span>DIRECT TEL INTEGRATIONS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-mono font-black text-[#2d3436] tracking-tight leading-tight uppercase drop-shadow-[0_1px_1px_#ffffff]">
              INSTANT RESPONDER SWITCHBOARD
            </h2>
            <p className="text-xs sm:text-sm text-[#4a5568] leading-relaxed">
              Interfaced directly with official national emergency systems, state women's helplines, and 24-hour pharmaceutical networks across India for immediate, zero-latency execution.
            </p>
          </div>

          {/* Right 8-Tile Partner Key Matrix */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {partners.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => onTriggerSos(item.number)}
                  className="p-3.5 rounded-2xl bg-[#e0e5ec] shadow-[5px_5px_10px_#babecc,-5px_-5px_10px_#ffffff] border border-white/60 text-left flex flex-col justify-between min-h-[135px] active:shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff] active:translate-y-[1px] transition-all cursor-pointer group select-none"
                  title={`Trigger speed-dial ${item.name} (${item.number})`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#e0e5ec] shadow-[inset_1.5px_1.5px_3px_#babecc,inset_-1.5px_-1.5px_3px_#ffffff] flex items-center justify-center text-[#ff4757] group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#4a5568] bg-[#d1d9e6] px-1.5 py-0.5 rounded shadow-inner">
                      {item.number}
                    </span>
                  </div>

                  <div className="space-y-0.5 mt-3 font-mono">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#ff4757] block">
                      {item.category}
                    </span>
                    <h4 className="font-black text-xs text-[#2d3436] leading-tight group-hover:text-[#ff4757] transition-colors uppercase truncate">
                      {item.name}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
