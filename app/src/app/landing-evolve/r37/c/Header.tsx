import Link from "next/link";
import { FOCUS } from "./theme";

const NAV = [
  { href: "#device", label: "The scan" },
  { href: "#listings", label: "Listings" },
  { href: "#value", label: "How grading works" },
  { href: "#proof", label: "Reviews" },
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="#hero" className={`shrink-0 rounded-sm text-lg font-extrabold tracking-[-0.02em] text-white ${FOCUS}`}>
          repick <span className="font-normal text-zinc-400">for buyers</span>
        </Link>

        <nav aria-label="Page sections" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-sm text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-200 ${FOCUS}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          href="/catalog"
          className={`shrink-0 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/30 ${FOCUS}`}
        >
          Browse listings
        </Link>
      </div>
    </header>
  );
}
