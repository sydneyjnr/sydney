import {
  ArrowUp,
  BookOpen,
  FileText,
  Lightbulb,
  MessageSquareText,
  PenLine,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const features: Array<{
  label: string;
  icon: LucideIcon;
  delay: string;
}> = [
  {
    label: "Smart Summaries",
    icon: FileText,
    delay: "[animation-delay:-2s]",
  },
  {
    label: "Writing Assistant",
    icon: PenLine,
    delay: "[animation-delay:-5s]",
  },
  {
    label: "Brainstorming",
    icon: Lightbulb,
    delay: "[animation-delay:-3.5s]",
  },
  {
    label: "Clear Explanations",
    icon: BookOpen,
    delay: "[animation-delay:-6.5s]",
  },
];

function FeatureChip({
  label,
  icon: Icon,
  delay,
  align,
}: {
  label: string;
  icon: LucideIcon;
  delay: string;
  align: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border border-border/70 bg-card/90 px-2.5 py-2 shadow-[0_16px_40px_-24px_rgba(2,132,199,0.4)] backdrop-blur-sm motion-safe:animate-[landing-float_8s_ease-in-out_infinite] sm:px-3 sm:py-2.5 dark:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)] ${align} ${delay}`}
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-secondary text-ring ring-1 ring-primary/10 sm:size-7">
        <Icon className="size-3.5" />
      </span>
      <span className="whitespace-nowrap text-[10px] font-medium text-foreground sm:text-[11px]">
        {label}
      </span>
    </div>
  );
}

export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[34rem] select-none"
    >
      <div className="pointer-events-none absolute inset-x-6 top-20 bottom-20 rounded-[3rem] bg-primary/10 blur-3xl dark:bg-primary/10" />

      <div className="relative">
        <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:gap-3 sm:px-1">
          <FeatureChip
            label={features[0].label}
            icon={features[0].icon}
            delay={features[0].delay}
            align="justify-self-start"
          />
          <FeatureChip
            label={features[1].label}
            icon={features[1].icon}
            delay={features[1].delay}
            align="justify-self-end"
          />
        </div>

        <div className="relative mx-auto w-full max-w-[26rem]">
          <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-primary/5 blur-xl dark:from-primary/15 dark:via-transparent dark:to-primary/5" />

          <div className="relative overflow-hidden rounded-[1.65rem] border border-border/70 bg-card/95 shadow-[0_32px_80px_-42px_rgba(2,132,199,0.55)] ring-1 ring-white/50 backdrop-blur-xl motion-safe:animate-[landing-float_9s_ease-in-out_infinite] dark:border-white/10 dark:ring-white/5 dark:shadow-[0_32px_80px_-42px_rgba(0,0,0,0.9)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />

            <div className="relative flex items-center gap-3 border-b border-border/60 px-4 py-3.5 sm:px-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent text-primary-foreground shadow-md shadow-primary/20 ring-1 ring-white/40 dark:ring-white/10">
                <Sparkles className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold tracking-tight">
                  Sydney
                </p>
                <p className="text-[10px] leading-4 text-muted-foreground">
                  AI companion
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[9px] font-medium tracking-[0.12em] text-ring uppercase">
                <MessageSquareText className="size-3" />
                Text
              </span>
            </div>

            <div className="relative space-y-3.5 px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex justify-end">
                <p className="max-w-[88%] rounded-2xl rounded-tr-md bg-primary px-3.5 py-2.5 text-[11.5px] leading-[1.45] font-medium text-primary-foreground shadow-sm shadow-primary/20 sm:text-xs">
                  Explain APIs in simple terms.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-secondary text-ring">
                  <Sparkles className="size-3" />
                </span>
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-border/60 bg-secondary/55 px-3.5 py-3">
                  <p className="text-[11.5px] leading-[1.55] text-foreground/90 sm:text-xs">
                    An API allows two applications to communicate with each
                    other. Think of it as a messenger that carries a request and
                    brings back the response.
                    <span className="animate-caret ml-1 inline-block h-3 w-[2px] translate-y-[1px] rounded-full bg-primary align-middle motion-reduce:hidden" />
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <p className="max-w-[88%] rounded-2xl rounded-tr-md border border-primary/20 bg-secondary/80 px-3.5 py-2.5 text-[11.5px] leading-[1.45] font-medium text-foreground sm:text-xs">
                  Can you summarize that for my team?
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-secondary text-ring">
                  <Sparkles className="size-3" />
                </span>
                <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-2.5 shadow-sm">
                  {[0, 1, 2].map((index) => (
                    <span
                      key={index}
                      className="size-1.5 rounded-full bg-primary motion-safe:animate-[typing-dot_1.3s_ease-in-out_infinite]"
                      style={{ animationDelay: `${index * 160}ms` }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-medium tracking-wide text-muted-foreground">
                  Sydney is typing
                </span>
              </div>
            </div>

            <div className="relative border-t border-border/60 bg-background/40 px-3 py-3 sm:px-4">
              <div className="flex items-center gap-3 rounded-full border border-border/70 bg-background/80 py-1.5 pr-1.5 pl-3.5 shadow-inner">
                <span className="truncate text-[10.5px] text-muted-foreground">
                  Ask Sydney anything...
                </span>
                <span className="ml-auto flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/20">
                  <ArrowUp className="size-3.5" strokeWidth={2.5} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3 sm:px-1">
          <FeatureChip
            label={features[2].label}
            icon={features[2].icon}
            delay={features[2].delay}
            align="justify-self-start"
          />
          <FeatureChip
            label={features[3].label}
            icon={features[3].icon}
            delay={features[3].delay}
            align="justify-self-end"
          />
        </div>
      </div>
    </div>
  );
}
