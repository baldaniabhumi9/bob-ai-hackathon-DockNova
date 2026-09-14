import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { MOCK_RIPPLE_SCENARIO, RippleScenarioData } from '@/features/congestion/mockRippleData';

interface RippleScenarioCardProps {
  scenario?: RippleScenarioData;
}

export const RippleScenarioCard: React.FC<RippleScenarioCardProps> = ({ scenario: scenarioProp }) => {
  const scenario = scenarioProp ?? MOCK_RIPPLE_SCENARIO;

  return (
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md }}>
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: colors.novaCyan,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            SCENARIO
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.125rem', fontWeight: 700, color: colors.primaryText }}>
            {scenario.description}
          </h3>
        </div>
        <Badge variant="critical">PORT IMPACT: {scenario.predictedPortImpact.toUpperCase()}</Badge>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: spacing.md,
          backgroundColor: colors.background,
          padding: spacing.md,
          borderRadius: radius.sm,
          border: `1px solid ${colors.surfaceBorder}`,
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Initial Congestion Risk</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.warning, marginTop: '2px' }}>
            {scenario.initialCongestionRisk}%
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Predicted Port Impact</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.critical, marginTop: '2px' }}>
            {scenario.predictedPortImpact}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Estimated Additional Delay</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: colors.critical, marginTop: '2px' }}>
            {scenario.estimatedAdditionalDelay}
          </div>
        </div>
      </div>
    </div>
  );
};
