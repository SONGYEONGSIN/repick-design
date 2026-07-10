"use client";

/**
 * KINETYPE — 물리 기반 카이네틱 타이포그래피 엔진 (가상 브랜드/제품)
 *
 * 디자인 컨셉: "타입이 곧 이미지다." 사진 대신 글자 자체가 스크롤·커서·시간에
 * 반응해 움직이는 조형 요소가 된다. 팔레트는 디지털(라임 그린 = 모션 에너지)과
 * 아날로그(타자기 리본 레드 = 인쇄의 기억)를 대비시켜 "정적 인쇄 → 살아있는 타이포"
 * 라는 브랜드 서사를 색으로도 전달한다.
 *
 * 접근성 메모: 문자 단위로 쪼개 애니메이션하는 span들은 항상 `aria-hidden="true"`
 * 로 감추고, 그 부모 요소(h1/h2/p)에 원문 그대로 `aria-label`을 부여한다.
 * 이는 "aria-label이 visible text를 복제하면 안 된다"는 일반 원칙의 의도된 예외로,
 * 화면 낭독기가 조각난 글자 대신 완전한 문장을 한 번에 읽도록 하기 위한
 * WAI-ARIA 권장 패턴이다(장식 목적의 시각적 분할 vs 실제 텍스트 콘텐츠 분리).
 *
 * reduced-motion 안전장치: OS의 prefers-reduced-motion을 useSyncExternalStore로
 * 직접 구독하고, 상단의 "모션 정지" 토글까지 단일 boolean(reduced)으로 합쳐
 * 모든 애니메이션 컴포넌트에 prop으로 내려준다. reduced가 true인 경로는 항상
 * `initial={false}` 또는 style 미적용으로 "이미 완료된 최종 상태"를 렌더링하므로,
 * 콘텐츠가 opacity:0로 영구히 숨는 경우가 없다.
 */

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ElementType,
} from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  Gauge,
  Magnet,
  Pause,
  Play,
  Quote,
  Sparkles,
} from "lucide-react";

/* ----------------------------------------------------------------------- */
/* 데이터                                                                    */
/* ----------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: "#moves", label: "무브" },
  { href: "#manifesto", label: "매니페스토" },
  { href: "#cases", label: "사용 사례" },
  { href: "#pricing", label: "요금제" },
];

const TICKER_EN = [
  "GRAVITY",
  "SPRING",
  "ELASTIC",
  "MAGNETIC",
  "SCROLL-LINKED",
  "VOICE-REACTIVE",
  "KINETIC",
];

const TICKER_KO = [
  "중력",
  "관성",
  "탄성",
  "자성",
  "스크롤 연동",
  "소리 반응",
  "살아있는 문장",
];

const MANIFESTO =
  "정적인 문장은 스쳐 지나가지만 움직이는 문장은 눈에 박힌다 우리는 마침표 대신 리듬으로 문장을 맺는다 화면은 페이지가 아니라 무대다";

const MOVES = [
  {
    tag: "MOVE 01",
    title: "중력 낙하",
    titleEn: "GRAVITY DROP",
    desc: "화면에 들어오는 순간, 글자가 위에서 떨어지며 스프링처럼 튕겨 제자리를 찾습니다.",
    Icon: ArrowDownToLine,
  },
  {
    tag: "MOVE 02",
    title: "자성 커서",
    titleEn: "MAGNETIC PULL",
    desc: "커서가 다가올수록 문장이 당겨집니다. 텍스트에도 저마다의 중력장이 있습니다.",
    Icon: Magnet,
  },
  {
    tag: "MOVE 03",
    title: "스크롤 시어",
    titleEn: "SCROLL SHEAR",
    desc: "빠르게 스크롤할수록 글자가 기울고, 멈추면 다시 수평으로 되돌아옵니다.",
    Icon: Gauge,
  },
] as const;

const CASES = [
  "NUMO STUDIO",
  "ORBIT LABS",
  "PALETTE & CO",
  "FIELDNOTE",
  "GENWON 元原",
  "ATLAS TYPE",
  "HALFTONE",
  "SIGNAL WORKS",
];

const PLANS = [
  {
    name: "STUDIO",
    price: "₩0",
    period: "개인·소규모 팀",
    features: ["무제한 미리보기", "프로젝트 3개", "라이트 워터마크 포함"],
    cta: "무료로 시작",
  },
  {
    name: "ENTERPRISE",
    price: "맞춤 견적",
    period: "브랜드·프로덕트 팀",
    features: ["전담 모션 디렉터 배정", "무제한 프로젝트", "화이트라벨 · 우선 지원"],
    cta: "영업팀에 문의",
  },
];

/* ----------------------------------------------------------------------- */
/* 유틸리티 훅                                                                */
/* ----------------------------------------------------------------------- */

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}
/** OS의 prefers-reduced-motion을 안전하게 구독한다 (SSR 기본값 false). */
function useSystemReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

/* ----------------------------------------------------------------------- */
/* 카이네틱 타이포 원자 컴포넌트                                                */
/* ----------------------------------------------------------------------- */

type KineticTag = "h1" | "h2" | "p" | "span";

function KineticWords({
  text,
  as = "span",
  className,
  charClassName,
  reduced,
  trigger = "view",
  stagger = 0.035,
  baseDelay = 0,
  fromY = 26,
  fromRotate = -6,
  amount = 0.6,
  spring = { stiffness: 380, damping: 30, mass: 0.8 },
}: {
  text: string;
  as?: KineticTag;
  className?: string;
  charClassName?: string;
  reduced: boolean;
  trigger?: "mount" | "view";
  stagger?: number;
  baseDelay?: number;
  fromY?: number;
  fromRotate?: number;
  amount?: number;
  spring?: { stiffness: number; damping: number; mass: number };
}) {
  const Comp = as as ElementType;
  const words = text.split(" ");
  let globalIndex = 0;

  return (
    <Comp className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            {wi > 0 && " "}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => {
                const i = globalIndex++;
                const motionProps = reduced
                  ? {}
                  : trigger === "mount"
                    ? {
                        initial: { opacity: 0, y: fromY, rotate: fromRotate },
                        animate: { opacity: 1, y: 0, rotate: 0 },
                      }
                    : {
                        initial: { opacity: 0, y: fromY, rotate: fromRotate },
                        whileInView: { opacity: 1, y: 0, rotate: 0 },
                        viewport: { once: true, amount },
                      };
                return (
                  <motion.span
                    key={ci}
                    className={charClassName}
                    style={{ display: "inline-block" }}
                    {...motionProps}
                    transition={{
                      type: "spring",
                      ...spring,
                      delay: baseDelay + i * stagger,
                    }}
                  >
                    {ch}
                  </motion.span>
                );
              })}
            </span>
          </Fragment>
        ))}
      </span>
    </Comp>
  );
}

/* ----------------------------------------------------------------------- */
/* 마퀴 티커                                                                  */
/* ----------------------------------------------------------------------- */

function MarqueeSection({ reduced }: { reduced: boolean }) {
  const rowEn = [...TICKER_EN, ...TICKER_EN];
  const rowKo = [...TICKER_KO, ...TICKER_KO];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-[var(--bg)] py-6 sm:py-8">
      <div aria-hidden="true" className="flex flex-col gap-4">
        <div className="overflow-hidden">
          <div
            className="marquee-left flex w-max shrink-0 gap-10 whitespace-nowrap"
            style={{ animationPlayState: reduced ? "paused" : "running" }}
          >
            {rowEn.map((t, i) => (
              <span
                key={i}
                className="font-mono text-sm tracking-[0.25em] text-[var(--muted)] sm:text-base"
              >
                {t} <span className="text-[var(--accent)]">·</span>
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className="marquee-right flex w-max shrink-0 gap-10 whitespace-nowrap"
            style={{ animationPlayState: reduced ? "paused" : "running" }}
          >
            {rowKo.map((t, i) => (
              <span
                key={i}
                className="font-sans text-sm font-semibold tracking-tight text-[var(--fg)] sm:text-base"
              >
                {t} <span className="text-[var(--accent)]">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .marquee-left {
          animation: marquee-left 34s linear infinite;
        }
        .marquee-right {
          animation: marquee-right 40s linear infinite;
        }
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-left,
          .marquee-right {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* 매니페스토 — 스크롤 고정 워드 리빌                                            */
/* ----------------------------------------------------------------------- */

function ManifestoWord({
  word,
  index,
  total,
  progress,
  reduced,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const start = index / total;
  const end = Math.min(start + (1 / total) * 1.5, 1);
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  const y = useTransform(progress, [start, end], [18, 0]);
  const blurPx = useTransform(progress, [start, end], [6, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);

  return (
    <motion.span
      style={reduced ? undefined : { opacity, y, filter }}
      className="mx-[0.18em] inline-block"
    >
      {word}
    </motion.span>
  );
}

function ManifestoSection({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const words = MANIFESTO.split(" ");

  return (
    <section
      id="manifesto"
      ref={ref}
      aria-labelledby="manifesto-heading"
      className="relative h-[280vh] bg-[var(--bg)]"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
        <p className="mb-8 flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-[var(--accent)]/80">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          MANIFESTO
        </p>
        <h2 id="manifesto-heading" className="sr-only">
          {MANIFESTO}
        </h2>
        <p
          aria-hidden="true"
          className="max-w-4xl text-center text-2xl leading-snug font-bold text-[var(--fg)] sm:text-4xl sm:leading-tight md:text-5xl"
        >
          {words.map((w, i) => (
            <ManifestoWord
              key={i}
              word={w}
              index={i}
              total={words.length}
              progress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/* 무브 카드 3종                                                              */
/* ----------------------------------------------------------------------- */

function MagneticPanel({ reduced }: { reduced: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 20, mass: 0.6 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    x.set(relX * 16);
    y.set(relY * 10);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-black/30"
    >
      <motion.p
        style={reduced ? undefined : { x: sx, y: sy }}
        className="select-none font-mono text-2xl font-bold tracking-tight text-[var(--accent)] sm:text-3xl"
      >
        자성 커서
      </motion.p>
    </div>
  );
}

function ScrollShearPanel({ reduced }: { reduced: boolean }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const skewRaw = useTransform(velocity, [-2200, 0, 2200], [-14, 0, 14], {
    clamp: true,
  });
  const skew = useSpring(skewRaw, { stiffness: 300, damping: 40, mass: 0.5 });
  const transform = useTransform(skew, (v) => `skewX(${v}deg)`);

  return (
    <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-black/30">
      <motion.p
        style={reduced ? undefined : { transform }}
        className="select-none font-mono text-2xl font-bold tracking-tight text-[var(--accent)] sm:text-3xl"
      >
        스크롤 시어
      </motion.p>
    </div>
  );
}

function MovesSection({ reduced }: { reduced: boolean }) {
  return (
    <section id="moves" className="bg-[var(--bg)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.3em] text-[var(--accent)]/80">
          MOVES · 세 가지 원리
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-[var(--fg)] sm:text-5xl">
          모든 문장은 물리 법칙 하나씩을 가진다
        </h2>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOVES.map((move, i) => (
            <li key={move.tag}>
              <article className="flex h-full flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 font-mono text-[11px] font-bold tracking-widest text-black">
                    {move.tag}
                  </span>
                  <move.Icon aria-hidden="true" className="h-6 w-6 text-[var(--muted)]" />
                </div>

                {i === 0 && (
                  <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl bg-black/30">
                    <KineticWords
                      text="중력 낙하"
                      as="p"
                      reduced={reduced}
                      trigger="view"
                      fromY={-70}
                      fromRotate={-16}
                      stagger={0.06}
                      spring={{ stiffness: 260, damping: 13, mass: 1 }}
                      className="select-none font-mono text-2xl font-bold tracking-tight text-[var(--accent)] sm:text-3xl"
                    />
                  </div>
                )}
                {i === 1 && <MagneticPanel reduced={reduced} />}
                {i === 2 && <ScrollShearPanel reduced={reduced} />}

                <div>
                  <h3 className="text-xl font-bold text-[var(--fg)]">
                    {move.title}{" "}
                    <span className="font-mono text-sm font-normal text-[var(--muted)]">
                      {move.titleEn}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {move.desc}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/* 페이퍼 / 인용 섹션 (아날로그 대비)                                            */
/* ----------------------------------------------------------------------- */

function PaperQuoteSection() {
  return (
    <section
      aria-labelledby="paper-heading"
      className="relative overflow-hidden bg-[var(--paper)] px-6 py-24 text-[var(--ink)] sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl border border-black/10 lg:order-1">
          <Image
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80"
            alt="낡은 타자기의 자판을 가까이서 찍은 사진"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 42vw, 90vw"
            className="object-cover grayscale contrast-125"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--ribbon)]">
            FROM PRINT TO PIXEL
          </p>
          <h2 id="paper-heading" className="sr-only">
            타이프라이터에서 카이네타입까지
          </h2>
          <Quote
            aria-hidden="true"
            className="mt-6 h-8 w-8 text-[var(--ribbon)]"
          />
          <blockquote className="mt-4">
            <p className="font-display text-3xl leading-snug italic sm:text-4xl">
              타이프라이터가 문장을 새겼다면, 카이네타입은 문장에 숨을
              불어넣는다.
            </p>
          </blockquote>
          <p className="mt-6 font-mono text-sm text-[var(--ink)]/60">
            — KINETYPE 디자인 노트
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/* 사용 사례                                                                  */
/* ----------------------------------------------------------------------- */

function CasesSection() {
  return (
    <section id="cases" className="bg-[var(--bg)] px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs tracking-[0.3em] text-[var(--accent)]/80">
          IN USE
        </p>
        <h2 className="mt-4 text-2xl font-bold text-[var(--fg)] sm:text-3xl">
          이미 카이네타입으로 문장을 움직이는 팀들
        </h2>
        <ul
          aria-label="카이네타입을 사용하는 팀 목록"
          className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4"
        >
          {CASES.map((name) => (
            <li
              key={name}
              className="flex min-h-[96px] items-center justify-center bg-[var(--bg)] px-4 py-6 text-center"
            >
              <span className="font-mono text-sm font-semibold tracking-tight text-[var(--muted)]">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/* 요금제                                                                    */
/* ----------------------------------------------------------------------- */

function PricingSection() {
  return (
    <section id="pricing" className="bg-[var(--bg)] px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-[var(--accent)]/80">
          PRICING
        </p>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-[var(--fg)] sm:text-4xl">
          작게 시작해서, 브랜드 전체로 번지게
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <li key={plan.name}>
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                <h3 className="font-mono text-sm font-bold tracking-widest text-[var(--accent)]">
                  {plan.name}
                </h3>
                <p className="mt-3 text-4xl font-black text-[var(--fg)]">
                  {plan.price}
                </p>
                <p className="mt-1 text-sm text-[var(--muted)]">{plan.period}</p>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--fg)]/90">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                >
                  {plan.cta}
                </button>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/* 최종 CTA                                                                  */
/* ----------------------------------------------------------------------- */

function FinalCtaSection({ reduced }: { reduced: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="bg-[var(--bg)] px-6 py-24 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <KineticWords
          text="지금, 당신의 문장을 움직여보세요"
          as="h2"
          reduced={reduced}
          trigger="view"
          fromY={22}
          className="text-3xl font-black tracking-tight text-[var(--fg)] sm:text-5xl"
        />
        <p className="mt-6 text-base text-[var(--muted)] sm:text-lg">
          베타에 신청하면 카이네타입 에디터 초대 코드를 가장 먼저 보내드립니다.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <div className="flex-1 text-left">
            <label htmlFor="beta-email" className="sr-only">
              이메일 주소
            </label>
            <input
              id="beta-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@studio.com"
              className="min-h-[44px] w-full rounded-full border border-white/20 bg-transparent px-5 py-3 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
            />
          </div>
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            베타 신청
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </form>
        <p role="status" aria-live="polite" className="mt-4 min-h-[1.5em] text-sm text-[var(--accent)]">
          {submitted ? "신청이 접수되었습니다. 곧 이메일로 연락드릴게요." : ""}
        </p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------------- */
/* 헤더 / 히어로 / 푸터                                                        */
/* ----------------------------------------------------------------------- */

function Header({
  motionOn,
  onToggleMotion,
}: {
  motionOn: boolean;
  onToggleMotion: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--bg)]/80 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          className="font-mono text-lg font-bold tracking-tight text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
        >
          KINE<span className="text-[var(--accent)]">TYPE</span>
        </a>

        <nav aria-label="주요" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMotion}
            aria-pressed={motionOn}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-xs font-bold tracking-wide text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            {motionOn ? (
              <Pause aria-hidden="true" className="h-4 w-4" />
            ) : (
              <Play aria-hidden="true" className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {motionOn ? "모션 정지" : "모션 재생"}
            </span>
          </button>
          <a
            href="#pricing"
            className="hidden min-h-[44px] items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] sm:inline-flex"
          >
            베타 신청하기
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ reduced, motionOn }: { reduced: boolean; motionOn: boolean }) {
  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden bg-[var(--bg)] px-6 pt-16 pb-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-[var(--accent)]"
        >
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          TYPE ENGINE — PHYSICS-BASED KINETIC TYPOGRAPHY
        </motion.p>

        <KineticWords
          text="글자가 먼저 움직인다"
          as="h1"
          reduced={reduced}
          trigger="mount"
          baseDelay={0.15}
          stagger={0.045}
          className="mt-6 text-[clamp(2.75rem,9vw,7rem)] leading-[0.95] font-black tracking-tight text-[var(--fg)]"
        />

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg"
        >
          카이네타입은 정적인 텍스트에 물리 엔진을 이식하는 모션 엔진입니다.
          스크롤의 속도, 커서의 위치, 화면에 들어오는 순간까지 — 문장은
          읽히기 전에 먼저 반응합니다.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#manifesto"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            라이브 데모 보기
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
          <a
            href="#pricing"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
          >
            베타 신청하기
          </a>
        </motion.div>
      </div>

      <div className="mx-auto mt-16 flex w-full max-w-6xl items-center gap-2 text-[var(--muted)]">
        <motion.div
          aria-hidden="true"
          animate={motionOn ? { y: [0, 8, 0] } : { y: 0 }}
          transition={
            motionOn
              ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0 }
          }
        >
          <ArrowDownToLine aria-hidden="true" className="h-4 w-4" />
        </motion.div>
        <span className="font-mono text-[11px] tracking-[0.3em]">SCROLL</span>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--bg)] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-mono text-lg font-bold text-[var(--fg)]">
              KINE<span className="text-[var(--accent)]">TYPE</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-[var(--muted)]">
              읽기 전에, 먼저 움직이는 문장을 만듭니다.
            </p>
          </div>
          <nav aria-label="제품">
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--muted)]">
              제품
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--fg)]/80 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-[var(--muted)]">
              문의
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--fg)]/80">
              <li>
                <a
                  href="mailto:hello@kinetype.studio"
                  className="hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                >
                  hello@kinetype.studio
                </a>
              </li>
              <li className="text-[var(--muted)]">Instagram · Threads · X</li>
            </ul>
          </div>
        </div>
        <p className="mt-12 font-mono text-xs text-[var(--muted)]">
          © 2026 KINETYPE. 가상의 브랜드입니다.
        </p>
      </div>
    </footer>
  );
}

/* ----------------------------------------------------------------------- */
/* 루트                                                                      */
/* ----------------------------------------------------------------------- */

const PALETTE = {
  "--bg": "#0b0b0d",
  "--fg": "#f5f4ef",
  "--muted": "#a3a29d",
  "--accent": "#d7ff3f",
  "--paper": "#f3efe4",
  "--ink": "#18140f",
  "--ribbon": "#a4291f",
} as CSSProperties;

export default function Landing() {
  const systemReduced = useSystemReducedMotion();
  const [manualOverride, setManualOverride] = useState<boolean | null>(null);
  const motionOn = manualOverride === null ? !systemReduced : manualOverride;
  const reduced = !motionOn;

  useEffect(() => {
    document.title = "KINETYPE — 물리 기반 카이네틱 타이포그래피 엔진";
  }, []);

  return (
    <div
      style={{ ...PALETTE, colorScheme: "dark" }}
      className="bg-[var(--bg)] font-sans text-[var(--fg)]"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[var(--accent)] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-black"
      >
        본문 바로가기
      </a>

      <Header
        motionOn={motionOn}
        onToggleMotion={() => setManualOverride(!motionOn)}
      />

      <main id="main-content">
        <Hero reduced={reduced} motionOn={motionOn} />
        <MarqueeSection reduced={reduced} />
        <ManifestoSection reduced={reduced} />
        <MovesSection reduced={reduced} />
        <PaperQuoteSection />
        <CasesSection />
        <PricingSection />
        <FinalCtaSection reduced={reduced} />
      </main>

      <Footer />
    </div>
  );
}
