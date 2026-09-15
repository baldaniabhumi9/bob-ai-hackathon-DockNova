// DockNova Mock Data for Vessel Operator Command Center Dashboard & Vessel Passport

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  status: 'past' | 'current' | 'future';
  confidence?: string; // e.g., "94%"
  interval?: string; // e.g., "ETA 18:45 ± 30 min"
  source?: string; // e.g., "AIS Doppler Radar & Port Terminal AIS"
}

export interface ImpactStep {
  name: string;
  value: number;
  unit: string;
  metric: string;
  impactColor: string;
}

export interface CascadingImpact {
  cascadeSteps: ImpactStep[];
  aiSummary: string;
}

export interface VesselDetailData {
  id: string;
  name: string;
  imo: string;
  eta: string;
  etaFormatted: string;
  etdFormatted: string;
  berth: string;
  terminal: string;
  location: string;
  status: 'AT BERTH' | 'ARRIVING' | 'DELAYED' | 'DEPARTED';
  risk: number; // 0 - 100
  carrier: string;
  origin: string;
  destination: string;
  type: string;
  length: string;
  teu: number;
  flag: string;
  builtYear: number;
  draft: string;
  speed: string;
  healthScore: number; // 0 - 100
  carbonEstimate: string;
  delayFormatted: string | null; // e.g. "+4.6h"
  isDelayed: boolean;
  craneAssignment: {
    count: number;
    cranes: string[];
    productivity: string;
  };
  yardUtilization: number; // %
  aiInsight: {
    header: string;
    body: string;
    confidence: string;
    recommendation: string;
  };
  timelineEvents: TimelineEvent[];
  impactAnalysis: CascadingImpact;
}

export interface KpiData {
  activeVessels: number;
  upcomingArrivals: number;
  delayedVessels: number;
  avgDelayTime: number; // in hours
  totalFleetTonnage: string;
  onTimePercentage: number;
}

export interface FleetHistoryPoint {
  day: string;
  onTime: number;
  delayed: number;
  atPort: number;
}

export interface TerminalRiskPoint {
  terminal: string;
  shortName: string;
  risk: number;
  queue: number;
  avgWait: string;
  fullMark: number;
}

export const kpiMetrics: KpiData = {
  activeVessels: 24,
  upcomingArrivals: 8,
  delayedVessels: 3,
  avgDelayTime: 2.4,
  totalFleetTonnage: '1.42M DWT',
  onTimePercentage: 87.5,
};

export const fleetStatusHistory: FleetHistoryPoint[] = [
  { day: 'Mon', onTime: 18, delayed: 3, atPort: 12 },
  { day: 'Tue', onTime: 20, delayed: 2, atPort: 14 },
  { day: 'Wed', onTime: 19, delayed: 4, atPort: 15 },
  { day: 'Thu', onTime: 22, delayed: 2, atPort: 13 },
  { day: 'Fri', onTime: 21, delayed: 4, atPort: 16 },
  { day: 'Sat', onTime: 24, delayed: 3, atPort: 15 },
  { day: 'Sun', onTime: 23, delayed: 3, atPort: 17 },
];

export const terminalCongestionRisk: TerminalRiskPoint[] = [
  { terminal: 'T1 - Pasir Panjang', shortName: 'T1', risk: 68, queue: 4, avgWait: '2.8h', fullMark: 100 },
  { terminal: 'T2 - Tuas Mega', shortName: 'T2', risk: 42, queue: 2, avgWait: '1.2h', fullMark: 100 },
  { terminal: 'T3 - Jurong Quay', shortName: 'T3', risk: 85, queue: 6, avgWait: '4.1h', fullMark: 100 },
  { terminal: 'T4 - Keppel Terminal', shortName: 'T4', risk: 30, queue: 1, avgWait: '0.8h', fullMark: 100 },
  { terminal: 'T5 - Brani Terminal', shortName: 'T5', risk: 55, queue: 3, avgWait: '2.1h', fullMark: 100 },
];

export const vesselsPassportDatabase: Record<string, VesselDetailData> = {
  vsl_01: {
    id: 'vsl_01',
    name: 'MV Nova Horizon',
    imo: '9845123',
    eta: '2026-09-14 16:45',
    etaFormatted: 'Today, 16:45',
    etdFormatted: 'Tomorrow, 08:30',
    berth: 'Berth B4, Terminal 2',
    terminal: 'Terminal 2 (Tuas Mega)',
    location: 'Berth B4, Terminal 2',
    status: 'AT BERTH',
    risk: 18,
    carrier: 'Nova Maritime Alliance',
    origin: 'Port of Shanghai',
    destination: 'Singapore Port',
    type: 'Ultra-Large Container Vessel (ULCV)',
    length: '399.9 m',
    teu: 24000,
    flag: 'Singapore (SGP)',
    builtYear: 2022,
    draft: '16.2 m',
    speed: '19.2 kts',
    healthScore: 94,
    carbonEstimate: '124t CO₂',
    delayFormatted: null,
    isDelayed: false,
    craneAssignment: {
      count: 3,
      cranes: ['C1', 'C3', 'C7'],
      productivity: '32 moves/hr per crane',
    },
    yardUtilization: 68,
    aiInsight: {
      header: 'AI Health & Dwell Optimization',
      body: 'MV Nova Horizon is operating at 94% berth efficiency. Quay crane gang C1/C3/C7 throughput exceeds forecast by +4.2%. Discharge completion predicted 30 minutes ahead of scheduled pilot boarding.',
      confidence: '96% confidence',
      recommendation: 'Clear departure fairway 20 minutes earlier for bunker barge rendezvous.',
    },
    timelineEvents: [
      {
        id: 'evt_1',
        time: 'Sep 10, 08:00',
        title: 'Departed Port of Shanghai',
        description: 'Vessel unberthed with full manifest load of 23,850 TEU.',
        status: 'past',
      },
      {
        id: 'evt_2',
        time: 'Sep 13, 21:30',
        title: 'Passed Singapore Outer Fairway',
        description: 'Vessel entered Traffic Separation Scheme (TSS) Sector 3 on schedule.',
        status: 'past',
      },
      {
        id: 'evt_3',
        time: 'Sep 14, 16:45',
        title: 'All Fast at Berth B4',
        description: 'Mooring secured at Quay B4 with 3 Super Post-Panamax cranes engaged.',
        status: 'current',
      },
      {
        id: 'evt_4',
        time: 'Sep 15, 08:30',
        title: 'Predicted Quay Departure',
        description: 'Cargo operations projected complete. Pilot boarding station confirmed.',
        status: 'future',
        confidence: '94% confidence',
        interval: 'ETD 08:30 ± 15 min',
        source: 'Crane telemetry & automated gang assignment model',
      },
      {
        id: 'evt_5',
        time: 'Sep 15, 14:00',
        title: 'Predicted Arrival Tanjung Pelepas',
        description: 'Feeder transshipment corridor approach via Western Gateway.',
        status: 'future',
        confidence: '89% confidence',
        interval: 'ETA 14:00 ± 35 min',
        source: 'Tidal current forecast & vessel propulsion curve',
      },
      {
        id: 'evt_6',
        time: 'Sep 17, 02:00',
        title: 'Predicted Maintenance Window',
        description: 'Auxiliary engine scheduled filter maintenance at anchor.',
        status: 'future',
        confidence: '98% confidence',
        interval: 'Window 02:00 - 05:00',
        source: 'Vessel IoT condition monitoring telemetry',
      },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Initial Deviation', value: 0.2, unit: 'h', metric: '+0.2h', impactColor: '#34D399' },
        { name: 'B4 Berth Dwell', value: -4.0, unit: '%', metric: '-4%', impactColor: '#38BDF8' },
        { name: 'Crane Queue', value: 0.1, unit: 'h', metric: '0.1h', impactColor: '#34D399' },
        { name: 'Turnaround Gain', value: 0.5, unit: 'h', metric: '+0.5h ahead', impactColor: '#34D399' },
      ],
      aiSummary:
        'Cascading impact summary: Vessel is proceeding ahead of nominal turnaround curves. Discharge operations are freeing Berth B4 for subsequent vessel arrival 25 minutes ahead of schedule with zero quay crane congestion.',
    },
  },

  vsl_02: {
    id: 'vsl_02',
    name: 'MSC Marina Blue',
    imo: '9784321',
    eta: '2026-09-14 18:20',
    etaFormatted: 'Today, 18:20',
    etdFormatted: 'Tomorrow, 14:00',
    berth: 'Berth B4, Terminal 2',
    terminal: 'Terminal 2 (Tuas Mega)',
    location: 'Berth B4, Terminal 2',
    status: 'DELAYED',
    risk: 76,
    carrier: 'MSC Mediterranean Shipping',
    origin: 'Port of Ningbo',
    destination: 'Singapore Port',
    type: 'Post-Panamax Boxship',
    length: '366.5 m',
    teu: 16500,
    flag: 'Panama (PAN)',
    builtYear: 2019,
    draft: '15.4 m',
    speed: '14.1 kts',
    healthScore: 62,
    carbonEstimate: '189t CO₂',
    delayFormatted: '+4.6h',
    isDelayed: true,
    craneAssignment: {
      count: 3,
      cranes: ['C1', 'C3', 'C7'],
      productivity: '24 moves/hr per crane',
    },
    yardUtilization: 86,
    aiInsight: {
      header: 'AI Disruption Alert',
      body: "MSC Marina Blue's 4.6h delay will cascade to Berth B4 peak congestion at 18:00. Recommend reassignment to Berth B5 to reduce risk from 94% → 42%.",
      confidence: '91% confidence',
      recommendation: 'Reassign to Berth B5 and adjust crane gang C2/C4 to mitigate backlog.',
    },
    timelineEvents: [
      {
        id: 'evt_1',
        time: 'Sep 09, 14:00',
        title: 'Departed Port of Ningbo',
        description: 'Vessel delayed by typhoon diversion in East China Sea.',
        status: 'past',
      },
      {
        id: 'evt_2',
        time: 'Sep 13, 04:15',
        title: 'Passed Malacca Strait Gateway',
        description: 'Heavy fairway traffic caused reduction to 11.2 knots.',
        status: 'past',
      },
      {
        id: 'evt_3',
        time: 'Sep 14, 18:20',
        title: 'Delayed Arrival at Pilot Station',
        description: 'Holding at Eastern Anchorage awaiting pilot clearance.',
        status: 'current',
      },
      {
        id: 'evt_4',
        time: 'Sep 14, 21:30',
        title: 'Predicted Berthing at Quay B4/B5',
        description: 'Dynamic slot negotiation pending port master approval.',
        status: 'future',
        confidence: '91% confidence',
        interval: 'ETA 21:30 ± 45 min',
        source: 'AIS Doppler radar & automated pilot booking system',
      },
      {
        id: 'evt_5',
        time: 'Sep 15, 14:00',
        title: 'Predicted Quay Departure',
        description: 'Discharge and container reload operations scheduled.',
        status: 'future',
        confidence: '84% confidence',
        interval: 'ETD 14:00 ± 60 min',
        source: 'Crane gang work-order completion forecast',
      },
      {
        id: 'evt_6',
        time: 'Sep 16, 06:00',
        title: 'Predicted Port Klang Arrival',
        description: 'Next port call sequence adjusted for 4.6h cascade.',
        status: 'future',
        confidence: '88% confidence',
        interval: 'ETA 06:00 ± 40 min',
        source: 'Weather-routed hydrodynamic ETA engine',
      },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Initial Delay', value: 4.6, unit: 'h', metric: '+4.6h', impactColor: '#F87171' },
        { name: 'B4 Congestion', value: 12, unit: '%', metric: '+12%', impactColor: '#FBBF24' },
        { name: 'Crane Queue', value: 2.0, unit: 'h', metric: '+2.0h', impactColor: '#F87171' },
        { name: 'Next Vessel Delay', value: 1.2, unit: 'h', metric: '+1.2h', impactColor: '#F87171' },
      ],
      aiSummary:
        "Cascading impact summary: The vessel's 4.6h delay triggers a bottleneck for Quay B4 cranes, elevating terminal dwell time by 12% and pushing subsequent feeder vessel berthing back by 1.2h unless reassigned to Berth B5.",
    },
  },

  vsl_03: {
    id: 'vsl_03',
    name: 'Maersk Polaris',
    imo: '9921004',
    eta: '2026-09-14 21:00',
    etaFormatted: 'Today, 21:00',
    etdFormatted: 'Tomorrow, 19:30',
    berth: 'Berth B-07, Terminal 2',
    terminal: 'Terminal 2 (Tuas Mega)',
    location: 'Singapore Approach Fairway',
    status: 'ARRIVING',
    risk: 34,
    carrier: 'Maersk Line',
    origin: 'Antwerp',
    destination: 'Singapore Port',
    type: 'Container Carrier',
    length: '382.0 m',
    teu: 18200,
    flag: 'Denmark (DNK)',
    builtYear: 2021,
    draft: '15.8 m',
    speed: '18.4 kts',
    healthScore: 88,
    carbonEstimate: '142t CO₂',
    delayFormatted: null,
    isDelayed: false,
    craneAssignment: {
      count: 4,
      cranes: ['C2', 'C4', 'C6', 'C8'],
      productivity: '29 moves/hr per crane',
    },
    yardUtilization: 72,
    aiInsight: {
      header: 'Speed Corridor Optimization',
      body: 'Maersk Polaris is maintaining an optimal 18.4 knot approach speed. Direct fairway priority assigned through Southern Pilot Boarding Ground with zero queue time.',
      confidence: '95% confidence',
      recommendation: 'Maintain current speed to arrive directly at open berth window.',
    },
    timelineEvents: [
      {
        id: 'evt_1',
        time: 'Sep 02, 10:00',
        title: 'Departed Port of Antwerp',
        description: 'Vessel cleared Suez corridor with full TEU loading.',
        status: 'past',
      },
      {
        id: 'evt_2',
        time: 'Sep 13, 19:00',
        title: 'Entered Malacca Traffic Scheme',
        description: 'Passed One Fathom Bank tracking waypoint on schedule.',
        status: 'past',
      },
      {
        id: 'evt_3',
        time: 'Sep 14, 21:00',
        title: 'Pilot Boarding Station PBG-S',
        description: 'Pilot tug rendezvous confirmed for 21:00.',
        status: 'current',
      },
      {
        id: 'evt_4',
        time: 'Sep 14, 22:15',
        title: 'Predicted Berthing at Quay B-07',
        description: 'Mooring team standing by with 4 gantry cranes pre-aligned.',
        status: 'future',
        confidence: '94% confidence',
        interval: 'ETA 22:15 ± 20 min',
        source: 'Automated harbor master scheduling engine',
      },
      {
        id: 'evt_5',
        time: 'Sep 15, 19:30',
        title: 'Predicted Departure for Busan',
        description: 'Cargo turn complete. Fast transit to North Pacific.',
        status: 'future',
        confidence: '90% confidence',
        interval: 'ETD 19:30 ± 45 min',
        source: 'Turnaround crane simulation engine',
      },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Schedule Drift', value: 0.1, unit: 'h', metric: '+0.1h', impactColor: '#34D399' },
        { name: 'B7 Quay Load', value: 2.0, unit: '%', metric: '+2%', impactColor: '#34D399' },
        { name: 'Crane Wait', value: 0.0, unit: 'h', metric: '0.0h', impactColor: '#34D399' },
        { name: 'Next Vessel Impact', value: 0.0, unit: 'h', metric: 'None', impactColor: '#34D399' },
      ],
      aiSummary:
        'Cascading impact summary: Nominal approach with negligible ripple effect. Quay B-07 scheduling is fully synchronized with gantry crane dispatch teams.',
    },
  },

  vsl_04: {
    id: 'vsl_04',
    name: 'CMA CGM Fort St. Louis',
    imo: '9642211',
    eta: '2026-09-15 02:30',
    etaFormatted: 'Tomorrow, 02:30',
    etdFormatted: 'Tomorrow, 18:00',
    berth: 'Berth C-04, Terminal 3',
    terminal: 'Terminal 3 (Jurong Quay)',
    location: 'Singapore Malacca Corridor',
    status: 'ARRIVING',
    risk: 12,
    carrier: 'CMA CGM Group',
    origin: 'Port of Busan',
    destination: 'Singapore Port',
    type: 'Neo-Panamax Container Ship',
    length: '366.0 m',
    teu: 15000,
    flag: 'France (FRA)',
    builtYear: 2020,
    draft: '14.8 m',
    speed: '17.6 kts',
    healthScore: 92,
    carbonEstimate: '118t CO₂',
    delayFormatted: null,
    isDelayed: false,
    craneAssignment: {
      count: 3,
      cranes: ['CR-301', 'CR-302', 'CR-303'],
      productivity: '30 moves/hr per crane',
    },
    yardUtilization: 64,
    aiInsight: {
      header: 'AI Just-In-Time Arrival Efficiency',
      body: 'CMA CGM Fort St. Louis is maintaining smooth 17.6 knot speed. Reserved berth C-04 will clear 45 minutes ahead of pilot boarding window.',
      confidence: '97% confidence',
      recommendation: 'Proceed directly along Fairway Channel 2 for immediate berthing.',
    },
    timelineEvents: [
      { id: 'evt_1', time: 'Sep 08, 12:00', title: 'Departed Port of Busan', description: 'Vessel unberthed with 14,800 TEU load.', status: 'past' },
      { id: 'evt_2', time: 'Sep 14, 02:00', title: 'Cleared Taiwan Strait Passage', description: 'Sailing speed locked at 17.6 kts.', status: 'past' },
      { id: 'evt_3', time: 'Sep 15, 02:30', title: 'Pilot Boarding Station PBG-W', description: 'Tug assistance pre-assigned.', status: 'current' },
      { id: 'evt_4', time: 'Sep 15, 03:45', title: 'Predicted All Fast at Berth C-04', description: 'Mooring team standing by.', status: 'future', confidence: '96% confidence', interval: 'ETA 03:45 ± 10 min' },
      { id: 'evt_5', time: 'Sep 15, 18:00', title: 'Predicted Departure for Colombo', description: 'Container discharge and reload completion.', status: 'future', confidence: '92% confidence', interval: 'ETD 18:00 ± 30 min' },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Arrival Drift', value: 0.0, unit: 'h', metric: 'On Time', impactColor: '#34D399' },
        { name: 'C4 Berth Dwell', value: -2.0, unit: '%', metric: '-2%', impactColor: '#34D399' },
        { name: 'Crane Wait', value: 0.0, unit: 'h', metric: '0.0h', impactColor: '#34D399' },
        { name: 'Turnaround Gain', value: 0.4, unit: 'h', metric: '+0.4h ahead', impactColor: '#34D399' },
      ],
      aiSummary: 'Cascading impact summary: Fully nominal berthing schedule. Zero quay backlog projected.',
    },
  },

  vsl_05: {
    id: 'vsl_05',
    name: 'Ever Given Alpha',
    imo: '9811000',
    eta: '2026-09-15 06:15',
    etaFormatted: 'Tomorrow, 06:15',
    etdFormatted: 'Sep 16, 04:00',
    berth: 'Holding Area Alpha / Berth J-09',
    terminal: 'Terminal 3 (Jurong Quay)',
    location: 'Outer Anchorage Sector 4',
    status: 'DELAYED',
    risk: 88,
    carrier: 'Evergreen Marine',
    origin: 'Port of Hong Kong',
    destination: 'Singapore Port',
    type: 'Golden-Class Mega Container (20K TEU)',
    length: '400.0 m',
    teu: 20124,
    flag: 'Panama (PAN)',
    builtYear: 2018,
    draft: '16.0 m',
    speed: '12.8 kts',
    healthScore: 54,
    carbonEstimate: '210t CO₂',
    delayFormatted: '+8.0h',
    isDelayed: true,
    craneAssignment: {
      count: 4,
      cranes: ['CR-304', 'CR-305', 'CR-306', 'CR-307'],
      productivity: '22 moves/hr per crane',
    },
    yardUtilization: 94,
    aiInsight: {
      header: 'AI Critical Bottleneck Warning',
      body: 'Ever Given Alpha anchorage wait has exceeded 7.8 hours. Risk of ₹24,000/day demurrage penalty. AI recommends executing Smart Reroute to Port of Tanjung Pelepas for 21.5h net gain.',
      confidence: '95% confidence',
      recommendation: 'Divert to Tanjung Pelepas Berth P-02 or execute priority crane gang allocation.',
    },
    timelineEvents: [
      { id: 'evt_1', time: 'Sep 10, 04:00', title: 'Departed Port of Hong Kong', description: 'Vessel sailing delayed by harbor congestion.', status: 'past' },
      { id: 'evt_2', time: 'Sep 14, 18:00', title: 'Arrived Outer Anchorage Alpha', description: 'Holding position waiting for Quay J-09 clearance.', status: 'past' },
      { id: 'evt_3', time: 'Sep 15, 06:15', title: 'Anchorage Hold Duration >7.8h', description: 'Demurrage risk threshold triggered.', status: 'current' },
      { id: 'evt_4', time: 'Sep 15, 14:00', title: 'Predicted Revised Berthing', description: 'Subject to pilotage availability.', status: 'future', confidence: '87% confidence', interval: 'ETA 14:00 ± 90 min' },
      { id: 'evt_5', time: 'Sep 16, 04:00', title: 'Predicted Quay Departure', description: 'Discharge cycle projected complete.', status: 'future', confidence: '82% confidence', interval: 'ETD 04:00 ± 120 min' },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Anchorage Delay', value: 8.0, unit: 'h', metric: '+8.0h', impactColor: '#F87171' },
        { name: 'Jurong Saturation', value: 16, unit: '%', metric: '+16%', impactColor: '#F87171' },
        { name: 'Crane Queue', value: 3.5, unit: 'h', metric: '+3.5h', impactColor: '#F87171' },
        { name: 'Demurrage Penalty', value: 24000, unit: '₹', metric: '₹24,000', impactColor: '#F87171' },
      ],
      aiSummary: 'Cascading impact summary: Critical 8-hour anchorage delay. Highly recommended to execute reroute advisor option to save ₹19,800 and 21.5 hours.',
    },
  },

  vsl_06: {
    id: 'vsl_06',
    name: 'Hapag-Lloyd Express',
    imo: '9723419',
    eta: '2026-09-15 09:45',
    etaFormatted: 'Tomorrow, 09:45',
    etdFormatted: 'Sep 16, 01:30',
    berth: 'Berth A-01, Terminal 1',
    terminal: 'Terminal 1 (Pasir Panjang)',
    location: 'Singapore Western Entrance',
    status: 'AT BERTH',
    risk: 22,
    carrier: 'Hapag-Lloyd',
    origin: 'Port of Hamburg',
    destination: 'Singapore Port',
    type: 'Post-Panamax Boxship',
    length: '368.0 m',
    teu: 14000,
    flag: 'Germany (DEU)',
    builtYear: 2021,
    draft: '15.0 m',
    speed: '19.0 kts',
    healthScore: 90,
    carbonEstimate: '135t CO₂',
    delayFormatted: null,
    isDelayed: false,
    craneAssignment: {
      count: 3,
      cranes: ['CR-101', 'CR-102', 'CR-103'],
      productivity: '31 moves/hr per crane',
    },
    yardUtilization: 62,
    aiInsight: {
      header: 'AI Optimal Discharge Track',
      body: 'Hapag-Lloyd Express is unlading at 93 TEU/hr combined rate. Zero queue delay.',
      confidence: '96% confidence',
      recommendation: 'Maintain active crane gang allocation for on-time departure.',
    },
    timelineEvents: [
      { id: 'evt_1', time: 'Aug 30, 08:00', title: 'Departed Port of Hamburg', description: 'Transatlantic & Suez passage.', status: 'past' },
      { id: 'evt_2', time: 'Sep 14, 20:00', title: 'Entered Singapore TSS Sector 1', description: 'On-time fairway transit.', status: 'past' },
      { id: 'evt_3', time: 'Sep 15, 09:45', title: 'All Fast at Berth A-01', description: '3 STS gantry cranes operational.', status: 'current' },
      { id: 'evt_4', time: 'Sep 16, 01:30', title: 'Predicted Departure for Tokyo', description: 'Cargo operation completion.', status: 'future', confidence: '94% confidence', interval: 'ETD 01:30 ± 15 min' },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Variance', value: 0.0, unit: 'h', metric: '0.0h', impactColor: '#34D399' },
        { name: 'A1 Yard Load', value: -1.5, unit: '%', metric: '-1.5%', impactColor: '#34D399' },
        { name: 'Crane Efficiency', value: 4.0, unit: '%', metric: '+4%', impactColor: '#34D399' },
        { name: 'Next Vessel Impact', value: 0.0, unit: 'h', metric: 'None', impactColor: '#34D399' },
      ],
      aiSummary: 'Cascading impact summary: Clean operational schedule with maximum crane throughput.',
    },
  },

  vsl_07: {
    id: 'vsl_07',
    name: 'ONE Apus Horizon',
    imo: '9934128',
    eta: '2026-09-15 13:00',
    etaFormatted: 'Tomorrow, 13:00',
    etdFormatted: 'Sep 16, 07:00',
    berth: 'Berth B-05, Terminal 2',
    terminal: 'Terminal 2 (Tuas Mega)',
    location: 'South China Sea Approach',
    status: 'ARRIVING',
    risk: 28,
    carrier: 'Ocean Network Express',
    origin: 'Port of Yokohama',
    destination: 'Singapore Port',
    type: 'Container Carrier',
    length: '364.0 m',
    teu: 14052,
    flag: 'Japan (JPN)',
    builtYear: 2022,
    draft: '14.9 m',
    speed: '18.1 kts',
    healthScore: 89,
    carbonEstimate: '128t CO₂',
    delayFormatted: null,
    isDelayed: false,
    craneAssignment: {
      count: 3,
      cranes: ['CR-201', 'CR-202', 'CR-203'],
      productivity: '29 moves/hr per crane',
    },
    yardUtilization: 70,
    aiInsight: {
      header: 'AI Fairway Corridor Optimal',
      body: 'ONE Apus Horizon is approaching at 18.1 knots. Berth B-05 scheduled to clear 20 minutes prior to pilot rendezvous.',
      confidence: '95% confidence',
      recommendation: 'Maintain current velocity vector for seamless berthing.',
    },
    timelineEvents: [
      { id: 'evt_1', time: 'Sep 07, 10:00', title: 'Departed Port of Yokohama', description: 'Full container manifest load.', status: 'past' },
      { id: 'evt_2', time: 'Sep 14, 22:00', title: 'Cleared South China Sea Checkpoint', description: 'Telemetry confirmed.', status: 'past' },
      { id: 'evt_3', time: 'Sep 15, 13:00', title: 'Outer Bar Pilot Station', description: 'Pilot boarding underway.', status: 'current' },
      { id: 'evt_4', time: 'Sep 15, 14:15', title: 'Predicted Berthing at Berth B-05', description: 'Mooring gang standing by.', status: 'future', confidence: '95% confidence', interval: 'ETA 14:15 ± 20 min' },
      { id: 'evt_5', time: 'Sep 16, 07:00', title: 'Predicted Departure for Jebel Ali', description: 'Cargo turn complete.', status: 'future', confidence: '91% confidence', interval: 'ETD 07:00 ± 35 min' },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Schedule Drift', value: 0.1, unit: 'h', metric: '+0.1h', impactColor: '#34D399' },
        { name: 'B5 Load', value: 1.0, unit: '%', metric: '+1%', impactColor: '#34D399' },
        { name: 'Crane Wait', value: 0.0, unit: 'h', metric: '0.0h', impactColor: '#34D399' },
        { name: 'Next Impact', value: 0.0, unit: 'h', metric: 'None', impactColor: '#34D399' },
      ],
      aiSummary: 'Cascading impact summary: On-time transit with smooth quayside handoff.',
    },
  },

  vsl_08: {
    id: 'vsl_08',
    name: 'COSCO Shipping Taurus',
    imo: '9753112',
    eta: '2026-09-15 17:30',
    etaFormatted: 'Tomorrow, 17:30',
    etdFormatted: 'Sep 16, 12:00',
    berth: 'Holding Area Bravo / Berth B-08',
    terminal: 'Terminal 2 (Keppel Super-Hub)',
    location: 'Eastern Anchorage Sector 2',
    status: 'DELAYED',
    risk: 64,
    carrier: 'COSCO Shipping',
    origin: 'Port of Ningbo',
    destination: 'Singapore Port',
    type: 'Ultra-Large Container Vessel',
    length: '399.8 m',
    teu: 20000,
    flag: 'China (CHN)',
    builtYear: 2020,
    draft: '15.6 m',
    speed: '15.4 kts',
    healthScore: 71,
    carbonEstimate: '176t CO₂',
    delayFormatted: '+3.2h',
    isDelayed: true,
    craneAssignment: {
      count: 3,
      cranes: ['CR-204', 'CR-205', 'CR-206'],
      productivity: '26 moves/hr per crane',
    },
    yardUtilization: 82,
    aiInsight: {
      header: 'AI Moderate Congestion Alert',
      body: 'COSCO Shipping Taurus delay of 3.2h will create temporary crane queuing at Keppel Super-Hub. AI recommends adjusting crane allocation from Berth B-09 to clear backlog.',
      confidence: '91% confidence',
      recommendation: 'Reallocate 1 gantry crane from B-09 to reduce turnaround delay by 50 minutes.',
    },
    timelineEvents: [
      { id: 'evt_1', time: 'Sep 09, 16:00', title: 'Departed Port of Ningbo', description: 'Vessel delayed by fog at Ningbo fairway.', status: 'past' },
      { id: 'evt_2', time: 'Sep 15, 12:00', title: 'Entered Eastern Anchorage Sector 2', description: 'Awaiting berth clearance.', status: 'past' },
      { id: 'evt_3', time: 'Sep 15, 17:30', title: 'Delayed Pilot Boarding', description: 'Pilot boarding rescheduled.', status: 'current' },
      { id: 'evt_4', time: 'Sep 15, 20:45', title: 'Predicted Berthing at Berth B-08', description: 'Mooring gantry ready.', status: 'future', confidence: '90% confidence', interval: 'ETA 20:45 ± 40 min' },
      { id: 'evt_5', time: 'Sep 16, 12:00', title: 'Predicted Departure for Rotterdam', description: 'Discharge cycle projected complete.', status: 'future', confidence: '86% confidence', interval: 'ETD 12:00 ± 60 min' },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Initial Delay', value: 3.2, unit: 'h', metric: '+3.2h', impactColor: '#FBBF24' },
        { name: 'Keppel Load', value: 8, unit: '%', metric: '+8%', impactColor: '#FBBF24' },
        { name: 'Crane Queue', value: 1.2, unit: 'h', metric: '+1.2h', impactColor: '#FBBF24' },
        { name: 'Next Impact', value: 0.6, unit: 'h', metric: '+0.6h', impactColor: '#FBBF24' },
      ],
      aiSummary: 'Cascading impact summary: Moderate delay causing brief berth queuing at Keppel. Crane re-allocation mitigates 50% of cascade.',
    },
  },
};

// Fallback generator for other vessels
export const getVesselById = (id: string): VesselDetailData | null => {
  if (vesselsPassportDatabase[id]) {
    return vesselsPassportDatabase[id];
  }

  // Check in upcomingArrivals list and construct fallback
  const found = upcomingArrivals.find((v) => v.id === id);
  if (!found) return null;

  const isDelayed = found.status === 'Delayed';

  return {
    id: found.id,
    name: found.name,
    imo: found.imo,
    eta: found.eta,
    etaFormatted: found.etaFormatted,
    etdFormatted: 'Next day, 18:00',
    berth: found.berth === 'TBD' ? 'Berth B4, Terminal 2' : `Berth ${found.berth}`,
    terminal: 'Terminal 2 (Tuas Mega)',
    location: found.berth === 'TBD' ? 'Outer Anchorage Sector 4' : `Berth ${found.berth}, Terminal 2`,
    status: isDelayed ? 'DELAYED' : found.status === 'Arriving' ? 'ARRIVING' : 'AT BERTH',
    risk: found.risk,
    carrier: found.carrier,
    origin: found.origin,
    destination: 'Singapore Port',
    type: 'Commercial Container Vessel',
    length: '365.0 m',
    teu: found.teu,
    flag: 'Panama (PAN)',
    builtYear: 2020,
    draft: '15.2 m',
    speed: found.speed,
    healthScore: isDelayed ? 58 : 86,
    carbonEstimate: '154t CO₂',
    delayFormatted: isDelayed ? '+4.6h' : null,
    isDelayed,
    craneAssignment: {
      count: 3,
      cranes: ['C1', 'C3', 'C7'],
      productivity: '28 moves/hr per crane',
    },
    yardUtilization: 76,
    aiInsight: {
      header: isDelayed ? 'AI Disruption Warning' : 'AI Operational Insight',
      body: isDelayed
        ? `${found.name} is experiencing arrival delays. Dwell buffer in Berth B4 is constrained. Recommendation: adjust pilot rendezvous to reduce idle tug fuel burn.`
        : `${found.name} is on course with optimal hydrodynamic velocity. Quay berth allocation is clear with zero queue backlog.`,
      confidence: '92% confidence',
      recommendation: isDelayed ? 'Evaluate reassignment to Berth B5.' : 'Maintain current fairway corridor.',
    },
    timelineEvents: [
      {
        id: 'evt_1',
        time: 'Sep 11, 09:00',
        title: `Departed ${found.origin}`,
        description: 'Vessel commenced voyage under scheduled sailing plan.',
        status: 'past',
      },
      {
        id: 'evt_2',
        time: 'Sep 13, 16:00',
        title: 'Strait Inbound Checkpoint',
        description: 'Telemetry verified by Singapore Coastal Radar.',
        status: 'past',
      },
      {
        id: 'evt_3',
        time: found.etaFormatted,
        title: isDelayed ? 'Delayed Pilot Rendezvous' : 'At Berth B4',
        description: isDelayed ? 'Holding at anchorage.' : 'Moored safely at designated quay.',
        status: 'current',
      },
      {
        id: 'evt_4',
        time: 'Tomorrow, 08:00',
        title: 'Predicted Departure',
        description: 'Estimated completion of manifest offloading.',
        status: 'future',
        confidence: '91% confidence',
        interval: 'ETD 08:00 ± 30 min',
        source: 'Port Terminal AIS and gantry dispatch engine',
      },
      {
        id: 'evt_5',
        time: 'Sep 16, 12:00',
        title: 'Predicted Next Port Call',
        description: 'Transshipment delivery to regional feeder hub.',
        status: 'future',
        confidence: '86% confidence',
        interval: 'ETA 12:00 ± 45 min',
        source: 'Automated voyage routing model',
      },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Initial Delay', value: isDelayed ? 4.6 : 0.2, unit: 'h', metric: isDelayed ? '+4.6h' : '+0.2h', impactColor: isDelayed ? '#F87171' : '#34D399' },
        { name: 'B4 Congestion', value: isDelayed ? 12 : 2, unit: '%', metric: isDelayed ? '+12%' : '+2%', impactColor: isDelayed ? '#FBBF24' : '#34D399' },
        { name: 'Crane Queue', value: isDelayed ? 2.0 : 0.1, unit: 'h', metric: isDelayed ? '+2.0h' : '0.1h', impactColor: isDelayed ? '#F87171' : '#34D399' },
        { name: 'Next Vessel Delay', value: isDelayed ? 1.2 : 0.0, unit: 'h', metric: isDelayed ? '+1.2h' : 'None', impactColor: isDelayed ? '#F87171' : '#34D399' },
      ],
      aiSummary: isDelayed
        ? 'Cascading impact summary: The delay propagates a 12% rise in quay congestion, holding 3 cranes in queue and postponing subsequent vessels by 1.2h.'
        : 'Cascading impact summary: Operations are fully nominal with minimal impact across adjacent berths and quay cranes.',
    },
  };
};

export interface VesselArrival {
  id: string;
  name: string;
  imo: string;
  eta: string;
  etaFormatted: string;
  berth: string;
  status: 'On Time' | 'Delayed' | 'Arriving';
  risk: number;
  carrier: string;
  origin: string;
  teu: number;
  speed: string;
}

export const upcomingArrivals: VesselArrival[] = [
  {
    id: 'vsl_01',
    name: 'MV Nova Horizon',
    imo: '9845123',
    eta: '2026-09-14 16:45',
    etaFormatted: 'Today, 16:45',
    berth: 'B-02',
    status: 'On Time',
    risk: 18,
    carrier: 'Nova Maritime',
    origin: 'Rotterdam',
    teu: 24000,
    speed: '19.2 kts',
  },
  {
    id: 'vsl_02',
    name: 'MSC Marina Blue',
    imo: '9784321',
    eta: '2026-09-14 18:20',
    etaFormatted: 'Today, 18:20',
    berth: 'TBD',
    status: 'Delayed',
    risk: 76,
    carrier: 'MSC Mediterranean',
    origin: 'Shanghai',
    teu: 16500,
    speed: '14.1 kts',
  },
  {
    id: 'vsl_03',
    name: 'Maersk Polaris',
    imo: '9921004',
    eta: '2026-09-14 21:00',
    etaFormatted: 'Today, 21:00',
    berth: 'B-07',
    status: 'Arriving',
    risk: 34,
    carrier: 'Maersk Line',
    origin: 'Antwerp',
    teu: 18200,
    speed: '18.4 kts',
  },
  {
    id: 'vsl_04',
    name: 'CMA CGM Fort St. Louis',
    imo: '9642211',
    eta: '2026-09-15 02:30',
    etaFormatted: 'Tomorrow, 02:30',
    berth: 'C-04',
    status: 'On Time',
    risk: 12,
    carrier: 'CMA CGM Group',
    origin: 'Busan',
    teu: 15000,
    speed: '17.6 kts',
  },
  {
    id: 'vsl_05',
    name: 'Ever Given Alpha',
    imo: '9811000',
    eta: '2026-09-15 06:15',
    etaFormatted: 'Tomorrow, 06:15',
    berth: 'TBD',
    status: 'Delayed',
    risk: 88,
    carrier: 'Evergreen Marine',
    origin: 'Hong Kong',
    teu: 20124,
    speed: '12.8 kts',
  },
  {
    id: 'vsl_06',
    name: 'Hapag-Lloyd Express',
    imo: '9723419',
    eta: '2026-09-15 09:45',
    etaFormatted: 'Tomorrow, 09:45',
    berth: 'A-01',
    status: 'On Time',
    risk: 22,
    carrier: 'Hapag-Lloyd',
    origin: 'Hamburg',
    teu: 14000,
    speed: '19.0 kts',
  },
  {
    id: 'vsl_07',
    name: 'ONE Apus Horizon',
    imo: '9934128',
    eta: '2026-09-15 13:00',
    etaFormatted: 'Tomorrow, 13:00',
    berth: 'B-05',
    status: 'Arriving',
    risk: 28,
    carrier: 'Ocean Network Express',
    origin: 'Yokohama',
    teu: 14052,
    speed: '18.1 kts',
  },
  {
    id: 'vsl_08',
    name: 'COSCO Shipping Taurus',
    imo: '9753112',
    eta: '2026-09-15 17:30',
    etaFormatted: 'Tomorrow, 17:30',
    berth: 'TBD',
    status: 'Delayed',
    risk: 64,
    carrier: 'COSCO Shipping',
    origin: 'Ningbo',
    teu: 20000,
    speed: '15.4 kts',
  },
];

export default {
  kpiMetrics,
  fleetStatusHistory,
  terminalCongestionRisk,
  upcomingArrivals,
  vesselsPassportDatabase,
  getVesselById,
};
