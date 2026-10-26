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
  getDemoReply,
  type ChatMessage,
  type Conversation,
} from "@/lib/chat";
import { cn } from "@/lib/utils";

const DEMO_REPLY_DELAY = 900;

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
  const pendingIdsRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<Map<string, number>>(new Map());

  const syncPendingState = useCallback(() => {
    setPendingConversationIds(Array.from(pendingIdsRef.current));
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    const pendingIds = pendingIdsRef.current;

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
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

  function handleSend(value: string) {
    const content = value.trim();

    if (!content) {
      return;
    }

    const targetId = activeConversationId ?? createChatId("conversation");

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

    setActiveConversationId(targetId);
    setDraft("");
    pendingIdsRef.current.add(targetId);
    syncPendingState();

    const timer = window.setTimeout(() => {
      const reply: ChatMessage = {
        id: createChatId("message"),
        role: "assistant",
        content: getDemoReply(content),
      };

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === targetId
            ? {
                ...conversation,
                messages: [...conversation.messages, reply],
                updatedAt: "Now",
              }
            : conversation,
        ),
      );

      pendingIdsRef.current.delete(targetId);
      syncPendingState();
      timersRef.current.delete(targetId);
    }, DEMO_REPLY_DELAY);

    timersRef.current.set(targetId, timer);
  }

  function handleNewChat() {
    setActiveConversationId(null);
    setDraft("");
    setIsMobileSidebarOpen(false);
  }

  function handleSelectConversation(id: string) {
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
