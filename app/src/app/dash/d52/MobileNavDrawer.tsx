"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { NAV_ITEMS } from "./IconRail";
import { FOCUS_RING } from "./ui/focus";

export function MobileNavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Mouse-only convenience; kept out of the tab sequence since Escape and the explicit close
          button already cover keyboard dismissal — a full-viewport element doesn't need its own
          focus-visible treatment when it's never a keyboard focus stop. */}
      <button
        aria-label="Close navigation menu"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/70"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-white/10 bg-zinc-950 p-4"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[14px] font-semibold text-zinc-50" style={{ fontFamily: "var(--font-display-wide)" }}>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-400 text-[13px] text-zinc-950">F</span>
            Floorline
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <nav aria-label="Primary" className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                aria-current={item.active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors ${FOCUS_RING} ${
                  item.active ? "bg-amber-400/15 text-amber-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
