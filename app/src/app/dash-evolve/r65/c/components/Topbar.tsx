"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Menu, Plus, Search, Settings, User, X } from "lucide-react";
import { CURRENT_USER, NOTIFICATIONS } from "../lib/data";
import { FOCUS_RING, InitialsAvatar } from "./ui";

export function Topbar({
  onOpenDrawer,
  onOpenPalette,
}: {
  onOpenDrawer: () => void;
  onOpenPalette: () => void;
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [requisitionOpen, setRequisitionOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (requisitionOpen) closeBtnRef.current?.focus();
  }, [requisitionOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 min-w-0 items-center gap-2 border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenDrawer}
        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100 lg:hidden ${FOCUS_RING}`}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-3 text-left text-zinc-400 hover:border-white/20 sm:max-w-xs ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="sr-only truncate text-sm sm:not-sr-only sm:inline">Search departments, roles, periods…</span>
        <kbd className="ml-auto sr-only shrink-0 rounded border border-white/10 bg-zinc-950 px-1.5 py-0.5 text-[11px] text-zinc-400 sm:not-sr-only sm:inline">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => setRequisitionOpen(true)}
          className={`inline-flex h-11 items-center gap-1.5 rounded-lg bg-lime-400 px-3.5 text-sm font-medium text-zinc-950 hover:bg-lime-300 ${FOCUS_RING}`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">New requisition</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setAvatarOpen(false);
            }}
            aria-haspopup="true"
            aria-expanded={notifOpen}
            aria-label="Notifications"
            className={`relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100 ${FOCUS_RING}`}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-lime-400" aria-hidden="true" />
          </button>
          {notifOpen ? (
            <>
              <button type="button" tabIndex={-1} aria-label="Close notifications" onClick={() => setNotifOpen(false)} className="fixed inset-0 z-10 cursor-default" />
              <div role="menu" aria-label="Notifications" className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-white/10 bg-zinc-900 py-1.5 shadow-2xl">
                <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">Notifications</p>
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} role="menuitem" className="px-3 py-2 text-xs text-zinc-400">
                    <p className="leading-snug text-zinc-100">{n.title}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-400">{n.time}</p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAvatarOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-haspopup="true"
            aria-expanded={avatarOpen}
            aria-label="Account menu"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${FOCUS_RING}`}
          >
            <InitialsAvatar initials={CURRENT_USER.initials} name={CURRENT_USER.name} />
          </button>
          {avatarOpen ? (
            <>
              <button type="button" tabIndex={-1} aria-label="Close account menu" onClick={() => setAvatarOpen(false)} className="fixed inset-0 z-10 cursor-default" />
              <div role="menu" aria-label="Account" className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-white/10 bg-zinc-900 py-1.5 shadow-2xl">
                <p className="truncate px-3 py-1.5 text-xs font-medium text-zinc-100">{CURRENT_USER.name}</p>
                <button type="button" role="menuitem" onClick={() => setAvatarOpen(false)} className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-zinc-400 hover:bg-white/5 ${FOCUS_RING}`}>
                  <User className="h-3.5 w-3.5" aria-hidden="true" /> Profile
                </button>
                <button type="button" role="menuitem" onClick={() => setAvatarOpen(false)} className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-zinc-400 hover:bg-white/5 ${FOCUS_RING}`}>
                  <Settings className="h-3.5 w-3.5" aria-hidden="true" /> Workspace settings
                </button>
                <div className="my-1 border-t border-white/10" />
                <button type="button" role="menuitem" onClick={() => setAvatarOpen(false)} className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-rose-300 hover:bg-white/5 ${FOCUS_RING}`}>
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {requisitionOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button type="button" tabIndex={-1} aria-label="Close new requisition dialog" onClick={() => setRequisitionOpen(false)} className="fixed inset-0 bg-zinc-950/70" />
          <div role="dialog" aria-modal="true" aria-labelledby="req-dialog-title" className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id="req-dialog-title" className="text-sm font-semibold text-zinc-50">New requisition</h2>
                <p className="mt-1 text-xs text-zinc-400">Drafting a requisition opens it in the Pipeline below at Sourcing status once published.</p>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={() => setRequisitionOpen(false)}
                aria-label="Close new requisition dialog"
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100 ${FOCUS_RING}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setRequisitionOpen(false)}
              className={`mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-lime-400 px-4 text-sm font-medium text-zinc-950 hover:bg-lime-300 ${FOCUS_RING}`}
            >
              Save as draft
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
