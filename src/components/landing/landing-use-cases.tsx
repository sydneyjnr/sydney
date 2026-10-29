import { LandingSectionLabel } from "@/components/landing/landing-section-label";

const useCases = [
  {
    title: "Learn",
    description:
      "Start with what you don't understand. Get a plain answer, then pull the thread.",
  },
  {
    title: "Plan",
    description:
      "Turn scattered notes and half-formed ideas into a clear next step.",
  },
  {
    title: "Write",
    description:
      "Draft, trim, and rework it until the words sound like you.",
  },
  {
    title: "Think",
    description:
      "Talk through the decision before you commit to it.",
  },
];

export function LandingUseCases() {
  return (
    <section
      id="what-it-does"
      aria-labelledby="use-cases-heading"
      className="scroll-mt-24 border-t border-border/70"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20 lg:py-32">
        <div className="max-w-md">
          <LandingSectionLabel>What it does</LandingSectionLabel>
          <h2
            id="use-cases-heading"
            className="mt-6 font-heading text-[clamp(2.2rem,4.2vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance"
          >
            One conversation.{" "}
            <span className="text-muted-foreground">
              Several directions.
            </span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-pretty text-muted-foreground sm:text-[15px]">
            Sydney isn&apos;t built for one kind of question. It&apos;s a
            place to work through whatever is in front of you.
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {useCases.map((useCase, index) => (
            <article
              key={useCase.title}
              className="border-t border-border/70 pt-5"
            >
              <p className="text-[10px] font-medium tracking-[0.16em] text-ring">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-6 text-lg font-semibold tracking-tight sm:text-xl">
                {useCase.title}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-pretty text-muted-foreground">
                {useCase.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
