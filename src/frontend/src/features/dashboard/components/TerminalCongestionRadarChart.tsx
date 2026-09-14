import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Compass, AlertTriangle, ShieldCheck } from 'lucide-react';
import { terminalCongestionRisk } from '../mockData';

const RadarCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isCritical = data.risk >= 70;
    const isMedium = data.risk >= 40 && data.risk < 70;

    return (
      <div className="p-3 rounded-lg bg-surface-2/95 border border-border shadow-xl backdrop-blur-md text-xs font-mono">
        <div className="font-semibold text-text-primary mb-1.5 flex items-center justify-between gap-3">
          <span>{data.terminal}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              isCritical
                ? 'bg-danger/20 text-danger'
                : isMedium
                ? 'bg-warning/20 text-warning'
                : 'bg-success/20 text-success'
            }`}
          >
            {isCritical ? 'HIGH RISK' : isMedium ? 'MODERATE' : 'LOW RISK'}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted">Congestion Risk:</span>
            <span className="font-bold text-primary">{data.risk}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted">Anchorage Queue:</span>
            <span className="text-text-secondary">{data.queue} vessels</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted">Estimated Wait:</span>
            <span className="text-text-secondary">{data.avgWait}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const TerminalCongestionRadarChart: React.FC = () => {
  const [hoveredTerminal, setHoveredTerminal] = useState<string | null>(null);

  // Chart data with short labels for polar angle axis
  const chartData = terminalCongestionRisk.map((item) => ({
    ...item,
    displayName: item.shortName,
  }));

  const activeTerminalInfo = terminalCongestionRisk.find(
    (t) => t.shortName === hoveredTerminal || t.terminal.includes(hoveredTerminal || '')
  ) || terminalCongestionRisk[0];

  return (
    <div className="h-full flex flex-col justify-between p-6 rounded-2xl bg-surface-1 border border-border shadow-lg">
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-text-primary tracking-tight">
            Congestion Risk by Terminal
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-2 text-text-secondary border border-border">
            0-100% Index
          </span>
        </div>
        <p className="text-xs text-text-muted mt-0.5">
          Dynamic radar projection of quay congestion.
        </p>
      </div>

      {/* Radar Chart Body */}
      <div className="w-full h-64 sm:h-72 my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
            <PolarGrid stroke="#243447" strokeDasharray="3 3" opacity={0.8} />

            <PolarAngleAxis
              dataKey="displayName"
              stroke="#94A3B8"
              fontSize={12}
              fontFamily="Space Grotesk"
              tick={({ payload, x, y, textAnchor }) => {
                const isHovered = hoveredTerminal === payload.value;
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    className={`cursor-pointer transition-colors duration-200 font-bold ${
                      isHovered ? 'fill-[#38BDF8]' : 'fill-[#94A3B8]'
                    }`}
                    onMouseEnter={() => setHoveredTerminal(payload.value)}
                    onMouseLeave={() => setHoveredTerminal(null)}
                  >
                    {payload.value}
                  </text>
                );
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              stroke="#64748B"
              fontSize={10}
              fontFamily="JetBrains Mono"
              tickCount={4}
              axisLine={false}
            />

            <Radar
              name="Congestion Risk"
              dataKey="risk"
              stroke="#38BDF8"
              strokeWidth={2}
              fill="#38BDF8"
              fillOpacity={0.3}
            />

            <Tooltip content={<RadarCustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Terminal Badges */}
      <div className="pt-3 border-t border-border/50 mt-2 space-y-2">
        <div className="text-[11px] font-mono text-text-muted flex items-center justify-between">
          <span>SELECT TERMINAL TO HIGHLIGHT:</span>
          <span className="text-primary font-sans">{activeTerminalInfo.terminal}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {terminalCongestionRisk.map((item) => {
            const isSelected = hoveredTerminal === item.shortName;
            return (
              <button
                key={item.shortName}
                type="button"
                onMouseEnter={() => setHoveredTerminal(item.shortName)}
                onMouseLeave={() => setHoveredTerminal(null)}
                onClick={() => setHoveredTerminal(item.shortName)}
                className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary/20 border-primary text-primary shadow-glow-primary'
                    : 'bg-surface-2 border-border/80 text-text-secondary hover:text-text-primary hover:border-text-muted'
                }`}
              >
                {item.shortName}: {item.risk}%
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TerminalCongestionRadarChart;
