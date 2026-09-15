import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Mail, Lock, ArrowRight, Shield, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { Toast, ToastType } from '@/features/auth/components/Toast';
import { useAuth } from '@/features/auth/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { GradientButton } from '@/components/ui/GradientButton';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, user } = useAuth();

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const targetRoute =
        user.role === 'admin' ? '/admin' : user.role === 'user' ? '/user' : '/manager';
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [highlightEmail, setHighlightEmail] = useState<boolean>(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Validation errors & Shake state
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [shake, setShake] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid maritime email format.';
    }

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

        setIsSuccess(true);
        setToast({
          isVisible: true,
          message: `Authentication authorized as ${userRole.toUpperCase()}. Launching Console...`,
          type: 'success',
        });
        setTimeout(() => {
          navigate(targetRoute, { replace: true });
        }, 800);
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

  // Quick Demo fill pill handler
  const fillDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('Maritime2026!');
    setErrors({});

    // Soft highlight flash on email field
    setHighlightEmail(true);
    setTimeout(() => setHighlightEmail(false), 600);

    // Auto focus password field
    setTimeout(() => {
      const passInput = document.getElementById('input-access-password');
      if (passInput) (passInput as HTMLInputElement).focus();
    }, 100);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
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
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : undefined}
        transition={shake ? { duration: 0.4 } : undefined}
      >
        <GlassCard spotlight={true} hoverLift={false} className="p-6 sm:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Back to Home Link with Arrow Hover Slide */}
            <motion.div variants={itemVariants}>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#38BDF8] transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#38BDF8] group-hover:-translate-x-1 transition-transform" />
                <span>Back to home</span>
              </Link>
            </motion.div>

            {/* Top Shield Badge & Port ID */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-3 py-1 rounded-md">
                <Shield className="w-3.5 h-3.5" />
                <span>PORT GATEWAY AUTH</span>
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8]">PORT ID: SGSIN-01</span>
            </motion.div>

            {/* Blur-Rise Heading Entrance */}
            <motion.div variants={itemVariants} className="space-y-1">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#E2E8F0] tracking-tight">
                Control Room Login
              </h1>
              <p className="text-sm text-[#94A3B8]">
                Enter credentials to access DockNova operations terminal.
              </p>
            </motion.div>

            {/* Quick Demo Presets Row */}
            <motion.div
              variants={itemVariants}
              className="p-3 rounded-xl bg-[#1A2A3E]/70 border border-[rgba(56,189,248,0.2)] select-none"
            >
              <div className="text-[11px] font-mono text-[#94A3B8] mb-2 flex items-center justify-between">
                <span>QUICK DEMO PRESETS:</span>
                <span className="text-[#38BDF8] font-sans font-medium">Pass: Maritime2026!</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('captain@docknova.com')}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-[#111E2E] hover:bg-[#38BDF8]/20 hover:text-[#38BDF8] hover:border-[#38BDF8]/50 transition-all text-[#94A3B8] border border-[rgba(56,189,248,0.15)]"
                >
                  Manager
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('operator@docknova.com')}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-[#111E2E] hover:bg-[#38BDF8]/20 hover:text-[#38BDF8] hover:border-[#38BDF8]/50 transition-all text-[#94A3B8] border border-[rgba(56,189,248,0.15)]"
                >
                  Vessel Operator
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin@docknova.com')}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-[#111E2E] hover:bg-[#38BDF8]/20 hover:text-[#38BDF8] hover:border-[#38BDF8]/50 transition-all text-[#94A3B8] border border-[rgba(56,189,248,0.15)]"
                >
                  SysAdmin
                </button>
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Field with Highlight Flash */}
              <motion.div variants={itemVariants}>
                <div className={highlightEmail ? 'ring-2 ring-[#38BDF8] rounded-xl transition-all duration-300' : ''}>
                  <AnimatedInput
                    label="Maritime Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="captain@docknova.com"
                    icon={<Mail className="w-4 h-4" />}
                    error={errors.email}
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <AnimatedInput
                  ref={passwordRef as any}
                  label="Access Password"
                  isPassword={true}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  error={errors.password}
                />
              </motion.div>

              {/* Custom Animated Checkbox "Remember this terminal" & Forgot Access Key */}
              <motion.div variants={itemVariants} className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                    aria-label="Remember this terminal"
                  />
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      rememberMe
                        ? 'bg-[#38BDF8] border-[#38BDF8] text-[#0A1420]'
                        : 'bg-[#111E2E] border-[rgba(56,189,248,0.25)] group-hover:border-[#38BDF8]'
                    }`}
                  >
                    {rememberMe && (
                      <motion.svg
                        initial={{ scale: 0, pathLength: 0 }}
                        animate={{ scale: 1, pathLength: 1 }}
                        transition={{ duration: 0.2 }}
                        className="w-3 h-3 text-[#0A1420]"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2.5 6L5 8.5L9.5 3.5" />
                      </motion.svg>
                    )}
                  </div>
                  <span className="text-xs text-[#94A3B8] font-mono group-hover:text-[#E2E8F0] transition-colors">
                    Remember this terminal
                  </span>
                </label>

                <span className="text-xs font-mono text-[#94A3B8] hover:text-[#38BDF8] transition-colors cursor-pointer">
                  Forgot access key?
                </span>
              </motion.div>

              {/* Submit Button with Loading Radar & Success Flash */}
              <motion.div variants={itemVariants} className="pt-2">
                <GradientButton
                  type="submit"
                  variant="gradient"
                  pulseRing
                  isLoading={isLoading}
                  loadingText="Verifying Maritime Clearance..."
                  isSuccess={isSuccess}
                  successText="Terminal Clearance Granted!"
                  className="w-full !py-3.5 text-base"
                >
                  <span>Authorize & Enter Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </GradientButton>
              </motion.div>

              {/* Footer Link */}
              <motion.div variants={itemVariants} className="pt-2 text-center">
                <p className="text-xs text-[#94A3B8]">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-[#38BDF8] hover:underline font-semibold font-mono"
                  >
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </form>
          </motion.div>
        </GlassCard>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginPage;
