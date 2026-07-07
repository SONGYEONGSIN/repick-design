"use client";

import { useEffect, useState } from "react";

/**
 * 컨셉: "라이브 지표 대시보드형 Pricing"
 * 요금제를 파는 페이지가 아니라, 요금제가 만들어내는 데이터를 보여주는 관제 화면.
 * 각 플랜 카드가 도넛 차트·카운트업·주간 빈도 막대를 실시간으로 그리며
 * "이 플랜을 고르면 어떤 숫자가 생기는가"를 즉시 증명한다.
 */

type Plan = {
  id: string;
  name: string;
  price: string;
  priceUnit: string;
  tagline: string;
  accent: string;
  glow: string;
  badge?: string;
  cta: string;
  donutLabel: string;
  donutPct: number;
  metricLabel: string;
  metricValue: number;
  metricPrefix?: string;
  metricSuffix?: string;
  metricNote: string;
  freqLabel: string;
  freqNote: string;
  freqBars: number[];
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "₩0",
    priceUnit: "평생 무료",
    tagline: "기본 AI 큐레이션으로 감을 잡는 단계",
    accent: "#94a3b8",
    glow: "rgba(148,163,184,0.25)",
    cta: "무료로 시작",
    donutLabel: "예상 매칭률",
    donutPct: 58,
    metricLabel: "평균 절약액",
    metricValue: 54000,
    metricPrefix: "₩",
    metricSuffix: "/월",
    metricNote: "최근 30일 Free 사용자 중앙값",
    freqLabel: "큐레이션 빈도",
    freqNote: "주 1회 · 일요일 발송",
    freqBars: [22, 8, 30, 12, 22, 10, 14],
  },
  {
    id: "pro",
    name: "Pro",
    price: "₩9,900",
    priceUnit: "/ 월",
    tagline: "무제한 매칭과 실시간 알림이 켜지는 단계",
    accent: "#34d399",
    glow: "rgba(52,211,153,0.35)",
    badge: "가장 많이 선택됨",
    cta: "Pro 시작하기",
    donutLabel: "예상 매칭률",
    donutPct: 94,
    metricLabel: "평균 절약액",
    metricValue: 312000,
    metricPrefix: "₩",
    metricSuffix: "/월",
    metricNote: "최근 30일 Pro 사용자 중앙값",
    freqLabel: "큐레이션 빈도",
    freqNote: "실시간 · 매칭 즉시 알림",
    freqBars: [70, 88, 62, 92, 78, 96, 84],
  },
  {
    id: "business",
    name: "Business",
    price: "문의",
    priceUnit: "맞춤 견적",
    tagline: "팀 재고를 API로 순환시키는 단계",
    accent: "#fbbf24",
    glow: "rgba(251,191,36,0.3)",
    cta: "데모 요청하기",
    donutLabel: "매칭 정확도",
    donutPct: 99,
    metricLabel: "재고 회전율 개선",
    metricValue: 38,
    metricSuffix: "%",
    metricNote: "도입 팀 평균, 90일 기준",
    freqLabel: "API 큐레이션 처리",
    freqNote: "24시간 무제한 호출",
    freqBars: [96, 100, 92, 100, 97, 100, 98],
  },
];

const COMPARE_ROWS: {
  label: string;
  free: string | boolean;
  pro: string | boolean;
  biz: string | boolean;
}[] = [
  { label: "AI 큐레이션", free: "기본", pro: "고급", biz: "고급 + 커스텀" },
  { label: "매칭 알림", free: false, pro: true, biz: true },
  { label: "가격 하락 추적", free: false, pro: true, biz: true },
  { label: "무제한 매칭", free: false, pro: true, biz: true },
  { label: "팀 시트", free: false, pro: false, biz: "무제한" },
  { label: "셀러 대시보드", free: false, pro: false, biz: true },
  { label: "API 연동", free: false, pro: false, biz: true },
  { label: "우선 지원", free: false, pro: true, biz: "전담 매니저" },
];

const FAQS = [
  {
    q: "Free에서 Pro로 언제든 전환할 수 있나요?",
    a: "네. 전환 즉시 무제한 매칭과 실시간 알림이 켜지고, 그동안 쌓인 취향 학습 데이터는 그대로 이어집니다. 다음 결제일부터 정상 청구돼요.",
  },
  {
    q: "구독은 언제든 해지할 수 있나요?",
    a: "네. 해지해도 이미 결제한 기간까지는 Pro 지표(매칭·알림·추적)를 계속 이용할 수 있고, 이후 자동으로 Free로 전환됩니다.",
  },
  {
    q: "Business 플랜은 어떻게 시작하나요?",
    a: "아래 데모 요청 버튼으로 팀 규모와 재고 데이터를 남겨주시면, 24시간 내 담당자가 맞춤 견적과 API 연동 일정을 안내드려요.",
  },
];

function Donut({
  pct,
  color,
  delay = 0,
}: {
  pct: number;
  color: string;
  delay?: number;
}) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(pct), delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - (animated / 100) * c;

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold tabular-nums"
        style={{ color }}
      >
        {Math.round(animated)}%
      </div>
    </div>
  );
}

function CountUp({
  target,
  prefix = "",
  suffix = "",
  delay = 0,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const duration = 900;
    const timer = setTimeout(() => {
      const step = (ts: number) => {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, delay]);

  return (
    <span className="font-mono tabular-nums">
      {prefix}
      {value.toLocaleString("ko-KR")}
      {suffix}
    </span>
  );
}

function FreqBars({
  heights,
  color,
  delay = 0,
}: {
  heights: number[];
  color: string;
  delay?: number;
}) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGrown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="flex h-10 items-end gap-1" role="img" aria-label="주간 큐레이션 빈도 그래프">
      {heights.map((h, i) => (
        <div key={i} className="flex h-full w-1.5 items-end overflow-hidden rounded-t-sm bg-white/10">
          <div
            className="w-full rounded-t-sm"
            style={{
              height: grown ? `${h}%` : "0%",
              background: color,
              transition: `height 0.6s ease-out ${i * 55}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function LiveTicker() {
  const [matched, setMatched] = useState(1842);
  const [savingPct, setSavingPct] = useState(41);

  useEffect(() => {
    const id = setInterval(() => {
      setMatched((m) => m + Math.floor(Math.random() * 3) + 1);
      setSavingPct((p) => {
        const next = p + (Math.random() > 0.5 ? 1 : -1);
        return Math.min(44, Math.max(38, next));
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const items = [
    "실시간 매칭 엔진 가동 중",
    `최근 1시간 매칭 ${matched.toLocaleString("ko-KR")}건`,
    `이번 주 평균 절약률 ${savingPct}%`,
    "신뢰 검증 통과율 96%",
    "활성 큐레이션 엔진 3개",
  ];
  const loop = [...items, ...items];

  return (
    <div className="sticky top-0 z-20 overflow-hidden border-b border-white/10 bg-black/70 py-2 backdrop-blur">
      <div className="flex w-max animate-[repick-marquee_26s_linear_infinite] items-center gap-10 whitespace-nowrap px-4 font-mono text-[11px] text-emerald-300/80 sm:text-xs">
        {loop.map((t, i) => (
          <span key={i} className="flex items-center gap-2">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function CompareCell({ value }: { value: string | boolean }) {
  if (value === true) {
    return <span className="font-mono text-emerald-400">●</span>;
  }
  if (value === false) {
    return <span className="font-mono text-white/25">–</span>;
  }
  return <span className="font-mono text-[13px] text-white/80">{value}</span>;
}

export default function Landing() {
  return (
    <div
      className="min-h-screen bg-[#070a09] font-sans text-[#e6f2ea]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <style>{`
        @keyframes repick-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <LiveTicker />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pb-10 pt-14 text-center sm:pt-20">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-emerald-300/80">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            pricing dashboard
          </p>
          <h1 className="text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-5xl">
            당신의 다음 절약은,
            <br />
            지금 계산되고 있습니다
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            요금제를 고르기 전에, 각 플랜이 실제로 어떤 숫자를 만들어내는지 먼저 보여드립니다.
            아래 지표는 최근 30일 repick 매칭 로그를 기준으로 계산됩니다.
          </p>
        </section>

        {/* Plan dashboard */}
        <section id="plans" className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-3">
            {PLANS.map((plan, i) => (
              <article
                key={plan.id}
                className="relative flex flex-col rounded-2xl border p-5 backdrop-blur-sm"
                style={{
                  borderColor: plan.id === "pro" ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  boxShadow: plan.id === "pro" ? `0 0 40px -8px ${plan.glow}` : "none",
                }}
              >
                {plan.badge ? (
                  <span
                    className="absolute -top-3 left-5 rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black"
                    style={{ background: plan.accent }}
                  >
                    {plan.badge}
                  </span>
                ) : null}

                <header className="flex items-baseline justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">
                    {plan.name}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: plan.accent }}
                  />
                </header>

                <p className="mt-3 font-mono text-3xl font-bold tabular-nums text-white">
                  {plan.price}
                  <span className="ml-1 text-sm font-normal text-white/40">{plan.priceUnit}</span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-white/50">{plan.tagline}</p>

                {/* Metric grid */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
                  <div className="flex flex-col items-start gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {plan.donutLabel}
                    </span>
                    <Donut pct={plan.donutPct} color={plan.accent} delay={i * 120} />
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {plan.metricLabel}
                    </span>
                    <span className="text-base font-bold" style={{ color: plan.accent }}>
                      <CountUp
                        target={plan.metricValue}
                        prefix={plan.metricPrefix}
                        suffix={plan.metricSuffix}
                        delay={i * 120 + 80}
                      />
                    </span>
                    <span className="text-[10px] leading-tight text-white/35">{plan.metricNote}</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                      {plan.freqLabel}
                    </span>
                    <span className="text-[10px] text-white/40">{plan.freqNote}</span>
                  </div>
                  <FreqBars heights={plan.freqBars} color={plan.accent} delay={i * 120 + 160} />
                </div>

                <a
                  href="#compare"
                  className="mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-center text-sm font-bold text-black transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    background: plan.accent,
                    ["--tw-outline-color" as string]: plan.accent,
                  }}
                >
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section id="compare" className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <h2 className="mb-1 text-lg font-bold text-white sm:text-xl">전체 지표 비교</h2>
          <p className="mb-5 text-xs text-white/45">플랜별 기능을 한 화면에서 대조합니다.</p>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-white/40">
                  <th scope="col" className="p-4 font-normal">
                    기능
                  </th>
                  <th scope="col" className="p-4 font-normal" style={{ color: PLANS[0].accent }}>
                    Free
                  </th>
                  <th scope="col" className="p-4 font-normal" style={{ color: PLANS[1].accent }}>
                    Pro
                  </th>
                  <th scope="col" className="p-4 font-normal" style={{ color: PLANS[2].accent }}>
                    Business
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={`border-b border-white/5 ${idx % 2 === 1 ? "bg-white/[0.02]" : ""}`}
                  >
                    <th scope="row" className="p-4 text-sm font-medium text-white/80">
                      {row.label}
                    </th>
                    <td className="p-4">
                      <CompareCell value={row.free} />
                    </td>
                    <td className="p-4">
                      <CompareCell value={row.pro} />
                    </td>
                    <td className="p-4">
                      <CompareCell value={row.biz} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
          <h2 className="mb-5 text-lg font-bold text-white sm:text-xl">자주 묻는 질문</h2>
          <div className="flex flex-col divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
            {FAQS.map((item) => (
              <details key={item.q} className="group px-5 py-4 [&::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md font-mono text-sm text-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 focus-visible:outline-offset-2">
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-emerald-400/70">
                      $
                    </span>
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-white/40 transition-transform group-open:rotate-90"
                  >
                    ›
                  </span>
                </summary>
                <p className="mt-3 pl-5 text-sm leading-relaxed text-white/55">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-4 mb-16 rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/[0.08] to-transparent px-6 py-14 text-center sm:mx-auto sm:max-w-4xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            지금 무료로 시작하고,
            <br className="sm:hidden" /> 첫 매칭 데이터를 확인하세요
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/55">
            카드 등록 없이 바로 시작하고, 대시보드에서 내 절약 지표가 쌓이는 걸 지켜보세요.
          </p>
          <a
            href="#plans"
            className="mt-7 inline-flex items-center justify-center rounded-lg bg-emerald-400 px-6 py-3 text-sm font-bold text-black transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-200 focus-visible:outline-offset-2"
          >
            무료로 시작하기
          </a>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center font-mono text-[11px] text-white/30">
        © 2026 repick · 지표는 최근 30일 매칭 로그 기준으로 산출됩니다.
      </footer>
    </div>
  );
}
