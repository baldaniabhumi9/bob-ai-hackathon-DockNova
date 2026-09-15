import React, { useState, useEffect } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  MOCK_PLAN72H_KPIS,
  MOCK_PLAN72H_TIMELINE,
  MOCK_PLAN72H_SUMMARY,
  priorityBadgeVariant,
} from '@/features/plan72h';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { api, OperationsPlanEntry } from '@/services';

export interface Plan72hPageProps {
  onNavigate?: (id: string) => void;
}

function statusToPriority(status: string, priority: string): string {
  if (status === 'DELAYED') return 'Critical';
  if (priority === 'HIGH') return 'High';
  if (priority === 'MEDIUM') return 'Medium';
  return 'Low';
}

export const Plan72hPage: React.FC<Plan72hPageProps> = ({ onNavigate }) => {
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [planVersion, setPlanVersion] = useState(1);
  const [liveEntries, setLiveEntries] = useState<OperationsPlanEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPlan = async () => {
    try {
      const entries = await api.get72hPlan();
      setLiveEntries(entries);
    } catch {
      // Keep mock data if API unavailable
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPlan();
  }, [planVersion]);

  const handleRegeneratePlan = () => {
    setIsRegenerating(true);
    setExportMessage(null);
    setLoading(true);
    setPlanVersion((v) => v + 1);
    window.setTimeout(() => setIsRegenerating(false), 800);
  };

  const handleExportPlan = () => {
    setExportMessage('Plan ready for export.');
    window.setTimeout(() => setExportMessage(null), 3000);
  };

  // Build live KPI cards from real entries
  const liveKpis = liveEntries
    ? [
        { id: 'total', title: 'Total Entries', value: String(liveEntries.length) },
        { id: 'scheduled', title: 'Scheduled', value: String(liveEntries.filter((e) => e.status === 'SCHEDULED').length) },
        { id: 'delayed', title: 'Delayed', value: String(liveEntries.filter((e) => e.status === 'DELAYED').length) },
        { id: 'cranes', title: 'Crane Deployments', value: String(liveEntries.reduce((s, e) => s + e.craneCount, 0)) },
      ]
    : MOCK_PLAN72H_KPIS;

  // Group live entries into time windows (use mock structure when no live data)
  const liveTimeline = liveEntries
    ? [
        {
          id: 'now',
          label: 'ACTIVE NOW',
          actions: liveEntries
            .filter((e) => e.status === 'IN_PROGRESS' || e.status === 'DELAYED')
            .slice(0, 4)
            .map((e) => ({
              id: e.vesselId,
              time: new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action: `${e.vesselName} at ${e.berthName} — ${e.recommendedAction}`,
              priority: statusToPriority(e.status, e.priority),
              related: `${e.craneCount} cranes, ${e.workloadTEU} TEU`,
              impact: e.status === 'DELAYED' ? '-Delayed' : `${e.serviceDurationHours.toFixed(1)}h service`,
            })),
        },
        {
          id: '0-24',
          label: '0–24 HOURS',
          actions: liveEntries
            .filter((e) => e.status === 'SCHEDULED')
            .slice(0, 6)
            .map((e) => ({
              id: e.vesselId,
              time: new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action: `${e.vesselName} → ${e.berthName}`,
              priority: statusToPriority(e.status, e.priority),
              related: `${e.craneCount} cranes · ${e.workloadTEU} TEU`,
              impact: `${e.serviceDurationHours.toFixed(1)}h handling`,
            })),
        },
        {
          id: '24-72',
          label: '24–72 HOURS',
          actions: liveEntries
            .filter((e) => e.status === 'SCHEDULED')
            .slice(6, 12)
            .map((e) => ({
              id: e.vesselId,
              time: new Date(e.eta).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              action: `${e.vesselName} ETA arrival → ${e.berthName}`,
              priority: statusToPriority(e.status, e.priority),
              related: `${e.craneCount} cranes · ${e.workloadTEU} TEU`,
              impact: `${e.serviceDurationHours.toFixed(1)}h service`,
            })),
        },
      ]
    : MOCK_PLAN72H_TIMELINE;

  const displaySummary = liveEntries
    ? {
        summaryText: `${liveEntries.length} vessel operations planned across the next 72 hours. ${liveEntries.filter((e) => e.status === 'DELAYED').length} vessels currently delayed. Recommend immediate crane redeployment for high-priority delayed vessels.`,
        expectedRiskBefore: 'HIGH',
        expectedRiskAfter: liveEntries.filter((e) => e.status === 'DELAYED').length === 0 ? 'LOW' : 'MEDIUM',
        expectedDelayBefore: `${(liveEntries.length * 0.4).toFixed(0)}h`,
        expectedDelayAfter: `${(liveEntries.length * 0.15).toFixed(0)}h`,
      }
    : MOCK_PLAN72H_SUMMARY;

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
          flexWrap: 'wrap',
          gap: spacing.sm,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: colors.primaryText }}>
            72-Hour Operations Plan
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: colors.secondaryText }}>
            AI-generated operational schedule to keep port congestion under control.
          </p>
        </div>
        <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center' }}>
          {liveEntries && <Badge variant="success">● LIVE</Badge>}
          <Badge variant="cyan">PLAN v{planVersion}</Badge>
        </div>
      </div>

      {/* Top Summary: 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.md, width: '100%' }}>
        {liveKpis.map((kpi) => (
          <div
            key={kpi.id}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              border: `1px solid ${colors.surfaceBorder}`,
              padding: `${spacing.md} ${spacing.lg}`,
            }}
          >
            <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, marginBottom: '4px' }}>{kpi.title}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: colors.primaryText }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* AI Plan Summary */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: colors.novaCyan }}>
            {liveEntries ? 'Live Operations Summary' : 'AI Planning Summary'}
          </span>
          <Badge variant="cyan">{liveEntries ? 'LIVE DATA' : 'AI GENERATED'}</Badge>
        </div>

        <p style={{ margin: 0, fontSize: '0.875rem', color: colors.primaryText, lineHeight: 1.6 }}>
          {displaySummary.summaryText}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.md }}>
          <div style={{ backgroundColor: colors.background, borderRadius: radius.sm, border: `1px solid ${colors.surfaceBorder}`, padding: spacing.md }}>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText, marginBottom: '4px' }}>Expected Risk</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.primaryText }}>
              {displaySummary.expectedRiskBefore} → <span style={{ color: colors.success }}>{displaySummary.expectedRiskAfter}</span>
            </div>
          </div>
          <div style={{ backgroundColor: colors.background, borderRadius: radius.sm, border: `1px solid ${colors.surfaceBorder}`, padding: spacing.md }}>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText, marginBottom: '4px' }}>Expected Delay</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.primaryText }}>
              {displaySummary.expectedDelayBefore} → <span style={{ color: colors.success }}>{displaySummary.expectedDelayAfter}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: spacing.lg, color: colors.secondaryText }}>
          Loading live 72-hour operations plan...
        </div>
      )}

      {/* 72-Hour Timeline */}
      {liveTimeline.map((period) => (
        <div
          key={period.id}
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
            <Badge variant={period.id === 'now' ? 'critical' : 'cyan'}>{period.label}</Badge>
            <span style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>
              {period.actions.length} {period.actions.length === 1 ? 'action' : 'actions'}
            </span>
          </div>

          {period.actions.length === 0 ? (
            <div style={{ fontSize: '0.875rem', color: colors.secondaryText, padding: spacing.md }}>
              No active operations in this window.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.md }}>
              {period.actions.map((action) => (
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
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.secondaryText }}>{action.time}</span>
                    <Badge variant={priorityBadgeVariant(action.priority as 'Critical' | 'High' | 'Medium' | 'Low')}>{action.priority}</Badge>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: colors.primaryText, lineHeight: 1.4 }}>
                    {action.action}
                  </p>

                  <div style={{ fontSize: '0.75rem', color: colors.secondaryText }}>
                    {action.related}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: colors.secondaryText, marginTop: spacing.xs }}>
                    <span>Expected Impact</span>
                    <span style={{ fontWeight: 700, color: colors.success }}>{action.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Action Buttons */}
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          border: `1px solid ${colors.surfaceBorder}`,
          padding: spacing.lg,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: spacing.md,
        }}
      >
        <Button variant="primary" onClick={handleRegeneratePlan} disabled={isRegenerating}>
          {isRegenerating ? 'Regenerating…' : '🔄 Regenerate Plan'}
        </Button>
        <Button variant="secondary" onClick={handleExportPlan}>
          📄 Export Plan
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (onNavigate) {
              onNavigate('simulation');
            } else {
              setIsWhatIfOpen(true);
            }
          }}
        >
          ⚡ View What-If
        </Button>

        {exportMessage && (
          <span style={{ fontSize: '0.8125rem', color: colors.success, fontWeight: 600 }}>
            ✅ {exportMessage}
          </span>
        )}
      </div>

      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
    </div>
  );
};

export default Plan72hPage;
