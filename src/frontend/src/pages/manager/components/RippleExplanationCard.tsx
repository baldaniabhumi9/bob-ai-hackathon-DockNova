import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { MOCK_RIPPLE_EXPLANATION } from '@/features/congestion/mockRippleData';

interface RippleExplanationCardProps {
  congestionPct?: number;
  waitingVessels?: number;
}

export const RippleExplanationCard: React.FC<RippleExplanationCardProps> = ({ congestionPct, waitingVessels }) => {
  const summary = congestionPct !== undefined
    ? `Current port congestion risk is ${congestionPct}%${waitingVessels !== undefined ? ` with ${waitingVessels} vessel${waitingVessels !== 1 ? 's' : ''} waiting for berth assignment` : ''}. High berth utilisation reduces crane availability and increases yard and gate pressure, propagating delays across all operations.`
    : MOCK_RIPPLE_EXPLANATION.summary;

  return (
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
          {MOCK_RIPPLE_EXPLANATION.heading}
        </h3>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Badge variant="warning">Simulated</Badge>
          <Badge variant="cyan">AI Confidence 91%</Badge>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '0.875rem', color: colors.primaryText, lineHeight: 1.6 }}>
        {summary}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.secondaryText, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Contributing Factors
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
          {MOCK_RIPPLE_EXPLANATION.factors.map((factor, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                backgroundColor: colors.background,
                border: `1px solid ${colors.surfaceBorder}`,
                borderRadius: radius.sm,
                padding: `${spacing.sm} ${spacing.md}`,
                fontSize: '0.8125rem',
                color: colors.primaryText,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: colors.novaCyanGlow,
                  color: colors.novaCyan,
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                }}
              >
                {idx + 1}
              </span>
              {factor}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
