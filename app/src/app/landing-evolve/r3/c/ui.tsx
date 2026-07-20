"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Calculator as CalculatorIcon } from "lucide-react";
import Calculator from "./Calculator";
import { VALUES, PROOF, EASE, VIEWPORT, cx, EYEBROW, FOCUS } from "./data";

const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] " +
  FOCUS;

const NAV_LINK =
  "rounded text-sm font-normal text-[#A1A1AA] transition-colors duration-150 hover:text-white " +
  FOCUS;

export default function LandingClient() {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: 0.04 },
    },
  };
  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#0B0B0F] text-white antialiased">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#top"
            className={cx(
              "rounded text-base font-extrabold tracking-[-0.02em] text-white",
              FOCUS,
            )}
          >
            RE:픽
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a href="#calculator" className={NAV_LINK}>
              절약 계산기
            </a>
            <a href="#how" className={NAV_LINK}>
              작동 방식
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            매칭 시작
          </a>
        </nav>
      </header>

      {/* hero */}
      <section
        id="top"
        className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-14 sm:px-8 sm:pt-20"
      >
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* left: editorial headline */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-6"
          >
            <motion.p
              variants={item}
              className={cx(
                EYEBROW,
                "inline-flex items-center gap-2 text-[#a894f7]",
              )}
            >
              <CalculatorIcon className="h-3.5 w-3.5" aria-hidden />
              Fig. 01 — 절약 계산기
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-5 font-extrabold leading-[1.0] tracking-[-0.02em] text-white break-keep text-[clamp(2.2rem,7.4vw,3rem)] lg:text-[clamp(2.8rem,4.2vw,4rem)]"
            >
              얼마나 아끼는지,
              <br />
              <span className="text-[#6E56CF]">숫자</span>로 보여드립니다
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
            >
              카테고리와 예산만 고르면 매장 신품가와 repick AI 매칭가를 바로
              대조해 드립니다. 짐작이 아니라 계산입니다 — 우측 계산기를 직접
              움직여 보세요.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a href="#calculator" className={CTA_PRIMARY}>
                내 절약액 계산하기
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
              <span className="text-xs font-normal text-[#A1A1AA]">
                가입 없이 바로 확인 · 1분 소요
              </span>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-10 flex gap-8 border-t border-white/10 pt-6"
            >
              {PROOF.map((s) => (
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

          {/* right: interactive savings calculator */}
          <div id="calculator" className="scroll-mt-24 lg:col-span-6">
            <Calculator />
          </div>
        </div>
      </section>

      {/* value — 3 split with ghost numbers */}
      <section id="how" className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-12 block text-[#a894f7]")}
          >
            Fig. 02 — 계산기가 하는 일
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
                  transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: reduced ? 0 : i * 0.1,
                  }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-6 right-0 select-none text-7xl font-extrabold leading-none tracking-[-0.02em] text-white/[0.05]"
                  >
                    {v.index}
                  </span>
                  <Icon
                    className="h-6 w-6 text-[#6E56CF]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-white">
                    {v.title}
                  </h2>
                  <p className="mt-3 text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                    {v.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* social proof — stat band + pull quote */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            className="grid grid-cols-1 gap-8 border-b border-white/10 pb-16 sm:grid-cols-3"
          >
            {PROOF.map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold tabular-nums tracking-[-0.02em] text-white sm:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm font-normal text-[#A1A1AA]">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.figure
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-16 max-w-3xl"
          >
            <span
              aria-hidden
              className="text-6xl font-extrabold leading-none text-[#6E56CF]"
            >
              {"“"}
            </span>
            <blockquote className="mt-2 text-2xl font-semibold leading-[1.4] tracking-[-0.02em] text-white sm:text-[1.75rem]">
              슬라이더를 조금만 움직였는데 절약액이 22만원이나 뛰더라고요.
              말보다 숫자가 훨씬 설득력 있었습니다.
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">이서현</span> ·
              마케터
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* final CTA */}
      <section id="cta" className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-28 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-2xl"
          >
            <h2 className="font-extrabold leading-[1.02] tracking-[-0.02em] text-white break-keep text-[clamp(2.1rem,6.4vw,3.6rem)]">
              계산은 끝났습니다,
              <br />
              이제 매칭만 받으면 됩니다
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              위 계산기에서 확인한 절약액은 실제 거래된 시세를 기준으로
              산출됩니다. 취향 프로필을 만드는 데 1분이면 충분합니다.
            </p>
            <div className="mt-9">
              <a
                href="#top"
                className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}
              >
                무료로 매칭 받기
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
            </div>
          </motion.div>
        </div>
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
