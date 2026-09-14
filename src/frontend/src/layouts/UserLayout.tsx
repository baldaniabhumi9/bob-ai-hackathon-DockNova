import React from 'react';
import {
  LayoutDashboard,
  Ship,
  Route,
  MessageSquare,
  Bell,
} from 'lucide-react';
import {
  BaseSidebarLayout,
  SidebarNavSection,
} from './BaseSidebarLayout';

export interface UserLayoutProps {
  children: React.ReactNode;
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  pageTitle?: string;
  breadcrumbs?: string[];
  unreadNotificationCount?: number;
}

export const USER_NAV_SECTIONS: SidebarNavSection[] = [
  {
    header: 'Fleet Operations',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/user',
      },
      {
        id: 'fleet',
        label: 'My Fleet',
        icon: <Ship className="w-5 h-5" />,
        path: '/user/fleet',
        badge: '14 Active',
      },
      {
        id: 'routes',
        label: 'Route Advisor',
        icon: <Route className="w-5 h-5" />,
        path: '/user/routes',
      },
      {
        id: 'copilot',
        label: 'AI Copilot',
        icon: <MessageSquare className="w-5 h-5" />,
        path: '/user/copilot',
        badge: 'IBM Bob',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: <Bell className="w-5 h-5" />,
        path: '/user/notifications',
        hasUnread: true,
      },
    ],
  },
];

export const UserLayout: React.FC<UserLayoutProps> = ({
  children,
  activeNavItemId = 'dashboard',
  onNavItemSelect,
  pageTitle,
  breadcrumbs,
  unreadNotificationCount = 2,
}) => {
  return (
    <BaseSidebarLayout
      roleTitle="Vessel Operator"
      roleBadge="Vessel Operator"
      accentColor="secondary"
      navSections={USER_NAV_SECTIONS}
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

export default UserLayout;
