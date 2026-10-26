"use client";

import type { FormEvent, KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatComposerProps = {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export function ChatComposer({
  value,
  isSending,
  onChange,
  onSubmit,
}: ChatComposerProps) {
  const canSubmit = value.trim().length > 0 && !isSending;

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
        <div className="rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message your companion..."
            aria-label="Message your companion"
            rows={1}
            className="max-h-40 min-h-12 resize-none border-0 bg-transparent px-2.5 py-2.5 text-sm focus-visible:border-transparent focus-visible:ring-transparent dark:bg-transparent"
          />
          <div className="flex items-center justify-between gap-3 px-1 pt-0.5 pb-0.5">
            <p className="hidden text-[11px] text-muted-foreground sm:block">
              Enter to send · Shift + Enter for a new line
            </p>
            <p className="pl-1.5 text-[11px] text-muted-foreground sm:hidden">
              {isSending ? "Thinking..." : "Session only"}
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
          AI-generated replies may be inaccurate. Only your latest message is
          sent, and conversations reset on refresh.
        </p>
      </form>
    </footer>
  );
}
