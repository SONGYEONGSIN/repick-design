"use client";

import { useState } from "react";
import { Package, Sparkles, ShieldCheck, Wallet, type LucideIcon } from "lucide-react";
import {
  MAX_SCALE_DAYS,
  STAGES,
  formatDuration,
  personaById,
  stageLabel,
  stageWidthPct,
  totalDays,
  type PersonaId,
  type StageId,
} from "./data";
import { ACCENT_BASE, ACCENT_BRIGHT, DISPLAY, FOCUS, INK } from "./ui";

const STAGE_ICON: Record<StageId, LucideIcon> = {
  list: Package,
  match: Sparkles,
  verify: ShieldCheck,
  payout: Wallet,
};

// Four fixed fills, darkest-to-lightest reading of the same accent so the sequence stays legible
// in grayscale too -- but color is never the only signal: every segment is also paired with its
// own icon and full text label below the bar (STAGE_ICON + the name/duration row).
const STAGE_FILL: Record<StageId, string> = {
  list: "#1E3A8A",
  match: "#1D4ED8",
  verify: ACCENT_BASE,
  payout: ACCENT_BRIGHT,
};

type Props = {
  personaId: PersonaId;
  variant?: "compact" | "full";
};

/**
 * The horizontal stage/duration timeline -- the output vocabulary this candidate is assigned.
 * A single bar whose segment WIDTHS and LABEL TEXT recompute live from STAGE_DAYS, keyed only by
 * the selected persona (no Math.random, no Date.now). All bars share MAX_SCALE_DAYS as their
 * track width, so a faster persona's filled bar visibly ends sooner -- width itself carries the
 * duration, not just the numbers printed on top of it.
 */
export default function StageTimeline({ personaId, variant = "full" }: Props) {
  const persona = personaById(personaId);
  const total = totalDays(personaId);
  const [selected, setSelected] = useState<StageId>("match");

  const announcement = `${persona.label}: ${STAGES.map((s) => stageLabel(personaId, s.id)).join(
    ". ",
  )}. Total time from listing to payout, ${formatDuration(total)}.`;

  return (
    <div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div
        className="flex h-7 w-full overflow-hidden rounded-full bg-zinc-800/80"
        role="img"
        aria-label={`Selling-journey timeline for ${persona.label}, ${formatDuration(total)} total, drawn against a ${MAX_SCALE_DAYS}-day scale.`}
      >
        {STAGES.map((stage) => {
          const pct = stageWidthPct(personaId, stage.id);
          return (
            <div
              key={stage.id}
              aria-hidden="true"
              className="h-full flex-none transition-[width] duration-300 first:rounded-l-full last:rounded-r-full"
              style={{ width: `${pct}%`, backgroundColor: STAGE_FILL[stage.id] }}
            />
          );
        })}
      </div>

      {variant === "compact" ? (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {STAGES.map((stage) => (
            <div key={stage.id} className="min-w-0 text-center">
              <p className="truncate text-[10.5px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
                {stage.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STAGES.map((stage) => {
            const Icon = STAGE_ICON[stage.id];
            const isSelected = selected === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelected(stage.id)}
                className={`min-w-0 rounded-xl border px-3 py-3 text-left transition-colors ${FOCUS} ${
                  isSelected
                    ? "border-[#60A5FA] bg-[#1D4ED8]/15"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <Icon
                  className="h-4 w-4"
                  aria-hidden="true"
                  strokeWidth={2}
                  style={{ color: ACCENT_BRIGHT }}
                />
                <p className="mt-2 truncate text-[12px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
                  {stage.name}
                </p>
                <p
                  className="mt-1 truncate text-[14px] font-semibold tabular-nums text-zinc-50"
                  style={DISPLAY}
                >
                  {stageLabel(personaId, stage.id)}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {variant === "full" && (
        <div className="mt-4 rounded-xl border border-zinc-800 p-4" style={{ backgroundColor: "#12141A" }}>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {STAGES.find((s) => s.id === selected)!.name}
          </p>
          <p className="mt-1.5 max-w-[430px] text-[14px] font-normal leading-[1.6] text-zinc-300">
            {STAGES.find((s) => s.id === selected)!.detail}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <p className="tabular-nums">
          <span className="text-[26px] font-bold text-zinc-50" style={DISPLAY}>
            {formatDuration(total)}
          </span>
          <span className="ml-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            total, listing to payout
          </span>
        </p>
        <p
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold tabular-nums"
          style={{ backgroundColor: ACCENT_BASE, color: INK }}
        >
          <Wallet className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.5} />
          {stageLabel(personaId, "payout")}
        </p>
      </div>
    </div>
  );
}
