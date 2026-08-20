"use client";

import { Bell, FileDown, LifeBuoy, LogOut, Menu, Search, Settings } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CURRENT_USER, NOTIFICATIONS } from "./data";
import {
  ACCENT_SOLID,
  BORDER,
  CARD_BG,
  FOCUS,
  HOVER_ACTIVE_BG,
  TEXT_CAPTION,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TRANSITION,
  cx,
} from "./tokens";
import { useOutsideClose } from "./ui";

export default function Topbar({ onOpenPalette, onOpenMobileNav }: { onOpenPalette: () => void; onOpenMobileNav: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useOutsideClose(notifOpen, () => setNotifOpen(false));
  const userRef = useOutsideClose(userOpen, () => setUserOpen(false));

  return (
    <header className={cx("sticky top-0 z-30 flex h-11 shrink-0 items-center gap-2 border-b px-3 sm:px-4", BORDER, CARD_BG)}>
      <button
        type="button"
        onClick={onOpenMobileNav}
        className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-lg lg:hidden", HOVER_ACTIVE_BG, TRANSITION, FOCUS)}
      >
        <Menu size={18} aria-hidden="true" className={TEXT_SECONDARY} />
        <span className="sr-only">Open navigation</span>
      </button>

      {/* The visible ⌘K glyph is part of this control's name on wide screens, so the label is real
          text revealed at sm rather than an aria-label that would contradict what is on screen. */}
      <button
        type="button"
        onClick={onOpenPalette}
        aria-haspopup="dialog"
        className={cx("flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border pl-3 pr-2.5 text-left sm:max-w-md", BORDER, "bg-zinc-950/60 hover:bg-white/5", TRANSITION, FOCUS)}
      >
        <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
        <span className={cx("sr-only truncate text-sm font-normal sm:not-sr-only", TEXT_CAPTION)}>Search stages, RMAs, merchants</span>
        <span aria-hidden="true" className={cx("ml-auto hidden shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-medium sm:inline-flex", BORDER, "bg-zinc-900", TEXT_CAPTION)}>
          &#8984;K
        </span>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <button type="button" onClick={onOpenPalette} className={cx("hidden h-11 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium sm:inline-flex", ACCENT_SOLID, TRANSITION, FOCUS)}>
          <FileDown size={15} aria-hidden="true" />
          Export recovery report
        </button>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={notifOpen}
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            className={cx("relative grid h-11 w-11 place-items-center rounded-full border", BORDER, "bg-zinc-950/60", HOVER_ACTIVE_BG, TRANSITION, FOCUS)}
          >
            <Bell size={17} aria-hidden="true" className={TEXT_SECONDARY} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-indigo-400" aria-hidden="true" />
            <span className="sr-only">Notifications, {NOTIFICATIONS.length} unread</span>
          </button>
          {notifOpen ? (
            <div role="menu" aria-label="Notifications" className={cx("absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-1.5rem)] rounded-xl border", BORDER, CARD_BG, "shadow-lg shadow-black/50")}>
              <div className={cx("border-b px-4 py-3", BORDER)}>
                <h2 className={cx("text-sm font-semibold", TEXT_PRIMARY)}>Notifications</h2>
              </div>
              <ul className={cx("divide-y", BORDER)}>
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="px-4 py-2.5">
                    <p className={cx("text-sm font-normal leading-snug", TEXT_SECONDARY)}>{n.text}</p>
                    <p className={cx("mt-0.5 text-xs font-normal", TEXT_CAPTION)}>{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div ref={userRef} className="relative">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={userOpen}
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className={cx("flex h-11 items-center gap-2 rounded-full border pl-1 pr-2", BORDER, "bg-zinc-950/60", HOVER_ACTIVE_BG, TRANSITION, FOCUS)}
          >
            <Image
              src={`https://images.unsplash.com/photo-${CURRENT_USER.avatarId}?w=60&h=60&fit=crop&crop=faces`}
              alt=""
              width={30}
              height={30}
              className={cx("h-[30px] w-[30px] shrink-0 rounded-full object-cover", "bg-zinc-800")}
            />
            <span className={cx("hidden text-sm font-medium sm:inline", TEXT_PRIMARY)}>{CURRENT_USER.name}</span>
            <span className="sr-only">Account menu</span>
          </button>
          {userOpen ? (
            <div role="menu" aria-label="Account" className={cx("absolute right-0 top-full z-40 mt-2 w-60 rounded-xl border p-1", BORDER, CARD_BG, "shadow-lg shadow-black/50")}>
              <div className={cx("border-b px-3 py-2.5", BORDER)}>
                <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</p>
                <p className={cx("truncate text-xs font-normal", TEXT_CAPTION)}>{CURRENT_USER.email}</p>
              </div>
              <div className="p-1">
                {[
                  { label: "Console settings", Icon: Settings },
                  { label: "Grading handbook", Icon: LifeBuoy },
                  { label: "Log out", Icon: LogOut },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    onClick={() => setUserOpen(false)}
                    className={cx("flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_SECONDARY, HOVER_ACTIVE_BG, "hover:text-zinc-50", TRANSITION, FOCUS)}
                  >
                    <item.Icon size={16} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
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
