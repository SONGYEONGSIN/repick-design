import { FOCUS } from "./ui";

const NAV = [
  { href: "#estimate", label: "Estimate payout" },
  { href: "#sold", label: "Recently sold" },
  { href: "#how", label: "How it works" },
  { href: "#proof", label: "Seller stories" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <span className="text-base font-bold text-white">repick</span>
          <nav aria-label="Footer" className="flex flex-wrap gap-6">
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
        </div>
        <p className="mt-6 max-w-[430px] text-sm leading-[1.6] text-zinc-400">
          Every payout on this page is computed from the same category, condition and
          brand-tier tables our pricing engine uses on real listings — set your own and the
          math above updates with you.
        </p>
        <p className="mt-6 text-[12px] text-zinc-400">
          © 2026 repick. Estimates are illustrative; your final payout is confirmed once a
          listing is graded.
        </p>
      </div>
    </footer>
  );
}
