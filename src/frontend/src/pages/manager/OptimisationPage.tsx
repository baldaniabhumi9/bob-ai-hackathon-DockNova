import React, { useMemo, useState, useEffect } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  MOCK_OPTIMISATION_SUMMARY,
  MOCK_OPTIMISATION_ACTIONS,
  OPTIMISATION_WINDOWS,
} from '@/features/optimisation/mockOptimisation';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { api, OperationsPlanEntry } from '@/services';

const windowBadgeVariant = (window: string): 'cyan' | 'electric' | 'neutral' => {
  if (window === 'Next 6h') return 'cyan';
  if (window === '6-24h') return 'electric';
  return 'neutral';
};

function entriesToActions(entries: OperationsPlanEntry[]) {
  return entries.slice(0, 6).map((e, idx) => {
    const window = idx < 2 ? 'Next 6h' : idx < 4 ? '6-24h' : '24-48h';
    const confidence = e.status === 'DELAYED' ? 95 : e.priority === 'HIGH' ? 88 : 78;
    return {
      id: `live-${e.vesselId}`,
      window,
      title: `${e.vesselName} → ${e.berthName}`,
      description: `${e.recommendedAction} Assign ${e.craneCount} crane(s) for ${e.serviceDurationHours.toFixed(1)}h to handle ${e.workloadTEU} TEU.`,
      impactLabel: e.status === 'DELAYED' ? 'Delay Reduction' : 'Throughput Gain',
      impactValue: e.status === 'DELAYED'
        ? `${e.serviceDurationHours.toFixed(1)}h → ${(e.serviceDurationHours * 0.6).toFixed(1)}h`
        : `+${Math.round(e.workloadTEU / e.serviceDurationHours)} TEU/hr`,
      confidence,
    };
  });
}

export const OptimisationPage: React.FC = () => {
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [liveEntries, setLiveEntries] = useState<OperationsPlanEntry[] | null>(null);

  useEffect(() => {
    api.get72hPlan()
      .then((entries) => setLiveEntries(entries))
      .catch(() => { /* keep mock */ });
  }, []);

  const liveActions = useMemo(
    () => (liveEntries ? entriesToActions(liveEntries) : null),
    [liveEntries],
  );

  const summary = liveEntries
    ? {
        recommendedActions: Math.min(liveEntries.length, 6),
        projectedEfficiencyGain: `+${Math.round(10 + liveEntries.filter((e) => e.status !== 'DELAYED').length * 0.5)}%`,
        congestionRiskReduction: `-${Math.round(15 + liveEntries.filter((e) => e.priority === 'HIGH').length * 2)} pts`,
        planConfidence: 85 + Math.min(liveEntries.length, 5),
      }
    : MOCK_OPTIMISATION_SUMMARY;

  const displayActions = liveActions ?? MOCK_OPTIMISATION_ACTIONS;
  const displayWindows = liveActions
    ? ['Next 6h', '6-24h', '24-48h']
    : OPTIMISATION_WINDOWS;

  const groupedActions = useMemo(() => {
    return displayWindows.map((window) => ({
      window,
      actions: displayActions.filter((a) => a.window === window),
    }));
  }, [displayActions, displayWindows]);

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
            AI 72-Hour Operations Planner
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: colors.secondaryText }}>
            AI-sequenced actions across the next 72 hours to reduce congestion and improve throughput.
          </p>
        </div>
        <Badge variant={liveEntries ? 'success' : 'cyan'}>{liveEntries ? '● LIVE PLAN' : 'PLAN ACTIVE'}</Badge>
      </div>

      {/* 4 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.md, width: '100%' }}>
        <div style={{ backgroundColor: colors.surface, borderRadius: radius.md, border: `1px solid ${colors.surfaceBorder}`, padding: `${spacing.md} ${spacing.lg}` }}>
          <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, marginBottom: '4px' }}>Recommended Actions</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.primaryText }}>{summary.recommendedActions}</div>
        </div>
        <div style={{ backgroundColor: colors.surface, borderRadius: radius.md, border: `1px solid ${colors.surfaceBorder}`, padding: `${spacing.md} ${spacing.lg}` }}>
          <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, marginBottom: '4px' }}>Projected Efficiency Gain</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.success }}>{summary.projectedEfficiencyGain}</div>
        </div>
        <div style={{ backgroundColor: colors.surface, borderRadius: radius.md, border: `1px solid ${colors.surfaceBorder}`, padding: `${spacing.md} ${spacing.lg}` }}>
          <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, marginBottom: '4px' }}>Congestion Risk Reduction</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.success }}>{summary.congestionRiskReduction}</div>
        </div>
        <div style={{ backgroundColor: colors.surface, borderRadius: radius.md, border: `1px solid ${colors.surfaceBorder}`, padding: `${spacing.md} ${spacing.lg}` }}>
          <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, marginBottom: '4px' }}>Plan Confidence</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.novaCyan }}>{summary.planConfidence}%</div>
        </div>
      </div>

      {/* Timeline of Actions grouped by window */}
      {groupedActions.map(({ window, actions }) => (
        <div
          key={window}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
            <Badge variant={windowBadgeVariant(window)}>{window}</Badge>
            <span style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>
              {actions.length} recommended {actions.length === 1 ? 'action' : 'actions'}
            </span>
          </div>

          {actions.length === 0 ? (
            <div style={{ fontSize: '0.875rem', color: colors.secondaryText, padding: spacing.sm }}>
              No actions required in this window.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.md }}>
              {actions.map((action) => (
                <div
                  key={action.id}
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: radius.sm,
                    border: `1px solid ${colors.surfaceBorder}`,
                    padding: spacing.md,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.primaryText }}>
                      {action.title}
                    </span>
                    <Badge variant="cyan">{action.confidence}%</Badge>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.8125rem', color: colors.secondaryText, lineHeight: 1.5 }}>
                    {action.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: colors.secondaryText }}>
                    <span>{action.impactLabel}</span>
                    <span style={{ fontWeight: 700, color: colors.success }}>{action.impactValue}</span>
                  </div>

                  <Button variant="primary" size="sm" onClick={() => setIsWhatIfOpen(true)} style={{ marginTop: spacing.xs }}>
                    Simulate
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Reused What-If Simulator */}
      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
    </div>
  );
};

export default OptimisationPage;
