import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  const config = {
    success: {
      bg: 'bg-surface-2/95 border-[#34D399]/40',
      icon: <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />,
      title: 'Success',
      shadow: 'shadow-[0_0_20px_-2px_rgba(52,211,153,0.3)]',
    },
    error: {
      bg: 'bg-surface-2/95 border-[#F87171]/40',
      icon: <XCircle className="w-5 h-5 text-danger flex-shrink-0" />,
      title: 'System Notice',
      shadow: 'shadow-[0_0_20px_-2px_rgba(248,113,113,0.3)]',
    },
    warning: {
      bg: 'bg-surface-2/95 border-[#FBBF24]/40',
      icon: <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />,
      title: 'Attention',
      shadow: 'shadow-[0_0_20px_-2px_rgba(251,191,36,0.3)]',
    },
  }[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-6 right-6 z-50 max-w-sm w-full"
          role="status"
          aria-live="polite"
        >
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md ${config.bg} ${config.shadow} text-primary`}
          >
            {config.icon}
            <div className="flex-1 text-sm">
              <div className="font-semibold text-text-primary mb-0.5">{config.title}</div>
              <div className="text-text-secondary leading-relaxed">{message}</div>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
