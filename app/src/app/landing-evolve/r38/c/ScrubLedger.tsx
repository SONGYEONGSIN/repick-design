"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { PLAYHEAD_MAX, STAGE_SPAN, STAGES, TICK_POSITIONS } from "./data";
import { currentStageIndex, ledgerRows, trustTotal } from "./scrub-math";
import { ACCENT_FILL, ACCENT_LIGHT, MUTED_ON_DARK } from "./theme";

/**
 * The Clock: a continuous horizontal scrub timeline over one listing's
 * lifecycle. The playhead is a real `<input type="range">` (native
 * keyboard semantics — arrows, Home/End, Page Up/Down — for free, no
 * custom keydown handler needed), so dragging it recomputes every number
 * on this panel continuously, not on discrete step clicks.
 */
export default function ScrubLedger({
  value,
  onChange,
  itemName,
}: {
  value: number;
  onChange: (next: number) => void;
  itemName: string;
}) {
  const [lastAnnouncedStage, setLastAnnouncedStage] = useState(-1);

  const trust = trustTotal(value);
  const trustRounded = Math.round(trust);
  const stageIdx = currentStageIndex(value);
  const stage = STAGES[stageIdx];
  const stagePct = Math.round(((value - stageIdx * STAGE_SPAN) / STAGE_SPAN) * 100);
  const rows = ledgerRows(value);

  if (stageIdx !== lastAnnouncedStage) {
    // Announce only on stage *crossing*, not on every pixel of drag — the
    // native range input's own aria-valuetext already carries the
    // continuous, fine-grained value for assistive tech that queries it.
    setLastAnnouncedStage(stageIdx);
  }

  const valueText = `${trustRounded} percent trust accumulated. Currently inside ${stage.label}, ${stagePct} percent through this stage.`;

  return (
    <div className="rounded-3xl border border-white/10 p-5 sm:p-7" style={{ backgroundColor: "#0B0B0F" }}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: MUTED_ON_DARK }}>
          Live trust ledger — {itemName}
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: MUTED_ON_DARK }}>
          Stage {stageIdx + 1} / {STAGES.length}
        </p>
      </div>

      {/* Primary trust-accumulation readout — decorative; the real spoken
          value lives in the slider's aria-valuetext and the sr-only line below. */}
      <div aria-hidden="true" className="mt-4 flex items-end gap-3">
        <span className="font-mono text-[clamp(2.5rem,8vw,4rem)] font-extrabold leading-none tabular-nums text-white">
          {trustRounded}
          <span className="text-2xl">%</span>
        </span>
        <span className="pb-2 text-sm font-semibold text-white/60">trust accumulated</span>
      </div>
      <div aria-hidden="true" className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full origin-left rounded-full transition-transform duration-150 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${trust / 100})`, backgroundColor: ACCENT_FILL }}
        />
      </div>

      {/* The scrubber itself. */}
      <div className="relative mt-7 h-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/15" />
        {TICK_POSITIONS.map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 h-3 w-px -translate-y-1/2 bg-white/35"
            style={{ left: `${pos}%` }}
          />
        ))}
        <input
          type="range"
          min={0}
          max={PLAYHEAD_MAX}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="Listing lifecycle scrubber"
          aria-valuetext={valueText}
          className="r38c-range absolute inset-x-0 top-0 z-10 h-8 w-full cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#67E8F9]"
        />
      </div>

      <p aria-live="polite" className="sr-only">
        {lastAnnouncedStage >= 0
          ? `Entered ${STAGES[lastAnnouncedStage].label}. Trust now ${trustRounded} percent.`
          : ""}
      </p>

      {/* Quick-jump chips — a bonus way to move the playhead, native text as the accessible name. */}
      <div className="mt-4 flex flex-wrap gap-2">
        {STAGES.map((s, i) => {
          const done = rows[i].status === "done";
          const active = rows[i].status === "active";
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(i * STAGE_SPAN)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67E8F9] ${
                active
                  ? "border-transparent text-white"
                  : done
                    ? "border-white/20 text-white"
                    : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
              style={active ? { backgroundColor: ACCENT_FILL } : undefined}
            >
              {done && !active ? <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" /> : null}
              {s.short}
            </button>
          );
        })}
      </div>

      {/* The itemized ledger/receipt. Its own contained horizontal scroller
          (overflow-x-auto + [contain:layout]) so a narrow viewport never
          pushes document.scrollWidth. */}
      <div className="mt-6 overflow-x-auto [contain:layout]">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <caption className="sr-only">Live verification ledger for {itemName}</caption>
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th scope="col" className="py-2 pr-3 font-semibold text-white/70">
                Stage
              </th>
              <th scope="col" className="py-2 pr-3 font-semibold text-white/70">
                Timestamp
              </th>
              <th scope="col" className="py-2 pr-3 font-semibold text-white/70">
                Confidence pts
              </th>
              <th scope="col" className="py-2 pr-3 font-semibold text-white/70">
                Subtotal
              </th>
              <th scope="col" className="py-2 font-semibold text-white/70">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5">
                <td className="py-2.5 pr-3 font-normal text-white">{row.label}</td>
                <td className="py-2.5 pr-3 font-mono font-normal tabular-nums text-white/70">
                  {row.progress > 0 ? row.timestamp : "—"}
                </td>
                <td className="py-2.5 pr-3 font-mono font-normal tabular-nums text-white/70">
                  +{row.contribution.toFixed(1)} / {row.weight.toFixed(1)} pts
                </td>
                <td className="py-2.5 pr-3 font-mono font-normal tabular-nums text-white">
                  {row.subtotal.toFixed(1)}
                </td>
                <td className="py-2.5">
                  {row.status === "done" ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                      <CheckCircle2 aria-hidden="true" className="h-4 w-4" style={{ color: ACCENT_LIGHT }} />
                      Confirmed
                    </span>
                  ) : row.status === "active" ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-white/80">
                      <Clock3 aria-hidden="true" className="h-4 w-4" />
                      In progress — {Math.round(row.progress * 100)}%
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-normal" style={{ color: MUTED_ON_DARK }}>
                      <Circle aria-hidden="true" className="h-4 w-4" />
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.some((row) => row.detail && row.status === "done") ? (
        <p className="mt-4 text-xs font-normal leading-[1.6] text-white/50">
          Latest confirmed evidence: {rows.filter((r) => r.status === "done").slice(-1)[0]?.detail}
        </p>
      ) : null}

      <style>{`
        .r38c-range {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          margin: 0;
          padding: 0;
        }
        .r38c-range::-webkit-slider-runnable-track {
          background: transparent;
          height: 32px;
        }
        .r38c-range::-moz-range-track {
          background: transparent;
          height: 32px;
        }
        .r38c-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          margin-top: 5px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid ${ACCENT_FILL};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
          cursor: grab;
        }
        .r38c-range::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid ${ACCENT_FILL};
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
          cursor: grab;
          border-style: solid;
        }
      `}</style>
    </div>
  );
}
