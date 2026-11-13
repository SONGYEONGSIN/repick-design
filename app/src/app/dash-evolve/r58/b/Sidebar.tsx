"use client";

import Image from "next/image";
import { ShieldAlert, Activity, Server, BookOpen, Settings, ChevronDown } from "lucide-react";
import { FOCUS } from "./ui";

const NAV_SECTIONS: {
  heading: string;
  items: { label: string; icon: typeof ShieldAlert; active?: boolean }[];
}[] = [
  {
    heading: "Workspace",
    items: [
      { label: "Incidents", icon: ShieldAlert, active: true },
      { label: "Services", icon: Server },
      { label: "Runbooks", icon: BookOpen },
    ],
  },
  {
    heading: "Insights",
    items: [{ label: "Trends", icon: Activity }],
  },
];

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  return (
    <aside
      className={
        mobile
          ? "flex h-full w-72 flex-col border-r border-zinc-200 bg-white"
          : "sticky top-0 hidden h-screen w-64 flex-shrink-0 flex-col border-r border-zinc-200 bg-white lg:flex"
      }
    >
      <div className="flex h-full w-full min-w-0 flex-col">
        <div className="flex h-[44px] items-center gap-2 px-5 pt-5">
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="truncate font-[family-name:var(--font-display-grotesk)] text-lg font-semibold text-zinc-900">
            Signalwatch
          </span>
        </div>

        <div className="mt-5 min-w-0 px-3">
          <button
            type="button"
            className={`flex w-full min-w-0 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left ${FOCUS}`}
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-semibold text-white">
              OP
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">Platform Reliability</span>
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-6 flex-1 min-w-0 space-y-6 overflow-y-auto px-3 pb-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.heading} className="min-w-0">
              <div className="px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">{section.heading}</div>
              <ul className="mt-2 space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-current={item.active ? "page" : undefined}
                      className={`flex w-full min-w-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors ${FOCUS} ${
                        item.active ? "bg-emerald-50 text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"
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

        <div className="min-w-0 border-t border-zinc-200 p-3">
          <div className="flex min-w-0 items-center gap-2.5 rounded-lg px-2 py-2">
            <Image
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956"
              alt="Portrait of Priya Nair"
              width={32}
              height={32}
              className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">Priya Nair</p>
              <p className="truncate text-xs font-normal text-zinc-500">On-call lead</p>
            </div>
            <button
              type="button"
              aria-label="Open settings"
              className={`flex-shrink-0 rounded-md p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS}`}
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
