import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Siren,
  ChevronDown,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Cpu,
  Clock,
  Loader2,
  ShieldAlert,
  Shield,
} from 'lucide-react';
import {
  simulateEmergency,
  type DisruptionType,
  type EmergencySimulationRequest,
  type EmergencySimulationResult,
  type PortStateSnapshot,
} from '@/services/emergencyService';

// ---------------------------------------------------------------------------
// Static reference data (matches mock_data.py / synthetic data IDs)
// ---------------------------------------------------------------------------

const CRANE_OPTIONS = [
  { id: 'CR01', label: 'CR01 — STS Gantry Alpha-1 (B01)' },
  { id: 'CR02', label: 'CR02 — STS Gantry Alpha-2 (B01)' },
  { id: 'CR03', label: 'CR03 — STS Gantry Alpha-3 (B01)' },
  { id: 'CR04', label: 'CR04 — STS Gantry Bravo-1 (B02)' },
  { id: 'CR05', label: 'CR05 — STS Gantry Bravo-2 (B02)' },
  { id: 'CR06', label: 'CR06 — Loading Arm LB-1A (B03)' },
  { id: 'CR07', label: 'CR07 — Loading Arm LB-1B (B03)' },
  { id: 'CR08', label: 'CR08 — Grab Crane DB-1A (B04)' },
  { id: 'CR09', label: 'CR09 — Grab Crane DB-1B (B04)' },
  { id: 'CR10', label: 'CR10 — Grab Crane DB-1C (B04)' },
  { id: 'CR11', label: 'CR11 — Mobile Harbour Crane MP-1A (B05)' },
  { id: 'CR12', label: 'CR12 — Mobile Harbour Crane MP-1B (B05)' },
];

const BERTH_OPTIONS = [
  { id: 'B01', label: 'B01 — Container Terminal Alpha' },
  { id: 'B02', label: 'B02 — Container Terminal Bravo' },
  { id: 'B03', label: 'B03 — Liquid Bulk Terminal' },
  { id: 'B04', label: 'B04 — Dry Bulk Terminal' },
  { id: 'B05', label: 'B05 — Multi-Purpose Quay' },
];

const DISRUPTION_OPTIONS: { value: DisruptionType; label: string; description: string }[] = [
  {
    value: 'CRANE_FAILURE',
    label: 'Crane Failure',
    description: 'A target crane goes offline immediately',
  },
  {
    value: 'BERTH_CLOSURE',
    label: 'Berth Closure',
    description: 'A target berth becomes unavailable',
  },
  {
    value: 'WEATHER_DELAY',
    label: 'Weather Delay',
    description: 'Delay in hours applied to all incoming vessel ETAs',
  },
  {
    value: 'STAFF_SHORTAGE',
    label: 'Staff Shortage',
    description: 'Percentage reduction applied to overall crane throughput',
  },
  {
    value: 'EQUIPMENT_BREAKDOWN',
    label: 'Equipment Breakdown',
    description: "Percentage reduction applied to a specific berth's crane count",
  },
];

// ---------------------------------------------------------------------------
// Risk level badge helper
// ---------------------------------------------------------------------------

function RiskBadge({ level }: { level: PortStateSnapshot['riskLevel'] }) {
  const config: Record<PortStateSnapshot['riskLevel'], { color: string; dot: string }> = {
    LOW: { color: 'bg-success/15 text-success border-success/30', dot: 'bg-success' },
    MEDIUM: { color: 'bg-warning/15 text-warning border-warning/30', dot: 'bg-warning' },
    HIGH: { color: 'bg-orange-500/15 text-orange-400 border-orange-500/30', dot: 'bg-orange-400' },
    CRITICAL: { color: 'bg-danger/15 text-danger border-danger/30', dot: 'bg-danger animate-ping' },
  };
  const { color, dot } = config[level] ?? config.LOW;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono border ${color}`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {level}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Metric delta indicator
// ---------------------------------------------------------------------------

function DeltaIndicator({ before, after, unit = '' }: { before: number; after: number; unit?: string }) {
  const delta = after - before;
  if (Math.abs(delta) < 0.01) {
    return (
      <span className="flex items-center gap-1 text-[11px] font-mono text-text-muted">
        <Minus className="w-3 h-3" />
        No change
      </span>
    );
  }
  const isUp = delta > 0;
  return (
    <span
      className={`flex items-center gap-1 text-[11px] font-mono font-semibold ${
        isUp ? 'text-danger' : 'text-success'
      }`}
    >
      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isUp ? '+' : ''}
      {delta.toFixed(1)}
      {unit}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Snapshot panel (BEFORE or AFTER)
// ---------------------------------------------------------------------------

function SnapshotPanel({
  label,
  snapshot,
  isAfter = false,
  before,
}: {
  label: string;
  snapshot: PortStateSnapshot;
  isAfter?: boolean;
  before?: PortStateSnapshot;
}) {
  const borderClass = isAfter
    ? 'border-l-4 border-l-warning'
    : 'border-l-4 border-l-accent';

  return (
    <div
      className={`flex-1 p-5 rounded-2xl bg-surface-1 border border-subtle shadow-sm ${borderClass}`}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
            isAfter
              ? 'bg-warning/10 text-warning border-warning/30'
              : 'bg-accent/10 text-accent border-accent/30'
          }`}
        >
          {label}
        </span>
        <RiskBadge level={snapshot.riskLevel} />
      </div>

      {/* Metrics grid */}
      <div className="space-y-4">
        {/* Congestion */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Activity className="w-4 h-4 text-accent shrink-0" />
            <span>Congestion Risk</span>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-lg text-text-primary">
              {snapshot.congestionPct.toFixed(1)}%
            </div>
            {isAfter && before && (
              <DeltaIndicator before={before.congestionPct} after={snapshot.congestionPct} unit="%" />
            )}
          </div>
        </div>

        {/* Available Cranes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Cpu className="w-4 h-4 text-secondary shrink-0" />
            <span>Available Cranes</span>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-lg text-text-primary">
              {snapshot.availableCranes}
              <span className="text-text-muted text-sm font-normal">
                /{snapshot.totalCranes}
              </span>
            </div>
            {isAfter && before && (
              <DeltaIndicator before={before.availableCranes} after={snapshot.availableCranes} />
            )}
          </div>
        </div>

        {/* Predicted Wait Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <span>Predicted Wait</span>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold text-lg text-text-primary">
              {snapshot.predictedWaitTimeHours.toFixed(1)}h
            </div>
            {isAfter && before && (
              <DeltaIndicator
                before={before.predictedWaitTimeHours}
                after={snapshot.predictedWaitTimeHours}
                unit="h"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main EmergencySimulator component
// ---------------------------------------------------------------------------

export const EmergencySimulator: React.FC = () => {
  const [disruptionType, setDisruptionType] = useState<DisruptionType>('CRANE_FAILURE');
  const [targetId, setTargetId] = useState<string>('CR01');
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmergencySimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update default targetId and value when disruption type changes
  const handleDisruptionTypeChange = (newType: DisruptionType) => {
    setDisruptionType(newType);
    setResult(null);
    setError(null);
    setValue('');
    if (newType === 'CRANE_FAILURE') setTargetId('CR01');
    else if (newType === 'BERTH_CLOSURE') setTargetId('B01');
    else if (newType === 'EQUIPMENT_BREAKDOWN') setTargetId('B01');
    else setTargetId('');
  };

  const requiresTargetId =
    disruptionType === 'CRANE_FAILURE' ||
    disruptionType === 'BERTH_CLOSURE' ||
    disruptionType === 'EQUIPMENT_BREAKDOWN';

  const requiresValue =
    disruptionType === 'WEATHER_DELAY' ||
    disruptionType === 'STAFF_SHORTAGE' ||
    disruptionType === 'EQUIPMENT_BREAKDOWN';

  const targetOptions =
    disruptionType === 'CRANE_FAILURE' ? CRANE_OPTIONS : BERTH_OPTIONS;

  const valuePlaceholder =
    disruptionType === 'WEATHER_DELAY'
      ? 'Delay hours (e.g. 6)'
      : 'Reduction % (e.g. 40)';

  const valueMin = 1;
  const valueMax = disruptionType === 'WEATHER_DELAY' ? 72 : 90;
  const valueDefault = disruptionType === 'WEATHER_DELAY' ? 6 : 30;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const request: EmergencySimulationRequest = { disruptionType };
    if (requiresTargetId && targetId) request.targetId = targetId;
    if (requiresValue) request.value = value ? parseFloat(value) : valueDefault;

    try {
      const data = await simulateEmergency(request);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Simulation failed — is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const selectedDisruption = DISRUPTION_OPTIONS.find((d) => d.value === disruptionType)!;

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-danger/15 text-danger border border-danger/30 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-text-primary">
              Emergency Mode — Disruption Simulator
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Model port disruptions and see their impact on congestion before they happen. No real data is
              modified — all simulations are read-only.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/30 shrink-0 self-start sm:self-auto">
          SIM ONLY
        </span>
      </div>

      {/* ── FORM ── */}
      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle shadow-sm space-y-5"
      >
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <h3 className="font-heading font-semibold text-sm text-text-primary">
            Configure Disruption
          </h3>
        </div>

        {/* Disruption type dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
            Disruption Type
          </label>
          <div className="relative">
            <select
              value={disruptionType}
              onChange={(e) => handleDisruptionTypeChange(e.target.value as DisruptionType)}
              className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-surface-2 border border-border text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer"
            >
              {DISRUPTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
          <p className="text-xs text-text-muted pl-1">{selectedDisruption.description}</p>
        </div>

        {/* Conditional: target selector (crane or berth) */}
        {requiresTargetId && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
              {disruptionType === 'CRANE_FAILURE' ? 'Target Crane' : 'Target Berth'}
            </label>
            <div className="relative">
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-surface-2 border border-border text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer"
              >
                {targetOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>
          </div>
        )}

        {/* Conditional: numeric value input */}
        {requiresValue && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">
              {disruptionType === 'WEATHER_DELAY' ? 'Delay (hours)' : 'Reduction (%)'}
            </label>
            <input
              type="number"
              min={valueMin}
              max={valueMax}
              step={disruptionType === 'WEATHER_DELAY' ? 1 : 5}
              placeholder={valuePlaceholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-xl bg-surface-2 border border-border text-sm text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <p className="text-xs text-text-muted pl-1">
              {disruptionType === 'WEATHER_DELAY'
                ? `Range: 1–72 hours (default: 6). Leave blank to use default.`
                : `Range: 1–90% (default: ${valueDefault}%). Leave blank to use default.`}
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-danger text-white font-heading font-bold text-sm tracking-wide hover:bg-danger/90 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Simulating disruption…
            </>
          ) : (
            <>
              <Siren className="w-5 h-5" />
              🚨 SIMULATE DISRUPTION
            </>
          )}
        </button>
      </form>

      {/* ── ERROR STATE ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-danger/10 border border-danger/30 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-danger">Simulation Error</div>
              <div className="text-xs text-text-secondary mt-1">{error}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RESULTS ── */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* BEFORE / AFTER panels */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <Shield className="w-4 h-4 text-accent" />
                <h3 className="font-heading font-semibold text-sm text-text-primary">
                  Simulation Results — Before vs After
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <SnapshotPanel label="BEFORE" snapshot={result.before} />
                <SnapshotPanel
                  label="AFTER"
                  snapshot={result.after}
                  isAfter
                  before={result.before}
                />
              </div>
            </div>

            {/* Impact summary */}
            <div className="p-5 rounded-2xl bg-surface-1 border border-subtle shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-warning/10 border border-warning/30 shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted mb-2">
                    Impact Analysis
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {result.impactSummary}
                  </p>
                  <div className="mt-3 text-[11px] font-mono text-text-muted">
                    Generated at{' '}
                    {new Date(result.generatedAt).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}{' '}
                    UTC
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencySimulator;
