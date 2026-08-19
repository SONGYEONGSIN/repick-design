"use client";

import { Bell, HelpCircle, LogOut, Menu, Radio, Search, Settings } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CURRENT_USER, NOTIFICATIONS } from "./data";
import { ACCENT_SOLID, BORDER, FOCUS_VISIBLE, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { useOutsideClose } from "./ui";

export default function Topbar({ onOpenPalette, onOpenMobileNav }: { onOpenPalette: () => void; onOpenMobileNav: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useOutsideClose(notifOpen, () => setNotifOpen(false));
  const userRef = useOutsideClose(userOpen, () => setUserOpen(false));

  return (
    <header className={cx("flex h-11 shrink-0 items-center gap-2 border-b px-3 sm:px-4", BORDER, "bg-white")}>
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open menu"
        className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-lg lg:hidden", TEXT_CAPTION, HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
      >
        <Menu size={18} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        aria-haspopup="dialog"
        className={cx("ml-1 flex h-11 flex-1 items-center gap-2 rounded-lg border pl-3 pr-2.5 text-left text-sm sm:max-w-sm", BORDER, "bg-zinc-50 hover:bg-zinc-100", TEXT_CAPTION, TRANSITION, FOCUS_VISIBLE)}
      >
        <Search size={16} aria-hidden="true" className="shrink-0" />
        <span className="sr-only truncate sm:not-sr-only sm:inline">Search regions, services, comparisons</span>
        <span aria-hidden="true" className={cx("ml-auto hidden shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-medium sm:inline-flex", BORDER, "bg-white", TEXT_CAPTION)}>
          &#8984;K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <button type="button" className={cx("hidden h-11 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium sm:inline-flex", ACCENT_SOLID, TRANSITION, FOCUS_VISIBLE)}>
          <Radio size={15} aria-hidden="true" />
          Alert rules
        </button>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={notifOpen}
            aria-label={`Notifications (${NOTIFICATIONS.length} unread)`}
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            className={cx("relative grid h-11 w-11 place-items-center rounded-full border", BORDER, "bg-white", HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
          >
            <Bell size={17} aria-hidden="true" className={TEXT_CAPTION} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-teal-600" aria-hidden="true" />
          </button>
          {notifOpen ? (
            <div role="menu" aria-label="Notifications" className={cx("absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border", BORDER, "bg-white shadow-lg shadow-zinc-950/10")}>
              <div className={cx("border-b px-4 py-3", BORDER)}>
                <h2 className={cx("text-sm font-semibold", TEXT_PRIMARY)}>Notifications</h2>
              </div>
              <ul className={cx("divide-y", BORDER)}>
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="px-4 py-2.5">
                    <p className={cx("text-sm leading-snug", TEXT_PRIMARY)}>{n.text}</p>
                    <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div ref={userRef} className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={userOpen}
            aria-label={`${CURRENT_USER.name} account menu`}
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className={cx("flex h-11 items-center gap-2 rounded-full border pl-1 pr-2", BORDER, "bg-white", HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
          >
            <Image
              src={`https://images.unsplash.com/photo-${CURRENT_USER.avatarId}?w=60&h=60&fit=crop&crop=faces`}
              alt={`${CURRENT_USER.name} profile photo`}
              width={30}
              height={30}
              className="h-[30px] w-[30px] shrink-0 rounded-full object-cover"
            />
            <span className={cx("hidden text-sm font-medium sm:inline", TEXT_PRIMARY)}>{CURRENT_USER.name}</span>
          </button>
          {userOpen ? (
            <div role="menu" aria-label="Account" className={cx("absolute right-0 top-full z-40 mt-2 w-60 overflow-hidden rounded-xl border p-1", BORDER, "bg-white shadow-lg shadow-zinc-950/10")}>
              <div className={cx("border-b px-3 py-2.5", BORDER)}>
                <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</p>
                <p className={cx("truncate text-xs", TEXT_CAPTION)}>{CURRENT_USER.email}</p>
              </div>
              <div className="p-1">
                {[
                  { label: "Console settings", Icon: Settings },
                  { label: "Documentation", Icon: HelpCircle },
                  { label: "Log out", Icon: LogOut },
                ].map((item) => (
                  <button key={item.label} type="button" role="menuitem" onClick={() => setUserOpen(false)} className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}>
                    <item.Icon size={16} aria-hidden="true" className={TEXT_CAPTION} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
