import React from 'react';
import { Search, RotateCcw, Table, Activity, Filter, User } from 'lucide-react';
import { AuditActionType, AuditSeverity } from '../types';

interface AuditFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  actionFilter: string;
  onActionFilterChange: (value: string) => void;
  userFilter: string;
  onUserFilterChange: (value: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (value: string) => void;
  viewMode: 'table' | 'timeline';
  onViewModeChange: (mode: 'table' | 'timeline') => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  uniqueUsers: string[];
}

export const AuditFilterBar: React.FC<AuditFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  actionFilter,
  onActionFilterChange,
  userFilter,
  onUserFilterChange,
  severityFilter,
  onSeverityFilterChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  isFiltered,
  uniqueUsers,
}) => {
  const actionsList: (AuditActionType | 'all')[] = ['all', 'Login', 'Update', 'Delete', 'Create', 'Reroute'];
  const severityList: (AuditSeverity | 'all')[] = ['all', 'Info', 'Warning', 'Critical'];

  return (
    <div className="p-4 rounded-2xl bg-surface-1 border border-subtle shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by user, action, or entity..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-2 border border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/60 transition-colors"
          />
        </div>

        {/* Right side controls: User Filter, View Toggle, Reset */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* User Select Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-subtle text-xs text-text-secondary">
            <User className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <select
              value={userFilter}
              onChange={(e) => onUserFilterChange(e.target.value)}
              className="bg-transparent text-text-primary text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Select Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-subtle text-xs text-text-secondary">
            <Filter className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <select
              value={severityFilter}
              onChange={(e) => onSeverityFilterChange(e.target.value)}
              className="bg-transparent text-text-primary text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">Severity: All</option>
              {severityList.filter((s) => s !== 'all').map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/20 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Table / Timeline Toggle Buttons */}
          <div className="flex items-center bg-surface-2 p-1 rounded-xl border border-subtle">
            <button
              onClick={() => onViewModeChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-primary text-text-primary shadow-glow-primary/30'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => onViewModeChange('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-primary text-text-primary shadow-glow-primary/30'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Type Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-subtle/50">
        <span className="text-text-muted text-[11px] font-mono shrink-0 mr-1">Action:</span>
        {actionsList.map((action) => {
          const isActive = actionFilter === action;
          return (
            <button
              key={action}
              onClick={() => onActionFilterChange(action)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-accent/20 text-accent border border-accent/40 font-semibold shadow-sm'
                  : 'bg-surface-2/60 text-text-muted hover:text-text-primary hover:bg-surface-2 border border-subtle/60'
              }`}
            >
              {action === 'all' ? 'All Actions' : action}
            </button>
          );
        })}
      </div>
    </div>
  );
};
