import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  AlertTriangle,
  Anchor,
  Ship,
  TrendingUp,
  DollarSign,
  Layers,
} from 'lucide-react';
import { RoutingVessel } from '../mockRouteData';

interface CurrentStatusCardProps {
  vessel: RoutingVessel;
}

export const CurrentStatusCard: React.FC<CurrentStatusCardProps> = ({ vessel }) => {
  const orig = vessel.originalDestination;

  // Determine badge styling based on congestion risk
  const isCritical = orig.congestionRisk >= 80;
  const isHigh = orig.congestionRisk >= 60 && orig.congestionRisk < 80;

  const badgeColor = isCritical
    ? 'bg-danger/15 text-danger border-danger/40'
    : isHigh
    ? 'bg-warning/15 text-warning border-warning/40'
    : 'bg-primary/15 text-primary border-primary/40';

  const progressColor = isCritical
    ? 'bg-gradient-to-r from-warning via-danger to-danger'
    : isHigh
    ? 'bg-gradient-to-r from-secondary to-warning'
    : 'bg-gradient-to-r from-primary to-secondary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-surface-1 border border-border relative overflow-hidden shadow-xl"
    >
      {/* Subtle background glow effect for critical status */}
      {isCritical && (
        <div className="absolute top-0 right-0 w-96 h-96 bg-danger/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Side: Destination & Warning Status */}
        <div className="space-y-3 max-w-xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span>Primary Port Assignment</span>
            </span>
            <span className="text-text-muted">•</span>
            <span className="text-xs font-mono text-text-secondary">{orig.terminal}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              {orig.port}
            </h3>
            {/* Large Congestion Risk Danger Badge */}
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border shadow-glow-danger/20 ${badgeColor}`}
            >
              <span className="w-2 h-2 rounded-full bg-danger animate-ping" />
              <span>{orig.congestionRisk}% {orig.congestionStatus}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Severe quay saturation at <span className="text-text-primary font-medium">{orig.berth}</span>. Fairway approach corridors and pilotage slots are backlogged with heavy transshipment queues.
          </p>

          {/* Key Metric Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-danger" />
              <span className="text-text-muted">Estimated Wait:</span>
              <span className="text-danger font-semibold">{orig.estimatedWaitTime}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs font-mono">
              <Anchor className="w-3.5 h-3.5 text-warning" />
              <span className="text-text-muted">Anchorage Queue:</span>
              <span className="text-text-primary font-semibold">{orig.anchorageQueue} Vessels Ahead</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs font-mono">
              <DollarSign className="w-3.5 h-3.5 text-danger" />
              <span className="text-text-muted">Demurrage Risk:</span>
              <span className="text-danger font-semibold">${orig.projectedDemurrage.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Berth Utilization Progress Bar & Meter */}
        <div className="lg:w-80 w-full p-4 rounded-xl bg-surface-2/80 border border-border/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-muted font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-secondary" />
              <span>Berth Yard Space Utilization</span>
            </span>
            <span className="font-mono font-bold text-danger text-sm">
              {orig.berthUtilization}% Capacity
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-3 bg-surface-3 rounded-full overflow-hidden p-0.5 border border-border/60">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${orig.berthUtilization}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className={`h-full rounded-full ${progressColor}`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-text-muted font-mono pt-1">
            <span>Nominal &lt;70%</span>
            <span>Threshold 85%</span>
            <span className="text-danger font-semibold">Critical 90%+</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
