import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { KpiCardsRow } from './KpiCardsRow';
import { FleetStatusAreaChart } from './FleetStatusAreaChart';
import { TerminalCongestionRadarChart } from './TerminalCongestionRadarChart';
import { UpcomingArrivalsTable } from './UpcomingArrivalsTable';
import { Radio, RefreshCw, Loader2, WifiOff } from 'lucide-react';
import { useVesselOperatorData } from '../hooks/useVesselOperatorData';

export const UserDashboard: React.FC = () => {
  const { vessels, berthRisks, kpi, loading, errors, refresh, lastRefreshed } =
    useVesselOperatorData();

  // Derive overall online status: any source succeeded = online
  const anyOnline = !errors.vessels || !errors.portStatus || !errors.berthRisks || !errors.forecast;
  const allLoading = loading.vessels && loading.portStatus && loading.berthRisks && loading.forecast;

  const chartSectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  const tableSectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  const formattedRefresh = lastRefreshed
    ? new Date(lastRefreshed).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Dashboard Telemetry Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-border text-xs font-mono text-text-secondary">
            <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span>PORT ANCHORAGE SECTOR 04</span>
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
          </div>
          <span className="text-xs font-mono text-text-muted hidden md:inline">
            COORDINATES: 1°16'N 103°50'E
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
          {/* AIS Feed status — replaces removed IBM WatsonX label */}
          {allLoading ? (
            <span className="flex items-center gap-1.5 text-text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>AIS FEED SYNCING</span>
            </span>
          ) : anyOnline ? (
            <span className="flex items-center gap-1.5 text-success">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span>AIS FEED LIVE</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-danger">
              <WifiOff className="w-3 h-3" />
              <span>AIS FEED OFFLINE</span>
            </span>
          )}

          {formattedRefresh && (
            <span className="text-border hidden sm:inline">
              Last sync: {formattedRefresh}
            </span>
          )}

          <span className="text-border">•</span>

          <button
            type="button"
            className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer disabled:opacity-50"
            onClick={() => void refresh()}
            disabled={allLoading}
          >
            <RefreshCw className={`w-3 h-3 ${allLoading ? 'animate-spin' : ''}`} />
            <span>Sync AIS</span>
          </button>
        </div>
      </div>

      {/* 1. TOP KPI ROW — live from /api/port/status + /api/vessels + /api/congestion/forecast */}
      <section aria-label="Key Performance Indicators">
        <KpiCardsRow kpi={kpi} loading={loading} errors={errors} />
      </section>

      {/* 2. CHARTS SECTION */}
      <motion.section
        variants={chartSectionVariants}
        initial="hidden"
        animate="visible"
        aria-label="Fleet Overview and Berth Risk Charts"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left 2/3: Fleet Status AreaChart (mock, labeled Simulated) */}
        <div className="lg:col-span-2">
          <FleetStatusAreaChart />
        </div>

        {/* Right 1/3: Berth Risk RadarChart — live from /api/port/berth-risk */}
        <div className="lg:col-span-1">
          <TerminalCongestionRadarChart
            berthRisks={berthRisks}
            loading={loading.berthRisks}
            error={errors.berthRisks}
          />
        </div>
      </motion.section>

      {/* 3. UPCOMING ARRIVALS TABLE — live from /api/vessels + /api/port/berth-risk */}
      <motion.section
        variants={tableSectionVariants}
        initial="hidden"
        animate="visible"
        aria-label="Upcoming Vessel Arrivals Table"
      >
        <UpcomingArrivalsTable
          vessels={vessels}
          berthRisks={berthRisks}
          loading={loading.vessels}
          error={errors.vessels}
        />
      </motion.section>
    </div>
  );
};

export default UserDashboard;
