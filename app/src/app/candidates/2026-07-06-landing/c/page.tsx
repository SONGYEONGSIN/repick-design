export default function LandingCandidateC() {
  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050505]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
          <span className="text-lg font-bold tracking-tight">repick</span>
          <nav className="hidden items-center gap-8 text-sm text-white/50 md:flex">
            <span>큐레이션</span>
            <span>신뢰</span>
            <span>가격</span>
          </nav>
          <a
            href="#start"
            className="rounded border border-white/20 px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-black"
          >
            무료로 시작하기
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
          <div className="relative mx-auto max-w-[1120px] px-6 pt-24 pb-20 md:pt-32 md:pb-28">
            <p className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#6E56CF]" />
              AI Recommerce — 001
            </p>
            <h1 className="max-w-4xl text-[13vw] font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              버려질 뻔한 것들,
              <br />
              <span className="font-light text-white/35">다시,</span> 고르다
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-white/50 md:text-xl">
              AI가 당신의 취향을 읽고, 세상에 하나뿐인 중고를 큐레이션합니다.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="#start"
                className="rounded bg-white px-8 py-4 text-sm font-semibold text-black transition-colors hover:bg-white/85"
              >
                무료로 시작하기
              </a>
              <span className="text-sm text-white/35">카드 등록 없이 30초</span>
            </div>

            <div className="mt-20 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-8">
              <div className="pr-4">
                <p className="text-2xl font-bold tabular-nums md:text-3xl">128K+</p>
                <p className="mt-1 text-xs text-white/40 md:text-sm">누적 이용자</p>
              </div>
              <div className="px-4">
                <p className="text-2xl font-bold tabular-nums md:text-3xl">4.9</p>
                <p className="mt-1 text-xs text-white/40 md:text-sm">평균 만족도</p>
              </div>
              <div className="pl-4">
                <p className="text-2xl font-bold tabular-nums md:text-3xl">62%</p>
                <p className="mt-1 text-xs text-white/40 md:text-sm">평균 절약률</p>
              </div>
            </div>
          </div>
        </section>

        {/* 가치 3분할 */}
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[1120px] px-6 py-20 md:py-32">
            <div className="mb-14 flex items-end justify-between gap-6">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                고르는 이유는 <span className="text-white/35">세 가지</span>
              </h2>
              <p className="hidden text-xs uppercase tracking-[0.25em] text-white/40 md:block">
                Why repick — 002
              </p>
            </div>
            <div className="grid grid-cols-1 divide-y divide-white/10 border-t border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {[
                {
                  n: '01',
                  title: '취향 큐레이션',
                  desc: 'AI가 클릭·저장 패턴을 학습해 취향에 맞는 물건만 골라 보여줍니다.',
                },
                {
                  n: '02',
                  title: '검증된 신뢰',
                  desc: '상태 등급과 실사 사진을 표준화해 첫 거래도 안심하고 진행합니다.',
                },
                {
                  n: '03',
                  title: '합리적인 가격',
                  desc: '동일 상품의 시세를 실시간으로 비교해 가장 합리적인 값을 제시합니다.',
                },
              ].map((item) => (
                <article key={item.n} className="px-0 py-10 first:pt-0 md:px-10 md:py-0 md:first:pl-0">
                  <span
                    className="block text-6xl font-bold leading-none md:text-7xl"
                    style={{ WebkitTextStroke: '1px #6E56CF', color: 'transparent' }}
                  >
                    {item.n}
                  </span>
                  <h3 className="mt-8 text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 소셜프루프 */}
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[1120px] px-6 py-20 md:py-32">
            <p className="mb-10 text-xs uppercase tracking-[0.25em] text-white/40">
              Social proof — 003
            </p>
            <div className="grid items-end gap-14 md:grid-cols-2 md:gap-16">
              <div>
                <p className="text-6xl font-bold leading-none tracking-tight tabular-nums md:text-8xl">
                  12,842<span className="text-white/25">개</span>
                </p>
                <p className="mt-5 text-white/50 md:text-lg">
                  이번 달, 새 주인을 만난 물건의 수
                </p>
              </div>
              <blockquote className="border-l border-white/15 pl-6 md:pl-8">
                <p className="font-serif text-xl italic leading-snug text-white/90 md:text-2xl">
                  "고민 없이 눌렀는데 정말 제 취향이었어요. 재입고 알림만 기다리던 제가
                  이젠 repick만 켭니다."
                </p>
                <footer className="mt-5 text-sm text-white/40">— 사용자 리뷰, repick</footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* 마무리 CTA */}
        <section className="relative overflow-hidden">
          <p
            aria-hidden
            className="pointer-events-none absolute -bottom-10 left-1/2 -z-0 w-full -translate-x-1/2 select-none text-center text-[22vw] font-bold leading-none tracking-tight text-white/[0.03] md:text-[16rem]"
          >
            repick
          </p>
          <div className="relative mx-auto max-w-[1120px] px-6 py-24 text-center md:py-40">
            <h2 className="mx-auto max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              지금, 다시 골라볼 시간
            </h2>
            <p className="mx-auto mt-6 max-w-md text-white/50 md:text-lg">
              가입 없이도 오늘의 큐레이션을 먼저 확인할 수 있어요.
            </p>
            <a
              id="start"
              href="#"
              className="mt-10 inline-block rounded bg-white px-10 py-4 text-sm font-semibold text-black transition-colors hover:bg-white/85"
            >
              무료로 시작하기
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 py-10 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <span className="font-bold tracking-tight text-white/60">repick</span>
          <p>© 2026 repick. AI 리커머스 큐레이션.</p>
        </div>
      </footer>
    </div>
  );
}
