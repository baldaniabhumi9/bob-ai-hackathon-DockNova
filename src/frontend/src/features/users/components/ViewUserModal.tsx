import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Mail, Building, Calendar, Key, User } from 'lucide-react';
import { ManagedUser } from '../types';

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ManagedUser | null;
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  onClose,
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

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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
          className="relative w-full max-w-md rounded-2xl bg-surface-1 border border-subtle p-6 shadow-2xl z-10 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-subtle pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface-2 border border-primary/40 flex items-center justify-center font-bold text-primary text-base shadow-sm">
                {initials}
              </div>
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-text-primary">
                  {user.name}
                </h3>
                <p className="text-xs text-text-muted">{user.title || user.company}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details List */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-subtle">
              <span className="text-text-muted flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email</span>
              </span>
              <span className="font-mono text-text-primary font-semibold">{user.email}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-subtle">
              <span className="text-text-muted flex items-center gap-2">
                <Building className="w-4 h-4 text-secondary" />
                <span>Organization</span>
              </span>
              <span className="text-text-primary font-semibold">{user.company}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-subtle">
              <span className="text-text-muted flex items-center gap-2">
                <User className="w-4 h-4 text-accent" />
                <span>Assigned Role</span>
              </span>
              <span className="font-mono font-bold uppercase text-primary">
                {user.role === 'manager'
                  ? 'Port Operations Manager'
                  : user.role === 'admin'
                  ? 'System Administrator'
                  : 'Vessel Operator'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-subtle">
              <span className="text-text-muted flex items-center gap-2">
                <Key className="w-4 h-4 text-success" />
                <span>MFA Protection</span>
              </span>
              <span className="text-success font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{user.mfaStatus || 'Enforced Hardware Key'}</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-2 border border-subtle">
              <span className="text-text-muted flex items-center gap-2">
                <Calendar className="w-4 h-4 text-text-muted" />
                <span>Provisioned Date</span>
              </span>
              <span className="font-mono text-text-secondary">{user.createdAt}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-subtle flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-subtle text-xs font-semibold text-text-primary transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
