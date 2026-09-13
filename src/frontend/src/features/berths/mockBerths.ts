export interface BerthData {
  id: string;
  name: string;
  code: string;
  status: 'Normal' | 'Warning' | 'Critical';
  statusVariant: 'success' | 'warning' | 'critical';
  utilisationPercentage: number;
  assignedVessel?: string;
  cranesActive: number;
  maxDraftMeters: number;
  predictionText?: string;
  isHotspot?: boolean;
}

export const MOCK_BERTHS: BerthData[] = [
  {
    id: 'B1',
    name: 'Berth B1 - Container North',
    code: 'B1',
    status: 'Normal',
    statusVariant: 'success',
    utilisationPercentage: 65,
    assignedVessel: 'MV Poseidon Express',
    cranesActive: 2,
    maxDraftMeters: 14.5,
  },
  {
    id: 'B2',
    name: 'Berth B2 - Container North',
    code: 'B2',
    status: 'Normal',
    statusVariant: 'success',
    utilisationPercentage: 70,
    assignedVessel: 'MV Horizon',
    cranesActive: 3,
    maxDraftMeters: 15.0,
  },
  {
    id: 'B3',
    name: 'Berth B3 - Bulk Terminal',
    code: 'B3',
    status: 'Warning',
    statusVariant: 'warning',
    utilisationPercentage: 84,
    assignedVessel: 'MV Global Container',
    cranesActive: 2,
    maxDraftMeters: 13.8,
    predictionText: 'Heavy workload scheduled at 14:00',
  },
  {
    id: 'B4',
    name: 'Berth B4 - Deepwater Hub',
    code: 'B4',
    status: 'Critical',
    statusVariant: 'critical',
    utilisationPercentage: 92,
    assignedVessel: 'MV Ocean Star',
    cranesActive: 3,
    maxDraftMeters: 16.2,
    predictionText: 'Congestion predicted in 18h',
    isHotspot: true,
  },
  {
    id: 'B5',
    name: 'Berth B5 - Feeder Terminal',
    code: 'B5',
    status: 'Normal',
    statusVariant: 'success',
    utilisationPercentage: 45,
    assignedVessel: 'MV Pacific Dawn',
    cranesActive: 2,
    maxDraftMeters: 12.5,
    predictionText: 'Spare capacity available',
  },
  {
    id: 'B6',
    name: 'Berth B6 - Multipurpose',
    code: 'B6',
    status: 'Normal',
    statusVariant: 'success',
    utilisationPercentage: 50,
    assignedVessel: 'None (Standby)',
    cranesActive: 1,
    maxDraftMeters: 12.0,
  },
];
