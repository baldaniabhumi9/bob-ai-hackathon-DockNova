import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Fuel,
  Receipt,
  Navigation,
  ArrowRight,
} from 'lucide-react';
import { AlternatePortOption } from '../mockRouteData';

interface AlternateOptionCardProps {
  option: AlternatePortOption;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

export const AlternateOptionCard: React.FC<AlternateOptionCardProps> = ({
  option,
  isSelected,
  onSelect,
  index,
}) => {
  // Congestion badge styling
  const congestionConfig = {
    LOW: {
      badge: 'bg-success/15 text-success border-success/30',
      dot: 'bg-success',
    },
    MODERATE: {
      badge: 'bg-warning/15 text-warning border-warning/30',
      dot: 'bg-warning',
    },
    CRITICAL: {
      badge: 'bg-danger/15 text-danger border-danger/30',
      dot: 'bg-danger',
    },
  }[option.congestionBadge];

  // Berth availability styling
  const berthStatusConfig = {
    high: 'text-success bg-success/10 border-success/20',
    moderate: 'text-warning bg-warning/10 border-warning/20',
    low: 'text-danger bg-danger/10 border-danger/20',
  }[option.berthStatus];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onSelect}
      className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-surface-2 border-primary shadow-glow-primary ring-1 ring-primary/40'
          : 'bg-surface-1 border-border hover:border-border-subtle hover:bg-surface-2/60 hover:-translate-y-1'
      }`}
    >
      {/* "AI Best Match" floating pill */}
      {option.isAiBestMatch && (
        <div className="absolute -top-3 left-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-gradient-primary text-base shadow-glow-primary">
            <Sparkles className="w-3 h-3 text-base" />
            <span>AI Best Match</span>
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Top Row: Port Name + Country Flag + Congestion Badge */}
        <div className="flex items-start justify-between gap-2 pt-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label={option.country}>
                {option.flag}
              </span>
              <div>
                <h4 className="font-heading font-bold text-lg text-text-primary tracking-tight">
                  {option.name}
                </h4>
                <span className="text-[11px] font-mono text-text-muted">
                  {option.country} • {option.portCode}
                </span>
              </div>
            </div>
          </div>

          {/* Congestion Risk Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border shrink-0 ${congestionConfig.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${congestionConfig.dot}`} />
            <span>{option.congestionRisk}% {option.congestionBadge}</span>
          </span>
        </div>

        {/* Distance & ETA Grid */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface-3/60 border border-border/60 text-xs font-mono">
          <div>
            <span className="text-text-muted flex items-center gap-1 text-[11px]">
              <Compass className="w-3 h-3 text-primary" />
              <span>Distance</span>
            </span>
            <div className="font-bold text-text-primary text-sm mt-0.5">
              {option.distanceNM} NM
            </div>
          </div>
          <div>
            <span className="text-text-muted flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-secondary" />
              <span>Projected ETA</span>
            </span>
            <div className="font-bold text-secondary text-sm mt-0.5">
              {option.eta}
            </div>
          </div>
        </div>

        {/* Berth Availability Pill */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted font-mono">Berth Availability:</span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-medium border ${berthStatusConfig}`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{option.berthAvailability}</span>
          </span>
        </div>

        {/* Estimated Cost Breakdown */}
        <div className="space-y-1.5 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span className="flex items-center gap-1">
              <Fuel className="w-3 h-3 text-warning" />
              <span>Fuel:</span>
            </span>
            <span className="text-text-secondary">${option.costBreakdown.fuel.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span className="flex items-center gap-1">
              <Receipt className="w-3 h-3 text-primary" />
              <span>Port Fee:</span>
            </span>
            <span className="text-text-secondary">${option.costBreakdown.portFee.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span className="flex items-center gap-1">
              <Navigation className="w-3 h-3 text-secondary" />
              <span>Deviation Cost:</span>
            </span>
            <span className="text-text-secondary">${option.costBreakdown.deviation.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono font-semibold pt-1 border-t border-border/40">
            <span className="text-text-primary">Estimated Total:</span>
            <span className="text-text-primary font-bold">
              ${option.costBreakdown.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Select Route Button */}
      <div className="pt-4 mt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold font-mono tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            isSelected
              ? 'bg-gradient-primary text-base font-bold shadow-glow-primary'
              : 'border border-primary text-primary hover:bg-primary/10'
          }`}
        >
          {isSelected ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-base" />
              <span>Selected Alternate</span>
            </>
          ) : (
            <>
              <span>Select Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
