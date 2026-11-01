"use client";

import { Bell, LogOut, Menu, Plus, Search, Settings } from "lucide-react";
import { forwardRef, useState } from "react";
import { CURRENT_USER, NOTIFICATIONS } from "./data";
import { ACCENT_SOLID, BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Avatar, useOutsideClose } from "./ui";

const Topbar = forwardRef<HTMLButtonElement, { onOpenPalette: () => void; onOpenMobileNav: () => void }>(function Topbar(
  { onOpenPalette, onOpenMobileNav },
  paletteTriggerRef,
) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useOutsideClose(notifOpen, () => setNotifOpen(false));
  const userRef = useOutsideClose(userOpen, () => setUserOpen(false));

  return (
    <header className={cx("flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4", BORDER, "bg-zinc-950")}>
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation menu"
        className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-lg lg:hidden", TEXT_CAPTION, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
      >
        <Menu size={18} aria-hidden="true" />
      </button>

      <button
        ref={paletteTriggerRef}
        type="button"
        onClick={onOpenPalette}
        aria-haspopup="dialog"
        className={cx(
          "ml-1 flex h-11 flex-1 items-center gap-2 rounded-lg border pl-3 pr-2.5 text-left text-sm sm:max-w-sm",
          BORDER,
          "bg-white/5 hover:bg-white/10",
          TEXT_CAPTION,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        <Search size={16} aria-hidden="true" className="shrink-0" />
        <span className="sr-only truncate sm:not-sr-only sm:inline">Search deployments, models, owners…</span>
        <span aria-hidden="true" className={cx("ml-auto hidden shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-medium sm:inline-flex", BORDER, "bg-zinc-900", TEXT_CAPTION)}>
          &#8984;K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <button type="button" className={cx("hidden h-11 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium sm:inline-flex", ACCENT_SOLID, TRANSITION, FOCUS_RING)}>
          <Plus size={15} aria-hidden="true" />
          New deployment request
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
            className={cx("relative grid h-11 w-11 place-items-center rounded-full border", BORDER, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
          >
            <Bell size={17} aria-hidden="true" className={TEXT_CAPTION} />
            <span aria-hidden="true" className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-cyan-400" />
          </button>
          {notifOpen ? (
            <div role="menu" aria-label="Notifications" className={cx("absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border shadow-lg shadow-black/50", BORDER, "bg-zinc-900")}>
              <div className={cx("border-b px-4 py-3", BORDER)}>
                {/* Not a heading: this transient menu is already announced by its own aria-label,
                    and the only h1 on the page lives in <main>, which this header precedes in the
                    DOM — an h2 here would render before that h1 in document order. */}
                <p className={cx("text-sm font-semibold", TEXT_PRIMARY)}>Notifications</p>
              </div>
              <ul className="divide-y divide-white/10">
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
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className={cx("grid h-11 w-11 place-items-center rounded-full border", BORDER, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
          >
            {/* No aria-label on this button: a custom label here previously didn't contain the
               Avatar's visible "JA" text (label-content-name-mismatch). Letting the button's
               accessible name come from its content avoids the conflict — the Avatar span
               (role="img", aria-label=full name) already supplies a full, non-redundant name. */}
            <Avatar initials={CURRENT_USER.initials} name={CURRENT_USER.name} size={30} />
            <span className="sr-only"> account menu</span>
          </button>
          {userOpen ? (
            <div role="menu" aria-label="Account" className={cx("absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-xl border p-1 shadow-lg shadow-black/50", BORDER, "bg-zinc-900")}>
              <div className="px-2.5 py-2">
                <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</p>
                <p className={cx("truncate text-xs", TEXT_CAPTION)}>{CURRENT_USER.role}</p>
              </div>
              <button type="button" role="menuitem" className={cx("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
                <Settings size={14} aria-hidden="true" className={TEXT_CAPTION} />
                Settings
              </button>
              <button type="button" role="menuitem" className={cx("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
                <LogOut size={14} aria-hidden="true" className={TEXT_CAPTION} />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
});

export default Topbar;
