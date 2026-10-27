import type { TokenUsage } from "@/lib/token-budget";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  isError?: boolean;
  retryPrompt?: string;
  excludeFromHistory?: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
  usage: TokenUsage;
};

export type PendingMessageEdit = {
  messageId: string;
  content: string;
  clearedCount: number;
};

export type EditFeedback = {
  tone: "info" | "error";
  text: string;
};

export const MAX_MESSAGE_LENGTH = 4_000;
export const MAX_CONVERSATION_TITLE_LENGTH = 80;

export const starterPrompts = [
  {
    id: "clarity",
    title: "Make sense of a thought",
    description: "Untangle what is on your mind, one piece at a time.",
    prompt: "Help me untangle what is on my mind right now.",
  },
  {
    id: "routine",
    title: "Plan a calm evening",
    description: "Create a gentle wind-down routine that actually fits.",
    prompt: "Help me plan a calm evening routine that helps me switch off.",
  },
  {
    id: "explain",
    title: "Explain something simply",
    description: "Make a big idea feel approachable and clear.",
    prompt: "Explain a big idea to me like I am curious but completely new to it.",
  },
  {
    id: "perspective",
    title: "See a fresh perspective",
    description: "Look at a situation from a different angle.",
    prompt: "Help me see a problem from a fresh perspective.",
  },
] as const;

export function getConversationTitle(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "New conversation";
  }

  if (normalized.length <= 42) {
    return normalized;
  }

  return `${normalized.slice(0, 41).trimEnd()}…`;
}

export function normalizeConversationTitle(value: string) {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_CONVERSATION_TITLE_LENGTH)
    .trimEnd();
}

export function createChatId(prefix: "conversation" | "message") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
