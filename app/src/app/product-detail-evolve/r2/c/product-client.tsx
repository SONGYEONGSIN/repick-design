"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, Hammer, Ruler, Scale, ShoppingBag, Star, Weight } from "lucide-react";
import {
  BRAND,
  DEFAULT_BLADE_ID,
  DEFAULT_FINISH_ID,
  DEFAULT_WOOD_ID,
  DISPLAY_FONT,
  MODEL_LINE,
  PRODUCT_NAME,
  REVIEW_COUNT,
  AVERAGE_RATING,
  cx,
  computeConfig,
  formatUsd,
  getBlade,
  getFinish,
  getWood,
  FOCUS,
  type BladeId,
  type FinishId,
  type WoodId,
} from "./data";
import FloatingCard from "./floating-card";
import Journal from "./journal";
import SpecTable from "./spec-table";
import Reviews from "./reviews";

// The desktop card is corner-pinned at right-6 with a 300px width (floating-card.tsx). This shell
// reserves a matching gutter on the right from the `lg` breakpoint up — the same breakpoint the
// card itself appears at — so it never sits on top of page text at 1024-1440px widths, only in
// the empty margin beside it. Below `lg` the card becomes the mobile bottom bar instead.
const SHELL = "mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:pl-8 lg:pr-[352px]";
const CONTENT = "mx-auto max-w-[760px]";

export default function ProductClient() {
  const [bladeId, setBladeId] = useState<BladeId>(DEFAULT_BLADE_ID);
  const [woodId, setWoodId] = useState<WoodId>(DEFAULT_WOOD_ID);
  const [finishId, setFinishId] = useState<FinishId>(DEFAULT_FINISH_ID);
  const [added, setAdded] = useState(false);
  const addTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const blade = getBlade(bladeId);
  const wood = getWood(woodId);
  const finish = getFinish(finishId);
  const config = computeConfig(bladeId, woodId, finishId);

  useEffect(() => {
    return () => {
      if (addTimeout.current) clearTimeout(addTimeout.current);
    };
  }, []);

  function handleAddToCart() {
    setAdded(true);
    if (addTimeout.current) clearTimeout(addTimeout.current);
    addTimeout.current = setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#overview"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-amber-700 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none"
      >
        Skip to product overview
      </a>

      <div aria-live="polite" className="sr-only">
        {added
          ? `Added ${PRODUCT_NAME} — ${blade.label} blade, ${wood.label}, ${finish.label} — to cart.`
          : ""}
      </div>

      <header className="border-b border-zinc-200 bg-white">
        <div className={cx(SHELL, "flex items-center gap-2.5 py-4")}>
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-zinc-900 text-white">
            <Hammer className="h-4 w-4" aria-hidden="true" />
          </span>
          <span style={DISPLAY_FONT} className="text-base font-semibold tracking-tight text-zinc-900">
            {BRAND}
          </span>
          <span className="ml-1 hidden text-sm font-normal text-zinc-600 sm:inline">— {MODEL_LINE}</span>
        </div>
      </header>

      <main className={cx(SHELL, "pt-10 pb-32 sm:pt-14 lg:pb-16")}>
       <div className={CONTENT}>
        {/* ---------------------------------------------------------------- Opening spread */}
        <section id="overview" aria-label="Overview" className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="w-full flex-none sm:w-72">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
              <Image
                src="https://picsum.photos/seed/ferrous-oak-hero-v3/720/900"
                alt="The Ferrous & Oak No. 4 chef's knife, laid on a linen cloth, showing the full blade and handle"
                fill
                sizes="(min-width: 640px) 288px, 100vw"
                className="object-cover"
                priority
              />
            </div>
            <p className="mt-2.5 flex items-center gap-1.5 text-xs font-normal text-zinc-600">
              <Hammer className="h-3.5 w-3.5 flex-none text-zinc-500" aria-hidden="true" />
              Hand-forged · edition of 12 · Vermont, USA
            </p>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-normal text-amber-700">{BRAND}</p>
            <h1 style={DISPLAY_FONT} className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              {PRODUCT_NAME}
            </h1>
            <p className="mt-3 max-w-prose text-base font-normal leading-relaxed text-zinc-600">
              A single-billet kitchen knife, forged and ground by hand from San-Mai clad high-carbon
              steel. Choose the blade length, handle wood and edge finish below — the journal further
              down follows this exact configuration through the forge.
            </p>

            <a href="#reviews" className={cx("mt-4 inline-flex items-center gap-2 rounded", FOCUS)}>
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cx("h-4 w-4", n <= Math.round(AVERAGE_RATING) ? "fill-amber-600 text-amber-600" : "fill-zinc-200 text-zinc-200")}
                  />
                ))}
              </span>
              <span className="text-sm font-medium text-zinc-900 tabular-nums">{AVERAGE_RATING.toFixed(1)}</span>
              <span className="text-sm font-normal text-zinc-600 tabular-nums">({REVIEW_COUNT} reviews)</span>
            </a>

            <div className="mt-6 flex items-end justify-between gap-4 border-t border-zinc-200 pt-5">
              <div>
                <p className="text-xs font-normal text-zinc-600">Price, as configured</p>
                <p className="text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums">{formatUsd(config.priceUsd)}</p>
              </div>
              <p className="text-sm font-normal text-zinc-600">Ships in 2-3 weeks, made to order</p>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-zinc-200 py-4 sm:grid-cols-4">
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
                  <Ruler className="h-4 w-4 flex-none text-amber-700" aria-hidden="true" />
                  Blade
                </dt>
                <dd className="pl-[22px] text-sm font-medium tabular-nums text-zinc-900">{blade.bladeMm} mm</dd>
              </div>
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
                  <Weight className="h-4 w-4 flex-none text-amber-700" aria-hidden="true" />
                  Weight
                </dt>
                <dd className="pl-[22px] text-sm font-medium tabular-nums text-zinc-900">{config.weightG} g</dd>
              </div>
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
                  <Scale className="h-4 w-4 flex-none text-amber-700" aria-hidden="true" />
                  Balance
                </dt>
                <dd className="pl-[22px] text-sm font-medium tabular-nums text-zinc-900">+{config.balanceMm} mm</dd>
              </div>
              <div className="min-w-0">
                <dt className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
                  <Hammer className="h-4 w-4 flex-none text-amber-700" aria-hidden="true" />
                  Edge angle
                </dt>
                <dd className="pl-[22px] text-sm font-medium tabular-nums text-zinc-900">{config.edgeAngleDeg}°</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={handleAddToCart}
              className={cx(
                "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 py-3.5 text-base font-medium text-white transition-colors hover:bg-amber-800 sm:w-auto sm:px-8",
                FOCUS,
              )}
            >
              {added ? <Check className="h-4.5 w-4.5 flex-none" aria-hidden="true" /> : <ShoppingBag className="h-4.5 w-4.5 flex-none" aria-hidden="true" />}
              {added ? "Added to cart" : `Add to cart — ${formatUsd(config.priceUsd)}`}
            </button>
            <p className="mt-2 text-xs font-normal text-zinc-600">
              Change blade length, wood or finish any time from the panel in the corner — price and
              specs above update with it.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------------- Journal */}
        <Journal finish={finish} wood={wood} />

        {/* ---------------------------------------------------------------- Full specifications */}
        <section id="specs" aria-labelledby="specs-heading" className="mt-16 border-t border-zinc-200 pt-12 sm:mt-20 sm:pt-16">
          <h2 id="specs-heading" className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Full specifications
          </h2>
          <p className="mt-2 max-w-prose text-sm font-normal leading-relaxed text-zinc-600">
            Everything above, plus the craft record and care instructions. Blade opens by default —
            expand the rest as needed.
          </p>
          <SpecTable blade={blade} wood={wood} finish={finish} config={config} />
        </section>

        {/* ---------------------------------------------------------------- Reviews */}
        <div id="reviews">
          <Reviews />
        </div>
       </div>
      </main>

      <footer className="border-t border-zinc-200">
        <div className={cx(SHELL, "py-8 pb-36 text-xs font-normal text-zinc-600 lg:pb-8")}>
          {BRAND} — a fictional forge studio; specifications are illustrative for a design review.
        </div>
      </footer>

      <FloatingCard
        bladeId={bladeId}
        woodId={woodId}
        finishId={finishId}
        onChangeBlade={setBladeId}
        onChangeWood={setWoodId}
        onChangeFinish={setFinishId}
        price={config.priceUsd}
        weightG={config.weightG}
        added={added}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
