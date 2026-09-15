import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Plug,
  Sparkles,
  Server,
  Activity,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  ShieldCheck,
} from 'lucide-react';
import {
  IbmBobConfig,
  DataSource,
  ModelParameters,
  IntegrationLog,
} from './types';
import {
  INITIAL_IBM_BOB_CONFIG,
  INITIAL_DATA_SOURCES,
  INITIAL_MODEL_PARAMETERS,
  INITIAL_INTEGRATION_LOGS,
  INTEGRATION_STORAGE_KEYS,
} from './mockIntegrations';
import { IbmBobSection } from './components/IbmBobSection';
import { DataSourcesSection } from './components/DataSourcesSection';
import { ModelParametersSection } from './components/ModelParametersSection';
import { SystemLogsSection } from './components/SystemLogsSection';
import { Toast, ToastType } from '@/features/auth/components/Toast';
import { Badge } from '@/components/ui/Badge';

export const IntegrationsView: React.FC = () => {
  // 1. IBM Bob Configuration State (persisted to localStorage)
  const [bobConfig, setBobConfig] = useState<IbmBobConfig>(() => {
    try {
      const saved = localStorage.getItem(INTEGRATION_STORAGE_KEYS.IBM_BOB);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_IBM_BOB_CONFIG;
  });

  // 2. Data Sources State (persisted to localStorage)
  const [dataSources, setDataSources] = useState<DataSource[]>(() => {
    try {
      const saved = localStorage.getItem(INTEGRATION_STORAGE_KEYS.DATA_SOURCES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DATA_SOURCES;
  });

  // 3. Model Parameters State (persisted to localStorage)
  const [modelParams, setModelParams] = useState<ModelParameters>(() => {
    try {
      const saved = localStorage.getItem(INTEGRATION_STORAGE_KEYS.MODEL_PARAMS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MODEL_PARAMETERS;
  });

  // 4. System Logs State (retains at least 20 logs)
  const [logs, setLogs] = useState<IntegrationLog[]>(INITIAL_INTEGRATION_LOGS);

  // 5. Toast Feedback State
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: ToastType;
  }>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({
      isVisible: true,
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(INTEGRATION_STORAGE_KEYS.IBM_BOB, JSON.stringify(bobConfig));
  }, [bobConfig]);

  useEffect(() => {
    localStorage.setItem(INTEGRATION_STORAGE_KEYS.DATA_SOURCES, JSON.stringify(dataSources));
  }, [dataSources]);

  useEffect(() => {
    localStorage.setItem(INTEGRATION_STORAGE_KEYS.MODEL_PARAMS, JSON.stringify(modelParams));
  }, [modelParams]);

  // Handler: Test IBM Bob Connection (Simulates API Call with setTimeout)
  const handleTestBobConnection = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validate that endpoint and API key are provided
        if (bobConfig.endpointUrl && bobConfig.apiKey && bobConfig.apiKey.length > 5) {
          const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
          const newLog: IntegrationLog = {
            id: `log-test-${Date.now()}`,
            timestamp,
            service: 'IBM Bob Copilot',
            status: 'Success',
            message: `Simulated watsonx.ai handshake verified for ${bobConfig.modelId}. Latency: 138ms. Ready for demo inference.`,
            latencyMs: 138,
          };

          setLogs((prev) => [newLog, ...prev.slice(0, 24)]);
          setBobConfig((prev) => ({
            ...prev,
            isConnected: true,
            lastTestedAt: timestamp,
          }));

          showToast(
            'watsonx.ai link verified (demo): IBM Bob Copilot foundation model is active in simulation mode (138ms latency).',
            'success'
          );
          resolve(true);
        } else {
          const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
          const errorLog: IntegrationLog = {
            id: `log-test-${Date.now()}`,
            timestamp,
            service: 'IBM Bob Copilot',
            status: 'Error',
            message: 'Simulated watsonx.ai authentication failed: Missing or malformed Bearer Token.',
            latencyMs: 940,
          };
          setLogs((prev) => [errorLog, ...prev.slice(0, 24)]);
          showToast(
            'Connection failed: Unable to authenticate with watsonx endpoint. Check API Key.',
            'error'
          );
          resolve(false);
        }
      }, 1400);
    });
  };

  // Handler: Save IBM Bob Configuration
  const handleSaveBobConfig = (newConfig: IbmBobConfig) => {
    setBobConfig(newConfig);
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const newLog: IntegrationLog = {
      id: `log-save-${Date.now()}`,
      timestamp,
      service: 'IBM Bob Copilot',
      status: 'Info',
      message: `Simulated copilot hyperparameter update: Temp=${newConfig.temperature.toFixed(2)}, MaxTokens=${newConfig.maxTokens}, Model=${newConfig.modelId}.`,
      latencyMs: 45,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 24)]);
    showToast('IBM Bob configuration saved successfully. Watsonx parameters updated.', 'success');
  };

  // Handler: Sync Specific Data Source
  const handleSyncDataSource = async (sourceId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

        setDataSources((prev) =>
          prev.map((src) => {
            if (src.id === sourceId) {
              return {
                ...src,
                lastSyncTime: 'Not connected — demo data',
                status: 'Simulated',
                errorMessage: undefined,
              };
            }
            return src;
          })
        );

        const targetSource = dataSources.find((s) => s.id === sourceId);
        const sourceName = targetSource ? targetSource.name : 'Data Source';

        const newLog: IntegrationLog = {
          id: `log-sync-${Date.now()}`,
          timestamp,
          service: targetSource?.type === 'ais' ? 'AIS Stream' : targetSource?.type === 'weather' ? 'Weather API' : targetSource?.type === 'schedule' ? 'Portnet API' : 'Customs API',
          status: 'Success',
          message: `Simulated manual synchronization completed for [${sourceName}]. Demo data frame delivery verified.`,
          latencyMs: 110,
        };
        setLogs((prev) => [newLog, ...prev.slice(0, 24)]);

        showToast(`Synchronized ${sourceName} successfully (demo).`, 'success');
        resolve();
      }, 950);
    });
  };

  // Handler: Update Model Parameters
  const handleModelParametersChange = (newParams: ModelParameters) => {
    setModelParams(newParams);
    showToast('Model parameters updated and applied to real-time simulator.', 'success');
  };

  // Handler: Reset to Defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all integrations, data sources, and model parameters to factory defaults?')) {
      localStorage.removeItem(INTEGRATION_STORAGE_KEYS.IBM_BOB);
      localStorage.removeItem(INTEGRATION_STORAGE_KEYS.DATA_SOURCES);
      localStorage.removeItem(INTEGRATION_STORAGE_KEYS.MODEL_PARAMS);

      setBobConfig(INITIAL_IBM_BOB_CONFIG);
      setDataSources(INITIAL_DATA_SOURCES);
      setModelParams(INITIAL_MODEL_PARAMETERS);
      setLogs(INITIAL_INTEGRATION_LOGS);

      showToast('All integration configurations restored to initial factory defaults.', 'warning');
    }
  };

  // Framer Motion Entrance Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };

  return (
    <div className="space-y-6">
      {/* Global Notification Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-1 p-6 rounded-2xl border border-subtle">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/30 text-primary">
              <Plug className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-2xl text-text-primary tracking-tight">
              Integrations & AI Configuration
            </h2>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary/15 text-primary border border-primary/30 shadow-sm">
              watsonx.ai Active
            </span>
            <Badge variant="warning">Simulated Data</Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary">
            Manage IBM Bob foundation model connectivity, upstream AIS & telemetry feeds, inference hyperparameters, and operational telemetry logs.
          </p>
        </div>

        {/* Quick Actions & Status */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-text-primary text-xs font-medium border border-border transition-all"
            title="Restore original factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border border-border text-xs font-mono text-text-secondary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-warning" />
            </span>
            <span>Demo mode</span>
          </div>
        </div>
      </div>

      {/* Main Sections with Stagger Entrance */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* 1. IBM Bob Section (Priority evaluation) */}
        <motion.div variants={itemVariants}>
          <IbmBobSection
            config={bobConfig}
            onSave={handleSaveBobConfig}
            onTestConnection={handleTestBobConnection}
          />
        </motion.div>

        {/* 2. Data Sources Section */}
        <motion.div variants={itemVariants}>
          <DataSourcesSection
            dataSources={dataSources}
            onSyncSource={handleSyncDataSource}
          />
        </motion.div>

        {/* 3. Model Parameters Section */}
        <motion.div variants={itemVariants}>
          <ModelParametersSection
            parameters={modelParams}
            onChange={handleModelParametersChange}
          />
        </motion.div>

        {/* 4. System Logs Section (Collapsible) */}
        <motion.div variants={itemVariants}>
          <SystemLogsSection
            logs={logs}
            onRefresh={() => {
              showToast('Refreshed telemetry and integration logs.', 'success');
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IntegrationsView;
