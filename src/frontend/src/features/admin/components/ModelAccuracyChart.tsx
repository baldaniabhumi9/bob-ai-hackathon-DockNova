import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { Target, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ModelAccuracyPoint } from '../mockAdminData';

interface ModelAccuracyChartProps {
  data: ModelAccuracyPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomAccuracyTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const dataPoint: ModelAccuracyPoint = payload[0].payload;
  const isDrift = dataPoint.accuracy < dataPoint.threshold;

  return (
    <div className="p-3.5 rounded-xl bg-surface-1/95 backdrop-blur-md border border-subtle shadow-2xl space-y-2 text-xs min-w-[180px]">
      <div className="flex items-center justify-between border-b border-subtle pb-1.5">
        <span className="font-semibold text-text-primary">{dataPoint.date}</span>
        <span className="text-[10px] font-mono text-text-muted">{dataPoint.day}</span>
      </div>

      <div className="flex items-center justify-between font-mono">
        <span className="text-text-muted">Accuracy:</span>
        <span className={`font-bold text-sm ${isDrift ? 'text-danger' : 'text-primary'}`}>
          {dataPoint.accuracy.toFixed(1)}%
        </span>
      </div>

      <div className="flex items-center justify-between font-mono text-[11px] text-text-muted">
        <span>SLA Baseline:</span>
        <span>{dataPoint.threshold}%</span>
      </div>

      {isDrift ? (
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-danger/30 text-danger font-semibold text-[10px]">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>⚠️ Drift detected! Below 85% SLA</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-subtle text-success text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Model within nominal tolerance</span>
        </div>
      )}
    </div>
  );
};

export const ModelAccuracyChart: React.FC<ModelAccuracyChartProps> = ({ data }) => {
  const currentAccuracy = data[data.length - 1]?.accuracy || 96.4;
  const lowestAccuracy = Math.min(...data.map((d) => d.accuracy));

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle flex flex-col justify-between shadow-sm">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-bold text-base text-text-primary">
              Model Accuracy Over Time
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            watsonx Granite-13B Maritime predictor inference accuracy (Last 30 Days)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-subtle">
            <span className="text-text-muted">Current:</span>
            <span className="font-bold text-primary">{currentAccuracy.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 border border-subtle">
            <span className="text-text-muted">Min:</span>
            <span className={`font-bold ${lowestAccuracy < 85 ? 'text-danger' : 'text-text-secondary'}`}>
              {lowestAccuracy.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#243447" opacity={0.5} vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#64748B"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
              axisLine={{ stroke: '#243447' }}
              interval={4}
            />

            <YAxis
              domain={[75, 100]}
              stroke="#64748B"
              fontSize={11}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
              axisLine={false}
              unit="%"
            />

            <Tooltip content={<CustomAccuracyTooltip />} />

            {/* Reference line at 85% threshold */}
            <ReferenceLine
              y={85}
              stroke="#F87171"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'SLA Threshold (85%)',
                fill: '#F87171',
                fontSize: 10,
                position: 'insideTopRight',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            />

            {/* Gradient Fill below Line */}
            <Area
              type="monotone"
              dataKey="accuracy"
              fill="url(#accuracyGradient)"
              stroke="none"
              isAnimationActive={true}
              animationDuration={1500}
            />

            {/* Main Accuracy Line */}
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#38BDF8"
              strokeWidth={3}
              dot={{ fill: '#050B14', stroke: '#38BDF8', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, fill: '#38BDF8', stroke: '#F0F4F8', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Threshold Legend */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-subtle text-[11px] text-text-muted font-mono">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-primary" />
          <span>Observed Daily Precision</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-danger border-dashed" />
          <span>Critical Drift Baseline (85%)</span>
        </div>
      </div>
    </div>
  );
};
