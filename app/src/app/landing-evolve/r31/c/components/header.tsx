import Link from "next/link";
import { FOCUS } from "./ui";

const NAV = [
  { href: "#estimate", label: "Estimate payout" },
  { href: "#sold", label: "Recently sold" },
  { href: "#how", label: "How it works" },
  { href: "#proof", label: "Seller stories" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="#hero" className={`rounded-sm text-lg font-bold text-white ${FOCUS}`}>
          repick <span className="font-normal text-zinc-400">for sellers</span>
        </Link>
        <nav aria-label="Page sections" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-sm text-sm font-semibold text-zinc-400 hover:text-zinc-200 ${FOCUS}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          href="/catalog"
          className={`rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-white/30 ${FOCUS}`}
        >
          Browse the marketplace
        </Link>
      </div>
    </header>
  );
}
