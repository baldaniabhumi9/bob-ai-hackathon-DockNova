import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_NOTIFICATIONS,
  NotificationItem,
} from '@/features/notifications/mockNotifications';

export const NOTIFICATION_STORAGE_KEY = 'docknova_carrier_notifications_v1';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  simulateNewNotification: () => NotificationItem;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.isUnread).length;
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const simulateNewNotification = () => {
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
        fullMessage: 'Tuas Mega Terminal Berth B-05 has become available 50 minutes ahead of forecast. Rerouting approaching vessel yields ₹7,200 in demurrage avoidance.',
        isUnread: true,
        categoryTag: 'Berth Optimization',
        actionType: 'see-route',
        actionLabel: 'View Slot Opportunity',
        actionUrl: '/user/routes',
      },
      {
        type: 'alert',
        title: 'High Congestion Warning: Berth B-04 Saturation',
        message: 'Projected berth dwell collision on MSC Marina Blue exceeds critical threshold (94%).',
        fullMessage: 'Telemetry predicts continuous bottleneck cascade causing potential demurrage escalation of ₹18,500/day. Recommend proactive reroute advisor trigger.',
        isUnread: true,
        categoryTag: 'Berth Saturation',
        actionType: 'see-route',
        actionLabel: 'Evaluate Reroute',
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
      {
        type: 'ai',
        title: 'Green Steaming Eco-Route Calculated',
        message: 'Speed trim of 1.4 kts saves 3.8 tons VLSFO and ₹52,000 in fuel expenditure.',
        fullMessage: 'AI optimizer matched pilot window with lower cruising speed, reducing greenhouse emissions by 11.8 tons with on-time arrival.',
        isUnread: true,
        categoryTag: 'Eco Steaming',
        actionType: 'see-route',
        actionLabel: 'Inspect Voyage Plan',
        actionUrl: '/user/routes',
      },
    ];

    const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const newAlert: NotificationItem = {
      ...template,
      id: `sim-${Date.now()}`,
      timestamp: 'Just now',
    };

    setNotifications((prev) => [newAlert, ...prev]);
    return newAlert;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearAll,
        simulateNewNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
