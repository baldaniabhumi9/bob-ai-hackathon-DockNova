/**
 * DockNova Design System - Shadow & Elevation Tokens
 */

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
  cyanGlow: '0 0 15px rgba(34, 211, 238, 0.25)',
  blueGlow: '0 0 15px rgba(59, 130, 246, 0.25)',
  criticalGlow: '0 0 15px rgba(239, 68, 68, 0.30)',
} as const;

export type Shadows = typeof shadows;
