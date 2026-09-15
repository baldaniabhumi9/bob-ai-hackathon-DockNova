import React, { useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  SIM_BERTH_OPTIONS,
  SIM_DISRUPTION_OPTIONS,
  MOCK_SAVED_SCENARIOS,
} from '@/features/simulation/mockSimulation';
import { api, BerthOptimizationResult } from '@/services';
import { useLiveOperations } from '@/hooks/useLiveOperations';

export const SimulationPage: React.FC = () => {
  const { state } = useLiveOperations();
  const [targetVessel, setTargetVessel] = useState('');
  const [targetBerth, setTargetBerth] = useState(SIM_BERTH_OPTIONS[0].value);
  const [disruptionType, setDisruptionType] = useState(SIM_DISRUPTION_OPTIONS[0].value);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BerthOptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Build vessel options from live state (active vessels)
  const vesselOptions = state && state.vessels.length > 0
    ? state.vessels
        .filter((v) => v.status === 'WAITING' || v.status === 'HANDLING' || v.status === 'SCHEDULED')
        .slice(0, 8)
        .map((v) => ({ value: v.id, label: `${v.name} (${v.status})` }))
    : [
        { value: 'V001', label: 'MSC Flaminia (WAITING)' },
        { value: 'V004', label: 'Ever Given (SCHEDULED)' },
        { value: 'V007', label: 'CMA CGM Marco Polo (WAITING)' },
      ];

  const defaultVessel = targetVessel || vesselOptions[0]?.value || '';

  const vesselLabel = vesselOptions.find((v) => v.value === defaultVessel)?.label ?? defaultVessel;
  const berthLabel = SIM_BERTH_OPTIONS.find((b) => b.value === targetBerth)?.label ?? targetBerth;
  const vesselName = vesselLabel.split(' ').slice(0, 3).join(' ');
  const berthDisplay = berthLabel.split(' ')[1];

  const handleRunSimulation = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Run berth optimization on the live state and show before/after
      const vesselIdsToOptimize = defaultVessel ? [defaultVessel] : undefined;
      const optResult = await api.optimizeBerths(vesselIdsToOptimize);
      setResult(optResult);
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

  // Compute before/after deltas from real result
  const beforeWaiting = result?.beforeMetrics.waitingVessels ?? 0;
  const afterWaiting = result?.afterMetrics.waitingVessels ?? 0;
  const beforeUtil = Math.round(result?.beforeMetrics.berthUtilizationPct ?? 0);
  const afterUtil = Math.round(result?.afterMetrics.berthUtilizationPct ?? 0);
  const beforeWait = result?.beforeMetrics.avgWaitingTimeHours.toFixed(1) ?? '0';
  const afterWait = result?.afterMetrics.avgWaitingTimeHours.toFixed(1) ?? '0';
  const effGain = result?.efficiencyGainPercentage.toFixed(1) ?? '0';
  const assignments = result?.assignments ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          border: `1px solid ${colors.surfaceBorder}`,
          padding: spacing.md,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: colors.primaryText }}>
            What-If Disruption Simulator
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: colors.secondaryText }}>
            Build a scenario and preview its predicted impact on port-wide congestion before acting.
          </p>
        </div>
        <Badge variant={state ? 'success' : 'warning'}>{state ? '● LIVE DATA' : 'CONNECTING...'}</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: spacing.lg, alignItems: 'start' }}>
        {/* Scenario Builder */}
        <div
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            border: `1px solid ${colors.novaCyan}`,
            padding: spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: colors.primaryText }}>
              Scenario Builder
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8125rem', color: colors.secondaryText }}>
              Choose a vessel, an action, and a target berth to preview the predicted outcome.
            </p>
          </div>

          <Select
            label="Select Vessel"
            value={defaultVessel}
            onChange={(e) => {
              setTargetVessel(e.target.value);
              setResult(null);
              setError(null);
            }}
            options={vesselOptions}
          />

          <Select
            label="Disruption Action"
            value={disruptionType}
            onChange={(e) => {
              setDisruptionType(e.target.value);
              setResult(null);
              setError(null);
            }}
            options={SIM_DISRUPTION_OPTIONS}
          />

          <Select
            label="Target Berth"
            value={targetBerth}
            onChange={(e) => {
              setTargetBerth(e.target.value);
              setResult(null);
              setError(null);
            }}
            options={SIM_BERTH_OPTIONS}
          />

          {error && (
            <div style={{ padding: spacing.sm, backgroundColor: 'rgba(239,68,68,0.1)', border: `1px solid ${colors.critical}`, borderRadius: radius.sm, fontSize: '0.8125rem', color: colors.critical }}>
              ⚠️ {error}
            </div>
          )}

          {!result ? (
            <Button
              variant="primary"
              onClick={() => void handleRunSimulation()}
              disabled={loading}
              style={{ marginTop: spacing.xs }}
            >
              {loading ? '⏳ Running simulation...' : '⚡ Run Scenario Simulation'}
            </Button>
          ) : (
            <div
              style={{
                backgroundColor: colors.background,
                padding: spacing.md,
                borderRadius: radius.md,
                border: `1px solid ${colors.novaCyan}`,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.sm,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: colors.novaCyan }}>
                  SIMULATION RESULT
                </span>
                <Badge variant="success">
                  +{effGain}% Efficiency
                </Badge>
              </div>

              <ProgressBar value={beforeUtil} label="Berth Utilisation (Before)" variant="critical" />
              <ProgressBar value={afterUtil} label={`Berth Utilisation (After — ${berthDisplay})`} variant="success" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginTop: spacing.xs }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Waiting Vessels</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.success, marginTop: '2px' }}>
                    {beforeWaiting} → {afterWaiting}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Avg Wait Time</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.success, marginTop: '2px' }}>
                    {beforeWait}h → {afterWait}h
                  </div>
                </div>
              </div>

              {assignments.length > 0 && (
                <div style={{ fontSize: '0.8125rem', color: colors.primaryText, marginTop: spacing.xs }}>
                  ✅ <strong>{assignments.length} vessels</strong> optimally assigned.
                  Solver: <span style={{ color: colors.novaCyan }}>{result?.solverStatus}</span>.
                </div>
              )}

              <div style={{ fontSize: '0.8125rem', color: colors.primaryText }}>
                ✅ <strong>Outcome:</strong> Reassigning {vesselName} to {berthDisplay} reduces
                avg wait from {beforeWait}h to {afterWait}h (saving{' '}
                {(parseFloat(beforeWait) - parseFloat(afterWait)).toFixed(1)}h per vessel).
              </div>

              <Button variant="secondary" size="sm" onClick={handleReset}>
                Reset Simulation Parameters
              </Button>
            </div>
          )}
        </div>

        {/* Saved Scenarios */}
        <div
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            border: `1px solid ${colors.surfaceBorder}`,
            padding: spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: colors.primaryText }}>
              Recent Scenarios
            </h3>
            <Badge variant="warning">Simulated</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {MOCK_SAVED_SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: radius.sm,
                  border: `1px solid ${colors.surfaceBorder}`,
                  padding: spacing.md,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: colors.primaryText }}>
                    {scenario.title}
                  </span>
                  <Badge variant="success">
                    {scenario.riskBefore}% → {scenario.riskAfter}%
                  </Badge>
                </div>
                <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>{scenario.detail}</span>
                <span style={{ fontSize: '0.6875rem', color: colors.mutedText, marginTop: '2px' }}>{scenario.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
