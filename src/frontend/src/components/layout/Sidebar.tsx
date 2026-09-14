import React from 'react';
import { colors, spacing, radius } from '@/design-system';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
}

export interface SidebarProps {
  roleTitle?: string;
  items?: NavItem[];
  bottomItems?: NavItem[];
  activeItemId?: string;
  onItemSelect?: (id: string) => void;
  userProfileName?: string;
  userProfileRole?: string;
  /** Called when the bottom profile section is clicked. If omitted, the section is not interactive. */
  onProfileClick?: () => void;
  /** Optional content (e.g. a popover menu) rendered anchored above the profile section. */
  profilePopover?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  roleTitle = 'MANAGER',
  items = [],
  bottomItems = [],
  activeItemId,
  onItemSelect,
  userProfileName = 'Port Manager',
  onProfileClick,
  profilePopover,
}) => {
  const sidebarStyle: React.CSSProperties = {
    width: '220px',
    backgroundColor: colors.surface,
    borderRight: `1px solid ${colors.surfaceBorder}`,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: spacing.md,
    boxSizing: 'border-box',
    userSelect: 'none',
  };

  const brandStyle: React.CSSProperties = {
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
    borderBottom: `1px solid ${colors.surfaceBorder}`,
  };

  return (
    <aside style={sidebarStyle}>
      <div style={brandStyle}>
        <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: colors.primaryText, letterSpacing: '-0.02em' }}>
          DockNova
        </h2>
        <span style={{ fontSize: '0.7rem', color: colors.secondaryText, fontWeight: 600, letterSpacing: '0.05em' }}>
          {roleTitle}
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, overflowY: 'auto' }}>
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          const itemStyle: React.CSSProperties = {
            padding: `10px ${spacing.md}`,
            borderRadius: radius.md,
            backgroundColor: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
            color: isActive ? colors.novaCyan : colors.secondaryText,
            fontWeight: isActive ? 600 : 400,
            cursor: 'pointer',
            border: 'none',
            textAlign: 'left',
            fontSize: '0.875rem',
            transition: 'all 0.15s ease',
          };

          return (
            <button key={item.id} style={itemStyle} onClick={() => onItemSelect && onItemSelect(item.id)}>
              {item.label}
            </button>
          );
        })}
      </nav>

      {bottomItems.length > 0 && (
        <div style={{ borderTop: `1px solid ${colors.surfaceBorder}`, paddingTop: spacing.xs, marginTop: spacing.xs, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {bottomItems.map((item) => (
            <button
              key={item.id}
              style={{
                padding: `8px ${spacing.md}`,
                borderRadius: radius.md,
                backgroundColor: item.id === activeItemId ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                color: item.id === activeItemId ? colors.novaCyan : colors.secondaryText,
                fontSize: '0.8125rem',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onClick={() => onItemSelect && onItemSelect(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        {profilePopover}
        <button
          type="button"
          onClick={onProfileClick}
          style={{
            borderTop: `1px solid ${colors.surfaceBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            width: '100%',
            background: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            padding: `${spacing.md} 0 0 0`,
            marginTop: spacing.xs,
            cursor: onProfileClick ? 'pointer' : 'default',
            textAlign: 'left',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: colors.surfaceHover, border: `1px solid ${colors.surfaceBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: colors.primaryText, flexShrink: 0 }}>
            {userProfileName.charAt(0)}
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.primaryText, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userProfileName}
          </div>
        </button>
      </div>
    </aside>
  );
};
