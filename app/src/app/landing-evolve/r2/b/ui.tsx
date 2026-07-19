"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Quote,
  ShieldCheck,
  Target,
  TrendingDown,
} from "lucide-react";
import {
  ACCENT,
  AGGREGATES,
  cx,
  comma,
  EASE,
  fmtValue,
  FOCUS,
  PROOFS,
  PRODUCTS,
  round2,
  TRACK_CAPTION,
  TRACK_EYEBROW,
  TRACK_STAT,
  type Perspective,
  type Product,
  type Proof,
  type ProofView,
} from "./data";

// ------------------------------------------------------------------ shared
const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] " +
  FOCUS;

const CTA_GHOST =
  "inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:border-white/30 hover:bg-white/[0.04] " +
  FOCUS;

const DECK_SLIDES = [
  { id: "hero", label: "표지" },
  { id: "proof-accuracy", label: "매칭 정확도" },
  { id: "proof-value", label: "금액 증명" },
  { id: "proof-inspection", label: "검수 신뢰도" },
  { id: "products", label: "선별 매물" },
  { id: "summary", label: "신뢰 요약" },
  { id: "cta", label: "시작하기" },
] as const;

// -------------------------------------------------------------- count-up
function CountUp({
  view,
  className,
  reduced,
}: {
  view: { value: number; prefix?: string; suffix?: string; useComma?: boolean };
  className?: string;
  reduced: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const spring = useSpring(0, { stiffness: 68, damping: 22, restDelta: 0.4 });
  const text = useTransform(spring, (v) =>
    fmtValue({
      value: Math.round(v),
      prefix: view.prefix,
      suffix: view.suffix,
      useComma: view.useComma,
    }),
  );

  useEffect(() => {
    if (reduced) {
      spring.jump(view.value);
      return;
    }
    if (inView) spring.set(view.value);
  }, [inView, view.value, reduced, spring]);

  if (reduced) {
    return (
      <span ref={ref} className={className}>
        {fmtValue(view)}
      </span>
    );
  }
  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}

// --------------------------------------------------------------- charts
const CW = 260;
const CH = 150;
const PX = 20;
const PY = 24;

function LineChart({ view, len }: { view: ProofView; len: number | MotionValue<number> }) {
  const s = view.series;
  const max = Math.max(...s);
  const min = Math.min(...s);
  const range = max - min || 1;
  const pts = s.map((v, i) => ({
    x: round2(PX + (i / (s.length - 1)) * (CW - PX * 2)),
    y: round2(CH - PY - ((v - min) / range) * (CH - PY * 2)),
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full" role="img" aria-label={view.metric}>
      <line
        x1={PX}
        y1={round2(CH - PY)}
        x2={round2(CW - PX)}
        y2={round2(CH - PY)}
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={1}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={ACCENT}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: len }}
      />
      <motion.circle cx={last.x} cy={last.y} r={4.5} fill={ACCENT} style={{ opacity: len }} />
    </svg>
  );
}

function VBarChart({ view, len }: { view: ProofView; len: number | MotionValue<number> }) {
  const s = view.series;
  const max = Math.max(...s) || 1;
  const inner = CW - PX * 2;
  const step = inner / s.length;
  const barW = round2(step * 0.4);
  const baseY = round2(CH - PY);
  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full" role="img" aria-label={view.metric}>
      <line x1={PX} y1={baseY} x2={round2(CW - PX)} y2={baseY} stroke="rgba(255,255,255,0.10)" strokeWidth={1} />
      {s.map((v, i) => {
        const cxp = round2(PX + step * i + step / 2);
        const topY = round2(baseY - (v / max) * (CH - PY * 2));
        return (
          <g key={i}>
            <motion.line
              x1={cxp}
              y1={baseY}
              x2={cxp}
              y2={topY}
              stroke={ACCENT}
              strokeWidth={barW}
              strokeLinecap="round"
              style={{ pathLength: len }}
            />
            {view.seriesLabels ? (
              <text
                x={cxp}
                y={round2(CH - PY + 12)}
                fontSize={8}
                fill="#A1A1AA"
                textAnchor="middle"
              >
                {view.seriesLabels[i]}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function HBarChart({ view, len }: { view: ProofView; len: number | MotionValue<number> }) {
  const s = view.series;
  const max = Math.max(...s) || 1;
  const labelW = 34;
  const xStart = round2(PX + labelW);
  const xMax = round2(CW - PX);
  const rowH = (CH - PY * 2) / s.length;
  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full" role="img" aria-label={view.metric}>
      {s.map((v, i) => {
        const cy = round2(PY + rowH * i + rowH / 2);
        const xEnd = round2(xStart + (v / max) * (xMax - xStart));
        return (
          <g key={i}>
            {view.seriesLabels ? (
              <text x={PX} y={round2(cy + 3)} fontSize={8} fill="#A1A1AA">
                {view.seriesLabels[i]}
              </text>
            ) : null}
            <line x1={xStart} y1={cy} x2={xMax} y2={cy} stroke="rgba(255,255,255,0.08)" strokeWidth={6} strokeLinecap="round" />
            <motion.line
              x1={xStart}
              y1={cy}
              x2={xEnd}
              y2={cy}
              stroke={ACCENT}
              strokeWidth={6}
              strokeLinecap="round"
              style={{ pathLength: len }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function ProofChart({
  proof,
  view,
  draw,
  reduced,
}: {
  proof: Proof;
  view: ProofView;
  draw: MotionValue<number>;
  reduced: boolean;
}) {
  const len: number | MotionValue<number> = reduced ? 1 : draw;
  if (proof.chart === "line") return <LineChart view={view} len={len} />;
  if (proof.chart === "vbar") return <VBarChart view={view} len={len} />;
  return <HBarChart view={view} len={len} />;
}

// -------------------------------------------------------------- proof slide
function ProofSlide({
  proof,
  perspective,
  index,
  containerRef,
  reduced,
}: {
  proof: Proof;
  perspective: Perspective;
  index: number;
  containerRef: React.RefObject<HTMLElement | null>;
  reduced: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: ref,
    offset: ["start end", "center center"],
  });
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const view = proof[perspective];
  const textFirst = index % 2 === 0;

  const reveal: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <section
      ref={ref}
      id={proof.id}
      data-slide
      aria-label={`증거 ${proof.fig} — ${proof.eyebrow}`}
      className="flex min-h-[100svh] w-full snap-center items-center border-t border-white/10 py-24"
    >
      <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
        {/* text column */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className={cx("lg:col-span-6", textFirst ? "lg:order-1" : "lg:order-2")}
        >
          <p className={cx("text-[0.7rem] font-semibold uppercase text-[#6E56CF]", TRACK_EYEBROW)}>
            Fig. {proof.fig} — {proof.eyebrow}
          </p>
          <div
            className={cx(
              "mt-6 font-extrabold tabular-nums text-white",
              "text-[clamp(2.5rem,9vw,3.5rem)] lg:text-[clamp(3.5rem,6vw,5.5rem)]",
              "leading-[0.95]",
              TRACK_STAT,
            )}
          >
            <CountUp view={view} reduced={reduced} />
          </div>
          <p className="mt-4 text-lg font-semibold tracking-[-0.02em] text-white">
            {view.metric}
          </p>
          <p className="mt-4 max-w-md text-sm font-normal leading-[1.6] text-[#A1A1AA]">
            {view.caption}
          </p>
        </motion.div>

        {/* chart column */}
        <motion.figure
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.1 }}
          className={cx(
            "rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 lg:col-span-6",
            textFirst ? "lg:order-2" : "lg:order-1",
          )}
        >
          <figcaption
            className={cx(
              "mb-5 flex items-center justify-between text-[0.65rem] font-semibold uppercase text-[#A1A1AA]",
              TRACK_CAPTION,
            )}
          >
            <span>{perspective === "buyer" ? "구매자 데이터" : "판매자 데이터"}</span>
            <span className="text-[#6E56CF]">Live proof</span>
          </figcaption>
          <ProofChart proof={proof} view={view} draw={draw} reduced={reduced} />
        </motion.figure>
      </div>
    </section>
  );
}

// ------------------------------------------------------------ perspective toggle
function PerspectiveToggle({
  value,
  onChange,
  reduced,
}: {
  value: Perspective;
  onChange: (p: Perspective) => void;
  reduced: boolean;
}) {
  const opts: Array<{ k: Perspective; label: string }> = [
    { k: "buyer", label: "구매자 관점" },
    { k: "seller", label: "판매자 관점" },
  ];
  return (
    <div
      role="group"
      aria-label="증거 관점 선택"
      className="inline-flex rounded-full border border-white/15 bg-white/[0.03] p-1"
    >
      {opts.map((o) => {
        const active = value === o.k;
        return (
          <button
            key={o.k}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.k)}
            className={cx(
              "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150",
              active ? "text-white" : "text-[#A1A1AA] hover:text-white",
              FOCUS,
            )}
          >
            {active ? (
              <motion.span
                aria-hidden
                layoutId={reduced ? undefined : "perspective-pill"}
                transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                className="absolute inset-0 z-0 rounded-full bg-[#6E56CF]"
              />
            ) : null}
            <span className="relative z-10">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- carousel
function ProductBadges({ product }: { product: Product }) {
  return (
    <>
      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
        <span
          className={cx(
            "rounded-md border px-1.5 py-0.5 text-[0.7rem] font-semibold backdrop-blur-sm",
            product.grade === "S"
              ? "border-[#6E56CF] bg-[#6E56CF]/25 text-white"
              : "border-white/25 bg-black/40 text-white",
          )}
        >
          {product.grade}등급
        </span>
        <span className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/40 px-1.5 py-0.5 text-[0.7rem] font-semibold text-white backdrop-blur-sm">
          <BadgeCheck className="h-3 w-3 text-[#6E56CF]" strokeWidth={2} />
          인증 판매자
        </span>
      </div>
      <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-[#6E56CF] px-1.5 py-0.5 text-[0.7rem] font-extrabold text-white">
        <TrendingDown className="h-3 w-3" strokeWidth={2.5} />
        {product.discount}%
      </div>
      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-black/45 px-2 py-1 backdrop-blur-sm">
        <Target className="h-3.5 w-3.5 text-[#6E56CF]" strokeWidth={2} />
        <span className="text-xs font-semibold text-white">AI 매칭</span>
        <span className={cx("text-sm font-extrabold tabular-nums text-white", TRACK_STAT)}>
          {product.match}
        </span>
      </div>
    </>
  );
}

function ProductCarousel({ reduced }: { reduced: boolean }) {
  const n = PRODUCTS.length;
  const [state, setState] = useState<{ index: number; dir: number }>({ index: 0, dir: 0 });
  const { index, dir } = state;
  const product = PRODUCTS[index];

  const go = (d: number) => setState(({ index: i }) => ({ index: (i + d + n) % n, dir: d }));
  const jump = (i: number) => setState(({ index: cur }) => ({ index: i, dir: i > cur ? 1 : -1 }));

  const variants: Variants = reduced
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (d: number) => ({ opacity: 0, x: d > 0 ? 64 : -64 }),
        center: { opacity: 1, x: 0 },
        exit: (d: number) => ({ opacity: 0, x: d > 0 ? -64 : 64 }),
      };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="AI가 선별한 매물 캐러셀 — 좌우 화살표 키로 이동"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(-1);
        }
      }}
      className={cx("rounded-3xl outline-none", FOCUS)}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.article
            key={product.id}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduced ? 0.2 : 0.4, ease: EASE }}
            drag={reduced ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_e, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
            className="grid grid-cols-1 md:grid-cols-2"
          >
            <div className="relative aspect-[4/3] min-h-[240px] w-full overflow-hidden md:aspect-auto">
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                draggable={false}
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-[#0B0B0F]/60" />
              <ProductBadges product={product} />
            </div>

            <div className="flex flex-col gap-4 p-6 sm:p-8">
              <div>
                <p
                  className={cx(
                    "text-[0.7rem] font-semibold uppercase text-[#A1A1AA]",
                    TRACK_CAPTION,
                  )}
                >
                  {product.category}
                </p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-white">
                  {product.title}
                </h3>
                <p className="mt-1 text-sm font-normal text-[#A1A1AA]">{product.brand}</p>
              </div>

              <div className="flex items-baseline gap-2.5">
                <span
                  className={cx(
                    "text-2xl font-extrabold tabular-nums text-white",
                    TRACK_STAT,
                  )}
                >
                  {comma(product.price)}원
                </span>
                <span className="text-sm font-normal tabular-nums text-[#A1A1AA] line-through">
                  {comma(product.original)}원
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
                {product.reasons.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[0.7rem] font-normal text-[#A1A1AA]"
                  >
                    <Check className="h-3 w-3 text-[#6E56CF]" strokeWidth={2.5} />
                    {r}
                  </span>
                ))}
              </div>

              <a href="#cta" className={cx(CTA_GHOST, "mt-auto w-fit")}>
                이 매물 보기
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* controls */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="이전 매물"
            onClick={() => go(-1)}
            className={cx(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:bg-white/[0.06]",
              FOCUS,
            )}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="다음 매물"
            onClick={() => go(1)}
            className={cx(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:bg-white/[0.06]",
              FOCUS,
            )}
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {PRODUCTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-label={`${i + 1}번째 매물로 이동`}
                aria-current={i === index}
                onClick={() => jump(i)}
                className={cx(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === index ? "w-6 bg-[#6E56CF]" : "w-1.5 bg-white/25 hover:bg-white/40",
                  FOCUS,
                )}
              />
            ))}
          </div>
          <span className={cx("text-xs font-semibold tabular-nums text-[#A1A1AA]", TRACK_STAT)}>
            {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------- deck rail
function DeckRail({
  active,
  onJump,
}: {
  active: string;
  onJump: (id: string) => void;
}) {
  return (
    <nav
      aria-label="슬라이드 이동"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {DECK_SLIDES.map((s, i) => {
        const on = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            aria-label={`${s.label} 슬라이드로 이동`}
            aria-current={on}
            onClick={() => onJump(s.id)}
            className={cx("group flex items-center gap-2", FOCUS, "rounded-full")}
          >
            <span
              className={cx(
                "text-[0.6rem] font-semibold tabular-nums transition-colors duration-150",
                on ? "text-white" : "text-transparent group-hover:text-[#A1A1AA]",
                TRACK_STAT,
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={cx(
                "h-1.5 rounded-full transition-all duration-200",
                on ? "w-6 bg-[#6E56CF]" : "w-2 bg-white/25 group-hover:bg-white/45",
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------- main deck
export default function ProofDeck() {
  const reducedRaw = useReducedMotion();
  const reduced = reducedRaw ?? false;
  const scrollRef = useRef<HTMLElement>(null);
  const [perspective, setPerspective] = useState<Perspective>("buyer");
  const [active, setActive] = useState<string>("hero");

  // scroll-spy for the deck rail (root = the custom scroll container)
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
      { root, threshold: 0.55 },
    );
    root.querySelectorAll<HTMLElement>("[data-slide]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const jumpTo = (id: string) => {
    const el = scrollRef.current?.querySelector<HTMLElement>(`#${id}`);
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  };

  const heroReveal: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.1, delayChildren: 0.05 } },
  };
  const heroItem: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <main
      ref={scrollRef}
      className="h-[100svh] snap-y snap-proximity overflow-y-auto overflow-x-hidden scroll-smooth bg-[#0B0B0F] text-white antialiased"
    >
      <DeckRail active={active} onJump={jumpTo} />

      {/* header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => jumpTo("hero")}
            className={cx("rounded text-base font-extrabold tracking-[-0.02em] text-white", FOCUS)}
          >
            RE:픽
          </button>
          <span
            className={cx(
              "hidden text-[0.65rem] font-semibold uppercase text-[#A1A1AA] sm:block",
              TRACK_EYEBROW,
            )}
          >
            Proof Deck
          </span>
          <button type="button" onClick={() => jumpTo("cta")} className={CTA_GHOST}>
            매칭 시작
          </button>
        </nav>
      </header>

      {/* hero — slide 00 */}
      <section
        id="hero"
        data-slide
        aria-label="표지"
        className="flex min-h-[100svh] w-full snap-start items-center py-24"
      >
        <motion.div
          variants={heroReveal}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-[1120px] px-5 sm:px-8"
        >
          <motion.p
            variants={heroItem}
            className={cx("text-[0.7rem] font-semibold uppercase text-[#6E56CF]", TRACK_EYEBROW)}
          >
            Proof Deck · 데이터로 증명하는 중고 거래
          </motion.p>

          <motion.h1
            variants={heroItem}
            className="mt-6 max-w-[16ch] font-extrabold leading-[0.98] tracking-[-0.02em] text-white text-[clamp(2.5rem,11vw,3.75rem)] lg:text-[clamp(3.5rem,7vw,5.5rem)]"
          >
            느낌이 아니라
            <br />
            <span className="text-[#6E56CF]">숫자</span>로 고릅니다
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-6 max-w-xl text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
          >
            RE:픽의 AI는 취향·시세·컨디션을 수치로 검증합니다. 한 장씩 넘기며 우리가
            증명한 지표를 직접 확인하세요.
          </motion.p>

          <motion.div variants={heroItem} className="mt-8 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => jumpTo("cta")} className={CTA_PRIMARY}>
              무료로 매칭 받기
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <span className="text-xs font-normal text-[#A1A1AA]">
              1분 취향 설정 · 카드 등록 불필요
            </span>
          </motion.div>

          {/* perspective toggle + live proof chips */}
          <motion.div variants={heroItem} className="mt-12 border-t border-white/10 pt-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <PerspectiveToggle value={perspective} onChange={setPerspective} reduced={reduced} />
              <span
                className={cx(
                  "text-[0.65rem] font-semibold uppercase text-[#A1A1AA]",
                  TRACK_CAPTION,
                )}
              >
                아래로 스크롤 · {DECK_SLIDES.length}장의 증거
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PROOFS.map((proof) => {
                const v = proof[perspective];
                return (
                  <div
                    key={proof.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <p
                      className={cx(
                        "text-[0.6rem] font-semibold uppercase text-[#6E56CF]",
                        TRACK_EYEBROW,
                      )}
                    >
                      {proof.eyebrow}
                    </p>
                    <p
                      className={cx(
                        "mt-2 text-2xl font-extrabold tabular-nums text-white",
                        TRACK_STAT,
                      )}
                    >
                      {fmtValue(v)}
                    </p>
                    <p className="mt-1 text-xs font-normal text-[#A1A1AA]">{v.metric}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            variants={heroItem}
            aria-hidden
            className="mt-10 inline-flex items-center gap-2 text-[#A1A1AA]"
          >
            <motion.span
              animate={reduced ? undefined : { y: [0, 6, 0] }}
              transition={reduced ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-5 w-5" strokeWidth={2} />
            </motion.span>
            <span className={cx("text-[0.65rem] font-semibold uppercase", TRACK_CAPTION)}>
              첫 번째 증거
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* proof slides 01-03 */}
      {PROOFS.map((proof, i) => (
        <ProofSlide
          key={proof.id}
          proof={proof}
          perspective={perspective}
          index={i}
          containerRef={scrollRef}
          reduced={reduced}
        />
      ))}

      {/* product preview — carousel */}
      <section
        id="products"
        data-slide
        aria-label="선별 매물"
        className="flex min-h-[100svh] w-full snap-center items-center border-t border-white/10 py-24"
      >
        <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-10 max-w-2xl"
          >
            <p className={cx("text-[0.7rem] font-semibold uppercase text-[#6E56CF]", TRACK_EYEBROW)}>
              Fig. 04 — 선별 결과
            </p>
            <h2 className="mt-5 font-extrabold tracking-[-0.02em] text-white text-[clamp(2rem,7vw,2.75rem)] lg:text-[clamp(2.25rem,4vw,3rem)]">
              증거는 매물로 이어집니다
            </h2>
            <p className="mt-4 text-base font-normal leading-[1.6] text-[#A1A1AA]">
              모든 카드에는 AI가 왜 골랐는지가 적혀 있습니다. 밀어서 넘기거나 화살표로
              확인하세요 — 컨디션 등급, 인증 판매자, 시세 대비 할인율까지.
            </p>
          </motion.div>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.1 }}
          >
            <ProductCarousel reduced={reduced} />
          </motion.div>
        </div>
      </section>

      {/* summary — aggregate proof + pull quote */}
      <section
        id="summary"
        data-slide
        aria-label="신뢰 요약"
        className="flex min-h-[100svh] w-full snap-center items-center border-t border-white/10 bg-white/[0.015] py-24"
      >
        <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx("text-[0.7rem] font-semibold uppercase text-[#6E56CF]", TRACK_EYEBROW)}
          >
            Fig. 05 — 신뢰 요약
          </motion.p>

          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
            {AGGREGATES.map((a, i) => (
              <motion.div
                key={a.label}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : i * 0.1 }}
                className="border-t border-white/10 pt-5"
              >
                <div
                  className={cx(
                    "font-extrabold tabular-nums text-white text-[clamp(2.25rem,7vw,3.25rem)]",
                    TRACK_STAT,
                  )}
                >
                  <CountUp view={a} reduced={reduced} />
                </div>
                <p className="mt-2 text-sm font-normal text-[#A1A1AA]">{a.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.figure
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-16 max-w-3xl"
          >
            <Quote className="h-8 w-8 text-[#6E56CF]" strokeWidth={2} />
            <blockquote className="mt-5 text-2xl font-semibold leading-[1.4] tracking-[-0.02em] text-white sm:text-[1.75rem]">
              {"“"}수치가 다 적혀 있으니 의심할 게 없더라고요. 찜만 쌓아두던 습관이,
              이제는 열면 살 것만 있는 덱으로 바뀌었어요.{"”"}
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">김도윤</span> · 프리랜서 디자이너
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* final CTA */}
      <section
        id="cta"
        data-slide
        aria-label="시작하기"
        className="flex min-h-[100svh] w-full snap-center items-center border-t border-white/10 py-24"
      >
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto w-full max-w-[1120px] px-5 sm:px-8"
        >
          <p className={cx("text-[0.7rem] font-semibold uppercase text-[#6E56CF]", TRACK_EYEBROW)}>
            마지막 장
          </p>
          <h2 className="mt-5 max-w-[18ch] font-extrabold leading-[1.0] tracking-[-0.02em] text-white text-[clamp(2.25rem,8vw,3.25rem)] lg:text-[clamp(3rem,5vw,4.5rem)]">
            숫자를 확인했다면,
            <br />
            이제 받아볼 차례입니다
          </h2>
          <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
            취향 프로필을 만드는 데 1분이면 충분합니다. 그다음부터는 AI가 증명된
            기준으로 대신 골라둡니다.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => jumpTo("hero")}
              className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}
            >
              무료로 매칭 받기
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <span className="inline-flex items-center gap-1.5 text-xs font-normal text-[#A1A1AA]">
              <ShieldCheck className="h-4 w-4 text-[#6E56CF]" strokeWidth={2} />
              12단계 검수 · 안심 배송
            </span>
          </div>

          <footer className="mt-20 flex flex-col gap-2 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-base font-extrabold tracking-[-0.02em] text-white">RE:픽</span>
            <span className="text-xs font-normal text-[#A1A1AA]">
              AI가 다시 고르는 중고 · 2026 RE:PICK
            </span>
          </footer>
        </motion.div>
      </section>
    </main>
  );
}
