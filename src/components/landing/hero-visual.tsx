const prompts = [
  "Explain how heat pumps work.",
  "Turn these notes into a plan.",
  "Make this email more concise.",
];

export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[28rem] select-none"
    >
      <div className="pointer-events-none absolute -top-16 -right-12 size-56 rounded-full bg-primary/10 blur-3xl dark:bg-primary/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 size-48 rounded-full bg-accent/60 blur-3xl dark:bg-accent/20" />

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center">
            <span className="h-px w-5 bg-primary/50" />
          </span>
          <p className="text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
            Example prompts
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
          These are examples. Ask in your own words.
        </p>
      </div>
    </div>
  );
}
