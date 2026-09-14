/**
 * DockNova - 72-Hour Operations Plan
 * Mock data module (frontend-only, follows existing feature/mock-data patterns)
 */

export type PlanPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Plan72hKPI {
  id: string;
  title: string;
  value: string;
  subValue?: string;
  statusVariant: 'success' | 'warning' | 'critical' | 'cyan' | 'electric' | 'neutral';
}

export const MOCK_PLAN72H_KPIS: Plan72hKPI[] = [
  {
    id: 'congestion_risk',
    title: 'Congestion Risk',
    value: '68% → 42%',
    statusVariant: 'warning',
  },
  {
    id: 'vessels_planned',
    title: 'Vessels Planned',
    value: '18',
    statusVariant: 'cyan',
  },
  {
    id: 'berths_optimised',
    title: 'Berths Optimised',
    value: '5 / 6',
    statusVariant: 'success',
  },
  {
    id: 'critical_actions',
    title: 'Critical Actions',
    value: '4',
    statusVariant: 'critical',
  },
];

export interface Plan72hAction {
  id: string;
  time: string;
  action: string;
  related: string;
  priority: PlanPriority;
  impact: string;
}

export interface Plan72hPeriod {
  id: string;
  label: string;
  windowRange: string;
  actions: Plan72hAction[];
}

export const MOCK_PLAN72H_TIMELINE: Plan72hPeriod[] = [
  {
    id: 'now',
    label: 'NOW',
    windowRange: 'Current status',
    actions: [
      {
        id: 'now-1',
        time: 'Now',
        action: 'MV Ocean Star currently delayed at B4',
        related: 'MV Ocean Star / B4',
        priority: 'Critical',
        impact: 'B4 utilisation at 94%',
      },
      {
        id: 'now-2',
        time: 'Now',
        action: 'B4 utilisation trending above safe threshold',
        related: 'Berth B4',
        priority: 'Critical',
        impact: '94% utilisation',
      },
      {
        id: 'now-3',
        time: 'Now',
        action: 'AI recommends reassigning B4 → B5',
        related: 'Berth B4 / Berth B5',
        priority: 'High',
        impact: 'Predicted risk 68% → 42%',
      },
    ],
  },
  {
    id: '0-12',
    label: '0–12 HOURS',
    windowRange: '0–12 hours',
    actions: [
      {
        id: '0-12-1',
        time: '+2h',
        action: 'Reassign MV Ocean Star to B5',
        related: 'MV Ocean Star / B5',
        priority: 'Critical',
        impact: 'Delay 4.6h → 1.2h',
      },
      {
        id: '0-12-2',
        time: '+3h',
        action: 'Assign Crane C7 to support unloading',
        related: 'Crane C7 / B5',
        priority: 'High',
        impact: 'Throughput +18%',
      },
      {
        id: '0-12-3',
        time: '+6h',
        action: 'Prioritise B4 unloading queue',
        related: 'Berth B4',
        priority: 'High',
        impact: 'Reduces queue backlog',
      },
    ],
  },
  {
    id: '12-24',
    label: '12–24 HOURS',
    windowRange: '12–24 hours',
    actions: [
      {
        id: '12-24-1',
        time: '+14h',
        action: 'Prepare B4 for three incoming vessels',
        related: 'Berth B4',
        priority: 'Medium',
        impact: 'Avoids overlap conflict',
      },
      {
        id: '12-24-2',
        time: '+20h',
        action: 'Maintain crane availability above 70%',
        related: 'Crane Fleet',
        priority: 'Medium',
        impact: 'Keeps throughput stable',
      },
    ],
  },
  {
    id: '24-48',
    label: '24–48 HOURS',
    windowRange: '24–48 hours',
    actions: [
      {
        id: '24-48-1',
        time: '+30h',
        action: 'Schedule lower-priority vessel arrivals',
        related: 'Vessel Schedule',
        priority: 'Medium',
        impact: 'Smooths arrival curve',
      },
      {
        id: '24-48-2',
        time: '+40h',
        action: 'Reduce B3 utilisation',
        related: 'Berth B3',
        priority: 'Low',
        impact: 'B3 89% → 74%',
      },
    ],
  },
  {
    id: '48-72',
    label: '48–72 HOURS',
    windowRange: '48–72 hours',
    actions: [
      {
        id: '48-72-1',
        time: '+55h',
        action: 'Return B4 to normal operating threshold',
        related: 'Berth B4',
        priority: 'Low',
        impact: 'Utilisation stabilised',
      },
      {
        id: '48-72-2',
        time: '+68h',
        action: 'Review next vessel arrival wave',
        related: 'Vessel Schedule',
        priority: 'Low',
        impact: 'Prepares next planning cycle',
      },
    ],
  },
];

export interface Plan72hSummary {
  summaryText: string;
  expectedRiskBefore: string;
  expectedRiskAfter: string;
  expectedDelayBefore: string;
  expectedDelayAfter: string;
}

export const MOCK_PLAN72H_SUMMARY: Plan72hSummary = {
  summaryText:
    "DockNova predicts the highest congestion risk at B4 within the next 18 hours. The recommended plan moves MV Ocean Star to B5, assigns Crane C7, and prioritises B4 unloading. This reduces predicted congestion risk from 68% to 42%.",
  expectedRiskBefore: '68%',
  expectedRiskAfter: '42%',
  expectedDelayBefore: '4.6h',
  expectedDelayAfter: '1.2h',
};

export const priorityBadgeVariant = (priority: PlanPriority): 'critical' | 'warning' | 'cyan' | 'neutral' => {
  switch (priority) {
    case 'Critical': return 'critical';
    case 'High': return 'warning';
    case 'Medium': return 'cyan';
    case 'Low':
    default: return 'neutral';
  }
};
