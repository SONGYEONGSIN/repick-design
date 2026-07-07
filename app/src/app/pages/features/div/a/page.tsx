export default function Landing() {
  return (
    <div className="flex min-h-full flex-col bg-white text-black">
      {/* HEADER */}
      <header className="w-full border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-4">
          <a
            href="#top"
            className="flex items-center gap-3 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <span className="flex h-10 w-10 items-center justify-center bg-black text-xl font-black text-[#FFCC00]">
              R
            </span>
            <span className="text-lg font-black uppercase tracking-[0.3em]">
              repick
            </span>
          </a>

          <nav
            aria-label="기능 섹션 바로가기"
            className="hidden gap-8 text-sm font-bold uppercase tracking-widest sm:flex"
          >
            <a
              href="#learn"
              className="hover:text-[#D22630] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              학습
            </a>
            <a
              href="#match"
              className="hover:text-[#D22630] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              매칭
            </a>
            <a
              href="#trust"
              className="hover:text-[#D22630] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              검증
            </a>
            <a
              href="#alert"
              className="hover:text-[#D22630] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              알림
            </a>
          </nav>

          <a
            href="#cta"
            className="bg-[#D22630] px-5 py-2 text-sm font-black uppercase tracking-widest text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            시작하기
          </a>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden border-b-4 border-black bg-white px-6 py-20 sm:py-28">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FFCC00] sm:h-72 sm:w-72"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-20 h-0 w-0 border-b-[160px] border-l-[90px] border-r-[90px] border-b-[#1E4FA0] border-l-transparent border-r-transparent sm:border-b-[220px] sm:border-l-[130px] sm:border-r-[130px]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[18%] bottom-10 hidden h-10 w-10 rotate-45 bg-[#D22630] sm:block"
          />

          <div className="relative mx-auto max-w-[1280px]">
            <p className="mb-6 text-xs font-black uppercase tracking-[0.5em] text-[#1E4FA0] sm:text-sm">
              Four Functions — 네 가지 기능
            </p>
            <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
              안목을
              <br />
              <span className="text-[#D22630]">설계</span>하다
            </h1>
            <p className="mt-8 max-w-xl text-base font-medium leading-relaxed text-black/70 sm:text-lg">
              repick은 취향을 배우고, 수만 개의 매물을 매칭하고, 신뢰를
              검증하고, 실시간으로 알립니다. 네 가지 기능이 하나의 그리드처럼
              맞물려 작동합니다.
            </p>

            <div className="mt-12 grid max-w-xl grid-cols-4 gap-px border-4 border-black bg-black text-center text-xs font-black uppercase tracking-widest sm:text-sm">
              <span className="bg-[#D22630] py-3 text-white">01 학습</span>
              <span className="bg-[#1E4FA0] py-3 text-white">02 매칭</span>
              <span className="bg-[#FFCC00] py-3 text-black">03 검증</span>
              <span className="bg-black py-3 text-white">04 알림</span>
            </div>
          </div>
        </section>

        {/* FEATURES — asymmetric bauhaus grid */}
        <section aria-label="핵심 기능 4가지">
          <div className="grid grid-cols-1 border-b-4 border-black md:grid-cols-12">
            {/* 01 — 취향 학습 */}
            <article
              id="learn"
              className="border-b-4 border-black bg-[#FAF6EC] p-8 sm:p-12 md:col-span-7 md:border-b-0 md:border-r-4"
            >
              <p className="text-xs font-black uppercase tracking-[0.4em] text-[#D22630]">
                Function 01 — Taste Learning
              </p>
              <p
                aria-hidden="true"
                className="mt-2 text-7xl font-black leading-none text-black/10 sm:text-8xl"
              >
                01
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                당신을 읽습니다
              </h2>
              <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-black/70 sm:text-base">
                찜하고, 클릭하고, 구매할 때마다 repick은 당신의 감각을
                데이터로 기록합니다. 패턴이 쌓일수록 추천은 더 날카로워
                집니다.
              </p>

              <div
                aria-hidden="true"
                className="relative mx-auto mt-10 h-40 w-56 sm:mx-0"
              >
                <span className="absolute left-0 top-2 h-24 w-24 rounded-full bg-[#D22630] mix-blend-multiply" />
                <span className="absolute left-16 top-0 h-24 w-24 rounded-full bg-[#1E4FA0] mix-blend-multiply" />
                <span className="absolute left-8 top-14 h-24 w-24 rounded-full bg-[#FFCC00] mix-blend-multiply" />
              </div>
            </article>

            {/* 02 — AI 매칭 */}
            <article
              id="match"
              className="flex flex-col justify-between bg-[#1E4FA0] p-8 text-white sm:p-12 md:col-span-5"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.4em] text-[#FFCC00]">
                  Function 02 — AI Matching
                </p>
                <p
                  aria-hidden="true"
                  className="mt-2 text-7xl font-black leading-none text-white/15 sm:text-8xl"
                >
                  02
                </p>
                <h2 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                  그리고 골라냅니다
                </h2>
                <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-white/80 sm:text-base">
                  수만 개의 매물 속에서 AI가 당신에게 맞는 단 하나를
                  찾아냅니다. 브랜드, 가격, 컨디션 — 모든 축을 동시에
                  계산합니다.
                </p>
              </div>

              <div
                aria-hidden="true"
                className="mx-auto mt-10 grid w-fit grid-cols-3 gap-2 sm:mx-0"
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i === 4
                        ? "h-9 w-9 bg-[#FFCC00] ring-4 ring-[#D22630] ring-offset-2 ring-offset-[#1E4FA0]"
                        : "h-9 w-9 bg-white/15"
                    }
                  />
                ))}
              </div>
            </article>
          </div>

          <div className="grid grid-cols-1 border-b-4 border-black md:grid-cols-12">
            {/* 03 — 신뢰 검증 */}
            <article
              id="trust"
              className="border-b-4 border-black bg-[#FFCC00] p-8 sm:p-12 md:col-span-5 md:border-b-0 md:border-r-4"
            >
              <p className="text-xs font-black uppercase tracking-[0.4em] text-black/70">
                Function 03 — Trust Verification
              </p>
              <p
                aria-hidden="true"
                className="mt-2 text-7xl font-black leading-none text-black/10 sm:text-8xl"
              >
                03
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                믿을 수 있게
              </h2>
              <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-black/70 sm:text-base">
                상태, 가격, 판매자 이력을 교차 검증합니다. 검증되지 않은
                매물은 애초에 추천되지 않습니다.
              </p>

              <div
                aria-hidden="true"
                className="relative mx-auto mt-10 h-32 w-32 sm:mx-0"
              >
                <span className="absolute inset-0 rounded-full border-4 border-black/20" />
                <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 bg-black [clip-path:polygon(50%_0%,0%_100%,100%_100%)]" />
                <span className="absolute left-1/2 top-[60%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFCC00]" />
              </div>
            </article>

            {/* 04 — 실시간 알림 */}
            <article
              id="alert"
              className="bg-black p-8 text-white sm:p-12 md:col-span-7"
            >
              <p className="text-xs font-black uppercase tracking-[0.4em] text-[#D22630]">
                Function 04 — Real-time Alerts
              </p>
              <p
                aria-hidden="true"
                className="mt-2 text-7xl font-black leading-none text-white/10 sm:text-8xl"
              >
                04
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                놓치지 않게
              </h2>
              <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-white/70 sm:text-base">
                가격이 떨어지는 순간, 새 매칭이 뜨는 순간 — repick이 먼저
                알려드립니다.
              </p>

              <div
                aria-hidden="true"
                className="relative mx-auto mt-10 flex h-32 w-32 items-center justify-center sm:mx-0"
              >
                <span className="absolute h-32 w-32 rounded-full border-4 border-white/15" />
                <span className="absolute h-20 w-20 rounded-full border-4 border-white/30" />
                <span className="absolute h-20 w-20 animate-ping rounded-full bg-[#D22630]/30" />
                <span className="relative h-10 w-10 rounded-full bg-[#D22630]" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center bg-[#FFCC00] text-xs font-black text-black">
                  3
                </span>
              </div>
            </article>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="border-b-4 border-black bg-white px-6 py-20 text-center sm:py-28"
        >
          <div className="mx-auto flex max-w-2xl flex-col items-center">
            <span
              aria-hidden="true"
              className="mb-8 h-4 w-4 rotate-45 bg-[#D22630]"
            />
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
              지금, 안목을
              <br />
              업그레이드
            </h2>
            <p className="mt-6 max-w-md text-base font-medium leading-relaxed text-black/70 sm:text-lg">
              네 가지 기능을 무료로 체험해보세요. 카드 등록 없이 바로 시작할
              수 있습니다.
            </p>
            <a
              href="#top"
              className="mt-10 inline-block bg-[#D22630] px-10 py-4 text-lg font-black uppercase tracking-widest text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
            >
              무료로 시작하기
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-black px-6 py-8 text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.3em] sm:flex-row">
          <span>&copy; 2026 repick</span>
          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-4 w-4 rounded-full bg-[#D22630]" />
            <span className="h-4 w-4 bg-[#1E4FA0]" />
            <span className="h-4 w-4 [clip-path:polygon(50%_0%,0%_100%,100%_100%)] bg-[#FFCC00]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
