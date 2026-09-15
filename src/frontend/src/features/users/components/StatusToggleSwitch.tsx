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
    e.preventDefault();
    if (disabled) return;
    onToggle(isActive ? 'inactive' : 'active');
  };

  return (
    <div
      onClick={handleClick}
      title={disabled ? undefined : `Click to switch status (currently ${status})`}
      className={`inline-flex items-center gap-2 select-none cursor-pointer group ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          isActive
            ? 'bg-success shadow-glow-success/30'
            : isPending
            ? 'bg-warning/70'
            : 'bg-surface-3'
        }`}
      >
        <span className="sr-only">Toggle user active status</span>
        <motion.span
          animate={{ x: isActive ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md"
        />
      </button>

      <span
        className={`text-xs font-mono font-bold transition-colors ${
          isActive
            ? 'text-success group-hover:text-success/80'
            : isPending
            ? 'text-warning group-hover:text-warning/80'
            : 'text-text-muted group-hover:text-text-secondary'
        }`}
      >
        {status.toUpperCase()}
      </span>
    </div>
  );
};

