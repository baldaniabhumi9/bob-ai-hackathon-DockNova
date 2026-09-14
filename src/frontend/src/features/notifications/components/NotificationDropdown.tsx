import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  Bot,
  Info,
  CheckCheck,
  Sparkles,
  ExternalLink,
  Trash2,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationType } from '../mockNotifications';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    simulateNewNotification,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'all' | NotificationType>('all');

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  if (!isOpen) return null;

  const handleActionClick = (url?: string, notifId?: string) => {
    if (notifId) markAsRead(notifId);
    onClose();
    if (url) {
      navigate(url);
    }
  };

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-danger" />;
      case 'ai':
        return <Bot className="w-4 h-4 text-primary" />;
      case 'update':
        return <Info className="w-4 h-4 text-secondary" />;
      default:
        return <Bell className="w-4 h-4 text-text-muted" />;
    }
  };

  const getBadgeStyleForType = (type: NotificationType) => {
    switch (type) {
      case 'alert':
        return 'bg-danger/10 text-danger border-danger/30';
      case 'ai':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'update':
        return 'bg-secondary/10 text-secondary border-secondary/30';
      default:
        return 'bg-surface-3 text-text-muted border-border';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-1 border border-border shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header */}
      <div className="p-3.5 sm:p-4 border-b border-border/80 flex items-center justify-between bg-surface-2/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-sm text-text-primary">
                Operational Alerts
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary text-base">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-muted">Real-time maritime telemetry & AI triggers</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Simulate Alert Button */}
          <button
            type="button"
            onClick={() => simulateNewNotification()}
            title="Simulate Real-time Alert"
            className="p-1.5 rounded-lg text-primary hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1 text-[11px] font-mono border border-primary/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulate</span>
          </button>

          {/* Mark All Read */}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              title="Mark all as read"
              className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-3 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-border/60 bg-surface-2/30 text-xs font-mono">
        {(
          [
            { id: 'all', label: 'All' },
            { id: 'alert', label: 'Alerts' },
            { id: 'ai', label: 'AI Copilot' },
            { id: 'update', label: 'Updates' },
          ] as const
        ).map((tab) => {
          const count =
            tab.id === 'all'
              ? notifications.length
              : notifications.filter((n) => n.type === tab.id).length;

          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-primary/15 text-primary font-semibold border border-primary/30'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-3'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[9px] px-1 rounded-full ${
                  isActive ? 'bg-primary text-base font-bold' : 'bg-surface-3 text-text-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notification List (Scrollable) */}
      <div className="max-h-80 overflow-y-auto divide-y divide-border/40 font-sans">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-surface-2 flex items-center justify-center text-text-muted">
              <Bell className="w-5 h-5 opacity-40" />
            </div>
            <p className="text-xs text-text-secondary font-medium">No alerts in this view</p>
            <p className="text-[11px] text-text-muted">All port systems operating within normal parameters.</p>
            <button
              type="button"
              onClick={() => simulateNewNotification()}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Trigger Test Alert</span>
            </button>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-3 sm:p-3.5 transition-colors relative group cursor-pointer hover:bg-surface-2/60 ${
                notif.isUnread ? 'bg-surface-2/30' : 'opacity-85'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Type Icon */}
                <div className="p-1.5 rounded-lg bg-surface-2 border border-border shrink-0 mt-0.5">
                  {getIconForType(notif.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1.5">
                    <h4
                      className={`text-xs font-heading font-semibold truncate ${
                        notif.isUnread ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-mono text-text-muted shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>

                  {/* Badges & Actions row */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5">
                      {notif.categoryTag && (
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${getBadgeStyleForType(
                            notif.type
                          )}`}
                        >
                          {notif.categoryTag}
                        </span>
                      )}
                      {notif.isUnread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                      )}
                    </div>

                    {notif.actionLabel && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(notif.actionUrl, notif.id);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline hover:text-primary/90 font-medium"
                      >
                        <span>{notif.actionLabel}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Dismiss single */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(notif.id);
                  }}
                  title="Dismiss"
                  className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-danger rounded hover:bg-surface-3 transition-all shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Footer */}
      <div className="p-2.5 px-3 border-t border-border/80 bg-surface-2/60 flex items-center justify-between text-xs font-mono">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/user/notifications');
          }}
          className="text-primary hover:text-primary/80 font-medium flex items-center gap-1.5 text-[11px] cursor-pointer"
        >
          <span>View All Notifications</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        {notifications.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-text-muted hover:text-danger text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
