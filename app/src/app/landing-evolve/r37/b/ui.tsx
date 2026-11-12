import type { ReactNode } from "react";
import { ACCENT_TINT } from "./theme";

/**
 * Small shared presentational pieces used by more than one section.
 *
 * Line-length calc: `bodyWidthPx` defaults to 480px at this route's 16px
 * body size. Pretendard's average English-mixed character advance is
 * 0.44em (NOT the `ch` unit, which is the digit `0`'s advance and runs
 * ~35% wide of the true average): chars-per-line = 480 / (0.44 × 16) =
 * 480 / 7.04 ≈ 68.2 characters — comfortably under the 75-char ceiling and
 * close to the ~70 target. Full working repeated in candidates/b.md.
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
  bodyWidthPx = 480,
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
        className="mt-4 text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950"
        style={{ fontFamily: "var(--font-display-wide)" }}
      >
        {heading}
      </h2>
      <p className="mt-5 text-base font-normal leading-[1.6] text-zinc-600" style={{ maxWidth: `${bodyWidthPx}px` }}>
        {body}
      </p>
    </div>
  );
}
