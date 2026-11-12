"use client";

import {
  Bell,
  Check,
  ChevronDown,
  Command,
  Download,
  Keyboard,
  Menu as MenuIcon,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "./menu";
import { FOCUS_RING } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", title: "RFQ conversion dipped below 45%", detail: "First RFQ Sent stage, last 7 days", icon: Bell },
  { id: "n2", title: "New cohort entered Repeat Buyer", detail: "214 accounts crossed the 90-day mark", icon: Check },
  { id: "n3", title: "Weekly funnel digest is ready", detail: "Sent to workspace admins", icon: Bell },
];

export function Topbar({
  onOpenPalette,
  onOpenMobileNav,
}: {
  onOpenPalette: () => void;
  onOpenMobileNav: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(3);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [exported, setExported] = useState(false);
  const exportTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (exportTimer.current) clearTimeout(exportTimer.current);
    };
  }, []);

  function handleExport() {
    setExported(true);
    if (exportTimer.current) clearTimeout(exportTimer.current);
    exportTimer.current = setTimeout(() => setExported(false), 2200);
  }

  return (
    <header className="flex h-[60px] flex-shrink-0 items-center gap-2 border-b border-white/10 bg-zinc-950/80 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className={`${FOCUS_RING} flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100 lg:hidden`}
      >
        <MenuIcon size={18} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`${FOCUS_RING} flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-left text-zinc-400 hover:bg-white/[0.07] sm:max-w-sm`}
      >
        <Search size={15} className="flex-shrink-0" aria-hidden="true" />
        <span className="hidden min-w-0 flex-1 truncate text-xs sm:inline">Search buyers, orders, cohorts…</span>
        <span className="ml-auto hidden flex-shrink-0 items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400 sm:inline-flex">
          <Command size={10} aria-hidden="true" />K
        </span>
      </button>

      <div className="ml-auto flex flex-shrink-0 items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={handleExport}
            className={`${FOCUS_RING} flex h-11 items-center gap-2 rounded-lg bg-violet-600 px-3 text-xs font-medium text-white hover:bg-violet-700 motion-safe:transition-colors`}
          >
            {exported ? <Check size={15} aria-hidden="true" /> : <Download size={15} aria-hidden="true" />}
            <span className="hidden sm:inline">{exported ? "Snapshot saved" : "Export Snapshot"}</span>
          </button>
          <span role="status" aria-live="polite" className="sr-only">
            {exported ? "Funnel snapshot exported." : ""}
          </span>
        </div>

        <Menu
          open={notifOpen}
          onClose={() => setNotifOpen(false)}
          align="right"
          trigger={
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              aria-expanded={notifOpen}
              aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
              className={`${FOCUS_RING} relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100`}
            >
              <Bell size={17} aria-hidden="true" />
              {unread > 0 ? (
                <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-medium text-white">
                  {unread}
                </span>
              ) : null}
            </button>
          }
          panel={
            <>
              <div className="flex items-center justify-between px-2.5 pt-1">
                <MenuLabel>Notifications</MenuLabel>
                <button
                  type="button"
                  onClick={() => setUnread(0)}
                  className={`${FOCUS_RING} mb-1 text-[11px] font-medium text-violet-300 hover:text-violet-200`}
                >
                  Mark all read
                </button>
              </div>
              {NOTIFICATIONS.map((n) => {
                const Icon = n.icon;
                return (
                  <div key={n.id} className="flex items-start gap-2 rounded-lg px-2.5 py-2">
                    <Icon size={14} className="mt-0.5 flex-shrink-0 text-zinc-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-zinc-200">{n.title}</p>
                      <p className="truncate text-[11px] text-zinc-400">{n.detail}</p>
                    </div>
                  </div>
                );
              })}
            </>
          }
          panelClassName="w-[19rem]"
        />

        <Menu
          open={avatarOpen}
          onClose={() => setAvatarOpen(false)}
          align="right"
          trigger={
            <button
              type="button"
              onClick={() => setAvatarOpen((v) => !v)}
              aria-expanded={avatarOpen}
              className={`${FOCUS_RING} flex h-11 items-center gap-1.5 rounded-lg px-1.5 hover:bg-white/5`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/20 text-[11px] font-medium text-violet-200">
                JA
              </span>
              <ChevronDown size={14} className="hidden text-zinc-400 sm:inline" aria-hidden="true" />
            </button>
          }
          panel={
            <>
              <MenuItem icon={<UserRound size={14} aria-hidden="true" />} onClick={() => setAvatarOpen(false)}>
                Profile
              </MenuItem>
              <MenuItem icon={<Settings size={14} aria-hidden="true" />} onClick={() => setAvatarOpen(false)}>
                Preferences
              </MenuItem>
              <MenuItem icon={<Keyboard size={14} aria-hidden="true" />} onClick={() => setAvatarOpen(false)}>
                Keyboard shortcuts
              </MenuItem>
              <MenuSeparator />
              <MenuItem onClick={() => setAvatarOpen(false)} tone="danger">
                Sign out
              </MenuItem>
            </>
          }
          panelClassName="w-[12rem]"
        />
      </div>
    </header>
  );
}
