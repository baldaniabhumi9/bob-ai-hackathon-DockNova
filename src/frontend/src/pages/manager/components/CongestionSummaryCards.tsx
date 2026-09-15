import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { MOCK_CONGESTION_SUMMARY } from '@/features/congestion/mockForecastData';
import { CongestionForecast } from '@/services';

export const CongestionSummaryCards: React.FC<{ congestion?: CongestionForecast | null }> = ({ congestion }) => {
  const cards = [
    {
      title: 'Congestion Risk',
      value: congestion ? `${Math.round(congestion.congestionProbability * 100)}%` : MOCK_CONGESTION_SUMMARY.currentRisk,
      status: congestion?.riskLevel ?? MOCK_CONGESTION_SUMMARY.currentRiskStatus,
      variant: 'warning' as const,
    },
    {
      title: 'Predicted Peak',
      value: MOCK_CONGESTION_SUMMARY.predictedPeak,
      status: MOCK_CONGESTION_SUMMARY.predictedPeakTime,
      variant: 'critical' as const,
    },
    {
      title: 'Most At-Risk Berth',
      value: congestion?.hotspot?.berthId ?? MOCK_CONGESTION_SUMMARY.atRiskBerth,
      status: congestion?.hotspot ? `${Math.round(congestion.hotspot.predictedUtilizationPct)}% utilised` : MOCK_CONGESTION_SUMMARY.atRiskStatus,
      variant: 'critical' as const,
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.md, width: '100%' }}>
      {cards.map((c, idx) => (
        <div
          key={idx}
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
            <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, fontWeight: 500, marginBottom: '4px' }}>
              {c.title}
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: colors.primaryText, letterSpacing: '-0.02em' }}>
              {c.value}
            </div>
          </div>

          <Badge variant={c.variant}>{c.status}</Badge>
        </div>
      ))}
    </div>
  );
};
