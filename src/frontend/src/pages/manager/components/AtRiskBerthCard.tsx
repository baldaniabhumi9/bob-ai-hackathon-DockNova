import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

export const AtRiskBerthCard: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        border: `1px solid ${colors.critical}`,
        padding: spacing.lg,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: colors.primaryText }}>
          B4 — Critical Risk
        </h3>
        <Badge variant="critical">Hotspot</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <ProgressBar value={92} label="Current Utilisation" variant="critical" />

        <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, marginTop: spacing.xs, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div>
            Expected to reach <strong style={{ color: colors.critical }}>94% utilisation</strong>
          </div>
          <div>
            Peak congestion in <strong style={{ color: colors.warning }}>approximately 18 hours</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
