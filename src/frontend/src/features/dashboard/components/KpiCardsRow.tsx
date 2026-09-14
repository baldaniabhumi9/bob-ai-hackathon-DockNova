import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Ship, Anchor, AlertTriangle, Clock, TrendingDown, ArrowUpRight } from 'lucide-react';
import { CountUpNumber } from './CountUpNumber';
import { kpiMetrics } from '../mockData';

export const KpiCardsRow: React.FC = () => {
  const cards = [
    {
      id: 'active-vessels',
      title: 'Active Vessels',
      value: kpiMetrics.activeVessels,
      decimals: 0,
      suffix: '',
      icon: <Ship className="w-5 h-5 text-primary" />,
      colorClass: 'text-primary',
      badgeClass: 'bg-primary/10 border-primary/25 text-primary',
      glowClass: 'hover:shadow-glow-primary',
      subtext: 'AIS tracking active across fairways',
      trend: '+2 from yesterday',
      trendPositive: true,
    },
    {
      id: 'upcoming-arrivals',
      title: 'Upcoming Arrivals (<24h)',
      value: kpiMetrics.upcomingArrivals,
      decimals: 0,
      suffix: '',
      icon: <Anchor className="w-5 h-5 text-warning" />,
      colorClass: 'text-warning',
      badgeClass: 'bg-warning/10 border-warning/25 text-warning',
      glowClass: 'hover:shadow-[0_0_20px_-2px_rgba(251,191,36,0.35)]',
      subtext: 'Berths pre-reserved at Quays B & C',
      trend: '4 cleared for direct docking',
      trendPositive: true,
    },
    {
      id: 'delayed-vessels',
      title: 'Delayed Vessels',
      value: kpiMetrics.delayedVessels,
      decimals: 0,
      suffix: '',
      icon: <AlertTriangle className="w-5 h-5 text-danger" />,
      colorClass: 'text-danger',
      badgeClass: 'bg-danger/10 border-danger/25 text-danger',
      glowClass: 'hover:shadow-glow-danger',
      subtext: 'Anchorages holding outside fairway',
      trend: '-1 since last shift',
      trendPositive: true,
    },
    {
      id: 'avg-delay-time',
      title: 'Avg Delay Time',
      value: kpiMetrics.avgDelayTime,
      decimals: 1,
      suffix: 'h',
      icon: <Clock className="w-5 h-5 text-text-secondary" />,
      colorClass: 'text-text-secondary',
      badgeClass: 'bg-surface-3 border-border text-text-secondary',
      glowClass: 'hover:shadow-[0_0_20px_-2px_rgba(148,163,184,0.25)]',
      subtext: 'Calculated over last 72 operating hours',
      trend: '38% faster than regional avg',
      trendPositive: true,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
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
          {/* Card Top: Title and Icon */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="text-xs font-medium text-text-secondary leading-snug">
              {card.title}
            </span>
            <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border/80 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              {card.icon}
            </div>
          </div>

          {/* Card Center: Animated Count Up Number */}
          <div className="my-1">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              <CountUpNumber
                end={card.value}
                decimals={card.decimals}
                suffix={card.suffix}
                className={card.colorClass}
              />
            </div>
          </div>

          {/* Card Bottom: Subtext and Trend Indicator */}
          <div className="pt-3 border-t border-border/50 mt-3 flex items-center justify-between text-xs text-text-muted">
            <span className="truncate pr-2">{card.subtext}</span>
            <span className="flex-shrink-0 font-mono text-[11px] text-success flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3 text-success" />
              <span>{card.trend}</span>
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default KpiCardsRow;
