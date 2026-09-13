import React from 'react';
import { colors, radius, spacing } from '@/design-system';
import { MOCK_FORECAST_POINTS } from '@/features/congestion/mockForecastData';

export const ForecastChart: React.FC = () => {
  // Chart dimensions & coordinate math
  const width = 600;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Map data points to SVG coordinates
  const points = MOCK_FORECAST_POINTS.map((pt, idx) => {
    const x = paddingX + (idx / (MOCK_FORECAST_POINTS.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (pt.riskValue / 100) * chartHeight;
    return { x, y, ...pt };
  });

  // Create smooth line path string
  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Create filled area path under the line
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingY + chartHeight} L ${points[0].x} ${paddingY + chartHeight} Z`;

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

          {/* Horizontal Grid lines (0%, 25%, 50%, 75%, 100%) */}
          {[0, 25, 50, 75, 100].map((val) => {
            const y = paddingY + chartHeight - (val / 100) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke={colors.surfaceBorder}
                  strokeWidth="1"
                  strokeDasharray={val === 85 ? '3 3' : 'none'}
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  fill={colors.secondaryText}
                  fontSize="10"
                  textAnchor="end"
                >
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
          {points.map((pt, idx) => {
            const isPeak = pt.isPeak;
            const pointColor = pt.riskValue > 85 ? colors.critical : pt.riskValue > 70 ? colors.warning : colors.success;

            return (
              <g key={idx}>
                {/* Vertical Dotted Guide */}
                <line
                  x1={pt.x}
                  y1={paddingY}
                  x2={pt.x}
                  y2={paddingY + chartHeight}
                  stroke="rgba(148, 163, 184, 0.15)"
                  strokeDasharray="2 2"
                />

                {/* Point Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isPeak ? 6 : 4}
                  fill={colors.surface}
                  stroke={pointColor}
                  strokeWidth={isPeak ? 3 : 2}
                />

                {/* Value Label above point */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  fill={isPeak ? colors.critical : colors.primaryText}
                  fontSize={isPeak ? '12' : '10'}
                  fontWeight={isPeak ? '700' : '500'}
                  textAnchor="middle"
                >
                  {pt.riskValue}%
                </text>

                {/* X-axis Label */}
                <text
                  x={pt.x}
                  y={height - 8}
                  fill={colors.secondaryText}
                  fontSize="11"
                  fontWeight={isPeak ? '600' : '400'}
                  textAnchor="middle"
                >
                  {pt.timeLabel}
                </text>

                {/* Peak Highlight Badge */}
                {isPeak && (
                  <g transform={`translate(${pt.x - 38}, ${pt.y - 32})`}>
                    <rect width="76" height="18" rx="4" fill={colors.critical} />
                    <text x="38" y="12" fill={colors.primaryText} fontSize="9" fontWeight="700" textAnchor="middle">
                      PEAK (24h)
                    </text>
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
