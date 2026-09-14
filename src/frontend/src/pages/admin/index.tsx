import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
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
      {/* 1. DASHBOARD VIEW */}
      {activeNav === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Infrastructure Health Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-1 border border-border">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>Cluster Health</span>
                <Server className="w-4 h-4 text-accent" />
              </div>
              <div className="font-mono text-2xl font-bold text-text-primary">100% Online</div>
              <div className="text-xs text-success mt-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                <span>6 of 6 Worker Nodes Active</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-1 border border-border">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>API Telemetry Latency</span>
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="font-mono text-2xl font-bold text-text-primary">18 ms</div>
              <div className="text-xs text-success mt-2">Nominal AIS throughput</div>
            </div>

            <div className="p-4 rounded-xl bg-surface-1 border border-border">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>Active Operator Seats</span>
                <Users className="w-4 h-4 text-secondary" />
              </div>
              <div className="font-mono text-2xl font-bold text-text-primary">18 Sessions</div>
              <div className="text-xs text-text-muted mt-2">Max concurrency 50</div>
            </div>

            <div className="p-4 rounded-xl bg-surface-1 border border-border">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>Security Integrity</span>
                <ShieldCheck className="w-4 h-4 text-success" />
              </div>
              <div className="font-mono text-2xl font-bold text-text-primary">Zero Breach</div>
              <div className="text-xs text-text-muted mt-2">AES-256 TLS 1.3 Active</div>
            </div>
          </div>

          {/* Infrastructure Nodes Table */}
          <div className="p-5 rounded-xl bg-surface-1 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-semibold text-base text-text-primary">
                  Node Cluster Telemetry & Microservices
                </h3>
                <p className="text-xs text-text-secondary">
                  Real-time status of DockNova distributed cluster services.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/30">
                Kubernetes Mesh Healthy
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-text-muted uppercase font-mono">
                    <th className="py-2.5 px-3">Service Name</th>
                    <th className="py-2.5 px-3">Instances</th>
                    <th className="py-2.5 px-3">CPU Usage</th>
                    <th className="py-2.5 px-3">Memory</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  <tr className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-text-primary">docknova-ais-gateway</td>
                    <td className="py-3 px-3 text-text-secondary">3 Pods</td>
                    <td className="py-3 px-3 text-primary">12.4%</td>
                    <td className="py-3 px-3 text-text-secondary">420 MB</td>
                    <td className="py-3 px-3 text-success">Healthy</td>
                  </tr>
                  <tr className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-text-primary">docknova-congestion-engine</td>
                    <td className="py-3 px-3 text-text-secondary">2 Pods</td>
                    <td className="py-3 px-3 text-primary">28.1%</td>
                    <td className="py-3 px-3 text-text-secondary">1.2 GB</td>
                    <td className="py-3 px-3 text-success">Healthy</td>
                  </tr>
                  <tr className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-text-primary">docknova-ibm-watsonx-copilot</td>
                    <td className="py-3 px-3 text-text-secondary">2 Pods</td>
                    <td className="py-3 px-3 text-primary">16.7%</td>
                    <td className="py-3 px-3 text-text-secondary">850 MB</td>
                    <td className="py-3 px-3 text-success">Healthy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. USER MANAGEMENT VIEW */}
      {activeNav === 'users' && (
        <div className="p-5 rounded-xl bg-surface-1 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-base text-text-primary">
              Active Terminal Accounts & Roles
            </h3>
            <button className="px-3 py-1.5 rounded-lg bg-accent text-base text-xs font-semibold hover:opacity-90 transition-opacity">
              + Provision Operator
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 text-text-muted uppercase font-mono">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Assigned Role</th>
                  <th className="py-2.5 px-3">MFA Status</th>
                  <th className="py-2.5 px-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                <tr className="hover:bg-surface-2/40">
                  <td className="py-3 px-3 font-semibold text-text-primary">Capt. Vance Alexander</td>
                  <td className="py-3 px-3 text-text-muted">captain@docknova.com</td>
                  <td className="py-3 px-3 text-primary">Port Operations Manager</td>
                  <td className="py-3 px-3 text-success">Hardware Token (YubiKey)</td>
                  <td className="py-3 px-3 text-text-secondary">2 mins ago</td>
                </tr>
                <tr className="hover:bg-surface-2/40">
                  <td className="py-3 px-3 font-semibold text-text-primary">Elena Rostova</td>
                  <td className="py-3 px-3 text-text-muted">operator.maersk@docknova.com</td>
                  <td className="py-3 px-3 text-secondary">Vessel Operator (Carrier)</td>
                  <td className="py-3 px-3 text-success">Authenticator App</td>
                  <td className="py-3 px-3 text-text-secondary">15 mins ago</td>
                </tr>
                <tr className="hover:bg-surface-2/40">
                  <td className="py-3 px-3 font-semibold text-text-primary">Marcus Drake</td>
                  <td className="py-3 px-3 text-text-muted">admin.ops@docknova.com</td>
                  <td className="py-3 px-3 text-accent">System Administrator</td>
                  <td className="py-3 px-3 text-success">Enforced FIDO2</td>
                  <td className="py-3 px-3 text-text-secondary">Just now</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

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
