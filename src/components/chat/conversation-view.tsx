"use client";

import { useEffect, useRef } from "react";
import { CircleAlert, RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ChatMessage, Conversation } from "@/lib/chat";
import { cn } from "@/lib/utils";

type ConversationViewProps = {
  conversation: Conversation;
  isPending: boolean;
  onRetry: (
    conversationId: string,
    errorMessageId: string,
    prompt: string,
  ) => void;
};

export function ConversationView({
  conversation,
  isPending,
  onRetry,
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
          {conversation.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isPending={isPending}
              canRetry={conversation.usage.canSend}
              isLastMessage={index === conversation.messages.length - 1}
              onRetry={(errorMessageId, prompt) =>
                onRetry(conversation.id, errorMessageId, prompt)
              }
            />
          ))}
          {isPending ? <TypingIndicator /> : null}
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isPending,
  canRetry,
  isLastMessage,
  onRetry,
}: {
  message: ChatMessage;
  isPending: boolean;
  canRetry: boolean;
  isLastMessage: boolean;
  onRetry: (messageId: string, prompt: string) => void;
}) {
  const isUser = message.role === "user";
  const isError = !isUser && message.isError;

  return (
    <article
      role={isError ? "alert" : undefined}
      aria-label={
        isUser
          ? "Your message"
          : isError
            ? "Sydney error"
            : "Sydney message"
      }
      className={cn("flex items-start gap-3", isUser && "justify-end")}
    >
      {!isUser ? (
        isError ? (
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
            <CircleAlert className="size-4" />
          </div>
        ) : (
          <SydneyAvatar />
        )
      ) : null}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words sm:max-w-[78%]",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : isError
              ? "rounded-bl-md bg-destructive/5 text-foreground ring-1 ring-destructive/25"
              : "rounded-bl-md bg-secondary text-secondary-foreground ring-1 ring-border",
        )}
      >
        {isError ? (
          <>
            <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
              <CircleAlert className="size-3.5" />
              Response failed
            </p>
            <p className="mt-1.5 whitespace-pre-wrap">{message.content}</p>
            {message.retryPrompt && isLastMessage && canRetry ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => onRetry(message.id, message.retryPrompt!)}
                className="mt-3 h-8 bg-background/70"
              >
                <RotateCcw className="size-3.5" />
                Try again
              </Button>
            ) : null}
          </>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </article>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <SydneyAvatar />
      <div
        role="status"
        className="flex min-h-11 items-center rounded-2xl rounded-bl-md bg-secondary px-4 py-3 ring-1 ring-border"
      >
        <span className="sr-only">Sydney is thinking</span>
        <span aria-hidden="true" className="flex items-center gap-1">
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s] motion-reduce:animate-none" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s] motion-reduce:animate-none" />
          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 motion-reduce:animate-none" />
        </span>
      </div>
    </div>
  );
}

function SydneyAvatar() {
  return (
    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/20">
      <Sparkles className="size-4" />
    </div>
  );
}
