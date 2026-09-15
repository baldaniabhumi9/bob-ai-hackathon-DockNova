import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Ship, Anchor, AlertTriangle, Clock, TrendingDown, Minus } from 'lucide-react';
import { CountUpNumber } from './CountUpNumber';
import type { VesselOperatorData } from '../hooks/useVesselOperatorData';

interface KpiCardsRowProps {
  kpi: VesselOperatorData['kpi'];
  loading: VesselOperatorData['loading'];
  errors: VesselOperatorData['errors'];
}

const KpiSkeleton: React.FC = () => (
  <div className="h-10 w-24 rounded-lg bg-surface-3 animate-pulse" />
);

const KpiValue: React.FC<{
  value: number | null;
  isLoading: boolean;
  hasError: boolean;
  decimals?: number;
  suffix?: string;
  colorClass?: string;
}> = ({ value, isLoading, hasError, decimals = 0, suffix = '', colorClass = '' }) => {
  if (isLoading) return <KpiSkeleton />;
  if (hasError || value === null) {
    return (
      <span className="text-3xl sm:text-4xl font-bold tracking-tight text-text-muted flex items-baseline gap-2">
        —
        <span className="text-xs font-mono text-text-muted/60 font-normal">(demo)</span>
      </span>
    );
  }
  return (
    <div className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
      <CountUpNumber end={value} decimals={decimals} suffix={suffix} className={colorClass} />
    </div>
  );
};

export const KpiCardsRow: React.FC<KpiCardsRowProps> = ({ kpi, loading, errors }) => {
  const cards = [
    {
      id: 'active-vessels',
      title: 'Active Vessels',
      value: kpi.activeVessels,
      isLoading: loading.portStatus,
      hasError: !!errors.portStatus,
      decimals: 0,
      suffix: '',
      icon: <Ship className="w-5 h-5 text-primary" />,
      colorClass: 'text-primary',
      glowClass: 'hover:shadow-glow-primary',
      subtext: 'From /api/port/status · total vessels',
      trendLabel: 'Live',
      trendPositive: true as true | false | null,
    },
    {
      id: 'upcoming-arrivals',
      title: 'Upcoming Arrivals (<24h)',
      value: kpi.upcomingArrivals,
      isLoading: loading.vessels,
      hasError: !!errors.vessels,
      decimals: 0,
      suffix: '',
      icon: <Anchor className="w-5 h-5 text-warning" />,
      colorClass: 'text-warning',
      glowClass: 'hover:shadow-[0_0_20px_-2px_rgba(251,191,36,0.35)]',
      subtext: 'ETA within 24 h · from /api/vessels',
      trendLabel: 'Live',
      trendPositive: true as true | false | null,
    },
    {
      id: 'delayed-vessels',
      title: 'Delayed Vessels',
      value: kpi.delayedVessels,
      isLoading: loading.vessels,
      hasError: !!errors.vessels,
      decimals: 0,
      suffix: '',
      icon: <AlertTriangle className="w-5 h-5 text-danger" />,
      colorClass: 'text-danger',
      glowClass: 'hover:shadow-glow-danger',
      subtext: 'Status = DELAYED · from /api/vessels',
      trendLabel: 'Live',
      trendPositive: true as true | false | null,
    },
    {
      id: 'forecast-wait',
      title: 'Forecast Wait Time',
      value: kpi.forecastWaitHours,
      isLoading: loading.forecast,
      hasError: !!errors.forecast,
      decimals: 1,
      suffix: 'h',
      icon: <Clock className="w-5 h-5 text-text-secondary" />,
      colorClass: 'text-text-secondary',
      glowClass: 'hover:shadow-[0_0_20px_-2px_rgba(148,163,184,0.25)]',
      subtext: 'Congestion forecast · /api/congestion/forecast',
      trendLabel: 'Forecast',
      trendPositive: null as true | false | null,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {cards.map((card) => (
        <motion.div
          key={card.id}
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.3 } }}
          className={`relative p-6 rounded-2xl bg-surface-1 border border-border transition-all duration-300 ${card.glowClass} flex flex-col justify-between group cursor-default`}
        >
          {/* Card Top */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="text-xs font-medium text-text-secondary leading-snug">
              {card.title}
            </span>
            <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border/80 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              {card.icon}
            </div>
          </div>

          {/* Card Center: live value / skeleton / error */}
          <div className="my-1">
            <KpiValue
              value={card.value}
              isLoading={card.isLoading}
              hasError={card.hasError}
              decimals={card.decimals}
              suffix={card.suffix}
              colorClass={card.colorClass}
            />
          </div>

          {/* Card Bottom */}
          <div className="pt-3 border-t border-border/50 mt-3 flex items-center justify-between text-xs text-text-muted">
            <span className="truncate pr-2">{card.subtext}</span>
            <span
              className={`flex-shrink-0 font-mono text-[11px] flex items-center gap-0.5 ${
                card.trendPositive === true
                  ? 'text-success'
                  : card.trendPositive === false
                  ? 'text-danger'
                  : 'text-text-muted'
              }`}
            >
              {card.trendPositive === null ? (
                <Minus className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{card.trendLabel}</span>
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default KpiCardsRow;
