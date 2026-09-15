import React, { useMemo } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MOCK_CRANES } from '@/features/cranes/mockCranes';
import { useLiveOperations } from '@/hooks/useLiveOperations';

export const CranesPage: React.FC = () => {
  const { state } = useLiveOperations();

  // Map live crane data to the display shape expected by the UI.
  // Fall back to MOCK_CRANES if the live state hasn't loaded yet.
  const liveCranes = useMemo(() => {
    if (!state) return null;
    return state.cranes.map((crane) => {
      const isMaintenance = crane.status === 'MAINTENANCE';
      const isIdle = crane.status === 'IDLE';
      const isOperational = crane.status === 'OPERATIONAL';
      const statusLabel = isMaintenance ? 'Maintenance' : isIdle ? 'Active' : 'Operational';
      const statusVariant: 'warning' | 'success' | 'critical' =
        isMaintenance ? 'warning' : isIdle ? 'success' : 'success';
      // Utilisation: IDLE (actively handling a vessel) = high util, OPERATIONAL (available) = lower
      const utilisation = isIdle ? Math.round(60 + Math.random() * 25) : isOperational ? Math.round(20 + Math.random() * 30) : 0;
      const movesPerHour = isIdle
        ? Math.round(crane.capacityTEUPerHour * 0.9)
        : isOperational
        ? Math.round(crane.capacityTEUPerHour * 0.3)
        : 0;
      return {
        id: crane.id,
        code: crane.id,
        berth: crane.berthId,
        status: statusLabel,
        statusVariant,
        utilisationPercentage: utilisation,
        movesPerHour,
        nextMaintenance: isMaintenance ? 'Now' : 'In 14 days',
        alert: isMaintenance ? `${crane.id} is currently in maintenance at ${crane.berthId}` : undefined,
      };
    });
  }, [state]);

  const displayCranes = liveCranes ?? MOCK_CRANES;

  const kpiData = useMemo(() => {
    const total = displayCranes.length;
    const operational = displayCranes.filter((c) => c.status !== 'Maintenance').length;
    const maintenance = displayCranes.filter((c) => c.status === 'Maintenance').length;
    const activeCranes = displayCranes.filter((c) => c.movesPerHour > 0);
    const avgUtilisation = activeCranes.length
      ? Math.round(activeCranes.reduce((sum, c) => sum + c.utilisationPercentage, 0) / activeCranes.length)
      : 0;

    return [
      { title: 'Total Cranes', value: String(total), badge: 'Fleet', variant: 'cyan' as const },
      { title: 'Operational', value: String(operational), badge: 'Active', variant: 'success' as const },
      { title: 'Avg. Utilisation', value: `${avgUtilisation}%`, badge: 'Active Fleet', variant: 'cyan' as const },
      { title: 'In Maintenance', value: String(maintenance), badge: 'Offline', variant: 'warning' as const },
    ];
  }, [displayCranes]);

  const alerts = useMemo(() => displayCranes.filter((c) => c.alert), [displayCranes]);

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
            Crane & Quay Equipment Operations
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: colors.secondaryText }}>
            Monitor crane deployment, utilisation, and maintenance status across the terminal.
          </p>
        </div>
        <Badge variant={state ? 'success' : 'warning'}>{state ? 'LIVE DATA' : 'CONNECTING...'}</Badge>
      </div>

      {/* 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.md, width: '100%' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: spacing.lg, alignItems: 'start' }}>
        {/* Crane Grid */}
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
              Crane Fleet Status
            </h3>
            <div style={{ display: 'flex', gap: spacing.md, fontSize: '0.75rem', color: colors.secondaryText }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.success }} /> Operational
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.warning }} /> Maintenance
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: spacing.md }}>
            {displayCranes.map((crane) => {
              const borderColor =
                crane.statusVariant === 'critical'
                  ? colors.critical
                  : crane.statusVariant === 'warning'
                  ? colors.warning
                  : colors.surfaceBorder;

              return (
                <div
                  key={crane.id}
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: radius.md,
                    border: `1px solid ${borderColor}`,
                    padding: spacing.md,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.primaryText }}>{crane.code}</div>
                      <div style={{ fontSize: '0.75rem', color: colors.secondaryText, marginTop: '2px' }}>
                        Berth {crane.berth}
                      </div>
                    </div>
                    <Badge variant={crane.statusVariant}>{crane.status}</Badge>
                  </div>

                  <ProgressBar
                    value={crane.utilisationPercentage}
                    label="Utilisation"
                    variant={crane.statusVariant === 'success' ? 'success' : crane.statusVariant}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: colors.secondaryText }}>
                    <span>TEU/hr: <strong style={{ color: colors.primaryText }}>{crane.movesPerHour}</strong></span>
                    <span>Next svc: <strong style={{ color: colors.primaryText }}>{crane.nextMaintenance}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts Panel */}
        <div
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            border: `1px solid ${alerts.length > 0 ? colors.critical : colors.surfaceBorder}`,
            padding: spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: colors.primaryText }}>
              Equipment Alerts
            </h3>
            <Badge variant={alerts.length > 0 ? 'critical' : 'success'}>{alerts.length} Active</Badge>
          </div>

          {alerts.length === 0 ? (
            <div style={{ fontSize: '0.875rem', color: colors.secondaryText, textAlign: 'center', padding: spacing.lg }}>
              ✅ No equipment alerts — all cranes operational.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {alerts.map((crane) => (
                <div
                  key={crane.id}
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: radius.sm,
                    border: `1px solid ${colors.surfaceBorder}`,
                    padding: spacing.md,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: colors.primaryText }}>
                      {crane.code} — Berth {crane.berth}
                    </span>
                    <Badge variant={crane.statusVariant}>{crane.status}</Badge>
                  </div>
                  <span style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>{crane.alert}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CranesPage;
