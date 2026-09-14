export type MessageRole = 'user' | 'assistant';

export interface ExplainableAIInfo {
  modelName: string;
  confidenceScore: number; // e.g. 96 (%)
  latencyMs: number;
  dataSources: string[];
  reasoningSummary: string;
}

export interface CopilotActionChip {
  id: string;
  label: string;
  icon?: string;
  actionType: 'navigate' | 'copy' | 'regenerate' | 'trigger';
  targetPath?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: string; // e.g., "14:24"
  explanation?: ExplainableAIInfo;
  actions?: CopilotActionChip[];
  metadata?: {
    vesselId?: string;
    vesselName?: string;
    berth?: string;
    congestionLevel?: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  updatedAt: string; // e.g. "Just now", "2h ago", "Yesterday"
  messages: ChatMessage[];
  isStarred?: boolean;
}
