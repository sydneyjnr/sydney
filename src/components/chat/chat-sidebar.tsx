"use client";

import { MessageSquare, Plus, Search, Settings, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Conversation } from "@/lib/chat";
import { cn } from "@/lib/utils";

type ChatSidebarProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  searchQuery: string;
  collapsed?: boolean;
  onSearchChange: (value: string) => void;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
};

export function ChatSidebar({
  conversations,
  activeConversationId,
  searchQuery,
  collapsed = false,
  onSearchChange,
  onNewChat,
  onSelectConversation,
}: ChatSidebarProps) {
  if (collapsed) {
    return (
      <div className="flex h-full w-full flex-col items-center py-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
          <Sparkles className="size-5" />
        </div>
        <div className="mt-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                onClick={onNewChat}
                aria-label="Start a new chat"
                className="shadow-sm"
              >
                <Plus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">New chat</TooltipContent>
          </Tooltip>
        </div>
        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex size-8 items-center justify-center">
                <span className="size-2 rounded-full bg-primary" />
                <span className="sr-only">AI chat</span>
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">
              AI chat with session-only history
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20">
          <Sparkles className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">AI Companion</p>
          <p className="truncate text-xs text-muted-foreground">
            A calmer place to think
          </p>
        </div>
      </div>

      <div className="px-3">
        <Button
          type="button"
          size="lg"
          onClick={onNewChat}
          className="h-10 w-full justify-start gap-2 rounded-xl shadow-sm"
        >
          <Plus className="size-4" />
          New chat
        </Button>
      </div>

      <div className="mt-4 px-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search conversations"
            aria-label="Search conversations"
            className="h-9 bg-background/70 pl-8 text-sm"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between px-4 pb-1.5">
        <span className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Sample chats
        </span>
        <span className="rounded-full bg-background/70 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-sidebar-border">
          Examples
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pt-1 pb-2">
        {conversations.length === 0 ? (
          <p className="px-3 py-8 text-center text-xs leading-relaxed text-muted-foreground">
            No conversations match your search.
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {conversations.map((conversation) => {
              const isActive = conversation.id === activeConversationId;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => onSelectConversation(conversation.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring/50",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                  )}
                >
                  <MessageSquare
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-sidebar-foreground",
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {conversation.title}
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">
                    {conversation.updatedAt}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <div className="mb-2 rounded-xl border border-sidebar-border bg-background/55 p-3">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" />
            <p className="text-xs font-medium">Session only</p>
          </div>
          <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
            AI replies may be inaccurate. Conversations reset when you refresh.
          </p>
        </div>
        <div
          aria-disabled="true"
          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground"
        >
          <Settings className="size-4" />
          <span>Settings</span>
          <span className="ml-auto rounded-full bg-background/70 px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-sidebar-border">
            Soon
          </span>
        </div>
      </div>
    </div>
  );
}
