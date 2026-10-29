import type { ReactNode } from "react";

/**
 * Small shared presentational pieces used by more than one section.
 * Headings here deliberately carry no `fontFamily` override — this
 * candidate's assignment is "no display face", so every heading, however
 * large, stays on the inherited `--font-sans` stack.
 */

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-300">{children}</p>;
}

export function SectionIntro({
  eyebrow,
  heading,
  body,
  bodyWidthPx = 500,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  /** Px width, not `ch` — see the candidate report for the 0.44em/char working. */
  bodyWidthPx?: number;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
        {heading}
      </h2>
      <p className="mt-5 text-base leading-[1.6] text-zinc-400" style={{ maxWidth: `${bodyWidthPx}px` }}>
        {body}
      </p>
    </div>
  );
}
