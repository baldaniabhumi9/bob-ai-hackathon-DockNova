import React from 'react';
import { AuthHero } from './AuthHero';
import { ThemeToggle } from '@/components/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen w-full bg-base text-text-primary flex flex-col md:flex-row overflow-x-hidden relative">
      {/* Top right floating theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left 55% Hero Section (Desktop) / Collapses to ~200px (Mobile) */}
      <section
        className="w-full md:w-[55%] min-h-[200px] md:min-h-screen flex-shrink-0"
        aria-label="DockNova Platform Overview"
      >
        <AuthHero />
      </section>

      {/* Right 45% Form Section (Desktop) / Below Hero (Mobile) */}
      <section
        className="w-full md:w-[45%] flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-y-auto"
        aria-label="Authentication Form"
      >
        {/* Ambient subtle backdrop radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-15 pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.4) 0%, transparent 70%)',
          }}
        />

        <div className="w-full max-w-md my-auto relative z-10">{children}</div>
      </section>
    </main>
  );
};

