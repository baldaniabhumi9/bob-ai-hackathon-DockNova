import React from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Search,
  CheckCheck,
  PlusCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Layers,
} from 'lucide-react';
import { NotificationType } from '../mockNotifications';

export type FilterTab = 'all' | NotificationType;

interface NotificationsHeaderProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  unreadCounts: {
    all: number;
    alert: number;
    update: number;
    ai: number;
  };
  totalCount: number;
  onMarkAllRead: () => void;
  onSimulateNewNotification: () => void;
}

export const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  unreadCounts,
  totalCount,
  onMarkAllRead,
  onSimulateNewNotification,
}) => {
  const tabs: { id: FilterTab; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: 'All',
      count: unreadCounts.all,
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: 'alert',
      label: 'Alerts',
      count: unreadCounts.alert,
      icon: <AlertTriangle className="w-3.5 h-3.5 text-danger" />,
    },
    {
      id: 'update',
      label: 'Updates',
      count: unreadCounts.update,
      icon: <Info className="w-3.5 h-3.5 text-primary" />,
    },
    {
      id: 'ai',
      label: 'AI Insights',
      count: unreadCounts.ai,
      icon: <Sparkles className="w-3.5 h-3.5 text-secondary" />,
    },
  ];

  return (
    <div className="space-y-4 pb-3 border-b border-border/70">
      {/* Top Bar: Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-primary/15 text-primary border border-primary/20">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-semibold">
              Fleet Communications Hub
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Notifications
            </h1>
            {unreadCounts.all > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/20 text-primary border border-primary/30">
                {unreadCounts.all} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time fairway alerts, berth allocation updates, and IBM Bob AI operational recommendations.
          </p>
        </div>

        {/* Action Buttons: Mark All Read & Simulate Alert */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onSimulateNewNotification}
            className="px-3 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-border text-xs font-mono text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Simulate incoming real-time AIS alert"
          >
            <PlusCircle className="w-3.5 h-3.5 text-secondary" />
            <span>Simulate Alert</span>
          </button>

          {unreadCounts.all > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="px-3.5 py-2 rounded-xl bg-transparent hover:bg-surface-2 border border-transparent hover:border-border/80 text-xs font-mono font-medium text-text-muted hover:text-text-primary transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-success" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter notifications by vessel, fairway sector, alert type..."
          className="w-full bg-surface-2 hover:bg-surface-3/80 focus:bg-surface-2 border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-primary/60 transition-colors shadow-inner"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-muted hover:text-text-primary px-1.5 py-0.5 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tab Filter Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-surface-2 border-primary text-primary shadow-glow-primary/20'
                  : 'bg-surface-1 border-border text-text-muted hover:text-text-secondary hover:bg-surface-2/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>

              {/* Unread count badge */}
              {tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive
                      ? 'bg-primary text-base'
                      : 'bg-surface-3 text-text-secondary border border-border/80'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
