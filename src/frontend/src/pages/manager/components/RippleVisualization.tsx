import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { MOCK_RIPPLE_NODES, RippleNodeData, RippleStatus } from '@/features/congestion/mockRippleData';

interface RippleVisualizationProps {
  nodes?: RippleNodeData[];
}

const getStatusVariant = (status: RippleStatus): 'critical' | 'warning' | 'success' => status;

const getStatusColor = (status: RippleStatus): string => {
  switch (status) {
    case 'critical':
      return colors.critical;
    case 'warning':
      return colors.warning;
    case 'success':
    default:
      return colors.success;
  }
};

export const RippleVisualization: React.FC<RippleVisualizationProps> = ({ nodes: nodesProp }) => {
  const MOCK_RIPPLE_NODES_LOCAL = nodesProp ?? MOCK_RIPPLE_NODES;
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
          Cause &rarr; Effect Chain
        </h3>
        <p style={{ margin: '2px 0 0 0', fontSize: '0.8125rem', color: colors.secondaryText }}>
          How one delayed vessel ripples through berth, crane, yard, and gate operations.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: spacing.sm,
          overflowX: 'auto',
          paddingBottom: spacing.xs,
        }}
      >
        {MOCK_RIPPLE_NODES_LOCAL.map((node, idx) => (
          <React.Fragment key={node.id}>
            <div
              style={{
                minWidth: '190px',
                flex: '1 0 190px',
                backgroundColor: colors.background,
                borderRadius: radius.md,
                border: `1px solid ${getStatusColor(node.status)}`,
                boxShadow: `0 0 12px ${getStatusColor(node.status)}33`,
                padding: spacing.md,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.sm,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{node.icon}</span>
                <Badge variant={getStatusVariant(node.status)}>{node.statusLabel}</Badge>
              </div>

              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: colors.primaryText }}>
                  {node.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: colors.secondaryText, marginTop: '2px' }}>
                  {node.metricLabel}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: getStatusColor(node.status), marginTop: '2px' }}>
                  {node.metricValue}
                </div>
              </div>
            </div>

            {idx < MOCK_RIPPLE_NODES_LOCAL.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.novaCyan,
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  flex: '0 0 auto',
                }}
                aria-hidden="true"
              >
                &rarr;
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
