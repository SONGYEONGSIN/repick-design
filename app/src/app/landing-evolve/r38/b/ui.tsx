// app/src/app/landing-evolve/r38/b/ui.tsx
//
// Small shared presentational pieces. Three-tier tracking scale per the
// brief: eyebrow 0.28em, caption 0.16em, stat-label 0.12em.

import type { ReactNode } from "react";
import { ACCENT_TINT, MUTED } from "./theme";

export function cx(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(" ");
}

export const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em]";
export const STAT_LABEL = "text-xs font-semibold uppercase tracking-[0.12em]";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT_TINT }}>
      {children}
    </p>
  );
}

/**
 * Section intro: eyebrow + h2 + one body paragraph whose line length is
 * computed (never `ch`) from the brief's 0.44em-per-character constant.
 * `bodyWidthPx` defaults to 500px at 16px body size: 500 / (0.44 * 16) =
 * 71.0 characters per line — under the 75-char ceiling, just past the
 * ~70 target. Arithmetic repeated in candidates/b.md.
 */
export function SectionIntro({
  eyebrow,
  heading,
  body,
  bodyWidthPx = 500,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  bodyWidthPx?: number;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-4 text-[clamp(1.7rem,1.3rem+1.8vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.01em] text-white"
        style={{ fontFamily: "var(--font-display-grotesk)" }}
      >
        {heading}
      </h2>
      <p className="mt-5 text-base font-normal leading-[1.6]" style={{ maxWidth: `${bodyWidthPx}px`, color: MUTED }}>
        {body}
      </p>
    </div>
  );
}
