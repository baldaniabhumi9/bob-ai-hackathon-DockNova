import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Edit2,
  Plus,
  Anchor,
  Cpu,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Ruler,
} from 'lucide-react';
import { Terminal, Berth, Crane } from '../types';

export interface TerminalsTabProps {
  terminals: Terminal[];
  berths: Berth[];
  cranes: Crane[];
  onEditTerminal: (terminal: Terminal) => void;
  onAddTerminal: () => void;
}

export const TerminalsTab: React.FC<TerminalsTabProps> = ({
  terminals,
  berths,
  cranes,
  onEditTerminal,
  onAddTerminal,
}) => {
  const getStatusBadge = (status: Terminal['status']) => {
    switch (status) {
      case 'Operational':
        return 'bg-success/15 text-success border-success/30';
      case 'High Load':
        return 'bg-accent/15 text-accent border-accent/30';
      case 'Maintenance':
        return 'bg-warning/15 text-warning border-warning/30';
      case 'Restricted':
        return 'bg-danger/15 text-danger border-danger/30';
    }
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-danger';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-success';
  };

  // Framer Motion staggered variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      {/* Tab Section Header with Add Terminal action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg sm:text-xl text-text-primary">
              Port Terminals & Quay Line Sectors
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-accent/15 text-accent border border-accent/30">
              {terminals.length} Facilities
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Supervise deepwater basin sectors, quayside length allocations, and dynamic utilization metrics.
          </p>
        </div>

        {/* Add Terminal button */}
        <button
          onClick={onAddTerminal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-xs sm:text-sm font-semibold text-text-primary shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Terminal</span>
        </button>
      </div>

      {/* 3 per row Grid of Terminal Cards (responsive: 1 on mobile, 2 on tablet, 3 on desktop) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {terminals.map((terminal) => {
          // Dynamic computed counts from current state
          const terminalBerths = berths.filter((b) => b.terminalId === terminal.id);
          const terminalCranes = cranes.filter(
            (c) => c.terminalId === terminal.id && c.status === 'Operational'
          );

          return (
            <motion.div
              key={terminal.id}
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-surface-1 rounded-2xl p-6 border border-subtle relative flex flex-col justify-between hover:border-primary/50 transition-all duration-300 shadow-sm group"
            >
              {/* Card Top: Code, Status & Edit Button */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-surface-2 text-text-primary border border-border">
                      {terminal.code}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${getStatusBadge(
                        terminal.status
                      )}`}
                    >
                      {terminal.status}
                    </span>
                  </div>

                  {/* Edit Button (pencil, top right) */}
                  <button
                    onClick={() => onEditTerminal(terminal)}
                    className="p-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text-primary border border-border/80 transition-colors group-hover:border-primary/40"
                    title="Edit Terminal Parameters"
                    aria-label={`Edit ${terminal.name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Terminal Name */}
                <h4 className="font-heading font-bold text-base sm:text-lg text-text-primary group-hover:text-primary transition-colors">
                  {terminal.name}
                </h4>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                  <span className="truncate">{terminal.location}</span>
                </div>

                {/* Quay Line & Description */}
                <div className="mt-3 text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {terminal.description || 'Deepwater container terminal servicing international corridors.'}
                </div>
              </div>

              {/* Card Bottom: 3 Metrics & Progress Bar */}
              <div className="mt-6 pt-4 border-t border-border/60 space-y-4">
                {/* 3 Metrics: Total Berths, Active Cranes, Avg Utilization % with High Contrast */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 shadow-sm">
                    <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-sky-600 dark:text-sky-400 mb-1">
                      <Anchor className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span>Berths</span>
                    </div>
                    <div className="font-mono font-extrabold text-base sm:text-xl text-sky-600 dark:text-sky-300">
                      {terminalBerths.length || terminal.totalBerths}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 shadow-sm">
                    <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      <Cpu className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>Cranes</span>
                    </div>
                    <div className="font-mono font-extrabold text-base sm:text-xl text-indigo-600 dark:text-indigo-300">
                      {terminalCranes.length || terminal.activeCranes}
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border shadow-sm ${
                    terminal.avgUtilization >= 85
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : terminal.avgUtilization >= 65
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-emerald-500/10 border-emerald-500/30'
                  }`}>
                    <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-text-secondary mb-1">
                      <TrendingUp className={`w-3.5 h-3.5 shrink-0 ${
                        terminal.avgUtilization >= 85
                          ? 'text-rose-500'
                          : terminal.avgUtilization >= 65
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }`} />
                      <span>Utilized</span>
                    </div>
                    <div className={`font-mono font-extrabold text-base sm:text-xl ${
                      terminal.avgUtilization >= 85
                        ? 'text-rose-600 dark:text-rose-400'
                        : terminal.avgUtilization >= 65
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {terminal.avgUtilization}%
                    </div>
                  </div>
                </div>

                {/* Mini progress bar for utilization */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-text-muted">Quayline Load</span>
                    <span className="text-text-primary font-semibold">
                      {terminal.avgUtilization}% capacity
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(
                        terminal.avgUtilization
                      )}`}
                      style={{ width: `${Math.min(100, terminal.avgUtilization)}%` }}
                    />
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between text-[11px] font-mono text-text-muted pt-1">
                  <span className="flex items-center gap-1">
                    <Ruler className="w-3 h-3" />
                    {terminal.quayLengthMeters}m Quay
                  </span>
                  <span>Est. {terminal.establishedYear || 2018}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default TerminalsTab;
