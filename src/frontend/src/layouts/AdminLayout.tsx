import React from 'react';
import {
  LayoutDashboard,
  Users,
  Settings2,
  Plug,
  ClipboardList,
} from 'lucide-react';
import {
  BaseSidebarLayout,
  SidebarNavSection,
} from './BaseSidebarLayout';

export interface AdminLayoutProps {
  children: React.ReactNode;
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  pageTitle?: string;
  breadcrumbs?: string[];
  unreadNotificationCount?: number;
}

export const ADMIN_NAV_SECTIONS: SidebarNavSection[] = [
  {
    header: 'System Administration',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/admin',
      },
      {
        id: 'users',
        label: 'User Management',
        icon: <Users className="w-5 h-5" />,
        path: '/admin/users',
        badge: '18 Active',
      },
      {
        id: 'config',
        label: 'Port Configuration',
        icon: <Settings2 className="w-5 h-5" />,
        path: '/admin/config',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: <Plug className="w-5 h-5" />,
        path: '/admin/integrations',
        badge: 'IBM Bob',
      },
      {
        id: 'audit',
        label: 'Audit Logs',
        icon: <ClipboardList className="w-5 h-5" />,
        path: '/admin/audit',
      },
    ],
  },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeNavItemId = 'dashboard',
  onNavItemSelect,
  pageTitle,
  breadcrumbs,
  unreadNotificationCount = 1,
}) => {
  return (
    <BaseSidebarLayout
      roleTitle="System Administrator"
      roleBadge="System Admin"
      accentColor="accent"
      navSections={ADMIN_NAV_SECTIONS}
      activeItemId={activeNavItemId}
      onItemSelect={onNavItemSelect}
      pageTitle={pageTitle}
      breadcrumbs={breadcrumbs}
      unreadNotificationCount={unreadNotificationCount}
    >
      {children}
    </BaseSidebarLayout>
  );
};

export default AdminLayout;
