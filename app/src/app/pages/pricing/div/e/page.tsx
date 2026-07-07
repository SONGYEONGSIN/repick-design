"use client";

import { useState } from "react";

type Billing = "monthly" | "yearly";
type ClayColor = "peach" | "mint" | "lavender";

type Tier = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  price: string;
  priceUnit: string;
  priceNote: string;
  color: ClayColor;
  popular?: boolean;
  cta: string;
  features: string[];
};

type CompareValue = true | false | string;

type CompareRow = {
  label: string;
  free: CompareValue;
  pro: CompareValue;
  biz: CompareValue;
};

const compareRows: CompareRow[] = [
  { label: "AI 큐레이션", free: true, pro: true, biz: true },
  { label: "매칭 개수", free: "주 5건", pro: "무제한", biz: "무제한" },
  { label: "실시간 가격 하락 알림", free: false, pro: true, biz: true },
  { label: "우선 매물 노출", free: false, pro: true, biz: true },
  { label: "판매자 신뢰도 리포트", free: false, pro: true, biz: true },
  { label: "팀 시트", free: false, pro: false, biz: "무제한" },
  { label: "셀러 대시보드 · API 연동", free: false, pro: false, biz: true },
  { label: "전담 매니저", free: false, pro: false, biz: true },
];

const faqs = [
  {
    q: "언제든 해지할 수 있나요?",
    a: "네. 다음 결제일 전에 해지하면 추가 요금 없이 바로 멈춰요. 남은 기간은 그대로 이용하실 수 있어요.",
  },
  {
    q: "Free에서 Pro로 올리면 뭐가 달라지나요?",
    a: "주 5건이던 매칭 개수 제한이 사라지고, 가격이 떨어지는 순간 바로 알림이 와요. 매물도 더 먼저 보여드려요.",
  },
  {
    q: "Business 요금은 어떻게 정해지나요?",
    a: "팀 규모와 API 호출량에 맞춰 견적을 드려요. 문의 남겨주시면 24시간 안에 담당 매니저가 연락드려요.",
  },
];

export default function Landing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  const tiers: Tier[] = [
    {
      id: "free",
      name: "Free",
      emoji: "🍡",
      tagline: "가볍게 시작하는 큐레이션",
      price: "₩0",
      priceUnit: "",
      priceNote: "영원히 무료",
      color: "peach",
      cta: "무료로 시작하기",
      features: [
        "기본 AI 큐레이션",
        "주간 추천 리스트",
        "찜 목록 저장",
        "커뮤니티 알림",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      emoji: "🧡",
      tagline: "무제한 매칭과 실시간 알림",
      price: billing === "monthly" ? "₩9,900" : "₩99,000",
      priceUnit: billing === "monthly" ? "/월" : "/년",
      priceNote:
        billing === "monthly"
          ? "언제든 해지 가능"
          : "월 8,250원 상당 · 2개월 무료",
      color: "mint",
      popular: true,
      cta: "Pro 시작하기",
      features: [
        "Free의 모든 기능",
        "무제한 AI 매칭",
        "실시간 가격 하락 알림",
        "우선 매물 노출",
        "판매자 신뢰도 리포트",
      ],
    },
    {
      id: "business",
      name: "Business",
      emoji: "🧩",
      tagline: "팀과 셀러를 위한 API",
      price: "문의",
      priceUnit: "",
      priceNote: "맞춤 견적 · 24시간 내 회신",
      color: "lavender",
      cta: "데모 요청하기",
      features: [
        "Pro의 모든 기능",
        "팀 시트 무제한",
        "셀러 대시보드",
        "API 연동",
        "전담 매니저",
      ],
    },
  ];

  return (
    <div
      className="clay-page relative min-h-screen overflow-x-hidden bg-[var(--clay-bg)] text-[var(--clay-ink)]"
      style={{
        fontFamily:
          "ui-rounded, 'SF Pro Rounded', 'Segoe UI Rounded', system-ui, -apple-system, sans-serif",
      }}
    >
      <style>{`
        .clay-page {
          --clay-bg: oklch(96% 0.02 85);
          --clay-cream: oklch(94% 0.025 85);
          --clay-white: oklch(99% 0.005 85);

          --clay-peach: oklch(88% 0.07 48);
          --clay-peach-deep: oklch(70% 0.13 42);
          --clay-mint: oklch(87% 0.08 165);
          --clay-mint-deep: oklch(68% 0.14 165);
          --clay-lavender: oklch(87% 0.06 300);
          --clay-lavender-deep: oklch(69% 0.12 300);

          --clay-coral: oklch(75% 0.16 35);
          --clay-coral-deep: oklch(60% 0.17 32);

          --clay-ink: oklch(30% 0.035 300);
          --clay-ink-soft: oklch(46% 0.03 300);
        }

        .clay-surface {
          border-radius: 2.25rem;
          box-shadow:
            -10px -10px 22px 0 rgba(255,255,255,0.75),
            14px 14px 28px 0 rgba(120,90,60,0.16),
            inset 2px 2px 5px 0 rgba(255,255,255,0.55),
            inset -3px -3px 7px 0 rgba(120,90,60,0.07);
        }
        .clay-surface-sm {
          border-radius: 1.5rem;
          box-shadow:
            -6px -6px 14px 0 rgba(255,255,255,0.75),
            8px 8px 18px 0 rgba(120,90,60,0.14),
            inset 2px 2px 4px 0 rgba(255,255,255,0.5),
            inset -2px -2px 5px 0 rgba(120,90,60,0.06);
        }

        .clay-peach { background: var(--clay-peach); }
        .clay-peach-shadow {
          box-shadow:
            -10px -10px 22px 0 rgba(255,255,255,0.7),
            14px 14px 30px 0 oklch(70% 0.13 42 / 0.35),
            inset 2px 2px 5px 0 rgba(255,255,255,0.55),
            inset -3px -3px 7px 0 oklch(70% 0.13 42 / 0.25);
        }
        .clay-mint { background: var(--clay-mint); }
        .clay-mint-shadow {
          box-shadow:
            -10px -10px 22px 0 rgba(255,255,255,0.7),
            16px 16px 34px 0 oklch(68% 0.14 165 / 0.4),
            inset 2px 2px 5px 0 rgba(255,255,255,0.55),
            inset -3px -3px 7px 0 oklch(68% 0.14 165 / 0.28);
        }
        .clay-lavender { background: var(--clay-lavender); }
        .clay-lavender-shadow {
          box-shadow:
            -10px -10px 22px 0 rgba(255,255,255,0.7),
            14px 14px 30px 0 oklch(69% 0.12 300 / 0.35),
            inset 2px 2px 5px 0 rgba(255,255,255,0.55),
            inset -3px -3px 7px 0 oklch(69% 0.12 300 / 0.25);
        }

        .clay-btn {
          border-radius: 999px;
          transition: transform 150ms ease, box-shadow 150ms ease;
        }
        .clay-btn-coral {
          background: linear-gradient(160deg, oklch(80% 0.14 35), var(--clay-coral));
          color: oklch(99% 0.005 85);
          box-shadow:
            -6px -6px 14px 0 rgba(255,255,255,0.5),
            8px 8px 18px 0 oklch(60% 0.17 32 / 0.45),
            inset 1px 1px 2px 0 rgba(255,255,255,0.4);
        }
        .clay-btn-coral:hover { transform: translateY(-2px); }
        .clay-btn-coral:active {
          transform: translateY(1px);
          box-shadow:
            inset 4px 4px 8px 0 oklch(50% 0.16 32 / 0.55),
            inset -3px -3px 6px 0 rgba(255,255,255,0.2);
        }

        .clay-btn-ghost {
          background: var(--clay-cream);
          color: var(--clay-ink);
          box-shadow:
            -5px -5px 12px 0 rgba(255,255,255,0.7),
            6px 6px 14px 0 rgba(120,90,60,0.16),
            inset 1px 1px 2px 0 rgba(255,255,255,0.5);
        }
        .clay-btn-ghost:hover { transform: translateY(-2px); }
        .clay-btn-ghost:active {
          transform: translateY(1px);
          box-shadow:
            inset 4px 4px 8px 0 rgba(120,90,60,0.18),
            inset -3px -3px 6px 0 rgba(255,255,255,0.4);
        }

        .clay-toggle-active {
          background: var(--clay-white);
          box-shadow:
            inset 3px 3px 7px 0 rgba(120,90,60,0.16),
            inset -2px -2px 5px 0 rgba(255,255,255,0.7);
        }

        .clay-focus:focus-visible {
          outline: 3px solid var(--clay-coral-deep);
          outline-offset: 3px;
        }

        .clay-blob {
          border-radius: 42% 58% 62% 38% / 45% 40% 60% 55%;
          filter: blur(0.5px);
        }
        .clay-float {
          animation: clay-float 7s ease-in-out infinite;
        }
        .clay-float-delay {
          animation: clay-float 8.5s ease-in-out infinite;
          animation-delay: 1.2s;
        }
        @keyframes clay-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(4deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .clay-float, .clay-float-delay { animation: none; }
        }

        details.clay-faq summary::-webkit-details-marker { display: none; }
        details.clay-faq[open] .clay-chevron { transform: rotate(180deg); }
      `}</style>

      {/* decorative clay blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="clay-blob clay-float absolute -left-16 top-10 h-52 w-52 bg-[var(--clay-peach)] opacity-70 sm:h-64 sm:w-64" />
        <div className="clay-blob clay-float-delay absolute -right-20 top-40 h-64 w-64 bg-[var(--clay-mint)] opacity-60 sm:h-80 sm:w-80" />
        <div className="clay-blob clay-float absolute left-1/2 bottom-0 h-40 w-40 -translate-x-1/2 bg-[var(--clay-lavender)] opacity-50" />
      </div>

      <div className="relative">
        {/* header */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="clay-surface-sm clay-peach-shadow flex h-10 w-10 items-center justify-center text-lg"
            >
              🍡
            </span>
            <span className="text-lg font-extrabold tracking-tight">repick</span>
          </div>
          <a
            href="#tiers"
            className="clay-btn clay-btn-ghost clay-focus px-4 py-2 text-sm font-semibold"
          >
            요금제 보기
          </a>
        </header>

        <main>
          {/* hero */}
          <section className="mx-auto max-w-3xl px-4 pt-8 pb-14 text-center sm:px-6 lg:px-8">
            <span className="clay-surface-sm clay-lavender-shadow clay-lavender inline-block px-4 py-1.5 text-xs font-bold text-[var(--clay-ink)]">
              말랑말랑 요금제 ✨
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              당신에게 꼭 맞는 플랜,
              <br className="hidden sm:block" /> 말랑하게 골라보세요
            </h1>
            <p className="mt-4 text-base text-[var(--clay-ink-soft)] sm:text-lg">
              AI가 취향을 배우고, 알맞은 중고 매물을 찾아드려요. 부담 없이
              시작해서 필요할 때 쑥 늘려보세요.
            </p>

            {/* billing toggle */}
            <div
              role="group"
              aria-label="결제 주기 선택"
              className="clay-surface-sm clay-cream mx-auto mt-8 inline-flex items-center gap-1 p-1.5"
            >
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                aria-pressed={billing === "monthly"}
                className={`clay-btn clay-focus px-5 py-2 text-sm font-semibold transition-colors ${
                  billing === "monthly"
                    ? "clay-toggle-active text-[var(--clay-ink)]"
                    : "text-[var(--clay-ink-soft)]"
                }`}
              >
                월간 결제
              </button>
              <button
                type="button"
                onClick={() => setBilling("yearly")}
                aria-pressed={billing === "yearly"}
                className={`clay-btn clay-focus flex items-center gap-2 px-5 py-2 text-sm font-semibold transition-colors ${
                  billing === "yearly"
                    ? "clay-toggle-active text-[var(--clay-ink)]"
                    : "text-[var(--clay-ink-soft)]"
                }`}
              >
                연간 결제
                <span className="rounded-full bg-[var(--clay-coral)] px-2 py-0.5 text-[10px] font-bold text-white">
                  2개월 무료
                </span>
              </button>
            </div>
          </section>

          {/* pricing tiers */}
          <section id="tiers" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
            <h2 className="sr-only">요금제 플랜</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start lg:gap-10">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative ${tier.popular ? "md:-translate-y-4" : ""}`}
                >
                  {tier.popular && (
                    <span
                      aria-hidden="true"
                      className="clay-surface-sm absolute -top-5 left-1/2 z-10 -translate-x-1/2 -rotate-6 bg-[var(--clay-coral)] px-4 py-1.5 text-xs font-extrabold text-white shadow-lg"
                    >
                      가장 인기 있어요 🧡
                    </span>
                  )}
                  <div
                    className={`clay-surface clay-${tier.color} clay-${tier.color}-shadow flex h-full flex-col gap-6 p-8`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true" className="text-2xl">
                          {tier.emoji}
                        </span>
                        <h3 className="text-xl font-extrabold">{tier.name}</h3>
                      </div>
                      <p className="mt-1 text-sm text-[var(--clay-ink-soft)]">
                        {tier.tagline}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold tracking-tight">
                          {tier.price}
                        </span>
                        {tier.priceUnit && (
                          <span className="text-base font-semibold text-[var(--clay-ink-soft)]">
                            {tier.priceUnit}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-medium text-[var(--clay-ink-soft)]">
                        {tier.priceNote}
                      </p>
                    </div>

                    <ul className="flex flex-1 flex-col gap-3">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <span
                            aria-hidden="true"
                            className="clay-surface-sm flex h-5 w-5 shrink-0 items-center justify-center bg-[var(--clay-white)] text-[10px] font-bold text-[var(--clay-ink)]"
                          >
                            ✓
                          </span>
                          <span className="text-[var(--clay-ink)]">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={tier.id === "business" ? "#contact" : "#signup"}
                      className={`clay-btn clay-focus w-full py-3 text-center text-sm font-bold ${
                        tier.popular ? "clay-btn-coral" : "clay-btn-ghost"
                      }`}
                    >
                      {tier.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* comparison table */}
          <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                플랜을 한눈에 비교해보세요
              </h2>
              <p className="mt-2 text-sm text-[var(--clay-ink-soft)]">
                어떤 기능이 어디까지 포함되는지 꼼꼼히 살펴보세요.
              </p>
            </div>

            <div className="clay-surface clay-cream overflow-x-auto p-2 sm:p-4">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <caption className="sr-only">Free, Pro, Business 요금제 기능 비교</caption>
                <thead>
                  <tr>
                    <th scope="col" className="px-4 py-4 text-left font-semibold text-[var(--clay-ink-soft)]">
                      기능
                    </th>
                    <th scope="col" className="px-4 py-4 text-center font-extrabold">
                      🍡 Free
                    </th>
                    <th scope="col" className="px-4 py-4 text-center font-extrabold">
                      🧡 Pro
                    </th>
                    <th scope="col" className="px-4 py-4 text-center font-extrabold">
                      🧩 Business
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row, i) => (
                    <tr
                      key={row.label}
                      className={i % 2 === 0 ? "bg-[var(--clay-white)]" : ""}
                      style={{ borderRadius: "1.25rem" }}
                    >
                      <th scope="row" className="rounded-l-2xl px-4 py-4 text-left font-medium">
                        {row.label}
                      </th>
                      <td className="px-4 py-4 text-center">
                        <CompareCell value={row.free} />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <CompareCell value={row.pro} />
                      </td>
                      <td className="rounded-r-2xl px-4 py-4 text-center">
                        <CompareCell value={row.biz} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="mx-auto max-w-2xl px-4 pb-20 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-2xl font-extrabold sm:text-3xl">
              자주 묻는 질문
            </h2>
            <div className="flex flex-col gap-4">
              {faqs.map((item) => (
                <details key={item.q} className="clay-faq clay-surface-sm clay-cream group p-5">
                  <summary className="clay-focus flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold marker:content-none">
                    <span>{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="clay-chevron shrink-0 text-lg transition-transform duration-200"
                    >
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--clay-ink-soft)]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* final CTA */}
          <section
            id="contact"
            className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8"
          >
            <div className="clay-surface clay-mint clay-mint-shadow flex flex-col items-center gap-5 p-10 text-center sm:p-14">
              <span aria-hidden="true" className="text-4xl">
                🫧
              </span>
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                지금 바로 말랑하게 시작해보세요
              </h2>
              <p className="max-w-md text-sm text-[var(--clay-ink-soft)] sm:text-base">
                신용카드 없이 30초면 가입 끝. 마음에 안 들면 언제든 조몰락
                해지하면 그만이에요.
              </p>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <a
                  id="signup"
                  href="#signup"
                  className="clay-btn clay-btn-coral clay-focus px-8 py-3.5 text-sm font-bold"
                >
                  무료로 시작하기 →
                </a>
                <a
                  href="mailto:business@repick.app"
                  className="clay-btn clay-btn-ghost clay-focus px-8 py-3.5 text-sm font-bold"
                >
                  Business 문의하기
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-[var(--clay-cream)] px-4 py-8 text-center text-xs text-[var(--clay-ink-soft)] sm:px-6 lg:px-8">
          © 2026 repick. 말랑한 AI 리커머스.
        </footer>
      </div>
    </div>
  );
}

function CompareCell({ value }: { value: CompareValue }) {
  if (value === true) {
    return (
      <span aria-label="포함" className="text-base font-bold text-[var(--clay-mint-deep)]">
        ✓
      </span>
    );
  }
  if (value === false) {
    return (
      <span aria-label="미포함" className="text-base text-[var(--clay-ink-soft)] opacity-50">
        –
      </span>
    );
  }
  return <span className="text-xs font-semibold">{value}</span>;
}
