"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Check, ChevronDown, ShieldCheck } from "lucide-react";
import { cx, comma, CAPTION, NUM, FOCUS, EASE, type Product } from "../data";

/**
 * 채팅 안에 인라인으로 뜨는 제품 추천 카드.
 * 클릭하면 검수 상세(추가 근거)가 펼쳐진다 — 장식이 아니라 "왜 이 매물인지"를 더 깊게
 * 검증하고 싶은 사용자를 위한 설득 인터랙션.
 */
export default function ProductCard({ product }: { product: Product }) {
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const p = product;

  return (
    <figure className="m-0 max-w-[85%] min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F] sm:max-w-[420px]">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={p.image}
          alt={p.alt}
          fill
          sizes="(min-width: 640px) 420px, 85vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/70 to-transparent"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0B0B0F]/80 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
          <span className={NUM}>매칭 {p.match}%</span>
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/20 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
          {p.grade}급 · {p.gradeLabel}
        </span>
      </div>

      <figcaption className="flex flex-col gap-3 p-4 sm:p-5">
        <div>
          <p className={cx(CAPTION, "text-[#A1A1AA]")}>{p.brand}</p>
          <h4 className="mt-1 text-[1.0625rem] font-semibold leading-snug tracking-[-0.02em] text-white">
            {p.title}
          </h4>
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-white">
            <BadgeCheck className="h-4 w-4 text-[#6E56CF]" aria-hidden="true" />
            {p.seller}
          </span>
          <span className="text-[0.75rem] font-normal text-[#A1A1AA]">{p.sellerMeta}</span>
        </div>

        <ul className="flex flex-col gap-1.5">
          {p.reasons.map((r) => (
            <li
              key={r}
              className="flex items-center gap-2 text-[0.8125rem] font-normal text-[#A1A1AA]"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" strokeWidth={2.5} aria-hidden="true" />
              {r}
            </li>
          ))}
        </ul>

        <div className="flex items-baseline gap-2 border-t border-white/10 pt-3">
          <span className={cx("text-xl font-extrabold text-white", NUM)}>{comma(p.price)}원</span>
          <span className={cx("text-[0.8125rem] font-normal text-white/40 line-through", NUM)}>
            {comma(p.original)}원
          </span>
          <span className={cx("ml-auto rounded-md bg-[#6E56CF] px-2 py-0.5 text-[0.8125rem] font-semibold text-white", NUM)}>
            -{p.discount}%
          </span>
        </div>

        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className={cx(
            "inline-flex items-center gap-1.5 self-start rounded-md text-[0.75rem] font-semibold text-[#A1A1AA] transition-colors hover:text-white",
            FOCUS,
          )}
        >
          검수 상세 {expanded ? "접기" : "더보기"}
          <ChevronDown
            className={cx("h-3.5 w-3.5 transition-transform duration-200", expanded && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="detail"
              initial={reduced ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduced ? { height: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <ul className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                {p.detail.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2 text-[0.78125rem] font-normal leading-relaxed text-white/80"
                  >
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6E56CF]" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </figcaption>
    </figure>
  );
}
