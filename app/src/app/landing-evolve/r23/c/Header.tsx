import { ArrowRight } from "lucide-react";
import { ACCENT, ACCENT_BRIGHT, cx, FOCUS } from "./tokens";

const NAV_LINKS = [
  { href: "#find", label: "Matched listings" },
  { href: "#price-lab", label: "Price Lab" },
  { href: "#stories", label: "Stories" },
];

/** Persistent sticky header — present through every section, not just the hero. A route with
 * scroll-revealed sections and no standing chrome reads as a cut demo rather than a real product;
 * this bar plus the footer below are what keep the page legible as one continuous site. */
export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#1C1C22] bg-[#0B0B0F]/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-16">
        <span className="flex shrink-0 items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em] text-white">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT_BRIGHT }} aria-hidden="true" />
          repick
        </span>

        <nav aria-label="Primary" className="hidden min-w-0 items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cx(
                "inline-flex min-h-[24px] items-center truncate rounded-sm px-1 py-1.5 text-[13px] font-semibold text-zinc-300 transition-colors duration-150 hover:text-white",
                FOCUS,
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#price-lab"
          className={cx(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            FOCUS,
          )}
          style={{ backgroundColor: ACCENT }}
        >
          Try Price Lab
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
