"use client";

import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Black_Han_Sans } from "next/font/google";
import {
  Radio,
  TrendingUp,
  Users,
  MessageCircle,
  Quote,
  CloudSun,
  Scissors,
  Mail,
  Send,
  ArrowRight,
  Heart,
  Stamp,
  Dog,
  Mountain,
  PenLine,
} from "lucide-react";

const blackHan = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-black-han",
});

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-[#b5181f] focus-visible:outline-offset-4 rounded-sm";

const ISSUE_DATE = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
}).format(new Date(2026, 6, 10));

/* ---------------------------------------------------------------- */
/* reduced-motion: subscribe to matchMedia directly (avoid framer's  */
/* useReducedMotion, which can miss the OS setting in some sandboxes) */
/* ---------------------------------------------------------------- */
function useReducedMotion() {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const getSnapshot = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */

const TICKER_ITEMS = [
  "속보) 소개팅 앱 설치 3분 만에 '이상형' 등장",
  "단독) 전국 미혼남녀 12만 명, 오늘 아침 매칭 편지 받았다",
  "특종) '읽씹' 없는 대화, 편집국이 보증한다",
  "화제) 3주 사귄 커플, 벌써 청첩장 시안 논의",
  "본지 자료) 재구독률 92%, 업계 최고 수치 기록",
];

const CLASSIFIEDS: {
  tag: string;
  headline: string;
  body: string;
  meta: string;
  icon: typeof Heart;
  tilt: string;
}[] = [
  {
    tag: "구함",
    headline: "야근 후에도 라면 같이 끓여 먹을 사람",
    body: "짜다/싱겁다 논쟁 환영. 계란 스크램블파만 아니면 됩니다.",
    meta: "29세 · 판교 · 회신 341건",
    icon: Heart,
    tilt: "-rotate-2",
  },
  {
    tag: "찾습니다",
    headline: "영화관 팝콘, 단맛파만 연락 주세요",
    body: "짠맛파와는 이미 세 번 헤어져봤습니다. 정중히 사절합니다.",
    meta: "33세 · 홍대 · 회신 87건",
    icon: Heart,
    tilt: "rotate-1",
  },
  {
    tag: "긴급",
    headline: "강아지 새벽 산책 동행, 6시 기상 가능자",
    body: "3kg 몰티즈 한 마리 있습니다. 날씨 얘기만 해도 좋아요.",
    meta: "27세 · 성수 · 회신 204건",
    icon: Dog,
    tilt: "-rotate-1",
  },
  {
    tag: "단독",
    headline: "첫 데이트도 정장 입고 나오는 사람",
    body: "격식 챙기는 거 좋아합니다. 넥타이 색 취향도 존중합니다.",
    meta: "35세 · 여의도 · 회신 152건",
    icon: Heart,
    tilt: "rotate-2",
  },
  {
    tag: "속보",
    headline: "넷플릭스 다음 화 몰아볼 사람 급구",
    body: "스포일러 금지 원칙 지킬 분. 팝콘은 제가 준비합니다.",
    meta: "26세 · 마포 · 회신 412건",
    icon: Heart,
    tilt: "-rotate-2",
  },
  {
    tag: "특종",
    headline: "등산화 두 켤레 있는 당신을 찾습니다",
    body: "한 켤레는 제 것도 챙겨주실 분. 국립공원 완주가 목표입니다.",
    meta: "31세 · 수원 · 회신 96건",
    icon: Mountain,
    tilt: "rotate-1",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "기사처럼 저를 소개했더니 정말 취재당하는 기분이었어요. 그런데 3일 만에 편집장(제 인연)을 만났습니다.",
    who: "마포구 이모씨(28)",
  },
  {
    quote:
      "매일 아침 배달되는 인연 편지, 커피보다 먼저 열어봅니다. 출근길이 즐거워졌어요.",
    who: "강남구 박모씨(31)",
  },
  {
    quote:
      "'읽씹 차단' 기능 하나로 연애 스트레스가 반으로 줄었습니다. 답장은 편집국이 재촉해줍니다.",
    who: "수원시 정모씨(26)",
  },
];

const PLANS = [
  {
    name: "1단 광고",
    price: "무료",
    desc: "요즘 흔한 소개팅 앱과 똑같이 시작하는 값",
    features: ["하루 3건 열람", "기본 매칭 알고리즘", "텍스트 대화"],
    cta: "무료로 시작",
    highlight: false,
  },
  {
    name: "2단 광고",
    price: "월 9,900원",
    desc: "가장 많이 팔리는 지면, 베스트셀러",
    features: ["무제한 열람", "읽음 확인", "관심사 우선 노출"],
    cta: "2단 구독하기",
    highlight: true,
  },
  {
    name: "전면광고",
    price: "월 19,900원",
    desc: "편집기자가 직접 취재하듯 붙습니다",
    features: ["담당 편집기자 배정", "오프라인 만남 주선", "VIP 지면 고정 노출"],
    cta: "전면광고 신청",
    highlight: false,
  },
];

/* ---------------------------------------------------------------- */

export default function Landing() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f3ede0] text-[#1c1a15]">
      <style>{`
        @keyframes hoveh-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .hoveh-ticker-track {
          animation: hoveh-ticker 34s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .hoveh-ticker-track {
            animation: none;
          }
        }
      `}</style>

      {/* paper grain texture, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.06] [background-image:radial-gradient(#1c1a15_1px,transparent_1px)] [background-size:3px_3px]"
      />

      <a
        href="#main"
        className={`sr-only focus:not-sr-only fixed left-3 top-3 z-50 bg-[#1c1a15] px-4 py-3 text-sm font-bold text-[#f3ede0] ${focusRing}`}
      >
        본문으로 건너뛰기
      </a>

      {/* ---------------- TICKER ---------------- */}
      <div className="relative z-10 border-b border-[#1c1a15]/20 bg-[#1c1a15] text-[#f3ede0]">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <span className="flex shrink-0 items-center gap-1.5 rounded-sm bg-[#b5181f] px-2.5 py-1 text-xs font-bold tracking-wide">
            <Radio className="h-3.5 w-3.5" aria-hidden="true" />
            속보
          </span>
          <p className="sr-only">
            오늘의 속보: {TICKER_ITEMS.join(" / ")}
          </p>
          <div className="flex-1 overflow-hidden">
            <div
              aria-hidden="true"
              className="hoveh-ticker-track flex w-max gap-10 whitespace-nowrap text-sm"
            >
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i} className="text-[#e6dfcd]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- MASTHEAD ---------------- */}
      <header className="relative z-10 border-b border-[#1c1a15]/20 bg-[#f3ede0]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#4a453a]">
          <span className="font-display italic tracking-normal normal-case">
            Hoveh — an extra edition of love
          </span>
          <span>{ISSUE_DATE} · 제1988호 · 무료 배포</span>
        </div>

        <div className="mx-auto max-w-6xl border-y-4 border-double border-[#1c1a15] px-4 py-6 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#4a453a]">
            미혼남녀 전문 일간지
          </p>
          <p
            className={`${blackHan.className} mt-1 text-6xl leading-none tracking-tight text-[#1c1a15] sm:text-7xl md:text-8xl`}
          >
            호외
          </p>
          <p className="mt-2 text-sm text-[#4a453a]">
            인연 특보 · 매일 아침 배달되는 연애 뉴스
          </p>
        </div>

        <nav aria-label="주요 메뉴" className="mx-auto max-w-6xl px-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 text-sm font-semibold">
            {[
              { href: "#how", label: "1면 · 취재수첩" },
              { href: "#classifieds", label: "구애광고" },
              { href: "#testimonials", label: "독자투고" },
              { href: "#pricing", label: "구독안내" },
              { href: "#subscribe", label: "창간호 신청" },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`inline-flex min-h-11 items-center px-1 text-[#1c1a15] underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-[#b5181f] ${focusRing}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" className="relative z-10">
        {/* ---------------- HERO ---------------- */}
        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b5181f]">
                단독 인터뷰 · 1면 톱기사
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[1.08] tracking-tight text-[#1c1a15] sm:text-5xl md:text-6xl">
                짝을 찾는 일, 이제
                <br />
                기사로 씁니다.
              </h1>
              <p className="mt-5 max-w-prose text-base leading-relaxed text-[#332f27] first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.75] sm:columns-2 sm:gap-8 sm:[column-rule:1px_solid_rgba(28,26,21,0.15)]">
                AI 편집국이 당신의 이상형을 취재해, 매일 아침 &apos;인연
                호외&apos;로 배달합니다. 프로필은 이력서가 아니라 기사가
                되고, 대화는 스몰토크가 아니라 특종 취재가 됩니다. 읽씹은
                편집국이 대신 독촉해드립니다.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#subscribe"
                  className={`inline-flex min-h-11 items-center gap-2 rounded-sm bg-[#b5181f] px-6 py-3 text-sm font-bold text-white shadow-[3px_3px_0_#1c1a15] transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1c1a15] ${focusRing}`}
                >
                  창간호 받아보기
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#how"
                  className={`inline-flex min-h-11 items-center border-b-2 border-[#1c1a15] px-1 text-sm font-bold text-[#1c1a15] hover:border-[#b5181f] hover:text-[#b5181f] ${focusRing}`}
                >
                  취재 뒷이야기 보기
                </a>
              </div>

              <p className="mt-6 max-w-prose text-xs italic text-[#55503f]">
                ※ 본지는 오보에 대한 정정보도문을 게재하지 않습니다. 아직 한
                번도 틀린 적이 없기 때문입니다.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="relative">
              <div className="relative rotate-1">
                <div className="relative overflow-hidden border-4 border-[#1c1a15] bg-[#e8e0cc] shadow-[6px_6px_0_#1c1a15]">
                  <Image
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1000&auto=format&fit=crop"
                    alt="노을을 등지고 나란히 걷는 두 사람의 실루엣"
                    width={800}
                    height={1000}
                    priority
                    className="h-[360px] w-full object-cover grayscale-[15%] sepia-[10%] sm:h-[440px]"
                  />
                </div>
                <p className="mt-2 text-xs text-[#55503f]">
                  사진 = 실제 매칭 커플, 첫 만남 현장 (자료사진)
                </p>
              </div>

              <div
                aria-hidden="true"
                className="absolute -left-4 -top-6 flex h-24 w-24 -rotate-12 items-center justify-center rounded-full border-4 border-[#b5181f] text-center"
              >
                <span className="flex flex-col items-center gap-0.5 text-[#b5181f]">
                  <Stamp className="h-4 w-4" />
                  <span className={`${blackHan.className} text-lg leading-none`}>
                    특종
                  </span>
                  <span className="text-[9px] font-bold leading-none">
                    100% 매칭
                  </span>
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <dl className="mt-12 grid grid-cols-1 divide-y divide-[#1c1a15]/20 border-y-2 border-[#1c1a15] bg-[#e8e0cc] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                { label: "누적 발행 수", value: "128,400건", icon: TrendingUp },
                { label: "재구독률", value: "92%", icon: Heart },
                { label: "평균 매칭 시간", value: "4시간 11분", icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 px-6 py-5">
                  <stat.icon className="h-5 w-5 shrink-0 text-[#b5181f]" aria-hidden="true" />
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-[#55503f]">
                      {stat.label}
                    </dt>
                    <dd className={`${blackHan.className} text-2xl text-[#1c1a15]`}>
                      {stat.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-right text-xs text-[#55503f]">
              본지 자체 집계 · 2026년 상반기 기준
            </p>
          </Reveal>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section id="how" className="border-y border-[#1c1a15]/20 bg-[#e8e0cc] py-14">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b5181f]">
                취재수첩
              </p>
              <h2 className="mt-2 font-display text-3xl text-[#1c1a15] sm:text-4xl">
                기사가 만들어지는 세 단계
              </h2>
            </Reveal>

            <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  page: "1면 — 취재",
                  title: "프로필 작성",
                  body: "기자처럼 스스로를 취재하세요. 질문에 답하면 당신만의 프로필 기사가 완성됩니다.",
                },
                {
                  page: "2면 — 편집",
                  title: "AI 매칭",
                  body: "편집국 알고리즘이 매일 아침 어울리는 인연 셋을 선별해 지면에 싣습니다.",
                },
                {
                  page: "3면 — 배포",
                  title: "대화 시작",
                  body: "관심 기사에 댓글을 남기면 대화가 열립니다. 읽씹은 편집국이 대신 독촉합니다.",
                },
              ].map((step, i) => (
                <Reveal key={step.title} delay={i * 0.08}>
                  <li className="h-full border border-[#1c1a15] bg-[#f3ede0] p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a4d08]">
                      {step.page}
                    </p>
                    <h3 className={`${blackHan.className} mt-2 text-2xl text-[#1c1a15]`}>
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#332f27]">
                      {step.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------- CLASSIFIEDS ---------------- */}
        <section id="classifieds" className="py-14">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#b5181f]">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  지면 하단 · 개인 광고
                </p>
                <h2 className="mt-2 font-display text-3xl text-[#1c1a15] sm:text-4xl">
                  오늘의 구애란
                </h2>
              </div>
              <p className="max-w-xs text-xs text-[#55503f]">
                실제 이용자들이 낸 광고를 각색했습니다. 매일 아침 갱신됩니다.
              </p>
            </Reveal>

            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CLASSIFIEDS.map((ad, i) => (
                <Reveal key={ad.headline} delay={(i % 3) * 0.06}>
                  <li
                    className={`h-full border-2 border-dashed border-[#1c1a15]/60 bg-[#f3ede0] p-5 shadow-[3px_3px_0_rgba(28,26,21,0.15)] transition-transform hover:-translate-y-1 ${ad.tilt}`}
                  >
                    <article className="flex h-full flex-col">
                      <div className="flex items-center justify-between">
                        <span className="rounded-sm bg-[#c98a1c] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#1c1a15]">
                          {ad.tag}
                        </span>
                        <ad.icon className="h-4 w-4 text-[#b5181f]" aria-hidden="true" />
                      </div>
                      <h3 className="mt-3 text-base font-bold leading-snug text-[#1c1a15]">
                        {ad.headline}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[#332f27]">
                        {ad.body}
                      </p>
                      <p className="mt-4 flex items-center gap-1.5 border-t border-[#1c1a15]/20 pt-3 text-xs text-[#55503f]">
                        <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        {ad.meta}
                      </p>
                    </article>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- TESTIMONIALS + MOOD ---------------- */}
        <section
          id="testimonials"
          className="border-y border-[#1c1a15]/20 bg-[#1c1a15] py-14 text-[#f3ede0]"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
              <div>
                <Reveal>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e6a94f]">
                    독자투고
                  </p>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                    편집국에 도착한 편지
                  </h2>
                </Reveal>

                <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {TESTIMONIALS.map((t, i) => (
                    <Reveal key={t.who} delay={i * 0.08}>
                      <li className="h-full border border-[#f3ede0]/25 p-5">
                        <Quote
                          className="h-5 w-5 text-[#e6a94f]"
                          aria-hidden="true"
                        />
                        <blockquote className="mt-3 text-sm leading-relaxed text-[#e6dfcd]">
                          {t.quote}
                        </blockquote>
                        <cite className="mt-4 block text-xs not-italic text-[#c9c2ae]">
                          — {t.who}
                        </cite>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>

              <Reveal delay={0.1}>
                <div className="h-full border border-[#f3ede0]/25 bg-[#1c1a15] p-6">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e6a94f]">
                    <CloudSun className="h-4 w-4" aria-hidden="true" />
                    오늘의 마음 날씨
                  </p>
                  <p className={`${blackHan.className} mt-3 text-3xl text-[#f3ede0]`}>
                    맑음
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#c9c2ae]">
                    고백하기 좋은 날씨입니다. 저녁부터 설렘 지수 상승,
                    자정까지 답장 확률 높음.
                  </p>
                  <div className="mt-5 border-t border-[#f3ede0]/20 pt-4">
                    <Image
                      src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop"
                      alt="손을 잡고 거리를 걷는 커플의 뒷모습"
                      width={600}
                      height={400}
                      loading="lazy"
                      className="h-40 w-full border border-[#f3ede0]/20 object-cover grayscale"
                    />
                    <p className="mt-2 text-xs text-[#8f8874]">
                      사진 = 어제자 지면에 실린 커플
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- PRICING ---------------- */}
        <section id="pricing" className="py-14">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal className="text-center">
              <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#b5181f]">
                <Scissors className="h-3.5 w-3.5" aria-hidden="true" />
                이 광고를 오려서 보관하세요
              </p>
              <h2 className="mt-2 font-display text-3xl text-[#1c1a15] sm:text-4xl">
                정기 구독 안내
              </h2>
            </Reveal>

            <ul className="mt-10 grid grid-cols-1 gap-6 border-2 border-dashed border-[#1c1a15]/50 p-6 md:grid-cols-3">
              {PLANS.map((plan, i) => (
                <Reveal key={plan.name} delay={i * 0.08}>
                  <li
                    className={`flex h-full flex-col border-2 p-6 ${
                      plan.highlight
                        ? "border-[#b5181f] bg-[#f3ede0] shadow-[4px_4px_0_#b5181f]"
                        : "border-[#1c1a15] bg-[#f3ede0]"
                    }`}
                  >
                    {plan.highlight && (
                      <span className="mb-3 inline-block w-fit rounded-sm bg-[#b5181f] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                        베스트셀러
                      </span>
                    )}
                    <h3 className={`${blackHan.className} text-2xl text-[#1c1a15]`}>
                      {plan.name}
                    </h3>
                    <p className="mt-1 font-display text-3xl text-[#1c1a15]">
                      {plan.price}
                    </p>
                    <p className="mt-2 text-sm text-[#55503f]">{plan.desc}</p>
                    <ul className="mt-5 flex-1 space-y-2 text-sm text-[#332f27]">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <span aria-hidden="true" className="mt-1 text-[#b5181f]">
                            —
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#subscribe"
                      className={`mt-6 inline-flex min-h-11 items-center justify-center gap-2 border-2 px-4 py-3 text-sm font-bold transition-colors ${
                        plan.highlight
                          ? "border-[#b5181f] bg-[#b5181f] text-white hover:bg-[#93131a]"
                          : "border-[#1c1a15] text-[#1c1a15] hover:bg-[#1c1a15] hover:text-[#f3ede0]"
                      } ${focusRing}`}
                    >
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- SUBSCRIBE / FINAL CTA ---------------- */}
        <section
          id="subscribe"
          className="border-y-4 border-double border-[#1c1a15] bg-[#e8e0cc] py-14"
        >
          <div className="mx-auto max-w-2xl px-4 text-center">
            <Reveal>
              <PenLine className="mx-auto h-6 w-6 text-[#b5181f]" aria-hidden="true" />
              <h2 className="mt-3 font-display text-3xl text-[#1c1a15] sm:text-4xl">
                당신의 이야기, 다음 호에 실립니다.
              </h2>
              <p className="mt-3 text-sm text-[#55503f]">
                이메일을 남기면 창간호를 가장 먼저 보내드립니다.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="subscribe-email" className="sr-only">
                  이메일 주소
                </label>
                <div className="relative flex-1">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#55503f]"
                    aria-hidden="true"
                  />
                  <input
                    id="subscribe-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`min-h-11 w-full border-2 border-[#1c1a15] bg-[#f3ede0] py-3 pl-10 pr-3 text-sm text-[#1c1a15] placeholder:text-[#8f8874] ${focusRing}`}
                  />
                </div>
                <button
                  type="submit"
                  className={`inline-flex min-h-11 items-center justify-center gap-2 bg-[#b5181f] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#93131a] ${focusRing}`}
                >
                  창간호 받기
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>

              <p aria-live="polite" className="mt-3 min-h-5 text-sm font-semibold text-[#7a4d08]">
                {subscribed
                  ? "접수 완료 — 창간호가 편집국을 떠났습니다."
                  : ""}
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="relative z-10 bg-[#0f0e0b] text-[#c9c2ae]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className={`${blackHan.className} text-3xl text-[#f3ede0]`}>호외</p>
              <p className="mt-2 text-sm leading-relaxed">
                인연 특보 편집국. 매일 아침, 당신의 이상형을 취재합니다.
              </p>
            </div>

            <nav aria-label="편집국 메뉴">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#8f8874]">
                편집국
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {["회사 소개", "채용 공고", "제휴 문의", "보도자료"].map((l) => (
                  <li key={l}>
                    <a
                      href="#main"
                      className={`inline-flex min-h-11 items-center hover:text-[#f3ede0] ${focusRing}`}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="고객센터 메뉴">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#8f8874]">
                고객센터
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {["자주 묻는 질문", "구독 관리", "정정 요청", "이용약관"].map((l) => (
                  <li key={l}>
                    <a
                      href="#main"
                      className={`inline-flex min-h-11 items-center hover:text-[#f3ede0] ${focusRing}`}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="소셜 채널">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#8f8874]">
                구독 채널
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {["Instagram", "Threads", "YouTube"].map((s) => (
                  <li key={s}>
                    <a
                      href="#main"
                      className={`inline-flex min-h-11 items-center border border-[#f3ede0]/25 px-3 text-xs font-semibold hover:border-[#f3ede0]/60 hover:text-[#f3ede0] ${focusRing}`}
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <p className="mt-10 border-t border-[#f3ede0]/15 pt-4 text-xs text-[#8f8874]">
            구인) 열정 넘치는 편집기자 모심 · 편집국 직접 문의 · 학력·연봉
            무관
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#f3ede0]/15 pt-4 text-xs text-[#8f8874]">
            <p>© 2026 호외 편집국. 무단전재-재배포 금지.</p>
            <p>1면 끝 · 다음 호에 계속</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
