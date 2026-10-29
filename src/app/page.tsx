import type { Metadata } from "next";

import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNavbar } from "@/components/landing/landing-navbar";

export const metadata: Metadata = {
  title: "Sydney — Your AI companion",
  description:
    "Sydney is a thoughtful AI companion for learning, planning, and working through ideas.",
};

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-background">
      <LandingNavbar />
      <LandingHero />
    </div>
  );
}
