"use client";

import { useState } from "react";

interface TasteNode {
  id: string;
  label: string;
  x: number;
  y: number;
  weight: number;
}

interface ProductStar {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  price: number;
  originalPrice: number;
  match: number;
  condition: string;
  icon: string;
}

const CENTER = { x: 50, y: 48 };

const tasteNodes: TasteNode[] = [
  { id: "minimal", label: "미니멀 무드", x: 50, y: 12, weight: 82 },
  { id: "vintage", label: "빈티지 감성", x: 83, y: 30, weight: 65 },
  { id: "street", label: "스트리트 무드", x: 86, y: 68, weight: 48 },
  { id: "outdoor", label: "아웃도어 실용", x: 50, y: 90, weight: 55 },
  { id: "home", label: "홈 리빙", x: 15, y: 70, weight: 71 },
  { id: "classic", label: "클래식 포멀", x: 13, y: 30, weight: 33 },
];

const productStars: ProductStar[] = [
  {
    id: "p1",
    name: "미니멀 세라믹 스탠드 조명",
    category: "minimal",
    x: 42,
    y: 22,
    price: 38000,
    originalPrice: 72000,
    match: 96,
    condition: "상태 최상",
    icon: "💡",
  },
  {
    id: "p2",
    name: "그레이 울 헨리넥 니트",
    category: "minimal",
    x: 60,
    y: 20,
    price: 24000,
    originalPrice: 59000,
    match: 91,
    condition: "상태 최상",
    icon: "🧶",
  },
  {
    id: "p3",
    name: "빈티지 브라스 촛대 세트",
    category: "vintage",
    x: 74,
    y: 22,
    price: 15000,
    originalPrice: 32000,
    match: 88,
    condition: "사용감 적음",
    icon: "🕯️",
  },
  {
    id: "p4",
    name: "챔브레이 워크 셔츠",
    category: "vintage",
    x: 90,
    y: 42,
    price: 21000,
    originalPrice: 45000,
    match: 84,
    condition: "상태 양호",
    icon: "👔",
  },
  {
    id: "p5",
    name: "코듀로이 크로스백",
    category: "street",
    x: 80,
    y: 62,
    price: 27000,
    originalPrice: 51000,
    match: 79,
    condition: "상태 양호",
    icon: "🎒",
  },
  {
    id: "p6",
    name: "경량 트레킹 자켓",
    category: "outdoor",
    x: 58,
    y: 80,
    price: 45000,
    originalPrice: 98000,
    match: 92,
    condition: "상태 최상",
    icon: "🧥",
  },
  {
    id: "p7",
    name: "우드 트레이 & 플랜테리어 세트",
    category: "home",
    x: 22,
    y: 64,
    price: 18000,
    originalPrice: 34000,
    match: 87,
    condition: "사용감 적음",
    icon: "🪴",
  },
];

const bgDots = [
  { x: 8, y: 15, size: 2 },
  { x: 22, y: 6, size: 1.5 },
  { x: 35, y: 45, size: 2 },
  { x: 5, y: 55, size: 1.5 },
  { x: 65, y: 10, size: 2 },
  { x: 93, y: 18, size: 1.5 },
  { x: 70, y: 88, size: 2 },
  { x: 30, y: 92, size: 1.5 },
  { x: 95, y: 80, size: 2 },
  { x: 45, y: 5, size: 1.5 },
  { x: 12, y: 80, size: 2 },
  { x: 60, y: 55, size: 1.5 },
  { x: 78, y: 48, size: 2 },
  { x: 40, y: 78, size: 1.5 },
];

const stats = [
  { label: "오늘의 추천", value: "12개", hint: "새 매칭 발견", icon: "✦" },
  { label: "찜한 아이템", value: "8개", hint: "가격 변동 추적 중", icon: "♡" },
  { label: "이번 달 절약액", value: "₩186,400", hint: "정가 대비", icon: "₩" },
  { label: "평균 매칭률", value: "89%", hint: "취향 적합도", icon: "◎" },
];

const activity = [
  { text: "빈티지 브라스 촛대 세트 가격이 12% 하락했어요", time: "2시간 전", icon: "↓" },
  { text: "미니멀 무드에 새 매칭 3개가 추가됐어요", time: "5시간 전", icon: "✦" },
  { text: "코듀로이 크로스백, 판매자가 찜을 확인했어요", time: "어제", icon: "♡" },
  { text: "이번 주 취향 지도가 업데이트됐어요", time: "어제", icon: "◎" },
];

const navItems = [
  { id: "home", label: "홈", icon: "⌂" },
  { id: "recommend", label: "추천", icon: "✦" },
  { id: "wishlist", label: "찜", icon: "♡" },
  { id: "settings", label: "설정", icon: "⚙" },
];

function formatWon(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

export default function Landing() {
  const [selectedId, setSelectedId] = useState<string | null>("p1");
  const [activeNav, setActiveNav] = useState("home");

  const selected = productStars.find((p) => p.id === selectedId) ?? null;
  const recommended = [...productStars].sort((a, b) => b.match - a.match);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 lg:flex-row">
      <nav
        aria-label="주요 메뉴"
        className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-3 lg:sticky lg:top-0 lg:h-screen lg:w-20 lg:flex-col lg:items-stretch lg:justify-start lg:border-b-0 lg:border-r lg:px-3 lg:py-6 xl:w-56"
      >
        <div className="flex items-center gap-2 lg:mb-8 lg:px-1">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white"
            aria-hidden="true"
          >
            re
          </span>
          <span className="hidden text-sm font-bold text-slate-900 xl:inline">
            repick
          </span>
        </div>
        <ul className="flex items-center gap-1 lg:w-full lg:flex-col lg:items-stretch lg:gap-1.5">
          {navItems.map((item) => {
            const isActive = item.id === activeNav;
            return (
              <li key={item.id} className="lg:w-full">
                <button
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:w-full ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 xl:grid-cols-[1fr_320px]">
          <main className="flex min-w-0 flex-col gap-6 lg:gap-8">
            <header className="flex flex-col gap-1">
              <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
                오늘의 취향 리포트
              </p>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                안녕하세요, 지민님 <span aria-hidden="true">👋</span>
              </h1>
              <p className="text-sm text-slate-500">
                지도 위에 새로운 별 {productStars.length}개가 반짝이고 있어요.
              </p>
            </header>

            <section aria-label="요약 지표" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div
                    className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm text-indigo-600"
                    aria-hidden="true"
                  >
                    {s.icon}
                  </div>
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{s.hint}</p>
                </div>
              ))}
            </section>

            <section
              aria-labelledby="taste-map-heading"
              className="relative overflow-hidden rounded-3xl border border-indigo-900 bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-950 p-5 sm:p-6"
            >
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 id="taste-map-heading" className="text-lg font-semibold text-amber-50">
                    나의 취향 지도
                  </h2>
                  <p className="text-xs text-indigo-200">
                    별을 눌러 AI가 찾은 매물을 확인해보세요
                  </p>
                </div>
                <span className="rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-200">
                  별 {productStars.length}개 반짝이는 중
                </span>
              </div>

              <div className="relative h-[320px] w-full sm:h-[400px] lg:h-[460px]">
                {bgDots.map((d, i) => (
                  <span
                    key={`bg-${i}`}
                    aria-hidden="true"
                    className="pointer-events-none absolute rounded-full bg-white/40 motion-safe:animate-pulse"
                    style={{
                      left: `${d.x}%`,
                      top: `${d.y}%`,
                      width: d.size,
                      height: d.size,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                ))}

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  {tasteNodes.map((n) => (
                    <line
                      key={`c-${n.id}`}
                      x1={CENTER.x}
                      y1={CENTER.y}
                      x2={n.x}
                      y2={n.y}
                      stroke="rgb(251 191 36)"
                      strokeOpacity={0.12 + n.weight / 250}
                      strokeWidth={0.3}
                    />
                  ))}
                  {productStars.map((p) => {
                    const node = tasteNodes.find((n) => n.id === p.category);
                    if (!node) return null;
                    return (
                      <line
                        key={`s-${p.id}`}
                        x1={node.x}
                        y1={node.y}
                        x2={p.x}
                        y2={p.y}
                        stroke="rgb(148 163 184)"
                        strokeOpacity={0.35}
                        strokeWidth={0.2}
                      />
                    );
                  })}
                </svg>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-300/40 motion-safe:animate-ping"
                  style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
                />
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="취향 지도 중심으로 돌아가기"
                  className="absolute z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-200/40 bg-white/10 text-[11px] font-semibold text-amber-50 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
                  style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
                >
                  나
                </button>

                {tasteNodes.map((n) => {
                  const size = 22 + n.weight * 0.35;
                  return (
                    <div
                      key={n.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${n.x}%`, top: `${n.y}%` }}
                    >
                      <div
                        aria-hidden="true"
                        className="rounded-full border border-amber-200/50 bg-amber-100/10"
                        style={{ width: size, height: size }}
                      />
                      <span className="absolute left-1/2 top-full mt-1 w-max -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-950/70 px-2 py-0.5 text-[10px] font-medium text-amber-100">
                        {n.label}
                      </span>
                    </div>
                  );
                })}

                {productStars.map((p) => {
                  const isSelected = p.id === selectedId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      aria-pressed={isSelected}
                      aria-label={`${p.name}, 매칭률 ${p.match}%`}
                      className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2 transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950 ${
                        isSelected ? "z-20 scale-125" : "z-10"
                      }`}
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    >
                      <span
                        aria-hidden="true"
                        className={`block motion-safe:animate-pulse ${
                          isSelected
                            ? "text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.9)]"
                            : "text-amber-200/80 drop-shadow-[0_0_4px_rgba(252,211,77,0.5)]"
                        }`}
                        style={{ fontSize: 10 + p.match / 6 }}
                      >
                        ✦
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-indigo-800 bg-indigo-950/60 p-4 sm:p-5">
                {selected ? (
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-2xl"
                      >
                        {selected.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-amber-50">{selected.name}</p>
                        <p className="text-xs text-indigo-200">
                          {tasteNodes.find((n) => n.id === selected.category)?.label} ·{" "}
                          {selected.condition}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="text-right">
                        <p className="text-base font-bold text-amber-50">
                          {formatWon(selected.price)}
                        </p>
                        <p className="text-xs text-indigo-300 line-through">
                          {formatWon(selected.originalPrice)}
                        </p>
                      </div>
                      <div className="w-28">
                        <div className="mb-1 flex items-center justify-between text-[10px] text-indigo-200">
                          <span>매칭률</span>
                          <span>{selected.match}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-indigo-900">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${selected.match}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-full border border-amber-300/40 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
                        >
                          찜하기
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-semibold text-indigo-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
                        >
                          보러 가기
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm text-indigo-200">
                    지도 위 별을 눌러 취향에 맞는 매물을 만나보세요 ✦
                  </p>
                )}
              </div>
            </section>

            <section aria-labelledby="reco-heading" className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 id="reco-heading" className="text-lg font-semibold text-slate-900">
                  오늘의 AI 추천
                </h2>
                <span className="text-xs text-slate-500">매칭률 높은 순</span>
              </div>
              <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pl-1 pr-1">
                {recommended.map((p) => {
                  const isSelected = p.id === selectedId;
                  const off = Math.round((1 - p.price / p.originalPrice) * 100);
                  const nodeLabel = tasteNodes.find((n) => n.id === p.category)?.label;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedId(p.id)}
                      aria-pressed={isSelected}
                      className={`flex w-56 shrink-0 snap-start flex-col gap-2 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 bg-white hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg"
                        >
                          {p.icon}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          매칭 {p.match}%
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm font-medium text-slate-900">
                        {p.name}
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-slate-900">
                          {formatWon(p.price)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {formatWon(p.originalPrice)}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-rose-500">
                        {off}% 할인 · {nodeLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </main>

          <aside aria-labelledby="activity-heading" className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div>
                <h2 id="activity-heading" className="text-sm font-semibold text-slate-900">
                  최근 활동
                </h2>
                <p className="text-xs text-slate-500">지도가 실시간으로 갱신되고 있어요</p>
              </div>
              <span
                aria-label="읽지 않은 알림 3개"
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"
              >
                <span aria-hidden="true">🔔</span>
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white"
                >
                  3
                </span>
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {activity.map((a, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm text-amber-600"
                  >
                    {a.icon}
                  </span>
                  <div>
                    <p className="text-xs leading-snug text-slate-700">{a.text}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
