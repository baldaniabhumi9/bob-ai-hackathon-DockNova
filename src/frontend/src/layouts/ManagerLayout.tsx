import React from 'react';
import {
  LayoutDashboard,
  Activity,
  GitBranch,
  Ship,
  Anchor,
  Boxes,
  Sliders,
  PlaySquare,
  Clock,
  MessageSquare,
  Settings,
} from 'lucide-react';
import {
  BaseSidebarLayout,
  SidebarNavSection,
} from './BaseSidebarLayout';

export interface ManagerLayoutProps {
  children: React.ReactNode;
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  pageTitle?: string;
  breadcrumbs?: string[];
  unreadNotificationCount?: number;
}

export const MANAGER_NAV_SECTIONS: SidebarNavSection[] = [
  {
    header: 'Port Operations',
    items: [
      {
        id: 'overview',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/manager',
      },
      {
        id: 'vessels',
        label: 'Vessel Traffic',
        icon: <Ship className="w-5 h-5" />,
        path: '/manager/vessels',
        badge: 'Live',
      },
      {
        id: 'berths',
        label: 'Berths & Quays',
        icon: <Anchor className="w-5 h-5" />,
        path: '/manager/berths',
      },
      {
        id: 'cranes',
        label: 'Crane Operations',
        icon: <Boxes className="w-5 h-5" />,
        path: '/manager/cranes',
      },
      {
        id: 'congestion',
        label: 'Congestion Engine',
        icon: <Activity className="w-5 h-5" />,
        path: '/manager/congestion',
        badge: '72h ML',
      },
      {
        id: 'ripple',
        label: 'Ripple Analytics',
        icon: <GitBranch className="w-5 h-5" />,
        path: '/manager/ripple',
      },
    ],
  },
  {
    header: 'AI & Decision Support',
    items: [
      {
        id: 'optimisation',
        label: 'Operations Planner',
        icon: <Sliders className="w-5 h-5" />,
        path: '/manager/optimisation',
      },
      {
        id: 'simulation',
        label: 'What-If Simulator',
        icon: <PlaySquare className="w-5 h-5" />,
        path: '/manager/simulation',
        badge: 'SIM',
      },
      {
        id: 'plan72h',
        label: '72-Hour Shift Plan',
        icon: <Clock className="w-5 h-5" />,
        path: '/manager/plan72h',
      },
      {
        id: 'copilot',
        label: 'AI Copilot',
        icon: <MessageSquare className="w-5 h-5" />,
        path: '/manager/copilot',
        badge: 'IBM Bob',
      },
      {
        id: 'settings',
        label: 'Manager Settings',
        icon: <Settings className="w-5 h-5" />,
        path: '/manager/settings',
      },
    ],
  },
];

export const ManagerLayout: React.FC<ManagerLayoutProps> = ({
  children,
  activeNavItemId = 'overview',
  onNavItemSelect,
  pageTitle,
  breadcrumbs,
  unreadNotificationCount = 3,
}) => {
  return (
    <BaseSidebarLayout
      roleTitle="Port Operations Manager"
      roleBadge="Port Manager"
      accentColor="primary"
      navSections={MANAGER_NAV_SECTIONS}
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

export default ManagerLayout;
