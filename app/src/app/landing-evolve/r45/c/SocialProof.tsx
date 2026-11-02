import Image from "next/image";
import { BadgeCheck, Clock3 } from "lucide-react";
import Reveal from "./Reveal";
import { CLOSED_SALE, STATS, TESTIMONIALS, formatUsd } from "./data";
import { CAPTION, FIG_CAPTION, GHOST_TEXT, MUTED_TEXT, STAT_LABEL } from "./tokens";

export function SocialProof() {
  // Fixed, historical figures -- computed once from CLOSED_SALE's own two numbers, never from
  // the shared discount state, so this card can't be mistaken for something the divider drives.
  const closedDiscountPct = Math.round((1 - CLOSED_SALE.soldPrice / CLOSED_SALE.newPrice) * 100);

  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <p className={`${CAPTION} ${MUTED_TEXT}`}>From buyers who dragged the line themselves</p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="h-full min-w-0">
              <blockquote className="relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <span aria-hidden="true" className={`absolute right-5 top-3 text-5xl font-extrabold leading-none ${GHOST_TEXT}`}>
                  &rdquo;
                </span>
                <p className="relative max-w-[460px] text-base font-normal leading-[1.6] text-[#F4F4F5]">{t.quote}</p>
                <footer className="relative mt-4">
                  <p className="text-sm font-semibold text-[#F4F4F5]">{t.name}</p>
                  <p className={`text-xs font-normal ${MUTED_TEXT}`}>{t.role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12} className="mt-10">
          <div className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="min-w-0">
                <p className="text-3xl font-extrabold tabular-nums text-[#F4F4F5] sm:text-4xl">{s.value}</p>
                <p className={`mt-1 ${STAT_LABEL} ${MUTED_TEXT}`}>{s.label}</p>
              </div>
            ))}

            <div className="min-w-0 border-t border-white/10 pt-5 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className={`${CAPTION} ${MUTED_TEXT}`}>Fig. 01 — one closed sale, fixed</p>
              <div className="mt-2 flex gap-3">
                <div className="relative aspect-[4/3] w-16 shrink-0 overflow-hidden rounded-lg bg-[#1C1C22]">
                  <Image src={CLOSED_SALE.image} alt={CLOSED_SALE.alt} fill sizes="96px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#F4F4F5]">{CLOSED_SALE.title}</p>
                  <p className={`truncate text-xs font-normal ${MUTED_TEXT}`}>{CLOSED_SALE.brand}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className={`text-xs font-normal ${MUTED_TEXT} line-through`}>{formatUsd(CLOSED_SALE.newPrice)}</span>
                    <span className="text-sm font-extrabold tabular-nums text-[#F4F4F5]">{formatUsd(CLOSED_SALE.soldPrice)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <BadgeCheck className="h-3 w-3 shrink-0 text-[#BEF264]" aria-hidden="true" />
                <Clock3 className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />
                <p className={`${FIG_CAPTION} ${MUTED_TEXT}`}>
                  Sold in {CLOSED_SALE.daysToSell}d at {closedDiscountPct}% off — this card is historical and doesn&rsquo;t move with the line above.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
