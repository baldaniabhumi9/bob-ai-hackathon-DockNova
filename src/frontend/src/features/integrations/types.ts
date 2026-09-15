export interface IbmBobConfig {
  endpointUrl: string;
  apiKey: string;
  modelId: string;
  temperature: number; // 0.0 to 1.0
  maxTokens: number;
  isConnected: boolean;
  lastTestedAt?: string;
  region?: string;
}

export type DataSourceStatus = 'Simulated' | 'Connected' | 'Error' | 'Disconnected';

export interface DataSource {
  id: string;
  name: string;
  type: 'ais' | 'schedule' | 'weather' | 'customs';
  description: string;
  status: DataSourceStatus;
  lastSyncTime: string;
  syncInterval: string;
  endpointUrl: string;
  errorMessage?: string;
  isSyncing?: boolean;
}

export type PredictionWindow = '24h' | '48h' | '72h';
export type RetrainingFrequency = 'Daily' | 'Weekly' | 'Monthly';

export interface ModelParameters {
  congestionThreshold: number; // 70 to 95 (%)
  predictionWindow: PredictionWindow;
  retrainingFrequency: RetrainingFrequency;
  explainableAi: boolean;
  autoRerouteSuggestions: boolean;
}

export type LogStatus = 'Success' | 'Info' | 'Warning' | 'Error';

export interface IntegrationLog {
  id: string;
  timestamp: string;
  service: string;
  status: LogStatus;
  message: string;
  latencyMs?: number;
}
