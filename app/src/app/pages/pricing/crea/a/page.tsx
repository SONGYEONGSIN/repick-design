"use client";

import { useState } from "react";

const MISSED_RATE = 0.12; // 실시간 알림 없이 평균적으로 놓치는 특가 비율
const RECOVER_RATE = 0.8; // Pro 알림·가격추적으로 회수 가능한 비율
const PRO_PRICE = 9900;

function won(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}₩${Math.abs(Math.round(amount)).toLocaleString("ko-KR")}`;
}

function FeatureValue({ value }: { value: string }) {
  if (value === "✓") {
    return (
      <>
        <span aria-hidden="true">✓</span>
        <span className="sr-only">포함</span>
      </>
    );
  }
  if (value === "—") {
    return (
      <>
        <span aria-hidden="true">—</span>
        <span className="sr-only">미포함</span>
      </>
    );
  }
  return <>{value}</>;
}

type Tier = {
  name: string;
  price: string;
  unit?: string;
  badge?: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
};

type FeatureRow = {
  label: string;
  free: string;
  pro: string;
  business: string;
};

const featureRows: FeatureRow[] = [
  { label: "AI 큐레이션", free: "✓", pro: "✓", business: "✓" },
  { label: "추천 주기", free: "주간", pro: "실시간", business: "실시간" },
  { label: "매칭 알림", free: "—", pro: "무제한", business: "무제한" },
  { label: "가격 하락 추적", free: "—", pro: "✓", business: "✓" },
  { label: "팀 시트", free: "—", pro: "—", business: "✓" },
  { label: "셀러 대시보드", free: "—", pro: "—", business: "✓" },
  { label: "API 접근", free: "—", pro: "—", business: "✓" },
];

const faqs = [
  {
    q: "Pro는 언제든 해지할 수 있나요?",
    a: "네. 별도 약정 없이 언제든 해지할 수 있고, 해지하면 다음 결제일부터 요금이 청구되지 않아요.",
  },
  {
    q: "위 계산기의 절약액은 어떻게 계산되나요?",
    a: `최근 이용 데이터를 기준으로, 실시간 알림이 없을 때 평균적으로 놓치는 특가 비율(약 ${Math.round(
      MISSED_RATE * 100,
    )}%)과 Pro의 알림·가격 추적으로 회수 가능한 비율(약 ${Math.round(
      RECOVER_RATE * 100,
    )}%)을 곱해 추정해요. 실제 절약액은 카테고리와 쇼핑 패턴에 따라 달라질 수 있어요.`,
  },
  {
    q: "Business 플랜은 어떻게 시작하나요?",
    a: "아래 문의하기 버튼으로 팀 규모와 필요한 기능을 알려주시면, 담당 매니저가 24시간 내로 맞춤 견적을 안내해드려요.",
  },
];

export default function Landing() {
  const [shops, setShops] = useState(5);
  const [avgSpend, setAvgSpend] = useState(50000);

  const totalSpend = shops * avgSpend;
  const missed = totalSpend * MISSED_RATE;
  const recovered = missed * RECOVER_RATE;
  const netSaving = recovered - PRO_PRICE;
  const recommendPro = netSaving > 0;

  const tiers: Tier[] = [
    {
      name: "Free",
      price: "₩0",
      unit: "/월",
      desc: "지금 바로 시작하는 기본 큐레이션",
      features: ["기본 AI 큐레이션", "주간 추천 리스트", "찜 목록 저장"],
      cta: "무료로 시작하기",
      href: "/signup?plan=free",
      highlighted: !recommendPro,
    },
    {
      name: "Pro",
      price: won(PRO_PRICE),
      unit: "/월",
      badge: "가장 인기",
      desc: "놓치는 특가 없이, 매달 이득 보는 플랜",
      features: [
        "무제한 AI 매칭",
        "실시간 가격 알림",
        "가격 하락 추적",
        "우선 매칭 큐",
      ],
      cta: "Pro 시작하기",
      href: "/signup?plan=pro",
      highlighted: recommendPro,
    },
    {
      name: "Business",
      price: "문의",
      desc: "재고 순환과 판매를 위한 팀용 플랜",
      features: ["팀 시트", "셀러 대시보드", "API 연동", "전담 매니저"],
      cta: "영업팀에 문의하기",
      href: "mailto:business@repick.co.kr",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <a
        href="#calculator"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-emerald-600"
      >
        본문으로 건너뛰기
      </a>
      {/* 헤더 */}
      <header className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-lg font-bold tracking-tight">repick</span>
          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-8 text-sm text-zinc-600 sm:flex"
          >
            <a
              href="#calculator"
              className="outline-none hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              계산기
            </a>
            <span className="font-medium text-zinc-900" aria-current="page">
              요금제
            </span>
            <a
              href="#faq"
              className="outline-none hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              FAQ
            </a>
          </nav>
          <a
            href="/signup?plan=free"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white outline-none transition motion-reduce:transition-none hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-[0.98] active:bg-zinc-800"
          >
            무료로 시작
          </a>
        </div>
      </header>

      {/* 히어로 + 계산기 */}
      <section id="calculator" className="scroll-mt-16 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-emerald-700">
              repick 요금제
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              얼마를 아낄 수 있을지, 먼저 계산해보세요
            </h1>
            <p className="mt-4 text-base text-zinc-600 sm:text-lg">
              매달 중고 쇼핑 습관을 입력하면, Pro가 진짜 이득인지 영수증으로
              바로 보여드려요. 구독료보다 덜 아끼면 저희가 먼저
              말씀드립니다.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
            {/* 입력 컨트롤 */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-zinc-900">
                나의 중고 쇼핑 습관
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                슬라이더를 움직이면 오른쪽 영수증이 바로 계산돼요.
              </p>

              <div className="mt-8 space-y-9">
                <div>
                  <div className="flex items-baseline justify-between">
                    <label
                      htmlFor="shops"
                      className="text-sm font-medium text-zinc-700"
                    >
                      한 달 중고 구매 횟수
                    </label>
                    <span className="font-mono text-sm tabular-nums text-emerald-700">
                      {shops}회
                    </span>
                  </div>
                  <input
                    id="shops"
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={shops}
                    onChange={(e) => setShops(Number(e.target.value))}
                    className="mt-3 w-full accent-emerald-600 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    aria-describedby="shops-hint"
                  />
                  <p id="shops-hint" className="mt-1 text-xs text-zinc-500">
                    1회 ~ 20회
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <label
                      htmlFor="avg-spend"
                      className="text-sm font-medium text-zinc-700"
                    >
                      건당 평균 지출
                    </label>
                    <span className="font-mono text-sm tabular-nums text-emerald-700">
                      {won(avgSpend)}
                    </span>
                  </div>
                  <input
                    id="avg-spend"
                    type="range"
                    min={10000}
                    max={300000}
                    step={5000}
                    value={avgSpend}
                    onChange={(e) => setAvgSpend(Number(e.target.value))}
                    className="mt-3 w-full accent-emerald-600 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    aria-describedby="spend-hint"
                  />
                  <p id="spend-hint" className="mt-1 text-xs text-zinc-500">
                    ₩10,000 ~ ₩300,000
                  </p>
                </div>
              </div>
            </div>

            {/* 영수증 */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between border-b border-dashed border-zinc-300 pb-3">
                <span className="font-mono text-xs tracking-widest text-zinc-500">
                  RECEIPT · REPICK
                </span>
                <span className="font-mono text-xs text-zinc-500">
                  이번 달 예상
                </span>
              </div>

              <dl className="mt-4 space-y-3 font-mono text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-600">예상 중고 지출 총액</dt>
                  <dd className="tabular-nums text-zinc-900">
                    {won(totalSpend)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 text-rose-600">
                  <dt>알림 없이 놓치는 금액</dt>
                  <dd className="tabular-nums">{won(-missed)}</dd>
                </div>
                <div className="flex justify-between gap-4 text-emerald-700">
                  <dt>Pro 알림으로 회수 가능</dt>
                  <dd className="tabular-nums">{won(recovered)}</dd>
                </div>
                <div className="flex justify-between gap-4 text-zinc-500">
                  <dt>Pro 구독료</dt>
                  <dd className="tabular-nums">{won(-PRO_PRICE)}</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center justify-between border-t-2 border-zinc-900 pt-4">
                <span className="text-sm font-semibold text-zinc-900">
                  이번 달 예상 순절약액
                </span>
                <span
                  aria-live="polite"
                  className={`font-mono text-2xl font-bold tabular-nums ${
                    recommendPro ? "text-emerald-600" : "text-zinc-500"
                  }`}
                >
                  {won(netSaving)}
                </span>
              </div>

              <p className="mt-3 text-sm text-zinc-500" aria-live="polite">
                {recommendPro
                  ? `Pro가 이득이에요. 구독료를 내고도 매달 ${won(
                      netSaving,
                    )}만큼 더 아낄 수 있어요.`
                  : "지금 습관이라면 Free로도 충분해요. 쇼핑이 늘어나면 다시 계산해보세요."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 플랜 카드 */}
      <section className="border-t border-zinc-100 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-zinc-900">플랜 선택</h2>
          <p className="mt-2 text-sm text-zinc-500">
            위 계산기 결과에 맞춰{" "}
            <span
              className={
                recommendPro
                  ? "font-semibold text-emerald-700"
                  : "font-semibold text-zinc-700"
              }
            >
              {recommendPro ? "Pro" : "Free"}
            </span>{" "}
            플랜을 표시해 드렸어요.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-6 sm:p-8 ${
                  tier.highlighted
                    ? "border-emerald-600 ring-2 ring-emerald-600"
                    : "border-zinc-200"
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-6 rounded-full bg-emerald-700 px-3 py-1 text-xs font-semibold text-white">
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-lg font-semibold text-zinc-900">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">{tier.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tabular-nums text-zinc-900">
                    {tier.price}
                  </span>
                  {tier.unit && (
                    <span className="text-sm text-zinc-500">{tier.unit}</span>
                  )}
                </div>

                {tier.name === "Pro" && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      recommendPro ? "text-emerald-700" : "text-zinc-500"
                    }`}
                  >
                    {recommendPro
                      ? `이번 달 예상 절약액 ${won(netSaving)}`
                      : "구매 습관이 늘면 절약액도 커져요"}
                  </p>
                )}

                <ul className="mt-6 flex-1 space-y-2 text-sm text-zinc-600">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-emerald-600">
                        ✓
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.href}
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold outline-none transition motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-[0.98] ${
                    tier.highlighted
                      ? "bg-emerald-700 text-white hover:bg-emerald-800"
                      : "border border-zinc-500 text-zinc-700 hover:bg-zinc-50 active:bg-zinc-100"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 비교 표 */}
      <section className="border-t border-zinc-100 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-zinc-900">
            플랜별 기능 비교
          </h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 text-left text-zinc-500">
                  <th scope="col" className="px-4 py-3 font-medium">
                    기능
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Free
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Pro
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Business
                  </th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 1 ? "bg-zinc-50/60" : undefined}
                  >
                    <th
                      scope="row"
                      className="px-4 py-3 text-left font-medium text-zinc-800"
                    >
                      {row.label}
                    </th>
                    <td className="px-4 py-3 text-zinc-600">
                      <FeatureValue value={row.free} />
                    </td>
                    <td className="px-4 py-3 font-medium text-emerald-700">
                      <FeatureValue value={row.pro} />
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      <FeatureValue value={row.business} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-16 border-t border-zinc-100 px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-zinc-900">자주 묻는 질문</h2>
          <div className="mt-6 divide-y divide-zinc-100 rounded-2xl border border-zinc-200">
            {faqs.map((item) => (
              <details key={item.q} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-zinc-900 outline-none transition-colors hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-zinc-500 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="border-t border-zinc-100 bg-zinc-900 px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            지금 Free로 시작하고, 필요할 때 Pro로 전환하세요
          </h2>
          <p className="mt-3 text-sm text-zinc-300 sm:text-base">
            카드 등록 없이 바로 시작할 수 있어요.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/signup?plan=free"
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white outline-none transition motion-reduce:transition-none hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
            >
              무료로 시작하기
            </a>
            <a
              href="mailto:business@repick.co.kr"
              className="inline-flex items-center justify-center rounded-full border border-zinc-500 px-6 py-3 text-sm font-semibold text-white outline-none transition motion-reduce:transition-none hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] active:bg-zinc-700"
            >
              영업팀에 문의하기
            </a>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-sm text-zinc-500">
          © 2026 repick. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
