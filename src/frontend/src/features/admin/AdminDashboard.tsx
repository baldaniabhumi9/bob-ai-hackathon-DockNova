import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  RefreshCw,
  Shield,
  Activity,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  MOCK_ADMIN_KPIS,
  MOCK_ACCURACY_HISTORY,
  MOCK_HOURLY_PREDICTIONS,
  MOCK_USER_GROWTH,
  MOCK_TERMINAL_UTILIZATION,
  MOCK_SYSTEM_ALERTS,
  MOCK_TERMINALS_TABLE,
  AdminKpiData,
} from './mockAdminData';
import { AdminKpiRow } from './components/AdminKpiRow';
import { ModelAccuracyChart } from './components/ModelAccuracyChart';
import { PredictionVolumeChart } from './components/PredictionVolumeChart';
import { UserGrowthChart } from './components/UserGrowthChart';
import { TerminalUtilizationDonut } from './components/TerminalUtilizationDonut';
import { RecentAlertsList } from './components/RecentAlertsList';
import { TopTerminalsTable } from './components/TopTerminalsTable';

export const AdminDashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<AdminKpiData>(MOCK_ADMIN_KPIS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('30d');

  // Toggle health status between Operational and Degraded for demonstration
  const handleToggleHealth = () => {
    setKpiData((prev) => ({
      ...prev,
      systemHealth: prev.systemHealth === 'Operational' ? 'Degraded' : 'Operational',
      uptimePercent: prev.systemHealth === 'Operational' ? 98.42 : 99.98,
    }));
  };

  // Mock refresh animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* 1. Datadog-Style Mission Control Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-accent/20 to-primary/20 text-accent border border-accent/30 shrink-0 mt-0.5">
            <Server className="w-6 h-6 text-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
                System Mission Control
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/30">
                DockNova Admin Core v2.4
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Real-time cluster telemetry, IBM Bob inference metrics, model drift alarms, and quay infrastructure.
            </p>
          </div>
        </div>

        {/* Live Controls & Indicators */}
        <div className="flex items-center gap-3 self-end md:self-center flex-wrap">
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-subtle text-xs font-mono text-text-secondary">
            <span
              className={`w-2 h-2 rounded-full ${
                kpiData.systemHealth === 'Operational' ? 'bg-success animate-ping' : 'bg-warning animate-pulse'
              }`}
            />
            <span className="text-text-primary font-semibold">
              {kpiData.systemHealth === 'Operational' ? 'All Systems Nominal' : 'Degraded Cluster'}
            </span>
            <span className="text-text-muted">• 18ms Latency</span>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-surface-2 border border-subtle text-xs font-mono">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-accent text-text-primary font-bold shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Refresh Trigger */}
          <button
            onClick={handleRefresh}
            title="Refresh Telemetry Data"
            className="p-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-subtle text-text-muted hover:text-text-primary transition-all duration-150"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Top KPI Row (4 Cards) */}
      <AdminKpiRow kpis={kpiData} onToggleHealth={handleToggleHealth} />

      {/* 3. Second Row (grid-cols-1 lg:grid-cols-2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelAccuracyChart data={MOCK_ACCURACY_HISTORY} />
        <PredictionVolumeChart data={MOCK_HOURLY_PREDICTIONS} />
      </div>

      {/* 4. Third Row (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UserGrowthChart data={MOCK_USER_GROWTH} />
        <TerminalUtilizationDonut data={MOCK_TERMINAL_UTILIZATION} />
        <RecentAlertsList alerts={MOCK_SYSTEM_ALERTS} />
      </div>

      {/* 5. Bottom Row (Top Performing Terminals Table) */}
      <TopTerminalsTable terminals={MOCK_TERMINALS_TABLE} />
    </div>
  );
};

export default AdminDashboard;
