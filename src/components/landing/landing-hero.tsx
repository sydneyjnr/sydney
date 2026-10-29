import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { HeroVisual } from "@/components/landing/hero-visual";
import { TypingHeadline } from "@/components/landing/typing-headline";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section aria-labelledby="hero-heading" className="relative flex-1">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 right-[-14%] size-[38rem] rounded-full bg-secondary/80 blur-3xl dark:bg-primary/5" />
        <div className="absolute bottom-[-24rem] left-[-18%] size-[40rem] rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-14 sm:px-8 sm:py-20 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 lg:py-16">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-[11px] font-medium tracking-wide text-secondary-foreground shadow-sm">
            <span className="flex size-4 items-center justify-center rounded-full bg-primary/20">
              <Sparkles className="size-2.5 text-ring" aria-hidden="true" />
            </span>
            Your AI companion
          </span>

          <h1
            id="hero-heading"
            className="mt-5 flex min-h-[2.15em] items-center font-heading text-[clamp(2.75rem,5.7vw,5.25rem)] leading-[0.98] font-semibold tracking-[-0.05em] sm:min-h-[1.1em] lg:min-h-[2.1em]"
          >
            <span className="sr-only">
              Ask Anything. Get Instant Answers. Make Things Happen.
            </span>
            <span aria-hidden="true" className="block w-full">
              <TypingHeadline />
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-[17px] sm:leading-8">
            Sydney is a thoughtful AI companion for learning, planning, and
            working through ideas. Ask a question, think out loud, and find a
            useful place to start.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              asChild
              size="lg"
              className="h-11 w-full rounded-full px-5 text-sm shadow-lg shadow-primary/20 sm:w-auto"
            >
              <Link href="/chat">
                Start Now
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            </Button>
            <p className="text-xs leading-5 text-muted-foreground">
              No account needed. Start chatting right away.
            </p>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
