import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = [
  { href: "#what-it-does", label: "What it does" },
  { href: "#details", label: "The details" },
  { href: "/chat", label: "Open chat" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto w-full max-w-7xl px-5 pt-12 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link
              href="/"
              aria-label="Sydney home"
              className="inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                Sydney
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-pretty text-muted-foreground">
              A quiet place to think, plan, and write.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-md text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/70 pt-6 text-[11px] leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© Sydney</p>
          <p>Built for thinking, not performing.</p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8"
      >
        <p className="mt-8 select-none font-heading text-[clamp(4.5rem,18vw,13rem)] leading-none font-semibold tracking-[-0.07em] text-foreground/[0.06]">
          Sydney
        </p>
      </div>
    </footer>
  );
}
