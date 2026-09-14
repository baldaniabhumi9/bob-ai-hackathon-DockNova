// Congestion Ripple Effect feature module — mock data
// Demonstrates how a single vessel delay propagates through port operations.

export type RippleStatus = 'critical' | 'warning' | 'success';

export interface RippleNodeData {
  id: string;
  icon: string;
  title: string;
  metricLabel: string;
  metricValue: string;
  status: RippleStatus;
  statusLabel: string;
}

export interface RippleScenarioData {
  description: string;
  initialCongestionRisk: number; // 0-100
  predictedPortImpact: 'Low' | 'Medium' | 'High';
  estimatedAdditionalDelay: string;
}

export const MOCK_RIPPLE_SCENARIO: RippleScenarioData = {
  description: 'MV Ocean Star delayed by 4 hours at Berth B4',
  initialCongestionRisk: 68,
  predictedPortImpact: 'High',
  estimatedAdditionalDelay: '+3.4h',
};

export const MOCK_RIPPLE_NODES: RippleNodeData[] = [
  {
    id: 'vessel-delay',
    icon: '🚢',
    title: 'Vessel Delay',
    metricLabel: 'MV Ocean Star',
    metricValue: '+4h delay',
    status: 'warning',
    statusLabel: 'Delayed',
  },
  {
    id: 'berth-b4',
    icon: '⚓',
    title: 'Berth B4',
    metricLabel: 'Utilisation',
    metricValue: '94%',
    status: 'critical',
    statusLabel: 'Critical',
  },
  {
    id: 'crane-availability',
    icon: '🏗️',
    title: 'Crane Availability',
    metricLabel: 'Available capacity',
    metricValue: '67%',
    status: 'warning',
    statusLabel: 'Reduced',
  },
  {
    id: 'yard-capacity',
    icon: '📦',
    title: 'Yard Capacity',
    metricLabel: 'Utilisation',
    metricValue: '78% → 89%',
    status: 'warning',
    statusLabel: 'Rising',
  },
  {
    id: 'truck-gate-pressure',
    icon: '🚚',
    title: 'Truck / Gate Pressure',
    metricLabel: 'Queued trucks',
    metricValue: '12 → 21',
    status: 'critical',
    statusLabel: 'High Pressure',
  },
  {
    id: 'port-congestion',
    icon: '🌊',
    title: 'Port-wide Congestion',
    metricLabel: 'Congestion risk',
    metricValue: '68% → 84%',
    status: 'critical',
    statusLabel: 'Critical',
  },
];

export interface RippleFactor {
  label: string;
}

export const MOCK_RIPPLE_EXPLANATION = {
  heading: 'Why does the congestion spread?',
  summary:
    "MV Ocean Star's 4-hour delay overlaps with three scheduled vessel arrivals at B4. This pushes berth utilisation above the safe threshold, reducing crane availability and increasing yard and gate pressure.",
  factors: ['Vessel arrival overlap', 'High berth utilisation', 'Limited crane availability'],
};

export interface RippleMitigationAction {
  id: string;
  title: string;
  detail: string;
  expectedRiskFrom: number;
  expectedRiskTo: number;
  expectedDelayFrom?: string;
  expectedDelayTo?: string;
}

export const MOCK_RIPPLE_ACTIONS: RippleMitigationAction[] = [
  {
    id: 'reassign-berth',
    title: 'Reassign MV Ocean Star',
    detail: 'B4 → B5',
    expectedRiskFrom: 68,
    expectedRiskTo: 42,
    expectedDelayFrom: '4.6h',
    expectedDelayTo: '1.2h',
  },
  {
    id: 'assign-crane',
    title: 'Assign additional crane',
    detail: 'C7 → B4',
    expectedRiskFrom: 68,
    expectedRiskTo: 51,
  },
  {
    id: 'delay-lower-priority',
    title: 'Delay lower-priority vessel',
    detail: 'Reschedules a non-critical arrival window',
    expectedRiskFrom: 68,
    expectedRiskTo: 57,
  },
];
