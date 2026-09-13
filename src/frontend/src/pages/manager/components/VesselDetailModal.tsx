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
  onRunWhatIf?: () => void;
}

export const VesselDetailModal: React.FC<VesselDetailModalProps> = ({
  vessel,
  isOpen,
  onClose,
  onRunWhatIf,
}) => {
  if (!vessel) return null;

  const isOceanStar = vessel.name === 'MV Ocean Star';
  const recommendation = vessel.aiRecommendation || (isOceanStar ? {
    action: 'Move B4 → B5',
    delayChange: '4.6h → 1.2h',
    riskChange: '68% → 42%',
    details: 'Reassigning MV Ocean Star to Berth B5 avoids the congestion bottleneck at B4.',
  } : null);

  const getStepColor = (state: string) => {
    switch (state) {
      case 'completed': return colors.success;
      case 'in_progress': return colors.novaCyan;
      case 'delayed': return colors.critical;
      case 'scheduled':
      default: return colors.secondaryText;
    }
  };

  const getStepBadge = (state: string) => {
    switch (state) {
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'in_progress': return <Badge variant="cyan">In Progress</Badge>;
      case 'delayed': return <Badge variant="critical">Delayed</Badge>;
      case 'scheduled':
      default: return <Badge variant="neutral">Scheduled</Badge>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Vessel Details: ${vessel.name}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, maxHeight: '80vh', overflowY: 'auto', paddingRight: spacing.xs }}>
        {/* Header Metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.secondaryText }}>{vessel.imo}</span>
            <span style={{ color: colors.mutedText }}>•</span>
            <span style={{ fontSize: '0.875rem', color: colors.secondaryText }}>{vessel.cargoType}</span>
          </div>
          <Badge variant={vessel.statusVariant}>{vessel.status}</Badge>
        </div>

        {/* Primary Data Grid */}
        <div
          style={{
            backgroundColor: colors.background,
            padding: spacing.md,
            borderRadius: radius.md,
            border: `1px solid ${colors.surfaceBorder}`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing.sm,
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Scheduled ETA</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.primaryText, marginTop: '2px' }}>{vessel.eta}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Estimated ETD</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.primaryText, marginTop: '2px' }}>{vessel.etd || '18:30 Today'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Assigned Berth</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.novaCyan, marginTop: '2px' }}>{vessel.assignedBerth}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Schedule Delay</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: vessel.delayText !== '0h' ? colors.critical : colors.success, marginTop: '2px' }}>
              {vessel.delayText}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Congestion Risk</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: (vessel.congestionRisk || 0) > 50 ? colors.critical : colors.warning, marginTop: '2px' }}>
              {vessel.congestionRisk || (isOceanStar ? 68 : 15)}%
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Capacity</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.primaryText, marginTop: '2px' }}>{vessel.teuCapacity.toLocaleString()} TEU</div>
          </div>
        </div>

        {/* Vessel Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <h4 style={{ margin: '4px 0 0 0', fontSize: '0.875rem', fontWeight: 600, color: colors.primaryText }}>
            Vessel Operational Timeline
          </h4>
          <div
            style={{
              backgroundColor: colors.background,
              padding: spacing.md,
              borderRadius: radius.md,
              border: `1px solid ${colors.surfaceBorder}`,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm,
            }}
          >
            {(vessel.timeline || [
              { step: 'Anchorage Arrival', time: '01:15', state: 'completed' },
              { step: 'Pilot Boarding', time: '03:00', state: 'completed' },
              { step: 'Berthing at ' + vessel.assignedBerth, time: vessel.eta.split(' ')[0], state: vessel.status === 'Delayed' ? 'delayed' : 'completed' },
              { step: 'Cargo Unloading', time: '06:00', state: 'scheduled' },
              { step: 'Vessel Departure', time: vessel.etd || '18:30', state: 'scheduled' },
            ]).map((stepItem, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: getStepColor(stepItem.state),
                    }}
                  />
                  <span style={{ color: colors.primaryText, fontWeight: 500 }}>{stepItem.step}</span>
                  <span style={{ color: colors.secondaryText }}>({stepItem.time})</span>
                </div>
                {getStepBadge(stepItem.state)}
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation Section */}
        <div
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            border: `1px solid ${colors.novaCyan}`,
            padding: spacing.md,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.novaCyan, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🤖 AI RECOMMENDATION
            </span>
          </div>

          {recommendation ? (
            <>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.primaryText }}>
                {recommendation.action}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: spacing.sm,
                  backgroundColor: colors.background,
                  padding: spacing.sm,
                  borderRadius: radius.sm,
                  border: `1px solid ${colors.surfaceBorder}`,
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Expected Delay:</span>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.success, marginTop: '2px' }}>
                    {recommendation.delayChange}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>Congestion Risk:</span>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.success, marginTop: '2px' }}>
                    {recommendation.riskChange}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>
              Current schedule is aligned with berth allocations. No reassignments recommended at this time.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.sm, marginTop: spacing.xs }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {onRunWhatIf && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onRunWhatIf();
              }}
            >
              ⚡ Run What-If
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
