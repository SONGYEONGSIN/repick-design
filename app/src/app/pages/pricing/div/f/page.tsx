type Tier = {
  id: "free" | "pro" | "biz";
  name: string;
  price: string;
  unit: string;
  badge: string | null;
  cta: string;
  note: string;
};

type Feature = {
  label: string;
  free: boolean;
  pro: boolean;
  biz: boolean;
};

const tiers: Tier[] = [
  {
    id: "free",
    name: "FREE",
    price: "₩0",
    unit: "무료",
    badge: null,
    cta: "무료로 시작",
    note: "가볍게 둘러보기",
  },
  {
    id: "pro",
    name: "PRO",
    price: "₩9,900",
    unit: "/ 월",
    badge: "★ 인기",
    cta: "PRO 시작하기",
    note: "가장 많이 선택하는 플랜",
  },
  {
    id: "biz",
    name: "BUSINESS",
    price: "문의",
    unit: "별도 견적",
    badge: null,
    cta: "영업팀 문의",
    note: "팀 · 셀러를 위한 플랜",
  },
];

const features: Feature[] = [
  { label: "기본 AI 큐레이션", free: true, pro: true, biz: true },
  { label: "주간 추천 리포트", free: true, pro: true, biz: true },
  { label: "무제한 AI 매칭", free: false, pro: true, biz: true },
  { label: "실시간 가격 알림", free: false, pro: true, biz: true },
  { label: "가격 추적 히스토리", free: false, pro: true, biz: true },
  { label: "팀 시트 (다중 계정)", free: false, pro: false, biz: true },
  { label: "셀러 대시보드", free: false, pro: false, biz: true },
  { label: "API 액세스", free: false, pro: false, biz: true },
];

const faqs = [
  {
    q: "Free에서 Pro로 언제든 바꿀 수 있나요?",
    a: "네, 설정 메뉴에서 즉시 전환됩니다. 남은 기간은 일할 계산으로 다음 결제에 반영돼요.",
  },
  {
    q: "Business 요금은 어떻게 책정되나요?",
    a: "팀 규모와 API 호출량에 따라 견적을 산정합니다. 문의 후 영업일 기준 24시간 내 회신드려요.",
  },
  {
    q: "결제는 언제, 어떻게 이루어지나요?",
    a: "매월 자동 결제되며 카드·계좌이체를 지원합니다. 해지는 언제든 즉시 가능하고 위약금은 없어요.",
  },
];

function Rule({
  char = "─",
  className = "",
}: {
  char?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`select-none overflow-hidden whitespace-nowrap font-mono leading-none ${className}`}
    >
      {char.repeat(500)}
    </div>
  );
}

function Corners() {
  const base =
    "pointer-events-none absolute font-mono text-base leading-none text-black sm:text-lg";
  return (
    <>
      <span aria-hidden="true" className={`${base} -left-[2px] -top-[2px]`}>
        ┌
      </span>
      <span aria-hidden="true" className={`${base} -right-[2px] -top-[2px]`}>
        ┐
      </span>
      <span aria-hidden="true" className={`${base} -bottom-[2px] -left-[2px]`}>
        └
      </span>
      <span aria-hidden="true" className={`${base} -bottom-[2px] -right-[2px]`}>
        ┘
      </span>
    </>
  );
}

function Cell({
  value,
  shade,
  last = false,
}: {
  value: boolean;
  shade: string;
  last?: boolean;
}) {
  return (
    <div
      className={`border-b border-r-2 border-black p-3 text-center text-sm ${shade} ${
        last ? "border-r-0" : ""
      }`}
    >
      {value ? (
        <span aria-hidden="true" className="font-bold text-[#D7263D]">
          ✓
        </span>
      ) : (
        <span aria-hidden="true" className="text-black/20">
          —
        </span>
      )}
      <span className="sr-only">{value ? "포함" : "미포함"}</span>
    </div>
  );
}

function FeatureRow({ f, index }: { f: Feature; index: number }) {
  const zebra = index % 2 === 0 ? "bg-white" : "bg-black/[0.03]";
  return (
    <>
      <div
        className={`border-b border-r-2 border-black p-3 text-xs uppercase tracking-wide text-black/70 ${zebra}`}
      >
        {f.label}
      </div>
      <Cell value={f.free} shade={zebra} />
      <Cell value={f.pro} shade="bg-[#D7263D]/[0.07]" />
      <Cell value={f.biz} shade={zebra} last />
    </>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-mono text-black selection:bg-[#D7263D] selection:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b-2 border-black bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-xs uppercase tracking-widest sm:px-6 md:px-8">
          <a
            href="#top"
            className="font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7263D]"
          >
            [ RE:PICK ]
          </a>
          <nav aria-label="주요 메뉴" className="hidden items-center gap-6 sm:flex">
            <a
              href="#compare"
              className="hover:text-[#D7263D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7263D]"
            >
              비교표
            </a>
            <a
              href="#faq"
              className="hover:text-[#D7263D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7263D]"
            >
              FAQ
            </a>
          </nav>
          <a
            href="#start"
            className="border border-black px-3 py-1.5 transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7263D]"
          >
            시작&gt;_
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="top" className="relative overflow-hidden border-b-2 border-black px-4 pb-10 pt-16 sm:px-6 md:px-8 md:pt-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-2 top-28 hidden origin-top-left -rotate-90 text-[10px] uppercase tracking-[0.4em] text-black/30 md:block"
          >
            AI 리커머스 · 요금제 · 2026
          </div>
          <div className="mx-auto max-w-5xl">
            <p className="text-[11px] uppercase tracking-[0.3em] text-black/50">
              NO.003 —— PRICE LIST —— 2026 EDITION
            </p>
            <h1 className="mt-6 text-6xl font-bold uppercase leading-[0.85] tracking-tight sm:text-8xl md:text-[8.5rem]">
              PRICING
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-black/70 sm:text-base">
              숫자로 정직하게. 3개의 플랜, 8개의 기능, 하나의 표.
              <br />
              필요한 만큼만 고르세요.
            </p>
          </div>
          <Rule char="═" className="mt-10 text-lg text-black" />
          <Rule char="○ " className="border-t border-black/10 py-2 text-sm text-black/30" />
        </section>

        {/* COMPARE */}
        <section id="compare" className="border-b-2 border-black px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              ┌─ TIER COMPARISON ─┐
            </h2>
            <p className="mt-2 text-xs uppercase tracking-widest text-black/50">
              FREE · PRO · BUSINESS — 8 FEATURES
            </p>

            {/* desktop / tablet table */}
            <div className="relative mt-10 hidden border-2 border-black md:block">
              <Corners />
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr]">
                <div className="border-b-2 border-r-2 border-black p-4" />
                {tiers.map((t) => (
                  <div
                    key={t.id}
                    className={`relative border-b-2 border-r-2 border-black p-4 text-center last:border-r-0 ${
                      t.id === "pro" ? "bg-[#D7263D] text-white" : ""
                    }`}
                  >
                    {t.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 border border-black bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black shadow-[2px_2px_0_0_#000]">
                        {t.badge}
                      </span>
                    )}
                    <div className="text-base font-bold uppercase tracking-widest">{t.name}</div>
                    <div className="mt-2 text-2xl font-bold tabular-nums">{t.price}</div>
                    <div
                      className={`text-[11px] uppercase tracking-widest ${
                        t.id === "pro" ? "text-white/80" : "text-black/50"
                      }`}
                    >
                      {t.unit}
                    </div>
                  </div>
                ))}

                {features.map((f, i) => (
                  <FeatureRow key={f.label} f={f} index={i} />
                ))}

                <div className="flex items-center border-r-2 border-black p-4 text-xs uppercase tracking-widest text-black/50">
                  SELECT
                </div>
                {tiers.map((t) => (
                  <div
                    key={t.id}
                    className={`border-r-2 border-black p-4 text-center last:border-r-0 ${
                      t.id === "pro" ? "bg-[#D7263D]" : ""
                    }`}
                  >
                    <a
                      href="#start"
                      className={`inline-block w-full border-2 px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        t.id === "pro"
                          ? "border-white bg-white text-black hover:bg-black hover:text-white focus-visible:outline-white"
                          : "border-black bg-white text-black hover:bg-black hover:text-white focus-visible:outline-[#D7263D]"
                      }`}
                    >
                      {t.cta}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* mobile stacked cards */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:hidden">
              {tiers.map((t) => (
                <div
                  key={t.id}
                  className={`relative border-2 border-black ${
                    t.id === "pro" ? "bg-[#D7263D] text-white" : "bg-white text-black"
                  }`}
                >
                  {t.badge && (
                    <span className="absolute -top-3 left-4 border border-black bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black shadow-[2px_2px_0_0_#000]">
                      {t.badge}
                    </span>
                  )}
                  <div className="border-b-2 border-black p-5">
                    <div className="text-sm font-bold uppercase tracking-widest">{t.name}</div>
                    <div className="mt-2 text-3xl font-bold tabular-nums">{t.price}</div>
                    <div
                      className={`text-[11px] uppercase tracking-widest ${
                        t.id === "pro" ? "text-white/80" : "text-black/50"
                      }`}
                    >
                      {t.unit}
                    </div>
                    <p className={`mt-2 text-xs ${t.id === "pro" ? "text-white/70" : "text-black/50"}`}>
                      {t.note}
                    </p>
                  </div>
                  <ul className={`divide-y p-5 text-sm ${t.id === "pro" ? "divide-white/15" : "divide-black/10"}`}>
                    {features.map((f) => {
                      const v = t.id === "free" ? f.free : t.id === "pro" ? f.pro : f.biz;
                      return (
                        <li key={f.label} className="flex items-center justify-between gap-3 py-2">
                          <span className={t.id === "pro" ? "text-white/90" : "text-black/70"}>
                            {f.label}
                          </span>
                          {v ? (
                            <span
                              aria-hidden="true"
                              className={`font-bold ${t.id === "pro" ? "text-white" : "text-[#D7263D]"}`}
                            >
                              ✓
                            </span>
                          ) : (
                            <span
                              aria-hidden="true"
                              className={t.id === "pro" ? "text-white/30" : "text-black/20"}
                            >
                              —
                            </span>
                          )}
                          <span className="sr-only">{v ? "포함" : "미포함"}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="p-5 pt-0">
                    <a
                      href="#start"
                      className={`block border-2 px-4 py-3 text-center text-xs font-bold uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        t.id === "pro"
                          ? "border-white bg-white text-black focus-visible:outline-white"
                          : "border-black bg-white text-black hover:bg-black hover:text-white focus-visible:outline-[#D7263D]"
                      }`}
                    >
                      {t.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-b-2 border-black px-4 py-16 sm:px-6 md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              FAQ —— 자주 묻는 질문
            </h2>
            <Rule char="─" className="mt-4 text-black/30" />
            <div className="mt-8 divide-y-2 divide-black">
              {faqs.map((item, i) => (
                <details key={item.q} className="group py-5" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-bold uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7263D] sm:text-base [&::-webkit-details-marker]:hidden">
                    <span>
                      <span className="text-[#D7263D]">Q{String(i + 1).padStart(2, "0")}.</span>{" "}
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-black/40 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pl-8 text-sm font-normal normal-case leading-relaxed text-black/70">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="start" className="px-4 py-20 sm:px-6 md:px-8 md:py-28">
          <div className="relative mx-auto max-w-3xl border-2 border-black p-8 text-center sm:p-14">
            <Corners />
            <p className="text-[11px] uppercase tracking-[0.3em] text-black/50">READY TO PICK?</p>
            <h2 className="mt-4 text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl">
              지금 시작하면
              <br />
              <span className="bg-[#D7263D] px-2 text-white">무료</span>입니다
            </h2>
            <p className="mt-5 text-sm text-black/60">카드 등록 없이 30초, 언제든 해지 가능</p>
            <a
              href="#top"
              className="mt-8 inline-block border-2 border-black bg-black px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:border-[#D7263D] hover:bg-[#D7263D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7263D]"
            >
              무료로 시작하기 →
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t-2 border-black px-4 py-8 text-[11px] uppercase tracking-widest text-black/50 sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span>© 2026 RE:PICK — PRICE LIST NO.003</span>
          <nav aria-label="푸터 메뉴" className="flex gap-5">
            <a
              href="#top"
              className="hover:text-[#D7263D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7263D]"
            >
              이용약관
            </a>
            <a
              href="#top"
              className="hover:text-[#D7263D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D7263D]"
            >
              개인정보처리방침
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
