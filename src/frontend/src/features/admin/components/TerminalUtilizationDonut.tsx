import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, Anchor } from 'lucide-react';
import { TerminalUtilizationSlice } from '../mockAdminData';

interface TerminalUtilizationDonutProps {
  data: TerminalUtilizationSlice[];
  liveData?: boolean;
}

const CustomDonutTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const slice: TerminalUtilizationSlice = payload[0].payload;

  return (
    <div className="p-3 rounded-xl bg-surface-1/95 backdrop-blur-md border border-subtle shadow-2xl space-y-1 text-xs min-w-[150px]">
      <div className="font-semibold text-text-primary flex items-center gap-1.5 border-b border-subtle pb-1">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
        <span>{slice.name}</span>
      </div>
      <div className="flex items-center justify-between font-mono">
        <span className="text-text-muted">Throughput Share:</span>
        <span className="font-bold text-text-primary">{slice.value}%</span>
      </div>
      <div className="flex items-center justify-between font-mono text-[11px] text-text-muted">
        <span>Managed Berths:</span>
        <span>{slice.berthCount} berths</span>
      </div>
    </div>
  );
};

export const TerminalUtilizationDonut: React.FC<TerminalUtilizationDonutProps> = ({ data }) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-secondary" />
            <h3 className="font-heading font-bold text-sm sm:text-base text-text-primary">
              Terminal Utilization
            </h3>
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5">Share of regional berth traffic</p>
        </div>
        <span className="text-[11px] font-mono text-text-muted px-2 py-0.5 rounded bg-surface-2 border border-subtle">
          4 Terminals
        </span>
      </div>

      <div className="relative h-52 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomDonutTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={78}
              paddingAngle={4}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#050B14"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Donut Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <Anchor className="w-4 h-4 text-text-muted mb-0.5" />
          <span className="font-mono font-bold text-sm text-text-primary">42 Berths</span>
          <span className="text-[9px] uppercase tracking-wider text-text-muted font-mono">Managed</span>
        </div>
      </div>

      {/* Mini Legend */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-subtle text-[10px] font-mono">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-text-muted truncate">{item.name.replace(' Terminal', '')}</span>
            </div>
            <span className="font-bold text-text-primary shrink-0">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
