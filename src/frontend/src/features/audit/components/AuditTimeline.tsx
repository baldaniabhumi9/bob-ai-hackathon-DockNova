import React from 'react';
import { motion } from 'framer-motion';
import {
  LogIn,
  Edit3,
  Trash2,
  PlusCircle,
  Compass,
  Clock,
  ExternalLink,
  ClipboardList,
  ShieldAlert,
} from 'lucide-react';
import { AuditLogEntry, AuditActionType, AuditSeverity } from '../types';
import { getActionBadgeClass, renderSeverityBadge } from './AuditTable';

interface AuditTimelineProps {
  logs: AuditLogEntry[];
  onSelectLog: (log: AuditLogEntry) => void;
  onResetFilters: () => void;
}

const getActionIcon = (action: AuditActionType) => {
  switch (action) {
    case 'Login':
      return <LogIn className="w-4 h-4 text-purple-400" />;
    case 'Update':
      return <Edit3 className="w-4 h-4 text-blue-400" />;
    case 'Delete':
      return <Trash2 className="w-4 h-4 text-rose-400" />;
    case 'Create':
      return <PlusCircle className="w-4 h-4 text-emerald-400" />;
    case 'Reroute':
      return <Compass className="w-4 h-4 text-amber-400" />;
    default:
      return <Clock className="w-4 h-4 text-text-muted" />;
  }
};

const getSeverityBorderClass = (severity: AuditSeverity) => {
  switch (severity) {
    case 'Info':
      return 'border-l-sky-500';
    case 'Warning':
      return 'border-l-amber-500';
    case 'Critical':
      return 'border-l-rose-500';
    default:
      return 'border-l-surface-3';
  }
};

export const AuditTimeline: React.FC<AuditTimelineProps> = ({
  logs,
  onSelectLog,
  onResetFilters,
}) => {
  if (logs.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-surface-1 border border-subtle shadow-sm flex flex-col items-center justify-center space-y-3">
        <div className="p-4 rounded-full bg-surface-2 border border-subtle text-text-muted">
          <ClipboardList className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="font-heading font-semibold text-base text-text-primary">
          No logs match your filters
        </h3>
        <p className="text-xs text-text-muted max-w-sm">
          Try broadening your search criteria or resetting action and severity filters.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-2 px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-text-primary border border-subtle transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="relative py-4">
      {/* Central Vertical Timeline Line */}
      {/* On desktop (md): absolute line down the center at 50% */}
      {/* On mobile (<md): absolute line aligned left at 24px */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-subtle/80 -translate-x-1/2" />

      <div className="space-y-6 relative">
        {logs.map((log, index) => {
          const isEven = index % 2 === 0;

          // Framer motion slide directions:
          // Desktop: left cards slide from -30px, right cards slide from +30px
          // Mobile: all cards slide from +20px
          const isDesktopLeft = isEven;

          return (
            <motion.div
              key={log.id}
              initial={{
                opacity: 0,
                x: isDesktopLeft ? -25 : 25,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: (index % 6) * 0.05 }}
              className="relative flex flex-col md:flex-row items-center"
            >
              {/* Timeline Center Node (Icon Bubble) */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-surface-2 border-2 border-subtle flex items-center justify-center shadow-md">
                {getActionIcon(log.action)}
              </div>

              {/* Card Container */}
              {/* Mobile: Always ml-14 (right of line) */}
              {/* Desktop: Even items on left (w-1/2 pr-8 text-right), Odd items on right (w-1/2 ml-auto pl-8 text-left) */}
              <div
                className={`w-full pl-14 md:pl-0 ${
                  isDesktopLeft
                    ? 'md:w-1/2 md:pr-10 md:text-right'
                    : 'md:w-1/2 md:ml-auto md:pl-10 md:text-left'
                }`}
              >
                <div
                  onClick={() => onSelectLog(log)}
                  className={`bg-surface-1 hover:bg-surface-2/60 border border-subtle border-l-4 ${getSeverityBorderClass(
                    log.severity
                  )} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer group text-left`}
                >
                  {/* Card Header: Timestamp + Relative Time + Action Badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border ${getActionBadgeClass(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                      {renderSeverityBadge(log.severity)}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted">
                      <Clock className="w-3 h-3 text-text-muted shrink-0" />
                      <span>{log.relativeTime}</span>
                    </div>
                  </div>

                  {/* Entity & Details */}
                  <h4 className="font-heading font-semibold text-sm text-text-primary group-hover:text-primary transition-colors mb-1">
                    {log.entity}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-3">
                    {log.details}
                  </p>

                  {/* Footer: User + IP Address */}
                  <div className="pt-2 border-t border-subtle/50 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          log.user.avatarBg || 'bg-primary/20 text-primary'
                        }`}
                      >
                        {log.user.avatar}
                      </div>
                      <span className="font-medium text-text-primary text-[11px]">
                        {log.user.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
                      <span>{log.ipAddress}</span>
                      <ExternalLink className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
