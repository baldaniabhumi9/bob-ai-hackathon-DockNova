import React from 'react';
import { motion } from 'framer-motion';
import { Ship, Sparkles, Anchor, Navigation, AlertTriangle, FileText } from 'lucide-react';

interface ChatWelcomeStateProps {
  onSelectPrompt: (promptText: string) => void;
}

const SUGGESTED_PROMPTS = [
  {
    title: 'When will MV Ocean Star berth?',
    subtitle: 'Check ETA, crane allocation & tidal delays',
    icon: Anchor,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/20 hover:border-primary/50',
  },
  {
    title: 'Suggest alternate port for B4 congestion',
    subtitle: 'Compare Tanjung Pelepas vs Klang detour',
    icon: Navigation,
    color: 'text-secondary',
    bg: 'bg-secondary/10 border-secondary/20 hover:border-secondary/50',
  },
  {
    title: 'Explain why B4 risk is 94%',
    subtitle: 'Inspect bottleneck cause & crane downtime',
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10 border-warning/20 hover:border-warning/50',
  },
  {
    title: 'Generate delay impact report',
    subtitle: 'Active fleet summary & demurrage liability',
    icon: FileText,
    color: 'text-success',
    bg: 'bg-success/10 border-success/20 hover:border-success/50',
  },
];

export const ChatWelcomeState: React.FC<ChatWelcomeStateProps> = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto px-4 text-center select-none py-8">
      {/* Central Watermark & Avatar Glow */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 rounded-3xl bg-surface-2 border border-subtle flex items-center justify-center shadow-glow-primary/20 relative z-10">
          <Ship className="w-10 h-10 text-primary animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-text-primary flex items-center justify-center shadow-lg z-20">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full -z-10" />
      </motion.div>

      {/* Main Title & Subtitle */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="space-y-2 mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-subtle text-xs font-mono text-text-secondary mb-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>IBM Bob Maritime Copilot • Ready</span>
        </div>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text-primary tracking-tight">
          How can I help your fleet today?
        </h2>
        <p className="text-sm text-text-secondary max-w-lg mx-auto">
          Ask questions about berth queues, turnaround simulations, bunker costs, and weather diversions.
        </p>
      </motion.div>

      {/* Suggested Prompts Grid */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left"
      >
        {SUGGESTED_PROMPTS.map((prompt, idx) => {
          const Icon = prompt.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(prompt.title)}
              className={`group p-4 rounded-2xl bg-surface-1 border transition-all duration-200 text-left hover:scale-[1.01] hover:shadow-lg flex items-start gap-3.5 ${prompt.bg}`}
            >
              <div className={`p-2.5 rounded-xl bg-surface-2 shrink-0 ${prompt.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {prompt.title}
                </div>
                <div className="text-[11px] text-text-muted mt-0.5">
                  {prompt.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};
