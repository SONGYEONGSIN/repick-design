"use client";

import { PlugZap, Check, ShoppingCart } from "lucide-react";
import { ADDONS, COMPAT_NOTES, FOCUS, cx, usd, type AddonId } from "./data";

/** Compatibility notes plus the bundle builder. Add-ons feed the same running total shown in the
 * hero and sticky toolbar, so ticking a box here is a second, independent way to move the number
 * those two always-visible surfaces display — not just the grade/switch pickers. */
export default function CompatibilityPanel({
  addonIds,
  onToggleAddon,
  unitPrice,
  addonsTotal,
  total,
  added,
  onAddToCart,
}: {
  addonIds: Set<AddonId>;
  onToggleAddon: (id: AddonId) => void;
  unitPrice: number;
  addonsTotal: number;
  total: number;
  added: boolean;
  onAddToCart: () => void;
}) {
  return (
    <section
      id="compatibility"
      aria-labelledby="compatibility-heading"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-sky-50">
          <PlugZap className="h-4.5 w-4.5 text-sky-700" aria-hidden="true" />
        </span>
        <h2 id="compatibility-heading" className="text-base font-semibold tracking-tight text-slate-900">
          Compatibility &amp; bundle
        </h2>
      </div>

      <ul role="list" className="mt-4 flex flex-col gap-2">
        {COMPAT_NOTES.map((note) => (
          <li key={note} className="flex items-start gap-2 text-sm font-normal text-slate-600">
            <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-sky-700" aria-hidden="true" />
            {note}
          </li>
        ))}
      </ul>

      <fieldset className="mt-5 border-0 border-t border-slate-200 p-0 pt-4">
        <legend className="text-sm font-medium text-slate-900">Add to your order</legend>
        <div className="mt-2.5 flex flex-col gap-2">
          {ADDONS.map((a) => {
            const checked = addonIds.has(a.id);
            return (
              <label
                key={a.id}
                className={cx(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-600 has-[:focus-visible]:ring-offset-2",
                  checked ? "border-sky-700 bg-sky-50" : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleAddon(a.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cx(
                      "flex h-4 w-4 flex-none items-center justify-center rounded border",
                      checked ? "border-sky-700 bg-sky-700" : "border-slate-300 bg-white",
                    )}
                  >
                    {checked && <Check className="h-2.5 w-2.5 text-white" aria-hidden="true" />}
                  </span>
                  <span>
                    <span className="block font-medium text-slate-900">{a.label}</span>
                    <span className="block text-xs font-normal text-slate-600">{a.detail}</span>
                  </span>
                </span>
                <span className="flex-none font-medium text-slate-900 tabular-nums">+{usd(a.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 flex flex-col gap-1.5 border-t border-slate-200 pt-4 text-sm">
        <div className="flex items-baseline justify-between">
          <span className="font-normal text-slate-600">Unit</span>
          <span className="font-normal text-slate-900 tabular-nums">{usd(unitPrice)}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-normal text-slate-600">Add-ons</span>
          <span className="font-normal text-slate-900 tabular-nums">{usd(addonsTotal)}</span>
        </div>
        <div className="flex items-baseline justify-between border-t border-dashed border-slate-200 pt-1.5">
          <span className="font-medium text-slate-900">Order total</span>
          <span className="text-lg font-semibold text-slate-900 tabular-nums">{usd(total)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        className={cx(
          "mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-sky-800",
          FOCUS,
        )}
      >
        {added ? <Check className="h-4 w-4 flex-none" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4 flex-none" aria-hidden="true" />}
        {added ? "Added to cart" : `Add to cart — ${usd(total)}`}
      </button>
    </section>
  );
}
