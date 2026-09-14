import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCheck, AlertCircle, Shield } from 'lucide-react';
import { ManagedUser, UserRole, UserStatus } from '../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<ManagedUser>) => void;
  initialUser?: ManagedUser | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialUser,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<UserStatus>('active');
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name);
      setEmail(initialUser.email);
      setRole(initialUser.role);
      setCompany(initialUser.company);
      setStatus(initialUser.status);
      setTitle(initialUser.title || '');
    } else {
      setName('');
      setEmail('');
      setRole('user');
      setCompany('');
      setStatus('active');
      setTitle('');
    }
    setErrors({});
  }, [initialUser, isOpen]);

  // Focus input and listen for ESC key
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => nameInputRef.current?.focus(), 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email format';
    }
    if (!company.trim()) errs.company = 'Company or port authority is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...(initialUser ? { id: initialUser.id } : {}),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      company: company.trim(),
      status,
      title: title.trim() || undefined,
      lastActive: initialUser ? initialUser.lastActive : 'Just now',
    });
    onClose();
  };

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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-2xl bg-surface-1 border border-subtle p-6 sm:p-8 shadow-2xl z-10 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-subtle pb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-text-primary">
                {initialUser ? 'Edit User Credentials' : 'Add New Platform User'}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                {initialUser
                  ? 'Update role permissions and operational company'
                  : 'Provision account for carrier operator or port authority staff'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Capt. Vance Alexander"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-all ${
                  errors.name ? 'border-danger focus:ring-1 focus:ring-danger' : 'border-subtle focus:border-primary/60'
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. captain@docknova.com"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-all ${
                  errors.email ? 'border-danger focus:ring-1 focus:ring-danger' : 'border-subtle focus:border-primary/60'
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Role & Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Role Select */}
              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                  Assigned Role <span className="text-danger">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-subtle text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary/60 cursor-pointer"
                >
                  <option value="user">Vessel Operator (Carrier)</option>
                  <option value="manager">Port Manager (Harbor Master)</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                  Account Status <span className="text-danger">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-subtle text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary/60 cursor-pointer"
                >
                  <option value="active">Active (Full Access)</option>
                  <option value="pending">Pending Verification</option>
                  <option value="inactive">Inactive (Suspended)</option>
                </select>
              </div>
            </div>

            {/* Company / Port Authority */}
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Company / Organization <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Maersk Line, PSA Singapore, CMA CGM"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-all ${
                  errors.company ? 'border-danger focus:ring-1 focus:ring-danger' : 'border-subtle focus:border-primary/60'
                }`}
              />
              {errors.company && (
                <p className="text-[11px] text-danger mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.company}</span>
                </p>
              )}
            </div>

            {/* Operational Title */}
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Operational Title <span className="text-text-muted text-[10px] lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Berthing Logistics Controller"
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-subtle text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-subtle">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-surface-2 hover:bg-surface-3 border border-subtle text-xs font-semibold text-text-muted hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl gradient-primary text-xs sm:text-sm font-semibold text-text-primary shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
              >
                {initialUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
