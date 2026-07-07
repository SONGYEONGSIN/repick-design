'use client';

import { useEffect, useState } from 'react';

interface Widget {
  id: string;
  title: string;
  icon: string;
  color: string;
  span: string;
}

const NAV_ITEMS = [
  { label: '홈', icon: '🏠', active: true },
  { label: '추천', icon: '🎯', active: false },
  { label: '찜', icon: '❤️', active: false },
  { label: '설정', icon: '⚙️', active: false },
];

const WIDGETS: Widget[] = [
  {
    id: 'reco',
    title: '오늘의 AI 추천',
    icon: '🎯',
    color: 'bg-violet-100 text-violet-700',
    span: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2',
  },
  {
    id: 'wishlist',
    title: '찜한 아이템',
    icon: '❤️',
    color: 'bg-rose-100 text-rose-700',
    span: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1',
  },
  {
    id: 'savings',
    title: '예상 절약액',
    icon: '💰',
    color: 'bg-amber-100 text-amber-700',
    span: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1',
  },
  {
    id: 'match',
    title: 'AI 매칭률',
    icon: '⚡',
    color: 'bg-emerald-100 text-emerald-700',
    span: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1',
  },
  {
    id: 'activity',
    title: '최근 활동',
    icon: '🕒',
    color: 'bg-sky-100 text-sky-700',
    span: 'col-span-2 row-span-2 md:col-span-1 md:row-span-2',
  },
  {
    id: 'pricetrack',
    title: '가격 추적 중',
    icon: '📉',
    color: 'bg-teal-100 text-teal-700',
    span: 'col-span-2 row-span-1 md:col-span-2 md:row-span-1',
  },
  {
    id: 'notif',
    title: '알림',
    icon: '🔔',
    color: 'bg-orange-100 text-orange-700',
    span: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1',
  },
  {
    id: 'search',
    title: '빠른 검색',
    icon: '🔍',
    color: 'bg-slate-100 text-slate-700',
    span: 'col-span-1 row-span-1 md:col-span-1 md:row-span-1',
  },
];

const DEFAULT_ORDER = WIDGETS.map((w) => w.id);
const DEFAULT_ENABLED: Record<string, boolean> = {
  reco: true,
  wishlist: true,
  savings: true,
  match: true,
  activity: true,
  pricetrack: false,
  notif: true,
  search: false,
};

const STORAGE_KEY = 'repick-dashboard-widgets-e';

const RECO_ITEMS = [
  { name: "나이키 에어포스1 '07", price: '68,000', match: 96 },
  { name: '리바이스 501 오리지널 데님', price: '42,000', match: 94 },
  { name: '아크네 스튜디오 니트', price: '158,000', match: 92 },
  { name: '뉴발란스 990v5', price: '121,000', match: 90 },
];

const ACTIVITY_ITEMS = [
  { time: '09:14', desc: '나이키 에어포스1 조건 일치' },
  { time: '08:52', desc: '리바이스 501 데님 5,000원 하락' },
  { time: '08:30', desc: '아크네 니트 찜 목록에 추가' },
  { time: '07:58', desc: '뉴발란스 990v5 재입고 감지' },
];

const PRICE_ITEMS = [
  { name: '나이키 에어포스1', drop: 12 },
  { name: '리바이스 501 데님', drop: 5 },
  { name: '아크네 니트', drop: 3 },
  { name: '뉴발란스 990v5', drop: 8 },
];

const NOTIF_ITEMS = [
  { label: '가격 하락', count: 3, color: 'bg-orange-500' },
  { label: '신규 매칭', count: 2, color: 'bg-violet-500' },
  { label: '재입고', count: 1, color: 'bg-emerald-500' },
];

function renderWidgetContent(id: string) {
  switch (id) {
    case 'reco':
      return (
        <ul className="flex h-full flex-col justify-between gap-2 overflow-y-auto">
          {RECO_ITEMS.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-900">{item.name}</p>
                <p className="text-xs text-stone-500">{item.price}원</p>
              </div>
              <span className="shrink-0 rounded-full bg-violet-600 px-2 py-1 text-[11px] font-bold text-white">
                {item.match}%
              </span>
            </li>
          ))}
        </ul>
      );
    case 'wishlist':
      return (
        <div className="flex h-full flex-col justify-between">
          <p className="text-3xl font-bold tabular-nums text-stone-900">
            8<span className="ml-1 text-sm font-normal text-stone-400">건</span>
          </p>
          <p className="text-xs font-medium text-rose-600">+2건 오늘</p>
        </div>
      );
    case 'savings':
      return (
        <div className="flex h-full flex-col justify-between">
          <p className="text-2xl font-bold tabular-nums text-stone-900">
            612,400<span className="ml-1 text-sm font-normal text-stone-400">원</span>
          </p>
          <p className="text-xs font-medium text-amber-600">+18% 지난주 대비</p>
        </div>
      );
    case 'match':
      return (
        <div className="flex h-full items-center gap-3">
          <div
            className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'conic-gradient(#059669 0% 91%, #d1fae5 91% 100%)' }}
            aria-hidden="true"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-700">
              91%
            </div>
          </div>
          <p className="text-xs leading-relaxed text-stone-500">
            지난주보다
            <br />
            <span className="font-semibold text-emerald-600">+3%p</span> 상승
          </p>
        </div>
      );
    case 'activity':
      return (
        <ul className="flex h-full flex-col gap-2.5 overflow-y-auto text-xs">
          {ACTIVITY_ITEMS.map((a) => (
            <li key={a.time} className="border-l-2 border-sky-200 pl-3">
              <p className="tabular-nums text-stone-400">{a.time}</p>
              <p className="text-stone-700">{a.desc}</p>
            </li>
          ))}
        </ul>
      );
    case 'pricetrack':
      return (
        <div className="flex h-full flex-col justify-center gap-2.5">
          {PRICE_ITEMS.map((p) => (
            <div key={p.name} className="flex items-center gap-2 text-xs">
              <span className="w-28 shrink-0 truncate text-stone-600">{p.name}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-teal-100">
                <div
                  className="h-full rounded-full bg-teal-600"
                  style={{ width: `${p.drop * 6}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-semibold text-teal-700">
                -{p.drop}%
              </span>
            </div>
          ))}
        </div>
      );
    case 'notif':
      return (
        <ul className="flex h-full flex-col justify-center gap-2 text-xs">
          {NOTIF_ITEMS.map((n) => (
            <li key={n.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-stone-600">
                <span className={`h-2 w-2 rounded-full ${n.color}`} aria-hidden="true" />
                {n.label}
              </span>
              <span className="font-bold text-stone-900">{n.count}건</span>
            </li>
          ))}
        </ul>
      );
    case 'search':
      return (
        <div className="flex h-full flex-col justify-center gap-2">
          <input
            type="search"
            placeholder="브랜드, 카테고리 검색"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700 placeholder:text-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          />
          <div className="flex flex-wrap gap-1.5">
            {['빈티지', '스트리트', '데님'].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function Landing() {
  const [order, setOrder] = useState<string[]>(DEFAULT_ORDER);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(DEFAULT_ENABLED);
  const [editing, setEditing] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { order?: string[]; enabled?: Record<string, boolean> };
        if (Array.isArray(parsed.order) && parsed.order.length === DEFAULT_ORDER.length) {
          setOrder(parsed.order);
        }
        if (parsed.enabled && typeof parsed.enabled === 'object') {
          setEnabled(parsed.enabled);
        }
      }
    } catch {
      // 저장된 설정을 불러오지 못해도 기본값으로 동작합니다.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ order, enabled }));
    } catch {
      // 저장 실패 시에도 현재 세션의 화면 구성은 유지됩니다.
    }
  }, [order, enabled, loaded]);

  function removeWidget(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: false }));
  }

  function addWidget(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: true }));
  }

  function resetDefaults() {
    setOrder(DEFAULT_ORDER);
    setEnabled(DEFAULT_ENABLED);
  }

  function handleDrop(targetId: string) {
    setOrder((prev) => {
      if (!draggedId || draggedId === targetId) return prev;
      const next = prev.filter((id) => id !== draggedId);
      const idx = next.indexOf(targetId);
      next.splice(idx, 0, draggedId);
      return next;
    });
    setDraggedId(null);
  }

  function moveWidget(id: string, direction: -1 | 1) {
    setOrder((prev) => {
      const visibleIds = prev.filter((wid) => enabled[wid]);
      const pos = visibleIds.indexOf(id);
      const swapWith = visibleIds[pos + direction];
      if (!swapWith) return prev;
      const next = [...prev];
      const i = next.indexOf(id);
      const j = next.indexOf(swapWith);
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  const visibleWidgets = order
    .filter((id) => enabled[id])
    .map((id) => WIDGETS.find((w) => w.id === id))
    .filter((w): w is Widget => Boolean(w));

  const hiddenWidgets = order
    .filter((id) => !enabled[id])
    .map((id) => WIDGETS.find((w) => w.id === id))
    .filter((w): w is Widget => Boolean(w));

  const enabledCount = visibleWidgets.length;

  return (
    <>
      <style>{`
        @keyframes widget-wiggle {
          0%, 100% { transform: rotate(-0.5deg); }
          50% { transform: rotate(0.5deg); }
        }
        .widget-editing { animation: widget-wiggle 0.28s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .widget-editing { animation: none; }
        }
      `}</style>

      <div className="min-h-screen bg-stone-100 text-stone-900">
        <div className="flex min-h-screen flex-col md:flex-row">
          {/* 모바일 상단 네비 */}
          <nav
            aria-label="주요 메뉴"
            className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 md:hidden"
          >
            <span className="flex items-center gap-2 text-base font-bold text-stone-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white">
                R
              </span>
              repick
            </span>
            <ul className="flex gap-1 text-xs font-medium">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    aria-current={item.active ? 'page' : undefined}
                    className={`rounded-full px-3 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${
                      item.active
                        ? 'bg-violet-600 text-white'
                        : 'text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 데스크톱 좌측 네비 */}
          <nav
            aria-label="주요 메뉴"
            className="hidden w-56 shrink-0 flex-col border-r border-stone-200 bg-white px-4 py-6 md:flex"
          >
            <div className="mb-8 flex items-center gap-2 px-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white">
                R
              </span>
              <span className="text-lg font-bold tracking-tight text-stone-900">repick</span>
            </div>
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    aria-current={item.active ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${
                      item.active
                        ? 'bg-violet-50 text-violet-700'
                        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                    }`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto rounded-2xl bg-stone-50 px-3 py-3">
              <p className="text-xs text-stone-400">로그인 계정</p>
              <p className="mt-0.5 text-sm font-semibold text-stone-800">songyuseong</p>
              <p className="mt-1 text-xs font-semibold text-violet-600">PRO 플랜</p>
            </div>
          </nav>

          {/* 메인 */}
          <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-violet-600">안녕하세요, 승우님</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
                  나만의 대시보드
                </h1>
                <p className="mt-2 text-sm text-stone-500">
                  위젯 {enabledCount}개 표시 중 · 편집 모드에서 켜고 끄고 순서를 바꿔보세요
                </p>
              </div>
              <div className="flex items-center gap-2">
                {editing && (
                  <button
                    type="button"
                    onClick={resetDefaults}
                    className="rounded-full px-3 py-2 text-xs font-medium text-stone-400 underline decoration-dotted underline-offset-2 hover:text-stone-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                  >
                    기본값으로 초기화
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setEditing((v) => !v)}
                  aria-pressed={editing}
                  className={
                    editing
                      ? 'rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600'
                      : 'rounded-full border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600'
                  }
                >
                  {editing ? '완료 ✓' : '대시보드 편집 ✏️'}
                </button>
              </div>
            </div>

            <p aria-live="polite" className="sr-only">
              {editing
                ? '편집 모드입니다. 위젯을 끄거나 순서를 바꿀 수 있어요.'
                : `${enabledCount}개 위젯이 표시되고 있습니다.`}
            </p>

            <ul className="grid list-none grid-flow-row-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {visibleWidgets.map((w) => (
                <li key={w.id} className={w.span}>
                  <article
                    draggable={editing}
                    onDragStart={() => setDraggedId(w.id)}
                    onDragEnd={() => setDraggedId(null)}
                    onDragOver={(e) => {
                      if (editing) e.preventDefault();
                    }}
                    onDrop={() => handleDrop(w.id)}
                    className={`relative flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm transition ${
                      editing
                        ? 'widget-editing cursor-grab border-2 border-dashed border-violet-300 active:cursor-grabbing'
                        : 'border border-stone-200'
                    } ${draggedId === w.id ? 'opacity-40' : ''}`}
                  >
                    {editing && (
                      <>
                        <button
                          type="button"
                          onClick={() => removeWidget(w.id)}
                          aria-label={`${w.title} 위젯 제거`}
                          className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow-md transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                        >
                          ×
                        </button>
                        <div className="absolute -right-1 -top-1 flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveWidget(w.id, -1)}
                            aria-label={`${w.title} 순서를 앞으로 이동`}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 bg-white text-[10px] text-stone-600 shadow-sm hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                          >
                            ◀
                          </button>
                          <button
                            type="button"
                            onClick={() => moveWidget(w.id, 1)}
                            aria-label={`${w.title} 순서를 뒤로 이동`}
                            className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 bg-white text-[10px] text-stone-600 shadow-sm hover:bg-stone-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                          >
                            ▶
                          </button>
                        </div>
                      </>
                    )}
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg ${w.color}`}
                        aria-hidden="true"
                      >
                        {w.icon}
                      </span>
                      <h2 className="text-sm font-bold text-stone-900">{w.title}</h2>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto">{renderWidgetContent(w.id)}</div>
                  </article>
                </li>
              ))}
            </ul>

            {editing && hiddenWidgets.length > 0 && (
              <section
                aria-label="위젯 추가"
                className="mt-6 rounded-3xl border-2 border-dashed border-stone-300 bg-white/60 p-5"
              >
                <h2 className="text-sm font-bold text-stone-700">+ 위젯 추가하기</h2>
                <p className="mt-1 text-xs text-stone-500">
                  숨겨진 위젯입니다. 눌러서 대시보드에 다시 추가하세요.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {hiddenWidgets.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => addWidget(w.id)}
                      className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-xl text-base ${w.color}`}
                        aria-hidden="true"
                      >
                        {w.icon}
                      </span>
                      {w.title}
                      <span className="text-violet-600" aria-hidden="true">
                        +
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <p className="mt-10 text-center text-xs text-stone-400">
              © repick — 나만의 대시보드 구성은 이 브라우저에 자동으로 저장됩니다
            </p>
          </main>
        </div>
      </div>
    </>
  );
}
