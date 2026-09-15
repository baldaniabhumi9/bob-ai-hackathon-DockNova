import React, { useRef, useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  MOCK_COPILOT_CONTEXT,
  COPILOT_QUICK_PROMPTS,
  COPILOT_WELCOME_TITLE,
  COPILOT_WELCOME_BODY,
  getMockCopilotResponse,
  CopilotMessage,
  CopilotAction,
  CopilotActionId,
} from '@/features/copilot';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { useLiveOperations } from '@/hooks/useLiveOperations';

export interface CopilotPageProps {
  onNavigate?: (id: string) => void;
}

let messageIdCounter = 0;
const nextMessageId = () => {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}`;
};

export const CopilotPage: React.FC<CopilotPageProps> = ({ onNavigate }) => {
  const { state, congestion } = useLiveOperations();
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const context = {
    currentCongestion: congestion ? `${Math.round(congestion.congestionProbability * 100)}% (${congestion.riskLevel})` : MOCK_COPILOT_CONTEXT.currentCongestion,
    criticalBerth: congestion?.hotspot?.berthName ? `Berth ${congestion.hotspot.berthName}` : MOCK_COPILOT_CONTEXT.criticalBerth,
    vesselsAtRisk: state ? state.vessels.filter((v) => v.status === 'WAITING').length : MOCK_COPILOT_CONTEXT.vesselsAtRisk,
    craneAvailability: state ? `${state.cranes.filter((c) => c.status === 'IDLE').length}/${state.cranes.length} Active` : MOCK_COPILOT_CONTEXT.craneAvailability,
    planningHorizon: MOCK_COPILOT_CONTEXT.planningHorizon,
  };

  const scrollToBottom = () => {
    window.setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const askQuestion = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const userMessage: CopilotMessage = { id: nextMessageId(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);
    scrollToBottom();

    // Mock "thinking" delay, then respond using DockNova operational data.
    window.setTimeout(() => {
      const { text, actions } = getMockCopilotResponse(trimmed);
      const assistantMessage: CopilotMessage = {
        id: nextMessageId(),
        role: 'assistant',
        text,
        actions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsThinking(false);
      scrollToBottom();
    }, 700);
  };

  const handleSend = () => askQuestion(inputValue);

  const handleAction = (actionId: CopilotActionId) => {
    switch (actionId) {
      case 'view_berth_b4':
        onNavigate?.('berths');
        break;
      case 'view_vessel_ocean_star':
        onNavigate?.('vessels');
        break;
      case 'run_what_if':
        if (onNavigate) {
          onNavigate('simulation');
        } else {
          setIsWhatIfOpen(true);
        }
        break;
      case 'open_plan72h':
        onNavigate?.('plan72h');
        break;
      default:
        break;
    }
  };

  const renderActions = (actions?: CopilotAction[]) => {
    if (!actions || actions.length === 0) return null;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm }}>
        {actions.map((action) => (
          <Button key={action.id} variant="secondary" size="sm" onClick={() => handleAction(action.id)}>
            {action.label}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          border: `1px solid ${colors.surfaceBorder}`,
          padding: spacing.md,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: spacing.sm,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: colors.primaryText }}>
            AI Port Copilot
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: colors.secondaryText }}>
            Ask DockNova about port operations, risks, and recommended actions.
          </p>
        </div>
        <Badge variant="cyan">COPILOT ONLINE</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: spacing.lg, alignItems: 'start' }}>
        {/* Left: Conversation */}
        <div
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            border: `1px solid ${colors.surfaceBorder}`,
            display: 'flex',
            flexDirection: 'column',
            height: '600px',
          }}
        >
          {/* Message list */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: spacing.lg,
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  backgroundColor: colors.background,
                  borderRadius: radius.md,
                  border: `1px solid ${colors.surfaceBorder}`,
                  padding: spacing.lg,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.md,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <span style={{ fontSize: '1.5rem' }}>🧭</span>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: colors.primaryText }}>
                    {COPILOT_WELCOME_TITLE}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.875rem', color: colors.secondaryText, lineHeight: 1.6 }}>
                  {COPILOT_WELCOME_BODY}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm, marginTop: spacing.xs }}>
                  {COPILOT_QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => askQuestion(prompt)}
                      style={{
                        textAlign: 'left',
                        backgroundColor: colors.surface,
                        color: colors.novaCyan,
                        border: `1px solid ${colors.surfaceBorder}`,
                        borderRadius: radius.md,
                        padding: `${spacing.sm} ${spacing.md}`,
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    backgroundColor: message.role === 'user' ? colors.electricBlueGlow : colors.background,
                    border: `1px solid ${message.role === 'user' ? 'rgba(59, 130, 246, 0.3)' : colors.surfaceBorder}`,
                    borderRadius: radius.md,
                    padding: spacing.md,
                  }}
                >
                  {message.role === 'assistant' && (
                    <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: colors.novaCyan, marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      DockNova Copilot
                    </div>
                  )}
                  <p style={{ margin: 0, fontSize: '0.875rem', color: colors.primaryText, lineHeight: 1.6 }}>
                    {message.text}
                  </p>
                  {message.role === 'assistant' && renderActions(message.actions)}
                </div>
              </div>
            ))}

            {isThinking && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
                <div
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.surfaceBorder}`,
                    borderRadius: radius.md,
                    padding: spacing.md,
                    fontSize: '0.8125rem',
                    color: colors.secondaryText,
                  }}
                >
                  DockNova Copilot is analysing port data…
                </div>
              </div>
            )}
          </div>

          {/* Input row */}
          <div
            style={{
              borderTop: `1px solid ${colors.surfaceBorder}`,
              padding: spacing.md,
              display: 'flex',
              gap: spacing.sm,
            }}
          >
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask about congestion, vessels, berths, cranes, or the 72-hour plan…"
              style={{
                flex: 1,
                backgroundColor: colors.background,
                color: colors.primaryText,
                border: `1px solid ${colors.surfaceBorder}`,
                borderRadius: radius.md,
                padding: `${spacing.sm} ${spacing.md}`,
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <Button variant="primary" onClick={handleSend} disabled={!inputValue.trim()}>
              Send
            </Button>
          </div>
        </div>

        {/* Right: Operational Context */}
        <div
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            border: `1px solid ${colors.surfaceBorder}`,
            padding: spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.primaryText }}>
              Operational Context
            </span>
            <Badge variant={state || congestion ? 'success' : 'warning'}>
              {state || congestion ? 'LIVE API' : 'Simulated'}
            </Badge>
          </div>

          {[
            { label: 'Current Congestion', value: context.currentCongestion, variant: 'warning' as const },
            { label: 'Critical Berth', value: context.criticalBerth, variant: 'critical' as const },
            { label: 'Vessels at Risk', value: String(context.vesselsAtRisk), variant: 'warning' as const },
            { label: 'Crane Availability', value: context.craneAvailability, variant: 'success' as const },
            { label: 'Planning Horizon', value: context.planningHorizon, variant: 'cyan' as const },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: colors.background,
                borderRadius: radius.sm,
                border: `1px solid ${colors.surfaceBorder}`,
                padding: spacing.md,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>{item.label}</span>
              <Badge variant={item.variant}>{item.value}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Fallback What-If modal if no nav callback supplied */}
      <WhatIfSimulatorModal isOpen={isWhatIfOpen} onClose={() => setIsWhatIfOpen(false)} />
    </div>
  );
};

export default CopilotPage;
