// Mock Notifications Dataset for DockNova Maritime Control Room

export type NotificationType = 'alert' | 'update' | 'ai';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  fullMessage?: string;
  timestamp: string;
  timestampRaw?: string;
  isUnread: boolean;
  vesselId?: string;
  vesselName?: string;
  categoryTag?: string;
  actionType?: 'view-vessel' | 'see-route' | 'general';
  actionLabel?: string;
  actionUrl?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'Critical Congestion Impending at Berth B4',
    message: 'MSC Marina Blue reporting 4.6h delay cascading to 94% berth saturation at Tuas Mega Terminal.',
    fullMessage: 'Telemetry from Malacca Strait Sector 4 confirms MSC Marina Blue (IMO 9784321) has encountered fairway bottlenecks. Arrival delayed from 13:40 to 18:20, causing berth dwell collisions at Berth B4. Recommend immediate reroute simulation or crane gang reallocation to prevent ₹18,500 demurrage escalation.',
    timestamp: '12 minutes ago',
    isUnread: true,
    vesselId: 'vsl_02',
    vesselName: 'MSC Marina Blue',
    categoryTag: 'Berth Saturation',
    actionType: 'see-route',
    actionLabel: 'Evaluate Reroute',
    actionUrl: '/user/routes',
  },
  {
    id: 'notif-2',
    type: 'ai',
    title: 'IBM Bob Copilot: Reroute Advantage Available',
    message: 'Port of Tanjung Pelepas (PTP) diversion offers projected savings of ₹14,600 and 18.2 hours.',
    fullMessage: 'AI route optimizer has detected 3 available berths at Port of Tanjung Pelepas with zero waiting queue. Diverting MSC Marina Blue via Western Gateway corridor minimizes bunker idle burn and eliminates pilot station holding delays. Net projected savings: ₹14,600 and 18.2 hours.',
    timestamp: '25 minutes ago',
    isUnread: true,
    vesselId: 'vsl_02',
    vesselName: 'MSC Marina Blue',
    categoryTag: 'Route Optimization',
    actionType: 'see-route',
    actionLabel: 'Open Route Advisor',
    actionUrl: '/user/routes',
  },
  {
    id: 'notif-3',
    type: 'alert',
    title: 'Severe Squall Warning — Singapore Strait Sector 4',
    message: 'Sudden localized gusts exceeding 42 knots with reduced fairway visibility to 0.8 NM.',
    fullMessage: 'Maritime and Port Authority (MPA) Doppler radar has issued a severe meteorological warning across Singapore Strait Traffic Separation Scheme (TSS) Sector 4. Vessels are advised to maintain minimum 1.5 NM separation and test auxiliary steering gear prior to pilotage boarding.',
    timestamp: '48 minutes ago',
    isUnread: true,
    categoryTag: 'Weather Warning',
    actionType: 'general',
    actionLabel: 'View Fairway Radar',
    actionUrl: '/user',
  },
  {
    id: 'notif-4',
    type: 'update',
    title: 'Vessel All Fast at Berth B-02',
    message: 'MV Nova Horizon has completed mooring procedures 12 minutes ahead of scheduled pilot boarding.',
    fullMessage: 'MV Nova Horizon (IMO 9845123) successfully berthed at Pasir Panjang Terminal Berth B-02. 3 Super Post-Panamax quay cranes (C1, C3, C7) engaged with initial discharge operations commencing immediately at 32 moves/hr per crane.',
    timestamp: '1 hour ago',
    isUnread: true,
    vesselId: 'vsl_01',
    vesselName: 'MV Nova Horizon',
    categoryTag: 'Berth Operations',
    actionType: 'view-vessel',
    actionLabel: 'View Vessel Passport',
    actionUrl: '/user/vessel/vsl_01',
  },
  {
    id: 'notif-5',
    type: 'update',
    title: 'Quay Crane Gang Reallocation Complete',
    message: 'Terminal operations assigned Crane Gang C4 to accelerate turnaround of Evergreen vessels.',
    fullMessage: 'Tuas Terminal Control has dispatched auxiliary crane gang C4 to reinforce Quay B2. Container discharge throughput forecast increased from 24 to 34 moves per hour, compressing vessel turnaround window by 45 minutes.',
    timestamp: '2 hours ago',
    isUnread: false,
    categoryTag: 'Terminal Equipment',
    actionType: 'general',
    actionLabel: 'View Terminal Ops',
    actionUrl: '/user',
  },
  {
    id: 'notif-6',
    type: 'ai',
    title: 'Predicted Turnaround Gain Detected (+8.4%)',
    message: 'Turnaround curve analysis predicts MV Nova Horizon will free Berth B-02 35 minutes early.',
    fullMessage: 'Deep learning discharge tracker observes optimal hatch cover sequencing on MV Nova Horizon. Terminal dwell projection revised down from 14.5h to 13.9h, creating an opening for incoming feeder vessel CMA CGM Fort St. Louis.',
    timestamp: '3 hours ago',
    isUnread: true,
    vesselId: 'vsl_01',
    vesselName: 'MV Nova Horizon',
    categoryTag: 'Predictive Analytics',
    actionType: 'view-vessel',
    actionLabel: 'Inspect Timeline',
    actionUrl: '/user/vessel/vsl_01',
  },
  {
    id: 'notif-7',
    type: 'alert',
    title: 'Demurrage Liability Threshold Warning',
    message: 'Ever Given Alpha anchorage wait approaching 8-hour tier with ₹24,000/day penalty risk.',
    fullMessage: 'Ever Given Alpha (IMO 9811000) has been anchored in Holding Area Alpha for 7.8 hours due to Jurong Quay saturation. Crossing the 8.0h threshold triggers contractual carrier demurrage penalties of ₹24,000/day. Priority pilot clearance requested.',
    timestamp: '4 hours ago',
    isUnread: false,
    vesselId: 'vsl_05',
    vesselName: 'Ever Given Alpha',
    categoryTag: 'Financial Risk',
    actionType: 'see-route',
    actionLabel: 'Evaluate Port Klang',
    actionUrl: '/user/routes',
  },
  {
    id: 'notif-8',
    type: 'update',
    title: 'Bunker Barge Refueling Confirmed',
    message: 'Delivery of 1,200 metric tons VLSFO approved at Eastern Anchorage Sector Bravo.',
    fullMessage: 'Port Authority bunker licensing clearance confirmed for barge Marine Pioneer 8. Pumping operations scheduled between 22:00 and 02:30. Fuel quality compliance certificates logged on maritime registry.',
    timestamp: '6 hours ago',
    isUnread: false,
    categoryTag: 'Bunker Supply',
    actionType: 'general',
    actionLabel: 'View Bunker Manifest',
    actionUrl: '/user',
  },
  {
    id: 'notif-9',
    type: 'ai',
    title: 'Optimal Fairway Speed Corridor Active',
    message: 'Corridor speed reduction to 13.2 kts eliminates waiting time at Outer Bar Pilot Station.',
    fullMessage: 'Real-time fairway queue simulation indicates reducing steaming speed by 1.6 kts eliminates 2.8 hours of auxiliary engine idling at anchorage, saving an estimated 4.2 tons of bunker fuel and 13.1 tons of carbon emissions.',
    timestamp: '8 hours ago',
    isUnread: false,
    categoryTag: 'Eco Steaming',
    actionType: 'see-route',
    actionLabel: 'View Speed Corridor',
    actionUrl: '/user/routes',
  },
  {
    id: 'notif-10',
    type: 'update',
    title: 'Port Klang Route Clearance Approved',
    message: 'Westports VTS has pre-approved container vessel priority fairway entry corridor.',
    fullMessage: 'Digital port clearance exchange with Port Klang Authority finalized. Pre-allocated berth W-07 secured with 2 Super Post-Panamax cranes standby. Customs e-manifest cleared.',
    timestamp: '11 hours ago',
    isUnread: false,
    categoryTag: 'Port Authority Clearance',
    actionType: 'see-route',
    actionLabel: 'Review Port Klang',
    actionUrl: '/user/routes',
  },
];
