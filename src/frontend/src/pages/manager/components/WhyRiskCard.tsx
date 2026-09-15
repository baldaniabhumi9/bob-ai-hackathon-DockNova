import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { MOCK_B4_FACTORS } from '@/features/congestion/mockForecastData';

export const WhyRiskCard: React.FC = () => {
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
          Why is B4 at risk?
        </h3>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Badge variant="warning">Simulated</Badge>
          <Badge variant="cyan">AI Confidence 91%</Badge>
        </div>
      </div>

      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8125rem', color: colors.secondaryText, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {MOCK_B4_FACTORS.map((factor, idx) => (
          <li key={idx} style={{ color: colors.primaryText }}>
            {factor}
          </li>
        ))}
      </ul>
    </div>
  );
};
