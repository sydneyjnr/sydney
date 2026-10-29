"use client";

import { useEffect, useState } from "react";

const phrases = [
  "Ask Anything",
  "Get Instant Answers",
  "Make Things Happen",
] as const;

const TYPING_DELAY_MS = 70;
const DELETING_DELAY_MS = 34;
const FULL_PHRASE_PAUSE_MS = 1_500;
const EMPTY_PHRASE_PAUSE_MS = 240;

export function TypingHeadline() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState<string>(phrases[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);

      if (event.matches) {
        setDisplayText(phrases[phraseIndex]);
        setIsDeleting(false);
      }
    };

    mediaQuery.addEventListener("change", handlePreferenceChange);

    return () =>
      mediaQuery.removeEventListener("change", handlePreferenceChange);
  }, [phraseIndex]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const phrase = phrases[phraseIndex];

    if (!isDeleting && displayText === phrase) {
      const timeout = window.setTimeout(
        () => setIsDeleting(true),
        FULL_PHRASE_PAUSE_MS,
      );

      return () => window.clearTimeout(timeout);
    }

    if (isDeleting && displayText === "") {
      const timeout = window.setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % phrases.length);
      }, EMPTY_PHRASE_PAUSE_MS);

      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(
      () => {
        const nextLength = displayText.length + (isDeleting ? -1 : 1);
        setDisplayText(phrase.slice(0, nextLength));
      },
      isDeleting ? DELETING_DELAY_MS : TYPING_DELAY_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, reduceMotion]);

  return (
    <span>
      <span>{displayText || "\u00A0"}</span>
      <span
        aria-hidden="true"
        className="animate-caret ml-1.5 inline-block h-[0.8em] w-[0.06em] translate-y-[0.02em] rounded-full bg-primary align-baseline motion-reduce:hidden"
      />
    </span>
  );
}
