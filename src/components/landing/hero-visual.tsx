import { BookOpen, SendHorizontal, Sparkles } from "lucide-react";

function SydneyAvatar({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-secondary text-ring">
        <Sparkles className="size-3" />
      </span>
    );
  }

  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent text-primary-foreground shadow-md shadow-primary/20 ring-1 ring-white/40 dark:ring-white/10">
      <Sparkles className="size-4" />
    </span>
  );
}

export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[32rem] select-none"
    >
      <div className="pointer-events-none absolute inset-x-4 -inset-y-4 rounded-[3rem] bg-primary/10 blur-3xl dark:bg-primary/10" />

      <div className="relative overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/95 shadow-[0_36px_100px_-48px_rgba(2,132,199,0.55)] ring-1 ring-white/50 backdrop-blur-xl motion-safe:animate-[landing-float_10s_ease-in-out_infinite] dark:border-white/10 dark:ring-white/5 dark:shadow-[0_36px_100px_-48px_rgba(0,0,0,0.9)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/10 to-transparent" />

        <div className="relative flex items-center gap-3 border-b border-border/60 px-4 py-4 sm:px-5">
          <SydneyAvatar />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold tracking-tight">
              APIs, simply
            </p>
            <p className="truncate text-[10px] leading-4 text-muted-foreground">
              Sydney · AI companion
            </p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[9px] font-medium tracking-[0.12em] text-ring uppercase sm:inline-flex">
            <BookOpen className="size-3" />
            Learning
          </span>
        </div>

        <div className="relative space-y-4 px-4 py-5 sm:px-5 sm:py-6">
          <div className="flex justify-end">
            <p className="max-w-[88%] rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-[12.5px] leading-5 font-medium text-primary-foreground shadow-sm shadow-primary/20 sm:text-[13px]">
              Explain APIs without the jargon.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <SydneyAvatar compact />
            <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-border/60 bg-secondary/60 px-4 py-3.5">
              <p className="text-[13px] leading-6 text-foreground/90 sm:text-[13.5px]">
                An API is a set of rules that lets two apps talk to each other.
                One app asks for what it needs, and the other sends back just
                that answer.
              </p>
              <p className="mt-2 text-[12.5px] leading-[1.55] text-muted-foreground sm:text-[13px]">
                Think of it like a menu: you choose what you want, and the
                kitchen handles the rest.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <p className="max-w-[88%] rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-[12.5px] leading-5 font-medium text-primary-foreground shadow-sm shadow-primary/20 sm:text-[13px]">
              Perfect. Turn that into a one-line update for my team.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <SydneyAvatar compact />
            <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-border/60 bg-secondary/60 px-4 py-3.5">
              <p className="text-[13px] leading-6 text-foreground/90 sm:text-[13.5px]">
                Our tools can now share information automatically, with no
                manual exports or back-and-forth.
                <span className="animate-caret ml-1 inline-block h-3 w-[2px] translate-y-[1px] rounded-full bg-primary align-middle motion-reduce:hidden" />
              </p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-border/60 bg-background/40 px-3 py-3 sm:px-4">
          <div className="flex items-center gap-3 rounded-full border border-border/70 bg-background/85 py-2 pr-1.5 pl-4 shadow-inner">
            <span className="truncate text-[11px] text-muted-foreground sm:text-[11.5px]">
              Message Sydney...
            </span>
            <span className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              <SendHorizontal className="size-3.5" strokeWidth={2.25} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
