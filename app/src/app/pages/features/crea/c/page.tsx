"use client";

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

type Tone = "warn" | "danger" | "muted";

const TONE_CLASSES: Record<Tone, string> = {
  warn: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  muted: "bg-neutral-200 text-neutral-500",
};

const MANUAL_LISTINGS: { title: string; price: string; tag: string; tone: Tone }[] = [
  { title: "무선 이어폰 (박스만 있음)", price: "89,000원", tag: "상태 불명", tone: "warn" },
  { title: "에어팟 프로 급처합니다", price: "110,000원", tag: "가격 이상", tone: "danger" },
  { title: "블루투스 이어폰 새제품", price: "45,000원", tag: "판매자 미확인", tone: "warn" },
  { title: "무선이어폰팝니다급함", price: "가격문의", tag: "설명 없음", tone: "warn" },
  { title: "노이즈캔슬링 이어폰", price: "95,000원", tag: "3일째 끌올", tone: "muted" },
];

const FEATURES = [
  {
    n: "01",
    icon: "🧠",
    lead: "취향 학습",
    title: "검색할수록, 나를 더 알아갑니다",
    desc: "찜하고 클릭하고 구매한 흔적을 repick이 조용히 지켜봅니다. 필터를 처음부터 다시 맞출 필요가 없어요.",
    manual: [
      "매번 사이즈·브랜드·가격대 새로 입력",
      "어제 걸러낸 매물이 오늘 또 뜸",
      "내 취향은 오직 내 머릿속에만 있음",
    ],
    ai: [
      "찜 3개면 취향 학습 시작",
      "클릭 패턴으로 자동 필터링",
      "검색할수록 추천이 더 정확해짐",
    ],
  },
  {
    n: "02",
    icon: "🎯",
    lead: "AI 매칭",
    title: "5,000개 중에서, 이미 골라놨어요",
    desc: "수만 개 매물을 새벽마다 훑어 상위 1%만 남깁니다. 스크롤 대신 선택만 하면 됩니다.",
    manual: [
      "키워드 하나로 뜨는 매물 수천 개",
      "정렬 기준은 최신순 아니면 가격순뿐",
      "스크롤 300번, 그래도 다 못 봄",
    ],
    ai: [
      "취향 일치 상위 1%만 자동 선별",
      "매칭률 순으로 자동 정렬",
      "스크롤 3번이면 끝",
    ],
  },
  {
    n: "03",
    icon: "🛡️",
    lead: "신뢰 검증",
    title: "판매자 말고, 데이터를 믿으세요",
    desc: "상태·가격·판매자 이력을 교차 검증해 위험한 매물은 추천되기 전에 걸러냅니다.",
    manual: [
      "상태 설명은 판매자 말이 전부",
      "프로필 사진 하나로 신뢰도 판단",
      "직거래 리스크는 오롯이 내 몫",
    ],
    ai: [
      "사진·설명 교차 검증으로 상태 등급 산출",
      "판매 이력·응답률로 신뢰 스코어링",
      "위험 매물은 추천 전에 미리 제외",
    ],
  },
  {
    n: "04",
    icon: "⚡",
    lead: "실시간 알림",
    title: "새로고침 대신, 알림이 옵니다",
    desc: "가격이 내려가거나 딱 맞는 매물이 올라오는 순간, 남들보다 먼저 알려드립니다.",
    manual: [
      "하루 10번 넘게 습관적으로 새로고침",
      "눈여겨보던 매물, 알아챘을 땐 이미 판매완료",
      "늦게 안 정보는 정보가 아님",
    ],
    ai: [
      "가격 하락 즉시 알림 발송",
      "새 매칭 뜨는 순간 푸시 알림",
      "남들보다 먼저 보고, 먼저 잡음",
    ],
  },
];

function SplitCompare() {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [pos, setPos] = useState(50);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, ratio)));
  }, []);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      containerRef.current?.setPointerCapture(e.pointerId);
      updateFromClientX(e.clientX);
    },
    [updateFromClientX],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      updateFromClientX(e.clientX);
    },
    [updateFromClientX],
  );

  const stopDragging = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (containerRef.current?.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      setPos((p) => Math.max(0, p - 5));
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      setPos((p) => Math.min(100, p + 5));
      e.preventDefault();
    } else if (e.key === "Home") {
      setPos(0);
      e.preventDefault();
    } else if (e.key === "End") {
      setPos(100);
      e.preventDefault();
    }
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        className="relative h-[440px] w-full touch-none overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm select-none sm:h-[500px] md:h-[540px]"
      >
        {/* base layer: repick AI (always full width) */}
        <div className="absolute inset-0 flex flex-col gap-3 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 p-4 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <span aria-hidden="true">✨</span> repick AI 추천
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
                매칭 94%
              </span>
              <span className="font-mono text-xs text-neutral-400">3초 전</span>
            </div>
            <p className="mt-3 text-base font-semibold text-neutral-900 sm:text-lg">
              노이즈캔슬링 무선이어폰 A급
            </p>
            <p className="mt-1 text-lg font-bold text-neutral-900">92,000원</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
              <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                ✓ 상태 검증완료
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                ✓ 인증 판매자
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                ✓ 거래 32회
              </span>
            </div>
          </div>
          <div className="hidden rounded-xl border border-emerald-100 bg-white/60 p-4 text-sm text-neutral-400 sm:block">
            다음 추천은 새 매물이 올라오면 바로 알려드려요
          </div>
          <div className="mt-auto flex flex-col gap-1 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono">3초 매칭 · 매칭률 94%</span>
            <span>판매자 인증 완료</span>
          </div>
        </div>

        {/* clipped layer: manual search */}
        <div
          className="absolute inset-0 z-10 flex flex-col gap-2 bg-neutral-50 p-4 sm:p-6"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
            <span aria-hidden="true">🔍</span> 직접 검색 중… &quot;무선 이어폰&quot;
          </div>
          <div className="flex-1 space-y-1.5 overflow-hidden">
            {MANUAL_LISTINGS.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-neutral-700">{item.title}</p>
                  <p className="text-neutral-400">{item.price}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${TONE_CLASSES[item.tone]}`}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-1 rounded-lg bg-neutral-800 px-4 py-3 text-sm font-medium text-white sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono">3시간 12분 경과 · 47개 확인</span>
            <span>마음에 드는 것 0개</span>
          </div>
        </div>

        {/* divider + handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
          style={{ left: `${pos}%` }}
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label="직접 검색과 repick AI 비교 슬라이더"
            aria-orientation="horizontal"
            aria-valuenow={Math.round(pos)}
            aria-valuemin={0}
            aria-valuemax={100}
            onKeyDown={handleKeyDown}
            className="pointer-events-auto absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span aria-hidden="true">◀▶</span>
          </div>
        </div>

        <span className="pointer-events-none absolute top-3 left-3 z-30 rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-medium text-white">
          직접 검색
        </span>
        <span className="pointer-events-none absolute top-3 right-3 z-30 rounded-full bg-emerald-600/90 px-3 py-1 text-xs font-medium text-white">
          repick AI
        </span>
      </div>
      <p className="mt-3 text-center text-sm text-neutral-500">
        ← 드래그하거나 화살표 키로 비교해보세요 →
      </p>
    </div>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 py-4 sm:px-4">
      <p className="font-mono text-base font-bold text-neutral-900 sm:text-lg">{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{label}</p>
    </div>
  );
}

function MiniCompare({ manual, ai }: { manual: string[]; ai: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
        <p className="mb-3 text-xs font-semibold tracking-wide text-amber-700 uppercase">
          직접 검색
        </p>
        <ul className="space-y-2 text-sm text-neutral-700">
          {manual.map((line) => (
            <li key={line} className="flex gap-2">
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-amber-500">
                ✕
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 sm:p-5">
        <p className="mb-3 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
          repick AI
        </p>
        <ul className="space-y-2 text-sm text-neutral-700">
          {ai.map((line) => (
            <li key={line} className="flex gap-2">
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-600">
                ✓
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-bold tracking-tight">repick</span>
          <nav aria-label="주요" className="hidden items-center gap-6 text-sm text-neutral-500 sm:flex">
            <span className="font-semibold text-neutral-900">기능</span>
            <span>요금제</span>
            <span>대시보드</span>
          </nav>
          <button
            type="button"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            무료로 시작하기
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold text-emerald-600">Features</p>
            <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
              왼쪽은 3시간, 오른쪽은 3초
            </h1>
            <p className="mt-4 text-base text-neutral-500 sm:text-lg">
              같은 무선 이어폰을 찾는 두 가지 방법. 슬라이더를 움직여서 &quot;직접 검색&quot;과
              &quot;repick AI&quot;의 차이를 직접 확인해보세요.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <SplitCompare />
            <div className="mx-auto mt-6 grid max-w-3xl grid-cols-3 divide-x divide-neutral-200 rounded-xl border border-neutral-200 bg-white text-center">
              <StatCell value="3시간→3초" label="평균 매칭 시간" />
              <StatCell value="47개→1개" label="직접 확인해야 할 매물" />
              <StatCell value="0%→94%" label="마음에 드는 매물 발견율" />
            </div>
          </div>
        </section>

        {/* Feature sections */}
        {FEATURES.map((f, i) => (
          <section key={f.n} className={i % 2 === 1 ? "bg-neutral-50" : "bg-white"}>
            <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-18">
              <div className="mx-auto max-w-2xl text-center">
                <p className="flex items-center justify-center gap-2 font-mono text-sm font-semibold text-emerald-600">
                  <span aria-hidden="true">{f.icon}</span>
                  {f.n} · {f.lead}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                  {f.title}
                </h2>
                <p className="mt-3 text-sm text-neutral-500 sm:text-base">{f.desc}</p>
              </div>
              <div className="mx-auto mt-8 max-w-3xl">
                <MiniCompare manual={f.manual} ai={f.ai} />
              </div>
            </div>
          </section>
        ))}

        {/* Final CTA */}
        <section className="border-t border-neutral-200 bg-neutral-900">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
            <h2 className="text-2xl font-bold text-balance text-white sm:text-3xl">
              슬라이더는 이미 오른쪽을 가리키고 있어요
            </h2>
            <p className="mt-3 text-sm text-neutral-400 sm:text-base">
              직접 뒤지는 3시간 대신, repick AI가 골라준 3초를 선택하세요.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                className="w-full rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:w-auto"
              >
                무료로 시작하기
              </button>
              <button
                type="button"
                className="w-full rounded-lg border border-neutral-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:w-auto"
              >
                요금제 보기
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-neutral-400 sm:flex-row sm:px-6">
          <span>© 2026 repick</span>
          <span>AI가 고른 중고, 사람이 확인한 신뢰</span>
        </div>
      </footer>
    </div>
  );
}
