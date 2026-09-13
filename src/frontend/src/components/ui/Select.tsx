import React from 'react';
import { colors, radius, spacing } from '@/design-system';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  style,
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.secondaryText,
  };

  const selectStyle: React.CSSProperties = {
    backgroundColor: colors.background,
    color: colors.primaryText,
    border: `1px solid ${error ? colors.critical : colors.surfaceBorder}`,
    borderRadius: radius.md,
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
    cursor: 'pointer',
    ...style,
  };

  return (
    <div style={containerStyle}>
      {label && <label htmlFor={selectId} style={labelStyle}>{label}</label>}
      <select id={selectId} style={selectStyle} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: colors.surface, color: colors.primaryText }}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span style={{ fontSize: '0.75rem', color: colors.critical }}>{error}</span>}
    </div>
  );
};
