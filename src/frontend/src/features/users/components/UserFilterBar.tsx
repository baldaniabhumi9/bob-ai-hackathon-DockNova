import React from 'react';
import { Search, Download, Filter, X } from 'lucide-react';
import { UserRole, UserStatus } from '../types';

interface UserFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onExportCsv: () => void;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onExportCsv,
  onResetFilters,
  isFiltered,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-surface-1 border border-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or company (e.g. Maersk, PSA)..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-2 border border-subtle text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Dropdowns & Export Button */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Role Filter */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-2 border border-subtle text-xs font-mono text-text-primary focus:outline-none focus:border-primary/60 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="manager">Port Manager</option>
            <option value="user">Vessel Operator</option>
            <option value="admin">System Admin</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-text-muted text-[10px]">
            ▼
          </div>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl bg-surface-2 border border-subtle text-xs font-mono text-text-primary focus:outline-none focus:border-primary/60 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-text-muted text-[10px]">
            ▼
          </div>
        </div>

        {/* Reset button if filters active */}
        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-3 py-2.5 rounded-xl bg-surface-2 hover:bg-surface-3 border border-subtle text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}

        {/* Export CSV Button */}
        <button
          type="button"
          onClick={onExportCsv}
          title="Export Filtered Users to CSV"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-2 hover:bg-surface-3 border border-subtle text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-primary/50 transition-all duration-150 ml-auto md:ml-0 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-primary" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};
