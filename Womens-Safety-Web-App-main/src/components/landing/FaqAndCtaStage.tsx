import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LedIndicator } from '../ui/LedIndicator.tsx';

export const FaqAndCtaStage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'HOW DOES THE 3-SECOND SOS ABORT SAFEGUARD WORK?',
      a: 'When you press the SOS trigger, a 3-second tactile visual and audio countdown begins immediately. If pressed accidentally (e.g. inside a handbag or pocket), simply tap "Cancel" within 3 seconds to abort. If you do not cancel, or if you tap "Send Now", coordinates are dispatched to your emergency guardians and the dial pad auto-calls 112 without delay.',
    },
    {
      q: 'HOW ARE PINK POLICE BOOTHS AND SAFE HAVENS AUDITED?',
      a: 'Unlike unvetted crowd maps where any pin can be added, Sakhi safe havens are strictly cross-referenced against official state police records, certified female wardens, and round-the-clock accredited pharmacy chains (like Apollo 24/7 and MedPlus). Every listing includes verified landlines and operating hours.',
    },
    {
      q: 'DOES SAKHI SELL OR PERSIST MY CONTINUOUS GPS LOCATION?',
      a: 'Zero tracking or data monetization. Sakhi is engineered with strict client-side encryption. Your GPS coordinates are processed exclusively within your device sandbox and queried only when distance features or emergency SOS dispatch are executed.',
    },
    {
      q: 'HOW DOES SAKHI PREVENT AI HALLUCINATIONS?',
      a: 'Our AI Companion uses strict retrieval-augmented grounding. When you ask questions like "Where can I walk safely near Sector 18?", the assistant is physically constrained to recommend only audited points of interest that exist in our database with verified coordinates.',
    },
    {
      q: 'WHAT OCCURS IF CELLULAR DATA IS SLUGGISH OR OFFLINE?',
      a: 'Sakhi provides one-tap direct telephone triggers (tel:112 and tel:1090) that execute directly through standard cellular voice protocols, requiring no internet connectivity to establish audio communication with emergency dispatchers.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#e0e5ec] text-[#2d3436] relative overflow-hidden">
      {/* Blueprint grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 blueprint-grid" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        {/* FAQ Accordion Section */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#d1d9e6] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] text-[10px] font-mono font-bold tracking-widest text-[#4a5568] uppercase mb-3">
              <LedIndicator status="active" size="sm" />
              <span>TECHNICAL PROTOCOLS &bull; FAQ</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-mono font-black text-[#2d3436] tracking-tight uppercase drop-shadow-[0_1px_1px_#ffffff]">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-[#e0e5ec] shadow-[6px_6px_12px_#babecc,-6px_-6px_12px_#ffffff] border border-white/60 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left font-mono font-bold text-xs sm:text-sm text-[#2d3436] flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <div className="w-6 h-6 rounded-md bg-[#e0e5ec] shadow-[inset_1px_1px_2px_#babecc,inset_-1px_-1px_2px_#ffffff] flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#4a5568] transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#ff4757]' : ''
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#4a5568] leading-relaxed border-t border-[#babecc]"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CTA TERMINAL HOUSING */}
        <div className="relative rounded-[36px] sm:rounded-[44px] bg-[#1a1e24] p-8 sm:p-14 text-white text-center shadow-[16px_16px_32px_rgba(0,0,0,0.6),-8px_-8px_20px_rgba(255,255,255,0.05)] border-4 border-slate-700 crt-scanlines overflow-hidden">
          {/* Corner Screws */}
          <span className="absolute top-5 left-5 w-3 h-3 rounded-full bg-slate-700 shadow-inner flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-slate-500 rotate-45" />
          </span>
          <span className="absolute top-5 right-5 w-3 h-3 rounded-full bg-slate-700 shadow-inner flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-slate-500 -rotate-45" />
          </span>

          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#242933] text-[#ff6b81] text-[10px] font-mono font-bold uppercase tracking-wider border border-rose-900 shadow-inner">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff4757]" />
              <span>TERMINAL READY // RAPID ACCESS</span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-white tracking-tight uppercase leading-tight">
              COMMENCE COMPLETE SAFETY DRILL
            </h3>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-mono">
              Open the full Sakhi dashboard now. Instant access to emergency helplines, havens, and spatial defense tools with zero authentication required.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/login"
                className="px-6 py-3.5 rounded-xl bg-[#242933] hover:bg-[#2d3436] text-slate-200 font-mono font-bold text-xs uppercase tracking-wider border border-slate-700 shadow-md active:translate-y-[1px] transition-all cursor-pointer"
              >
                SIGN IN / REGISTER
              </Link>

              <Link
                to="/amenities"
                className="px-7 py-3.5 rounded-xl bg-[#ff4757] hover:bg-[#d63031] text-white font-mono font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,71,87,0.6)] active:translate-y-[1px] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>DEPLOY RADAR NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bottom Screws */}
          <span className="absolute bottom-5 left-5 w-3 h-3 rounded-full bg-slate-700 shadow-inner flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-slate-500 -rotate-12" />
          </span>
          <span className="absolute bottom-5 right-5 w-3 h-3 rounded-full bg-slate-700 shadow-inner flex items-center justify-center pointer-events-none">
            <span className="w-1.5 h-[1px] bg-slate-500 rotate-30" />
          </span>
        </div>
      </div>
    </section>
  );
};
