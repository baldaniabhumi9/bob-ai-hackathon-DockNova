import React from 'react';
import { motion } from 'framer-motion';
import { Anchor, Cpu, Compass, Radio, ShieldCheck, Activity } from 'lucide-react';

export const AuthHero: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[220px] md:min-h-full overflow-hidden bg-base flex flex-col justify-between p-6 sm:p-8 lg:p-12 select-none border-b md:border-b-0 md:border-r border-border/60">
      {/* 1. Animated Gradient Mesh (Primary #38BDF8 + Secondary #818CF8 with low opacity) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Drifting Radial 1: Primary Cyan/Sky */}
        <div
          className="absolute -top-[20%] -left-[15%] w-[130%] h-[130%] opacity-35 animate-mesh-drift"
          style={{
            background:
              'radial-gradient(circle at 35% 40%, rgba(56, 189, 248, 0.28) 0%, rgba(56, 189, 248, 0.08) 35%, transparent 70%)',
          }}
        />
        {/* Drifting Radial 2: Secondary Indigo */}
        <div
          className="absolute -bottom-[20%] -right-[15%] w-[120%] h-[120%] opacity-30 animate-mesh-drift"
          style={{
            animationDelay: '-10s',
            background:
              'radial-gradient(circle at 65% 60%, rgba(129, 140, 248, 0.25) 0%, rgba(129, 140, 248, 0.06) 40%, transparent 75%)',
          }}
        />
        {/* Drifting Radial 3: Subtle Accent Pink Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] opacity-20 animate-mesh-drift"
          style={{
            animationDelay: '-5s',
            background:
              'radial-gradient(circle at 50% 50%, rgba(244, 114, 182, 0.12) 0%, transparent 65%)',
          }}
        />

        {/* Subtle Maritime Radar Rings & Grid */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] border border-primary/15 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border border-primary/20 rounded-full pointer-events-none" />
        {/* Sweeping radar arm */}
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[2px] -translate-y-1/2 origin-left bg-gradient-to-r from-primary/30 to-transparent animate-radar-sweep pointer-events-none" />

        {/* Fine background grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* 2. Large Faint DockNova Logo Watermark */}
      <div className="absolute right-4 bottom-4 lg:-bottom-10 lg:-right-10 pointer-events-none opacity-[0.04] text-primary select-none flex items-center justify-center">
        <Anchor className="w-80 h-80 lg:w-[480px] lg:h-[480px]" strokeWidth={1} />
      </div>

      {/* 3. Hero Header / Branding */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center shadow-glow-primary/40">
              <Anchor className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg lg:text-xl tracking-tight text-text-primary">
                  Dock<span className="text-primary">Nova</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                  v3.4 Control
                </span>
              </div>
              <p className="text-xs text-text-muted hidden sm:block">AI Maritime Terminal Operating System</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2/80 border border-border text-xs text-text-secondary font-mono">
            <span className="w-2 h-2 rounded-full bg-success animate-ping" />
            <span className="hidden sm:inline">AIS Port Sector 04 • </span>LIVE
          </div>
        </div>
      </div>

      {/* 4. Centerpiece Value Prop & Visual Highlights (Hidden on compact mobile banner to fit 200px) */}
      <div className="relative z-10 my-auto py-6 hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-lg space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2/80 border border-primary/30 text-xs text-primary font-mono backdrop-blur-sm">
            <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>IBM Bob AI Copilot • 72-Hour Congestion Horizon</span>
          </div>

          <h1 className="font-heading text-3xl lg:text-4xl font-bold tracking-tight text-text-primary leading-tight">
            Autonomous Maritime <br />
            <span className="bg-gradient-to-r from-primary via-[#7DD3FC] to-secondary bg-clip-text text-transparent">
              Port Operations Center
            </span>
          </h1>

          <p className="text-sm lg:text-base text-text-secondary leading-relaxed">
            Real-time berth scheduling, vessel traffic optimization, and automated crane dispatching powered by predictive intelligence.
          </p>

          {/* Telemetry Indicator Cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-surface-1/90 border border-border backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <Compass className="w-3.5 h-3.5 text-primary" />
                <span>Berth Allocation</span>
              </div>
              <div className="font-mono text-xl font-semibold text-text-primary">
                42 <span className="text-xs font-sans text-success font-normal">Active Quays</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-1/90 border border-border backdrop-blur-sm">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-1">
                <Activity className="w-3.5 h-3.5 text-secondary" />
                <span>Turnaround Precision</span>
              </div>
              <div className="font-mono text-xl font-semibold text-text-primary">
                99.4% <span className="text-xs font-sans text-primary font-normal">AI Forecast</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 5. Footer Telemetry Info */}
      <div className="relative z-10 flex items-center justify-between text-xs text-text-muted font-mono pt-4 border-t border-border/40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-primary/80" />
          <span>AES-256 Encrypted Telemetry</span>
        </div>
        <div className="hidden sm:block">
          CH 16 / 156.800 MHz • LAT 1°17'N LON 103°51'E
        </div>
      </div>
    </div>
  );
};
