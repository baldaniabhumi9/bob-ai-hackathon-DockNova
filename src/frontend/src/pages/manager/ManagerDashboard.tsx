import React, { useState } from 'react';
import { spacing } from '@/design-system';
import { PortStatusHeader } from './components/PortStatusHeader';
import { KPIGrid } from './components/KPIGrid';
import { PortMap } from './components/PortMap';
import { AIAlertCard } from './components/AIAlertCard';
import { VesselTimeline } from './components/VesselTimeline';

import { BerthDetailModal } from './components/BerthDetailModal';
import { VesselDetailModal } from './components/VesselDetailModal';
import { PredictionModal } from './components/PredictionModal';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';

import { BerthData } from '@/features/berths/mockBerths';
import { VesselTimelineItem } from '@/features/vessels/mockVessels';

export const ManagerDashboard: React.FC = () => {
  const [selectedBerth, setSelectedBerth] = useState<BerthData | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<VesselTimelineItem | null>(null);
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Clean Header */}
      <PortStatusHeader />

      {/* 3 Simple KPI Cards */}
      <KPIGrid />

      {/* Two-Column Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: spacing.lg, alignItems: 'stretch' }}>
        {/* Left: Simplified Port Map */}
        <PortMap onSelectBerth={(berth) => setSelectedBerth(berth)} />

        {/* Right: Focused AI Insight */}
        <AIAlertCard
          onViewPrediction={() => setIsPredictionOpen(true)}
          onRunWhatIf={() => setIsWhatIfOpen(true)}
        />
      </div>

      {/* Small Upcoming Vessels Section */}
      <VesselTimeline onSelectVessel={(vessel) => setSelectedVessel(vessel)} />

      {/* Modals for Advanced Details on Click */}
      <BerthDetailModal
        berth={selectedBerth}
        isOpen={Boolean(selectedBerth)}
        onClose={() => setSelectedBerth(null)}
        onRunSimulation={() => setIsWhatIfOpen(true)}
      />

      <VesselDetailModal
        vessel={selectedVessel}
        isOpen={Boolean(selectedVessel)}
        onClose={() => setSelectedVessel(null)}
      />

      <PredictionModal
        isOpen={isPredictionOpen}
        onClose={() => setIsPredictionOpen(false)}
        onRunWhatIf={() => setIsWhatIfOpen(true)}
      />

      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
    </div>
  );
};

export default ManagerDashboard;
