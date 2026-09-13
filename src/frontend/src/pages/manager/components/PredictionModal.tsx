import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_AI_CONGESTION_ALERT } from '@/features/congestion/mockCongestion';

export interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunWhatIf: () => void;
}

export const PredictionModal: React.FC<PredictionModalProps> = ({
  isOpen,
  onClose,
  onRunWhatIf,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Congestion Prediction Breakdown (72-Hour Horizon)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: colors.secondaryText }}>Target Hotspot:</span>
          <Badge variant="critical">BERTH {MOCK_AI_CONGESTION_ALERT.hotspotBerth} • CRITICAL IN 18H</Badge>
        </div>

        <div style={{ backgroundColor: colors.background, padding: spacing.md, borderRadius: radius.md, border: `1px solid ${colors.surfaceBorder}`, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.novaCyan, textTransform: 'uppercase' }}>
            Predictive Model Drivers & Weights
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Vessel Arrival Overlap (3 Vessels):</span>
              <strong style={{ color: colors.critical }}>+42% Risk Weight</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Berth Utilisation Peak (94%):</span>
              <strong style={{ color: colors.warning }}>+28% Risk Weight</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Crane Availability Drop (67%):</span>
              <strong style={{ color: colors.warning }}>+16% Risk Weight</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Upstream Schedule Delay (MV Ocean Star +4h):</span>
              <strong style={{ color: colors.critical }}>+14% Risk Weight</strong>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', padding: spacing.md, borderRadius: radius.md, border: '1px solid rgba(34, 211, 238, 0.3)' }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: colors.novaCyan }}>AI Recommended Action</h4>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: colors.primaryText }}>
            {MOCK_AI_CONGESTION_ALERT.recommendation}
          </p>
        </div>

        <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'flex-end', marginTop: spacing.sm }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onRunWhatIf();
            }}
          >
            Open What-If Simulator
          </Button>
        </div>
      </div>
    </Modal>
  );
};
