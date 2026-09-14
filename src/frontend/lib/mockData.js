// DockNova Mock Data for Vessel Operator Command Center Dashboard & Vessel Passport

export const kpiMetrics = {
  activeVessels: 24,
  upcomingArrivals: 8,
  delayedVessels: 3,
  avgDelayTime: 2.4,
  totalFleetTonnage: '1.42M DWT',
  onTimePercentage: 87.5,
};

export const fleetStatusHistory = [
  { day: 'Mon', onTime: 18, delayed: 3, atPort: 12 },
  { day: 'Tue', onTime: 20, delayed: 2, atPort: 14 },
  { day: 'Wed', onTime: 19, delayed: 4, atPort: 15 },
  { day: 'Thu', onTime: 22, delayed: 2, atPort: 13 },
  { day: 'Fri', onTime: 21, delayed: 4, atPort: 16 },
  { day: 'Sat', onTime: 24, delayed: 3, atPort: 15 },
  { day: 'Sun', onTime: 23, delayed: 3, atPort: 17 },
];

export const terminalCongestionRisk = [
  { terminal: 'T1 - Pasir Panjang', shortName: 'T1', risk: 68, queue: 4, avgWait: '2.8h', fullMark: 100 },
  { terminal: 'T2 - Tuas Mega', shortName: 'T2', risk: 42, queue: 2, avgWait: '1.2h', fullMark: 100 },
  { terminal: 'T3 - Jurong Quay', shortName: 'T3', risk: 85, queue: 6, avgWait: '4.1h', fullMark: 100 },
  { terminal: 'T4 - Keppel Terminal', shortName: 'T4', risk: 30, queue: 1, avgWait: '0.8h', fullMark: 100 },
  { terminal: 'T5 - Brani Terminal', shortName: 'T5', risk: 55, queue: 3, avgWait: '2.1h', fullMark: 100 },
];

export const vesselsPassportDatabase = {
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
      { id: 'evt_1', time: 'Sep 10, 08:00', title: 'Departed Port of Shanghai', description: 'Vessel unberthed with full manifest load of 23,850 TEU.', status: 'past' },
      { id: 'evt_2', time: 'Sep 13, 21:30', title: 'Passed Singapore Outer Fairway', description: 'Vessel entered Traffic Separation Scheme Sector 3 on schedule.', status: 'past' },
      { id: 'evt_3', time: 'Sep 14, 16:45', title: 'All Fast at Berth B4', description: 'Mooring secured at Quay B4 with 3 Super Post-Panamax cranes engaged.', status: 'current' },
      { id: 'evt_4', time: 'Sep 15, 08:30', title: 'Predicted Quay Departure', description: 'Cargo operations projected complete.', status: 'future', confidence: '94% confidence', interval: 'ETD 08:30 ± 15 min' },
      { id: 'evt_5', time: 'Sep 15, 14:00', title: 'Predicted Arrival Tanjung Pelepas', description: 'Feeder transshipment corridor approach via Western Gateway.', status: 'future', confidence: '89% confidence', interval: 'ETA 14:00 ± 35 min' },
      { id: 'evt_6', time: 'Sep 17, 02:00', title: 'Predicted Maintenance Window', description: 'Auxiliary engine scheduled filter maintenance at anchor.', status: 'future', confidence: '98% confidence', interval: 'Window 02:00 - 05:00' },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Initial Deviation', value: 0.2, unit: 'h', metric: '+0.2h', impactColor: '#34D399' },
        { name: 'B4 Berth Dwell', value: -4.0, unit: '%', metric: '-4%', impactColor: '#38BDF8' },
        { name: 'Crane Queue', value: 0.1, unit: 'h', metric: '0.1h', impactColor: '#34D399' },
        { name: 'Turnaround Gain', value: 0.5, unit: 'h', metric: '+0.5h ahead', impactColor: '#34D399' },
      ],
      aiSummary: 'Cascading impact summary: Vessel is proceeding ahead of nominal turnaround curves. Discharge operations are freeing Berth B4 for subsequent vessel arrival 25 minutes ahead of schedule.',
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
      { id: 'evt_1', time: 'Sep 09, 14:00', title: 'Departed Port of Ningbo', description: 'Vessel delayed by typhoon diversion in East China Sea.', status: 'past' },
      { id: 'evt_2', time: 'Sep 13, 04:15', title: 'Passed Malacca Strait Gateway', description: 'Heavy fairway traffic caused reduction to 11.2 knots.', status: 'past' },
      { id: 'evt_3', time: 'Sep 14, 18:20', title: 'Delayed Arrival at Pilot Station', description: 'Holding at Eastern Anchorage awaiting pilot clearance.', status: 'current' },
      { id: 'evt_4', time: 'Sep 14, 21:30', title: 'Predicted Berthing at Quay B4/B5', description: 'Dynamic slot negotiation pending port master approval.', status: 'future', confidence: '91% confidence', interval: 'ETA 21:30 ± 45 min' },
      { id: 'evt_5', time: 'Sep 15, 14:00', title: 'Predicted Quay Departure', description: 'Discharge and reload scheduled.', status: 'future', confidence: '84% confidence', interval: 'ETD 14:00 ± 60 min' },
      { id: 'evt_6', time: 'Sep 16, 06:00', title: 'Predicted Port Klang Arrival', description: 'Next port call sequence adjusted for 4.6h cascade.', status: 'future', confidence: '88% confidence', interval: 'ETA 06:00 ± 40 min' },
    ],
    impactAnalysis: {
      cascadeSteps: [
        { name: 'Initial Delay', value: 4.6, unit: 'h', metric: '+4.6h', impactColor: '#F87171' },
        { name: 'B4 Congestion', value: 12, unit: '%', metric: '+12%', impactColor: '#FBBF24' },
        { name: 'Crane Queue', value: 2.0, unit: 'h', metric: '+2.0h', impactColor: '#F87171' },
        { name: 'Next Vessel Delay', value: 1.2, unit: 'h', metric: '+1.2h', impactColor: '#F87171' },
      ],
      aiSummary: "Cascading impact summary: The vessel's 4.6h delay triggers a bottleneck for Quay B4 cranes, elevating terminal dwell time by 12% and pushing subsequent feeder vessel berthing back by 1.2h unless reassigned to Berth B5.",
    },
  },
};

export const getVesselById = (id) => {
  if (vesselsPassportDatabase[id]) return vesselsPassportDatabase[id];
  return null;
};

export const upcomingArrivals = [
  { id: 'vsl_01', name: 'MV Nova Horizon', imo: '9845123', eta: '2026-09-14 16:45', etaFormatted: 'Today, 16:45', berth: 'B-02', status: 'On Time', risk: 18, carrier: 'Nova Maritime', origin: 'Rotterdam', teu: 24000, speed: '19.2 kts' },
  { id: 'vsl_02', name: 'MSC Marina Blue', imo: '9784321', eta: '2026-09-14 18:20', etaFormatted: 'Today, 18:20', berth: 'TBD', status: 'Delayed', risk: 76, carrier: 'MSC Mediterranean', origin: 'Shanghai', teu: 16500, speed: '14.1 kts' },
  { id: 'vsl_03', name: 'Maersk Polaris', imo: '9921004', eta: '2026-09-14 21:00', etaFormatted: 'Today, 21:00', berth: 'B-07', status: 'Arriving', risk: 34, carrier: 'Maersk Line', origin: 'Antwerp', teu: 18200, speed: '18.4 kts' },
];

export default {
  kpiMetrics,
  fleetStatusHistory,
  terminalCongestionRisk,
  upcomingArrivals,
  vesselsPassportDatabase,
  getVesselById,
};
