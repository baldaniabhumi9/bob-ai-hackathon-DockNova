/**
 * DockNova Design System - Core Color Palette
 * Visual Direction: Dark Futuristic Maritime Operations Control Center
 */

export const colors = {
  // Brand & Accent Colors
  novaCyan: '#22D3EE',
  novaCyanGlow: 'rgba(34, 211, 238, 0.25)',
  electricBlue: '#3B82F6',
  electricBlueGlow: 'rgba(59, 130, 246, 0.25)',

  // Background & Surface Colors
  background: '#071A2B',
  surface: '#0D2438',
  surfaceHover: '#13304A',
  surfaceActive: '#1A3B5A',
  surfaceBorder: 'rgba(34, 211, 238, 0.15)',
  surfaceBorderFocused: 'rgba(34, 211, 238, 0.40)',

  // Operational Status Colors
  success: '#22C55E',
  successGlow: 'rgba(34, 197, 94, 0.20)',
  warning: '#F59E0B',
  warningGlow: 'rgba(245, 158, 11, 0.20)',
  critical: '#EF4444',
  criticalGlow: 'rgba(239, 68, 68, 0.20)',

  // Typography & Content Colors
  primaryText: '#F8FAFC',
  secondaryText: '#94A3B8',
  mutedText: '#64748B',
  inverseText: '#071A2B',

  // Utility Colors
  transparent: 'transparent',
  overlay: 'rgba(7, 26, 43, 0.85)',
} as const;

export type Colors = typeof colors;
