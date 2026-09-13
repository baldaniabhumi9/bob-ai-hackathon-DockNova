import React from 'react';
import { colors, spacing, radius } from '@/design-system';
import { Badge } from '@/components/ui/Badge';

export interface HeaderProps {
  title?: string;
  userRole?: string;
  userName?: string;
  statusBadge?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Port Operations Overview',
  userRole = 'Operator',
  userName = 'Operations Lead',
  statusBadge = 'SYSTEM NORMAL',
}) => {
  const headerStyle: React.CSSProperties = {
    height: '64px',
    backgroundColor: colors.surface,
    borderBottom: `1px solid ${colors.surfaceBorder}`,
    padding: `0 ${spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  };

  const userBadgeStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: radius.full,
    border: `1px solid ${colors.surfaceBorder}`,
  };

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: colors.primaryText }}>
          {title}
        </h1>
        <Badge variant="cyan">{statusBadge}</Badge>
      </div>

      <div style={userBadgeStyle}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.success }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: colors.primaryText }}>{userName}</span>
        <span style={{ fontSize: '0.75rem', color: colors.secondaryText }}>({userRole})</span>
      </div>
    </header>
  );
};
