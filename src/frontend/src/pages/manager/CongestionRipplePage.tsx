import React, { useState } from 'react';
import { spacing } from '@/design-system';
import { RippleHeader } from './components/RippleHeader';
import { RippleScenarioCard } from './components/RippleScenarioCard';
import { RippleVisualization } from './components/RippleVisualization';
import { RippleExplanationCard } from './components/RippleExplanationCard';
import { RippleMitigationActions } from './components/RippleMitigationActions';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';

export const CongestionRipplePage: React.FC = () => {
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);

  const handleSimulate = (_actionId: string) => {
    // Reuses the existing What-If Simulator to preview the mitigation outcome.
    setIsWhatIfOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <RippleHeader />

      {/* Scenario Summary */}
      <RippleScenarioCard />

      {/* Cause -> Effect Ripple Visualization */}
      <RippleVisualization />

      {/* AI Explanation */}
      <RippleExplanationCard />

      {/* Mitigation Actions */}
      <RippleMitigationActions onSimulate={handleSimulate} />

      {/* Reused What-If Simulator Modal */}
      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
    </div>
  );
};

export default CongestionRipplePage;
