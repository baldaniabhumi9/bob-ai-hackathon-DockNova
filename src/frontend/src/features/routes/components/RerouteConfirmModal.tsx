import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  X,
  FileDown,
  ArrowRight,
  Radio,
  Clock,
  MapPin,
  Ship,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { AlternatePortOption, RoutingVessel } from '../mockRouteData';

interface RerouteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  vessel: RoutingVessel;
  option: AlternatePortOption;
  onReturnToRadar: () => void;
}

export const RerouteConfirmModal: React.FC<RerouteConfirmModalProps> = ({
  isOpen,
  onClose,
  vessel,
  option,
  onReturnToRadar,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-base/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-2xl bg-surface-1 border border-border/80 shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden z-10"
        >
          {/* Subtle success background gradient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-success/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Icon + Title */}
          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center text-success shadow-glow-success/30">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-success font-semibold">
                Authorization Dispatched
              </span>
              <h3 className="font-heading text-2xl font-bold text-text-primary">
                Reroute Request Transmitted
              </h3>
              <p className="text-xs text-text-secondary max-w-sm">
                Reroute request sent to Port Manager and Terminal Operations. AIS telemetry waypoint updated.
              </p>
            </div>
          </div>

          {/* Key Details Card */}
          <div className="p-4 rounded-xl bg-surface-2/80 border border-border/80 space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <span className="text-text-muted">Request Reference ID:</span>
              <span className="text-primary font-bold">REQ-RR-88219</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted">Target Vessel:</span>
              <span className="text-text-primary font-semibold">{vessel.name} (IMO {vessel.imo})</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted">New Destination:</span>
              <span className="text-success font-semibold flex items-center gap-1.5">
                <span>{option.flag}</span>
                <span>{option.name}</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted">Updated ETA:</span>
              <span className="text-secondary font-semibold">{option.eta}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted">Berth Reservation:</span>
              <span className="text-text-primary font-semibold">{option.reservedBerth}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60">
              <span className="text-text-muted">VTS Comms Channel:</span>
              <span className="text-primary font-semibold">{option.vhfChannel}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-gradient-primary text-white font-semibold text-xs font-mono uppercase tracking-wider shadow-glow-primary hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Digital Voyage Order</span>
            </button>

            <button
              type="button"
              onClick={onReturnToRadar}
              className="w-full py-2.5 px-4 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Ship className="w-4 h-4 text-secondary" />
              <span>Return to Fleet Radar</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
