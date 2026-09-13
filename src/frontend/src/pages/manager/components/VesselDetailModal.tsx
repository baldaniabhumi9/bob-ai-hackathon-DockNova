import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VesselTimelineItem } from '@/features/vessels/mockVessels';

export interface VesselDetailModalProps {
  vessel: VesselTimelineItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VesselDetailModal: React.FC<VesselDetailModalProps> = ({
  vessel,
  isOpen,
  onClose,
}) => {
  if (!vessel) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Vessel Details: ${vessel.name}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: colors.secondaryText }}>{vessel.imo}</span>
          <Badge variant={vessel.statusVariant}>{vessel.status}</Badge>
        </div>

        <div style={{ backgroundColor: colors.background, padding: spacing.md, borderRadius: radius.md, border: `1px solid ${colors.surfaceBorder}`, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: colors.secondaryText }}>Scheduled ETA:</span>
            <strong style={{ color: colors.primaryText }}>{vessel.eta}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: colors.secondaryText }}>Assigned Berth:</span>
            <strong style={{ color: colors.novaCyan }}>{vessel.assignedBerth}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: colors.secondaryText }}>Schedule Variance:</span>
            <strong style={{ color: vessel.delayText !== '0h' ? colors.critical : colors.success }}>
              {vessel.delayText}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: colors.secondaryText }}>Container Capacity:</span>
            <strong style={{ color: colors.primaryText }}>{vessel.teuCapacity.toLocaleString()} TEU</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: colors.secondaryText }}>Cargo Type:</span>
            <strong style={{ color: colors.secondaryText }}>{vessel.cargoType}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: spacing.sm }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
