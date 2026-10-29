import {
  CalendarDays,
  FileText,
  Mic,
  PenLine,
  type LucideIcon,
} from "lucide-react";

const examplePrompts: Array<{
  text: string;
  icon: LucideIcon;
  position: string;
  delay: string;
}> = [
  {
    text: "Summarize this for me",
    icon: FileText,
    position: "left-0 top-[8%]",
    delay: "[animation-delay:-1.5s]",
  },
  {
    text: "Help me plan my day",
    icon: CalendarDays,
    position: "right-0 top-[26%] sm:top-[39%]",
    delay: "[animation-delay:-3s]",
  },
  {
    text: "Write a message for me",
    icon: PenLine,
    position: "bottom-[8%] left-[7%]",
    delay: "[animation-delay:-4.5s]",
  },
];

export function HeroVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[30rem] select-none sm:max-w-[34rem]"
    >
      <div className="absolute inset-[17%] rounded-full bg-primary/20 blur-3xl dark:bg-primary/25" />

      <div className="absolute inset-[3%] rounded-full border border-primary/10" />
      <div className="absolute inset-[14%] rounded-full border border-primary/15" />
      <div className="absolute inset-[25%] rounded-full border border-dashed border-primary/20" />

      <span className="absolute top-[2.5%] left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_0_6px_var(--secondary)] dark:shadow-[0_0_0_6px_var(--background)]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex size-[56%] items-center justify-center rounded-full border border-white/60 bg-[radial-gradient(circle_at_32%_24%,var(--card)_0%,var(--secondary)_31%,var(--primary)_100%)] shadow-2xl shadow-primary/30 dark:border-white/10">
          <div className="absolute inset-[7%] rounded-full border border-white/30 dark:border-white/10" />
          <div className="absolute top-[15%] left-[18%] size-1/2 rounded-full bg-white/20 blur-2xl" />
          <div className="relative flex size-16 items-center justify-center rounded-full border border-white/60 bg-white/85 text-ring shadow-lg shadow-primary/20 backdrop-blur-sm sm:size-[4.5rem] dark:border-white/15 dark:bg-white/10 dark:text-primary">
            <Mic className="size-6 sm:size-7" />
          </div>
        </div>
      </div>

      {examplePrompts.map((prompt) => {
        const Icon = prompt.icon;

        return (
          <div
            key={prompt.text}
            className={`absolute flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card/95 px-3 py-2.5 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur-sm motion-safe:animate-[landing-float_8s_ease-in-out_infinite] sm:px-3.5 sm:py-3 dark:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)] ${prompt.position} ${prompt.delay}`}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-ring ring-1 ring-primary/10">
              <Icon className="size-3.5" />
            </span>
            <span className="whitespace-nowrap text-[11px] font-medium text-foreground sm:text-xs">
              {prompt.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
