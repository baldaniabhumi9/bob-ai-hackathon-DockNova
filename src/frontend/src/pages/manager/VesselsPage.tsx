import React, { useState, useMemo } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Table, Column } from '@/components/ui/Table';
import { MOCK_VESSELS, VesselTimelineItem } from '@/features/vessels/mockVessels';
import { VesselDetailModal } from './components/VesselDetailModal';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { useLiveOperations } from '@/hooks/useLiveOperations';

type FilterStatus = 'All' | 'Arriving' | 'At Berth' | 'Delayed';

export const VesselsPage: React.FC = () => {
  const { state } = useLiveOperations();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('All');
  const [selectedVessel, setSelectedVessel] = useState<VesselTimelineItem | null>(null);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);

  // Live KPI metrics derived from state when available
  const kpiData = useMemo(() => {
    if (state) {
      const total = state.vessels.length;
      const arriving = state.vessels.filter((v) => v.status === 'SCHEDULED').length;
      const delayed = state.vessels.filter((v) => v.status === 'WAITING').length;
      const handling = state.vessels.filter((v) => v.status === 'HANDLING').length;
      return [
        { title: 'Vessels in Port', value: String(total), badge: 'Active', variant: 'cyan' as const },
        { title: 'Arriving < 24h', value: String(arriving), badge: 'Expected', variant: 'cyan' as const },
        { title: 'In Queue', value: String(delayed), badge: 'Waiting', variant: 'warning' as const },
        { title: 'At Berth', value: String(handling), badge: 'Handling', variant: 'success' as const },
      ];
    }
    return [
      { title: 'Vessels in Port', value: '24', badge: 'Active', variant: 'cyan' as const },
      { title: 'Arriving < 24h', value: '8', badge: 'Expected', variant: 'cyan' as const },
      { title: 'Delayed', value: '3', badge: 'Delayed', variant: 'warning' as const },
      { title: 'High Risk', value: '2', badge: 'Action Needed', variant: 'critical' as const },
    ];
  }, [state]);

  const liveVessels = useMemo<VesselTimelineItem[] | null>(() => {
    if (!state) return null;
    return state.vessels.map((vessel) => {
      const berth = state.berths.find((candidate) => candidate.currentVesselId === vessel.id);
      const status = vessel.status === 'HANDLING' ? 'At Berth' : vessel.status === 'WAITING' ? 'Delayed' : vessel.status === 'SCHEDULED' ? 'Scheduled' : 'At Berth';
      return {
        id: vessel.id,
        name: vessel.name,
        imo: vessel.imo,
        eta: new Date(vessel.eta).toLocaleString(),
        etd: new Date(vessel.etd).toLocaleString(),
        assignedBerth: berth?.code ?? 'Queue',
        status,
        statusVariant: status === 'Delayed' ? 'warning' : status === 'At Berth' ? 'success' : 'cyan',
        filterStatus: status === 'At Berth' ? 'At Berth' : status === 'Delayed' ? 'Delayed' : 'Arriving',
        delayText: vessel.status === 'WAITING' ? 'Waiting' : '0h',
        teuCapacity: 0,
        cargoType: vessel.type,
        congestionRisk: status === 'Delayed' ? 70 : status === 'At Berth' ? 25 : 10,
      };
    });
  }, [state]);

  const vessels = liveVessels ?? MOCK_VESSELS;
  const isSimulatedFallback = liveVessels === null;

  // Filtered vessel list
  const filteredVessels = useMemo(() => {
    return vessels.filter((vessel) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        vessel.name.toLowerCase().includes(query) ||
        vessel.imo.toLowerCase().includes(query) ||
        vessel.assignedBerth.toLowerCase().includes(query);

      const matchesStatus =
        activeFilter === 'All' || vessel.filterStatus === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, activeFilter, vessels]);

  // Vessel Table Column Definitions
  const columns: Column<VesselTimelineItem>[] = [
    {
      key: 'name',
      header: 'Vessel',
      render: (vessel) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600, color: colors.primaryText }}>{vessel.name}</span>
          <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>{vessel.imo}</span>
        </div>
      ),
    },
    {
      key: 'eta',
      header: 'ETA',
      render: (vessel) => (
        <span style={{ fontWeight: 500, color: colors.primaryText }}>{vessel.eta}</span>
      ),
    },
    {
      key: 'assignedBerth',
      header: 'Berth',
      render: (vessel) => (
        <Badge variant="cyan">{vessel.assignedBerth}</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (vessel) => (
        <Badge variant={vessel.statusVariant}>{vessel.status}</Badge>
      ),
    },
    {
      key: 'delayText',
      header: 'Delay',
      render: (vessel) => {
        const isDelayed = vessel.delayText !== '0h';
        return (
          <span
            style={{
              fontWeight: 600,
              color: isDelayed ? colors.critical : colors.success,
            }}
          >
            {vessel.delayText}
          </span>
        );
      },
    },
    {
      key: 'congestionRisk',
      header: 'Risk',
      render: (vessel) => {
        const risk = vessel.congestionRisk || 15;
        let badgeVariant: 'critical' | 'warning' | 'success' = 'success';
        if (risk >= 60) badgeVariant = 'critical';
        else if (risk >= 30) badgeVariant = 'warning';

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <Badge variant={badgeVariant}>{risk}% Risk</Badge>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          border: `1px solid ${colors.surfaceBorder}`,
          padding: spacing.md,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: colors.primaryText }}>
            Vessel Schedule & Traffic Control
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: colors.secondaryText }}>
            Monitor real-time vessel traffic, predicted schedule variances, and AI berth optimization recommendations.
          </p>
        </div>
        <Badge variant={isSimulatedFallback ? "warning" : "cyan"}>{isSimulatedFallback ? "Simulated Data" : "SYSTEM LIVE"}</Badge>
      </div>

      {/* 4 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.md, width: '100%' }}>
        {kpiData.map((kpi, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: colors.surface,
              borderRadius: radius.md,
              border: `1px solid ${colors.surfaceBorder}`,
              padding: `${spacing.md} ${spacing.lg}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8125rem', color: colors.secondaryText, fontWeight: 500, marginBottom: '4px' }}>
                {kpi.title}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.primaryText, letterSpacing: '-0.02em' }}>
                {kpi.value}
              </div>
            </div>
            <Badge variant={kpi.variant}>{kpi.badge}</Badge>
          </div>
        ))}
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          border: `1px solid ${colors.surfaceBorder}`,
          padding: spacing.md,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: spacing.md,
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Search Input */}
        <div style={{ width: '320px' }}>
          <Input
            placeholder="Search vessel, IMO, or berth..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Right: Status Filter Buttons */}
        <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', color: colors.secondaryText, marginRight: spacing.xs }}>
            Filter:
          </span>
          {(['All', 'Arriving', 'At Berth', 'Delayed'] as FilterStatus[]).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  borderRadius: radius.full,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? `1px solid ${colors.novaCyan}` : `1px solid ${colors.surfaceBorder}`,
                  backgroundColor: isActive ? 'rgba(34, 211, 238, 0.15)' : colors.background,
                  color: isActive ? colors.novaCyan : colors.secondaryText,
                  transition: 'all 0.15s ease',
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Vessel Table */}
      <Table
        columns={columns}
        data={filteredVessels}
        emptyMessage="No vessels match the specified search or filter criteria."
        onRowClick={(vessel) => setSelectedVessel(vessel)}
      />

      {/* Modals */}
      <VesselDetailModal
        vessel={selectedVessel}
        isOpen={Boolean(selectedVessel)}
        onClose={() => setSelectedVessel(null)}
        onRunWhatIf={() => {
          setIsWhatIfOpen(true);
        }}
      />

      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />
    </div>
  );
};

export default VesselsPage;
