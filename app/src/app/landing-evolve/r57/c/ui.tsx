"use client";

import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

// -------------------------------------------------------------------------------------------
// Palette + computed contrast. Full WCAG relative-luminance arithmetic is restated in
// vault/.../candidates/c.md; this is the short version against this page's single background,
// #0B0B0F (L = 0.00345):
//
//   #3B82F6 (ACCENT_BASE)   vs #0B0B0F  -> 5.35:1   (body-size accent text/icons/borders, clears
//                                                     the 4.5:1 AA floor directly on the dark bg)
//   #60A5FA (ACCENT_BRIGHT) vs #0B0B0F  -> 7.73:1   (headline accent, focus ring, active state)
//   #18181B (INK) on #3B82F6 fill       -> 4.82:1   (text on a blue-500 fill: dark ink, not white)
//   #18181B (INK) on #60A5FA fill       -> 6.97:1   (same rule, brighter fill)
//   #FFFFFF        on #3B82F6 fill      -> 3.68:1   (checked and rejected — fails small-text AA)
//   #FFFFFF        on #60A5FA fill      -> 2.54:1   (checked and rejected — fails even large-text)
//   #71717A (zinc-500) vs #0B0B0F       -> 4.07:1   (decorative-only: dividers, ghost numerals —
//                                                     never real text, which floors at zinc-400)
//   #A1A1AA (zinc-400) vs #0B0B0F       -> 7.66:1   (muted/caption text)
//   #D4D4D8 (zinc-300) vs #0B0B0F       -> 13.30:1  (body copy)
//
// Every blue fill on this page (primary CTA, active persona pill, filled badge chips) pairs with
// dark ink text, never white — white-on-blue was computed and fails small-text AA on both tiers
// of this exact hue.
export const BG = "#0B0B0F";
export const PANEL = "#12141A";
export const ACCENT_BASE = "#3B82F6";
export const ACCENT_BRIGHT = "#60A5FA";
export const INK = "#18181B";
export const DECOR = "#71717A"; // decorative-only, never real text

// A single ring color for the whole page. `outline-offset` draws the ring *outside* the
// element's border box — against this dark page that outer area is always #0B0B0F, so the
// bright-blue ring (7.73:1 vs #0B0B0F) is what's actually visible, never dark ink.
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA]";

// Display face: --font-display-grotesk ships a 300-700 variable weight axis, so headings use
// font-bold (700, its true max) rather than font-extrabold (800, which the face can't render).
// The three rendered weights on this whole route are 400 (body, Tailwind preflight default),
// 600 (UI: eyebrows, labels, buttons, stage names), 700 (display headings only).
export const DISPLAY = { fontFamily: "var(--font-display-grotesk)" } as const;

export const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em]";
export const CAPTION = "text-[12px] font-semibold uppercase tracking-[0.16em]";
export const STAT_TRACKING: CSSProperties = { letterSpacing: "0.12em" };

// Body measure, computed not guessed: chars_per_line = container_px / (0.44 * font_px).
// Target ~70 chars with slack, never above the ~75-char hard-failure line:
//   16px: 70 * 0.44 * 16 = 492.8 -> 492px  (~70 chars/line)
//   14px: 70 * 0.44 * 14 = 431.2 -> 430px  (~70 chars/line)
//   13px: 70 * 0.44 * 13 = 400.4 -> 400px  (~70 chars/line)
export const BODY_16 = "max-w-[492px] text-[16px] font-normal leading-[1.6] text-zinc-300";
export const BODY_14 = "max-w-[430px] text-[14px] font-normal leading-[1.6] text-zinc-300";
export const BODY_13 = "max-w-[400px] text-[13px] font-normal leading-[1.6] text-zinc-400";

export const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-[#60A5FA] focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-[#18181B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

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
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Scroll-reveal wrapper used as the connective tissue between sections. The server render (and
 * the first client render, before mount settles) always shows a plain, fully-visible div --
 * Framer Motion applies `initial` during SSR too, so wiring the animated element straight in would
 * ship literal opacity:0 to no-JS/slow-hydration/reduced-motion visitors. Content is in the DOM
 * and visible as the baseline; the reveal is progressive enhancement layered on top, never a
 * prerequisite for visibility.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();

  if (!mounted || reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={revealVariants}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, tone = "base" }: { children: ReactNode; tone?: "base" | "bright" }) {
  return (
    <p className={EYEBROW} style={{ color: tone === "bright" ? ACCENT_BRIGHT : ACCENT_BASE }}>
      {children}
    </p>
  );
}

export function SectionFolio({ n }: { n: string }) {
  // De-escalated deliberately -- a decorative ghost numeral, never real text, so the zinc-500
  // floor (4.07:1 non-text contrast, computed above) applies rather than the zinc-400 text floor.
  return (
    <span
      aria-hidden="true"
      className="select-none text-[clamp(1.4rem,2.4vw,1.8rem)] font-bold leading-none tracking-[0.06em]"
      style={{ ...DISPLAY, color: DECOR }}
    >
      {n}
    </span>
  );
}

export function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold transition-colors ${FOCUS} ${className}`}
      style={{ backgroundColor: ACCENT_BASE, color: INK }}
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
