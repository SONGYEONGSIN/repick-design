"use client";

import Image from "next/image";
import { LISTINGS, CAPTION, FOCUS, NUM, cx, money } from "./data";

/**
 * Four parallel listings, fully tagged at rest. Match score and its reason, condition grade, seller
 * verification and the before/after discount are all rendered as a spec list *beside* the thumbnail,
 * never overlaid on it: an overlay collides unreadably with the browser's fallback alt text when a
 * remote image fails, and a separate row does not. The thumbnail box is a fixed square with a paper
 * background, so a slow or dead image never moves the card.
 */
export default function ProductRail() {
  return (
    <div
      className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [contain:layout] lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0 lg:[contain:none]"
      id="picks"
    >
      {LISTINGS.map((item) => (
        <a
          key={item.id}
          href="#cta"
          className={cx(
            "group flex w-[78%] shrink-0 snap-start flex-col gap-2.5 rounded-lg border border-[#E2E2DC] bg-white p-3 transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[46%] lg:w-auto",
            FOCUS,
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-[#F5F5F2]">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="48px"
                className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
            <div className="min-w-0">
              <p className={cx(CAPTION, "truncate text-[#5B5B55]")}>{item.brand}</p>
              <h3 className="truncate text-[0.85rem] font-semibold leading-snug text-[#12120F]">
                {item.title}
              </h3>
            </div>
          </div>

          <dl className="flex flex-col gap-1 border-t border-[#E2E2DC] pt-2 text-[0.68rem] leading-normal">
            <div className="flex gap-2">
              <dt className="w-[3.4rem] shrink-0 font-semibold text-[#5B5B55]">Match</dt>
              <dd className="min-w-0 flex-1 truncate text-[#12120F]">
                <span className={cx(NUM, "font-semibold text-[#0F766E]")}>{item.match}%</span>
                <span className="text-[#5B5B55]"> · {item.matchReason}</span>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-[3.4rem] shrink-0 font-semibold text-[#5B5B55]">Grade</dt>
              <dd className="min-w-0 flex-1 truncate text-[#12120F]">
                <span className="font-semibold">{item.grade}</span>
                <span className="text-[#5B5B55]"> · {item.gradeNote}</span>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-[3.4rem] shrink-0 font-semibold text-[#5B5B55]">Seller</dt>
              <dd className="min-w-0 flex-1 truncate text-[#12120F]">
                <span className="font-semibold">Verified, {item.seller}</span>
                <span className="text-[#5B5B55]"> · {item.sellerMeta}</span>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-[3.4rem] shrink-0 font-semibold text-[#5B5B55]">Price</dt>
              <dd className={cx(NUM, "flex min-w-0 flex-1 flex-wrap items-baseline gap-x-1.5")}>
                <span className="font-semibold text-[#12120F]">{money(item.price)}</span>
                <s className="text-[#5B5B55]">{money(item.original)}</s>
                <span className="font-semibold text-[#0F766E]">-{item.discount}%</span>
              </dd>
            </div>
          </dl>
        </a>
      ))}
    </div>
  );
}
