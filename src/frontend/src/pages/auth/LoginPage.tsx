import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, Anchor } from 'lucide-react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { Toast, ToastType } from '@/features/auth/components/Toast';
import { useAuth } from '@/features/auth/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  // Validation errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [shake, setShake] = useState<boolean>(false);

  // Toast state
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid maritime email format.';
    }

    // Password validation: min 8 chars, 1 uppercase, 1 number
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter.';
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Password must contain at least 1 number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      triggerShake();
      setToast({
        isVisible: true,
        message: 'Please resolve input validation errors.',
        type: 'error',
      });
      return;
    }

    try {
      const result = await login({ email, password, rememberMe });
      if (result.success && result.user) {
        const userRole = result.user.role;
        const targetRoute =
          userRole === 'admin' ? '/admin' : userRole === 'user' ? '/user' : '/manager';

        setToast({
          isVisible: true,
          message: `Authentication authorized as ${userRole.toUpperCase()}. Launching Console...`,
          type: 'success',
        });
        setTimeout(() => {
          navigate(targetRoute, { replace: true });
        }, 600);
      } else {
        triggerShake();
        setToast({
          isVisible: true,
          message: result.error || 'Authentication rejected by security gateway.',
          type: 'error',
        });
      }
    } catch {
      triggerShake();
      setToast({
        isVisible: true,
        message: 'Unexpected communication error with security server.',
        type: 'error',
      });
    }
  };

  // Demo helper for quick testing
  const fillDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('Maritime2026!');
    setErrors({});
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <AuthLayout>
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : 'visible'}
        transition={shake ? { duration: 0.4 } : undefined}
        className="w-full bg-surface-1 border border-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative"
      >
        {/* Top security badge */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-md">
            <Shield className="w-3.5 h-3.5" />
            <span>PORT GATEWAY AUTH</span>
          </div>
          <span className="text-[11px] font-mono text-text-muted">PORT ID: SGSIN-01</span>
        </motion.div>

        {/* Heading */}
        <motion.div variants={itemVariants} className="space-y-1 mb-6">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Control Room Login
          </h1>
          <p className="text-sm text-text-secondary">
            Enter credentials to access DockNova operations terminal.
          </p>
        </motion.div>

        {/* Quick Demo Fill Pills */}
        <motion.div variants={itemVariants} className="mb-6 p-2.5 rounded-lg bg-surface-2/60 border border-border/80">
          <div className="text-[11px] font-mono text-text-muted mb-1.5 flex items-center justify-between">
            <span>QUICK DEMO PRESETS:</span>
            <span className="text-primary font-sans">Pass: Maritime2026!</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => fillDemo('captain@docknova.com')}
              className="text-xs px-2.5 py-1 rounded bg-surface-3 hover:bg-primary/20 hover:text-primary transition-colors text-text-secondary border border-border/60"
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => fillDemo('operator@docknova.com')}
              className="text-xs px-2.5 py-1 rounded bg-surface-3 hover:bg-primary/20 hover:text-primary transition-colors text-text-secondary border border-border/60"
            >
              Vessel Operator
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@docknova.com')}
              className="text-xs px-2.5 py-1 rounded bg-surface-3 hover:bg-primary/20 hover:text-primary transition-colors text-text-secondary border border-border/60"
            >
              SysAdmin
            </button>
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Field */}
          <motion.div variants={itemVariants} className="space-y-1.5">
            <label htmlFor="login-email" className="block text-xs font-medium text-text-secondary">
              Maritime Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="captain@docknova.com"
                aria-label="Maritime Email Address"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-2 border text-sm text-text-primary placeholder:text-text-muted/60 transition-all outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#050B14] ${
                  errors.email ? 'border-danger focus:ring-danger/50' : 'border-border focus:border-primary'
                }`}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-xs text-danger mt-1">
                {errors.email}
              </p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="block text-xs font-medium text-text-secondary">
                Access Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••••••"
                aria-label="Access Password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`w-full pl-10 pr-11 py-2.5 rounded-lg bg-surface-2 border text-sm text-text-primary placeholder:text-text-muted/60 transition-all outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#050B14] ${
                  errors.password ? 'border-danger focus:ring-danger/50' : 'border-border focus:border-primary'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-xs text-danger mt-1">
                {errors.password}
              </p>
            )}
          </motion.div>

          {/* Remember Me Checkbox */}
          <motion.div variants={itemVariants} className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only"
                aria-label="Remember this console terminal"
              />
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  rememberMe
                    ? 'bg-primary border-primary text-base'
                    : 'bg-surface-2 border-border hover:border-text-muted'
                }`}
              >
                {rememberMe && (
                  <svg className="w-3 h-3 text-base" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2.5 6L5 8.5L9.5 3.5" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-text-secondary">Remember this terminal</span>
            </label>

            <span className="text-xs text-text-muted hover:text-primary transition-colors cursor-pointer">
              Forgot access key?
            </span>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-primary text-base font-semibold py-3 px-4 rounded-lg shadow-glow-primary transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-base border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Maritime Clearance...</span>
                </>
              ) : (
                <>
                  <span>Authorize & Enter Terminal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Footer Link */}
          <motion.div variants={itemVariants} className="pt-3 text-center">
            <p className="text-xs text-text-secondary">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary hover:text-primary font-medium inline-block relative group"
              >
                Sign up
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </AuthLayout>
  );
};
