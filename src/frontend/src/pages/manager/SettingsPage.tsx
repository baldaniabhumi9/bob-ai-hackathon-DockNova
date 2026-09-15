import React, { useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  ControlTowerSettings,
  DEFAULT_SETTINGS,
  RECOMMENDATION_MODE_OPTIONS,
  MOCK_PORT_OPERATIONS,
  RecommendationMode,
} from '@/features/settings';

/**
 * Lightweight toggle switch, styled to match the existing DockNova design tokens.
 * No new component library / package introduced — plain React + inline styles,
 * consistent with the rest of the UI kit (Button, Badge, Card, etc.).
 */
const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md }}>
    <span style={{ fontSize: '0.875rem', color: colors.primaryText }}>{label}</span>
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: radius.full,
        border: `1px solid ${checked ? colors.novaCyan : colors.surfaceBorder}`,
        backgroundColor: checked ? 'rgba(34, 211, 238, 0.25)' : colors.background,
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.2s ease',
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: checked ? colors.novaCyan : colors.secondaryText,
          transition: 'left 0.2s ease',
          boxShadow: checked ? `0 0 6px ${colors.novaCyan}` : 'none',
        }}
      />
    </button>
  </div>
);

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ControlTowerSettings>(DEFAULT_SETTINGS);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const updateSetting = <K extends keyof ControlTowerSettings>(key: K, value: ControlTowerSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Frontend-only mock save; no backend integration.
    setShowSavedMessage(true);
    window.setTimeout(() => setShowSavedMessage(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: colors.primaryText }}>
          Control Tower Settings
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: colors.secondaryText }}>
          Configure alerts, prediction thresholds, and operational preferences.
        </p>
      </div>

      {/* 1. Congestion Alerts */}
      <Card title="Congestion Alerts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md }}>
            <Input
              label="Critical Risk Threshold (%)"
              type="number"
              min={0}
              max={100}
              value={settings.criticalRiskThreshold}
              onChange={(e) => updateSetting('criticalRiskThreshold', Number(e.target.value))}
            />
            <Input
              label="High Risk Threshold (%)"
              type="number"
              min={0}
              max={100}
              value={settings.highRiskThreshold}
              onChange={(e) => updateSetting('highRiskThreshold', Number(e.target.value))}
            />
            <Input
              label="Alert Lead Time (hours)"
              type="number"
              min={0}
              value={settings.alertLeadTimeHours}
              onChange={(e) => updateSetting('alertLeadTimeHours', Number(e.target.value))}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, paddingTop: spacing.sm, borderTop: `1px solid ${colors.surfaceBorder}` }}>
            <ToggleSwitch
              label="Enable critical congestion alerts"
              checked={settings.enableCriticalAlerts}
              onChange={(v) => updateSetting('enableCriticalAlerts', v)}
            />
            <ToggleSwitch
              label="Enable vessel delay alerts"
              checked={settings.enableVesselDelayAlerts}
              onChange={(v) => updateSetting('enableVesselDelayAlerts', v)}
            />
          </div>
        </div>
      </Card>

      {/* 2. AI Recommendations */}
      <Card title="AI Recommendations">
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <ToggleSwitch
              label="Show AI recommendations"
              checked={settings.showAiRecommendations}
              onChange={(v) => updateSetting('showAiRecommendations', v)}
            />
            <ToggleSwitch
              label="Prioritise congestion reduction"
              checked={settings.prioritiseCongestionReduction}
              onChange={(v) => updateSetting('prioritiseCongestionReduction', v)}
            />
            <ToggleSwitch
              label="Prioritise vessel delay reduction"
              checked={settings.prioritiseDelayReduction}
              onChange={(v) => updateSetting('prioritiseDelayReduction', v)}
            />
          </div>

          <div style={{ paddingTop: spacing.sm, borderTop: `1px solid ${colors.surfaceBorder}`, maxWidth: '320px' }}>
            <Select
              label="Recommendation Mode"
              value={settings.recommendationMode}
              onChange={(e) => updateSetting('recommendationMode', e.target.value as RecommendationMode)}
              options={RECOMMENDATION_MODE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
            />
          </div>
        </div>
      </Card>

      {/* 3. Port Operations */}
      <Card title="Port Operations">
        <div style={{ marginBottom: spacing.md, display: 'flex', justifyContent: 'flex-end' }}>
          <Badge variant="warning">Simulated</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText, marginBottom: '4px' }}>Port</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.primaryText }}>{MOCK_PORT_OPERATIONS.port}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText, marginBottom: '4px' }}>Planning Horizon</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.primaryText }}>{MOCK_PORT_OPERATIONS.planningHorizon}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: colors.secondaryText, marginBottom: '4px' }}>Timezone</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.primaryText }}>{MOCK_PORT_OPERATIONS.timezone}</div>
          </div>
        </div>
      </Card>

      {/* 4. Notifications */}
      <Card title="Notifications">
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
          <ToggleSwitch
            label="In-app alerts"
            checked={settings.inAppAlerts}
            onChange={(v) => updateSetting('inAppAlerts', v)}
          />
          <ToggleSwitch
            label="High-risk berth notifications"
            checked={settings.highRiskBerthNotifications}
            onChange={(v) => updateSetting('highRiskBerthNotifications', v)}
          />
          <ToggleSwitch
            label="AI action recommendations"
            checked={settings.aiActionRecommendations}
            onChange={(v) => updateSetting('aiActionRecommendations', v)}
          />
        </div>
      </Card>

      {/* 5. Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
        {showSavedMessage && (
          <span style={{ fontSize: '0.8125rem', color: colors.success, fontWeight: 600 }}>
            ✅ Settings saved successfully.
          </span>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
