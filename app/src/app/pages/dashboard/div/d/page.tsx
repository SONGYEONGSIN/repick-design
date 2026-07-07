const navItems = [
  { emoji: "🏠", label: "홈", active: true },
  { emoji: "🎯", label: "추천", active: false },
  { emoji: "💖", label: "찜", active: false },
  { emoji: "⚙️", label: "설정", active: false },
];

const statCards = [
  {
    emoji: "🎯",
    value: "12개",
    label: "오늘의 추천",
    sub: "새로 도착한 매물",
    bg: "bg-sky-200",
  },
  {
    emoji: "💖",
    value: "8개",
    label: "찜한 상품",
    sub: "관심 목록에 저장",
    bg: "bg-pink-200",
  },
  {
    emoji: "💰",
    value: "245,000원",
    label: "이번 달 절약액",
    sub: "정가 대비 절약",
    bg: "bg-emerald-200",
  },
  {
    emoji: "⚡",
    value: "94%",
    label: "AI 매칭률",
    sub: "평균 취향 적중",
    bg: "bg-violet-200",
  },
];

const recommendations = [
  {
    emoji: "👟",
    category: "신발",
    name: "나이키 에어맥스 97",
    price: "89,000원",
    original: "148,000원",
    match: 96,
    bg: "bg-sky-100",
    badge: "bg-sky-300",
  },
  {
    emoji: "👜",
    category: "가방",
    name: "코치 토트백 미니",
    price: "156,000원",
    original: "320,000원",
    match: 92,
    bg: "bg-pink-100",
    badge: "bg-pink-300",
  },
  {
    emoji: "📷",
    category: "카메라",
    name: "후지필름 인스탁스 미니",
    price: "45,000원",
    original: "89,000원",
    match: 88,
    bg: "bg-violet-100",
    badge: "bg-violet-300",
  },
  {
    emoji: "🪑",
    category: "가구",
    name: "원목 사이드 테이블",
    price: "62,000원",
    original: "120,000원",
    match: 85,
    bg: "bg-emerald-100",
    badge: "bg-emerald-300",
  },
  {
    emoji: "🎸",
    category: "악기",
    name: "펜더 스트라토캐스터",
    price: "780,000원",
    original: "1,450,000원",
    match: 90,
    bg: "bg-amber-100",
    badge: "bg-amber-300",
  },
];

const activities = [
  {
    text: "찜한 '나이키 에어맥스'가 12% 하락했어요",
    time: "10분 전",
    dot: "bg-emerald-400",
  },
  {
    text: "새로운 AI 매칭 3건이 도착했어요",
    time: "1시간 전",
    dot: "bg-violet-400",
  },
  {
    text: "'코치 토트백'을 5명이 함께 보고 있어요",
    time: "3시간 전",
    dot: "bg-pink-400",
  },
  {
    text: "관심 카테고리에 신규 매물 8건 등록",
    time: "어제",
    dot: "bg-sky-400",
  },
];

const notifications = [
  { emoji: "🎉", tag: "NEW", text: "취향 저격 매물이 방금 등록됐어요" },
  { emoji: "📉", tag: "가격 하락", text: "찜 목록 상품이 저렴해졌어요" },
  { emoji: "✅", tag: "매칭 완료", text: "이번 주 추천 리포트가 도착했어요" },
];

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-amber-50 font-sans text-neutral-900">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-4 md:p-6 lg:flex-row lg:items-start lg:gap-6 lg:p-8">
        {/* 좌측 사이드바 */}
        <aside className="flex flex-col gap-4 lg:w-56 lg:shrink-0">
          <div className="hidden items-center gap-2 px-1 lg:flex">
            <span className="text-2xl" aria-hidden="true">
              🛍️
            </span>
            <span className="text-lg font-black tracking-tight">repick</span>
          </div>

          <nav
            aria-label="주요 메뉴"
            className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                aria-current={item.active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-2xl border-[3px] px-4 py-3 text-sm font-black transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
                  item.active
                    ? "border-neutral-900 bg-yellow-200 text-neutral-900 shadow-[4px_4px_0_0_rgba(23,23,23,1)] focus-visible:ring-yellow-300"
                    : "border-neutral-900/15 bg-white text-neutral-500 hover:border-neutral-900/40 focus-visible:ring-neutral-300"
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {item.emoji}
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="hidden flex-col gap-2 rounded-3xl border-[3px] border-neutral-900 bg-violet-200 p-4 shadow-[4px_4px_0_0_rgba(23,23,23,1)] lg:flex">
            <span className="text-2xl" aria-hidden="true">
              🚀
            </span>
            <p className="text-sm font-black">Pro로 업그레이드</p>
            <p className="text-xs font-semibold text-neutral-700">
              실시간 알림 + 무제한 매칭
            </p>
            <button
              type="button"
              className="mt-1 self-start rounded-full border-2 border-neutral-900 bg-white px-3 py-1.5 text-xs font-black transition-colors hover:bg-neutral-900 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
            >
              시작하기 →
            </button>
          </div>
        </aside>

        {/* 메인 영역 */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                안녕하세요, 민지님! 👋
              </h1>
              <p className="mt-1 text-sm font-semibold text-neutral-600">
                오늘도 딱 맞는 중고템을 찾아드릴게요 🔥 7일 연속 방문 중
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="알림 보기"
                className="grid h-11 w-11 place-items-center rounded-2xl border-[3px] border-neutral-900 bg-white text-lg transition-colors hover:bg-yellow-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
              >
                🔔
              </button>
              <button
                type="button"
                aria-label="검색"
                className="grid h-11 w-11 place-items-center rounded-2xl border-[3px] border-neutral-900 bg-white text-lg transition-colors hover:bg-sky-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
              >
                🔍
              </button>
              <div
                className="grid h-11 w-11 place-items-center rounded-2xl border-[3px] border-neutral-900 bg-pink-200 text-sm font-black"
                aria-hidden="true"
              >
                민
              </div>
            </div>
          </header>

          <section aria-label="요약 통계" className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {statCards.map((c) => (
              <div
                key={c.label}
                className={`flex flex-col gap-3 rounded-[24px] border-[3px] border-neutral-900 ${c.bg} p-4 shadow-[5px_5px_0_0_rgba(23,23,23,1)] transition-transform hover:-translate-y-1 sm:p-5`}
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-neutral-900 bg-white text-2xl"
                  aria-hidden="true"
                >
                  {c.emoji}
                </span>
                <div>
                  <p className="text-2xl font-black leading-none sm:text-3xl">{c.value}</p>
                  <p className="mt-1.5 text-xs font-black uppercase tracking-wide text-neutral-700">
                    {c.label}
                  </p>
                  <p className="text-[11px] font-semibold text-neutral-600">{c.sub}</p>
                </div>
              </div>
            ))}
          </section>

          <section
            aria-labelledby="ai-pick-heading"
            className="flex flex-col gap-4 rounded-[28px] border-[3px] border-neutral-900 bg-white p-5 shadow-[6px_6px_0_0_rgba(23,23,23,1)] sm:p-6"
          >
            <div className="flex items-center justify-between">
              <h2 id="ai-pick-heading" className="text-lg font-black sm:text-xl">
                오늘의 AI 추천 🤖✨
              </h2>
              <span className="rounded-full border-2 border-neutral-900 bg-yellow-200 px-3 py-1 text-xs font-black">
                12개 매칭
              </span>
            </div>

            <ul className="flex flex-col gap-3">
              {recommendations.map((r) => (
                <li
                  key={r.name}
                  className={`flex flex-wrap items-center gap-4 rounded-2xl border-[3px] border-neutral-900 ${r.bg} p-3.5 transition-transform hover:-translate-y-0.5 sm:flex-nowrap sm:p-4`}
                >
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-neutral-900 bg-white text-2xl"
                    aria-hidden="true"
                  >
                    {r.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black sm:text-base">{r.name}</p>
                    <p className="text-xs font-semibold text-neutral-600">{r.category}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-black sm:text-base">{r.price}</p>
                      <p className="text-[11px] font-semibold text-neutral-400 line-through">
                        {r.original}
                      </p>
                    </div>
                    <span
                      className={`whitespace-nowrap rounded-full border-2 border-neutral-900 ${r.badge} px-2.5 py-1 text-[11px] font-black`}
                    >
                      🔥 매칭 {r.match}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="self-center rounded-full border-[3px] border-neutral-900 bg-neutral-900 px-6 py-2.5 text-sm font-black text-white transition-colors hover:bg-neutral-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
            >
              추천 더보기 →
            </button>
          </section>
        </div>

        {/* 우측 사이드 패널 */}
        <aside className="flex flex-col gap-6 lg:w-80 lg:shrink-0">
          <section
            aria-labelledby="activity-heading"
            className="rounded-[28px] border-[3px] border-neutral-900 bg-white p-5 shadow-[6px_6px_0_0_rgba(23,23,23,1)]"
          >
            <h2 id="activity-heading" className="text-base font-black">
              최근 활동 📌
            </h2>
            <ul className="mt-4 flex flex-col gap-4">
              {activities.map((a) => (
                <li key={a.text} className="flex gap-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${a.dot}`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold leading-snug">{a.text}</p>
                    <p className="text-xs font-medium text-neutral-400">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="alerts-heading"
            className="rounded-[28px] border-[3px] border-neutral-900 bg-violet-100 p-5 shadow-[6px_6px_0_0_rgba(23,23,23,1)]"
          >
            <div className="flex items-center justify-between">
              <h2 id="alerts-heading" className="text-base font-black">
                알림 🔔
              </h2>
              <span className="rounded-full border-2 border-neutral-900 bg-white px-2.5 py-0.5 text-xs font-black">
                3
              </span>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {notifications.map((n) => (
                <li
                  key={n.text}
                  className="flex items-start gap-3 rounded-2xl border-2 border-neutral-900 bg-white p-3"
                >
                  <span className="text-xl" aria-hidden="true">
                    {n.emoji}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-black">{n.tag}</p>
                    <p className="text-sm font-semibold leading-snug text-neutral-700">
                      {n.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
