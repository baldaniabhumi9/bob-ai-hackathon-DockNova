import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Sparkles, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { CascadingImpact } from '@/features/dashboard/mockData';

export interface CascadingImpactChartProps {
  impact: CascadingImpact;
}

const CustomImpactTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 rounded-lg bg-surface-2 border border-border shadow-2xl text-xs font-mono backdrop-blur-md">
        <div className="font-semibold text-text-primary mb-1">{data.name}</div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">Impact Magnitude:</span>
          <span className="font-bold text-primary">{data.metric}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const CascadingImpactChart: React.FC<CascadingImpactChartProps> = ({ impact }) => {
  return (
    <div className="w-full p-6 rounded-2xl bg-surface-1 border border-border shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-xl text-text-primary tracking-tight">
              Cascading Delay & Quay Ripple Analysis
            </h3>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20">
              Ripple Horizon
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Predictive simulation of downstream bottlenecks triggered across adjacent terminal quays.
          </p>
        </div>

        {/* Chain Flow Indicators */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-text-muted">
          <span>This Delay</span>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
          <span>Berth Congestion</span>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
          <span>Crane Wait</span>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
          <span>Downstream Call</span>
        </div>
      </div>

      {/* Grid: BarChart + IBM Bob Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Chart (7 cols) */}
        <div className="lg:col-span-7 w-full h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={impact.cascadeSteps}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid stroke="#243447" strokeDasharray="3 3" vertical={false} opacity={0.6} />

              <XAxis
                dataKey="name"
                stroke="#94A3B8"
                fontSize={11}
                fontFamily="Space Grotesk"
                tickLine={false}
                axisLine={{ stroke: '#243447' }}
              />

              <YAxis
                stroke="#64748B"
                fontSize={11}
                fontFamily="JetBrains Mono"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip content={<CustomImpactTooltip />} />

              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {impact.cascadeSteps.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.impactColor || '#38BDF8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right IBM Bob Analysis Card (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-gradient-to-br from-primary/10 via-surface-2 to-secondary/10 border border-primary/20 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-primary">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-bold">IBM BOB COPILOT CASING SUMMARY</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-1/80 text-success border border-success/30">
              Mitigation Available
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed font-sans">
            {impact.aiSummary}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs font-mono text-text-muted border-t border-border/40">
            <span>RECOMMENDED MITIGATION:</span>
            <span className="text-primary font-bold">Shift to Quay B5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CascadingImpactChart;
