import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { BerthData, MOCK_BERTHS } from '@/features/berths/mockBerths';

export interface PortMapProps {
  onSelectBerth: (berth: BerthData) => void;
}

export const PortMap: React.FC<PortMapProps> = ({ onSelectBerth }) => {
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
          Port Map
        </h3>
        <div style={{ display: 'flex', gap: spacing.md, fontSize: '0.75rem', color: colors.secondaryText }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.success }} /> Normal
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.warning }} /> Warning
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.critical }} /> Critical
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md }}>
        {MOCK_BERTHS.map((berth) => {
          const isCritical = berth.code === 'B4';
          const isWarning = berth.code === 'B3';

          const statusVariant = isCritical ? 'critical' : isWarning ? 'warning' : 'success';
          const statusText = isCritical ? 'Critical' : isWarning ? 'Warning' : 'Normal';

          return (
            <div
              key={berth.id}
              onClick={() => onSelectBerth(berth)}
              style={{
                backgroundColor: colors.background,
                borderRadius: radius.md,
                border: `1px solid ${isCritical ? colors.critical : colors.surfaceBorder}`,
                padding: spacing.md,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.xs,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = isCritical ? colors.critical : colors.novaCyan)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = isCritical ? colors.critical : colors.surfaceBorder)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: colors.primaryText }}>
                  {berth.code}
                </span>
                <Badge variant={statusVariant}>{statusText}</Badge>
              </div>

              <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, marginTop: '4px' }}>
                {berth.utilisationPercentage}% utilisation
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
