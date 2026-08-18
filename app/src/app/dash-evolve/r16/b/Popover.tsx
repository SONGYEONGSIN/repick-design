"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FOCUS_RING } from "./ui";

/**
 * Generic trigger + panel popover shared by the workspace switcher, notifications, avatar menu
 * and the column-visibility control. Escape closes and focus returns to the trigger button — the
 * exact repair pattern the gate's "state you open" focus sweep looks for (opened-then-closed
 * focus must land somewhere visible, never fall back to <body>).
 *
 * Focus is only ever read/written inside `useEffect` (after `open` flips false) or inside plain
 * event handlers — never synchronously during render — because the `close` value handed to
 * `render()` must not itself touch a ref: this codebase's lint config treats a ref-reading
 * closure passed into a function call made during render as an unsafe read, even when that
 * function is never invoked until a later click.
 */
export function Popover({
  label,
  align = "left",
  panelClassName = "",
  render,
}: {
  label: ReactNode;
  align?: "left" | "right";
  panelClassName?: string;
  render: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 ${FOCUS_RING}`}
      >
        {label}
      </button>
      {open ? (
        <div
          ref={panelRef}
          className={`absolute top-[calc(100%+8px)] z-30 min-w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          } ${panelClassName}`}
        >
          {render(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}
