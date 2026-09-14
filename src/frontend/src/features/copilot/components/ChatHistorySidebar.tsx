import React from 'react';
import { Plus, MessageSquare, Trash2, Sparkles, Cpu } from 'lucide-react';
import { ChatSession } from '../types';

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onCloseMobileDrawer?: () => void;
}

export const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onCloseMobileDrawer,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-surface-1 border-r border-subtle">
      {/* Top New Chat Action */}
      <div className="p-4 border-b border-subtle">
        <button
          onClick={() => {
            onNewChat();
            if (onCloseMobileDrawer) onCloseMobileDrawer();
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl gradient-primary text-base font-semibold text-text-primary shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Session History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
        <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
          Recent Inquiries
        </div>

        {sessions.length === 0 ? (
          <div className="p-4 text-center text-xs text-text-muted">
            No past conversations. Click "New Chat" to begin.
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  if (onCloseMobileDrawer) onCloseMobileDrawer();
                }}
                className={`group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'bg-primary/10 border-l-2 border-primary text-text-primary shadow-sm'
                    : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1 pr-2">
                  <MessageSquare
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isActive ? 'text-primary' : 'text-text-muted group-hover:text-primary'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate leading-snug">
                      {session.title || 'Fleet Inquiry'}
                    </div>
                    <div className="text-[11px] text-text-muted truncate mt-0.5">
                      {session.preview || session.updatedAt}
                    </div>
                  </div>
                </div>

                {/* Right: Timestamp or Delete on hover */}
                <div className="flex items-center shrink-0">
                  <span className="text-[10px] font-mono text-text-muted group-hover:hidden">
                    {session.updatedAt}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => onDeleteSession(session.id, e)}
                    title="Delete Chat"
                    className="hidden group-hover:flex items-center justify-center p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom: Powered by IBM Bob Badge */}
      <div className="p-4 border-t border-subtle bg-surface-1/80">
        <div className="p-3 rounded-xl bg-surface-2 border border-subtle flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-text-primary shrink-0 shadow-sm">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-text-primary tracking-wide">IBM Bob</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-primary/20 text-primary uppercase">
                v4.2
              </span>
            </div>
            <p className="text-[10px] text-text-muted truncate flex items-center gap-1 mt-0.5">
              <Sparkles className="w-2.5 h-2.5 text-secondary shrink-0" />
              <span>watsonx.ai Maritime Agent</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
