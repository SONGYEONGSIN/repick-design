"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Radar } from "lucide-react";
import {
  EASE,
  PRODUCTS,
  SCAN_FILTERS,
  TOTAL_MATCHED,
  TOTAL_SCANNED,
  comma,
  cx,
  type Grade,
} from "../lib/data";

const CYCLE_MS = 1500;

function gradeClass(g: Grade) {
  return g === "S"
    ? "border-[#6E56CF] text-[#6E56CF]"
    : "border-white/20 text-white";
}

export default function LiveConsole() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setStep((s) => s + 1), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduced]);

  // deterministic sequential playback — seed-free, no runtime randomness
  const activeProduct = step % PRODUCTS.length;
  const activeFilter = step % SCAN_FILTERS.length;
  const filter = SCAN_FILTERS[activeFilter];
  const progress = ((activeProduct + 1) / PRODUCTS.length) * 100;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3 backdrop-blur-sm sm:p-4">
      {/* Fig caption */}
      <p className="mb-3 px-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
        Fig. 01 — 실시간 매칭 콘솔
      </p>

      {/* header bar */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            {!reduced ? (
              <motion.span
                aria-hidden
                className="absolute inline-flex h-full w-full rounded-full bg-[#6E56CF]"
                animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.2, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              />
            ) : null}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6E56CF]" />
          </span>
          <Radar className="h-4 w-4 shrink-0 text-[#6E56CF]" strokeWidth={2} />
          <span className="truncate text-xs font-semibold tracking-[0.12em] text-white">
            매칭 엔진 · LIVE
          </span>
        </div>
        <span className="shrink-0 text-xs font-normal tabular-nums text-[#A1A1AA]">
          {comma(TOTAL_SCANNED)} 스캔
        </span>
      </div>

      {/* progress rail */}
      <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-[#6E56CF]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>

      {/* active filter criteria */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {SCAN_FILTERS.map((f, i) => {
          const on = i === activeFilter;
          const Icon = f.icon;
          return (
            <span
              key={f.id}
              className={cx(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold transition-colors duration-300",
                on
                  ? "border-[#6E56CF] bg-[#6E56CF]/15 text-white"
                  : "border-white/10 text-[#A1A1AA]",
              )}
            >
              <Icon
                className={cx("h-3 w-3", on ? "text-[#6E56CF]" : "text-[#A1A1AA]")}
                strokeWidth={2}
              />
              {f.label}
            </span>
          );
        })}
      </div>
      <div className="mt-2 min-h-[1.25rem] px-0.5">
        <AnimatePresence mode="wait">
          <motion.p
            key={filter.id}
            initial={reduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="text-xs font-normal text-[#A1A1AA]"
          >
            <span className="font-semibold text-white">기준 적용</span>
            {" · "}
            {filter.detail}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* scan feed */}
      <div className="mt-3 flex flex-col gap-1.5">
        {PRODUCTS.map((p, i) => {
          const active = i === activeProduct;
          return (
            <div
              key={p.id}
              className={cx(
                "relative flex items-center gap-3 overflow-hidden rounded-xl border px-2.5 py-2 transition-colors duration-300",
                active
                  ? "border-[#6E56CF]/60 bg-[#6E56CF]/[0.08]"
                  : "border-white/10 bg-white/[0.01]",
              )}
            >
              {/* scanner beam */}
              {active && !reduced ? (
                <motion.span
                  key={step}
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 w-px bg-[#6E56CF] shadow-[0_0_14px_2px_#6E56CF]"
                  initial={{ left: "0%", opacity: 0 }}
                  animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.1, ease: "linear" }}
                />
              ) : null}

              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-white">
                    {p.title}
                  </span>
                  <span
                    className={cx(
                      "shrink-0 rounded border px-1 text-[0.65rem] font-semibold leading-tight",
                      gradeClass(p.grade),
                    )}
                  >
                    {p.grade}
                  </span>
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={cx(
                      "h-full rounded-full",
                      active ? "bg-[#6E56CF]" : "bg-white/25",
                    )}
                    initial={false}
                    animate={{ width: `${p.match}%` }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div
                  className={cx(
                    "text-base font-extrabold tabular-nums leading-none transition-colors duration-300",
                    active ? "text-[#6E56CF]" : "text-white",
                  )}
                >
                  {p.match}
                </div>
                <div className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                  매칭
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* footer */}
      <div className="mt-3 flex items-center justify-between border-t border-white/10 px-1 pt-3">
        <span className="text-xs font-normal text-[#A1A1AA]">
          <span className="font-semibold text-white tabular-nums">{TOTAL_MATCHED}개</span>{" "}
          매칭 완료
        </span>
        <a
          href="#showcase"
          className="inline-flex items-center gap-1 rounded-full text-xs font-semibold text-white transition-colors duration-150 hover:text-[#6E56CF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]"
        >
          선별 결과 보기
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}
