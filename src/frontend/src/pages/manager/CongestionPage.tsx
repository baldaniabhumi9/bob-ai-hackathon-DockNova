import React, { useState } from 'react';
import { spacing } from '@/design-system';
import { CongestionHeader } from './components/CongestionHeader';
import { CongestionSummaryCards } from './components/CongestionSummaryCards';
import { ForecastChart } from './components/ForecastChart';
import { AtRiskBerthCard } from './components/AtRiskBerthCard';
import { WhyRiskCard } from './components/WhyRiskCard';
import { RecommendationCard } from './components/RecommendationCard';

import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { VesselDetailModal } from './components/VesselDetailModal';
import { MOCK_VESSELS } from '@/features/vessels/mockVessels';

export const CongestionPage: React.FC = () => {
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isVesselOpen, setIsVesselOpen] = useState(false);

  // Default vessel for MV Ocean Star details
  const oceanStarVessel = MOCK_VESSELS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <CongestionHeader />

      {/* 3 Top Summary Cards */}
      <CongestionSummaryCards />

      {/* Main 72-Hour Forecast & At-Risk Analysis Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: spacing.lg, alignItems: 'start' }}>
        {/* Left: 72-Hour Forecast Visualization */}
        <ForecastChart />

        {/* Right: At-Risk Berth & Risk Factors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          <AtRiskBerthCard />
          <WhyRiskCard />
        </div>
      </div>

      {/* AI Recommendation Section */}
      <RecommendationCard
        onRunWhatIf={() => setIsWhatIfOpen(true)}
        onViewVessel={() => setIsVesselOpen(true)}
      />

      {/* Modals */}
      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />

      <VesselDetailModal
        vessel={oceanStarVessel}
        isOpen={isVesselOpen}
        onClose={() => setIsVesselOpen(false)}
      />
    </div>
  );
};

export default CongestionPage;
