const HEADLINE_FONT =
  '"Arial Narrow", "Helvetica Neue Condensed", "Roboto Condensed", Impact, Arial, sans-serif';
const SERIF_FONT =
  'Georgia, "Times New Roman", "Nanum Myeongjo", serif';

const RED = "#c8102e";

const TIERS = [
  {
    id: "free",
    label: "01 · 무료판",
    name: "FREE",
    price: "₩0",
    unit: "평생 무료",
    dek: "일단 읽어나 보시라",
    features: [
      "기본 AI 큐레이션",
      "주간 추천 리스트 1회 발송",
      "찜 목록 20개까지",
    ],
    cta: "무료로 구독",
    stamp: null,
  },
  {
    id: "pro",
    label: "02 · 정기구독",
    name: "PRO",
    price: "₩9,900",
    unit: "월간 정가",
    dek: "가장 많이 팔린 호",
    features: [
      "무제한 AI 매칭",
      "실시간 알림 — 초 단위",
      "가격 추적 및 하락 경보",
      "찜 목록 무제한",
    ],
    cta: "PRO 구독 시작",
    stamp: "BEST SELLER",
  },
  {
    id: "business",
    label: "03 · 법인판",
    name: "BUSINESS",
    price: "문의",
    unit: "별도 견적",
    dek: "팀과 셀러를 위한 지면",
    features: [
      "팀 시트 무제한 초대",
      "셀러 전용 대시보드",
      "API 연동 및 데이터 반출",
    ],
    cta: "영업팀에 문의",
    stamp: null,
  },
];

const COMPARE_ROWS = [
  { label: "AI 큐레이션", free: "기본", pro: "무제한", biz: "무제한" },
  { label: "추천 주기", free: "주간 1회", pro: "실시간", biz: "실시간" },
  { label: "가격 추적", free: "—", pro: "O", biz: "O" },
  { label: "찜 목록", free: "20개", pro: "무제한", biz: "무제한" },
  { label: "팀 시트", free: "—", pro: "—", biz: "무제한" },
  { label: "셀러 대시보드", free: "—", pro: "—", biz: "O" },
  { label: "API 접근", free: "—", pro: "—", biz: "O" },
];

const FAQ = [
  {
    q: "무료판, 언제까지 씁니까?",
    a: "기한 없음. 카드 등록 없이 평생 기본 AI 큐레이션과 주간 추천을 받아볼 수 있다. 요금이 바뀌는 일도 없다 — 본지가 보증한다.",
  },
  {
    q: "PRO 해지, 위약금 있습니까?",
    a: "없다. 월 단위 정기 결제이며 해지 즉시 다음 결제 회차부터 청구가 멈춘다. 이번 달 이용분은 남은 기간까지 그대로 유지된다.",
  },
  {
    q: "BUSINESS 견적은 어떻게 받습니까?",
    a: "아래 '영업팀에 문의' 버튼으로 팀 규모와 셀러 재고 수량을 남기면 영업일 기준 하루 안에 담당자가 회신한다.",
  },
];

export default function Landing() {
  return (
    <div
      className="min-h-screen bg-white text-black"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0px, rgba(0,0,0,0.035) 1px, transparent 1px, transparent 3px)",
      }}
    >
      <a
        href="#pricing-main"
        className="sr-only focus:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-50 focus-visible:bg-black focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2"
        style={{ outlineColor: RED }}
      >
        본문으로 건너뛰기
      </a>

      {/* ── 마스트헤드 바 ── */}
      <div
        className="border-y-2 border-black font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] px-4 sm:px-8 py-1.5 flex flex-wrap gap-x-4 gap-y-1 justify-between"
      >
        <span>VOL. 07 — NO. 099</span>
        <span>2026. 07. 07. 화요일</span>
        <span style={{ color: RED }}>정가 무료 — ₩9,900</span>
      </div>

      {/* ── 네임플레이트 ── */}
      <header className="border-b-8 border-black px-4 sm:px-8 pt-6 pb-3 text-center">
        <p
          className="text-[11px] sm:text-xs uppercase tracking-[0.35em] mb-1"
          style={{ fontFamily: SERIF_FONT, fontStyle: "italic" }}
        >
          AI 리커머스 요금 특보
        </p>
        <div
          className="uppercase font-black leading-[0.82] tracking-tight text-[18vw] sm:text-[13vw] md:text-[8rem]"
          style={{ fontFamily: HEADLINE_FONT }}
        >
          REPICK
        </div>
        <div
          className="mt-2 mx-auto h-1.5 w-24 sm:w-32"
          style={{ backgroundColor: RED }}
        />
      </header>

      <main id="pricing-main">
        {/* ── 헤드라인 + 리드 ── */}
        <section className="border-b-4 border-black px-4 sm:px-8 py-10 sm:py-14">
          <div className="max-w-5xl mx-auto">
            <h1
              className="uppercase font-black leading-[0.88] tracking-tight text-4xl sm:text-6xl md:text-7xl mb-6"
              style={{ fontFamily: HEADLINE_FONT }}
            >
              요금,
              <br />
              낱낱이 공개한다
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_2px_2fr] gap-6 md:gap-8 items-start">
              <p
                className="text-sm sm:text-base uppercase tracking-widest font-mono border-t-2 border-black pt-3"
              >
                무료부터 팀 규모까지 —
                <br />
                본지가 세 단의 표로
                <br />
                요금을 전면 해부한다.
              </p>

              <div className="hidden md:block bg-black" aria-hidden="true" />

              <p
                className="text-base sm:text-lg leading-relaxed border-t-2 border-black pt-3"
                style={{ fontFamily: SERIF_FONT }}
              >
                <span
                  className="float-left font-black leading-[0.75] pr-2 pt-1"
                  style={{ fontFamily: HEADLINE_FONT, fontSize: "3.6rem" }}
                >
                  가
                </span>
                격표를 두고 눈치 볼 필요 없다. 무료판은 평생 무료이며,
                유료판은 월 ₩9,900 단 한 줄로 끝난다. 팀과 셀러를 위한
                지면은 별도 견적으로 마련했다. 숨은 조항, 숨은 수수료 —
                본지에는 없다. 아래 세 단을 끝까지 읽고 고르면 된다.
              </p>
            </div>
          </div>
        </section>

        {/* ── 요금 3단 ── */}
        <section
          aria-labelledby="tiers-heading"
          className="border-b-4 border-black"
        >
          <h2 id="tiers-heading" className="sr-only">
            요금제 세 단
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
            {TIERS.map((tier) => {
              const isPro = tier.id === "pro";
              return (
                <article
                  key={tier.id}
                  className={
                    "relative px-6 sm:px-8 py-10 flex flex-col " +
                    (isPro ? "bg-black text-white" : "bg-white text-black")
                  }
                >
                  {tier.stamp && (
                    <span
                      className="absolute top-6 right-4 sm:right-6 -rotate-[10deg] border-4 px-2 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest select-none"
                      style={{ borderColor: RED, color: RED }}
                    >
                      {tier.stamp}
                    </span>
                  )}

                  <p
                    className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] mb-4 opacity-70"
                  >
                    {tier.label}
                  </p>

                  <h3
                    className="uppercase font-black leading-none tracking-tight text-3xl sm:text-4xl mb-1"
                    style={{ fontFamily: HEADLINE_FONT }}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className="text-xs sm:text-sm uppercase tracking-widest mb-6"
                    style={{ fontFamily: SERIF_FONT, fontStyle: "italic" }}
                  >
                    {tier.dek}
                  </p>

                  <div
                    className={
                      "mb-6 pb-6 border-b-2 " +
                      (isPro ? "border-white/30" : "border-black")
                    }
                  >
                    <span
                      className="font-black tracking-tight text-4xl sm:text-5xl font-mono"
                    >
                      {tier.price}
                    </span>
                    <span className="ml-2 text-xs sm:text-sm uppercase tracking-widest align-middle">
                      / {tier.unit}
                    </span>
                  </div>

                  <ul className="flex-1 space-y-2.5 mb-8 text-sm sm:text-[15px]">
                    {tier.features.map((f, i) => (
                      <li key={f} className="flex gap-3">
                        <span
                          className="font-mono font-bold shrink-0"
                          style={{ color: isPro ? RED : RED }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span style={{ fontFamily: SERIF_FONT }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#final-cta"
                    className={
                      "inline-flex items-center justify-between gap-3 border-4 px-5 py-3 font-black uppercase tracking-widest text-sm transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 " +
                      (isPro
                        ? "border-white bg-white text-black hover:bg-transparent hover:text-white"
                        : "border-black bg-black text-white hover:bg-white hover:text-black")
                    }
                    style={{ fontFamily: HEADLINE_FONT }}
                  >
                    {tier.cta}
                    <span aria-hidden="true">→</span>
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── 비교표 ── */}
        <section
          aria-labelledby="compare-heading"
          className="border-b-4 border-black px-4 sm:px-8 py-10 sm:py-14"
        >
          <div className="max-w-5xl mx-auto">
            <h2
              id="compare-heading"
              className="uppercase font-black tracking-tight text-2xl sm:text-3xl mb-6 border-b-4 border-black pb-2"
              style={{ fontFamily: HEADLINE_FONT }}
            >
              한눈에 보는 지면 — 전체 대조표
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm sm:text-[15px] min-w-[560px]">
                <thead>
                  <tr className="border-b-4 border-black">
                    <th
                      scope="col"
                      className="text-left py-3 pr-3 font-black uppercase tracking-widest text-xs sm:text-sm"
                      style={{ fontFamily: HEADLINE_FONT }}
                    >
                      항목
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 px-3 font-black uppercase tracking-widest text-xs sm:text-sm border-l-2 border-black"
                      style={{ fontFamily: HEADLINE_FONT }}
                    >
                      FREE
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 px-3 font-black uppercase tracking-widest text-xs sm:text-sm border-l-2 border-black"
                      style={{ fontFamily: HEADLINE_FONT, color: RED }}
                    >
                      PRO
                    </th>
                    <th
                      scope="col"
                      className="text-center py-3 pl-3 font-black uppercase tracking-widest text-xs sm:text-sm border-l-2 border-black"
                      style={{ fontFamily: HEADLINE_FONT }}
                    >
                      BUSINESS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label} className="border-b-2 border-black/70">
                      <th
                        scope="row"
                        className="text-left py-3 pr-3 font-normal"
                        style={{ fontFamily: SERIF_FONT }}
                      >
                        {row.label}
                      </th>
                      <td className="text-center py-3 px-3 border-l-2 border-black/70 font-mono">
                        {row.free}
                      </td>
                      <td
                        className="text-center py-3 px-3 border-l-2 border-black/70 font-mono font-bold"
                        style={{ color: row.pro === "—" ? undefined : RED }}
                      >
                        {row.pro}
                      </td>
                      <td className="text-center py-3 pl-3 border-l-2 border-black/70 font-mono">
                        {row.biz}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── FAQ (독자 문의) ── */}
        <section
          aria-labelledby="faq-heading"
          className="border-b-4 border-black px-4 sm:px-8 py-10 sm:py-14"
        >
          <div className="max-w-5xl mx-auto">
            <h2
              id="faq-heading"
              className="uppercase font-black tracking-tight text-2xl sm:text-3xl mb-6 border-b-4 border-black pb-2"
              style={{ fontFamily: HEADLINE_FONT }}
            >
              독자 문의
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {FAQ.map((item, i) => (
                <div
                  key={item.q}
                  className={
                    "pt-4 " +
                    (i > 0 ? "md:border-l-2 md:border-black md:pl-6" : "")
                  }
                >
                  <p
                    className="font-black uppercase tracking-tight text-lg mb-2"
                    style={{ fontFamily: HEADLINE_FONT, color: RED }}
                  >
                    Q. {item.q}
                  </p>
                  <p
                    className="text-sm sm:text-[15px] leading-relaxed"
                    style={{ fontFamily: SERIF_FONT }}
                  >
                    A. {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 최종 CTA (호외) ── */}
        <section
          id="final-cta"
          className="px-4 sm:px-8 py-14 sm:py-20 text-center"
          style={{ backgroundColor: RED, color: "#fff" }}
        >
          <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] mb-3">
            ◆ 호외 · EXTRA EDITION ◆
          </p>
          <p
            className="uppercase font-black leading-[0.9] tracking-tight text-3xl sm:text-5xl md:text-6xl mb-6"
            style={{ fontFamily: HEADLINE_FONT }}
          >
            지금, 무료로
            <br />
            펼쳐본다
          </p>
          <p
            className="text-sm sm:text-base mb-8 opacity-90"
            style={{ fontFamily: SERIF_FONT }}
          >
            카드 등록 없이 30초. 마음에 들면 그때 PRO로 넘어가면 된다.
          </p>
          <a
            href="#pricing-main"
            className="inline-flex items-center gap-3 bg-white text-black border-4 border-white px-8 py-4 font-black uppercase tracking-widest text-sm sm:text-base hover:bg-transparent hover:text-white transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-white focus-visible:outline-offset-2"
            style={{ fontFamily: HEADLINE_FONT }}
          >
            무료로 시작하기
            <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>

      {/* ── 하단 판권 ── */}
      <footer className="border-t-2 border-black px-4 sm:px-8 py-4 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] flex flex-wrap gap-x-4 gap-y-1 justify-between">
        <span>발행 · REPICK</span>
        <span>편집 · AI 큐레이션부</span>
        <span>정가 무료 — ₩9,900 / 월</span>
      </footer>
    </div>
  );
}
