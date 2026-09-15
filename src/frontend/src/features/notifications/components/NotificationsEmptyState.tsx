import React from 'react';
import { motion } from 'framer-motion';
import { Bell, RefreshCw, PlusCircle, CheckCircle2 } from 'lucide-react';

interface NotificationsEmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
  onSimulateNewNotification: () => void;
}

export const NotificationsEmptyState: React.FC<NotificationsEmptyStateProps> = ({
  isFiltered,
  onResetFilters,
  onSimulateNewNotification,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-20 px-6 rounded-2xl bg-surface-1/40 border border-dashed border-border/80 flex flex-col items-center justify-center text-center my-6"
    >
      {/* Large Bell Icon in Circular Glow Surface */}
      <div className="w-20 h-20 rounded-3xl bg-surface-2 border border-border flex items-center justify-center text-text-muted mb-4 shadow-xl relative">
        <Bell className="w-10 h-10 opacity-30 stroke-[1.5]" />
        <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-success">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </span>
      </div>

      <h3 className="font-heading font-bold text-xl sm:text-2xl text-text-primary tracking-tight mb-2">
        All caught up!
      </h3>

      <p className="text-xs sm:text-sm text-text-muted max-w-md leading-relaxed mb-6">
        {isFiltered
          ? 'No notifications match your active filter or search query. Clear filters to view all communications.'
          : "No new notifications. We'll alert you when something changes."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-xs font-mono text-text-primary transition-colors cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span>Clear Filter Criteria</span>
          </button>
        )}

        <button
          type="button"
          onClick={onSimulateNewNotification}
          className="px-4 py-2 rounded-xl bg-gradient-primary text-white font-semibold text-xs font-mono shadow-glow-primary hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Simulate Incoming Alert</span>
        </button>
      </div>
    </motion.div>
  );
};
