import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  Anchor,
  Cpu,
  Hash,
  MapPin,
  Activity,
  Ruler,
  Percent,
  FileText,
  Gauge,
  Compass,
  Ship,
  Fingerprint,
  Star,
  Calendar,
  Wrench,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Terminal, Berth, Crane, EntityType } from '../types';

export interface PortConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: EntityType;
  initialData?: Terminal | Berth | Crane | null;
  terminals: Terminal[];
  berths: Berth[];
  onSave: (type: EntityType, data: any) => void;
}

export const PortConfigModal: React.FC<PortConfigModalProps> = ({
  isOpen,
  onClose,
  entityType,
  initialData,
  terminals,
  berths,
  onSave,
}) => {
  const isEditing = Boolean(initialData?.id);

  // Form State
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when opened or initialData changes
  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      // Default empty values based on entityType
      if (entityType === 'terminal') {
        setFormData({
          code: '',
          name: '',
          location: 'Singapore Western Gateway',
          status: 'Operational',
          totalBerths: 3,
          activeCranes: 4,
          avgUtilization: 65,
          quayLengthMeters: 1500,
          description: '',
        });
      } else if (entityType === 'berth') {
        const defaultTerminal = terminals[0];
        setFormData({
          code: '',
          name: '',
          terminalId: defaultTerminal ? defaultTerminal.id : '',
          terminalName: defaultTerminal ? defaultTerminal.name : '',
          lengthMeters: 380,
          depthMeters: 16.0,
          maxDraftMeters: 15.0,
          status: 'Available',
          currentVesselName: '',
          currentVesselImo: '',
          cranesAssigned: [],
        });
      } else if (entityType === 'crane') {
        const defaultTerminal = terminals[0];
        const defaultBerth = berths.find((b) => b.terminalId === defaultTerminal?.id) || berths[0];
        setFormData({
          code: '',
          type: 'STS',
          terminalId: defaultTerminal ? defaultTerminal.id : '',
          terminalName: defaultTerminal ? defaultTerminal.name : '',
          assignedBerthId: defaultBerth ? defaultBerth.id : '',
          assignedBerthCode: defaultBerth ? defaultBerth.code : '',
          status: 'Operational',
          efficiencyRating: 4.8,
          lastMaintenanceDate: new Date().toISOString().split('T')[0],
          movesPerHour: 32,
          manufacturer: 'ZPMC Super Post-Panamax',
        });
      }
    }
  }, [isOpen, initialData, entityType, terminals, berths]);

  // Handle Input Changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }

    // Auto-fill terminal name when terminalId changes
    if (field === 'terminalId') {
      const selectedTerm = terminals.find((t) => t.id === value);
      if (selectedTerm) {
        setFormData((prev) => ({
          ...prev,
          terminalId: value,
          terminalName: selectedTerm.name,
        }));
      }
    }

    // Auto-fill berth code when assignedBerthId changes
    if (field === 'assignedBerthId') {
      const selectedBerth = berths.find((b) => b.id === value);
      if (selectedBerth) {
        setFormData((prev) => ({
          ...prev,
          assignedBerthId: value,
          assignedBerthCode: selectedBerth.code,
        }));
      }
    }
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code || !String(formData.code).trim()) {
      newErrors.code = 'Identification Code is required.';
    }

    if (entityType === 'terminal') {
      if (!formData.name || !String(formData.name).trim()) {
        newErrors.name = 'Terminal Name is required.';
      }
      if (!formData.location || !String(formData.location).trim()) {
        newErrors.location = 'Geographical location is required.';
      }
      if (Number(formData.quayLengthMeters) <= 0 || isNaN(Number(formData.quayLengthMeters))) {
        newErrors.quayLengthMeters = 'Quay length must be a positive number in meters.';
      }
      if (
        formData.avgUtilization !== undefined &&
        (Number(formData.avgUtilization) < 0 || Number(formData.avgUtilization) > 100)
      ) {
        newErrors.avgUtilization = 'Utilization percentage must be between 0 and 100.';
      }
    } else if (entityType === 'berth') {
      if (!formData.name || !String(formData.name).trim()) {
        newErrors.name = 'Berth Name is required.';
      }
      if (!formData.terminalId) {
        newErrors.terminalId = 'Please select a parent terminal.';
      }
      if (Number(formData.lengthMeters) <= 50 || isNaN(Number(formData.lengthMeters))) {
        newErrors.lengthMeters = 'Berth length must be at least 50m.';
      }
      if (Number(formData.depthMeters) <= 0 || isNaN(Number(formData.depthMeters))) {
        newErrors.depthMeters = 'Berth depth must be a positive number in meters.';
      }
      if (Number(formData.maxDraftMeters) <= 0 || isNaN(Number(formData.maxDraftMeters))) {
        newErrors.maxDraftMeters = 'Max draft must be a positive number in meters.';
      }
    } else if (entityType === 'crane') {
      if (!formData.terminalId) {
        newErrors.terminalId = 'Please select a parent terminal.';
      }
      const rating = Number(formData.efficiencyRating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        newErrors.efficiencyRating = 'Efficiency rating must be between 1.0 and 5.0.';
      }
      if (!formData.lastMaintenanceDate) {
        newErrors.lastMaintenanceDate = 'Maintenance date is required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(entityType, formData);
    onClose();
  };

  const getModalTitle = () => {
    const action = isEditing ? 'Edit' : 'Add New';
    switch (entityType) {
      case 'terminal':
        return `${action} Terminal`;
      case 'berth':
        return `${action} Berth`;
      case 'crane':
        return `${action} Crane`;
    }
  };

  const getModalIcon = () => {
    switch (entityType) {
      case 'terminal':
        return <Building2 className="w-5 h-5 text-accent" />;
      case 'berth':
        return <Anchor className="w-5 h-5 text-primary" />;
      case 'crane':
        return <Cpu className="w-5 h-5 text-secondary" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-base/80 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-surface-1 border border-border/80 rounded-2xl shadow-2xl overflow-hidden my-8 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-surface-2/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-surface-3/80 border border-border/50">
                  {getModalIcon()}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-text-primary">
                    {getModalTitle()}
                  </h3>
                  <p className="text-xs text-text-muted">
                    Configure operational parameters and quayside allocations
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* TERMINAL FIELDS */}
              {entityType === 'terminal' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Code */}
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Terminal Code *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="text"
                          value={formData.code || ''}
                          onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                          placeholder="e.g. PPT-T1"
                          className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                            errors.code ? 'border-danger' : 'border-border'
                          } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                        />
                      </div>
                      {errors.code && (
                        <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline" /> {errors.code}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Operational Status
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Activity className="w-4 h-4 text-text-muted" />
                        </div>
                        <select
                          value={formData.status || 'Operational'}
                          onChange={(e) => handleChange('status', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <option value="Operational">Operational</option>
                          <option value="High Load">High Load</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Restricted">Restricted</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                      Terminal Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="w-4 h-4 text-text-muted" />
                      </div>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g. Pasir Panjang Terminal Phase 1-2"
                        className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                          errors.name ? 'border-danger' : 'border-border'
                        } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 inline" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                      Geographic Location *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="w-4 h-4 text-text-muted" />
                      </div>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="e.g. Singapore South Gateway (S 01°16.2', E 103°46.5')"
                        className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                          errors.location ? 'border-danger' : 'border-border'
                        } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                      />
                    </div>
                    {errors.location && (
                      <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 inline" /> {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Quay Length & Avg Utilization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Quay Length (meters) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Ruler className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="number"
                          value={formData.quayLengthMeters ?? ''}
                          onChange={(e) => handleChange('quayLengthMeters', Number(e.target.value))}
                          placeholder="2400"
                          className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                            errors.quayLengthMeters ? 'border-danger' : 'border-border'
                          } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                        />
                      </div>
                      {errors.quayLengthMeters && (
                        <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline" /> {errors.quayLengthMeters}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Average Utilization %
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Percent className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.avgUtilization ?? ''}
                          onChange={(e) => handleChange('avgUtilization', Number(e.target.value))}
                          placeholder="78"
                          className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                      {errors.avgUtilization && (
                        <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline" /> {errors.avgUtilization}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                      Facility Description & Infrastructure Notes
                    </label>
                    <div className="relative">
                      <div className="absolute top-2.5 left-3 pointer-events-none">
                        <FileText className="w-4 h-4 text-text-muted" />
                      </div>
                      <textarea
                        rows={2}
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Operational capabilities, ship size restrictions..."
                        className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* BERTH FIELDS */}
              {entityType === 'berth' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Code */}
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Berth ID / Code *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="text"
                          value={formData.code || ''}
                          onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                          placeholder="e.g. B-01"
                          className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                            errors.code ? 'border-danger' : 'border-border'
                          } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                        />
                      </div>
                      {errors.code && (
                        <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline" /> {errors.code}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Berth Status
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Activity className="w-4 h-4 text-text-muted" />
                        </div>
                        <select
                          value={formData.status || 'Available'}
                          onChange={(e) => handleChange('status', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <option value="Available">Available (success)</option>
                          <option value="Occupied">Occupied (primary)</option>
                          <option value="Maintenance">Maintenance (warning)</option>
                          <option value="Offline">Offline (danger)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                      Berth Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Anchor className="w-4 h-4 text-text-muted" />
                      </div>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="e.g. Quayside Berth 1 (North Deep)"
                        className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                          errors.name ? 'border-danger' : 'border-border'
                        } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 inline" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Assigned Terminal */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                      Terminal Assignment *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 className="w-4 h-4 text-text-muted" />
                      </div>
                      <select
                        value={formData.terminalId || ''}
                        onChange={(e) => handleChange('terminalId', e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                          errors.terminalId ? 'border-danger' : 'border-border'
                        } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                      >
                        <option value="">Select Terminal</option>
                        {terminals.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.code} — {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dimensions: Length, Depth, Max Draft */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Length (m) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Ruler className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="number"
                          value={formData.lengthMeters ?? ''}
                          onChange={(e) => handleChange('lengthMeters', Number(e.target.value))}
                          placeholder="420"
                          className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                            errors.lengthMeters ? 'border-danger' : 'border-border'
                          } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                        />
                      </div>
                      {errors.lengthMeters && (
                        <p className="text-[10px] text-danger mt-1">{errors.lengthMeters}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Depth (m) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Gauge className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.depthMeters ?? ''}
                          onChange={(e) => handleChange('depthMeters', Number(e.target.value))}
                          placeholder="16.5"
                          className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                            errors.depthMeters ? 'border-danger' : 'border-border'
                          } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                        />
                      </div>
                      {errors.depthMeters && (
                        <p className="text-[10px] text-danger mt-1">{errors.depthMeters}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Max Draft (m) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Compass className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.maxDraftMeters ?? ''}
                          onChange={(e) => handleChange('maxDraftMeters', Number(e.target.value))}
                          placeholder="15.5"
                          className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                            errors.maxDraftMeters ? 'border-danger' : 'border-border'
                          } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Vessel (optional) */}
                  <div className="pt-1 border-t border-border/40">
                    <span className="text-[11px] font-mono text-text-muted block mb-2">
                      BERTH ALLOCATION (OPTIONAL)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">
                          Assigned Vessel Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Ship className="w-4 h-4 text-text-muted" />
                          </div>
                          <input
                            type="text"
                            value={formData.currentVesselName || ''}
                            onChange={(e) => handleChange('currentVesselName', e.target.value)}
                            placeholder="e.g. MV Poseidon Express"
                            className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">
                          Vessel IMO Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Fingerprint className="w-4 h-4 text-text-muted" />
                          </div>
                          <input
                            type="text"
                            value={formData.currentVesselImo || ''}
                            onChange={(e) => handleChange('currentVesselImo', e.target.value)}
                            placeholder="IMO 9781234"
                            className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* CRANE FIELDS */}
              {entityType === 'crane' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Crane Code */}
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Crane ID / Code *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="text"
                          value={formData.code || ''}
                          onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                          placeholder="e.g. CR-101"
                          className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                            errors.code ? 'border-danger' : 'border-border'
                          } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                        />
                      </div>
                      {errors.code && (
                        <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 inline" /> {errors.code}
                        </p>
                      )}
                    </div>

                    {/* Type (STS / RTG) */}
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Crane Type
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Cpu className="w-4 h-4 text-text-muted" />
                        </div>
                        <select
                          value={formData.type || 'STS'}
                          onChange={(e) => handleChange('type', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <option value="STS">STS — Ship-to-Shore Gantry</option>
                          <option value="RTG">RTG — Rubber-Tired Gantry</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Terminal & Berth Assignment */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Assigned Terminal *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building2 className="w-4 h-4 text-text-muted" />
                        </div>
                        <select
                          value={formData.terminalId || ''}
                          onChange={(e) => handleChange('terminalId', e.target.value)}
                          className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                            errors.terminalId ? 'border-danger' : 'border-border'
                          } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                        >
                          <option value="">Select Terminal</option>
                          {terminals.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.code} — {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Assigned Berth
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Anchor className="w-4 h-4 text-text-muted" />
                        </div>
                        <select
                          value={formData.assignedBerthId || ''}
                          onChange={(e) => handleChange('assignedBerthId', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <option value="">Standby / Unassigned</option>
                          {berths.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.code} ({b.name})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Status & Efficiency Rating */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Operational Status
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Activity className="w-4 h-4 text-text-muted" />
                        </div>
                        <select
                          value={formData.status || 'Operational'}
                          onChange={(e) => handleChange('status', e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                        >
                          <option value="Operational">Operational (Green)</option>
                          <option value="Maintenance">Maintenance (Amber)</option>
                          <option value="Fault">Fault (Red Pulsing)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Efficiency Rating (1.0 to 5.0) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Star className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={formData.efficiencyRating ?? ''}
                          onChange={(e) => handleChange('efficiencyRating', Number(e.target.value))}
                          placeholder="4.8"
                          className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                            errors.efficiencyRating ? 'border-danger' : 'border-border'
                          } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                        />
                      </div>
                      {errors.efficiencyRating && (
                        <p className="text-[11px] text-danger mt-1">{errors.efficiencyRating}</p>
                      )}
                    </div>
                  </div>

                  {/* Maintenance Date & Moves Per Hour */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Last Maintenance Date *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="date"
                          value={formData.lastMaintenanceDate || ''}
                          onChange={(e) => handleChange('lastMaintenanceDate', e.target.value)}
                          className={`w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border ${
                            errors.lastMaintenanceDate ? 'border-danger' : 'border-border'
                          } focus:outline-none focus:ring-2 focus:ring-primary/40`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Moves Per Hour (Target: 30+)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Gauge className="w-4 h-4 text-text-muted" />
                        </div>
                        <input
                          type="number"
                          value={formData.movesPerHour ?? ''}
                          onChange={(e) => handleChange('movesPerHour', Number(e.target.value))}
                          placeholder="32"
                          className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Manufacturer */}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1.5">
                      Manufacturer & Specification
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Wrench className="w-4 h-4 text-text-muted" />
                      </div>
                      <input
                        type="text"
                        value={formData.manufacturer || ''}
                        onChange={(e) => handleChange('manufacturer', e.target.value)}
                        placeholder="e.g. ZPMC Super Post-Panamax"
                        className="w-full pl-9 pr-3 py-2 bg-surface-2 rounded-xl text-sm text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form Actions */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-text-secondary hover:text-text-primary text-xs font-medium transition-colors border border-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl gradient-primary text-xs font-semibold text-text-primary shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Infrastructure'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PortConfigModal;
