"use client";

import { useState } from "react";

type Worry = {
  id: string;
  chip: string;
  icon: string;
  question: string;
  feature: string;
  tagline: string;
  description: string;
  scenario: string;
};

const WORRIES: Worry[] = [
  {
    id: "fake",
    chip: "가짜면 어떡하지",
    icon: "🔍",
    question: "이거 혹시... 가짜 아니야? 사진이랑 실물이 다르면 어떡하지?",
    feature: "신뢰 검증",
    tagline: "사람이 놓친 것까지, AI가 한 번 더 봐요",
    description:
      "상태 설명과 사진을 대조하고, 시세 대비 가격을 확인하고, 판매자의 거래 이력을 점검해요. 세 가지가 모두 맞아야 '검증됨' 배지가 붙어요.",
    scenario:
      "빈티지 리바이스 자켓, 판매자는 'S급'이라 적었지만 repick이 사진 속 마모 흔적을 잡아내 '실사용감 있음'으로 보정 — 덕분에 실망 없이 구매.",
  },
  {
    id: "taste",
    chip: "내 취향 아니면 어떡하지",
    icon: "🎯",
    question: "예뻐서 샀는데 막상 손이 안 가면 어떡하지?",
    feature: "취향 학습",
    tagline: "찜하고 클릭할수록, 더 나를 닮아가요",
    description:
      "찜한 상품, 오래 본 상품, 실제로 구매한 상품까지 — 모든 행동이 학습 데이터가 돼요. 3주 정도 쓰면 추천 적중률이 눈에 띄게 달라져요.",
    scenario:
      "처음엔 '캐주얼'만 보여주던 추천이, 오버사이즈 니트를 세 번 찜한 뒤부턴 빈티지 니트 위주로 바뀜 — 말 안 해도 알아챔.",
  },
  {
    id: "price",
    chip: "나만 비싸게 사는 거 아닐까",
    icon: "📉",
    question: "이 가격이 적당한 건지 도무지 감이 안 와...",
    feature: "가격 추적",
    tagline: "같은 매물, 지금이 가장 쌀 때인지 알려드려요",
    description:
      "동일·유사 매물의 최근 시세를 계속 추적해서, 지금 가격이 평균보다 높은지 낮은지 바로 보여줘요. 값이 떨어지면 알림도 와요.",
    scenario:
      "찜해둔 필름카메라가 3주 만에 18% 하락 — repick이 놓치지 않고 알려줘서 딱 그 타이밍에 구매.",
  },
  {
    id: "missed",
    chip: "좋은 매물 놓치면 어떡하지",
    icon: "⚡",
    question: "내가 딴짓하는 사이에 좋은 매물 팔리는 거 아냐?",
    feature: "실시간 알림",
    tagline: "새 매물이 뜨는 순간, 제일 먼저 알려드려요",
    description:
      "내 취향과 찜 목록에 맞는 매물이 올라오는 즉시 알려드려요. 인기 매물일수록 확인이 늦으면 사라지니까, 속도가 곧 득템이에요.",
    scenario:
      "알림 온 지 4분 만에 확인한 한정판 스니커즈 — repick이 없었으면 새로고침 백 번 해도 못 잡았을 타이밍.",
  },
];

function TrustVisual() {
  const rows = ["상태 사진 대조", "시세 비교", "판매자 이력 확인"];
  return (
    <div className="relative w-full rounded-2xl border border-stone-200 bg-white p-6">
      <div className="absolute -right-3 -top-3 flex h-16 w-16 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-emerald-600 text-center text-[9px] font-bold leading-tight text-emerald-700">
        VERIFIED
      </div>
      <ul className="flex flex-col gap-3 text-sm">
        {rows.map((label, i) => (
          <li
            key={label}
            className="rp-pop flex items-center gap-2"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs text-white">
              ✓
            </span>
            <span className="text-stone-700">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TasteVisual() {
  const tags = [
    { t: "빈티지", s: 100 },
    { t: "미니멀", s: 75 },
    { t: "오버사이즈", s: 90 },
    { t: "스트릿", s: 45 },
  ];
  return (
    <div className="w-full rounded-2xl border border-stone-200 bg-white p-6">
      <div className="mb-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.t}
            className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
            style={{ opacity: tag.s / 100 }}
          >
            {tag.t}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div
          className="relative h-14 w-14 shrink-0 rounded-full"
          style={{ background: "conic-gradient(#047857 92%, #e7e5e4 0)" }}
        >
          <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white text-[11px] font-bold text-emerald-800">
            92%
          </div>
        </div>
        <p className="text-xs leading-relaxed text-stone-500">
          3주간 학습된
          <br />
          취향 매칭률
        </p>
      </div>
    </div>
  );
}

function PriceVisual() {
  const bars = [58, 50, 44, 38, 32];
  return (
    <div className="w-full rounded-2xl border border-stone-200 bg-white p-6">
      <div className="flex h-24 items-end gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`rp-grow w-6 origin-bottom rounded-t-md ${
              i === bars.length - 1 ? "bg-amber-500" : "bg-stone-200"
            }`}
            style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold text-amber-600">오늘 시세 -18% ↓</p>
    </div>
  );
}

function NotifyVisual() {
  return (
    <div className="w-full rounded-2xl border border-stone-800 bg-stone-900 p-6">
      <div className="flex flex-col gap-2">
        <div
          className="rp-notify flex items-start gap-2 rounded-xl bg-white/95 p-3 shadow-sm"
          style={{ animationDelay: "0ms" }}
        >
          <span className="text-base" aria-hidden="true">💰</span>
          <p className="text-xs text-stone-700">
            <b className="text-stone-900">가격이 12% 내렸어요.</b> 지금이 살 때예요.
          </p>
        </div>
        <div
          className="rp-notify flex items-start gap-2 rounded-xl bg-white/95 p-3 shadow-sm"
          style={{ animationDelay: "220ms" }}
        >
          <span className="text-base" aria-hidden="true">✨</span>
          <p className="text-xs text-stone-700">
            <b className="text-stone-900">취향저격 신상 매물</b> 방금 등록됐어요.
          </p>
        </div>
      </div>
    </div>
  );
}

const VISUALS: Record<string, () => React.JSX.Element> = {
  fake: TrustVisual,
  taste: TasteVisual,
  price: PriceVisual,
  missed: NotifyVisual,
};

export default function Landing() {
  const [active, setActive] = useState(0);
  const current = WORRIES[active];
  const CurrentVisual = VISUALS[current.id];

  return (
    <div
      className="flex min-h-screen flex-col bg-stone-50 text-stone-900"
      style={{ fontFamily: '"Pretendard", ui-sans-serif, system-ui, -apple-system, sans-serif' }}
    >
      <style>{`
        @keyframes rp-fade-kf { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .rp-fade { animation: rp-fade-kf 400ms ease-out both; }
        @keyframes rp-pop-kf { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        .rp-pop { animation: rp-pop-kf 350ms ease-out both; }
        @keyframes rp-grow-kf { from { transform: scaleY(0); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
        .rp-grow { animation: rp-grow-kf 500ms ease-out both; }
        @keyframes rp-notify-kf { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .rp-notify { animation: rp-notify-kf 450ms ease-out both; }
      `}</style>

      <header className="border-b border-stone-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-lg font-extrabold tracking-tight text-stone-900">repick</span>
          <nav className="hidden gap-6 text-sm font-medium text-stone-500 sm:flex">
            <a
              href="#"
              className="text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              기능
            </a>
            <a
              href="#"
              className="hover:text-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              가격
            </a>
            <a
              href="#"
              className="hover:text-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              문의
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <p className="mb-4 text-sm font-semibold tracking-wide text-emerald-700">FEATURES</p>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl">
            중고 거래, 사실
            <br className="hidden sm:block" />
            걱정이 한둘이 아니죠.
          </h1>
          <p className="mt-5 max-w-xl text-base text-stone-600 sm:text-lg">
            가짜일까 봐, 취향이 아닐까 봐, 비싸게 살까 봐, 좋은 매물을 놓칠까 봐 — repick은 이
            네 가지 고민에 각각 답을 준비했어요.
          </p>
        </section>

        <section aria-labelledby="worry-heading" className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
          <h2 id="worry-heading" className="mb-6 text-sm font-semibold text-stone-500">
            지금 가장 걱정되는 건 뭔가요?
          </h2>

          <div role="tablist" aria-label="중고 거래 고민 선택" className="mb-8 flex flex-wrap gap-2">
            {WORRIES.map((w, i) => (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-controls={`panel-${w.id}`}
                onClick={() => setActive(i)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                  active === i
                    ? "border-emerald-900 bg-emerald-900 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-800"
                }`}
              >
                <span className="mr-1.5" aria-hidden="true">{w.icon}</span>
                {w.chip}
              </button>
            ))}
          </div>

          <div
            id={`panel-${current.id}`}
            role="tabpanel"
            aria-live="polite"
            key={current.id}
            className="rp-fade grid gap-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div>
              <p className="mb-3 text-sm font-medium text-stone-400">Q.</p>
              <p className="mb-6 text-xl font-semibold text-stone-800 sm:text-2xl">
                &ldquo;{current.question}&rdquo;
              </p>
              <p className="mb-2 text-sm font-medium text-emerald-700">A. {current.feature}</p>
              <p className="mb-4 text-lg font-bold text-stone-900 sm:text-xl">{current.tagline}</p>
              <p className="mb-4 text-sm leading-relaxed text-stone-600">{current.description}</p>
              <p className="rounded-xl bg-stone-50 p-4 text-sm leading-relaxed text-stone-500">
                <span className="font-semibold text-stone-700">예를 들면 — </span>
                {current.scenario}
              </p>
            </div>
            <div className="flex items-center">
              <CurrentVisual />
            </div>
          </div>
        </section>

        <section className="border-t border-stone-200 bg-white py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-2xl font-bold text-stone-900 sm:text-3xl">
              네 가지 고민, 네 가지 답
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {WORRIES.map((w) => (
                <div key={w.id} className="rounded-2xl border border-stone-200 p-5">
                  <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-lg" aria-hidden="true">
                    {w.icon}
                  </span>
                  <p className="mb-1 text-xs font-medium text-stone-400">{w.chip}</p>
                  <p className="mb-2 text-base font-bold text-stone-900">{w.feature}</p>
                  <p className="text-sm leading-relaxed text-stone-500">{w.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-emerald-900 py-14 text-emerald-50">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-300">HOW</p>
            <p className="text-lg font-semibold leading-relaxed sm:text-xl">
              이 네 가지가 가능한 이유는 하나예요.
              <br className="hidden sm:block" />
              매일 쏟아지는 수만 개 매물 중에서, AI 매칭이 당신에게 맞는 것만 먼저 골라두거든요.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-2xl font-bold text-stone-900 sm:text-3xl">
              지금 제일 걱정되는 고민, 오늘 없애보세요
            </h2>
            <p className="mb-8 text-stone-600">가입은 1분, 첫 추천은 그보다 빨라요.</p>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold text-stone-900 transition-colors duration-150 hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              무료로 시작하기
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-stone-400 sm:px-6 lg:px-8">
          © 2026 repick. 믿을 수 있는 중고 거래.
        </div>
      </footer>
    </div>
  );
}
