export interface OperationalAlert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  variant: 'critical' | 'warning' | 'cyan';
  message: string;
  timestamp: string;
  category: string;
}

export const MOCK_ALERTS: OperationalAlert[] = [
  {
    id: 'alt-1',
    type: 'CRITICAL',
    variant: 'critical',
    message: 'B4 congestion predicted in 18h',
    timestamp: '10 mins ago',
    category: 'Congestion Risk',
  },
  {
    id: 'alt-2',
    type: 'WARNING',
    variant: 'warning',
    message: 'Crane C3 maintenance scheduled in 10h',
    timestamp: '25 mins ago',
    category: 'Equipment',
  },
  {
    id: 'alt-3',
    type: 'WARNING',
    variant: 'warning',
    message: 'MV Ocean Star delayed by 4h',
    timestamp: '1 hour ago',
    category: 'Vessel Schedule',
  },
  {
    id: 'alt-4',
    type: 'INFO',
    variant: 'cyan',
    message: 'B5 has spare capacity available for reassignment',
    timestamp: '2 hours ago',
    category: 'Capacity Optimisation',
  },
];
