import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Route,
  Ship,
  Sparkles,
  ChevronDown,
  Navigation,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import {
  routingVesselsDatabase,
  defaultSelectedVesselId,
  AlternatePortOption,
} from './mockRouteData';
import { CurrentStatusCard } from './components/CurrentStatusCard';
import { AlternateOptionCard } from './components/AlternateOptionCard';
import { RouteRadarComparison } from './components/RouteRadarComparison';
import { CostBenefitSummary } from './components/CostBenefitSummary';
import { RerouteConfirmModal } from './components/RerouteConfirmModal';

export const AlternateRoutingAdvisor: React.FC = () => {
  const navigate = useNavigate();

  // Vessel Selection State
  const [selectedVesselId, setSelectedVesselId] = useState<string>(defaultSelectedVesselId);
  const currentVessel = routingVesselsDatabase[selectedVesselId] || routingVesselsDatabase[defaultSelectedVesselId];

  // Alternate Option Selection State
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    currentVessel.alternateOptions[0]?.id || ''
  );

  // Active Option lookup
  const activeOption =
    currentVessel.alternateOptions.find((opt) => opt.id === selectedOptionId) ||
    currentVessel.alternateOptions[0];

  // Success Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Handle vessel change
  const handleVesselChange = (vslId: string) => {
    setSelectedVesselId(vslId);
    const newVessel = routingVesselsDatabase[vslId];
    if (newVessel && newVessel.alternateOptions.length > 0) {
      setSelectedOptionId(newVessel.alternateOptions[0].id);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* =========================================================================
          PAGE HEADER: Title, Subtitle & Vessel Selector Dropdown
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-secondary/15 text-secondary border border-secondary/20">
              <Route className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-secondary font-semibold">
              Predictive Voyage Optimization
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Smart Reroute Advisor
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-2xl leading-relaxed">
            AI-powered alternate port recommendations based on live congestion, fuel burn, port fees, and fairway arrival windows.
          </p>
        </div>

        {/* Vessel Selector Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="text-xs font-mono text-text-muted flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-primary" />
              <span>Target Vessel:</span>
            </span>

            <div className="relative">
              <select
                value={selectedVesselId}
                onChange={(e) => handleVesselChange(e.target.value)}
                className="appearance-none bg-surface-2 hover:bg-surface-3 border border-border text-xs font-mono font-semibold text-text-primary pl-3.5 pr-9 py-2.5 rounded-xl cursor-pointer focus:outline-none focus:border-primary transition-all shadow-md"
              >
                {Object.values(routingVesselsDatabase).map((vsl) => (
                  <option key={vsl.id} value={vsl.id}>
                    {vsl.name} ({vsl.imo}) — {vsl.originalDestination.congestionRisk}% Congestion
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          1. CURRENT STATUS CARD (Original Destination & Congestion)
         ========================================================================= */}
      <CurrentStatusCard vessel={currentVessel} />

      {/* =========================================================================
          2. ALTERNATE OPTIONS GRID (3 Cards Side by Side)
         ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-heading font-bold text-lg text-text-primary">
              AI-Generated Alternate Ports
            </h3>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Select an option to project multidimensional trade-offs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {currentVessel.alternateOptions.map((opt, index) => (
            <AlternateOptionCard
              key={opt.id}
              option={opt}
              isSelected={opt.id === activeOption.id}
              onSelect={() => setSelectedOptionId(opt.id)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* =========================================================================
          3. RADAR CHART COMPARISON (Selected Alternate vs Original Destination)
         ========================================================================= */}
      <RouteRadarComparison
        vessel={currentVessel}
        selectedOption={activeOption}
      />

      {/* =========================================================================
          4. COST-BENEFIT SUMMARY (Table + Total Savings + Confirm Action)
         ========================================================================= */}
      <CostBenefitSummary
        vessel={currentVessel}
        selectedOption={activeOption}
        onConfirmReroute={() => setIsModalOpen(true)}
      />

      {/* =========================================================================
          5. CONFIRMATION SUCCESS MODAL
         ========================================================================= */}
      <RerouteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vessel={currentVessel}
        option={activeOption}
        onReturnToRadar={() => {
          setIsModalOpen(false);
          navigate('/user');
        }}
      />
    </div>
  );
};
