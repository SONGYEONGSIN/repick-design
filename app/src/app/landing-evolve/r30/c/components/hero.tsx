import Link from "next/link";
import {
  EXAMPLE_ITEM,
  computeOverall,
  type SignalId,
  type Weights,
} from "./data";
import { IcicleChart } from "./icicle-chart";
import { WeightSliders } from "./weight-sliders";
import { Caption, DISPLAY_FONT, Eyebrow, FOCUS } from "./ui";

export function Hero({
  weights,
  onWeightChange,
  onReset,
}: {
  weights: Weights;
  onWeightChange: (id: SignalId, value: number) => void;
  onReset: () => void;
}) {
  const overall = computeOverall(weights);
  const discount = Math.round(100 - (EXAMPLE_ITEM.price / EXAMPLE_ITEM.originalPrice) * 100);

  return (
    <section id="hero" className="relative bg-[#0B0B0F] pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div>
            <Eyebrow>WHY THIS MATCH</Eyebrow>
            <h1
              className="mt-5 text-[clamp(2.75rem,1.9rem+4vw,5.25rem)] font-bold leading-[0.96] tracking-[-0.02em] text-white"
              style={{ fontFamily: `${DISPLAY_FONT}, var(--font-sans)` }}
            >
              Every match score
              <br />
              shows its receipts.
            </h1>
            <p className="mt-6 max-w-[554px] text-lg leading-[1.6] text-zinc-300">
              Three signals decide how well a listing fits what you're after: condition, brand
              and style, and price. Move any one of the three dials on the right and watch this
              jacket's score redraw itself, using the exact weighting you just set.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                href="/catalog"
                className={`inline-flex items-center justify-center rounded-full bg-[#0E7490] px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#0B5E73] ${FOCUS}`}
              >
                See your own match breakdown
              </Link>
              <span className="text-sm text-zinc-400">
                Free to browse. The breakdown updates live once you're in.
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
            <div className="flex flex-wrap items-end gap-x-8 gap-y-4 border-b border-white/10 pb-6">
              <div>
                <Caption>Live AI match</Caption>
                <p className="mt-1 text-5xl font-bold tabular-nums tracking-[0.12em] text-white">
                  {overall}%
                </p>
              </div>
              <div>
                <Caption>Price</Caption>
                <p className="mt-1 text-xl font-bold text-white">
                  ${EXAMPLE_ITEM.price}
                  <span className="ml-2 text-sm font-normal text-zinc-400 line-through">
                    ${EXAMPLE_ITEM.originalPrice}
                  </span>
                  <span className="ml-2 text-sm font-normal text-[#67E8F9]">
                    {discount}% below retail
                  </span>
                </p>
              </div>
              <div>
                <Caption>Condition grade</Caption>
                <p className="mt-1 text-xl font-bold text-white">
                  {EXAMPLE_ITEM.grade}{" "}
                  <span className="text-sm font-normal text-zinc-400">
                    {EXAMPLE_ITEM.gradeLabel}
                  </span>
                </p>
              </div>
              <div>
                <Caption>Seller</Caption>
                <p className="mt-1 text-sm font-semibold text-[#67E8F9]">
                  {EXAMPLE_ITEM.seller} · {EXAMPLE_ITEM.sellerRating.toFixed(1)}★
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm text-zinc-400">
              {EXAMPLE_ITEM.name} — {EXAMPLE_ITEM.meta}
            </p>

            <div className="mt-7 border-t border-white/10 pt-7">
              <WeightSliders weights={weights} onChange={onWeightChange} onReset={onReset} />
            </div>

            <div className="mt-7 border-t border-white/10 pt-7">
              <IcicleChart weights={weights} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
