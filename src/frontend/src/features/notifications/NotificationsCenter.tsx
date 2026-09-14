import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  INITIAL_NOTIFICATIONS,
  NotificationItem,
  NotificationType,
} from './mockNotifications';
import { NotificationsHeader, FilterTab } from './components/NotificationsHeader';
import { NotificationCard } from './components/NotificationCard';
import { NotificationsEmptyState } from './components/NotificationsEmptyState';

const STORAGE_KEY = 'docknova_carrier_notifications_v1';

export const NotificationsCenter: React.FC = () => {
  // Initialize notifications from localStorage or mock data
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Active filter tab: 'all' | 'alert' | 'update' | 'ai'
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Currently expanded notification ID
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Compute unread counts per tab
  const unreadCounts = useMemo(() => {
    return {
      all: notifications.filter((n) => n.isUnread).length,
      alert: notifications.filter((n) => n.type === 'alert' && n.isUnread).length,
      update: notifications.filter((n) => n.type === 'update' && n.isUnread).length,
      ai: notifications.filter((n) => n.type === 'ai' && n.isUnread).length,
    };
  }, [notifications]);

  // Filtered list
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Tab filter
      if (activeTab !== 'all' && item.type !== activeTab) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMessage = item.message.toLowerCase().includes(q);
        const matchesVessel = item.vesselName?.toLowerCase().includes(q) || false;
        const matchesTag = item.categoryTag?.toLowerCase().includes(q) || false;

        return matchesTitle || matchesMessage || matchesVessel || matchesTag;
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  // Mark single notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  // Dismiss notification (slide out & remove)
  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  // Toggle expand
  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Reset filters
  const handleResetFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
  };

  // Simulate new notification arrival (with slide in animation)
  const handleSimulateNewNotification = () => {
    const alertTemplates: Omit<NotificationItem, 'id' | 'timestamp'>[] = [
      {
        type: 'alert',
        title: 'Tidal Fairway Speed Restriction Imposed',
        message: 'Sudden high ebb current requires transit speed reduction to 11.5 kts at Singapore Strait Sector 3.',
        fullMessage: 'VTS Western Gateway advises container vessels over 18,000 TEU to adjust approach curves immediately. Speed reduction of 2.5 kts required until 20:00.',
        isUnread: true,
        categoryTag: 'Fairway Restriction',
        actionType: 'general',
        actionLabel: 'Check VTS Corridors',
        actionUrl: '/user',
      },
      {
        type: 'ai',
        title: 'IBM Bob Copilot: Fast Track Slot Detected',
        message: 'Berth B-05 cleared early. Dynamic slot negotiation available with zero queue.',
        fullMessage: 'Tuas Mega Terminal Berth B-05 has become available 50 minutes ahead of forecast. Rerouting approaching vessel yields $7,200 in demurrage avoidance.',
        isUnread: true,
        categoryTag: 'Berth Optimization',
        actionType: 'see-route',
        actionLabel: 'View Slot Opportunity',
        actionUrl: '/user/routes',
      },
      {
        type: 'update',
        title: 'Pilot Boarding Station Clearance Issued',
        message: 'Senior Pilot Team assigned for Eastern Fairway rendezvous at 18:45.',
        fullMessage: 'Pilot cutter PB-14 dispatched to rendezvous with container carrier at Alpha Pilot Station. VHF Channel 20 confirmed.',
        isUnread: true,
        categoryTag: 'Pilotage Dispatch',
        actionType: 'general',
        actionLabel: 'View Schedule',
        actionUrl: '/user',
      },
    ];

    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const newAlert: NotificationItem = {
      ...template,
      id: `sim-${Date.now()}`,
      timestamp: 'Just now',
    };

    setNotifications((prev) => [newAlert, ...prev]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header with Search and Filter Tabs */}
      <NotificationsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        unreadCounts={unreadCounts}
        totalCount={notifications.length}
        onMarkAllRead={handleMarkAllRead}
        onSimulateNewNotification={handleSimulateNewNotification}
      />

      {/* Notifications List with Animated Reflow and Slide Dismiss */}
      {filteredNotifications.length === 0 ? (
        <NotificationsEmptyState
          isFiltered={activeTab !== 'all' || searchQuery.trim() !== ''}
          onResetFilters={handleResetFilters}
          onSimulateNewNotification={handleSimulateNewNotification}
        />
      ) : (
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredNotifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                isExpanded={expandedId === notif.id}
                onToggleExpand={() => handleToggleExpand(notif.id)}
                onDismiss={() => handleDismiss(notif.id)}
                onMarkRead={() => handleMarkAsRead(notif.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
