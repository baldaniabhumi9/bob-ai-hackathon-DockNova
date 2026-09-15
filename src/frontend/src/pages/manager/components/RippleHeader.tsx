import React from 'react';
import { colors, radius, spacing } from '@/design-system';

export const RippleHeader: React.FC = () => {
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
      <strong style={{ fontSize: '0.875rem', color: colors.primaryText }}>
        Port Operations
      </strong>

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
