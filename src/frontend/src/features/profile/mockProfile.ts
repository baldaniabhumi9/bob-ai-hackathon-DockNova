/**
 * DockNova - Port Manager Profile
 * Mock data module (frontend-only, local React state, no backend integration)
 */

export interface ManagerProfile {
  name: string;
  role: string;
  port: string;
  email: string;
  phone: string;
  shift: string;
  timezone: string;
}

export const DEFAULT_MANAGER_PROFILE: ManagerProfile = {
  name: 'Port Manager',
  role: 'Port Operations Manager',
  port: 'DockNova Port',
  email: 'manager@docknova.com',
  phone: '+91 XXXXX XXXXX',
  shift: 'Day Shift',
  timezone: 'IST (UTC+5:30)',
};

export const SHIFT_OPTIONS: { value: string; label: string }[] = [
  { value: 'Day Shift', label: 'Day Shift' },
  { value: 'Night Shift', label: 'Night Shift' },
  { value: 'Rotating Shift', label: 'Rotating Shift' },
];

export const TIMEZONE_OPTIONS: { value: string; label: string }[] = [
  { value: 'IST (UTC+5:30)', label: 'IST (UTC+5:30)' },
  { value: 'GST (UTC+4:00)', label: 'GST (UTC+4:00)' },
  { value: 'SGT (UTC+8:00)', label: 'SGT (UTC+8:00)' },
  { value: 'UTC (UTC+0:00)', label: 'UTC (UTC+0:00)' },
];

/** Fields the Port Manager is allowed to edit from the profile panel. */
export type EditableManagerProfileField = 'name' | 'email' | 'phone' | 'shift' | 'timezone';
