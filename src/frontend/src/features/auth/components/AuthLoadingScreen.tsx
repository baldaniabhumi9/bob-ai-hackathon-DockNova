import React from 'react';
import { motion } from 'framer-motion';
import { Anchor, Shield } from 'lucide-react';

export interface AuthLoadingScreenProps {
  message?: string;
}

export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({
  message = 'Authenticating clearance...',
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base text-text-primary select-none overflow-hidden"
      role="status"
      aria-live="polite"
    >
      {/* Background ambient radial aura */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)',
        }}
      />

      {/* Radar sweep faint ring */}
      <div className="absolute w-72 h-72 rounded-full border border-primary/20 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full border border-primary/10 pointer-events-none" />

      {/* Center Logo with pulse-glow */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-surface-1 border border-primary/40 flex items-center justify-center shadow-glow-primary animate-pulse-glow">
            <Anchor className="w-10 h-10 text-primary animate-pulse" />
          </div>
          {/* Small security badge */}
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-surface-2 border border-primary/50 flex items-center justify-center text-primary">
            <Shield className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* DockNova Brand */}
        <h1 className="font-heading text-2xl font-bold text-text-primary tracking-tight mb-2">
          Dock<span className="text-primary">Nova</span>
        </h1>

        {/* Status pill with animated indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-1 border border-border text-xs font-mono text-text-secondary shadow-lg">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>{message}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLoadingScreen;
