import Image from "next/image";
import { BadgeCheck, Clock3 } from "lucide-react";
import Reveal from "./Reveal";
import { CLOSED_SALE, STATS, TESTIMONIALS, discountPercent, formatUsd } from "./data";
import { CAPTION, FIG_CAPTION, GHOST_TEXT, MUTED_TEXT, STAT_LABEL } from "./tokens";

export function SocialProof() {
  const closedDiscount = discountPercent(CLOSED_SALE.priceBefore, CLOSED_SALE.soldPrice);

  return (
    <section className="border-t border-[#E4E4E7] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <p className={`${CAPTION} ${MUTED_TEXT}`}>From buyers and sellers who read the window first</p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08} className="h-full min-w-0">
              <blockquote className="relative h-full rounded-2xl border border-[#E4E4E7] bg-white p-6">
                <span aria-hidden="true" className={`absolute right-5 top-3 text-5xl font-extrabold leading-none ${GHOST_TEXT}`}>
                  &rdquo;
                </span>
                <p className="relative max-w-[460px] text-base font-normal leading-[1.6] text-[#09090B]">{t.quote}</p>
                <footer className="relative mt-4">
                  <p className="text-sm font-semibold text-[#09090B]">{t.name}</p>
                  <p className={`text-xs font-normal ${MUTED_TEXT}`}>{t.role}</p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12} className="mt-10">
          <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#E4E4E7] bg-white p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="min-w-0">
                <p className="text-3xl font-extrabold tabular-nums text-[#09090B] sm:text-4xl">{s.value}</p>
                <p className={`mt-1 ${STAT_LABEL} ${MUTED_TEXT}`}>{s.label}</p>
              </div>
            ))}

            <div className="min-w-0 border-t border-[#E4E4E7] pt-5 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <p className={`${CAPTION} ${MUTED_TEXT}`}>Fig. 01 — one closed sale, fixed</p>
              <div className="mt-2 flex gap-3">
                <div className="relative aspect-[4/3] w-16 shrink-0 overflow-hidden rounded-lg bg-[#F4F4F5]">
                  <Image src={CLOSED_SALE.image} alt={CLOSED_SALE.alt} fill sizes="96px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#09090B]">{CLOSED_SALE.title}</p>
                  <p className={`truncate text-xs font-normal ${MUTED_TEXT}`}>{CLOSED_SALE.brand}</p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className={`text-xs font-normal ${MUTED_TEXT} line-through`}>{formatUsd(CLOSED_SALE.priceBefore)}</span>
                    <span className="text-sm font-extrabold tabular-nums text-[#09090B]">{formatUsd(CLOSED_SALE.soldPrice)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <BadgeCheck className="h-3 w-3 shrink-0 text-[#047857]" aria-hidden="true" />
                <Clock3 className="h-3 w-3 shrink-0 text-zinc-500" aria-hidden="true" />
                <p className={`${FIG_CAPTION} ${MUTED_TEXT}`}>
                  Sold in {CLOSED_SALE.daysToSell}d at {closedDiscount}% off — this card is historical and
                  doesn&rsquo;t move with the window above.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
