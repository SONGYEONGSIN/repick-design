"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

// -------------------------------------------------------------------------------------------
// Palette + computed contrast (full arithmetic in vault/.../candidates/c.md). Short version,
// WCAG relative-luminance formula, against this page's single background #0B0B0F:
//   #65A30D (ACCENT_BASE)   vs #0B0B0F  -> 6.36:1  (small accent text/icons/borders directly on bg)
//   #A3E635 (ACCENT_BRIGHT) vs #0B0B0F  -> 13.03:1 (active graph edges/nodes, focus ring, headline)
//   #18181B (INK)   on #65A30D fill     -> 5.73:1  (text on a lime fill: dark ink, not white)
//   #18181B (INK)   on #A3E635 fill     -> 11.75:1 (same rule, brighter fill)
//   #FFFFFF         on #65A30D fill     -> 3.09:1  (checked and rejected — fails small-text AA)
//   #71717A (zinc-500) vs #0B0B0F       -> 4.07:1  (inactive graph edges/ghost numerals: solid, no
//                                                    alpha, since an alpha-blended tint would read
//                                                    as a *different*, uncomputed color)
//   #A1A1AA (zinc-400) vs #0B0B0F       -> 7.67:1  (muted/caption text)
//   #D4D4D8 (zinc-300) vs #0B0B0F       -> 13.29:1 (body copy, clears the 4.5:1 body floor easily)
// Every lime fill in this page (buttons, active chips, active node) pairs with dark ink text,
// never white — white-on-lime was computed and fails small-text AA (3.09:1) on this exact hex.
export const BG = "#0B0B0F";
export const PANEL = "#131318";
export const ACCENT_BASE = "#65A30D";
export const ACCENT_BRIGHT = "#A3E635";
export const INK = "#18181B";
export const EDGE_INACTIVE = "#71717A";

// A single ring color for the whole page: `outline-offset` draws the ring *outside* the element's
// border box, which for every interactive element on this page (including lime-filled buttons) is
// the dark page background, not the element's own fill -- so the bright lime ring (13:1 vs #0B0B0F)
// is what's actually visible, never dark ink (which was checked and is ~1.1:1, invisible, against
// the same dark surroundings).
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A3E635]";

// Display face: --font-display-grotesk is declared with a 300-700 variable weight axis (see
// globals.css), so headings use font-bold (700, its true max) rather than font-extrabold (800,
// which the font can't actually render) -- the three rendered weights on this whole page are
// 400 (body/Pretendard), 600 (UI: labels, buttons, table headers), 700 (display headings).
export const DISPLAY = { fontFamily: "var(--font-display-grotesk)" } as const;

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";

// Body measure, exact constant: chars_per_line = container_px / (0.44 * font_px). Target ~70
// chars with slack, per-size (not guessed, not `ch` units):
//   16px: 70 * 0.44 * 16 = 492.8 -> 493px
//   14px: 70 * 0.44 * 14 = 431.2 -> 431px
//   12px: 70 * 0.44 * 12 = 369.6 -> 370px
export const BODY_16 = "max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-300";
export const BODY_14 = "max-w-[431px] text-[14px] font-normal leading-[1.6] text-zinc-300";
export const BODY_12 = "max-w-[370px] text-[12px] font-normal leading-[1.6] text-zinc-400";

export const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-[#A3E635] focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-[#18181B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Mount-gated hydration check. `useReducedMotion()` alone returns falsy during SSR regardless of
 * the visitor's real preference, so wiring an animated `motion.div` straight in would ship literal
 * `opacity:0` to no-JS/slow-hydration visitors. `useSyncExternalStore`'s getSnapshot is allowed to
 * differ from getServerSnapshot by design -- the sanctioned way to read "have we hydrated yet"
 * without the cascading-render setState-in-effect a useState+useEffect pair would trigger.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  // Mount-gated: the server render (and the first client render, before this check settles) always
  // shows a plain, fully-visible div -- Framer Motion applies `initial` during SSR too, so wiring
  // the animated element straight in would ship literal opacity:0 to no-JS/slow-hydration visitors.
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();

  if (!mounted || reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={revealVariants}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionFolio({ n }: { n: string }) {
  // De-escalated deliberately: a ghost numeral this size (not the catalog's usual oversized
  // display-scale decoration) can't compete with the section heading it sits beside, and
  // zinc-500 is the dimmest solid gray that still clears 3:1 non-text contrast on #0B0B0F
  // (4.07:1, computed above) -- zinc-600/700 were checked and fail (2.54:1 / 1.88:1).
  return (
    <span
      aria-hidden="true"
      className="select-none text-[clamp(1.5rem,2.6vw,1.9rem)] font-bold leading-none tracking-[0.06em] text-[#71717A]"
      style={DISPLAY}
    >
      {n}
    </span>
  );
}

export function Eyebrow({ children, tone = "base" }: { children: ReactNode; tone?: "base" | "bright" }) {
  return (
    <p className={EYEBROW} style={{ color: tone === "bright" ? ACCENT_BRIGHT : ACCENT_BASE }}>
      {children}
    </p>
  );
}

export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-colors ${FOCUS}`}
      style={{ backgroundColor: ACCENT_BRIGHT, color: INK }}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
    </a>
  );
}

export function SecondaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-[13px] font-semibold text-zinc-200 transition-colors hover:border-zinc-500 ${FOCUS}`}
    >
      {children}
    </a>
  );
}
