import React, { useRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface GradientButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'gradient' | 'glass' | 'outline' | 'success';
  isLoading?: boolean;
  loadingText?: string;
  isSuccess?: boolean;
  successText?: string;
  pulseRing?: boolean;
  magnetic?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'gradient',
  isLoading = false,
  loadingText = 'Processing...',
  isSuccess = false,
  successText = 'Authorized!',
  pulseRing = false,
  magnetic = true,
  className = '',
  type = 'button',
  onClick,
  disabled,
  ...motionProps
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [magneticOffset, setMagneticOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // Magnetic hover handler
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || window.innerWidth < 768 || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.15;
    const distanceY = (e.clientY - centerY) * 0.15;
    setMagneticOffset({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  // Click ripple handler
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };
      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }
    if (onClick) onClick(e);
  };

  // Base styling per variant
  let variantStyles = 'bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#818CF8] text-[#0A1420] font-bold shadow-[0_0_20px_-3px_rgba(56,189,248,0.4)] hover:shadow-[0_0_25px_0_rgba(56,189,248,0.6)]';
  if (variant === 'glass') {
    variantStyles = 'bg-[#111E2E]/90 hover:bg-[#1A2A3E] text-[#E2E8F0] border border-[rgba(56,189,248,0.3)] hover:border-[#38BDF8] backdrop-blur-md';
  } else if (variant === 'outline') {
    variantStyles = 'bg-transparent text-[#38BDF8] border border-[#38BDF8]/60 hover:bg-[#38BDF8]/10 hover:border-[#38BDF8]';
  } else if (variant === 'success' || isSuccess) {
    variantStyles = 'bg-gradient-to-r from-[#34D399] to-[#059669] text-[#0A1420] font-bold shadow-[0_0_20px_-3px_rgba(52,211,153,0.5)]';
  }

  return (
    <div className="relative inline-block w-full sm:w-auto">
      {/* Pulse ring highlight */}
      {pulseRing && !disabled && !isLoading && (
        <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#818CF8] opacity-40 blur-md animate-pulse pointer-events-none" />
      )}

      <motion.button
        ref={buttonRef}
        type={type}
        disabled={disabled || isLoading}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        animate={{ x: magneticOffset.x, y: magneticOffset.y }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-200 outline-none focus:ring-2 focus:ring-[#38BDF8]/60 focus:ring-offset-2 focus:ring-offset-[#0A1420] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden ${variantStyles} ${className}`}
        {...motionProps}
      >
        {/* Click Ripples */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full bg-white/30 pointer-events-none animate-ping"
            style={{
              left: r.x - 20,
              top: r.y - 20,
              width: 40,
              height: 40,
            }}
          />
        ))}

        {/* Content States */}
        {isLoading ? (
          <span className="inline-flex items-center gap-2 font-mono">
            {/* Radar Spinner */}
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{loadingText}</span>
          </span>
        ) : isSuccess ? (
          <span className="inline-flex items-center gap-2 font-mono text-[#0A1420]">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{successText}</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    </div>
  );
};

export default GradientButton;
