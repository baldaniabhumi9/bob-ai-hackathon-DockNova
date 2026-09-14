import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';

export const ChatTypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-3 max-w-2xl py-1"
    >
      {/* AI Avatar */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-secondary via-primary to-accent flex items-center justify-center text-text-primary shrink-0 shadow-glow-primary/40 mt-1">
        <Bot className="w-5 h-5" />
      </div>

      <div className="p-4 rounded-2xl rounded-tl-sm bg-surface-2 border border-subtle flex flex-col gap-2 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
          <Sparkles className="w-3.5 h-3.5 text-secondary animate-spin" style={{ animationDuration: '3s' }} />
          <span>IBM Bob is synthesizing port telemetry...</span>
        </div>

        {/* 3 Staggered Bouncing Dots */}
        <div className="flex items-center gap-1.5 py-1">
          {[0, 0.15, 0.3].map((delay, index) => (
            <motion.span
              key={index}
              className="w-2.5 h-2.5 rounded-full bg-primary"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
