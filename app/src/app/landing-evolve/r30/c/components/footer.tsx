import { FOCUS } from "./ui";

const NAV = [
  { href: "#preview", label: "Listings" },
  { href: "#value", label: "How it's weighed" },
  { href: "#proof", label: "Proof" },
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
        <p className="mt-6 max-w-[493px] text-sm leading-[1.6] text-zinc-400">
          Match scores should survive a question. Ask which signal moved yours — the chart
          answers before you finish typing.
        </p>
        <p className="mt-6 text-[12px] text-zinc-400">
          © 2026 repick. Breakdown figures on this page are illustrative; your own matches
          recompute the same way, live.
        </p>
      </div>
    </footer>
  );
}
