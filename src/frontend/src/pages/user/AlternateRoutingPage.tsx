import React from 'react';
import { UserLayout } from '@/layouts/UserLayout';
import { AlternateRoutingAdvisor } from '@/features/routes';

export const AlternateRoutingPage: React.FC = () => {
  return (
    <UserLayout
      activeNavItemId="routes"
      pageTitle="Smart Reroute Advisor"
      breadcrumbs={['DockNova', 'Vessel Operator', 'Voyage Optimization', 'Alternate Routing']}
    >
      <AlternateRoutingAdvisor />
    </UserLayout>
  );
};

export default AlternateRoutingPage;
