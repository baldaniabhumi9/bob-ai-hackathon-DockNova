import React, { useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  SIM_VESSEL_OPTIONS,
  SIM_BERTH_OPTIONS,
  SIM_DISRUPTION_OPTIONS,
  MOCK_SIMULATION_RESULT,
  MOCK_SAVED_SCENARIOS,
} from '@/features/simulation/mockSimulation';

export const SimulationPage: React.FC = () => {
  const [targetVessel, setTargetVessel] = useState(SIM_VESSEL_OPTIONS[0].value);
  const [targetBerth, setTargetBerth] = useState(SIM_BERTH_OPTIONS[0].value);
  const [disruptionType, setDisruptionType] = useState(SIM_DISRUPTION_OPTIONS[0].value);
  const [isSimulated, setIsSimulated] = useState(false);

  const result = MOCK_SIMULATION_RESULT;

  const vesselLabel = SIM_VESSEL_OPTIONS.find((v) => v.value === targetVessel)?.label ?? targetVessel;
  const berthLabel = SIM_BERTH_OPTIONS.find((b) => b.value === targetBerth)?.label ?? targetBerth;
  const vesselName = vesselLabel.split(' ').slice(0, 3).join(' ');
  const berthDisplay = berthLabel.split(' ')[1];

  const handleRunSimulation = () => setIsSimulated(true);
  const handleReset = () => setIsSimulated(false);

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
        <Badge variant="cyan">MOCK / DEMO DATA</Badge>
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
            value={targetVessel}
            onChange={(e) => {
              setTargetVessel(e.target.value);
              setIsSimulated(false);
            }}
            options={SIM_VESSEL_OPTIONS}
          />

          <Select
            label="Disruption Action"
            value={disruptionType}
            onChange={(e) => {
              setDisruptionType(e.target.value);
              setIsSimulated(false);
            }}
            options={SIM_DISRUPTION_OPTIONS}
          />

          <Select
            label="Target Berth"
            value={targetBerth}
            onChange={(e) => {
              setTargetBerth(e.target.value);
              setIsSimulated(false);
            }}
            options={SIM_BERTH_OPTIONS}
          />

          {!isSimulated ? (
            <Button variant="primary" onClick={handleRunSimulation} style={{ marginTop: spacing.xs }}>
              ⚡ Run Scenario Simulation
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
                  RISK REDUCED BY {result.riskBefore - result.riskAfter} PTS
                </Badge>
              </div>

              <ProgressBar value={result.riskBefore} label="Congestion Risk (Before)" variant="critical" />
              <ProgressBar value={result.riskAfter} label={`Congestion Risk (After — ${berthDisplay})`} variant="success" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, marginTop: spacing.xs }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Estimated Delay</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.success, marginTop: '2px' }}>
                    {result.delayBefore} → {result.delayAfter}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Yard Capacity</span>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.success, marginTop: '2px' }}>
                    {result.yardBefore}% → {result.yardAfter}%
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', color: colors.primaryText, marginTop: spacing.xs }}>
                ✅ <strong>Outcome:</strong> {result.narrative.replace('the selected vessel', vesselName)}
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
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: colors.primaryText }}>
            Recent Scenarios
          </h3>

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
