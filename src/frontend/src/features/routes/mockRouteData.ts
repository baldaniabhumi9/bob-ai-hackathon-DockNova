// Mock Data for Alternate Routing Advisor (Smart Reroute Advisor)

export interface CostBreakdown {
  fuel: number;
  portFee: number;
  deviation: number;
  total: number;
}

export interface RadarPoint {
  metric: string;
  original: number;
  alternate: number;
  fullMark: number;
  originalFormatted: string;
  alternateFormatted: string;
}

export interface AlternatePortOption {
  id: string;
  name: string;
  flag: string;
  country: string;
  portCode: string;
  distanceNM: number;
  eta: string;
  etaDetail: string;
  berthAvailability: string;
  berthStatus: 'high' | 'moderate' | 'low';
  berthCountFree: number;
  congestionRisk: number; // 0-100
  congestionBadge: 'LOW' | 'MODERATE' | 'CRITICAL';
  costBreakdown: CostBreakdown;
  isAiBestMatch?: boolean;
  savingsTime: string;
  savingsCost: number;
  netSavingsFormatted: string;
  reservedBerth: string;
  vhfChannel: string;
  radarScores: RadarPoint[];
  summaryTable: {
    category: string;
    original: string;
    alternate: string;
    variance: string;
    winner: 'original' | 'alternate' | 'tie';
  }[];
}

export interface RoutingVessel {
  id: string;
  name: string;
  imo: string;
  type: string;
  carrier: string;
  currentSpeed: string;
  currentLocation: string;
  originalDestination: {
    port: string;
    terminal: string;
    berth: string;
    congestionRisk: number; // e.g. 94
    congestionStatus: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
    estimatedWaitTime: string;
    berthUtilization: number; // e.g. 94%
    anchorageQueue: number;
    demurrageRatePerDay: number;
    projectedDemurrage: number;
  };
  alternateOptions: AlternatePortOption[];
}

export const routingVesselsDatabase: Record<string, RoutingVessel> = {
  vsl_02: {
    id: 'vsl_02',
    name: 'MSC Marina Blue',
    imo: '9784321',
    type: 'Post-Panamax Boxship (16,500 TEU)',
    carrier: 'MSC Mediterranean Shipping',
    currentSpeed: '14.1 kts',
    currentLocation: 'Malacca Strait Sector 4 — Eastbound',
    originalDestination: {
      port: 'Port of Singapore',
      terminal: 'Tuas Mega Terminal (Phase 1)',
      berth: 'Berth B4',
      congestionRisk: 94,
      congestionStatus: 'CRITICAL',
      estimatedWaitTime: '6.8h dwell / 4.6h delay',
      berthUtilization: 94,
      anchorageQueue: 7,
      demurrageRatePerDay: 22000,
      projectedDemurrage: 18500,
    },
    alternateOptions: [
      {
        id: 'opt_ptp',
        name: 'Port of Tanjung Pelepas',
        flag: '🇲🇾',
        country: 'Malaysia',
        portCode: 'MYTPP',
        distanceNM: 28,
        eta: 'Today, 20:30',
        etaDetail: '2h 10m steaming time @ 13.5 kts',
        berthAvailability: '3 berths free',
        berthStatus: 'high',
        berthCountFree: 3,
        congestionRisk: 18,
        congestionBadge: 'LOW',
        isAiBestMatch: true,
        costBreakdown: {
          fuel: 3200,
          portFee: 8400,
          deviation: 1800,
          total: 13400,
        },
        savingsTime: '18.2h saved',
        savingsCost: 14600,
        netSavingsFormatted: '₹14,600 + 18.2h saved',
        reservedBerth: 'Berth P-03 (West Quay)',
        vhfChannel: 'VHF Ch 12 (PTP Control)',
        radarScores: [
          { metric: 'Time Saved', original: 25, alternate: 95, fullMark: 100, originalFormatted: '4.6h delay', alternateFormatted: '18.2h saved' },
          { metric: 'Fuel Cost', original: 38, alternate: 88, fullMark: 100, originalFormatted: '₹8,900 idle burn', alternateFormatted: '₹3,200 transit' },
          { metric: 'Port Fee', original: 45, alternate: 78, fullMark: 100, originalFormatted: '₹14,200 dues', alternateFormatted: '₹8,400 dues' },
          { metric: 'Berth Availability', original: 15, alternate: 96, fullMark: 100, originalFormatted: '0 free (Queue: 7)', alternateFormatted: '3 free berths' },
          { metric: 'Carbon Impact', original: 30, alternate: 92, fullMark: 100, originalFormatted: '38.4t CO₂ idling', alternateFormatted: '8.6t CO₂ net' },
        ],
        summaryTable: [
          {
            category: 'Voyage Transit & Wait Time',
            original: '22.8 hours (Anchorage dwell + queue)',
            alternate: '4.6 hours (Direct berthing P-03)',
            variance: '-18.2 hours (79% faster)',
            winner: 'alternate',
          },
          {
            category: 'Total Bunker Fuel Cost',
            original: '₹8,900 (Aux generator idle at anchor)',
            alternate: '₹3,200 (Short 28 NM diversion)',
            variance: '-₹5,700 fuel saved',
            winner: 'alternate',
          },
          {
            category: 'Port Tariffs & Dues',
            original: '₹14,200 (Singapore Tuas Mega base)',
            alternate: '₹8,400 (PTP transshipment tariff)',
            variance: '-₹5,800 port dues saved',
            winner: 'alternate',
          },
          {
            category: 'Estimated Carbon Emissions (CO₂)',
            original: '38.4 tons (Prolonged auxiliary burn)',
            alternate: '8.6 tons (Efficient approach corridor)',
            variance: '-29.8 tons CO₂ (77% reduction)',
            winner: 'alternate',
          },
          {
            category: 'Congestion & Demurrage Liability',
            original: '₹18,500 (Critical 94% risk bracket)',
            alternate: '₹0 (Guaranteed zero anchorage delay)',
            variance: '-₹18,500 penalty avoided',
            winner: 'alternate',
          },
        ],
      },
      {
        id: 'opt_klang',
        name: 'Port Klang (Westports)',
        flag: '🇲🇾',
        country: 'Malaysia',
        portCode: 'MYPKG',
        distanceNM: 192,
        eta: 'Tomorrow, 08:45',
        etaDetail: '13h 40m steaming time @ 14.0 kts',
        berthAvailability: '2 berths free',
        berthStatus: 'moderate',
        berthCountFree: 2,
        congestionRisk: 46,
        congestionBadge: 'MODERATE',
        costBreakdown: {
          fuel: 14800,
          portFee: 7900,
          deviation: 5200,
          total: 27900,
        },
        savingsTime: '10.4h saved',
        savingsCost: 8200,
        netSavingsFormatted: '₹8,200 + 10.4h saved',
        reservedBerth: 'Berth W-07',
        vhfChannel: 'VHF Ch 16/14 (Westports Port Control)',
        radarScores: [
          { metric: 'Time Saved', original: 25, alternate: 68, fullMark: 100, originalFormatted: '4.6h delay', alternateFormatted: '10.4h saved' },
          { metric: 'Fuel Cost', original: 38, alternate: 55, fullMark: 100, originalFormatted: '₹8,900 idle burn', alternateFormatted: '₹14,800 transit' },
          { metric: 'Port Fee', original: 45, alternate: 82, fullMark: 100, originalFormatted: '₹14,200 dues', alternateFormatted: '₹7,900 dues' },
          { metric: 'Berth Availability', original: 15, alternate: 72, fullMark: 100, originalFormatted: '0 free (Queue: 7)', alternateFormatted: '2 free berths' },
          { metric: 'Carbon Impact', original: 30, alternate: 60, fullMark: 100, originalFormatted: '38.4t CO₂', alternateFormatted: '24.2t CO₂' },
        ],
        summaryTable: [
          {
            category: 'Voyage Transit & Wait Time',
            original: '22.8 hours (Anchorage dwell + queue)',
            alternate: '14.2 hours (Direct berthing W-07)',
            variance: '-8.6 hours (38% faster)',
            winner: 'alternate',
          },
          {
            category: 'Total Bunker Fuel Cost',
            original: '₹8,900 (Auxiliary idle burn)',
            alternate: '₹14,800 (192 NM transit fuel)',
            variance: '+₹5,900 additional fuel',
            winner: 'original',
          },
          {
            category: 'Port Tariffs & Dues',
            original: '₹14,200 (Singapore base)',
            alternate: '₹7,900 (Westports tariff rate)',
            variance: '-₹6,300 port dues saved',
            winner: 'alternate',
          },
          {
            category: 'Estimated Carbon Emissions (CO₂)',
            original: '38.4 tons (Auxiliary burn)',
            alternate: '24.2 tons (En route combustion)',
            variance: '-14.2 tons CO₂',
            winner: 'alternate',
          },
          {
            category: 'Congestion & Demurrage Liability',
            original: '₹18,500 (94% critical risk)',
            alternate: '₹4,200 (46% moderate risk)',
            variance: '-₹14,300 risk reduction',
            winner: 'alternate',
          },
        ],
      },
      {
        id: 'opt_laem',
        name: 'Port of Laem Chabang',
        flag: '🇹🇭',
        country: 'Thailand',
        portCode: 'THLCH',
        distanceNM: 785,
        eta: 'Sep 16, 14:00',
        etaDetail: '54h steaming time @ 14.5 kts',
        berthAvailability: '5 berths free',
        berthStatus: 'high',
        berthCountFree: 5,
        congestionRisk: 24,
        congestionBadge: 'LOW',
        costBreakdown: {
          fuel: 48500,
          portFee: 6800,
          deviation: 16500,
          total: 71800,
        },
        savingsTime: '4.0h saved',
        savingsCost: -12400,
        netSavingsFormatted: '₹12,400 (Long Haul Option) + 4h saved',
        reservedBerth: 'Berth C-02',
        vhfChannel: 'VHF Ch 10 (Laem Chabang VTS)',
        radarScores: [
          { metric: 'Time Saved', original: 25, alternate: 45, fullMark: 100, originalFormatted: '4.6h delay', alternateFormatted: '4.0h saved' },
          { metric: 'Fuel Cost', original: 38, alternate: 25, fullMark: 100, originalFormatted: '₹8,900 idle burn', alternateFormatted: '₹48,500 transit' },
          { metric: 'Port Fee', original: 45, alternate: 92, fullMark: 100, originalFormatted: '₹14,200 dues', alternateFormatted: '₹6,800 dues' },
          { metric: 'Berth Availability', original: 15, alternate: 98, fullMark: 100, originalFormatted: '0 free', alternateFormatted: '5 free berths' },
          { metric: 'Carbon Impact', original: 30, alternate: 35, fullMark: 100, originalFormatted: '38.4t CO₂', alternateFormatted: '68.0t CO₂' },
        ],
        summaryTable: [
          {
            category: 'Voyage Transit & Wait Time',
            original: '22.8 hours (Singapore queue)',
            alternate: '56.0 hours (Gulf of Thailand passage)',
            variance: '+33.2 hours total voyage',
            winner: 'original',
          },
          {
            category: 'Total Bunker Fuel Cost',
            original: '₹8,900 (Idle burn)',
            alternate: '₹48,500 (Deep sea passage)',
            variance: '+₹39,600 fuel burn',
            winner: 'original',
          },
          {
            category: 'Port Tariffs & Dues',
            original: '₹14,200 (Singapore base)',
            alternate: '₹6,800 (Laem Chabang standard tariff)',
            variance: '-₹7,400 port dues saved',
            winner: 'alternate',
          },
          {
            category: 'Estimated Carbon Emissions (CO₂)',
            original: '38.4 tons (Idle at anchor)',
            alternate: '68.0 tons (Extended voyage)',
            variance: '+29.6 tons CO₂',
            winner: 'original',
          },
          {
            category: 'Congestion & Demurrage Liability',
            original: '₹18,500 (Critical 94% risk)',
            alternate: '₹1,500 (Terminal guarantee)',
            variance: '-₹17,000 risk reduction',
            winner: 'alternate',
          },
        ],
      },
    ],
  },
  vsl_01: {
    id: 'vsl_01',
    name: 'MV Nova Horizon',
    imo: '9845123',
    type: 'Ultra-Large Container Vessel (24,000 TEU)',
    carrier: 'Nova Maritime Alliance',
    currentSpeed: '19.2 kts',
    currentLocation: 'South China Sea — Approaching Singapore Strait',
    originalDestination: {
      port: 'Port of Singapore',
      terminal: 'Pasir Panjang Terminal (PPT)',
      berth: 'Berth B-02',
      congestionRisk: 68,
      congestionStatus: 'HIGH',
      estimatedWaitTime: '3.2h dwell / 1.8h fairway queue',
      berthUtilization: 78,
      anchorageQueue: 4,
      demurrageRatePerDay: 28000,
      projectedDemurrage: 9400,
    },
    alternateOptions: [
      {
        id: 'opt_ptp_01',
        name: 'Port of Tanjung Pelepas',
        flag: '🇲🇾',
        country: 'Malaysia',
        portCode: 'MYTPP',
        distanceNM: 32,
        eta: 'Today, 18:15',
        etaDetail: '1h 45m steaming time @ 18.0 kts',
        berthAvailability: '3 berths free',
        berthStatus: 'high',
        berthCountFree: 3,
        congestionRisk: 18,
        congestionBadge: 'LOW',
        isAiBestMatch: true,
        costBreakdown: {
          fuel: 4100,
          portFee: 9200,
          deviation: 1500,
          total: 14800,
        },
        savingsTime: '7.8h saved',
        savingsCost: 9800,
        netSavingsFormatted: '₹9,800 + 7.8h saved',
        reservedBerth: 'Berth P-01 (ULCV Crane Gang)',
        vhfChannel: 'VHF Ch 12 (PTP Control)',
        radarScores: [
          { metric: 'Time Saved', original: 45, alternate: 92, fullMark: 100, originalFormatted: '1.8h queue', alternateFormatted: '7.8h saved' },
          { metric: 'Fuel Cost', original: 50, alternate: 84, fullMark: 100, originalFormatted: '₹7,200 idle', alternateFormatted: '₹4,100 transit' },
          { metric: 'Port Fee', original: 40, alternate: 75, fullMark: 100, originalFormatted: '₹16,500 dues', alternateFormatted: '₹9,200 dues' },
          { metric: 'Berth Availability', original: 35, alternate: 94, fullMark: 100, originalFormatted: '1 berth tight', alternateFormatted: '3 free berths' },
          { metric: 'Carbon Impact', original: 42, alternate: 89, fullMark: 100, originalFormatted: '26.8t CO₂', alternateFormatted: '9.4t CO₂' },
        ],
        summaryTable: [
          {
            category: 'Voyage Transit & Wait Time',
            original: '12.4 hours (Singapore PPT schedule)',
            alternate: '4.6 hours (Direct berthing P-01)',
            variance: '-7.8 hours (63% faster)',
            winner: 'alternate',
          },
          {
            category: 'Total Bunker Fuel Cost',
            original: '₹7,200 (Low speed standby)',
            alternate: '₹4,100 (32 NM divert sprint)',
            variance: '-₹3,100 fuel saved',
            winner: 'alternate',
          },
          {
            category: 'Port Tariffs & Dues',
            original: '₹16,500 (Singapore ULCV base rate)',
            alternate: '₹9,200 (PTP ULCV partner rate)',
            variance: '-₹7,300 port dues saved',
            winner: 'alternate',
          },
          {
            category: 'Estimated Carbon Emissions (CO₂)',
            original: '26.8 tons (Hold pattern)',
            alternate: '9.4 tons (Direct approach corridor)',
            variance: '-17.4 tons CO₂',
            winner: 'alternate',
          },
          {
            category: 'Congestion & Demurrage Liability',
            original: '₹9,400 (68% high risk)',
            alternate: '₹0 (Guaranteed clear quay slot)',
            variance: '-₹9,400 penalty avoided',
            winner: 'alternate',
          },
        ],
      },
      {
        id: 'opt_klang_01',
        name: 'Port Klang (Westports)',
        flag: '🇲🇾',
        country: 'Malaysia',
        portCode: 'MYPKG',
        distanceNM: 205,
        eta: 'Tomorrow, 06:30',
        etaDetail: '11h 15m steaming time @ 18.2 kts',
        berthAvailability: '2 berths free',
        berthStatus: 'moderate',
        berthCountFree: 2,
        congestionRisk: 46,
        congestionBadge: 'MODERATE',
        costBreakdown: {
          fuel: 18200,
          portFee: 8800,
          deviation: 6100,
          total: 33100,
        },
        savingsTime: '3.2h saved',
        savingsCost: 4500,
        netSavingsFormatted: '₹4,500 + 3.2h saved',
        reservedBerth: 'Berth W-04',
        vhfChannel: 'VHF Ch 14 (Westports VTS)',
        radarScores: [
          { metric: 'Time Saved', original: 45, alternate: 65, fullMark: 100, originalFormatted: '1.8h queue', alternateFormatted: '3.2h saved' },
          { metric: 'Fuel Cost', original: 50, alternate: 48, fullMark: 100, originalFormatted: '₹7,200 idle', alternateFormatted: '₹18,200 transit' },
          { metric: 'Port Fee', original: 40, alternate: 80, fullMark: 100, originalFormatted: '₹16,500 dues', alternateFormatted: '₹8,800 dues' },
          { metric: 'Berth Availability', original: 35, alternate: 70, fullMark: 100, originalFormatted: '1 berth tight', alternateFormatted: '2 free berths' },
          { metric: 'Carbon Impact', original: 42, alternate: 52, fullMark: 100, originalFormatted: '26.8t CO₂', alternateFormatted: '29.5t CO₂' },
        ],
        summaryTable: [
          {
            category: 'Voyage Transit & Wait Time',
            original: '12.4 hours',
            alternate: '11.5 hours',
            variance: '-0.9 hours saved',
            winner: 'alternate',
          },
          {
            category: 'Total Bunker Fuel Cost',
            original: '₹7,200',
            alternate: '₹18,200',
            variance: '+₹11,000 higher burn',
            winner: 'original',
          },
          {
            category: 'Port Tariffs & Dues',
            original: '₹16,500',
            alternate: '₹8,800',
            variance: '-₹7,700 saved',
            winner: 'alternate',
          },
          {
            category: 'Estimated Carbon Emissions (CO₂)',
            original: '26.8 tons',
            alternate: '29.5 tons',
            variance: '+2.7 tons CO₂',
            winner: 'original',
          },
          {
            category: 'Congestion & Demurrage Liability',
            original: '₹9,400',
            alternate: '₹2,800',
            variance: '-₹6,600 risk reduction',
            winner: 'alternate',
          },
        ],
      },
      {
        id: 'opt_laem_01',
        name: 'Port of Laem Chabang',
        flag: '🇹🇭',
        country: 'Thailand',
        portCode: 'THLCH',
        distanceNM: 790,
        eta: 'Sep 16, 09:00',
        etaDetail: '43h steaming time @ 18.5 kts',
        berthAvailability: '5 berths free',
        berthStatus: 'high',
        berthCountFree: 5,
        congestionRisk: 24,
        congestionBadge: 'LOW',
        costBreakdown: {
          fuel: 56000,
          portFee: 7500,
          deviation: 18000,
          total: 81500,
        },
        savingsTime: '1.5h saved',
        savingsCost: -18000,
        netSavingsFormatted: '₹18,000 (Hub Feeder Redirect) + 1.5h saved',
        reservedBerth: 'Berth C-01',
        vhfChannel: 'VHF Ch 10 (Laem Chabang VTS)',
        radarScores: [
          { metric: 'Time Saved', original: 45, alternate: 40, fullMark: 100, originalFormatted: '1.8h queue', alternateFormatted: '1.5h saved' },
          { metric: 'Fuel Cost', original: 50, alternate: 20, fullMark: 100, originalFormatted: '₹7,200 idle', alternateFormatted: '₹56,000 transit' },
          { metric: 'Port Fee', original: 40, alternate: 88, fullMark: 100, originalFormatted: '₹16,500 dues', alternateFormatted: '₹7,500 dues' },
          { metric: 'Berth Availability', original: 35, alternate: 98, fullMark: 100, originalFormatted: '1 berth tight', alternateFormatted: '5 free berths' },
          { metric: 'Carbon Impact', original: 42, alternate: 30, fullMark: 100, originalFormatted: '26.8t CO₂', alternateFormatted: '78.5t CO₂' },
        ],
        summaryTable: [
          {
            category: 'Voyage Transit & Wait Time',
            original: '12.4 hours',
            alternate: '45.0 hours',
            variance: '+32.6 hours',
            winner: 'original',
          },
          {
            category: 'Total Bunker Fuel Cost',
            original: '₹7,200',
            alternate: '₹56,000',
            variance: '+₹48,800 fuel cost',
            winner: 'original',
          },
          {
            category: 'Port Tariffs & Dues',
            original: '₹16,500',
            alternate: '₹7,500',
            variance: '-₹9,000 port fee',
            winner: 'alternate',
          },
          {
            category: 'Estimated Carbon Emissions (CO₂)',
            original: '26.8 tons',
            alternate: '78.5 tons',
            variance: '+51.7 tons CO₂',
            winner: 'original',
          },
          {
            category: 'Congestion & Demurrage Liability',
            original: '₹9,400',
            alternate: '₹1,200',
            variance: '-₹8,200 risk reduction',
            winner: 'alternate',
          },
        ],
      },
    ],
  },
  vsl_05: {
    id: 'vsl_05',
    name: 'Ever Given Alpha',
    imo: '9811000',
    type: 'Golden-Class Boxship (20,124 TEU)',
    carrier: 'Evergreen Marine',
    currentSpeed: '12.8 kts',
    currentLocation: 'Singapore Fairway Anchorage — Holding Area Alpha',
    originalDestination: {
      port: 'Port of Singapore',
      terminal: 'Jurong Quay Container Terminal',
      berth: 'Berth J-09',
      congestionRisk: 96,
      congestionStatus: 'CRITICAL',
      estimatedWaitTime: '9.2h dwell / 8.0h queue',
      berthUtilization: 98,
      anchorageQueue: 11,
      demurrageRatePerDay: 25000,
      projectedDemurrage: 24000,
    },
    alternateOptions: [
      {
        id: 'opt_ptp_05',
        name: 'Port of Tanjung Pelepas',
        flag: '🇲🇾',
        country: 'Malaysia',
        portCode: 'MYTPP',
        distanceNM: 24,
        eta: 'Today, 19:45',
        etaDetail: '1h 55m steaming time @ 12.5 kts',
        berthAvailability: '3 berths free',
        berthStatus: 'high',
        berthCountFree: 3,
        congestionRisk: 18,
        congestionBadge: 'LOW',
        isAiBestMatch: true,
        costBreakdown: {
          fuel: 2800,
          portFee: 8500,
          deviation: 1600,
          total: 12900,
        },
        savingsTime: '21.5h saved',
        savingsCost: 19800,
        netSavingsFormatted: '₹19,800 + 21.5h saved',
        reservedBerth: 'Berth P-02',
        vhfChannel: 'VHF Ch 12 (PTP Control)',
        radarScores: [
          { metric: 'Time Saved', original: 15, alternate: 98, fullMark: 100, originalFormatted: '8.0h queue', alternateFormatted: '21.5h saved' },
          { metric: 'Fuel Cost', original: 30, alternate: 90, fullMark: 100, originalFormatted: '₹11,400 idle burn', alternateFormatted: '₹2,800 transit' },
          { metric: 'Port Fee', original: 42, alternate: 78, fullMark: 100, originalFormatted: '₹15,000 dues', alternateFormatted: '₹8,500 dues' },
          { metric: 'Berth Availability', original: 10, alternate: 95, fullMark: 100, originalFormatted: '0 free (Queue: 11)', alternateFormatted: '3 free berths' },
          { metric: 'Carbon Impact', original: 25, alternate: 94, fullMark: 100, originalFormatted: '44.2t CO₂ idling', alternateFormatted: '7.8t CO₂ net' },
        ],
        summaryTable: [
          {
            category: 'Voyage Transit & Wait Time',
            original: '28.5 hours (Severe anchorage queue)',
            alternate: '4.0 hours (Immediate berthing P-02)',
            variance: '-24.5 hours (86% faster)',
            winner: 'alternate',
          },
          {
            category: 'Total Bunker Fuel Cost',
            original: '₹11,400 (Prolonged boiler idle)',
            alternate: '₹2,800 (Short 24 NM diversion)',
            variance: '-₹8,600 fuel saved',
            winner: 'alternate',
          },
          {
            category: 'Port Tariffs & Dues',
            original: '₹15,000 (Singapore Jurong base)',
            alternate: '₹8,500 (PTP priority tariff)',
            variance: '-₹6,500 port dues saved',
            winner: 'alternate',
          },
          {
            category: 'Estimated Carbon Emissions (CO₂)',
            original: '44.2 tons (Heavy anchorage burn)',
            alternate: '7.8 tons (Direct clean approach)',
            variance: '-36.4 tons CO₂ (82% reduction)',
            winner: 'alternate',
          },
          {
            category: 'Congestion & Demurrage Liability',
            original: '₹24,000 (Critical 96% queue liability)',
            alternate: '₹0 (Express bypass)',
            variance: '-₹24,000 penalty avoided',
            winner: 'alternate',
          },
        ],
      },
      {
        id: 'opt_klang_05',
        name: 'Port Klang (Westports)',
        flag: '🇲🇾',
        country: 'Malaysia',
        portCode: 'MYPKG',
        distanceNM: 198,
        eta: 'Tomorrow, 09:30',
        etaDetail: '15h 20m steaming time @ 13.0 kts',
        berthAvailability: '2 berths free',
        berthStatus: 'moderate',
        berthCountFree: 2,
        congestionRisk: 46,
        congestionBadge: 'MODERATE',
        costBreakdown: {
          fuel: 16500,
          portFee: 8100,
          deviation: 5800,
          total: 30400,
        },
        savingsTime: '12.0h saved',
        savingsCost: 11200,
        netSavingsFormatted: '₹11,200 + 12h saved',
        reservedBerth: 'Berth W-02',
        vhfChannel: 'VHF Ch 14 (Westports VTS)',
        radarScores: [
          { metric: 'Time Saved', original: 15, alternate: 72, fullMark: 100, originalFormatted: '8.0h queue', alternateFormatted: '12.0h saved' },
          { metric: 'Fuel Cost', original: 30, alternate: 52, fullMark: 100, originalFormatted: '₹11,400 idle', alternateFormatted: '₹16,500 transit' },
          { metric: 'Port Fee', original: 42, alternate: 82, fullMark: 100, originalFormatted: '₹15,000 dues', alternateFormatted: '₹8,100 dues' },
          { metric: 'Berth Availability', original: 10, alternate: 72, fullMark: 100, originalFormatted: '0 free (Queue: 11)', alternateFormatted: '2 free berths' },
          { metric: 'Carbon Impact', original: 25, alternate: 58, fullMark: 100, originalFormatted: '44.2t CO₂', alternateFormatted: '26.8t CO₂' },
        ],
        summaryTable: [
          {
            category: 'Voyage Transit & Wait Time',
            original: '28.5 hours',
            alternate: '16.5 hours',
            variance: '-12.0 hours',
            winner: 'alternate',
          },
          {
            category: 'Total Bunker Fuel Cost',
            original: '₹11,400',
            alternate: '₹16,500',
            variance: '+₹5,100',
            winner: 'original',
          },
          {
            category: 'Port Tariffs & Dues',
            original: '₹15,000',
            alternate: '₹8,100',
            variance: '-₹6,900',
            winner: 'alternate',
          },
          {
            category: 'Estimated Carbon Emissions (CO₂)',
            original: '44.2 tons',
            alternate: '26.8 tons',
            variance: '-17.4 tons CO₂',
            winner: 'alternate',
          },
          {
            category: 'Congestion & Demurrage Liability',
            original: '₹24,000',
            alternate: '₹4,500',
            variance: '-₹19,500 penalty avoided',
            winner: 'alternate',
          },
        ],
      },
      {
        id: 'opt_laem_05',
        name: 'Port of Laem Chabang',
        flag: '🇹🇭',
        country: 'Thailand',
        portCode: 'THLCH',
        distanceNM: 780,
        eta: 'Sep 16, 16:00',
        etaDetail: '58h steaming time @ 13.5 kts',
        berthAvailability: '5 berths free',
        berthStatus: 'high',
        berthCountFree: 5,
        congestionRisk: 24,
        congestionBadge: 'LOW',
        costBreakdown: {
          fuel: 52000,
          portFee: 7000,
          deviation: 17000,
          total: 76000,
        },
        savingsTime: '2.0h saved',
        savingsCost: -15000,
        netSavingsFormatted: '₹15,000 (Long Haul Alternative) + 2h saved',
        reservedBerth: 'Berth C-03',
        vhfChannel: 'VHF Ch 10 (Laem Chabang VTS)',
        radarScores: [
          { metric: 'Time Saved', original: 15, alternate: 42, fullMark: 100, originalFormatted: '8.0h queue', alternateFormatted: '2.0h saved' },
          { metric: 'Fuel Cost', original: 30, alternate: 22, fullMark: 100, originalFormatted: '₹11,400 idle', alternateFormatted: '₹52,000 transit' },
          { metric: 'Port Fee', original: 42, alternate: 90, fullMark: 100, originalFormatted: '₹15,000 dues', alternateFormatted: '₹7,000 dues' },
          { metric: 'Berth Availability', original: 10, alternate: 98, fullMark: 100, originalFormatted: '0 free', alternateFormatted: '5 free berths' },
          { metric: 'Carbon Impact', original: 25, alternate: 32, fullMark: 100, originalFormatted: '44.2t CO₂', alternateFormatted: '72.0t CO₂' },
        ],
        summaryTable: [
          {
            category: 'Voyage Transit & Wait Time',
            original: '28.5 hours',
            alternate: '60.0 hours',
            variance: '+31.5 hours',
            winner: 'original',
          },
          {
            category: 'Total Bunker Fuel Cost',
            original: '₹11,400',
            alternate: '₹52,000',
            variance: '+₹40,600',
            winner: 'original',
          },
          {
            category: 'Port Tariffs & Dues',
            original: '₹15,000',
            alternate: '₹7,000',
            variance: '-₹8,000',
            winner: 'alternate',
          },
          {
            category: 'Estimated Carbon Emissions (CO₂)',
            original: '44.2 tons',
            alternate: '72.0 tons',
            variance: '+27.8 tons CO₂',
            winner: 'original',
          },
          {
            category: 'Congestion & Demurrage Liability',
            original: '₹24,000',
            alternate: '₹1,800',
            variance: '-₹22,200',
            winner: 'alternate',
          },
        ],
      },
    ],
  },
};

export const defaultSelectedVesselId = 'vsl_02'; // MSC Marina Blue (highest congestion)
