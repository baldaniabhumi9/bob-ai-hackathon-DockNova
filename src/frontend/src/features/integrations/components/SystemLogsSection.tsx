import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Clock,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { IntegrationLog, LogStatus } from '../types';

export interface SystemLogsSectionProps {
  logs: IntegrationLog[];
  onRefresh?: () => void;
}

export const SystemLogsSection: React.FC<SystemLogsSectionProps> = ({
  logs,
  onRefresh,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesStatus =
        statusFilter === 'all' || log.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch =
        searchTerm === '' ||
        log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.timestamp.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [logs, statusFilter, searchTerm]);

  const getStatusBadge = (status: LogStatus) => {
    switch (status) {
      case 'Success':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />,
          bg: 'bg-success/15 text-success border-success/30',
        };
      case 'Info':
        return {
          icon: <Info className="w-3.5 h-3.5 text-primary flex-shrink-0" />,
          bg: 'bg-primary/15 text-primary border-primary/30',
        };
      case 'Warning':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />,
          bg: 'bg-warning/15 text-warning border-warning/30',
        };
      case 'Error':
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-danger flex-shrink-0" />,
          bg: 'bg-danger/15 text-danger border-danger/30',
        };
    }
  };

  const statusCounts = useMemo(() => {
    const counts = { all: logs.length, success: 0, info: 0, warning: 0, error: 0 };
    logs.forEach((log) => {
      const s = log.status.toLowerCase() as 'success' | 'info' | 'warning' | 'error';
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [logs]);

  return (
    <div className="bg-surface-1 rounded-2xl border border-subtle overflow-hidden shadow-sm">
      {/* Header bar / Collapsible toggle */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-1 border-b border-border/70">
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="p-2.5 rounded-xl bg-surface-2 border border-border/80 text-primary group-hover:border-primary/40 transition-colors">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-heading font-bold text-lg text-text-primary group-hover:text-primary transition-colors">
                Integration & Runtime Telemetry Logs
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-surface-3 text-text-secondary border border-border">
                {logs.length} Total Events
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Real-time audit log of external endpoint synchronization, inference queries, and gateway pings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isOpen && (
            <button
              type="button"
              onClick={handleManualRefresh}
              className="p-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text-primary border border-border transition-all"
              title="Refresh log stream"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-surface-3 text-xs font-medium text-text-secondary hover:text-text-primary border border-border transition-all"
          >
            <span>{isOpen ? 'Collapse Panel' : 'Expand Panel'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {/* Filter & Search Bar */}
            <div className="px-5 py-3.5 bg-surface-2/40 border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'success', 'info', 'warning', 'error'] as const).map((status) => {
                  const isSelected = statusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-all border ${
                        isSelected
                          ? 'bg-primary/20 text-primary border-primary/50 font-semibold'
                          : 'bg-surface-3/50 text-text-muted border-border/60 hover:text-text-primary hover:bg-surface-3'
                      }`}
                    >
                      {status} ({statusCounts[status]})
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter logs..."
                  className="w-full pl-8 pr-3 py-1.5 bg-surface-3 rounded-lg text-xs font-mono text-text-primary border border-border/80 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:text-text-muted"
                />
              </div>
            </div>

            {/* Scrollable Logs Table */}
            <div className="max-h-[360px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-2/80 sticky top-0 z-10 border-b border-border/80 font-mono text-text-muted">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold w-48">Timestamp</th>
                    <th className="py-2.5 px-4 font-semibold w-40">Service</th>
                    <th className="py-2.5 px-4 font-semibold w-28">Status</th>
                    <th className="py-2.5 px-4 font-semibold">Message</th>
                    <th className="py-2.5 px-4 font-semibold text-right w-24">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-text-muted">
                        No logs match current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const badge = getStatusBadge(log.status);
                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-surface-2/50 transition-colors"
                        >
                          {/* Timestamp */}
                          <td className="py-2.5 px-4 text-text-muted whitespace-nowrap text-[11px]">
                            {log.timestamp}
                          </td>

                          {/* Service */}
                          <td className="py-2.5 px-4 font-medium text-text-primary whitespace-nowrap">
                            <span className="bg-surface-3 px-2 py-0.5 rounded border border-border/70 text-[11px]">
                              {log.service}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}
                            >
                              {badge.icon}
                              <span>{log.status}</span>
                              <span className="text-[9px] font-mono opacity-80">(demo)</span>
                            </span>
                          </td>

                          {/* Message */}
                          <td className="py-2.5 px-4 text-text-secondary leading-relaxed font-sans text-xs">
                            {log.message}
                          </td>

                          {/* Latency */}
                          <td className="py-2.5 px-4 text-right text-text-muted text-[11px] whitespace-nowrap">
                            {log.latencyMs ? `${log.latencyMs}ms` : '—'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="px-5 py-2.5 bg-surface-2/40 border-t border-border/70 flex items-center justify-between text-[11px] font-mono text-text-muted">
              <span>Showing {filteredLogs.length} of {logs.length} entries</span>
              <span>Buffer capacity: Last 100 events retained</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SystemLogsSection;
