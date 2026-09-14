import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboard } from '@/features/admin';
import { UserManagementView } from '@/features/users';
import { PortConfigurationView } from '@/features/portConfig';
import { EmergencySimulator } from '@/features/admin/components/EmergencySimulator';
import {
  Users,
  Settings2,
  Plug,
  ClipboardList,
  ShieldCheck,
  Server,
  Activity,
  Cpu,
  Lock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

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
          ? 'External Feeds & IBM Bob AI Integration'
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
      {activeNav === 'integrations' && (
        <div className="p-6 rounded-xl bg-surface-1 border border-border space-y-4">
          <div className="flex items-center gap-3">
            <Plug className="w-6 h-6 text-accent" />
            <h3 className="font-heading font-semibold text-lg text-text-primary">
              IBM Bob AI & External Data Feeds
            </h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-surface-2 border border-border/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-text-primary">IBM Watsonx Maritime Copilot Service</div>
                <div className="text-xs text-text-muted font-mono">Endpoint: https://api.watsonx.ai/v1/maritime-agent</div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-success/15 text-success border border-success/30">
                Connected
              </span>
            </div>
            <div className="p-4 rounded-lg bg-surface-2 border border-border/80 flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-text-primary">Singapore MPA Vessel Traffic Stream (VTIS)</div>
                <div className="text-xs text-text-muted font-mono">Feed Protocol: WebSocket Secure (WSS)</div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-success/15 text-success border border-success/30">
                Synchronized
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. EMERGENCY MODE VIEW */}
      {activeNav === 'emergency' && <EmergencySimulator />}

      {/* 6. AUDIT LOGS VIEW */}
      {activeNav === 'audit' && (
        <div className="p-5 rounded-xl bg-surface-1 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-base text-text-primary">
              Immutable Cryptographic Audit Trail
            </h3>
            <span className="text-xs font-mono text-text-muted">Hash Chain Verified</span>
          </div>
          <div className="space-y-2 font-mono text-xs">
            {[
              {
                time: '2026-09-14 07:28:10 UTC',
                actor: 'admin.ops@docknova.com',
                action: 'MODIFIED_QUAY_THRESHOLD',
                target: 'Berth B-07 Draft Max: 16.5m',
              },
              {
                time: '2026-09-14 07:15:42 UTC',
                actor: 'system.scheduler',
                action: 'AUTO_ALLOCATED_BERTH',
                target: 'Vessel MV Nova Horizon -> Quay B-02',
              },
              {
                time: '2026-09-14 06:50:00 UTC',
                actor: 'captain@docknova.com',
                action: 'SESSION_AUTHORIZED',
                target: 'Console Manager Tower Login',
              },
            ].map((log, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-surface-2/60 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="text-text-muted mr-3">{log.time}</span>
                  <span className="text-accent font-semibold mr-3">[{log.action}]</span>
                  <span className="text-text-secondary">{log.target}</span>
                </div>
                <span className="text-text-muted text-[11px]">{log.actor}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPage;
