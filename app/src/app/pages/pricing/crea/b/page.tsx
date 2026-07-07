"use client";

import { useState } from "react";

type TimelineStep = {
  time: string;
  icon: string;
  text: string;
};

const TIMELINE_WITHOUT: TimelineStep[] = [
  { time: "09:12", icon: "🔍", text: "\"빈티지 가죽 재킷\" 검색 — 4,213개 결과" },
  { time: "09:47", icon: "😩", text: "필터링만 35분째, 예산 안 맞는 매물뿐" },
  { time: "11:30", icon: "👀", text: "마음에 드는 재킷 발견 — 판매자 정보는 없음" },
  { time: "14:02", icon: "💬", text: "일단 문의 메시지 전송" },
  { time: "+2일", icon: "🔇", text: "답장 없음. 처음부터 다시 탐색" },
  { time: "+9일", icon: "📸", text: "\"사진이랑 실물이 다르다\"는 후기 발견" },
  { time: "+21일", icon: "🏳️", text: "검색 포기 — 총 47시간, 결국 못 삼" },
];

const TIMELINE_WITH: TimelineStep[] = [
  { time: "09:12", icon: "🔍", text: "\"빈티지 가죽 재킷\" 검색 — 같은 순간" },
  { time: "09:13", icon: "✨", text: "취향 학습 기반 AI가 4,213개 → 12개로 압축" },
  { time: "09:15", icon: "✅", text: "신뢰 검증 배지 — 인증 판매자 · 상태 A급" },
  { time: "09:17", icon: "📉", text: "실시간 알림 — 정가 대비 42% 하락" },
  { time: "09:29", icon: "🎉", text: "결제 완료 — 17분 만에 득템" },
];

const STATS = [
  { label: "검색부터 구매까지", before: "21일", after: "17분" },
  { label: "내가 쓴 시간", before: "47시간 스크롤", after: "탭 3번" },
  { label: "결과", before: "결국 포기", after: "42% 절약 득템" },
];

type Tier = {
  name: string;
  price: string;
  period: string;
  badge?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "₩0",
    period: "무료",
    description: "일단 이야기의 시작만 보고 싶다면",
    features: ["기본 AI 큐레이션", "주간 추천 리스트", "찜 목록 저장"],
    cta: "무료로 시작",
  },
  {
    name: "Pro",
    price: "₩9,900",
    period: "/ 월",
    badge: "인기",
    description: "17분짜리 결말을 매번 원한다면",
    features: [
      "무제한 AI 매칭",
      "실시간 가격 하락 알림",
      "가격 추적 & 히스토리",
      "신뢰 검증 배지 전체 열람",
    ],
    cta: "Pro 시작하기",
    highlighted: true,
  },
  {
    name: "Business",
    price: "문의",
    period: "",
    description: "팀과 셀러를 위한 repick",
    features: ["팀 시트 관리", "셀러 대시보드", "API 연동", "전담 매니저"],
    cta: "데모 요청하기",
  },
];

const FAQS = [
  {
    q: "무료 플랜과 Pro는 정확히 뭐가 다른가요?",
    a: "Free는 주간 단위 추천과 기본 큐레이션까지만 제공해요. Pro는 매칭 개수 제한이 없고, 가격이 떨어지는 순간 실시간으로 알려주고, 신뢰 검증 배지를 전부 열람할 수 있어요. 21일짜리 이야기와 17분짜리 이야기의 차이입니다.",
  },
  {
    q: "언제든 해지할 수 있나요?",
    a: "네. 위약금이나 최소 약정 없이 언제든 해지할 수 있어요. 해지 후에도 남은 결제 기간까지는 Pro 기능을 그대로 사용할 수 있습니다.",
  },
  {
    q: "Business 요금은 어떻게 책정되나요?",
    a: "팀 규모와 판매 물량에 따라 맞춤 견적을 드려요. 팀 시트, 셀러 대시보드, API 사용량을 함께 살펴본 뒤 담당자가 직접 안내해 드립니다.",
  },
];

export default function Landing() {
  const [withRepick, setWithRepick] = useState(false);
  const timeline = withRepick ? TIMELINE_WITH : TIMELINE_WITHOUT;

  return (
    <main className="min-h-full bg-stone-50 text-stone-900">
      <style>{`
        @keyframes fade-slide-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="border-b border-stone-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <span className="font-mono text-lg font-bold tracking-tight text-stone-900">
            repick
          </span>
          <a
            href="#tiers"
            className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            요금제 보기
          </a>
        </div>
      </header>

      {/* Hero + toggle */}
      <section className="mx-auto max-w-3xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-24">
        <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-emerald-600">
          같은 검색, 다른 결말
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
          당신의 다음 쇼핑은,
          <br />
          어느 쪽인가요?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-600">
          오전 9시 12분, 똑같은 검색어로 시작합니다. 아래 토글을 눌러 두 결말을
          직접 비교해 보세요.
        </p>

        <button
          type="button"
          role="switch"
          aria-checked={withRepick}
          onClick={() => setWithRepick((v) => !v)}
          className="relative mx-auto mt-8 flex w-full max-w-md items-center rounded-full border border-stone-300 bg-white p-1.5 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          <span
            aria-hidden="true"
            className={`absolute inset-y-1.5 w-[calc(50%-6px)] rounded-full transition-all duration-300 ease-out ${
              withRepick
                ? "left-[calc(50%+3px)] bg-emerald-600"
                : "left-1.5 bg-stone-800"
            }`}
          />
          <span
            className={`relative z-10 flex-1 py-2.5 text-center text-sm font-semibold transition-colors duration-300 ${
              withRepick ? "text-stone-500" : "text-white"
            }`}
          >
            repick 없이
          </span>
          <span
            className={`relative z-10 flex-1 py-2.5 text-center text-sm font-semibold transition-colors duration-300 ${
              withRepick ? "text-white" : "text-stone-500"
            }`}
          >
            repick과 함께
          </span>
        </button>
      </section>

      {/* Timeline */}
      <section
        aria-live="polite"
        className={`transition-colors duration-500 ${
          withRepick ? "bg-emerald-50" : "bg-stone-100"
        }`}
      >
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
          <h2 className="sr-only">
            {withRepick ? "repick과 함께한 쇼핑 타임라인" : "repick 없이 겪은 쇼핑 타임라인"}
          </h2>
          <div className="mb-8 flex items-center justify-between">
            <p
              className={`font-mono text-xs font-semibold uppercase tracking-widest ${
                withRepick ? "text-emerald-700" : "text-stone-500"
              }`}
            >
              {withRepick ? "With repick" : "Without repick"}
            </p>
            <p className="text-xs text-stone-400">"빈티지 가죽 재킷" 검색기</p>
          </div>

          <ol key={withRepick ? "with" : "without"} className="relative ml-3 border-l-2 border-stone-300/70">
            {timeline.map((step, i) => (
              <li
                key={step.time + step.text}
                style={{ animationDelay: `${i * 80}ms` }}
                className="relative animate-[fade-slide-in_0.45s_ease-out_backwards] py-5 pl-7 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-[9px] top-6 h-4 w-4 rounded-full border-2 border-stone-50 ${
                    withRepick ? "bg-emerald-600" : "bg-stone-500"
                  }`}
                />
                <p className="font-mono text-xs font-medium text-stone-400">
                  {step.time}
                </p>
                <p className="mt-1 text-base leading-relaxed text-stone-800">
                  <span aria-hidden="true" className="mr-2">
                    {step.icon}
                  </span>
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stat summary */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          무엇이 21일을 17분으로 만들었을까요
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-stone-200 bg-white p-6"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
                {stat.label}
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-lg text-stone-400 line-through">
                  {stat.before}
                </span>
                <span aria-hidden="true" className="text-stone-300">
                  →
                </span>
                <span className="text-2xl font-bold text-emerald-600">
                  {stat.after}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing tiers */}
      <section id="tiers" className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
              이 차이, 한 달에 얼마면 살 수 있을까요
            </h2>
            <p className="mt-3 text-sm text-stone-600">
              이야기의 결말은 요금제가 정합니다. 지금 고르세요.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  tier.highlighted
                    ? "border-emerald-600 bg-emerald-50/60 shadow-sm ring-1 ring-emerald-600"
                    : "border-stone-200 bg-white"
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-8 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-lg font-bold text-stone-900">{tier.name}</h3>
                <p className="mt-1 text-sm text-stone-500">{tier.description}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-stone-900">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-stone-500">{tier.period}</span>
                  )}
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-stone-700"
                    >
                      <span aria-hidden="true" className="mt-0.5 text-emerald-600">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`mt-8 w-full rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                    tier.highlighted
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "border border-stone-300 text-stone-800 hover:border-stone-900"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          자주 묻는 질문
        </h2>
        <div className="mt-8 divide-y divide-stone-200 border-t border-b border-stone-200">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded font-semibold text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
                {item.q}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl leading-none text-stone-400 transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-stone-900">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            당신의 다음 검색은, 17분이면 충분합니다
          </h2>
          <p className="mt-3 text-sm text-stone-300">
            신용카드 필요 없음 · 언제든 해지 가능
          </p>
          <button
            type="button"
            className="mt-8 rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
          >
            무료로 시작하기
          </button>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-stone-50 py-8">
        <p className="text-center text-xs text-stone-400">
          © repick. 이야기는 매일 달라질 수 있습니다.
        </p>
      </footer>
    </main>
  );
}
