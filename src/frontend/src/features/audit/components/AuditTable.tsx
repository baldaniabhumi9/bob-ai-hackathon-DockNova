import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ClipboardList, Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import { AuditLogEntry, AuditActionType, AuditSeverity } from '../types';

interface AuditTableProps {
  logs: AuditLogEntry[];
  onSelectLog: (log: AuditLogEntry) => void;
  onResetFilters: () => void;
}

export const getActionBadgeClass = (action: AuditActionType) => {
  switch (action) {
    case 'Create':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'Update':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'Delete':
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    case 'Login':
      return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    case 'Reroute':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    default:
      return 'bg-surface-3 text-text-secondary border-subtle';
  }
};

export const renderSeverityBadge = (severity: AuditSeverity) => {
  switch (severity) {
    case 'Info':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          Info
        </span>
      );
    case 'Warning':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Warning
        </span>
      );
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping shrink-0" />
          Critical
        </span>
      );
  }
};

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export const AuditTable: React.FC<AuditTableProps> = ({ logs, onSelectLog, onResetFilters }) => {
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
    <div className="rounded-2xl bg-surface-1 border border-subtle shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-subtle bg-surface-2/60 text-[11px] font-mono text-text-muted uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">User</th>
              <th className="py-3 px-4 font-semibold">Action</th>
              <th className="py-3 px-4 font-semibold">Entity</th>
              <th className="py-3 px-4 font-semibold">Details</th>
              <th className="py-3 px-4 font-semibold">Severity</th>
              <th className="py-3 px-4 font-semibold">IP Address</th>
            </tr>
          </thead>
          <motion.tbody
            variants={tableContainerVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-subtle/50 text-xs"
          >
            {logs.map((log) => (
              <motion.tr
                key={log.id}
                variants={rowVariants}
                onClick={() => onSelectLog(log)}
                className="hover:bg-surface-2/70 transition-colors group cursor-pointer"
              >
                {/* Timestamp */}
                <td className="py-3 px-4 font-mono text-text-secondary whitespace-nowrap">
                  <div>{log.timestamp}</div>
                  <div className="text-[10px] text-text-muted">{log.relativeTime}</div>
                </td>

                {/* User */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${
                        log.user.avatarBg || 'bg-primary/20 text-primary'
                      }`}
                    >
                      {log.user.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {log.user.name}
                      </div>
                      <div className="text-[10px] text-text-muted">{log.user.role}</div>
                    </div>
                  </div>
                </td>

                {/* Action */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${getActionBadgeClass(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                </td>

                {/* Entity */}
                <td className="py-3 px-4 font-medium text-text-primary whitespace-nowrap max-w-[180px] truncate">
                  {log.entity}
                </td>

                {/* Details (Truncated, Expandable) */}
                <td className="py-3 px-4 text-text-secondary max-w-[260px] truncate group-hover:text-text-primary transition-colors">
                  <span title={log.details}>{log.details}</span>
                  <ExternalLink className="w-3 h-3 text-text-muted inline ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>

                {/* Severity */}
                <td className="py-3 px-4 whitespace-nowrap">
                  {renderSeverityBadge(log.severity)}
                </td>

                {/* IP Address */}
                <td className="py-3 px-4 font-mono text-text-muted text-[11px] whitespace-nowrap">
                  {log.ipAddress}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};
