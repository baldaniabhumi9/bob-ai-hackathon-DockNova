export interface OptimisationSummary {
  recommendedActions: number;
  projectedEfficiencyGain: string;
  congestionRiskReduction: string;
  planConfidence: number;
}

export const MOCK_OPTIMISATION_SUMMARY: OptimisationSummary = {
  recommendedActions: 6,
  projectedEfficiencyGain: '+14%',
  congestionRiskReduction: '-22 pts',
  planConfidence: 89,
};

export interface OptimisationAction {
  id: string;
  window: string;
  title: string;
  description: string;
  impactLabel: string;
  impactValue: string;
  confidence: number;
}

export const MOCK_OPTIMISATION_ACTIONS: OptimisationAction[] = [
  {
    id: 'a1',
    window: 'Next 6h',
    title: 'Reassign MV Ocean Star to B5',
    description: 'Relieves B4 pressure ahead of three overlapping vessel arrivals.',
    impactLabel: 'Congestion Risk',
    impactValue: '68% → 42%',
    confidence: 91,
  },
  {
    id: 'a2',
    window: 'Next 6h',
    title: 'Deploy standby crane C7 to B4',
    description: 'Adds crane capacity during the peak unload window at the deepwater hub.',
    impactLabel: 'Crane Throughput',
    impactValue: '+18%',
    confidence: 87,
  },
  {
    id: 'a3',
    window: '6-24h',
    title: 'Stagger gate release for inbound trucks',
    description: 'Smooths yard intake to prevent gate queue buildup during the evening shift.',
    impactLabel: 'Gate Queue',
    impactValue: '21 → 13 trucks',
    confidence: 84,
  },
  {
    id: 'a4',
    window: '24-48h',
    title: 'Pre-position empty containers at Yard 2',
    description: 'Reduces yard shuffling ahead of forecasted vessel arrivals.',
    impactLabel: 'Yard Load',
    impactValue: '89% → 74%',
    confidence: 79,
  },
  {
    id: 'a5',
    window: '48-72h',
    title: 'Shift MV Atlas ETA by 3 hours',
    description: 'Avoids a berth conflict with two large vessel arrivals scheduled at B3.',
    impactLabel: 'Berth Conflict',
    impactValue: 'Resolved',
    confidence: 82,
  },
  {
    id: 'a6',
    window: '48-72h',
    title: 'Schedule crane C4 maintenance window',
    description: 'Performs overdue maintenance during a forecasted low-traffic period.',
    impactLabel: 'Downtime Impact',
    impactValue: 'Minimal',
    confidence: 90,
  },
];

export const OPTIMISATION_WINDOWS = ['Next 6h', '6-24h', '24-48h', '48-72h'] as const;
