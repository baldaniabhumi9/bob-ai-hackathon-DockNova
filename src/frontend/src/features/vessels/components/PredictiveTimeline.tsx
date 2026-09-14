import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Radio, Sparkles, HelpCircle, AlertCircle } from 'lucide-react';
import { TimelineEvent } from '@/features/dashboard/mockData';

export interface PredictiveTimelineProps {
  events: TimelineEvent[];
}

export const PredictiveTimeline: React.FC<PredictiveTimelineProps> = ({ events }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-surface-1 border border-border shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg text-text-primary tracking-tight">
              Predictive Disruption Timeline
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              AI Forecast
            </span>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Chronological voyage sequence with dynamic confidence intervals.
          </p>
        </div>
      </div>

      {/* Timeline Container (Vertical on desktop/tablet, horizontal scroll on mobile) */}
      <div className="flex-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
        <div className="min-w-[500px] sm:min-w-0 space-y-6 sm:space-y-5 relative">
          {events.map((event, index) => {
            const isPast = event.status === 'past';
            const isCurrent = event.status === 'current';
            const isFuture = event.status === 'future';
            const isLast = index === events.length - 1;

            return (
              <div key={event.id} className="relative flex items-start gap-4 group">
                {/* Connecting Line */}
                {!isLast && (
                  <div
                    className={`absolute left-[13px] top-6 bottom-[-20px] w-0.5 ${
                      isPast
                        ? 'bg-border'
                        : isCurrent
                        ? 'border-l-2 border-dashed border-primary/60'
                        : 'border-l-2 border-dashed border-border'
                    }`}
                  />
                )}

                {/* Timeline Dot with Spring scale */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.08 }}
                  className="relative z-10 flex-shrink-0 mt-1"
                >
                  {isPast && (
                    <div className="w-7 h-7 rounded-full bg-surface-2 border border-border flex items-center justify-center text-text-muted">
                      <div className="w-2.5 h-2.5 rounded-full bg-text-muted/80" />
                    </div>
                  )}

                  {isCurrent && (
                    <div className="relative w-7 h-7 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shadow-glow-primary">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping absolute" />
                      <span className="w-2.5 h-2.5 rounded-full bg-primary relative z-10" />
                    </div>
                  )}

                  {isFuture && (
                    <div className="w-7 h-7 rounded-full bg-surface-1 border-2 border-border group-hover:border-primary/60 flex items-center justify-center transition-colors">
                      <div className="w-2 h-2 rounded-full border border-text-muted group-hover:bg-primary/50 transition-colors" />
                    </div>
                  )}
                </motion.div>

                {/* Event Content Box */}
                <div
                  className={`flex-1 p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-surface-2/80 border-primary/40 shadow-[0_0_15px_-3px_rgba(56,189,248,0.2)]'
                      : 'bg-surface-2/40 border-border/60 hover:bg-surface-2 hover:border-border'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-primary'
                            : isPast
                            ? 'text-text-primary'
                            : 'text-text-secondary'
                        }`}
                      >
                        {event.title}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/20 text-primary border border-primary/30">
                          CURRENT
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-[11px] text-text-muted">
                      {event.time}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed mb-2">
                    {event.description}
                  </p>

                  {/* Future Confidence Interval & Tooltip */}
                  {isFuture && event.interval && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-[11px] font-mono">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-3/80 text-text-secondary border border-border/50">
                        <Clock className="w-3 h-3 text-warning" />
                        <span>{event.interval}</span>
                      </div>

                      {event.confidence && (
                        <div
                          className="relative inline-flex items-center gap-1 text-primary cursor-help"
                          onMouseEnter={() => setActiveTooltip(event.id)}
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{event.confidence}</span>
                          <HelpCircle className="w-3 h-3 opacity-60 ml-0.5" />

                          {/* Hover Prediction Source Tooltip */}
                          {activeTooltip === event.id && (
                            <div className="absolute right-0 bottom-full mb-2 w-56 p-2.5 rounded-lg bg-surface-1 border border-primary/40 shadow-2xl z-30 text-xs font-sans text-text-primary backdrop-blur-md">
                              <span className="font-semibold text-primary block mb-1">
                                Prediction Engine:
                              </span>
                              <span className="text-[11px] text-text-secondary leading-normal">
                                {event.source || 'Watsonx Maritime Predictive Model based on hydrodynamic conditions & historical berth dwells.'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PredictiveTimeline;
