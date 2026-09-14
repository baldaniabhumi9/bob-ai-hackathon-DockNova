import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboard } from '@/features/admin';
import { UserManagementView } from '@/features/users';
import { PortConfigurationView } from '@/features/portConfig';
import { IntegrationsView } from '@/features/integrations';
import { AuditLogsView } from '@/features/audit';
import { EmergencySimulator } from '@/features/admin/components/EmergencySimulator';

export const AdminPage: React.FC = () => {
  const location = useLocation();

  const getInitialNav = () => {
    if (location.pathname.includes('users')) return 'users';
    if (location.pathname.includes('config')) return 'config';
    if (location.pathname.includes('integrations')) return 'integrations';
    if (location.pathname.includes('audit')) return 'audit';
    if (location.pathname.includes('emergency')) return 'emergency';
    return 'dashboard';
  };

  const [activeNav, setActiveNav] = useState<string>(getInitialNav());

  // Keep activeNav synced if pathname changes directly or via browser back/forward
  useEffect(() => {
    setActiveNav(getInitialNav());
  }, [location.pathname]);

  return (
    <AdminLayout
      activeNavItemId={activeNav}
      onNavItemSelect={(id) => setActiveNav(id)}
      pageTitle={
        activeNav === 'users'
          ? 'User & Permission Management'
          : activeNav === 'config'
          ? 'Port Infrastructure & Terminal Config'
          : activeNav === 'integrations'
          ? 'Integrations & AI Configuration'
          : activeNav === 'audit'
          ? 'Cryptographic System Audit Logs'
          : activeNav === 'emergency'
          ? 'Emergency Disruption Simulator'
          : 'System Administration Console'
      }
    >
      {/* 1. MISSION CONTROL DASHBOARD VIEW */}
      {activeNav === 'dashboard' && <AdminDashboard />}

      {/* 2. USER MANAGEMENT VIEW */}
      {activeNav === 'users' && <UserManagementView />}

      {/* 3. PORT CONFIGURATION VIEW */}
      {activeNav === 'config' && <PortConfigurationView />}

      {/* 4. INTEGRATIONS VIEW */}
      {activeNav === 'integrations' && <IntegrationsView />}

      {/* 5. EMERGENCY MODE VIEW */}
      {activeNav === 'emergency' && <EmergencySimulator />}

      {/* 6. AUDIT LOGS VIEW */}
      {activeNav === 'audit' && <AuditLogsView />}
    </AdminLayout>
  );
};

export default AdminPage;
