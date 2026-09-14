export interface CraneData {
  id: string;
  code: string;
  berth: string;
  status: 'Operational' | 'Maintenance' | 'Idle';
  statusVariant: 'success' | 'warning' | 'critical';
  utilisationPercentage: number;
  movesPerHour: number;
  nextMaintenance: string;
  alert?: string;
}

export const MOCK_CRANES: CraneData[] = [
  {
    id: 'c1',
    code: 'C1',
    berth: 'B1',
    status: 'Operational',
    statusVariant: 'success',
    utilisationPercentage: 72,
    movesPerHour: 28,
    nextMaintenance: 'In 12 days',
  },
  {
    id: 'c2',
    code: 'C2',
    berth: 'B2',
    status: 'Operational',
    statusVariant: 'success',
    utilisationPercentage: 65,
    movesPerHour: 25,
    nextMaintenance: 'In 18 days',
  },
  {
    id: 'c3',
    code: 'C3',
    berth: 'B3',
    status: 'Operational',
    statusVariant: 'warning',
    utilisationPercentage: 88,
    movesPerHour: 31,
    nextMaintenance: 'In 3 days',
    alert: 'Approaching peak workload at 14:00',
  },
  {
    id: 'c4',
    code: 'C4',
    berth: 'B4',
    status: 'Operational',
    statusVariant: 'critical',
    utilisationPercentage: 96,
    movesPerHour: 34,
    nextMaintenance: 'Overdue',
    alert: 'Utilisation above safe threshold — maintenance overdue',
  },
  {
    id: 'c5',
    code: 'C5',
    berth: 'B4',
    status: 'Operational',
    statusVariant: 'critical',
    utilisationPercentage: 91,
    movesPerHour: 33,
    nextMaintenance: 'In 2 days',
    alert: 'Sustained high load at Berth B4',
  },
  {
    id: 'c6',
    code: 'C6',
    berth: 'B5',
    status: 'Operational',
    statusVariant: 'success',
    utilisationPercentage: 40,
    movesPerHour: 16,
    nextMaintenance: 'In 25 days',
  },
  {
    id: 'c7',
    code: 'C7',
    berth: 'Standby',
    status: 'Idle',
    statusVariant: 'success',
    utilisationPercentage: 0,
    movesPerHour: 0,
    nextMaintenance: 'In 30 days',
  },
  {
    id: 'c8',
    code: 'C8',
    berth: 'B6',
    status: 'Maintenance',
    statusVariant: 'warning',
    utilisationPercentage: 0,
    movesPerHour: 0,
    nextMaintenance: 'In progress',
    alert: 'Scheduled maintenance — back online in 6h',
  },
];
