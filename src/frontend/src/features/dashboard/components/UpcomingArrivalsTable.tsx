import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  Ship,
  Search,
  ExternalLink,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  X,
  Compass,
  WifiOff,
} from 'lucide-react';
import type { LiveVessel, BerthRisk } from '@/services';

// ─── Props ────────────────────────────────────────────────────────────────────

interface UpcomingArrivalsTableProps {
  vessels: LiveVessel[];
  berthRisks: BerthRisk[];
  loading: boolean;
  error: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatEta(eta: string | undefined | null): string {
  if (!eta) return 'TBD';
  try {
    const d = new Date(eta);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' });
    return isToday ? `Today, ${time}` : d.toLocaleDateString('en-SG', { month: 'short', day: 'numeric' }) + ` ${time}`;
  } catch {
    return eta;
  }
}

function normaliseStatus(raw: string | undefined | null): 'On Time' | 'Delayed' | 'Arriving' | 'At Port' | string {
  if (!raw) return 'Unknown';
  const u = raw.toUpperCase();
  if (u === 'DELAYED') return 'Delayed';
  if (u === 'AT_BERTH' || u === 'AT PORT') return 'At Port';
  if (u === 'ARRIVING' || u === 'IN_TRANSIT') return 'Arriving';
  if (u === 'ON_TIME' || u === 'ON TIME') return 'On Time';
  return raw;
}

function getRiskGradient(risk: number) {
  if (risk < 30) return 'bg-success';
  if (risk < 65) return 'bg-warning';
  return 'bg-danger';
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse">
    {[140, 80, 100, 70, 90, 100, 60].map((w, i) => (
      <td key={i} className="py-3.5 px-4">
        <div className={`h-4 rounded bg-surface-3`} style={{ width: w }} />
      </td>
    ))}
  </tr>
);

// ─── Empty state ──────────────────────────────────────────────────────────────

export const EmptyState: React.FC<{ onReset?: () => void }> = ({ onReset }) => (
  <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-text-muted mb-4 shadow-lg">
      <Ship className="w-8 h-8" />
    </div>
    <h4 className="font-heading font-bold text-lg text-text-primary mb-1">No vessels scheduled</h4>
    <p className="text-xs text-text-muted max-w-sm mb-4">
      There are no vessel arrivals matching your current search or filter criteria.
    </p>
    {onReset && (
      <button
        type="button"
        onClick={onReset}
        className="px-3.5 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border text-xs text-primary transition-colors cursor-pointer"
      >
        Clear Filters
      </button>
    )}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const UpcomingArrivalsTable: React.FC<UpcomingArrivalsTableProps> = ({
  vessels,
  berthRisks,
  loading,
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof LiveVessel>('eta');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedVessel, setSelectedVessel] = useState<LiveVessel | null>(null);

  // Build a lookup: vesselId → riskScore from /api/port/berth-risk
  const riskByVesselId = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of berthRisks) {
      if (b.vesselId) map.set(b.vesselId, b.riskScore);
    }
    return map;
  }, [berthRisks]);

  const filteredAndSorted = useMemo(() => {
    let list = [...vessels];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (v) =>
          v.name?.toLowerCase().includes(q) ||
          v.imo?.toLowerCase().includes(q) ||
          v.type?.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter(
        (v) => normaliseStatus(v.status).toLowerCase() === statusFilter.toLowerCase(),
      );
    }

    list.sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (typeof aVal === 'string') {
        return sortAsc
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortAsc ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });

    return list;
  }, [vessels, searchQuery, statusFilter, sortField, sortAsc]);

  const handleSort = (field: keyof LiveVessel) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const tableVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const rowVariants: Variants = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

  return (
    <div className="rounded-2xl bg-surface-1 border border-border shadow-xl p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg text-text-primary tracking-tight">
              Upcoming Vessel Arrivals
            </h3>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/25">
              {loading ? '…' : `${filteredAndSorted.length} vessels`}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Live vessel list from{' '}
            <span className="font-mono text-primary/80">/api/vessels</span>
            {' '}· risk scores from{' '}
            <span className="font-mono text-primary/80">/api/port/berth-risk</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by vessel, IMO, type..."
              className="pl-9 pr-4 py-1.5 rounded-lg bg-surface-2 border border-border/80 text-xs text-text-primary placeholder:text-text-muted/60 outline-none focus:ring-2 ring-primary/40 w-48 sm:w-60"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2 border border-border/80 text-xs font-mono">
            {['all', 'on time', 'arriving', 'delayed', 'at port'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-surface-3 text-text-primary font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && !loading && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-danger/10 border border-danger/30 text-xs font-mono text-danger">
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>
            Fleet data unavailable — API offline.{' '}
            <span className="text-danger/70">(Simulated)</span>
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead>
            <tr className="bg-surface-2/60 border-b border-border/80 text-text-muted uppercase font-mono tracking-wider text-[11px]">
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-text-primary sticky left-0 bg-surface-2/95 backdrop-blur-md z-10"
              >
                <div className="flex items-center gap-1.5">
                  <span>Vessel Name</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold">IMO</th>
              <th
                onClick={() => handleSort('eta')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-text-primary"
              >
                <div className="flex items-center gap-1.5">
                  <span>ETA (Local)</span>
                  <ArrowUpDown className="w-3 h-3 text-primary" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold">Type</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">
                <div className="flex items-center gap-1.5">
                  <span>Berth Risk</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>

          {loading ? (
            <tbody className="divide-y divide-border/40">
              {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
            </tbody>
          ) : filteredAndSorted.length > 0 ? (
            <motion.tbody
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-border/40 font-mono"
            >
              {filteredAndSorted.map((vessel) => {
                const status = normaliseStatus(vessel.status);
                const isDelayed = status === 'Delayed';
                const isOnTime = status === 'On Time';
                const isArriving = status === 'Arriving';
                const riskScore = riskByVesselId.get(vessel.id);
                const hasRisk = riskScore !== undefined;

                return (
                  <motion.tr
                    key={vessel.id}
                    variants={rowVariants}
                    className="group hover:bg-surface-2/70 transition-colors duration-200"
                  >
                    {/* Vessel Name */}
                    <td className="py-3.5 px-4 sticky left-0 bg-surface-1 group-hover:bg-surface-2/70 transition-colors z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-secondary group-hover:scale-105 transition-transform flex-shrink-0">
                          <Ship className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <span className="font-sans font-semibold text-text-primary group-hover:text-primary transition-colors text-sm">
                            {vessel.name}
                          </span>
                          <p className="text-[11px] text-text-muted font-normal">{vessel.type ?? '—'}</p>
                        </div>
                      </div>
                    </td>

                    {/* IMO */}
                    <td className="py-3.5 px-4 text-text-secondary">{vessel.imo ?? '—'}</td>

                    {/* ETA */}
                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {formatEta(vessel.eta)}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4 text-text-secondary capitalize">
                      {vessel.type ?? '—'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {isOnTime && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-success/10 text-success border border-success/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          On Time
                        </span>
                      )}
                      {isDelayed && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-danger/10 text-danger border border-danger/20">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Delayed
                        </span>
                      )}
                      {isArriving && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-primary/10 text-primary border border-primary/20">
                          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                          Arriving
                        </span>
                      )}
                      {!isOnTime && !isDelayed && !isArriving && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-medium bg-surface-3 text-text-muted border border-border">
                          {status}
                        </span>
                      )}
                    </td>

                    {/* Risk */}
                    <td className="py-3.5 px-4">
                      {hasRisk ? (
                        <div className="w-28 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-text-muted">Index:</span>
                            <span
                              className={
                                riskScore >= 70
                                  ? 'text-danger font-bold'
                                  : riskScore >= 40
                                  ? 'text-warning font-bold'
                                  : 'text-success font-bold'
                              }
                            >
                              {riskScore}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${getRiskGradient(riskScore)}`}
                              style={{ width: `${riskScore}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-text-muted font-mono italic">
                          — (no berth)
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/user/vessel/${vessel.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    onReset={() => { setSearchQuery(''); setStatusFilter('all'); }}
                  />
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* Vessel Detail Modal */}
      <AnimatePresence>
        {selectedVessel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md p-6 rounded-2xl bg-surface-1 border border-border shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary">
                    <Ship className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-text-primary">
                      {selectedVessel.name}
                    </h4>
                    <p className="text-xs text-text-muted font-mono">IMO {selectedVessel.imo}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVessel(null)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2 border-t border-border/60">
                <div className="p-3 rounded-lg bg-surface-2">
                  <span className="text-text-muted block">Type:</span>
                  <span className="font-semibold text-text-primary">{selectedVessel.type ?? '—'}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-2">
                  <span className="text-text-muted block">Status:</span>
                  <span className="font-semibold text-text-primary">{normaliseStatus(selectedVessel.status)}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-2">
                  <span className="text-text-muted block">ETA:</span>
                  <span className="font-semibold text-text-primary">{formatEta(selectedVessel.eta)}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-2">
                  <span className="text-text-muted block">ETD:</span>
                  <span className="font-semibold text-text-primary">{formatEta(selectedVessel.etd)}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedVessel(null)}
                  className="px-4 py-2 rounded-lg bg-surface-3 hover:bg-surface-2 text-xs font-semibold text-text-primary transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpcomingArrivalsTable;
