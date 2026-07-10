"use client";

import { useId, useState, useSyncExternalStore, type ComponentType } from "react";
import { motion, type Variants } from "framer-motion";
import { Gaegu, Baloo_2 } from "next/font/google";
import {
  Ticket,
  PenTool,
  Receipt,
  Star,
  Play,
  ArrowRight,
  Menu,
  X,
  Check,
  Moon,
  Sparkles,
  ShieldCheck,
  Quote,
  PartyPopper,
} from "lucide-react";
import "./f25.css";

const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mp-hand",
  display: "swap",
});

const baloo = Baloo_2({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-mp-ticket",
  display: "swap",
});

/* ---------------------------------------------------------------------- */
/* 접근성: prefers-reduced-motion 안전 구독 (matchMedia 직접 구독)             */
/* ---------------------------------------------------------------------- */

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
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

/* ---------------------------------------------------------------------- */
/* 몬스터 SVG — 손그림 크레용 블롭 몬스터 (전부 발명 일러스트, 사진 미사용)        */
/* ---------------------------------------------------------------------- */

const BLOB_A =
  "M50,4 C74,2 96,20 96,48 C96,74 78,96 50,96 C22,96 4,74 4,48 C4,20 26,6 50,4 Z";
const BLOB_B =
  "M52,2 C78,4 94,24 92,50 C90,76 70,98 44,96 C18,94 2,72 6,46 C10,22 28,0 52,2 Z";
const BLOB_C =
  "M48,0 C70,-4 98,10 100,36 C102,62 86,92 58,98 C30,104 2,84 2,54 C2,26 24,4 48,0 Z";

const MONSTER_FILL: Record<string, string> = {
  red: "#ff5a4e",
  blue: "#3d8bfd",
  green: "#06b67b",
  purple: "#8b5cf6",
  orange: "#ff9f45",
  pink: "#ff6fa5",
  yellow: "#ffc93c",
};

const MONSTER_ACCENT_CLASS: Record<string, string> = {
  red: "mp-accent-red",
  blue: "mp-accent-blue",
  green: "mp-accent-green",
  purple: "mp-accent-purple",
  orange: "mp-accent-orange",
  pink: "mp-accent-pink",
  yellow: "mp-accent-yellow",
};

type MonsterVisualProps = {
  color: keyof typeof MONSTER_FILL;
  blob: string;
  eyes: 1 | 2;
  horn?: boolean;
  spots?: boolean;
  teeth?: boolean;
  className?: string;
};

function MonsterVisual({ color, blob, eyes, horn, spots, teeth, className }: MonsterVisualProps) {
  const fill = MONSTER_FILL[color];
  return (
    <svg viewBox="-16 -16 132 132" className={className} aria-hidden="true" focusable="false">
      {horn && (
        <>
          <path d="M32,16 L37,-8 L46,18 Z" fill={fill} stroke="#241c15" strokeWidth={3} strokeLinejoin="round" />
          <path d="M58,16 L64,-9 L70,17 Z" fill={fill} stroke="#241c15" strokeWidth={3} strokeLinejoin="round" />
        </>
      )}
      <path d={blob} fill={fill} stroke="#241c15" strokeWidth={4} strokeLinejoin="round" />
      {spots && (
        <>
          <circle cx="28" cy="64" r="4.5" fill="#241c15" opacity="0.15" />
          <circle cx="70" cy="70" r="3.5" fill="#241c15" opacity="0.15" />
          <circle cx="74" cy="38" r="3.5" fill="#241c15" opacity="0.15" />
        </>
      )}
      {eyes === 2 ? (
        <>
          <circle cx="36" cy="46" r="10" fill="#fff7e8" stroke="#241c15" strokeWidth="2.5" />
          <circle cx="38" cy="47" r="4.5" fill="#241c15" />
          <circle cx="64" cy="44" r="10" fill="#fff7e8" stroke="#241c15" strokeWidth="2.5" />
          <circle cx="66" cy="45" r="4.5" fill="#241c15" />
        </>
      ) : (
        <>
          <circle cx="50" cy="45" r="15" fill="#fff7e8" stroke="#241c15" strokeWidth="2.5" />
          <circle cx="54" cy="46" r="6.5" fill="#241c15" />
        </>
      )}
      {teeth ? (
        <path
          d="M34,70 L38,79 L42,70 L46,79 L50,70 L54,79 L58,70 L62,79 L66,70"
          fill="none"
          stroke="#241c15"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path d="M36,70 Q50,84 64,70" fill="none" stroke="#241c15" strokeWidth="3.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

/* 낙서 별/달 장식 */
function DoodleStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <path
        d="M20 2 L24 15 L38 16 L27 25 L31 38 L20 30 L9 38 L13 25 L2 16 L16 15 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 20" preserveAspectRatio="none" className={className} aria-hidden="true" focusable="false">
      <path
        d="M2 14 Q 20 2, 38 14 T 74 14 T 110 14 T 146 14 T 182 14 T 218 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* 데이터                                                                  */
/* ---------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: "#how", label: "어떻게 하나요" },
  { href: "#gallery", label: "주차장 갤러리" },
  { href: "#reviews", label: "부모님 후기" },
  { href: "#pricing", label: "요금" },
  { href: "#faq", label: "FAQ" },
];

const STEPS: {
  n: string;
  title: string;
  desc: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  color: keyof typeof MONSTER_FILL;
}[] = [
  {
    n: "01",
    title: "그리기",
    desc: "아이가 침대 밑 괴물을 마음대로 그려요. 무섭게 그릴수록 좋아요.",
    icon: PenTool,
    color: "red",
  },
  {
    n: "02",
    title: "주차하기",
    desc: "몬스터파킹이 정식 주차권을 발급해요. 괴물은 오늘 밤 여기 얌전히 있어야 해요.",
    icon: Ticket,
    color: "blue",
  },
  {
    n: "03",
    title: "영수증 받기",
    desc: "아침이 되면 귀여운 출차 영수증이 도착해요. “간밤에 무사히 주차했습니다”",
    icon: Receipt,
    color: "green",
  },
];

const MONSTERS: {
  id: string;
  name: string;
  blob: string;
  color: keyof typeof MONSTER_FILL;
  eyes: 1 | 2;
  horn?: boolean;
  spots?: boolean;
  teeth?: boolean;
  ticket: string;
  note: string;
}[] = [
  { id: "p014", name: "뿅뿅이", blob: BLOB_A, color: "red", eyes: 2, horn: true, ticket: "P-014", note: "옷장 틈에 삽니다" },
  { id: "p027", name: "털복숭이 삼촌", blob: BLOB_B, color: "blue", eyes: 2, spots: true, teeth: true, ticket: "P-027", note: "양말 한쪽을 좋아해요" },
  { id: "p033", name: "이불 유령", blob: BLOB_C, color: "purple", eyes: 1, ticket: "P-033", note: "이불 속에서만 보여요" },
  { id: "p041", name: "초록 딸꾹이", blob: BLOB_A, color: "green", eyes: 2, horn: true, spots: true, ticket: "P-041", note: "딸꾹질을 참지 못해요" },
  { id: "p058", name: "소곤이", blob: BLOB_B, color: "orange", eyes: 2, teeth: true, ticket: "P-058", note: "속삭이는 걸 좋아해요" },
  { id: "p062", name: "뾰족이", blob: BLOB_C, color: "pink", eyes: 2, horn: true, ticket: "P-062", note: "셋이 항상 같이 다녀요" },
];

const TICKER_ITEMS = [
  "뿅뿅이 주차완료 ✅",
  "털복숭이 삼촌 주차완료 ✅",
  "이불 유령 주차완료 ✅",
  "초록 딸꾹이 주차완료 ✅",
  "소곤이 주차완료 ✅",
  "뾰족이 주차완료 ✅",
  "오늘 밤 대기 중인 괴물 3마리",
];

const REVIEWS: { name: string; role: string; quote: string; color: "red" | "blue" | "purple" }[] = [
  {
    name: "정하은",
    role: "7살 아이 엄마",
    quote: "매일 밤 울던 아이가 이제는 “오늘은 누구를 주차시킬까” 물어봐요.",
    color: "red",
  },
  {
    name: "김도윤",
    role: "5살 아이 아빠",
    quote: "무섭다는 말 대신 “주차권 어딨어?”라고 해요. 이 절차 하나가 육아를 바꿨어요.",
    color: "blue",
  },
  {
    name: "박서연",
    role: "6살 아이 엄마",
    quote: "그림 실력까지 늘었어요. 이제 우리 집엔 괴물 도감이 생겼답니다.",
    color: "purple",
  },
];

const FAQS = [
  {
    q: "정말 효과가 있나요?",
    a: "과학보다 ‘의식(ritual)’의 힘이에요. 반복되는 안전한 절차는 아이의 불안을 낮춘다고 많은 육아 전문가들이 말해요. 몬스터파킹은 그 절차를 아주 귀엽게 만들었을 뿐이에요.",
  },
  {
    q: "몇 살부터 쓸 수 있나요?",
    a: "4~9세 아이에게 가장 잘 맞아요. 그림을 그릴 수 있으면 누구나 괜찮아요.",
  },
  {
    q: "꼭 앱이 필요한가요?",
    a: "아니요! 종이와 크레파스만 있어도 충분해요. 앱은 영수증을 예쁘게 만들어줄 뿐, 완전히 선택이에요.",
  },
  {
    q: "괴물이 있다고 더 믿게 되지 않을까요?",
    a: "오히려 반대예요. ‘주차 절차’가 있다는 건 그 존재가 통제 가능하다는 뜻이거든요. 아이는 무서움 대신 힘을 얻어요.",
  },
  {
    q: "해지는 어떻게 하나요?",
    a: "설정 > 정기권 해지, 클릭 한 번이면 끝나요. 위약금도, 붙잡는 상담원도 없어요.",
  },
];

/* ---------------------------------------------------------------------- */
/* 모션 헬퍼                                                                */
/* ---------------------------------------------------------------------- */

function useFadeUp(reduced: boolean, y = 26): Variants {
  return reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      };
}

/* ---------------------------------------------------------------------- */
/* 메인 컴포넌트                                                            */
/* ---------------------------------------------------------------------- */

export default function F25Client() {
  const reduced = usePrefersReducedMotion();
  const fadeUp = useFadeUp(reduced);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  return (
    <div
      id="top"
      className={`${gaegu.variable} ${baloo.variable} monsterparking-theme mp-grain min-h-screen`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-[var(--mp-ink)] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-[var(--mp-cream)]"
      >
        본문으로 건너뛰기
      </a>

      {/* ---------------- 헤더 ---------------- */}
      <header className="mp-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-2 rounded-full">
            <span
              aria-hidden="true"
              className="-rotate-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[var(--mp-ink)] bg-[var(--mp-yellow)]"
            >
              <Ticket className="h-5 w-5 text-[var(--mp-ink)]" aria-hidden="true" />
            </span>
            <span className="mp-font-hand text-2xl font-bold leading-none text-[var(--mp-ink)]">
              몬스터파킹
            </span>
          </a>

          <nav aria-label="주요 메뉴" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2.5 text-sm font-bold text-[var(--mp-ink-soft)] transition-colors hover:text-[var(--mp-ink)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#pricing"
              className="mp-btn mp-btn-primary hidden items-center gap-1.5 px-5 py-2.5 text-sm font-bold md:inline-flex"
            >
              무료로 시작하기
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              className="mp-btn mp-btn-secondary flex h-11 w-11 items-center justify-center md:hidden"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id={menuId} aria-label="모바일 메뉴" className="mp-dashed-top border-t px-5 py-3 md:hidden">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center rounded-xl px-3 py-2.5 text-base font-bold text-[var(--mp-ink)] hover:bg-[var(--mp-cream-alt)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#pricing"
                  onClick={() => setMenuOpen(false)}
                  className="mp-btn mp-btn-primary mt-2 flex min-h-11 items-center justify-center gap-1.5 px-5 py-3 text-sm font-bold"
                >
                  무료로 시작하기
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main id="main">
        {/* ---------------- 히어로 ---------------- */}
        <section className="relative overflow-hidden px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:pt-24">
          <DoodleStar
            className="mp-float-a pointer-events-none absolute left-[6%] top-16 h-8 w-8 text-[var(--mp-red)] sm:left-[10%]"
          />
          <DoodleStar
            className="mp-float-b pointer-events-none absolute right-[8%] top-40 h-6 w-6 text-[var(--mp-blue)] sm:right-[14%]"
          />
          <Sparkles
            aria-hidden="true"
            className="mp-float-c pointer-events-none absolute right-[20%] top-10 h-7 w-7 text-[var(--mp-purple)]"
          />

          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <span className="mp-badge inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-wide">
                <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                취침 전 5분 루틴
              </span>

              <h1 className="mp-font-hand mt-5 text-4xl leading-[1.15] text-[var(--mp-ink)] sm:text-5xl lg:text-6xl">
                오늘 밤, 침대 밑 괴물에게
                <br />
                <span className="relative inline-block">
                  주차권
                  <Squiggle className="mp-squiggle-red pointer-events-none absolute -bottom-2 left-0 h-4 w-full" />
                </span>
                을 드려요
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--mp-ink-soft)] sm:text-lg">
                몬스터파킹은 아이가 무서워하는 침대 밑 괴물을 그리고, 이름 짓고, 정식으로{" "}
                <strong className="text-[var(--mp-ink)]">‘주차’</strong>시켜주는 잠자리 의식이에요. 무서움은
                절차가 되고, 절차는 웃음이 됩니다.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#pricing"
                  className="mp-btn mp-btn-primary inline-flex items-center gap-2 px-6 py-3.5 text-base font-bold"
                >
                  무료로 주차권 만들기
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href="#how"
                  className="mp-btn mp-btn-secondary inline-flex items-center gap-2 px-6 py-3.5 text-base font-bold"
                >
                  <Play className="h-5 w-5" aria-hidden="true" />
                  3분 데모 보기
                </a>
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <ul className="flex -space-x-3" aria-hidden="true">
                  <li className="mp-avatar-red flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--mp-cream)] text-xs font-extrabold text-[var(--mp-cream)]">
                    하은
                  </li>
                  <li className="mp-avatar-blue flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--mp-cream)] text-xs font-extrabold text-[var(--mp-cream)]">
                    도윤
                  </li>
                  <li className="mp-avatar-purple flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--mp-cream)] text-xs font-extrabold text-[var(--mp-cream)]">
                    서연
                  </li>
                </ul>
                <p className="text-sm font-bold text-[var(--mp-ink-soft)]">
                  이미 <span className="text-[var(--mp-ink)]">12,842대</span>의 괴물이 안전하게 주차 완료
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              className="relative mx-auto w-full max-w-sm lg:max-w-none"
            >
              <div className="mp-ticket mx-6 rounded-[2rem] p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="mp-font-ticket text-xs font-bold uppercase tracking-[0.2em] text-[var(--mp-ink-soft)]">
                    Monster Parking
                  </span>
                  <span className="mp-font-ticket text-xs font-extrabold text-[var(--mp-red-deep)]">P-014</span>
                </div>

                <div className="mt-4 flex justify-center">
                  <MonsterVisual color="red" blob={BLOB_A} eyes={2} horn className="h-40 w-40 sm:h-48 sm:w-48" />
                </div>

                <p className="mp-font-hand mt-3 text-center text-2xl text-[var(--mp-ink)]">뿅뿅이</p>

                <div className="mp-ticket-divider mt-5 flex items-center justify-between gap-4 pt-4 text-xs font-bold text-[var(--mp-ink-soft)]">
                  <span>입차 21:00</span>
                  <span aria-hidden="true">・</span>
                  <span>출차 07:00</span>
                </div>

                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-[var(--mp-green)]/15 py-2 text-xs font-extrabold text-[var(--mp-green-deep)]">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  오늘 밤 주차 확정
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ---------------- 스캘럽 전환 + 티커 ---------------- */}
        <div className="mp-scallop-into-ink" aria-hidden="true" />
        <div className="mp-night overflow-hidden py-3.5">
          <p className="sr-only">오늘 밤 기준 12,842대의 괴물이 몬스터파킹에 주차 완료했습니다.</p>
          <div className="mp-marquee-track flex w-max gap-10" aria-hidden="true">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="mp-font-hand whitespace-nowrap text-lg text-[var(--mp-cream)]">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="mp-scallop-into-paper" aria-hidden="true" />

        {/* ---------------- 어떻게 하나요 ---------------- */}
        <section id="how" aria-labelledby="how-heading" className="bg-[var(--mp-paper)] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="mp-badge inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide">
                3단계면 충분해요
              </span>
              <h2 id="how-heading" className="mp-font-hand mt-4 text-3xl text-[var(--mp-ink)] sm:text-4xl">
                무서움을 절차로 바꾸는 법
              </h2>
            </motion.div>

            <ol className="mt-12 grid gap-6 sm:grid-cols-3">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.li
                    key={step.n}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={fadeUp}
                    transition={reduced ? undefined : { delay: i * 0.1 }}
                    className={`mp-card ${i % 2 === 0 ? "rotate-1" : "-rotate-1"} rounded-3xl p-6`}
                  >
                    <div
                      className={`mp-font-ticket flex h-12 w-12 items-center justify-center rounded-full border-2 border-[var(--mp-ink)] text-lg font-extrabold ${MONSTER_ACCENT_CLASS[step.color]}`}
                    >
                      {step.n}
                    </div>
                    <Icon className="mt-4 h-6 w-6 text-[var(--mp-ink-soft)]" aria-hidden={true} />
                    <h3 className="mp-font-hand mt-2 text-2xl text-[var(--mp-ink)]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--mp-ink-soft)]">{step.desc}</p>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ---------------- 주차장 갤러리 ---------------- */}
        <section
          id="gallery"
          aria-labelledby="gallery-heading"
          className="mp-dashed-top border-t bg-[var(--mp-cream-alt)] px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="mp-badge inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide">
                오늘 밤 주차장 현황
              </span>
              <h2 id="gallery-heading" className="mp-font-hand mt-4 text-3xl text-[var(--mp-ink)] sm:text-4xl">
                이 친구들, 오늘 밤 여기 주차했어요
              </h2>
            </motion.div>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {MONSTERS.map((m, i) => (
                <motion.li
                  key={m.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fadeUp}
                  transition={reduced ? undefined : { delay: (i % 3) * 0.08 }}
                  className="mp-card rounded-3xl p-5"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`mp-font-ticket rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${MONSTER_ACCENT_CLASS[m.color]}`}
                    >
                      {m.ticket}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[var(--mp-green-deep)]">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      주차완료
                    </span>
                  </div>
                  <div className="mt-1 flex justify-center">
                    <MonsterVisual
                      color={m.color}
                      blob={m.blob}
                      eyes={m.eyes}
                      horn={m.horn}
                      spots={m.spots}
                      teeth={m.teeth}
                      className="h-32 w-32"
                    />
                  </div>
                  <h3 className="mp-font-hand mt-2 text-center text-xl text-[var(--mp-ink)]">{m.name}</h3>
                  <p className="mt-1 text-center text-sm text-[var(--mp-ink-soft)]">{m.note}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- 부모님 후기 ---------------- */}
        <section id="reviews" aria-labelledby="reviews-heading" className="bg-[var(--mp-paper)] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="mp-badge inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide">
                12,842가족이 검증했어요
              </span>
              <h2 id="reviews-heading" className="mp-font-hand mt-4 text-3xl text-[var(--mp-ink)] sm:text-4xl">
                오늘부터 우리 집 잠자리가 달라졌어요
              </h2>
            </motion.div>

            <ul className="mt-12 grid gap-6 sm:grid-cols-3">
              {REVIEWS.map((r, i) => (
                <motion.li
                  key={r.name}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={fadeUp}
                  transition={reduced ? undefined : { delay: i * 0.1 }}
                  className={`mp-card ${i === 1 ? "rotate-1" : "-rotate-1"} flex flex-col rounded-3xl p-6`}
                >
                  <Quote className="h-6 w-6 text-[var(--mp-ink-soft)]" aria-hidden="true" />
                  <blockquote className="mt-3 flex-1 text-base leading-relaxed text-[var(--mp-ink)]">
                    “{r.quote}”
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`mp-avatar-${r.color} flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold text-[var(--mp-cream)]`}
                    >
                      {r.name.slice(0, 1)}
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-[var(--mp-ink)]">{r.name}</p>
                      <p className="text-xs text-[var(--mp-ink-soft)]">{r.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5" role="img" aria-label="별점 5점 만점에 5점">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-[var(--mp-yellow)] text-[var(--mp-yellow)]" aria-hidden="true" />
                    ))}
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- 요금 ---------------- */}
        <section
          id="pricing"
          aria-labelledby="pricing-heading"
          className="mp-dashed-top border-t bg-[var(--mp-cream)] px-5 py-20 sm:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              className="mx-auto max-w-2xl text-center"
            >
              <span className="mp-badge inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide">
                부담 없이 시작해요
              </span>
              <h2 id="pricing-heading" className="mp-font-hand mt-4 text-3xl text-[var(--mp-ink)] sm:text-4xl">
                주차장은 원래 무료입니다
              </h2>
            </motion.div>

            <ul className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
              <motion.li
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                className="mp-ticket -rotate-1 rounded-[2rem] p-7"
              >
                <h3 className="mp-font-hand text-2xl text-[var(--mp-ink)]">방문 주차권</h3>
                <p className="mt-2">
                  <span className="mp-font-ticket text-4xl font-extrabold text-[var(--mp-ink)]">0원</span>
                  <span className="text-sm font-bold text-[var(--mp-ink-soft)]"> / 평생 무료</span>
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-[var(--mp-ink-soft)]">
                  {["하루 1대 주차", "기본 출차 영수증", "주차장 갤러리 열람"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[var(--mp-green-deep)]" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#top"
                  className="mp-btn mp-btn-secondary mt-6 flex items-center justify-center px-5 py-3 text-sm font-bold"
                >
                  무료로 시작
                </a>
              </motion.li>

              <motion.li
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                transition={reduced ? undefined : { delay: 0.1 }}
                className="mp-ticket rotate-1 relative rounded-[2rem] p-7"
              >
                <span className="mp-font-ticket absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border-2 border-[var(--mp-ink)] bg-[var(--mp-yellow)] px-4 py-1 text-xs font-extrabold text-[var(--mp-ink)]">
                  인기 만점
                </span>
                <h3 className="mp-font-hand text-2xl text-[var(--mp-ink)]">패밀리 정기권</h3>
                <p className="mt-2">
                  <span className="mp-font-ticket text-4xl font-extrabold text-[var(--mp-ink)]">4,900원</span>
                  <span className="text-sm font-bold text-[var(--mp-ink-soft)]"> / 월</span>
                </p>
                <ul className="mt-5 space-y-2.5 text-sm text-[var(--mp-ink-soft)]">
                  {["무제한 주차", "손글씨 커스텀 영수증", "우리 집 괴물 도감 PDF", "우선 상담 지원"].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-[var(--mp-green-deep)]" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#top"
                  className="mp-btn mp-btn-primary mt-6 flex items-center justify-center px-5 py-3 text-sm font-bold"
                >
                  정기권 구독하기
                </a>
              </motion.li>
            </ul>

            <p className="mt-6 text-center text-xs font-bold text-[var(--mp-ink-soft)]">
              언제든 해지할 수 있어요. 위약금 없음. 계약서도 없음 — 원래 이런 거 안 좋아하잖아요.
            </p>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section id="faq" aria-labelledby="faq-heading" className="mp-dashed-top border-t bg-[var(--mp-paper)] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              className="text-center"
            >
              <span className="mp-badge inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-wide">
                궁금한 점이 있나요
              </span>
              <h2 id="faq-heading" className="mp-font-hand mt-4 text-3xl text-[var(--mp-ink)] sm:text-4xl">
                자주 묻는 질문
              </h2>
            </motion.div>

            <ul className="mt-10 space-y-4">
              {FAQS.map((f) => (
                <li key={f.q}>
                  <details className="mp-faq-item group rounded-2xl px-5 py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-base font-extrabold text-[var(--mp-ink)]">
                      {f.q}
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[var(--mp-ink)] text-sm font-bold transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--mp-ink-soft)]">{f.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- 최종 CTA ---------------- */}
        <section aria-labelledby="cta-heading" className="mp-night relative overflow-hidden px-5 py-20 sm:px-8">
          <DoodleStar className="mp-float-a pointer-events-none absolute left-[10%] top-10 h-7 w-7 text-[var(--mp-yellow)]" />
          <DoodleStar className="mp-float-b pointer-events-none absolute right-[12%] bottom-12 h-8 w-8 text-[var(--mp-pink)]" />
          <PartyPopper
            aria-hidden="true"
            className="mp-float-c pointer-events-none absolute right-[24%] top-16 h-7 w-7 text-[var(--mp-green)]"
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="relative mx-auto max-w-2xl text-center"
          >
            <h2 id="cta-heading" className="mp-font-hand text-3xl text-[var(--mp-cream)] sm:text-4xl">
              오늘 밤부터 시작해볼까요?
            </h2>
            <p className="mt-4 text-base text-[color:rgba(255,247,232,0.78)]">
              크레파스 한 자루면 충분해요. 오늘의 무서움을 오늘 밤 안에 주차시켜 보세요.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#pricing"
                className="mp-btn inline-flex items-center gap-2 border-2 border-[var(--mp-cream)] bg-[var(--mp-yellow)] px-6 py-3.5 text-base font-bold text-[var(--mp-ink)]"
              >
                무료로 주차권 만들기
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="#gallery"
                className="mp-btn inline-flex items-center gap-2 border-2 border-[var(--mp-cream)] bg-transparent px-6 py-3.5 text-base font-bold text-[var(--mp-cream)]"
              >
                갤러리 구경하기
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ---------------- 푸터 ---------------- */}
      <footer className="mp-night border-t border-[color:rgba(255,247,232,0.15)] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="-rotate-6 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--mp-cream)] bg-[var(--mp-yellow)]"
                >
                  <Ticket className="h-4 w-4 text-[var(--mp-ink)]" aria-hidden="true" />
                </span>
                <span className="mp-font-hand text-xl text-[var(--mp-cream)]">몬스터파킹</span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[color:rgba(255,247,232,0.7)]">
                무서움을 절차로, 절차를 웃음으로. 오늘 밤도 안전한 주차 부탁드려요.
              </p>
            </div>

            <nav aria-label="서비스 링크">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[color:rgba(255,247,232,0.55)]">
                서비스
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-block min-h-11 py-1.5 text-[color:rgba(255,247,232,0.85)] hover:text-[var(--mp-cream)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[color:rgba(255,247,232,0.55)]">
                문의
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li>
                  <a
                    href="mailto:hello@monsterparking.kr"
                    className="inline-block min-h-11 py-1.5 text-[color:rgba(255,247,232,0.85)] hover:text-[var(--mp-cream)]"
                  >
                    hello@monsterparking.kr
                  </a>
                </li>
                <li className="py-1.5 text-[color:rgba(255,247,232,0.85)]">평일 10:00–18:00</li>
              </ul>
            </div>
          </div>

          <div className="mp-dashed-top mt-10 flex flex-col gap-2 border-t border-[color:rgba(255,247,232,0.15)] pt-6 text-xs text-[color:rgba(255,247,232,0.6)] sm:flex-row sm:items-center sm:justify-between">
            <p>ⓒ 2026 MonsterParking Inc. 이 페이지의 모든 괴물은 상상 속에만 존재합니다.</p>
            <p>실제로 주차되지 않으니 안심하세요 (아마도).</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
