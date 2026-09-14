/**
 * DockNova - Control Tower Settings
 * Mock data module (frontend-only, local React state, no backend integration)
 */

export type RecommendationMode = 'balanced' | 'congestion_first' | 'delay_first';

export interface ControlTowerSettings {
  criticalRiskThreshold: number;
  highRiskThreshold: number;
  alertLeadTimeHours: number;
  enableCriticalAlerts: boolean;
  enableVesselDelayAlerts: boolean;
  showAiRecommendations: boolean;
  prioritiseCongestionReduction: boolean;
  prioritiseDelayReduction: boolean;
  recommendationMode: RecommendationMode;
  inAppAlerts: boolean;
  highRiskBerthNotifications: boolean;
  aiActionRecommendations: boolean;
}

export const DEFAULT_SETTINGS: ControlTowerSettings = {
  criticalRiskThreshold: 80,
  highRiskThreshold: 65,
  alertLeadTimeHours: 18,
  enableCriticalAlerts: true,
  enableVesselDelayAlerts: true,
  showAiRecommendations: true,
  prioritiseCongestionReduction: true,
  prioritiseDelayReduction: false,
  recommendationMode: 'balanced',
  inAppAlerts: true,
  highRiskBerthNotifications: true,
  aiActionRecommendations: true,
};

export const RECOMMENDATION_MODE_OPTIONS: { value: RecommendationMode; label: string }[] = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'congestion_first', label: 'Congestion First' },
  { value: 'delay_first', label: 'Delay First' },
];

export interface PortOperationsInfo {
  port: string;
  planningHorizon: string;
  timezone: string;
}

export const MOCK_PORT_OPERATIONS: PortOperationsInfo = {
  port: 'DockNova Port',
  planningHorizon: '72 hours',
  timezone: 'IST (UTC+5:30)',
};
