"use client";

import Image from "next/image";
import {
  Gauge,
  Ticket,
  Users,
  Workflow,
  BarChart3,
  Settings,
  ChevronDown,
  LifeBuoy,
} from "lucide-react";

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400";

const NAV_SECTIONS: {
  heading: string;
  items: { label: string; icon: typeof Gauge; active?: boolean }[];
}[] = [
  {
    heading: "Workspace",
    items: [
      { label: "Overview", icon: Gauge, active: true },
      { label: "Tickets", icon: Ticket },
      { label: "Teams", icon: Users },
      { label: "Automations", icon: Workflow },
    ],
  },
  {
    heading: "Insights",
    items: [{ label: "Reports", icon: BarChart3 }],
  },
];

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  return (
    <aside
      className={
        mobile
          ? "flex h-full w-72 flex-col border-r border-white/10 bg-slate-950"
          : "sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col border-r border-white/10 bg-slate-950 lg:flex"
      }
    >
      {/* Explicit w-full + min-w-0 on this wrapper: the <aside> above is a column flex box so
          this isn't strictly load-bearing here, but it documents the rule and protects this
          component if it's ever reused inside a row-direction shell. */}
      <div className="flex h-full w-full min-w-0 flex-col">
        <div className="flex h-[44px] items-center gap-2 px-5 pt-5">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-green-500 text-slate-950">
            <LifeBuoy className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="truncate font-[family-name:var(--font-display-grotesk)] text-lg font-semibold text-slate-50">
            Ridgehaul
          </span>
        </div>

        <div className="mt-5 min-w-0 px-3">
          <button
            type="button"
            className={`flex w-full min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left ${FOCUS}`}
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-slate-800 text-[11px] font-semibold text-slate-200">
              CS
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-100">
              Core Support &amp; Field Operations
            </span>
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-6 flex-1 min-w-0 space-y-6 overflow-y-auto px-3 pb-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.heading} className="min-w-0">
              <div className="px-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">{section.heading}</div>
              <ul className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-current={item.active ? "page" : undefined}
                      className={`flex w-full min-w-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors ${FOCUS} ${
                        item.active ? "bg-green-500/15 text-green-400" : "text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="min-w-0 border-t border-white/10 p-3">
          <div className="flex min-w-0 items-center gap-2.5 rounded-lg px-2 py-2">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="Portrait of Jordan Blake"
              width={32}
              height={32}
              className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-100">Jordan Blake</p>
              <p className="truncate text-xs font-normal text-slate-400">Operations Lead</p>
            </div>
            <button type="button" aria-label="Open settings" className={`flex-shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-slate-200 ${FOCUS}`}>
              <Settings className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
