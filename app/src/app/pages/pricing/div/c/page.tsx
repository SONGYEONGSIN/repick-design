const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a3c8f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e7d6ab] rounded-[2px]";

function Pin({ color = "#c0392b", className = "" }: { color?: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-20 h-3.5 w-3.5 rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.45)] ${className}`}
      style={{
        background: `radial-gradient(circle at 32% 28%, #fff 0%, ${color} 42%, #3a0d0d 100%)`,
      }}
    />
  );
}

function Tape({ className = "", tint = "rgba(255,236,153,0.8)" }: { className?: string; tint?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`tape-tex absolute z-20 h-5 w-16 shadow-[0_1px_2px_rgba(0,0,0,0.25)] sm:h-6 sm:w-20 ${className}`}
      style={{ background: tint }}
    />
  );
}

function Stamp({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`handwrite absolute z-20 flex h-16 w-16 rotate-[-14deg] items-center justify-center rounded-full border-[3px] border-double border-[#b3261e] text-[11px] font-bold tracking-widest text-[#b3261e] opacity-80 sm:h-20 sm:w-20 sm:text-xs ${className}`}
    >
      {label}
    </span>
  );
}

export default function Landing() {
  const tiers = [
    {
      id: "free",
      name: "FREE",
      note: "가볍게 찢어써보기",
      price: "₩0",
      unit: "평생 무료",
      paper: "#f6efd9",
      rotate: "rotate-[-2.5deg]",
      features: ["기본 AI 큐레이션", "주간 추천 리스트", "찜하기 무제한"],
      cta: "무료로 시작하기",
      ctaStyle: "border border-[#8a7b52] text-[#5b4d2a] hover:bg-[#5b4d2a] hover:text-[#f6efd9]",
    },
    {
      id: "pro",
      name: "PRO",
      note: "다들 이거 씀",
      price: "₩9,900",
      unit: "/ 월",
      paper: "#fffaf0",
      rotate: "rotate-[1.5deg]",
      features: ["무제한 AI 매칭", "실시간 가격 알림", "가격 추적 그래프", "우선 매칭 큐"],
      cta: "Pro로 오려붙이기",
      ctaStyle: "bg-[#b3261e] text-[#fffaf0] hover:bg-[#8f1c16]",
      featured: true,
    },
    {
      id: "biz",
      name: "BUSINESS",
      note: "봉투째로 상담",
      price: "문의",
      unit: "맞춤 견적",
      paper: "#d9c7a0",
      rotate: "rotate-[-1deg]",
      features: ["팀 시트 관리", "셀러 대시보드", "API 연동", "전담 매니저"],
      cta: "영업팀에 문의",
      ctaStyle: "border border-[#4a3c1e] text-[#3a2f18] hover:bg-[#3a2f18] hover:text-[#d9c7a0]",
    },
  ];

  const compareRows = [
    { label: "AI 큐레이션", free: true, pro: true, biz: true },
    { label: "주간 추천", free: true, pro: true, biz: true },
    { label: "무제한 매칭", free: false, pro: true, biz: true },
    { label: "실시간 알림", free: false, pro: true, biz: true },
    { label: "가격 추적", free: false, pro: true, biz: true },
    { label: "팀 시트", free: false, pro: false, biz: true },
    { label: "셀러 대시보드", free: false, pro: false, biz: true },
    { label: "API 연동", free: false, pro: false, biz: true },
  ];

  const faqs = [
    {
      q: "Pro는 아무 때나 해지할 수 있나요?",
      a: "네. 테이프 떼듯 언제든 해지 가능해요. 위약금도, 붙잡는 팝업도 없습니다.",
      tint: "#fff275",
      rotate: "rotate-[-2deg]",
    },
    {
      q: "Free에서 Pro로 넘어가면 데이터가 남아있나요?",
      a: "찜 목록, 취향 학습 데이터는 그대로 이어붙습니다. 처음부터 다시 오릴 필요 없어요.",
      tint: "#ffc4dd",
      rotate: "rotate-[1.5deg]",
    },
    {
      q: "Business는 어떻게 시작하나요?",
      a: "하단 '영업팀에 문의' 버튼으로 신청하면 담당자가 24시간 내 연락드립니다.",
      tint: "#bfe3ff",
      rotate: "rotate-[-1deg]",
    },
  ];

  return (
    <div className="corkboard relative min-h-screen overflow-x-clip pb-10 text-[#3a2f18]">
      <style>{`
        .corkboard {
          background-color: #c9a877;
          background-image:
            radial-gradient(circle at 12% 22%, rgba(90,58,24,0.28) 0, rgba(90,58,24,0.28) 2px, transparent 2.5px),
            radial-gradient(circle at 68% 12%, rgba(90,58,24,0.22) 0, rgba(90,58,24,0.22) 2px, transparent 2.5px),
            radial-gradient(circle at 40% 55%, rgba(90,58,24,0.2) 0, rgba(90,58,24,0.2) 2px, transparent 2.5px),
            radial-gradient(circle at 85% 60%, rgba(90,58,24,0.24) 0, rgba(90,58,24,0.24) 2px, transparent 2.5px),
            radial-gradient(circle at 22% 85%, rgba(90,58,24,0.2) 0, rgba(90,58,24,0.2) 2px, transparent 2.5px),
            radial-gradient(circle at 92% 90%, rgba(90,58,24,0.22) 0, rgba(90,58,24,0.22) 2px, transparent 2.5px),
            linear-gradient(135deg, #cdab7c 0%, #bb9765 45%, #c9a877 100%);
          background-size: 160px 160px, 190px 190px, 140px 140px, 210px 210px, 170px 170px, 150px 150px, 100% 100%;
        }
        .handwrite {
          font-family: "Segoe Print", "Bradley Hand", "Chalkboard SE", "Comic Sans MS", cursive;
        }
        .tape-tex {
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.4) 0px,
            rgba(255,255,255,0.4) 3px,
            rgba(255,255,255,0.12) 3px,
            rgba(255,255,255,0.12) 7px
          );
          opacity: 0.85;
        }
        .torn-card {
          clip-path: polygon(
            0% 2%, 5% 0%, 11% 3%, 17% 1%, 23% 4%, 29% 0%, 35% 3%, 41% 1%, 47% 4%, 53% 0%,
            59% 3%, 65% 1%, 71% 4%, 77% 0%, 83% 3%, 89% 1%, 95% 4%, 100% 1%,
            100% 96%, 95% 100%, 89% 97%, 83% 100%, 77% 97%, 71% 100%, 65% 97%, 59% 100%,
            53% 97%, 47% 100%, 41% 97%, 35% 100%, 29% 97%, 23% 100%, 17% 97%, 11% 100%, 5% 97%, 0% 100%
          );
        }
        .torn-strip-top {
          clip-path: polygon(
            0% 6%, 4% 0%, 9% 7%, 14% 1%, 19% 6%, 24% 0%, 29% 7%, 34% 1%, 39% 6%, 44% 0%,
            49% 7%, 54% 1%, 59% 6%, 64% 0%, 69% 7%, 74% 1%, 79% 6%, 84% 0%, 89% 7%, 94% 1%, 100% 6%,
            100% 100%, 0% 100%
          );
        }
        .torn-strip-bottom {
          clip-path: polygon(
            0% 0%, 100% 0%,
            100% 94%, 96% 100%, 91% 93%, 86% 99%, 81% 94%, 76% 100%, 71% 93%, 66% 99%, 61% 94%, 56% 100%,
            51% 93%, 46% 99%, 41% 94%, 36% 100%, 31% 93%, 26% 99%, 21% 94%, 16% 100%, 11% 93%, 6% 99%, 0% 94%
          );
        }
        .paper-lines {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent 27px,
            rgba(90,58,24,0.12) 27px,
            rgba(90,58,24,0.12) 28px
          );
        }
        .cut-line {
          background-image: repeating-linear-gradient(to right, #5b4d2a 0 8px, transparent 8px 16px);
        }
        @keyframes sway {
          0%, 100% { transform: rotate(var(--r, 0deg)); }
          50% { transform: rotate(calc(var(--r, 0deg) + 0.8deg)); }
        }
        .sway { animation: sway 5.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sway { animation: none; }
        }
      `}</style>

      {/* HEADER */}
      <header className="relative z-30 px-4 pt-6 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div className="relative -rotate-2 bg-[#fbf4de] px-4 py-2 shadow-[3px_4px_6px_rgba(0,0,0,0.28)]">
            <Tape className="-top-3 left-3 -rotate-6" />
            <span className="handwrite text-lg font-bold text-[#3a2f18] sm:text-xl">repick.</span>
          </div>
          <nav aria-label="주 메뉴" className="flex flex-wrap gap-3 text-sm">
            {[
              { href: "#tiers", label: "요금제" },
              { href: "#compare", label: "비교표" },
              { href: "#faq", label: "FAQ" },
              { href: "#cta", label: "시작하기" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`handwrite rotate-[-1deg] border-b-2 border-dotted border-[#5b4d2a] px-1 pb-0.5 text-[#3a2f18] hover:border-solid hover:text-[#b3261e] ${focusRing}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative z-10 px-4 pb-16 pt-14 sm:px-8 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="handwrite -rotate-1 text-sm text-[#5b4d2a] sm:text-base">
              ✂️ 필요한 만큼만, 오려서 쓰는 요금제
            </p>
            <h1 className="relative mt-4 inline-block rotate-[-1deg] bg-[#fbf4de] px-6 py-4 text-3xl font-black leading-tight text-[#3a2f18] shadow-[4px_5px_0_rgba(58,47,24,0.25)] sm:px-10 sm:py-6 sm:text-5xl">
              <span aria-hidden="true">
                <Pin className="-left-2 -top-2" />
                <Pin className="-right-2 -top-2" color="#1a3c8f" />
              </span>
              요금제, 오려 붙였습니다
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-[#4a3c1e] sm:text-base">
              중고템을 고르듯, 필요한 조각만 골라 붙이면 됩니다.
              <br className="hidden sm:block" />
              찾고 · 비교하고 · 알림받는 것까지, 스크랩 한 장이면 충분해요.
            </p>
          </div>
        </section>

        {/* TIERS */}
        <section id="tiers" aria-labelledby="tiers-heading" className="relative z-10 px-4 pb-20 sm:px-8">
          <h2 id="tiers-heading" className="sr-only">
            요금제 3종
          </h2>
          <div className="mx-auto grid max-w-5xl gap-10 pt-6 sm:grid-cols-3 sm:gap-6">
            {tiers.map((tier) => (
              <div key={tier.id} className={`relative ${tier.rotate}`}>
                {tier.featured && <Stamp label="인기" className="-right-4 -top-6 sm:-right-6" />}
                <Tape
                  className={`-top-3 left-1/2 -translate-x-1/2 ${tier.featured ? "rotate-3" : "-rotate-6"}`}
                  tint={tier.featured ? "rgba(255,196,221,0.85)" : undefined}
                />
                <Pin
                  className="left-3 top-3"
                  color={tier.featured ? "#1a3c8f" : "#c0392b"}
                />
                <div
                  className={`torn-card paper-lines relative flex h-full flex-col px-6 pb-8 pt-10 shadow-[5px_7px_10px_rgba(0,0,0,0.3)] ${
                    tier.featured ? "ring-2 ring-[#b3261e]/40" : ""
                  }`}
                  style={{ background: tier.paper }}
                >
                  <p className="handwrite -rotate-1 text-xs text-[#6b5a35]">{tier.note}</p>
                  <p className="mt-1 text-2xl font-black tracking-wide text-[#3a2f18]">{tier.name}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#3a2f18] sm:text-4xl">{tier.price}</span>
                    <span className="text-xs text-[#6b5a35]">{tier.unit}</span>
                  </div>

                  <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[#3a2f18]">
                        <span aria-hidden="true" className="handwrite mt-[-2px] text-base text-[#b3261e]">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#cta"
                    className={`mt-8 inline-flex items-center justify-center rounded-sm px-4 py-2.5 text-sm font-bold transition-colors ${tier.ctaStyle} ${focusRing}`}
                  >
                    {tier.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARE */}
        <section id="compare" aria-labelledby="compare-heading" className="relative z-10 px-4 pb-20 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <h2
              id="compare-heading"
              className="handwrite rotate-[-1deg] text-center text-xl text-[#3a2f18] sm:text-2xl"
            >
              — 뭐가 다른지 오려서 비교해봤어요 —
            </h2>

            <div className="relative mx-auto mt-8 max-w-xl rotate-[0.5deg] shadow-[4px_6px_10px_rgba(0,0,0,0.28)]">
              <div className="torn-strip-top h-4 bg-[#fbf4de]" aria-hidden="true" />
              <div className="overflow-x-auto bg-[#fbf4de] px-4 sm:px-6">
                <table className="w-full min-w-[420px] border-collapse text-sm">
                  <caption className="sr-only">Free, Pro, Business 요금제 기능 비교표</caption>
                  <thead>
                    <tr className="border-b-2 border-dashed border-[#8a7b52] text-[#3a2f18]">
                      <th scope="col" className="py-2.5 pl-1 text-left font-bold">
                        기능
                      </th>
                      <th scope="col" className="px-2 py-2.5 text-center font-bold">
                        Free
                      </th>
                      <th scope="col" className="px-2 py-2.5 text-center font-bold text-[#b3261e]">
                        Pro
                      </th>
                      <th scope="col" className="px-2 py-2.5 text-center font-bold">
                        Business
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map((row) => (
                      <tr key={row.label} className="border-b border-dotted border-[#c9bb92]">
                        <th scope="row" className="py-2.5 pl-1 text-left font-normal text-[#3a2f18]">
                          {row.label}
                        </th>
                        <td className="px-2 py-2.5 text-center">
                          {row.free ? (
                            <span aria-label="포함" className="handwrite text-[#5b4d2a]">
                              ✓
                            </span>
                          ) : (
                            <span aria-label="미포함" className="text-[#c9bb92]">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          {row.pro ? (
                            <span aria-label="포함" className="handwrite text-[#b3261e]">
                              ✓
                            </span>
                          ) : (
                            <span aria-label="미포함" className="text-[#c9bb92]">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          {row.biz ? (
                            <span aria-label="포함" className="handwrite text-[#5b4d2a]">
                              ✓
                            </span>
                          ) : (
                            <span aria-label="미포함" className="text-[#c9bb92]">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="torn-strip-bottom h-4 bg-[#fbf4de]" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="relative z-10 px-4 pb-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 id="faq-heading" className="handwrite rotate-1 text-center text-xl text-[#3a2f18] sm:text-2xl">
              — 자주 붙는 질문 —
            </h2>
            <div className="mx-auto mt-10 grid gap-10 pt-4 sm:grid-cols-3 sm:gap-6">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className={`sway group relative ${item.rotate}`}
                  style={{ ["--r" as string]: item.rotate.replace(/[^-\d.]/g, "") + "deg" }}
                >
                  <Pin className="left-1/2 -top-2 -translate-x-1/2" color="#1a3c8f" />
                  <summary
                    className={`list-none rounded-sm px-5 py-6 text-sm font-bold text-[#3a2f18] shadow-[3px_5px_8px_rgba(0,0,0,0.25)] ${focusRing}`}
                    style={{ background: item.tint }}
                  >
                    <span className="flex items-start justify-between gap-2">
                      {item.q}
                      <span aria-hidden="true" className="handwrite shrink-0 text-lg group-open:hidden">
                        +
                      </span>
                      <span aria-hidden="true" className="hidden shrink-0 handwrite text-lg group-open:block">
                        −
                      </span>
                    </span>
                  </summary>
                  <p
                    className="handwrite -mt-1 rounded-b-sm px-5 pb-5 pt-1 text-sm leading-relaxed text-[#3a2f18]"
                    style={{ background: item.tint }}
                  >
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" aria-labelledby="cta-heading" className="relative z-10 px-4 pb-24 sm:px-8">
          <div className="mx-auto max-w-md rotate-[-1deg] text-center">
            <div className="cut-line h-px w-full" aria-hidden="true" />
            <div className="relative mt-1 border-2 border-dashed border-[#5b4d2a] bg-[#fbf4de] px-6 py-8 shadow-[4px_6px_10px_rgba(0,0,0,0.28)]">
              <Pin className="left-3 top-3" />
              <Pin className="right-3 top-3" color="#1a3c8f" />
              <h2 id="cta-heading" className="text-2xl font-black text-[#3a2f18]">
                첫 달, Pro 무료체험
              </h2>
              <p className="mt-2 text-sm text-[#4a3c1e]">
                오늘 오려가면 한 달 동안 전체 기능을 다 씁니다.
              </p>
              <a
                href="#"
                className={`mt-6 inline-flex items-center gap-2 rounded-sm bg-[#b3261e] px-8 py-3 text-sm font-bold text-[#fffaf0] transition-colors hover:bg-[#8f1c16] ${focusRing}`}
              >
                지금 오려가기 <span aria-hidden="true">✂️</span>
              </a>
            </div>
            <div className="cut-line mt-1 h-px w-full" aria-hidden="true" />
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-4 pb-8 pt-4 text-center sm:px-8">
        <p className="handwrite text-xs text-[#5b4d2a]">© 2026 repick — 조각조각 모아 쓰는 중고 큐레이션</p>
      </footer>
    </div>
  );
}
