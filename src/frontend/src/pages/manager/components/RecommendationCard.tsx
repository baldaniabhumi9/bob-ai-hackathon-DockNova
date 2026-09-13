import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Button } from '@/components/ui/Button';

export interface RecommendationCardProps {
  onRunWhatIf: () => void;
  onViewVessel: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  onRunWhatIf,
  onViewVessel,
}) => {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.novaCyan, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            RECOMMENDED ACTION
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.125rem', fontWeight: 700, color: colors.primaryText }}>
            Reassign MV Ocean Star from B4 to B5.
          </h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md, backgroundColor: colors.background, padding: spacing.md, borderRadius: radius.sm, border: `1px solid ${colors.surfaceBorder}` }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Expected Risk Reduction:</span>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.success, marginTop: '2px' }}>
            68% → 42%
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Expected Delay Reduction:</span>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.success, marginTop: '2px' }}>
            4.6h → 1.2h
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'flex-start' }}>
        <Button variant="primary" size="md" onClick={onRunWhatIf}>
          Run What-If
        </Button>
        <Button variant="secondary" size="md" onClick={onViewVessel}>
          View Vessel
        </Button>
      </div>
    </div>
  );
};
