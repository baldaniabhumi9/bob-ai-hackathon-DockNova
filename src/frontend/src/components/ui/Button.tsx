import React from 'react';
import { colors, radius, spacing } from '@/design-system';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  style,
  disabled,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.novaCyan,
          color: colors.inverseText,
          border: '1px solid transparent',
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.3)',
        };
      case 'secondary':
        return {
          backgroundColor: colors.surface,
          color: colors.primaryText,
          border: `1px solid ${colors.surfaceBorder}`,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: colors.secondaryText,
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          backgroundColor: colors.critical,
          color: colors.primaryText,
          border: '1px solid transparent',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: `${spacing.xs} ${spacing.sm}`, fontSize: '0.875rem' };
      case 'lg':
        return { padding: `${spacing.md} ${spacing.xl}`, fontSize: '1.125rem' };
      case 'md':
      default:
        return { padding: `${spacing.sm} ${spacing.md}`, fontSize: '1rem' };
    }
  };

  const baseStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    borderRadius: radius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease-in-out',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button style={baseStyle} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
