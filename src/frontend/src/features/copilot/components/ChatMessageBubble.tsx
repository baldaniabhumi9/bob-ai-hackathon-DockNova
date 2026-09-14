import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  User,
  Copy,
  Check,
  RotateCw,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
  Database,
  Cpu,
} from 'lucide-react';
import { ChatMessage, CopilotActionChip } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onRegenerate?: () => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message, onRegenerate }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActionClick = (chip: CopilotActionChip) => {
    if (chip.actionType === 'copy') {
      handleCopy(message.text);
    } else if (chip.actionType === 'regenerate' && onRegenerate) {
      onRegenerate();
    } else if (chip.targetPath) {
      navigate(chip.targetPath);
    }
  };

  // Helper to parse markdown-like text (code blocks, bold, bullet points)
  const renderFormattedText = (rawText: string) => {
    // Check if there are code blocks ```
    const parts = rawText.split(/(```[\s\S]*?```)/g);

    return parts.map((part, pIdx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Strip out the ```language and trailing ```
        const contentLines = part.slice(3, -3).trim().split('\n');
        const firstLine = contentLines[0].trim();
        const codeBody = ['text', 'json', 'bash', 'sql'].includes(firstLine)
          ? contentLines.slice(1).join('\n')
          : contentLines.join('\n');

        return (
          <div
            key={pIdx}
            className="my-3 p-3.5 rounded-xl bg-surface-3 border border-subtle font-mono text-[11px] sm:text-xs text-primary overflow-x-auto leading-relaxed"
          >
            <pre className="whitespace-pre">{codeBody}</pre>
          </div>
        );
      }

      // Format bullet lines and paragraphs
      const lines = part.split('\n');
      return (
        <div key={pIdx} className="space-y-1.5">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={lIdx} className="h-1" />;

            // Bullet line
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-1 text-xs sm:text-[13px] leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{renderInlineStyles(trimmed.slice(2))}</span>
                </div>
              );
            }

            // Numbered list
            const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
            if (numMatch) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-1 text-xs sm:text-[13px] leading-relaxed">
                  <span className="font-mono text-primary font-bold shrink-0">{numMatch[1]}.</span>
                  <span>{renderInlineStyles(numMatch[2])}</span>
                </div>
              );
            }

            // Normal paragraph
            return (
              <p key={lIdx} className="text-xs sm:text-[13px] leading-relaxed">
                {renderInlineStyles(trimmed)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  // Helper for bold and inline code
  const renderInlineStyles = (str: string) => {
    // Regex matches **bold** or `code`
    const tokens = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return tokens.map((token, idx) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return (
          <strong key={idx} className="font-bold text-text-primary">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={idx} className="px-1.5 py-0.5 rounded bg-surface-3 font-mono text-[11px] text-primary">
            {token.slice(1, -1)}
          </code>
        );
      }
      return token;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 w-full py-1 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-secondary via-primary to-accent flex items-center justify-center text-text-primary shrink-0 shadow-glow-primary/30 mt-1">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-2xl`}>
        {/* Main Message Bubble */}
        <div
          className={`p-4 rounded-2xl shadow-sm text-sm transition-all duration-200 ${
            isUser
              ? 'bg-primary text-base font-medium rounded-tr-sm text-text-primary shadow-glow-primary/20'
              : 'bg-surface-2 text-text-primary rounded-tl-sm border border-subtle'
          }`}
        >
          {isUser ? (
            <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">{message.text}</p>
          ) : (
            <div>{renderFormattedText(message.text)}</div>
          )}
        </div>

        {/* AI Features Footer: Timestamp, Explainable AI badge & Action Chips */}
        {!isUser && (
          <div className="mt-2.5 flex flex-col gap-2 w-full">
            {/* Timestamp & Explainable AI Badge */}
            <div className="flex items-center gap-3 text-[11px] text-text-muted px-1">
              <span className="font-mono">{message.timestamp}</span>

              {message.explanation && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-3 border border-subtle hover:border-primary/40 text-text-secondary hover:text-primary transition-colors text-[10px]"
                  >
                    <ShieldCheck className="w-3 h-3 text-success" />
                    <span>Why this answer?</span>
                    <span className="text-[9px] font-mono text-primary font-bold">
                      {message.explanation.confidenceScore}%
                    </span>
                  </button>

                  {/* Explainable AI Popover / Tooltip */}
                  {showExplanation && (
                    <div className="absolute left-0 top-6 z-40 w-72 sm:w-80 p-3.5 rounded-xl bg-surface-1 border border-border shadow-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-1.5 border-b border-subtle">
                        <span className="font-semibold text-text-primary flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-secondary" />
                          <span>{message.explanation.modelName}</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold font-mono">
                          {message.explanation.confidenceScore}% confidence
                        </span>
                      </div>

                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        {message.explanation.reasoningSummary}
                      </p>

                      <div className="pt-1.5 border-t border-subtle">
                        <div className="text-[10px] uppercase tracking-wider text-text-muted font-bold flex items-center gap-1 mb-1">
                          <Database className="w-3 h-3" />
                          <span>Telemetry Sources</span>
                        </div>
                        <ul className="space-y-1 text-[10px] text-text-muted">
                          {message.explanation.dataSources.map((ds, dIdx) => (
                            <li key={dIdx} className="flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-primary" />
                              <span>{ds}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Chips */}
            {message.actions && message.actions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 px-1">
                {message.actions.map((chip) => {
                  const isCopy = chip.actionType === 'copy';
                  const isRegen = chip.actionType === 'regenerate';

                  return (
                    <button
                      key={chip.id}
                      onClick={() => handleActionClick(chip)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-1 border border-subtle hover:border-primary hover:bg-surface-3 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-all duration-150 shadow-sm"
                    >
                      {isCopy ? (
                        copied ? (
                          <Check className="w-3.5 h-3.5 text-success" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-primary" />
                        )
                      ) : isRegen ? (
                        <RotateCw className="w-3.5 h-3.5 text-secondary" />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      )}
                      <span>{isCopy && copied ? 'Copied!' : chip.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* User Timestamp */}
        {isUser && (
          <span className="mt-1 mr-1 text-[10px] font-mono text-text-muted">{message.timestamp}</span>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-9 h-9 rounded-xl bg-surface-2 border border-subtle flex items-center justify-center text-text-secondary shrink-0 mt-1">
          <User className="w-5 h-5" />
        </div>
      )}
    </motion.div>
  );
};
