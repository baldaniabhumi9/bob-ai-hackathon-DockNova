import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Anchor,
  Cpu,
  Layers,
  RotateCcw,
  Sparkles,
  Settings2,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import {
  Terminal,
  Berth,
  Crane,
  PortConfigTab,
  EntityType,
  BerthStatus,
  CraneStatus,
} from './types';
import {
  INITIAL_TERMINALS,
  INITIAL_BERTHS,
  INITIAL_CRANES,
  STORAGE_KEYS,
} from './mockPortConfig';
import { TerminalsTab } from './components/TerminalsTab';
import { BerthsTab } from './components/BerthsTab';
import { CranesTab } from './components/CranesTab';
import { VisualMapPreview } from './components/VisualMapPreview';
import { PortConfigModal } from './components/PortConfigModal';
import { Toast, ToastType } from '@/features/auth/components/Toast';

export const PortConfigurationView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Tab state synced with URL (?tab=terminals|berths|cranes)
  const activeTabFromUrl = (searchParams.get('tab') as PortConfigTab) || 'terminals';
  const activeTab: PortConfigTab = ['terminals', 'berths', 'cranes'].includes(activeTabFromUrl)
    ? activeTabFromUrl
    : 'terminals';

  const handleTabChange = (newTab: PortConfigTab) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set('tab', newTab);
      return updated;
    });
  };

  // Visual Map Preview Toggle
  const [showVisualMap, setShowVisualMap] = useState<boolean>(true);

  // 2. State for Terminals, Berths, Cranes (backed by localStorage)
  const [terminals, setTerminals] = useState<Terminal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TERMINALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_TERMINALS;
  });

  const [berths, setBerths] = useState<Berth[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BERTHS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_BERTHS;
  });

  const [cranes, setCranes] = useState<Crane[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CRANES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_CRANES;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TERMINALS, JSON.stringify(terminals));
    } catch {}
  }, [terminals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BERTHS, JSON.stringify(berths));
    } catch {}
  }, [berths]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CRANES, JSON.stringify(cranes));
    } catch {}
  }, [cranes]);

  // 3. Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalEntityType, setModalEntityType] = useState<EntityType>('terminal');
  const [modalInitialData, setModalInitialData] = useState<any>(null);

  // 4. Toast Notification State
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: ToastType;
  }>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  // Reset to Defaults helper
  const handleResetToDefaults = () => {
    setTerminals(INITIAL_TERMINALS);
    setBerths(INITIAL_BERTHS);
    setCranes(INITIAL_CRANES);
    localStorage.removeItem(STORAGE_KEYS.TERMINALS);
    localStorage.removeItem(STORAGE_KEYS.BERTHS);
    localStorage.removeItem(STORAGE_KEYS.CRANES);
    showToast('Port infrastructure reset to default mock configuration.', 'warning');
  };

  // Handlers for Add/Edit
  const handleOpenAdd = (type: EntityType) => {
    setModalEntityType(type);
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (type: EntityType, item: any) => {
    setModalEntityType(type);
    setModalInitialData(item);
    setIsModalOpen(true);
  };

  const handleSaveEntity = (type: EntityType, data: any) => {
    if (type === 'terminal') {
      if (data.id) {
        setTerminals((prev) => prev.map((t) => (t.id === data.id ? { ...t, ...data } : t)));
        showToast(`Terminal "${data.code}" updated successfully.`);
      } else {
        const newTerminal: Terminal = {
          ...data,
          id: `term-${Date.now()}`,
          totalBerths: data.totalBerths || 3,
          activeCranes: data.activeCranes || 4,
          avgUtilization: data.avgUtilization || 60,
          establishedYear: 2026,
        };
        setTerminals((prev) => [...prev, newTerminal]);
        showToast(`New Terminal "${newTerminal.code}" created successfully.`);
      }
    } else if (type === 'berth') {
      if (data.id) {
        setBerths((prev) => prev.map((b) => (b.id === data.id ? { ...b, ...data } : b)));
        showToast(`Berth "${data.code}" updated successfully.`);
      } else {
        const newBerth: Berth = {
          ...data,
          id: `b-${Date.now()}`,
          cranesAssigned: data.cranesAssigned || [],
          lastInspectionDate: new Date().toISOString().split('T')[0],
        };
        setBerths((prev) => [...prev, newBerth]);
        showToast(`New Berth "${newBerth.code}" registered.`);
      }
    } else if (type === 'crane') {
      if (data.id) {
        setCranes((prev) => prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
        showToast(`Crane "${data.code}" telemetry updated.`);
      } else {
        const newCrane: Crane = {
          ...data,
          id: `cr-${Date.now()}`,
          lastMaintenanceDate: data.lastMaintenanceDate || new Date().toISOString().split('T')[0],
        };
        setCranes((prev) => [...prev, newCrane]);
        showToast(`New Crane "${newCrane.code}" deployed.`);
      }
    }
  };

  // Handlers for Status Toggles
  const handleToggleBerthStatus = (berthId: string, newStatus: BerthStatus) => {
    setBerths((prev) =>
      prev.map((b) => {
        if (b.id === berthId) {
          return {
            ...b,
            status: newStatus,
            currentVesselName: newStatus === 'Available' ? undefined : b.currentVesselName,
            currentVesselImo: newStatus === 'Available' ? undefined : b.currentVesselImo,
          };
        }
        return b;
      })
    );
    const berth = berths.find((b) => b.id === berthId);
    showToast(`Berth ${berth?.code || berthId} status changed to ${newStatus}.`);
  };

  const handleToggleCraneStatus = (craneId: string, newStatus: CraneStatus) => {
    setCranes((prev) =>
      prev.map((c) => (c.id === craneId ? { ...c, status: newStatus } : c))
    );
    const crane = cranes.find((c) => c.id === craneId);
    showToast(`Crane ${crane?.code || craneId} status changed to ${newStatus}.`);
  };

  // Summary Metrics
  const summary = useMemo(() => {
    const totalBerths = berths.length;
    const occupiedBerths = berths.filter((b) => b.status === 'Occupied').length;
    const availableBerths = berths.filter((b) => b.status === 'Available').length;
    const totalCranes = cranes.length;
    const operationalCranes = cranes.filter((c) => c.status === 'Operational').length;

    return {
      totalTerminals: terminals.length,
      totalBerths,
      occupiedBerths,
      availableBerths,
      totalCranes,
      operationalCranes,
    };
  }, [terminals, berths, cranes]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Title & Quick Controls */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
              Port Configuration Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/15 text-primary border border-primary/30">
              Infrastructure Control
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1 max-w-2xl">
            Configure quayside terminal sectors, monitor berth draft geometries, dispatch crane assets, and maintain physical port capabilities.
          </p>
        </div>

        {/* Top Right Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Visual Map Toggle Button */}
          <button
            onClick={() => setShowVisualMap((prev) => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              showVisualMap
                ? 'bg-primary/20 text-primary border border-primary/40 shadow-glow-primary'
                : 'bg-surface-2 text-text-secondary hover:text-text-primary border border-border'
            }`}
            title="Toggle Visual Quayside Schematic Preview"
          >
            <Layers className="w-4 h-4" />
            <span>{showVisualMap ? 'Hide Map Schematic' : 'Show Map Schematic'}</span>
          </button>

          {/* Reset to Defaults */}
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text-primary text-xs font-mono transition-colors border border-border"
            title="Reset to default mock terminals, berths, and cranes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-surface-1 border border-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/25 text-accent">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-text-muted">ACTIVE TERMINALS</div>
            <div className="font-heading font-bold text-lg text-text-primary">
              {summary.totalTerminals} Sectors
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-1 border border-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/25 text-primary">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-text-muted">BERTH CAPACITY</div>
            <div className="font-heading font-bold text-lg text-text-primary">
              {summary.totalBerths} Berths
              <span className="text-xs font-mono font-normal text-success ml-1.5">
                ({summary.availableBerths} open)
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-1 border border-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/25 text-secondary">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-text-muted">QUAYSIDE CRANES</div>
            <div className="font-heading font-bold text-lg text-text-primary">
              {summary.totalCranes} Total
              <span className="text-xs font-mono font-normal text-primary ml-1.5">
                ({summary.operationalCranes} live)
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-1 border border-subtle flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-success/10 border border-success/25 text-success">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-text-muted">BERTH OCCUPANCY</div>
            <div className="font-heading font-bold text-lg text-text-primary">
              {Math.round((summary.occupiedBerths / (summary.totalBerths || 1)) * 100)}%
              <span className="text-xs font-mono font-normal text-text-muted ml-1.5">
                current load
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Visual Map Preview (if enabled) */}
      <AnimatePresence>
        {showVisualMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <VisualMapPreview
              terminals={terminals}
              berths={berths}
              cranes={cranes}
              onSelectBerth={(berth) => handleOpenEdit('berth', berth)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Tab Navigation Selector (Terminals | Berths | Cranes) */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3">
        <button
          onClick={() => handleTabChange('terminals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'terminals'
              ? 'bg-accent/20 text-accent border border-accent/40 shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Terminals</span>
          <span className="ml-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-3 text-text-muted">
            {terminals.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('berths')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'berths'
              ? 'bg-primary/20 text-primary border border-primary/40 shadow-glow-primary'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
          }`}
        >
          <Anchor className="w-4 h-4" />
          <span>Berths</span>
          <span className="ml-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-3 text-text-muted">
            {berths.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('cranes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'cranes'
              ? 'bg-secondary/20 text-secondary border border-secondary/40 shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Cranes</span>
          <span className="ml-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-3 text-text-muted">
            {cranes.length}
          </span>
        </button>
      </div>

      {/* 5. Tab Content with Framer Motion Fade + Slide Animation */}
      <AnimatePresence mode="wait">
        {activeTab === 'terminals' && (
          <motion.div
            key="terminals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TerminalsTab
              terminals={terminals}
              berths={berths}
              cranes={cranes}
              onEditTerminal={(t) => handleOpenEdit('terminal', t)}
              onAddTerminal={() => handleOpenAdd('terminal')}
            />
          </motion.div>
        )}

        {activeTab === 'berths' && (
          <motion.div
            key="berths"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <BerthsTab
              berths={berths}
              terminals={terminals}
              onEditBerth={(b) => handleOpenEdit('berth', b)}
              onAddBerth={() => handleOpenAdd('berth')}
              onToggleStatus={handleToggleBerthStatus}
            />
          </motion.div>
        )}

        {activeTab === 'cranes' && (
          <motion.div
            key="cranes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CranesTab
              cranes={cranes}
              terminals={terminals}
              berths={berths}
              onEditCrane={(c) => handleOpenEdit('crane', c)}
              onAddCrane={() => handleOpenAdd('crane')}
              onToggleStatus={handleToggleCraneStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Add/Edit Entity Dynamic Modal */}
      <PortConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        entityType={modalEntityType}
        initialData={modalInitialData}
        terminals={terminals}
        berths={berths}
        onSave={handleSaveEntity}
      />

      {/* 7. Success/Notice Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default PortConfigurationView;
