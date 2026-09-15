import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  Globe,
  Key,
  Cpu,
  Save,
  Info,
  Sliders,
  Hash,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { IbmBobConfig } from '../types';

export interface IbmBobSectionProps {
  config: IbmBobConfig;
  onSave: (config: IbmBobConfig) => void;
  onTestConnection: () => Promise<boolean>;
}

export const IbmBobSection: React.FC<IbmBobSectionProps> = ({
  config,
  onSave,
  onTestConnection,
}) => {
  const [formData, setFormData] = useState<IbmBobConfig>(config);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [isSliderActive, setIsSliderActive] = useState<boolean>(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleInputChange = (field: keyof IbmBobConfig, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTest = async () => {
    setTestState('testing');
    try {
      const isSuccess = await onTestConnection();
      if (isSuccess) {
        setTestState('success');
        setTimeout(() => setTestState('idle'), 3500);
      } else {
        setTestState('error');
        setTimeout(() => setTestState('idle'), 3500);
      }
    } catch {
      setTestState('error');
      setTimeout(() => setTestState('idle'), 3500);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getTemperatureLabel = (temp: number) => {
    if (temp <= 0.2) return 'Deterministic / High Precision';
    if (temp <= 0.6) return 'Balanced Maritime Copilot';
    return 'Creative / Exploratory';
  };

  return (
    <div className="bg-surface-1 rounded-2xl p-6 sm:p-7 border border-primary/30 shadow-glow-primary relative overflow-hidden space-y-6">
      {/* Background Accent Mesh Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header with Priority Evaluation Emphasis */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/40 text-primary shadow-sm">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-heading font-bold text-xl text-text-primary tracking-tight">
                IBM Bob AI Copilot Configuration
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/15 text-primary border border-primary/30 shadow-sm">
                watsonx.ai Foundation Engine
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-accent/15 text-accent border border-accent/30 font-semibold">
                Priority System Core
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Primary natural language intelligence engine driving real-time berth predictions, AIS route advisories, and harbor risk evaluation.
            </p>
          </div>
        </div>

        {/* Status Indicator (Operational / Disconnected) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold ${
              formData.isConnected
                ? 'bg-success/10 text-success border-success/30'
                : 'bg-danger/10 text-danger border-danger/30'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {formData.isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  formData.isConnected ? 'bg-success' : 'bg-danger'
                }`}
              />
            </span>
            <span>{formData.isConnected ? 'Connected • Operational' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* API Endpoint URL */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-medium text-text-secondary">
              watsonx.ai API Gateway Endpoint URL *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="w-4 h-4 text-text-muted" />
              </div>
              <input
                type="text"
                value={formData.endpointUrl}
                onChange={(e) => handleInputChange('endpointUrl', e.target.value)}
                placeholder="https://us-south.ml.cloud.ibm.com/v1/watsonx/..."
                className="w-full pl-9 pr-4 py-2.5 bg-surface-2 rounded-xl text-xs sm:text-sm font-mono text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                required
              />
            </div>
            <div className="text-[11px] font-mono text-text-muted">
              Region: {formData.region || 'us-south (Dallas Multi-Zone / Watsonx Tier 1)'}
            </div>
          </div>

          {/* API Key with Eye Toggle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-secondary">
              IBM Cloud IAM API Key / Bearer Secret *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="w-4 h-4 text-text-muted" />
              </div>
              <input
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                placeholder="Enter secret API key..."
                className="w-full pl-9 pr-10 py-2.5 bg-surface-2 rounded-xl text-xs sm:text-sm font-mono text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowApiKey((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
                aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-[11px] text-text-muted">
              Stored locally for demo purposes.
            </div>
          </div>

          {/* Model ID / Deployment ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-text-secondary">
              Model ID / Deployment GUID *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Cpu className="w-4 h-4 text-text-muted" />
              </div>
              <input
                type="text"
                value={formData.modelId}
                onChange={(e) => handleInputChange('modelId', e.target.value)}
                placeholder="ibm/granite-13b-maritime-instruct-v2"
                className="w-full pl-9 pr-4 py-2.5 bg-surface-2 rounded-xl text-xs sm:text-sm font-mono text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
                required
              />
            </div>
            <div className="text-[11px] text-text-muted">
              Recommended: <span className="font-mono text-primary">ibm/granite-13b-maritime</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2 p-4 rounded-xl bg-surface-2/60 border border-border/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-primary" />
                <label className="text-xs font-medium text-text-secondary">
                  Temperature: <span className="font-mono font-bold text-text-primary">{formData.temperature.toFixed(2)}</span>
                </label>
              </div>
              <span className="text-[11px] font-mono text-text-muted">
                {getTemperatureLabel(formData.temperature)}
              </span>
            </div>

            {/* Styled range slider with thumb animation */}
            <div className="relative pt-1">
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={formData.temperature}
                onMouseDown={() => setIsSliderActive(true)}
                onMouseUp={() => setIsSliderActive(false)}
                onTouchStart={() => setIsSliderActive(true)}
                onTouchEnd={() => setIsSliderActive(false)}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                className="w-full h-2.5 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${formData.temperature * 100}%, var(--color-surface-3) ${formData.temperature * 100}%, var(--color-surface-3) 100%)`,
                  transform: isSliderActive ? 'scaleY(1.2)' : 'scaleY(1)',
                  transition: 'transform 0.15s ease',
                }}
              />
              <div className="flex justify-between text-[10px] font-mono text-text-muted mt-1">
                <span>0.0 (Precise)</span>
                <span>0.5 (Balanced)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2 p-4 rounded-xl bg-surface-2/60 border border-border/70 flex flex-col justify-between">
            <label className="block text-xs font-medium text-text-secondary">
              Maximum Completion Tokens (Context Budget)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="w-4 h-4 text-text-muted" />
              </div>
              <input
                type="number"
                min="512"
                max="8192"
                step="256"
                value={formData.maxTokens}
                onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value, 10) || 4096)}
                className="w-full pl-9 pr-4 py-2 bg-surface-2 rounded-xl text-xs sm:text-sm font-mono text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
              />
            </div>
            <div className="text-[11px] font-mono text-text-muted">
              Granite 13B context window: Up to 8,192 tokens.
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/25 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs text-text-secondary leading-relaxed">
            <strong className="text-text-primary">System Notice:</strong> IBM Bob powers the AI Copilot and predictive insights. Ensure your watsonx.ai credentials are correct. Latency benchmarks are monitored continuously to maintain sub-200ms maritime dispatch guarantees.
          </div>
        </div>

        {/* Action Buttons: Test Connection & Save Configuration */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs font-mono text-text-muted">
            {formData.lastTestedAt
              ? formData.lastTestedAt.startsWith('Not validated')
                ? formData.lastTestedAt
                : `Last validated: ${formData.lastTestedAt}`
              : 'Not validated (demo)'}
          </div>

          <div className="flex items-center gap-3">
            {/* Test Connection Button with Animation */}
            <button
              type="button"
              disabled={testState === 'testing'}
              onClick={handleTest}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 ${
                testState === 'testing'
                  ? 'bg-surface-2 text-text-muted border-border cursor-wait'
                  : testState === 'success'
                  ? 'bg-success/15 text-success border-success/40'
                  : testState === 'error'
                  ? 'bg-danger/15 text-danger border-danger/40'
                  : 'bg-surface-2 hover:bg-surface-3 text-primary border-primary/40 hover:border-primary shadow-sm hover:scale-[1.02]'
              }`}
            >
              {testState === 'testing' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              {testState === 'success' && <CheckCircle2 className="w-4 h-4 text-success" />}
              {testState === 'error' && <XCircle className="w-4 h-4 text-danger" />}
              {testState === 'idle' && <Server className="w-4 h-4 text-primary" />}
              <span>
                {testState === 'testing'
                  ? 'Testing Watsonx Link...'
                  : testState === 'success'
                  ? 'Connection Verified!'
                  : testState === 'error'
                  ? 'Connection Failed'
                  : 'Test Connection'}
              </span>
            </button>

            {/* Save Configuration Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-xs sm:text-sm font-semibold text-text-primary shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IbmBobSection;
