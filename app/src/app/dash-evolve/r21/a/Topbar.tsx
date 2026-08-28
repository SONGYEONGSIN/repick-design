"use client";

import { Bell, Download, HelpCircle, LogOut, Menu, Search, Settings } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CURRENT_USER } from "./data";
import { ACCENT_SOLID, BORDER, FOCUS, HOVER_BG, PANEL_BG, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { useOutsideClose } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "SUP-2210 breached its 4h SLA window", time: "2m ago" },
  { id: "n2", text: "Mira Solis resolved SUP-2140", time: "18m ago" },
  { id: "n3", text: "Weekly triage digest is ready", time: "1h ago" },
];

export default function Topbar({ onOpenPalette, onOpenMobileNav }: { onOpenPalette: () => void; onOpenMobileNav: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useOutsideClose(notifOpen, () => setNotifOpen(false));
  const userRef = useOutsideClose(userOpen, () => setUserOpen(false));

  return (
    <header className={cx("sticky top-0 z-30 flex h-11 shrink-0 items-center gap-2 border-b px-3 sm:px-4", BORDER, PANEL_BG)}>
      <button type="button" onClick={onOpenMobileNav} className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-lg text-sm font-medium lg:hidden", TEXT_AUX, HOVER_BG, TRANSITION, FOCUS)}>
        <Menu size={18} aria-hidden="true" />
        <span className="sr-only">Open navigation</span>
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        aria-haspopup="dialog"
        className={cx("ml-1 flex h-11 flex-1 items-center gap-2 rounded-lg border pl-3 pr-2.5 text-left text-sm font-normal sm:max-w-md", BORDER, SURFACE_INSET, HOVER_BG, TEXT_MUTED, TRANSITION, FOCUS)}
      >
        <Search size={16} aria-hidden="true" className="shrink-0" />
        <span className="sr-only truncate sm:not-sr-only sm:inline">Search tickets</span>
        <span aria-hidden="true" className={cx("ml-auto hidden shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-medium sm:inline-flex", BORDER, PANEL_BG, TEXT_AUX)}>
          &#8984;K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <button type="button" className={cx("hidden h-11 items-center gap-1.5 rounded-lg px-3.5 text-sm font-semibold sm:inline-flex", ACCENT_SOLID, TRANSITION, FOCUS)}>
          <Download size={15} aria-hidden="true" strokeWidth={2.25} />
          Export digest
        </button>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={notifOpen}
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            className={cx("relative grid h-11 w-11 place-items-center rounded-full border text-sm font-medium", BORDER, SURFACE_INSET, HOVER_BG, TRANSITION, FOCUS)}
          >
            <Bell size={17} aria-hidden="true" className={TEXT_AUX} />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-cyan-600" aria-hidden="true" />
            <span className="sr-only">{`Notifications, ${NOTIFICATIONS.length} unread`}</span>
          </button>
          {notifOpen ? (
            <div role="menu" aria-label="Notifications" className={cx("absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-1.5rem)] rounded-xl border", BORDER, PANEL_BG, "shadow-xl shadow-zinc-900/10")}>
              <div className={cx("border-b px-4 py-3", BORDER)}>
                <p className={cx("text-sm font-semibold", TEXT_PRIMARY)}>Notifications</p>
              </div>
              <ul className="divide-y divide-zinc-100">
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="px-4 py-2.5">
                    <p className={cx("text-sm font-normal leading-snug", TEXT_PRIMARY)}>{n.text}</p>
                    <p className={cx("mt-0.5 text-[11px] font-normal", TEXT_AUX)}>{n.time}</p>
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
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className={cx("flex h-11 items-center gap-2 rounded-full border pl-1 pr-2", BORDER, SURFACE_INSET, HOVER_BG, TRANSITION, FOCUS)}
          >
            <Image
              src={`https://images.unsplash.com/photo-${CURRENT_USER.avatarId}?w=60&h=60&fit=crop&crop=faces`}
              alt=""
              width={30}
              height={30}
              className="h-[30px] w-[30px] shrink-0 rounded-full bg-zinc-100 object-cover"
            />
            <span className={cx("hidden text-sm font-medium sm:inline", TEXT_PRIMARY)}>{CURRENT_USER.name}</span>
            <span className="sr-only sm:hidden">{`${CURRENT_USER.name} account menu`}</span>
          </button>
          {userOpen ? (
            <div role="menu" aria-label="Account" className={cx("absolute right-0 top-full z-40 mt-2 w-60 rounded-xl border p-1", BORDER, PANEL_BG, "shadow-xl shadow-zinc-900/10")}>
              <div className={cx("border-b px-3 py-2.5", BORDER)}>
                <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</p>
                <p className={cx("truncate text-[11px] font-normal", TEXT_AUX)}>{CURRENT_USER.email}</p>
              </div>
              <div className="p-1">
                {[
                  { label: "Console settings", Icon: Settings },
                  { label: "Runbook docs", Icon: HelpCircle },
                  { label: "Log out", Icon: LogOut },
                ].map((item) => (
                  <button key={item.label} type="button" role="menuitem" onClick={() => setUserOpen(false)} className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_BG, TRANSITION, FOCUS)}>
                    <item.Icon size={16} aria-hidden="true" className={TEXT_AUX} />
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
