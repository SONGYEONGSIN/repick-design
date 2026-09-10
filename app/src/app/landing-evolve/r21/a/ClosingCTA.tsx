import Link from "next/link";
import { factsAtStage, ITEM, STAGES } from "./data";
import { ACCENT_SOLID, ACCENT_TEXT, cx, FOCUS, MUTED, NUM, TRACK_CAPTION, TRACK_EYEBROW, TRACK_STAT, TRANSITION } from "./tokens";

/**
 * The manipulation-survives-to-the-end section. `activeIndex` is the exact same state the scrubber,
 * the product card, and the history log read from — this recomputes `factsAtStage` against it rather
 * than repeating a string captured earlier, so whatever stage a visitor last scrubbed to is the one
 * quoted here, always.
 */
export default function ClosingCTA({ activeIndex }: { activeIndex: number }) {
  const stage = STAGES[activeIndex];
  const facts = factsAtStage(activeIndex);

  return (
    <section className="border-t border-zinc-200">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex items-baseline justify-between gap-4">
          <span className={cx("text-[11px] font-semibold uppercase text-zinc-600", TRACK_EYEBROW)}>Get matched</span>
          <span className={cx("hidden font-mono text-[11px] uppercase text-zinc-600 sm:inline", TRACK_STAT)}>04 — Close</span>
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-3xl lg:text-4xl">
                The record never gets rewritten.
              </h2>
              <p className={cx("mt-4 max-w-[480px] text-base leading-relaxed", MUTED)}>
                Right now you&rsquo;re scrubbed to <span className="font-semibold text-zinc-900">{stage.label}</span> —{" "}
                <span className={NUM}>
                  {stage.date}, {stage.time}
                </span>
                . On the record for this coat so far: {facts.join(", ")}.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/catalog" className={cx("rounded-full px-5 py-3 text-sm font-semibold", ACCENT_SOLID, TRANSITION, FOCUS)}>
                  Browse authenticated listings
                </Link>
                <span className={cx("text-xs", MUTED)}>Every listing carries its own five-stage record.</span>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-2xl border border-[#DCE9C7] bg-[#F1F7E6] p-5">
                <p className={cx("text-[11px] font-semibold uppercase", TRACK_CAPTION, ACCENT_TEXT)}>Currently viewing</p>
                <p className="mt-2 text-lg font-extrabold text-zinc-900">{ITEM.title}</p>
                <p className="mt-0.5 text-xs font-normal text-zinc-600">{ITEM.spec}</p>
                <dl className="mt-3 grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <dt className="text-[10px] font-normal uppercase text-zinc-600">Stage</dt>
                    <dd className="truncate text-sm font-semibold text-zinc-900">{stage.shortLabel}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-[10px] font-normal uppercase text-zinc-600">Recorded</dt>
                    <dd className={cx(NUM, "truncate text-sm font-semibold text-zinc-900")}>{stage.date}</dd>
                  </div>
                </dl>
                <p className={cx(NUM, "mt-3 border-t border-[#DCE9C7] pt-3 text-sm font-semibold", ACCENT_TEXT)}>{stage.stat}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
