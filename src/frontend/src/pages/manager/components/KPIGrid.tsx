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

export const KPIGrid: React.FC<KPIGridProps & { liveValues?: Partial<Record<KPIData['id'], { value: string; status: string; variant: KPIData['variant'] }>> }> = ({ onKPIClick, liveValues }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.md, width: '100%' }}>
      {THREE_KPIS.map((kpi) => {
        const live = liveValues?.[kpi.id];
        const isSimulated = !live;
        const displayKpi = live ? { ...kpi, ...live } : kpi;
        return (
        <div
          key={displayKpi.id}
          onClick={() => onKPIClick && onKPIClick(displayKpi)}
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
            <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, fontWeight: 500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{displayKpi.title}</span>
              {isSimulated && (
                <span style={{ fontSize: '0.6875rem', color: colors.warning, backgroundColor: colors.warningGlow, padding: '1px 6px', borderRadius: radius.sm, border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 600 }}>
                  Simulated
                </span>
              )}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.primaryText, letterSpacing: '-0.02em' }}>
              {displayKpi.value}
            </div>
          </div>

          <Badge variant={displayKpi.variant}>{displayKpi.status}</Badge>
        </div>
        );
      })}
    </div>
  );
};
