import React, { useMemo, useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MOCK_BERTHS, BerthData } from '@/features/berths/mockBerths';
import { BerthDetailModal } from './components/BerthDetailModal';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';

export const BerthsPage: React.FC = () => {
  const [selectedBerth, setSelectedBerth] = useState<BerthData | null>(null);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);

  // Summary KPI metrics derived from the berth mock data
  const kpiData = useMemo(() => {
    const total = MOCK_BERTHS.length;
    const critical = MOCK_BERTHS.filter((b) => b.status === 'Critical').length;
    const warning = MOCK_BERTHS.filter((b) => b.status === 'Warning').length;
    const avgUtilisation = Math.round(
      MOCK_BERTHS.reduce((sum, b) => sum + b.utilisationPercentage, 0) / total
    );
    const activeCranes = MOCK_BERTHS.reduce((sum, b) => sum + b.cranesActive, 0);

    return [
      { title: 'Total Berths', value: String(total), badge: 'Monitored', variant: 'cyan' as const },
      { title: 'Avg. Utilisation', value: `${avgUtilisation}%`, badge: 'Port-wide', variant: 'cyan' as const },
      { title: 'At Warning/Critical', value: String(warning + critical), badge: 'Needs Attention', variant: 'warning' as const },
      { title: 'Active Cranes', value: String(activeCranes), badge: 'Deployed', variant: 'success' as const },
    ];
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          border: `1px solid ${colors.surfaceBorder}`,
          padding: spacing.md,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: colors.primaryText }}>
            Berth Allocation & Utilisation
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: colors.secondaryText }}>
            Monitor real-time berth occupancy, crane deployment, and AI congestion predictions across the terminal.
          </p>
        </div>
        <Badge variant="cyan">SYSTEM LIVE</Badge>
      </div>

      {/* 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md, width: '100%' }}>
        {kpiData.map((kpi, idx) => (
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
                {kpi.title}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.primaryText, letterSpacing: '-0.02em' }}>
                {kpi.value}
              </div>
            </div>
            <Badge variant={kpi.variant}>{kpi.badge}</Badge>
          </div>
        ))}
      </div>

      {/* Berth Grid */}
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
            Berth Status Overview
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing.md }}>
          {MOCK_BERTHS.map((berth) => {
            const borderColor =
              berth.statusVariant === 'critical'
                ? colors.critical
                : berth.statusVariant === 'warning'
                ? colors.warning
                : colors.surfaceBorder;

            return (
              <div
                key={berth.id}
                onClick={() => setSelectedBerth(berth)}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: radius.md,
                  border: `1px solid ${borderColor}`,
                  padding: spacing.md,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.sm,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.novaCyan)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = borderColor)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.primaryText }}>{berth.code}</div>
                    <div style={{ fontSize: '0.75rem', color: colors.secondaryText, marginTop: '2px' }}>{berth.name}</div>
                  </div>
                  <Badge variant={berth.statusVariant}>{berth.status}</Badge>
                </div>

                <ProgressBar
                  value={berth.utilisationPercentage}
                  label="Utilisation"
                  variant={berth.statusVariant === 'success' ? 'success' : berth.statusVariant}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: colors.secondaryText }}>
                  <span>Vessel: <strong style={{ color: colors.primaryText }}>{berth.assignedVessel || 'None'}</strong></span>
                  <span>Cranes: <strong style={{ color: colors.primaryText }}>{berth.cranesActive}</strong></span>
                </div>

                {berth.predictionText && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: berth.isHotspot ? colors.critical : colors.warning,
                      backgroundColor: berth.isHotspot ? 'rgba(239, 68, 68, 0.1)' : colors.warningGlow,
                      border: `1px solid ${berth.isHotspot ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                      borderRadius: radius.sm,
                      padding: `${spacing.xs} ${spacing.sm}`,
                    }}
                  >
                    {berth.isHotspot ? '⚠️ ' : 'ℹ️ '}
                    {berth.predictionText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <BerthDetailModal
        berth={selectedBerth}
        isOpen={Boolean(selectedBerth)}
        onClose={() => setSelectedBerth(null)}
        onRunSimulation={() => setIsWhatIfOpen(true)}
      />

      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
    </div>
  );
};

export default BerthsPage;
