"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Check, Target, TrendingDown } from "lucide-react";
import {
  EASE,
  PRODUCTS,
  VIEWPORT,
  comma,
  cx,
  type Product,
} from "../lib/data";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : index * 0.08 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {/* readability veil (single solid, no decorative gradient) */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0B0B0F]/70"
        />

        {/* top-left: condition grade + verified seller */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          <span
            className={cx(
              "rounded-md border px-1.5 py-0.5 text-[0.7rem] font-semibold backdrop-blur-sm",
              product.grade === "S"
                ? "border-[#6E56CF] bg-[#6E56CF]/20 text-white"
                : "border-white/25 bg-black/40 text-white",
            )}
          >
            {product.grade}등급
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/40 px-1.5 py-0.5 text-[0.7rem] font-semibold text-white backdrop-blur-sm">
            <BadgeCheck className="h-3 w-3 text-[#6E56CF]" strokeWidth={2} />
            인증 판매자
          </span>
        </div>

        {/* top-right: discount (before/after) */}
        <div className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-[#6E56CF] px-1.5 py-0.5 text-[0.7rem] font-extrabold text-white">
          <TrendingDown className="h-3 w-3" strokeWidth={2.5} />
          {product.discount}%
        </div>

        {/* bottom: match score */}
        <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-[#6E56CF]" strokeWidth={2} />
          <span className="text-xs font-semibold text-white">AI 매칭</span>
          <span className="text-sm font-extrabold tabular-nums text-white">
            {product.match}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
            {product.category}
          </p>
          <h3 className="mt-1 text-base font-semibold leading-snug text-white">
            {product.title}
          </h3>
          <p className="mt-0.5 text-xs font-normal text-[#A1A1AA]">
            {product.brand}
          </p>
        </div>

        {/* before / after price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-extrabold tabular-nums tracking-[-0.01em] text-white">
            {comma(product.price)}원
          </span>
          <span className="text-xs font-normal tabular-nums text-[#A1A1AA] line-through">
            {comma(product.original)}원
          </span>
        </div>

        {/* AI 매칭 근거 태그 */}
        <div className="mt-auto flex flex-wrap gap-1.5 border-t border-white/10 pt-3">
          {product.reasons.map((reason) => (
            <span
              key={reason}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[0.7rem] font-normal text-[#A1A1AA]"
            >
              <Check className="h-3 w-3 text-[#6E56CF]" strokeWidth={2.5} />
              {reason}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProductShowcase() {
  const reduced = useReducedMotion();
  return (
    <section
      id="showcase"
      className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8"
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-10 max-w-2xl"
      >
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#6E56CF]">
          Fig. 02 — 선별 결과
        </p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.02em] text-white sm:text-4xl">
          128,412개를 스캔해
          <br />
          당신에게 남긴 12개
        </h2>
        <p className="mt-4 text-base font-normal leading-[1.6] text-[#A1A1AA]">
          모든 카드에는 AI가 왜 골랐는지가 적혀 있습니다. 컨디션 등급, 인증 판매자,
          시세 대비 할인율까지 — 실물을 받기 전에 확인하세요.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
