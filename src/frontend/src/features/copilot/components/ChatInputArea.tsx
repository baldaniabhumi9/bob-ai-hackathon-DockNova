import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, Sparkles, CornerDownLeft } from 'lucide-react';

interface ChatInputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  onSendMessage,
  isLoading,
  inputRef: externalInputRef,
}) => {
  const [inputText, setInputText] = useState('');
  const internalInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = externalInputRef || internalInputRef;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface-1/90 backdrop-blur-md border-t border-subtle z-30">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2.5 p-1.5 rounded-full bg-surface-2 border border-subtle focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 shadow-lg"
        >
          {/* Attachment Paperclip Button (Visual feature) */}
          <button
            type="button"
            title="Attach Voyage Manifest or AIS Log"
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-3 transition-colors shrink-0 ml-1"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Main Input Text Field */}
          <input
            ref={activeInputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask IBM Bob anything about your fleet (e.g. berth ETA, congestion, reroutes)..."
            className="flex-1 bg-transparent px-2 py-2 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-text-primary shrink-0 transition-all duration-200 mr-1 ${
              inputText.trim() && !isLoading
                ? 'gradient-primary shadow-glow-primary hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-surface-3 text-text-muted opacity-40 cursor-not-allowed'
            }`}
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        </form>

        {/* Input Disclaimer & Hotkey Note */}
        <div className="flex items-center justify-between px-3 pt-2 text-[10px] text-text-muted">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-secondary" />
            <span>IBM Bob Watsonx Enterprise Engine</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-subtle font-mono text-[9px] text-text-secondary">
              Enter ↵
            </kbd>
            <span>to send</span>
          </span>
        </div>
      </div>
    </div>
  );
};
