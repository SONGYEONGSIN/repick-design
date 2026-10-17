"use client";

import { Activity, Bell, Boxes, LayoutGrid, Radio, Settings, ShieldAlert, Star, X } from "lucide-react";
import Image from "next/image";
import { cx, DISPLAY_MONO, FOCUS, TEXT_AUX, TEXT_PRIMARY, TRANSITION } from "./tokens";

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutGrid;
  active?: boolean;
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Monitor",
    items: [
      { id: "overview", label: "Overview", icon: LayoutGrid, active: true },
      { id: "feed", label: "Signal feed", icon: Radio },
      { id: "watchlist", label: "Watchlist", icon: Star },
    ],
  },
  {
    label: "Manage",
    items: [
      { id: "instruments", label: "Instruments", icon: Boxes },
      { id: "alerts", label: "Alert rules", icon: Bell },
      { id: "risk", label: "Risk reports", icon: ShieldAlert },
    ],
  },
];

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/5 px-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-violet-600">
          <Activity aria-hidden="true" className="size-4 text-white" />
        </span>
        <span style={DISPLAY_MONO} className={cx("text-[15px] font-semibold tracking-tight", TEXT_PRIMARY)}>
          Fluxgate
        </span>
      </div>

      <nav aria-label="Main menu" className="flex-1 space-y-5 overflow-y-auto px-3 pb-4 pt-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className={cx("px-2 text-[11px] font-medium uppercase tracking-wider", TEXT_AUX)}>{section.label}</p>
            <ul className="mt-1.5 space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={!item.active}
                      aria-current={item.active ? "page" : undefined}
                      title={item.active ? undefined : "Coming soon in this demo"}
                      className={cx(
                        "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium",
                        TRANSITION,
                        FOCUS,
                        item.active
                          ? "bg-violet-500/15 text-violet-300"
                          : cx(TEXT_AUX, "hover:bg-white/5 hover:text-zinc-200 disabled:pointer-events-none disabled:opacity-50"),
                      )}
                    >
                      <Icon aria-hidden="true" className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/5 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
          <Image
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=faces"
            alt="Priya Kapoor profile photo"
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full object-cover"
          />
          <span className="min-w-0 flex-1">
            <span className={cx("block truncate text-[13px] font-medium", TEXT_PRIMARY)}>Priya Kapoor</span>
            <span className={cx("block truncate text-[11.5px]", TEXT_AUX)}>Pricing Strategy Lead</span>
          </span>
          <button
            type="button"
            aria-label="Open settings"
            title="Settings"
            className={cx("flex size-11 shrink-0 items-center justify-center rounded-lg", TEXT_AUX, TRANSITION, FOCUS, "hover:bg-white/5 hover:text-zinc-200")}
          >
            <Settings aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-zinc-950 lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button type="button" aria-label="Close menu" onClick={onCloseMobile} className="absolute inset-0 bg-black/60" />
          <div className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-white/5 bg-zinc-950 shadow-xl">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close menu"
              className={cx("absolute right-2 top-2 flex size-11 items-center justify-center rounded-lg", TEXT_AUX, TRANSITION, FOCUS, "hover:bg-white/5 hover:text-zinc-200")}
            >
              <X aria-hidden="true" className="size-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      ) : null}
    </>
  );
}
