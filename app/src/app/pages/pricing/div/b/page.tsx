import type { ReactNode } from "react";

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  tag: string | null;
  desc: string;
  features: string[];
  cta: string;
  highlight: boolean;
};

const PLANS: Plan[] = [
  {
    id: "01",
    name: "Free",
    price: "₩0",
    period: "",
    tag: null,
    desc: "기본 AI 큐레이션, 맛만 봐라.",
    features: ["주간 AI 추천 리스트", "기본 취향 학습(찜·클릭)", "찜 목록 저장"],
    cta: "무료로 시작",
    highlight: false,
  },
  {
    id: "02",
    name: "Pro",
    price: "₩9,900",
    period: "/월",
    tag: "인기",
    desc: "정가는 찢고, 실시간으로 잡는다.",
    features: [
      "무제한 AI 매칭",
      "실시간 가격 하락 알림",
      "가격 추적 그래프",
      "우선 매물 노출",
    ],
    cta: "Pro 시작하기",
    highlight: true,
  },
  {
    id: "03",
    name: "Business",
    price: "문의",
    period: "",
    tag: null,
    desc: "팀으로, 대량으로, API로.",
    features: ["팀 시트 무제한", "셀러 대시보드", "API 연동", "전담 매니저 배정"],
    cta: "영업팀에 문의",
    highlight: false,
  },
];

const ROWS: [string, string, string, string][] = [
  ["AI 추천 주기", "주간", "실시간", "실시간"],
  ["매칭 매물 수", "제한", "무제한", "무제한"],
  ["가격 하락 알림", "—", "✓", "✓"],
  ["가격 추적 그래프", "—", "✓", "✓"],
  ["팀 시트", "—", "—", "무제한"],
  ["셀러 대시보드 / API", "—", "—", "✓"],
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Free에서 Pro로 언제든 바꿀 수 있나요?",
    a: "네. 해지도 위약금 없이 즉시 됩니다. 남은 기간 요금은 일할 계산해 돌려드립니다.",
  },
  {
    q: "가격 추적은 정확히 어떻게 동작하나요?",
    a: "찜한 매물의 가격 변동을 AI가 상시 감시하고, 하락이 감지되면 실시간으로 알림을 보냅니다.",
  },
  {
    q: "Business 요금은 왜 바로 안내가 없나요?",
    a: "팀 규모, 셀러 수, API 호출량에 따라 달라지기 때문입니다. 영업팀이 직접 뜯어보고 견적을 드립니다.",
  },
];

const TORN_TOP =
  "polygon(0% 100%,3% 25%,6% 100%,9% 15%,12% 85%,15% 0%,18% 90%,21% 20%,24% 100%,27% 30%,30% 100%,33% 10%,36% 85%,39% 0%,42% 95%,45% 25%,48% 100%,51% 15%,54% 90%,57% 0%,60% 80%,63% 20%,66% 100%,69% 10%,72% 95%,75% 30%,78% 100%,81% 15%,84% 85%,87% 0%,90% 90%,93% 25%,96% 100%,100% 10%,100% 100%)";

const TORN_BOTTOM =
  "polygon(0% 0%,100% 0%,100% 15%,97% 95%,94% 20%,91% 100%,88% 15%,85% 90%,82% 0%,79% 95%,76% 25%,73% 100%,70% 10%,67% 85%,64% 0%,61% 95%,58% 20%,55% 100%,52% 10%,49% 90%,46% 0%,43% 95%,40% 30%,37% 100%,34% 10%,31% 85%,28% 0%,25% 95%,22% 20%,19% 100%,16% 10%,13% 90%,10% 0%,7% 95%,4% 25%,1% 100%,0% 0%)";

function OverprintWord({
  children,
  offsetColor = "#e0102a",
}: {
  children: ReactNode;
  offsetColor?: string;
}) {
  return (
    <span className="relative inline-block">
      <span
        aria-hidden
        className="pointer-events-none absolute left-[3px] top-[3px] -z-10"
        style={{ color: offsetColor }}
      >
        {children}
      </span>
      <span>{children}</span>
    </span>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f4f1e8] font-sans text-[#0e0e0e] selection:bg-[#ccff00] selection:text-black">
      {/* photocopy grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.05] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 1px 1px, #000 0, #000 1px, transparent 1.6px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* top bar */}
      <header className="relative z-10 border-b-2 border-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-3 w-3 -rotate-6 bg-[#e0102a]" />
            <span className="font-mono text-sm font-bold uppercase tracking-[0.3em]">
              repick
            </span>
          </div>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-black/50 sm:inline">
            issue no.03 — pricing
          </span>
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 md:px-8 md:pb-20 md:pt-20">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="hidden md:col-span-2 md:flex md:flex-col md:items-start md:gap-4">
              <span aria-hidden className="h-3 w-3 rotate-45 bg-[#e0102a]" />
              <span
                className="font-mono text-[11px] uppercase tracking-[0.5em] text-black/40"
                style={{ writingMode: "vertical-rl" }}
              >
                Swiss × Punk
              </span>
            </div>

            <div className="md:col-span-10">
              <span className="mb-6 inline-flex -rotate-2 items-center gap-2 border-2 border-dashed border-black bg-[#ccff00] px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest">
                Pricing · 요금제
              </span>

              <h1 className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13vw] font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
                <span className="inline-block -rotate-1 bg-black px-2 text-[#f4f1e8]">
                  정가는
                </span>
                <OverprintWord>
                  <span className="inline-block rotate-1">찢는다.</span>
                </OverprintWord>
                <span className="inline-block rotate-1 bg-[#e0102a] px-2 text-[#f4f1e8]">
                  진짜만
                </span>
                <span className="inline-block -rotate-2 border-4 border-black px-2">
                  남는다.
                </span>
              </h1>

              <p className="mt-6 max-w-xl font-mono text-base leading-relaxed text-black/70 md:text-lg">
                수만 개 매물을 AI가 뜯어보고, 진짜 값을 가진 것만 남깁니다.
                요금제는 셋. 나머진 버렸습니다.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  className="border-2 border-black bg-black px-6 py-3 font-mono text-sm font-bold uppercase tracking-wide text-[#f4f1e8] outline-none transition-colors hover:border-[#e0102a] hover:bg-[#e0102a] focus-visible:ring-2 focus-visible:ring-[#0e0e0e] focus-visible:ring-offset-2"
                >
                  무료로 시작
                </button>
                <a
                  href="#compare"
                  className="font-mono text-sm font-bold uppercase tracking-wide underline decoration-[#e0102a] decoration-4 underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                >
                  요금 비교 보기 ↓
                </a>
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden className="h-5 w-full bg-[#e0102a]" style={{ clipPath: TORN_TOP }} />
      </section>

      {/* plans */}
      <section id="plans" className="relative z-10 bg-[#f4f1e8]">
        <div className="mx-auto max-w-6xl px-4 pt-14 md:px-8">
          <div className="mb-10 flex items-baseline gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e0102a]">
              02 / plans
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
              셋 중 하나, 골라 뜯어라
            </h2>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y-2 divide-black border-y-2 border-black md:grid-cols-3 md:divide-x-2 md:divide-y-0">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative px-6 py-10 md:px-8 ${
                plan.highlight ? "bg-[#0e0e0e] text-[#f4f1e8]" : "bg-[#f4f1e8] text-[#0e0e0e]"
              }`}
            >
              {plan.tag ? (
                <>
                  <span
                    aria-hidden
                    className="absolute -top-3 right-6 h-6 w-24 -rotate-3 opacity-90 md:right-8"
                    style={{
                      background:
                        "repeating-linear-gradient(45deg, #ccff00, #ccff00 6px, #b8e600 6px, #b8e600 12px)",
                    }}
                  />
                  <span className="absolute -top-4 right-8 -rotate-6 border-2 border-dashed border-[#ccff00] bg-black px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-[#ccff00] md:right-10">
                    {plan.tag}
                  </span>
                </>
              ) : null}

              <span
                className={`font-mono text-xs font-bold uppercase tracking-widest ${
                  plan.highlight ? "text-[#ccff00]" : "text-[#e0102a]"
                }`}
              >
                {plan.id}
              </span>
              <h3 className="mt-2 text-xl font-black uppercase tracking-tight md:text-2xl">
                {plan.name}
              </h3>
              <p
                className={`mt-1 font-mono text-sm ${
                  plan.highlight ? "text-[#f4f1e8]/60" : "text-black/60"
                }`}
              >
                {plan.desc}
              </p>

              <div className="mt-6">
                {plan.highlight ? (
                  <p className="font-mono text-sm text-[#f4f1e8]/40 line-through decoration-[#e0102a] decoration-2">
                    런칭 정가 ₩19,900
                  </p>
                ) : null}
                <p className="flex items-baseline gap-1 font-mono">
                  <span className="text-4xl font-black md:text-5xl">{plan.price}</span>
                  {plan.period ? (
                    <span
                      className={`text-sm ${plan.highlight ? "text-[#f4f1e8]/60" : "text-black/50"}`}
                    >
                      {plan.period}
                    </span>
                  ) : null}
                </p>
              </div>

              <ul className="mt-6 flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-mono text-sm">
                    <span
                      aria-hidden
                      className={`mt-1 inline-block h-2 w-2 shrink-0 rotate-45 ${
                        plan.highlight ? "bg-[#ccff00]" : "bg-[#e0102a]"
                      }`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-8 w-full border-2 px-5 py-3 font-mono text-sm font-bold uppercase tracking-wide outline-none transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  plan.highlight
                    ? "border-[#ccff00] bg-[#ccff00] text-black shadow-[4px_4px_0_#e0102a] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#e0102a] focus-visible:ring-[#ccff00]"
                    : "border-black bg-transparent text-black shadow-[4px_4px_0_#0e0e0e] hover:-translate-y-0.5 hover:bg-black hover:text-[#f4f1e8] focus-visible:ring-black"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* comparison */}
      <section id="compare" className="relative z-10 border-b-2 border-black bg-[#f4f1e8]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <div className="mb-8 flex items-baseline gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e0102a]">
              03 / grid
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
              전부 뜯어봤다
            </h2>
          </div>

          <div className="overflow-x-auto border-2 border-black">
            <table className="w-full min-w-[560px] border-collapse font-mono text-sm">
              <thead>
                <tr className="border-b-2 border-black bg-black text-[#f4f1e8]">
                  <th scope="col" className="px-4 py-3 text-left uppercase tracking-wide">
                    항목
                  </th>
                  <th scope="col" className="px-4 py-3 text-left uppercase tracking-wide">
                    Free
                  </th>
                  <th
                    scope="col"
                    className="bg-[#ccff00] px-4 py-3 text-left uppercase tracking-wide text-black"
                  >
                    Pro
                  </th>
                  <th scope="col" className="px-4 py-3 text-left uppercase tracking-wide">
                    Business
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, free, pro, biz], i) => (
                  <tr key={label} className={i % 2 === 1 ? "bg-black/[0.03]" : undefined}>
                    <th scope="row" className="border-t-2 border-black px-4 py-3 text-left font-bold">
                      {label}
                    </th>
                    <td className="border-t-2 border-black px-4 py-3 text-black/50">{free}</td>
                    <td className="border-t-2 border-black bg-[#ccff00]/10 px-4 py-3 font-bold">
                      {pro}
                    </td>
                    <td className="border-t-2 border-black px-4 py-3">{biz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* faq */}
      <section className="relative z-10 bg-[#f4f1e8]">
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
          <div className="mb-8 flex items-baseline gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e0102a]">
              04 / faq
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
              묻기 전에 뜯어봐
            </h2>
          </div>

          <div className="border-t-2 border-black">
            {FAQS.map((item, i) => (
              <details key={item.q} className="group border-b-2 border-black py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-sm font-bold uppercase tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:text-base">
                  <span className="flex items-center gap-3">
                    <span className="text-[#e0102a]">{String(i + 1).padStart(2, "0")}</span>
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="inline-block shrink-0 text-lg font-black transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 pl-9 font-mono text-sm leading-relaxed text-black/60">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* final cta */}
      <section className="relative z-10">
        <div
          aria-hidden
          className="h-6 w-full bg-[#f4f1e8] md:h-8"
          style={{ clipPath: TORN_BOTTOM }}
        />
        <div className="bg-[#0e0e0e] text-[#f4f1e8]">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center md:px-8 md:py-24">
            <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
              재고 그만,
              <span className="mx-2 inline-block -rotate-2 bg-[#ccff00] px-2 text-black">
                지금 뜯어봐
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-md font-mono text-sm text-[#f4f1e8]/60 md:text-base">
              신용카드 없이 30초. 마음에 안 들면 그냥 찢어버리면 됩니다.
            </p>
            <button
              type="button"
              className="mt-8 border-2 border-[#ccff00] bg-[#ccff00] px-8 py-4 font-mono text-sm font-bold uppercase tracking-wide text-black shadow-[6px_6px_0_#e0102a] outline-none transition-transform hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#e0102a] focus-visible:ring-2 focus-visible:ring-[#ccff00] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              무료로 시작하기 →
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t-2 border-black bg-[#f4f1e8]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 font-mono text-[11px] uppercase tracking-widest text-black/50 md:flex-row md:px-8">
          <span>© repick — 찢어진 가격표 위에 새로 씀</span>
          <span>Swiss grid, punk hands</span>
        </div>
      </footer>
    </div>
  );
}
