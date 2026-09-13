export interface ForecastPoint {
  timeLabel: string;
  hours: number;
  riskValue: number; // 0 - 100
  status: 'normal' | 'warning' | 'critical';
  isPeak?: boolean;
}

export const MOCK_FORECAST_POINTS: ForecastPoint[] = [
  { timeLabel: 'Now', hours: 0, riskValue: 68, status: 'warning' },
  { timeLabel: '12h', hours: 12, riskValue: 76, status: 'warning' },
  { timeLabel: '24h', hours: 24, riskValue: 91, status: 'critical', isPeak: true },
  { timeLabel: '36h', hours: 36, riskValue: 84, status: 'warning' },
  { timeLabel: '48h', hours: 48, riskValue: 72, status: 'warning' },
  { timeLabel: '60h', hours: 60, riskValue: 61, status: 'normal' },
  { timeLabel: '72h', hours: 72, riskValue: 55, status: 'normal' },
];

export const MOCK_CONGESTION_SUMMARY = {
  currentRisk: '68%',
  currentRiskStatus: 'Elevated',
  predictedPeak: '94%',
  predictedPeakTime: 'in 18 hours',
  atRiskBerth: 'B4',
  atRiskStatus: 'Critical',
};

export const MOCK_B4_FACTORS = [
  '3 vessel arrivals overlap',
  'Berth utilisation may reach 94%',
  'Crane availability may fall to 67%',
  'MV Ocean Star is delayed by 4h',
];

export const MOCK_RECOMMENDATION = {
  title: 'Recommended Action',
  actionText: 'Reassign MV Ocean Star from B4 to B5.',
  impactRisk: '68% → 42%',
  impactDelay: '4.6h → 1.2h',
  confidence: '91%',
};
