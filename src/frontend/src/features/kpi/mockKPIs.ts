export interface KPICardData {
  id: string;
  title: string;
  value: string;
  status: 'Healthy' | 'Elevated' | 'High' | 'Active' | 'Critical';
  trend: string;
  statusVariant: 'success' | 'warning' | 'critical' | 'cyan' | 'electric';
  icon: string;
}

export const MOCK_KPIS: KPICardData[] = [
  {
    id: 'congestion_risk',
    title: 'Port Congestion Risk',
    value: '68%',
    status: 'Elevated',
    trend: '+12% next 24h',
    statusVariant: 'warning',
    icon: '⚡',
  },
  {
    id: 'berth_utilisation',
    title: 'Berth Utilisation',
    value: '82%',
    status: 'High',
    trend: '+6%',
    statusVariant: 'warning',
    icon: '⚓',
  },
  {
    id: 'vessels_in_port',
    title: 'Vessels in Port',
    value: '24',
    status: 'Active',
    trend: '+3 today',
    statusVariant: 'cyan',
    icon: '🚢',
  },
  {
    id: 'crane_availability',
    title: 'Crane Availability',
    value: '87%',
    status: 'Healthy',
    trend: '-2%',
    statusVariant: 'success',
    icon: '🏗️',
  },
  {
    id: 'predicted_delay',
    title: 'Predicted Delay',
    value: '4.6 hrs',
    status: 'Elevated',
    trend: '+1.2 hrs',
    statusVariant: 'critical',
    icon: '⏱️',
  },
];
