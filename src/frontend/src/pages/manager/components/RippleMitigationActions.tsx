import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Button } from '@/components/ui/Button';
import { MOCK_RIPPLE_ACTIONS } from '@/features/congestion/mockRippleData';

export interface RippleMitigationActionsProps {
  onSimulate: (actionId: string) => void;
}

export const RippleMitigationActions: React.FC<RippleMitigationActionsProps> = ({ onSimulate }) => {
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
      <div>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: colors.primaryText }}>
          How can we stop the ripple?
        </h3>
        <p style={{ margin: '2px 0 0 0', fontSize: '0.8125rem', color: colors.secondaryText }}>
          AI-suggested actions to intercept the ripple before it reaches port-wide congestion.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.md }}>
        {MOCK_RIPPLE_ACTIONS.map((action) => (
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
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.primaryText }}>
                {action.title}
              </div>
              <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, marginTop: '2px' }}>
                {action.detail}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: colors.secondaryText }}>
                <span>Congestion risk</span>
                <span style={{ fontWeight: 700, color: colors.success }}>
                  {action.expectedRiskFrom}% &rarr; {action.expectedRiskTo}%
                </span>
              </div>
              {action.expectedDelayFrom && action.expectedDelayTo && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: colors.secondaryText }}>
                  <span>Estimated delay</span>
                  <span style={{ fontWeight: 700, color: colors.success }}>
                    {action.expectedDelayFrom} &rarr; {action.expectedDelayTo}
                  </span>
                </div>
              )}
            </div>

            <Button variant="primary" size="sm" onClick={() => onSimulate(action.id)} style={{ marginTop: spacing.xs }}>
              Simulate
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
