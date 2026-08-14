import {
  CASE_STUDY as CS,
  cx,
  DISPLAY_FACE,
  EYEBROW,
  formatUSD,
  NUM,
} from "./data";

/**
 * Single case-study block — one buyer's story, concrete before/after numbers
 * embedded directly in the prose. No quote grid, no separate stat-strip
 * section: the two bars below are part of *this* block, not a standalone
 * section, per this candidate's assigned structure.
 */
export default function CaseStudy() {
  const afterWidth = Math.round(
    (CS.afterMinutes / CS.beforeMinutes) * 100,
  );

  return (
    <section aria-labelledby="case-title" className="w-full bg-[#F5F4FA]">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 sm:py-24">
        <p className={EYEBROW}>One buyer, three purchases</p>
        <h2
          id="case-title"
          style={DISPLAY_FACE}
          className="mt-4 max-w-[22ch] text-[clamp(1.9rem,4.4vw,2.9rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-[#0B0B0F]"
        >
          Jonah stopped guessing and started filtering.
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <p className="max-w-[62ch] text-base font-normal leading-[1.6] text-[#0B0B0F]">
              Jonah used to keep four marketplace tabs open at once, each
              with its own half-trusted filter set, and still spend around{" "}
              <strong className={cx("font-semibold", NUM)}>
                {CS.beforeMinutes} minutes
              </strong>{" "}
              per search scrolling past listings that were never in his size,
              budget, or condition floor to begin with.
            </p>
            <p className="mt-4 max-w-[62ch] text-base font-normal leading-[1.6] text-[#0B0B0F]">
              On repick he set three filters once — outerwear, $200 and up,
              like new — and the shelf answered immediately: a shearling
              aviator jacket at{" "}
              <strong className={cx("font-semibold", NUM)}>
                {CS.avgMatch}% match
              </strong>
              , priced at{" "}
              <strong className={cx("font-semibold", NUM)}>
                {formatUSD(245)}
              </strong>{" "}
              against a{" "}
              <strong className={cx("font-semibold", NUM)}>
                {formatUSD(460)}
              </strong>{" "}
              retail tag, condition grade attached, seller verified. Average
              browse time for that same kind of search dropped to about{" "}
              <strong className={cx("font-semibold", NUM)}>
                {CS.afterMinutes} minutes
              </strong>
              .
            </p>
            <p className="mt-4 max-w-[62ch] text-base font-normal leading-[1.6] text-[#0B0B0F]">
              The pattern held over his next two purchases too:{" "}
              <strong className={cx("font-semibold", NUM)}>
                {CS.purchases} picks
              </strong>{" "}
              in 90 days,{" "}
              <strong className={cx("font-semibold", NUM)}>
                {formatUSD(CS.totalSaved)}
              </strong>{" "}
              saved against retail combined, a{" "}
              <strong className={cx("font-semibold", NUM)}>
                {CS.avgDiscount}%
              </strong>{" "}
              average discount, and{" "}
              <strong className={cx("font-semibold", NUM)}>
                {CS.returns}
              </strong>{" "}
              returns — because the grade and verification he compared on
              the rail were the same ones waiting for him at checkout.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-7">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                Average browse time per search
              </p>
              <div className="mt-5 flex flex-col gap-4">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-normal text-zinc-600">
                      Before repick
                    </span>
                    <span className={cx("text-sm font-extrabold text-[#0B0B0F]", NUM)}>
                      {CS.beforeMinutes} min
                    </span>
                  </div>
                  <div className="mt-2 h-3 w-full rounded-full bg-zinc-100">
                    <div className="h-3 w-full rounded-full bg-zinc-300" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-normal text-zinc-600">
                      With three filters set
                    </span>
                    <span className={cx("text-sm font-extrabold text-[#0B0B0F]", NUM)}>
                      {CS.afterMinutes} min
                    </span>
                  </div>
                  <div className="mt-2 h-3 w-full rounded-full bg-zinc-100">
                    <div
                      className="h-3 rounded-full bg-[#6E56CF]"
                      style={{ width: `${afterWidth}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="mt-6 border-t border-zinc-200 pt-5 text-sm font-normal leading-[1.6] text-zinc-600">
                Same three filters, applied to the picks shown in the hero
                above — Jonah&rsquo;s numbers, not a separate demo dataset.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
