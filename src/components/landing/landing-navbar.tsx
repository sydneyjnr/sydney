import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <nav
        aria-label="Primary navigation"
        className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 md:grid-cols-[1fr_auto_1fr]"
      >
        <Link
          href="/"
          aria-label="Sydney home"
          className="group flex items-center gap-2.5 justify-self-start rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Sydney
          </span>
        </Link>

        <div className="hidden items-center gap-1 justify-self-center md:flex">
          <a
            href="#what-it-does"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            What it does
          </a>
          <a
            href="#details"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            The details
          </a>
        </div>

        <div className="flex items-center gap-1.5 justify-self-end sm:gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="lg"
            className="h-10 rounded-full px-4 text-sm shadow-sm"
          >
            <Link href="/chat">
              Open chat
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
