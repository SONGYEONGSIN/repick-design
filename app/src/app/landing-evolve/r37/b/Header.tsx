import Link from "next/link";
import { CONTAINER, FOCUS } from "./theme";

const NAV = [
  { href: "#preview", label: "Catalog" },
  { href: "#walk", label: "How verification works" },
  { href: "#proof", label: "Buyer stories" },
] as const;

export default function Header() {
  return (
    <>
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS}`}
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur">
        <div className={`flex items-center justify-between py-4 ${CONTAINER}`}>
          <Link href="#hero" className={`rounded-sm text-lg font-extrabold tracking-[-0.02em] text-zinc-950 ${FOCUS}`}>
            repick
          </Link>

          <nav aria-label="Page sections" className="hidden items-center gap-5 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`inline-block rounded-sm px-1 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-950 ${FOCUS}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Link
            href="#preview"
            className={`rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:border-zinc-950 ${FOCUS}`}
          >
            Browse listings
          </Link>
        </div>
      </header>
    </>
  );
}
