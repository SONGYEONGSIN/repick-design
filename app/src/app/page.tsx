const categories = ["전체", "아우터", "가구", "전자기기", "오디오"];

const products = [
  {
    category: "아우터",
    name: "빈티지 데님 자켓",
    match: 96,
    price: 42000,
    original: 89000,
    mark: 4,
    condition: "S",
    tags: ["찜 이력 기반 매칭", "판매자 인증 4.9"],
  },
  {
    category: "가구",
    name: "미드센추리 원목 스툴",
    match: 91,
    price: 35000,
    original: 68000,
    mark: 7,
    condition: "A",
    tags: ["구매 이력 기반 매칭", "상태 검수 완료"],
  },
  {
    category: "전자기기",
    name: "필름카메라 캐논 AE-1",
    match: 88,
    price: 128000,
    original: 219000,
    mark: 2,
    condition: "A",
    tags: ["클릭 이력 기반 매칭", "정품 인증 확인"],
  },
  {
    category: "오디오",
    name: "턴테이블 레코드 플레이어",
    match: 84,
    price: 76000,
    original: 145000,
    mark: 11,
    condition: "B",
    tags: ["취향 그래프 상위 5%", "판매자 인증 4.7"],
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white antialiased">
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[60] focus-visible:rounded-full focus-visible:bg-[#6E56CF] focus-visible:px-5 focus-visible:py-2.5 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
      >
        본문 바로가기
      </a>
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-5 lg:px-10">
          <span className="text-sm font-semibold tracking-[-0.01em]">
            repick <span className="font-normal text-[#A1A1AA]">/ 01</span>
          </span>
          <nav className="hidden items-center gap-8 text-sm font-normal text-[#A1A1AA] md:flex">
            <a
              href="#preview"
              className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              미리보기
            </a>
            <a
              href="#value"
              className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              방식
            </a>
            <a
              href="#proof"
              className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              신뢰
            </a>
            <a
              href="#cta"
              className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              시작하기
            </a>
          </nav>
          <a
            href="#cta"
            className="relative rounded-full border border-white/15 px-4 py-2 text-xs font-semibold tracking-[0.02em] text-white transition-colors after:absolute after:-inset-2.5 after:content-[''] hover:border-white/30 active:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
          >
            무료로 시작
          </a>
        </div>
      </header>

      <main id="main-content">
      {/* Hero */}
      <section id="hero" className="relative overflow-hidden border-b border-white/10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-0 select-none text-[clamp(6rem,26vw,19rem)] font-extrabold leading-none tracking-[-0.04em] text-white/[0.05]"
        >
          01
        </span>

        <div className="relative z-10 mx-auto grid max-w-[1320px] grid-cols-12 gap-x-6 gap-y-14 px-6 pt-24 pb-28 lg:px-10 lg:pt-32 lg:pb-40">
          <p className="col-span-12 text-xs font-semibold uppercase tracking-[0.28em] text-[#A1A1AA] lg:col-span-3 lg:col-start-1">
            01 — 소개
            <br className="hidden lg:block" /> AI 리커머스 큐레이션
          </p>

          <h1 className="col-span-12 max-w-[18ch] text-[clamp(1.875rem,9vw,3.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em] lg:col-span-9 lg:col-start-4 lg:text-[clamp(2.5rem,7vw,6.5rem)] lg:leading-[0.96] lg:tracking-[-0.035em]">
            버려질 뻔한 것들,
            <br />
            <span className="text-[#6E56CF]">다시</span>, 고르다.
          </h1>

          <p className="col-span-12 max-w-[38ch] text-base font-normal leading-[1.6] text-[#A1A1AA] lg:col-span-5 lg:col-start-1">
            AI가 당신의 취향을 학습해 수많은 중고 상품 중 지금 당신에게 맞는 것만 다시
            골라드립니다.
          </p>

          <div className="col-span-12 flex flex-wrap items-center gap-5 lg:col-span-6 lg:col-start-7">
            <a
              href="#cta"
              className="rounded-full bg-[#6E56CF] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7C69DB] active:bg-[#5D48BE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              무료로 시작하기
            </a>
            <a
              href="#preview"
              className="rounded-sm text-sm font-semibold text-[#A1A1AA] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              결과 미리보기 →
            </a>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <div
              aria-hidden="true"
              className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square bg-[#0B0B0F] ${i === 4 ? "bg-[#6E56CF]" : ""}`}
                />
              ))}
            </div>
            <p className="mt-3 text-[11px] font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
              Fig. 01 — 취향 매칭 지도
            </p>
          </div>
        </div>
      </section>

      {/* Preview — product card mock */}
      <section id="preview" className="relative overflow-hidden border-b border-white/10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-8 right-0 select-none text-[clamp(4.5rem,12vw,10rem)] font-extrabold leading-none tracking-[-0.03em] text-white/[0.05]"
        >
          02
        </span>

        <div className="relative z-10 mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-36">
          <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <p className="col-span-12 text-xs font-semibold uppercase tracking-[0.28em] text-[#A1A1AA] lg:col-span-2">
              02 — 미리보기
            </p>
            <h2 className="col-span-12 max-w-[20ch] text-[clamp(1.75rem,3.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] lg:col-span-6 lg:col-start-3">
              지금, AI가 고른 것들
            </h2>
            <p className="col-span-12 max-w-[32ch] text-sm font-normal leading-[1.6] text-[#A1A1AA] lg:col-span-3 lg:col-start-10">
              실시간으로 매칭되는 실제 리픽 결과의 일부입니다.
            </p>
          </div>

          {/* Static category tabs */}
          <div
            aria-label="상품 카테고리, 전체 표시 중"
            className="mt-10 flex flex-wrap gap-2 border-b border-white/10 pb-8 lg:mt-14"
          >
            {categories.map((c, i) => (
              <span
                key={c}
                aria-current={i === 0 ? "true" : undefined}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[-0.01em] ${
                  i === 0
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 text-[#A1A1AA]"
                }`}
              >
                {c}
              </span>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 lg:mt-14 lg:grid-cols-4 lg:gap-6">
            {products.map((p) => {
              const discount = Math.round((1 - p.price / p.original) * 100);
              return (
                <div
                  key={p.name}
                  className="overflow-hidden rounded-md border border-white/10 bg-white/[0.03]"
                >
                  <div aria-hidden="true" className="grid grid-cols-4 gap-px bg-white/10">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square bg-[#0B0B0F] ${i === p.mark ? "bg-[#6E56CF]" : ""}`}
                      />
                    ))}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
                        {p.category}
                      </span>
                      <span className="rounded-full bg-[#6E56CF] px-2 py-0.5 text-[11px] font-semibold tracking-[-0.01em] text-white">
                        매칭 {p.match}%
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-semibold leading-[1.4] tracking-[-0.01em]">
                      {p.name}
                    </h3>

                    {/* AI matching rationale tags + condition badge */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-sm border border-white/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.04em] text-white/70">
                        {p.condition}등급
                      </span>
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 px-2 py-1 text-[10px] font-normal leading-none text-[#A1A1AA]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Before/after price + discount emphasis */}
                    <div className="mt-4 flex items-end justify-between gap-2 border-t border-white/10 pt-4">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-extrabold tracking-[-0.02em]">
                            {p.price.toLocaleString("ko-KR")}원
                          </span>
                          <span className="text-xs font-normal text-[#A1A1AA] line-through">
                            {p.original.toLocaleString("ko-KR")}원
                          </span>
                        </div>
                        <p className="mt-2 flex items-center gap-1.5 text-[10px] font-normal uppercase tracking-[0.12em] text-[#A1A1AA]">
                          <span aria-hidden="true" className="text-[#6E56CF]">
                            ✓
                          </span>
                          판매자 인증 완료
                        </p>
                      </div>
                      <span className="shrink-0 rounded-sm bg-[#6E56CF] px-1.5 py-0.5 text-[11px] font-semibold tracking-[-0.01em] text-white">
                        {discount}%↓
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value 3-split */}
      <section id="value" className="border-b border-white/10">
        <div className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-36">
          <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <p className="col-span-12 text-xs font-semibold uppercase tracking-[0.28em] text-[#A1A1AA] lg:col-span-2">
              03 — 방식
            </p>
            <h2 className="col-span-12 max-w-[20ch] text-[clamp(1.75rem,3.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] lg:col-span-6 lg:col-start-3">
              세 가지 방식으로 다시 고릅니다
            </h2>
            <p className="col-span-12 max-w-[32ch] text-sm font-normal leading-[1.6] text-[#A1A1AA] lg:col-span-3 lg:col-start-10">
              찜, 클릭, 구매 이력부터 판매자 신뢰도까지 — 단계별로 검증합니다.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-14 lg:mt-24">
            <div className="col-span-12 border-t border-white/10 pt-6 lg:col-span-5">
              <span
                aria-hidden="true"
                className="block text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold leading-none tracking-[-0.03em] text-white/15"
              >
                01
              </span>
              <h3 className="mt-6 text-base font-semibold tracking-[-0.01em]">취향 학습</h3>
              <p className="mt-3 max-w-[34ch] text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                찜, 클릭, 구매 이력을 분석해 당신만의 취향 그래프를 만듭니다.
              </p>
            </div>
            <div className="col-span-12 border-t border-white/10 pt-6 lg:col-span-4 lg:col-start-6 lg:mt-16">
              <span
                aria-hidden="true"
                className="block text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em] text-white/15"
              >
                02
              </span>
              <h3 className="mt-6 text-base font-semibold tracking-[-0.01em]">AI 큐레이션</h3>
              <p className="mt-3 max-w-[28ch] text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                수만 개 매물 중 조건과 취향에 맞는 상품만 골라 보여줍니다.
              </p>
            </div>
            <div className="col-span-12 border-t border-white/10 pt-6 lg:col-span-3 lg:col-start-10 lg:mt-32">
              <span
                aria-hidden="true"
                className="block text-[clamp(1.75rem,4vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em] text-white/15"
              >
                03
              </span>
              <h3 className="mt-6 text-base font-semibold tracking-[-0.01em]">신뢰 검증</h3>
              <p className="mt-3 max-w-[22ch] text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                상태, 가격, 판매자 신뢰도를 함께 점검합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section id="proof" className="relative overflow-hidden border-b border-white/10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 right-0 select-none text-[clamp(4rem,10vw,8rem)] font-extrabold leading-none tracking-[-0.03em] text-white/[0.06]"
        >
          04
        </span>

        <div className="relative z-10 mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-36">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]">
            04 — 신뢰
          </p>

          <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-14">
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="mt-1 h-[1.1em] w-[3px] shrink-0 rounded-full bg-[#6E56CF]"
                />
                <div>
                  <span
                    aria-hidden="true"
                    className="block text-[clamp(2.75rem,5.5vw,4.5rem)] font-extrabold leading-none text-white/15"
                  >
                    “
                  </span>
                  <blockquote className="mt-2 max-w-[30ch] text-[clamp(1.5rem,2.8vw,2.25rem)] font-extrabold leading-[1.2] tracking-[-0.02em]">
                    버릴 생각만 하던 물건을 <span className="text-[#6E56CF]">다시</span> 찾아준 첫
                    서비스.
                  </blockquote>
                  <p className="mt-6 text-sm font-normal text-[#A1A1AA]">
                    김OO · repick 베타 사용자
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-12 border-l border-white/10 pl-8 lg:col-span-4 lg:col-start-9">
              <p className="text-[11px] font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
                Fig. 04 — 지표
              </p>
              <div className="mt-8 flex flex-col gap-8">
                {[
                  { v: "12,400+", l: "누적 리픽 완료" },
                  { v: "98%", l: "취향 일치 만족도" },
                  { v: "4.8/5", l: "평균 평점" },
                  { v: "32%", l: "평균 절감 비용" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-[-0.02em]">
                      {s.v}
                    </p>
                    <p className="mt-1 text-xs font-normal uppercase tracking-[0.12em] text-[#A1A1AA]">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="border-b border-white/10">
        <div className="mx-auto max-w-[1320px] px-6 py-28 lg:px-10 lg:py-40">
          <div className="grid grid-cols-12 items-end gap-x-6 gap-y-10">
            <div className="col-span-12 lg:col-span-2">
              <span
                aria-hidden="true"
                className="block text-[clamp(3rem,8vw,6rem)] font-extrabold leading-none text-white/10"
              >
                05
              </span>
              <p className="mt-2 text-[11px] font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
                Fig. 05 — 시작
              </p>
            </div>

            <div className="col-span-12 lg:col-span-9 lg:col-start-4">
              <h2 className="max-w-[20ch] text-[clamp(2.25rem,6vw,5.5rem)] font-extrabold leading-[0.96] tracking-[-0.03em] lg:ml-auto lg:text-right">
                지금, 당신을 위해
                <br />
                <span className="text-[#6E56CF]">다시 고를</span> 시간
              </h2>
              <div className="mt-10 flex flex-col items-start gap-4 lg:items-end">
                <a
                  href="#cta"
                  className="rounded-full bg-[#6E56CF] px-9 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#7C69DB] active:bg-[#5D48BE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
                >
                  무료로 시작하기
                </a>
                <p className="text-xs font-normal text-[#A1A1AA]">
                  신용카드 없이 바로 시작 · 언제든 해지 가능
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <footer>
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-4 px-6 py-10 text-xs font-normal text-[#A1A1AA] lg:flex-row lg:px-10">
          <span>© 2026 repick — Issue 01</span>
          <nav aria-label="Footer" className="flex gap-6">
            <a
              href="#"
              className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              이용약관
            </a>
            <a
              href="#"
              className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              개인정보처리방침
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
