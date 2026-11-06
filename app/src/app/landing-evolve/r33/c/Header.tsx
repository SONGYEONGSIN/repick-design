"use client";

import { ACCENT_TINT, BORDER_SOFT, INK } from "./theme";

const NAV_LINKS = [
  { href: "#preview", label: "Listings" },
  { href: "#value", label: "The trace" },
  { href: "#trust", label: "Trust" },
];

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur"
      style={{ borderColor: BORDER_SOFT, backgroundColor: "rgba(11, 11, 15, 0.82)" }}
    >
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="rounded text-lg font-extrabold tracking-[-0.02em] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FD9FF]"
          style={{ fontFamily: "var(--font-display-mono)", outlineColor: ACCENT_TINT }}
        >
          repick
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded text-sm font-semibold text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FD9FF]"
              style={{ outlineColor: ACCENT_TINT }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#start"
          className="shrink-0 rounded-full border px-4 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FD9FF]"
          style={{ borderColor: ACCENT_TINT, outlineColor: ACCENT_TINT, backgroundColor: INK }}
        >
          Start verifying
        </a>
      </div>
    </header>
  );
}
