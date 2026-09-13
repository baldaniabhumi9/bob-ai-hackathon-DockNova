import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface AIAlertCardProps {
  onViewPrediction: () => void;
  onRunWhatIf: () => void;
}

export const AIAlertCard: React.FC<AIAlertCardProps> = ({
  onViewPrediction,
  onRunWhatIf,
}) => {
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
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: colors.primaryText }}>
            Congestion Risk Detected
          </h3>
          <Badge variant="cyan">Confidence 91%</Badge>
        </div>

        <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 500, color: colors.critical }}>
          B4 may reach critical congestion in 18 hours.
        </p>

        <ul style={{ margin: `${spacing.xs} 0 0 0`, paddingLeft: '20px', fontSize: '0.8125rem', color: colors.secondaryText, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>3 vessel arrivals overlap</li>
          <li>Utilisation may reach 94%</li>
          <li>Crane availability may fall to 67%</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.sm }}>
        <Button variant="primary" size="md" onClick={onViewPrediction} style={{ flex: 1 }}>
          View Details
        </Button>
        <Button variant="secondary" size="md" onClick={onRunWhatIf} style={{ flex: 1 }}>
          Run What-If
        </Button>
      </div>
    </div>
  );
};
