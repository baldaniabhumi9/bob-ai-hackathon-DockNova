import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Copy, Check, Clock, User, Globe, Code, FileText } from 'lucide-react';
import { AuditLogEntry } from '../types';
import { getActionBadgeClass, renderSeverityBadge } from './AuditTable';

interface AuditDetailsModalProps {
  log: AuditLogEntry | null;
  onClose: () => void;
}

export const AuditDetailsModal: React.FC<AuditDetailsModalProps> = ({ log, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!log) return null;

  const handleCopyHash = () => {
    if (log.hash) {
      navigator.clipboard.writeText(log.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-2xl bg-surface-1 border border-subtle shadow-2xl overflow-hidden z-10 space-y-0"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-subtle bg-surface-2/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-text-primary">
                    Log Entry #{log.id}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getActionBadgeClass(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5 font-mono">{log.timestamp}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-subtle text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface-2/50 border border-subtle space-y-1">
                <div className="text-text-muted flex items-center gap-1.5 text-[11px]">
                  <User className="w-3.5 h-3.5 text-accent" />
                  <span>Actor / User</span>
                </div>
                <div className="font-semibold text-text-primary">{log.user.name}</div>
                <div className="text-[11px] text-text-muted">{log.user.email}</div>
              </div>

              <div className="p-3 rounded-xl bg-surface-2/50 border border-subtle space-y-1">
                <div className="text-text-muted flex items-center gap-1.5 text-[11px]">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>IP & Security</span>
                </div>
                <div className="font-semibold text-text-primary">{log.ipAddress}</div>
                <div className="mt-1">{renderSeverityBadge(log.severity)}</div>
              </div>
            </div>

            {/* Target Entity */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-accent" /> Target Entity
              </label>
              <div className="p-3 rounded-xl bg-surface-2/60 border border-subtle font-semibold text-xs text-text-primary">
                {log.entity}
              </div>
            </div>

            {/* Full Details Narrative */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-semibold">
                Event Description & Context
              </label>
              <div className="p-3.5 rounded-xl bg-surface-2/60 border border-subtle text-xs text-text-secondary leading-relaxed">
                {log.fullDetails || log.details}
              </div>
            </div>

            {/* JSON Metadata Payload */}
            {log.metadata && (
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-text-muted font-semibold flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-accent" /> Event Metadata (JSON)
                </label>
                <pre className="p-3.5 rounded-xl bg-surface-2/80 border border-subtle font-mono text-[11px] text-accent overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* Cryptographic Hash Verification */}
            {log.hash && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="space-y-0.5">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Cryptographic Ledger Hash
                  </div>
                  <div className="text-text-secondary text-[11px] break-all">{log.hash}</div>
                </div>
                <button
                  onClick={handleCopyHash}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-text-primary border border-subtle text-[11px] transition-colors shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-text-muted" />
                      <span>Copy Hash</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-subtle bg-surface-2/40 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-text-primary border border-subtle transition-colors"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
