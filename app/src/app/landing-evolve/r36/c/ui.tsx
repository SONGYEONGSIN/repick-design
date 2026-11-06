import type { ReactNode } from "react";

/**
 * Small shared presentational pieces used by more than one section. The
 * `h2` below uses this route's one display face (`--font-display-wide`,
 * headline-scale latin only) — the same face every other section heading
 * and the hero `h1` use. Everything else (eyebrows, body copy) stays on
 * the inherited `--font-sans` (Pretendard) stack.
 */

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#1D4ED8]">{children}</p>;
}

export function SectionIntro({
  eyebrow,
  heading,
  body,
  bodyWidthPx = 480,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  /** Px width, not `ch` — see candidates/c.md for the 0.44em/char working. */
  bodyWidthPx?: number;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-[var(--font-display-wide)] text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950">
        {heading}
      </h2>
      <p className="mt-5 text-base font-normal leading-[1.6] text-zinc-600" style={{ maxWidth: `${bodyWidthPx}px` }}>
        {body}
      </p>
    </div>
  );
}
