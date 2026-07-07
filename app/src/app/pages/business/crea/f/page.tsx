"use client";

import { useState } from "react";

type StepId = 1 | 2 | 3 | 4;

interface JourneyStep {
  id: StepId;
  label: string;
  time: string;
  headline: string;
  description: string;
  result: string;
  metricValue: string;
  metricCaption: string;
}

const STEPS: JourneyStep[] = [
  {
    id: 1,
    label: "가입",
    time: "5분",
    headline: "사업자 인증, 심사 없이 바로",
    description:
      "사업자등록번호만 입력하면 바로 시작합니다. 별도 심사나 승인 대기 없이 즉시 다음 단계로 넘어갑니다.",
    result: "계정 활성화 완료, 대시보드 접근 가능",
    metricValue: "5분",
    metricCaption: "평균 가입 완료 시간",
  },
  {
    id: 2,
    label: "재고 연동",
    time: "10분",
    headline: "엑셀이든 API든, 있는 그대로",
    description:
      "CSV 업로드 또는 API 연동으로 기존 재고를 그대로 가져옵니다. 상품 정보를 다시 입력할 필요 없이 자동으로 매핑됩니다.",
    result: "평균 320개 상품 자동 등록",
    metricValue: "10분",
    metricCaption: "평균 재고 연동 시간",
  },
  {
    id: 3,
    label: "AI 매칭 시작",
    time: "즉시",
    headline: "등록과 동시에 매칭 시작",
    description:
      "재고가 연동되는 즉시 AI가 구매 의향이 높은 사용자에게 상품을 노출합니다. 별도 광고 설정이나 캠페인 구성이 필요 없습니다.",
    result: "등록 상품의 87%가 24시간 내 첫 노출",
    metricValue: "0초",
    metricCaption: "매칭 시작까지 대기 시간",
  },
  {
    id: 4,
    label: "첫 판매",
    time: "평균 2.3일",
    headline: "재고가 매출로 바뀌는 순간",
    description:
      "매칭된 구매자와 거래가 성사되면 자동으로 정산됩니다. 판매 현황은 대시보드에서 실시간으로 확인할 수 있습니다.",
    result: "재고 순환 주기 평균 68% 단축",
    metricValue: "2.3일",
    metricCaption: "평균 첫 판매까지 소요일",
  },
];

const PARTNERS = ["그린클로젯", "세컨드무브", "리사이클프렌즈", "다시입다", "順環", "루프클로젓"];

export default function Landing() {
  const [active, setActive] = useState<StepId>(1);
  const [visited, setVisited] = useState<StepId[]>([1]);
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("패션");
  const [submitted, setSubmitted] = useState(false);

  const currentStep = STEPS.find((s) => s.id === active) ?? STEPS[0];
  const progress = Math.round((visited.length / STEPS.length) * 100);

  function goToStep(id: StepId) {
    setActive(id);
    setVisited((prev) => (prev.includes(id) ? prev : [...prev, id].sort()));
  }

  function handlePrev() {
    if (active > 1) goToStep((active - 1) as StepId);
  }

  function handleNext() {
    if (active < 4) goToStep((active + 1) as StepId);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!company.trim() || !email.trim()) return;
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-zinc-900">repick</span>
            <span className="rounded-full border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              for Business
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
            <a
              href="#journey"
              className="rounded-sm hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50"
            >
              온보딩 여정
            </a>
            <a
              href="#metrics"
              className="rounded-sm hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50"
            >
              성과 지표
            </a>
            <a
              href="#demo"
              className="rounded-sm hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50"
            >
              데모 요청
            </a>
          </nav>
          <a
            href="#demo"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50"
          >
            데모 요청
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-14 pt-16 text-center sm:pt-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-emerald-700">
          셀러 온보딩, 4단계
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          가입부터 첫 판매까지,
          <br className="hidden sm:block" /> 평균 이틀이면 충분합니다
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-600 sm:text-lg">
          재고를 연동하는 순간 AI가 구매 의향 있는 고객에게 자동으로 매칭을 시작합니다.
          아래 여정을 직접 클릭하며 각 단계에 걸리는 시간과 결과를 확인해 보세요.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#demo"
            className="w-full rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 sm:w-auto"
          >
            데모 요청하기
          </a>
          <a
            href="#journey"
            className="w-full rounded-md border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 sm:w-auto"
          >
            여정 살펴보기 ↓
          </a>
        </div>
      </section>

      {/* Journey / Interactive stepper */}
      <section id="journey" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              셀러 온보딩 여정
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              단계를 클릭하면 소요 시간과 결과를 바로 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="h-2 w-40 overflow-hidden rounded-full bg-zinc-200"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="온보딩 여정 확인 진행률"
            >
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold tabular-nums text-zinc-700">
              {progress}%
            </span>
          </div>
        </div>

        {/* Stepper nodes */}
        <ol className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0">
          {STEPS.map((step, idx) => {
            const isActive = step.id === active;
            const isVisited = visited.includes(step.id);
            return (
              <li key={step.id} className="flex flex-1 items-stretch sm:items-center">
                <button
                  type="button"
                  onClick={() => goToStep(step.id)}
                  aria-current={isActive ? "step" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 sm:flex-col sm:items-start sm:gap-2 ${
                    isActive
                      ? "border-emerald-600 bg-emerald-50"
                      : isVisited
                        ? "border-zinc-300 bg-white"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : isVisited
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {isVisited && !isActive ? "✓" : step.id}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-900">{step.label}</span>
                    <span className="text-xs text-zinc-500">{step.time}</span>
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="mx-2 hidden h-px w-6 shrink-0 bg-zinc-300 sm:block"
                  />
                )}
              </li>
            );
          })}
        </ol>

        {/* Detail panel */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
          <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                {`STEP ${currentStep.id} · ${currentStep.label}`}
              </p>
              <h3 className="mt-2 text-xl font-bold text-zinc-900 sm:text-2xl">
                {currentStep.headline}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
                {currentStep.description}
              </p>
              <div className="mt-5 flex items-start gap-2 rounded-md bg-zinc-50 px-4 py-3">
                <span className="mt-0.5 text-emerald-600" aria-hidden="true">
                  ✓
                </span>
                <p className="text-sm font-medium text-zinc-700">{currentStep.result}</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 px-8 py-6 text-center">
              <span className="text-3xl font-bold tabular-nums text-zinc-900 sm:text-4xl">
                {currentStep.metricValue}
              </span>
              <span className="mt-1 text-xs text-zinc-500">{currentStep.metricCaption}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={active === 1}
              className="rounded-md px-3 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              ← 이전 단계
            </button>
            <span className="text-xs text-zinc-400">
              {active} / {STEPS.length}
            </span>
            {active < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                다음 단계 →
              </button>
            ) : (
              <a
                href="#demo"
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                지금 시작하기
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section id="metrics" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            숫자로 보는 온보딩
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 p-6">
              <p className="text-3xl font-bold tabular-nums text-zinc-900">38분</p>
              <p className="mt-2 text-sm text-zinc-500">평균 온보딩 완료 시간</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-6">
              <p className="text-3xl font-bold tabular-nums text-zinc-900">98%</p>
              <p className="mt-2 text-sm text-zinc-500">재고 연동 성공률</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-6">
              <p className="text-3xl font-bold tabular-nums text-zinc-900">2.3일</p>
              <p className="mt-2 text-sm text-zinc-500">평균 첫 판매까지 소요일</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner logo strip */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-zinc-400">
            함께하는 파트너사
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PARTNERS.map((name) => (
              <li
                key={name}
                className="font-mono text-sm font-semibold tracking-wide text-zinc-400"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Demo request */}
      <section id="demo" className="mx-auto max-w-2xl scroll-mt-20 px-6 py-16">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-10">
          {submitted ? (
            <div className="py-8 text-center">
              <span
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700"
                aria-hidden="true"
              >
                ✓
              </span>
              <h2 className="mt-4 text-xl font-bold text-zinc-900">
                신청이 접수됐습니다
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                영업일 기준 1일 내로 {company}에 담당자가 연락드립니다.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                여정을 직접 경험해 보세요
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                담당자가 재고 연동부터 첫 판매까지 함께 셋업해 드립니다.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="company" className="text-sm font-medium text-zinc-700">
                    회사명
                  </label>
                  <input
                    id="company"
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="예: 그린클로젯"
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-700">
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="category" className="text-sm font-medium text-zinc-700">
                    취급 카테고리
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  >
                    <option value="패션">패션</option>
                    <option value="가전">가전</option>
                    <option value="가구">가구</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="mt-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  데모 요청하기
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-xs text-zinc-400 sm:flex-row">
          <span>© 2026 repick for Business</span>
          <span>재고를 순환시키는 가장 빠른 방법</span>
        </div>
      </footer>
    </main>
  );
}
