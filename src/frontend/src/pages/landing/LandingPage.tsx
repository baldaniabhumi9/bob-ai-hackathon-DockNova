import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LiveStatsStrip } from './components/LiveStatsStrip';
import { FeaturesGrid } from './components/FeaturesGrid';
import { LiveOperationsBand } from './components/LiveOperationsBand';
import { Footer } from './components/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-base text-text-primary flex flex-col font-sans selection:bg-primary/30 selection:text-text-primary transition-colors duration-300">
      {/* Semantic Top Navigation */}
      <Navbar />

      {/* Main Landing Content */}
      <main className="flex-1">
        <HeroSection />
        <LiveStatsStrip />
        <FeaturesGrid />
        <LiveOperationsBand />
      </main>

      {/* Semantic Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;

