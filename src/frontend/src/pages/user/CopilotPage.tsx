import React from 'react';
import { UserLayout } from '../../layouts/UserLayout';
import { CopilotChatInterface } from '../../features/copilot';

export const CopilotPage: React.FC = () => {
  return (
    <UserLayout
      activeNavItemId="copilot"
      pageTitle="IBM Bob Maritime Copilot"
      breadcrumbs={['DockNova', 'Vessel Operator', 'AI Copilot', 'IBM Bob']}
    >
      <CopilotChatInterface />
    </UserLayout>
  );
};

export default CopilotPage;
