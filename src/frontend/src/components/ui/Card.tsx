import React from 'react';
import { colors, radius, spacing, shadows } from '@/design-system';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  headerAction,
  style,
  ...props
}) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    border: `1px solid ${colors.surfaceBorder}`,
    boxShadow: shadows.md,
    padding: spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    ...style,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: `1px solid ${colors.surfaceBorder}`,
    paddingBottom: spacing.sm,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: colors.primaryText,
  };

  const subtitleStyle: React.CSSProperties = {
    margin: '4px 0 0 0',
    fontSize: '0.875rem',
    color: colors.secondaryText,
  };

  return (
    <div style={containerStyle} {...props}>
      {(title || headerAction) && (
        <div style={headerStyle}>
          <div>
            {title && <h3 style={titleStyle}>{title}</h3>}
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
