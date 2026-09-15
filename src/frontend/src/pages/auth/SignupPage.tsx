import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { User as UserIcon, Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { Toast, ToastType } from '@/features/auth/components/Toast';
import { useAuth } from '@/features/auth/AuthContext';
import { UserRole } from '@/features/auth/types';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedInput } from '@/components/ui/AnimatedInput';
import { GradientButton } from '@/components/ui/GradientButton';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<UserRole>('manager');
  const [agreedTerms, setAgreedTerms] = useState<boolean>(true);

  // Success state flag
  const [isProvisioned, setIsProvisioned] = useState<boolean>(false);

  // Validation errors & Shake
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [shake, setShake] = useState<boolean>(false);

  // Toast
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Password Strength Calculation (0 to 100)
  const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-transparent' };
    let score = 0;
    if (pass.length >= 8) score += 30;
    if (pass.length >= 12) score += 20;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/\d/.test(pass)) score += 25;

    if (score < 50) return { score: 35, label: 'Weak', color: 'bg-[#F87171]' };
    if (score < 80) return { score: 70, label: 'Fair', color: 'bg-[#60A5FA]' };
    return { score: 100, label: 'Strong', color: 'bg-[#34D399]' };
  };

  const strength = getPasswordStrength(password);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full legal name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Maritime email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email format.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Must contain at least 1 uppercase letter.';
    } else if (!/\d/.test(password)) {
      newErrors.password = 'Must contain at least 1 number.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreedTerms) {
      newErrors.terms = 'You must agree to Port Operations Terms.';
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
        message: 'Please resolve form requirements before submission.',
        type: 'error',
      });
      return;
    }

    try {
      const result = await signup({
        fullName,
        email,
        password,
        confirmPassword,
        role,
        company: 'Port Operator',
      });

      if (result.success) {
        setIsProvisioned(true);
        setToast({
          isVisible: true,
          message: 'Operator account provisioned successfully! Redirecting to login...',
          type: 'success',
        });
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } else {
        triggerShake();
        setToast({
          isVisible: true,
          message: result.error || 'Registration failed.',
          type: 'error',
        });
      }
    } catch {
      triggerShake();
      setToast({
        isVisible: true,
        message: 'Server error occurred during account creation.',
        type: 'error',
      });
    }
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
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const rolesList: { id: UserRole; label: string }[] = [
    { id: 'manager', label: 'Port Manager' },
    { id: 'user', label: 'Vessel Operator' },
    { id: 'admin', label: 'SysAdmin' },
  ];

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
        <GlassCard spotlight={true} hoverLift={false} className="p-6 sm:p-8 my-4">
          <AnimatePresence mode="wait">
            {isProvisioned ? (
              /* Success State Card View */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-[#34D399]/15 border border-[#34D399] flex items-center justify-center mx-auto text-[#34D399] shadow-[0_0_30px_0_rgba(52,211,153,0.4)]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-heading text-2xl font-bold text-[#E2E8F0]">
                    Operator Account Provisioned
                  </h2>
                  <p className="text-sm text-[#94A3B8] font-mono max-w-sm mx-auto">
                    Security clearance established for <span className="text-[#38BDF8]">{email}</span>. Redirecting to terminal login…
                  </p>
                </div>

                {/* Radar Spinner */}
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#38BDF8] pt-4">
                  <span className="w-4 h-4 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
                  <span>INITIALIZING CONTROL SESSION</span>
                </div>
              </motion.div>
            ) : (
              /* Registration Form View */
              <motion.div
                key="form"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >
                {/* Back Link */}
                <motion.div variants={itemVariants}>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-mono text-[#94A3B8] hover:text-[#38BDF8] transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#38BDF8] group-hover:-translate-x-1 transition-transform" />
                    <span>Back to home</span>
                  </Link>
                </motion.div>

                {/* Top Badge */}
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-3 py-1 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>PORT GATEWAY AUTH</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#94A3B8]">PORT ID: SGSIN-01</span>
                </motion.div>

                {/* Heading */}
                <motion.div variants={itemVariants} className="space-y-1">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#E2E8F0] tracking-tight">
                    Register Operator
                  </h1>
                  <p className="text-xs sm:text-sm text-[#94A3B8]">
                    Provision a new DockNova control room account.
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Full Name */}
                  <motion.div variants={itemVariants}>
                    <AnimatedInput
                      label="Full Legal Name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                      }}
                      placeholder="Capt. Alexander Vance"
                      icon={<UserIcon className="w-4 h-4" />}
                      error={errors.fullName}
                    />
                  </motion.div>

                  {/* Maritime Email */}
                  <motion.div variants={itemVariants}>
                    <AnimatedInput
                      label="Maritime Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder="vance@singaporeport.com"
                      icon={<Mail className="w-4 h-4" />}
                      error={errors.email}
                    />
                  </motion.div>

                  {/* Role Selector: Segmented Control with Sliding Indicator */}
                  <motion.div variants={itemVariants} className="space-y-1.5">
                    <label className="block text-xs font-mono text-[#94A3B8]">
                      Operational Role Clearance
                    </label>
                    <div className="relative p-1 rounded-xl bg-[#1A2A3E] border border-[rgba(56,189,248,0.2)] grid grid-cols-3 gap-1 select-none">
                      {rolesList.map((r) => {
                        const isSelected = role === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id)}
                            className={`relative z-10 py-2 text-xs font-mono rounded-lg transition-colors duration-200 text-center ${
                              isSelected ? 'text-[#0A1420] font-bold' : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeRoleIndicator"
                                className="absolute inset-0 bg-gradient-to-r from-[#38BDF8] to-[#818CF8] rounded-lg -z-10 shadow-md"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              />
                            )}
                            {r.label}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Password & Strength Meter */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <AnimatedInput
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

                    {/* Password Strength Meter */}
                    {password && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-[#94A3B8]">Strength:</span>
                          <span
                            className={
                              strength.label === 'Strong'
                                ? 'text-[#34D399] font-bold'
                                : strength.label === 'Fair'
                                ? 'text-[#60A5FA]'
                                : 'text-[#F87171]'
                            }
                          >
                            {strength.label}
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#1A2A3E] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${strength.score}%` }}
                            transition={{ duration: 0.3 }}
                            className={`h-full rounded-full ${strength.color}`}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Confirm Password */}
                  <motion.div variants={itemVariants}>
                    <AnimatedInput
                      label="Confirm Password"
                      isPassword={true}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword)
                          setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }}
                      placeholder="••••••••••••"
                      icon={<Lock className="w-4 h-4" />}
                      error={errors.confirmPassword}
                    />
                  </motion.div>

                  {/* Custom Checkbox "I agree to the Port Operations Terms" */}
                  <motion.div variants={itemVariants} className="space-y-1 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => {
                          setAgreedTerms(e.target.checked);
                          if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                        }}
                        className="sr-only"
                        aria-label="I agree to the Port Operations Terms"
                      />
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          agreedTerms
                            ? 'bg-[#38BDF8] border-[#38BDF8] text-[#0A1420]'
                            : 'bg-[#111E2E] border-[rgba(56,189,248,0.25)] group-hover:border-[#38BDF8]'
                        }`}
                      >
                        {agreedTerms && (
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
                        I agree to the Port Operations Terms
                      </span>
                    </label>
                    {errors.terms && <p className="text-xs text-[#F87171] font-mono">{errors.terms}</p>}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div variants={itemVariants} className="pt-2">
                    <GradientButton
                      type="submit"
                      variant="gradient"
                      pulseRing
                      isLoading={isLoading}
                      loadingText="Provisioning Operator Account..."
                      className="w-full !py-3.5 text-base"
                    >
                      <span>Provision Access →</span>
                      <ArrowRight className="w-4 h-4" />
                    </GradientButton>
                  </motion.div>

                  {/* Sign In Link */}
                  <motion.div variants={itemVariants} className="pt-2 text-center">
                    <p className="text-xs text-[#94A3B8]">
                      Already registered?{' '}
                      <Link
                        to="/login"
                        className="text-[#38BDF8] hover:underline font-semibold font-mono"
                      >
                        Sign in
                      </Link>
                    </p>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </AuthLayout>
  );
};

export default SignupPage;
