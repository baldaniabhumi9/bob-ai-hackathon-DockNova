import React from 'react';
import { Sidebar, NavItem } from './Sidebar';
import { Header } from './Header';
import { PageContainer } from './PageContainer';

export interface DashboardLayoutProps {
  roleTitle: string;
  userRole: string;
  userName: string;
  navItems: NavItem[];
  bottomItems?: NavItem[];
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  pageTitle: string;
  headerSlot?: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  roleTitle,
  userRole,
  userName,
  navItems,
  bottomItems,
  activeNavItemId,
  onNavItemSelect,
  pageTitle,
  headerSlot,
  children,
}) => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar
        roleTitle={roleTitle}
        items={navItems}
        bottomItems={bottomItems}
        activeItemId={activeNavItemId}
        onItemSelect={onNavItemSelect}
        userProfileName={userName}
        userProfileRole={userRole}
      />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {headerSlot || <Header title={pageTitle} userRole={userRole} userName={userName} />}
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
};
