import React, { useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_ALERTS, OperationalAlert } from '@/features/alerts/mockAlerts';

export interface AlertsPanelProps {
  initialAlerts?: OperationalAlert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  initialAlerts = MOCK_ALERTS,
}) => {
  const [alerts, setAlerts] = useState<OperationalAlert[]>(initialAlerts);

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <Card
      title="Operational Alerts"
      subtitle="Real-time system notifications & risk triggers"
      headerAction={
        alerts.length > 0 ? (
          <button
            onClick={() => setAlerts([])}
            style={{
              background: 'none',
              border: 'none',
              color: colors.secondaryText,
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear All
          </button>
        ) : undefined
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {alerts.length === 0 ? (
          <div style={{ padding: spacing.md, textAlign: 'center', color: colors.mutedText, fontSize: '0.875rem' }}>
            No active operational alerts.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                backgroundColor: colors.background,
                borderRadius: radius.md,
                border: `1px solid ${colors.surfaceBorder}`,
                padding: `${spacing.sm} ${spacing.md}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: spacing.sm,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Badge variant={alert.variant}>{alert.type}</Badge>
                <span style={{ fontSize: '0.8125rem', color: colors.primaryText, fontWeight: 500 }}>
                  {alert.message}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <span style={{ fontSize: '0.7rem', color: colors.mutedText }}>{alert.timestamp}</span>
                <button
                  onClick={() => handleDismiss(alert.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: colors.secondaryText,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '0 4px',
                  }}
                  title="Dismiss Alert"
                >
                  &times;
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
