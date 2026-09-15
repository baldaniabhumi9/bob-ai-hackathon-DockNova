import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  isPassword?: boolean;
  containerClassName?: string;
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  (
    {
      label,
      icon,
      error,
      isPassword = false,
      containerClassName = '',
      id,
      type = 'text',
      value,
      onChange,
      onFocus,
      onBlur,
      placeholder,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <div className={`space-y-1.5 ${containerClassName}`}>
        <label
          htmlFor={inputId}
          className={`block text-xs font-mono transition-colors duration-200 ${
            isFocused ? 'text-[#38BDF8] font-semibold' : 'text-[#94A3B8]'
          }`}
        >
          {label}
        </label>

        <div className="relative group">
          {/* Leading Icon */}
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#38BDF8] transition-colors">
              {icon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`w-full ${icon ? 'pl-10' : 'pl-4'} ${
              isPassword ? 'pr-11' : 'pr-4'
            } py-2.5 rounded-xl bg-[#111E2E] border text-sm text-[#E2E8F0] placeholder:text-[#64748B]/60 transition-all outline-none shadow-inner ${
              error
                ? 'border-[#F87171] focus:ring-2 focus:ring-[#F87171]/40'
                : isFocused
                ? 'border-[#38BDF8] shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)] ring-1 ring-[#38BDF8]/50'
                : 'border-[rgba(56,189,248,0.15)] hover:border-[rgba(56,189,248,0.3)]'
            }`}
            {...props}
          />

          {/* Password Morph Eye Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#E2E8F0] focus:text-[#38BDF8] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <motion.div
                key={showPassword ? 'show' : 'hide'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-[#38BDF8]" /> : <Eye className="w-4 h-4" />}
              </motion.div>
            </button>
          )}
        </div>

        {/* Slide-in Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              id={`${inputId}-error`}
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-[#F87171] font-mono pt-0.5"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';

export default AnimatedInput;
