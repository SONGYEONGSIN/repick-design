"use client";

import { memo } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, ShieldCheck } from "lucide-react";
import { cx, comma, EASE, VIEWPORT, CAPTION, NUM, FOCUS, type Product } from "../data";

type Props = {
  product: Product;
  index: number;
  saved: boolean;
  onToggleSave: (id: string) => void;
};

function ProductCard({ product: p, index, saved, onToggleSave }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      layout
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      transition={{
        layout: { duration: 0.45, ease: EASE },
        duration: 0.5,
        ease: EASE,
        delay: reduced ? 0 : (index % 4) * 0.06,
      }}
      className="mb-4 inline-block w-full break-inside-avoid align-top sm:mb-5"
    >
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <button
          type="button"
          className={cx("block w-full text-left", FOCUS)}
          aria-label={`${p.title} — 매칭 ${p.match}%, ${p.gradeLabel}, ${comma(p.price)}원`}
        >
          <div className={cx("relative w-full overflow-hidden", p.aspect)}>
            <Image
              src={p.image}
              alt={p.alt}
              fill
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />

            {/* AI 매칭 근거 오버레이 — hover/focus 리빌 */}
            <div
              className={cx(
                "pointer-events-none absolute inset-0 flex flex-col justify-end gap-2 bg-gradient-to-t from-[#0B0B0F]/95 via-[#0B0B0F]/45 to-transparent p-3",
                "opacity-0 translate-y-1 transition-all duration-200 ease-out",
                "group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0",
              )}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#6E56CF] px-2 py-0.5 text-[11px] font-semibold text-white">
                  매칭 {p.match}%
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {p.grade}등급 · {p.gradeLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-2 py-0.5 text-[11px] font-semibold text-white">
                  <ShieldCheck className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                  인증 셀러
                </span>
              </div>
              <p className="text-[11px] font-normal leading-snug text-white/80">
                {p.reason}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-normal text-white/50 line-through">
                  {comma(p.original)}원
                </span>
                <span className="text-sm font-extrabold text-white">
                  {comma(p.price)}원
                </span>
                <span className="text-[11px] font-semibold text-[#a894f7]">
                  -{p.discount}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className={cx(CAPTION, "text-[#a894f7]")}>{p.tag}</span>
              <span className="truncate text-xs font-normal text-[#A1A1AA]">
                {p.brand}
              </span>
            </div>
            <h3 className="truncate text-sm font-semibold tracking-[-0.01em] text-white">
              {p.title}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-white">
                {comma(p.price)}원
              </span>
              <span className="text-[11px] font-normal text-[#A1A1AA] line-through">
                {comma(p.original)}원
              </span>
            </div>
          </div>
        </button>

        {/* 저장/찜 마이크로 인터랙션 — 카드 트리거와 형제(sibling) 요소, 중첩 인터랙티브 없음 */}
        <button
          type="button"
          onClick={() => onToggleSave(p.id)}
          aria-pressed={saved}
          aria-label={saved ? `${p.title} 찜 취소` : `${p.title} 찜하기`}
          className={cx(
            "absolute right-2.5 top-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-[#0B0B0F]/70 px-2.5 py-1.5 ring-1 ring-white/15 backdrop-blur-sm transition-colors duration-150 hover:bg-[#0B0B0F]/90",
            FOCUS,
          )}
        >
          <motion.span
            key={saved ? "on" : "off"}
            initial={reduced ? false : { scale: 1 }}
            animate={reduced ? { scale: 1 } : { scale: [1, 1.35, 1] }}
            transition={{ duration: 0.36, ease: EASE }}
            className="flex"
          >
            <Heart
              className={cx(
                "h-3.5 w-3.5",
                saved ? "fill-[#6E56CF] text-[#6E56CF]" : "text-white",
              )}
              strokeWidth={2}
              aria-hidden
            />
          </motion.span>
          <span className={cx(NUM, "text-[11px] font-semibold text-white")}>
            {comma(p.likesBase + (saved ? 1 : 0))}
          </span>
        </button>
      </div>
    </motion.div>
  );
}

export default memo(ProductCard);
