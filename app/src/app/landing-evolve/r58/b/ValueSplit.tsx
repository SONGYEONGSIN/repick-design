"use client";

import { Check, Eye, RefreshCcw, ShieldCheck, X } from "lucide-react";
import { CoverageDevice } from "./CoverageDevice";
import {
  ADD_ON_META,
  ADD_ON_ORDER,
  ALL_COMBINATIONS,
  PERSONAS,
  combinationKey,
  deriveCoverage,
  type AddOnId,
  type CoverageResult,
  type CoverageState,
} from "./coverage";
import {
  ACCENT,
  ACCENT_SOFT_BG,
  BORDER,
  BORDER_STRONG,
  FG,
  FOCUS_RING,
  MUTED,
  PROSE_WIDTH_COLUMN,
  SURFACE,
  SURFACE_TINT,
} from "./tokens";

interface ValueSplitProps {
  state: CoverageState;
  result: CoverageResult;
  onToggle: (id: AddOnId) => void;
  onReset: () => void;
  onApplyPreset: (state: CoverageState) => void;
}

const PILLARS: { id: AddOnId; icon: typeof ShieldCheck }[] = [
  { id: "shield", icon: ShieldCheck },
  { id: "loss", icon: Eye },
  { id: "resale", icon: RefreshCcw },
];

/**
 * "Value, three ways" — the three add-ons explained independently, a quiz-like persona picker
 * that presets all three booleans at once (a second, distinct path through the same combination
 * space the manual toggles use), a full mirror of the device, and the complete 7-row lookup
 * table. Every row of the table is produced by calling the SAME `deriveCoverage` function the
 * live device uses, including the "current" highlight — nothing here is a hand-typed shadow copy.
 */
export function ValueSplit({ state, result, onToggle, onReset, onApplyPreset }: ValueSplitProps) {
  const currentKey = result.key;

  return (
    <section id="value" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ color: FG }}>
          Value, three ways
        </h2>
        <p className="mt-1.5 max-w-[560px] text-[14.5px] font-normal leading-[1.6]" style={{ color: MUTED }}>
          Each add-on solves one failure mode on its own. Combine them and the tier name changes
          to describe exactly what you&rsquo;re covered for.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PILLARS.map((pillar) => {
            const meta = ADD_ON_META[pillar.id];
            const Icon = pillar.icon;
            const active = state[pillar.id];
            return (
              <div
                key={pillar.id}
                className="min-w-0 rounded-2xl p-5"
                style={{ border: `1px solid ${active ? ACCENT : BORDER}`, backgroundColor: "#FFFFFF" }}
              >
                <Icon className="h-5 w-5" aria-hidden="true" style={{ color: ACCENT }} />
                <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.02em]" style={{ color: FG }}>
                  {meta.label}
                </h3>
                <p className={`mt-1.5 text-[13.5px] font-normal leading-[1.55] ${PROSE_WIDTH_COLUMN}`} style={{ color: MUTED }}>
                  {meta.description}
                </p>
                <p className="mt-3 text-[13px] font-semibold tabular-nums" style={{ color: FG }}>
                  +${meta.price}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quiz-like persona picker: a second, distinct way to set the same 3 booleans at once. */}
        <div className="mt-12 rounded-2xl p-5 sm:p-6" style={{ border: `1px solid ${BORDER}`, backgroundColor: "#FFFFFF" }}>
          <h3 className="text-[16px] font-semibold tracking-[-0.02em]" style={{ color: FG }}>
            Not sure where to start? Tell us one thing.
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {PERSONAS.map((persona) => {
              const activePersona = combinationKey(persona.state) === currentKey;
              return (
                <button
                  key={persona.id}
                  type="button"
                  aria-pressed={activePersona}
                  onClick={() => onApplyPreset(persona.state)}
                  className={`min-w-0 rounded-xl border p-3.5 text-left transition-colors ${FOCUS_RING}`}
                  style={{
                    borderColor: activePersona ? ACCENT : BORDER,
                    backgroundColor: activePersona ? ACCENT_SOFT_BG : SURFACE_TINT,
                  }}
                >
                  <p className="text-[13.5px] font-semibold" style={{ color: FG }}>
                    {persona.label}
                  </p>
                  <p className="mt-1 text-[12.5px] font-normal leading-[1.5]" style={{ color: MUTED }}>
                    {persona.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full mirror of the device — same state, same shared derivation, different type scale. */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="min-w-0">
            <p id="coverage-label-full" className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              Adjust your add-ons
            </p>
            <CoverageDevice
              state={state}
              result={result}
              onToggle={onToggle}
              onReset={onReset}
              headingId="coverage-label-full"
            />
          </div>

          {/* Lookup reference table: the combination -> label structure, made visible. */}
          <div id="lookup" className="min-w-0">
            <h3 className="text-[14px] font-semibold tracking-[-0.02em]" style={{ color: FG }}>
              All seven tiers
            </h3>
            <p className="mt-1 text-[12.5px] font-normal" style={{ color: MUTED }}>
              Your current row is highlighted below.
            </p>
            <table className="mt-3 w-full table-fixed border-collapse text-left">
              <caption className="sr-only">
                Coverage tiers by add-on combination, with each tier&rsquo;s name and total price
              </caption>
              <colgroup>
                <col style={{ width: "34%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "18%" }} />
              </colgroup>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER_STRONG}` }}>
                  <th scope="col" className="py-2 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Tier
                  </th>
                  {ADD_ON_ORDER.map((id) => (
                    <th
                      key={id}
                      scope="col"
                      className="py-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em]"
                      style={{ color: MUTED }}
                    >
                      {ADD_ON_META[id].short}
                    </th>
                  ))}
                  <th scope="col" className="py-2 text-right text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {ALL_COMBINATIONS.map((combo) => {
                  const row = deriveCoverage(combo);
                  const isCurrent = row.key === currentKey;
                  return (
                    <tr
                      key={row.key}
                      style={{
                        borderBottom: `1px solid ${BORDER}`,
                        backgroundColor: isCurrent ? ACCENT_SOFT_BG : "transparent",
                      }}
                    >
                      <th scope="row" className="py-2 pr-2 text-[12.5px] font-semibold" style={{ color: FG }}>
                        {row.tierLabel}
                        {isCurrent && (
                          <span
                            className="ml-1.5 rounded-full px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em]"
                            style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
                          >
                            Current
                          </span>
                        )}
                      </th>
                      {ADD_ON_ORDER.map((id) => (
                        <td key={id} className="py-2 text-center">
                          {combo[id] ? (
                            <>
                              <Check className="inline h-3.5 w-3.5" aria-hidden="true" style={{ color: ACCENT }} />
                              <span className="sr-only">Included</span>
                            </>
                          ) : (
                            <>
                              <X className="inline h-3.5 w-3.5" aria-hidden="true" style={{ color: MUTED }} />
                              <span className="sr-only">Not included</span>
                            </>
                          )}
                        </td>
                      ))}
                      <td className="py-2 text-right text-[12.5px] font-semibold tabular-nums" style={{ color: FG }}>
                        ${row.total.toLocaleString("en-US")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
