import Link from "next/link";
import { FOCUS } from "./theme";

const NAV = [
  { href: "#catalog", label: "Catalog" },
  { href: "#value", label: "How coverage works" },
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
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#hero" className={`rounded-sm text-lg font-bold text-zinc-950 ${FOCUS}`}>
            Covera
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
            href="/catalog"
            className={`rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:border-zinc-950 ${FOCUS}`}
          >
            Open full catalog
          </Link>
        </div>
      </header>
    </>
  );
}
