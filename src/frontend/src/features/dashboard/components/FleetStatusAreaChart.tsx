import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Ship, Info } from 'lucide-react';
import { fleetStatusHistory } from '../mockData';

// Custom tooltip matching maritime dark theme
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-lg bg-surface-2/95 border border-border shadow-xl backdrop-blur-md text-xs font-mono">
        <div className="font-semibold text-text-primary mb-2 border-b border-border/60 pb-1 flex items-center justify-between gap-4">
          <span>Day: {label}</span>
          <span className="text-[10px] text-text-muted font-normal">7-Day Telemetry</span>
        </div>
        <div className="space-y-1.5">
          {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-text-secondary">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-bold text-text-primary">{entry.value} vessels</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const FleetStatusAreaChart: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between p-6 rounded-2xl bg-surface-1 border border-border shadow-lg">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg text-text-primary tracking-tight">
              Fleet Status Overview
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Last 7 Days
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Operational distribution of underway, berthed, and delayed vessels.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span>On Time</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>At Port</span>
          </div>
        </div>
      </div>

      {/* Chart Body */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={fleetStatusHistory}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* SVG Gradient definitions with opacity 0.2 down to 0.01 */}
            <defs>
              <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorDelayed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorAtPort" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#243447"
              vertical={false}
              opacity={0.6}
            />

            <XAxis
              dataKey="day"
              stroke="#64748B"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
              axisLine={{ stroke: '#243447' }}
            />

            <YAxis
              stroke="#64748B"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
              axisLine={false}
              tickCount={5}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Area 1: At Port (Primary #38BDF8) */}
            <Area
              type="monotone"
              dataKey="atPort"
              name="At Port"
              stroke="#38BDF8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAtPort)"
            />

            {/* Area 2: Delayed (Warning #FBBF24) */}
            <Area
              type="monotone"
              dataKey="delayed"
              name="Delayed"
              stroke="#FBBF24"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDelayed)"
            />

            {/* Area 3: On Time (Success #34D399) */}
            <Area
              type="monotone"
              dataKey="onTime"
              name="On Time"
              stroke="#34D399"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOnTime)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Telemetry */}
      <div className="pt-4 border-t border-border/50 mt-4 flex items-center justify-between text-xs text-text-muted font-mono">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-primary" />
          <span>72-Hour AI Predictive Model Confidence: 99.4%</span>
        </span>
        <span className="hidden sm:inline">Updated 4 mins ago</span>
      </div>
    </div>
  );
};

export default FleetStatusAreaChart;
