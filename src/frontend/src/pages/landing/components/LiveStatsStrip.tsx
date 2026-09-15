import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Ship, Anchor, Clock, Cpu, Server, Activity } from 'lucide-react';
import { useLiveOperations } from '@/hooks/useLiveOperations';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  subtext: string;
  targetValue: number;
  suffix?: string;
  displayFormatter?: (val: number) => string;
  colorClass: string;
  sparklinePath: string;
  isSimulated?: boolean;
}

const AnimatedStatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  subtext,
  targetValue,
  suffix = '',
  displayFormatter,
  colorClass,
  sparklinePath,
  isSimulated,
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200; // 1.2s count up
    const steps = 30;
    const stepTime = duration / steps;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCurrentVal(targetValue);
        clearInterval(timer);
      } else {
        setCurrentVal(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, targetValue]);

  const formattedDisplay = displayFormatter
    ? displayFormatter(currentVal)
    : Math.round(currentVal).toString();

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -4 }}
      className="relative rounded-2xl bg-[#111E2E]/80 border border-[rgba(56,189,248,0.15)] p-5 backdrop-blur-md shadow-xl overflow-hidden group transition-all duration-300 hover:border-[#38BDF8]/40"
    >
      {/* Background Faint Sparkline SVG */}
      <svg
        className="absolute bottom-0 right-0 w-36 h-16 pointer-events-none opacity-20 text-[#38BDF8] group-hover:opacity-35 transition-opacity"
        viewBox="0 0 120 40"
        fill="none"
      >
        <path d={sparklinePath} stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>

      <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-3 font-mono">
        <span className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1A2A3E] border border-[rgba(56,189,248,0.2)] text-[#38BDF8] relative">
            {icon}
            {/* Animated Ring */}
            <span className="absolute -inset-0.5 rounded-lg border border-[#38BDF8]/40 animate-pulse pointer-events-none" />
          </div>
          <span>{label}</span>
        </span>
        {isSimulated && <span className="text-[10px] text-[#F472B6] font-mono">[SIM]</span>}
      </div>

      <div className={`font-mono font-bold text-3xl tracking-tight font-data ${colorClass}`}>
        {formattedDisplay}
        {suffix}
      </div>

      <p className="text-[11px] text-[#94A3B8] mt-1.5 font-sans">{subtext}</p>
    </motion.div>
  );
};

export const LiveStatsStrip: React.FC = () => {
  const { state, congestion } = useLiveOperations(10000);

  const isSimulated = state === null;

  const vesselCount = state?.vessels?.length ?? 40;
  const berthCount = state?.berths?.length ?? 5;
  const rawWait = congestion?.predictedWaitTimeHours ?? 1.5;
  const craneTotal = state?.cranes?.length ?? 16;
  const craneActive = state?.cranes ? state.cranes.filter((c) => c.status === 'Operational').length : 14;

  return (
    <section className="py-14 bg-[#0D1B2A] border-y border-[rgba(56,189,248,0.15)] relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strip Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#111E2E] border border-[#38BDF8]/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#38BDF8] animate-pulse" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#E2E8F0]">
                Live Port Telemetry Stream
              </h3>
              <p className="text-xs text-[#94A3B8] font-mono">AIS FEED · PORT SECTOR SGSIN-01</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSimulated ? (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-[#F472B6]/10 text-[#F472B6] border border-[#F472B6]/30">
                <Server className="w-3.5 h-3.5" />
                <span>Simulated Fallback Feed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30">
                {/* Sonar Ripple */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34D399]" />
                </span>
                <span>Live Backend Sync</span>
              </span>
            )}
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatedStatCard
            icon={<Ship className="w-4 h-4" />}
            label="Monitored Vessels"
            subtext="In harbor & arrival corridor"
            targetValue={vesselCount}
            colorClass="text-[#38BDF8]"
            sparklinePath="M 0 30 Q 30 10, 60 25 T 120 15"
            isSimulated={isSimulated}
          />

          <AnimatedStatCard
            icon={<Anchor className="w-4 h-4 text-[#818CF8]" />}
            label="Active Berths"
            subtext="Quayside sectors active"
            targetValue={berthCount}
            colorClass="text-[#818CF8]"
            sparklinePath="M 0 25 Q 40 35, 80 15 T 120 20"
            isSimulated={isSimulated}
          />

          <AnimatedStatCard
            icon={<Clock className="w-4 h-4 text-[#60A5FA]" />}
            label="Forecast Queue Wait"
            subtext="72-Hour average delay"
            targetValue={rawWait}
            suffix="h"
            displayFormatter={(v) => v.toFixed(1)}
            colorClass="text-[#60A5FA]"
            sparklinePath="M 0 15 Q 30 35, 70 10 T 120 30"
            isSimulated={isSimulated}
          />

          <AnimatedStatCard
            icon={<Cpu className="w-4 h-4 text-[#34D399]" />}
            label="STS Cranes Ready"
            subtext="Operational load allocation"
            targetValue={craneActive}
            displayFormatter={(v) => `${Math.round(v)}/${craneTotal}`}
            colorClass="text-[#34D399]"
            sparklinePath="M 0 20 Q 30 5, 60 28 T 120 10"
            isSimulated={isSimulated}
          />
        </div>
      </div>
    </section>
  );
};

export default LiveStatsStrip;
