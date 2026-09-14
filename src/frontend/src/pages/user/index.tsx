import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserLayout } from '@/layouts/UserLayout';
import {
  Ship,
  Compass,
  Anchor,
  Clock,
  Navigation,
  Route,
  MessageSquare,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const UserPage: React.FC = () => {
  const location = useLocation();

  // Determine active nav item from URL or state
  const getInitialNav = () => {
    if (location.pathname.includes('fleet')) return 'fleet';
    if (location.pathname.includes('routes')) return 'routes';
    if (location.pathname.includes('copilot')) return 'copilot';
    if (location.pathname.includes('notifications')) return 'notifications';
    return 'dashboard';
  };

  const [activeNav, setActiveNav] = useState<string>(getInitialNav());

  return (
    <UserLayout
      activeNavItemId={activeNav}
      onNavItemSelect={(id) => setActiveNav(id)}
      pageTitle={
        activeNav === 'fleet'
          ? 'My Fleet Radar'
          : activeNav === 'routes'
          ? 'Optimal Route Advisor'
          : activeNav === 'copilot'
          ? 'IBM Bob AI Carrier Copilot'
          : activeNav === 'notifications'
          ? 'Carrier Operational Alerts'
          : 'Carrier Operations Dashboard'
      }
    >
      {/* 1. DASHBOARD VIEW */}
      {activeNav === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-1 border border-border">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>Active Fleet at Sea</span>
                <Ship className="w-4 h-4 text-secondary" />
              </div>
              <div className="font-mono text-2xl font-bold text-text-primary">14 Vessels</div>
              <div className="flex items-center gap-1.5 text-xs text-success mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>All within AIS schedule</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-1 border border-border">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>Allocated Berths</span>
                <Anchor className="w-4 h-4 text-primary" />
              </div>
              <div className="font-mono text-2xl font-bold text-text-primary">3 Assigned</div>
              <div className="text-xs text-text-muted mt-2">Quays B-02, B-07, C-04</div>
            </div>

            <div className="p-4 rounded-xl bg-surface-1 border border-border">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>Avg. Berth Wait Time</span>
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <div className="font-mono text-2xl font-bold text-text-primary">1.2 hrs</div>
              <div className="text-xs text-success mt-2">-42% vs regional baseline</div>
            </div>

            <div className="p-4 rounded-xl bg-surface-1 border border-border">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                <span>Route Congestion Index</span>
                <Compass className="w-4 h-4 text-warning" />
              </div>
              <div className="font-mono text-2xl font-bold text-text-primary">Low (2.1)</div>
              <div className="text-xs text-text-muted mt-2">Strait sector green</div>
            </div>
          </div>

          {/* Incoming Port Calls Table */}
          <div className="p-5 rounded-xl bg-surface-1 border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-semibold text-base text-text-primary">
                  Live Port Call Nominations
                </h3>
                <p className="text-xs text-text-secondary">
                  Real-time AIS updates and berth assignments for approaching vessels.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30">
                AIS Feed Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 text-text-muted uppercase font-mono">
                    <th className="py-2.5 px-3">Vessel</th>
                    <th className="py-2.5 px-3">IMO Number</th>
                    <th className="py-2.5 px-3">ETA (Singapore)</th>
                    <th className="py-2.5 px-3">Assigned Quay</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  <tr className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-text-primary">MV Nova Horizon</td>
                    <td className="py-3 px-3 text-text-secondary">9845123</td>
                    <td className="py-3 px-3 text-primary">Today 16:45</td>
                    <td className="py-3 px-3">Berth B-02</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-success">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Berthing Cleared
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-text-primary">MSC Marina Blue</td>
                    <td className="py-3 px-3 text-text-secondary">9784321</td>
                    <td className="py-3 px-3 text-primary">Tomorrow 04:30</td>
                    <td className="py-3 px-3">Berth C-04</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-warning">
                        <Clock className="w-3.5 h-3.5" /> Pilot Requested
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-text-primary">Maersk Polaris</td>
                    <td className="py-3 px-3 text-text-secondary">9921004</td>
                    <td className="py-3 px-3 text-primary">Tomorrow 11:15</td>
                    <td className="py-3 px-3">Berth B-07</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-secondary">
                        <Navigation className="w-3.5 h-3.5" /> Steaming 18.4 kt
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. MY FLEET VIEW */}
      {activeNav === 'fleet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'MV Nova Horizon',
                type: 'Ultra-Large Container Vessel',
                teu: '24,000 TEU',
                speed: '19.2 kts',
                status: 'Approaching Channel',
                destination: 'Singapore Port - Berth B-02',
              },
              {
                name: 'MSC Marina Blue',
                type: 'Post-Panamax Boxship',
                teu: '16,500 TEU',
                speed: '16.8 kts',
                status: 'Outer Anchorage',
                destination: 'Singapore Port - Berth C-04',
              },
              {
                name: 'Maersk Polaris',
                type: 'Container Carrier',
                teu: '18,200 TEU',
                speed: '18.4 kts',
                status: 'Underway at Sea',
                destination: 'Singapore Port - Berth B-07',
              },
            ].map((vessel) => (
              <div key={vessel.name} className="p-5 rounded-xl bg-surface-1 border border-border space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-heading font-semibold text-base text-text-primary">
                      {vessel.name}
                    </h4>
                    <p className="text-xs text-text-muted">{vessel.type}</p>
                  </div>
                  <Ship className="w-5 h-5 text-secondary" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-border/60">
                  <div>
                    <span className="text-text-muted">Capacity:</span>
                    <div className="text-text-primary">{vessel.teu}</div>
                  </div>
                  <div>
                    <span className="text-text-muted">Current Speed:</span>
                    <div className="text-secondary">{vessel.speed}</div>
                  </div>
                </div>
                <div className="pt-2 text-xs">
                  <span className="text-text-muted">Destination: </span>
                  <span className="text-text-secondary">{vessel.destination}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ROUTE ADVISOR VIEW */}
      {activeNav === 'routes' && (
        <div className="p-6 rounded-xl bg-surface-1 border border-border space-y-4">
          <div className="flex items-center gap-3 text-secondary">
            <Route className="w-6 h-6" />
            <h3 className="font-heading font-semibold text-lg text-text-primary">
              AI Route Optimization & Fairway Guidance
            </h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            Real-time tidal, meteorological, and traffic data analyzed by DockNova AI. Vessels adhering
            to suggested speed corridors reduce port anchorage fuel consumption by up to 14.8%.
          </p>
          <div className="p-4 rounded-lg bg-surface-2 border border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div className="text-xs">
                <div className="font-semibold text-text-primary">Singapore Strait Sector 4 Re-routing Active</div>
                <div className="text-text-muted">Recommendation: Maintain 14.2 knots for direct quay arrival</div>
              </div>
            </div>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-secondary text-base hover:opacity-90 transition-opacity">
              Apply to Fleet
            </button>
          </div>
        </div>
      )}

      {/* 4. COPILOT VIEW */}
      {activeNav === 'copilot' && (
        <div className="p-6 rounded-xl bg-surface-1 border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-text-primary">
                IBM Bob Maritime Copilot
              </h3>
              <p className="text-xs text-text-muted">
                Watsonx-powered conversational agent for vessel berthing & turnaround intelligence.
              </p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-surface-2 border border-border/80 text-xs text-text-secondary font-mono">
            Copilot standby: Ask about ETA adjustments, quay crane availability, or fairway weather conditions.
          </div>
        </div>
      )}

      {/* 5. NOTIFICATIONS VIEW */}
      {activeNav === 'notifications' && (
        <div className="space-y-3">
          {[
            {
              title: 'Berth B-02 Allocation Confirmed',
              time: '12 mins ago',
              desc: 'Port Authority confirmed berthing clearance for MV Nova Horizon at Quay B-02.',
              priority: 'success',
            },
            {
              title: 'Weather Warning: Strait Squall Corridor',
              time: '45 mins ago',
              desc: 'Wind gusts up to 34 knots reported in Malacca Strait Sector 2. Advisory issued.',
              priority: 'warning',
            },
          ].map((note, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-1 border border-border flex items-start gap-3">
              <Bell className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-text-primary">{note.title}</span>
                  <span className="text-text-muted font-mono">{note.time}</span>
                </div>
                <p className="text-xs text-text-secondary">{note.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  );
};

export default UserPage;
