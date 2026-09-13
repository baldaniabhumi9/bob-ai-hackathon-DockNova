import React from 'react';
import { colors, radius, spacing } from '@/design-system';

export const CongestionHeader: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        border: `1px solid ${colors.surfaceBorder}`,
        padding: `${spacing.md} ${spacing.lg}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: colors.primaryText }}>
          Congestion Prediction
        </h1>
        <p style={{ margin: '2px 0 0 0', fontSize: '0.875rem', color: colors.secondaryText }}>
          AI-powered forecast for the next 72 hours
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, fontSize: '0.8125rem', color: colors.secondaryText }}>
        <div>
          Port: <strong style={{ color: colors.primaryText }}>Singapore</strong>
        </div>
        <span style={{ color: colors.surfaceBorder }}>|</span>
        <div>
          Last updated: <strong style={{ color: colors.primaryText }}>Just now</strong>
        </div>
      </div>
    </div>
  );
};
