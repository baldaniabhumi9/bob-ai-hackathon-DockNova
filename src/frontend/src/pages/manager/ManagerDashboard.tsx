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
import { useLiveOperations } from '@/hooks/useLiveOperations';
import { api } from '@/services';
import { Button } from '@/components/ui/Button';
import { colors } from '@/design-system';

export const ManagerDashboard: React.FC = () => {
  const { state, portStatus, congestion, refresh } = useLiveOperations();

  const runControl = async (action: () => Promise<unknown>) => {
    await action();
    await refresh();
  };
  const [selectedBerth, setSelectedBerth] = useState<BerthData | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<VesselTimelineItem | null>(null);
  const [isPredictionOpen, setIsPredictionOpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Clean Header */}
      <PortStatusHeader />

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.secondaryText, fontSize: '0.8125rem' }}>
        <span>Live clock: {state ? new Date(state.currentTime).toLocaleString() : 'Connecting...'}</span>
        <Button size="sm" variant="primary" onClick={() => void runControl(() => api.start(state?.speed ?? 1))}>Start</Button>
        <Button size="sm" variant="secondary" onClick={() => void runControl(api.pause)}>Pause</Button>
        <Button size="sm" variant="ghost" onClick={() => void runControl(api.reset)}>Reset</Button>
        {[1, 5, 10].map((speed) => (
          <Button key={speed} size="sm" variant={state?.speed === speed ? 'primary' : 'ghost'} onClick={() => void runControl(() => api.setSpeed(speed))}>{speed}x</Button>
        ))}
      </div>

      {/* 3 Simple KPI Cards */}
      <KPIGrid liveValues={{
        congestion_risk: congestion ? { value: `${Math.round(congestion.congestionProbability * 100)}%`, status: congestion.riskLevel, variant: congestion.riskLevel === 'LOW' ? 'success' : congestion.riskLevel === 'CRITICAL' ? 'critical' : 'warning' } : undefined,
        berth_utilisation: portStatus ? { value: `${Math.round((portStatus.totalVessels - portStatus.availableBerths) / Math.max(1, portStatus.totalVessels) * 100)}%`, status: 'Live', variant: 'warning' } : undefined,
        vessels_in_port: portStatus ? { value: String(portStatus.totalVessels), status: `${portStatus.waitingVessels} waiting`, variant: 'cyan' } : undefined,
      }} />

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
