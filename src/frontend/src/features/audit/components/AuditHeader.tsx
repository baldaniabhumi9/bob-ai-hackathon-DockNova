import React from 'react';
import { Download, ShieldCheck, Calendar } from 'lucide-react';

interface AuditHeaderProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExportCsv: () => void;
  totalLogsCount: number;
}

export const AuditHeader: React.FC<AuditHeaderProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onExportCsv,
  totalLogsCount,
}) => {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
            Audit Logs
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            Immutable Hash Verified
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-warning/15 text-warning border border-warning/30">
            Simulated Data
          </span>
          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-surface-2 text-text-muted border border-subtle">
            {totalLogsCount} Records
          </span>
        </div>
        <p className="text-xs text-text-secondary mt-1">
          Cryptographic compliance trail and real-time security monitoring for system actions, rerouting, and user authorizations.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {/* Visual Date Range Picker */}
        <div className="flex items-center gap-2 bg-surface-2/80 p-1.5 rounded-xl border border-subtle">
          <Calendar className="w-4 h-4 text-text-muted ml-1.5 shrink-0" />
          <div className="flex items-center gap-1 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="bg-transparent text-text-primary font-mono text-xs focus:outline-none cursor-pointer rounded px-1 hover:bg-surface-3 transition-colors"
              title="Start Date"
            />
            <span className="text-text-muted font-bold">—</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="bg-transparent text-text-primary font-mono text-xs focus:outline-none cursor-pointer rounded px-1 hover:bg-surface-3 transition-colors"
              title="End Date"
            />
          </div>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-text-primary border border-subtle shadow-sm transition-all duration-150 active:scale-[0.98]"
        >
          <Download className="w-4 h-4 text-primary" />
          <span>Export Logs</span>
        </button>
      </div>
    </div>
  );
};
