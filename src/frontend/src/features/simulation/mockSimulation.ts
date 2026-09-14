import { SelectOption } from '@/components/ui/Select';

export const SIM_VESSEL_OPTIONS: SelectOption[] = [
  { value: 'mv_ocean_star', label: 'MV Ocean Star (+4h Delay)' },
  { value: 'mv_atlas', label: 'MV Atlas (At Risk)' },
  { value: 'mv_horizon', label: 'MV Horizon (On Schedule)' },
];

export const SIM_BERTH_OPTIONS: SelectOption[] = [
  { value: 'b5', label: 'Berth B5 (45% Utilisation - Recommended)' },
  { value: 'b1', label: 'Berth B1 (65% Utilisation)' },
  { value: 'b6', label: 'Berth B6 (50% Standby)' },
];

export const SIM_DISRUPTION_OPTIONS: SelectOption[] = [
  { value: 'reassign_berth', label: 'Reassign Vessel to Another Berth' },
  { value: 'add_crane', label: 'Assign Additional Crane' },
  { value: 'delay_vessel', label: 'Delay Lower-Priority Vessel' },
];

export interface SimulationResult {
  riskBefore: number;
  riskAfter: number;
  delayBefore: string;
  delayAfter: string;
  yardBefore: number;
  yardAfter: number;
  narrative: string;
}

export const MOCK_SIMULATION_RESULT: SimulationResult = {
  riskBefore: 84,
  riskAfter: 42,
  delayBefore: '4.6h',
  delayAfter: '1.2h',
  yardBefore: 89,
  yardAfter: 74,
  narrative:
    'Reassigning the selected vessel resolves the projected bottleneck, saving 3.2 hours of waiting time across 3 arriving vessels and easing yard pressure.',
};

export interface SavedScenario {
  id: string;
  title: string;
  detail: string;
  riskBefore: number;
  riskAfter: number;
  timestamp: string;
}

export const MOCK_SAVED_SCENARIOS: SavedScenario[] = [
  {
    id: 's1',
    title: 'MV Ocean Star reassigned B4 → B5',
    detail: 'Berth reassignment during peak congestion window',
    riskBefore: 68,
    riskAfter: 42,
    timestamp: 'Today, 09:14',
  },
  {
    id: 's2',
    title: 'Additional crane C7 assigned to B4',
    detail: 'Crane capacity boost for deepwater hub',
    riskBefore: 68,
    riskAfter: 51,
    timestamp: 'Yesterday, 17:40',
  },
];
