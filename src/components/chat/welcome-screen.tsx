"use client";

import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Lightbulb,
  Moon,
  Sparkles,
} from "lucide-react";

import { starterPrompts } from "@/lib/chat";

const promptIcons = {
  clarity: Lightbulb,
  routine: Moon,
  explain: BookOpen,
  perspective: Compass,
};

type WelcomeScreenProps = {
  onSelectPrompt: (prompt: string) => void;
};

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <section className="flex min-h-full items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary shadow-sm ring-1 ring-border">
            <Sparkles className="size-7" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Meet Sydney
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            <span className="dark:hidden">
              A little help, whenever you need it.
            </span>
            <span className="hidden dark:inline">
              Your personal space to think.
            </span>
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <h2 className="text-center text-sm font-medium text-muted-foreground">
            Where would you like to start?
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {starterPrompts.map((prompt) => {
              const Icon = promptIcons[prompt.id];

              return (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => onSelectPrompt(prompt.prompt)}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all outline-none hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/15">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">
                      {prompt.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      {prompt.description}
                    </span>
                  </span>
                  <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
