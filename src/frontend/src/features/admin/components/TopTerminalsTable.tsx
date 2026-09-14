import React, { useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { TerminalPerformanceRecord } from '../mockAdminData';

interface TopTerminalsTableProps {
  terminals: TerminalPerformanceRecord[];
  simulated?: boolean;
}

type SortField =
  | 'terminal'
  | 'avgTurnaroundHours'
  | 'craneEfficiencyMph'
  | 'onTimePercent'
  | 'status';

export const TopTerminalsTable: React.FC<TopTerminalsTableProps> = ({ terminals }) => {
  const [sortField, setSortField] = useState<SortField>('onTimePercent');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...terminals].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'terminal') {
      comparison = a.terminal.localeCompare(b.terminal);
    } else if (sortField === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else {
      comparison = (a[sortField] as number) - (b[sortField] as number);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-text-muted opacity-40 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary" />
    );
  };

  const getStatusBadge = (status: TerminalPerformanceRecord['status']) => {
    switch (status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-success/10 text-success border border-success/30">
            <span className="w-2 h-2 rounded-full bg-success animate-ping" />
            <span>Operational</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-warning/10 text-warning border border-warning/30">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span>Maintenance</span>
          </span>
        );
      case 'offline':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-danger/10 text-danger border border-danger/30">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <span>Offline</span>
          </span>
        );
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-base sm:text-lg text-text-primary">
              Top Performing Terminals
            </h3>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">
            Throughput efficiency, vessel turnaround, and live berth operational status
          </p>
        </div>

        <div className="text-xs font-mono text-text-muted">
          Click column headers to sort • {terminals.length} Terminals Monitored
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-subtle">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-surface-2/80 border-b border-subtle text-text-muted font-mono uppercase text-[11px] select-none">
              <th
                onClick={() => handleSort('terminal')}
                className="py-3 px-4 font-semibold cursor-pointer group hover:text-text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>Terminal</span>
                  {renderSortIcon('terminal')}
                </div>
              </th>

              <th
                onClick={() => handleSort('avgTurnaroundHours')}
                className="py-3 px-4 font-semibold cursor-pointer group hover:text-text-primary transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Avg Turnaround</span>
                  {renderSortIcon('avgTurnaroundHours')}
                </div>
              </th>

              <th
                onClick={() => handleSort('craneEfficiencyMph')}
                className="py-3 px-4 font-semibold cursor-pointer group hover:text-text-primary transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-2">
                  <span>Crane Efficiency</span>
                  {renderSortIcon('craneEfficiencyMph')}
                </div>
              </th>

              <th
                onClick={() => handleSort('onTimePercent')}
                className="py-3 px-4 font-semibold cursor-pointer group hover:text-text-primary transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-2">
                  <span>On-Time %</span>
                  {renderSortIcon('onTimePercent')}
                </div>
              </th>

              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 font-semibold cursor-pointer group hover:text-text-primary transition-colors text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-subtle font-mono text-xs">
            {sortedData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-surface-2/50 transition-colors duration-150 group"
              >
                {/* Terminal */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-heading font-semibold text-text-primary text-xs sm:text-[13px] group-hover:text-primary transition-colors">
                      {item.terminal}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{item.code}</span>
                  </div>
                </td>

                {/* Avg Turnaround */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5 font-bold text-text-primary">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    <span>{item.avgTurnaroundHours.toFixed(1)}h</span>
                  </div>
                </td>

                {/* Crane Efficiency */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5 font-bold text-primary">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span>{item.craneEfficiencyMph.toFixed(1)} moves/h</span>
                  </div>
                </td>

                {/* On-Time % */}
                <td className="py-3.5 px-4 text-right">
                  <span
                    className={`font-bold ${
                      item.onTimePercent >= 90
                        ? 'text-success'
                        : item.onTimePercent >= 80
                        ? 'text-warning'
                        : 'text-danger'
                    }`}
                  >
                    {item.onTimePercent.toFixed(1)}%
                  </span>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 text-center">
                  {getStatusBadge(item.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
