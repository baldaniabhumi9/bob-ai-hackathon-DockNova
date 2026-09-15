import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Ship, Anchor, TrendingUp, Cpu, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';

interface FeatureCardData {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  badgeType?: 'blink' | 'shimmer' | 'normal';
  accentColor: string;
}

const features: FeatureCardData[] = [
  {
    icon: <Ship className="w-6 h-6 text-[#38BDF8]" />,
    title: 'Live Vessel Tracking',
    description:
      'Real-time AIS telemetry feed capturing vessel positions, draft specs, speed vectors, and estimated berth arrivals.',
    badge: 'AIS Sector 04',
    badgeType: 'blink',
    accentColor: '#38BDF8',
  },
  {
    icon: <Anchor className="w-6 h-6 text-[#818CF8]" />,
    title: 'Berth Risk Optimization',
    description:
      'Dynamic quayside scheduling matrix featuring automated collision risk scores, crane assignments, and turnaround buffers.',
    badge: 'Real-Time Matrix',
    badgeType: 'normal',
    accentColor: '#818CF8',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-[#60A5FA]" />,
    title: 'Congestion Forecast',
    description:
      '72-hour predictive queue modeling backed by machine learning models to eliminate port bottlenecks before they form.',
    badge: '72H AI Horizon',
    badgeType: 'shimmer',
    accentColor: '#60A5FA',
  },
  {
    icon: <Cpu className="w-6 h-6 text-[#34D399]" />,
    title: 'AI Copilot (IBM Bob)',
    description:
      'Conversational intelligence system capable of simulating alternative vessel routing and recommending priority actions.',
    badge: 'Generative AI',
    badgeType: 'normal',
    accentColor: '#34D399',
  },
];

export const FeaturesGrid: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none"
      aria-label="Platform Core Features"
    >
      {/* Section Title with Blur-In & Rise Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="text-center max-w-2xl mx-auto mb-16 space-y-3"
      >
        <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30">
          COMMAND MATRIX ARCHITECTURE
        </span>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#E2E8F0] tracking-tight pt-2">
          Comprehensive Port Command Architecture
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
          Designed for port managers, vessel operators, and maritime logistics authorities requiring absolute clarity and minimal downtime.
        </p>
      </motion.div>

      {/* Grid of 4 Spotlight Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, idx) => (
          <GlassCard
            key={idx}
            variants={cardVariants}
            spotlight={true}
            hoverLift={true}
            className="p-6 flex flex-col justify-between group"
          >
            <div>
              {/* Card Header: Icon & Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#1A2A3E] border border-[rgba(56,189,248,0.2)] flex items-center justify-center shadow-md group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>

                {/* Animated Badge Status Dots */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#1A2A3E] text-[#94A3B8] border border-[rgba(56,189,248,0.2)]">
                  {feature.badgeType === 'blink' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                  )}
                  {feature.badgeType === 'shimmer' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] animate-pulse" />
                  )}
                  <span>{feature.badge}</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-heading font-bold text-lg text-[#E2E8F0] group-hover:text-[#38BDF8] transition-colors duration-200 mb-2.5">
                {feature.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>

            {/* Card Footer Arrow Link */}
            <div className="mt-6 pt-4 border-t border-[rgba(56,189,248,0.12)] flex items-center justify-between text-xs font-mono text-[#94A3B8] group-hover:text-[#38BDF8] transition-colors">
              <Link to="/signup" className="flex items-center gap-1.5 hover:underline">
                <span>Explore Module</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </Link>
            </div>
          </GlassCard>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturesGrid;
