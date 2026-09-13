/**
 * Shared Type Definitions for DockNova
 * Contracts shared across Frontend, Backend, Database, and AI services.
 */

export type CongestionRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  type: string;
  eta: string;
  etd: string;
  status: 'SCHEDULED' | 'WAITING' | 'BERTHED' | 'DEPARTED';
  draftMeters: number;
  lengthMeters: number;
}

export interface Berth {
  id: string;
  name: string;
  code: string;
  maxDraftMeters: number;
  maxLengthMeters: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  currentVesselId?: string;
}

export interface Crane {
  id: string;
  name: string;
  berthId: string;
  status: 'OPERATIONAL' | 'IDLE' | 'MAINTENANCE';
  capacityTEUPerHour: number;
}

export interface CongestionRisk {
  id: string;
  timestamp: string;
  riskLevel: CongestionRiskLevel;
  score: number;
  factors: string[];
  affectedBerthIds: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR';
}

export interface OperationsPlan {
  id: string;
  generatedAt: string;
  validForHours: number;
  recommendationsCount: number;
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE';
}

export interface OptimisationResult {
  id: string;
  timestamp: string;
  efficiencyGainPercentage: number;
  estimatedWaitTimeReductionHours: number;
}
