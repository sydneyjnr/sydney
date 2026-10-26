"use client";

import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

import type { ChatMessage, Conversation } from "@/lib/chat";
import { cn } from "@/lib/utils";

type ConversationViewProps = {
  conversation: Conversation;
  isPending: boolean;
};

export function ConversationView({
  conversation,
  isPending,
}: ConversationViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messageCount = conversation.messages.length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: messageCount > 1 ? "smooth" : "auto",
      block: "end",
    });
  }, [conversation.id, messageCount, isPending]);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label={`Conversation: ${conversation.title}`}
      className="h-full overflow-y-auto"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-5">
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isPending ? <TypingIndicator /> : null}
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <article
      aria-label={isUser ? "Your message" : "AI Companion message"}
      className={cn("flex items-start gap-3", isUser && "justify-end")}
    >
      {!isUser ? <CompanionAvatar /> : null}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words sm:max-w-[78%]",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-secondary text-secondary-foreground ring-1 ring-border",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </article>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <CompanionAvatar />
      <div
        role="status"
        className="flex min-h-11 items-center rounded-2xl rounded-bl-md bg-secondary px-4 py-3 ring-1 ring-border"
      >
        <span className="sr-only">AI Companion is thinking</span>
        <span aria-hidden="true" className="flex items-center gap-1">
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s] motion-reduce:animate-none" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s] motion-reduce:animate-none" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none" />
        </span>
      </div>
    </div>
  );
}

function CompanionAvatar() {
  return (
    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/20">
      <Sparkles className="size-4" />
    </div>
  );
}
