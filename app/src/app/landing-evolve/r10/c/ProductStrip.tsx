import Image from "next/image";
import { BadgeCheck, ShieldOff, Sparkles } from "lucide-react";

import { PRODUCTS, cx } from "./data";

/**
 * The mandatory always-on proof strip: 3–4 narrow "boarding-pass" cards sitting in the same fold as
 * the negotiation console. Each card carries all four required facts — AI match-reasoning tag,
 * condition grade, seller-verification badge and discount % — as a single compact inline stat row
 * beneath the photo, never as a badge overlaid on top of the image.
 */
export default function ProductStrip() {
  return (
    <div id="strip" className="mt-7 scroll-mt-20 sm:mt-10 md:mt-12">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
          Live matches, ready to negotiate
        </h2>
        <p className="hidden text-[0.7rem] font-normal text-[#A1A1AA] sm:block">Swipe for more</p>
      </div>

      <ul
        role="list"
        className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:mt-4 sm:gap-4 sm:overflow-visible sm:pb-0"
      >
        {PRODUCTS.map((p) => (
          <li key={p.id} className="w-[152px] shrink-0 snap-start sm:w-[184px] lg:w-[208px]">
            <article className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-[transform,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-white/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <div className="relative aspect-[16/10] w-full bg-[#17171d]">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 208px, (min-width: 640px) 184px, 156px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:p-3">
                <p className="flex items-start gap-1 text-[0.66rem] font-normal leading-[1.35] text-[#B6A6F0]">
                  <Sparkles aria-hidden="true" className="mt-0.5 size-3 shrink-0" />
                  <span>{p.reasonTag}</span>
                </p>
                <h3 className="line-clamp-2 text-[0.82rem] font-semibold leading-[1.3] text-white">
                  {p.title}
                </h3>

                <div className="mt-auto grid grid-cols-4 divide-x divide-white/10 border-t border-white/10 pt-2 text-center">
                  <div className="min-w-0 px-0.5">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.06em] text-[#A1A1AA]">
                      Match
                    </p>
                    <p className="text-[0.76rem] font-semibold tabular-nums text-white">{p.match}%</p>
                  </div>
                  <div className="min-w-0 px-0.5">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.06em] text-[#A1A1AA]">
                      Grade
                    </p>
                    <p className="text-[0.76rem] font-semibold text-white">{p.grade}</p>
                  </div>
                  <div className="min-w-0 px-0.5">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.06em] text-[#A1A1AA]">
                      Verified
                    </p>
                    <p
                      className={cx(
                        "flex items-center justify-center gap-0.5 text-[0.76rem] font-semibold",
                        p.verified ? "text-white" : "text-[#A1A1AA]",
                      )}
                    >
                      {p.verified ? (
                        <BadgeCheck aria-hidden="true" className="size-3 shrink-0 text-[#B6A6F0]" />
                      ) : (
                        <ShieldOff aria-hidden="true" className="size-3 shrink-0" />
                      )}
                      {p.verified ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="min-w-0 px-0.5">
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.06em] text-[#A1A1AA]">
                      Off
                    </p>
                    <p className="text-[0.76rem] font-semibold tabular-nums text-white">
                      {p.discountPct}%
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
