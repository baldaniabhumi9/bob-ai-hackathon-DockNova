import React from 'react';
import { Anchor, ShieldCheck, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0D1B2A] text-[#94A3B8] select-none">
      {/* Wave SVG Top Edge Divider */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[99%] overflow-hidden leading-none pointer-events-none">
        <svg
          className="relative block w-full h-8 sm:h-12 text-[#0D1B2A]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[rgba(56,189,248,0.15)]">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111E2E] border border-[rgba(56,189,248,0.25)] flex items-center justify-center shadow-md">
            <Anchor className="w-5 h-5 text-[#38BDF8]" />
          </div>
          <div>
            <div className="font-heading font-bold text-base text-[#E2E8F0]">
              Dock<span className="text-[#38BDF8]">Nova</span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono">
              Autonomous Maritime Port Operating System © {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Middle Telemetry Info & Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#94A3B8]">
          <span className="flex items-center gap-1.5 text-[#38BDF8]">
            <ShieldCheck className="w-4 h-4" />
            Port Control Telemetry Active
          </span>
          <span>•</span>
          <Link to="/login" className="hover:text-[#38BDF8] transition-colors">
            Terminal Login
          </Link>
          <span>•</span>
          <Link to="/signup" className="hover:text-[#38BDF8] transition-colors">
            Register Operator
          </Link>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#111E2E] hover:bg-[#1A2A3E] border border-[rgba(56,189,248,0.2)] hover:border-[#38BDF8] text-xs font-mono text-[#E2E8F0] transition-all duration-200 group"
          aria-label="Scroll back to top of page"
        >
          <span>Top</span>
          <ArrowUp className="w-4 h-4 text-[#38BDF8] group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
