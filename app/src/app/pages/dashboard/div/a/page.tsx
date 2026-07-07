const NAV_ITEMS = [
  { num: "01", label: "홈", active: true },
  { num: "02", label: "AI 추천", active: false },
  { num: "03", label: "찜", active: false },
  { num: "04", label: "설정", active: false },
];

const STATS = [
  { label: "오늘의 추천", value: "24", unit: "건", delta: "+6", note: "VS 어제", accent: false },
  { label: "찜한 아이템", value: "8", unit: "건", delta: "+2", note: "VS 어제", accent: false },
  { label: "예상 절약액", value: "612,400", unit: "원", delta: "+18%", note: "VS 지난주", accent: true },
  { label: "AI 매칭률", value: "91", unit: "%", delta: "+3%p", note: "VS 지난주", accent: true },
];

const RECOMMENDATIONS = [
  { rank: "01", name: "나이키 에어포스1 '07", category: "신발", list: "139,000", sale: "68,000", save: "71,000", match: 96, tag: "NEW" },
  { rank: "02", name: "리바이스 501 오리지널 데님", category: "의류", list: "98,000", sale: "42,000", save: "56,000", match: 94, tag: "가격↓" },
  { rank: "03", name: "아크네 스튜디오 하프집업 니트", category: "의류", list: "320,000", sale: "158,000", save: "162,000", match: 92, tag: "HOT" },
  { rank: "04", name: "뉴발란스 990v5", category: "신발", list: "219,000", sale: "121,000", save: "98,000", match: 90, tag: "-" },
  { rank: "05", name: "스투시 로고 후드집업", category: "의류", list: "145,000", sale: "79,000", save: "66,000", match: 89, tag: "NEW" },
  { rank: "06", name: "폴로 랄프로렌 코듀로이 셔츠", category: "의류", list: "128,000", sale: "55,000", save: "73,000", match: 87, tag: "-" },
  { rank: "07", name: "컨버스 척테일러 70s", category: "신발", list: "89,000", sale: "39,000", save: "50,000", match: 85, tag: "가격↓" },
  { rank: "08", name: "파타고니아 레트로X 플리스", category: "의류", list: "259,000", sale: "132,000", save: "127,000", match: 83, tag: "-" },
];

const ACTIVITY = [
  { time: "09:14", tag: "MATCH", desc: "나이키 에어포스1 조건 일치 (매칭 96%)" },
  { time: "08:52", tag: "PRICE↓", desc: "리바이스 501 데님 5,000원 하락" },
  { time: "08:30", tag: "WISH", desc: "아크네 니트 찜 목록에 추가됨" },
  { time: "07:58", tag: "ALERT", desc: "뉴발란스 990v5 재입고 감지" },
  { time: "07:20", tag: "MATCH", desc: "스투시 후드집업 조건 일치 (매칭 89%)" },
  { time: "06:45", tag: "SYSTEM", desc: "야간 스캔 완료 — 1,204건 분석" },
];

const TICKER = [
  "▲ 나이키 에어포스1 -12%",
  "▼ 매칭 신규 6건",
  "▲ 리바이스 501 -5,000원",
  "● 야간 스캔 1,204건 완료",
  "▲ 아크네 니트 재입고",
  "▼ 찜 8건 대기중",
];

function StatusDot() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-2 w-2 rounded-full bg-[var(--accent)]"
    />
  );
}

export default function Landing() {
  return (
    <>
      <style>{`
        :root { --accent: #d9ff3f; }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 26s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>

      <div className="flex min-h-screen flex-col bg-black font-mono text-[#e6e6e6]">
        {/* 상단 티커 */}
        <div className="overflow-hidden border-b-2 border-[var(--accent)] bg-black py-1.5">
          <div className="ticker-track flex w-max whitespace-nowrap text-[11px] tracking-wider text-[var(--accent)]">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex" aria-hidden={rep === 1 ? "true" : undefined}>
                {TICKER.map((t, i) => (
                  <span key={i} className="px-6">
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 모바일 상단 네비 */}
        <nav aria-label="주요 메뉴" className="flex items-center justify-between border-b-2 border-white/20 px-4 py-3 md:hidden">
          <span className="text-sm font-bold tracking-widest text-white">
            REPICK<span className="text-[var(--accent)]">_</span>
          </span>
          <ul className="flex gap-4 text-[11px] uppercase tracking-widest">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className={`rounded-none border-b-2 pb-0.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    item.active
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-1 flex-col md:flex-row">
          {/* 데스크톱 좌측 네비 */}
          <nav
            aria-label="주요 메뉴"
            className="hidden w-56 shrink-0 flex-col justify-between border-r-2 border-white/20 md:flex"
          >
            <div>
              <div className="border-b-2 border-white/20 px-6 py-6">
                <span className="text-lg font-bold tracking-widest text-white">
                  REPICK<span className="text-[var(--accent)]">_</span>
                </span>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
                  ai resale terminal
                </p>
              </div>
              <ul className="px-3 py-4">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <a
                      href="#"
                      className={`mb-1 flex items-center gap-3 border-2 px-3 py-2.5 text-[12px] uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                        item.active
                          ? "border-[var(--accent)] bg-[var(--accent)] text-black"
                          : "border-transparent text-white/60 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span className="text-[10px] tabular-nums opacity-70">{item.num}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t-2 border-white/20 px-6 py-5 text-[11px]">
              <p className="text-white/40 uppercase tracking-widest">user</p>
              <p className="mt-1 font-bold text-white">songyuseong</p>
              <p className="mt-3 text-white/40 uppercase tracking-widest">plan</p>
              <p className="mt-1 flex items-center gap-2 font-bold text-[var(--accent)]">
                <StatusDot /> PRO
              </p>
            </div>
          </nav>

          {/* 메인 */}
          <main className="min-w-0 flex-1 border-white/10 px-4 py-6 md:border-r-2 md:px-8 md:py-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b-2 border-white/20 pb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                  {`> repick_terminal v2.4 — session: 09:14:02`}
                </p>
                <h1 className="mt-2 text-xl font-bold tracking-tight text-white md:text-2xl">
                  승우님, 오늘의 리픽 데이터입니다
                </h1>
              </div>
              <button
                type="button"
                className="border-2 border-white/30 px-3 py-2 text-[11px] uppercase tracking-widest text-white/70 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                refresh ↻
              </button>
            </div>

            {/* 스탯 카드 */}
            <section aria-label="요약 지표" className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="border-2 border-white/20 p-4">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">{s.label}</p>
                  <p
                    className={`mt-3 text-2xl font-bold tabular-nums md:text-3xl ${
                      s.accent ? "text-[var(--accent)]" : "text-white"
                    }`}
                  >
                    {s.value}
                    <span className="ml-1 text-sm font-normal text-white/40">{s.unit}</span>
                  </p>
                  <p className="mt-2 text-[11px] tabular-nums text-white/40">
                    <span className={s.accent ? "text-[var(--accent)]" : "text-white/70"}>{s.delta}</span>{" "}
                    {s.note}
                  </p>
                </div>
              ))}
            </section>

            {/* 추천 테이블 */}
            <section aria-label="오늘의 AI 추천">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                  오늘의 AI 추천
                </h2>
                <span className="text-[11px] tabular-nums text-white/40">total 24 items</span>
              </div>
              <div className="overflow-x-auto border-2 border-white/20">
                <table className="w-full min-w-[720px] border-collapse text-left text-[12px]">
                  <caption className="sr-only">오늘의 AI 추천 상품 목록, 매칭률 순 정렬</caption>
                  <thead>
                    <tr className="border-b-2 border-white/20 bg-white text-black">
                      <th scope="col" className="px-3 py-2 font-bold uppercase tracking-widest">
                        순위
                      </th>
                      <th scope="col" className="px-3 py-2 font-bold uppercase tracking-widest">
                        상품
                      </th>
                      <th scope="col" className="hidden px-3 py-2 font-bold uppercase tracking-widest sm:table-cell">
                        카테고리
                      </th>
                      <th scope="col" className="px-3 py-2 text-right font-bold uppercase tracking-widest">
                        정가
                      </th>
                      <th scope="col" className="px-3 py-2 text-right font-bold uppercase tracking-widest">
                        판매가
                      </th>
                      <th scope="col" className="hidden px-3 py-2 text-right font-bold uppercase tracking-widest md:table-cell">
                        절약
                      </th>
                      <th scope="col" className="px-3 py-2 font-bold uppercase tracking-widest">
                        매칭
                      </th>
                      <th scope="col" className="px-3 py-2 font-bold uppercase tracking-widest">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECOMMENDATIONS.map((r) => (
                      <tr key={r.rank} className="border-b border-white/10 odd:bg-white/[0.02]">
                        <td className="px-3 py-2.5 tabular-nums text-white/40">{r.rank}</td>
                        <td className="px-3 py-2.5 font-bold text-white">{r.name}</td>
                        <td className="hidden px-3 py-2.5 text-white/50 sm:table-cell">{r.category}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums text-white/40 line-through">
                          {r.list}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums font-bold text-white">
                          {r.sale}
                        </td>
                        <td className="hidden px-3 py-2.5 text-right tabular-nums text-[var(--accent)] md:table-cell">
                          {r.save}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-12 border border-white/20">
                              <div
                                className="h-full bg-[var(--accent)]"
                                style={{ width: `${r.match}%` }}
                              />
                            </div>
                            <span className="tabular-nums text-white/60">{r.match}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                              r.tag === "-"
                                ? "border-white/15 text-white/30"
                                : "border-[var(--accent)] text-[var(--accent)]"
                            }`}
                          >
                            {r.tag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>

          {/* 사이드 — 최근 활동 */}
          <aside
            aria-label="최근 활동"
            className="w-full shrink-0 border-t-2 border-white/20 px-4 py-6 md:w-72 md:border-t-0 md:px-6 md:py-8"
          >
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">
              최근 활동
            </h2>
            <ul className="flex flex-col gap-0">
              {ACTIVITY.map((a, i) => (
                <li
                  key={i}
                  className="border-l-2 border-white/15 py-3 pl-4 text-[12px] leading-relaxed"
                >
                  <p className="flex items-center gap-2 tabular-nums text-white/40">
                    {a.time}
                    <span className="border border-[var(--accent)] px-1 text-[10px] font-bold text-[var(--accent)]">
                      {a.tag}
                    </span>
                  </p>
                  <p className="mt-1 text-white/70">{a.desc}</p>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-2 border-white/20 p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/40">알림 설정</p>
              <p className="mt-2 text-[12px] text-white/60">
                가격 하락 · 신규 매칭 · 재입고 알림이 실시간으로 전송됩니다.
              </p>
              <a
                href="#"
                className="mt-3 inline-block border-b-2 border-[var(--accent)] text-[12px] font-bold text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                알림 관리 →
              </a>
            </div>
          </aside>
        </div>

        {/* 하단 상태 바 */}
        <footer className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t-2 border-white/20 px-4 py-2.5 text-[10px] uppercase tracking-widest text-white/40 md:px-8">
          <span className="flex items-center gap-1.5">
            <StatusDot /> system online
          </span>
          <span>scan: 1,204 매물 분석</span>
          <span>last sync: 09:14:02</span>
          <span className="hidden sm:inline">uptime: 12h 04m</span>
        </footer>
      </div>
    </>
  );
}
