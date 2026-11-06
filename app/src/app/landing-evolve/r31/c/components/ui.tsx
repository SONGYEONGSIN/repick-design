import type { ReactNode } from "react";

/**
 * Accent palette. `ACCENT` is a violet distinct from this catalog's
 * `#6E56CF` default — see the concept note for the full relative-luminance
 * math. Summary: white text on an `ACCENT` fill clears AA at every size
 * (5.67:1); dark-ink text on the same fill only clears the large-text/
 * non-text floor (3.47:1), so dark ink on accent is reserved for
 * headline-scale numerals and borders, never small body text. `ACCENT_TINT`
 * is the brighter derivative used wherever accent appears as small text,
 * an icon or a focus ring directly on the page background — it clears
 * 8.36:1 there.
 */
export const ACCENT = "#6D4AE0";
export const ACCENT_TINT = "#AE9BFF";
export const ACCENT_SOFT_BG = "rgba(109, 74, 224, 0.14)";
export const ACCENT_SOFT_BORDER = "rgba(109, 74, 224, 0.45)";

/**
 * Shared focus style. Never preceded by `outline-none` — Tailwind v4's
 * `ring-2`/`ring-offset-*` paints fully transparent in this setup, so every
 * interactive element on this route uses this explicit `outline` pair.
 */
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#AE9BFF]";

export const DISPLAY_FONT = "var(--font-display-grotesk), var(--font-sans)";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#AE9BFF]">{children}</p>
  );
}

export function SectionIntro({
  eyebrow,
  heading,
  body,
  bodyWidth = 493,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  bodyWidth?: number;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-4 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] font-bold leading-[1.03] tracking-[-0.02em] text-white"
        style={{ fontFamily: "var(--font-display-grotesk), var(--font-sans)" }}
      >
        {heading}
      </h2>
      <p className="mt-5 text-base leading-[1.6] text-zinc-300" style={{ maxWidth: `${bodyWidth}px` }}>
        {body}
      </p>
    </div>
  );
}
