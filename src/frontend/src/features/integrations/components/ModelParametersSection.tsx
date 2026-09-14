import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SlidersHorizontal,
  BrainCircuit,
  Clock,
  RefreshCw,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Compass,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { ModelParameters, PredictionWindow, RetrainingFrequency } from '../types';

export interface ModelParametersSectionProps {
  parameters: ModelParameters;
  onChange: (parameters: ModelParameters) => void;
}

export const ModelParametersSection: React.FC<ModelParametersSectionProps> = ({
  parameters,
  onChange,
}) => {
  const [isSliderDragging, setIsSliderDragging] = useState(false);

  const handleUpdate = <K extends keyof ModelParameters>(key: K, value: ModelParameters[K]) => {
    onChange({
      ...parameters,
      [key]: value,
    });
  };

  const predictionWindows: { id: PredictionWindow; label: string; desc: string }[] = [
    { id: '24h', label: '24 Hours', desc: 'Tactical port dispatch' },
    { id: '48h', label: '48 Hours', desc: 'Strait approach transit' },
    { id: '72h', label: '72 Hours', desc: 'Strategic berth planning' },
  ];

  const retrainingFrequencies: { id: RetrainingFrequency; label: string; desc: string }[] = [
    { id: 'Daily', label: 'Daily (Overnight)', desc: 'Re-train nightly on new AIS & booking patterns' },
    { id: 'Weekly', label: 'Weekly (Sundays)', desc: 'Balance compute with seasonal traffic trends' },
    { id: 'Monthly', label: 'Monthly', desc: 'Long-term structural macroeconomic recalibration' },
  ];

  // Calculate percentage progress for slider track (min: 70, max: 95)
  const thresholdPercentage = ((parameters.congestionThreshold - 70) / (95 - 70)) * 100;

  return (
    <div className="bg-surface-1 rounded-2xl p-6 sm:p-7 border border-subtle space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-heading font-bold text-lg sm:text-xl text-text-primary">
                Model Parameters & Predictive Tuning
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-accent/15 text-accent border border-accent/30">
                Inference Controls
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Tune heuristic thresholds, forecast horizons, and explainability controls for port congestion algorithms.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-text-muted flex items-center gap-1.5 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          Auto-saves to operational config
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Congestion Threshold Slider (70% to 95%) */}
        <div className="p-5 rounded-xl bg-surface-2/60 border border-border/80 space-y-3.5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                <label className="text-xs sm:text-sm font-semibold text-text-primary">
                  Congestion Threshold
                </label>
              </div>
              <p className="text-xs text-text-secondary">
                Trigger high-density congestion protocol when quay occupancy reaches this ratio.
              </p>
            </div>
            <div className="flex items-baseline gap-1 bg-surface-3 px-3 py-1 rounded-lg border border-border">
              <span className="font-mono font-bold text-base text-primary">
                {parameters.congestionThreshold}%
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="relative flex items-center">
              <input
                type="range"
                min="70"
                max="95"
                step="1"
                value={parameters.congestionThreshold}
                onMouseDown={() => setIsSliderDragging(true)}
                onMouseUp={() => setIsSliderDragging(false)}
                onTouchStart={() => setIsSliderDragging(true)}
                onTouchEnd={() => setIsSliderDragging(false)}
                onChange={(e) => handleUpdate('congestionThreshold', parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary"
                style={{
                  background: `linear-gradient(to right, #38BDF8 0%, #38BDF8 ${thresholdPercentage}%, #1C2840 ${thresholdPercentage}%, #1C2840 100%)`,
                  transform: isSliderDragging ? 'scaleY(1.2)' : 'scaleY(1)',
                  transition: 'transform 0.15s ease',
                }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-text-muted">
              <span>70% (Cautious)</span>
              <span className="text-primary font-semibold">82% (Default Recommended)</span>
              <span>95% (Aggressive)</span>
            </div>
          </div>
        </div>

        {/* 2. Prediction Window Selector (24h / 48h / 72h) */}
        <div className="p-5 rounded-xl bg-surface-2/60 border border-border/80 space-y-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              <label className="text-xs sm:text-sm font-semibold text-text-primary">
                Prediction Window Horizon
              </label>
            </div>
            <p className="text-xs text-text-secondary">
              Lookahead scope for incoming vessel queue modeling and tidal simulation.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {predictionWindows.map((pw) => {
              const isSelected = parameters.predictionWindow === pw.id;
              return (
                <button
                  key={pw.id}
                  type="button"
                  onClick={() => handleUpdate('predictionWindow', pw.id)}
                  className={`relative p-3 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-secondary/15 border-secondary text-text-primary shadow-sm font-semibold'
                      : 'bg-surface-3/60 border-border/70 hover:bg-surface-3 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="predictionWindowActive"
                      className="absolute inset-0 rounded-xl border-2 border-secondary pointer-events-none"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <div className="text-sm font-mono font-bold">{pw.id}</div>
                  <div className="text-[10px] text-text-muted mt-0.5 truncate">{pw.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Retraining Frequency Dropdown */}
        <div className="p-5 rounded-xl bg-surface-2/60 border border-border/80 space-y-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-accent" />
              <label className="text-xs sm:text-sm font-semibold text-text-primary">
                Retraining Frequency
              </label>
            </div>
            <p className="text-xs text-text-secondary">
              Cadence for batch retraining of vessel turnaround ML estimators.
            </p>
          </div>

          <div className="relative pt-1">
            <select
              value={parameters.retrainingFrequency}
              onChange={(e) => handleUpdate('retrainingFrequency', e.target.value as RetrainingFrequency)}
              className="w-full px-3.5 py-2.5 bg-surface-3 rounded-xl text-xs sm:text-sm font-medium text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all cursor-pointer"
            >
              {retrainingFrequencies.map((rf) => (
                <option key={rf.id} value={rf.id} className="bg-surface-2 text-text-primary">
                  {rf.label} — {rf.desc}
                </option>
              ))}
            </select>
          </div>
          <div className="text-[11px] font-mono text-text-muted">
            Next scheduled cycle: Today at 02:00 UTC (Cluster Worker Node-04)
          </div>
        </div>

        {/* 4. Explainable AI & Auto-Reroute Toggles */}
        <div className="p-5 rounded-xl bg-surface-2/60 border border-border/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-warning" />
              <label className="text-xs sm:text-sm font-semibold text-text-primary">
                Algorithmic Autonomy & Reasoning
              </label>
            </div>
            <p className="text-xs text-text-secondary">
              Control decision transparency and automated route advisory generation.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Toggle 1: Enable Explainable AI */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-3/50 border border-border/60">
              <div className="space-y-0.5 pr-2">
                <div className="text-xs font-semibold text-text-primary">
                  Enable Explainable AI (XAI)
                </div>
                <div className="text-[11px] text-text-muted">
                  Provide step-by-step reasoning behind copilot recommendations.
                </div>
              </div>

              {/* Smooth Spring-Animated Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={parameters.explainableAi}
                onClick={() => handleUpdate('explainableAi', !parameters.explainableAi)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  parameters.explainableAi ? 'bg-primary' : 'bg-surface-3'
                }`}
              >
                <motion.span
                  className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0"
                  animate={{ x: parameters.explainableAi ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Toggle 2: Enable Auto-Reroute Suggestions */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-3/50 border border-border/60">
              <div className="space-y-0.5 pr-2">
                <div className="text-xs font-semibold text-text-primary">
                  Enable Auto-Reroute Suggestions
                </div>
                <div className="text-[11px] text-text-muted">
                  Generate proactive fairway bypass advisories on channel blockage.
                </div>
              </div>

              {/* Smooth Spring-Animated Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={parameters.autoRerouteSuggestions}
                onClick={() => handleUpdate('autoRerouteSuggestions', !parameters.autoRerouteSuggestions)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  parameters.autoRerouteSuggestions ? 'bg-primary' : 'bg-surface-3'
                }`}
              >
                <motion.span
                  className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0"
                  animate={{ x: parameters.autoRerouteSuggestions ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelParametersSection;
