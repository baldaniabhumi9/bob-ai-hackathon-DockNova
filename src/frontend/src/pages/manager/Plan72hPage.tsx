import React, { useState } from 'react';
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

export interface Plan72hPageProps {
  onNavigate?: (id: string) => void;
}

export const Plan72hPage: React.FC<Plan72hPageProps> = ({ onNavigate }) => {
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [planVersion, setPlanVersion] = useState(1);

  const handleRegeneratePlan = () => {
    setIsRegenerating(true);
    setExportMessage(null);
    // Mock loading state; regenerates the same mock plan.
    window.setTimeout(() => {
      setIsRegenerating(false);
      setPlanVersion((v) => v + 1);
    }, 1200);
  };

  const handleExportPlan = () => {
    setExportMessage('Plan ready for export.');
    window.setTimeout(() => setExportMessage(null), 3000);
  };

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
        <Badge variant="cyan">PLAN v{planVersion}</Badge>
      </div>

      {/* Top Summary: 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md, width: '100%' }}>
        {MOCK_PLAN72H_KPIS.map((kpi) => (
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
          <span style={{ fontSize: '1rem', fontWeight: 700, color: colors.novaCyan }}>AI Planning Summary</span>
          <Badge variant="cyan">AI GENERATED</Badge>
        </div>

        <p style={{ margin: 0, fontSize: '0.875rem', color: colors.primaryText, lineHeight: 1.6 }}>
          {MOCK_PLAN72H_SUMMARY.summaryText}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.md }}>
          <div style={{ backgroundColor: colors.background, borderRadius: radius.sm, border: `1px solid ${colors.surfaceBorder}`, padding: spacing.md }}>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText, marginBottom: '4px' }}>Expected Risk</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.primaryText }}>
              {MOCK_PLAN72H_SUMMARY.expectedRiskBefore} → <span style={{ color: colors.success }}>{MOCK_PLAN72H_SUMMARY.expectedRiskAfter}</span>
            </div>
          </div>
          <div style={{ backgroundColor: colors.background, borderRadius: radius.sm, border: `1px solid ${colors.surfaceBorder}`, padding: spacing.md }}>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText, marginBottom: '4px' }}>Expected Delay</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.primaryText }}>
              {MOCK_PLAN72H_SUMMARY.expectedDelayBefore} → <span style={{ color: colors.success }}>{MOCK_PLAN72H_SUMMARY.expectedDelayAfter}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 72-Hour Timeline */}
      {MOCK_PLAN72H_TIMELINE.map((period) => (
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
                  <Badge variant={priorityBadgeVariant(action.priority)}>{action.priority}</Badge>
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

      {/* Reused What-If Simulator (fallback when nav callback not provided) */}
      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
    </div>
  );
};

export default Plan72hPage;
