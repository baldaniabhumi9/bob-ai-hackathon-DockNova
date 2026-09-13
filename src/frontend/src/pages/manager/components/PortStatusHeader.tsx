import React, { useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

export interface PortStatusHeaderProps {
  onPortChange?: (portName: string) => void;
}

export const PortStatusHeader: React.FC<PortStatusHeaderProps> = ({
  onPortChange,
}) => {
  const [selectedPort, setSelectedPort] = useState('singapore');

  const portOptions = [
    { value: 'singapore', label: 'Singapore' },
    { value: 'nhava_sheva', label: 'Nhava Sheva' },
    { value: 'mundra', label: 'Mundra' },
    { value: 'rotterdam', label: 'Rotterdam' },
  ];

  const handlePortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPort(val);
    if (onPortChange) onPortChange(val);
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: colors.surface,
    borderBottom: `1px solid ${colors.surfaceBorder}`,
    padding: `${spacing.sm} ${spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  return (
    <div style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <h1 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: colors.primaryText }}>
          DockNova
        </h1>
        <span style={{ color: colors.surfaceBorder }}>|</span>
        <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: colors.secondaryText }}>
          Port Control Tower
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <div style={{ width: '140px' }}>
          <Select
            options={portOptions}
            value={selectedPort}
            onChange={handlePortSelect}
          />
        </div>

        <Badge variant="success">Normal</Badge>

        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: '0.8125rem', color: colors.secondaryText, borderLeft: `1px solid ${colors.surfaceBorder}`, paddingLeft: spacing.md }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: colors.surfaceHover, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: colors.primaryText }}>
            M
          </div>
          <span>Manager</span>
        </div>
      </div>
    </div>
  );
};
