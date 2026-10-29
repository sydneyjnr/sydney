import type { Metadata } from "next";

import { LandingCta } from "@/components/landing/landing-cta";
import { LandingDetails } from "@/components/landing/landing-details";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingUseCases } from "@/components/landing/landing-use-cases";

export const metadata: Metadata = {
  title: "Sydney — Your AI companion",
  description:
    "Sydney is a thoughtful AI companion for learning, planning, and working through ideas.",
};

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-background">
      <a
        href="#main"
        className="absolute top-4 left-4 z-[60] -translate-y-24 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium shadow-lg outline-none transition-transform focus:translate-y-0 focus:ring-3 focus:ring-ring/40 motion-reduce:transition-none"
      >
        Skip to content
      </a>
      <LandingNavbar />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <LandingHero />
        <LandingUseCases />
        <LandingDetails />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
