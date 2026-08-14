"use client";

import Image from "next/image";
import { Sparkles, BadgeCheck, Tag } from "lucide-react";
import { CAPTION, FOCUS_RING, NUM, PRODUCTS, cx, money } from "./data";

/**
 * Four parallel product preview cards — the brief's mandatory, always-on proof surface. Every fact
 * (AI match tag, condition grade, seller verification, before/after discount) renders as a
 * spec-sheet key/value list *below* the photo, never as a badge overlaid on top of it: an overlay
 * collides unreadably with the browser's fallback alt text if the remote image fails to load, and a
 * separate row does not.
 *
 * Below `lg` this is a horizontally-snapping row rather than a 2x2 grid: a 2x2 grid of genuinely
 * rich spec-sheet cards cannot fit two full rows inside a 390x900 first fold alongside a legible
 * headline and the layer-toggle device above it, and shrinking the cards to fit would leave the
 * spec text unreadable. A single row keeps every card at a legible width, keeps all four in the
 * fold vertically (no *page* scroll to reach them), and local horizontal scroll on narrow
 * viewports is the pattern the repo's own width rules already carve out for exactly this kind of
 * space-constrained content. The whole card is one link (no separate hover-only affordance) so the
 * baseline proof never depends on a pointer.
 */
export default function ProductGrid() {
  return (
    <div
      id="picks"
      className="scroll-mt-24 flex w-full gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [contain:layout] sm:gap-4 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 lg:[contain:none]"
    >
      {PRODUCTS.map((item) => (
        <a
          key={item.id}
          href="#cta"
          className={cx(
            "group flex w-[58%] max-w-[210px] shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[45%] lg:w-auto lg:max-w-none",
            FOCUS_RING,
          )}
        >
          <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden bg-[#111116] sm:aspect-[4/3]">
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 70vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>

          <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-3">
            <div className="min-w-0">
              <p className={cx(CAPTION, "hidden text-[#A1A1AA] sm:block")}>{item.brand}</p>
              <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-white sm:mt-0.5">
                {item.title}
              </h3>
            </div>

            <dl className="flex flex-1 flex-col gap-1 border-t border-white/10 pt-1.5 text-[0.72rem] leading-snug sm:gap-1.5 sm:pt-2">
              <div className="flex items-start gap-1.5">
                <dt className="mt-px flex shrink-0 items-center gap-1 font-semibold text-[#A1A1AA]">
                  <Sparkles aria-hidden="true" className="size-3 text-[#B6A6F0]" />
                  <span className="sr-only">AI match reasoning</span>
                </dt>
                <dd className="line-clamp-1 sm:line-clamp-none min-w-0 font-normal text-[#A1A1AA]">{item.matchTag}</dd>
              </div>
              <div className="flex items-start gap-1.5">
                <dt className="mt-px flex shrink-0 items-center gap-1 font-semibold text-[#A1A1AA]">
                  <BadgeCheck aria-hidden="true" className="size-3 text-[#B6A6F0]" />
                  <span className="sr-only">Condition grade</span>
                </dt>
                <dd className="line-clamp-1 sm:line-clamp-none min-w-0 font-normal text-white">
                  Grade {item.grade} <span className="text-[#A1A1AA]">· {item.gradeNote}</span>
                </dd>
              </div>
              <div className="flex items-start gap-1.5">
                <dt className="mt-px flex shrink-0 items-center gap-1 font-semibold text-[#A1A1AA]">
                  <BadgeCheck aria-hidden="true" className="size-3 text-[#B6A6F0]" />
                  <span className="sr-only">Seller verification</span>
                </dt>
                <dd className="line-clamp-1 sm:line-clamp-none min-w-0 font-normal text-[#A1A1AA]">{item.seller}</dd>
              </div>
              <div className="mt-auto flex items-start gap-1.5 pt-0.5">
                <dt className="mt-px flex shrink-0 items-center gap-1 font-semibold text-[#A1A1AA]">
                  <Tag aria-hidden="true" className="size-3 text-[#B6A6F0]" />
                  <span className="sr-only">Price, before and after</span>
                </dt>
                <dd className={cx("flex min-w-0 flex-wrap items-baseline gap-x-1.5", NUM)}>
                  <span className="font-semibold text-white">{money(item.price)}</span>
                  <s className="font-normal text-[#A1A1AA]">{money(item.original)}</s>
                  <span className="font-semibold text-[#B6A6F0]">-{item.discount}%</span>
                </dd>
              </div>
            </dl>
          </div>
        </a>
      ))}
    </div>
  );
}
