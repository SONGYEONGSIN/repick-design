"use client";

import { useState } from "react";

const INK = "#26221D";
const PAPER = "#FAF5EC";
const LINE = "#E4DACB";
const MUTED = "#8A8172";

const STATIONS = [
  { key: "signup", label: "가입", sub: "Day 0" },
  { key: "week1", label: "1주", sub: "Day 7" },
  { key: "month1", label: "1개월", sub: "Day 30" },
  { key: "month6", label: "6개월", sub: "Day 180" },
] as const;

type StationKey = (typeof STATIONS)[number]["key"];

type Plan = {
  id: string;
  name: string;
  price: string;
  unit: string;
  badge?: string;
  tagline: string;
  accent: string;
  cta: string;
  added: Record<StationKey, string[]>;
  growth: Record<StationKey, number>;
};

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "₩0",
    unit: "평생 무료",
    tagline: "가볍게 시작해서 흐름을 지켜보세요",
    accent: "#7C7566",
    cta: "무료로 시작하기",
    added: {
      signup: ["AI 취향 프로필 생성", "기본 큐레이션 시작"],
      week1: ["첫 주간 추천 리스트 도착"],
      month1: ["네 번째 주간 추천까지 누적"],
      month6: ["24번째 주간 추천 누적"],
    },
    growth: { signup: 15, week1: 20, month1: 25, month6: 28 },
  },
  {
    id: "pro",
    name: "Pro",
    price: "₩9,900",
    unit: "/ 월",
    badge: "가장 많이 선택하는 플랜",
    tagline: "매일이 득템 타이밍이 되도록",
    accent: "#C08A2E",
    cta: "Pro로 시작하기",
    added: {
      signup: ["무제한 매칭 즉시 활성화", "실시간 가격 알림 ON", "가격 추적 시작"],
      week1: ["평균 매칭 12건 도착", "가격 하락 알림 2건 수신"],
      month1: ["누적 매칭 50건 돌파", "평균 절약액 리포트 첫 확인"],
      month6: ["취향 정밀도 최고 단계 도달", "누적 절약액 한눈에 확인"],
    },
    growth: { signup: 35, week1: 55, month1: 75, month6: 92 },
  },
  {
    id: "business",
    name: "Business",
    price: "문의",
    unit: "맞춤 견적",
    tagline: "팀 전체가 리커머스를 시스템으로",
    accent: "#2F3A63",
    cta: "영업팀에 문의하기",
    added: {
      signup: ["팀 시트 세팅", "셀러 대시보드 연결"],
      week1: ["API 연동 완료", "팀원 초대 및 권한 배분"],
      month1: ["재고 순환 리포트 첫 발행"],
      month6: ["6개월 매칭 판매 데이터 분석", "전담 매니저 정기 리뷰 시작"],
    },
    growth: { signup: 40, week1: 62, month1: 82, month6: 98 },
  },
];

const COMPARE_ROWS: { label: string; free: string; pro: string; business: string }[] = [
  { label: "가격", free: "₩0", pro: "₩9,900 / 월", business: "맞춤 견적" },
  { label: "매칭 방식", free: "주간 추천", pro: "실시간 무제한", business: "실시간 무제한 + 대량" },
  { label: "가격 추적 알림", free: "–", pro: "✓", business: "✓" },
  { label: "팀 시트 · API", free: "–", pro: "–", business: "✓" },
  { label: "전담 매니저", free: "–", pro: "–", business: "✓" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "타임라인은 실제 제 사용 기록인가요?",
    a: "아니요. 각 플랜을 선택했을 때 평균적으로 어떤 흐름을 겪는지 보여드리는 안내예요. 실제 경험은 취향과 활동량에 따라 달라질 수 있어요.",
  },
  {
    q: "Free로 시작해도 나중에 흐름을 이어갈 수 있나요?",
    a: "그럼요. 언제 업그레이드하든 그동안 쌓인 취향 학습 데이터와 찜 목록은 그대로 이어져서 더 정교한 추천을 받아보실 수 있어요.",
  },
  {
    q: "Business 요금은 어떻게 산정되나요?",
    a: "팀 규모와 API 호출량에 따라 맞춤 견적을 드려요. 문의를 남겨주시면 담당자가 24시간 안에 안내해요.",
  },
];

function cumulativeItems(plan: Plan, uptoIndex: number) {
  const result: { text: string; isNew: boolean }[] = [];
  STATIONS.forEach((station, i) => {
    if (i <= uptoIndex) {
      plan.added[station.key].forEach((text) => {
        result.push({ text, isNew: i === uptoIndex });
      });
    }
  });
  return result;
}

function StationRail({
  current,
  onChange,
}: {
  current: number;
  onChange: (index: number) => void;
}) {
  const progressPercent = (current / (STATIONS.length - 1)) * 100;

  return (
    <div className="relative mx-auto max-w-2xl px-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 right-6 top-[22px] h-px"
        style={{ backgroundColor: LINE }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-6 top-[22px] h-px transition-all duration-500"
        style={{
          backgroundColor: "#C08A2E",
          width: `calc((100% - 3rem) * ${progressPercent / 100})`,
        }}
      />
      <div className="relative flex items-start justify-between">
        {STATIONS.map((station, i) => {
          const active = i === current;
          const passed = i <= current;
          return (
            <button
              key={station.key}
              type="button"
              onClick={() => onChange(i)}
              aria-pressed={active}
              aria-label={`${i + 1}번째 시점, ${station.label}`}
              className="flex flex-col items-center gap-2 rounded-md px-1 py-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26221D] focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors"
                style={{
                  borderColor: passed ? "#C08A2E" : LINE,
                  backgroundColor: active ? "#C08A2E" : "#FFFFFF",
                  color: active ? "#FFFFFF" : passed ? "#C08A2E" : "#B7AD9C",
                }}
              >
                {i + 1}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: active ? INK : MUTED }}
              >
                {station.label}
              </span>
              <span className="hidden text-[10px] sm:block" style={{ color: "#B7AD9C" }}>
                {station.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlanCard({ plan, stationIndex }: { plan: Plan; stationIndex: number }) {
  const items = cumulativeItems(plan, stationIndex);
  const growth = plan.growth[STATIONS[stationIndex].key];

  return (
    <article
      className="flex flex-col rounded-2xl border bg-white p-6 md:p-7"
      style={{ borderColor: LINE, borderTopColor: plan.accent, borderTopWidth: 3 }}
    >
      {plan.badge ? (
        <span
          className="mb-3 inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"
          style={{ backgroundColor: plan.accent }}
        >
          {plan.badge}
        </span>
      ) : null}

      <h2 className="font-serif text-xl" style={{ color: INK }}>
        {plan.name}
      </h2>
      <p className="mt-1 text-sm" style={{ color: MUTED }}>
        {plan.tagline}
      </p>
      <p className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-semibold" style={{ color: INK }}>
          {plan.price}
        </span>
        <span className="text-sm" style={{ color: MUTED }}>
          {plan.unit}
        </span>
      </p>

      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between text-[11px] font-medium" style={{ color: MUTED }}>
          <span>{STATIONS[stationIndex].label} 기준 누적 가치</span>
          <span>{growth}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={growth}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${plan.name} 누적 가치 ${growth}퍼센트`}
          className="h-2 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: "#F1EBDE" }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${growth}%`, backgroundColor: plan.accent }}
          />
        </div>
      </div>

      <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-sm">
        {items.map((item, i) => (
          <li
            key={plan.id + item.text + i}
            className="flex items-start gap-2"
            style={{ color: item.isNew ? INK : "#6B6255", fontWeight: item.isNew ? 500 : 400 }}
          >
            <span
              aria-hidden="true"
              className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
              style={{ backgroundColor: item.isNew ? plan.accent : LINE }}
            />
            <span>
              {item.text}
              {item.isNew ? (
                <span
                  className="ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white align-middle"
                  style={{ backgroundColor: plan.accent }}
                >
                  NEW
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>

      <a
        href="#get-started"
        className="mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26221D] focus-visible:ring-offset-2"
        style={{ backgroundColor: plan.accent }}
      >
        {plan.cta}
      </a>
    </article>
  );
}

export default function Landing() {
  const [stationIndex, setStationIndex] = useState(0);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: PAPER, color: INK }}>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, ${INK} 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
      />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 md:px-10">
        <a
          href="#top"
          className="flex items-center gap-2 rounded-sm text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26221D] focus-visible:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full border font-serif text-sm"
            style={{ borderColor: INK }}
          >
            R
          </span>
          repick
        </a>
        <a
          href="#simulator"
          className="rounded-sm text-sm font-medium underline decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26221D] focus-visible:ring-offset-2"
          style={{ textDecorationColor: "#C08A2E" }}
        >
          여정 살펴보기 ↓
        </a>
      </header>

      <main>
        <section id="top" className="mx-auto max-w-3xl px-6 pb-14 pt-8 text-center md:pb-20 md:pt-14">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#C08A2E" }}>
            Pricing, as a timeline
          </p>
          <h1 className="font-serif text-4xl leading-[1.25] sm:text-5xl md:text-6xl">
            가입한 순간부터
            <br className="hidden sm:block" /> 6개월 뒤까지,{" "}
            <span className="italic" style={{ color: "#C08A2E" }}>
              무엇이 쌓이는지
            </span>{" "}
            보여드려요
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: MUTED }}>
            가격표 대신 시간표를 봐주세요. 아래 시점을 눌러 각 플랜이 그 순간까지 만들어준 것들을 확인하세요.
          </p>
        </section>

        <section id="simulator" className="px-6 pb-20 md:px-10">
          <div className="mx-auto max-w-5xl">
            <StationRail current={stationIndex} onChange={setStationIndex} />

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PLANS.map((plan) => (
                <PlanCard key={plan.id} plan={plan} stationIndex={stationIndex} />
              ))}
            </div>
          </div>
        </section>

        <section id="compare" className="px-6 pb-20 md:px-10">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center font-serif text-2xl md:text-3xl">
              스펙만 빠르게 확인하고 싶다면
            </h2>
            <div className="overflow-x-auto rounded-2xl border bg-white" style={{ borderColor: LINE }}>
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: LINE, color: MUTED }}>
                    <th scope="col" className="p-4 font-medium">
                      항목
                    </th>
                    <th scope="col" className="p-4 font-medium">
                      Free
                    </th>
                    <th scope="col" className="p-4 font-medium">
                      Pro
                    </th>
                    <th scope="col" className="p-4 font-medium">
                      Business
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, idx) => (
                    <tr
                      key={row.label}
                      style={{ backgroundColor: idx % 2 === 1 ? "#FAF5EC" : "#FFFFFF" }}
                    >
                      <th scope="row" className="p-4 font-medium" style={{ color: INK }}>
                        {row.label}
                      </th>
                      <td className="p-4" style={{ color: "#3B362E" }}>
                        {row.free}
                      </td>
                      <td className="p-4 font-medium" style={{ color: INK }}>
                        {row.pro}
                      </td>
                      <td className="p-4" style={{ color: "#3B362E" }}>
                        {row.business}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="faq" className="px-6 pb-20 md:px-10">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-center font-serif text-2xl md:text-3xl">자주 묻는 질문</h2>
            <div className="flex flex-col gap-4">
              {FAQS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border bg-white p-5 [&::-webkit-details-marker]:hidden"
                  style={{ borderColor: LINE }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26221D] focus-visible:ring-offset-2">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 flex-none items-center justify-center rounded-full border text-lg font-semibold transition-transform group-open:rotate-45"
                      style={{ borderColor: LINE }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "#6B6255" }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="get-started" className="mx-auto mb-16 max-w-4xl px-6 md:px-10">
          <div
            className="rounded-3xl border px-6 py-14 text-center md:py-16"
            style={{ borderColor: INK, backgroundColor: INK, color: PAPER }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#C08A2E" }}>
              Day 0
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
              오늘 가입하면, 6개월 뒤의 이야기가 시작됩니다
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm md:text-base" style={{ color: "#D8CFBF" }}>
              카드 등록 없이 무료로 시작하고, 언제든 여정을 이어갈 수 있어요.
            </p>
            <a
              href="#simulator"
              className="mt-8 inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 md:text-base"
              style={{ backgroundColor: "#C08A2E", color: INK }}
            >
              무료로 시작하기
            </a>
          </div>
        </section>
      </main>

      <footer className="px-6 pb-10 text-center text-xs md:px-10" style={{ color: "#B7AD9C" }}>
        © 2026 repick · 시간이 지날수록 더 나은 선택.
      </footer>
    </div>
  );
}
