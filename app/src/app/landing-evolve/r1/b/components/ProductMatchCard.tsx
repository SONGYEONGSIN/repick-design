"use client";

import Image from "next/image";
import { Sparkles, BadgeCheck } from "lucide-react";
import { cx, CAPTION, NUM } from "../lib/tokens";
import { FEATURED_PRODUCT } from "../lib/data";

/**
 * AI 매칭 챕터의 핵심 매물 카드.
 * 전환 설득 요소 5종을 모두 담는다:
 * ① AI 매칭 근거 태그 ② 컨디션 등급 ③ 판매자 인증 배지 ④ before/after 할인율 ⑤ 매칭 점수.
 */
export default function ProductMatchCard() {
  const p = FEATURED_PRODUCT;
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-transform duration-300 hover:-translate-y-1 motion-reduce:transform-none">
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={p.image}
          alt={p.alt}
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/70 via-transparent to-[#0B0B0F]/20"
        />
        {/* ① AI 매칭 % */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#0B0B0F]/80 px-2.5 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden="true" />
          <span className={NUM}>AI 매칭 {p.match}%</span>
        </span>
        {/* ② 컨디션 등급 */}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#0B0B0F]/80 px-2.5 py-1 text-[0.6875rem] font-semibold text-white backdrop-blur">
          {p.grade}급 · {p.gradeLabel}
        </span>
      </div>

      <figcaption className="space-y-4 p-5">
        <div>
          <p className={cx(CAPTION, "text-[#A1A1AA]")}>{p.brand}</p>
          <h3 className="mt-1 text-lg font-semibold leading-snug text-white">{p.title}</h3>
        </div>

        {/* ③ 판매자 인증 */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-white">
            <BadgeCheck className="h-4 w-4 text-[#6E56CF]" aria-hidden="true" />
            {p.seller}
          </span>
          <span className="text-[0.75rem] text-[#A1A1AA]">{p.sellerMeta}</span>
        </div>

        {/* AI 매칭 근거 태그 */}
        <ul className="flex flex-wrap gap-1.5">
          {p.tags.map((t) => (
            <li
              key={t}
              className="inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/30 bg-[#6E56CF]/12 px-2.5 py-1 text-[0.75rem] text-[#6E56CF]"
            >
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#6E56CF]" />
              {t}
            </li>
          ))}
        </ul>

        {/* ④ before / after 할인율 */}
        <div className="flex items-baseline gap-2 border-t border-white/10 pt-4">
          <span className={cx("text-2xl font-extrabold text-white", NUM)}>{p.price}원</span>
          <span className={cx("text-sm text-white/40 line-through", NUM)}>{p.original}원</span>
          <span className={cx("ml-auto rounded-md bg-[#6E56CF] px-2 py-0.5 text-sm font-semibold text-white", NUM)}>
            -{p.discount}%
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
