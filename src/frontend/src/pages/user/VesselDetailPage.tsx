import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowLeft,
  Ship,
  Radio,
  MapPin,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Leaf,
  Layers,
  Anchor,
  Compass,
  CheckCircle2,
  Share2,
  HardHat,
  Search,
} from 'lucide-react';
import { UserLayout } from '@/layouts/UserLayout';
import { getVesselById } from '@/features/dashboard/mockData';
import { VesselHealthRing } from '@/features/vessels/components/VesselHealthRing';
import { PredictiveTimeline } from '@/features/vessels/components/PredictiveTimeline';
import { CascadingImpactChart } from '@/features/vessels/components/CascadingImpactChart';

export const VesselDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const vessel = id ? getVesselById(id) : null;
  const [liveTracking, setLiveTracking] = useState<boolean>(false);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);

  // 404 Vessel Not Found State
  if (!vessel) {
    return (
      <UserLayout pageTitle="Vessel Not Found">
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-text-muted mb-4 shadow-xl">
            <Ship className="w-10 h-10 opacity-40" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-text-primary tracking-tight mb-2">
            Vessel Passport Not Found
          </h2>
          <p className="text-sm text-text-secondary max-w-md mb-6">
            No AIS registry record found for vessel identifier <code className="font-mono text-primary px-1.5 py-0.5 rounded bg-surface-2">{id}</code>. The vessel may be out of range or unverified.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/user')}
              className="px-5 py-2.5 rounded-lg bg-gradient-primary text-base font-semibold text-xs shadow-glow-primary hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Fleet Radar</span>
            </button>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const columnVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const statusConfig = {
    'AT BERTH': {
      bg: 'bg-primary/15 text-primary border-primary/30',
      dot: 'bg-primary',
    },
    ARRIVING: {
      bg: 'bg-secondary/15 text-secondary border-secondary/30',
      dot: 'bg-secondary',
    },
    DELAYED: {
      bg: 'bg-danger/15 text-danger border-danger/30',
      dot: 'bg-danger',
    },
    DEPARTED: {
      bg: 'bg-surface-3 text-text-muted border-border',
      dot: 'bg-text-muted',
    },
  }[vessel.status] || {
    bg: 'bg-primary/15 text-primary border-primary/30',
    dot: 'bg-primary',
  };

  return (
    <UserLayout
      activeNavItemId="fleet"
      pageTitle={vessel.name}
      breadcrumbs={['DockNova', 'Vessel Operator', 'Vessel Passport', vessel.name]}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-[1600px] mx-auto pb-10"
      >
        {/* =========================================================================
            PAGE HEADER
           ========================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="space-y-2">
            {/* Back Button + Vessel Passport Breadcrumb Pill */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/user')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </button>
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                Digital Vessel Passport
              </span>
            </div>

            {/* Vessel Name + IMO + Large Status Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
                {vessel.name}
              </h1>
              <span className="font-mono text-xs sm:text-sm text-text-muted bg-surface-2 px-2.5 py-1 rounded-md border border-border/80">
                IMO {vessel.imo}
              </span>
              <span
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase border ${statusConfig.bg}`}
              >
                <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-ping`} />
                <span>{vessel.status}</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Track Live + Contact Port */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setLiveTracking((prev) => !prev)}
              className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                liveTracking
                  ? 'bg-success text-base shadow-[0_0_20px_-2px_rgba(52,211,153,0.4)]'
                  : 'bg-gradient-primary text-base shadow-glow-primary hover:opacity-95'
              }`}
            >
              <Radio className={`w-4 h-4 ${liveTracking ? 'animate-spin' : 'animate-pulse'}`} />
              <span>{liveTracking ? 'Tracking Live (Active)' : 'Track Live'}</span>
            </button>

            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border text-xs font-semibold text-text-primary transition-colors cursor-pointer flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-secondary" />
              <span>Contact Port</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            3-COLUMN COMMAND GRID (Identity / Live Metrics / Predictive Timeline)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* COLUMN 1 (w-1/3): Identity Card */}
          <motion.div
            variants={columnVariants}
            className="flex flex-col justify-between p-6 rounded-2xl bg-surface-1 border border-border shadow-xl space-y-6"
          >
            {/* Vessel image banner placeholder */}
            <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-surface-2 via-surface-3 to-surface-1 border border-border/80 flex flex-col items-center justify-center overflow-hidden group">
              {/* Ambient radial aura */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.4) 0%, transparent 70%)',
                }}
              />
              <Ship className="w-16 h-16 text-primary/80 group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute bottom-3 left-3 text-[11px] font-mono px-2 py-0.5 rounded-md bg-surface-1/90 border border-border text-text-secondary">
                {vessel.type}
              </div>
            </div>

            {/* Details list */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-text-muted font-sans text-sm">Vessel Type</span>
                <span className="text-text-primary font-medium">{vessel.type}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-text-muted font-sans text-sm">Overall Length</span>
                <span className="text-text-primary font-medium">{vessel.length}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-text-muted font-sans text-sm">TEU Capacity</span>
                <span className="text-text-primary font-medium font-bold">
                  {vessel.teu.toLocaleString()} TEU
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-text-muted font-sans text-sm">Vessel Flag</span>
                <span className="text-text-primary font-medium">{vessel.flag}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <span className="text-text-muted font-sans text-sm">Carrier Operator</span>
                <span className="text-primary font-medium">{vessel.carrier}</span>
              </div>
            </div>

            {/* AI Health Score & Carbon Estimate Row */}
            <div className="p-4 rounded-xl bg-surface-2/60 border border-border/80 flex items-center justify-around gap-4 pt-4">
              {/* Circular SVG Health Ring */}
              <div className="flex flex-col items-center">
                <VesselHealthRing score={vessel.healthScore} size={90} strokeWidth={8} />
                <span className="text-[11px] font-mono text-text-muted mt-1.5">AI Engine Score</span>
              </div>

              <div className="w-[1px] h-16 bg-border/60" />

              {/* Carbon Estimate */}
              <div className="flex flex-col items-center text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success mb-1">
                  <Leaf className="w-5 h-5" />
                </div>
                <div className="font-mono text-lg font-bold text-success">
                  {vessel.carbonEstimate}
                </div>
                <span className="text-[11px] font-mono text-text-muted">Voyage Eco Impact</span>
              </div>
            </div>
          </motion.div>

          {/* COLUMN 2 (w-1/3): Live Status & Metrics + Floating IBM Bob Card */}
          <motion.div
            variants={columnVariants}
            className="flex flex-col justify-between p-6 rounded-2xl bg-surface-1 border border-border shadow-xl space-y-6"
          >
            {/* Current Location Pill */}
            <div className="p-3.5 rounded-xl bg-surface-2 border border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary animate-bounce" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-text-muted block">
                    CURRENT BERTH COORDINATE
                  </span>
                  <span className="font-heading font-semibold text-sm text-text-primary">
                    {vessel.location}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-3 text-text-secondary border border-border">
                {vessel.terminal}
              </span>
            </div>

            {/* ETA / ETD Cards side by side + Delay Indicator */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3.5 rounded-xl bg-surface-2 border border-border/80">
                <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1 font-sans">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>ETA Target</span>
                </div>
                <div className="text-base font-bold text-text-primary">{vessel.etaFormatted}</div>
                <div className="text-[10px] text-text-muted mt-1">Direct Fairway PBG</div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-2 border border-border/80">
                <div className="flex items-center gap-1.5 text-xs text-text-muted mb-1 font-sans">
                  <Anchor className="w-3.5 h-3.5 text-secondary" />
                  <span>ETD Projected</span>
                </div>
                <div className="text-base font-bold text-text-primary">{vessel.etdFormatted}</div>
                <div className="text-[10px] text-text-muted mt-1">Subject to Quay Crane Gang</div>
              </div>
            </div>

            {/* Delay Indicator Banner */}
            {vessel.isDelayed && (
              <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 flex items-center justify-between font-mono">
                <div className="flex items-center gap-2 text-danger text-xs font-semibold font-sans">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Fairway Schedule Delay</span>
                </div>
                <div className="flex items-center gap-1 text-danger font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>{vessel.delayFormatted}</span>
                </div>
              </div>
            )}

            {/* Crane Assignment with Avatar Stack */}
            <div className="p-4 rounded-xl bg-surface-2/60 border border-border/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Quay Equipment Assigned:</span>
                <span className="font-mono text-primary font-semibold">
                  {vessel.craneAssignment.count} cranes assigned ({vessel.craneAssignment.cranes.join(', ')})
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                {vessel.craneAssignment.cranes.map((crane) => (
                  <div
                    key={crane}
                    className="w-8 h-8 rounded-lg bg-surface-3 border border-border flex items-center justify-center font-mono text-xs font-bold text-text-primary hover:border-primary transition-colors"
                  >
                    {crane}
                  </div>
                ))}
                <span className="text-[11px] font-mono text-text-muted ml-auto">
                  {vessel.craneAssignment.productivity}
                </span>
              </div>
            </div>

            {/* Yard Space Utilization */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-text-muted font-sans">Terminal Yard Space Utilization:</span>
                <span className="font-bold text-text-primary">{vessel.yardUtilization}% Capacity</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    vessel.yardUtilization > 80
                      ? 'bg-danger'
                      : vessel.yardUtilization > 60
                      ? 'bg-warning'
                      : 'bg-success'
                  }`}
                  style={{ width: `${vessel.yardUtilization}%` }}
                />
              </div>
            </div>

            {/* Floating IBM Bob Insight Card (Floating motion animation) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-surface-2 to-secondary/10 border border-primary/25 shadow-lg space-y-2.5 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary text-xs font-bold font-mono">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>IBM BOB COPILOT INSIGHT</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  {vessel.aiInsight.confidence}
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                {vessel.aiInsight.body}
              </p>

              <div className="pt-2 border-t border-border/40 text-[11px] text-text-muted font-mono flex items-center justify-between">
                <span>ADVISORY:</span>
                <span className="text-primary font-bold truncate max-w-[220px]">
                  {vessel.aiInsight.recommendation}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* COLUMN 3 (w-1/3): Predictive Disruption Timeline */}
          <motion.div variants={columnVariants} className="h-full">
            <PredictiveTimeline events={vessel.timelineEvents} />
          </motion.div>
        </div>

        {/* =========================================================================
            BOTTOM SECTION (Full Width): Cascading Impact Analysis
           ========================================================================= */}
        <motion.div variants={columnVariants}>
          <CascadingImpactChart impact={vessel.impactAnalysis} />
        </motion.div>
      </motion.div>

      {/* Port Contact Modal Dialog */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-surface-1 border border-border shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-lg text-text-primary">
                Contact Port Authority Gateway
              </h4>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="text-text-muted hover:text-text-primary"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-text-secondary">
              Direct VHF Channel 16 & Pilot station dispatch line for {vessel.name}.
            </p>
            <div className="p-3.5 rounded-lg bg-surface-2 text-xs font-mono space-y-1.5">
              <div>VHF Channel: 156.800 MHz (Ch 16)</div>
              <div>Duty Officer: Master Watch 02</div>
              <div>Direct IP Radio: ip-radio.docknova.sg:8080</div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-3 hover:bg-surface-2 text-xs font-semibold text-text-primary"
              >
                Close Gateway
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default VesselDetailPage;
