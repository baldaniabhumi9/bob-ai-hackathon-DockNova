import React from 'react';
import { Link } from 'react-router-dom';
import { Anchor, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { GradientButton } from '@/components/ui/GradientButton';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Navbar: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const dashboardPath = role === 'admin' ? '/admin' : role === 'user' ? '/user' : '/manager';

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-1/90 backdrop-blur-md border-b border-subtle transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-xl px-1.5 py-1"
          aria-label="DockNova Home"
        >
          <div className="w-9 h-9 rounded-xl bg-surface-2 border border-primary/30 flex items-center justify-center shadow-glow-primary/20 group-hover:border-primary group-hover:shadow-glow-primary transition-all duration-300">
            <Anchor className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg text-text-primary tracking-tight leading-none">
              Dock<span className="text-primary">Nova</span>
            </span>
            <span className="text-[10px] font-mono text-text-muted mt-0.5 tracking-widest uppercase">
              MARITIME OS
            </span>
          </div>
        </Link>

        {/* Right Nav Navigation */}
        <nav className="flex items-center gap-3" aria-label="Main Navigation">
          <ThemeToggle />

          {isAuthenticated ? (
            <Link to={dashboardPath}>
              <GradientButton variant="gradient" className="!px-4 !py-2 !text-xs">
                <Shield className="w-4 h-4" />
                <span>Go to Console ({role.toUpperCase()})</span>
                <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:inline-block">
                <GradientButton variant="glass" className="!px-4 !py-2 !text-xs">
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                </GradientButton>
              </Link>
              <Link to="/signup">
                <GradientButton variant="gradient" pulseRing className="!px-4 !py-2 !text-xs">
                  <span>Terminal Access</span>
                </GradientButton>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

