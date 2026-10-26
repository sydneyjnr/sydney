"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ConversationView } from "@/components/chat/conversation-view";
import { WelcomeScreen } from "@/components/chat/welcome-screen";
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
  type ChatMessage,
  type Conversation,
} from "@/lib/chat";
import { cn } from "@/lib/utils";

class ChatRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatRequestError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getReply(payload: unknown) {
  if (!isRecord(payload) || typeof payload.reply !== "string") {
    return null;
  }

  const reply = payload.reply.trim();
  return reply || null;
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
  const activeConversationIdRef = useRef<string | null>(null);
  const pendingIdsRef = useRef<Set<string>>(new Set());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const isMountedRef = useRef(true);

  const syncPendingState = useCallback(() => {
    setPendingConversationIds(Array.from(pendingIdsRef.current));
  }, []);

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

  async function requestAssistantReply(conversationId: string, prompt: string) {
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
        body: JSON.stringify({ message: prompt }),
        signal: controller.signal,
      });

      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ChatRequestError(
          getRouteErrorMessage(payload, response.status),
        );
      }

      const reply = getReply(payload);

      if (!reply) {
        throw new ChatRequestError(
          "The AI service returned an empty response. Please try again.",
        );
      }

      if (controller.signal.aborted || !isMountedRef.current) {
        return;
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

      const errorMessage =
        error instanceof ChatRequestError
          ? error.message
          : "Could not reach the AI service. Check your connection and try again.";

      appendMessage(conversationId, {
        id: createChatId("message"),
        role: "assistant",
        content: errorMessage,
        isError: true,
        retryPrompt: prompt,
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

    const targetId =
      activeConversationIdRef.current ?? createChatId("conversation");

    if (pendingIdsRef.current.has(targetId)) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createChatId("message"),
      role: "user",
      content,
    };

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
    void requestAssistantReply(targetId, content);
  }

  function handleRetry(
    conversationId: string,
    errorMessageId: string,
    prompt: string,
  ) {
    if (pendingIdsRef.current.has(conversationId)) {
      return;
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: conversation.messages.filter(
                (message) => message.id !== errorMessageId,
              ),
            }
          : conversation,
      ),
    );

    void requestAssistantReply(conversationId, prompt);
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
          onChange={setDraft}
          onSubmit={handleSend}
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
              Browse sample conversations or start a new chat.
            </SheetDescription>
          </SheetHeader>
          <ChatSidebar
            conversations={filteredConversations}
            activeConversationId={activeConversationId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
