import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor,
  Cpu,
  Ship,
  Info,
  ExternalLink,
  Layers,
  Sparkles,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Compass,
  Gauge,
  Ruler,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Terminal, Berth, Crane } from '../types';

export interface VisualMapPreviewProps {
  terminals: Terminal[];
  berths: Berth[];
  cranes: Crane[];
  onSelectBerth?: (berth: Berth) => void;
  onSelectCrane?: (crane: Crane) => void;
}

export const VisualMapPreview: React.FC<VisualMapPreviewProps> = ({
  terminals,
  berths,
  cranes,
  onSelectBerth,
  onSelectCrane,
}) => {
  const [selectedTerminalId, setSelectedTerminalId] = useState<string>('all');
  const [hoveredBerth, setHoveredBerth] = useState<Berth | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeTerminals =
    selectedTerminalId === 'all'
      ? terminals
      : terminals.filter((t) => t.id === selectedTerminalId);

  const getStatusColor = (status: Berth['status']) => {
    switch (status) {
      case 'Available':
        return {
          border: 'border-[#34D399]',
          bg: 'bg-[#34D399]/15',
          hoverBg: 'hover:bg-[#34D399]/25',
          text: 'text-[#34D399]',
          dot: 'bg-[#34D399]',
          label: 'Available',
        };
      case 'Occupied':
        return {
          border: 'border-[#38BDF8]',
          bg: 'bg-[#38BDF8]/15',
          hoverBg: 'hover:bg-[#38BDF8]/25',
          text: 'text-[#38BDF8]',
          dot: 'bg-[#38BDF8]',
          label: 'Occupied',
        };
      case 'Maintenance':
        return {
          border: 'border-[#FBBF24]',
          bg: 'bg-[#FBBF24]/15',
          hoverBg: 'hover:bg-[#FBBF24]/25',
          text: 'text-[#FBBF24]',
          dot: 'bg-[#FBBF24]',
          label: 'Maintenance',
        };
      case 'Offline':
        return {
          border: 'border-[#F87171]',
          bg: 'bg-[#F87171]/15',
          hoverBg: 'hover:bg-[#F87171]/25',
          text: 'text-[#F87171]',
          dot: 'bg-[#F87171]',
          label: 'Offline',
        };
    }
  };

  const getCraneStatusColor = (status: Crane['status']) => {
    switch (status) {
      case 'Operational':
        return 'text-success bg-success/20 border-success/40';
      case 'Maintenance':
        return 'text-warning bg-warning/20 border-warning/40';
      case 'Fault':
        return 'text-danger bg-danger/20 border-danger/40 animate-pulse';
    }
  };

  const handleMouseEnter = (berth: Berth, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setHoveredBerth(berth);
  };

  const handleMouseLeave = () => {
    setHoveredBerth(null);
  };

  return (
    <div className="rounded-2xl bg-surface-1 border border-border/80 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Visual Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/25 text-primary">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-lg text-text-primary">
                Visual Quayside Schematic & Basin Layout
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                Interactive Map
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Real-time spatial visualization of terminal berths, quayside gantry positions, and docked vessels.
            </p>
          </div>
        </div>

        {/* Terminal Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTerminalId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedTerminalId === 'all'
                ? 'bg-primary text-white font-semibold shadow-glow-primary'
                : 'bg-surface-2 text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            All Port Sectors ({terminals.length})
          </button>
          {terminals.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTerminalId(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedTerminalId === t.id
                  ? 'bg-primary text-white font-semibold shadow-glow-primary'
                  : 'bg-surface-2 text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {t.code}
            </button>
          ))}
        </div>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-surface-2/60 p-3 rounded-xl border border-border/50 font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-text-muted text-[11px]">BERTH STATUS:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#34D399]" />
            <span className="text-text-primary">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
            <span className="text-text-primary">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FBBF24]" />
            <span className="text-text-primary">Maintenance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F87171]" />
            <span className="text-text-primary">Offline</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-text-secondary">
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <span>STS Crane</span>
          </div>
          <div className="flex items-center gap-1">
            <Ship className="w-3.5 h-3.5 text-secondary" />
            <span>Vessel Moored</span>
          </div>
          <span className="text-text-muted">Hover berth to zoom (1.05x)</span>
        </div>
      </div>

      {/* Schematic Container */}
      <div className="space-y-6">
        {activeTerminals.map((terminal) => {
          const terminalBerths = berths.filter((b) => b.terminalId === terminal.id);
          const terminalCranes = cranes.filter((c) => c.terminalId === terminal.id);

          return (
            <div
              key={terminal.id}
              className="p-4 sm:p-5 rounded-xl bg-surface-2/40 border border-border/70 space-y-4"
            >
              {/* Terminal Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30">
                    {terminal.code}
                  </span>
                  <span className="font-semibold text-sm text-text-primary">
                    {terminal.name}
                  </span>
                  <span className="text-xs text-text-muted hidden sm:inline">•</span>
                  <span className="text-xs text-text-muted hidden sm:inline">
                    {terminal.quayLengthMeters}m Quay Line
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-text-secondary">
                    {terminalBerths.length} Berths
                  </span>
                  <span className="text-text-secondary">•</span>
                  <span className="text-text-secondary">
                    {terminalCranes.length} Cranes
                  </span>
                  <span className="text-text-secondary">•</span>
                  <span className="text-primary font-semibold">
                    {terminal.avgUtilization}% Utilized
                  </span>
                </div>
              </div>

              {/* Graphical Quay Line & Water Basin */}
              <div className="relative rounded-xl border border-border/80 bg-base/80 p-4 sm:p-6 overflow-hidden">
                {/* Water Texture Pattern (subtle SVG lines) */}
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(#38BDF8 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Quayside Apron Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-text-muted mb-2 px-1">
                  <span>TERMINAL QUAYSIDE RAIL TRACK</span>
                  <span>HARBOR WATER BASIN</span>
                </div>

                {/* Berths Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 relative z-10">
                  {terminalBerths.map((berth) => {
                    const statusStyle = getStatusColor(berth.status);
                    const assignedCranesList = cranes.filter(
                      (c) => c.assignedBerthId === berth.id || c.assignedBerthCode === berth.code
                    );

                    return (
                      <motion.div
                        key={berth.id}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onMouseEnter={(e) => handleMouseEnter(berth, e)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => onSelectBerth?.(berth)}
                        className={`relative cursor-pointer rounded-xl border-2 ${statusStyle.border} ${statusStyle.bg} ${statusStyle.hoverBg} p-3.5 transition-colors shadow-sm flex flex-col justify-between min-h-[130px]`}
                      >
                        {/* Top: Berth ID & Status Dot */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-sm text-text-primary">
                              {berth.code}
                            </span>
                            <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                          </div>
                          <span
                            className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${statusStyle.border} ${statusStyle.text}`}
                          >
                            {statusStyle.label}
                          </span>
                        </div>

                        {/* Middle: Current Vessel info or Available status */}
                        <div className="my-2">
                          {berth.status === 'Occupied' && berth.currentVesselName ? (
                            <div className="p-2 rounded-lg bg-surface-1/90 border border-primary/30 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary truncate">
                                <Ship className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                <span className="truncate">{berth.currentVesselName}</span>
                              </div>
                              <div className="text-[10px] font-mono text-text-muted">
                                {berth.currentVesselImo || 'Active Discharge'}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-text-muted italic flex items-center gap-1">
                              {berth.status === 'Available' && (
                                <span className="text-success text-[11px] font-medium not-italic">
                                  Ready for Arrival
                                </span>
                              )}
                              {berth.status === 'Maintenance' && (
                                <span className="text-warning text-[11px] font-medium not-italic">
                                  Dredging / Fender Refit
                                </span>
                              )}
                              {berth.status === 'Offline' && (
                                <span className="text-danger text-[11px] font-medium not-italic">
                                  Quay Offline
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Bottom: Crane Icons & Dimensions */}
                        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-text-secondary">
                          <span>{berth.lengthMeters}m × {berth.depthMeters}m</span>
                          <div className="flex items-center gap-1">
                            {assignedCranesList.map((crane) => (
                              <span
                                key={crane.id}
                                title={`${crane.code} (${crane.type}) - ${crane.status}`}
                                className={`px-1 py-0.5 rounded text-[9px] font-bold border ${getCraneStatusColor(
                                  crane.status
                                )}`}
                              >
                                {crane.code.replace('CR-', '')}
                              </span>
                            ))}
                            {assignedCranesList.length === 0 && (
                              <span className="text-[10px] text-text-muted">0 Cranes</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rich Tooltip (Portal-like floating on hovered berth) */}
      <AnimatePresence>
        {hoveredBerth && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full w-72 p-4 rounded-xl bg-surface-2/95 border border-border backdrop-blur-md shadow-2xl text-left"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Anchor className="w-4 h-4 text-primary" />
                <span className="font-heading font-bold text-sm text-text-primary">
                  {hoveredBerth.code} — {hoveredBerth.name}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                  getStatusColor(hoveredBerth.status).border
                } ${getStatusColor(hoveredBerth.status).text}`}
              >
                {hoveredBerth.status}
              </span>
            </div>

            <div className="py-2.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span className="flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-text-muted" /> Length:
                </span>
                <span className="font-mono text-text-primary font-semibold">
                  {hoveredBerth.lengthMeters} meters
                </span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-text-muted" /> Depth:
                </span>
                <span className="font-mono text-text-primary font-semibold">
                  {hoveredBerth.depthMeters}m (Draft: {hoveredBerth.maxDraftMeters}m)
                </span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-text-muted" /> Cranes:
                </span>
                <span className="font-mono text-text-primary font-semibold">
                  {cranes.filter((c) => c.assignedBerthId === hoveredBerth.id).length} Active Units
                </span>
              </div>

              {hoveredBerth.currentVesselName && (
                <div className="pt-2 border-t border-border/50">
                  <span className="text-[10px] font-mono text-text-muted block mb-1">
                    CURRENT VESSEL MOORED
                  </span>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-1 border border-primary/20">
                    <div>
                      <div className="font-semibold text-text-primary text-xs">
                        {hoveredBerth.currentVesselName}
                      </div>
                      <div className="text-[10px] font-mono text-text-muted">
                        {hoveredBerth.currentVesselImo}
                      </div>
                    </div>
                    {hoveredBerth.currentVesselId && (
                      <span className="text-[10px] text-primary flex items-center gap-0.5">
                        View <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border/60 text-[10px] font-mono text-text-muted text-center">
              Click to manage berth parameters
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VisualMapPreview;
