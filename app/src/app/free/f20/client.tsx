"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Compass,
  Leaf,
  Send,
  ScrollText,
} from "lucide-react";
import "./f20.css";

/* -------------------------------------------------------------------------
 * Reduced-motion detection — matchMedia + useSyncExternalStore directly
 * (not framer-motion's own useReducedMotion, which can miss the OS setting
 * in some environments). Server snapshot defaults to `false`, and every
 * reveal below animates `y` only — never `opacity` — so content can never
 * end up permanently invisible even if this hook is ever wrong.
 * ---------------------------------------------------------------------- */
function subscribe(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getServerSnapshot() {
  return false;
}
function useReducedMotionSafe() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function riseIn(reduced: boolean, delay = 0) {
  return {
    initial: { y: reduced ? 0 : 26 },
    whileInView: { y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: {
      duration: reduced ? 0 : 0.65,
      delay: reduced ? 0 : delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  };
}

/* -------------------------------------------------------------------------
 * Data — invented product/brand, no external references.
 * ---------------------------------------------------------------------- */
const NAV = [
  { label: "표본 도감", href: "#catalog" },
  { label: "채집 과정", href: "#process" },
  { label: "회원제", href: "#membership" },
  { label: "표본실 등록", href: "#register" },
];

type Specimen = {
  id: string;
  latin: string;
  name: string;
  family: string;
  habitat: string;
  note: string;
  price: string;
  image: { src: string; alt: string };
};

const SPECIMENS: Specimen[] = [
  {
    id: "001",
    latin: "Prunus serrulata",
    name: "왕벚나무",
    family: "장미과 Rosaceae",
    habitat: "제주 서귀포, 해발 120m",
    note: "화이트머스크 베이스에 담수 벚꽃 노트를 얹은 첫봄의 기록",
    price: "68,000",
    image: {
      src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&auto=format&fit=crop&w=1200",
      alt: "연분홍 벚꽃이 가지 가득 피어난 클로즈업",
    },
  },
  {
    id: "002",
    latin: "Helianthus annuus",
    name: "해바라기",
    family: "국화과 Asteraceae",
    habitat: "경북 영천, 노지 재배지",
    note: "그린 스템과 밀랍 노트로 완성한 한여름 정오의 기록",
    price: "68,000",
    image: {
      src: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?q=80&auto=format&fit=crop&w=1200",
      alt: "노란 해바라기 꽃송이가 만개해 태양을 향해 있는 모습",
    },
  },
  {
    id: "003",
    latin: "Paeonia lactiflora",
    name: "작약",
    family: "작약과 Paeoniaceae",
    habitat: "전남 담양, 재배 온실",
    note: "핑크페퍼와 겹겹의 꽃잎 노트가 만드는 늦봄의 기록",
    price: "72,000",
    image: {
      src: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&auto=format&fit=crop&w=1200",
      alt: "연분홍빛 작약 꽃잎이 겹겹이 펼쳐진 매크로 사진",
    },
  },
  {
    id: "004",
    latin: "Hedera helix",
    name: "송악",
    family: "두릅나무과 Araliaceae",
    habitat: "전남 완도, 해안 상록수림",
    note: "이슬 맺힌 잎맥을 닮은 그린 갈바넘 노트의 기록",
    price: "64,000",
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&auto=format&fit=crop&w=1200",
      alt: "이슬방울이 맺힌 초록 잎사귀 클로즈업",
    },
  },
  {
    id: "005",
    latin: "Monstera deliciosa",
    name: "몬스테라",
    family: "천남성과 Araceae",
    habitat: "온실 재배, 서울 마포 표본실",
    note: "우거진 잎그늘의 습기와 무화과 노트를 담은 기록",
    price: "68,000",
    image: {
      src: "https://images.unsplash.com/photo-1490718720478-364a07a997e1?q=80&auto=format&fit=crop&w=1200",
      alt: "위에서 내려다본 짙은 초록 잎사귀들",
    },
  },
  {
    id: "006",
    latin: "Quercus mongolica",
    name: "신갈나무",
    family: "참나무과 Fagaceae",
    habitat: "강원 평창, 해발 820m 활엽수림",
    note: "젖은 낙엽과 이끼, 오크모스 베이스의 늦가을 기록",
    price: "76,000",
    image: {
      src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&auto=format&fit=crop&w=1200",
      alt: "울창한 활엽수림을 아래에서 올려다본 모습",
    },
  },
];

const PROCESS = [
  {
    icon: Compass,
    num: "01",
    title: "채집",
    desc: "매달 초, 조향사와 식물학자가 함께 그 계절을 가장 잘 나타내는 식물 한 종을 현장에서 채집합니다.",
  },
  {
    icon: Leaf,
    num: "02",
    title: "압화",
    desc: "채집한 식물의 형태를 압화 표본으로 기록하고, 향의 구조를 노트별로 해체해 다시 조합합니다.",
  },
  {
    icon: Send,
    num: "03",
    title: "발송",
    desc: "완성된 향수와 압화 표본 카드, 손으로 쓴 채집 노트를 함께 봉인해 회원의 표본실로 발송합니다.",
  },
];

type Tier = {
  name: string;
  kr: string;
  price: string;
  features: string[];
  cta: string;
  highlighted: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Botanist",
    kr: "입문",
    price: "38,000",
    features: ["미니어처 표본 1병 (5ml)", "디지털 도감 열람", "채집 노트 PDF"],
    cta: "입문 회원 시작하기",
    highlighted: false,
  },
  {
    name: "Naturalist",
    kr: "추천",
    price: "68,000",
    features: [
      "정식 표본 1병 (30ml)",
      "압화 표본 카드 실물 동봉",
      "다음 시즌 우선 예약",
      "표본실 전용 뉴스레터",
    ],
    cta: "추천 회원 시작하기",
    highlighted: true,
  },
  {
    name: "Curator",
    kr: "아카이브",
    price: "128,000",
    features: [
      "표본 2종 (각 30ml)",
      "연 1회 한정판 아카이브 박스",
      "채집 여행 초청",
      "전담 큐레이터 상담",
    ],
    cta: "아카이브 회원 문의하기",
    highlighted: false,
  },
];

/* -------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------- */
export default function F20Landing({ fontClass }: { fontClass: string }) {
  const reduced = useReducedMotionSafe();
  const [satchel, setSatchel] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function toggleSpecimen(id: string) {
    setSatchel((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <div className={`f20-page ${fontClass} min-h-screen`}>
      <span aria-hidden="true" className="f20-grain" />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-sm focus:bg-[var(--f20-forest)] focus:px-4 focus:py-3 focus:text-[var(--f20-paper)] f20-label focus:text-sm"
      >
        본문으로 건너뛰기
      </a>

      {/* ---------------------------------------------------------------
          Header
          --------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-[var(--f20-line)] bg-[var(--f20-paper)]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#main" className="flex flex-col leading-none">
            <span className="f20-serif text-xl font-bold tracking-tight text-[var(--f20-forest)] sm:text-2xl">
              FLORA CODEX
            </span>
            <span className="f20-label mt-1 text-[10px] text-[var(--f20-ink-soft)] sm:text-xs">
              HERBARIUM PARFUMERIE · EST. 2024
            </span>
          </a>

          <nav aria-label="주요 메뉴" className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-8">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="f20-label text-xs text-[var(--f20-ink-soft)] transition-colors hover:text-[var(--f20-forest)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {satchel.length > 0 && (
              <span
                className="f20-stamp hidden f20-label px-3 py-1.5 text-[11px] sm:inline-block"
                aria-live="polite"
              >
                표본함 {satchel.length}
              </span>
            )}
            <a
              href="#register"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--f20-forest)] px-5 text-sm font-medium text-[var(--f20-paper)] transition-colors hover:bg-[var(--f20-forest-deep)] focus-visible:bg-[var(--f20-forest-deep)]"
            >
              구독 시작
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* -------------------------------------------------------------
            Hero
            ------------------------------------------------------------- */}
        <section
          aria-labelledby="hero-heading"
          className="f20-torn-bottom relative flex min-h-[88vh] items-end overflow-hidden sm:min-h-[92vh]"
        >
          <Image
            src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&auto=format&fit=crop&w=2000"
            alt="나뭇잎 사이로 아침 햇살이 쏟아지는 침엽수림"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[var(--f20-forest-deep)] via-[var(--f20-forest-deep)]/55 to-[var(--f20-forest-deep)]/10"
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pb-28">
            <motion.div {...riseIn(reduced)}>
              <span className="f20-stamp f20-label inline-block px-3 py-1.5 text-[11px]">
                Specimen No. 001 · Est. 2024
              </span>

              <h1
                id="hero-heading"
                className="f20-serif mt-6 max-w-3xl text-4xl font-bold leading-[1.18] text-[var(--f20-paper)] sm:text-5xl md:text-6xl lg:text-7xl"
              >
                계절을 채집하여
                <br />
                향으로 압화하다
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--f20-paper)]/85 sm:text-lg">
                플로라 코덱스는 매달 한 종의 식물을 표본으로 기록하고, 그 향을 병에 눌러 담아
                보내드리는 허바리움 향수 구독입니다. 병마다 채집 번호, 학명, 채집지가 라벨로
                부착됩니다.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#register"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--f20-rust)] px-6 text-sm font-medium text-[var(--f20-paper)] transition-colors hover:bg-[var(--f20-rust-deep)] focus-visible:bg-[var(--f20-rust-deep)] sm:text-base"
                >
                  표본실 등록하기
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#catalog"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--f20-paper)]/50 px-6 text-sm font-medium text-[var(--f20-paper)] transition-colors hover:bg-[var(--f20-paper)]/10 focus-visible:bg-[var(--f20-paper)]/10 sm:text-base"
                >
                  도감 둘러보기
                </a>
              </div>
            </motion.div>
          </div>

          <div
            aria-hidden="true"
            className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
          >
            {reduced ? (
              <ChevronDown className="h-6 w-6 text-[var(--f20-paper)]/70" />
            ) : (
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}>
                <ChevronDown className="h-6 w-6 text-[var(--f20-paper)]/70" />
              </motion.div>
            )}
          </div>
        </section>

        {/* -------------------------------------------------------------
            Manifesto
            ------------------------------------------------------------- */}
        <section id="manifesto" aria-labelledby="manifesto-heading" className="bg-[var(--f20-paper)] py-24 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <motion.div {...riseIn(reduced)}>
              <p className="f20-label text-xs text-[var(--f20-rust-deep)]">FIELD NOTE — VOL. I</p>
              <blockquote className="mt-6">
                <p className="f20-latin text-3xl leading-snug text-[var(--f20-forest)] sm:text-4xl">
                  &ldquo;Herbarium — hortus siccus&rdquo;
                </p>
              </blockquote>
              <h2 id="manifesto-heading" className="f20-serif mt-4 text-2xl font-bold text-[var(--f20-ink)] sm:text-3xl">
                마른 정원이라는 뜻
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--f20-ink-soft)]">
                허바리움은 라틴어로 &lsquo;마른 정원&rsquo;을 뜻합니다. 우리는 시들지 않는 방식으로
                계절을 소장하는 법을 오래전부터 알고 있었습니다. 플로라 코덱스는 그 오래된 기술을
                향으로 옮겨 적습니다.
              </p>

              <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
                {[
                  { icon: Compass, label: "채집", desc: "Collect" },
                  { icon: ScrollText, label: "기록", desc: "Document" },
                  { icon: Leaf, label: "보존", desc: "Preserve" },
                ].map((p) => (
                  <li key={p.label} className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--f20-line)] bg-[var(--f20-paper-raised)]">
                      <p.icon className="h-5 w-5 text-[var(--f20-forest)]" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block f20-serif font-bold text-[var(--f20-ink)]">{p.label}</span>
                      <span className="f20-label block text-[11px] text-[var(--f20-ink-soft)]">{p.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.figure {...riseIn(reduced, 0.1)} className="f20-card f20-annotate mx-auto w-full max-w-sm p-3">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&auto=format&fit=crop&w=1000"
                  alt="안개가 낮게 깔린 침엽수림의 풍경"
                  fill
                  sizes="(min-width: 1024px) 400px, 90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="f20-label mt-3 px-1 pb-1 text-[11px] leading-relaxed text-[var(--f20-ink-soft)]">
                Fig. 02 — Pinus densiflora 군락, 강원 평창 해발 820m. 채집팀 현장 기록.
              </figcaption>
            </motion.figure>
          </div>
        </section>

        {/* -------------------------------------------------------------
            Catalog
            ------------------------------------------------------------- */}
        <section id="catalog" aria-labelledby="catalog-heading" className="bg-[var(--f20-paper-deep)] py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div {...riseIn(reduced)} className="max-w-2xl">
              <p className="f20-label text-xs text-[var(--f20-rust-deep)]">CATALOGUE — PLATE I – VI</p>
              <h2 id="catalog-heading" className="f20-serif mt-4 text-3xl font-bold text-[var(--f20-ink)] sm:text-4xl">
                여섯 개의 표본
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--f20-ink-soft)]">
                각 표본은 실제 채집기를 바탕으로 조향됩니다. 향은 계절마다 소량 한정 제작되며,
                재고 소진 시 다음 시즌까지 재판매되지 않습니다.
              </p>
            </motion.div>

            <ul className="mt-14 grid list-none grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {SPECIMENS.map((s, i) => {
                const inSatchel = satchel.includes(s.id);
                return (
                  <motion.li key={s.id} {...riseIn(reduced, (i % 3) * 0.08)}>
                    <article className="f20-card flex h-full flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--f20-line)]">
                        <Image
                          src={s.image.src}
                          alt={s.image.alt}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          loading="lazy"
                          className="object-cover"
                        />
                        <span className="f20-stamp f20-label absolute right-3 top-3 px-2.5 py-1 text-[10px]">
                          No. {s.id}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="f20-latin text-2xl text-[var(--f20-forest)]">{s.latin}</h3>
                        <p className="f20-label mt-1 text-[11px] text-[var(--f20-ink-soft)]">{s.name}</p>

                        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 border-t border-dashed border-[var(--f20-line)] pt-4 text-sm">
                          <dt className="f20-label text-[10px] text-[var(--f20-ink-soft)]">과</dt>
                          <dd className="text-[var(--f20-ink)]">{s.family}</dd>
                          <dt className="f20-label text-[10px] text-[var(--f20-ink-soft)]">채집지</dt>
                          <dd className="text-[var(--f20-ink)]">{s.habitat}</dd>
                          <dt className="f20-label text-[10px] text-[var(--f20-ink-soft)]">조향노트</dt>
                          <dd className="text-[var(--f20-ink)]">{s.note}</dd>
                        </dl>

                        <div className="mt-6 flex items-center justify-between gap-3 pt-2">
                          <span className="f20-serif text-xl font-bold text-[var(--f20-ink)]">
                            &#8361;{s.price}
                          </span>
                          <button
                            type="button"
                            aria-pressed={inSatchel}
                            onClick={() => toggleSpecimen(s.id)}
                            className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs font-medium transition-colors sm:text-sm ${
                              inSatchel
                                ? "bg-[var(--f20-forest)] text-[var(--f20-paper)] hover:bg-[var(--f20-forest-deep)]"
                                : "border border-[var(--f20-forest)] text-[var(--f20-forest)] hover:bg-[var(--f20-forest)] hover:text-[var(--f20-paper)]"
                            }`}
                          >
                            {inSatchel ? (
                              <>
                                담음 <Check className="h-4 w-4" aria-hidden="true" />
                              </>
                            ) : (
                              "표본함에 담기"
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------------
            Process
            ------------------------------------------------------------- */}
        <section
          id="process"
          aria-labelledby="process-heading"
          className="relative bg-[var(--f20-forest-deep)] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div {...riseIn(reduced)} className="max-w-2xl">
              <p className="f20-label text-xs text-[var(--f20-paper)]/60">FIELD PROTOCOL</p>
              <h2 id="process-heading" className="f20-serif mt-4 text-3xl font-bold text-[var(--f20-paper)] sm:text-4xl">
                채집에서 병입까지
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--f20-paper)]/75">
                모든 표본은 세 단계를 거쳐 회원의 손에 도착합니다.
              </p>
            </motion.div>

            <ol className="mt-16 grid list-none grid-cols-1 gap-12 md:grid-cols-3 md:gap-10">
              {PROCESS.map((step, i) => (
                <motion.li key={step.num} {...riseIn(reduced, i * 0.1)} className="flex flex-col items-start">
                  <span className="f20-serif text-sm text-[var(--f20-paper)]/50">{step.num}</span>
                  <span className="mt-3 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--f20-paper)]/30 bg-[var(--f20-paper)]/5">
                    <step.icon className="h-6 w-6 text-[var(--f20-paper)]" aria-hidden="true" />
                  </span>
                  <h3 className="f20-serif mt-5 text-xl font-bold text-[var(--f20-paper)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--f20-paper)]/70">{step.desc}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          <span aria-hidden="true" className="f20-deckle absolute -bottom-px left-0" />
        </section>

        {/* -------------------------------------------------------------
            Membership
            ------------------------------------------------------------- */}
        <section id="membership" aria-labelledby="membership-heading" className="bg-[var(--f20-paper)] pt-28 pb-24 sm:pt-36 sm:pb-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div {...riseIn(reduced)} className="max-w-2xl">
              <p className="f20-label text-xs text-[var(--f20-rust-deep)]">HERBARIUM MEMBERSHIP</p>
              <h2 id="membership-heading" className="f20-serif mt-4 text-3xl font-bold text-[var(--f20-ink)] sm:text-4xl">
                표본실 회원제
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--f20-ink-soft)]">
                세 가지 등급의 표본실 회원제. 언제든 등급을 바꾸거나 해지할 수 있습니다.
              </p>
            </motion.div>

            <ul className="mt-14 grid list-none grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
              {TIERS.map((tier, i) => (
                <motion.li
                  key={tier.name}
                  {...riseIn(reduced, i * 0.1)}
                  className={`flex h-full flex-col p-8 ${
                    tier.highlighted
                      ? "border-2 border-[var(--f20-forest)] bg-[var(--f20-forest)] text-[var(--f20-paper)] md:-translate-y-3"
                      : "f20-card text-[var(--f20-ink)]"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="f20-label mb-4 inline-block w-fit rounded-full bg-[var(--f20-paper)] px-3 py-1 text-[10px] text-[var(--f20-forest)]">
                      가장 인기
                    </span>
                  )}
                  <span className="f20-label text-[11px] opacity-70">{tier.kr}</span>
                  <h3 className="f20-latin mt-1 text-3xl">{tier.name}</h3>
                  <p className="f20-serif mt-5 text-3xl font-bold">
                    &#8361;{tier.price}
                    <span className="f20-label ml-1 text-sm font-normal opacity-70">/월</span>
                  </p>

                  <ul className="mt-7 flex flex-1 flex-col gap-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm leading-relaxed">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${tier.highlighted ? "text-[var(--f20-paper)]" : "text-[var(--f20-forest)]"}`}
                          aria-hidden="true"
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#register"
                    className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors ${
                      tier.highlighted
                        ? "bg-[var(--f20-paper)] text-[var(--f20-forest)] hover:bg-[var(--f20-paper-deep)]"
                        : "border border-[var(--f20-forest)] text-[var(--f20-forest)] hover:bg-[var(--f20-forest)] hover:text-[var(--f20-paper)]"
                    }`}
                  >
                    {tier.cta}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------------
            Press quote
            ------------------------------------------------------------- */}
        <section aria-label="언론 인용" className="bg-[var(--f20-forest-deep)] py-20 sm:py-28">
          <motion.blockquote {...riseIn(reduced)} className="mx-auto max-w-3xl px-6 text-center sm:px-8">
            <p className="f20-latin text-2xl leading-relaxed text-[var(--f20-paper)] sm:text-3xl">
              &ldquo;표본이라는 형식이 향수에 이토록 잘 어울릴 줄은 몰랐다. 플로라 코덱스는 향을 파는
              것이 아니라, 시간을 채집해 보관하는 법을 판다.&rdquo;
            </p>
            <cite className="f20-label mt-6 block text-xs not-italic text-[var(--f20-paper)]/60">
              『계간 식물』 2025년 가을호 — 안소민 편집장
            </cite>
          </motion.blockquote>
        </section>

        {/* -------------------------------------------------------------
            Register / newsletter
            ------------------------------------------------------------- */}
        <section id="register" aria-labelledby="register-heading" className="bg-[var(--f20-paper-deep)] py-24 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
            <motion.div {...riseIn(reduced)}>
              <p className="f20-label text-xs text-[var(--f20-rust-deep)]">SPECIMEN REGISTRY</p>
              <h2 id="register-heading" className="f20-serif mt-4 text-3xl font-bold text-[var(--f20-ink)] sm:text-4xl">
                표본실 명단에
                <br />
                등록하기
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--f20-ink-soft)]">
                다음 채집 시즌 소식과 한정 표본의 우선 예약 안내를 이메일로 가장 먼저
                보내드립니다. 광고성 정보는 보내지 않습니다.
              </p>
            </motion.div>

            <motion.div {...riseIn(reduced, 0.08)} className="f20-card p-8 sm:p-10">
              {submitted ? (
                <p role="status" aria-live="polite" className="text-base leading-relaxed text-[var(--f20-ink)]">
                  <Check className="mb-3 h-6 w-6 text-[var(--f20-forest)]" aria-hidden="true" />
                  표본실 명단에 등록되었습니다. 다음 채집 시즌 소식을 가장 먼저 전해드릴게요.
                </p>
              ) : (
                <form onSubmit={handleRegister} noValidate>
                  <label htmlFor="register-email" className="f20-label block text-xs text-[var(--f20-ink-soft)]">
                    이메일 주소
                  </label>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 min-h-12 w-full rounded-sm border border-[var(--f20-line)] bg-[var(--f20-paper)] px-4 text-base text-[var(--f20-ink)] outline-none placeholder:text-[var(--f20-ink-soft)]/50 focus-visible:border-[var(--f20-forest)]"
                  />
                  <button
                    type="submit"
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--f20-forest)] px-6 text-sm font-medium text-[var(--f20-paper)] transition-colors hover:bg-[var(--f20-forest-deep)] sm:w-auto"
                  >
                    표본실 명단에 등록하기
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <p className="f20-label mt-4 text-[11px] text-[var(--f20-ink-soft)]">
                    등록 후 언제든 수신을 거부할 수 있습니다.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      {/* -----------------------------------------------------------------
          Footer
          ----------------------------------------------------------------- */}
      <footer className="bg-[var(--f20-forest-deep)] py-16 text-[var(--f20-paper)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="f20-serif text-xl font-bold">FLORA CODEX</h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div>
              <p className="max-w-xs text-sm leading-relaxed text-[var(--f20-paper)]/70">
                식물 한 종의 계절을 표본으로 기록하고, 그 향을 병에 눌러 담아 보내드리는 허바리움
                향수 구독. Seoul, since 2024.
              </p>
            </div>
            <nav aria-label="탐색">
              <h3 className="f20-label text-xs text-[var(--f20-paper)]/50">탐색</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-sm text-[var(--f20-paper)]/80 hover:text-[var(--f20-paper)]">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h3 className="f20-label text-xs text-[var(--f20-paper)]/50">안내</h3>
              <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--f20-paper)]/70">
                <li>이용약관</li>
                <li>개인정보처리방침</li>
                <li>표본 발송정책</li>
                <li>문의: hello@floracodex.kr</li>
              </ul>
            </div>
          </div>

          <div className="f20-hairline mt-14 flex flex-col gap-3 border-t pt-6 text-[11px] text-[var(--f20-paper)]/50 sm:flex-row sm:items-center sm:justify-between">
            <p className="f20-label">© 2026 Flora Codex. 표본 목록은 계절에 따라 갱신됩니다.</p>
            <p className="f20-label">Herbarium Parfumerie · Seoul, Korea</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
