import React, { useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ProgressBar } from '@/components/ui/ProgressBar';

export interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [targetVessel, setTargetVessel] = useState('mv_ocean_star');
  const [targetBerth, setTargetBerth] = useState('b5');
  const [isSimulated, setIsSimulated] = useState(false);

  const handleSimulate = () => {
    setIsSimulated(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What-If Scenario Simulator">
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: colors.secondaryText }}>
          Simulate operational decisions (reassign berths, adjust crane speeds, or shift ETA) and evaluate predicted impact on 72h congestion.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
          <Select
            label="Select Vessel to Reassign"
            value={targetVessel}
            onChange={(e) => setTargetVessel(e.target.value)}
            options={[
              { value: 'mv_ocean_star', label: 'MV Ocean Star (+4h Delay)' },
              { value: 'mv_atlas', label: 'MV Atlas (At Risk)' },
            ]}
          />

          <Select
            label="Reassign Target Berth"
            value={targetBerth}
            onChange={(e) => setTargetBerth(e.target.value)}
            options={[
              { value: 'b5', label: 'Berth B5 (45% Utilisation - Recommended)' },
              { value: 'b1', label: 'Berth B1 (65% Utilisation)' },
              { value: 'b6', label: 'Berth B6 (50% Standby)' },
            ]}
          />
        </div>

        {!isSimulated ? (
          <Button variant="primary" onClick={handleSimulate} style={{ marginTop: spacing.xs }}>
            ⚡ Run Scenario Simulation
          </Button>
        ) : (
          <div style={{ backgroundColor: colors.background, padding: spacing.md, borderRadius: radius.md, border: `1px solid ${colors.novaCyan}`, display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: colors.novaCyan }}>
                SIMULATION RESULT
              </span>
              <Badge variant="success">RISK REDUCED BY 50%</Badge>
            </div>

            <ProgressBar value={42} label="New B4 Predicted Congestion Risk" variant="success" />

            <div style={{ fontSize: '0.8125rem', color: colors.primaryText, marginTop: spacing.xs }}>
              ✅ <strong>Outcome:</strong> Reassigning MV Ocean Star to B5 resolves the 18h bottleneck at B4, saving <strong>3.2 hours</strong> of waiting time across 3 arriving vessels.
            </div>

            <Button variant="secondary" size="sm" onClick={() => setIsSimulated(false)}>
              Reset Simulation Parameters
            </Button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: spacing.sm }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
