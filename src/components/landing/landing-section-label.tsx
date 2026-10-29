import type { ReactNode } from "react";

export function LandingSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
      <span aria-hidden="true" className="h-px w-5 bg-primary/50" />
      {children}
    </p>
  );
}
