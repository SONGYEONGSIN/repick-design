"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, BadgeCheck, ShieldCheck } from "lucide-react";
import { LISTINGS, formatUSD, discountPercent, type DerivedCombo } from "../lib/delivery";

interface ProductPreviewProps {
  combo: DerivedCombo;
}

/**
 * Rich proof cards. Badges always sit in a row below the photo, never overlaid on it, so a
 * failed remote image never collides with badge text. The first card additionally cites the
 * live Delivery Grid Pick selection via the same `combo` object the hero and closing CTA use —
 * it is the one card tied to the device, so it is the only one making that claim.
 */
export default function ProductPreview({ combo }: ProductPreviewProps) {
  const [openId, setOpenId] = useState<string | null>(LISTINGS[0].id);
  const liveId = LISTINGS[0].id;

  return (
    <section id="preview" className="border-t border-zinc-800/80 bg-zinc-950/40 py-14 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <div className="max-w-[32rem]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">
            Product preview
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl">
            Every listing carries its own proof.
          </h2>
          <p className="mt-3 max-w-[30rem] text-base leading-[1.6] text-zinc-400">
            Four signals ride with every photo: why it matched, how it
            graded, who sold it, and what it used to cost.
          </p>
        </div>

        <ul role="list" className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LISTINGS.map((item) => {
            const isOpen = openId === item.id;
            const discount = discountPercent(item.price, item.originalPrice);
            return (
              <li
                key={item.id}
                className="min-w-0 flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50"
              >
                <div className="relative aspect-[4/3] w-full bg-zinc-800">
                  <Image
                    src={`https://images.unsplash.com/photo-${item.photoId}?w=640&q=70&auto=format&fit=crop`}
                    alt={`${item.name}, ${item.size}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 truncate text-sm font-extrabold tracking-[-0.02em] text-zinc-100">
                      {item.name}
                    </h3>
                    <span className="shrink-0 text-xs text-zinc-400">{item.size}</span>
                  </div>

                  <p className="tabular-nums text-sm font-semibold text-white">
                    {formatUSD(item.price)}{" "}
                    <span className="text-xs text-zinc-400 line-through">{formatUSD(item.originalPrice)}</span>{" "}
                    <span className="text-xs text-violet-300">−{discount}%</span>
                  </p>

                  <ul role="list" className="flex flex-wrap gap-1">
                    <li className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950/60 px-2 py-1 text-[10px] font-semibold text-zinc-300">
                      <Sparkles aria-hidden="true" className="h-3 w-3 text-violet-300" />
                      <span className="tabular-nums">{item.matchPercent}%</span>
                    </li>
                    <li className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950/60 px-2 py-1 text-[10px] font-semibold text-zinc-300">
                      <BadgeCheck aria-hidden="true" className="h-3 w-3 text-violet-300" />
                      <span>{item.conditionGrade}</span>
                    </li>
                    <li className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-950/60 px-2 py-1 text-[10px] font-semibold text-zinc-300">
                      <ShieldCheck aria-hidden="true" className="h-3 w-3 text-violet-300" />
                      <span className="tabular-nums">{item.sellerRating.toFixed(1)}★</span>
                    </li>
                  </ul>

                  {item.id === liveId && (
                    <p className="text-[11px] text-zinc-400 tabular-nums">
                      Your shipping: {combo.speedMeta.label} · {combo.insuranceMeta.label} →{" "}
                      {formatUSD(combo.totalCost)} total, arrives {combo.deliveryWindow}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    className="mt-auto flex items-center gap-1 self-start pt-1 text-xs font-semibold text-violet-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                  >
                    Why this match
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.p
                        key="reason"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="text-xs leading-relaxed text-zinc-400"
                      >
                        {item.reasoning}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
