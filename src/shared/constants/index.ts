/**
 * Shared System Constants for DockNova
 */

export const APP_NAME = 'DockNova';
export const PREDICTION_HORIZON_HOURS = 72;

export const CONGESTION_RISK_THRESHOLDS = {
  LOW: 0.25,
  MEDIUM: 0.50,
  HIGH: 0.75,
  CRITICAL: 0.90,
} as const;

export const DEFAULT_THEME_COLORS = {
  BACKGROUND: '#071A2B',
  SURFACE: '#0D2438',
  NOVA_CYAN: '#22D3EE',
  ELECTRIC_BLUE: '#3B82F6',
  SUCCESS: '#22C55E',
  WARNING: '#F59E0B',
  CRITICAL: '#EF4444',
  TEXT_PRIMARY: '#F8FAFC',
  TEXT_SECONDARY: '#94A3B8',
} as const;
