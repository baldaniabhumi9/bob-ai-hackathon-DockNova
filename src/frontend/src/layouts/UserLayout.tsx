import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NavItem } from '@/components/layout/Sidebar';

export interface UserLayoutProps {
  children: React.ReactNode;
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  pageTitle?: string;
}

const USER_NAV_ITEMS: NavItem[] = [
  { id: 'vessels', label: 'Vessel Schedule' },
  { id: 'status', label: 'Port Status' },
  { id: 'reports', label: 'Shift Logs' },
];

export const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  activeNavItemId = 'vessels',
  onNavItemSelect,
  pageTitle = 'Port Terminal Operations',
}) => {
  return (
    <DashboardLayout
      roleTitle="Operator"
      userRole="Terminal Operator"
      userName="Shift Operator"
      navItems={USER_NAV_ITEMS}
      activeNavItemId={activeNavItemId}
      onNavItemSelect={onNavItemSelect}
      pageTitle={pageTitle}
    >
      {children}
    </DashboardLayout>
  );
};
