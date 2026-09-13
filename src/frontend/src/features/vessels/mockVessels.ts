export interface VesselTimelineItem {
  id: string;
  name: string;
  imo: string;
  eta: string;
  assignedBerth: string;
  status: 'On Time' | 'Delayed' | 'At Risk' | 'Scheduled';
  statusVariant: 'success' | 'critical' | 'warning' | 'cyan';
  delayText: string;
  teuCapacity: number;
  cargoType: string;
}

export const MOCK_VESSELS: VesselTimelineItem[] = [
  {
    id: 'v1',
    name: 'MV Ocean Star',
    imo: 'IMO 9845123',
    eta: '04:30 Today',
    assignedBerth: 'B4',
    status: 'Delayed',
    statusVariant: 'critical',
    delayText: '+4h',
    teuCapacity: 14500,
    cargoType: 'Container - Deepsea',
  },
  {
    id: 'v2',
    name: 'MV Horizon',
    imo: 'IMO 9732104',
    eta: '07:10 Today',
    assignedBerth: 'B2',
    status: 'On Time',
    statusVariant: 'success',
    delayText: '0h',
    teuCapacity: 11200,
    cargoType: 'Container - Intra-Asia',
  },
  {
    id: 'v3',
    name: 'MV Pacific Dawn',
    imo: 'IMO 9621980',
    eta: '09:40 Today',
    assignedBerth: 'B5',
    status: 'On Time',
    statusVariant: 'success',
    delayText: '0h',
    teuCapacity: 8400,
    cargoType: 'Container - Regional',
  },
  {
    id: 'v4',
    name: 'MV Atlas',
    imo: 'IMO 9910432',
    eta: '11:20 Today',
    assignedBerth: 'B4',
    status: 'At Risk',
    statusVariant: 'warning',
    delayText: '+1.5h',
    teuCapacity: 16000,
    cargoType: 'Container - Ultra Large',
  },
  {
    id: 'v5',
    name: 'MV Poseidon Express',
    imo: 'IMO 9548761',
    eta: '14:15 Today',
    assignedBerth: 'B1',
    status: 'On Time',
    statusVariant: 'success',
    delayText: '0h',
    teuCapacity: 9800,
    cargoType: 'Container - Feeder',
  },
  {
    id: 'v6',
    name: 'MV Global Container',
    imo: 'IMO 9412987',
    eta: '18:00 Today',
    assignedBerth: 'B3',
    status: 'Scheduled',
    statusVariant: 'cyan',
    delayText: '0h',
    teuCapacity: 12800,
    cargoType: 'Dry Bulk / Mixed',
  },
];
