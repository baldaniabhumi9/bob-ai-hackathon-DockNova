import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { KpiCardsRow } from './KpiCardsRow';
import { FleetStatusAreaChart } from './FleetStatusAreaChart';
import { TerminalCongestionRadarChart } from './TerminalCongestionRadarChart';
import { UpcomingArrivalsTable } from './UpcomingArrivalsTable';
import { Radio, RefreshCw } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const chartSectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const tableSectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

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
            COORDINATES: 1°17'N 103°51'E
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-text-muted">
          <span>IBM WATSONX RADAR ACTIVE</span>
          <span className="text-border">•</span>
          <button
            type="button"
            className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sync AIS</span>
          </button>
        </div>
      </div>

      {/* 1. TOP KPI ROW */}
      <section aria-label="Key Performance Indicators">
        <KpiCardsRow />
      </section>

      {/* 2. CHARTS SECTION (grid-cols-3: 2/3 AreaChart + 1/3 RadarChart) */}
      <motion.section
        variants={chartSectionVariants}
        initial="hidden"
        animate="visible"
        aria-label="Fleet Overview and Terminal Congestion Charts"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left 2/3: Fleet Status AreaChart */}
        <div className="lg:col-span-2">
          <FleetStatusAreaChart />
        </div>

        {/* Right 1/3: Congestion Risk RadarChart */}
        <div className="lg:col-span-1">
          <TerminalCongestionRadarChart />
        </div>
      </motion.section>

      {/* 3. UPCOMING ARRIVALS TABLE */}
      <motion.section
        variants={tableSectionVariants}
        initial="hidden"
        animate="visible"
        aria-label="Upcoming Vessel Arrivals Table"
      >
        <UpcomingArrivalsTable />
      </motion.section>
    </div>
  );
};

export default UserDashboard;
