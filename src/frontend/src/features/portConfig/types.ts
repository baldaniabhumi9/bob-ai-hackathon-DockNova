export type TerminalStatus = 'Operational' | 'High Load' | 'Maintenance' | 'Restricted';

export interface Terminal {
  id: string;
  code: string;
  name: string;
  location: string;
  status: TerminalStatus;
  totalBerths: number;
  activeCranes: number;
  avgUtilization: number;
  quayLengthMeters: number;
  description?: string;
  establishedYear?: number;
}

export type BerthStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Offline';

export interface Berth {
  id: string;
  code: string;
  name: string;
  terminalId: string;
  terminalName: string;
  lengthMeters: number;
  depthMeters: number;
  status: BerthStatus;
  currentVesselId?: string;
  currentVesselName?: string;
  currentVesselImo?: string;
  cranesAssigned: string[];
  maxDraftMeters: number;
  lastInspectionDate?: string;
}

export type CraneType = 'STS' | 'RTG';
export type CraneStatus = 'Operational' | 'Maintenance' | 'Fault';

export interface Crane {
  id: string;
  code: string;
  type: CraneType;
  terminalId: string;
  terminalName: string;
  assignedBerthId?: string;
  assignedBerthCode?: string;
  status: CraneStatus;
  efficiencyRating: number; // 1 to 5 stars (can have decimals like 4.8)
  lastMaintenanceDate: string;
  nextServiceDate?: string;
  movesPerHour?: number;
  manufacturer?: string;
}

export type PortConfigTab = 'terminals' | 'berths' | 'cranes';

export type EntityType = 'terminal' | 'berth' | 'crane';

export interface PortConfigStats {
  totalTerminals: number;
  activeTerminals: number;
  totalBerths: number;
  availableBerths: number;
  occupiedBerths: number;
  totalCranes: number;
  operationalCranes: number;
  avgPortUtilization: number;
}
