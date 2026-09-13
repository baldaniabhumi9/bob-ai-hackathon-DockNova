import React from 'react';
import { colors, radius, spacing } from '@/design-system';

export interface ProgressBarProps {
  value: number; // 0 - 100
  label?: string;
  variant?: 'cyan' | 'electric' | 'success' | 'warning' | 'critical';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  variant = 'cyan',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const getBarColor = (): string => {
    switch (variant) {
      case 'electric': return colors.electricBlue;
      case 'success': return colors.success;
      case 'warning': return colors.warning;
      case 'critical': return colors.critical;
      case 'cyan':
      default: return colors.novaCyan;
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    width: '100%',
  };

  const trackStyle: React.CSSProperties = {
    height: '8px',
    backgroundColor: colors.background,
    borderRadius: radius.full,
    overflow: 'hidden',
    border: `1px solid ${colors.surfaceBorder}`,
  };

  const fillStyle: React.CSSProperties = {
    height: '100%',
    width: `${clampedValue}%`,
    backgroundColor: getBarColor(),
    borderRadius: radius.full,
    transition: 'width 0.4s ease-in-out',
    boxShadow: `0 0 8px ${getBarColor()}`,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: colors.secondaryText }}>
          <span>{label}</span>
          <span style={{ fontWeight: 600, color: colors.primaryText }}>{clampedValue}%</span>
        </div>
      )}
      <div style={trackStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
};
