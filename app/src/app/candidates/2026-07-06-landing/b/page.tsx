export default function LandingCandidateB() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white antialiased selection:bg-[#6E56CF] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0B0B0F]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-4">
          <span className="text-[15px] font-semibold tracking-[-0.02em]">repick</span>
          <nav className="hidden items-center gap-8 text-sm text-[#A1A1AA] md:flex">
            <a href="#value" className="transition-colors hover:text-white">
              가치
            </a>
            <a href="#proof" className="transition-colors hover:text-white">
              후기
            </a>
            <a href="#cta" className="transition-colors hover:text-white">
              시작하기
            </a>
          </nav>
          <a
            href="#cta"
            className="rounded-md border border-white/10 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:border-white/25"
          >
            로그인
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28">
          {/* glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-220px] h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
            style={{
              background:
                "radial-gradient(closest-side, #6E56CF, rgba(110,86,207,0) 70%)",
            }}
          />
          {/* faint grid texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse 100% 60% at 50% 0%, black 40%, transparent 100%)",
            }}
          />

          <div className="relative mx-auto max-w-[1120px] text-center">
            <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-[#6E56CF]/40 bg-[#6E56CF]/10 px-3.5 py-1.5 text-xs font-medium text-[#C4B5FD]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6E56CF]" />
              AI 리커머스 · 베타 오픈
            </div>

            <h1 className="mx-auto max-w-[880px] text-balance text-5xl font-bold leading-[1.05] tracking-[-0.03em] md:text-7xl lg:text-[84px]">
              버려질 뻔한 것들,
              <br />
              <span className="bg-gradient-to-r from-white via-white to-[#A78BFA] bg-clip-text text-transparent">
                다시 고르다
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-[560px] text-balance text-base text-[#A1A1AA] md:text-lg">
              AI가 당신의 취향을 학습해, 다시 팔릴 만한 중고를 골라 보여줍니다.
              찾는 시간은 줄이고, 마음에 드는 확률은 높입니다.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#cta"
                className="w-full rounded-md bg-[#6E56CF] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(110,86,207,0.5),0_8px_30px_-6px_rgba(110,86,207,0.65)] transition-colors hover:bg-[#7C64DA] sm:w-auto"
              >
                무료로 시작하기
              </a>
              <a
                href="#value"
                className="w-full rounded-md border border-white/10 px-7 py-3 text-sm font-medium text-[#E4E4E7] transition-colors hover:border-white/25 hover:text-white sm:w-auto"
              >
                제품 살펴보기 →
              </a>
            </div>

            {/* product mock panel */}
            <div className="relative mx-auto mt-16 max-w-[860px]">
              <div className="rounded-xl border border-white/[0.08] bg-[#101014] p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="ml-3 text-xs text-[#71717A]">
                    repick.app/for-you
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
                  {[
                    { tag: "97% 일치", label: "빈티지 데님 자켓" },
                    { tag: "94% 일치", label: "무선 이어폰 Pro" },
                    { tag: "91% 일치", label: "필름 카메라" },
                    { tag: "89% 일치", label: "우드 원형 테이블" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                    >
                      <div className="mb-6 h-16 rounded-md bg-gradient-to-br from-white/[0.06] to-transparent md:h-20" />
                      <div className="mb-1 text-[11px] font-medium text-[#A78BFA]">
                        {item.tag}
                      </div>
                      <div className="text-xs text-[#D4D4D8]">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value 3-split */}
        <section id="value" className="border-t border-white/[0.06] px-6 py-24 md:py-32">
          <div className="mx-auto max-w-[1120px]">
            <div className="mx-auto mb-16 max-w-[560px] text-center">
              <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-4xl">
                고르는 방식이 다릅니다
              </h2>
              <p className="mt-3 text-[#A1A1AA]">
                취향을 이해하는 AI, 검증된 신뢰, 투명한 가격 — 세 가지 축으로
                중고 거래의 기본을 다시 세웠습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  icon: (
                    <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
                  ),
                  title: "큐레이션",
                  desc: "취향 데이터를 학습해 당신이 고를 법한 물건만 골라 보여줍니다.",
                },
                {
                  icon: (
                    <path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z" />
                  ),
                  title: "신뢰",
                  desc: "검수 리포트와 거래 히스토리를 투명하게 공개해 안심하고 거래합니다.",
                },
                {
                  icon: (
                    <path d="M4 7h16M4 12h16M4 17h10" />
                  ),
                  title: "가격",
                  desc: "AI 시세 분석으로 산정한 합리적인 가격, 흥정 없이 투명하게.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-7 transition-colors hover:border-[#6E56CF]/40"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-[#6E56CF]/30 bg-[#6E56CF]/10 text-[#A78BFA]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      {f.icon}
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold tracking-[-0.01em]">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-6 text-[#A1A1AA]">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section id="proof" className="border-t border-white/[0.06] px-6 py-24 md:py-32">
          <div className="mx-auto max-w-[1120px]">
            <div className="grid grid-cols-3 gap-6 border-b border-white/[0.06] pb-16 text-center">
              {[
                { num: "128K+", label: "누적 사용자" },
                { num: "4.9", label: "평균 평점" },
                { num: "92%", label: "재구매율" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-4xl font-bold tracking-[-0.02em] text-white md:text-6xl">
                    {s.num}
                  </div>
                  <div className="mt-2 text-xs text-[#A1A1AA] md:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-16 max-w-[720px] text-center">
              <span className="text-6xl leading-none text-[#6E56CF]">&ldquo;</span>
              <p className="mx-auto -mt-6 max-w-[600px] text-balance text-xl font-medium leading-8 tracking-[-0.01em] text-[#E4E4E7] md:text-2xl">
                검색할 필요가 없어졌어요. 매일 아침 취향에 맞는 물건이 먼저
                와서 저를 기다리고 있는 느낌이에요.
              </p>
              <div className="mt-5 text-sm text-[#71717A]">
                김서연 · repick 사용 8개월차
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="cta" className="border-t border-white/[0.06] px-6 py-24 md:py-32">
          <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101014] px-6 py-16 text-center md:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[110px]"
              style={{
                background:
                  "radial-gradient(closest-side, #6E56CF, rgba(110,86,207,0) 70%)",
              }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-[520px] text-balance text-3xl font-bold tracking-[-0.02em] md:text-5xl">
                지금, 취향에 맞는 중고를
                <br />
                먼저 만나보세요
              </h2>
              <p className="mx-auto mt-4 max-w-[440px] text-[#A1A1AA]">
                가입은 무료입니다. 1분이면 첫 큐레이션을 받아볼 수 있어요.
              </p>
              <a
                href="#"
                className="mt-8 inline-block rounded-md bg-[#6E56CF] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(110,86,207,0.5),0_8px_30px_-6px_rgba(110,86,207,0.65)] transition-colors hover:bg-[#7C64DA]"
              >
                무료로 시작하기
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-4 text-xs text-[#71717A] md:flex-row">
          <span>© 2026 repick. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="transition-colors hover:text-[#A1A1AA]">
              이용약관
            </a>
            <a href="#" className="transition-colors hover:text-[#A1A1AA]">
              개인정보처리방침
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
