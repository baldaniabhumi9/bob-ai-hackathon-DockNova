import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboard } from '@/features/admin';
import { UserManagementView } from '@/features/users';
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
    return 'dashboard';
  };

  const [activeNav, setActiveNav] = useState<string>(getInitialNav());

  return (
    <AdminLayout
      activeNavItemId={activeNav}
      onNavItemSelect={(id) => setActiveNav(id)}
      pageTitle={
        activeNav === 'users'
          ? 'User & Permission Management'
          : activeNav === 'config'
          ? 'Port Terminal Infrastructure Config'
          : activeNav === 'integrations'
          ? 'External Feeds & IBM Bob AI Integration'
          : activeNav === 'audit'
          ? 'Cryptographic System Audit Logs'
          : 'System Administration Console'
      }
    >
      {/* 1. MISSION CONTROL DASHBOARD VIEW */}
      {activeNav === 'dashboard' && <AdminDashboard />}

      {/* 2. USER MANAGEMENT VIEW */}
      {activeNav === 'users' && <UserManagementView />}

      {/* 3. PORT CONFIGURATION VIEW */}
      {activeNav === 'config' && (
        <div className="p-6 rounded-xl bg-surface-1 border border-border space-y-4">
          <div className="flex items-center gap-3">
            <Settings2 className="w-6 h-6 text-accent" />
            <h3 className="font-heading font-semibold text-lg text-text-primary">
              Terminal Boundary & Berth Parameters
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-surface-2 border border-border/80 space-y-2">
              <span className="text-xs font-mono text-text-muted">QUAY GEOMETRY</span>
              <div className="text-sm font-semibold text-text-primary">42 Managed Berths • 4,800m Quay Line</div>
              <p className="text-xs text-text-secondary">Default ship safety buffer: 25 meters bow-to-stern.</p>
            </div>
            <div className="p-4 rounded-lg bg-surface-2 border border-border/80 space-y-2">
              <span className="text-xs font-mono text-text-muted">AIS BROADCAST FREQUENCIES</span>
              <div className="text-sm font-semibold text-text-primary">161.975 MHz (CH 87B) / 162.025 MHz (CH 88B)</div>
              <p className="text-xs text-text-secondary">Dual-redundant receiver towers connected at Raffles Lighthouse.</p>
            </div>
          </div>
        </div>
      )}

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

      {/* 5. AUDIT LOGS VIEW */}
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
