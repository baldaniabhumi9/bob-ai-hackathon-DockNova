import React from 'react';
import { colors, radius, spacing } from '@/design-system';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.xs,
    borderBottom: `1px solid ${colors.surfaceBorder}`,
    paddingBottom: spacing.xs,
  };

  return (
    <div style={containerStyle}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const tabStyle: React.CSSProperties = {
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
          color: isActive ? colors.novaCyan : colors.secondaryText,
          border: 'none',
          borderBottom: isActive ? `2px solid ${colors.novaCyan}` : '2px solid transparent',
          borderRadius: `${radius.sm} ${radius.sm} 0 0`,
          cursor: 'pointer',
          fontWeight: isActive ? 600 : 400,
          fontSize: '0.875rem',
          transition: 'all 0.2s ease',
        };

        return (
          <button key={tab.id} style={tabStyle} onClick={() => onChange(tab.id)}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
