import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radio,
  Calendar,
  CloudRain,
  ShieldCheck,
  RotateCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Layers,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { DataSource, DataSourceStatus } from '../types';

export interface DataSourcesSectionProps {
  dataSources: DataSource[];
  onSyncSource: (id: string) => Promise<void>;
}

export const DataSourcesSection: React.FC<DataSourcesSectionProps> = ({
  dataSources,
  onSyncSource,
}) => {
  const [expandedErrors, setExpandedErrors] = useState<Record<string, boolean>>({
    'ds-weather': true, // Open by default to show capability
  });
  const [syncingIds, setSyncingIds] = useState<Record<string, boolean>>({});

  const toggleErrorExpand = (id: string) => {
    setExpandedErrors((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSync = async (id: string) => {
    setSyncingIds((prev) => ({ ...prev, [id]: true }));
    try {
      await onSyncSource(id);
    } finally {
      setTimeout(() => {
        setSyncingIds((prev) => ({ ...prev, [id]: false }));
      }, 900);
    }
  };

  const getSourceIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'ais':
        return <Radio className="w-5 h-5 text-primary" />;
      case 'schedule':
        return <Calendar className="w-5 h-5 text-secondary" />;
      case 'weather':
        return <CloudRain className="w-5 h-5 text-warning" />;
      case 'customs':
        return <ShieldCheck className="w-5 h-5 text-success" />;
    }
  };

  const getStatusBadge = (status: DataSourceStatus) => {
    switch (status) {
      case 'Connected':
        return {
          label: 'Connected',
          border: 'border-success/30',
          bg: 'bg-success/15',
          text: 'text-success',
          dot: 'bg-success',
          isPulsing: true,
        };
      case 'Error':
        return {
          label: 'Sync Error',
          border: 'border-danger/40',
          bg: 'bg-danger/15',
          text: 'text-danger',
          dot: 'bg-danger',
          isPulsing: false,
        };
      case 'Disconnected':
        return {
          label: 'Disconnected',
          border: 'border-border',
          bg: 'bg-surface-2',
          text: 'text-text-muted',
          dot: 'bg-text-muted',
          isPulsing: false,
        };
    }
  };

  return (
    <div className="bg-surface-1 rounded-2xl p-6 sm:p-7 border border-subtle space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-heading font-bold text-lg sm:text-xl text-text-primary">
              Connected Maritime Feeds & Data Sources
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-secondary/15 text-secondary border border-secondary/30">
              4 Upstream Feeds
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Real-time telemetry ingestion pipelines delivering vessel movements, weather patterns, and port authority manifests.
          </p>
        </div>
      </div>

      {/* Sources List */}
      <div className="grid grid-cols-1 gap-4">
        {dataSources.map((source) => {
          const statusInfo = getStatusBadge(source.status);
          const isSyncing = Boolean(syncingIds[source.id]);
          const isErrorExpanded = Boolean(expandedErrors[source.id]);

          return (
            <div
              key={source.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                source.status === 'Error'
                  ? 'bg-surface-2/40 border-danger/40'
                  : 'bg-surface-2/60 border-border/80 hover:border-primary/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: Icon, Name & Description */}
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-surface-3/80 border border-border/60 mt-0.5">
                    {getSourceIcon(source.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-heading font-bold text-sm sm:text-base text-text-primary">
                        {source.name}
                      </h4>
                      {/* Status indicator: green pulse dot for connected, red for error */}
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${statusInfo.border} ${statusInfo.bg} ${statusInfo.text}`}
                      >
                        <span className="relative flex h-2 w-2">
                          {statusInfo.isPulsing && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                          )}
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${statusInfo.dot}`} />
                        </span>
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary mt-1 max-w-xl">
                      {source.description}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] font-mono text-text-muted mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last sync: <span className="text-text-primary">{source.lastSyncTime}</span>
                      </span>
                      <span>•</span>
                      <span>{source.syncInterval}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Sync Now Button & Error expand toggle */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {source.status === 'Error' && source.errorMessage && (
                    <button
                      type="button"
                      onClick={() => toggleErrorExpand(source.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-danger hover:bg-danger/10 border border-danger/30 transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{isErrorExpanded ? 'Hide Error' : 'View Error'}</span>
                      {isErrorExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  {/* Sync Now button */}
                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={() => handleSync(source.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-3 hover:bg-surface-3/80 text-text-primary text-xs font-semibold border border-border transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-primary' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>
              </div>

              {/* Expandable Error Detail State */}
              <AnimatePresence>
                {source.status === 'Error' && source.errorMessage && isErrorExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 pt-3.5 border-t border-danger/30 overflow-hidden"
                  >
                    <div className="p-3.5 rounded-lg bg-danger/10 border border-danger/30 flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <div className="font-semibold text-danger">Upstream Protocol Error</div>
                        <div className="font-mono text-text-secondary leading-relaxed">
                          {source.errorMessage}
                        </div>
                        <div className="text-[11px] font-mono text-text-muted pt-1">
                          Endpoint: {source.endpointUrl}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataSourcesSection;
