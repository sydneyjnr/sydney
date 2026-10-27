"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  CircleAlert,
  Copy,
  Pencil,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_MESSAGE_LENGTH,
  type ChatMessage,
  type Conversation,
  type EditFeedback,
  type PendingMessageEdit,
} from "@/lib/chat";
import { cn } from "@/lib/utils";

type ConversationViewProps = {
  conversation: Conversation;
  isPending: boolean;
  pendingEdit: PendingMessageEdit | null;
  editFeedback: EditFeedback | null;
  onRetry: (
    conversationId: string,
    errorMessageId: string,
    prompt: string,
  ) => void;
  onEditMessage: (messageId: string, content: string) => boolean;
  onDismissEditFeedback: () => void;
};

type CopyFeedback = {
  messageId: string;
  status: "copied" | "failed";
};

async function copyTextToClipboard(text: string) {
  let copied = false;

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      copied = false;
    }
  }

  if (copied) {
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  document.body.removeChild(textarea);
  return copied;
}

export function ConversationView({
  conversation,
  isPending,
  pendingEdit,
  editFeedback,
  onRetry,
  onEditMessage,
  onDismissEditFeedback,
}: ConversationViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const copyFeedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isMountedRef = useRef(true);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editStartError, setEditStartError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null);

  const pendingEditIndex = pendingEdit
    ? conversation.messages.findIndex(
        (message) =>
          message.id === pendingEdit.messageId && message.role === "user",
      )
    : -1;
  const hasPendingEdit = pendingEditIndex !== -1;
  const visibleMessages = hasPendingEdit
    ? conversation.messages.slice(0, pendingEditIndex + 1)
    : conversation.messages;
  const messageCount = visibleMessages.length;
  const editDisabledReason = !conversation.usage.canSend
    ? "This conversation has reached its token budget."
    : isPending
      ? "Wait for Sydney to finish replying."
      : undefined;

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      if (copyFeedbackTimerRef.current) {
        clearTimeout(copyFeedbackTimerRef.current);
        copyFeedbackTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: messageCount > 1 ? "smooth" : "auto",
      block: "end",
    });
  }, [conversation.id, messageCount, isPending, editFeedback?.text]);

  function showCopyFeedback(
    messageId: string,
    status: CopyFeedback["status"],
  ) {
    if (copyFeedbackTimerRef.current) {
      clearTimeout(copyFeedbackTimerRef.current);
    }

    setCopyFeedback({ messageId, status });
    copyFeedbackTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setCopyFeedback(null);
      }
    }, 2_000);
  }

  async function handleCopy(message: ChatMessage) {
    const copied = await copyTextToClipboard(message.content);

    if (!isMountedRef.current) {
      return;
    }

    showCopyFeedback(message.id, copied ? "copied" : "failed");
  }

  function startEditing(message: ChatMessage) {
    setEditingMessageId(message.id);
    setEditValue(message.content);
    setEditStartError(null);
  }

  function cancelEditing() {
    setEditingMessageId(null);
    setEditValue("");
    setEditStartError(null);
  }

  function saveEditing(message: ChatMessage) {
    const content = editValue.trim();

    if (
      !content ||
      editValue.length > MAX_MESSAGE_LENGTH ||
      content === message.content.trim()
    ) {
      return;
    }

    const started = onEditMessage(message.id, content);

    if (!started) {
      setEditStartError("Could not start regenerating. Please try again.");
      return;
    }

    cancelEditing();
  }

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label={`Conversation: ${conversation.title}`}
      className="h-full overflow-y-auto"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-5">
          {visibleMessages.map((message, index) => {
            if (message.role === "user") {
              const isEditedMessage =
                hasPendingEdit && message.id === pendingEdit?.messageId;
              const displayedMessage =
                isEditedMessage && pendingEdit
                  ? { ...message, content: pendingEdit.content }
                  : message;

              return (
                <UserMessageBubble
                  key={message.id}
                  message={displayedMessage}
                  isEditing={!hasPendingEdit && editingMessageId === message.id}
                  isPendingEdit={isEditedMessage}
                  editValue={editValue}
                  editStartError={editStartError}
                  canEdit={
                    conversation.usage.canSend && !isPending && !hasPendingEdit
                  }
                  editDisabledReason={editDisabledReason}
                  copyStatus={
                    copyFeedback?.messageId === message.id
                      ? copyFeedback.status
                      : null
                  }
                  onStartEdit={() => startEditing(message)}
                  onCancelEdit={cancelEditing}
                  onEditValueChange={(value) => {
                    setEditValue(value);
                    setEditStartError(null);
                  }}
                  onSaveEdit={() => saveEditing(message)}
                  onCopy={() => void handleCopy(message)}
                />
              );
            }

            return (
              <AssistantMessageBubble
                key={message.id}
                message={message}
                isPending={isPending}
                canRetry={conversation.usage.canSend}
                isLastMessage={index === visibleMessages.length - 1}
                onRetry={(messageId, prompt) =>
                  onRetry(conversation.id, messageId, prompt)
                }
              />
            );
          })}
          {isPending ? <TypingIndicator /> : null}
        </div>

        {editFeedback ? (
          <EditFeedbackBanner
            feedback={editFeedback}
            onDismiss={onDismissEditFeedback}
          />
        ) : null}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function UserMessageBubble({
  message,
  isEditing,
  isPendingEdit,
  editValue,
  editStartError,
  canEdit,
  editDisabledReason,
  copyStatus,
  onStartEdit,
  onCancelEdit,
  onEditValueChange,
  onSaveEdit,
  onCopy,
}: {
  message: ChatMessage;
  isEditing: boolean;
  isPendingEdit: boolean;
  editValue: string;
  editStartError: string | null;
  canEdit: boolean;
  editDisabledReason?: string;
  copyStatus: CopyFeedback["status"] | null;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
  onSaveEdit: () => void;
  onCopy: () => void;
}) {
  const trimmedValue = editValue.trim();
  const isEmpty = trimmedValue.length === 0;
  const isTooLong = editValue.length > MAX_MESSAGE_LENGTH;
  const isUnchanged = trimmedValue === message.content.trim();
  const canSave = !isEmpty && !isTooLong && !isUnchanged;
  const editErrorId = `edit-error-${message.id}`;
  const validationMessage = editStartError
    ? editStartError
    : isEmpty
      ? "Message cannot be empty."
      : isTooLong
        ? `Message must be ${MAX_MESSAGE_LENGTH.toLocaleString("en-US")} characters or fewer.`
        : isUnchanged
          ? "Make a change to save."
          : null;

  return (
    <article
      aria-label="Your message"
      tabIndex={0}
      onClick={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest("button, textarea, input, a")
        ) {
          return;
        }

        if (window.matchMedia("(hover: none)").matches) {
          event.currentTarget.focus();
        }
      }}
      className="group/user flex flex-col items-end gap-1.5 rounded-2xl outline-none"
    >
      {isEditing ? (
        <div className="w-full max-w-[85%] rounded-2xl rounded-br-md border border-border bg-card p-3 text-foreground shadow-sm sm:max-w-[78%]">
          <Textarea
            value={editValue}
            onChange={(event) => onEditValueChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                onCancelEdit();
              }
            }}
            autoFocus
            maxLength={MAX_MESSAGE_LENGTH}
            rows={3}
            aria-label="Edit your message"
            aria-invalid={isEmpty || isTooLong}
            aria-describedby={validationMessage ? editErrorId : undefined}
            className="max-h-60 min-h-24 resize-none bg-background text-foreground"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              {validationMessage ? (
                <p
                  id={editErrorId}
                  role={
                    editStartError || isEmpty || isTooLong
                      ? "alert"
                      : undefined
                  }
                  className={cn(
                    "text-[11px]",
                    editStartError || isEmpty || isTooLong
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {validationMessage}
                </p>
              ) : null}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {editValue.length.toLocaleString("en-US")} /{" "}
                {MAX_MESSAGE_LENGTH.toLocaleString("en-US")}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!canSave}
                  onClick={onSaveEdit}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-fit max-w-[85%] rounded-2xl transition-shadow group-focus-visible/user:ring-2 group-focus-visible/user:ring-ring/40 group-focus-visible/user:ring-offset-2 group-focus-visible/user:ring-offset-background sm:max-w-[78%]">
            <div className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed break-words text-primary-foreground">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {!isPendingEdit ? (
              <div
                role="group"
                aria-label="Message actions"
                className={cn(
                  "absolute top-full right-0 z-10 mt-0.5 flex items-center gap-0.5 rounded-lg border border-border bg-background/95 p-0.5 shadow-md backdrop-blur-sm",
                  "pointer-events-none translate-y-1 opacity-0 transition-[opacity,transform] duration-150 ease-out",
                  "group-hover/user:pointer-events-auto group-hover/user:translate-y-0 group-hover/user:opacity-100",
                  "group-focus-within/user:pointer-events-auto group-focus-within/user:translate-y-0 group-focus-within/user:opacity-100",
                  "motion-reduce:transition-none",
                )}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="gap-1 px-2 text-[11px] text-muted-foreground"
                  onClick={onCopy}
                  aria-label="Copy your message"
                >
                  {copyStatus === "copied" ? (
                    <Check className="size-3.5" />
                  ) : copyStatus === "failed" ? (
                    <X className="size-3.5" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  {copyStatus === "copied"
                    ? "Copied"
                    : copyStatus === "failed"
                      ? "Copy failed"
                      : "Copy"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  className="gap-1 px-2 text-[11px] text-muted-foreground"
                  onClick={onStartEdit}
                  disabled={!canEdit}
                  title={editDisabledReason}
                  aria-label="Edit your message"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
              </div>
            ) : null}
          </div>
          {!isPendingEdit ? (
            <span role="status" aria-live="polite" className="sr-only">
              {copyStatus === "copied"
                ? "Message copied"
                : copyStatus === "failed"
                  ? "Could not copy message"
                  : ""}
            </span>
          ) : null}
        </>
      )}
    </article>
  );
}

function AssistantMessageBubble({
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
  const isError = message.isError === true;

  return (
    <article
      role={isError ? "alert" : undefined}
      aria-label={isError ? "Sydney error" : "Sydney message"}
      className="flex items-start gap-3"
    >
      {isError ? (
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-1 ring-destructive/20">
          <CircleAlert className="size-4" />
        </div>
      ) : (
        <SydneyAvatar />
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words sm:max-w-[78%]",
          isError
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

function EditFeedbackBanner({
  feedback,
  onDismiss,
}: {
  feedback: EditFeedback;
  onDismiss: () => void;
}) {
  const isError = feedback.tone === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border px-3 py-2.5 text-xs",
        isError
          ? "border-destructive/25 bg-destructive/5 text-destructive"
          : "border-border bg-muted/40 text-muted-foreground",
      )}
    >
      {isError ? (
        <CircleAlert className="mt-0.5 size-3.5 shrink-0" />
      ) : (
        <Check className="mt-0.5 size-3.5 shrink-0" />
      )}
      <p className="min-w-0 flex-1 leading-relaxed">{feedback.text}</p>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="-mt-0.5 shrink-0"
        onClick={onDismiss}
        aria-label="Dismiss edit message"
      >
        <X className="size-3.5" />
      </Button>
    </div>
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
