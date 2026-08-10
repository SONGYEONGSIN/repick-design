"use client";

import { useState } from "react";
import { CornerDownRight, Scale, Undo2 } from "lucide-react";

import { PRECEDENCE, type Side } from "./data";

const DISPLAY = { fontFamily: "var(--font-display-grotesk)" } as const;

const SIDE_LABEL: Record<Side, string> = {
  hubspot: "HubSpot wins",
  kestrel: "Kestrel wins",
};

export function PrecedenceTable() {
  const [winners, setWinners] = useState<Record<string, Side>>(() =>
    Object.fromEntries(PRECEDENCE.map((row) => [row.field, row.ruleWinner])),
  );

  return (
    <ul className="mt-6 space-y-3">
      {PRECEDENCE.map((row) => {
        const winner = winners[row.field];
        const changed = winner !== row.ruleWinner;
        const winningValue = winner === "hubspot" ? row.hubspotValue : row.kestrelValue;

        return (
          <li
            key={row.field}
            className={`min-w-0 rounded-xl border bg-zinc-900/40 px-4 py-4 sm:px-5 ${
              changed ? "border-orange-400/50" : "border-zinc-800"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="break-words font-mono text-sm font-medium text-zinc-100">{row.field}</p>
              <p className="text-xs text-zinc-400">
                {row.scope} — {row.decided}
              </p>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  HubSpot has
                </p>
                <p
                  className="mt-1 break-words text-sm font-semibold text-zinc-50"
                  style={DISPLAY}
                >
                  {row.hubspotValue}
                </p>
              </div>
              <div className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Kestrel has
                </p>
                <p
                  className="mt-1 break-words text-sm font-semibold text-zinc-50"
                  style={DISPLAY}
                >
                  {row.kestrelValue}
                </p>
              </div>
            </div>

            <fieldset className="mt-4">
              <legend className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
                <Scale aria-hidden className="size-3.5" />
                Rule for this field
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["hubspot", "kestrel"] as const).map((side) => {
                  const selected = winner === side;
                  return (
                    <label
                      key={side}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium focus-within:ring-2 focus-within:ring-orange-400 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950 ${
                        selected
                          ? "border-orange-400 bg-orange-400/15 text-orange-100"
                          : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`winner-${row.field}`}
                        value={side}
                        checked={selected}
                        onChange={() => setWinners((prev) => ({ ...prev, [row.field]: side }))}
                        className="size-3.5 accent-orange-400"
                      />
                      {SIDE_LABEL[side]}
                    </label>
                  );
                })}
                {changed ? (
                  <button
                    type="button"
                    onClick={() =>
                      setWinners((prev) => ({ ...prev, [row.field]: row.ruleWinner }))
                    }
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-200 hover:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                  >
                    <Undo2 aria-hidden className="size-3.5" />
                    Back to the saved rule
                  </button>
                ) : null}
              </div>
            </fieldset>

            <p aria-live="polite" className="mt-3 flex items-start gap-2 text-sm leading-relaxed">
              <CornerDownRight
                aria-hidden
                className={`mt-0.5 size-4 shrink-0 ${
                  changed ? "text-orange-300" : "text-zinc-400"
                }`}
              />
              <span className="text-zinc-300">
                <span className="font-medium text-zinc-50">{winningValue}</span> survives.{" "}
                {row.consequence[winner]}
                {changed ? (
                  <span className="font-medium text-orange-200">
                    {" "}
                    Not saved — this is a preview of the flipped rule.
                  </span>
                ) : null}
              </span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}
