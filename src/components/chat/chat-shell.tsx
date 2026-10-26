"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ConversationView } from "@/components/chat/conversation-view";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  createChatId,
  demoConversations,
  getConversationTitle,
  normalizeConversationTitle,
  type ChatMessage,
  type Conversation,
} from "@/lib/chat";
import {
  createEmptyTokenUsage,
  MAX_HISTORY_MESSAGES,
  type TokenUsage,
} from "@/lib/token-budget";
import { cn } from "@/lib/utils";

type ApiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

class ChatRequestError extends Error {
  readonly canRetry: boolean;

  constructor(message: string, canRetry = true) {
    super(message);
    this.name = "ChatRequestError";
    this.canRetry = canRetry;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNonNegativeInteger(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return Math.round(value);
}

function getReply(payload: unknown) {
  if (!isRecord(payload) || typeof payload.reply !== "string") {
    return null;
  }

  const reply = payload.reply.trim();
  return reply || null;
}

function getTokenUsage(payload: unknown): TokenUsage | null {
  if (!isRecord(payload) || !isRecord(payload.usage)) {
    return null;
  }

  const usage = payload.usage;
  const usedTokens = toNonNegativeInteger(usage.usedTokens);
  const inputTokens = toNonNegativeInteger(usage.inputTokens);
  const outputTokens = toNonNegativeInteger(usage.outputTokens);
  const limitTokens = toNonNegativeInteger(usage.limitTokens);
  const remainingTokens = toNonNegativeInteger(usage.remainingTokens);

  if (
    usedTokens === null ||
    inputTokens === null ||
    outputTokens === null ||
    limitTokens === null ||
    remainingTokens === null ||
    limitTokens === 0 ||
    typeof usage.canSend !== "boolean"
  ) {
    return null;
  }

  return {
    usedTokens,
    inputTokens,
    outputTokens,
    limitTokens,
    remainingTokens,
    canSend: usage.canSend,
  };
}

function getRouteErrorMessage(payload: unknown, status: number) {
  if (
    isRecord(payload) &&
    typeof payload.error === "string" &&
    payload.error.trim()
  ) {
    return payload.error;
  }

  if (status === 429) {
    return "The AI service is busy right now. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return "The AI service is temporarily unavailable. Please try again.";
  }

  return "The request could not be completed. Please try again.";
}

function isRetryableResponse(status: number, code: string | null) {
  if (code?.startsWith("CONVERSATION_BUDGET_")) {
    return false;
  }

  return status === 408 || status === 429 || status >= 500;
}

function getRequestError(payload: unknown, status: number) {
  const code =
    isRecord(payload) && typeof payload.code === "string"
      ? payload.code
      : null;

  return new ChatRequestError(
    getRouteErrorMessage(payload, status),
    isRetryableResponse(status, code),
  );
}

function toApiMessage(message: ChatMessage): ApiChatMessage {
  return { role: message.role, content: message.content };
}

function buildRequestMessages(
  conversation: Conversation | undefined,
  nextUserMessage?: string,
) {
  const messages = conversation
    ? conversation.messages
        .filter(
          (message) => !message.isError && !message.excludeFromHistory,
        )
        .map(toApiMessage)
    : [];

  if (nextUserMessage !== undefined) {
    messages.push({ role: "user", content: nextUserMessage });
  }

  if (messages.length <= MAX_HISTORY_MESSAGES) {
    return messages;
  }

  const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

  while (recentMessages.length > 0 && recentMessages[0].role !== "user") {
    recentMessages.shift();
  }

  return recentMessages;
}

export function ChatShell() {
  const [conversations, setConversations] =
    useState<Conversation[]>(demoConversations);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [draft, setDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingConversationIds, setPendingConversationIds] = useState<
    string[]
  >([]);
  const [deleteCandidate, setDeleteCandidate] =
    useState<Conversation | null>(null);
  const conversationsRef = useRef<Conversation[]>(demoConversations);
  const activeConversationIdRef = useRef<string | null>(null);
  const pendingIdsRef = useRef<Set<string>>(new Set());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const isMountedRef = useRef(true);

  const syncPendingState = useCallback(() => {
    setPendingConversationIds(Array.from(pendingIdsRef.current));
  }, []);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  useEffect(() => {
    isMountedRef.current = true;
    const controllers = abortControllersRef.current;
    const pendingIds = pendingIdsRef.current;

    return () => {
      isMountedRef.current = false;
      controllers.forEach((controller) => controller.abort());
      controllers.clear();
      pendingIds.clear();
    };
  }, []);

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(query),
    );
  }, [conversations, searchQuery]);

  const activeConversation =
    conversations.find(
      (conversation) => conversation.id === activeConversationId,
    ) ?? null;

  const isReplyPending = activeConversation
    ? pendingConversationIds.includes(activeConversation.id)
    : false;

  const activeTokenUsage =
    activeConversation?.usage ?? createEmptyTokenUsage();
  const isBudgetExhausted = activeConversation
    ? !activeConversation.usage.canSend
    : false;

  function appendMessage(conversationId: string, message: ChatMessage) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, message],
              updatedAt: "Now",
            }
          : conversation,
      ),
    );
  }

  function updateConversationUsage(
    conversationId: string,
    usage: TokenUsage,
  ) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, usage }
          : conversation,
      ),
    );
  }

  function markMessageExcluded(conversationId: string, messageId: string) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === messageId
                  ? { ...message, excludeFromHistory: true }
                  : message,
              ),
            }
          : conversation,
      ),
    );
  }

  async function requestAssistantReply(
    conversationId: string,
    requestMessages: ApiChatMessage[],
    prompt: string,
    userMessageId: string | null,
  ) {
    if (pendingIdsRef.current.has(conversationId)) {
      return;
    }

    const controller = new AbortController();
    abortControllersRef.current.set(conversationId, controller);
    pendingIdsRef.current.add(conversationId);
    syncPendingState();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationId, messages: requestMessages }),
        signal: controller.signal,
      });

      const payload: unknown = await response.json().catch(() => null);

      if (controller.signal.aborted || !isMountedRef.current) {
        return;
      }

      const usage = getTokenUsage(payload);

      if (usage) {
        updateConversationUsage(conversationId, usage);
      }

      if (!response.ok) {
        throw getRequestError(payload, response.status);
      }

      const reply = getReply(payload);

      if (!reply) {
        throw new ChatRequestError(
          "The AI service returned an empty response. Please try again.",
        );
      }

      appendMessage(conversationId, {
        id: createChatId("message"),
        role: "assistant",
        content: reply,
      });
    } catch (error) {
      if (controller.signal.aborted || !isMountedRef.current) {
        return;
      }

      const requestError =
        error instanceof ChatRequestError ? error : null;
      const errorMessage =
        requestError?.message ??
        "Could not reach the AI service. Check your connection and try again.";

      if (requestError && !requestError.canRetry && userMessageId) {
        markMessageExcluded(conversationId, userMessageId);
      }

      appendMessage(conversationId, {
        id: createChatId("message"),
        role: "assistant",
        content: errorMessage,
        isError: true,
        retryPrompt:
          requestError?.canRetry === false ? undefined : prompt,
      });
    } finally {
      abortControllersRef.current.delete(conversationId);
      pendingIdsRef.current.delete(conversationId);

      if (isMountedRef.current) {
        syncPendingState();
      }
    }
  }

  function handleSend(value: string) {
    const content = value.trim();

    if (!content) {
      return;
    }

    const activeId = activeConversationIdRef.current;
    const existingConversation = activeId
      ? conversationsRef.current.find(
          (conversation) => conversation.id === activeId,
        )
      : undefined;

    if (existingConversation && !existingConversation.usage.canSend) {
      return;
    }

    const targetId =
      existingConversation?.id ?? createChatId("conversation");

    if (pendingIdsRef.current.has(targetId)) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createChatId("message"),
      role: "user",
      content,
    };
    const requestMessages = buildRequestMessages(
      existingConversation,
      content,
    );

    setConversations((current) => {
      const exists = current.some(
        (conversation) => conversation.id === targetId,
      );

      if (!exists) {
        return [
          {
            id: targetId,
            title: getConversationTitle(content),
            messages: [userMessage],
            updatedAt: "Now",
            usage: createEmptyTokenUsage(),
          },
          ...current,
        ];
      }

      return current.map((conversation) =>
        conversation.id === targetId
          ? {
              ...conversation,
              messages: [...conversation.messages, userMessage],
              updatedAt: "Now",
            }
          : conversation,
      );
    });

    activeConversationIdRef.current = targetId;
    setActiveConversationId(targetId);
    setDraft("");
    void requestAssistantReply(
      targetId,
      requestMessages,
      content,
      userMessage.id,
    );
  }

  function handleRetry(
    conversationId: string,
    errorMessageId: string,
    prompt: string,
  ) {
    if (pendingIdsRef.current.has(conversationId)) {
      return;
    }

    const conversation = conversationsRef.current.find(
      (item) => item.id === conversationId,
    );

    if (!conversation || !conversation.usage.canSend) {
      return;
    }

    const requestMessages = buildRequestMessages(conversation);

    if (
      requestMessages.length === 0 ||
      requestMessages[requestMessages.length - 1].role !== "user"
    ) {
      return;
    }

    setConversations((current) =>
      current.map((item) =>
        item.id === conversationId
          ? {
              ...item,
              messages: item.messages.filter(
                (message) => message.id !== errorMessageId,
              ),
            }
          : item,
      ),
    );

    void requestAssistantReply(
      conversationId,
      requestMessages,
      prompt,
      null,
    );
  }

  function handleNewChat() {
    activeConversationIdRef.current = null;
    setActiveConversationId(null);
    setDraft("");
    setIsMobileSidebarOpen(false);
  }

  function handleSelectConversation(id: string) {
    activeConversationIdRef.current = id;
    setActiveConversationId(id);
    setDraft("");
    setIsMobileSidebarOpen(false);
  }

  function handleRenameConversation(conversationId: string, title: string) {
    const normalizedTitle = normalizeConversationTitle(title);

    if (!normalizedTitle) {
      return;
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, title: normalizedTitle }
          : conversation,
      ),
    );
  }

  function handleRequestDeleteConversation(conversation: Conversation) {
    setDeleteCandidate(conversation);
  }

  function handleConfirmDeleteConversation() {
    const conversation = deleteCandidate;
    setDeleteCandidate(null);

    if (!conversation) {
      return;
    }

    const conversationId = conversation.id;
    abortControllersRef.current.get(conversationId)?.abort();

    const current = conversationsRef.current;
    const deletedIndex = current.findIndex(
      (item) => item.id === conversationId,
    );

    if (deletedIndex === -1) {
      return;
    }

    const remaining = current.filter(
      (item) => item.id !== conversationId,
    );

    conversationsRef.current = remaining;
    setConversations(remaining);

    if (activeConversationIdRef.current === conversationId) {
      const nextConversation =
        remaining[Math.min(deletedIndex, remaining.length - 1)] ?? null;

      activeConversationIdRef.current = nextConversation?.id ?? null;
      setActiveConversationId(nextConversation?.id ?? null);
      setDraft("");
    }

    void fetch(
      `/api/chat?conversationId=${encodeURIComponent(conversationId)}`,
      { method: "DELETE" },
    ).catch(() => undefined);
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <aside
        aria-label="Conversation sidebar"
        className={cn(
          "hidden shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-out lg:flex",
          isSidebarCollapsed ? "w-[76px]" : "w-[288px]",
        )}
      >
        <ChatSidebar
          conversations={filteredConversations}
          activeConversationId={activeConversationId}
          searchQuery={searchQuery}
          collapsed={isSidebarCollapsed}
          onSearchChange={setSearchQuery}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onRenameConversation={handleRenameConversation}
          onDeleteConversation={handleRequestDeleteConversation}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          title={activeConversation?.title ?? "New conversation"}
          isSidebarCollapsed={isSidebarCollapsed}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onToggleSidebar={() => setIsSidebarCollapsed((current) => !current)}
        />

        <main className="min-h-0 flex-1 overflow-hidden">
          {activeConversation ? (
            <ConversationView
              conversation={activeConversation}
              isPending={isReplyPending}
              onRetry={handleRetry}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <WelcomeScreen onSelectPrompt={handleSend} />
            </div>
          )}
        </main>

        <ChatComposer
          value={draft}
          isSending={isReplyPending}
          tokenUsage={activeTokenUsage}
          isBudgetExhausted={isBudgetExhausted}
          onChange={setDraft}
          onSubmit={handleSend}
          onNewChat={handleNewChat}
        />
      </div>

      <Sheet
        open={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
      >
        <SheetContent
          side="left"
          className="w-[88%] max-w-xs gap-0 border-sidebar-border bg-sidebar p-0 sm:max-w-xs"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Conversations</SheetTitle>
            <SheetDescription>
              Browse your conversations or start a new chat.
            </SheetDescription>
          </SheetHeader>
          <ChatSidebar
            conversations={filteredConversations}
            activeConversationId={activeConversationId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onRenameConversation={handleRenameConversation}
            onDeleteConversation={handleRequestDeleteConversation}
          />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={deleteCandidate !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteCandidate(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteCandidate
                ? `“${deleteCandidate.title}” and its messages will be removed from this session. This cannot be undone.`
                : "This conversation and its messages will be removed from this session."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDeleteConversation}
            >
              Delete conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
