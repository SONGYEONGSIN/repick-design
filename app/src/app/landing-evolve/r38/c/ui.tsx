import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";
import { ACCENT_DEEP, ACCENT_FILL, ACCENT_LIGHT, INK, MUTED_ON_PAGE } from "./theme";

/**
 * Eyebrow label. `tone="dark"` is used on the two dark ink panels (device,
 * closing CTA) where it switches to the light accent tint so it still
 * clears contrast against that background; `tone="light"` (default) is for
 * the white page.
 */
export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-[0.28em]"
      style={{ color: tone === "dark" ? ACCENT_LIGHT : ACCENT_DEEP }}
    >
      {children}
    </p>
  );
}

/**
 * Oversized decorative folio numeral (used only on the light page, never on
 * the dark panels). `aria-hidden` because it is purely editorial
 * decoration, but still kept at zinc-500 — the brief's own rule is that an
 * `aria-hidden` numeral rendered at large size is still scanned by the
 * Lighthouse contrast audit, so it must clear the floor on its own merits.
 * zinc-500 (#71717A) measures ≈4.83:1 against this route's pure-white page
 * background — clears the large-text 3:1 floor (and AA body text 4.5:1)
 * with real margin, computed in `candidates/c.md`.
 */
export function GhostNumeral({ children }: { children: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none select-none font-extrabold leading-none tracking-[0.02em] text-[clamp(2.25rem,6vw,4.5rem)]"
      style={{ color: MUTED_ON_PAGE }}
    >
      {children}
    </span>
  );
}

/** Plain pill badge — ink text on a light tint, always high-contrast by construction. */
export function Badge({ children, icon }: { children: ReactNode; icon?: boolean }) {
  return (
    <li
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-semibold"
      style={{ color: INK }}
    >
      {icon ? <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" /> : null}
      {children}
    </li>
  );
}

/** Accent-filled pill — white text on the fill, verified ≥AA at small sizes. */
export function AccentBadge({ children }: { children: ReactNode }) {
  return (
    <li
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
      style={{ backgroundColor: ACCENT_FILL }}
    >
      {children}
    </li>
  );
}
