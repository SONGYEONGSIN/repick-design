import type { ReactNode } from "react";
import { ACCENT_TINT } from "./theme";

/**
 * Small shared presentational pieces used by more than one section.
 * `bodyWidthPx` defaults to 490px — at this route's 16px body size that is
 * 490 / (0.44 * 16) ≈ 69.6 characters per line, just under the 70-char
 * target the brief sets (and comfortably under the 75-char hard ceiling).
 * Working is repeated in candidates/b.md.
 */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT_TINT }}>
      {children}
    </p>
  );
}

export function SectionIntro({
  eyebrow,
  heading,
  body,
  bodyWidthPx = 490,
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
        className="mt-4 text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-zinc-950"
        style={{ fontFamily: "var(--font-display-grotesk)" }}
      >
        {heading}
      </h2>
      <p className="mt-5 text-base font-normal leading-[1.6] text-zinc-600" style={{ maxWidth: `${bodyWidthPx}px` }}>
        {body}
      </p>
    </div>
  );
}
