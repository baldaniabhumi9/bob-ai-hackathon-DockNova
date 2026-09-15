import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Compass, Radio, ShieldCheck, Activity } from 'lucide-react';
import { HarborCanvas } from '@/components/ui/HarborCanvas';

export const AuthHero: React.FC = () => {
  const [quaysCount, setQuaysCount] = useState(0);
  const [accuracyVal, setAccuracyVal] = useState(0);

  // Animated Count-Up for Stat Chips
  useEffect(() => {
    let qStart = 0;
    const qTarget = 5;
    const qTimer = setInterval(() => {
      qStart += 1;
      if (qStart >= qTarget) {
        setQuaysCount(qTarget);
        clearInterval(qTimer);
      } else {
        setQuaysCount(qStart);
      }
    }, 150);

    let aStart = 0;
    const aTarget = 86.4;
    const aTimer = setInterval(() => {
      aStart += 2.5;
      if (aStart >= aTarget) {
        setAccuracyVal(aTarget);
        clearInterval(aTimer);
      } else {
        setAccuracyVal(parseFloat(aStart.toFixed(1)));
      }
    }, 30);

    return () => {
      clearInterval(qTimer);
      clearInterval(aTimer);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[240px] md:min-h-screen overflow-hidden bg-[#0A1420] flex flex-col justify-between p-6 sm:p-8 lg:p-12 select-none border-b md:border-b-0 md:border-r border-[rgba(56,189,248,0.15)]">
      {/* 1. Animated Harbor Canvas Background (slower radar speed & low density) */}
      <HarborCanvas density="low" speed={0.6} interactive={false} />

      {/* 2. Radial Scrim Overlay for Readability */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#0A1420_90%)] z-10" />

      {/* 3. Header / Brand Bar */}
      <div className="relative z-20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111E2E] border border-[rgba(56,189,248,0.3)] flex items-center justify-center shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]">
              <Anchor className="w-5 h-5 text-[#38BDF8] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg lg:text-xl tracking-tight text-[#E2E8F0]">
                  Dock<span className="text-[#38BDF8]">Nova</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
                  v3.4 Control
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] hidden sm:block font-mono">AI Maritime Terminal Operating System</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111E2E]/80 border border-[rgba(56,189,248,0.2)] text-xs text-[#94A3B8] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
            <span className="hidden sm:inline">AIS Port Sector 04 • </span>LIVE
          </div>
        </div>
      </div>

      {/* 4. Centerpiece Section (Desktop Only) */}
      <div className="relative z-20 my-auto py-6 hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-lg space-y-6"
        >
          {/* Blinking Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#111E2E]/90 border border-[#38BDF8]/40 text-xs text-[#38BDF8] font-mono backdrop-blur-md shadow-md">
            <Radio className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
            <span>IBM Bob AI Copilot • 72-Hour Congestion Horizon</span>
          </div>

          <h1 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight text-[#E2E8F0] leading-tight">
            Autonomous Maritime <br />
            <span className="bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#818CF8] bg-clip-text text-transparent">
              Port Operations Center
            </span>
          </h1>

          <p className="text-sm lg:text-base text-[#94A3B8] leading-relaxed font-sans">
            Real-time berth scheduling, vessel traffic optimization, and automated crane dispatching powered by predictive intelligence.
          </p>

          {/* 2 Glass Stat Chips with Count-Up Animations */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-[#111E2E]/85 border border-[rgba(56,189,248,0.2)] backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-1 font-mono">
                <Compass className="w-4 h-4 text-[#38BDF8]" />
                <span>Berth Allocation</span>
              </div>
              <div className="font-mono text-2xl font-bold text-[#E2E8F0] font-data">
                {quaysCount} <span className="text-xs font-sans text-[#34D399] font-normal">Active Quays</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#111E2E]/85 border border-[rgba(56,189,248,0.2)] backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-1 font-mono">
                <Activity className="w-4 h-4 text-[#818CF8]" />
                <span>Turnaround Precision</span>
              </div>
              <div className="font-mono text-2xl font-bold text-[#E2E8F0] font-data">
                {accuracyVal.toFixed(1)}% <span className="text-xs font-sans text-[#38BDF8] font-normal">AI Forecast</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 5. Footer Telemetry Bar */}
      <div className="relative z-20 flex items-center justify-between text-xs text-[#94A3B8] font-mono pt-4 border-t border-[rgba(56,189,248,0.15)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
          <span>AES-256 Encrypted Telemetry</span>
        </div>
        <div className="hidden sm:block">
          CH 16 / 156.800 MHz • LAT 1°17'N LON 103°51'E
        </div>
      </div>
    </div>
  );
};

export default AuthHero;
