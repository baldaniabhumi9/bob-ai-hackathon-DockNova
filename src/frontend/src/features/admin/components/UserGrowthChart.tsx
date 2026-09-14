import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { UserPlus, TrendingUp } from 'lucide-react';
import { UserGrowthPoint } from '../mockAdminData';

interface UserGrowthChartProps {
  data: UserGrowthPoint[];
}

const CustomGrowthTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const point: UserGrowthPoint = payload[0].payload;

  return (
    <div className="p-3 rounded-xl bg-surface-1/95 backdrop-blur-md border border-subtle shadow-2xl space-y-1.5 text-xs min-w-[140px]">
      <div className="font-semibold text-text-primary border-b border-subtle pb-1">
        {point.day}
      </div>
      <div className="flex items-center justify-between font-mono">
        <span className="text-text-muted">Active Users:</span>
        <span className="font-bold text-primary">{point.activeUsers.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between font-mono text-[11px]">
        <span className="text-text-muted">New Signups:</span>
        <span className="font-bold text-success">+{point.newRegistrations}</span>
      </div>
    </div>
  );
};

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-bold text-sm sm:text-base text-text-primary">
              User Growth (7d)
            </h3>
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5">Active carrier & port seats</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono font-bold text-success px-2 py-0.5 rounded bg-success/10 border border-success/20">
          <TrendingUp className="w-3 h-3" />
          <span>+12.4%</span>
        </div>
      </div>

      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#243447" opacity={0.4} vertical={false} />

            <XAxis
              dataKey="day"
              stroke="#64748B"
              fontSize={10}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
              axisLine={{ stroke: '#243447' }}
            />

            <YAxis
              domain={['dataMin - 100', 'dataMax + 50']}
              stroke="#64748B"
              fontSize={10}
              fontFamily="JetBrains Mono, monospace"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            />

            <Tooltip content={<CustomGrowthTooltip />} />

            <Area
              type="monotone"
              dataKey="activeUsers"
              stroke="#38BDF8"
              strokeWidth={2.5}
              fill="url(#userGrowthGradient)"
              isAnimationActive={true}
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-subtle text-[11px] text-text-muted font-mono">
        <span>Mon: 1,180 seats</span>
        <span className="text-primary font-semibold">Sun: 1,428 seats</span>
      </div>
    </div>
  );
};
