"use client";

import { Check, Plus, RefreshCcw, ShieldCheck, Eye, RotateCcw } from "lucide-react";
import {
  ADD_ON_META,
  ADD_ON_ORDER,
  type AddOnId,
  type CoverageResult,
  type CoverageState,
  formatUsd,
} from "./coverage";
import { ACCENT, ACCENT_SOFT_BG, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, SURFACE_TINT } from "./tokens";

const ICONS: Record<AddOnId, typeof ShieldCheck> = {
  shield: ShieldCheck,
  loss: Eye,
  resale: RefreshCcw,
};

interface CoverageDeviceProps {
  state: CoverageState;
  result: CoverageResult;
  onToggle: (id: AddOnId) => void;
  onReset: () => void;
  compact?: boolean;
  headingId: string;
}

/**
 * The "Add-On Combination Tier" device: 3 independent boolean toggles. Every value shown below
 * the toggles — tier label, tier blurb, itemized price lines, total — comes from one `result`
 * object (produced by `deriveCoverage`, passed in by the caller) so this component never computes
 * or re-types a number of its own. `compact` only changes type scale and whether the longer
 * blurb paragraph renders; the underlying data and markup shape stay identical, so the same
 * control behaves identically in the Hero and in its full mirror further down the page.
 */
export function CoverageDevice({ state, result, onToggle, onReset, compact = false, headingId }: CoverageDeviceProps) {
  return (
    <div>
      <div
        className="grid gap-2"
        role="group"
        aria-labelledby={headingId}
        style={{ gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit, minmax(150px, 1fr))" }}
      >
        {ADD_ON_ORDER.map((id) => {
          const meta = ADD_ON_META[id];
          const Icon = ICONS[id];
          const active = state[id];
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(id)}
              className={`flex min-w-0 items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${FOCUS_RING}`}
              style={{
                borderColor: active ? ACCENT : BORDER,
                backgroundColor: active ? ACCENT : SURFACE_TINT,
              }}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                  style={{ color: active ? ON_ACCENT_TEXT : MUTED }}
                />
                <span
                  className="truncate text-[13px] font-semibold"
                  style={{ color: active ? ON_ACCENT_TEXT : FG }}
                >
                  {meta.label}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <span
                  className="text-[12px] font-normal tabular-nums"
                  style={{ color: active ? ON_ACCENT_TEXT : MUTED }}
                >
                  +{formatUsd(meta.price)}
                </span>
                {active ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" style={{ color: ON_ACCENT_TEXT }} />
                ) : (
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" style={{ color: MUTED }} />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="mt-3 rounded-xl p-3.5"
        style={{ backgroundColor: ACCENT_SOFT_BG, border: `1px solid ${BORDER}` }}
      >
        {!compact && (
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
            Your tier
          </p>
        )}
        <p
          className={`font-extrabold leading-[1.2] tracking-[-0.02em] ${compact ? "text-[16px]" : "mt-1 text-[18px]"}`}
          style={{ color: FG }}
        >
          {result.tierLabel}
        </p>
        {!compact && (
          <p className="mt-1.5 max-w-[320px] text-[12.5px] font-normal leading-[1.55]" style={{ color: MUTED }}>
            {result.tierBlurb}
          </p>
        )}

        <dl className="mt-2.5 space-y-1 border-t pt-2" style={{ borderColor: BORDER }}>
          {!compact && (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[12.5px] font-normal" style={{ color: MUTED }}>
                Item price
              </dt>
              <dd className="text-[12.5px] font-normal tabular-nums" style={{ color: FG }}>
                {formatUsd(result.itemPrice)}
              </dd>
            </div>
          )}
          {result.lines.map((line) => (
            <div key={line.id} className="flex items-center justify-between gap-3">
              <dt className="text-[12.5px] font-normal" style={{ color: MUTED }}>
                {line.label}
              </dt>
              <dd className="text-[12.5px] font-normal tabular-nums" style={{ color: FG }}>
                +{formatUsd(line.price)}
              </dd>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 border-t pt-1.5" style={{ borderColor: BORDER }}>
            <dt className="text-[13px] font-semibold" style={{ color: FG }}>
              Total
            </dt>
            <dd className="text-[13px] font-semibold tabular-nums" style={{ color: ACCENT }}>
              {formatUsd(result.total)}
            </dd>
          </div>
        </dl>
      </div>

      {!compact && (
        <button
          type="button"
          onClick={onReset}
          className={`mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold ${FOCUS_RING}`}
          style={{ color: MUTED }}
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Reset to recommended (Shield + Resale Lock)
        </button>
      )}
    </div>
  );
}
