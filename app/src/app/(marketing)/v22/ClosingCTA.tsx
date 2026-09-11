import Link from "next/link";
import { offers } from "./data";
import { rankOffers, type Weights } from "./scoring";
import { ACCENT_SOLID, ACCENT_TEXT, cx, FOCUS, MUTED, NUM, TRACK_CAPTION, TRACK_EYEBROW, TRACK_STAT, TRANSITION } from "./tokens";

/**
 * The live weighting survives all the way to the last section of the page: this recomputes the
 * SAME pure `rankOffers` function against the SAME weights state the hero sliders control, rather
 * than repeating a string captured at some earlier point — so the leader named here always matches
 * whatever the visitor last set upstream.
 */
export default function ClosingCTA({ weights }: { weights: Weights }) {
  const ranked = rankOffers(offers, weights);
  const top = ranked[0];
  const shipLabel = top.offer.shipDays === 1 ? "1 day" : `${top.offer.shipDays} days`;

  return (
    <section className="border-t border-zinc-200">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex items-baseline justify-between gap-4">
          <span className={cx("text-[11px] font-semibold uppercase text-zinc-600", TRACK_EYEBROW)}>Get matched</span>
          <span className={cx("hidden font-mono text-[11px] uppercase text-zinc-600 sm:inline", TRACK_STAT)}>05 — Close</span>
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-3xl lg:text-4xl">
                The board never stops ranking.
              </h2>
              <p className={cx("mt-4 max-w-[480px] text-base leading-relaxed", MUTED)}>
                Right now, under your current weighting — price {weights.price}, speed {weights.speed}, trust {weights.trust} —{" "}
                <span className="font-semibold text-zinc-900">{top.offer.seller}</span> leads the board at{" "}
                <span className={cx(NUM, "font-semibold text-zinc-900")}>${top.offer.price.toLocaleString("en-US")}</span>, shipping in{" "}
                {shipLabel}, with a composite score of <span className={cx(NUM, "font-semibold text-zinc-900")}>{top.composite.toFixed(1)}</span>.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/catalog"
                  className={cx("rounded-full px-5 py-3 text-sm font-semibold", ACCENT_SOLID, TRANSITION, FOCUS)}
                >
                  Start your match
                </Link>
                <span className={cx("text-xs", MUTED)}>No fees to list. AI grading included.</span>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className={cx("text-[11px] font-semibold uppercase", TRACK_CAPTION, ACCENT_TEXT)}>Current leader</p>
                <p className="mt-2 text-lg font-extrabold text-zinc-900">{top.offer.seller}</p>
                <dl className="mt-3 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <dt className="text-[10px] uppercase text-zinc-600">Price</dt>
                    <dd className={cx(NUM, "text-base font-extrabold text-zinc-900")}>${top.offer.price.toLocaleString("en-US")}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-zinc-600">Ship</dt>
                    <dd className={cx(NUM, "text-base font-extrabold text-zinc-900")}>{top.offer.shipDays}d</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-zinc-600">Score</dt>
                    <dd className={cx(NUM, "text-base font-extrabold text-zinc-900")}>{top.composite.toFixed(1)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
