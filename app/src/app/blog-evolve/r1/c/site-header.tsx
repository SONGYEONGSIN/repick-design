import { Aperture } from "lucide-react";
import { BRAND } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

const NAV_LINKS = [
  { label: "Product", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Journal", href: "#", current: true },
];

/**
 * Global site nav — a sibling of <main>, not nested inside it, so the page keeps exactly one
 * top-level <main> landmark and this header keeps its own implicit `banner` role.
 */
export default function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-stone-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-sm text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
        >
          <Aperture className="h-5 w-5 text-orange-700" aria-hidden="true" />
          <span style={DISPLAY_FONT} className="text-lg font-semibold tracking-tight">
            {BRAND}
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              className={
                "rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 " +
                (link.current ? "text-stone-900" : "text-stone-600 hover:text-stone-900")
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#"
          className="inline-flex shrink-0 items-center rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
        >
          Get started
        </a>
      </div>
    </header>
  );
}
