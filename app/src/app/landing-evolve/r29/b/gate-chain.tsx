"use client";

import { Fragment, useId, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronDown,
  RotateCcw,
  Lock,
  Unlock,
  type LucideIcon,
} from "lucide-react";
import {
  DEFAULT_ACTIVE_GATES,
  GATES,
  LISTINGS,
  POOL_COUNT,
  cascadeCounts,
  evaluateListing,
  type GateKey,
  type GateStepStatus,
} from "./data";
import { ACCENT, ACCENT_DEEP, DISPLAY, FOCUS_RING, INK, MUTED, MUTED_ICON, STOP } from "./tokens";

const COL_WIDTHS = {
  listing: "26%",
  gate: "11%",
  verdict: "19%",
};

export default function GateChain({
  activeGates,
  onToggle,
  onPreset,
  qualifyingCount,
}: {
  activeGates: Set<GateKey>;
  onToggle: (key: GateKey) => void;
  onPreset: (keys: GateKey[]) => void;
  qualifyingCount: number;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const tableId = useId();
  const captionId = `${tableId}-caption`;

  const counts = cascadeCounts(LISTINGS, activeGates);
  const activeCount = activeGates.size;

  return (
    <div>
      {/* Live qualifying-count headline. aria-live announces the number as it changes;
          this same {qualifyingCount} value is what the closing CTA quotes verbatim. */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="flex flex-wrap items-end justify-between gap-6 rounded-2xl border border-zinc-200 bg-[#F3F6F4] px-6 py-6 sm:px-8 sm:py-7"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: MUTED }}>
            Qualifying matches, right now
          </p>
          <p
            className="mt-1 text-[clamp(2.75rem,2.1rem+2.4vw,4.25rem)] font-extrabold leading-none tabular-nums"
            style={{ ...DISPLAY, color: ACCENT }}
          >
            {qualifyingCount}
            <span className="ml-2 align-baseline text-[1.1rem] font-semibold" style={{ color: MUTED }}>
              / {POOL_COUNT}
            </span>
          </p>
        </div>
        <p className="max-w-[320px] text-sm leading-[1.5]" style={{ color: MUTED }}>
          {activeCount === 0
            ? "No gates switched on — every listing in the pool passes through untouched."
            : `${activeCount} of 5 gates switched on. Each one you add can only narrow the list further, never widen it.`}
        </p>
      </div>

      {/* Toggle row — the five independent requirement gates, plus two quick presets. */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: MUTED }}>
            Your requirements
          </p>
          <div className="flex flex-wrap gap-2">
            <PresetButton
              icon={RotateCcw}
              label="Reset to recommended"
              onClick={() => onPreset(DEFAULT_ACTIVE_GATES)}
            />
            <PresetButton icon={Lock} label="Require everything" onClick={() => onPreset(GATES.map((g) => g.key))} />
            <PresetButton icon={Unlock} label="No requirements" onClick={() => onPreset([])} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {GATES.map((gate, i) => {
            const isOn = activeGates.has(gate.key);
            const remaining = counts[i + 1];
            const Icon = gate.Icon;
            return (
              <button
                key={gate.key}
                type="button"
                role="switch"
                aria-checked={isOn}
                onClick={() => onToggle(gate.key)}
                className={`flex min-w-0 flex-col gap-2 rounded-xl border p-4 text-left transition-colors ${FOCUS_RING} ${
                  isOn ? "border-transparent text-white" : "border-zinc-300 text-[#15171B] hover:border-zinc-400"
                }`}
                style={isOn ? { backgroundColor: ACCENT_DEEP } : undefined}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4 flex-none" aria-hidden="true" strokeWidth={2.25} />
                  <span className="text-sm font-semibold leading-tight">{gate.label}</span>
                </span>
                <span className={`text-[11px] leading-snug ${isOn ? "text-white/85" : ""}`} style={isOn ? undefined : { color: MUTED }}>
                  {gate.helper}
                </span>
                <span
                  className={`mt-auto text-[11px] font-semibold tabular-nums ${isOn ? "text-white" : ""}`}
                  style={isOn ? undefined : { color: ACCENT_DEEP }}
                >
                  Gate {i + 1} of 5 &rarr; {remaining} remain
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The pipeline itself: one row per listing, one column per gate, stopping each
          failing listing visibly at the first active gate it fails. */}
      <div className="mt-8 min-w-0">
        <p id={captionId} className="sr-only">
          Live gate-chain results for all {POOL_COUNT} listings in the pool, showing whether each one
          passes, fails, or is not currently evaluated at each of the five requirement gates, and the
          final qualifying verdict. Results update immediately when a gate above is switched on or off.
        </p>
        <div className="relative min-w-0 overflow-x-auto rounded-2xl border border-zinc-200 lg:overflow-visible">
          <table className="w-full min-w-[800px] table-fixed border-collapse text-sm lg:min-w-0" aria-describedby={captionId}>
            <colgroup>
              <col style={{ width: COL_WIDTHS.listing }} />
              {GATES.map((g) => (
                <col key={g.key} style={{ width: COL_WIDTHS.gate }} />
              ))}
              <col style={{ width: COL_WIDTHS.verdict }} />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200 bg-[#F3F6F4] text-left text-[11px]" style={{ color: MUTED }}>
                <th scope="col" className="px-4 py-3 font-semibold uppercase tracking-[0.1em]">
                  Listing
                </th>
                {GATES.map((gate) => {
                  const isOn = activeGates.has(gate.key);
                  return (
                    <th key={gate.key} scope="col" className="px-2 py-3 text-center font-semibold uppercase tracking-[0.06em]">
                      <span className="block leading-tight">{gate.shortLabel}</span>
                      <span
                        className="mt-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.08em]"
                        style={
                          isOn
                            ? { backgroundColor: ACCENT_DEEP, color: "#FFFFFF" }
                            : { backgroundColor: "#E4E4E1", color: "#52525B" }
                        }
                      >
                        {isOn ? "ON" : "OFF"}
                      </span>
                    </th>
                  );
                })}
                <th scope="col" className="px-3 py-3 text-center font-semibold uppercase tracking-[0.1em]">
                  Verdict
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {LISTINGS.map((listing) => {
                const evalResult = evaluateListing(listing, activeGates);
                const isExpanded = expandedId === listing.id;
                const detailId = `${tableId}-detail-${listing.id}`;
                return (
                  <Fragment key={listing.id}>
                    <tr className={!evalResult.qualifies ? "bg-zinc-50/60" : undefined}>
                      <th scope="row" className="px-4 py-3 text-left font-normal">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : listing.id)}
                          aria-expanded={isExpanded}
                          aria-controls={detailId}
                          className={`flex w-full min-w-0 items-center gap-3 rounded text-left ${FOCUS_RING}`}
                        >
                          <span className="relative h-10 w-10 flex-none overflow-hidden rounded-lg bg-zinc-100">
                            <Image
                              src={`${listing.image}?auto=format&fit=crop&w=96&q=60`}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold" style={{ color: INK }}>
                              {listing.name}
                            </span>
                            <span className="block truncate text-[11px]" style={{ color: MUTED }}>
                              {listing.category}
                            </span>
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 flex-none transition-transform motion-reduce:transition-none ${isExpanded ? "rotate-180" : ""}`}
                            aria-hidden="true"
                            style={{ color: MUTED_ICON }}
                          />
                        </button>
                      </th>
                      {evalResult.steps.map((status, i) => (
                        <td key={GATES[i].key} className="px-2 py-3 text-center align-middle">
                          <GateStepCell status={status} />
                        </td>
                      ))}
                      <td className="px-3 py-3 text-center align-middle">
                        {evalResult.qualifies ? (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                            style={{ backgroundColor: ACCENT_DEEP }}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.25} />
                            Qualified
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold"
                            style={{ color: STOP }}
                          >
                            <XCircle className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.25} />
                            Held back
                          </span>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr id={detailId}>
                        <td colSpan={GATES.length + 2} className="bg-[#F3F6F4] px-4 py-3 text-left text-xs leading-relaxed" style={{ color: MUTED }}>
                          <span className="font-semibold" style={{ color: INK }}>
                            {evalResult.qualifies ? "Why it qualifies: " : "Why it was held back: "}
                          </span>
                          {evalResult.qualifies
                            ? listing.reason
                            : `Stopped at "${GATES[evalResult.stopAt ?? 0].label}" — ${listing.reason}`}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GateStepCell({ status }: { status: GateStepStatus }) {
  if (status === "pass") {
    return (
      <span className="inline-flex flex-col items-center gap-0.5">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" strokeWidth={2.25} style={{ color: ACCENT }} />
        <span className="text-[10px] font-semibold" style={{ color: ACCENT_DEEP }}>
          Pass
        </span>
      </span>
    );
  }
  if (status === "fail") {
    return (
      <span className="inline-flex flex-col items-center gap-0.5">
        <XCircle className="h-4 w-4" aria-hidden="true" strokeWidth={2.25} style={{ color: STOP }} />
        <span className="text-[10px] font-semibold" style={{ color: STOP }}>
          Stopped
        </span>
      </span>
    );
  }
  if (status === "bypassed") {
    return (
      <span className="inline-flex flex-col items-center gap-0.5">
        <MinusCircle className="h-4 w-4" aria-hidden="true" strokeWidth={2} style={{ color: MUTED_ICON }} />
        <span className="text-[10px]" style={{ color: MUTED }}>
          Not required
        </span>
      </span>
    );
  }
  // unreached: the pipeline already stopped at an earlier gate for this listing.
  return (
    <span className="inline-flex flex-col items-center gap-0.5">
      <span aria-hidden="true" className="block text-sm leading-none" style={{ color: MUTED }}>
        &mdash;
      </span>
      <span className="sr-only">Not evaluated, pipeline already stopped at an earlier gate</span>
      <span aria-hidden="true" className="text-[10px]" style={{ color: MUTED }}>
        n/a
      </span>
    </span>
  );
}

function PresetButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-[#15171B] transition-colors hover:border-zinc-400 ${FOCUS_RING}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.25} style={{ color: MUTED_ICON }} />
      {label}
    </button>
  );
}
