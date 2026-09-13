import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';

export interface KPIData {
  id: string;
  title: string;
  value: string;
  status: string;
  variant: 'warning' | 'critical' | 'cyan' | 'success';
}

const THREE_KPIS: KPIData[] = [
  {
    id: 'congestion_risk',
    title: 'Congestion Risk',
    value: '68%',
    status: 'Elevated',
    variant: 'warning',
  },
  {
    id: 'berth_utilisation',
    title: 'Berth Utilisation',
    value: '82%',
    status: 'High',
    variant: 'warning',
  },
  {
    id: 'vessels_in_port',
    title: 'Vessels in Port',
    value: '24',
    status: 'Active',
    variant: 'cyan',
  },
];

export interface KPIGridProps {
  onKPIClick?: (kpi: KPIData) => void;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ onKPIClick }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md, width: '100%' }}>
      {THREE_KPIS.map((kpi) => (
        <div
          key={kpi.id}
          onClick={() => onKPIClick && onKPIClick(kpi)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            border: `1px solid ${colors.surfaceBorder}`,
            padding: `${spacing.md} ${spacing.lg}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.novaCyan)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.surfaceBorder)}
        >
          <div>
            <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, fontWeight: 500, marginBottom: '4px' }}>
              {kpi.title}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.primaryText, letterSpacing: '-0.02em' }}>
              {kpi.value}
            </div>
          </div>

          <Badge variant={kpi.variant}>{kpi.status}</Badge>
        </div>
      ))}
    </div>
  );
};
