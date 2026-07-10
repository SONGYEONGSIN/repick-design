"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import Image from "next/image";
import { motion, useInView, animate } from "framer-motion";
import { Gowun_Batang, Gaegu } from "next/font/google";
import {
  Moon,
  CloudFog,
  Sun,
  Star,
  Sparkles,
  Landmark,
  TrendingUp,
  Wallet,
  ShieldOff,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Pause,
  Play,
  Gift,
  CalendarClock,
} from "lucide-react";
import "./f16.css";

const gowunBatang = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ms-display",
  display: "swap",
});

const gaegu = Gaegu({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ms-hand",
  display: "swap",
});

/* ──────────────────────────────────────────────────────────────
 * 모션 축소 감지 — matchMedia를 useSyncExternalStore로 직접 구독한다.
 * 초기값은 항상 false(모션 허용)로 두어, 감지 실패 시에도 콘텐츠가
 * opacity:0 상태로 영구히 숨는 사고를 방지한다.
 * ──────────────────────────────────────────────────────────────*/
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOTION_QUERY).matches;
}

function useReducedMotionSafe() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

/* ──────────────────────────────────────────────────────────────
 * 데이터
 * ──────────────────────────────────────────────────────────────*/

const NAV_LINKS = [
  { href: "#products", label: "예금상품" },
  { href: "#calculator", label: "이자계산기" },
  { href: "#passbook", label: "통장내역" },
  { href: "#branch", label: "지점안내" },
];

type ProductAccent = "blush" | "sky" | "lavender";

const PRODUCTS: Array<{
  id: string;
  name: string;
  eng: string;
  rate: string;
  term: string;
  desc: string;
  perks: string[];
  imageId: string;
  imageAlt: string;
  Icon: typeof Sun;
  accent: ProductAccent;
}> = [
  {
    id: "sunset",
    name: "노을 보통예금",
    eng: "Sunset Free Deposit",
    rate: "3.8",
    term: "입출금 자유",
    desc: "잠들기 전 마지막으로 본 풍경을 원금으로 받습니다. 언제든 다시 꺼내 볼 수 있어요.",
    perks: [
      "매일 저녁 노을빛 이자 자동 적립",
      "중도 인출 수수료 없음",
      "알림 없이 조용히 쌓이는 이자",
    ],
    imageId: "1508615070457-7baeba4003ab",
    imageAlt: "붉은빛과 보랏빛이 번지는 노을 구름 하늘",
    Icon: Sun,
    accent: "blush",
  },
  {
    id: "mist",
    name: "안개 자유적금",
    eng: "Misty Dawn Savings",
    rate: "5.4",
    term: "매일 낮잠 3분 이상",
    desc: "짧은 낮잠도 괜찮습니다. 흐릿하게 남은 장면 하나면 적금이 시작돼요.",
    perks: [
      "만기 시 몽환 사운드스케이프 증정",
      "낮잠 3분마다 자동 납입",
      "흐린 날 이자 우대 +0.3%p",
    ],
    imageId: "1470252649378-9c29740c9fa8",
    imageAlt: "안개가 겹겹이 낀 새벽 산맥",
    Icon: CloudFog,
    accent: "sky",
  },
  {
    id: "star",
    name: "별빛 정기예금",
    eng: "Starlight Time Deposit",
    rate: "7.2",
    term: "만기 100일",
    desc: "가장 선명한 꿈만 받는 고금리 상품. 중도 해지 시 악몽으로 전환됩니다.",
    perks: [
      "만기 시 단편 애니메이션 1편 제작",
      "우대금리 최대 +1.1%p",
      "재예치 시 별자리 각인 통장",
    ],
    imageId: "1519681393784-d120267933ba",
    imageAlt: "은하수가 펼쳐진 밤하늘",
    Icon: Star,
    accent: "lavender",
  },
];

const ACCENT_CLASS: Record<ProductAccent, string> = {
  blush: "ms-accent-blush",
  sky: "ms-accent-sky",
  lavender: "ms-accent-lavender",
};

const STATS = [
  { label: "누적 예치 꿈", value: 3204981, decimals: 0, suffix: "건", Icon: Moon },
  { label: "평균 몽상이자율", value: 7.2, decimals: 1, suffix: "%", Icon: TrendingUp },
  { label: "전국 지점", value: 0, decimals: 0, suffix: "곳", Icon: Landmark },
];

const PASSBOOK: Array<{
  date: string;
  desc: string;
  amount: string;
  type: "in" | "out";
}> = [
  { date: "07.10", desc: "낮잠 3분 입금", amount: "+180몽", type: "in" },
  { date: "07.09", desc: "야근 후 악몽 출금", amount: "-40몽", type: "out" },
  { date: "07.08", desc: "단잠 이자 지급", amount: "+212몽", type: "in" },
  { date: "07.06", desc: "백일몽 정기예금 가입", amount: "+1,000몽", type: "in" },
  { date: "07.03", desc: "가위눌림 수수료", amount: "-15몽", type: "out" },
  { date: "07.01", desc: "첫 예금 개설 축하금", amount: "+500몽", type: "in" },
];

const TESTIMONIALS = [
  {
    name: "요셉",
    meta: "34세 · 해몽사",
    quote:
      "가위에 눌릴 때마다 수수료가 나가는 줄은 몰랐지만, 그래도 꿈을 자산으로 인정해주는 곳은 여기뿐이더라고요.",
  },
  {
    name: "몽희",
    meta: "28세 · 낮잠 전문 프리랜서",
    quote:
      "낮잠 적금 만기됐더니 정말 사운드스케이프 파일이 왔어요. 요즘도 그거 틀어놓고 잡니다.",
  },
  {
    name: "구름",
    meta: "41세 · 불면증 5년차",
    quote:
      "잠이 안 와서 예치할 게 없는 줄 알았는데, 백일몽만으로도 계좌를 열어주더라고요.",
  },
];

const INTENSITY_TIERS = [
  { max: 2, label: "옅은 잔상", note: "눈뜨면 금세 흐려지는 꿈" },
  { max: 4, label: "또렷한 장면 하나", note: "한 장면만 선명히 남는 꿈" },
  { max: 6, label: "이야기가 있는 꿈", note: "기승전결이 있는 꿈" },
  { max: 8, label: "색과 소리까지 선명", note: "깨어나서도 색이 생생한 꿈" },
  { max: 10, label: "눈뜨고도 잊히지 않는 꿈", note: "하루 종일 맴도는 꿈" },
];

function tierFor(intensity: number) {
  return (
    INTENSITY_TIERS.find((tier) => intensity <= tier.max) ??
    INTENSITY_TIERS[INTENSITY_TIERS.length - 1]
  );
}

function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

/* ──────────────────────────────────────────────────────────────
 * 재사용 컴포넌트
 * ──────────────────────────────────────────────────────────────*/

function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
  id?: string;
}) {
  const reduced = useReducedMotionSafe();
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      id={id}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -5% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    // reduced가 true면 duration 0으로 즉시 최종값으로 점프한다.
    // (setState는 onUpdate 콜백 안에서만 호출 — effect 본문 동기 setState 회피)
    const controls = animate(0, value, {
      duration: reduced ? 0 : 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  const formatted = new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display);

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

function FloatingOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="ms-float-a absolute -left-16 top-10 h-56 w-56 rounded-full bg-[var(--ms-lavender)] opacity-60 blur-3xl sm:h-72 sm:w-72" />
      <div className="ms-float-b absolute right-[-4rem] top-24 h-64 w-64 rounded-full bg-[var(--ms-blush)] opacity-60 blur-3xl sm:h-80 sm:w-80" />
      <div className="ms-float-c absolute bottom-[-3rem] left-1/3 h-48 w-48 rounded-full bg-[var(--ms-mint)] opacity-50 blur-3xl sm:h-64 sm:w-64" />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * 메인 컴포넌트
 * ──────────────────────────────────────────────────────────────*/

export default function F16Client() {
  const reduced = useReducedMotionSafe();
  const [navOpen, setNavOpen] = useState(false);
  const [intensity, setIntensity] = useState(6);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const rate = useMemo(() => 3 + intensity * 0.42, [intensity]);
  const projected = useMemo(() => Math.round(10000 * (rate / 100)), [rate]);
  const tier = useMemo(() => tierFor(intensity), [intensity]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const marqueeItems = [
    "방금 접수: 백일몽 정기예금 +1,000몽",
    "환영합니다, 새로운 예금주님",
    "오늘의 몽상이자율 7.2%",
    "낮잠 적금 만기고객 사운드스케이프 발송 완료",
    "지점 0곳, 창구는 언제나 당신의 베개 위",
  ];

  return (
    <div
      className={`mongsang-theme ${gowunBatang.variable} ${gaegu.variable} relative min-h-screen overflow-x-clip`}
    >
      <a
        href="#main"
        className="ms-btn-primary fixed left-3 top-3 z-[100] -translate-y-24 rounded-full px-5 py-3 text-sm font-semibold focus-visible:translate-y-0 focus:translate-y-0 transition-transform"
      >
        본문으로 바로가기
      </a>

      {/* ───────────── 헤더 ───────────── */}
      <header className="ms-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#main"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ms-ink)] text-[var(--ms-cream)]"
            >
              <Moon className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span className="font-ms-display">몽상은행</span>
          </a>

          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-8 text-sm font-medium text-[var(--ms-ink-soft)] md:flex"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-sm transition-colors hover:text-[var(--ms-ink)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#consult"
              className="ms-btn-primary hidden rounded-full px-5 py-2.5 text-sm font-semibold sm:inline-flex sm:items-center sm:gap-1.5"
            >
              상담 예약
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--ms-ink)] transition-colors hover:bg-[var(--ms-line-soft)] md:hidden"
              aria-expanded={navOpen}
              aria-controls="mobile-nav"
              aria-label={navOpen ? "메뉴 닫기" : "메뉴 열기"}
              onClick={() => setNavOpen((v) => !v)}
            >
              {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {navOpen && (
          <nav
            id="mobile-nav"
            aria-label="모바일 메뉴"
            className="ms-header border-t border-[var(--ms-line-soft)] px-5 pb-5 pt-2 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setNavOpen(false)}
                    className="block rounded-lg px-2 py-3 text-base font-medium text-[var(--ms-ink-soft)] hover:bg-[var(--ms-line-soft)] hover:text-[var(--ms-ink)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#consult"
                  onClick={() => setNavOpen(false)}
                  className="ms-btn-primary mt-2 flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-sm font-semibold"
                >
                  상담 예약
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main id="main">
        {/* ───────────── 히어로 ───────────── */}
        <section className="ms-grain relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          <FloatingOrbs />
          <div className="relative mx-auto max-w-4xl text-center">
            <Reveal>
              <span className="ms-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide text-[var(--ms-ink-soft)] sm:text-sm">
                <Sparkles className="h-3.5 w-3.5 text-[var(--ms-lavender-deep)]" aria-hidden="true" />
                대한민국 유일 · 무형자산 전문 저축은행
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                className="mt-7 text-balance text-[2.6rem] leading-[1.15] font-bold sm:text-6xl sm:leading-[1.1] font-ms-display"
              >
                오늘 밤 꾸신 꿈,
                <br />
                <span className="italic text-[var(--ms-lavender-deep)]">예치</span>해드릴까요?
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-[var(--ms-ink-soft)] sm:text-lg">
                몽상은행은 잠, 낮잠, 백일몽을 원금으로 받는 저축은행입니다.
                눈을 감는 순간부터 몽상이자가 붙기 시작해요.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="#consult"
                  className="ms-btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold"
                >
                  무료 예금 상담 신청
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#calculator"
                  className="ms-btn-secondary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold"
                >
                  이자율표 보기
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[var(--ms-ink-faint)]">
                <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
                예금자보호법 미적용 상품입니다 (꿈이니까요)
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────────── 티커 ───────────── */}
        <section aria-label="실시간 예치 현황" className="border-y border-[var(--ms-line-soft)] bg-[var(--ms-cream)] py-3">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 sm:px-8">
            <button
              type="button"
              onClick={() => setMarqueePaused((v) => !v)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--ms-line)] text-[var(--ms-ink-soft)] transition-colors hover:bg-[var(--ms-line-soft)]"
              aria-label={marqueePaused ? "실시간 현황 재생" : "실시간 현황 일시정지"}
            >
              {marqueePaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
            <div className="relative flex-1 overflow-hidden">
              {reduced ? (
                <ul className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--ms-ink-soft)]">
                  {marqueeItems.map((item) => (
                    <li key={item} className="flex items-center gap-2 whitespace-nowrap">
                      <span aria-hidden="true" className="text-[var(--ms-lavender-deep)]">●</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div
                  className="ms-marquee-track flex w-max gap-10 text-sm text-[var(--ms-ink-soft)]"
                  data-paused={marqueePaused ? "true" : "false"}
                >
                  {[...marqueeItems, ...marqueeItems].map((item, i) => (
                    <span key={`${item}-${i}`} className="flex items-center gap-2 whitespace-nowrap">
                      <span aria-hidden="true" className="text-[var(--ms-lavender-deep)]">●</span>
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ───────────── 통계 ───────────── */}
        <section aria-label="몽상은행 현황" className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08} className="ms-glass rounded-3xl p-7 text-center">
                <stat.Icon className="mx-auto h-6 w-6 text-[var(--ms-lavender-deep)]" aria-hidden="true" />
                <p className="mt-4 text-3xl font-bold sm:text-4xl font-ms-display">
                  <AnimatedNumber value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-[var(--ms-ink-soft)]">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ───────────── 예금상품 ───────────── */}
        <section id="products" aria-labelledby="products-heading" className="px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold tracking-wide text-[var(--ms-lavender-deep)]">예금상품</p>
              <h2
                id="products-heading"
                className="mt-3 text-3xl font-bold sm:text-4xl font-ms-display"
              >
                어떤 꿈이든, 상품이 됩니다
              </h2>
              <p className="mt-4 text-[var(--ms-ink-soft)]">
                노을부터 별빛까지 — 잠의 종류에 따라 금리가 달라져요.
              </p>
            </Reveal>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((product, i) => (
                <Reveal key={product.id} as="li" delay={i * 0.1} className="ms-glass flex h-full flex-col overflow-hidden rounded-3xl">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={unsplash(product.imageId, 800)}
                      alt={product.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                    <span
                      className={`${ACCENT_CLASS[product.accent]} absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold`}
                    >
                      <product.Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      연 {product.rate}%
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-xs text-[var(--ms-ink-faint)]">{product.eng}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--ms-ink-soft)]">{product.desc}</p>
                    <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--ms-line-soft)] px-3 py-1 text-xs font-medium text-[var(--ms-ink-soft)]">
                      <CalendarClock className="h-3 w-3" aria-hidden="true" />
                      {product.term}
                    </p>
                    <ul className="mt-5 space-y-2 border-t border-[var(--ms-line-soft)] pt-4 text-sm text-[var(--ms-ink-soft)]">
                      {product.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2">
                          <Gift className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--ms-lavender-deep)]" aria-hidden="true" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#consult"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ms-ink)] underline decoration-[var(--ms-lavender-deep)] decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
                    >
                      {product.name} 상담하기
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────────── 이자 계산기 ───────────── */}
        <section id="calculator" aria-labelledby="calculator-heading" className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
          <div aria-hidden="true" className="absolute inset-0 bg-[var(--ms-bg-alt)]" />
          <div className="relative mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <Reveal>
              <p className="text-sm font-semibold tracking-wide text-[var(--ms-lavender-deep)]">이자계산기</p>
              <h2
                id="calculator-heading"
                className="mt-3 text-3xl font-bold sm:text-4xl font-ms-display"
              >
                꿈이 생생할수록,
                <br />
                이자도 선명해집니다
              </h2>
              <p className="mt-4 max-w-md text-[var(--ms-ink-soft)]">
                지난밤 꿈의 생생함을 1부터 10까지 표시해보세요. 몽상은행 고유 알고리즘이
                예상 이자율을 즉시 계산해드립니다.
              </p>
            </Reveal>

            <Reveal delay={0.12} className="ms-glass rounded-3xl p-7 sm:p-9">
              <label htmlFor="dream-intensity" className="text-sm font-semibold text-[var(--ms-ink)]">
                예치할 꿈의 생생함
              </label>
              <input
                id="dream-intensity"
                type="range"
                min={1}
                max={10}
                step={1}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="ms-range mt-5 w-full"
                aria-describedby="dream-result"
              />
              <div className="mt-2 flex justify-between text-xs text-[var(--ms-ink-faint)]">
                <span>1 · 옅은 잔상</span>
                <span>10 · 선명한 꿈</span>
              </div>

              <div
                id="dream-result"
                role="status"
                aria-live="polite"
                className="mt-7 rounded-2xl border border-[var(--ms-line)] bg-[var(--ms-cream)] p-6"
              >
                <p className="text-xs font-medium text-[var(--ms-ink-faint)]">{tier.label} · {tier.note}</p>
                <p className="mt-2 text-4xl font-bold font-ms-display">
                  {rate.toFixed(1)}%
                </p>
                <p className="mt-1 text-sm text-[var(--ms-ink-soft)]">
                  10,000몽 예치 시 연{" "}
                  <strong className="font-semibold text-[var(--ms-ink)]">
                    {new Intl.NumberFormat("ko-KR").format(projected)}몽
                  </strong>{" "}
                  이자 예상
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────────── 통장 내역 ───────────── */}
        <section id="passbook" aria-labelledby="passbook-heading" className="px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <p className="text-sm font-semibold tracking-wide text-[var(--ms-lavender-deep)]">통장내역</p>
              <h2
                id="passbook-heading"
                className="mt-3 text-3xl font-bold sm:text-4xl font-ms-display"
              >
                실제 고객의 몽상 통장
              </h2>
              <p className="mt-4 text-[var(--ms-ink-soft)]">
                좌우로 넘겨 최근 거래 내역을 확인하세요. (예시 데이터입니다)
              </p>
            </Reveal>

            <ul
              className="ms-passbook-scroll mt-10 flex snap-x gap-4 overflow-x-auto pb-4"
              aria-label="최근 통장 거래 내역"
            >
              {PASSBOOK.map((entry) => (
                <li
                  key={`${entry.date}-${entry.desc}`}
                  className="ms-glass w-64 shrink-0 rounded-2xl p-5 font-mono"
                >
                  <p className="text-xs text-[var(--ms-ink-faint)]">{entry.date}</p>
                  <p className="mt-2 text-sm font-medium text-[var(--ms-ink)]">{entry.desc}</p>
                  <p
                    className={`${
                      entry.type === "in" ? "ms-tag-in" : "ms-tag-out"
                    } mt-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-bold`}
                  >
                    {entry.amount}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────────── 고객 후기 ───────────── */}
        <section aria-labelledby="testimonial-heading" className="bg-[var(--ms-bg-alt)] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold tracking-wide text-[var(--ms-lavender-deep)]">고객 후기</p>
              <h2
                id="testimonial-heading"
                className="mt-3 text-3xl font-bold sm:text-4xl font-ms-display"
              >
                예금주님들의 밤 이야기
              </h2>
            </Reveal>

            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} as="li" delay={i * 0.1} className="ms-glass flex h-full flex-col rounded-3xl p-7">
                  <p
                    aria-hidden="true"
                    className="text-4xl text-[var(--ms-lavender-deep)] font-ms-display"
                  >
                    &ldquo;
                  </p>
                  <p className="flex-1 text-sm leading-relaxed text-[var(--ms-ink-soft)]">{t.quote}</p>
                  <footer className="mt-5 flex items-center gap-3 border-t border-[var(--ms-line-soft)] pt-4">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ms-lavender)] text-xs font-bold text-[var(--ms-ink)]"
                    >
                      {t.name.slice(0, 1)}
                    </span>
                    <span className="text-sm">
                      <span className="block font-semibold text-[var(--ms-ink)]">{t.name}</span>
                      <span className="block text-xs text-[var(--ms-ink-faint)]">{t.meta}</span>
                    </span>
                  </footer>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────────── 지점안내 + 상담신청 ───────────── */}
        <section id="branch" aria-labelledby="branch-heading" className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24">
          <FloatingOrbs />
          <div className="relative mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <p className="text-sm font-semibold tracking-wide text-[var(--ms-lavender-deep)]">지점안내</p>
              <h2
                id="branch-heading"
                className="mt-3 text-3xl font-bold sm:text-4xl font-ms-display"
              >
                전국 0개 지점,
                <br />
                유일한 창구는 당신의 베개 위
              </h2>
              <p className="mt-4 max-w-md text-[var(--ms-ink-soft)]">
                별도 방문 없이 잠드는 순간 자동으로 창구가 열립니다. 좌표는 항상
                <span className="font-ms-hand mx-1 text-[var(--ms-lavender-deep)]">
                  꿈과 현실 사이
                </span>
                입니다.
              </p>
              <dl className="mt-8 space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <dt className="ms-glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                    <Landmark className="h-4 w-4 text-[var(--ms-lavender-deep)]" aria-hidden="true" />
                  </dt>
                  <dd className="text-[var(--ms-ink-soft)]">운영시간: 취침 시각부터 기상 시각까지</dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="ms-glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                    <Wallet className="h-4 w-4 text-[var(--ms-lavender-deep)]" aria-hidden="true" />
                  </dt>
                  <dd className="text-[var(--ms-ink-soft)]">통화 단위: 몽 (夢) — 실물 화폐 아님</dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.12} id="consult" className="ms-glass scroll-mt-24 rounded-3xl p-7 sm:p-9">
              <h3 className="text-lg font-bold">무료 예금 상담 신청</h3>
              <p className="mt-1 text-sm text-[var(--ms-ink-soft)]">
                이름과 연락처를 남겨주시면 다음 취침 시간에 맞춰 연락드립니다.
              </p>

              {submitted ? (
                <p role="status" aria-live="polite" className="ms-tag-in mt-6 rounded-2xl px-4 py-6 text-center text-sm font-semibold">
                  상담 신청이 접수됐습니다. 오늘 밤 꿈에서 뵙겠습니다.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                  <div>
                    <label htmlFor="consult-name" className="text-sm font-medium text-[var(--ms-ink)]">
                      이름
                    </label>
                    <input
                      id="consult-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="mt-1.5 w-full rounded-xl border border-[var(--ms-line)] bg-[var(--ms-cream)] px-4 py-3 text-sm placeholder:text-[var(--ms-ink-faint)]"
                      placeholder="홍길몽"
                    />
                  </div>
                  <div>
                    <label htmlFor="consult-phone" className="text-sm font-medium text-[var(--ms-ink)]">
                      연락처
                    </label>
                    <input
                      id="consult-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      className="mt-1.5 w-full rounded-xl border border-[var(--ms-line)] bg-[var(--ms-cream)] px-4 py-3 text-sm placeholder:text-[var(--ms-ink-faint)]"
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <div>
                    <label htmlFor="consult-time" className="text-sm font-medium text-[var(--ms-ink)]">
                      상담 희망 시간대
                    </label>
                    <select
                      id="consult-time"
                      name="time"
                      required
                      defaultValue=""
                      className="mt-1.5 w-full rounded-xl border border-[var(--ms-line)] bg-[var(--ms-cream)] px-4 py-3 text-sm"
                    >
                      <option value="" disabled>
                        선택해주세요
                      </option>
                      <option value="dawn">새벽 (00–06시)</option>
                      <option value="morning">아침 (06–09시)</option>
                      <option value="day">낮 (09–18시)</option>
                      <option value="night">저녁 (18–24시)</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="ms-btn-primary flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold"
                  >
                    상담 신청하기
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      {/* ───────────── 푸터 ───────────── */}
      <footer className="ms-footer px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p
                className="flex items-center gap-2 text-lg font-bold font-ms-display"
              >
                <Moon className="h-4 w-4" aria-hidden="true" />
                몽상은행
              </p>
              <p className="mt-2 max-w-xs text-sm text-white/60">
                무형자산 전문 저축은행 · 지점 0곳 · 창구는 언제나 베개 위
              </p>
            </div>
            <nav aria-label="푸터 메뉴" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              ))}
              <a href="#consult" className="hover:text-white">
                상담 신청
              </a>
            </nav>
          </div>

          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-white/55">
            몽상은행은 예금자보호법의 보호를 받지 않는 감정 자산 전문 가상 기관입니다. 본
            웹사이트에 등장하는 모든 상품명, 금리, 지점, 고객 후기는 창작된 픽션이며 실제
            금융 상품이나 실존 인물과 무관합니다. 숙면을 위한 참고 자료로만 활용해주세요.
          </p>
          <p className="mt-6 text-xs text-white/55">© 몽상은행. 오늘 밤도 좋은 꿈 예치하세요.</p>
        </div>
      </footer>
    </div>
  );
}
