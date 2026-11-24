"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Search, Plus, Bell, ChevronDown, Circle, X } from "lucide-react";
import { FOCUS_RING } from "./ui";
import { CATEGORY_LABEL, CATEGORY_ORDER, SEVERITY_LABEL, SEVERITY_ORDER, type Category, type Severity } from "./data";

interface TopbarProps {
  onOpenMobileNav: () => void;
  onOpenPalette: () => void;
  breachCount: number;
}

export function Topbar({ onOpenMobileNav, onOpenPalette, breachCount }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [ruleOpen, setRuleOpen] = useState(false);
  const [status, setStatus] = useState<"available" | "away">("available");
  const notifRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 lg:hidden ${FOCUS_RING}`}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className={`flex h-11 min-w-0 flex-1 items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 hover:bg-zinc-100 sm:max-w-xs ${FOCUS_RING}`}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate">Search or jump to…</span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-mono text-[11px] text-zinc-500 sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => setRuleOpen(true)}
          className={`flex h-11 items-center gap-1.5 rounded-md bg-orange-700 px-3.5 text-sm font-medium text-white hover:bg-orange-800 sm:px-4 ${FOCUS_RING}`}
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">New detection rule</span>
          <span className="sm:hidden">New rule</span>
        </button>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={notifOpen}
            className={`relative flex h-11 w-11 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 ${FOCUS_RING}`}
            aria-label={`Notifications, ${breachCount} unread`}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {breachCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-700 px-1 text-[10px] font-bold tabular-nums text-white">
                {breachCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div
              role="menu"
              aria-label="Notifications"
              className="absolute right-0 top-[calc(100%+8px)] z-20 w-80 max-w-[85vw] overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg"
            >
              <div className="border-b border-zinc-200 px-3.5 py-2.5 text-sm font-bold text-zinc-900">Notifications</div>
              <ul className="divide-y divide-zinc-100">
                <li className="px-3.5 py-3 text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">{breachCount} items</span> have passed their SLA
                  target and need review now.
                </li>
                <li className="px-3.5 py-3 text-sm text-zinc-700">
                  <span className="font-medium text-zinc-900">Marcus Webb</span> escalated a listing to senior
                  review.
                </li>
                <li className="px-3.5 py-3 text-sm text-zinc-700">Weekly reviewer accuracy report is ready.</li>
              </ul>
            </div>
          )}
        </div>

        <div className="relative" ref={avatarRef}>
          <button
            type="button"
            onClick={() => setAvatarOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={avatarOpen}
            className={`flex h-11 items-center gap-1.5 rounded-md px-1.5 hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-700">
              MR
              <Circle
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${
                  status === "available" ? "fill-orange-700 text-orange-700" : "fill-zinc-400 text-zinc-400"
                }`}
                aria-hidden="true"
              />
            </span>
            <ChevronDown className="hidden h-4 w-4 text-zinc-500 sm:block" aria-hidden="true" />
          </button>
          {avatarOpen && (
            <div
              role="menu"
              aria-label="Account quick menu"
              className="absolute right-0 top-[calc(100%+8px)] z-20 w-56 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg"
            >
              <div className="border-b border-zinc-200 px-3.5 py-2.5">
                <p className="truncate text-sm font-medium text-zinc-900">Mina Russo</p>
                <p className="truncate text-xs text-zinc-500">Senior reviewer</p>
              </div>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={status === "available"}
                onClick={() => setStatus("available")}
                className={`flex h-11 w-full items-center gap-2 px-3.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <Circle className="h-2.5 w-2.5 fill-orange-700 text-orange-700" aria-hidden="true" />
                Status: Available
              </button>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={status === "away"}
                onClick={() => setStatus("away")}
                className={`flex h-11 w-full items-center gap-2 px-3.5 text-left text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <Circle className="h-2.5 w-2.5 fill-zinc-400 text-zinc-400" aria-hidden="true" />
                Status: Away
              </button>
            </div>
          )}
        </div>
      </div>

      {ruleOpen && <NewRuleDialog onClose={() => setRuleOpen(false)} />}
    </header>
  );
}

function NewRuleDialog({ onClose }: { onClose: () => void }) {
  const [category, setCategory] = useState<Category>(CATEGORY_ORDER[0]);
  const [severity, setSeverity] = useState<Severity>(SEVERITY_ORDER[0]);
  const [created, setCreated] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-zinc-900/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-rule-title"
        className="relative z-10 w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-5 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="new-rule-title" className="text-base font-bold text-zinc-900">
            New detection rule
          </h2>
          <button
            type="button"
            ref={closeRef}
            onClick={onClose}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING}`}
            aria-label="Close new detection rule dialog"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>

        {!created ? (
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Flag category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={`h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 ${FOCUS_RING}`}
              >
                {CATEGORY_ORDER.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Auto-assign severity</span>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className={`h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 ${FOCUS_RING}`}
              >
                {SEVERITY_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {SEVERITY_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => setCreated(true)}
              className={`flex h-11 w-full items-center justify-center rounded-md bg-orange-700 text-sm font-medium text-white hover:bg-orange-800 ${FOCUS_RING}`}
            >
              Create rule
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="rounded-md bg-orange-50 px-3.5 py-3 text-sm text-orange-800">
              Rule created: new <span className="font-medium">{CATEGORY_LABEL[category]}</span> flags will be
              queued at <span className="font-medium">{SEVERITY_LABEL[severity]}</span> severity.
            </p>
            <button
              type="button"
              onClick={onClose}
              className={`flex h-11 w-full items-center justify-center rounded-md border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
