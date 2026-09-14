import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { Eye, EyeOff, ShieldAlert, Sparkles, Scale } from 'lucide-react';
import { RadarPoint, AlternatePortOption, RoutingVessel } from '../mockRouteData';

interface RouteRadarComparisonProps {
  vessel: RoutingVessel;
  selectedOption: AlternatePortOption;
}

export const RouteRadarComparison: React.FC<RouteRadarComparisonProps> = ({
  vessel,
  selectedOption,
}) => {
  const [showOriginal, setShowOriginal] = useState<boolean>(true);
  const [showAlternate, setShowAlternate] = useState<boolean>(true);

  const data = selectedOption.radarScores;

  // Custom Dark Mode Glassmorphic Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint: RadarPoint = payload[0].payload;
      return (
        <div className="p-3.5 rounded-xl bg-surface-2/95 backdrop-blur-md border border-border text-xs shadow-xl space-y-2 min-w-[220px]">
          <div className="font-heading font-bold text-text-primary text-sm flex items-center gap-1.5 border-b border-border/60 pb-1.5">
            <Scale className="w-3.5 h-3.5 text-primary" />
            <span>{dataPoint.metric}</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-danger flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-danger inline-block" />
                <span>Original ({vessel.originalDestination.port}):</span>
              </span>
              <span className="font-bold text-danger">{dataPoint.originalFormatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-success flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                <span>Alternate ({selectedOption.name}):</span>
              </span>
              <span className="font-bold text-success">{dataPoint.alternateFormatted}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-surface-1 border border-border shadow-xl space-y-4"
    >
      {/* Header with Title & Series Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-heading font-bold text-lg text-text-primary tracking-tight">
              Multidimensional Route Radar Comparison
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-2 text-text-muted border border-border">
              Normalized (0-100)
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Comparing <span className="text-danger font-medium">{vessel.originalDestination.port}</span> vs{' '}
            <span className="text-success font-medium">{selectedOption.name}</span> across 5 mission-critical vectors
          </p>
        </div>

        {/* Interactive Series Toggle Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-2 border transition-all cursor-pointer ${
              showOriginal
                ? 'bg-danger/10 border-danger/40 text-danger shadow-glow-danger/20'
                : 'bg-surface-2 border-border text-text-muted hover:text-text-secondary opacity-60'
            }`}
          >
            {showOriginal ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Original (Singapore)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAlternate(!showAlternate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-2 border transition-all cursor-pointer ${
              showAlternate
                ? 'bg-success/10 border-success/40 text-success shadow-glow-success/20'
                : 'bg-surface-2 border-border text-text-muted hover:text-text-secondary opacity-60'
            }`}
          >
            {showAlternate ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Alternate ({selectedOption.portCode})</span>
          </button>
        </div>
      </div>

      {/* Radar Chart Container */}
      <div className="w-full h-[320px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#243447" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#94A3B8', fontSize: 12, fontFamily: 'Space Grotesk, sans-serif' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
              stroke="#243447"
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Original Series (Danger Red) */}
            {showOriginal && (
              <Radar
                name={`Original: ${vessel.originalDestination.port}`}
                dataKey="original"
                stroke="#F87171"
                fill="#F87171"
                fillOpacity={0.15}
                strokeWidth={2}
                dot={{ r: 3, fill: '#F87171', strokeWidth: 1 }}
              />
            )}

            {/* Selected Alternate Series (Success Emerald Green) */}
            {showAlternate && (
              <Radar
                name={`Alternate: ${selectedOption.name}`}
                dataKey="alternate"
                stroke="#34D399"
                fill="#34D399"
                fillOpacity={0.2}
                strokeWidth={2}
                dot={{ r: 4, fill: '#34D399', strokeWidth: 1 }}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
