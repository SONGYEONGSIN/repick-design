"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Press_Start_2P, VT323 } from "next/font/google";
import {
  Coins,
  Swords,
  Trophy,
  MapPin,
  Timer,
  ArrowRight,
  CircleCheck,
} from "lucide-react";
import "./f17.css";

const pixelDisplay = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
});

const pixelMono = VT323({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dot",
});

/* ----------------------------------------------------------------------
 * Reduced-motion detection
 * Uses matchMedia + useSyncExternalStore directly instead of framer-motion's
 * useReducedMotion() (unreliable OS-setting detection in some environments).
 * Server snapshot defaults to `false` (motion allowed) so scroll-reveal
 * targets always resolve to opacity:1 — only the *duration* is shortened
 * for reduced motion, never the target itself, so content can never get
 * stuck invisible.
 * ------------------------------------------------------------------- */
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

// Scroll-reveal helper. Content is ALWAYS opacity:1 by default — only a
// small translateY is animated on scroll-into-view. Unlike an opacity-0
// initial state, this guarantees the page is fully readable even if
// IntersectionObserver never fires (JS disabled/slow, non-scrolling
// screenshot tools, etc.) — worst case a section simply sits ~16px off
// its resting position instead of vanishing entirely.
function fadeUp(reduced: boolean, delay = 0) {
  return {
    initial: { y: reduced ? 0 : 16 },
    whileInView: { y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  };
}

/* ----------------------------------------------------------------------
 * Pixel art engine — every icon on this page is hand-drawn as a CSS grid
 * of colored <span> cells from a numeric matrix. No SVG icon set was used
 * for the sprites; only lucide-react supplies small supporting glyphs.
 * ------------------------------------------------------------------- */
type PixelGrid = number[][];

function PixelArt({
  grid,
  palette,
  pixelSize = 4,
  label,
  className = "",
}: {
  grid: PixelGrid;
  palette: string[];
  pixelSize?: number;
  label?: string;
  className?: string;
}) {
  const cols = grid[0]?.length ?? 0;
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-grid shrink-0 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)`,
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <span
            key={`${y}-${x}`}
            style={{
              width: pixelSize,
              height: pixelSize,
              backgroundColor: cell === 0 ? "transparent" : palette[cell - 1],
            }}
          />
        )),
      )}
    </div>
  );
}

const SPRITE_COIN: PixelGrid = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [1, 2, 2, 3, 3, 2, 2, 1],
  [1, 2, 3, 3, 3, 3, 2, 1],
  [1, 2, 3, 3, 3, 3, 2, 1],
  [1, 2, 2, 3, 3, 2, 2, 1],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
];
const PALETTE_GOLD = ["#8a5a00", "#ffd23f", "#fff2b8"];

const SPRITE_GHOST: PixelGrid = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 2, 2, 1, 2, 2, 1],
  [1, 1, 2, 3, 1, 2, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
];
const PALETTE_GHOST_COFFEE = ["#6b3a1f", "#f5f2ff", "#0a0714"];
const PALETTE_GHOST_GREASE = ["#5c4a12", "#f5f2ff", "#0a0714"];
const PALETTE_GHOST_MUD = ["#4a3322", "#f5f2ff", "#0a0714"];

const SPRITE_WASHER: PixelGrid = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 2, 0, 3, 3, 3, 3, 0, 2, 1],
  [1, 2, 0, 3, 4, 4, 3, 0, 2, 1],
  [1, 2, 0, 3, 4, 4, 3, 0, 2, 1],
  [1, 2, 0, 3, 3, 3, 3, 0, 2, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const PALETTE_WASHER = ["#241a44", "#3a2c66", "#5a3fa6", "#31f1ff"];

const SPRITE_SHIRT: PixelGrid = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
];
const PALETTE_SHIRT_CYAN = ["#31f1ff"];
const PALETTE_SHIRT_MAGENTA = ["#ff3fb5"];
const PALETTE_SHIRT_GOLD = ["#ffd23f"];

/* ---------------------------------------------------------------- */

function PixelMeter({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-[13px] text-[var(--qw-ink-dim)]">{label}</span>
      <div className="flex gap-1" role="img" aria-label={`${label} ${value}/${max}`}>
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="qw-pixel-corners-sm h-3 w-4"
            style={{
              backgroundColor: i < value ? "var(--qw-cyan)" : "var(--qw-line)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function BossCard({
  name,
  stain,
  weakness,
  palette,
  hp,
  reduced,
  delay,
}: {
  name: string;
  stain: string;
  weakness: string;
  palette: string[];
  hp: number;
  reduced: boolean;
  delay: number;
}) {
  return (
    <motion.li
      {...fadeUp(reduced, delay)}
      className="qw-pixel-corners flex flex-col gap-4 border border-[var(--qw-line)] bg-[var(--qw-panel)] p-6"
    >
      <div className="flex items-center gap-4">
        <PixelArt grid={SPRITE_GHOST} palette={palette} pixelSize={6} label={`${name} 픽셀 아이콘`} />
        <div>
          <p className="text-[11px] tracking-[0.2em] text-[var(--qw-magenta-soft)]">BOSS · {stain}</p>
          <h3 className="mt-1 font-[family-name:var(--font-pixel)] text-[13px] leading-relaxed text-[var(--qw-ink)]">
            {name}
          </h3>
        </div>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between text-[12px] text-[var(--qw-ink-dim)]">
          <span>HP</span>
          <span className="font-[family-name:var(--font-dot)] text-[18px] text-[var(--qw-ink)]">
            {hp}%
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden border border-[var(--qw-line)] bg-[var(--qw-bg-2)]" aria-hidden="true">
          <motion.div
            className="h-full bg-[var(--qw-red)]"
            initial={{ width: "100%" }}
            whileInView={{ width: `${hp}%` }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: reduced ? 0 : 1.2, delay: reduced ? 0 : delay + 0.2, ease: "easeOut" }}
          />
        </div>
      </div>
      <p className="text-[14px] leading-relaxed text-[var(--qw-ink-dim)]">
        약점: <span className="text-[var(--qw-cyan-soft)]">{weakness}</span>
      </p>
    </motion.li>
  );
}

const bosses = [
  {
    name: "카페인 고스트",
    stain: "커피 얼룩",
    weakness: "저온 산소 세탁 사이클",
    palette: PALETTE_GHOST_COFFEE,
    hp: 12,
  },
  {
    name: "그리스 슬라임",
    stain: "기름때",
    weakness: "고온 강력 세탁 사이클",
    palette: PALETTE_GHOST_GREASE,
    hp: 8,
  },
  {
    name: "머드 크리처",
    stain: "흙탕물",
    weakness: "예비세탁 + 헹굼 2회",
    palette: PALETTE_GHOST_MUD,
    hp: 15,
  },
];

const steps = [
  {
    n: "STEP 01",
    title: "코인 투입",
    desc: "앱에서 코인을 충전하고 가까운 캐비닛(세탁기)에 스마트폰을 태그하세요.",
    icon: <PixelArt grid={SPRITE_COIN} palette={PALETTE_GOLD} pixelSize={6} label="코인 아이콘" />,
  },
  {
    n: "STEP 02",
    title: "스타트",
    desc: "빨래를 넣고 스타트 버튼! 그 순간부터 보스전이 시작됩니다.",
    icon: <PixelArt grid={SPRITE_WASHER} palette={PALETTE_WASHER} pixelSize={5} label="세탁기 아이콘" />,
  },
  {
    n: "STEP 03",
    title: "클리어",
    desc: "세탁 완료 = 보스 처치. 경험치와 하이스코어가 자동으로 쌓여요.",
    icon: <PixelArt grid={SPRITE_SHIRT} palette={PALETTE_SHIRT_CYAN} pixelSize={6} label="완료된 옷 아이콘" />,
  },
];

const tiers = [
  {
    name: "ROOKIE",
    price: "무료 체험",
    cycles: "월 1회 무료 사이클",
    stats: { speed: 2, scent: 3, care: 2 },
    tag: null,
  },
  {
    name: "PRO",
    price: "19,900원 / 월",
    cycles: "월 8회 사이클",
    stats: { speed: 4, scent: 4, care: 3 },
    tag: "MOST PLAYED",
  },
  {
    name: "LEGEND",
    price: "39,900원 / 월",
    cycles: "무제한 사이클",
    stats: { speed: 5, scent: 5, care: 5 },
    tag: "ALL BOSSES",
  },
];

const scores = [
  {
    rank: 1,
    tag: "MIN",
    score: "128,900",
    quote: "빨래방이 이렇게 재밌어도 되나요? 진짜 게임처럼 세탁해요.",
    name: "김민지 · 3개월째 플레이 중",
  },
  {
    rank: 2,
    tag: "JHO",
    score: "099,200",
    quote: "보스전 HP바 보는 재미로 빨래 미루는 습관이 없어졌어요.",
    name: "이정호 · 레벨 PRO",
  },
  {
    rank: 3,
    tag: "SYU",
    score: "087,650",
    quote: "동전 넣는 손맛이 진짜 오락실 같아요. 아이도 좋아해요.",
    name: "박서윤 · 레벨 LEGEND",
  },
];

const NAV_LINKS = [
  { href: "#how-to-play", label: "게임방법" },
  { href: "#boss-battle", label: "보스전" },
  { href: "#level-select", label: "레벨선택" },
  { href: "#high-score", label: "하이스코어" },
];

// NOTE: deliberately no base `outline-none` here. Tailwind v4's outline
// utilities all read the shared `--tw-outline-style` custom property; an
// unconditional `outline-none` on the element permanently pins that
// variable to "none", which silently defeats `focus-visible:outline`
// (verified in a real browser — the ring never appeared). Only styling
// the `:focus-visible` state, and letting the browser's native
// (invisible-until-focused) default handle everything else, avoids the
// clash entirely.
const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--qw-cyan)] focus-visible:outline-offset-2";

export default function F17Client() {
  const reduced = useReducedMotionSafe();

  return (
    <div className={`${pixelDisplay.variable} ${pixelMono.variable} qw min-h-screen`}>
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--qw-gold)] focus:px-4 focus:py-3 focus:text-[13px] focus:font-bold focus:text-[#160b02] ${focusRing}`}
      >
        본문으로 바로가기
      </a>

      {/* ---------------- NAV ---------------- */}
      <header className="sticky top-0 z-40 border-b border-[var(--qw-line)] bg-[var(--qw-bg)]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3" aria-label="주 메뉴">
          <a href="#main" className={`flex items-center gap-2 ${focusRing}`}>
            <PixelArt grid={SPRITE_COIN} palette={PALETTE_GOLD} pixelSize={3} label="" />
            <span className="font-[family-name:var(--font-pixel)] text-[12px] tracking-wide text-[var(--qw-ink)]">
              QUARTER WASH
            </span>
          </a>
          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`text-[14px] text-[var(--qw-ink-dim)] transition-colors hover:text-[var(--qw-cyan)] ${focusRing}`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#level-select"
            className={`qw-pixel-corners-sm flex min-h-[44px] items-center gap-2 bg-[var(--qw-gold)] px-4 text-[13px] font-bold text-[#160b02] transition-transform hover:-translate-y-0.5 ${focusRing}`}
          >
            <Coins aria-hidden="true" className="h-4 w-4" />
            PLAY NOW
          </a>
        </nav>
      </header>

      <main id="main">
        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden border-b border-[var(--qw-line)] px-5 pb-20 pt-14 sm:pt-20">
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <Image
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1800&q=60"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--qw-bg)] via-[var(--qw-bg)]/70 to-[var(--qw-bg)]" />
          </div>

          <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 text-center">
            <p className="flex items-center gap-2 text-[12px] tracking-[0.3em] text-[var(--qw-cyan)]">
              <span className="qw-flicker inline-block h-2 w-2 bg-[var(--qw-cyan)]" aria-hidden="true" />
              ARCADE MODE: ON
            </p>

            <h1 className="qw-glow-pulse font-[family-name:var(--font-pixel)] text-[34px] leading-relaxed text-[var(--qw-magenta)] sm:text-[52px]">
              QUARTER
              <br className="sm:hidden" /> WASH
            </h1>

            <p className="font-[family-name:var(--font-pixel)] text-[13px] leading-loose text-[var(--qw-cyan-soft)] sm:text-[16px]">
              INSERT COIN. PRESS START. GET CLEAN.
            </p>

            <p className="max-w-xl text-[16px] leading-relaxed text-[var(--qw-ink-dim)]">
              얼룩은 몬스터, 세탁기는 아케이드 캐비닛. 동전 하나 넣고 스타트 버튼을 누르면
              당신의 빨래는 8비트 모험이 됩니다.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#level-select"
                className={`qw-pixel-corners flex min-h-[52px] items-center gap-2 bg-[var(--qw-gold)] px-6 text-[14px] font-bold text-[#160b02] transition-transform hover:-translate-y-0.5 ${focusRing}`}
              >
                <span className="qw-blink" aria-hidden="true">
                  ▶
                </span>
                PRESS START
              </a>
              <a
                href="#how-to-play"
                className={`qw-pixel-corners flex min-h-[52px] items-center gap-2 border border-[var(--qw-cyan)] px-6 text-[14px] font-bold text-[var(--qw-cyan)] transition-transform hover:-translate-y-0.5 ${focusRing}`}
              >
                코인 넣는 법 보기
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>

            {/* CRT cabinet screen */}
            <div className="qw-crt qw-pixel-corners relative mt-6 w-full max-w-3xl border-4 border-[var(--qw-panel-2)] bg-[var(--qw-bg-2)] p-6 sm:p-10">
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="flex flex-wrap items-center justify-center gap-6 font-[family-name:var(--font-dot)] text-[22px] text-[var(--qw-ink)] sm:text-[26px]">
                  <span>1UP&nbsp; SCORE&nbsp; 000000</span>
                  <span className="text-[var(--qw-gold)]">HI-SCORE&nbsp; 128900</span>
                </div>
                <PixelArt
                  grid={SPRITE_COIN}
                  palette={PALETTE_GOLD}
                  pixelSize={10}
                  label="스핀하는 동전 아이콘"
                  className="qw-bob qw-coin-flip"
                />
                <p className="flex items-center gap-3 font-[family-name:var(--font-dot)] text-[18px] text-[var(--qw-ink-dim)]">
                  대기 중인 빨래
                  <span className="flex gap-1">
                    <PixelArt grid={SPRITE_SHIRT} palette={PALETTE_SHIRT_MAGENTA} pixelSize={3} label="" />
                    <PixelArt grid={SPRITE_SHIRT} palette={PALETTE_SHIRT_CYAN} pixelSize={3} label="" />
                    <PixelArt grid={SPRITE_SHIRT} palette={PALETTE_SHIRT_GOLD} pixelSize={3} label="" />
                  </span>
                  ×3
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- HOW TO PLAY ---------------- */}
        <section id="how-to-play" className="border-b border-[var(--qw-line)] px-5 py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div {...fadeUp(reduced)} className="mb-12 text-center">
              <p className="text-[12px] tracking-[0.3em] text-[var(--qw-magenta-soft)]">HOW TO PLAY</p>
              <h2 className="mt-3 font-[family-name:var(--font-pixel)] text-[20px] leading-relaxed text-[var(--qw-ink)] sm:text-[26px]">
                게임 방법
              </h2>
            </motion.div>
            <ol className="grid gap-6 sm:grid-cols-3">
              {steps.map((s, i) => (
                <motion.li
                  key={s.n}
                  {...fadeUp(reduced, i * 0.12)}
                  className="qw-pixel-corners flex flex-col items-center gap-4 border border-[var(--qw-line)] bg-[var(--qw-panel)] p-8 text-center"
                >
                  <span className="font-[family-name:var(--font-pixel)] text-[11px] text-[var(--qw-gold)]">{s.n}</span>
                  {s.icon}
                  <h3 className="font-[family-name:var(--font-pixel)] text-[13px] text-[var(--qw-ink)]">{s.title}</h3>
                  <p className="text-[15px] leading-relaxed text-[var(--qw-ink-dim)]">{s.desc}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- BOSS BATTLE ---------------- */}
        <section id="boss-battle" className="border-b border-[var(--qw-line)] px-5 py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div {...fadeUp(reduced)} className="mb-4 text-center">
              <p className="flex items-center justify-center gap-2 text-[12px] tracking-[0.3em] text-[var(--qw-magenta-soft)]">
                <Swords aria-hidden="true" className="h-4 w-4" />
                BOSS BATTLE
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-pixel)] text-[20px] leading-relaxed text-[var(--qw-ink)] sm:text-[26px]">
                보스전
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--qw-ink-dim)]">
                당신의 빨래에 숨은 3대 보스입니다. 모두 QUARTER WASH 세탁 사이클로 처치할 수 있어요.
              </p>
            </motion.div>
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {bosses.map((b, i) => (
                <BossCard key={b.name} {...b} reduced={reduced} delay={i * 0.12} />
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- LEVEL SELECT ---------------- */}
        <section id="level-select" className="border-b border-[var(--qw-line)] px-5 py-20">
          <div className="mx-auto max-w-6xl">
            <motion.div {...fadeUp(reduced)} className="mb-12 text-center">
              <p className="flex items-center justify-center gap-2 text-[12px] tracking-[0.3em] text-[var(--qw-magenta-soft)]">
                <Trophy aria-hidden="true" className="h-4 w-4" />
                LEVEL SELECT
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-pixel)] text-[20px] leading-relaxed text-[var(--qw-ink)] sm:text-[26px]">
                레벨 선택
              </h2>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-3">
              {tiers.map((t, i) => (
                <motion.article key={t.name} {...fadeUp(reduced, i * 0.12)} className="relative">
                  {t.tag && (
                    <span className="qw-pixel-corners-sm absolute -top-3 left-7 z-10 bg-[var(--qw-cyan)] px-2 py-1 text-[10px] font-bold text-[#04222a]">
                      {t.tag}
                    </span>
                  )}
                  <div
                    className={`qw-pixel-corners flex h-full flex-col gap-5 border p-7 ${
                      t.tag === "MOST PLAYED"
                        ? "border-[var(--qw-cyan)] bg-[var(--qw-panel-2)]"
                        : "border-[var(--qw-line)] bg-[var(--qw-panel)]"
                    }`}
                  >
                    <h3 className="font-[family-name:var(--font-pixel)] text-[18px] text-[var(--qw-ink)]">{t.name}</h3>
                    <p className="font-[family-name:var(--font-dot)] text-[24px] text-[var(--qw-gold)]">{t.price}</p>
                    <p className="text-[14px] text-[var(--qw-ink-dim)]">{t.cycles}</p>
                    <div className="flex flex-col gap-2 border-t border-[var(--qw-line)] pt-4">
                      <PixelMeter label="속도" value={t.stats.speed} />
                      <PixelMeter label="향기" value={t.stats.scent} />
                      <PixelMeter label="케어" value={t.stats.care} />
                    </div>
                    <a
                      href="#continue"
                      className={`qw-pixel-corners-sm mt-2 flex min-h-[44px] items-center justify-center gap-2 bg-[var(--qw-gold)] px-4 text-[13px] font-bold text-[#160b02] transition-transform hover:-translate-y-0.5 ${focusRing}`}
                    >
                      SELECT
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- HIGH SCORE ---------------- */}
        <section id="high-score" className="border-b border-[var(--qw-line)] px-5 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div {...fadeUp(reduced)} className="mb-10 text-center">
              <p className="text-[12px] tracking-[0.3em] text-[var(--qw-magenta-soft)]">HIGH SCORE</p>
              <h2 className="mt-3 font-[family-name:var(--font-pixel)] text-[20px] leading-relaxed text-[var(--qw-ink)] sm:text-[26px]">
                하이스코어
              </h2>
            </motion.div>
            <ol className="qw-pixel-corners divide-y divide-[var(--qw-line)] border border-[var(--qw-line)] bg-[var(--qw-panel)]">
              {scores.map((s, i) => (
                <motion.li key={s.tag} {...fadeUp(reduced, i * 0.1)} className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:gap-6">
                  <div className="flex items-center gap-4 sm:w-56 sm:shrink-0">
                    <span className="font-[family-name:var(--font-pixel)] text-[16px] text-[var(--qw-gold)]">
                      {String(s.rank).padStart(2, "0")}
                    </span>
                    <span className="font-[family-name:var(--font-pixel)] text-[13px] text-[var(--qw-cyan)]">
                      {s.tag}
                    </span>
                    <span className="font-[family-name:var(--font-dot)] text-[24px] text-[var(--qw-ink)]">
                      {s.score}
                    </span>
                  </div>
                  <div>
                    <p className="text-[15px] leading-relaxed text-[var(--qw-ink)]">“{s.quote}”</p>
                    <p className="mt-1 text-[13px] text-[var(--qw-ink-dim)]">{s.name}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- CONTINUE ---------------- */}
        <section id="continue" className="px-5 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
            <motion.div {...fadeUp(reduced)}>
              <p className="flex items-center gap-2 text-[12px] tracking-[0.3em] text-[var(--qw-magenta-soft)]">
                <Timer aria-hidden="true" className="h-4 w-4" />
                GAME OVER? NO —
              </p>
              <h2 className="qw-glow-pulse mt-3 font-[family-name:var(--font-pixel)] text-[26px] leading-relaxed text-[var(--qw-magenta)] sm:text-[34px]">
                CONTINUE?
              </h2>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[var(--qw-ink-dim)]">
                가까운 QUARTER WASH 캐비닛에 코인을 넣고 세탁 모험을 이어가세요. 지금 시작하면
                첫 사이클은 무료 코인으로 플레이할 수 있어요.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#level-select"
                  className={`qw-pixel-corners flex min-h-[52px] items-center gap-2 bg-[var(--qw-gold)] px-6 text-[14px] font-bold text-[#160b02] transition-transform hover:-translate-y-0.5 ${focusRing}`}
                >
                  <Coins aria-hidden="true" className="h-4 w-4" />
                  코인 넣고 계속하기
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-3" aria-label="운영 지역">
                {["성수", "연남", "잠실", "홍대"].map((area) => (
                  <li
                    key={area}
                    className="qw-pixel-corners-sm flex items-center gap-1.5 border border-[var(--qw-line)] px-3 py-2 text-[13px] text-[var(--qw-ink-dim)]"
                  >
                    <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-[var(--qw-cyan)]" />
                    {area}점
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.figure
              {...fadeUp(reduced, 0.1)}
              className="qw-pixel-corners overflow-hidden border-4 border-[var(--qw-panel-2)]"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1521656693074-0ef32e80a5d5?auto=format&fit=crop&w=1200&q=70"
                  alt="세탁기가 두 줄로 늘어서 있고 빨래 카트들이 통로에 놓인 코인 빨래방 내부"
                  fill
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--qw-bg)] via-transparent to-transparent" />
              </div>
              <figcaption className="flex items-center gap-2 bg-[var(--qw-panel)] px-4 py-3 text-[13px] text-[var(--qw-ink-dim)]">
                <CircleCheck aria-hidden="true" className="h-4 w-4 text-[var(--qw-cyan)]" />
                실제 QUARTER WASH 아케이드 플로어
              </figcaption>
            </motion.figure>
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-[var(--qw-line)] px-5 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <PixelArt grid={SPRITE_COIN} palette={PALETTE_GOLD} pixelSize={3} label="" />
              <span className="font-[family-name:var(--font-pixel)] text-[12px] text-[var(--qw-ink)]">
                QUARTER WASH
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-[var(--qw-ink-dim)]">
              동전 하나로 시작하는 세탁 아케이드. 얼룩은 몬스터, 세탁기는 캐비닛.
            </p>
          </div>
          <nav aria-label="바닥글 메뉴">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`text-[14px] text-[var(--qw-ink-dim)] transition-colors hover:text-[var(--qw-cyan)] ${focusRing}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-[13px] text-[var(--qw-ink-dim)]">
            <p>인스타그램 · 카카오채널</p>
            <p className="mt-1">문의: hello@quarterwash.game</p>
            <p className="mt-4 text-[12px]">© 2026 QUARTER WASH ARCADE LAUNDRY. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
