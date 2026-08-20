"use client";

/**
 * Backhaul — ⌘K command palette. Searches pipeline stages, individual held units (by RMA, model or
 * merchant) and the page's own sections. Choosing a unit selects the stage that unit sits in and
 * scrolls to the held-units table, so the palette is a shortcut into the same selection state the
 * funnel drives rather than a separate mode.
 *
 * The text field carries the route's focus ring itself — no `outline-none` on the input with the
 * ring pushed onto a wrapper, because then tabbing into the field changes nothing on the field.
 */

import { CornerDownLeft, Layers, PackageSearch, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { StageId } from "./data";
import { QUICK_JUMPS, STAGE_META, UNITS_BY_STAGE, fmtInt } from "./data";
import { BORDER, CARD_BG, EYEBROW, FOCUS, FOCUS_INSET, HOVER_ACTIVE_BG, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";

const ALL_UNITS = STAGE_META.flatMap((s) => UNITS_BY_STAGE[s.id]);

export default function CommandPalette({ onClose, onSelectStage }: { onClose: () => void; onSelectStage: (id: StageId) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const stages = useMemo(() => (q === "" ? STAGE_META : STAGE_META.filter((s) => s.name.toLowerCase().includes(q) || s.short.toLowerCase().includes(q))), [q]);

  const units = useMemo(() => {
    const matched = q === "" ? ALL_UNITS : ALL_UNITS.filter((u) => u.id.toLowerCase().includes(q) || u.model.toLowerCase().includes(q) || u.merchant.toLowerCase().includes(q));
    return matched.slice(0, 6);
  }, [q]);

  const jumps = useMemo(() => (q === "" ? QUICK_JUMPS : QUICK_JUMPS.filter((j) => j.label.toLowerCase().includes(q))), [q]);

  function jumpTo(targetId: string) {
    onClose();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const nothing = stages.length === 0 && units.length === 0 && jumps.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-xl rounded-2xl border shadow-2xl shadow-black/60", BORDER, CARD_BG)}
      >
        <div className={cx("flex items-center gap-2 border-b p-2", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("ml-1.5 shrink-0", TEXT_CAPTION)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search stages, RMAs, merchants…"
            aria-label="Search stages, held units and sections"
            className={cx("h-10 min-w-0 flex-1 rounded-lg bg-transparent px-1 text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-10 w-10 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_INSET)}>
            <X size={16} aria-hidden="true" className={TEXT_CAPTION} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        <div className="max-h-[min(60vh,26rem)] overflow-y-auto p-2 [scrollbar-width:thin]">
          {nothing ? (
            <p className={cx("px-2.5 py-6 text-center text-sm font-normal", TEXT_CAPTION)}>Nothing matches &ldquo;{query.trim()}&rdquo;.</p>
          ) : null}

          {stages.length > 0 ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <span className={cx(EYEBROW, TEXT_CAPTION)}>Pipeline stages</span>
              </div>
              {stages.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onSelectStage(s.id);
                    onClose();
                    document.getElementById("funnel-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={cx("flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_INSET)}
                >
                  <Layers size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  <span className="min-w-0 flex-1 truncate">{s.name}</span>
                  <span className={cx("shrink-0 text-xs font-normal", TEXT_CAPTION)}>{fmtInt(UNITS_BY_STAGE[s.id].length)} held</span>
                </button>
              ))}
            </div>
          ) : null}

          {units.length > 0 ? (
            <div className="mb-1">
              <div className="px-2.5 py-1">
                <span className={cx(EYEBROW, TEXT_CAPTION)}>Held units</span>
              </div>
              {units.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    onSelectStage(u.stage);
                    jumpTo("units-card");
                  }}
                  className={cx("flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_INSET)}
                >
                  <PackageSearch size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  <span className={cx("shrink-0", NUM)}>{u.id}</span>
                  <span className={cx("min-w-0 flex-1 truncate text-xs font-normal", TEXT_SECONDARY)}>
                    {u.model} · {u.merchant}
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {jumps.length > 0 ? (
            <div>
              <div className="px-2.5 py-1">
                <span className={cx(EYEBROW, TEXT_CAPTION)}>Jump to</span>
              </div>
              {jumps.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => jumpTo(j.targetId)}
                  className={cx("flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_INSET)}
                >
                  <j.Icon size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  <span className="min-w-0 flex-1 truncate">{j.label}</span>
                  <CornerDownLeft size={13} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
