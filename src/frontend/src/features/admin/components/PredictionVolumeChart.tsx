import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { BarChart3, Zap } from 'lucide-react';
import { HourlyPredictionVolume } from '../mockAdminData';

interface PredictionVolumeChartProps {
  data: HourlyPredictionVolume[];
  simulated?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomBarTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const point: HourlyPredictionVolume = payload[0].payload;

  return (
    <div className="p-3 rounded-xl bg-surface-1/95 backdrop-blur-md border border-subtle shadow-2xl space-y-1.5 text-xs min-w-[150px]">
      <div className="flex items-center justify-between border-b border-subtle pb-1">
        <span className="font-mono text-text-muted">{point.hour} UTC</span>
        {point.isPeak && (
          <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[9px] font-bold font-mono">
            PEAK HOUR
          </span>
        )}
      </div>

      <div className="flex items-center justify-between font-mono">
        <span className="text-text-muted">Inferences:</span>
        <span className="font-bold text-sm text-text-primary">
          {point.predictions.toLocaleString()}
        </span>
      </div>

      <div className="text-[10px] text-text-muted">
        {point.isPeak
          ? 'Quay crane allocation peak surge'
          : 'Normal background AIS stream'}
      </div>
    </div>
  );
};

export const PredictionVolumeChart: React.FC<PredictionVolumeChartProps> = ({ data, simulated }) => {
  const totalVolume = data.reduce((acc, curr) => acc + curr.predictions, 0);
  const peakVolume = Math.max(...data.map((d) => d.predictions));

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle flex flex-col justify-between shadow-sm">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-secondary" />
            <h3 className="font-heading font-bold text-base text-text-primary">
              Prediction Volume (24h)
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Hourly inference distribution across all berths & vessel routes
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-subtle">
            <span className="text-text-muted">Total:</span>
            <span className="font-bold text-text-primary">{totalVolume.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/30 text-accent">
            <Zap className="w-3 h-3" />
            <span className="font-bold">Peak {peakVolume.toLocaleString()}/h</span>
          </div>
        </div>
      </div>

      {/* BarChart Container */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGradientPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
              <linearGradient id="barGradientPeak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#243447" opacity={0.5} vertical={false} />

            <XAxis
              dataKey="hour"
              stroke="#64748B"
              fontSize={10}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
              axisLine={{ stroke: '#243447' }}
              interval={2}
            />

            <YAxis
              stroke="#64748B"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
            />

            <Tooltip content={<CustomBarTooltip />} />

            <Bar
              dataKey="predictions"
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isPeak ? 'url(#barGradientPeak)' : 'url(#barGradientPrimary)'}
                  opacity={entry.isPeak ? 1 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Peak Window Tag */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-subtle text-[11px] text-text-muted font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-primary to-secondary" />
          <span>Nominal Operational Hours</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-accent to-secondary" />
          <span className="text-accent font-semibold">Peak Window (14:00 - 17:00 UTC)</span>
        </div>
      </div>
    </div>
  );
};
