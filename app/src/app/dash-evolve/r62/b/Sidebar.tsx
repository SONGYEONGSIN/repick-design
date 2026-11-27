"use client";

import Image from "next/image";
import { Boxes, LayoutGrid, PackageSearch, Truck, Warehouse, ClipboardList, Settings, ChevronDown } from "lucide-react";
import { FOCUS } from "./ui";
import { PERSON_BY_ID } from "./data";

const NAV_SECTIONS: {
  heading: string;
  items: { label: string; icon: typeof LayoutGrid; active?: boolean }[];
}[] = [
  {
    heading: "Workspace",
    items: [
      { label: "Overview", icon: LayoutGrid, active: true },
      { label: "Inventory", icon: PackageSearch },
      { label: "Shipments", icon: Truck },
      { label: "Dock & Zones", icon: Warehouse },
    ],
  },
  {
    heading: "Insights",
    items: [{ label: "Replenishment", icon: ClipboardList }],
  },
];

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const user = PERSON_BY_ID.get("jordan")!;

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
          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-green-700 text-white">
            <Boxes className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="truncate font-[family-name:var(--font-display-grotesk)] text-lg font-semibold text-zinc-900">
            Dockwise
          </span>
        </div>

        <div className="mt-5 min-w-0 px-3">
          <button
            type="button"
            className={`flex w-full min-w-0 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left ${FOCUS}`}
          >
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-zinc-200 text-[11px] font-medium text-zinc-700">
              HF
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">Harborlight Fulfillment</span>
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-zinc-500" aria-hidden="true" />
          </button>
        </div>

        <nav className="mt-6 min-w-0 flex-1 space-y-6 overflow-y-auto px-3 pb-4">
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
                        item.active ? "bg-green-50 text-green-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
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
              src={`https://images.unsplash.com/photo-${user.photoId}?q=80&w=128&auto=format&fit=crop`}
              alt={`Portrait of ${user.name}`}
              width={32}
              height={32}
              className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900">{user.name}</p>
              <p className="truncate text-xs font-normal text-zinc-500">{user.role}</p>
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
