import React from 'react';
import { motion } from 'framer-motion';
import { UserStatus } from '../types';

interface StatusToggleSwitchProps {
  status: UserStatus;
  onToggle: (newStatus: UserStatus) => void;
  disabled?: boolean;
}

export const StatusToggleSwitch: React.FC<StatusToggleSwitchProps> = ({
  status,
  onToggle,
  disabled = false,
}) => {
  const isActive = status === 'active';
  const isPending = status === 'pending';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onToggle(isActive ? 'inactive' : 'active');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        disabled={disabled}
        onClick={handleClick}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          isActive
            ? 'bg-success shadow-glow-success/30'
            : isPending
            ? 'bg-warning/70'
            : 'bg-surface-3'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="sr-only">Toggle user active status</span>
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform ${
            isActive ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>

      <span
        className={`text-xs font-mono font-medium ${
          isActive
            ? 'text-success'
            : isPending
            ? 'text-warning'
            : 'text-text-muted'
        }`}
      >
        {status.toUpperCase()}
      </span>
    </div>
  );
};
