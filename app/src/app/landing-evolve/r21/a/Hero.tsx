import Link from "next/link";
import HistoryLog from "./HistoryLog";
import ProductCard from "./ProductCard";
import StageScrubber from "./StageScrubber";
import { ITEM, SOCIAL_STATS } from "./data";
import { ACCENT_SOLID, cx, DISPLAY_STYLE, FOCUS, MUTED, NUM, TRACK_EYEBROW, TRACK_STAT, TRANSITION } from "./tokens";

export default function Hero({ activeIndex, onChange }: { activeIndex: number; onChange: (i: number) => void }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20 lg:px-8 lg:pt-16 lg:pb-28">
      <div className="flex items-baseline justify-between gap-4">
        <span className={cx("text-[11px] font-semibold uppercase text-zinc-600", TRACK_EYEBROW)}>Real item · real record</span>
        <span className={cx("hidden font-mono text-[11px] uppercase text-zinc-600 sm:inline", TRACK_STAT)}>01 — Record</span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-5">
          <h1
            style={DISPLAY_STYLE}
            className="text-[clamp(2.75rem,_1.7rem_+_3.4vw,_4.5rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-zinc-900"
          >
            <span className="block">Drag through</span>
            <span className="block">its real past.</span>
          </h1>
          <p className={cx("mt-5 max-w-[480px] text-base leading-relaxed", MUTED)}>
            Every repick listing carries its actual processing record, not a mockup. Scrub this coat through five real
            stages — from a seller&rsquo;s first upload to its final, authenticated price.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link href="/catalog" className={cx("rounded-full px-5 py-3 text-sm font-semibold", ACCENT_SOLID, TRANSITION, FOCUS)}>
              Browse authenticated listings
            </Link>
            <span className={cx(NUM, "text-xs", MUTED)}>
              {SOCIAL_STATS[0].value} {SOCIAL_STATS[0].label}
            </span>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h2 className="text-base font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-lg">Five real stages, one coat.</h2>
              <span className={cx(NUM, "text-[11px] font-normal", MUTED)}>Ref #{ITEM.refId}</span>
            </div>
            <p className={cx("mt-1 text-[13px] leading-relaxed", MUTED)}>
              Drag the handle, tap a stage, or click a row below — every path scrubs the same record.
            </p>

            <div className="mt-6">
              <StageScrubber activeIndex={activeIndex} onChange={onChange} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-5">
              <div className="min-w-0 sm:col-span-2">
                <ProductCard activeIndex={activeIndex} />
              </div>
              <div className="min-w-0 sm:col-span-3">
                <HistoryLog activeIndex={activeIndex} onChange={onChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
