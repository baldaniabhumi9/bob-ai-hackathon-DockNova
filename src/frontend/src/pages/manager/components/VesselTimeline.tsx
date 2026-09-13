import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { VesselTimelineItem } from '@/features/vessels/mockVessels';

const THREE_UPCOMING_VESSELS: VesselTimelineItem[] = [
  {
    id: 'v1',
    name: 'MV Ocean Star',
    imo: 'IMO 9845123',
    eta: '04:30',
    assignedBerth: 'B4',
    status: 'Delayed',
    statusVariant: 'critical',
    delayText: 'Delayed +4h',
    teuCapacity: 14500,
    cargoType: 'Container',
  },
  {
    id: 'v2',
    name: 'MV Horizon',
    imo: 'IMO 9732104',
    eta: '07:10',
    assignedBerth: 'B2',
    status: 'On Time',
    statusVariant: 'success',
    delayText: 'On Time',
    teuCapacity: 11200,
    cargoType: 'Container',
  },
  {
    id: 'v3',
    name: 'MV Pacific Dawn',
    imo: 'IMO 9621980',
    eta: '09:40',
    assignedBerth: 'B5',
    status: 'On Time',
    statusVariant: 'success',
    delayText: 'On Time',
    teuCapacity: 8400,
    cargoType: 'Container',
  },
];

export interface VesselTimelineProps {
  onSelectVessel: (vessel: VesselTimelineItem) => void;
}

export const VesselTimeline: React.FC<VesselTimelineProps> = ({ onSelectVessel }) => {
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
      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: colors.primaryText }}>
        Upcoming Vessels
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
        {THREE_UPCOMING_VESSELS.map((vessel) => (
          <div
            key={vessel.id}
            onClick={() => onSelectVessel(vessel)}
            style={{
              backgroundColor: colors.background,
              borderRadius: radius.md,
              border: `1px solid ${colors.surfaceBorder}`,
              padding: `${spacing.sm} ${spacing.md}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.novaCyan)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.surfaceBorder)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: colors.primaryText }}>
                {vessel.name}
              </span>
              <span style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>
                — {vessel.delayText}
              </span>
            </div>

            <Badge variant="cyan">{vessel.assignedBerth}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
