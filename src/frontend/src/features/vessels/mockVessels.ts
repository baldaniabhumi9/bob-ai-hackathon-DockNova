export interface VesselTimelineStep {
  step: string;
  time: string;
  state: 'completed' | 'in_progress' | 'scheduled' | 'delayed';
}

export interface AIRecommendationData {
  action: string;
  delayChange: string;
  riskChange: string;
  details?: string;
}

export interface VesselTimelineItem {
  id: string;
  name: string;
  imo: string;
  eta: string;
  etd?: string;
  assignedBerth: string;
  status: 'On Time' | 'Delayed' | 'At Risk' | 'Scheduled' | 'Arriving' | 'At Berth';
  statusVariant: 'success' | 'critical' | 'warning' | 'cyan';
  filterStatus?: 'Arriving' | 'At Berth' | 'Delayed';
  delayText: string;
  teuCapacity: number;
  cargoType: string;
  congestionRisk?: number;
  timeline?: VesselTimelineStep[];
  aiRecommendation?: AIRecommendationData;
}

export const MOCK_VESSELS: VesselTimelineItem[] = [
  {
    id: 'v1',
    name: 'MV Ocean Star',
    imo: 'IMO 9845123',
    eta: '04:30 Today',
    etd: '18:30 Today',
    assignedBerth: 'B4',
    status: 'Delayed',
    statusVariant: 'critical',
    filterStatus: 'Delayed',
    delayText: '+4.6h',
    teuCapacity: 14500,
    cargoType: 'Container - Deepsea',
    congestionRisk: 68,
    timeline: [
      { step: 'Anchorage Arrival', time: '01:15', state: 'completed' },
      { step: 'Pilot Boarding', time: '03:00', state: 'completed' },
      { step: 'Berthing at B4', time: '04:30', state: 'delayed' },
      { step: 'Cargo Unloading', time: '06:00', state: 'scheduled' },
      { step: 'Vessel Departure', time: '18:30', state: 'scheduled' },
    ],
    aiRecommendation: {
      action: 'Move B4 → B5',
      delayChange: '4.6h → 1.2h',
      riskChange: '68% → 42%',
      details: 'Reassigning MV Ocean Star to Berth B5 avoids the congestion bottleneck at B4 and reduces port-wide waiting time.',
    },
  },
  {
    id: 'v2',
    name: 'MV Horizon',
    imo: 'IMO 9732104',
    eta: '07:10 Today',
    etd: '15:45 Today',
    assignedBerth: 'B2',
    status: 'At Berth',
    statusVariant: 'success',
    filterStatus: 'At Berth',
    delayText: '0h',
    teuCapacity: 11200,
    cargoType: 'Container - Intra-Asia',
    congestionRisk: 15,
    timeline: [
      { step: 'Anchorage Arrival', time: '05:00', state: 'completed' },
      { step: 'Pilot Boarding', time: '06:15', state: 'completed' },
      { step: 'Berthing at B2', time: '07:10', state: 'completed' },
      { step: 'Cargo Unloading', time: '08:00', state: 'in_progress' },
      { step: 'Vessel Departure', time: '15:45', state: 'scheduled' },
    ],
  },
  {
    id: 'v3',
    name: 'MV Pacific Dawn',
    imo: 'IMO 9621980',
    eta: '09:40 Today',
    etd: '21:00 Today',
    assignedBerth: 'B5',
    status: 'Arriving',
    statusVariant: 'cyan',
    filterStatus: 'Arriving',
    delayText: '0h',
    teuCapacity: 8400,
    cargoType: 'Container - Regional',
    congestionRisk: 22,
    timeline: [
      { step: 'Anchorage Arrival', time: '07:30', state: 'completed' },
      { step: 'Pilot Boarding', time: '08:45', state: 'in_progress' },
      { step: 'Berthing at B5', time: '09:40', state: 'scheduled' },
      { step: 'Cargo Unloading', time: '11:00', state: 'scheduled' },
      { step: 'Vessel Departure', time: '21:00', state: 'scheduled' },
    ],
  },
  {
    id: 'v4',
    name: 'MV Atlas',
    imo: 'IMO 9910432',
    eta: '11:20 Today',
    etd: '02:00 Tomorrow',
    assignedBerth: 'B4',
    status: 'Delayed',
    statusVariant: 'warning',
    filterStatus: 'Delayed',
    delayText: '+1.5h',
    teuCapacity: 16000,
    cargoType: 'Container - Ultra Large',
    congestionRisk: 55,
    timeline: [
      { step: 'Anchorage Arrival', time: '09:00', state: 'completed' },
      { step: 'Pilot Boarding', time: '10:30', state: 'in_progress' },
      { step: 'Berthing at B4', time: '11:20', state: 'delayed' },
      { step: 'Cargo Unloading', time: '13:00', state: 'scheduled' },
      { step: 'Vessel Departure', time: '02:00', state: 'scheduled' },
    ],
    aiRecommendation: {
      action: 'Sequence after MV Ocean Star shift',
      delayChange: '1.5h → 0.4h',
      riskChange: '55% → 30%',
      details: 'Freeing Berth B4 early lowers queue wait time for MV Atlas.',
    },
  },
  {
    id: 'v5',
    name: 'MV Poseidon Express',
    imo: 'IMO 9548761',
    eta: '14:15 Today',
    etd: '22:30 Today',
    assignedBerth: 'B1',
    status: 'Arriving',
    statusVariant: 'cyan',
    filterStatus: 'Arriving',
    delayText: '0h',
    teuCapacity: 9800,
    cargoType: 'Container - Feeder',
    congestionRisk: 12,
    timeline: [
      { step: 'Anchorage Arrival', time: '12:00', state: 'completed' },
      { step: 'Pilot Boarding', time: '13:30', state: 'scheduled' },
      { step: 'Berthing at B1', time: '14:15', state: 'scheduled' },
      { step: 'Cargo Unloading', time: '15:30', state: 'scheduled' },
      { step: 'Vessel Departure', time: '22:30', state: 'scheduled' },
    ],
  },
  {
    id: 'v6',
    name: 'MV Global Container',
    imo: 'IMO 9412987',
    eta: '18:00 Today',
    etd: '08:00 Tomorrow',
    assignedBerth: 'B3',
    status: 'At Berth',
    statusVariant: 'success',
    filterStatus: 'At Berth',
    delayText: '0h',
    teuCapacity: 12800,
    cargoType: 'Dry Bulk / Mixed',
    congestionRisk: 18,
    timeline: [
      { step: 'Anchorage Arrival', time: '14:30', state: 'completed' },
      { step: 'Pilot Boarding', time: '16:00', state: 'completed' },
      { step: 'Berthing at B3', time: '18:00', state: 'completed' },
      { step: 'Cargo Unloading', time: '19:00', state: 'in_progress' },
      { step: 'Vessel Departure', time: '08:00', state: 'scheduled' },
    ],
  },
  {
    id: 'v7',
    name: 'MV Nordic Voyager',
    imo: 'IMO 9387410',
    eta: '20:30 Today',
    etd: '10:15 Tomorrow',
    assignedBerth: 'B6',
    status: 'Arriving',
    statusVariant: 'cyan',
    filterStatus: 'Arriving',
    delayText: '0h',
    teuCapacity: 10500,
    cargoType: 'Container - Transatlantic',
    congestionRisk: 25,
    timeline: [
      { step: 'Anchorage Arrival', time: '18:00', state: 'scheduled' },
      { step: 'Pilot Boarding', time: '19:30', state: 'scheduled' },
      { step: 'Berthing at B6', time: '20:30', state: 'scheduled' },
      { step: 'Cargo Unloading', time: '22:00', state: 'scheduled' },
      { step: 'Vessel Departure', time: '10:15', state: 'scheduled' },
    ],
  },
  {
    id: 'v8',
    name: 'MV Titan Explorer',
    imo: 'IMO 9954120',
    eta: '23:45 Today',
    etd: '14:00 Tomorrow',
    assignedBerth: 'B3',
    status: 'Delayed',
    statusVariant: 'critical',
    filterStatus: 'Delayed',
    delayText: '+3.2h',
    teuCapacity: 15200,
    cargoType: 'Container - Deepsea',
    congestionRisk: 72,
    timeline: [
      { step: 'Anchorage Arrival', time: '20:00', state: 'completed' },
      { step: 'Pilot Boarding', time: '22:15', state: 'delayed' },
      { step: 'Berthing at B3', time: '23:45', state: 'scheduled' },
      { step: 'Cargo Unloading', time: '01:30', state: 'scheduled' },
      { step: 'Vessel Departure', time: '14:00', state: 'scheduled' },
    ],
    aiRecommendation: {
      action: 'Pre-assign Crane 04 to accelerate discharge',
      delayChange: '3.2h → 0.8h',
      riskChange: '72% → 38%',
      details: 'Deploying secondary gang crane reduces turnaround time at B3.',
    },
  },
];
