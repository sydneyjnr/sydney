"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { CircleAlert, SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatTokenCount, type TokenUsage } from "@/lib/token-budget";
import { cn } from "@/lib/utils";

type ChatComposerProps = {
  value: string;
  isSending: boolean;
  tokenUsage: TokenUsage;
  isBudgetExhausted: boolean;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onNewChat: () => void;
};

export function ChatComposer({
  value,
  isSending,
  tokenUsage,
  isBudgetExhausted,
  onChange,
  onSubmit,
  onNewChat,
}: ChatComposerProps) {
  const canSubmit = value.trim().length > 0 && !isSending && !isBudgetExhausted;
  const boundedUsedTokens = Math.min(
    tokenUsage.usedTokens,
    tokenUsage.limitTokens,
  );
  const usedPercentage =
    tokenUsage.limitTokens > 0
      ? Math.min(
          100,
          Math.round((tokenUsage.usedTokens / tokenUsage.limitTokens) * 100),
        )
      : 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onSubmit(value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();

      if (canSubmit) {
        onSubmit(value);
      }
    }
  }

  return (
    <footer className="shrink-0 border-t border-border bg-background px-3 pt-3 pb-3 sm:px-6 sm:pb-5">
      <form
        onSubmit={handleSubmit}
        aria-busy={isSending}
        className="mx-auto w-full max-w-3xl"
      >
        {isBudgetExhausted ? (
          <div
            role="status"
            className="mb-2 flex flex-col gap-2 rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="flex items-start gap-2 text-muted-foreground">
              <CircleAlert className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              <span>
                <span className="font-medium text-foreground">
                  This conversation has reached its usable token limit.
                </span>{" "}
                Start a new chat to continue.
              </span>
            </p>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={onNewChat}
              className="shrink-0 bg-background/70"
            >
              New chat
            </Button>
          </div>
        ) : null}

        <div className="mb-2 px-0.5">
          <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <span className="font-medium tracking-wide">Token budget</span>
            <span id="conversation-token-budget" className="tabular-nums">
              {formatTokenCount(tokenUsage.usedTokens)} /{" "}
              {formatTokenCount(tokenUsage.limitTokens)} used ·{" "}
              {formatTokenCount(tokenUsage.remainingTokens)} remaining
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Conversation token budget"
            aria-valuemin={0}
            aria-valuemax={tokenUsage.limitTokens}
            aria-valuenow={boundedUsedTokens}
            aria-valuetext={`${formatTokenCount(tokenUsage.usedTokens)} of ${formatTokenCount(tokenUsage.limitTokens)} tokens used, ${formatTokenCount(tokenUsage.remainingTokens)} remaining`}
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-300",
                isBudgetExhausted ? "bg-destructive" : "bg-primary",
              )}
              style={{ width: `${usedPercentage}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isBudgetExhausted
                ? "Start a new chat to continue..."
                : "Message Sydney..."
            }
            aria-label="Message Sydney"
            aria-describedby="conversation-token-budget"
            disabled={isBudgetExhausted}
            maxLength={4_000}
            rows={1}
            className="max-h-40 min-h-12 resize-none border-0 bg-transparent px-2.5 py-2.5 text-sm focus-visible:border-transparent focus-visible:ring-transparent dark:bg-transparent"
          />
          <div className="flex items-center justify-between gap-3 px-1 pt-0.5 pb-0.5">
            <p className="hidden text-[11px] text-muted-foreground sm:block">
              Enter to send · Shift + Enter for a new line
            </p>
            <p className="pl-1.5 text-[11px] text-muted-foreground sm:hidden">
              {isSending
                ? "Thinking..."
                : isBudgetExhausted
                  ? "Budget reached"
                  : "Session only"}
            </p>
            <Button
              type="submit"
              size="icon"
              disabled={!canSubmit}
              aria-label="Send message"
              className="size-9 shrink-0 rounded-full shadow-sm"
            >
              <SendHorizontal className="size-4" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Sydney is not always correct.
        </p>
      </form>
    </footer>
  );
}
