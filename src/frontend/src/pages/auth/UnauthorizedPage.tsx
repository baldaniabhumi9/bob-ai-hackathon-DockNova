import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Anchor, Lock } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const handleReturnToDashboard = () => {
    const targetDashboard = role === 'admin' ? '/admin' : role === 'user' ? '/user' : '/manager';
    navigate(targetDashboard);
  };

  return (
    <div className="min-h-screen bg-base text-text-primary flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient red/warning radial aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(248, 113, 113, 0.5) 0%, transparent 70%)',
        }}
      />

      {/* Subtle radar rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-danger/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-danger/15 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg bg-surface-1 border border-border rounded-2xl p-8 sm:p-10 shadow-2xl relative z-10 text-center"
      >
        {/* Top security clearance badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger/10 border border-danger/30 text-xs font-mono text-danger mb-6">
          <Lock className="w-3.5 h-3.5" />
          <span>SECURITY PROTOCOL 403 • FORBIDDEN</span>
        </div>

        {/* Large ShieldAlert illustration */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-surface-2 border border-danger/30 shadow-[0_0_30px_-5px_rgba(248,113,113,0.3)] flex items-center justify-center" />
          <ShieldAlert className="w-12 h-12 text-danger relative z-10 animate-pulse" />
        </div>

        {/* Heading */}
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-3">
          Access Denied
        </h1>

        {/* Explanation */}
        <p className="text-sm text-text-secondary leading-relaxed mb-6">
          Your maritime security token lacks authorized operational clearance for this console corridor.
          {user && (
            <span className="block mt-2 font-mono text-xs text-text-muted bg-surface-2/60 p-2 rounded-lg border border-border/60">
              Authenticated: <span className="text-text-primary">{user.email}</span> &bull; Current Role:{' '}
              <span className="text-warning uppercase font-semibold">{user.role}</span>
            </span>
          )}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={handleReturnToDashboard}
            className="px-5 py-3 rounded-lg bg-gradient-primary text-base font-semibold text-sm shadow-glow-primary hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Anchor className="w-4 h-4" />
            <span>Return to My Console</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-5 py-3 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border text-sm text-text-secondary hover:text-text-primary transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Switch Account</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
