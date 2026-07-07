export default function Landing() {
  const stats = [
    { label: "누적 검수 건수", value: "482,910", bar: "92%" },
    { label: "평균 등급 정확도", value: "98.6%", bar: "98%" },
    { label: "평균 처리 시간", value: "4.2s", bar: "76%" },
    { label: "판매 전환율", value: "+31%", bar: "65%" },
  ];

  const steps = [
    {
      time: "0.4s",
      title: "INTAKE — 상품 접수",
      desc: "판매자가 사진 3장만 올리면 큐가 자동으로 항목을 생성합니다.",
    },
    {
      time: "2.1s",
      title: "VISION_SCAN — 손상 감지",
      desc: "160개 결함 카테고리를 학습한 모델이 스크래치, 변색, 부속 누락을 픽셀 단위로 탐지합니다.",
    },
    {
      time: "0.8s",
      title: "GRADE_ASSIGN — 등급 산정",
      desc: "탐지 결과를 S/A/B/C 4단계 등급 체계에 매핑하고 판정 근거 로그를 남깁니다.",
    },
    {
      time: "1.5s",
      title: "PRICE_ENGINE — 가격 산출",
      desc: "최근 90일 실거래가와 등급을 조합해 3초 안에 최적 판매가를 계산합니다.",
    },
    {
      time: "0.3s",
      title: "LISTING_PUBLISH — 즉시 등록",
      desc: "검수를 통과한 상품은 사람 개입 없이 마켓에 바로 게시됩니다.",
    },
  ];

  const products = [
    { id: "#88214", name: "Sony A7 III 바디", grade: "A-", price: "₩1,842,000", status: "판매중" },
    { id: "#88215", name: "Herman Miller Aeron", grade: "B+", price: "₩612,000", status: "판매중" },
    { id: "#88216", name: "iPad Pro 11 M2", grade: "S", price: "₩934,000", status: "예약중" },
    { id: "#88217", name: "필립스 휴 스타터킷", grade: "A", price: "₩128,000", status: "판매중" },
    { id: "#88218", name: "노스페이스 눕시", grade: "B", price: "₩186,000", status: "판매완료" },
  ];

  const linkFocus =
    "rounded-sm px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3dff7a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a06]";

  return (
    <div className="crt-scan relative min-h-screen bg-[#060a06] font-mono text-[#3dff7a] selection:bg-[#3dff7a] selection:text-black">
      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1 } 51%, 100% { opacity: 0 } }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 4px rgba(61,255,122,0.15); }
          50% { box-shadow: 0 0 16px rgba(61,255,122,0.35); }
        }
        .cursor-blink { animation: blink 1.1s step-end infinite; }
        .glow-box { animation: glow 3.4s ease-in-out infinite; }
        .crt-scan::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 40;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.16) 0px,
            rgba(0, 0, 0, 0.16) 1px,
            transparent 1px,
            transparent 3px
          );
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-[#1a3d22] bg-[#060a06]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex gap-1" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full border border-[#3dff7a]/40" />
              <span className="h-2.5 w-2.5 rounded-full border border-[#3dff7a]/40" />
              <span className="h-2.5 w-2.5 rounded-full border border-[#3dff7a]/40" />
            </span>
            <span className="text-[#8fffb0]">repick@core</span>
            <span className="hidden text-[#3dff7a]/40 sm:inline">— zsh — 120×40</span>
          </div>
          <nav aria-label="주 메뉴" className="hidden gap-5 sm:flex">
            <a href="#pipeline" className={`text-[#6fae7f] hover:text-[#8fffb0] ${linkFocus}`}>
              --pipeline
            </a>
            <a href="#products" className={`text-[#6fae7f] hover:text-[#8fffb0] ${linkFocus}`}>
              --ls
            </a>
            <a href="#man" className={`text-[#6fae7f] hover:text-[#8fffb0] ${linkFocus}`}>
              --help
            </a>
            <a href="#cta" className={`text-[#6fae7f] hover:text-[#8fffb0] ${linkFocus}`}>
              --curate
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-14 sm:pb-20 sm:pt-20">
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-start">
            <div>
              <p className="text-xs text-[#4a7a55]"># whoami</p>
              <p className="mt-1 text-sm text-[#8fffb0]">
                guest@repick:~$ <span className="text-[#3dff7a]">cat mission.txt</span>
              </p>

              <h1 className="mt-8 text-5xl font-black leading-[0.95] tracking-tight text-[#3dff7a] sm:text-7xl md:text-8xl">
                RE:PICK
              </h1>
              <p className="mt-3 text-xs text-[#4a7a55] sm:text-sm">
                [ AI CURATION ENGINE — BUILD 2.4.1 — STATUS: <span className="text-[#3dff7a]">ONLINE</span> ]
              </p>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#cdfddd] sm:text-lg">
                사람이 놓치는 흠집까지 읽어내는 비전 모델이, 중고 재고를 초 단위로 검수하고
                등급을 매기고 값을 부릅니다.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#cta"
                  className={`inline-flex items-center gap-2 border border-[#3dff7a] bg-[#3dff7a] px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-transparent hover:text-[#3dff7a] ${linkFocus}`}
                >
                  $ repick --curate <span className="cursor-blink" aria-hidden="true">█</span>
                </a>
                <a
                  href="#man"
                  className={`text-sm text-[#4a7a55] underline decoration-dotted underline-offset-4 hover:text-[#8fffb0] ${linkFocus}`}
                >
                  man repick
                </a>
              </div>
            </div>

            <div aria-hidden="true" className="hidden md:block">
              <pre className="glow-box overflow-x-auto border border-[#1a3d22] bg-[#08110a] p-4 text-[11px] leading-[1.5] text-[#3dff7a]">
{`┌─ scan.log ───────────────┐
│ item    : sony a7 iii    │
│ vision  : 12.4k px scan  │
│ defects : 2 minor        │
│ grade   : A-             │
│ price   : W1,842,000     │
│ status  : ######.. 82%   │
└───────────────────────────┘`}
              </pre>
              <p className="mt-3 text-right text-[10px] text-[#4a7a55]">// 실시간 검수 로그 예시</p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section aria-labelledby="stats-heading" className="border-t border-[#1a3d22] bg-[#08110a] py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 id="stats-heading" className="text-xs text-[#4a7a55]">
              # repick --stats --since=launch
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-px border border-[#1a3d22] bg-[#1a3d22] sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[#060a06] p-5">
                  <p className="text-[10px] text-[#4a7a55]">[OK] {stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-[#3dff7a] sm:text-3xl">{stat.value}</p>
                  <div className="mt-3 h-1 w-full bg-[#12261a]" role="presentation">
                    <div className="h-1 bg-[#3dff7a]" style={{ width: stat.bar }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PIPELINE */}
        <section id="pipeline" className="mx-auto max-w-5xl px-4 py-20 sm:py-24">
          <h2 className="text-xs text-[#4a7a55]"># repick --pipeline --verbose</h2>
          <ol className="mt-10 space-y-0 border-l border-[#1a3d22]">
            {steps.map((step, i) => (
              <li key={step.title} className="relative pb-10 pl-8 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[7px] top-0 h-3 w-3 rounded-full border-2 border-[#3dff7a] bg-[#060a06]"
                />
                <p className="text-[10px] text-[#4a7a55]">
                  [STEP {i + 1}/5] elapsed {step.time}
                </p>
                <p className="mt-1 text-lg font-bold text-[#8fffb0]">{step.title}</p>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#6fae7f]">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="border-t border-[#1a3d22] bg-[#08110a] py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-xs text-[#4a7a55]"># repick --ls /inventory --grade</h2>
            <div className="mt-6 overflow-x-auto border border-[#1a3d22]">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#1a3d22] text-[10px] uppercase tracking-wider text-[#4a7a55]">
                    <th scope="col" className="px-4 py-3 font-medium">
                      id
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      item
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      grade
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      price
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-[#12261a] last:border-0 hover:bg-[#0d1a10]">
                      <td className="px-4 py-3 text-[#4a7a55]">{p.id}</td>
                      <td className="px-4 py-3 text-[#cdfddd]">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className="border border-[#3dff7a]/40 px-1.5 py-0.5 text-xs text-[#3dff7a]">
                          {p.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#ffb000]">{p.price}</td>
                      <td className="px-4 py-3 text-[#4a7a55]">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* MAN PAGE */}
        <section id="man" className="mx-auto max-w-5xl px-4 py-20 sm:py-24">
          <h2 className="text-xs text-[#4a7a55]"># man repick</h2>
          <div className="mt-6 border border-[#1a3d22] bg-[#08110a] p-6 text-sm sm:p-8">
            <p className="font-bold text-[#8fffb0]">NAME</p>
            <p className="mt-1 pl-4 text-[#cdfddd]">repick — AI 기반 중고 재고 큐레이션 엔진</p>

            <p className="mt-6 font-bold text-[#8fffb0]">SYNOPSIS</p>
            <p className="mt-1 pl-4 text-[#cdfddd]">repick [--curate] [--grade=S..C] [--price-engine=auto]</p>

            <p className="mt-6 font-bold text-[#8fffb0]">DESCRIPTION</p>
            <p className="mt-1 max-w-2xl pl-4 leading-relaxed text-[#cdfddd]">
              repick은 촬영된 중고 상품 이미지를 분석해 손상, 마모, 부속 누락을 감지하고
              산업 표준 등급(S/A/B/C)을 자동 부여합니다. 이후 실거래가 데이터를 학습한
              가격 엔진이 최적 판매가를 산출하고, 검수를 통과한 상품만 즉시 등록됩니다.
            </p>

            <p className="mt-6 font-bold text-[#8fffb0]">OPTIONS</p>
            <dl className="mt-2 space-y-2 pl-4">
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="shrink-0 text-[#3dff7a]">--vision-scan</dt>
                <dd className="text-[#6fae7f]">160개 결함 유형 감지, 평균 4.2초</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="shrink-0 text-[#3dff7a]">--grade-assign</dt>
                <dd className="text-[#6fae7f]">S/A/B/C 4단계, 판정 근거 로그 제공</dd>
              </div>
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                <dt className="shrink-0 text-[#3dff7a]">--price-engine</dt>
                <dd className="text-[#6fae7f]">최근 90일 실거래가 학습, 자동 재산정</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="border-t border-[#1a3d22] py-24 text-center sm:py-28">
          <div className="mx-auto max-w-2xl px-4">
            <p className="text-xs text-[#4a7a55]"># 지금 실행</p>
            <p className="mt-4 text-2xl font-bold leading-snug text-[#8fffb0] sm:text-3xl">
              판매자님, 재고를 넘겨주세요.
              <br />
              등급 매기고 값 부르는 건 저희가 합니다.
            </p>

            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 border border-[#3dff7a] px-6 py-4 text-sm sm:text-base">
              <span className="text-[#4a7a55]">$</span>
              <span className="text-[#3dff7a]">repick --curate --seller=me</span>
              <span className="cursor-blink text-[#3dff7a]" aria-hidden="true">
                _
              </span>
            </div>

            <div className="mt-6">
              <a
                href="#"
                className={`inline-block border border-[#3dff7a] bg-[#3dff7a] px-8 py-3 text-sm font-bold text-black transition-colors hover:bg-[#8fffb0] ${linkFocus}`}
              >
                무료로 재고 검수 시작 →
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1a3d22] px-4 py-8 text-xs text-[#4a7a55]">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p># © 2026 repick systems. all rights reserved.</p>
          <p>
            root@repick:~# uptime — <span className="text-[#3dff7a]">99.98%</span> · exit code 0
          </p>
        </div>
      </footer>
    </div>
  );
}
