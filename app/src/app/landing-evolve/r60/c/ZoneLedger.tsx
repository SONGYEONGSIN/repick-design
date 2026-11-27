"use client";

import { AlertTriangle, Check } from "lucide-react";
import Image from "next/image";
import { PHOTO_ID, photoUrl } from "./listings";
import { ZONES, deriveRange, lineFor, type ViewMode } from "./zones";
import { ACCENT, ACCENT_SOFT_BG, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, SURFACE, SURFACE_TINT } from "./tokens";

interface ZoneLedgerProps {
  flaggedIds: Set<string>;
  view: ViewMode;
  onToggleZone: (id: string) => void;
  onSetView: (view: ViewMode) => void;
  /** Compact mode (Hero only): photo + chips + live range + view toggle, no ledger rows — the
   * full six-row ledger lives in the full device below, never duplicated. */
  compact?: boolean;
  groupLabelId?: string;
}

/**
 * The page's one input-manipulation device. Six fixed, always-present zone chips (variable
 * cardinality: any 0 to 6 may be flagged, in any combination) recompute a live price RANGE —
 * flagging a zone WIDENS the range and lowers its midpoint, confirming it clean keeps the range
 * tight. A second, independent toggle reframes every ledger row's copy between a seller's
 * disclosure voice and a buyer's "already accounted for" voice, without changing any number.
 */
export function ZoneLedger({ flaggedIds, view, onToggleZone, onSetView, compact = false, groupLabelId }: ZoneLedgerProps) {
  const range = deriveRange(flaggedIds);

  return (
    <div className="rounded-2xl p-4" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "4 / 3", backgroundColor: "#27272A" }}>
        <Image
          src={photoUrl(640)}
          alt={`Item under self-inspection, photo id ${PHOTO_ID}`}
          fill
          sizes="(min-width: 1024px) 420px, 90vw"
          className="object-cover"
        />
      </div>

      <div role="group" aria-labelledby={groupLabelId} className="mt-3 grid grid-cols-3 gap-1.5">
        {ZONES.map((zone) => {
          const flagged = flaggedIds.has(zone.id);
          return (
            <button
              key={zone.id}
              type="button"
              aria-pressed={flagged}
              onClick={() => onToggleZone(zone.id)}
              className={`rounded-lg px-2 py-2 text-[11.5px] font-semibold leading-tight ${FOCUS_RING}`}
              style={{
                backgroundColor: flagged ? ACCENT : SURFACE_TINT,
                color: flagged ? ON_ACCENT_TEXT : MUTED,
              }}
            >
              {zone.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="tabular-nums">
          <span className="text-[20px] font-extrabold" style={{ color: FG }}>
            ${range.low}–{range.high}
          </span>
          <span className="ml-1.5 text-[11.5px] font-normal" style={{ color: MUTED }}>
            est. range
          </span>
        </p>
        <div className="flex items-center gap-1 rounded-full p-1" role="group" aria-label="Viewing as" style={{ backgroundColor: SURFACE_TINT }}>
          {(["seller", "buyer"] as const).map((option) => {
            const active = view === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => onSetView(option)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${FOCUS_RING}`}
                style={{ backgroundColor: active ? ACCENT : "transparent", color: active ? ON_ACCENT_TEXT : MUTED }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {!compact && (
        <div className="mt-4 space-y-2">
          {ZONES.map((zone) => {
            const flagged = flaggedIds.has(zone.id);
            return (
              <div key={zone.id} className="flex items-start gap-2.5 rounded-lg p-2.5" style={{ backgroundColor: flagged ? ACCENT_SOFT_BG : "#09090B" }}>
                {flagged ? (
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" style={{ color: ACCENT }} />
                ) : (
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" style={{ color: MUTED }} />
                )}
                <p className="text-[12.5px] font-normal leading-[1.5]" style={{ color: FG }}>
                  <span className="font-semibold">{zone.label}:</span> {lineFor(zone, flagged, view)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
