import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Anchor, ArrowRight, Sparkles, Radio, ShieldCheck } from 'lucide-react';
import { HarborCanvas } from '@/components/ui/HarborCanvas';
import { GradientButton } from '@/components/ui/GradientButton';

export const HeroSection: React.FC = () => {
  // Cycling Typewriter Pill Badge
  const badgePhrases = ['AI-ASSISTED', 'AES-256 SECURED', 'LIVE AIS TELEMETRY'];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % badgePhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Tick-up Trust Counters
  const counterRef = React.useRef(null);
  const isCounterInView = useInView(counterRef, { once: true });
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    if (!isCounterInView) return;
    let current = 0;
    const target = 94.8;
    const step = target / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setAccuracy(target);
        clearInterval(timer);
      } else {
        setAccuracy(parseFloat(current.toFixed(1)));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [isCounterInView]);

  // Headline Staggered Words
  const headlineWords = [
    { text: 'Predictive', gradient: false },
    { text: 'Intelligence', gradient: false },
    { text: 'for', gradient: false },
    { text: 'Next-Gen', gradient: true },
    { text: 'Maritime', gradient: true },
    { text: 'Terminals', gradient: true },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 25, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-base transition-colors duration-300"
      aria-label="DockNova Platform Hero"
    >
      {/* 1. Animated GPU-Friendly 60fps Harbor Canvas Background */}
      <HarborCanvas density="normal" speed={1} interactive={true} />

      {/* 2. Radial Vignette & Gradient Scrim for WCAG AA Contrast */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--color-base)_85%)] z-10 transition-colors duration-300" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-base/60 via-transparent to-base z-10 transition-colors duration-300" />

      {/* 3. Hero Central Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center space-y-8 select-none">
        {/* Pill Badge with Cycling Animation */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-2/90 border border-primary/40 text-xs font-mono text-primary shadow-glow-primary/20 backdrop-blur-md"
        >
          <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
          <div className="flex items-center gap-1.5 h-4 overflow-hidden">
            <motion.span
              key={phraseIndex}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="font-bold tracking-wide"
            >
              {badgePhrases[phraseIndex]} PORT OPERATIONS PLATFORM
            </motion.span>
          </div>
        </motion.div>

        {/* Staggered Word-by-Word Headline Reveal */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.12] max-w-3xl mx-auto"
        >
          {headlineWords.map((word, idx) => (
            <motion.span key={idx} variants={wordVariants} className="inline-block mr-3">
              {word.gradient ? (
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-sm">
                  {word.text}
                </span>
              ) : (
                word.text
              )}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-sans"
        >
          DockNova optimizes quay allocations, predicts vessel congestion 72 hours in advance, and unleashes IBM Bob AI Copilot for autonomous port logistics.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {/* Primary CTA: Get Started */}
          <Link to="/signup" className="w-full sm:w-auto">
            <GradientButton variant="gradient" pulseRing magnetic className="!px-7 !py-4 text-base">
              <Sparkles className="w-4 h-4 text-[#0A1420]" />
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </GradientButton>
          </Link>

          {/* Secondary CTA: Sign In to Terminal */}
          <Link to="/login" className="w-full sm:w-auto">
            <GradientButton variant="glass" magnetic className="!px-7 !py-4 text-base">
              <Anchor className="w-4 h-4 text-[#38BDF8]" />
              <span>Sign In to Terminal</span>
            </GradientButton>
          </Link>
        </motion.div>

        {/* Security & Tech Guarantee Strip with Tick-Up Counters */}
        <motion.div
          ref={counterRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-6 pt-8 text-xs text-[#94A3B8] font-mono tracking-wider"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            AES-256 AIS TELEMETRY
          </span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <span className="text-[#38BDF8] font-bold text-sm font-data">{accuracy.toFixed(1)}%</span>
            AI FORECAST ACCURACY
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
