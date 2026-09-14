import React, { useState } from 'react';
import { spacing } from '@/design-system';
import { RippleHeader } from './components/RippleHeader';
import { RippleScenarioCard } from './components/RippleScenarioCard';
import { RippleVisualization } from './components/RippleVisualization';
import { RippleExplanationCard } from './components/RippleExplanationCard';
import { RippleMitigationActions } from './components/RippleMitigationActions';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { useLiveOperations } from '@/hooks/useLiveOperations';
import { RippleScenarioData, RippleNodeData, RippleMitigationAction } from '@/features/congestion/mockRippleData';

// Derive a RippleStatus from a 0-1 congestion probability
const toStatus = (pct: number): 'critical' | 'warning' | 'success' =>
  pct >= 70 ? 'critical' : pct >= 40 ? 'warning' : 'success';

// Build a live ripple scenario from congestion + port state data
function buildScenario(
  congestionPct: number,
  waitingVessels: number,
  occupiedBerths: number,
  totalBerths: number,
): RippleScenarioData {
  const berthUtil = totalBerths > 0 ? Math.round((occupiedBerths / totalBerths) * 100) : 0;
  const impact: 'Low' | 'Medium' | 'High' = congestionPct >= 70 ? 'High' : congestionPct >= 40 ? 'Medium' : 'Low';
  const additionalDelay = congestionPct >= 70
    ? `+${(congestionPct / 20).toFixed(1)}h`
    : congestionPct >= 40
    ? `+${(congestionPct / 30).toFixed(1)}h`
    : '+0.5h';
  return {
    description: waitingVessels > 0
      ? `${waitingVessels} vessel${waitingVessels !== 1 ? 's' : ''} waiting — berths ${berthUtil}% occupied`
      : `Port operations nominal — berths ${berthUtil}% occupied`,
    initialCongestionRisk: congestionPct,
    predictedPortImpact: impact,
    estimatedAdditionalDelay: additionalDelay,
  };
}

// Build ripple chain nodes from live metrics
function buildNodes(
  congestionPct: number,
  waitingVessels: number,
  occupiedBerths: number,
  totalBerths: number,
  availableCranes: number,
  totalCranes: number,
): RippleNodeData[] {
  const berthUtil = totalBerths > 0 ? Math.round((occupiedBerths / totalBerths) * 100) : 0;
  const craneUtil = totalCranes > 0 ? Math.round(((totalCranes - availableCranes) / totalCranes) * 100) : 0;
  const craneAvail = totalCranes > 0 ? Math.round((availableCranes / totalCranes) * 100) : 100;
  const yardUtil = Math.min(95, Math.round(berthUtil * 0.9 + congestionPct * 0.1));
  const yardProjected = Math.min(99, yardUtil + Math.round(congestionPct * 0.12));
  const trucks = Math.max(3, waitingVessels * 4 + Math.round(berthUtil / 10));
  const trucksProjected = Math.min(trucks + 12, trucks + Math.round(congestionPct / 8));

  return [
    {
      id: 'vessel-delay',
      icon: '🚢',
      title: 'Vessel Congestion',
      metricLabel: 'Vessels waiting',
      metricValue: `${waitingVessels} vessel${waitingVessels !== 1 ? 's' : ''}`,
      status: toStatus(waitingVessels >= 5 ? 80 : waitingVessels >= 2 ? 55 : 20),
      statusLabel: waitingVessels >= 5 ? 'Backlog' : waitingVessels >= 2 ? 'Building' : 'Normal',
    },
    {
      id: 'berth-utilisation',
      icon: '⚓',
      title: 'Berth Utilisation',
      metricLabel: 'Occupied / total',
      metricValue: `${berthUtil}%`,
      status: toStatus(berthUtil),
      statusLabel: berthUtil >= 70 ? 'Critical' : berthUtil >= 40 ? 'High' : 'Normal',
    },
    {
      id: 'crane-availability',
      icon: '🏗️',
      title: 'Crane Availability',
      metricLabel: 'Available capacity',
      metricValue: `${craneAvail}%`,
      status: toStatus(craneUtil),
      statusLabel: craneUtil >= 70 ? 'Strained' : craneUtil >= 40 ? 'Reduced' : 'Good',
    },
    {
      id: 'yard-capacity',
      icon: '📦',
      title: 'Yard Capacity',
      metricLabel: 'Utilisation',
      metricValue: `${yardUtil}% → ${yardProjected}%`,
      status: toStatus(yardProjected),
      statusLabel: yardProjected >= 70 ? 'Rising' : yardProjected >= 40 ? 'Moderate' : 'Normal',
    },
    {
      id: 'truck-gate-pressure',
      icon: '🚚',
      title: 'Truck / Gate Pressure',
      metricLabel: 'Queued trucks',
      metricValue: `${trucks} → ${trucksProjected}`,
      status: toStatus(congestionPct),
      statusLabel: congestionPct >= 70 ? 'High Pressure' : congestionPct >= 40 ? 'Moderate' : 'Low',
    },
    {
      id: 'port-congestion',
      icon: '🌊',
      title: 'Port-wide Congestion',
      metricLabel: 'Congestion risk',
      metricValue: `${congestionPct}%`,
      status: toStatus(congestionPct),
      statusLabel: congestionPct >= 70 ? 'Critical' : congestionPct >= 40 ? 'Elevated' : 'Normal',
    },
  ];
}

// Build live mitigation actions from current congestion level
function buildActions(congestionPct: number): RippleMitigationAction[] {
  const reduced1 = Math.max(10, congestionPct - 22);
  const reduced2 = Math.max(10, congestionPct - 15);
  const reduced3 = Math.max(10, congestionPct - 10);
  const delayFrom = (congestionPct / 20).toFixed(1);
  const delayTo = (congestionPct / 45).toFixed(1);
  return [
    {
      id: 'reassign-berth',
      title: 'Reassign next vessel',
      detail: 'Route to least-utilised berth',
      expectedRiskFrom: congestionPct,
      expectedRiskTo: reduced1,
      expectedDelayFrom: `${delayFrom}h`,
      expectedDelayTo: `${delayTo}h`,
    },
    {
      id: 'assign-crane',
      title: 'Assign additional crane',
      detail: 'Deploy idle crane to busiest berth',
      expectedRiskFrom: congestionPct,
      expectedRiskTo: reduced2,
    },
    {
      id: 'delay-lower-priority',
      title: 'Reschedule low-priority arrival',
      detail: 'Push non-critical vessel window +2h',
      expectedRiskFrom: congestionPct,
      expectedRiskTo: reduced3,
    },
  ];
}

export const CongestionRipplePage: React.FC = () => {
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const { state, portStatus, congestion } = useLiveOperations();

  const handleSimulate = (_actionId: string) => {
    setIsWhatIfOpen(true);
  };

  // Derive values from live data; fall through to undefined so sub-components use mock fallbacks
  const congestionPct = congestion
    ? Math.round(congestion.congestionProbability * 100)
    : undefined;

  const waitingVessels = portStatus?.waitingVessels ?? state?.waitingVessels;
  const occupiedBerths = portStatus?.availableBerths != null
    ? (state ? state.berths.length - portStatus.availableBerths : undefined)
    : undefined;
  const totalBerths = state ? state.berths.length : 0;
  const totalCranes = state ? state.cranes.length : 0;
  const availableCranes = portStatus?.availableCranes ?? 0;

  const liveScenario =
    congestionPct !== undefined && waitingVessels !== undefined && occupiedBerths !== undefined
      ? buildScenario(congestionPct, waitingVessels, occupiedBerths, totalBerths)
      : undefined;

  const liveNodes =
    congestionPct !== undefined && waitingVessels !== undefined && occupiedBerths !== undefined
      ? buildNodes(congestionPct, waitingVessels, occupiedBerths, totalBerths, availableCranes, totalCranes)
      : undefined;

  const liveActions = congestionPct !== undefined ? buildActions(congestionPct) : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <RippleHeader />

      {/* Scenario Summary — live when backend is available */}
      <RippleScenarioCard scenario={liveScenario} />

      {/* Cause -> Effect Ripple Visualization — live nodes */}
      <RippleVisualization nodes={liveNodes} />

      {/* AI Explanation — updates with live congestion % */}
      <RippleExplanationCard
        congestionPct={congestionPct}
        waitingVessels={waitingVessels}
      />

      {/* Mitigation Actions — live risk reduction targets */}
      <RippleMitigationActions onSimulate={handleSimulate} actions={liveActions} />

      {/* Reused What-If Simulator Modal */}
      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
    </div>
  );
};

export default CongestionRipplePage;
