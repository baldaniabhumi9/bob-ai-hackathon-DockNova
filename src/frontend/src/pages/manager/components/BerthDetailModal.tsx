import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BerthData } from '@/features/berths/mockBerths';

export interface BerthDetailModalProps {
  berth: BerthData | null;
  isOpen: boolean;
  onClose: () => void;
  onRunSimulation?: (berthCode: string) => void;
}

export const BerthDetailModal: React.FC<BerthDetailModalProps> = ({
  berth,
  isOpen,
  onClose,
  onRunSimulation,
}) => {
  if (!berth) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${berth.name} (${berth.code})`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: colors.secondaryText }}>Operational Status:</span>
          <Badge variant={berth.statusVariant}>{berth.status}</Badge>
        </div>

        <div style={{ backgroundColor: colors.background, padding: spacing.md, borderRadius: radius.md, border: `1px solid ${colors.surfaceBorder}`, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: colors.secondaryText }}>Current Utilisation:</span>
            <strong style={{ color: berth.statusVariant === 'critical' ? colors.critical : colors.primaryText }}>
              {berth.utilisationPercentage}%
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: colors.secondaryText }}>Assigned Vessel:</span>
            <strong style={{ color: colors.novaCyan }}>{berth.assignedVessel || 'None'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: colors.secondaryText }}>Active Cranes:</span>
            <strong style={{ color: colors.primaryText }}>{berth.cranesActive} Cranes Allocated</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: colors.secondaryText }}>Maximum Draft Depth:</span>
            <strong style={{ color: colors.primaryText }}>{berth.maxDraftMeters} meters</strong>
          </div>
        </div>

        {berth.predictionText && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: spacing.md, borderRadius: radius.md, fontSize: '0.8125rem', color: colors.critical }}>
            ⚠️ <strong>Prediction Note:</strong> {berth.predictionText}
          </div>
        )}

        <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'flex-end', marginTop: spacing.sm }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              if (onRunSimulation) onRunSimulation(berth.code);
            }}
          >
            Simulate Berth Reallocation
          </Button>
        </div>
      </div>
    </Modal>
  );
};
