import React, { useState } from 'react';
import { ManagerLayout } from '@/layouts/ManagerLayout';
import { ManagerDashboard } from './ManagerDashboard';
import { CongestionPage } from './CongestionPage';
import { CongestionRipplePage } from './CongestionRipplePage';
import { VesselsPage } from './VesselsPage';
import { BerthsPage } from './BerthsPage';
import { CranesPage } from './CranesPage';
import { OptimisationPage } from './OptimisationPage';
import { SimulationPage } from './SimulationPage';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/design-system';

export const ManagerPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState<string>('overview');

  const getNavTitle = (id: string) => {
    switch (id) {
      case 'overview': return 'Port Control Tower Overview';
      case 'congestion': return '72-Hour Congestion Prediction Engine';
      case 'ripple': return 'Congestion Ripple Effect';
      case 'vessels': return 'Vessel Schedule & Traffic Control';
      case 'berths': return 'Berth Allocation & Utilisation';
      case 'cranes': return 'Crane & Quay Equipment Operations';
      case 'optimisation': return 'AI 72-Hour Operations Planner';
      case 'simulation': return 'What-If Disruption Simulator';
      case 'plan72h': return 'Automated Shift Supervisor Plan';
      case 'copilot': return 'IBM Bob AI Port Copilot';
      case 'settings': return 'Manager Control Settings';
      default: return 'Port Control Tower';
    }
  };

  return (
    <ManagerLayout
      activeNavItemId={activeNav}
      onNavItemSelect={(id) => setActiveNav(id)}
      pageTitle={getNavTitle(activeNav)}
    >
      {activeNav === 'overview' && <ManagerDashboard />}
      {activeNav === 'congestion' && <CongestionPage />}
      {activeNav === 'ripple' && <CongestionRipplePage />}
      {activeNav === 'vessels' && <VesselsPage />}
      {activeNav === 'berths' && <BerthsPage />}
      {activeNav === 'cranes' && <CranesPage />}
      {activeNav === 'optimisation' && <OptimisationPage />}
      {activeNav === 'simulation' && <SimulationPage />}
      {activeNav !== 'overview' &&
        activeNav !== 'congestion' &&
        activeNav !== 'ripple' &&
        activeNav !== 'vessels' &&
        activeNav !== 'berths' &&
        activeNav !== 'cranes' &&
        activeNav !== 'optimisation' &&
        activeNav !== 'simulation' && (
        <Card title={getNavTitle(activeNav)} subtitle="Module Under Active Development">
          <div style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '3rem' }}>⚓</div>
            <h3 style={{ margin: 0, color: colors.primaryText }}>
              {getNavTitle(activeNav)}
            </h3>
            <p style={{ margin: 0, color: colors.secondaryText, maxWidth: '480px' }}>
              This module is scheduled for implementation in the next phase. Return to the Control Tower Overview to monitor live port congestion and AI recommendations.
            </p>
            <Button variant="primary" onClick={() => setActiveNav('overview')}>
              Return to Overview Dashboard
            </Button>
          </div>
        </Card>
      )}
    </ManagerLayout>
  );
};

export default ManagerPage;
