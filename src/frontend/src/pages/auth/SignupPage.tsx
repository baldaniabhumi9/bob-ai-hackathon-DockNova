import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Building, ChevronDown, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { PasswordStrengthBar } from '@/features/auth/components/PasswordStrengthBar';
import { Toast, ToastType } from '@/features/auth/components/Toast';
import { useAuth } from '@/features/auth/AuthContext';
import { UserRole } from '@/features/auth/types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<UserRole>('manager');
  const [company, setCompany] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Errors & Shake
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    company?: string;
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

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmation password is required.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!company.trim()) {
      newErrors.company = 'Company or shipping line name is required.';
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
        company,
      });

      if (result.success) {
        setToast({
          isVisible: true,
          message: 'Account provisioned successfully! Proceeding to Role Verification...',
          type: 'success',
        });
        setTimeout(() => {
          navigate('/select-role');
        }, 800);
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
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
        className="w-full bg-surface-1 border border-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative my-4"
      >
        {/* Top security tag */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPERATOR ENROLLMENT</span>
          </div>
          <span className="text-[11px] font-mono text-text-muted">NEW CREDENTIALS</span>
        </motion.div>

        {/* Heading */}
        <motion.div variants={itemVariants} className="space-y-1 mb-5">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Join DockNova
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Register your maritime terminal or carrier operations team.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {/* Full Name */}
          <motion.div variants={itemVariants} className="space-y-1">
            <label htmlFor="signup-name" className="block text-xs font-medium text-text-secondary">
              Full Legal Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                id="signup-name"
                name="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                placeholder="Capt. Alexander Vance"
                aria-label="Full Legal Name"
                aria-invalid={!!errors.fullName}
                className={`w-full pl-10 pr-4 py-2 rounded-lg bg-surface-2 border text-sm text-text-primary placeholder:text-text-muted/60 transition-all outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#050B14] ${
                  errors.fullName ? 'border-danger focus:ring-danger/50' : 'border-border focus:border-primary'
                }`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-danger">{errors.fullName}</p>}
          </motion.div>

          {/* Email */}
          <motion.div variants={itemVariants} className="space-y-1">
            <label htmlFor="signup-email" className="block text-xs font-medium text-text-secondary">
              Corporate / Port Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="signup-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="vance@singaporeport.com"
                aria-label="Corporate Email"
                aria-invalid={!!errors.email}
                className={`w-full pl-10 pr-4 py-2 rounded-lg bg-surface-2 border text-sm text-text-primary placeholder:text-text-muted/60 transition-all outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#050B14] ${
                  errors.email ? 'border-danger focus:ring-danger/50' : 'border-border focus:border-primary'
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
          </motion.div>

          {/* Company & Role Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Company */}
            <div className="space-y-1">
              <label htmlFor="signup-company" className="block text-xs font-medium text-text-secondary">
                Company / Carrier
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <Building className="w-4 h-4" />
                </div>
                <input
                  id="signup-company"
                  name="company"
                  type="text"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }));
                  }}
                  placeholder="Maersk / PSA"
                  aria-label="Company or Shipping Line"
                  aria-invalid={!!errors.company}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg bg-surface-2 border text-sm text-text-primary placeholder:text-text-muted/60 transition-all outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#050B14] ${
                    errors.company ? 'border-danger' : 'border-border focus:border-primary'
                  }`}
                />
              </div>
              {errors.company && <p className="text-xs text-danger">{errors.company}</p>}
            </div>

            {/* Role Dropdown */}
            <div className="space-y-1">
              <label htmlFor="signup-role" className="block text-xs font-medium text-text-secondary">
                Operational Role
              </label>
              <div className="relative">
                <select
                  id="signup-role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  aria-label="Operational Role"
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-sm text-text-primary transition-all outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#050B14] focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="manager" className="bg-surface-2 text-text-primary">
                    Port Manager
                  </option>
                  <option value="user" className="bg-surface-2 text-text-primary">
                    Vessel Operator (User)
                  </option>
                  <option value="admin" className="bg-surface-2 text-text-primary">
                    System Admin
                  </option>
                </select>
                <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Password */}
          <motion.div variants={itemVariants} className="space-y-1">
            <label htmlFor="signup-password" className="block text-xs font-medium text-text-secondary">
              Password (Min 8 chars, 1 uppercase, 1 number)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••••••"
                aria-label="Password"
                aria-invalid={!!errors.password}
                className={`w-full pl-10 pr-11 py-2 rounded-lg bg-surface-2 border text-sm text-text-primary placeholder:text-text-muted/60 transition-all outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#050B14] ${
                  errors.password ? 'border-danger' : 'border-border focus:border-primary'
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
            <PasswordStrengthBar password={password} />
            {errors.password && <p className="text-xs text-danger">{errors.password}</p>}
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={itemVariants} className="space-y-1">
            <label htmlFor="signup-confirm-password" className="block text-xs font-medium text-text-secondary">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                placeholder="••••••••••••"
                aria-label="Confirm Password"
                aria-invalid={!!errors.confirmPassword}
                className={`w-full pl-10 pr-11 py-2 rounded-lg bg-surface-2 border text-sm text-text-primary placeholder:text-text-muted/60 transition-all outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-[#050B14] ${
                  errors.confirmPassword ? 'border-danger' : 'border-border focus:border-primary'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-danger">{errors.confirmPassword}</p>
            )}
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
                  <span>Provisioning Secure Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Login Link */}
          <motion.div variants={itemVariants} className="pt-2 text-center">
            <p className="text-xs text-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary font-medium inline-block relative group"
              >
                Log in
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            </p>
          </motion.div>
        </form>
      </motion.div>
    </AuthLayout>
  );
};
