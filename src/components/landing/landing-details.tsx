import { LandingSectionLabel } from "@/components/landing/landing-section-label";

const details = [
  {
    title: "Open by default",
    description:
      "No account, onboarding, or setup. The chat is ready when you are.",
  },
  {
    title: "Text first",
    description:
      "One clear conversation. No dashboards, voice controls, or performance.",
  },
  {
    title: "Honest about limits",
    description:
      "No browsing or persistent memory. Sydney works with the conversation in front of it.",
  },
];

export function LandingDetails() {
  return (
    <section
      id="details"
      aria-labelledby="details-heading"
      className="scroll-mt-24 border-t border-border/70 bg-secondary/30 dark:bg-secondary/20"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20 lg:py-32">
        <div className="max-w-md">
          <LandingSectionLabel>The details</LandingSectionLabel>
          <h2
            id="details-heading"
            className="mt-6 font-heading text-[clamp(2.2rem,4.2vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance"
          >
            Small on purpose.
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-pretty text-muted-foreground sm:text-[15px]">
            No account, no onboarding, no clutter. The interface is here to
            hold the conversation, not compete with it.
          </p>
        </div>

        <ol className="border-t border-border/70">
          {details.map((detail, index) => (
            <li
              key={detail.title}
              className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-border/70 py-6 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-6 sm:py-8"
            >
              <span className="pt-1 text-[10px] font-medium tracking-[0.16em] text-ring">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                  {detail.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-pretty text-muted-foreground">
                  {detail.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
