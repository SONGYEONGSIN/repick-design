"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpDown, BadgeCheck, Check, Shirt } from "lucide-react";
import WardrobeRail from "./WardrobeRail";
import {
  VALUES,
  PROOF,
  CURATED_ITEMS,
  AUDIENCE_PROOF,
  EASE,
  VIEWPORT,
  cx,
  comma,
  discountPct,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
  type Audience,
} from "./data";

const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] " +
  FOCUS;

const NAV_LINK =
  "rounded text-sm font-normal text-[#A1A1AA] transition-colors duration-150 hover:text-white " +
  FOCUS;

const TOGGLE_BTN =
  "rounded-full px-4 py-2 text-[0.78rem] font-semibold transition-colors duration-150 " + FOCUS;

type SortKey = "match" | "discount";

export default function LandingClient() {
  const reduced = useReducedMotion();
  const [sortBy, setSortBy] = useState<SortKey>("match");
  const [audience, setAudience] = useState<Audience>("buyer");

  const sortedPreview = useMemo(() => {
    const arr = [...CURATED_ITEMS];
    arr.sort((a, b) =>
      sortBy === "match"
        ? b.match - a.match
        : discountPct(b.retail, b.repick) - discountPct(a.retail, a.repick),
    );
    return arr;
  }, [sortBy]);

  const proof = AUDIENCE_PROOF[audience];

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
          <a href="#top" className={cx("rounded text-base font-extrabold tracking-[-0.02em] text-white", FOCUS)}>
            RE:픽
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a href="#rail" className={NAV_LINK}>
              옷장 레일
            </a>
            <a href="#preview" className={NAV_LINK}>
              큐레이션 캡슐
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            매칭 시작
          </a>
        </nav>
      </header>

      {/* hero */}
      <section id="top" className="mx-auto w-full max-w-[1120px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
        <motion.div variants={container} initial="hidden" animate="show" className="max-w-2xl">
          <motion.p variants={item} className={cx(EYEBROW, "inline-flex items-center gap-2 text-[#a894f7]")}>
            <Shirt className="h-3.5 w-3.5" aria-hidden />
            일반 옷장 → AI 큐레이션 캡슐
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-5 font-extrabold leading-[1.02] tracking-[-0.02em] text-white break-keep text-[clamp(2.2rem,7.4vw,3rem)] lg:text-[clamp(2.6rem,4vw,3.6rem)]"
          >
            뒤섞인 옷장을,
            <br />
            <span className="text-[#6E56CF]">AI가 다시</span> 겁니다
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg">
            아래 레일을 손끝으로 밀어보세요. 정보가 빈약한 일반 매물 구간이, 매칭%·컨디션
            등급·인증 배지가 상시 노출되는 AI 큐레이션 캡슐 구간으로 바뀝니다.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#rail" className={CTA_PRIMARY}>
              레일 밀어보기
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </a>
            <span className="text-xs font-normal text-[#A1A1AA]">가입 없이 바로 확인 · 드래그 또는 화살표 키</span>
          </motion.div>

          <motion.div variants={item} className="mt-10 flex gap-8 border-t border-white/10 pt-6">
            {PROOF.map((s) => (
              <div key={s.label}>
                <div className="text-xl font-extrabold tabular-nums tracking-[0.12em] text-white">{s.value}</div>
                <div className="mt-1 text-xs font-normal text-[#A1A1AA]">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div id="rail" className="mt-14 scroll-mt-24">
          <WardrobeRail />
        </div>
      </section>

      {/* product preview — 항상 노출 증명 카드, 정렬 토글로 순위 재계산 */}
      <section id="preview" className="border-t border-white/10 bg-white/[0.015] scroll-mt-24">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE }}
                className={cx(EYEBROW, "text-[#a894f7]")}
              >
                Fig. 02 — AI 큐레이션 캡슐
              </motion.p>
              <motion.h2
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.05 }}
                className="mt-4 max-w-xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white break-keep text-[clamp(1.7rem,4.4vw,2.4rem)]"
              >
                정렬 기준을 바꾸면 순위가 다시 계산됩니다
              </motion.h2>
            </div>

            <div role="group" aria-label="정렬 기준 선택" className="inline-flex shrink-0 rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                aria-pressed={sortBy === "match"}
                onClick={() => setSortBy("match")}
                className={cx(TOGGLE_BTN, sortBy === "match" ? "bg-[#6E56CF] text-white" : "text-[#A1A1AA] hover:text-white")}
              >
                매칭 정확도순
              </button>
              <button
                type="button"
                aria-pressed={sortBy === "discount"}
                onClick={() => setSortBy("discount")}
                className={cx(TOGGLE_BTN, sortBy === "discount" ? "bg-[#6E56CF] text-white" : "text-[#A1A1AA] hover:text-white")}
              >
                할인율순
              </button>
            </div>
          </div>

          <p aria-live="polite" className="sr-only">
            {sortBy === "match" ? "매칭 정확도순으로 정렬됨" : "할인율순으로 정렬됨"}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {sortedPreview.map((card, i) => {
              const pct = discountPct(card.retail, card.repick);
              return (
                <motion.figure
                  key={card.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : i * 0.08 }}
                  className="m-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F]"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={card.image.src}
                      alt={card.image.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
                      {card.grade}급 · {card.gradeLabel}
                    </span>
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
                      <span className={NUM}>매칭 {card.match}%</span>
                    </span>
                    <span className={cx(NUM, "absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[0.68rem] font-semibold text-white backdrop-blur")}>
                      {sortBy === "match" ? "매칭" : "할인"} {i + 1}위
                    </span>
                  </div>
                  <figcaption className="flex flex-col gap-2.5 p-5">
                    <div>
                      <p className={cx(CAPTION, "text-[#A1A1AA]")}>{card.brand}</p>
                      <h3 className="mt-0.5 text-base font-semibold leading-snug text-white">{card.title}</h3>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className={cx(NUM, "text-sm font-semibold text-[#A1A1AA] line-through")}>
                        {comma(card.retail)}원
                      </span>
                      <span className={cx(NUM, "text-lg font-extrabold text-white")}>{comma(card.repick)}원</span>
                      <span className={cx(NUM, "rounded-md bg-[#6E56CF] px-2 py-0.5 text-xs font-semibold text-white")}>
                        -{pct}%
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-white">
                      <BadgeCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
                      {card.seller}
                    </span>
                    <ul className="flex flex-col gap-1">
                      {card.tags.map((t) => (
                        <li key={t} className="flex items-center gap-1.5 text-[0.75rem] font-normal text-[#A1A1AA]">
                          <Check className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" strokeWidth={2.5} aria-hidden />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* value — 3 split with ghost numbers */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-12 block text-[#a894f7]")}
          >
            Fig. 03 — 레일이 하는 일
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
                  <Icon className="h-6 w-6 text-[#6E56CF]" strokeWidth={2} aria-hidden />
                  <h2 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-white">{v.title}</h2>
                  <p className="mt-3 text-sm font-normal leading-[1.6] text-[#A1A1AA]">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* social proof — 구매자/판매자 토글 + 스탯밴드 + 인용구 */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-8">
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, ease: EASE }}
              className={cx(EYEBROW, "text-[#a894f7]")}
            >
              Fig. 04 — 실제로 겪은 사람들
            </motion.p>

            <div role="group" aria-label="후기 보기 기준" className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                aria-pressed={audience === "buyer"}
                onClick={() => setAudience("buyer")}
                className={cx(TOGGLE_BTN, audience === "buyer" ? "bg-[#6E56CF] text-white" : "text-[#A1A1AA] hover:text-white")}
              >
                구매자 후기
              </button>
              <button
                type="button"
                aria-pressed={audience === "seller"}
                onClick={() => setAudience("seller")}
                className={cx(TOGGLE_BTN, audience === "seller" ? "bg-[#6E56CF] text-white" : "text-[#A1A1AA] hover:text-white")}
              >
                판매자 후기
              </button>
            </div>
          </div>

          <p aria-live="polite" className="sr-only">
            {audience === "buyer" ? "구매자 후기로 전환됨" : "판매자 후기로 전환됨"}
          </p>

          <motion.div
            key={`stats-${audience}`}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="grid grid-cols-1 gap-8 pb-16 pt-10 sm:grid-cols-3"
          >
            {proof.stats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold tabular-nums tracking-[-0.02em] text-white sm:text-5xl">{s.value}</div>
                <div className="mt-2 text-sm font-normal text-[#A1A1AA]">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.figure
            key={`quote-${audience}`}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="max-w-3xl"
          >
            <span aria-hidden className="text-6xl font-extrabold leading-none text-[#6E56CF]">
              {"“"}
            </span>
            <blockquote className="mt-2 text-2xl font-semibold leading-[1.4] tracking-[-0.02em] text-white sm:text-[1.75rem]">
              {proof.quote}
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">{proof.authorName}</span> · {proof.authorMeta}
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
              옷장은 정리했습니다,
              <br />
              이제 레일을 넘기기만 하면 됩니다
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              위 레일에서 확인한 매칭%·컨디션 등급·인증 배지·할인율은 실제 검수·거래
              데이터를 기준으로 산출됩니다. 취향 프로필을 만드는 데 1분이면 충분합니다.
            </p>
            <div className="mt-9 flex items-center gap-2">
              <ArrowUpDown className="hidden h-5 w-5 text-[#6E56CF] sm:block" aria-hidden />
              <a href="#top" className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}>
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
          <span className="text-base font-extrabold tracking-[-0.02em] text-white">RE:픽</span>
          <span className="text-xs font-normal text-[#A1A1AA]">AI가 다시 고르는 중고 · 2026 RE:PICK</span>
        </div>
      </footer>
    </main>
  );
}
