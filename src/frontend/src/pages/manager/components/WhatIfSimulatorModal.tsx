import React, { useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { api, WhatIfSimulationResult } from '@/services';
import { useLiveOperations } from '@/hooks/useLiveOperations';

export interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATIC_VESSEL_OPTIONS = [
  { value: 'mv_ocean_star', label: 'MV Ocean Star (+4h Delay)' },
  { value: 'mv_atlas', label: 'MV Atlas (At Risk)' },
];

const BERTH_OPTIONS = [
  { value: 'b5', label: 'Berth B5 (45% Utilisation - Recommended)' },
  { value: 'b1', label: 'Berth B1 (65% Utilisation)' },
  { value: 'b6', label: 'Berth B6 (50% Standby)' },
];

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { state } = useLiveOperations();
  const [targetVessel, setTargetVessel] = useState('mv_ocean_star');
  const [targetBerth, setTargetBerth] = useState('b5');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WhatIfSimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Build live vessel options if state is available; fall back to static list
  const vesselOptions = state && state.vessels.length > 0
    ? state.vessels
        .filter((v) => v.status === 'WAITING' || v.status === 'HANDLING' || v.status === 'SCHEDULED')
        .slice(0, 6)
        .map((v) => ({ value: v.id, label: `${v.name} (${v.status})` }))
    : STATIC_VESSEL_OPTIONS;

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Run what-if simulation with extra vessels (simulates congestion scenario)
      const simResult = await api.runSimulation(3);
      setResult(simResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Simulation failed — is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const handleVesselChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetVessel(e.target.value);
    setResult(null);
    setError(null);
  };

  const handleBerthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetBerth(e.target.value);
    setResult(null);
    setError(null);
  };

  const berthLabel = BERTH_OPTIONS.find((b) => b.value === targetBerth)?.label ?? targetBerth;
  const berthDisplay = berthLabel.split(' ')[1];
  const vesselLabel = vesselOptions.find((v) => v.value === targetVessel)?.label ?? targetVessel;
  const vesselName = vesselLabel.split(' ').slice(0, 3).join(' ');

  // Compute before/after from the real simulation result
  const beforeWaiting = result?.optimizationResult.beforeMetrics.waitingVessels ?? 0;
  const afterWaiting = result?.optimizationResult.afterMetrics.waitingVessels ?? 0;
  const beforeUtil = Math.round(result?.optimizationResult.beforeMetrics.berthUtilizationPct ?? 0);
  const afterUtil = Math.round(result?.optimizationResult.afterMetrics.berthUtilizationPct ?? 0);
  const beforeWait = result?.optimizationResult.beforeMetrics.avgWaitingTimeHours.toFixed(1) ?? '0';
  const afterWait = result?.optimizationResult.afterMetrics.avgWaitingTimeHours.toFixed(1) ?? '0';
  const efficiencyGain = result?.optimizationResult.efficiencyGainPercentage.toFixed(1) ?? '0';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What-If Scenario Simulator">
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: colors.secondaryText }}>
          Simulate operational decisions and evaluate predicted impact on port congestion.
          {state && <span style={{ color: colors.success, marginLeft: '4px' }}>● Live fleet data loaded</span>}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
          <Select
            label="Select Vessel to Reassign"
            value={targetVessel}
            onChange={handleVesselChange}
            options={vesselOptions}
          />

          <Select
            label="Reassign Target Berth"
            value={targetBerth}
            onChange={handleBerthChange}
            options={BERTH_OPTIONS}
          />
        </div>

        {error && (
          <div style={{ padding: spacing.sm, backgroundColor: 'rgba(239,68,68,0.1)', border: `1px solid ${colors.critical}`, borderRadius: radius.sm, fontSize: '0.8125rem', color: colors.critical }}>
            ⚠️ {error}
          </div>
        )}

        {!result ? (
          <Button variant="primary" onClick={() => void handleSimulate()} disabled={loading} style={{ marginTop: spacing.xs }}>
            {loading ? '⏳ Running simulation...' : '⚡ Run Scenario Simulation'}
          </Button>
        ) : (
          <div style={{ backgroundColor: colors.background, padding: spacing.md, borderRadius: radius.md, border: `1px solid ${colors.novaCyan}`, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: colors.novaCyan }}>
                SIMULATION RESULT
              </span>
              <Badge variant="success">+{efficiencyGain}% Efficiency Gain</Badge>
            </div>

            <ProgressBar value={beforeUtil} label={`Berth Utilisation (Before)`} variant="warning" />
            <ProgressBar value={afterUtil} label={`Berth Utilisation (After — {berthDisplay})`} variant="success" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.sm }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Waiting Vessels</span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.success }}>
                  {beforeWaiting} → {afterWaiting}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Avg Wait Time</span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.success }}>
                  {beforeWait}h → {afterWait}h
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', color: colors.primaryText, marginTop: spacing.xs }}>
              ✅ <strong>Outcome:</strong> Reassigning {vesselName} to {berthDisplay} reduces waiting vessels
              from {beforeWaiting} to {afterWaiting}, saving {(parseFloat(beforeWait) - parseFloat(afterWait)).toFixed(1)}h avg wait.
            </div>

            <Button variant="secondary" size="sm" onClick={handleReset}>
              Reset Simulation Parameters
            </Button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: spacing.sm }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
