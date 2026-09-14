export interface AdminKpiData {
  totalUsers: number;
  totalUsersGrowth: string; // e.g. "+12% this week"
  activePredictions24h: number;
  activePredictionsTrend: string;
  modelAccuracy: number; // from train.py constant when wired
  modelAccuracyTrend: string; // e.g. "+0.8% vs last week"
  systemHealth: 'Operational' | 'Degraded' | 'Maintenance';
}

export interface ModelAccuracyPoint {
  day: string; // e.g. "Day 1", "Aug 16"
  date: string;
  accuracy: number; // percentage e.g. 94.2
  threshold: number; // constant 85
  drift: boolean;
}

export interface HourlyPredictionVolume {
  hour: string; // e.g. "00:00", "01:00", ... "23:00"
  predictions: number;
  isPeak: boolean;
}

export interface UserGrowthPoint {
  day: string; // "Mon", "Tue", etc.
  activeUsers: number;
  newRegistrations: number;
}

export interface TerminalUtilizationSlice {
  name: string;
  value: number; // percentage share
  berthCount: number;
  color: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface SystemAlertItem {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  time: string;
  service: string;
}

export interface TerminalPerformanceRecord {
  id: string;
  terminal: string;
  code: string;
  avgTurnaroundHours: number;
  craneEfficiencyMph: number; // moves per hour
  onTimePercent: number;
  status: 'operational' | 'maintenance' | 'offline';
}

export const MOCK_ADMIN_KPIS: AdminKpiData = {
  totalUsers: 1428,
  totalUsersGrowth: 'Simulated — no user telemetry API',
  activePredictions24h: 48290,
  activePredictionsTrend: 'Simulated — no prediction volume API',
  modelAccuracy: 86.4,
  modelAccuracyTrend: 'From train.py (no live endpoint)',
  systemHealth: 'Operational',
};

// 30 Days of model accuracy data with dips and threshold at 85%
export const MOCK_ACCURACY_HISTORY: ModelAccuracyPoint[] = [
  { day: 'Day 1', date: 'Aug 16', accuracy: 94.2, threshold: 85, drift: false },
  { day: 'Day 2', date: 'Aug 17', accuracy: 95.1, threshold: 85, drift: false },
  { day: 'Day 3', date: 'Aug 18', accuracy: 93.8, threshold: 85, drift: false },
  { day: 'Day 4', date: 'Aug 19', accuracy: 94.6, threshold: 85, drift: false },
  { day: 'Day 5', date: 'Aug 20', accuracy: 92.4, threshold: 85, drift: false },
  { day: 'Day 6', date: 'Aug 21', accuracy: 91.0, threshold: 85, drift: false },
  { day: 'Day 7', date: 'Aug 22', accuracy: 89.5, threshold: 85, drift: false },
  { day: 'Day 8', date: 'Aug 23', accuracy: 84.1, threshold: 85, drift: true }, // Drift detected!
  { day: 'Day 9', date: 'Aug 24', accuracy: 87.6, threshold: 85, drift: false },
  { day: 'Day 10', date: 'Aug 25', accuracy: 91.2, threshold: 85, drift: false },
  { day: 'Day 11', date: 'Aug 26', accuracy: 93.5, threshold: 85, drift: false },
  { day: 'Day 12', date: 'Aug 27', accuracy: 94.8, threshold: 85, drift: false },
  { day: 'Day 13', date: 'Aug 28', accuracy: 95.4, threshold: 85, drift: false },
  { day: 'Day 14', date: 'Aug 29', accuracy: 96.1, threshold: 85, drift: false },
  { day: 'Day 15', date: 'Aug 30', accuracy: 95.8, threshold: 85, drift: false },
  { day: 'Day 16', date: 'Aug 31', accuracy: 94.9, threshold: 85, drift: false },
  { day: 'Day 17', date: 'Sep 01', accuracy: 96.2, threshold: 85, drift: false },
  { day: 'Day 18', date: 'Sep 02', accuracy: 95.0, threshold: 85, drift: false },
  { day: 'Day 19', date: 'Sep 03', accuracy: 93.4, threshold: 85, drift: false },
  { day: 'Day 20', date: 'Sep 04', accuracy: 92.1, threshold: 85, drift: false },
  { day: 'Day 21', date: 'Sep 05', accuracy: 94.7, threshold: 85, drift: false },
  { day: 'Day 22', date: 'Sep 06', accuracy: 95.9, threshold: 85, drift: false },
  { day: 'Day 23', date: 'Sep 07', accuracy: 96.8, threshold: 85, drift: false },
  { day: 'Day 24', date: 'Sep 08', accuracy: 97.2, threshold: 85, drift: false },
  { day: 'Day 25', date: 'Sep 09', accuracy: 96.5, threshold: 85, drift: false },
  { day: 'Day 26', date: 'Sep 10', accuracy: 95.7, threshold: 85, drift: false },
  { day: 'Day 27', date: 'Sep 11', accuracy: 96.9, threshold: 85, drift: false },
  { day: 'Day 28', date: 'Sep 12', accuracy: 97.4, threshold: 85, drift: false },
  { day: 'Day 29', date: 'Sep 13', accuracy: 96.1, threshold: 85, drift: false },
  { day: 'Day 30', date: 'Sep 14', accuracy: 96.4, threshold: 85, drift: false },
];

// 24 Hours of Prediction Volume with highlighted peak hours (14:00 - 18:00)
export const MOCK_HOURLY_PREDICTIONS: HourlyPredictionVolume[] = [
  { hour: '00:00', predictions: 920, isPeak: false },
  { hour: '01:00', predictions: 780, isPeak: false },
  { hour: '02:00', predictions: 640, isPeak: false },
  { hour: '03:00', predictions: 510, isPeak: false },
  { hour: '04:00', predictions: 830, isPeak: false },
  { hour: '05:00', predictions: 1120, isPeak: false },
  { hour: '06:00', predictions: 1540, isPeak: false },
  { hour: '07:00', predictions: 2180, isPeak: false },
  { hour: '08:00', predictions: 2840, isPeak: false },
  { hour: '09:00', predictions: 3250, isPeak: false },
  { hour: '10:00', predictions: 3100, isPeak: false },
  { hour: '11:00', predictions: 2950, isPeak: false },
  { hour: '12:00', predictions: 3340, isPeak: false },
  { hour: '13:00', predictions: 3560, isPeak: false },
  { hour: '14:00', predictions: 4120, isPeak: true },
  { hour: '15:00', predictions: 4380, isPeak: true },
  { hour: '16:00', predictions: 4290, isPeak: true },
  { hour: '17:00', predictions: 3950, isPeak: true },
  { hour: '18:00', predictions: 3410, isPeak: false },
  { hour: '19:00', predictions: 2790, isPeak: false },
  { hour: '20:00', predictions: 2210, isPeak: false },
  { hour: '21:00', predictions: 1850, isPeak: false },
  { hour: '22:00', predictions: 1420, isPeak: false },
  { hour: '23:00', predictions: 1100, isPeak: false },
];

// User Growth over 7 days
export const MOCK_USER_GROWTH: UserGrowthPoint[] = [
  { day: 'Mon', activeUsers: 1180, newRegistrations: 42 },
  { day: 'Tue', activeUsers: 1240, newRegistrations: 58 },
  { day: 'Wed', activeUsers: 1295, newRegistrations: 64 },
  { day: 'Thu', activeUsers: 1350, newRegistrations: 78 },
  { day: 'Fri', activeUsers: 1390, newRegistrations: 85 },
  { day: 'Sat', activeUsers: 1410, newRegistrations: 48 },
  { day: 'Sun', activeUsers: 1428, newRegistrations: 36 },
];

// Terminal Utilization Donut Data (4 terminals)
export const MOCK_TERMINAL_UTILIZATION: TerminalUtilizationSlice[] = [
  { name: 'Tuas Mega Terminal', value: 38, berthCount: 16, color: '#38BDF8' }, // Primary Cyan
  { name: 'Jurong Port', value: 27, berthCount: 12, color: '#818CF8' }, // Secondary Indigo
  { name: 'Pasir Panjang', value: 23, berthCount: 10, color: '#F472B6' }, // Accent Pink
  { name: 'Keppel Hub', value: 12, berthCount: 4, color: '#34D399' }, // Success Emerald
];

// System Alerts Feed
export const MOCK_SYSTEM_ALERTS: SystemAlertItem[] = [
  {
    id: 'alt-1',
    title: 'Model Feature Drift Detected',
    description: 'B4 dwell duration features diverged by 4.2% from training baseline.',
    severity: 'critical',
    time: '8 mins ago',
    service: 'watsonx-predictor-core',
  },
  {
    id: 'alt-2',
    title: 'High API Telemetry Latency',
    description: 'VTIS feed WebSocket round-trip exceeded 250ms threshold (peak 420ms).',
    severity: 'warning',
    time: '24 mins ago',
    service: 'ais-gateway-stream',
  },
  {
    id: 'alt-3',
    title: 'Raffles Light AIS Tower Resynced',
    description: 'Secondary receiver frequency 162.025 MHz successfully reconnected.',
    severity: 'info',
    time: '1 hour ago',
    service: 'rf-telemetry-cluster',
  },
  {
    id: 'alt-4',
    title: 'Crane C3 IoT Telemetry Offline',
    description: 'Hydraulic pressure sensor heartbeat missing for Berth B4 quay crane.',
    severity: 'critical',
    time: '2 hours ago',
    service: 'tos-crane-subsystem',
  },
  {
    id: 'alt-5',
    title: 'Daily Database Backup Complete',
    description: 'Immutable ledger hash snapshots replicated to S3 cold storage archive.',
    severity: 'info',
    time: '4 hours ago',
    service: 'audit-backup-cron',
  },
];

// Top Performing Terminals Table
export const MOCK_TERMINALS_TABLE: TerminalPerformanceRecord[] = [
  {
    id: 't-1',
    terminal: 'Tuas Mega Terminal (Phase 1)',
    code: 'SGP-TMT1',
    avgTurnaroundHours: 14.2,
    craneEfficiencyMph: 36.4,
    onTimePercent: 96.8,
    status: 'operational',
  },
  {
    id: 't-2',
    terminal: 'Pasir Panjang Terminal 4',
    code: 'SGP-PPT4',
    avgTurnaroundHours: 16.8,
    craneEfficiencyMph: 32.1,
    onTimePercent: 92.4,
    status: 'operational',
  },
  {
    id: 't-3',
    terminal: 'Tanjong Pagar Berths 3-7',
    code: 'SGP-TPB',
    avgTurnaroundHours: 21.4,
    craneEfficiencyMph: 26.8,
    onTimePercent: 84.6,
    status: 'maintenance',
  },
  {
    id: 't-4',
    terminal: 'Jurong Gateway Container Yard',
    code: 'SGP-JGW',
    avgTurnaroundHours: 18.5,
    craneEfficiencyMph: 29.5,
    onTimePercent: 89.2,
    status: 'operational',
  },
  {
    id: 't-5',
    terminal: 'Keppel Automated Feeder Hub',
    code: 'SGP-KAFH',
    avgTurnaroundHours: 28.0,
    craneEfficiencyMph: 19.2,
    onTimePercent: 71.0,
    status: 'offline',
  },
];
