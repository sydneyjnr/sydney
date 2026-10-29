import { Sparkles } from "lucide-react";

const prompts = [
  "Explain it like I'm new.",
  "Turn these notes into a plan.",
  "Help me find the right words.",
];

export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[28rem] select-none"
    >
      <div className="pointer-events-none absolute -top-16 -right-12 size-56 rounded-full bg-primary/10 blur-3xl dark:bg-primary/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 size-48 rounded-full bg-accent/60 blur-3xl dark:bg-accent/20" />
      <Sparkles
        className="pointer-events-none absolute -top-10 -right-4 size-36 text-primary/5 dark:text-primary/10"
        strokeWidth={0.75}
      />

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-ring ring-1 ring-primary/15">
            <Sparkles className="size-3.5" />
          </span>
          <p className="text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
            A few ways to begin
          </p>
        </div>

        <div className="mt-9 border-t border-border/70">
          {prompts.map((prompt, index) => (
            <div
              key={prompt}
              className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-4 border-b border-border/70 py-5 sm:py-6"
            >
              <span className="pt-1 text-[10px] font-medium tracking-[0.16em] text-ring">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-heading text-[clamp(1.35rem,2.2vw,1.7rem)] leading-[1.2] font-medium tracking-[-0.035em] text-foreground/90">
                {prompt}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[11px] leading-5 text-muted-foreground">
          Ask in your own words. Sydney will meet you there.
        </p>
      </div>
    </div>
  );
}
