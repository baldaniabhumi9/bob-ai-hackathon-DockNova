import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Info,
  Sparkles,
  ChevronRight,
  Clock,
  Ship,
  Route,
  Trash2,
  ExternalLink,
  Tag,
  CheckCheck,
} from 'lucide-react';
import { NotificationItem } from '../mockNotifications';

interface NotificationCardProps {
  notification: NotificationItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDismiss: () => void;
  onMarkRead?: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  isExpanded,
  onToggleExpand,
  onDismiss,
  onMarkRead,
}) => {
  // Icon and theme config based on notification type
  const typeConfig = {
    alert: {
      icon: <AlertTriangle className="w-5 h-5 text-danger" />,
      bg: 'bg-danger/10 border-danger/20 text-danger',
      pill: 'bg-danger/10 text-danger border-danger/20',
      label: 'Alert',
    },
    update: {
      icon: <Info className="w-5 h-5 text-primary" />,
      bg: 'bg-primary/10 border-primary/20 text-primary',
      pill: 'bg-primary/10 text-primary border-primary/20',
      label: 'Update',
    },
    ai: {
      icon: <Sparkles className="w-5 h-5 text-secondary" />,
      bg: 'bg-secondary/10 border-secondary/20 text-secondary',
      pill: 'bg-secondary/10 text-secondary border-secondary/20',
      label: 'AI Insight',
    },
  }[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        x: '-100%',
        opacity: 0,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={{ duration: 0.25 }}
      onClick={() => {
        onToggleExpand();
        if (notification.isUnread && onMarkRead) {
          onMarkRead();
        }
      }}
      className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden mb-3 ${
        isExpanded
          ? 'bg-surface-2 border-primary/40 shadow-lg ring-1 ring-primary/20'
          : notification.isUnread
          ? 'bg-surface-1 border-border hover:border-primary/40 hover:bg-surface-2/60'
          : 'bg-surface-1 border-border/70 hover:border-border hover:bg-surface-2/50'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          {/* Left Column: Color-coded Type Icon in Rounded Container */}
          <div
            className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${typeConfig.bg}`}
          >
            {typeConfig.icon}
          </div>

          {/* Middle Column: Title, Message, Metadata */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${typeConfig.pill}`}
              >
                {typeConfig.label}
              </span>

              {notification.categoryTag && (
                <span className="text-[10px] font-mono text-text-muted bg-surface-3/80 px-2 py-0.5 rounded border border-border/60">
                  {notification.categoryTag}
                </span>
              )}

              {notification.vesselName && (
                <span className="text-[11px] font-mono text-primary flex items-center gap-1">
                  <Ship className="w-3 h-3" />
                  <span>{notification.vesselName}</span>
                </span>
              )}
            </div>

            {/* Notification Title */}
            <h4 className="font-heading font-bold text-sm sm:text-[15px] text-text-primary tracking-tight leading-snug">
              {notification.title}
            </h4>

            {/* Short preview message (when collapsed) */}
            {!isExpanded && (
              <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 leading-relaxed">
                {notification.message}
              </p>
            )}

            {/* Timestamp */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[11px] font-mono text-text-muted flex items-center gap-1">
                <Clock className="w-3 h-3 text-text-muted/80" />
                <span>{notification.timestamp}</span>
              </span>
            </div>
          </div>

          {/* Right Column: Unread Pulse Indicator & Expand Chevron */}
          <div className="flex items-center gap-2.5 shrink-0 pt-1">
            {/* Unread dot with pulse animation */}
            <AnimatePresence>
              {notification.isUnread && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="relative flex items-center justify-center"
                  title="Unread notification"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping absolute opacity-75" />
                  <span className="w-2 h-2 rounded-full bg-primary shadow-glow-primary relative" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expand Chevron with smooth rotation */}
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-text-muted hover:text-text-primary p-1 rounded-md"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>

        {/* =========================================================================
            EXPANDABLE DETAIL (AnimatePresence)
           ========================================================================= */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div
                className="mt-4 pt-4 border-t border-border/80 space-y-4 text-xs sm:text-sm text-text-secondary leading-relaxed"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Full Explanation Message */}
                <p className="bg-surface-3/50 p-3.5 rounded-lg border border-border/60 text-text-primary/95 text-xs sm:text-sm">
                  {notification.fullMessage || notification.message}
                </p>

                {/* Bottom Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Primary Action Button (View Vessel / See Route) */}
                    {notification.actionUrl && (
                      <Link
                        to={notification.actionUrl}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary/15 hover:bg-primary/25 border border-primary/30 text-xs font-semibold font-mono text-primary transition-all shadow-glow-primary/20"
                      >
                        {notification.actionType === 'view-vessel' && <Ship className="w-3.5 h-3.5" />}
                        {notification.actionType === 'see-route' && <Route className="w-3.5 h-3.5" />}
                        {notification.actionType === 'general' && <ExternalLink className="w-3.5 h-3.5" />}
                        <span>{notification.actionLabel || 'Take Action'}</span>
                      </Link>
                    )}

                    {/* Mark as Read toggle if unread */}
                    {notification.isUnread && onMarkRead && (
                      <button
                        type="button"
                        onClick={onMarkRead}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-3 hover:bg-surface-2 border border-border text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-success" />
                        <span>Mark Read</span>
                      </button>
                    )}
                  </div>

                  {/* Dismiss Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono text-text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/30 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
