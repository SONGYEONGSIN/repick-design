"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import LiveConsole from "./LiveConsole";
import ProductShowcase from "./ProductShowcase";
import { EASE, STATS, VALUES, VIEWPORT, cx } from "../lib/data";

const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";

const CTA_GHOST =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:border-white/30 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]";

export default function ConsoleLandingClient() {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.1, delayChildren: 0.05 },
    },
  };
  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white antialiased">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#top"
            className="rounded text-base font-extrabold tracking-[-0.02em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]"
          >
            RE:픽
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a
              href="#showcase"
              className="rounded text-sm font-normal text-[#A1A1AA] transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]"
            >
              선별 결과
            </a>
            <a
              href="#how"
              className="rounded text-sm font-normal text-[#A1A1AA] transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] focus-visible:ring-[#6E56CF]"
            >
              작동 방식
            </a>
          </div>
          <a href="#cta" className={CTA_GHOST}>
            매칭 시작
          </a>
        </nav>
      </header>

      {/* hero */}
      <section id="top" className="mx-auto w-full max-w-[1120px] px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* left: editorial headline block */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 xl:col-span-5"
          >
            <motion.p
              variants={item}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#6E56CF]"
            >
              AI Resale Engine
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-5 font-extrabold leading-[0.98] tracking-[-0.02em] text-white text-[clamp(2.6rem,9vw,4.75rem)]"
            >
              검색하기 전에
              <br />
              <span className="text-[#6E56CF]">먼저 골라</span> 둡니다
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
            >
              찜과 스킵으로 취향을 학습한 AI가 수만 개의 중고 매물을 실시간으로
              스캔해, 지금 당신에게 맞는 것만 다시 골라드립니다.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#cta" className={CTA_PRIMARY}>
                무료로 매칭 받기
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
              <span className="text-xs font-normal text-[#A1A1AA]">
                설치 없이 웹에서 · 카드 등록 불필요
              </span>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-10 flex gap-8 border-t border-white/10 pt-6"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-extrabold tabular-nums tracking-[0.12em] text-white">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs font-normal text-[#A1A1AA]">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* right: live matching console */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: reduced ? 0 : 0.25 }}
            className="lg:col-span-6 xl:col-span-7"
          >
            <LiveConsole />
          </motion.div>
        </div>
      </section>

      {/* product showcase (rich matched cards) */}
      <ProductShowcase />

      {/* value — 3 split with ghost numbers */}
      <section
        id="how"
        className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8"
      >
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-12 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#6E56CF]"
        >
          Fig. 03 — 작동 방식
        </motion.p>

        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.index}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : i * 0.1 }}
                className="relative"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-6 right-0 select-none text-7xl font-extrabold leading-none tracking-[-0.02em] text-white/[0.05]"
                >
                  {v.index}
                </span>
                <Icon className="h-6 w-6 text-[#6E56CF]" strokeWidth={2} />
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.01em] text-white">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                  {v.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* social proof — pull quote */}
      <section className="border-y border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.figure
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            className="mx-auto max-w-3xl text-center"
          >
            <Quote className="mx-auto h-8 w-8 text-[#6E56CF]" strokeWidth={2} />
            <blockquote className="mt-6 text-2xl font-semibold leading-[1.4] tracking-[-0.01em] text-white sm:text-[1.75rem]">
              {"“"}찜만 300개 쌓아두던 제가, 이제는 열어보면 살 것만 있어요.
              스크롤하는 시간이 반의 반으로 줄었습니다.{"”"}
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">김도윤</span> · 프리랜서 디자이너
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* final CTA */}
      <section id="cta" className="mx-auto w-full max-w-[1120px] px-5 py-28 sm:px-8">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl"
        >
          <h2 className="font-extrabold leading-[1.02] tracking-[-0.02em] text-white text-[clamp(2.2rem,7vw,3.75rem)]">
            오늘도 검색으로
            <br />
            시작하시겠어요?
          </h2>
          <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
            취향 프로필을 만드는 데 1분이면 충분합니다. 그다음부터는 AI가 대신
            골라둡니다.
          </p>
          <div className="mt-9">
            <a href="#top" className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}>
              무료로 매칭 받기
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-2 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="text-base font-extrabold tracking-[-0.02em] text-white">
            RE:픽
          </span>
          <span className="text-xs font-normal text-[#A1A1AA]">
            AI가 다시 고르는 중고 · 2026 RE:PICK
          </span>
        </div>
      </footer>
    </main>
  );
}
