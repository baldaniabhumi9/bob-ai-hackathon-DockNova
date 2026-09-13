import React from 'react';
import { colors, radius, spacing } from '@/design-system';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'electric' | 'success' | 'warning' | 'critical' | 'neutral';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'cyan',
  children,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'cyan':
        return {
          backgroundColor: 'rgba(34, 211, 238, 0.15)',
          color: colors.novaCyan,
          border: '1px solid rgba(34, 211, 238, 0.3)',
        };
      case 'electric':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          color: colors.electricBlue,
          border: '1px solid rgba(59, 130, 246, 0.3)',
        };
      case 'success':
        return {
          backgroundColor: colors.successGlow,
          color: colors.success,
          border: '1px solid rgba(34, 197, 94, 0.3)',
        };
      case 'warning':
        return {
          backgroundColor: colors.warningGlow,
          color: colors.warning,
          border: '1px solid rgba(245, 158, 11, 0.3)',
        };
      case 'critical':
        return {
          backgroundColor: colors.criticalGlow,
          color: colors.critical,
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'neutral':
      default:
        return {
          backgroundColor: 'rgba(148, 163, 184, 0.15)',
          color: colors.secondaryText,
          border: '1px solid rgba(148, 163, 184, 0.3)',
        };
    }
  };

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `2px ${spacing.sm}`,
    borderRadius: radius.full,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    ...getVariantStyles(),
    ...style,
  };

  return (
    <span style={badgeStyle} {...props}>
      {children}
    </span>
  );
};
