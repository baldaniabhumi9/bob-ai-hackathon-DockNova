import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserLayout } from '@/layouts/UserLayout';
import { UserDashboard } from '@/features/dashboard';
import { AlternateRoutingAdvisor } from '@/features/routes';
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
      {/* 1. DASHBOARD VIEW (UserDashboard command center) */}
      {activeNav === 'dashboard' && <UserDashboard />}


      {/* 2. MY FLEET VIEW */}
      {activeNav === 'fleet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'vsl_01',
                name: 'MV Nova Horizon',
                type: 'Ultra-Large Container Vessel',
                teu: '24,000 TEU',
                speed: '19.2 kts',
                status: 'Approaching Channel',
                destination: 'Singapore Port - Berth B-02',
              },
              {
                id: 'vsl_02',
                name: 'MSC Marina Blue',
                type: 'Post-Panamax Boxship',
                teu: '16,500 TEU',
                speed: '16.8 kts',
                status: 'Outer Anchorage',
                destination: 'Singapore Port - Berth C-04',
              },
              {
                id: 'vsl_03',
                name: 'Maersk Polaris',
                type: 'Container Carrier',
                teu: '18,200 TEU',
                speed: '18.4 kts',
                status: 'Underway at Sea',
                destination: 'Singapore Port - Berth B-07',
              },
            ].map((vessel) => (
              <div key={vessel.name} className="p-5 rounded-xl bg-surface-1 border border-border space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
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
                <div className="pt-3 border-t border-border/60">
                  <a
                    href={`/user/vessel/${vessel.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-surface-2 hover:bg-primary/20 text-xs font-medium text-text-primary hover:text-primary border border-border hover:border-primary/30 transition-all"
                  >
                    <span>View Vessel Passport</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. ROUTE ADVISOR VIEW */}
      {activeNav === 'routes' && <AlternateRoutingAdvisor />}

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
