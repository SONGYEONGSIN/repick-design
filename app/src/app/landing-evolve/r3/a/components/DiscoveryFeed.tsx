"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "./ProductCard";
import {
  PRODUCTS,
  FILTERS,
  SORTS,
  cx,
  EASE,
  VIEWPORT,
  EYEBROW,
  FOCUS,
  type SortId,
} from "../data";

const CHIP_BASE =
  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-150";
const CHIP_OFF = "border-white/15 text-[#A1A1AA] hover:border-white/30 hover:text-white";
const CHIP_ON = "border-[#6E56CF] bg-[#6E56CF] text-white";

const SORT_BASE =
  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150";
const SORT_OFF = "text-[#A1A1AA] hover:text-white";
const SORT_ON = "bg-white/10 text-white";

export default function DiscoveryFeed() {
  const reduced = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("전체");
  const [sortId, setSortId] = useState<SortId>("match");
  const [saved, setSaved] = useState<Set<string>>(() => new Set());

  const toggleSave = useCallback((id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const visible = useMemo(() => {
    const filtered =
      activeFilter === "전체" ? PRODUCTS : PRODUCTS.filter((p) => p.tag === activeFilter);
    const sorted = [...filtered].sort((a, b) =>
      sortId === "match" ? b.match - a.match : b.discount - a.discount,
    );
    return sorted;
  }, [activeFilter, sortId]);

  return (
    <section id="feed" className="relative">
      <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className={cx(EYEBROW, "text-[#a894f7]")}>Fig. 01 — 라이브 피드</p>
            <h2 className="mt-3 font-extrabold leading-[1.05] tracking-[-0.02em] text-white text-[clamp(1.4rem,3.2vw,1.9rem)]">
              지금 매칭되는 {visible.length}개 매물
            </h2>
          </div>

          {/* 정렬 토글 — 세그먼트 컨트롤 (칩과 다른 상호작용 문법) */}
          <div
            role="group"
            aria-label="정렬 기준"
            className="flex items-center gap-1 self-start rounded-full border border-white/10 bg-white/[0.03] p-1 sm:self-auto"
          >
            <SlidersHorizontal
              className="ml-2 h-3.5 w-3.5 shrink-0 text-[#A1A1AA]"
              strokeWidth={2}
              aria-hidden
            />
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={sortId === s.id}
                onClick={() => setSortId(s.id)}
                className={cx(SORT_BASE, sortId === s.id ? SORT_ON : SORT_OFF, FOCUS)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 필터 칩 바 — 클릭 시 그리드 FLIP 리플로우 */}
        <div
          role="group"
          aria-label="무드 카테고리 필터"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-6 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={activeFilter === f}
              onClick={() => setActiveFilter(f)}
              className={cx(CHIP_BASE, activeFilter === f ? CHIP_ON : CHIP_OFF, FOCUS)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 매서너리 피드 — 비정형 그리드, framer-motion layout으로 결정론적 FLIP */}
        <div className="columns-2 gap-4 pb-20 sm:gap-5 md:columns-3 xl:columns-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                saved={saved.has(p.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <p className="pb-20 text-sm font-normal text-[#A1A1AA]">
            선택한 무드에 맞는 매물이 아직 없습니다.
          </p>
        )}
      </div>
    </section>
  );
}
