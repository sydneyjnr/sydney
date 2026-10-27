"use client";

import { Menu } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type ChatHeaderProps = {
  title?: string;
  onOpenMobileSidebar: () => void;
};

export function ChatHeader({ title, onOpenMobileSidebar }: ChatHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-3 backdrop-blur-sm sm:px-5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onOpenMobileSidebar}
        aria-label="Open conversations"
        className="text-muted-foreground lg:hidden"
      >
        <Menu className="size-4" />
      </Button>

      {title ? (
        <div className="min-w-0 pl-1">
          <p className="truncate text-sm font-medium">{title}</p>
        </div>
      ) : null}

      <div className="ml-auto flex items-center gap-1.5">
        <span className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
          <span className="size-1.5 rounded-full bg-primary" />
          Online
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
