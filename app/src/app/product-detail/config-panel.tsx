"use client";

import { SlidersHorizontal, Check } from "lucide-react";
import { GRADES, SWITCHES, cx, usd, type GradeId, type SwitchId } from "./data";

/** The console's lead panel — the only place selections are made. Both radio groups are wired to
 * shared state one level up, so choosing here is what drives the live recompute the feel,
 * fulfillment, specification and order-total panels all read from. */
export default function ConfigPanel({
  gradeId,
  switchId,
  onGradeChange,
  onSwitchChange,
  unitPrice,
}: {
  gradeId: GradeId;
  switchId: SwitchId;
  onGradeChange: (id: GradeId) => void;
  onSwitchChange: (id: SwitchId) => void;
  unitPrice: number;
}) {
  return (
    <section
      id="configure"
      aria-labelledby="configure-heading"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-sky-50">
          <SlidersHorizontal className="h-4.5 w-4.5 text-sky-700" aria-hidden="true" />
        </span>
        <h2 id="configure-heading" className="text-base font-semibold tracking-tight text-slate-900">
          Configure your unit
        </h2>
      </div>
      <p className="mt-2 text-sm font-normal text-slate-600">
        Every panel below reads from these two choices — price, feel and fulfillment recompute the
        moment you change either one.
      </p>

      <fieldset className="mt-5 border-0 p-0">
        <legend className="text-sm font-medium text-slate-900">Condition grade</legend>
        <div className="mt-2.5 flex flex-col gap-2">
          {GRADES.map((g) => {
            const selected = g.id === gradeId;
            return (
              <label
                key={g.id}
                className={cx(
                  "flex cursor-pointer items-start justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 has-[:focus-visible]:ring-offset-2",
                  selected ? "border-sky-700 bg-sky-50" : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <span className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="grade"
                    value={g.id}
                    checked={selected}
                    onChange={() => onGradeChange(g.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cx(
                      "mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full border",
                      selected ? "border-sky-700 bg-sky-700" : "border-slate-300 bg-white",
                    )}
                  >
                    {selected && <Check className="h-2.5 w-2.5 text-white" aria-hidden="true" />}
                  </span>
                  <span>
                    <span className={cx("block", selected ? "font-medium text-sky-800" : "font-medium text-slate-900")}>
                      {g.label}
                    </span>
                    <span className="mt-0.5 block text-xs font-normal text-slate-600">{g.condition}</span>
                  </span>
                </span>
                <span className="flex-none font-medium text-slate-900 tabular-nums">{usd(g.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-5 border-0 p-0">
        <legend className="text-sm font-medium text-slate-900">Switch</legend>
        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {SWITCHES.map((s) => {
            const selected = s.id === switchId;
            return (
              <label
                key={s.id}
                className={cx(
                  "cursor-pointer rounded-xl border p-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 has-[:focus-visible]:ring-offset-2",
                  selected ? "border-sky-700 bg-sky-50" : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <input
                  type="radio"
                  name="switch"
                  value={s.id}
                  checked={selected}
                  onChange={() => onSwitchChange(s.id)}
                  className="sr-only"
                />
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-3.5 w-3.5 flex-none rounded-full border border-black/10" style={{ backgroundColor: s.swatch }} />
                  <span className={cx("font-medium", selected ? "text-sky-800" : "text-slate-900")}>{s.label}</span>
                </span>
                <span className="mt-1 block text-xs font-normal text-slate-600 tabular-nums">
                  {s.delta === 0 ? "included" : `+${usd(s.delta)}`}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-slate-200 pt-4">
        <span className="text-sm font-normal text-slate-600">Unit price</span>
        <span className="text-lg font-semibold text-slate-900 tabular-nums">{usd(unitPrice)}</span>
      </div>
    </section>
  );
}
