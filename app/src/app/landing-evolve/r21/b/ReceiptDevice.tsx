"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Footprints, Layers, Receipt as ReceiptIcon, Rocket, Shirt, ShoppingBag, Sparkles, Truck, Zap } from "lucide-react";
import { SegmentedGroup, type SegOption } from "./controls";
import {
  AUTH_TIERS,
  CATEGORIES,
  CONDITIONS,
  formatKRW,
  SHIPPING_SPEEDS,
  type AuthId,
  type CategoryId,
  type ConditionId,
  type Receipt,
  type ShippingId,
} from "./data";

const CATEGORY_ICONS: Record<CategoryId, ReactNode> = {
  outerwear: <Shirt className="h-3.5 w-3.5" aria-hidden="true" />,
  denim: <Layers className="h-3.5 w-3.5" aria-hidden="true" />,
  sneakers: <Footprints className="h-3.5 w-3.5" aria-hidden="true" />,
  bags: <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />,
};

const SHIPPING_ICONS: Record<ShippingId, ReactNode> = {
  standard: <Truck className="h-3.5 w-3.5" aria-hidden="true" />,
  express: <Zap className="h-3.5 w-3.5" aria-hidden="true" />,
  "same-day": <Rocket className="h-3.5 w-3.5" aria-hidden="true" />,
};

const CATEGORY_OPTIONS: SegOption<CategoryId>[] = CATEGORIES.map((c) => ({
  id: c.id,
  label: c.label,
  icon: CATEGORY_ICONS[c.id],
}));

const CONDITION_OPTIONS: SegOption<ConditionId>[] = CONDITIONS.map((c) => ({
  id: c.id,
  label: c.shortLabel,
}));

const AUTH_OPTIONS: SegOption<AuthId>[] = AUTH_TIERS.map((a) => ({
  id: a.id,
  label: a.shortLabel,
}));

const SHIPPING_OPTIONS: SegOption<ShippingId>[] = SHIPPING_SPEEDS.map((s) => ({
  id: s.id,
  label: s.shortLabel,
  icon: SHIPPING_ICONS[s.id],
}));

interface ReceiptDeviceProps {
  receipt: Receipt;
  onCategory: (id: CategoryId) => void;
  onCondition: (id: ConditionId) => void;
  onAuth: (id: AuthId) => void;
  onShipping: (id: ShippingId) => void;
}

export default function ReceiptDevice({ receipt, onCategory, onCondition, onAuth, onShipping }: ReceiptDeviceProps) {
  const reduceMotion = useReducedMotion();
  const { category, condition, lines, total } = receipt;

  const valueTransition = reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div id="receipt" className="min-w-0 scroll-mt-24">
      {/* -------------------------------------------------- Item card: the thing being priced */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-800">
          <AnimatePresence initial={false}>
            <motion.div
              key={category.id}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.28 }}
              className="absolute inset-0"
            >
              <Image
                src={`https://images.unsplash.com/photo-${category.photoId}?auto=format&fit=crop&w=800&q=70`}
                alt={category.alt}
                fill
                sizes="(min-width: 1024px) 460px, 92vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Badges live in their own row below the photo, never overlaid on top of it. */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-zinc-800/80 px-4 pb-3 pt-3">
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-400">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            AI-estimated
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
            <BadgeCheck className="h-3 w-3 text-rose-400" aria-hidden="true" />
            Verified seller
          </span>
          <span className="inline-flex items-center rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
            {condition.shortLabel} grade
          </span>
          <span className="ml-auto text-xs font-normal text-zinc-400">{category.itemName}</span>
        </div>
      </div>

      {/* -------------------------------------------------- Receipt card: controls + line items */}
      <div className="relative mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
        {/* Restrained perforated-edge cue along the top of the receipt paper. */}
        <div aria-hidden="true" className="absolute inset-x-5 top-0 border-t border-dashed border-zinc-700" />

        <div className="flex items-center gap-2">
          <ReceiptIcon className="h-4 w-4 text-rose-400" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Live payout receipt
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
          <SegmentedGroup
            labelId="cat-label"
            label="Category"
            options={CATEGORY_OPTIONS}
            value={category.id}
            onChange={onCategory}
          />
          <SegmentedGroup
            labelId="cond-label"
            label="Condition"
            options={CONDITION_OPTIONS}
            value={condition.id}
            onChange={onCondition}
          />
          <SegmentedGroup
            labelId="auth-label"
            label="Authentication"
            options={AUTH_OPTIONS}
            value={receipt.auth.id}
            onChange={onAuth}
          />
          <SegmentedGroup
            labelId="ship-label"
            label="Shipping speed"
            options={SHIPPING_OPTIONS}
            value={receipt.shipping.id}
            onChange={onShipping}
          />
        </div>

        <dl className="mt-6">
          {lines.map((line) => (
            <div
              key={line.key}
              className="flex items-start justify-between gap-4 border-b border-dashed border-zinc-800 py-2.5"
            >
              <dt className="min-w-0">
                <span className="block text-sm font-normal text-zinc-200">{line.label}</span>
                <span className="block text-xs font-normal text-zinc-400">{line.detail}</span>
              </dt>
              <dd className="shrink-0 pt-0.5 text-right">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={line.amount}
                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
                    transition={valueTransition}
                    style={{ fontFamily: "var(--font-mono)" }}
                    className={[
                      "block text-sm tabular-nums",
                      line.isDeduction ? "text-zinc-300" : "text-zinc-100",
                    ].join(" ")}
                  >
                    {formatKRW(line.amount)}
                  </motion.span>
                </AnimatePresence>
              </dd>
            </div>
          ))}

          <div className="flex items-baseline justify-between gap-4 border-t-2 border-double border-zinc-600 pt-4 mt-1">
            <dt className="text-sm font-semibold text-white">You&rsquo;d receive</dt>
            <dd className="text-right">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={total}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                  transition={valueTransition}
                  style={{ fontFamily: "var(--font-display-mono)" }}
                  className="block text-[clamp(1.6rem,1.1vw+1.2rem,2.1rem)] font-extrabold tabular-nums tracking-[-0.02em] text-rose-500"
                >
                  {formatKRW(total)}
                </motion.span>
              </AnimatePresence>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
