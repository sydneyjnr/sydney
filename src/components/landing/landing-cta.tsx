import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LandingSectionLabel } from "@/components/landing/landing-section-label";
import { Button } from "@/components/ui/button";

export function LandingCta() {
  return (
    <section
      aria-labelledby="start-heading"
      className="relative overflow-hidden border-t border-border/70"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-[-12%] size-[30rem] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/10"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:flex-row lg:items-end lg:justify-between lg:py-32">
        <div>
          <LandingSectionLabel>Start</LandingSectionLabel>
          <h2
            id="start-heading"
            className="mt-6 max-w-2xl font-heading text-[clamp(2.4rem,5vw,4.25rem)] leading-[0.98] font-semibold tracking-[-0.05em] text-balance"
          >
            Bring the question.{" "}
            <span className="text-muted-foreground">
              Leave with a next step.
            </span>
          </h2>
        </div>

        <div className="shrink-0">
          <Button
            asChild
            size="lg"
            className="h-11 w-full rounded-full px-5 text-sm shadow-lg shadow-primary/20 sm:w-auto"
          >
            <Link href="/chat">
              Open chat
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </Button>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            No account. No setup.
          </p>
        </div>
      </div>
    </section>
  );
}
