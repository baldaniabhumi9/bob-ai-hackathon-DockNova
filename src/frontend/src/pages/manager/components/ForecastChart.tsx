import React, { useEffect, useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { MOCK_FORECAST_POINTS } from '@/features/congestion/mockForecastData';
import { api, CongestionForecast } from '@/services';

interface ForecastPoint {
  timeLabel: string;
  hours: number;
  riskValue: number;
  isPeak?: boolean;
}

function apiForecastToPoints(forecasts: CongestionForecast[]): ForecastPoint[] {
  const sorted = [...forecasts].sort((a, b) =>
    (a.forecastTime ?? '') < (b.forecastTime ?? '') ? -1 : 1,
  );
  const step = sorted.length > 1 ? Math.floor(sorted.length / 7) : 1;
  const sampled = sorted.filter((_, i) => i % step === 0).slice(0, 8);
  const maxRisk = Math.max(...sampled.map((f) => f.congestionProbability));
  return sampled.map((f, idx) => {
    const hours = idx * (72 / Math.max(sampled.length - 1, 1));
    const riskValue = Math.round(f.congestionProbability * 100);
    const isPeak = f.congestionProbability === maxRisk && idx > 0;
    const label = hours === 0 ? 'Now' : hours <= 72 ? `${Math.round(hours)}h` : '72h';
    return { timeLabel: label, hours: Math.round(hours), riskValue, isPeak };
  });
}

export const ForecastChart: React.FC = () => {
  const [points, setPoints] = useState<ForecastPoint[]>(MOCK_FORECAST_POINTS);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.getCongestionForecast()
      .then((forecasts) => {
        if (!cancelled && forecasts.length > 0) {
          setPoints(apiForecastToPoints(forecasts));
          setIsLive(true);
        }
      })
      .catch(() => { /* keep mock data on error */ });
    return () => { cancelled = true; };
  }, []);

  // Chart dimensions & coordinate math
  const width = 600;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const svgPoints = points.map((pt, idx) => {
    const x = paddingX + (idx / Math.max(points.length - 1, 1)) * chartWidth;
    const y = paddingY + chartHeight - (pt.riskValue / 100) * chartHeight;
    return { x, y, ...pt };
  });

  const pathD = svgPoints.reduce((acc, pt, idx) =>
    idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, '');

  const areaD = `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${paddingY + chartHeight} L ${svgPoints[0].x} ${paddingY + chartHeight} Z`;

  return (
    <div
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        border: `1px solid ${colors.surfaceBorder}`,
        padding: spacing.lg,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: colors.primaryText }}>
            72-Hour Congestion Forecast
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.8125rem', color: colors.secondaryText }}>
            Predicted risk level trajectory (%) across the terminal
            {isLive && <span style={{ color: colors.success, marginLeft: '6px' }}>● Live</span>}
          </p>
        </div>

        <div style={{ display: 'flex', gap: spacing.md, fontSize: '0.75rem', color: colors.secondaryText }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.success }} /> &lt;70% Normal
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.warning }} /> 70-85% Warning
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.critical }} /> &gt;85% Critical
          </span>
        </div>
      </div>

      {/* SVG Line / Area Chart */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="forecastAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.critical} stopOpacity="0.35" />
              <stop offset="50%" stopColor={colors.warning} stopOpacity="0.15" />
              <stop offset="100%" stopColor={colors.novaCyan} stopOpacity="0.02" />
            </linearGradient>

            <linearGradient id="forecastLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={colors.warning} />
              <stop offset="35%" stopColor={colors.critical} />
              <stop offset="70%" stopColor={colors.warning} />
              <stop offset="100%" stopColor={colors.success} />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = paddingY + chartHeight - (val / 100) * chartHeight;
            return (
              <g key={val}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke={colors.surfaceBorder} strokeWidth="1" />
                <text x={paddingX - 8} y={y + 4} fill={colors.secondaryText} fontSize="10" textAnchor="end">
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaD} fill="url(#forecastAreaGrad)" />

          {/* Main Forecast Line */}
          <path d={pathD} fill="none" stroke="url(#forecastLineGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points & Peak Marker */}
          {svgPoints.map((pt, idx) => {
            const isPeak = pt.isPeak;
            const pointColor = pt.riskValue > 85 ? colors.critical : pt.riskValue > 70 ? colors.warning : colors.success;

            return (
              <g key={idx}>
                <line x1={pt.x} y1={paddingY} x2={pt.x} y2={paddingY + chartHeight} stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="2 2" />
                <circle cx={pt.x} cy={pt.y} r={isPeak ? 6 : 4} fill={colors.surface} stroke={pointColor} strokeWidth={isPeak ? 3 : 2} />
                <text x={pt.x} y={pt.y - 10} fill={isPeak ? colors.critical : colors.primaryText} fontSize={isPeak ? '12' : '10'} fontWeight={isPeak ? '700' : '500'} textAnchor="middle">
                  {pt.riskValue}%
                </text>
                <text x={pt.x} y={height - 8} fill={colors.secondaryText} fontSize="11" fontWeight={isPeak ? '600' : '400'} textAnchor="middle">
                  {pt.timeLabel}
                </text>
                {isPeak && (
                  <g transform={`translate(${pt.x - 38}, ${pt.y - 32})`}>
                    <rect width="76" height="18" rx="4" fill={colors.critical} />
                    <text x="38" y="12" fill={colors.primaryText} fontSize="9" fontWeight="700" textAnchor="middle">PEAK</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
