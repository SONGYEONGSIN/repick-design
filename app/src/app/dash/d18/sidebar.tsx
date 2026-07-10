import type { ComponentType } from "react";
import {
  LayoutGrid,
  Radar,
  Gauge,
  AlertTriangle,
  TowerControl,
} from "lucide-react";

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  current?: boolean;
}[] = [
  { href: "#board", label: "관제판", icon: LayoutGrid, current: true },
  { href: "#gatemap", label: "게이트맵", icon: Radar },
  { href: "#turnaround", label: "회전분석", icon: Gauge },
  { href: "#delay", label: "지연분석", icon: AlertTriangle },
];

export function Sidebar() {
  return (
    <nav
      aria-label="주요 메뉴"
      className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:border-r md:border-amber-500/10 md:bg-neutral-950"
    >
      <div className="flex h-16 items-center gap-2 border-b border-amber-500/10 px-5">
        <TowerControl aria-hidden="true" className="h-6 w-6 text-amber-400" />
        <span className="font-mono text-lg font-bold tracking-widest text-amber-400">
          APRON
        </span>
      </div>
      <ul className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon, current }) => (
          <li key={href}>
            <a
              href={href}
              aria-current={current ? "page" : undefined}
              className={`flex min-h-[44px] items-center gap-3 rounded-md px-3 text-sm font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 ${
                current
                  ? "bg-amber-500/10 text-amber-300"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
              }`}
            >
              <Icon aria-hidden className="h-5 w-5" />
              {label}
            </a>
          </li>
        ))}
      </ul>
      <p className="border-t border-amber-500/10 px-5 py-4 text-xs leading-relaxed text-neutral-500">
        인천국제공항
        <br />
        지상운영 관제 · ICN OPS
      </p>
    </nav>
  );
}
