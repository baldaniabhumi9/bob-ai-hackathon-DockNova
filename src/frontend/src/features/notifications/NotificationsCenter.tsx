import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationsHeader, FilterTab } from './components/NotificationsHeader';
import { NotificationCard } from './components/NotificationCard';
import { NotificationsEmptyState } from './components/NotificationsEmptyState';
import { useNotifications } from '@/context/NotificationContext';

export const NotificationsCenter: React.FC = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    simulateNewNotification,
  } = useNotifications();

  // Active filter tab: 'all' | 'alert' | 'update' | 'ai'
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Currently expanded notification ID
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  // Toggle expand
  const handleToggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Reset filters
  const handleResetFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
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
        onMarkAllRead={markAllAsRead}
        onSimulateNewNotification={simulateNewNotification}
      />

      {/* Notifications List with Animated Reflow and Slide Dismiss */}
      {filteredNotifications.length === 0 ? (
        <NotificationsEmptyState
          isFiltered={activeTab !== 'all' || searchQuery.trim() !== ''}
          onResetFilters={handleResetFilters}
          onSimulateNewNotification={simulateNewNotification}
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
                onDismiss={() => {
                  dismissNotification(notif.id);
                  if (expandedId === notif.id) setExpandedId(null);
                }}
                onMarkRead={() => markAsRead(notif.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
