/**
 * DockNova Design System - Core Color Palette
 * Supports both Maritime Dark Mode & High-Visibility Light Mode
 */

export const colors = {
  // Brand & Accent Colors
  novaCyan: '#22D3EE',
  novaCyanGlow: 'rgba(34, 211, 238, 0.25)',
  electricBlue: '#3B82F6',
  electricBlueGlow: 'rgba(59, 130, 246, 0.25)',

  // Background & Surface Colors (Dynamic CSS variable references)
  background: 'var(--color-base, #050B14)',
  surface: 'var(--color-surface-1, #0E1525)',
  surfaceHover: 'var(--color-surface-2, #141D2E)',
  surfaceActive: 'var(--color-surface-3, #1C2840)',
  surfaceBorder: 'var(--color-border-subtle, rgba(36, 52, 71, 0.7))',
  surfaceBorderFocused: 'var(--color-border-focused, rgba(34, 211, 238, 0.40))',

  // Operational Status Colors
  success: 'var(--color-success, #34D399)',
  successGlow: 'rgba(52, 211, 153, 0.20)',
  warning: 'var(--color-warning, #FBBF24)',
  warningGlow: 'rgba(251, 191, 36, 0.20)',
  critical: 'var(--color-danger, #F87171)',
  criticalGlow: 'rgba(248, 113, 113, 0.20)',

  // Typography & Content Colors
  primaryText: 'var(--color-text-primary, #F0F4F8)',
  secondaryText: 'var(--color-text-secondary, #94A3B8)',
  mutedText: 'var(--color-text-muted, #64748B)',
  inverseText: 'var(--color-inverse-text, #050B14)',

  // Utility Colors
  transparent: 'transparent',
  overlay: 'rgba(7, 26, 43, 0.85)',
} as const;

export type Colors = typeof colors;
