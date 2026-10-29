import type { ReactNode } from "react";

/**
 * Shared focus style. Deliberately never preceded by `outline-none` — Tailwind v4's
 * `ring-2`/`ring-offset-*` renders fully transparent in this setup, so every interactive
 * element on this route uses this explicit `outline` pair instead.
 */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67E8F9]";

export const DISPLAY_FONT = "var(--font-display-grotesk)";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#67E8F9]">
      {children}
    </p>
  );
}

export function Caption({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400 ${className}`}
    >
      {children}
    </p>
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
        style={{ fontFamily: `${DISPLAY_FONT}, var(--font-sans)` }}
      >
        {heading}
      </h2>
      <p
        className="mt-5 text-base leading-[1.6] text-zinc-300"
        style={{ maxWidth: `${bodyWidth}px` }}
      >
        {body}
      </p>
    </div>
  );
}

export function Pill({
  children,
  tone = "outline",
}: {
  children: ReactNode;
  tone?: "outline" | "muted";
}) {
  const toneClass =
    tone === "outline"
      ? "border border-[#0E7490]/70 text-[#67E8F9] bg-[#0E7490]/10"
      : "border border-white/10 text-zinc-300 bg-white/[0.03]";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold tracking-[0.02em] ${toneClass}`}
    >
      {children}
    </span>
  );
}
