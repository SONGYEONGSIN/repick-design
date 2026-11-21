"use client";

import { Check, X } from "lucide-react";
import { CHECKS, summarize, type CheckState } from "./model";
import { ACCENT, BORDER, CAPTION, FOCUS_RING, INK, MUTED, STAT_TRACKING, SURFACE, SURFACE_RAISED } from "./tokens";

interface AuthenticityMeterProps {
  state: CheckState;
  onToggle: (index: number) => void;
  idPrefix: string;
}

/**
 * The "Authenticity Confidence Meter": four independent boolean toggles, no lock or sequence
 * between them. Every value shown here — the score, the band label, the progress-bar width, and
 * the "N of 4 active" caption — is computed from `state` via `summarize()` on every render. There
 * is no hardcoded literal anywhere in this component that could drift from the toggles.
 */
export function AuthenticityMeter({ state, onToggle, idPrefix }: AuthenticityMeterProps) {
  const { score, band } = summarize(state);
  const activeCount = state.filter(Boolean).length;

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-2" role="group" aria-labelledby={`${idPrefix}-meter-heading`}>
        <p id={`${idPrefix}-meter-heading`} className="text-[13px] font-semibold" style={{ color: "#FFFFFF" }}>
          Authenticity Confidence Meter
        </p>
        <p className={`${CAPTION} tabular-nums`} style={{ color: MUTED }}>
          {activeCount} of {CHECKS.length} checks active &middot; toggle any, in any order
        </p>

        <ul className="flex flex-col gap-2">
          {CHECKS.map((check, i) => {
            const active = state[i];
            const Icon = check.Icon;
            return (
              <li key={check.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggle(i)}
                  className={`flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${FOCUS_RING}`}
                  style={{
                    backgroundColor: active ? SURFACE_RAISED : SURFACE,
                    border: `1px solid ${active ? ACCENT : BORDER}`,
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: active ? ACCENT : MUTED }} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold" style={{ color: "#FFFFFF" }}>
                      {check.label}
                    </span>
                    <span className="block truncate text-[11px]" style={{ color: MUTED }}>
                      {check.detail}
                    </span>
                  </span>
                  <span
                    className="shrink-0 text-[11px] font-semibold tabular-nums"
                    style={{ color: active ? ACCENT : MUTED }}
                    aria-hidden="true"
                  >
                    +{check.weight}
                  </span>
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: active ? ACCENT : "transparent", border: active ? "none" : `1px solid ${BORDER}` }}
                    aria-hidden="true"
                  >
                    {active ? (
                      <Check className="h-3.5 w-3.5" style={{ color: INK }} />
                    ) : (
                      <X className="h-3.5 w-3.5" style={{ color: MUTED }} />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-2 border-t pt-4" style={{ borderColor: BORDER }} aria-live="polite">
        <div className="flex items-end justify-between gap-3">
          <p className="flex items-baseline gap-1.5">
            <span className="font-extrabold tabular-nums" style={{ fontSize: "2.75rem", lineHeight: 1, color: "#FFFFFF" }}>
              {score}
            </span>
            <span className="text-sm font-semibold" style={{ color: MUTED }}>
              /100 trust score
            </span>
          </p>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${STAT_TRACKING}`}
            style={{
              color: band.badgeworthy ? ACCENT : MUTED,
              border: `1px solid ${band.badgeworthy ? ACCENT : BORDER}`,
            }}
          >
            {band.label}
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: BORDER }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Trust score"
        >
          <div className="h-full rounded-full transition-[width]" style={{ width: `${score}%`, backgroundColor: ACCENT }} />
        </div>
      </div>
    </div>
  );
}
