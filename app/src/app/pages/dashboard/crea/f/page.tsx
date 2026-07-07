"use client";

import { useEffect, useState } from "react";

type Quest = {
  id: string;
  label: string;
  detail: string;
  progress: number;
  target: number;
  xp: number;
};

type Badge = {
  id: string;
  icon: string;
  label: string;
  desc: string;
  earned: boolean;
};

type Rarity = "일반" | "레어" | "에픽";

type Item = {
  id: string;
  icon: string;
  name: string;
  category: string;
  price: number;
  match: number;
  rarity: Rarity;
};

type LogEntry = {
  id: string;
  text: string;
  time: string;
  positive: boolean;
};

const NAV_ITEMS = [
  { id: "home", icon: "🏠", label: "홈" },
  { id: "recommend", icon: "🧭", label: "추천" },
  { id: "wish", icon: "❤️", label: "찜" },
  { id: "settings", icon: "⚙️", label: "설정" },
] as const;

const QUESTS: Quest[] = [
  {
    id: "q1",
    label: "빈티지 아이템 3건 발견하기",
    detail: "AI 추천 목록에서 빈티지 태그가 붙은 아이템을 확인해보세요.",
    progress: 2,
    target: 3,
    xp: 20,
  },
  {
    id: "q2",
    label: "찜한 상품 1건 구매하기",
    detail: "수집함에 담아둔 아이템을 실제로 득템해보세요.",
    progress: 0,
    target: 1,
    xp: 50,
  },
  {
    id: "q3",
    label: "첫 리뷰 남기기",
    detail: "구매 후기를 남기면 다음 추천 정확도가 올라가요.",
    progress: 1,
    target: 1,
    xp: 15,
  },
];

const BADGES: Badge[] = [
  { id: "b1", icon: "🏅", label: "얼리버드", desc: "가입 첫 주 이용", earned: true },
  { id: "b2", icon: "🔍", label: "가격헌터", desc: "가격 알림 10회 확인", earned: true },
  { id: "b3", icon: "👑", label: "빈티지 마스터", desc: "빈티지 5건 구매", earned: true },
  { id: "b4", icon: "🔥", label: "스트릿 파이터", desc: "3일 연속 접속", earned: true },
  { id: "b5", icon: "💎", label: "에픽 헌터", desc: "에픽 등급 3건 발견", earned: false },
  { id: "b6", icon: "🎯", label: "정확도 마스터", desc: "매칭률 95% 달성", earned: false },
  { id: "b7", icon: "📦", label: "50개 수집가", desc: "찜 목록 50개 달성", earned: false },
];

const ITEMS: Item[] = [
  {
    id: "i1",
    icon: "🧥",
    name: "빈티지 리바이스 데님 자켓",
    category: "아우터",
    price: 68000,
    match: 96,
    rarity: "에픽",
  },
  {
    id: "i2",
    icon: "📷",
    name: "필름카메라 캐논 AE-1",
    category: "테크·취미",
    price: 145000,
    match: 89,
    rarity: "레어",
  },
  {
    id: "i3",
    icon: "🧶",
    name: "오버사이즈 니트 스웨터",
    category: "니트웨어",
    price: 32000,
    match: 91,
    rarity: "레어",
  },
  {
    id: "i4",
    icon: "👕",
    name: "스트릿 그래픽 티셔츠",
    category: "상의",
    price: 15000,
    match: 74,
    rarity: "일반",
  },
];

const ACTIVITY_LOG: LogEntry[] = [
  { id: "l1", text: "'오늘의 추천' 3건 확인", time: "5분 전", positive: true },
  { id: "l2", text: "찜하기 완료 — 오버사이즈 니트 스웨터", time: "32분 전", positive: true },
  { id: "l3", text: "레벨업! Lv.6 → Lv.7", time: "1시간 전", positive: true },
  { id: "l4", text: "가격 하락 알림 — 필름카메라 캐논 AE-1 -12%", time: "3시간 전", positive: false },
  { id: "l5", text: "연속 접속 5일차 달성", time: "어제", positive: true },
];

const WEEK_DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const STREAK_DAYS = 5;
const TODAY_INDEX = 4;

const BASE_COLLECTION = 11;
const LEVEL = 7;
const XP_CURRENT = 340;
const XP_TARGET = 500;
const SAVED_AMOUNT = 128000;
const SAVED_GOAL = 200000;
const MATCH_STAT = 92;

function rarityStyle(rarity: Rarity) {
  switch (rarity) {
    case "에픽":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "레어":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-stone-200 bg-stone-100 text-stone-600";
  }
}

export default function Landing() {
  const [wishedIds, setWishedIds] = useState<Set<string>>(new Set());
  const [claimedQuests, setClaimedQuests] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleWish = (id: string, name: string) => {
    setWishedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setToast(`+5 XP 획득! ${name} 찜 완료`);
      }
      return next;
    });
  };

  const claimQuest = (quest: Quest) => {
    if (claimedQuests.has(quest.id)) return;
    setClaimedQuests((prev) => new Set(prev).add(quest.id));
    setToast(`+${quest.xp} XP 획득! 퀘스트 클리어`);
  };

  const collectionCount = BASE_COLLECTION + wishedIds.size;
  const activeQuestCount = QUESTS.filter((q) => !claimedQuests.has(q.id)).length;
  const xpPct = Math.round((XP_CURRENT / XP_TARGET) * 100);
  const savedPct = Math.round((SAVED_AMOUNT / SAVED_GOAL) * 100);

  return (
    <div
      className="flex min-h-screen bg-stone-50 text-stone-900"
      style={{ fontFamily: '"Pretendard", ui-sans-serif, system-ui, -apple-system, sans-serif' }}
    >
      <style>{`
        @keyframes rp-fade-kf { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .rp-fade { animation: rp-fade-kf 400ms ease-out both; }
        @keyframes rp-pop-kf { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .rp-pop { animation: rp-pop-kf 350ms ease-out both; }
        @keyframes rp-bar-kf { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .rp-bar { transform-origin: left; animation: rp-bar-kf 700ms ease-out both; }
        @keyframes rp-toast-kf { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .rp-toast { animation: rp-toast-kf 220ms ease-out both; }
      `}</style>

      {/* 좌측 네비 (데스크톱) */}
      <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r border-stone-200 bg-white md:flex">
        <div className="px-6 py-6">
          <span className="text-lg font-extrabold tracking-tight text-stone-900">repick</span>
        </div>
        <nav aria-label="주요 메뉴" className="flex-1 px-3">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href="#"
                  aria-current={item.id === "home" ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                    item.id === "home"
                      ? "bg-emerald-900 text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-stone-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
              서
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-stone-800">서연님</p>
              <p className="text-xs text-amber-600">Lv.{LEVEL} 빈티지 헌터</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 모바일 하단 네비 */}
      <nav
        aria-label="주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-stone-200 bg-white md:hidden"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href="#"
            aria-current={item.id === "home" ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-600 ${
              item.id === "home" ? "text-emerald-800" : "text-stone-400"
            }`}
          >
            <span className="text-base" aria-hidden="true">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <main className="flex-1 pb-20 md:ml-56 md:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            서연님, 오늘도 득템하러 가볼까요?
          </h1>
          <p className="mt-1 text-sm text-stone-500">퀘스트를 깨고, 레벨을 올리고, 득템까지 — 오늘의 진행 상황이에요.</p>

          {/* 레벨/XP 히어로 패널 */}
          <section
            aria-label="레벨 및 경험치"
            className="rp-fade mt-6 rounded-3xl border border-stone-200 bg-gradient-to-br from-emerald-900 to-emerald-800 p-6 text-emerald-50 sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-xl font-extrabold text-emerald-950">
                  {LEVEL}
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-emerald-300">LEVEL {LEVEL}</p>
                  <p className="text-lg font-bold text-white">빈티지 헌터</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-950/40 px-4 py-2 text-sm font-semibold text-amber-300">
                <span aria-hidden="true">🔥</span>
                {STREAK_DAYS}일 연속 접속
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-emerald-200">
                <span>다음 레벨까지</span>
                <span>{XP_CURRENT} / {XP_TARGET} XP</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-emerald-950/50">
                <div
                  className="rp-bar h-full rounded-full bg-amber-400"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2" aria-label={`이번 주 접속 현황, ${STREAK_DAYS}일 연속`}>
              {WEEK_DAYS.map((day, i) => (
                <div key={day} className="flex flex-1 flex-col items-center gap-1">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                      i < STREAK_DAYS
                        ? "bg-amber-400 text-emerald-950"
                        : "bg-emerald-950/40 text-emerald-400"
                    } ${i === TODAY_INDEX ? "ring-2 ring-white" : ""}`}
                  >
                    {i < STREAK_DAYS ? "✓" : ""}
                  </span>
                  <span className="text-[10px] text-emerald-300">{day}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 요약 스탯 카드 4개 */}
          <section aria-label="오늘의 요약 스탯" className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">오늘의 퀘스트</span>
                <span aria-hidden="true">🗺️</span>
              </div>
              <p className="text-2xl font-bold text-stone-900">{activeQuestCount}개</p>
              <p className="mt-0.5 text-xs text-stone-400">진행 중</p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">수집함</span>
                <span aria-hidden="true">🎒</span>
              </div>
              <p className="text-2xl font-bold text-stone-900">{collectionCount}개</p>
              <p className="mt-0.5 text-xs text-stone-400">찜한 아이템</p>
            </div>

            <div className="col-span-2 rounded-2xl border border-stone-200 bg-white p-4 sm:col-span-1 sm:p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">절약 골드</span>
                <span aria-hidden="true">💰</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">{SAVED_AMOUNT.toLocaleString()}원</p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                <div className="rp-bar h-full rounded-full bg-amber-500" style={{ width: `${savedPct}%` }} />
              </div>
              <p className="mt-1 text-xs text-stone-400">
                목표 {SAVED_GOAL.toLocaleString()}원까지 {(SAVED_GOAL - SAVED_AMOUNT).toLocaleString()}원
              </p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">감정 스탯</span>
                <span aria-hidden="true">🎯</span>
              </div>
              <p className="text-2xl font-bold text-stone-900">{MATCH_STAT}%</p>
              <p className="mt-0.5 text-xs text-stone-400">추천 매칭률</p>
            </div>
          </section>

          {/* 메인 2단 그리드 */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="flex flex-col gap-6">
              {/* 이번 주 퀘스트 */}
              <section aria-labelledby="quest-heading" className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                <h2 id="quest-heading" className="mb-4 text-base font-bold text-stone-900">
                  이번 주 퀘스트
                </h2>
                <ul className="flex flex-col gap-4">
                  {QUESTS.map((quest, i) => {
                    const done = quest.progress >= quest.target;
                    const claimed = claimedQuests.has(quest.id);
                    const pct = Math.min(100, Math.round((quest.progress / quest.target) * 100));
                    return (
                      <li
                        key={quest.id}
                        className="rp-fade rounded-xl border border-stone-100 bg-stone-50 p-4"
                        style={{ animationDelay: `${i * 90}ms` }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${claimed ? "text-stone-400 line-through" : "text-stone-800"}`}>
                              {quest.label}
                            </p>
                            <p className="mt-0.5 text-xs text-stone-500">{quest.detail}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                            +{quest.xp} XP
                          </span>
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200">
                            <div
                              className={`rp-bar h-full rounded-full ${done ? "bg-emerald-600" : "bg-emerald-400"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="shrink-0 text-xs font-medium text-stone-500">
                            {quest.progress}/{quest.target}
                          </span>
                          {done && !claimed && (
                            <button
                              type="button"
                              onClick={() => claimQuest(quest)}
                              className="shrink-0 rounded-full bg-emerald-900 px-3 py-1 text-xs font-semibold text-white transition-colors duration-150 hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                            >
                              보상 받기
                            </button>
                          )}
                          {claimed && (
                            <span className="shrink-0 text-xs font-semibold text-emerald-700">✓ 수령완료</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* 오늘 발견한 아이템 (AI 추천) */}
              <section aria-labelledby="items-heading" className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 id="items-heading" className="text-base font-bold text-stone-900">
                    오늘 발견한 아이템
                  </h2>
                  <span className="text-xs text-stone-400">AI가 오늘 새로 찾아냈어요</span>
                </div>
                <ul className="flex flex-col gap-3">
                  {ITEMS.map((item, i) => {
                    const wished = wishedIds.has(item.id);
                    return (
                      <li
                        key={item.id}
                        className="rp-fade flex items-center gap-4 rounded-xl border border-stone-100 p-3 sm:p-4"
                        style={{ animationDelay: `${i * 90}ms` }}
                      >
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-2xl" aria-hidden="true">
                          {item.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-1.5">
                            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${rarityStyle(item.rarity)}`}>
                              {item.rarity}
                            </span>
                            <span className="text-[11px] font-medium text-stone-400">매칭 {item.match}%</span>
                          </div>
                          <p className="truncate text-sm font-semibold text-stone-900">{item.name}</p>
                          <p className="text-xs text-stone-400">{item.category}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <p className="text-sm font-bold text-stone-900">{item.price.toLocaleString()}원</p>
                          <button
                            type="button"
                            onClick={() => toggleWish(item.id, item.name)}
                            aria-pressed={wished}
                            aria-label={`${item.name} 찜하기`}
                            className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                              wished
                                ? "border-rose-200 bg-rose-50 text-rose-500"
                                : "border-stone-200 text-stone-400 hover:border-rose-200 hover:text-rose-400"
                            }`}
                          >
                            <span aria-hidden="true">{wished ? "♥" : "♡"}</span>
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>

            {/* 사이드: 배지 + 활동 로그 */}
            <div className="flex flex-col gap-6">
              <section aria-labelledby="badge-heading" className="rounded-2xl border border-stone-200 bg-white p-5">
                <h2 id="badge-heading" className="mb-4 text-base font-bold text-stone-900">
                  배지 컬렉션
                </h2>
                <ul className="grid grid-cols-4 gap-2.5 lg:grid-cols-3">
                  {BADGES.map((badge, i) => (
                    <li key={badge.id} className="rp-pop" style={{ animationDelay: `${i * 60}ms` }}>
                      <div
                        title={`${badge.label} — ${badge.desc}`}
                        className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border text-center ${
                          badge.earned
                            ? "border-amber-200 bg-amber-50"
                            : "border-stone-200 bg-stone-50 opacity-50"
                        }`}
                      >
                        <span className="text-lg" aria-hidden="true">
                          {badge.earned ? badge.icon : "🔒"}
                        </span>
                        <span className="px-1 text-[10px] font-semibold leading-tight text-stone-600">
                          {badge.label}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="log-heading" className="rounded-2xl border border-stone-200 bg-white p-5">
                <h2 id="log-heading" className="mb-4 text-base font-bold text-stone-900">
                  퀘스트 로그
                </h2>
                <ul className="flex flex-col gap-3">
                  {ACTIVITY_LOG.map((log) => (
                    <li key={log.id} className="flex items-start gap-2.5 text-xs">
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] ${
                          log.positive ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
                        }`}
                        aria-hidden="true"
                      >
                        {log.positive ? "▲" : "•"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-stone-700">{log.text}</p>
                        <p className="mt-0.5 text-[11px] text-stone-400">{log.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* 토스트 */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center md:bottom-6 md:right-6 md:left-auto md:justify-end"
      >
        {toast && (
          <div className="rp-toast pointer-events-auto rounded-full bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
