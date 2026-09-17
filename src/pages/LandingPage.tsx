import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useGeolocation } from '../hooks/useGeolocation.ts';
import { triggerEmergencyDialPad } from '../utils/emergencyDialer.ts';
import { SOSButtonModal } from '../components/SOSButtonModal.tsx';
import { Footer } from '../components/Footer.tsx';

// Industrial Skeuomorphic Stages
import { HeroStage } from '../components/landing/HeroStage.tsx';
import { ThreePhoneShowcase } from '../components/landing/ThreePhoneShowcase.tsx';
import { NightTransitStage } from '../components/landing/NightTransitStage.tsx';
import { SplitFeatureShowcase } from '../components/landing/SplitFeatureShowcase.tsx';
import { SafeGridCards } from '../components/landing/SafeGridCards.tsx';
import { SkylineSimulatorStage } from '../components/landing/SkylineSimulatorStage.tsx';
import { PartnersGrid } from '../components/landing/PartnersGrid.tsx';
import { ManifestoStage } from '../components/landing/ManifestoStage.tsx';
import { FaqAndCtaStage } from '../components/landing/FaqAndCtaStage.tsx';

import { ShieldAlert, PhoneCall } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();
  const geoState = useGeolocation();

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [sosModalOpen, setSosModalOpen] = useState<boolean>(false);
  const [sosModalDialNumber, setSosModalDialNumber] = useState<string>('112');

  const handleTriggerSos = (phoneNumber: string = '112') => {
    setSosModalDialNumber(phoneNumber);
    triggerEmergencyDialPad(phoneNumber);
    setSosModalOpen(true);
  };

  const handleLaunchDemo = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#e0e5ec] text-[#2d3436] scroll-smooth relative selection:bg-[#ff4757]/20 selection:text-[#ff4757] font-mono">
      {/* 1. TOP SCROLL PROGRESS BAR (Tactile Red Line) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff4757] via-[#ff6b81] to-[#ff4757] z-50 origin-left shadow-[0_1px_4px_rgba(255,71,87,0.5)]"
        style={{ scaleX }}
      />

      {/* 2. FLOATING MECHANICAL QUICK HELPLINE & SOS SWITCH */}
      <div className="fixed bottom-6 right-4 sm:right-8 z-40 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => handleTriggerSos('1090')}
          className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#2d3436] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[4px_4px_10px_#babecc,-2px_-2px_6px_#ffffff] active:translate-y-[1px] cursor-pointer select-none"
          title="Direct dial Women Helpline 1090"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#ff6b81]" />
          <span>HELP 1090</span>
        </button>

        <button
          id="floating-sos-beacon-trigger"
          type="button"
          onClick={() => handleTriggerSos('112')}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#ff4757] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[4px_4px_12px_rgba(255,71,87,0.5),-2px_-2px_8px_#ffffff] active:translate-y-[2px] cursor-pointer select-none border border-white/40"
          title="Emergency One-Tap SOS: Auto-dials 112 and broadcasts live GPS"
        >
          <ShieldAlert className="w-4 h-4 text-white" />
          <span>SOS AUTO-DIAL</span>
        </button>
      </div>

      {/* 3. SECTION 1: HERO STAGE WITH INDUSTRIAL DEVICE & SWITCHBOARD */}
      <HeroStage
        onTriggerSos={handleTriggerSos}
        onDemoLogin={handleLaunchDemo}
        gpsActive={geoState.status === 'active'}
      />

      {/* 4. SECTION 2: 3-PHONE / 3-MODULE SHOWCASE (3 Layers of Defense) */}
      <ThreePhoneShowcase onTriggerSos={handleTriggerSos} />

      {/* 5. SECTION 3: DARK INDUSTRIAL NIGHT ARCHITECTURE (Night Transit & Shield) */}
      <NightTransitStage />

      {/* 6. SECTION 4: SPLIT FEATURE SHOWCASE (Safe Haven Telemetry Monitor) */}
      <SplitFeatureShowcase />

      {/* 7. SECTION 5: SAFE GRID CARDS (Encrypted Guardians & Hazard Mesh) */}
      <SafeGridCards />

      {/* 8. SECTION 6: SKYLINE SIMULATOR STAGE (Interactive 3-Sec Abort Drill) */}
      <SkylineSimulatorStage onTriggerSos={handleTriggerSos} />

      {/* 9. SECTION 7: HIGH-LEVEL PARTNERS & HELPLINES SWITCHBOARD */}
      <PartnersGrid onTriggerSos={handleTriggerSos} />

      {/* 11. SECTION 9: SAFETY MANIFESTO */}
      <ManifestoStage />

      {/* 12. SECTION 10: FAQS & BOTTOM CTA TERMINAL */}
      <FaqAndCtaStage />

      {/* 13. APP FOOTER */}
      <Footer />

      {/* 14. EMERGENCY SOS ACTION MODAL */}
      <SOSButtonModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        geoState={geoState}
        initialDialNumber={sosModalDialNumber}
      />
    </div>
  );
};
