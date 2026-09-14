import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Radio, RefreshCw, Anchor } from 'lucide-react';

export interface PortStatusHeaderProps {
  onPortChange?: (portName: string) => void;
}

export const PortStatusHeader: React.FC<PortStatusHeaderProps> = ({
  onPortChange,
}) => {
  const [selectedPort, setSelectedPort] = useState('singapore');

  const portOptions = [
    { value: 'singapore', label: 'Singapore Port' },
    { value: 'nhava_sheva', label: 'Nhava Sheva' },
    { value: 'mundra', label: 'Mundra Port' },
    { value: 'rotterdam', label: 'Rotterdam' },
  ];

  const handlePortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPort(val);
    if (onPortChange) onPortChange(val);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
      {/* Telemetry Status Strip */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-border text-xs font-mono text-text-secondary">
          <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span>PORT CONTROL TOWER • HARBOR MASTER</span>
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
        </div>
        <span className="text-xs font-mono text-text-muted hidden md:inline">
          LAT: 1°16'N LON: 103°50'E
        </span>
      </div>

      {/* Controls & Status */}
      <div className="flex items-center gap-3">
        <div className="w-40">
          <Select
            options={portOptions}
            value={selectedPort}
            onChange={handlePortSelect}
          />
        </div>

        <Badge variant="success">Normal Operations</Badge>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-primary hover:underline cursor-pointer"
          title="Synchronize port operations"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync AIS</span>
        </button>
      </div>
    </div>
  );
};
