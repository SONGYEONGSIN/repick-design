"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import SwipeDeck from "./SwipeDeck";
import {
  PREVIEW,
  VALUES,
  PROOF,
  EASE,
  VIEWPORT,
  cx,
  comma,
  withDiscount,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
} from "./data";

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
            <a href="#deck" className={NAV_LINK}>
              매물 둘러보기
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

      {/* hero — swipe deck */}
      <section
        id="top"
        className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-14 sm:px-8 sm:pt-20"
      >
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
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
              <Layers3 className="h-3.5 w-3.5" aria-hidden />
              Fig. 01 — 매칭 카드 스택
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-5 font-extrabold leading-[1.0] tracking-[-0.02em] text-white break-keep text-[clamp(2.2rem,7.4vw,3rem)] lg:text-[clamp(2.8rem,4.2vw,4rem)]"
            >
              넘길 때마다,
              <br />
              <span className="text-[#6E56CF]">취향</span>이 좁혀집니다
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
            >
              AI가 고른 매물을 카드로 넘겨보세요. 매칭률·컨디션 등급·판매자
              인증·할인율은 드래그하는 동안에도 늘 카드 정면에 있습니다.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a href="#cta" className={CTA_PRIMARY}>
                무료로 매칭 받기
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
              <span className="text-xs font-normal text-[#A1A1AA]">
                가입 없이 바로 확인 · 카드 5장 큐레이션
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

          {/* right: swipe deck */}
          <div id="deck" className="scroll-mt-24 lg:col-span-6">
            <SwipeDeck />
          </div>
        </div>
      </section>

      {/* product preview — static rich-card grid (different layout than hero stack) */}
      <section className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "block text-[#a894f7]")}
          >
            Fig. 02 — 오늘의 매칭 프리뷰
          </motion.p>
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-4 max-w-xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white break-keep text-[clamp(1.6rem,4.2vw,2.2rem)]"
          >
            카드 한 장 한 장, AI가 왜 골랐는지 근거까지 담았습니다
          </motion.h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {PREVIEW.map((p, i) => {
              const pct = withDiscount(p);
              const Icon = p.icon;
              return (
                <motion.article
                  key={p.id}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: reduced ? 0 : i * 0.08,
                  }}
                  className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F]"
                >
                  <div className="relative h-44 w-full shrink-0 overflow-hidden">
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      fill
                      sizes="(min-width: 1280px) 260px, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                    <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur">
                      {p.grade}급
                    </span>
                    <span className={cx(NUM, "absolute right-2.5 top-2.5 rounded-full border border-white/25 bg-black/40 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur")}>
                      {p.match}%
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <p className={cx(CAPTION, "flex items-center gap-1.5 text-[#A1A1AA]")}>
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                      {p.category}
                    </p>
                    <h3 className="text-[0.95rem] font-semibold leading-snug text-white">
                      {p.title}
                    </h3>
                    <p className="text-[0.72rem] font-normal text-[#A1A1AA]">{p.brand}</p>

                    <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                      <span className={cx(NUM, "text-xs font-semibold text-[#A1A1AA] line-through")}>
                        {comma(p.retail)}원
                      </span>
                      <span className={cx(NUM, "text-base font-extrabold text-white")}>
                        {comma(p.repick)}원
                      </span>
                      <span className={cx(NUM, "rounded bg-[#6E56CF] px-1.5 py-0.5 text-[0.65rem] font-semibold text-white")}>
                        -{pct}%
                      </span>
                    </div>

                    <span className="mt-1 inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-white">
                      <BadgeCheck className="h-3.5 w-3.5 text-[#a894f7]" aria-hidden />
                      {p.verifiedSeller}
                    </span>

                    <ul className="mt-1 flex flex-col gap-1">
                      {p.reasons.slice(0, 2).map((r) => (
                        <li key={r} className="flex items-center gap-1.5 text-[0.7rem] font-normal text-[#A1A1AA]">
                          <Check className="h-3 w-3 shrink-0 text-[#6E56CF]" strokeWidth={2.5} aria-hidden />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* value — 3 split with ghost numbers */}
      <section id="how" className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-12 block text-[#a894f7]")}
          >
            Fig. 03 — 카드를 넘길 때 일어나는 일
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
      <section className="border-t border-white/10 bg-white/[0.015]">
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
              카드를 넘길 때마다 매칭률이 바뀌는 걸 보고 진짜 저를 위해
              골라준다는 느낌을 처음 받았어요.
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">박지호</span> ·
              디자이너
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
              다음 카드엔,
              <br />더 잘 맞는 매물이 있습니다
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              취향 프로필을 만들면 카드 스택이 당신의 예산과 사이즈에 맞춰
              바로 재구성됩니다. 1분이면 충분합니다.
            </p>
            <div className="mt-9 flex items-center gap-3">
              <a
                href="#top"
                className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}
              >
                무료로 매칭 받기
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
              <span className="inline-flex items-center gap-1.5 text-xs font-normal text-[#A1A1AA]">
                <ShieldCheck className="h-4 w-4 text-[#6E56CF]" aria-hidden />
                전문 검수팀 실측 완료 매물만 매칭
              </span>
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
