"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Bell, Network, Plus, Search, Settings, X } from "lucide-react";
import { FOCUS, lockBodyScroll, trapTabKey } from "./ui";

const NAV_ITEMS = [
  { id: "allocation", label: "Allocation" },
  { id: "budgets", label: "Budgets" },
  { id: "anomalies", label: "Anomalies" },
  { id: "reports", label: "Reports" },
] as const;

/**
 * There is no persistent sidebar at any width in this layout — on mobile, navigation collapses
 * into this drawer instead of a rail. It fully unmounts when closed (the caller only renders it
 * while `open`), so it never sits in the DOM as a hidden-but-present rail.
 */
export function MobileNavDrawer({
  open,
  onClose,
  onOpenSearch,
  onOpenNewAlert,
  onNavPlaceholder,
}: {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenNewAlert: () => void;
  onNavPlaceholder: (label: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && <DrawerBody onClose={onClose} onOpenSearch={onOpenSearch} onOpenNewAlert={onOpenNewAlert} onNavPlaceholder={onNavPlaceholder} />}
    </AnimatePresence>
  );
}

function DrawerBody({
  onClose,
  onOpenSearch,
  onOpenNewAlert,
  onNavPlaceholder,
}: {
  onClose: () => void;
  onOpenSearch: () => void;
  onOpenNewAlert: () => void;
  onNavPlaceholder: (label: string) => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const unlock = lockBodyScroll();
    return () => {
      unlock();
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <motion.button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
        className="absolute inset-0 bg-black/60"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-heading"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onClose();
          }
          trapTabKey(e, panelRef.current);
        }}
        initial={{ x: reduceMotion ? 0 : "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: reduceMotion ? 0 : "-100%" }}
        transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
        className="relative z-10 flex h-full w-full max-w-xs min-w-0 flex-col border-r border-white/10 bg-zinc-950 shadow-2xl shadow-black/60"
      >
        <div className="flex h-16 min-w-0 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Network className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 id="mobile-nav-heading" className="truncate text-sm font-semibold text-zinc-50">
              Spendmesh
            </h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close navigation menu" className={`${FOCUS} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50`}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto p-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className={`${FOCUS} flex h-11 w-full min-w-0 items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 text-left text-sm font-normal text-zinc-400`}
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            Jump to a team or service&hellip;
          </button>

          <nav aria-label="Primary" className="mt-3 flex min-w-0 flex-col gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = item.id === "allocation";
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    if (active) {
                      onClose();
                      return;
                    }
                    onNavPlaceholder(item.label);
                  }}
                  className={`${FOCUS} flex h-11 min-w-0 items-center whitespace-nowrap rounded-xl px-3 text-left text-sm font-medium transition-colors ${
                    active ? "bg-violet-600/15 text-violet-300" : "text-zinc-300 hover:bg-white/5 hover:text-zinc-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 flex min-w-0 flex-col gap-2 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNewAlert();
              }}
              className={`${FOCUS} flex h-11 w-full min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white`}
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              New alert
            </button>
            <button
              type="button"
              onClick={() => onNavPlaceholder("Notifications")}
              className={`${FOCUS} flex h-11 w-full min-w-0 items-center gap-2.5 rounded-xl px-3 text-left text-sm font-normal text-zinc-300 hover:bg-white/5 hover:text-zinc-50`}
            >
              <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
              Notifications
            </button>
            <button
              type="button"
              onClick={() => onNavPlaceholder("Account settings")}
              className={`${FOCUS} flex h-11 w-full min-w-0 items-center gap-2.5 rounded-xl px-3 text-left text-sm font-normal text-zinc-300 hover:bg-white/5 hover:text-zinc-50`}
            >
              <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
              Account settings
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
