"use client";

import { AlertTriangle, Bell, ChevronDown, Command, LogOut, Menu, Search, User } from "lucide-react";
import { useState } from "react";
import { FEED_ITEMS, regionById } from "./data";
import { BORDER, FOCUS, TEXT_AUX, TEXT_PRIMARY, TONE_BADGE, TRANSITION, cx } from "./tokens";
import { useOutsideClose } from "./ui";

const CRITICAL_ITEMS = FEED_ITEMS.filter((f) => f.tone === "critical").slice(0, 4);

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Notifications, ${CRITICAL_ITEMS.length} critical`}
        className={cx("relative flex h-9 w-9 items-center justify-center rounded-lg border", BORDER, TRANSITION, FOCUS, "hover:bg-white/5")}
      >
        <Bell size={16} aria-hidden="true" className={TEXT_AUX} />
        {CRITICAL_ITEMS.length > 0 ? (
          <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400" />
        ) : null}
      </button>
      {open ? (
        <div role="menu" aria-label="Critical notifications" className={cx("absolute right-0 top-full z-30 mt-1.5 w-72 overflow-hidden rounded-xl border bg-zinc-900 shadow-lg shadow-black/40", BORDER)}>
          <p className={cx("border-b px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em]", BORDER, TEXT_AUX)}>Critical, last 24h</p>
          <ul>
            {CRITICAL_ITEMS.map((item) => {
              const region = regionById(item.regionId);
              return (
                <li key={item.id} className={cx("border-b px-3 py-2 last:border-b-0", BORDER)}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={13} aria-hidden="true" className="mt-0.5 shrink-0 text-rose-400" />
                    <div className="min-w-0">
                      <p className={cx("truncate text-xs font-medium", TEXT_PRIMARY)}>{item.title}</p>
                      <p className={cx("mt-0.5 text-[11px]", TEXT_AUX)}>
                        {region?.name ?? "Unknown region"} · {item.time}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cx("flex h-9 items-center gap-1.5 rounded-lg border pl-1 pr-2", BORDER, TRANSITION, FOCUS, "hover:bg-white/5")}
      >
        <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-400/15 text-[11px] font-semibold text-sky-300">
          RS
        </span>
        <ChevronDown size={13} aria-hidden="true" className={TEXT_AUX} />
      </button>
      {open ? (
        <div role="menu" aria-label="Account" className={cx("absolute right-0 top-full z-30 mt-1.5 w-40 overflow-hidden rounded-lg border bg-zinc-900 py-1 shadow-lg shadow-black/40", BORDER)}>
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={cx("flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs", TEXT_AUX, TRANSITION, FOCUS, "hover:text-zinc-50")}>
            <User size={13} aria-hidden="true" /> Profile
          </button>
          <button type="button" role="menuitem" onClick={() => setOpen(false)} className={cx("flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-xs", TEXT_AUX, TRANSITION, FOCUS, "hover:text-zinc-50")}>
            <LogOut size={13} aria-hidden="true" /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function Topbar({ onOpenPalette, onOpenMobileNav }: { onOpenPalette: () => void; onOpenMobileNav: () => void }) {
  return (
    <header className={cx("sticky top-0 z-30 flex h-11 items-center gap-2 border-b bg-zinc-950/95 px-4 backdrop-blur sm:px-6", BORDER)}>
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg lg:hidden", TRANSITION, FOCUS, "hover:bg-white/5")}
      >
        <Menu size={17} aria-hidden="true" className={TEXT_AUX} />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={cx(
          "flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border px-2.5 text-xs",
          BORDER,
          TRANSITION,
          FOCUS,
          TEXT_AUX,
          "hover:bg-white/5 hover:text-zinc-50",
        )}
      >
        <Search size={14} aria-hidden="true" />
        <span className="flex-1 text-left">Search regions, incidents…</span>
        <span className={cx("hidden items-center gap-0.5 rounded border px-1 text-[10px] font-medium sm:flex", BORDER)}>
          <Command size={10} aria-hidden="true" />K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <a
          href="#region-table"
          className={cx(
            "hidden h-9 items-center gap-1.5 rounded-lg bg-sky-400 px-3 text-xs font-semibold text-zinc-950 sm:flex",
            TRANSITION,
            FOCUS,
            "hover:bg-sky-300 active:bg-sky-500",
          )}
        >
          View all regions
        </a>
        <NotificationsMenu />
        <AvatarMenu />
      </div>
    </header>
  );
}
