export interface AIAlertData {
  title: string;
  subtitle: string;
  predictedHours: number;
  hotspotBerth: string;
  confidenceScore: number;
  drivers: string[];
  recommendation: string;
}

export const MOCK_AI_CONGESTION_ALERT: AIAlertData = {
  title: 'Congestion Risk Detected',
  subtitle: 'B4 is predicted to reach critical congestion within 18 hours.',
  predictedHours: 18,
  hotspotBerth: 'B4',
  confidenceScore: 91,
  drivers: [
    '3 vessel arrivals overlap',
    'Berth utilisation reaches 94%',
    'Crane availability drops to 67%',
    'MV Ocean Star is delayed by 4h',
  ],
  recommendation: 'Reassign MV Ocean Star to Berth B5 to reduce predicted queue by 3.2 hours and lower B4 congestion risk to 42%.',
};
