"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Plus, ShieldCheck, TrendingUp } from "lucide-react";
import { BUNDLE_TIERS, computeBundle, PRODUCTS, type ProductId } from "./data";

interface BundleBuilderProps {
  selectedIds: ProductId[];
  onToggle: (id: ProductId) => void;
}

const MAX_TIER = Math.max(...BUNDLE_TIERS);

export default function BundleBuilder({ selectedIds, onToggle }: BundleBuilderProps) {
  const reduceMotion = useReducedMotion();
  const summary = computeBundle(selectedIds);
  const barTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
      {/* Input: cart-style add / remove toggles */}
      <div className="min-w-0 lg:col-span-5">
        <h3 className="text-lg font-bold tracking-[-0.02em] text-white">Pick what to bundle</h3>
        <p className="mt-2 max-w-[500px] text-[16px] font-normal leading-[1.6] text-zinc-400">
          Add or remove items below. Both surfaces on the right recompute the moment you do —
          nothing here is a preview of a later step.
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          {PRODUCTS.map((product) => {
            const selected = selectedIds.includes(product.id);
            const isOnlyOne = selected && selectedIds.length === 1;
            return (
              <li key={product.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  aria-disabled={isOnlyOne}
                  onClick={() => onToggle(product.id)}
                  className={[
                    "flex w-full min-w-0 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300",
                    selected
                      ? "border-teal-500/60 bg-teal-500/10"
                      : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900",
                  ].join(" ")}
                >
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                    <Image
                      src={`https://images.unsplash.com/photo-${product.photoId}?auto=format&fit=crop&w=120&q=60`}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-normal text-zinc-100">{product.name}</span>
                    <span className="block text-xs font-normal text-zinc-400">
                      <span className="tabular-nums">${product.price}</span> · {product.category}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={[
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                      selected
                        ? "border-teal-400 bg-teal-500 text-[#0B0B0F]"
                        : "border-zinc-700 text-zinc-400",
                    ].join(" ")}
                  >
                    {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs font-normal text-zinc-400" aria-live="polite">
          <span className="tabular-nums">{summary.count}</span> item{summary.count === 1 ? "" : "s"}{" "}
          selected &middot; at least one item stays in the bundle.
        </p>
      </div>

      {/* Output: two surfaces recomputed from the same selection */}
      <div className="min-w-0 lg:col-span-7">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Surface A — bundle discount curve */}
          <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-400" aria-hidden="true" />
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Bundle discount curve
              </h4>
            </div>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums tracking-[-0.02em] text-white">
                {summary.discountPct}%
              </span>
              <span className="text-sm font-normal text-zinc-400">extra, on top of item prices</span>
            </p>
            <div className="mt-5 flex h-24 items-end gap-2" role="img" aria-label={`Discount by bundle size: ${BUNDLE_TIERS.map((d, i) => `${i + 1} item${i === 0 ? "" : "s"}, ${d} percent`).join("; ")}. Currently at ${summary.count} item${summary.count === 1 ? "" : "s"}.`}>
              {BUNDLE_TIERS.map((discount, i) => {
                const tierCount = i + 1;
                const isCurrent = tierCount === summary.count;
                // Transform-only animation: the bar is always full height, we scale it
                // vertically from a bottom origin instead of animating height/width.
                const scaleY = Math.max(0.06, discount / MAX_TIER);
                return (
                  <div key={tierCount} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                    <span
                      className={[
                        "text-[10px] font-semibold tabular-nums",
                        isCurrent ? "text-teal-400" : "text-zinc-400",
                      ].join(" ")}
                    >
                      {discount}
                    </span>
                    <div className="h-16 w-full overflow-hidden rounded-sm bg-zinc-800/70">
                      <motion.div
                        aria-hidden="true"
                        animate={{ scaleY }}
                        transition={barTransition}
                        className={[
                          "h-full w-full origin-bottom rounded-sm",
                          isCurrent ? "bg-teal-500" : "bg-zinc-700",
                        ].join(" ")}
                      />
                    </div>
                    <span className="text-[10px] font-normal text-zinc-400">{tierCount}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm font-normal leading-[1.6] text-zinc-300">
              <span className="tabular-nums font-semibold text-white">${summary.total}</span> total for{" "}
              <span className="tabular-nums">{summary.count}</span> item{summary.count === 1 ? "" : "s"}, down
              from{" "}
              <span className="tabular-nums line-through text-zinc-400">${summary.originalSubtotal}</span>.
            </p>
          </div>

          {/* Surface B — trust rollup */}
          <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-400" aria-hidden="true" />
              <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Trust rollup</h4>
            </div>
            <p className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums tracking-[-0.02em] text-white">
                {summary.rollup}
              </span>
              <span className="text-sm font-normal text-zinc-400">/ 100 across the bundle</span>
            </p>
            <div
              className="mt-4 h-3 w-full overflow-hidden rounded-full bg-zinc-800"
              role="img"
              aria-label={`Trust rollup score ${summary.rollup} out of 100`}
            >
              <motion.div
                animate={{ scaleX: Math.max(0.02, summary.rollup / 100) }}
                transition={barTransition}
                className="h-full w-full origin-left rounded-full bg-teal-500"
              />
            </div>
            <ul className="mt-5 flex flex-col gap-2.5">
              <AnimatePresence initial={false}>
                {summary.perItem.map((item) => (
                  <motion.li
                    key={item.id}
                    layout={!reduceMotion}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.22 }}
                    className="min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-xs font-normal text-zinc-300">
                        {item.name}
                      </span>
                      <span className="text-xs font-semibold tabular-nums text-zinc-400">
                        {item.contribution}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <motion.div
                        animate={{ scaleX: Math.max(0.02, item.contribution / 100) }}
                        transition={barTransition}
                        className="h-full w-full origin-left rounded-full bg-teal-400/80"
                      />
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
