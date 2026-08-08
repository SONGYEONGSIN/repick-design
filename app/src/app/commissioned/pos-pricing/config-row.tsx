"use client";

import { useId } from "react";
import { Check, Minus, MonitorSmartphone, Plus, Store } from "lucide-react";
import {
  DISPLAY,
  FOCUS,
  ONBOARDING_PER_STORE,
  PROCUREMENTS,
  SCALE,
  TIERS,
  TIER_ORDER,
  cx,
  plural,
  won,
  type ProcurementId,
  type Quote,
} from "./data";

interface ConfigRowProps {
  procurement: ProcurementId;
  onProcurement: (id: ProcurementId) => void;
  stores: number;
  onStores: (n: number) => void;
  perStore: number;
  onPerStore: (n: number) => void;
  /** The active quote, plus the same quote recomputed for the two procurement modes the reader has
   *  not chosen — all three from one function, so the amounts printed on an unselected option are
   *  exactly the amounts selecting it would produce. */
  quotes: Record<ProcurementId, Quote>;
}

export default function ConfigRow({
  procurement,
  onProcurement,
  stores,
  onStores,
  perStore,
  onPerStore,
  quotes,
}: ConfigRowProps) {
  const active = quotes[procurement];

  return (
    <div id="configure" className="grid gap-3 lg:grid-cols-3">
      <ProcurementPicker selected={procurement} onSelect={onProcurement} quotes={quotes} />
      <ScalePicker stores={stores} onStores={onStores} perStore={perStore} onPerStore={onPerStore} quote={active} />
      <PlanLadder quote={active} />
    </div>
  );
}

/**
 * Interaction 1 — how the terminals are financed. Each option carries both of its own amounts, so
 * the trade between capital today and cost per month is legible without selecting anything.
 *
 * The bordered panel wraps a border-less fieldset rather than being one: a `legend` paints inside
 * the top border and would notch one of the three panels but not the other two.
 */
function ProcurementPicker({
  selected,
  onSelect,
  quotes,
}: {
  selected: ProcurementId;
  onSelect: (id: ProcurementId) => void;
  quotes: Record<ProcurementId, Quote>;
}) {
  const group = useId();

  return (
    <div className="min-w-0 rounded-2xl border border-zinc-800 p-4 sm:p-5">
      <fieldset className="border-0 p-0">
        <legend className="text-xs font-medium tracking-[0.16em] text-zinc-400 uppercase">
          How you get the terminals
        </legend>

        <div className="mt-3 flex flex-col gap-1.5">
          {PROCUREMENTS.map((opt) => {
            const q = quotes[opt.id];
            const on = opt.id === selected;
            return (
              <label
                key={opt.id}
                className={cx(
                  "flex cursor-pointer flex-col gap-0.5 rounded-xl border px-3 py-2 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-400 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-zinc-950",
                  on ? "border-amber-400 bg-zinc-900" : "border-zinc-700 hover:border-zinc-500",
                )}
              >
                <input
                  type="radio"
                  name={group}
                  value={opt.id}
                  checked={on}
                  onChange={() => onSelect(opt.id)}
                  className="sr-only"
                />

                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cx(
                      "flex h-4 w-4 flex-none items-center justify-center rounded-full border",
                      on ? "border-amber-400 bg-amber-400 text-zinc-950" : "border-zinc-500",
                    )}
                  >
                    {on ? <Check className="h-3 w-3" /> : null}
                  </span>
                  <span className="text-sm font-medium text-zinc-50">{opt.label}</span>
                </span>

                <span className="text-xs leading-relaxed font-normal text-zinc-400">{opt.trade}</span>

                <span className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 text-xs tabular-nums" style={DISPLAY}>
                  <span className="font-normal text-zinc-400">
                    Today{" "}
                    <span className={cx("font-medium", on ? "text-amber-400" : "text-zinc-50")}>{won(q.dueToday)}</span>
                  </span>
                  <span className="font-normal text-zinc-400">
                    Monthly <span className="font-medium text-zinc-50">{won(q.monthly)}</span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

/** Interactions 2 and 3 — the two multipliers. Stores multiply the install fee, terminals multiply
 *  everything else, and together they decide which plan is recommended. */
function ScalePicker({
  stores,
  onStores,
  perStore,
  onPerStore,
  quote,
}: {
  stores: number;
  onStores: (n: number) => void;
  perStore: number;
  onPerStore: (n: number) => void;
  quote: Quote;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-zinc-800 p-4 sm:p-5">
      <fieldset className="border-0 p-0">
        <legend className="text-xs font-medium tracking-[0.16em] text-zinc-400 uppercase">Your scale</legend>

        <div className="mt-3 flex flex-col gap-2">
          <Stepper
            icon={Store}
            label="Stores"
            hint={`${won(ONBOARDING_PER_STORE)} install each`}
            value={stores}
            min={SCALE.stores.min}
            max={SCALE.stores.max}
            onChange={onStores}
          />
          <Stepper
            icon={MonitorSmartphone}
            label="Terminals per store"
            hint="lanes, counters or handhelds"
            value={perStore}
            min={SCALE.perStore.min}
            max={SCALE.perStore.max}
            onChange={onPerStore}
          />
        </div>
      </fieldset>

      <p className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs leading-relaxed font-normal text-zinc-400">
        <span className="font-medium text-zinc-50 tabular-nums" style={DISPLAY}>
          {plural(quote.terminals, "terminal", "terminals")}
        </span>{" "}
        in total. At this size the fleet is specified as{" "}
        <span className="font-medium text-zinc-50">{quote.tier.terminal.model}</span> — {quote.tier.terminal.form}.
      </p>
    </div>
  );
}

function Stepper({
  icon: Icon,
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  icon: typeof Store;
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const labelId = useId();
  const button =
    "flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-zinc-600 text-zinc-50 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-amber-400"
      >
        <Icon className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span id={labelId} className="block text-sm font-medium text-zinc-50">
          {label}
        </span>
        <span className="block text-xs font-normal text-zinc-400 tabular-nums">{hint}</span>
      </span>

      <span className="flex flex-none items-center gap-1.5">
        <button
          type="button"
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className={cx(button, FOCUS)}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span
          aria-labelledby={labelId}
          className="w-7 text-center text-sm font-medium text-zinc-50 tabular-nums"
          style={DISPLAY}
        >
          {value}
        </span>
        <button
          type="button"
          aria-label={`More ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className={cx(button, FOCUS)}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </span>
    </div>
  );
}

/** What separates the plans. Deliberately a ladder of rungs rather than a feature matrix: a
 *  four-column comparison table is the thing that stops being readable at 390px, and each rung
 *  only has to say what it adds to the one below it. */
function PlanLadder({ quote }: { quote: Quote }) {
  return (
    <section aria-labelledby="plans" className="min-w-0 rounded-2xl border border-zinc-800 p-4 sm:p-5">
      <h2 id="plans" className="text-xs font-medium tracking-[0.16em] text-zinc-400 uppercase">
        What each plan includes
      </h2>

      <ol className="mt-3 flex flex-col gap-2">
        {TIER_ORDER.map((id) => {
          const tier = TIERS[id];
          const on = id === quote.tier.id;
          return (
            <li
              key={id}
              className={cx("rounded-xl border px-3 py-2.5", on ? "border-amber-400 bg-zinc-900" : "border-zinc-800")}
            >
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className={cx("text-sm font-medium", on ? "text-amber-400" : "text-zinc-50")} style={DISPLAY}>
                  {tier.name}
                </span>
                <span className="text-xs font-normal text-zinc-400 tabular-nums">
                  {won(tier.perTerminal)} / terminal / month
                </span>
                {on ? (
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-amber-400/60 px-2 py-0.5 text-xs font-medium text-amber-400">
                    <Check className="h-3 w-3 flex-none" aria-hidden="true" />
                    Recommended
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-xs leading-relaxed font-normal text-zinc-400">{tier.adds}</p>
            </li>
          );
        })}
      </ol>

      <p className="mt-3 text-xs leading-relaxed font-normal text-zinc-400">
        On every plan: offline mode that keeps selling when the line drops, next-day replacement parts, and export to
        the accounting packages Korean tax filings expect.
      </p>
    </section>
  );
}
