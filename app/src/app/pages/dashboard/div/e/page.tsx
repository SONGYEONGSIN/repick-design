import type { ReactNode } from "react";

// ── repick :: dashboard — TUI archetype (htop/lazygit 스타일 터미널 대시보드) ──

function MeterBar({ pct, width = 12 }: { pct: number; width?: number }) {
  const filled = Math.max(0, Math.min(width, Math.round((pct / 100) * width)));
  return (
    <span className="inline-flex items-center gap-1.5 text-xs tabular-nums">
      <span aria-hidden className="tracking-tighter">
        <span className="text-emerald-400">{"█".repeat(filled)}</span>
        <span className="text-emerald-900">{"░".repeat(width - filled)}</span>
      </span>
      <span className="text-emerald-300">{pct}%</span>
    </span>
  );
}

function Panel({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`relative border border-emerald-800/50 bg-black/60 ${className}`}>
      <h2 className="absolute -top-[9px] left-3 bg-black px-1.5 text-[10px] font-bold tracking-[0.2em] text-emerald-400">
        {title}
      </h2>
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 bg-black px-px text-[11px] leading-none text-emerald-700"
      >
        ┌
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 bg-black px-px text-[11px] leading-none text-emerald-700"
      >
        ┐
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-black px-px text-[11px] leading-none text-emerald-700"
      >
        └
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 bg-black px-px text-[11px] leading-none text-emerald-700"
      >
        ┘
      </span>
      <div className="p-3 sm:p-4">{children}</div>
    </section>
  );
}

const navItems = [
  { key: "1", label: "홈", count: null, active: true },
  { key: "2", label: "추천", count: "12", active: false },
  { key: "3", label: "찜", count: "34", active: false },
  { key: "4", label: "설정", count: null, active: false },
];

const recommendations = [
  {
    name: "아이폰 14 Pro 256GB",
    brand: "전자기기 · Apple",
    price: "890,000",
    match: 96,
    tag: "신규",
    tone: "border-emerald-700 text-emerald-300",
  },
  {
    name: "루이비통 스피디30",
    brand: "명품 · 가방",
    price: "1,240,000",
    match: 91,
    tag: "가격↓",
    tone: "border-amber-700 text-amber-300",
  },
  {
    name: "나이키 에어포스1 화이트",
    brand: "스니커즈",
    price: "78,000",
    match: 88,
    tag: "인기",
    tone: "border-emerald-700 text-emerald-300",
  },
  {
    name: "삼성 갤럭시워치6",
    brand: "웨어러블",
    price: "165,000",
    match: 84,
    tag: "신규",
    tone: "border-emerald-700 text-emerald-300",
  },
  {
    name: "다이슨 에어랩 컴플리트",
    brand: "뷰티가전",
    price: "310,000",
    match: 79,
    tag: "가격↓",
    tone: "border-amber-700 text-amber-300",
  },
];

const activity = [
  { time: "09:41:02", label: "시스템", msg: "새 매물 3건 스캔 완료" },
  { time: "09:38:17", label: "알림", msg: "나이키 에어포스1 가격 5% 하락" },
  { time: "09:22:44", label: "사용자", msg: "루이비통 스피디30 찜 추가" },
  { time: "09:10:03", label: "매칭", msg: "아이폰 14 Pro 매칭률 96% 산출" },
  { time: "08:55:30", label: "시스템", msg: "취향 프로파일 업데이트 완료" },
];

const notices = [
  { icon: "⚠", text: "가격 하락 알림 2건 대기중", tone: "text-amber-300" },
  { icon: "✓", text: "신규 매칭 3건 확인 필요", tone: "text-emerald-300" },
  { icon: "●", text: "찜한 상품 재입고 1건", tone: "text-zinc-300" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-black font-mono text-emerald-500 selection:bg-emerald-500/30">
      <style>{`
        @keyframes tui-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .tui-cursor { animation: tui-blink 1.1s steps(1, end) infinite; }
        @keyframes tui-scan { 0% { background-position: 0 0; } 100% { background-position: 0 4px; } }
        .tui-scanlines { animation: tui-scan 0.4s linear infinite; }
      `}</style>

      <div
        aria-hidden
        className="tui-scanlines pointer-events-none fixed inset-0 z-50 opacity-[0.05] bg-[repeating-linear-gradient(to_bottom,rgba(52,255,140,0.6)_0px,rgba(52,255,140,0.6)_1px,transparent_1px,transparent_3px)]"
      />

      {/* title bar */}
      <header className="border-b border-emerald-800/60 bg-[#020402] px-3 py-2 sm:px-4">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span aria-hidden className="flex shrink-0 gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </span>
            <span className="truncate text-[11px] tracking-widest text-emerald-700">
              repick — dashboard — 92×34
            </span>
          </div>
          <span className="hidden shrink-0 text-[11px] tracking-widest text-emerald-800 sm:inline">
            LOAD 0.42 0.51 0.38 · UP 04:12:33
          </span>
        </div>
        <div className="mx-auto mt-2 max-w-[1280px]">
          <h1 className="text-sm text-emerald-300 sm:text-base">
            <span className="text-emerald-700">$</span> repick --dashboard --user=지은
            <span aria-hidden className="tui-cursor ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-emerald-400 align-middle" />
          </h1>
          <p className="mt-1 text-xs text-emerald-700">
            <span aria-hidden># </span>안녕하세요 지은님, 오늘도 딱 맞는 딜을 찾아드릴게요
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-3 pb-24 pt-4 sm:px-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr_260px]">
          {/* left nav */}
          <Panel title="MENU" className="lg:h-fit">
            <nav aria-label="메인 메뉴">
              <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
                {navItems.map((item) => (
                  <li key={item.key} className="shrink-0 lg:w-full">
                    <a
                      href="#"
                      aria-current={item.active ? "page" : undefined}
                      className={`flex items-center gap-2 border px-3 py-2 text-xs tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 lg:w-full ${
                        item.active
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                          : "border-transparent text-emerald-700 hover:border-emerald-800 hover:text-emerald-400"
                      }`}
                    >
                      <span aria-hidden>[{item.key}]</span>
                      <span>{item.label}</span>
                      {item.count ? (
                        <span className="ml-auto text-emerald-700">{item.count}</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Panel>

          {/* main column */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Panel title="추천">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-emerald-600">오늘의 추천</span>
                  <span className="text-2xl font-bold text-emerald-200 [text-shadow:0_0_10px_rgba(52,255,140,0.4)] sm:text-3xl">
                    12<span className="ml-1 text-sm font-normal text-emerald-600">건</span>
                  </span>
                  <span className="text-[11px] text-emerald-500">
                    ▲ +3 <span className="text-emerald-700">어제 대비</span>
                  </span>
                </div>
              </Panel>
              <Panel title="찜">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-emerald-600">찜한 상품</span>
                  <span className="text-2xl font-bold text-emerald-200 [text-shadow:0_0_10px_rgba(52,255,140,0.4)] sm:text-3xl">
                    34<span className="ml-1 text-sm font-normal text-emerald-600">개</span>
                  </span>
                  <span className="text-[11px] text-emerald-500">
                    ▲ +5 <span className="text-emerald-700">어제 대비</span>
                  </span>
                </div>
              </Panel>
              <Panel title="절약">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-emerald-600">이달 절약액</span>
                  <span className="text-xl font-bold text-amber-300 [text-shadow:0_0_10px_rgba(251,191,36,0.35)] sm:text-2xl">
                    ₩284,000
                  </span>
                  <span className="text-[11px] text-emerald-500">
                    ▲ +12% <span className="text-emerald-700">전월 대비</span>
                  </span>
                </div>
              </Panel>
              <Panel title="매칭률">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-emerald-600">평균 매칭률</span>
                  <span className="text-2xl font-bold text-emerald-200 [text-shadow:0_0_10px_rgba(52,255,140,0.4)] sm:text-3xl">
                    87<span className="ml-1 text-sm font-normal text-emerald-600">%</span>
                  </span>
                  <MeterBar pct={87} width={14} />
                </div>
              </Panel>
            </div>

            <Panel title="오늘의 AI 추천">
              <div role="list" aria-label="오늘의 AI 추천 상품 목록">
                {recommendations.map((item) => (
                  <a
                    role="listitem"
                    href="#"
                    key={item.name}
                    className="group grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 border-b border-emerald-900/60 px-1 py-2.5 last:border-b-0 hover:bg-emerald-500/5 focus-visible:bg-emerald-500/5 focus-visible:outline-none sm:grid-cols-[1fr_112px_150px_84px]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-emerald-100 group-hover:text-emerald-300">
                        {item.name}
                      </span>
                      <span className="block truncate text-[11px] text-emerald-700">
                        {item.brand}
                      </span>
                    </span>
                    <span className="justify-self-end text-sm tabular-nums text-amber-300 sm:justify-self-start">
                      ₩{item.price}
                    </span>
                    <span className="col-span-2 sm:col-span-1">
                      <MeterBar pct={item.match} />
                    </span>
                    <span
                      className={`col-span-2 inline-flex w-fit items-center border px-1.5 py-0.5 text-[10px] tracking-wide sm:col-span-1 ${item.tone}`}
                    >
                      {item.tag}
                    </span>
                  </a>
                ))}
              </div>
            </Panel>
          </div>

          {/* right column */}
          <div className="flex flex-col gap-4">
            <Panel title="최근 활동">
              <ul className="flex flex-col gap-2.5 text-xs">
                {activity.map((a) => (
                  <li key={a.time} className="flex flex-col gap-0.5">
                    <span className="flex items-baseline gap-2">
                      <span className="text-emerald-700">{a.time}</span>
                      <span className="text-emerald-600">[{a.label}]</span>
                    </span>
                    <span className="text-emerald-300">{a.msg}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-700">
                <span aria-hidden>▍</span>
                <span>tail -f activity.log</span>
                <span
                  aria-hidden
                  className="tui-cursor ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-emerald-400"
                />
              </div>
            </Panel>

            <Panel title="알림">
              <ul className="flex flex-col gap-2 text-xs">
                {notices.map((n) => (
                  <li key={n.text} className="flex items-start gap-2">
                    <span aria-hidden className={n.tone}>
                      {n.icon}
                    </span>
                    <span className="text-emerald-300">{n.text}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>

      {/* status bar */}
      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-emerald-800/60 bg-[#020402] px-3 py-2 text-[10px] tracking-wide text-emerald-700 sm:px-4 sm:text-xs">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3">
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            <span>[j/k] 이동</span>
            <span className="hidden sm:inline">[Enter] 상세보기</span>
            <span className="hidden sm:inline">[/] 검색</span>
            <span className="hidden md:inline">[f] 필터</span>
            <span>[q] 종료</span>
          </span>
          <span className="shrink-0 border border-emerald-800 px-1.5 py-0.5 text-emerald-400">
            NORMAL
          </span>
        </div>
      </footer>
    </div>
  );
}
