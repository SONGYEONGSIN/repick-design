"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, BadgeCheck, Move3d, ShieldCheck, Sparkles } from "lucide-react";
import Showcase from "./Showcase";
import {
  PRODUCTS,
  VALUES,
  PROOF,
  EASE,
  VIEWPORT,
  cx,
  comma,
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

// 제품 프리뷰 그리드에 노출할 매물 — 스포트라이트 필름스트립과 동일한 카탈로그를
// 다른 형태(정적 컴팩트 카드)로 재사용해 "AI가 여러 개를 골랐다"는 걸 증명한다.
const PREVIEW_PICKS = [PRODUCTS[1], PRODUCTS[3], PRODUCTS[5]];

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
            <a href="#preview" className={NAV_LINK}>
              매칭 근거
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
            className="lg:col-span-5"
          >
            <motion.p
              variants={item}
              className={cx(
                EYEBROW,
                "inline-flex items-center gap-2 text-[#a894f7]",
              )}
            >
              <Move3d className="h-3.5 w-3.5" aria-hidden />
              Fig. 01 — 스포트라이트 쇼케이스
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-5 font-extrabold leading-[1.0] tracking-[-0.02em] text-white break-keep text-[clamp(2.2rem,7.4vw,3rem)] lg:text-[clamp(2.8rem,4.2vw,4rem)]"
            >
              돌려보고,
              <br />
              <span className="text-[#6E56CF]">근거</span>까지 확인하세요
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
            >
              카드를 직접 기울여 살펴보듯, AI가 고른 매물의 매칭%·컨디션
              등급·인증 셀러·할인율을 언제나 정면에서 확인하세요. 필름스트립을
              넘기면 스포트라이트가 바로 다른 매물로 바뀝니다.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a href="#cta" className={CTA_PRIMARY}>
                내 취향으로 매칭 받기
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
              <span className="text-xs font-normal text-[#A1A1AA]">
                1분 취향 프로필 · 카드 등록 불필요
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

          {/* right: pointer-tilt spotlight showcase + filmstrip */}
          <div className="lg:col-span-7">
            <Showcase />
          </div>
        </div>
      </section>

      {/* product preview — static rich-card grid proving multiple AI matches */}
      <section id="preview" className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <p className={cx(EYEBROW, "text-[#a894f7]")}>
                Fig. 02 — 같이 매칭된 매물
              </p>
              <h2 className="mt-4 max-w-lg font-extrabold leading-[1.1] tracking-[-0.02em] text-white break-keep text-[clamp(1.7rem,4.4vw,2.4rem)]">
                스포트라이트 하나로 끝나지 않습니다
              </h2>
            </div>
            <p className="max-w-sm text-sm font-normal leading-[1.6] text-[#A1A1AA]">
              위 필름스트립에서 넘긴 매물마다 같은 기준 — 매칭%·컨디션 등급·인증
              셀러·할인율 — 로 근거가 남습니다.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {PREVIEW_PICKS.map((p, i) => (
              <motion.article
                key={p.id}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: reduced ? 0 : i * 0.1,
                }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F]"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#0B0B0F]/80 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
                    {p.grade}급
                  </span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#6E56CF] px-2.5 py-1 text-[0.7rem] font-semibold text-white">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    <span className={NUM}>{p.match}%</span>
                  </span>
                </div>
                <div className="flex flex-col gap-2.5 p-4">
                  <div>
                    <p className={cx(CAPTION, "text-[#A1A1AA]")}>{p.brand}</p>
                    <h3 className="mt-0.5 text-[0.95rem] font-semibold leading-snug text-white">
                      {p.title}
                    </h3>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 text-[0.75rem] font-semibold text-white">
                    <BadgeCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
                    {p.seller}
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-white/10 pt-2.5">
                    <span className={cx(NUM, "text-xs font-semibold text-white/40 line-through")}>
                      {comma(p.original)}원
                    </span>
                    <span className={cx(NUM, "text-base font-extrabold text-white")}>
                      {comma(p.price)}원
                    </span>
                    <span className={cx(NUM, "rounded-md bg-[#6E56CF]/20 px-1.5 py-0.5 text-[0.7rem] font-semibold text-[#a894f7]")}>
                      -{p.discount}%
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
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
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-white">
                    {v.title}
                  </h3>
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
              카드를 기울여 보는 순간 실물을 만지는 느낌이었어요. 필름스트립을
              넘길 때마다 근거가 그대로 따라와서 고민 없이 결제했습니다.
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">한지우</span> ·
              콘텐츠 기획자
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
              직접 돌려봤다면,
              <br />
              이제 내 취향으로 받을 차례입니다
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              취향 프로필을 만드는 데 1분이면 충분합니다. 그다음부터는 AI가
              골라 정돈한 매물만 스포트라이트로 확인하세요.
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
