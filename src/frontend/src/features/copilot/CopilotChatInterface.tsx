import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Menu,
  X,
  RotateCcw,
  Sparkles,
  Bot,
  Edit2,
  Check,
} from 'lucide-react';
import { ChatSession, ChatMessage } from './types';
import { queryIbmBob, INITIAL_DEMO_SESSIONS } from './bobService';
import { ChatHistorySidebar } from './components/ChatHistorySidebar';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { ChatTypingIndicator } from './components/ChatTypingIndicator';
import { ChatWelcomeState } from './components/ChatWelcomeState';
import { ChatInputArea } from './components/ChatInputArea';

const STORAGE_KEY = 'docknova_copilot_sessions_v1';

export const CopilotChatInterface: React.FC = () => {
  // Initialize sessions from localStorage or default demo sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_DEMO_SESSIONS;
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'new-session';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [tempTitle, setTempTitle] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // ignore
    }
  }, [sessions]);

  // Current active session
  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession ? activeSession.messages : [];

  // Scroll to bottom whenever messages change or loading starts
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages.length, isLoading]);

  // Handler: Create New Chat
  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Fleet Inquiry',
      preview: 'Ask IBM Bob anything...',
      updatedAt: 'Just now',
      messages: [],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  // Handler: Delete Session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);

    if (activeSessionId === sessionId) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  // Handler: Clear Current Chat
  const handleClearChat = () => {
    if (!activeSession) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [], preview: 'Chat cleared' } : s))
    );
  };

  // Handler: Update Chat Title
  const handleSaveTitle = () => {
    if (!tempTitle.trim()) {
      setIsEditingTitle(false);
      return;
    }
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, title: tempTitle.trim() } : s))
    );
    setIsEditingTitle(false);
  };

  // Handler: Send Message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text,
      timestamp: timeStr,
    };

    // Update active session with user message & preview
    let targetSessionId = activeSessionId;
    setSessions((prev) => {
      const exists = prev.some((s) => s.id === targetSessionId);
      if (!exists) {
        const created: ChatSession = {
          id: targetSessionId,
          title: text.slice(0, 32) + (text.length > 32 ? '...' : ''),
          preview: text,
          updatedAt: 'Just now',
          messages: [userMsg],
        };
        return [created, ...prev];
      }

      return prev.map((s) => {
        if (s.id === targetSessionId) {
          const isFirstMessage = s.messages.length === 0;
          return {
            ...s,
            title: isFirstMessage ? text.slice(0, 32) + (text.length > 32 ? '...' : '') : s.title,
            preview: text.slice(0, 48) + '...',
            updatedAt: 'Just now',
            messages: [...s.messages, userMsg],
          };
        }
        return s;
      });
    });

    setIsLoading(true);

    try {
      const response = await queryIbmBob(text);

      const aiMsg: ChatMessage = {
        id: `msg-bob-${Date.now()}`,
        role: 'assistant',
        text: response.text,
        timestamp: new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date()),
        explanation: response.explanation,
        actions: response.actions,
      };

      setSessions((prev) =>
        prev.map((s) => (s.id === targetSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
      );
    } catch (err) {
      console.error('IBM Bob query error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler: Regenerate last AI response
  const handleRegenerate = () => {
    if (messages.length < 2 || isLoading) return;
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.text);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] -m-4 sm:-m-6 flex overflow-hidden bg-base">
      {/* DESKTOP LEFT SIDEBAR */}
      <div className="hidden md:block w-72 lg:w-80 h-full shrink-0">
        <ChatHistorySidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-base/80 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-surface-1 z-50 md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-subtle">
                <span className="font-heading font-bold text-text-primary text-sm flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span>IBM Bob History</span>
                </span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatHistorySidebar
                  sessions={sessions}
                  activeSessionId={activeSessionId}
                  onSelectSession={setActiveSessionId}
                  onNewChat={handleNewChat}
                  onDeleteSession={handleDeleteSession}
                  onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* RIGHT CHAT AREA */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-base">
        {/* Chat Header */}
        <div className="h-16 px-4 sm:px-6 bg-surface-1/70 backdrop-blur-md border-b border-subtle flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl bg-surface-2 border border-subtle text-text-secondary hover:text-text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Title Display or Inline Editor */}
            {isEditingTitle ? (
              <div className="flex items-center gap-2 min-w-0">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  autoFocus
                  className="bg-surface-2 border border-primary px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold text-text-primary focus:outline-none"
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-1 rounded bg-primary text-base hover:opacity-90"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-bold text-sm sm:text-base text-text-primary truncate">
                      {activeSession?.title || 'Fleet Inquiry'}
                    </h2>
                    <button
                      onClick={() => {
                        setTempTitle(activeSession?.title || '');
                        setIsEditingTitle(true);
                      }}
                      title="Edit Chat Title"
                      className="p-1 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-text-muted font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span>IBM Bob Online</span>
                    <span className="hidden sm:inline text-text-subtle">•</span>
                    <span className="hidden sm:inline">Tuas TOS & AIS Active</span>
                  </div>
                </div>
              </div>
            )}
          </div>

            {/* Clear Chat Button */}
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  title="Clear Chat Messages"
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-surface-2 hover:bg-surface-3 border border-subtle text-text-muted hover:text-text-primary text-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear Chat</span>
                </button>
              )}
            </div>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-36 scrollbar-thin">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <ChatWelcomeState onSelectPrompt={handleSendMessage} />
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessageBubble
                    key={message.id}
                    message={message}
                    onRegenerate={handleRegenerate}
                  />
                ))}

                {/* Typing Indicator */}
                {isLoading && <ChatTypingIndicator />}
              </>
            )}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Fixed Bottom Input Area */}
        <ChatInputArea
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};
