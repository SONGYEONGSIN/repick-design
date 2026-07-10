import { TowerControl, User } from "lucide-react";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-amber-500/10 bg-neutral-950/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <TowerControl aria-hidden="true" className="h-6 w-6 text-amber-400" />
        <span className="font-mono text-base font-bold tracking-widest text-amber-400">
          APRON
        </span>
      </div>
      <p className="hidden font-mono text-xs tracking-[0.2em] text-neutral-500 md:block">
        SEOUL / ICN &middot; 2026-07-11
      </p>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden text-sm text-neutral-400 sm:inline">
          박관제 · 지상운영팀
        </span>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30"
          role="img"
          aria-label="박관제 프로필 아바타"
        >
          <User aria-hidden="true" className="h-5 w-5" />
        </span>
      </div>
    </header>
  );
}

const MOBILE_NAV_ITEMS = [
  { href: "#board", label: "관제판" },
  { href: "#gatemap", label: "게이트맵" },
  { href: "#turnaround", label: "회전" },
  { href: "#delay", label: "지연" },
];

export function MobileTabBar() {
  return (
    <nav
      aria-label="주요 메뉴 (모바일)"
      className="fixed inset-x-0 bottom-0 z-20 flex border-t border-amber-500/10 bg-neutral-950/95 backdrop-blur md:hidden"
    >
      {MOBILE_NAV_ITEMS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex min-h-[44px] flex-1 items-center justify-center px-2 py-3 text-xs font-medium tracking-wide text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-400 active:text-amber-300"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
