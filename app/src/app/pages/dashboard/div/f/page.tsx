const nav = [
  { roman: "I", label: "홈", page: "1면", active: true },
  { roman: "II", label: "추천", page: "2면" },
  { roman: "III", label: "찜", page: "3면" },
  { roman: "IV", label: "설정", page: "4면" },
];

const stats = [
  { label: "오늘의 추천", value: "12건", delta: "▲ NEW", tone: "up" as const },
  { label: "찜한 아이템", value: "34개", delta: "▲ 3", tone: "up" as const },
  { label: "누적 절약액", value: "₩186,400", delta: "▲ 21,000", tone: "up" as const },
  { label: "매칭률", value: "94.2%", delta: "▲ 2.1%p", tone: "up" as const },
];

const listings = [
  {
    headline: "헤리티지 가죽 3인 소파, 정가 대비 62% 낙폭",
    dek: "이태리산 풀그레인 가죽 · 사용감 경미 · 상태 A급",
    price: "₩420,000",
    match: "98",
    tag: "특종",
    tone: "bg-stone-500",
  },
  {
    headline: "캐논 AE-1 필름카메라, 컬렉터 매물 포착",
    dek: "1978년식 · 셔터 정상 · 상태 B+ · 스트랩 포함",
    price: "₩165,000",
    match: "95",
    tag: "속보",
    tone: "bg-stone-600",
  },
  {
    headline: "원목 6인 다이닝 테이블, 이사 급처 물량",
    dek: "월넛 원목 · 스크래치 소량 · 상태 A급",
    price: "₩310,000",
    match: "93",
    tag: null,
    tone: "bg-stone-400",
  },
  {
    headline: "빈티지 데님 자켓(L), 90년대 오리지널",
    dek: "리바이스 · 워싱 양호 · 상태 A급",
    price: "₩58,000",
    match: "91",
    tag: null,
    tone: "bg-stone-700",
  },
  {
    headline: "무선 스탠드형 조명, 북유럽 브랜드",
    dek: "배터리 정상 · 흠집 없음 · 상태 A급",
    price: "₩89,000",
    match: "90",
    tag: null,
    tone: "bg-stone-300",
  },
];

const wires = [
  { time: "10:24", text: "찜하신 '캐논 AE-1' 가격이 12,000원 하락했습니다." },
  { time: "09:47", text: "새 매칭 3건이 '홈 인테리어' 카테고리에 도착했습니다." },
  { time: "어제 22:10", text: "'원목 다이닝 테이블' 판매자가 가격을 조정했습니다." },
  { time: "어제 18:03", text: "이번 주 관심 카테고리 리포트가 발행되었습니다." },
];

function Halftone({ shade }: { shade: string }) {
  return (
    <div className={`relative h-16 w-16 shrink-0 overflow-hidden border border-stone-900/70 ${shade}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle,_#1c1917_1px,_transparent_1.4px)] bg-[length:5px_5px] opacity-50" />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f2ecdc] text-stone-900 [font-family:Georgia,'Times_New_Roman',serif] selection:bg-stone-900 selection:text-[#f2ecdc]">
      {/* utility bar */}
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 px-4 py-2 text-[11px] tracking-wide text-stone-600 lg:px-8 [font-family:var(--font-geist-mono),ui-monospace,monospace]">
        <span>제1247호 · 2026년 7월 7일 화요일 · 조간</span>
        <span className="hidden sm:inline">서울 맑음 26℃ · 중고거래 활황</span>
        <span className="border border-stone-900/60 px-2 py-0.5 uppercase">Digital Edition</span>
      </div>

      <div className="mx-auto max-w-[1280px] border-y-4 border-stone-900 px-4 lg:px-8" />

      {/* masthead */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 items-end gap-4 px-4 pt-5 pb-4 lg:grid-cols-[220px_1fr_220px] lg:px-8">
        <div className="col-span-2 order-2 border border-stone-900/70 p-3 lg:order-1 lg:col-span-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-600 [font-family:var(--font-geist-mono),ui-monospace,monospace]">
            오늘의 리픽 지수
          </p>
          <p className="mt-1 text-3xl font-bold">87.4</p>
          <p className="text-xs text-stone-600">AI 매칭 활황 · 전일比 ▲4.2</p>
        </div>

        <h1 className="col-span-2 order-1 text-center text-4xl font-black tracking-tight sm:text-5xl lg:order-2 lg:text-6xl">
          THE REPICK TIMES
        </h1>

        <div className="col-span-2 order-3 flex items-center justify-between gap-3 border border-stone-900/70 p-3 lg:col-span-1">
          <div>
            <p className="text-sm font-bold">김리픽 님, 좋은 아침입니다</p>
            <p className="text-xs text-stone-600">오늘의 지면이 도착했습니다</p>
          </div>
          <span className="shrink-0 -rotate-6 rounded-full border-2 border-red-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-red-800">
            Pro 구독
          </span>
        </div>
      </div>

      <p className="mx-auto max-w-[1280px] px-4 pb-4 text-center text-xs italic text-stone-600 lg:px-8">
        &ldquo;당신의 취향을 매일 아침 지면으로 전해드립니다&rdquo; — 중고 리커머스 조간
      </p>

      <div className="mx-auto max-w-[1280px] border-y-4 border-double border-stone-900 px-4 lg:px-8" />

      {/* ticker / stats */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-y divide-stone-900/30 border-b border-stone-900/30 sm:grid-cols-4 sm:divide-y-0 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-3 sm:px-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 [font-family:var(--font-geist-mono),ui-monospace,monospace]">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
            <p className="text-[11px] font-bold text-red-800 [font-family:var(--font-geist-mono),ui-monospace,monospace]">
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      {/* content grid */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-x-8 px-4 py-8 lg:grid-cols-[180px_1fr_280px] lg:px-8">
        {/* left index */}
        <nav aria-label="지면 목차" className="mb-8 lg:mb-0 lg:border-r lg:border-stone-900/30 lg:pr-6">
          <h2 className="mb-3 border-b-2 border-stone-900 pb-1 text-xs font-bold uppercase tracking-[0.2em]">
            지면 목차
          </h2>
          <ul className="flex flex-row flex-wrap gap-x-6 gap-y-2 lg:flex-col lg:gap-2">
            {nav.map((n) => (
              <li key={n.roman}>
                <a
                  href="#"
                  aria-current={n.active ? "page" : undefined}
                  className={`flex items-baseline gap-2 rounded-none px-1 py-1 text-sm outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-800 ${
                    n.active
                      ? "border-b-2 border-red-800 font-bold text-red-800"
                      : "text-stone-800 hover:text-red-800"
                  }`}
                >
                  <span className="text-xs text-stone-500 [font-family:var(--font-geist-mono),ui-monospace,monospace]">
                    {n.roman}.
                  </span>
                  {n.label}
                  <span className="text-[10px] text-stone-400">{n.page}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 hidden border border-stone-900/60 p-3 lg:block">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">발행 정보</p>
            <p className="mt-1 text-xs text-stone-600">리픽 주식회사 · AI 큐레이션 데스크</p>
          </div>
        </nav>

        {/* main headline + listings */}
        <main>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-800">1면 톱기사 · AI 큐레이션</p>
          <h2 className="mt-1 text-3xl font-black leading-tight sm:text-4xl">
            AI 데스크, 취향 저격 매물 12건 포착
          </h2>
          <p className="mt-2 text-base italic text-stone-700">
            가죽 소파부터 빈티지 카메라까지 — 오늘 리픽 AI가 찾아낸 최적 매칭 결과를 지면에 담았습니다.
          </p>
          <p className="mt-2 text-[11px] text-stone-500 [font-family:var(--font-geist-mono),ui-monospace,monospace]">
            AI 큐레이션 데스크 발 · 07:00 업데이트
          </p>

          <p className="mt-4 text-[15px] leading-7 text-stone-800 sm:columns-2 sm:gap-8">
            <span className="float-left mr-2 mt-1 text-6xl font-black leading-[0.8]">오</span>
            늘 아침 리픽 AI는 사용자의 찜·클릭·구매 이력을 분석해 총 12건의 신규 매칭을 지면 1면에
            배치했습니다. 상단 시세표에서 확인할 수 있듯 매칭률은 전일 대비 2.1%p 상승한 94.2%를
            기록했으며, 특히 가구·카메라 카테고리에서 강세를 보였습니다. 아래 기사에서 오늘의 추천
            매물을 순서대로 확인하세요.
          </p>

          <div className="mt-8 divide-y divide-stone-900/20 border-t-2 border-stone-900">
            {listings.map((item) => (
              <article key={item.headline} className="flex gap-4 py-5">
                <Halftone shade={item.tone} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {item.tag && (
                      <span className="border border-red-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-800">
                        {item.tag}
                      </span>
                    )}
                    <span className="text-[11px] text-stone-500 [font-family:var(--font-geist-mono),ui-monospace,monospace]">
                      매칭률 {item.match}%
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold leading-snug">{item.headline}</h3>
                  <p className="text-sm text-stone-600">{item.dek}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-lg font-bold [font-family:var(--font-geist-mono),ui-monospace,monospace]">
                      {item.price}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="border border-stone-900 px-3 py-1 text-xs font-bold uppercase tracking-wide outline-offset-2 hover:bg-stone-900 hover:text-[#f2ecdc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-800"
                      >
                        찜하기
                      </button>
                      <button
                        type="button"
                        className="border border-red-800 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-800 outline-offset-2 hover:bg-red-800 hover:text-[#f2ecdc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-800"
                      >
                        기사 전문
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* right sidebar */}
        <aside className="mt-8 space-y-8 lg:mt-0 lg:border-l lg:border-stone-900/30 lg:pl-6">
          <section>
            <h2 className="mb-3 border-b-2 border-stone-900 pb-1 text-xs font-bold uppercase tracking-[0.2em]">
              속보 · 최근 활동
            </h2>
            <ul className="space-y-3">
              {wires.map((w) => (
                <li key={w.text} className="border-b border-dotted border-stone-900/30 pb-3 text-sm">
                  <span className="mr-2 text-[11px] font-bold text-red-800 [font-family:var(--font-geist-mono),ui-monospace,monospace]">
                    {w.time}
                  </span>
                  {w.text}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-2 border-stone-900 p-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-red-800">사설</h2>
            <p className="mt-2 text-sm italic leading-6 text-stone-700">
              &ldquo;이번 주 리픽 AI는 사용자 리뷰 5만 건을 추가 학습해 가구·카메라 카테고리의
              매칭 정밀도를 끌어올렸습니다. 지면에서 확인하시는 추천은 매일 자정 갱신됩니다.&rdquo;
            </p>
          </section>

          <section className="border border-stone-900/70 border-dashed p-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">알림 구독</p>
            <p className="mt-1 text-sm font-bold">실시간 가격 하락 알림을 놓치지 마세요</p>
            <button
              type="button"
              className="mt-3 w-full border border-stone-900 bg-stone-900 py-2 text-xs font-bold uppercase tracking-wide text-[#f2ecdc] outline-offset-2 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-800"
            >
              지면 구독 설정
            </button>
          </section>
        </aside>
      </div>

      <div className="mx-auto max-w-[1280px] border-t-4 border-double border-stone-900 px-4 py-4 text-center text-[11px] text-stone-500 lg:px-8 [font-family:var(--font-geist-mono),ui-monospace,monospace]">
        발행 리픽 주식회사 · 제1247호 · 무단전재 및 재배포 금지 · Digital Edition
      </div>
    </div>
  );
}
