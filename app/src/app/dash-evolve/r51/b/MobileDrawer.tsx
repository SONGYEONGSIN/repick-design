"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { SidebarContent } from "./Sidebar";
import type { NavId } from "./Nav";
import { FOCUS_RING } from "./ui";

export function MobileDrawer({
  open,
  onClose,
  active,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  active: NavId;
  onNavigate: (id: NavId) => void;
}) {
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label="Navigation" className="relative flex h-full w-72 flex-row bg-white shadow-xl">
        {/* Same real handler passed here as at the desktop mount — not a no-op. */}
        <SidebarContent
          active={active}
          onNavigate={(id) => {
            onNavigate(id);
            onClose();
          }}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className={`absolute right-2 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 ${FOCUS_RING}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
