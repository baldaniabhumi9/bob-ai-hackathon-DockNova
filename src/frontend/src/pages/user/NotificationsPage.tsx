import React from 'react';
import { UserLayout } from '@/layouts/UserLayout';
import { NotificationsCenter } from '@/features/notifications';

export const NotificationsPage: React.FC = () => {
  return (
    <UserLayout
      activeNavItemId="notifications"
      pageTitle="Communications Hub"
      breadcrumbs={['DockNova', 'Vessel Operator', 'Communications', 'Notifications']}
    >
      <NotificationsCenter />
    </UserLayout>
  );
};

export default NotificationsPage;
