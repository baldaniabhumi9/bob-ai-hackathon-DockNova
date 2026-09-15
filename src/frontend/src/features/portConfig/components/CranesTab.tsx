import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Edit2,
  Plus,
  Star,
  Calendar,
  Wrench,
  Building2,
  Anchor,
  Activity,
  RefreshCw,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { Crane, Terminal, Berth, CraneStatus, CraneType } from '../types';

export interface CranesTabProps {
  cranes: Crane[];
  terminals: Terminal[];
  berths: Berth[];
  onEditCrane: (crane: Crane) => void;
  onAddCrane: () => void;
  onToggleStatus: (craneId: string, newStatus: CraneStatus) => void;
}

export const CranesTab: React.FC<CranesTabProps> = ({
  cranes,
  terminals,
  berths,
  onEditCrane,
  onAddCrane,
  onToggleStatus,
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | CraneType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | CraneStatus>('all');

  const filteredCranes = useMemo(() => {
    return cranes.filter((crane) => {
      if (typeFilter !== 'all' && crane.type !== typeFilter) return false;
      if (statusFilter !== 'all' && crane.status !== statusFilter) return false;
      return true;
    });
  }, [cranes, typeFilter, statusFilter]);

  const getStatusDisplay = (status: CraneStatus) => {
    switch (status) {
      case 'Operational':
        return {
          label: 'Operational',
          border: 'border-success/30',
          bg: 'bg-success/15',
          text: 'text-success',
          dot: 'bg-success',
          isPulsing: false,
        };
      case 'Maintenance':
        return {
          label: 'Maintenance',
          border: 'border-warning/30',
          bg: 'bg-warning/15',
          text: 'text-warning',
          dot: 'bg-warning',
          isPulsing: false,
        };
      case 'Fault':
        return {
          label: 'Fault Alert',
          border: 'border-danger/40',
          bg: 'bg-danger/15',
          text: 'text-danger',
          dot: 'bg-danger',
          isPulsing: true, // Red pulse!
        };
    }
  };

  const getNextStatus = (current: CraneStatus): CraneStatus => {
    switch (current) {
      case 'Operational':
        return 'Maintenance';
      case 'Maintenance':
        return 'Fault';
      case 'Fault':
        return 'Operational';
    }
  };

  // Render 5 stars based on efficiency rating (1-5)
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.4;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((idx) => {
          const isFilled = idx <= fullStars;
          const isHalf = idx === fullStars + 1 && hasHalf;
          return (
            <Star
              key={idx}
              className={`w-3.5 h-3.5 ${
                isFilled
                  ? 'text-warning fill-warning'
                  : isHalf
                  ? 'text-warning fill-warning/50'
                  : 'text-text-muted fill-transparent'
              }`}
            />
          );
        })}
      </div>
    );
  };

  // Framer Motion staggered variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg sm:text-xl text-text-primary">
              Heavy Quayside Gantry & Yard Cranes
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-secondary/15 text-secondary border border-secondary/30">
              {cranes.length} Units Active
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Oversee Ship-to-Shore (STS) and Rubber-Tired Gantry (RTG) operational readiness and telemetry.
          </p>
        </div>

        {/* Add Crane button */}
        <button
          onClick={onAddCrane}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-xs sm:text-sm font-semibold text-text-primary shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Crane</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="p-3.5 rounded-xl bg-surface-1 border border-border/80 flex items-center justify-between gap-3 flex-wrap shadow-sm">
        {/* Type Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-text-muted font-mono mr-1">TYPE:</span>
          {(['all', 'STS', 'RTG'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                typeFilter === type
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-surface-2 text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-text-muted font-mono mr-1">STATUS:</span>
          {(['all', 'Operational', 'Maintenance', 'Fault'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'bg-surface-2 text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* CRANES GRID: Vertical Cards (grid-cols-1 on mobile, 2 on tablet, 3 or 4 on desktop) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5"
      >
        {filteredCranes.map((crane) => {
          const statusInfo = getStatusDisplay(crane.status);

          return (
            <motion.div
              key={crane.id}
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-surface-1 rounded-2xl p-5 border border-subtle relative flex flex-col justify-between hover:border-primary/50 transition-all duration-300 shadow-sm group"
            >
              {/* Top Row: Crane ID, Type & Quick Actions */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-text-primary">
                      {crane.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        crane.type === 'STS'
                          ? 'bg-primary/20 text-primary border border-primary/40'
                          : 'bg-secondary/20 text-secondary border border-secondary/40'
                      }`}
                    >
                      {crane.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Status Toggle Button (0.3s color transition) */}
                    <button
                      onClick={() => onToggleStatus(crane.id, getNextStatus(crane.status))}
                      style={{ transition: 'all 0.3s ease' }}
                      className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text-primary border border-border"
                      title={`Cycle status to ${getNextStatus(crane.status)}`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onEditCrane(crane)}
                      className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text-primary border border-border"
                      title="Edit Crane Specs"
                      aria-label={`Edit ${crane.code}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Assigned Terminal & Berth */}
                <div className="space-y-1 my-2">
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary truncate">
                    <Building2 className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                    <span className="truncate">{crane.terminalName.split(' ')[0]} Sector</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Anchor className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="font-mono text-text-primary">
                      {crane.assignedBerthCode
                        ? `Berth ${crane.assignedBerthCode}`
                        : 'Standby Gantry'}
                    </span>
                  </div>
                </div>

                {/* Status Indicator with 0.3s color transition */}
                <div className="mt-3">
                  <div
                    style={{ transition: 'all 0.3s ease' }}
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.text}`}
                  >
                    {/* Status Dot with pulse for Fault */}
                    <span className="relative flex h-2 w-2">
                      {statusInfo.isPulsing && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${statusInfo.dot}`} />
                    </span>
                    <span>{statusInfo.label}</span>
                  </div>
                </div>
              </div>

              {/* Middle & Bottom: Efficiency Rating & Maintenance Date */}
              <div className="mt-4 pt-3.5 border-t border-border/60 space-y-3">
                {/* Efficiency Rating: 5-star style + score */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-text-muted">Efficiency Rating</span>
                    <span className="text-text-primary font-bold">{crane.efficiencyRating.toFixed(1)} / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {renderStars(crane.efficiencyRating)}
                    {crane.movesPerHour !== undefined && (
                      <span className="text-[10px] font-mono text-text-muted flex items-center gap-0.5">
                        <Gauge className="w-3 h-3 text-primary" /> {crane.movesPerHour} m/h
                      </span>
                    )}
                  </div>
                </div>

                {/* Last Maintenance Date */}
                <div className="p-2.5 rounded-xl bg-surface-2/60 border border-border/40 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <Calendar className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-[11px] text-text-muted font-mono">Last Serviced:</span>
                  </div>
                  <span className="font-mono text-text-primary text-[11px] font-semibold">
                    {crane.lastMaintenanceDate}
                  </span>
                </div>

                {/* Manufacturer Tag */}
                {crane.manufacturer && (
                  <div className="text-[10px] font-mono text-text-muted truncate flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-text-muted flex-shrink-0" />
                    <span className="truncate">{crane.manufacturer}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default CranesTab;
