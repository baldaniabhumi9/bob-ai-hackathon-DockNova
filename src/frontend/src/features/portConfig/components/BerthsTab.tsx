import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Anchor,
  Edit2,
  Plus,
  Ship,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Activity,
  Ruler,
  Gauge,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Berth, Terminal, BerthStatus } from '../types';

export interface BerthsTabProps {
  berths: Berth[];
  terminals: Terminal[];
  onEditBerth: (berth: Berth) => void;
  onAddBerth: () => void;
  onToggleStatus: (berthId: string, newStatus: BerthStatus) => void;
}

export const BerthsTab: React.FC<BerthsTabProps> = ({
  berths,
  terminals,
  onEditBerth,
  onAddBerth,
  onToggleStatus,
}) => {
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [terminalFilter, setTerminalFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBerths = useMemo(() => {
    return berths.filter((berth) => {
      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesCode = berth.code.toLowerCase().includes(term);
        const matchesName = berth.name.toLowerCase().includes(term);
        const matchesVessel =
          berth.currentVesselName?.toLowerCase().includes(term) ||
          berth.currentVesselImo?.toLowerCase().includes(term);
        if (!matchesCode && !matchesName && !matchesVessel) return false;
      }

      // Terminal filter
      if (terminalFilter !== 'all' && berth.terminalId !== terminalFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && berth.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [berths, searchTerm, terminalFilter, statusFilter]);

  const getStatusBadge = (status: BerthStatus) => {
    switch (status) {
      case 'Available':
        return {
          badge: 'bg-success/15 text-success border-success/30 hover:bg-success/25',
          dot: 'bg-success',
          label: 'Available',
        };
      case 'Occupied':
        return {
          badge: 'bg-primary/15 text-primary border-primary/30 hover:bg-primary/25',
          dot: 'bg-primary',
          label: 'Occupied',
        };
      case 'Maintenance':
        return {
          badge: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/25',
          dot: 'bg-warning',
          label: 'Maintenance',
        };
      case 'Offline':
        return {
          badge: 'bg-danger/15 text-danger border-danger/30 hover:bg-danger/25',
          dot: 'bg-danger',
          label: 'Offline',
        };
    }
  };

  const getNextStatus = (current: BerthStatus): BerthStatus => {
    switch (current) {
      case 'Available':
        return 'Occupied';
      case 'Occupied':
        return 'Maintenance';
      case 'Maintenance':
        return 'Offline';
      case 'Offline':
        return 'Available';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Bar: Section Title & Add Berth Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-lg sm:text-xl text-text-primary">
              Quayside Berths & Moorings
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-primary/15 text-primary border border-primary/30">
              {berths.length} Monitored
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Manage quay draft depth thresholds, real-time docking assignments, and scheduled quayside maintenance.
          </p>
        </div>

        {/* Add Berth button */}
        <button
          onClick={onAddBerth}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-xs sm:text-sm font-semibold text-text-primary shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Berth</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-surface-1 border border-border/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-text-muted" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Berth ID (e.g. B-01) or vessel name..."
            className="w-full pl-9 pr-4 py-2 bg-surface-2 rounded-xl text-xs sm:text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-text-muted"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Terminal Filter */}
          <div className="relative">
            <select
              value={terminalFilter}
              onChange={(e) => setTerminalFilter(e.target.value)}
              className="px-3 py-2 bg-surface-2 rounded-xl text-xs text-text-secondary hover:text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="all">All Terminals</option>
              {terminals.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} ({t.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-surface-2 rounded-xl text-xs text-text-secondary hover:text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(searchTerm || terminalFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTerminalFilter('all');
                setStatusFilter('all');
              }}
              className="px-2.5 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text-primary text-xs font-mono transition-colors border border-border"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* BERTHS TABLE (Responsive horizontal scroll) */}
      <div className="rounded-2xl border border-subtle bg-surface-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-2/80 border-b border-border/80 text-[11px] font-mono text-text-muted uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Berth ID</th>
                <th className="py-3.5 px-4">Terminal</th>
                <th className="py-3.5 px-4">Length</th>
                <th className="py-3.5 px-4">Depth</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Current Vessel</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredBerths.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-text-muted">
                    <Anchor className="w-8 h-8 mx-auto mb-2 opacity-40 text-text-muted" />
                    <p className="text-sm font-medium text-text-secondary">No berths match current criteria</p>
                    <p className="text-xs text-text-muted mt-1">Try resetting search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredBerths.map((berth) => {
                  const statusInfo = getStatusBadge(berth.status);
                  const vesselRouteId = berth.currentVesselId || 'v1';

                  return (
                    <tr
                      key={berth.id}
                      className="hover:bg-surface-2/40 transition-colors group"
                    >
                      {/* Berth ID */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-surface-2 border border-border/80 text-primary">
                            <Anchor className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-mono font-bold text-text-primary text-sm">
                              {berth.code}
                            </div>
                            <div className="text-[11px] text-text-secondary truncate max-w-[180px]">
                              {berth.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Terminal */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs text-text-secondary">
                          {berth.terminalName.split(' ')[0]}
                        </span>
                        <div className="text-[10px] text-text-muted truncate max-w-[140px]">
                          {berth.terminalName}
                        </div>
                      </td>

                      {/* Length */}
                      <td className="py-4 px-4 font-mono font-medium text-text-primary">
                        {berth.lengthMeters}m
                      </td>

                      {/* Depth */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-medium text-text-primary">
                          {berth.depthMeters}m
                        </div>
                        <div className="text-[10px] font-mono text-text-muted">
                          Max: {berth.maxDraftMeters}m draft
                        </div>
                      </td>

                      {/* Status badge with 0.3s color transition */}
                      <td className="py-4 px-4">
                        <span
                          style={{ transition: 'all 0.3s ease' }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${statusInfo.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Current Vessel (clickable link to vessel detail) */}
                      <td className="py-4 px-4">
                        {berth.currentVesselName ? (
                          <Link
                            to={`/vessels/${vesselRouteId}`}
                            className="inline-flex items-center gap-1.5 p-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border/80 hover:border-primary/50 text-xs font-medium text-text-primary transition-all group-hover:shadow-sm"
                            title="Navigate to Vessel Passport Details"
                          >
                            <Ship className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="font-medium text-primary hover:underline truncate max-w-[130px]">
                              {berth.currentVesselName}
                            </span>
                            <ExternalLink className="w-3 h-3 text-text-muted opacity-70" />
                          </Link>
                        ) : (
                          <span className="text-xs text-text-muted italic font-mono">
                            — Open Quay
                          </span>
                        )}
                      </td>

                      {/* Actions: Edit, Toggle Status */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Status Action */}
                          <button
                            onClick={() => onToggleStatus(berth.id, getNextStatus(berth.status))}
                            style={{ transition: 'all 0.3s ease' }}
                            className="px-2.5 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-[11px] font-mono text-text-secondary hover:text-text-primary border border-border flex items-center gap-1"
                            title={`Toggle status to ${getNextStatus(berth.status)}`}
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Toggle</span>
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => onEditBerth(berth)}
                            className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text-primary border border-border transition-colors"
                            title="Edit Berth Specifications"
                            aria-label={`Edit berth ${berth.code}`}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BerthsTab;
