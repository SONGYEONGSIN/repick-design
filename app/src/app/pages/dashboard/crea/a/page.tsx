"use client";

import { useEffect, useRef, useState } from "react";

type NoteId = 1 | 2 | 3;

const recommendations = [
  {
    id: "jacket",
    name: "빈티지 가죽 자켓",
    category: "여성 아우터",
    reason: "저장한 스타일과 87% 일치해요",
    price: 68000,
  },
  {
    id: "turntable",
    name: "오디오테크니카 턴테이블",
    category: "가전 · 음향",
    reason: "관심 카테고리 상위 매물이에요",
    price: 145000,
  },
  {
    id: "lamp",
    name: "미니멀 원목 스탠드조명",
    category: "가구 · 조명",
    reason: "최근 검색어와 연관이 있어요",
    price: 22000,
  },
];

const activity = [
  { time: "3시간 전", text: "새 매칭 3건이 도착했어요" },
  { time: "어제 21:40", text: "빈티지 가죽 자켓 가격이 12% 내려갔어요" },
  { time: "어제 09:15", text: "취향 학습이 업데이트됐어요 (누적 47회)" },
  { time: "2일 전", text: "오디오테크니카 턴테이블 판매자가 메시지를 보냈어요" },
];

const navItems = [
  { label: "홈", icon: "⌂", active: true },
  { label: "추천", icon: "✦", active: false },
  { label: "찜", icon: "♡", active: false },
  { label: "설정", icon: "⚙", active: false },
];

const summary = [
  { label: "이번 달 매칭", value: "24건" },
  { label: "확인한 매칭", value: "18건" },
  { label: "누적 절약액", value: "132,000원" },
  { label: "매칭률", value: "78%" },
];

function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export default function Landing() {
  const [ready, setReady] = useState(false);
  const [greeting, setGreeting] = useState("안녕하세요");
  const [activeNote, setActiveNote] = useState<NoteId | null>(null);
  const noteRefs = useRef<Record<NoteId, HTMLDivElement | null>>({
    1: null,
    2: null,
    3: null,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    const next =
      hour < 11 ? "좋은 아침이에요" : hour < 18 ? "좋은 오후예요" : "좋은 저녁이에요";
    const timer = window.setTimeout(() => {
      setGreeting(next);
      setReady(true);
    }, 550);
    return () => window.clearTimeout(timer);
  }, []);

  function goToNote(id: NoteId) {
    setActiveNote(id);
    noteRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col justify-between border-r border-stone-200 bg-white px-5 py-6 md:flex">
        <div>
          <div className="mb-8 flex items-center gap-2 px-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
              r
            </span>
            <span className="text-base font-semibold tracking-tight">repick</span>
          </div>
          <nav aria-label="주요 메뉴" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                aria-current={item.active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  item.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <span aria-hidden="true" className="w-4 text-center">
                  {item.icon}
                </span>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-stone-200 px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
            민
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-stone-900">민준님</p>
            <p className="text-xs text-stone-500">Pro 멤버십</p>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-xs font-bold text-white">
            r
          </span>
          <span className="text-sm font-semibold">repick</span>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
          민
        </span>
      </header>

      <main className="flex min-w-0 flex-1 flex-col gap-6 px-4 pt-20 pb-24 md:ml-60 md:flex-row md:px-8 md:pt-10 md:pb-10">
        <div className="min-w-0 flex-1 space-y-6">
          {/* Briefing card */}
          <section
            id="briefing"
            aria-labelledby="briefing-heading"
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8"
          >
            <p className="mb-1 text-xs font-medium text-stone-400">오늘의 브리핑</p>
            <h1
              id="briefing-heading"
              className="text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl"
            >
              {greeting}, 민준님
            </h1>

            <div aria-live="polite" className="mt-4">
              {!ready ? (
                <div className="space-y-2.5" aria-label="브리핑을 준비하고 있어요">
                  <div className="h-4 w-11/12 animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-stone-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200" />
                </div>
              ) : (
                <p className="max-w-2xl text-base leading-8 text-stone-700">
                  밤사이 취향에 맞는 매물이 3건 새로 들어왔어요
                  <sup className="ml-0.5">
                    <button
                      type="button"
                      onClick={() => goToNote(1)}
                      aria-label="근거 1: 오늘의 AI 추천 보기"
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                      1
                    </button>
                  </sup>
                  . 그중 빈티지 가죽 자켓은 어제보다 12% 저렴해졌고
                  <sup className="ml-0.5">
                    <button
                      type="button"
                      onClick={() => goToNote(2)}
                      aria-label="근거 2: 가격 하락 상세 보기"
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-[10px] font-semibold text-amber-700 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                      2
                    </button>
                  </sup>
                  , 찜해두신 원목 사이드테이블은 오늘 자정에 마감돼요
                  <sup className="ml-0.5">
                    <button
                      type="button"
                      onClick={() => goToNote(3)}
                      aria-label="근거 3: 마감 임박 상품 보기"
                      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-rose-100 text-[10px] font-semibold text-rose-700 hover:bg-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      3
                    </button>
                  </sup>
                  . 지금 확인하면 놓치지 않을 수 있어요.
                </p>
              )}
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-stone-100 pt-5 sm:grid-cols-4">
              {summary.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs text-stone-500">{s.label}</dt>
                  <dd className="mt-0.5 font-mono text-lg font-semibold text-stone-900">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Evidence cards */}
          <section aria-labelledby="evidence-heading" className="space-y-4">
            <h2 id="evidence-heading" className="text-sm font-semibold text-stone-500">
              브리핑 근거
            </h2>

            {/* Note 1 */}
            <div
              ref={(el) => {
                noteRefs.current[1] = el;
              }}
              className={`rounded-2xl border bg-white p-5 transition-shadow ${
                activeNote === 1
                  ? "border-emerald-300 ring-2 ring-emerald-500 ring-offset-2 ring-offset-stone-50"
                  : "border-stone-200"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-700">
                  1
                </span>
                <h3 className="text-sm font-semibold text-stone-900">오늘의 AI 추천</h3>
              </div>
              <ul className="divide-y divide-stone-100">
                {recommendations.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900">{item.name}</p>
                      <p className="truncate text-xs text-stone-500">
                        {item.category} · {item.reason}
                      </p>
                    </div>
                    <p className="shrink-0 font-mono text-sm font-semibold text-stone-900">
                      {formatWon(item.price)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Note 2 */}
            <div
              ref={(el) => {
                noteRefs.current[2] = el;
              }}
              className={`rounded-2xl border bg-white p-5 transition-shadow ${
                activeNote === 2
                  ? "border-amber-300 ring-2 ring-amber-500 ring-offset-2 ring-offset-stone-50"
                  : "border-stone-200"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[11px] font-semibold text-amber-700">
                  2
                </span>
                <h3 className="text-sm font-semibold text-stone-900">가격이 내려갔어요</h3>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900">빈티지 가죽 자켓</p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    판매자가 어제 21:40에 가격을 내렸어요
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-xs text-stone-400 line-through">77,000원</p>
                  <p className="font-mono text-base font-semibold text-amber-600">
                    68,000원 · -12%
                  </p>
                </div>
              </div>
            </div>

            {/* Note 3 */}
            <div
              ref={(el) => {
                noteRefs.current[3] = el;
              }}
              className={`rounded-2xl border bg-white p-5 transition-shadow ${
                activeNote === 3
                  ? "border-rose-300 ring-2 ring-rose-500 ring-offset-2 ring-offset-stone-50"
                  : "border-stone-200"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-[11px] font-semibold text-rose-700">
                  3
                </span>
                <h3 className="text-sm font-semibold text-stone-900">마감이 임박했어요</h3>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900">원목 원형 사이드테이블</p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    찜한 12명 중 3명 이내로 판매될 가능성이 높아요
                  </p>
                </div>
                <p className="shrink-0 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                  오늘 자정 마감
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right column: activity */}
        <aside aria-label="최근 활동" className="w-full shrink-0 space-y-4 md:w-72">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-stone-500">최근 활동</h2>
            <ol className="space-y-4">
              {activity.map((a) => (
                <li key={a.time + a.text} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-stone-400">{a.time}</p>
                    <p className="text-sm text-stone-700">{a.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <a
            href="#briefing"
            className="block rounded-2xl border border-stone-200 bg-white px-5 py-4 text-center text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            ↑ 브리핑으로 돌아가기
          </a>
        </aside>
      </main>

      {/* Mobile bottom nav */}
      <nav
        aria-label="주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-around border-t border-stone-200 bg-white/95 py-2 backdrop-blur md:hidden"
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            aria-current={item.active ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              item.active ? "text-emerald-700" : "text-stone-400"
            }`}
          >
            <span aria-hidden="true" className="text-base leading-none">
              {item.icon}
            </span>
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
