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
import { Compass, Loader2, WifiOff } from 'lucide-react';
import type { BerthRisk } from '@/services';

interface TerminalCongestionRadarChartProps {
  berthRisks: BerthRisk[];
  loading: boolean;
  error: string | null;
}

const RadarCustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload as BerthRisk & { displayName: string };
    const isCritical = d.riskScore >= 70;
    const isMedium = d.riskScore >= 40 && d.riskScore < 70;

    return (
      <div className="p-3 rounded-lg bg-surface-2/95 border border-border shadow-xl backdrop-blur-md text-xs font-mono">
        <div className="font-semibold text-text-primary mb-1.5 flex items-center justify-between gap-3">
          <span>{d.berthName}</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              isCritical
                ? 'bg-danger/20 text-danger'
                : isMedium
                ? 'bg-warning/20 text-warning'
                : 'bg-success/20 text-success'
            }`}
          >
            {d.riskLevel}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted">Risk Score:</span>
            <span className="font-bold text-primary">{d.riskScore}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted">Utilization:</span>
            <span className="text-text-secondary">{d.utilizationPct}%</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted">Status:</span>
            <span className="text-text-secondary">{d.occupancyStatus}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted">Cranes:</span>
            <span className="text-text-secondary">
              {d.operationalCranes}/{d.totalCranes} op.
            </span>
          </div>
          {d.vesselName && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-text-muted">Vessel:</span>
              <span className="text-text-secondary truncate max-w-[120px]">{d.vesselName}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const TerminalCongestionRadarChart: React.FC<TerminalCongestionRadarChartProps> = ({
  berthRisks,
  loading,
  error,
}) => {
  const [hoveredBerth, setHoveredBerth] = useState<string | null>(null);

  const chartData = berthRisks.map((b) => ({
    ...b,
    displayName: b.berthName.replace(/^Berth\s+/i, ''),
    risk: b.riskScore,
  }));

  const activeBerth =
    berthRisks.find((b) => b.berthId === hoveredBerth) ?? berthRisks[0] ?? null;

  return (
    <div className="h-full flex flex-col justify-between p-6 rounded-2xl bg-surface-1 border border-border shadow-lg">
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-text-primary tracking-tight">
            Berth Risk — Live
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-2 text-text-secondary border border-border">
            {loading ? '…' : error ? 'OFFLINE' : `${berthRisks.length} berths`}
          </span>
        </div>
        <p className="text-xs text-text-muted mt-0.5">
          Per-berth risk scores from{' '}
          <span className="font-mono text-primary/80">/api/port/berth-risk</span>
        </p>
      </div>

      {/* Chart Body */}
      <div className="relative w-full h-64 sm:h-72 my-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-1/70 rounded-xl z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {!loading && (error || berthRisks.length === 0) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center z-10">
            <WifiOff className="w-8 h-8 text-text-muted" />
            <p className="text-xs font-mono text-text-muted">
              Berth data unavailable
            </p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 border border-border text-text-muted font-mono">
              Simulated
            </span>
          </div>
        )}

        <div className={loading || error || berthRisks.length === 0 ? 'opacity-20 pointer-events-none' : ''}>
          <ResponsiveContainer width="100%" height={288}>
            <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
              <PolarGrid stroke="#243447" strokeDasharray="3 3" opacity={0.8} />

              <PolarAngleAxis
                dataKey="displayName"
                stroke="#94A3B8"
                fontSize={12}
                fontFamily="Space Grotesk"
                tick={({ payload, x, y, textAnchor }) => {
                  const isHovered = hoveredBerth
                    ? berthRisks.find((b) => b.berthId === hoveredBerth)?.berthName.replace(/^Berth\s+/i, '') === payload.value
                    : false;
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor={textAnchor}
                      className={`cursor-pointer transition-colors duration-200 font-bold ${
                        isHovered ? 'fill-[#38BDF8]' : 'fill-[#94A3B8]'
                      }`}
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
                name="Risk Score"
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
      </div>

      {/* Berth Badges */}
      <div className="pt-3 border-t border-border/50 mt-2 space-y-2">
        <div className="text-[11px] font-mono text-text-muted flex items-center justify-between">
          <span>SELECT BERTH:</span>
          <span className="text-primary font-sans truncate max-w-[140px]">
            {activeBerth ? activeBerth.berthName : '—'}
          </span>
        </div>

        {berthRisks.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {berthRisks.map((b) => {
              const isSelected = hoveredBerth === b.berthId;
              return (
                <button
                  key={b.berthId}
                  type="button"
                  onMouseEnter={() => setHoveredBerth(b.berthId)}
                  onMouseLeave={() => setHoveredBerth(null)}
                  onClick={() => setHoveredBerth(b.berthId)}
                  className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary/20 border-primary text-primary shadow-glow-primary'
                      : 'bg-surface-2 border-border/80 text-text-secondary hover:text-text-primary hover:border-text-muted'
                  }`}
                >
                  {b.berthName.replace(/^Berth\s+/i, '')}: {b.riskScore}%
                </button>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-muted italic">No berth data</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-2 border border-border text-text-muted font-mono">
                Simulated
              </span>
            </div>
          )
        )}

        {loading && (
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-16 rounded-lg bg-surface-3 animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalCongestionRadarChart;
