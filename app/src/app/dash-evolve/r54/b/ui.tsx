"use client";

import type { LucideIcon } from "lucide-react";
import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import type { Deployment, StageId } from "./data";
import { STAGES } from "./data";
import { BORDER, FOCUS_RING, HOVER_ACTIVE_BG, PANEL_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/* ------------------------------------------------------------- Avatar --
   Generated initials on a flat tint, never a photograph — the brief notes this concept needs no
   photographic imagery at all. Deterministic color picked from a fixed hash of the initials so the
   same person always renders the same tint, with no Math.random() involved. */

const AVATAR_TINTS = [
  "bg-fuchsia-400/15 text-fuchsia-300",
  "bg-cyan-400/15 text-cyan-300",
  "bg-amber-400/15 text-amber-300",
  "bg-violet-400/15 text-violet-300",
  "bg-lime-400/15 text-lime-300",
];

function tintFor(initials: string): string {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) ?? 0);
  return AVATAR_TINTS[code % AVATAR_TINTS.length];
}

export function Avatar({ initials, size = 28, name }: { initials: string; size?: number; name: string }) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cx("inline-flex shrink-0 items-center justify-center rounded-full font-medium", tintFor(initials))}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.38) }}
    >
      {initials}
    </span>
  );
}

/* --------------------------------------------------------------- Badges */

export function EyebrowLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION, className)}>{children}</span>;
}

export function Pill({ tone, Icon, children }: { tone: { text: string; bg: string; border: string }; Icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className={cx("inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] font-medium leading-none", tone.text, tone.bg, tone.border)}>
      {Icon ? <Icon size={11} aria-hidden="true" className="shrink-0" /> : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

/* ------------------------------------------------------------- Dropdown */

export function useOutsideClose(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

/* ------------------------------------------------------------- MoveMenu --
   The keyboard-reachable alternative to drag-and-drop: every card (and the detail panel) exposes
   this "Move to…" menu so moving a deployment between stages never depends on a pointer drag. */

export function MoveMenu({
  deployment,
  onMove,
  align = "left",
}: {
  deployment: Deployment;
  onMove: (id: string, stage: StageId) => void;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const buttonId = `move-trigger-${deployment.id}`;

  return (
    <div ref={ref} className="relative">
      <button
        id={buttonId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={cx(
          "flex h-7 items-center gap-1 rounded-md border px-2 text-[11px] font-medium",
          BORDER,
          TEXT_CAPTION,
          HOVER_ACTIVE_BG,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        Move to
        <ChevronDown size={12} aria-hidden="true" />
      </button>
      {open ? (
        <div
          role="menu"
          aria-labelledby={buttonId}
          onClick={(e) => e.stopPropagation()}
          className={cx(
            "absolute z-30 mt-1.5 w-44 overflow-hidden rounded-xl border p-1 shadow-lg shadow-black/40",
            align === "right" ? "right-0" : "left-0",
            BORDER,
            PANEL_BG,
          )}
        >
          {STAGES.map((s) => {
            const isCurrent = s.id === deployment.stage;
            return (
              <button
                key={s.id}
                type="button"
                role="menuitem"
                disabled={isCurrent}
                onClick={() => {
                  if (!isCurrent) onMove(deployment.id, s.id);
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs",
                  isCurrent ? cx(TEXT_CAPTION, "cursor-default opacity-60") : cx(TEXT_PRIMARY, "font-medium", HOVER_ACTIVE_BG),
                  TRANSITION,
                  FOCUS_RING,
                )}
              >
                {s.label}
                {isCurrent ? <Check size={13} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
