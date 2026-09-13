import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NavItem } from '@/components/layout/Sidebar';

export interface AdminLayoutProps {
  children: React.ReactNode;
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  pageTitle?: string;
}

const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'System Overview' },
  { id: 'users', label: 'User Management' },
  { id: 'config', label: 'Port Configuration' },
  { id: 'audit', label: 'Audit Logs' },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeNavItemId = 'overview',
  onNavItemSelect,
  pageTitle = 'Admin Operations Console',
}) => {
  return (
    <DashboardLayout
      roleTitle="Administrator"
      userRole="System Admin"
      userName="Admin Control"
      navItems={ADMIN_NAV_ITEMS}
      activeNavItemId={activeNavItemId}
      onNavItemSelect={onNavItemSelect}
      pageTitle={pageTitle}
    >
      {children}
    </DashboardLayout>
  );
};
