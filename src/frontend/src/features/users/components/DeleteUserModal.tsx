import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { ManagedUser } from '../types';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: ManagedUser | null;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
}) => {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-2xl bg-surface-1 border border-danger/30 p-6 shadow-2xl z-10 space-y-5"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-danger/10 text-danger shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-text-primary">
                Confirm User Deletion
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Are you sure you want to revoke and delete{' '}
                <strong className="text-text-primary">{user.name}</strong> ({user.email})?
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-danger/5 border border-danger/20 text-[11px] text-danger font-mono">
            ⚠️ Warning: This action cannot be undone. All active sessions, AIS API keys, and port allocation permissions will be immediately invalidated.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-subtle text-xs font-semibold text-text-muted hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-danger hover:bg-danger/90 text-text-primary text-xs font-semibold shadow-glow-danger transition-all duration-150"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete User</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
