import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Anchor, Ship, Sliders, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { useAuth } from '@/features/auth/AuthContext';
import { UserRole } from '@/features/auth/types';

interface RoleOption {
  id: UserRole;
  title: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
  route: string;
  highlights: string[];
}

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { role: currentRole, setRole, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole || 'manager');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  const roles: RoleOption[] = [
    {
      id: 'manager',
      title: 'Port Operations Manager',
      badge: 'Control Tower Access',
      icon: <Anchor className="w-6 h-6 text-primary" />,
      description: 'Harbor master suite: berth allocation, quay cranes, 72h congestion prediction, and AI copilot.',
      route: '/manager',
      highlights: ['72h AI Congestion Engine', 'Quay Crane Dispatch', 'What-If Simulation'],
    },
    {
      id: 'user',
      title: 'Vessel Operator (Carrier)',
      badge: 'Fleet & Cargo Portal',
      icon: <Ship className="w-6 h-6 text-secondary" />,
      description: 'Carrier operations: port call scheduling, berth booking requests, live ETA, and manifest handling.',
      route: '/user',
      highlights: ['Vessel Berth Booking', 'Real-Time ETA Radar', 'Cargo Manifest Status'],
    },
    {
      id: 'admin',
      title: 'System Administrator',
      badge: 'Infrastructure Security',
      icon: <Sliders className="w-6 h-6 text-accent" />,
      description: 'Terminal operating system admin: nodes, API telemetry, security policies, and user permissions.',
      route: '/admin',
      highlights: ['Node Cluster Health', 'Audit Log Encryption', 'Role-Based Access'],
    },
  ];

  const handleSelectRole = (roleId: UserRole) => {
    setSelectedRole(roleId);
    setRole(roleId);
  };

  const handleContinue = () => {
    setIsNavigating(true);
    const target = roles.find((r) => r.id === selectedRole);
    setTimeout(() => {
      navigate(target ? target.route : '/manager');
    }, 400);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <AuthLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full bg-surface-1 border border-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative"
      >
        {/* Top security tag */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-md">
            <Shield className="w-3.5 h-3.5" />
            <span>TERMINAL CLEARANCE LEVEL</span>
          </div>
          {user && (
            <span className="text-[11px] font-mono text-text-secondary truncate max-w-[160px]">
              {user.email}
            </span>
          )}
        </div>

        {/* Header */}
        <div className="space-y-1 mb-5">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Select Operational Console
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary">
            Choose your authorized profile to launch the tailored terminal workspace.
          </p>
        </div>

        {/* 3 Visual Cards */}
        <div className="space-y-3 mb-6" role="radiogroup" aria-label="Operational Role Selection">
          {roles.map((item) => {
            const isSelected = selectedRole === item.id;
            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectRole(item.id)}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectRole(item.id);
                  }
                }}
                className={`group relative p-4 rounded-xl border transition-all cursor-pointer select-none text-left ${
                  isSelected
                    ? 'bg-surface-2 border-primary shadow-glow-primary'
                    : 'bg-surface-2/60 border-border hover:border-text-muted hover:bg-surface-2/90 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-primary/20 border-primary/40'
                          : 'bg-surface-1 border-border group-hover:border-text-muted'
                      }`}
                    >
                      {item.icon}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-semibold text-text-primary">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-3 text-text-secondary border border-border">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed pr-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.highlights.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-1/80 text-text-muted border border-border/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-0.5 flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-primary border-primary text-base'
                          : 'border-text-muted/60 bg-surface-1'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-base" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Continue Button */}
        <AnimatePresence>
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.button
                type="button"
                onClick={handleContinue}
                disabled={isNavigating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-primary text-base font-semibold py-3 px-4 rounded-lg shadow-glow-primary transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isNavigating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-base border-t-transparent rounded-full animate-spin" />
                    <span>Loading Console Dashboard...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Launch{' '}
                      {selectedRole === 'manager'
                        ? 'Manager Tower'
                        : selectedRole === 'user'
                        ? 'Carrier Console'
                        : 'Admin Operations'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AuthLayout>
  );
};
