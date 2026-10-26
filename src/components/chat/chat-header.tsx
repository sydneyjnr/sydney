"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ChatHeaderProps = {
  title: string;
  isSidebarCollapsed: boolean;
  onOpenMobileSidebar: () => void;
  onToggleSidebar: () => void;
};

export function ChatHeader({
  title,
  isSidebarCollapsed,
  onOpenMobileSidebar,
  onToggleSidebar,
}: ChatHeaderProps) {
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

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            className="hidden text-muted-foreground lg:inline-flex"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        </TooltipContent>
      </Tooltip>

      <div className="min-w-0 pl-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="hidden text-xs text-muted-foreground sm:block">
          AI chat · session only
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <span className="hidden items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline-flex">
          <span className="size-1.5 rounded-full bg-primary" />
          Live AI
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
