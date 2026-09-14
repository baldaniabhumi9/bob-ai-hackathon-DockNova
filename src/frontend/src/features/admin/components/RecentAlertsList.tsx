import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, AlertCircle, Info, ArrowUpRight } from 'lucide-react';
import { SystemAlertItem } from '../mockAdminData';

interface RecentAlertsListProps {
  alerts: SystemAlertItem[];
}

export const RecentAlertsList: React.FC<RecentAlertsListProps> = ({ alerts }) => {
  const getSeverityBadge = (severity: SystemAlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-danger/15 text-danger border border-danger/30">
            <span className="w-1.5 h-1.5 rounded-full bg-danger animate-ping" />
            CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-warning/15 text-warning border border-warning/30">
            WARNING
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-primary/15 text-primary border border-primary/30">
            INFO
          </span>
        );
    }
  };

  const getAlertIcon = (severity: SystemAlertItem['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-danger" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle flex flex-col justify-between shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent" />
          <h3 className="font-heading font-bold text-sm sm:text-base text-text-primary">
            Recent Alerts
          </h3>
        </div>
        <span className="text-[11px] font-mono text-text-muted px-2 py-0.5 rounded bg-surface-2 border border-subtle">
          Live Feed
        </span>
      </div>

      {/* Scrollable Alert List with Staggered Entrance */}
      <div className="h-56 overflow-y-auto pr-1 space-y-2.5 scrollbar-thin">
        {alerts.map((alert, index) => {
          const isCritical = alert.severity === 'critical';

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={`p-3 rounded-xl bg-surface-2 border transition-all duration-150 ${
                isCritical
                  ? 'border-l-4 border-l-danger border-subtle bg-danger/5 shadow-sm'
                  : 'border-subtle hover:border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="shrink-0">{getAlertIcon(alert.severity)}</div>
                  <div className="text-xs font-semibold text-text-primary truncate">
                    {alert.title}
                  </div>
                </div>
                <div className="shrink-0">{getSeverityBadge(alert.severity)}</div>
              </div>

              <p className="text-[11px] text-text-secondary mt-1.5 leading-snug line-clamp-2">
                {alert.description}
              </p>

              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-subtle/60 text-[10px] font-mono text-text-muted">
                <span className="truncate">{alert.service}</span>
                <span>{alert.time}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-subtle flex items-center justify-between text-[11px] text-text-muted font-mono">
        <span>Active triage stream</span>
        <span className="text-primary flex items-center gap-1 cursor-pointer hover:underline">
          <span>View all in Audit Log</span>
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
