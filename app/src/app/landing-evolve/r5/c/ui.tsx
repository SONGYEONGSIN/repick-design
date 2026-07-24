"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, BadgeCheck, Check, ChevronDown, Search } from "lucide-react";
import IndexPanel from "./IndexPanel";
import {
  VALUES,
  PROOF,
  PREVIEW_PICKS,
  PREVIEW_DETAIL,
  LISTINGS,
  discountPct,
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

function PreviewCard({ listingId, matchOverall, tags, delay, reduced }: {
  listingId: string;
  matchOverall: number;
  tags: [string, string];
  delay: number;
  reduced: boolean | null;
}) {
  const [open, setOpen] = useState(false);
  const listing = LISTINGS[listingId];
  const discount = discountPct(listing);
  const panelId = `preview-detail-${listingId}`;

  return (
    <motion.figure
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : delay }}
      className="m-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F]"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={listing.image.src}
          alt={listing.image.alt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
          {listing.grade}급 · {listing.gradeLabel}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
          <span className={NUM}>매칭 {matchOverall}%</span>
        </span>
      </div>
      <figcaption className="flex flex-col gap-2.5 p-5">
        <div>
          <p className={cx(CAPTION, "text-[#A1A1AA]")}>{listing.brand}</p>
          <h3 className="mt-0.5 text-base font-semibold leading-snug text-white">{listing.title}</h3>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className={cx(NUM, "text-sm font-semibold text-[#A1A1AA] line-through")}>
            {comma(listing.retail)}원
          </span>
          <span className={cx(NUM, "text-lg font-extrabold text-white")}>{comma(listing.repick)}원</span>
          <span className={cx(NUM, "rounded-md bg-[#6E56CF] px-2 py-0.5 text-xs font-semibold text-white")}>
            -{discount}%
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-white">
          <BadgeCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
          {listing.seller}
          <span className="font-normal text-[#A1A1AA]">· {listing.sellerMeta}</span>
        </span>
        <ul className="flex flex-col gap-1">
          {tags.map((t) => (
            <li key={t} className="flex items-center gap-1.5 text-[0.75rem] font-normal text-[#A1A1AA]">
              <Check className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" strokeWidth={2.5} aria-hidden />
              {t}
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={cx(
            "mt-1 inline-flex min-h-[36px] items-center gap-1 self-start rounded-md py-2 text-[0.75rem] font-semibold text-[#a894f7] transition-colors duration-150 hover:text-white",
            FOCUS,
          )}
        >
          AI 매칭 근거 더보기
          <ChevronDown
            className={cx("h-3.5 w-3.5 transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
            aria-hidden
          />
        </button>
        <div
          id={panelId}
          className={cx(
            "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <p className="pt-1 text-[0.75rem] font-normal leading-[1.6] text-[#A1A1AA]">
              {PREVIEW_DETAIL[listingId]}
            </p>
          </div>
        </div>
      </figcaption>
    </motion.figure>
  );
}

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
          <a href="#top" className={cx("rounded text-base font-extrabold tracking-[-0.02em] text-white", FOCUS)}>
            RE:픽
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a href="#index" className={NAV_LINK}>
              라이브 인덱스
            </a>
            <a href="#preview" className={NAV_LINK}>
              이번 주 하이라이트
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            매칭 시작
          </a>
        </nav>
      </header>

      {/* hero */}
      <section id="top" className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          {/* left: editorial headline */}
          <motion.div variants={container} initial="hidden" animate="show" className="lg:col-span-5">
            <motion.p variants={item} className={cx(EYEBROW, "inline-flex items-center gap-2 text-[#a894f7]")}>
              <Search className="h-3.5 w-3.5" aria-hidden />
              라이브 매칭 인덱스
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-5 font-extrabold leading-[1.02] tracking-[-0.02em] text-white break-keep text-[clamp(2.2rem,7.4vw,3rem)] lg:text-[clamp(2.6rem,4vw,3.6rem)]"
            >
              조건을 고르면
              <br />
              <span className="text-[#6E56CF]">인덱스가 다시</span> 계산됩니다
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-md text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg">
              빈티지 자켓, 정품 스니커즈, 니트 컨디션까지 — 조건 칩 하나로 매칭 근거·AI
              매칭%·컨디션 등급·인증 판매자·before/after 할인율이 그 자리에서
              재계산됩니다.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#index" className={CTA_PRIMARY}>
                조건 칩 눌러보기
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
              <span className="text-xs font-normal text-[#A1A1AA]">
                가입 없이 바로 확인 · 칩을 누르면 인덱스가 재계산됩니다
              </span>
            </motion.div>

            <motion.div variants={item} className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-6">
              {PROOF.map((s) => (
                <div key={s.label}>
                  <div className="text-xl font-extrabold tabular-nums tracking-[0.12em] text-white">{s.value}</div>
                  <div className="mt-1 text-xs font-normal text-[#A1A1AA]">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* right: live filtering product index */}
          <div id="index" className="scroll-mt-24 lg:col-span-7">
            <IndexPanel />
          </div>
        </div>
      </section>

      {/* product preview — always-visible proof cards (no hover-gated reveal) */}
      <section id="preview" className="border-t border-white/10 bg-white/[0.015] scroll-mt-24">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "text-[#a894f7]")}
          >
            Fig. 02 — 이번 주 AI 추천 하이라이트
          </motion.p>
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-4 max-w-xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white break-keep text-[clamp(1.7rem,4.4vw,2.4rem)]"
          >
            인덱스 밖에서도 같은 기준으로 증명합니다
          </motion.h2>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PREVIEW_PICKS.map((p, i) => (
              <PreviewCard
                key={p.listingId}
                listingId={p.listingId}
                matchOverall={p.matchOverall}
                tags={p.tags}
                delay={i * 0.1}
                reduced={reduced}
              />
            ))}
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
            Fig. 03 — 인덱스가 하는 일
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
                <div className="mt-2 text-sm font-normal text-[#A1A1AA]">{s.label}</div>
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
            <span aria-hidden className="text-6xl font-extrabold leading-none text-[#6E56CF]">
              {"“"}
            </span>
            <blockquote className="mt-2 text-2xl font-semibold leading-[1.4] tracking-[-0.02em] text-white sm:text-[1.75rem]">
              검색어 대신 조건 칩을 눌렀을 뿐인데 순위표 전체가 다시 계산되더라고요. 근거가 바로
              보이니 믿고 눌렀습니다.
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">오세훈</span> · 프로덕트 매니저
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
              검색은 끝났습니다,
              <br />
              이제 매칭만 받으면 됩니다
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              위 인덱스에서 확인한 매칭 근거·등급·인증·할인율은 실제 검수·거래 데이터를
              기준으로 산출됩니다. 취향 프로필을 만드는 데 1분이면 충분합니다.
            </p>
            <div className="mt-9">
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
