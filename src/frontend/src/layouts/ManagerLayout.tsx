import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NavItem } from '@/components/layout/Sidebar';

export interface ManagerLayoutProps {
  children: React.ReactNode;
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  pageTitle?: string;
}

const MANAGER_NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'congestion', label: 'Congestion' },
  { id: 'vessels', label: 'Vessels' },
  { id: 'berths', label: 'Berths' },
  { id: 'cranes', label: 'Cranes' },
  { id: 'optimisation', label: 'Optimisation' },
  { id: 'simulation', label: 'What-If Simulator' },
  { id: 'plan72h', label: '72-Hour Plan' },
  { id: 'copilot', label: 'AI Copilot' },
];

const MANAGER_BOTTOM_ITEMS: NavItem[] = [
  { id: 'settings', label: 'Settings' },
];

export interface ManagerLayoutProps {
  children: React.ReactNode;
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  pageTitle?: string;
  headerSlot?: React.ReactNode;
}

export const ManagerLayout: React.FC<ManagerLayoutProps> = ({
  children,
  activeNavItemId = 'overview',
  onNavItemSelect,
  pageTitle = 'Port Control Tower',
  headerSlot,
}) => {
  return (
    <DashboardLayout
      roleTitle="MANAGER"
      userRole="Manager"
      userName="Port Manager"
      navItems={MANAGER_NAV_ITEMS}
      bottomItems={MANAGER_BOTTOM_ITEMS}
      activeNavItemId={activeNavItemId}
      onNavItemSelect={onNavItemSelect}
      pageTitle={pageTitle}
      headerSlot={headerSlot}
    >
      {children}
    </DashboardLayout>
  );
};
