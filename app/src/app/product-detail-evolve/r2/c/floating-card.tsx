"use client";

import { useState } from "react";
import { Check, ChevronUp, ShoppingBag } from "lucide-react";
import {
  BLADES,
  FINISHES,
  WOODS,
  cx,
  formatUsd,
  FOCUS,
  type BladeId,
  type FinishId,
  type WoodId,
} from "./data";

/**
 * The page's one persistent element. It is corner-pinned on desktop (not a full-width sticky
 * header) and edge-pinned to the bottom on mobile — never a bar that spans and shadows the whole
 * viewport. The blade / wood / finish picker lives inside it and is the only place price actually
 * gets set; every other price shown on the page reads the same computed total, it doesn't own it.
 */
export default function FloatingCard({
  bladeId,
  woodId,
  finishId,
  onChangeBlade,
  onChangeWood,
  onChangeFinish,
  price,
  weightG,
  added,
  onAddToCart,
}: {
  bladeId: BladeId;
  woodId: WoodId;
  finishId: FinishId;
  onChangeBlade: (id: BladeId) => void;
  onChangeWood: (id: WoodId) => void;
  onChangeFinish: (id: FinishId) => void;
  price: number;
  weightG: number;
  added: boolean;
  onAddToCart: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const blade = BLADES.find((b) => b.id === bladeId) ?? BLADES[1];

  const pickerBlock = (idPrefix: string) => (
    <div className="flex flex-col gap-3">
      <fieldset className="border-0 p-0">
        <legend className="text-xs font-medium text-zinc-600">Blade length</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          {BLADES.map((b) => (
            <label
              key={b.id}
              className={cx(
                "cursor-pointer rounded-lg border px-1.5 py-1.5 text-center text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-600 has-[:focus-visible]:ring-offset-2",
                bladeId === b.id
                  ? "border-amber-700 bg-amber-50 text-amber-800"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300",
              )}
            >
              <input
                type="radio"
                name={`${idPrefix}-blade`}
                value={b.id}
                checked={bladeId === b.id}
                onChange={() => onChangeBlade(b.id)}
                className="sr-only"
              />
              {b.label}
              <span className="block text-[10px] font-normal tabular-nums text-zinc-500">{b.bladeMm} mm</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="text-xs font-medium text-zinc-600">Handle wood</legend>
        <div className="mt-1.5 flex gap-1.5">
          {WOODS.map((w) => (
            <label
              key={w.id}
              className={cx(
                "flex flex-1 cursor-pointer items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-600 has-[:focus-visible]:ring-offset-2",
                woodId === w.id ? "border-amber-700 bg-amber-50" : "border-zinc-200 bg-white hover:border-zinc-300",
              )}
            >
              <input
                type="radio"
                name={`${idPrefix}-wood`}
                value={w.id}
                checked={woodId === w.id}
                onChange={() => onChangeWood(w.id)}
                className="sr-only"
              />
              <span aria-hidden="true" className="h-3 w-3 flex-none rounded-full border border-black/10" style={{ backgroundColor: w.swatch }} />
              <span className={cx("truncate", woodId === w.id ? "font-medium text-amber-800" : "font-normal text-zinc-700")}>
                {w.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="border-0 p-0">
        <legend className="text-xs font-medium text-zinc-600">Edge finish</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {FINISHES.map((f) => (
            <label
              key={f.id}
              className={cx(
                "cursor-pointer rounded-lg border px-2 py-1.5 text-center text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-600 has-[:focus-visible]:ring-offset-2",
                finishId === f.id
                  ? "border-amber-700 bg-amber-50 text-amber-800"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300",
              )}
            >
              <input
                type="radio"
                name={`${idPrefix}-finish`}
                value={f.id}
                checked={finishId === f.id}
                onChange={() => onChangeFinish(f.id)}
                className="sr-only"
              />
              {f.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );

  return (
    <>
      {/* Desktop / tablet — corner-pinned floating card */}
      <div
        role="group"
        aria-label="Configure and buy"
        className="fixed right-6 bottom-6 z-40 hidden w-[300px] flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_8px_30px_-8px_rgba(24,24,27,0.25)] lg:flex"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-normal text-zinc-600">
              {blade.label} · {WOODS.find((w) => w.id === woodId)?.label}
            </p>
            <p className="mt-0.5 text-2xl font-semibold tabular-nums text-zinc-900">{formatUsd(price)}</p>
            <p className="text-xs font-normal tabular-nums text-zinc-600">{weightG} g, as configured</p>
          </div>
        </div>

        {pickerBlock("desktop")}

        <button
          type="button"
          onClick={onAddToCart}
          className={cx(
            "flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-800",
            FOCUS,
          )}
        >
          {added ? <Check className="h-4 w-4 flex-none" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4 flex-none" aria-hidden="true" />}
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>

      {/* Mobile — edge-pinned bottom bar, pickers reveal in a panel above it */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div
          id="mobile-config-panel"
          className={cx(
            "overflow-hidden border-t border-zinc-200 bg-white transition-[max-height] duration-200 motion-reduce:transition-none",
            mobileOpen ? "max-h-[420px]" : "max-h-0",
          )}
        >
          <div className="px-4 pt-4 pb-2">{pickerBlock("mobile")}</div>
        </div>
        <div className="flex items-center gap-3 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur">
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-config-panel"
            onClick={() => setMobileOpen((v) => !v)}
            className={cx("flex flex-1 items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-left", FOCUS)}
          >
            <ChevronUp
              className={cx("h-4 w-4 flex-none text-zinc-600 transition-transform motion-reduce:transition-none", mobileOpen ? "rotate-0" : "rotate-180")}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-normal text-zinc-600">
                {blade.label} · {WOODS.find((w) => w.id === woodId)?.label}
              </span>
              <span className="block text-base font-semibold tabular-nums text-zinc-900">{formatUsd(price)}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={onAddToCart}
            className={cx(
              "flex flex-none items-center gap-1.5 rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-800",
              FOCUS,
            )}
          >
            {added ? <Check className="h-4 w-4 flex-none" aria-hidden="true" /> : <ShoppingBag className="h-4 w-4 flex-none" aria-hidden="true" />}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </>
  );
}
